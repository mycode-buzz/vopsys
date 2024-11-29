<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainForm extends maintainXapp{

    function fn_maintainForm(){                 
    }
    function fn_form_add_group($int_idMetaRowz){                
        $this->fn_addMessage("fn_form_add_group: ".$int_idMetaRowz);    
    }
    
    function fn_form_gap($int_idMetaColumn){                

        //$this->fn_addMessage("1 int_idMetaColumn: ".$int_idMetaColumn);    

        exit;
        $this->fn_normaliseFormOrder($int_idMetaColumn);        

        //$this->fn_addMessage("2 int_idMetaColumn: ".$int_idMetaColumn);    
        
        //*        
        $arr_row=$this->fn_getFormLine($int_idMetaColumn);
        $FormOrder=$arr_row["FormOrder"];  
        

        $str_sql="UPDATE `meta_column`.`meta_column` 
        SET `FormOrder`=`FormOrder`+10
        WHERE TRUE            
        AND `MetaColumnSystemId`=:MetaColumnSystemId        
        AND `MetaSchemaName`=:MetaSchemaName
        AND `MetaTableName`=:MetaTableName
        AND `FormOrder`>$FormOrder        
        ;";                
        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'MetaColumnSystemId'=>$arr_row["MetaColumnSystemId"],   
            'MetaViewId'=>$arr_row["MetaViewId"],  
            'MetaSchemaName'=>$arr_row["MetaSchemaName"],  
            'MetaTableName'=>$arr_row["MetaTableName"]
        ]);
        //*/
    }
    function xfn_form_moveup($int_idMetaColumn){                

        $this->MetaColumnIdBefore=0;

        //*
        $this->fn_normaliseFormOrder($int_idMetaColumn);        
        
        $str_sql="UPDATE `meta_column`.`meta_column` 
        SET `FormOrder`=IF(`FormOrder`>0, `FormOrder`-1, `FormOrder`)        
        WHERE TRUE                    
        AND `MetaColumnId`=:MetaColumnId                
        ;";
        $stmt=$this->fn_executeSQLStatement($str_sql, [            
            'MetaColumnId'=>$int_idMetaColumn            
        ]);
    
        if(!empty($this->MetaColumnIdBefore)){
            $str_sql="UPDATE `meta_column`.`meta_column` 
            SET `FormOrder`=`FormOrder`-6        
            WHERE TRUE                    
            AND `MetaColumnId`=:MetaColumnId                
            ;";                
            $stmt=$this->fn_executeSQLStatement($str_sql, [            
                'MetaColumnId'=>$this->MetaColumnIdBefore            
            ]);                        
        }

        $this->fn_normaliseFormOrder($int_idMetaColumn);                
        
    }    

    function xfn_form_movedown($int_idMetaColumn){                

        $this->MetaColumnIdAfter=0;

        
        $this->fn_normaliseFormOrder($int_idMetaColumn);                
        
        $str_sql="UPDATE `meta_column`.`meta_column` 
        SET `FormOrder`=`FormOrder`+6  
        WHERE TRUE                    
        AND `MetaColumnId`=:MetaColumnId                
        ;";                
        $stmt=$this->fn_executeSQLStatement($str_sql, [            
            'MetaColumnId'=>$int_idMetaColumn
        ]);            
        
        
    
        if(!empty($this->MetaColumnIdAfter)){

            $str_sql="UPDATE `meta_column`.`meta_column` 
            SET `FormOrder`=IF(`FormOrder`>0, `FormOrder`-1, `FormOrder`)        
            WHERE TRUE                    
            AND `MetaColumnId`=:MetaColumnId                
            ;";
            $stmt=$this->fn_executeSQLStatement($str_sql, [            
                'MetaColumnId'=>$this->MetaColumnIdAfter
            ]);
        }

        $this->fn_normaliseFormOrder($int_idMetaColumn);                        
    }    

    function fn_form_moveup($int_idMetaColumn){                
        $this->fn_form_move($int_idMetaColumn, false);
    }
    function fn_form_movedown($int_idMetaColumn){                
        $this->fn_form_move($int_idMetaColumn, true);
    }

    function fn_form_move($int_idMetaColumn, $bln_direction){                

        $this->MetaColumnIdAfter=0;
        
        $this->fn_normaliseFormOrder($int_idMetaColumn);                

        $int_num=(-6);
        if($bln_direction){
            $int_num=6;
        }
        
        $str_sql="UPDATE `meta_column`.`meta_column` 
        SET `FormOrder`=`FormOrder`+ ($int_num)
        WHERE TRUE                    
        AND `MetaColumnId`=:MetaColumnId                
        ;";                
        $stmt=$this->fn_executeSQLStatement($str_sql, [            
            'MetaColumnId'=>$int_idMetaColumn
        ]);          
    
        /*
        if(!empty($this->MetaColumnIdAfter)){

            $str_sql="UPDATE `meta_column`.`meta_column` 
            SET `FormOrder`=IF(`FormOrder`>0, `FormOrder`-1, `FormOrder`)        
            WHERE TRUE                    
            AND `MetaColumnId`=:MetaColumnId                
            ;";
            $stmt=$this->fn_executeSQLStatement($str_sql, [            
                'MetaColumnId'=>$this->MetaColumnIdAfter
            ]);
        }
            //*/

        $this->fn_normaliseFormOrder($int_idMetaColumn);                        
    }    
    
    

    
    function fn_normaliseFormOrder($int_idMetaColumn){

        $arr_row=$this->fn_getFormLine($int_idMetaColumn);

        $str_sql="SELECT * FROM `meta_column`.`meta_column` where TRUE
        AND `MetaColumnSystemId`=:MetaColumnSystemId        
        AND `MetaSchemaName`=:MetaSchemaName
        AND `MetaTableName`=:MetaTableName
        ORDER BY `FormOrder`, `MetaColumnId`
        ;";        
        if($this->DebugServer){
            $this->fn_addEcho("SQL : ".$str_sql);                
        }
        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'MetaColumnSystemId'=>$arr_row["MetaColumnSystemId"],           
            'MetaSchemaName'=>$arr_row["MetaSchemaName"],  
            'MetaTableName'=>$arr_row["MetaTableName"]
        ]);

        $arr_rows=$stmt->fetchAll();      
        $int_rowCount=count($arr_rows);                                

        $this->MetaColumnIdCurrent=0;
        
        for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
          
            $arr_row=$arr_rows[$i_row];                        
            $MetaColumnId=$arr_row["MetaColumnId"];              

            $str_sql="UPDATE `meta_column`.`meta_column` 
            SET `FormOrder`=$i_row*5
            WHERE TRUE            
            AND `MetaColumnId`=$MetaColumnId
            ;";                    
            $this->fn_executeSQLStatement($str_sql);            


            if(!empty($this->MetaColumnIdCurrent)){
                if(empty($this->MetaColumnIdAfter)){
                    $this->MetaColumnIdAfter=$MetaColumnId;
                }
            }                
            
            if($MetaColumnId===$int_idMetaColumn){                                                
                 $this->MetaColumnIdCurrent=$MetaColumnId;
            }            
            
            if(empty($this->MetaColumnIdCurrent)){
                $this->MetaColumnIdBefore=$MetaColumnId;
            }                            
        }        
    }

    function fn_getFormLine($int_idMetaColumn){

        $str_sql="SELECT * FROM `meta_column`.`meta_column`        
        WHERE TRUE 
        AND `MetaColumnId`=$int_idMetaColumn        
        ;";        
        $stmt=$this->fn_executeSQLStatement($str_sql);        
        return $stmt->fetch();      
    }

}