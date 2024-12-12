<?php

///////////////////////////DATAMANAGER
class metaColumn{
    function __construct($obj_parent=false) {                            
        
        $this->MetaColumnId="0";
        $this->MetaSchemaName="";
        $this->MetaTableName="";
        $this->MetaColumnName="true";
        $this->MetaColumnAPIName="";                
        $this->MetaColumnType="";
        $this->MetaLabel="";
        $this->DebugPin=0;        
        $this->FormOrder=0;
        $this->MetaList="";        
        $this->MetaOption="";                
        $this->PublishPin=0;
        $this->LivePin=0;
        $this->MenuPin=0;
        $this->SearchPin="";                
        $this->UnSigned=0;                        
        $this->RequiredPin=0;                        
        $this->MaxLength=100;                                
        $this->CreatedDate="";
        $this->ModifiedDate="";     
        $this->IsMetaData=false;    
        $this->obj_param=new stdClass;    

        $this->obj_parent=$obj_parent;                
        $this->bln_debug=false;

        $this->arr_metaColumnType=["Date","Date & Time","Percent","Number","Currency","Checkbox","Text","Note","JSON"];
    }
    function fn_initialize($MetaColumnId, $bln_getMetaData=false){

        $str_bracketField="`";                 
        $this->str_nameQualified=$str_bracketField.$this->MetaColumnName.$str_bracketField;
        if(!empty($this->MetaTableName)){
            $this->str_nameQualified="`".$this->MetaTableName."`.".$this->str_nameQualified;
        }
        if(!empty($this->MetaSchemaName)){
            $this->str_nameQualified="`".$this->MetaSchemaName."`.".$this->str_nameQualified;
        }        

        if(!is_numeric($MetaColumnId)){
          $this->obj_parent->fn_setError("[Native View] Invalid Numeric View Id Trapped : [".$MetaColumnId."]");
          exit;
        }

        if(!empty($MetaColumnId)){          
          if(empty($bln_getMetaData)){
            $str_sql="SELECT *  FROM `meta_column`.`meta_column` WHERE `MetaColumnId`=:MetaColumnId;";
            $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, [              
            "MetaColumnId" => $MetaColumnId
            ]);                  
          }
          else{
            $str_sql="SELECT *  FROM `meta_column`.`meta_column` 
            JOIN `meta_data`.`meta_data` ON             
            DataKeyName='MetaColumnId'
            AND
            DataKeyValue=MetaColumnId
            WHERE `MetaColumnId`=:MetaColumnId;";
            $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, [                          
              "MetaColumnId" => $MetaColumnId
            ]);      
          }
          
          $obj_paramColumn=$this->obj_param=$stmt->fetchObject();                    
          
        }            
    }

    function fn_getNameIdentifier($bln_getFQSN){
      if($bln_getFQSN){
        return "`".$this->MetaSchemaName."`.`".$this->MetaTableName."`.`".$this->MetaColumnAPIName."`";
      }
      else{        
        return "`".$this->MetaColumnId."`.`".$this->MetaColumnAPIName."`";
      }
    }
    //*/
    
    function fn_createRecord($obj_param){              
    

        
        $obj_parent=$this->obj_parent;
      
    
        //generic create Record function
        $str_sql="SELECT `MetaColumnId` FROM `meta_column`.`meta_column` WHERE TRUE 
        AND `MetaColumnSystemId`=:MetaColumnSystemId 
        AND `MetaSchemaName`=:MetaSchemaName 
        AND `MetaTableName`=:MetaTableName 
        AND `MetaColumnName`=:MetaColumnName         
        ;";  
        //*      
        //$this->obj_parent->fn_addConsole("MetaColumn CREATE", $str_sql);                                          
        //$this->obj_parent->fn_addConsole("obj_param", $obj_param);                                                  
        //exit;
        //*/

        $MetaColumnId=$obj_parent->fn_fetchColumn($str_sql, [    
          'MetaColumnSystemId'=>$obj_param->MetaColumnSystemId,        
          'MetaSchemaName'=>$obj_param->MetaSchemaName,        
          'MetaTableName'=>$obj_param->MetaTableName,            
          'MetaColumnName'=>$obj_param->MetaColumnName,                                  
        ]);                 
        
        if(!empty($MetaColumnId)){  
          $this->fn_initialize($MetaColumnId);                
          $this->fn_createMetaData($MetaColumnId, $obj_param);
          return $MetaColumnId;//already exist
        }    

        $arr_param=[
          'MetaColumnSystemId'=>$obj_param->MetaColumnSystemId,           
          'MetaPermissionTag'=>$obj_param->MetaPermissionTag,                    
          'MetaSchemaName'=>$obj_param->MetaSchemaName,  
          'MetaTableName'=>$obj_param->MetaTableName,       
          'MetaColumnName'=>$obj_param->MetaColumnName, 
          'MetaColumnAPIName'=>strtolower($obj_param->MetaColumnAPIName),           
          'MetaColumnType'=>$obj_param->MetaColumnType,   
          'MetaLabel'=>$obj_param->MetaLabel,
          'DebugPin'=>$obj_param->DebugPin,           
          'SectionTitle'=>$obj_param->SectionTitle,          
          'FormOrder'=>$obj_param->FormOrder,          
          'PrimaryPin'=>$obj_param->PrimaryPin,          
          'InfoPin'=>$obj_param->InfoPin,    
          'MenuPin'=>$obj_param->MenuPin,              
          'LivePin'=>$obj_param->LivePin,    
          'PublishPin'=>$obj_param->PublishPin,
          'SearchPin'=>$obj_param->SearchPin,       
          'MatchPin'=>$obj_param->MatchPin,       
          'HiddenPin'=>$obj_param->HiddenPin,       
          'LockedPin'=>$obj_param->LockedPin,                    
          'RequiredPin'=>$obj_param->RequiredPin,                                        
          'MaxLength'=>$obj_param->MaxLength,                                                  
          'MetaList'=>$obj_param->MetaList,
          'MetaOption'=>$obj_param->MetaOption,          
          'MetaSQL'=>$obj_param->MetaSQL,
          'DefaultValue'=>$obj_param->DefaultValue,          
          'MetaClassType'=>$obj_param->MetaClassType,
          'MetaColumnGroup'=>$obj_param->MetaColumnGroup,
          'Subdomain'=>$obj_param->Subdomain,
          'ProtectedPin'=>$obj_param->ProtectedPin
        ];
        $MetaRecordId=$this->fn_insertRecord($arr_param, $obj_param);                              
        $this->fn_initialize($MetaRecordId);      
        $this->fn_createMetaData($MetaRecordId, $obj_param);
        
        return false;
      }

      function fn_insertRecord($arr_param, $obj_param){                                
          
    
        $obj_parent=$this->obj_parent;         
        
  
        $str_sql="
        INSERT INTO `meta_column`.`meta_column`
          (               
          `meta_column`.`MetaColumnSystemId`,    
          `meta_column`.`MetaPermissionTag`,            
          `meta_column`.`MetaSchemaName`,
          `meta_column`.`MetaTableName`,        
          `meta_column`.`MetaColumnName`,
          `meta_column`.`MetaColumnAPIName`,            
          `meta_column`.`MetaColumnType`,    
          `meta_column`.`MetaLabel`,
          `meta_column`.`DebugPin`,            
          `meta_column`.`SectionTitle`,            
          `meta_column`.`FormOrder`,                        
          `meta_column`.`PrimaryPin`,                    
          `meta_column`.`InfoPin`,    
          `meta_column`.`MenuPin`,    
          `meta_column`.`LivePin`,    
          `meta_column`.`PublishPin`,                
          `meta_column`.`SearchPin`,
          `meta_column`.`MatchPin`,
          `meta_column`.`HiddenPin`,          
          `meta_column`.`LockedPin`,                              
          `meta_column`.`RequiredPin`, 
          `meta_column`.`MaxLength`,           
          `meta_column`.`MetaList`,
          `meta_column`.`MetaOption`,            
          `meta_column`.`MetaSQL`,
          `meta_column`.`DefaultValue`,
          `meta_column`.`MetaClassType`,
          `meta_column`.`MetaColumnGroup`,    
          `meta_column`.`Subdomain`,
          `meta_column`.`ProtectedPin`
          )
          VALUES
          (            
          :MetaColumnSystemId,    
          :MetaPermissionTag,    
          :MetaSchemaName,  
          :MetaTableName,        
          :MetaColumnName,
          :MetaColumnAPIName,            
          :MetaColumnType,            
          :MetaLabel,
          :DebugPin,   
          :SectionTitle,               
          :FormOrder,            
          :PrimaryPin,     
          :InfoPin,
          :MenuPin,
          :LivePin,
          :PublishPin,            
          :SearchPin,
          :MatchPin,
          :HiddenPin,              
          :LockedPin,                             
          :RequiredPin,
          :MaxLength,          
          :MetaList,
          :MetaOption,            
          :MetaSQL,        
          :DefaultValue,
          :MetaClassType,            
          :MetaColumnGroup, 
          :Subdomain,
          :ProtectedPin
          )
        ;";               

        //$this->obj_parent->fn_addConsole("MetaColumn INSERT", $str_sql);                                          
        $stmt=$obj_parent->fn_executeSQLStatement($str_sql, $arr_param);            
        $MetaColumnId=$obj_parent->fn_getLastInsertId();  
        return $MetaColumnId;                            
    }

    function fn_createMetaData($MetaColumnId, $obj_param){

      $obj_parent=$this->obj_parent;         
      
      $obj_paramData=new stdClass;                                  
      $obj_paramData->MetaDataSystemId=$obj_param->MetaColumnSystemId;
      $obj_paramData->MetaDataOwnerId=$obj_param->MetaColumnOwnerId;
      $obj_paramData->DataSchemaName="meta_column";
      $obj_paramData->DataTableName="meta_column";
      $obj_paramData->DataKeyName="MetaColumnId";      
      $obj_paramData->DataKeyValue=$MetaColumnId;                                 
      $obj_paramData->MetaPermissionTag="";                       
      $obj_metaData=new metaData($obj_parent);
      $obj_metaData->fn_createRecord($obj_paramData);                  
    }


      function fn_validateDateType(){

        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;                    
        $MetaColumnName=$obj_paramColumn->MetaColumnName;
        $str_sql="SELECT * FROM `$obj_paramColumn->MetaSchemaName`.`$obj_paramColumn->MetaTableName`             
        WHERE $MetaColumnName IS NOT NULL;";
        //$this->obj_parent->fn_addConsole("fn_validateDateType str_sql", $str_sql);                                                          
        $arr_row=$obj_parent->fn_fetchRow($str_sql);                            
        if($arr_row){              
          return false;
        }               
        return true;
      }

      function fn_validateNumberType(){
        
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;                            
        $MetaColumnName=$obj_paramColumn->MetaColumnName;
        $MetaColumnType=$obj_paramColumn->MetaColumnType;        
        $str_sql="SELECT * FROM `$obj_paramColumn->MetaSchemaName`.`$obj_paramColumn->MetaTableName` 
        WHERE `$MetaColumnName`<>0";                                    
        //$this->obj_parent->fn_addConsole("fn_validateNumberType str_sql", $str_sql);                                                          
        $arr_row=$obj_parent->fn_fetchRow($str_sql);                            
        if($arr_row){              
          return false;
        }               
        return true;
      }
      
      function fn_validateChangeType($MetaColumnNewType){       
        
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;                    
        //$this->obj_parent->fn_addConsole("fn_validateChangeType MetaColumnNewType", $MetaColumnNewType);                                                                  
        switch(strtolower($MetaColumnNewType)){                    
          case "date":        
            return $this->fn_validateDateType();
            break;
          case "datetime":            
            return $this->fn_validateDateType();
            break;
          case "checkbox":
          case "currency":
          case "percent":
          case "number":
            return $this->fn_validateNumberType();
            break;
          default:                    
            return true;
            break;          
        }        
        return true;//wont see
      }
      function fn_prepareChangeType($MetaColumnNewType){       
        
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;                    
        //$obj_parent->fn_addConsole("fn_prepareChangeType MetaColumnNewType", $MetaColumnNewType);                                                          
        
        $MetaColumnDefinition="TEXT DEFAULT NULL";
        $obj_parent->fn_mysqlChangeType($obj_paramColumn->MetaSchemaName, $obj_paramColumn->MetaTableName, $obj_paramColumn->MetaColumnName, $MetaColumnDefinition);        
        
        switch(strtolower($MetaColumnNewType)){                    
          case "date":                    
          case "datetime":            
            $str_sql="UPDATE `$obj_paramColumn->MetaSchemaName`.`$obj_paramColumn->MetaTableName`
            SET `$obj_paramColumn->MetaColumnName`=NULL;";              
            $obj_parent->fn_executeSQLStatement($str_sql);                                      
            break;
            case "checkbox":
            case "currency":
            case "percent":
            case "number":
            $str_sql="UPDATE `$obj_paramColumn->MetaSchemaName`.`$obj_paramColumn->MetaTableName` 
            SET `$obj_paramColumn->MetaColumnName`=0;";              
            $obj_parent->fn_executeSQLStatement($str_sql);                                                             
            break;                    
          case "note": 
          case "text": 
            $str_sql="UPDATE `$obj_paramColumn->MetaSchemaName`.`$obj_paramColumn->MetaTableName` 
            SET `$obj_paramColumn->MetaColumnName`='';";              
            $obj_parent->fn_executeSQLStatement($str_sql);                                                             
            break;          
        }                
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
      
      function fn_changeType($MetaColumnNewType){       
        
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;            
        $MetaColumnName=$obj_paramColumn->MetaColumnName;        

        //$obj_parent->fn_executeSQLStatement("START TRANSACTION;");                
        //$this->obj_parent->fn_addConsole("fn_changeType MetaColumnNewType", $MetaColumnNewType);                                                          

        
        $this->fn_prepareChangeType($MetaColumnNewType);                            
        
        switch(strtolower($MetaColumnNewType)){
          case "note":
            $MetaColumnDefinition="TEXT DEFAULT NULL";
            $this->fn_resetUINote();                        
            break;
        case "text":            
            $MetaColumnDefinition="VARCHAR(100) DEFAULT ''";            
            $this->fn_resetUIText();                        
            break;
        case "date":            
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);            
            if(!$bln_valid){return false;}            
            $MetaColumnDefinition="DATE NULL DEFAULT NULL";
            $this->fn_resetUIDate();                        
            break;
        case "datetime":
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);            
            if(!$bln_valid){return false;}
            $MetaColumnDefinition="DATETIME NULL DEFAULT NULL";            
            $this->fn_resetUIDateTime();                        
            break;
        case "checkbox":
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);            
            if(!$bln_valid){return false;}
            $MetaColumnDefinition="TINYINT DEFAULT 0";
            $this->fn_resetUICheckbox();                        
            break;
        case "recordid"://not sure what this is doing , should not be possible to setup a recordid thru ui
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);                        
            if(!$bln_valid){return false;}                        
            $MetaColumnDefinition="INT UNSIGNED NOT NULL DEFAULT 0";
            $this->fn_resetUINumber();                        
            break;
        case "number":          
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);                        
            if(!$bln_valid){return false;}                        
            $MetaColumnDefinition="DECIMAL(10,2) DEFAULT 0";
            $this->fn_resetUINumber();                        
            break;
          case "currency":          
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);                        
            if(!$bln_valid){return false;}                        
            $MetaColumnDefinition="DECIMAL(10,2) DEFAULT 0";
            $this->fn_resetUICurrency();                        
            break;
          case "percent":          
            $bln_valid=$this->fn_validateChangeType($MetaColumnNewType);                        
            if(!$bln_valid){return false;}                        
            $MetaColumnDefinition="DECIMAL(10,2) DEFAULT 0";
            $this->fn_resetUIPercent();                        
            break;
        default:                        
            $this->fn_changeType("Note");
            //$this->obj_parent->fn_addConsole("New Type Not Rcognised - Defaulted to Note", $MetaColumnNewType);                                                                      
            return true;
            break;          
        }

        //$obj_parent->fn_addConsole("MetaColumnDefinition", $MetaColumnDefinition);                                                                  
        $obj_parent->fn_mysqlChangeType($obj_paramColumn->MetaSchemaName, $obj_paramColumn->MetaTableName, $obj_paramColumn->MetaColumnName, $MetaColumnDefinition);        
        
        //$obj_parent->fn_executeSQLStatement("COMMIT;");                
        return true;
      } 
      
      function fn_getMetaColumnTypeOption($str_name){
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;             
        $MetaOption=$obj_paramColumn->MetaOption;        

        $obj_metaOption=$this->fn_jsonDecodeToObject($obj_paramColumn->MetaOption);                               
        if(!empty($obj_metaOption->$str_name)){
          return $obj_metaOption->$str_name;
        }
        else{
          return "";
        }
        
      }


      function fn_changeOption($MetaOption){       
        
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;            
        $MetaColumnName=$obj_paramColumn->MetaColumnName;        
        

        //$obj_parent->fn_executeSQLStatement("START TRANSACTION;");                
        //$this->obj_parent->fn_addConsole("fn_changeType MetaColumnNewType", $MetaColumnNewType);                                                          

          //META OPTION
        $obj_metaOption=$this->fn_jsonDecodeToObject($MetaOption);                                       
        foreach ($obj_metaOption as $property => $value) {                        
            
          $bln_validOption=false;                   
          switch(strtolower($property)){                          
            case "formexpand":
            case "formposition":                        
            case "unsigned":                                                                        
            case "decimal":
            case "datetimesecond":                                                    
              $bln_validOption= true;                
            break;                    
          }            
          
          switch(strtolower($obj_paramColumn->MetaColumnType)){
            case "note":                                          
              $bln_value=$this->fn_validateNumber($value, 0, 10000);//passed by ref
              if($bln_value){              
                  $MetaColumnDefinition="TEXT DEFAULT NULL";
                  $obj_parent->fn_mysqlChangeType($obj_paramColumn->MetaSchemaName, $obj_paramColumn->MetaTableName, $obj_paramColumn->MetaColumnName, $MetaColumnDefinition);                      
              }
              break;
            case "text":              
              $bln_value=$this->fn_validateNumber($value, 0, 10000);//passed by ref
              if($bln_value){              
                  $MetaColumnDefinition="VARCHAR($value) DEFAULT ''";
                  $obj_parent->fn_mysqlChangeType($obj_paramColumn->MetaSchemaName, $obj_paramColumn->MetaTableName, $obj_paramColumn->MetaColumnName, $MetaColumnDefinition);                      
              }
          }
        }
        //META OPTION       
        
        //$obj_parent->fn_executeSQLStatement("COMMIT;");                
        return true;
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

      function fn_resetUICurrency(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultCurrency);        
        $this->fn_emptyLabel('Currency');
      }
      function fn_resetUIPercent(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultPercent);        
        $this->fn_emptyLabel('Percent');
      }
      

      function fn_resetUINumber(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultNumber);
        $this->fn_emptyLabel('Number');
      }

      function fn_resetUINote(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultNote);
        $this->fn_emptyLabel('Note');
      }

      function fn_resetUIText(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultText);
        $this->fn_emptyLabel('Text');
      }

      function fn_resetUICheckbox(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultCheckbox);
        $this->fn_emptyLabel('Checkbox');
      }

      function fn_resetUIDateTime(){
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultDateTime);
        $this->fn_emptyLabel('Date & Time');
      }
    
      function fn_resetUIDate(){        
        $this->fn_emptyMetaOption($this->obj_parent->MetaOptionDefaultDate);
        $this->fn_emptyLabel('Date');
      }

      function fn_emptyMetaOption($str_replace){
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;                                    
        $str_sql="UPDATE `meta_column`.`meta_column`
          SET `MetaOption`=:MetaOption WHERE TRUE
          AND MetaColumnId=:MetaColumnId;";                        
          $obj_parent->fn_executeSQLStatement($str_sql, [          
            'MetaOption'=>$str_replace,
            'MetaColumnId'=>$obj_paramColumn->MetaColumnId
          ]);                                      
      }
      
      function fn_emptyLabel($str_replace){
        $obj_parent=$this->obj_parent;
        $obj_paramColumn=$this->obj_param;                                    
        if(in_array($obj_paramColumn->MetaLabel, $this->arr_metaColumnType)){        
          $str_sql="UPDATE `meta_column`.`meta_column`
          SET `MetaLabel`=:MetaLabel WHERE TRUE
          AND MetaColumnId=:MetaColumnId;";              
          //$obj_parent->fn_addConsole("str_sql", $str_sql);                                                                  
          //*
          $obj_parent->fn_executeSQLStatement($str_sql, [
            'MetaLabel'=>$str_replace,
            'MetaColumnId'=>$obj_paramColumn->MetaColumnId
          ]);                                      
          //*/
        }
      }
      
    
        
      
     
      
      
}//END OF CLASS  



?>