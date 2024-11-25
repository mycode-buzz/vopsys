<?php


class jsonOperator{   
    
    function __construct($obj_parent, $str_prefix, $str_connector="") {       
        
        $this->bln_debug=false;
        $this->bln_error=false;        
        $this->str_prefix=$str_prefix;
        
        $this->str_connectorDefault="AND";  
        if(empty($str_connector)){
            $str_connector=$this->str_connectorDefault;//DEFAULT CONNECTOR
        }
        $this->str_connector=$str_connector;
         

        
        $this->status_message="No error";

        $this->bln_orderByQuery=false;
        

        //SET PARENT WHICH WILL USE SQL & NAME/VALUES
        $this->obj_parent=$obj_parent;        
        //SET PARENT WHICH WILL USE SQL & NAME/VALUES

                      
        
        //SET OPERATOR ARRAY & CALL BACK FUNCTION
        $this->arr_operator=[
            
            "\$bt" => function (&$foo_value) {                                                
                
                $arr_value=json_decode($foo_value);
                $this->fn_validateJSONDecode($arr_value, $str_msg="jsonOperator BETWEEN: invalid json format");
                if(count($arr_value)!==2){
                    $this->fn_setError("jsonOperator BETWEEN : invalid array presented");
                    return;                   
                }
                $foo_value=$arr_value[0]." AND ".$arr_value[1];                 
                return "BETWEEN";
            },
            "\$con" => function (&$foo_value) {                
                $foo_value="%".$foo_value."%";
                return "LIKE";
            },
            "\$ew" => function (&$foo_value) {                                
                $foo_value="%".$foo_value;
                return "LIKE";
            },
            "\$ncon" => function (&$foo_value) {                
                $foo_value="%".$foo_value."%";
                return "NOT LIKE";
            },
            "\$gt" => function (&$foo_value) {                                
                return ">";
            },
            "\$gte" => function (&$foo_value) {                                
                return ">=";
            },            
            "\$lt" => function (&$foo_value) {                                
                return "<";
            },
            "\$lte" => function (&$foo_value) {                                
                return "<=";
            },
            "\$in" => function (&$foo_value) {                         
                foreach($foo_value as &$str_item){
                    $str_item=addslashes($str_item);
                }
                $str_list=implode("\",\"", $foo_value);                
                
                $foo_value="(\"".$str_list."\")";                                
                //$foo_value="(".$foo_value.")";
                return "IN";
            },
            "\$ne" => function (&$foo_value) {                                
                return "<>";
            },            
            "\$nin" => function (&$foo_value) {                                
                $str_list=implode(",", $foo_value);
                $foo_value="(".$str_list.")";                
                return "NOT IN";
            },            
            "\$not" => function (&$foo_value) {                                
                return "<>";
            },            
            "\$sw" => function (&$foo_value) {                                
                $foo_value=$foo_value."%";
                return "LIKE";
            },
        ];              
        $this->arr_operatorKey=array_keys($this->arr_operator);                
        //SET OPERATOR ARRAY & CALL BACK FUNCTION

        //SET CONNECTOR ARRAY
        $this->arr_connector=[            
            "\$and"=>"AND", 
            "\$or"=>"OR",            
        ];                
        $this->arr_connectorKey=array_keys($this->arr_connector);                                        
        //SET CONNECTOR ARRAY        
        
        //SET SQL STRING
        $this->str_sql="";
        //SET SQL STRING

    }    

    function fn_parseQuery($str_clause){           
        //PUBLIC CALLING FUNCTION
        //$this->fn_varDump($str_clause, "str_clause", true);

        if($this->bln_orderByQuery){
            $this->strOperator=" ";               
            //$this->str_prefix="ORDER";
            $this->str_connectorDefault=", ";
        }


        $this->fn_doParseQuery($str_clause);
        $this->str_sql=$this->obj_parent->fn_trimEnd($this->str_sql, "AND");
        
    }
        

    function fn_doParseQuery($str_clause){         
        //PRIVATE CALLING FUNCTION

        $obj_clause=json_decode($str_clause);//as object, not associate array
        $this->fn_validateJSONDecode($obj_clause, "[JSON OPERATOR Query]");
        $arr_clause=(array)($obj_clause);                

        //*
        if(array_is_list($arr_clause)){//not designed for numeric indices
            return false;
         
        }
        //*/
        
        foreach($arr_clause as $foo_key=>$foo_value){
            $foo_key=trim($foo_key);
            
            //SET CONNECTOR
            $keyConnector = array_search($foo_key, $this->arr_connectorKey); 
            //$this->obj_parent->fn_addConsole("foo_key", $foo_key);      
              
            if(!empty($keyConnector)){
                $this->str_connector=$this->arr_connector[$foo_key];    
                                                       
            }
            else{
                
                //$this->str_connector=$this->str_connectorDefault;//DEFAULT CONNECTOR
            } 

            //$this->obj_parent->fn_addConsole("this->str_connector", $this->str_connector);           
            //SET CONNECTOR
            
            
            if (is_array($foo_value)){              
                
                foreach($foo_value as $obj_object){                     
                
                    $str_clause=json_encode($obj_object);
                    $obj_jsonOperator=new jsonOperator($this->obj_parent, $this->str_prefix, $this->str_connector);
                    $obj_jsonOperator->fn_doParseQuery($str_clause);                    
                    $this->fn_appendSql($obj_jsonOperator->str_sql);                                    
                    $this->fn_appendSql($this->str_connector);//THIS FUNCTION ADDS IMPORTANT SPACE BEFORE APPENDING                                                    
                    
                }                
                
                $this->str_sql=$this->obj_parent->fn_trimEnd($this->str_sql, " ".$this->str_connector);                                                
                
            }
            else{//not an array, so either a an operator object or a value
            
                $this->strOperator="=";        
                if($this->bln_orderByQuery){
                    $this->strOperator=" ";                                           
                }
                if (is_object($foo_value)){                              
                    
                    $arr_object=(array)$foo_value;//transform object to array
                    $foo_subKey=key($arr_object);//get logical operator name
                    $foo_value=$arr_object[$foo_subKey];//get value attached to logical operator e.g. arr["not"]="foo_value"

                    //SET OPERATOR
                    $keyOperator = array_search($foo_subKey, $this->arr_operatorKey);                                                
                    if($keyOperator!==false){                                        
                        $this->strOperator=call_user_func_array($this->arr_operator[$foo_subKey], array(&$foo_value));                                    
                    }        
                    else{
                        $this->strOperator="=";//DEFAULT OPERATOR
                    }
                    //SET OPERATOR            
                }

                if(!$this->obj_parent->fn_inString($foo_key, ".")){
                    $this->fn_setError("API JSON OPERATOR KEY FAILED VALIDATION");
                    return;                   
                }
                //ADD SQL CLAUSE - //use the key & value in sql expression & pdo array
                if(!empty($this->obj_metaView)){//check field is within the view
                    $obj_paramView=$this->obj_metaView->obj_param;                    
                    $str_viewId=$this->obj_parent->fn_parseViewId($foo_key);                    
                    if($str_viewId!=$obj_paramView->MetaViewId && $str_viewId!=$this->obj_parent->MetaDataViewId){                    
                        continue;
                    }
                    //Not sure why we would not want the id to be queried?
                    if($foo_key=="$obj_paramView->MetaViewId.$obj_paramView->MetaTableKeyField"){                    
                        //continue;
                    }
                    //$this->fn_varDump($foo_key, "foo_key", true);
                    //$this->fn_varDump($str_viewId, "str_viewId", true);

                }
                array_push($this->obj_parent->arr_nameQuery, $foo_key);                        
                $int_count=count($this->obj_parent->arr_valueQuery);        

                $str_namedParameter=$this->str_prefix.str_replace(".", "", strtoupper($foo_key).$int_count);                        

                $strOperator=$this->strOperator;                
                if(is_null($foo_value)){                    
                }                
                elseif($foo_value===false){
                    $foo_value=0;//this is required (windows, maybe linux) cannot equate false to the 0 tinyint
                }
                elseif($foo_value===true){
                    $foo_value=1;
                }
                else{                
                    switch(strtoupper($foo_value)){                        
                        case "IS NULL":
                            $strOperator="IS";
                            $foo_value=NULL;
                        break;
                        case "IS NOT NULL":
                            $strOperator="IS NOT";
                            $foo_value=NULL;
                        break;                   
                        case "FALSE":                            
                            $foo_value=0;
                        break;
                        case "NULL":                            
                            $foo_value=NULL;
                        break;

                    }
                }

                $this->obj_parent->arr_valueQuery[$str_namedParameter]=$foo_value;                        
                
                $str_sql="`$foo_key` $strOperator :$str_namedParameter ".$this->str_connector;                                        
                $this->fn_appendSql($str_sql);                        
                //ADD SQL CLAUSE

                switch($strOperator){
                    case "IN":                                            
                    case "NOT IN":                                            
                        array_push($this->obj_parent->arr_InOperator, $str_namedParameter);                                                                           
                        break;
                }

                
            }//END OF LOOP
        }
        
        
        
        $str_bracketLeft="(";
        $str_bracketRight=")";
        $this->str_sql=$str_bracketLeft.$this->obj_parent->fn_trimEnd($this->str_sql, " ".$this->str_connector).$str_bracketRight;                                                
        

        return true;

    }
    
    function fn_appendSql($str_append){
        if(!empty($this->str_sql)){
            $this->str_sql.=" ";
        }
        $this->str_sql.=$str_append;
    }

    //SUPPORT FUNCTIONS
    function fn_setError($str_message){        
        $this->bln_error=true;        
        $this->status_message=$str_message;
    } 
    function fn_validateJSONDecode($arr, $str_msg=""){
        if(is_null($arr)){
            $this->fn_setError("NULL Array found. ".$str_msg);            
        }        
    }
    function fn_varDump($str_msg, $foo_val="", $bln_console=false){         
        $this->obj_parent->fn_varDumpAPI($str_msg, $foo_val, $bln_console);        
    }    
    //SUPPORT FUNCTIONS
    
    
     
}//end of class