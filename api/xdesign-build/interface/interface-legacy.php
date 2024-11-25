<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_legacy  extends interface_push{
    function __construct() {                        
        
        parent::__construct();         
        
         
    }

    function fn_initialize(){

        parent::fn_initialize();   

         //must remain at the top , to allow valid statements to run (blnPreventQuery is false)
         $this->obj_paramQuery=new stdClass;
         $this->obj_paramQuery->bln_hasSearchPin=false;
         $this->obj_paramQuery->str_sql="";                
         $this->obj_paramQuery->arr_sql=[]; 
         //must remain at the top , to allow valid statements to run (blnPreventQuery is false)   
    }
    function fn_legacyRunSQLStatement($bln_getCountOnly=false){



        if(empty($this->str_sqlStatement)){
            $this->fn_setError("this->str_sqlStatement is empty, return");
            return;
        }   
        
        $this->obj_post->RowCount=0;                

        $bln_runCount=false;
        if(!empty($this->str_sqlStatementCount)){                                            
            $bln_runCount=true;
        }               
        
        if($this->obj_post->ModeNewRecord){
            $bln_runCount=false;
        }

        

        if($bln_runCount){                                            
            $this->str_sqlStatementCount=$this->fn_interfaceReplaceSessionCodes($this->str_sqlStatementCount);                    
            $this->obj_post->RowCount=$this->fn_fetchCount($this->str_sqlStatementCount, $this->arr_param);                                                     
        }
        if($bln_getCountOnly){
            return;
        }
        else{        
            
            $this->str_sqlStatement=$this->fn_interfaceReplaceSessionCodes($this->str_sqlStatement);                
            //$this->fn_varDump($this->str_sqlStatement, "PREPARE SQL STATEMENT", true);

            //$this->fn_varDump("LEGACY SQL STATEMENT", "COMMENT", true);       
        
            $stmt = $this->fn_executeSQLStatement($this->str_sqlStatement, $this->arr_param);
            $this->stmt=$stmt;

            
            
            try{            
                
                $arr_rows=$stmt->fetchAll();     
                

                $this->arr_rows=false;
                $this->arr_row=false;
                if(!empty($arr_rows)){                
                    
                    $this->arr_rows=$arr_rows;
                    $this->arr_row=$arr_rows[0];
                    $this->obj_post->RowData=json_encode($arr_rows);                                
                }

                

                
                $this->fn_getStatementMeta($stmt);                                    

                

        
            }
            catch (PDOException $e) {                   
                global $obj_page;
                $obj_page->fn_setError($e->getMessage());
                exit;
            }
        }        
        
        
        
        $this->fn_resetStatement();

        /*
        if($this->bln_debugAction){
            //$this->fn_addEcho("DebugAction, return");                      
            exit;            
        }                                
        //*/

        //$this->fn_varDump($arr_rows, "arr_rows" , true);

        return $arr_rows;     
    }

        
    function fn_resetStatement(){

        $this->arr_param=[];                   
        $this->str_sqlStatement="";        
        $this->str_sqlStatementCount="";        
    }

    function fn_getStatementMeta($stmt){        
        
        $int_columnCount=$stmt->columnCount();            
        $int_rowCount=$stmt->rowCount();                 
        
        $arr_metaColumn=$this->arr_metaColumn;                        

        $int_metaColumn=count($arr_metaColumn);        

        for($i=0;$i<$int_columnCount;$i++) {                                                                       
            
            if($int_metaColumn<$int_columnCount){
                $obj_metaColumn=new metaColumn();                                
                array_push($arr_metaColumn, $obj_metaColumn);
            }            
            else{
                $obj_metaColumn=$arr_metaColumn[$i];
            }              
            
            $obj_metaColumn->arr_metaColumnPDO=$arr_metaColumnPDO=$stmt->getColumnMeta($i);                                    
        }                          
        
        $this->obj_post->MetaColumn=json_encode($arr_metaColumn);
    } 

      
}//END OF CLASS


?>