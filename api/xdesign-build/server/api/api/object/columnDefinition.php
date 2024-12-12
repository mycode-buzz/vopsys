<?php

class columnDefinition{    
    
    function __construct($obj_metaView, $obj_parent) {                     
      
        //global $obj_parent;
        $this->obj_parent=$obj_parent;        

        $this->bln_debug=true;

        $this->obj_metaView=$obj_metaView;                
        $this->obj_definition=new stdClass;                
        $this->arr_definition=[];                
    }     

    function fn_initialize($obj_param){                
        
        $this->obj_param=$obj_param;
        $obj_paramView=$this->obj_metaView->obj_param;
        $obj_parent=$this->obj_parent;

        $this->arr_requiredPin=[];
        
        $MetaColumnSystemId=$obj_param->MetaColumnSystemId;
        if($obj_paramView->MetaViewId==$obj_parent->MetaLinkViewId){
            $MetaColumnSystemId=100;
        }

        $MetaViewId=$obj_paramView->MetaViewId;        

        $MetaSchemaName=$obj_paramView->MetaSchemaName;
        $MetaTableName=$obj_paramView->MetaTableName;


        if($MetaViewId==$obj_parent->MetaDataViewId){
            $this->fn_initializeMetaData($obj_param);        
            return;
        }

        if($MetaViewId==$obj_parent->MetaUserViewId){
            $this->fn_initializeMetaUser($obj_param);        
            return;
        }

        
        $str_sqlColumnScope="";                        
        if($obj_paramView->DistinctPin){                                            
            $str_sqlColumnScope="AND (`MenuPin` OR `InfoPin`) ";//duplicate scope for distinct
        }        

        $str_sql="";                
        $str_sql.="SELECT * FROM `meta_column`.`meta_column` WHERE TRUE                 
        AND `MetaColumnSystemId`=:MetaColumnSystemId        
        AND `MetaSchemaName`=:MetaSchemaName 
        AND `MetaTableName`=:MetaTableName
        AND `LivePin` 
        $str_sqlColumnScope
        ;";      
        
        /*
        $this->fn_varDump($str_sql, "str_sql");
        $this->fn_varDump($MetaColumnSystemId, "MetaColumnSystemId");
        $this->fn_varDump($MetaSchemaName, "MetaSchemaName");
        $this->fn_varDump($MetaTableName, "MetaTableName");
        //*/
        
        $stmt=$obj_parent->fn_executeSQLStatement($str_sql,  [                        
            'MetaColumnSystemId'=>$MetaColumnSystemId,            
            'MetaSchemaName'=>$MetaSchemaName,
            'MetaTableName'=>$MetaTableName,        
            
        ]);                        
        
        $this->arr_rows=$stmt->fetchAll();         

        
        
        if(empty($this->arr_rows)){                        
            
            $str_message="Error on ColumnDefinition.
            obj_paramView->MetaViewName: $obj_paramView->MetaViewName  
            obj_paramView->MetaSchemaName: $obj_paramView->MetaSchemaName 
            obj_paramView->MetaTableName: $obj_paramView->MetaTableName
            MetaColumnSystemId: $MetaColumnSystemId            
            MetaSchemaName: $MetaSchemaName
            MetaTableName-: $MetaTableName            
            SQL: $str_sql
            ";

            //$this->fn_varDump($str_message, "test");

            $this->fn_setError($str_message);            
        }            
        
        
        $this->fn_create($this->arr_rows); 
        
        //$this->fn_varDump($this->arr_rows, "arr_rows");
    }
    
    function fn_create($arr_rows){        
    
        $obj_column="";
        $int_rowCount=count($arr_rows);
        $obj_paramView=$this->obj_metaView->obj_param;

        for($i_rows=0;$i_rows<$int_rowCount;$i_rows++) {                                                                       
            
            $arr_row=$arr_rows[$i_rows];                        
            
            $obj_column=new metaColumn();            
            $obj_column->MetaViewId=$obj_paramView->MetaViewId;
            $obj_column->MetaColumnId=$arr_row["MetaColumnId"];
            $obj_column->MetaColumnSystemId=$arr_row["MetaColumnSystemId"];                        
            $obj_column->MetaSchemaName=$arr_row["MetaSchemaName"];
            $obj_column->MetaTableName=$arr_row["MetaTableName"];
            $obj_column->MetaColumnName=$arr_row["MetaColumnName"];
            $obj_column->MetaColumnAPIName=$arr_row["MetaColumnAPIName"];
            $obj_column->MetaColumnType=$arr_row["MetaColumnType"];
            $obj_column->MetaLabel=$arr_row["MetaLabel"];            
            $obj_column->DebugPin=$arr_row["DebugPin"];                        
            $obj_column->FormOrder=$arr_row["FormOrder"];            
            $obj_column->MetaList=$arr_row["MetaList"];            
            $obj_column->MetaOption=$arr_row["MetaOption"];
            $obj_column->MetaSQL=$arr_row["MetaSQL"];
            $obj_column->MenuPin=$arr_row["MenuPin"];
            $obj_column->MetaPermissionTag=$arr_row["MetaPermissionTag"];            
            $obj_column->InfoPin=$arr_row["InfoPin"];            
            $obj_column->LivePin=$arr_row["LivePin"];
            $obj_column->HiddenPin=$arr_row["HiddenPin"];            
            $obj_column->LockedPin=$arr_row["LockedPin"];            
            $obj_column->UnSigned=0;                        
            $obj_column->RequiredPin=$arr_row["RequiredPin"];                        
            if($obj_column->RequiredPin){
                array_push($this->arr_requiredPin, $obj_column);
            }            
            $obj_column->MaxLength=$arr_row["MaxLength"];                        
            $obj_column->PrimaryPin=$arr_row["PrimaryPin"];            
            $obj_column->DefaultValue=$arr_row["DefaultValue"];
            $obj_column->MetaClassType=$arr_row["MetaClassType"];            
            $obj_column->MetaColumnGroup=$arr_row["MetaColumnGroup"];
            $obj_column->PublishPin=$arr_row["PublishPin"];
            $obj_column->Subdomain=$arr_row["Subdomain"];            
            $this->fn_addColumnToDefinition($obj_column);            
        }   
    }

    

    function fn_addColumnToDefinition($obj_column){

        $this->obj_definition->{$obj_column->MetaColumnAPIName}=$obj_column;            
        $this->arr_definition=get_object_vars($this->obj_definition);


    }
    
    function fn_getColumn($str_shortName){        

        $obj_parent=$this->obj_parent;
        $obj_paramView=$this->obj_metaView->obj_param;
        
        //$str_shortName=$obj_parent->fn_protectSQLValue($str_shortName);                                
        $bln_valid=true;
        if(empty($str_shortName)){$bln_valid=false;}
        $str_shortName=$obj_parent->fn_stripSpace($str_shortName);
        if(empty($str_shortName)){$bln_valid=false;}
        if(strlen($str_shortName)>250){$bln_valid=false;};
        if(empty($bln_valid)){            
            return false;
        }
        $str_shortName=strtolower($str_shortName);        

        //$this->fn_varDump($str_shortName, "str_shortName");
        //$this->fn_varDump($this->obj_definition, "this->obj_definition");        
        //exit;   
        
        //$obj_column=$this->obj_parent->fn_getObjectProperty($this->obj_definition, $str_shortName);          
        $obj_column=$this->obj_definition->{$str_shortName};
        if(empty($obj_column)){
            $this->fn_setError("Error : Column Not Found: [".$obj_paramView->MetaSchemaName.".".$obj_paramView->MetaTableName.".".$str_shortName."]. Check Short Name.");
            return false;
        }
        else{
            //for debug only
            //$this->fn_setError("Error : Column IS Found: [".$obj_paramView->MetaSchemaName.".".$obj_paramView->MetaTableName.".".$str_shortName."].");            
            //return;
        }
        
        return $obj_column;
    }

    
    function fn_initializeMetaData(){        
        
        $arr_metaDataColumn=$this->obj_parent->fn_addMetaData();
        $this->fn_createMeta($arr_metaDataColumn);
    }

    function fn_initializeMetaUser(){

        $arr_metaUserColumn=$this->obj_parent->fn_addMetaUser();
        $this->fn_createMeta($arr_metaUserColumn);
    }

    function fn_createMeta($arr_row){        
    
        $obj_column="";
        $int_rowCount=count($arr_row);

        for($i_row=0;$i_row<$int_rowCount;$i_row++) {                                                                                              
            
            $obj_column=$arr_row[$i_row];            
            $this->fn_addColumnToDefinition($obj_column);
        }         
    }

    function fn_isEmpty($MetaColumnAPIName){ 

        $this->bln_isEmpty=true;
        if(count($this->arr_rows)){            
            $this->bln_isEmpty=false;        
        }
        
        if(!empty($this->obj_definition->MetaColumnAPIName)){
            $this->bln_isEmpty=false;
        }
    }    
    function fn_validateNumber(&$int_value, $int_min, $int_max) {        
        
        if (!is_numeric($int_value)) {
            return false;
        }           

        $int_value=(int)$int_value;        
        
        if ($int_value > $int_max || $int_value < $int_min) {
            return false;
        }
        return true;

    }

    function fn_replaceStartsWith($foo_value, $search, $replace){

        if (str_starts_with($foo_value, $search)) {
            $foo_value = substr_replace($foo_value, $replace, 0, strlen($search));                    
        } 
        return $foo_value;

    }    

    function fn_isValidJSON($json) {

        if(strtoupper($json)==="NULL"){
            return true;
        }
     
        json_decode($json);
        return (json_last_error() === JSON_ERROR_NONE);
    }

    function fn_jsonDecodeToObject($str_json){
        
        
        if(is_null($str_json)){
            return new stdClass;
        }
        
        if(!$this->fn_isValidJSON($str_json)){
            return new stdClass;
        }
        
        $foo_object=json_decode($str_json);        

        if(is_object($foo_object)){
            return $foo_object;
        }
        else{
            return new stdClass;
        }
    }
    
    function fn_parseValue($MetaColumnAPIName, $foo_value){                
        
        if(!count($this->arr_definition)){            
            return $foo_value;
        }
        
        $obj_column=$this->obj_parent->fn_getArrayMember($this->arr_definition, $MetaColumnAPIName);        
        //$this->fn_varDump($obj_column, "obj_column");
        
        $MetaColumnAPIName=strtolower($obj_column->MetaColumnAPIName);                
        $MetaColumnType=strtolower($obj_column->MetaColumnType);                
        $MaxLength=strtolower($obj_column->MaxLength);
        $foo_valueToLower=strtolower($foo_value);                        
        
        
        
        //META OPTION
        $obj_metaOption=$this->fn_jsonDecodeToObject($obj_column->MetaOption);                               
        foreach ($obj_metaOption as $property => $value) {                        
            
            $bln_writeOption=false;                        
            switch(strtolower($property)){                
                case "formexpand":
                case "formposition":                        
                case "unsigned":                                                                        
                case "decimal":
                case "datetimesecond":                                                    
                    $bln_writeOption=true;                
                break;                    
            }            
            
            if($bln_writeOption){                
                $obj_column->$property=$value;            
                switch(strtolower($obj_column->$property)){
                    case "true":
                        $obj_column->$property=true;
                        break;
                    case "false":
                        $obj_column->$property=false;
                        break;
                    case "null":
                        $obj_column->$property=null;
                        break;                    
                }            
            }
        }
        //META OPTION
        
        /*
        $this->fn_varDump($obj_column, "obj_column");                
        $this->obj_parent->fn_varDumpPost();                
        exit;
        //*/

        switch($MetaColumnAPIName){    
            case "metaoption":
                $obj_metaOption=$this->fn_jsonDecodeToObject($foo_value);                               
                foreach ($obj_metaOption as $property => $value) {                        
                    switch(strtolower($property)){
                        case "notused":                                        
                        break;                    
                    }            
                }
            break;        
            case "maxlength":
                $int_min = 0;
                $int_max = 10000;               
                $int_maxLength= $foo_value;                
                $bln_value=$this->fn_validateNumber($int_maxLength, $int_min, $int_max);                            
                if(!$bln_value){
                    $this->obj_parent->fn_setMessage("Error: MaxLength not validate: [".$int_maxLength."]");
                exit;
                }                                
            break;
            case "metacolumnapiname":                                
                $foo_value = preg_replace('/\s+/', '', $foo_value);                                
            break;        
        }        

        switch($MetaColumnType){                
            case "note":                  
                if(!isset($obj_column->MaxLength)){$this->fn_setError("Error: MaxLength is not set: [".$obj_column->MetaColumnAPIName."]");}                
                $foo_value=substr($foo_value, 0, 10000);
            break;
            case "text":                                                   
                if(!isset($obj_column->MaxLength)){$this->fn_setError("Error: MaxLength is not set: [".$obj_column->MetaColumnAPIName."]");}                
                $foo_value=substr($foo_value, 0, 1000);
                
            break;
            case "json":                                 
                if(is_null($foo_valueToLower)){
                    $foo_valueToLower="";
                }   
                
                if(empty($foo_valueToLower)){
                    //$this->fn_varDump($foo_valueToLower, "caught empty foo_valueToLower");
                    $foo_value="NULL";                
                }                                

                if($foo_value!=="NULL"){                                                                           
                    $bln_value=$this->fn_isValidJSON($foo_value);                
                    if(!$bln_value){
                        $this->fn_setError("Invalid json format: [".$foo_value."]");                                
                    }
                }
            break;            
            case "checkbox":                 
                if($foo_valueToLower==="on"){
                    $foo_value=1;
                }
                else{
                    $foo_value=0;
                }
            break;
            case "percent":                 
            case "currency":                 
            case "number":     
                
                
                if($foo_value<>0){
                    if(empty($foo_value)){
                        exit;//will be blank if invalid                    
                    }
                }

                $int_max = 9999999999.99999;//15 digits
                $int_min = -9999999999.99999;
                $bln_value=$this->fn_validateNumber($foo_value, $int_min, $int_max);
                if(!$bln_value){
                    $this->fn_setError("Invalid number format");                                
                }                
                
                if(empty($obj_column->UnSigned)){
                    if($foo_value<0){
                        $foo_value="0";                        
                    }    
                }
                
            break;
            case "date":                
                if($foo_valueToLower=="null"){
                    $foo_value="NULL";
                }
                if($foo_valueToLower==""){
                    $foo_value="NULL";
                }
                
                if($foo_value!=="NULL"){                                                                           
                    $dateObject = DateTime::createFromFormat('d-M-Y', $foo_value);
                    if (!$dateObject) {
                        $dateObject = DateTime::createFromFormat('Y-m-d', $foo_value);
                    }

                    if ($dateObject) {
                        $foo_value=$dateObject->format('Y-m-d'); // Output: 2024-08-31                        
                    }
                    else {                        
                        $this->fn_setError("Invalid date format: [".$foo_value."]");            
                    }
                    
                }
            break;
            case "datetime":                
                if($foo_valueToLower=="null"){
                    $foo_value="NULL";
                }
                if($foo_valueToLower==""){
                    $foo_value="NULL";
                }
                
                if($foo_value!=="NULL"){                                                                           
                    $dateObject = DateTime::createFromFormat('Y-m-d H:i:s', $foo_value);
                    if ($dateObject) {
                        $foo_value=$dateObject->format('Y-m-d H:i:s'); // Output: 2024-08-31                        
                    }
                    else {                        
                        $this->fn_setError("Invalid datetime format: [".$foo_value."]");            
                    }                    
                }
            break;
        }

        $foo_value=trim($foo_value);
        $obj_column->MetaColumnValue=$foo_value;
        
        
        return $obj_column;    
    }


 
    function fn_getDefaultValue($str_columnName, $str_otherValue=""){
        if($this->fn_isEmpty()){
            return $str_otherValue;
        }                   
        
        $str_defaultValue=$this->{$str_columnName}->DefaultValue;
        if(empty($str_defaultValue)){$str_defaultValue=$str_otherValue;}
        return $str_defaultValue;
    }
          
    function fn_filter($arr_listColumnAPIName=""){

        
        if(empty($arr_listColumnAPIName)){            
            return $this->arr_definition;
        } 
        
        $obj_paramView=$this->obj_metaView->obj_param;


        $arr_filter=[];
        $arr_key=$arr_listColumnAPIName;                        

        $i_count=count($arr_key);      
        for($i_key=0;$i_key<$i_count;$i_key++) {                                                                                   
            $str_key=$arr_key[$i_key];                                                
            if($str_key==="*"){
                $arr_filter=$this->arr_definition;
                break;
            }            
            
            if(!empty($str_key) && $this->obj_parent->fn_inString($str_key, ".")){                
                $arr_short=explode(".", $str_key);                
                $int_idMetaView=$arr_short[0];
                $str_shortName=$arr_short[1];                                                                                      
                
                if($int_idMetaView==$obj_paramView->MetaViewId){                                                                     
                    $obj_column=$this->fn_getColumn($str_shortName);                                
                    if(empty($obj_column)){
                        continue;
                    }
                    if($obj_column->LivePin){                        
                        array_push($arr_filter, $obj_column);                    
                    }                    
                } 
                
            }                        
        }
        
        return $arr_filter;                       
    }

    function fn_filterAttribute($str_nameAttribute){

        $arr_filter=[];
        $arr_key=$this->arr_definition;    

        foreach ($arr_key as $obj_column) {
            
            $foo_attribute=$obj_column->{$str_nameAttribute};            
            if($foo_attribute){                
                array_push($arr_filter, $obj_column);                    
            }
        }

        return $arr_filter;                       
    }

    function fn_filterMetaList($int_idMetaViewTarget){

        $str_idMetaViewTarget=(string) $int_idMetaViewTarget;

        $arr_filter=[];
        $arr_key=$this->arr_definition;            

        foreach ($arr_key as $obj_column) {
            
            $str_metaList=$obj_column->MetaList;            
            if(!empty($str_metaList)){                
                
                if(str_starts_with(strtolower($str_metaList), strtolower($str_idMetaViewTarget))){
                    array_push($arr_filter, $obj_column);
                }
            }
        }

        return $arr_filter;                       
    }

    function fn_varDump($foo_val, $str_val){        
        $this->obj_parent->fn_varDump($foo_val, $str_val);        
        
    }
    function fn_setError($str_message){                
        
        $this->fn_varDump($str_message, "error message");                    
        $this->obj_parent->fn_setError($str_message);                    
    }
    
    
         
  
}