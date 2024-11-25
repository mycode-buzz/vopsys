<?php

class rowzAPIGet extends rowzAPIPost{    
    
    function fn_get($url, $request_body=false, $bln_debug=false){        
        
        //DO NOT REMOVE
        $this->bln_debug=$bln_debug;
        //DO NOT REMOVE
        
        /*
        $this->fn_varDump($url, "GET str_urlEndpoint", true);
        //*/ 
        //return;       
        

        //$this->fn_varDump($this->bln_debug, "this->bln_debug", true);
        //exit;
        
        
        
        $this->fn_callInit($url, "GET", $request_body, false);                 
        

        if($this->response->status_code!==200){            
            
            $this->fn_writeResponse();   
                                 
            return $this->obj_call->str_response;    
        }
        
        
        
        /*
        if($this->bln_debug){
            return;
        }
        //*/

        

        $response=$this->response;

        //SET REQUIRED AREAS
        $this->fn_setSelectColumn();                              
        $this->fn_setRowMatchSQL();              
        $this->fn_setSQLSource();                
        $this->fn_setOrderSQL();                      
        $this->fn_setOffset();           
        //SET REQUIRED AREAS            
        
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }

        $this->response->status_code=200;                
        $this->response->status_message="OK";          

        if(empty($this->obj_call->cancel_get)){
            $this->fn_getData();                    
        }
        
        $this->fn_writeResponse();            
        return $this->obj_call->str_response;
    }    

    function fn_getData(){
        
        $response=$this->response;        
        $obj_call=$this->obj_call;        
        $obj_metaView=$obj_call->obj_metaView;                
        $obj_paramView=$obj_metaView->obj_param;
        $MetaViewId=$obj_paramView->MetaViewId;        
        if(empty($MetaViewId)){            
            return;
        }
        
        $str_whereCriteria=$this->fn_getWhereCriteria();

        //only add Archive to Get, Dont add to General where statement        
        if($obj_paramView->MetaViewId==$this->MetaLinkViewId){
        }
        else if(empty($obj_call->get_archive)){
            //*
            $str_sql="(`meta_data`.`ArchiveDate` IS NULL)";
            if(!empty($str_sql)){
                if(!empty($str_whereCriteria)){$str_whereCriteria.=" AND ";}                
                $str_whereCriteria.=$str_sql;        
            } 
                //*/           
        }
            
        $str_whereCriteria=$this->fn_removeInOperator($str_whereCriteria);
        $str_whereCriteria=$this->fn_trimEnd($str_whereCriteria, "AND");
        //$str_whereCriteria="";

        
        
        $obj_call->arr_param=array_merge(
            $obj_call->arr_metaWhere,                         
            $obj_call->arr_valueQuery,
        );        

        
        
        //GET COUNT WITHOUT LIMIT
        $str_sql="SELECT ";
        if($obj_paramView->DistinctPin){
            //$str_sql.="COUNT(DISTINCT `".$obj_paramView->MetaSchemaName."`.`".$obj_paramView->MetaTableName."`.`".$obj_paramView->MetaTableKeyField."`) ";
            //$str_sql.="COUNT(DISTINCT `".$obj_paramView->MetaTableKeyField."`) ";
            $str_sql.="COUNT(DISTINCT ".$obj_call->str_sqlSelectColumnCount.") ";
            
        }
        else{
            $str_sql.="COUNT(*)";
        }       

        $str_sql.= "FROM ";        
        $str_sql.=$obj_call->str_sqlSource;                
        if(!empty($str_whereCriteria)){
            $str_sql.="WHERE $str_whereCriteria ";
        }
        $str_sql.=";";
                       
    
        if($obj_call->api_debug){
            //DEBUG
            $this->fn_varDump($str_sql, "str_sql");
            $this->fn_varDump($obj_call->arr_param, "obj_call->arr_param");                                
            //return;                            
            //DEBUG

            
        }

        /*
        //DEBUG
        $this->response->status_code=500;                
        $this->response->status_message=$str_sql.PHP_EOL;                      
        $this->response->status_message.=$this->fn_varExportAPI($obj_call->arr_param).PHP_EOL;                      
        $this->response->status_message.="this->obj_userLogin->MetaPermissionTag: ".$this->obj_userLogin->MetaPermissionTag.PHP_EOL;                                  
        return;            
        //DEBUG
        //*/        
        
        $row_count=$this->fn_fetchCount($str_sql, $obj_call->arr_param);                        
        //GET COUNT WITHOUT LIMIT  

        if($obj_call->get_count){
            $arr_rows=[];
            $row_returned=1;
            $this->fn_setResponse([$arr_rows], $row_count, $row_returned);
            return;
        }
        
        $str_order=$obj_call->str_orderSQL;
        $str_order=$this->fn_removeOrderOperator($str_order);
        
        //GET DATA WITH LIMIT AND OFFSET        
        $str_sql="SELECT ";
        if($obj_paramView->DistinctPin){
            $str_sql.="DISTINCT ";
        }
        $str_sql.=$obj_call->str_sqlSelectColumn." FROM ";        
        $str_sql.=$obj_call->str_sqlSource;                
        if(!empty($str_whereCriteria)){
            $str_sql.="WHERE $str_whereCriteria ";
        }
        if(!empty($str_order)){
            $str_sql.="ORDER BY $str_order ";
        }        

        $str_sql.="LIMIT $obj_call->limit OFFSET $obj_call->offset;";                                
        if($obj_call->api_debug){
            //DEBUG
            $this->fn_varDump($str_sql, "str_sql");
            $this->fn_varDump($obj_call->arr_param, "obj_call->arr_param");        
            //return;                            
            //DEBUG
        }     

        //var_dump($obj_call->arr_param);                                    
        //echo($str_sql);        
        
        $stmt=$this->fn_executeSQLStatement($str_sql, $obj_call->arr_param);      
        $this->stmt=$stmt;
        
        if(empty($stmt)){
            $this->response->status_code=500;                
            //$this->response->status_message=$str_sql;          
            $this->response->status_message="GET SQL Error";          
            $arr_rows=[];    
        }
        else{
            $arr_rows=$stmt->fetchAll();                     
        }

        $row_returned=count($arr_rows);

        //$this->fn_addConsole("row_returned", $row_returned);
        //$this->fn_addConsole("arr_rows", $arr_rows);
        
        //GET DATA WITH LIMIT AND OFFSET                                                    
        $this->fn_setResponse($arr_rows, $row_count, $row_returned);
    }     
}//end of class