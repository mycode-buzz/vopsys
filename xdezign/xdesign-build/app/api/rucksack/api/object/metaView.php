<?php

class metaView{
    function __construct($obj_parent, $bln_debug=false) {     
      
      $this->obj_parent=$obj_parent;
        
        $this->obj_param=$this->fn_getParam();
        //$this->obj_parent=$obj_parent;              
        $this->bln_debug=$bln_debug;              
        //NOTE: varDump obj_param, otherwise circular

        $this->arr_selectColumn=[];
        $this->arr_orderColumn=[];

        global $obj_page;
        $this->obj_page=false;
        if(!empty($obj_page)){            
            $this->obj_page=$obj_page;
        }
        
    }    

    function fn_getParam(){

        $obj_parent=$this->obj_parent;

        $obj_param=new stdClass;
        $obj_param->MetaViewId="0";
        $obj_param->MetaViewSystemId=0;
        $obj_param->MetaViewOwnerId=0;
        
        $obj_param->MetaSchemaName="";
        $obj_param->MetaTableName="";
        $obj_param->MetaTableKeyField="";
        $obj_param->MetaConstraintName="";
        $obj_param->MetaConstraintNameChild="";
        $obj_param->MetaWhere="";
        $obj_param->MetaOrderBy="";
        $obj_param->DistinctPin=0;
        $obj_param->FilterOnSubDomainPin=0;                                
        $obj_param->JoinType=2;        
        $obj_param->DynamicMenuPin=0;        
        $obj_param->MetaTypeMenu="xapp_menuform"; 
        $obj_param->MetaTypeViewMenu="Menu"; 
        $obj_param->MetaTypeViewData=""; 
        $obj_param->MetaTypeViewReport=""; 
        $obj_param->MetaTypeViewWidget=""; 
        $obj_param->MetaTypeViewDashboard="";       
        $obj_param->PublishPin=0;         
        $obj_param->ProtectedPin=0;         
        $obj_param->MetaViewGroup="";                 
        $obj_param->ValidView=false;
        $obj_param->ViewPin=false;
        $obj_param->ChargePin=0;
        $obj_param->MetaViewSubdomain=""; 
        $obj_param->InterfacePin=""; 
        $obj_param->AutoView=0; 
        $obj_param->SystemPin=0; 
        
        return $obj_param;
    }

    function fn_varDump($foo_val, $str_msg="DUMP", $bln_console=true){

      $this->obj_parent->fn_varDump($foo_val, $str_msg, true);

  }

    function fn_initialize($MetaViewId){
      
        //$this->obj_parent->fn_varDump($MetaViewId, "in view MetaViewId", true);
        
        if(!is_numeric($MetaViewId)){
          $this->obj_parent->fn_setError("[Native View] Invalid Numeric View Id Trapped : [".$MetaViewId."]");
          exit;
        }

        if(!empty($MetaViewId)){
          $str_sql="SELECT *  FROM `meta_view`.`meta_view`  WHERE `MetaViewId`=:MetaViewId;";              
          $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, [
            "MetaViewId" => $MetaViewId
          ]);      
          $obj_paramView=$this->obj_param=$stmt->fetchObject();
          
          
                    
          if(empty($obj_paramView)){
            $obj_paramView=$this->obj_param=$this->fn_getParam();
          }        
          $obj_paramView->ValidView=true;  
          if(empty($obj_paramView->ViewPin)){
            $obj_paramView->ValidView=false;  
          }
          
        }            
    }

    function fn_debug($bln_console=true){
        $this->obj_parent->fn_varDump($this->obj_param, "debug view", $bln_console);      
    }


    function fn_createRecord($obj_param){            

        $obj_parent=$this->obj_parent;
    
        //generic create Record function
        $str_sql="SELECT `MetaViewId` FROM `meta_view`.`meta_view` WHERE TRUE 
        AND `MetaViewSystemId`=:MetaViewSystemId 
        AND `MetaSchemaName`=:MetaSchemaName 
        AND `MetaTableName`=:MetaTableName        
        ;";   

        $MetaRecordId=$obj_parent->fn_fetchColumn($str_sql, [    
          'MetaViewSystemId'=>$obj_param->MetaViewSystemId,        
          'MetaSchemaName'=>$obj_param->MetaSchemaName,        
          'MetaTableName'=>$obj_param->MetaTableName,            
        ]);
        
        if(!empty($MetaRecordId)){                  
          //$obj_parent->fn_addConsole("FOUND  VIEW");                                  
          $this->fn_initialize($MetaRecordId);          
          return $MetaRecordId;//already exist
        }

        /*
        $obj_parent->fn_addConsole("DID NOT FIND VIEW");                                  
        $obj_parent->fn_addConsole("MetaViewSystemId", $obj_param->MetaViewSystemId);                                  
        $obj_parent->fn_addConsole("MetaSchemaName", $obj_param->MetaSchemaName);                                  
        $obj_parent->fn_addConsole("MetaTableName", $obj_param->MetaTableName);                                  
        //*/
        
        
        $MetaRecordId=$this->fn_insertRecord([
          'ChargePin'=>$obj_param->ChargePin,  
          'AutoView'=>$obj_param->AutoView,            
          'MetaViewSubdomain'=>$obj_param->MetaViewSubdomain,
          'MetaViewName'=>$obj_param->MetaViewName,
          'MetaViewSystemId'=>$obj_param->MetaViewSystemId,
          'MetaViewOwnerId'=>$obj_param->MetaViewOwnerId,
          'MetaSchemaName'=>$obj_param->MetaSchemaName,  
          'MetaTableName'=>$obj_param->MetaTableName,                  
          'MetaTableKeyField'=>$obj_param->MetaTableKeyField,
          'MetaOrderBy'=>$obj_param->MetaOrderBy,          
          'ProtectedPin'=>$obj_param->ProtectedPin,                         
          'MetaViewGroup'=>$obj_param->MetaViewGroup,                                   
          'JoinType'=>$obj_param->JoinType, 
          'DynamicMenuPin'=>$obj_param->DynamicMenuPin, 
          'MetaTypeMenu'=>$obj_param->MetaTypeMenu, 
          'MetaTypeViewMenu'=>$obj_param->MetaTypeViewMenu, 
          'MetaTypeViewData'=>$obj_param->MetaTypeViewData, 
          'MetaTypeViewReport'=>$obj_param->MetaTypeViewReport, 
          'MetaTypeViewWidget'=>$obj_param->MetaTypeViewWidget, 
          'MetaTypeViewDashboard'=>$obj_param->MetaTypeViewDashboard,                 
          'PublishPin'=>$obj_param->PublishPin                                         
        ]);      
        
        $this->fn_initialize($MetaRecordId);
        //$this->fn_debug();

        return $MetaRecordId;
        
    }
    
    function fn_insertRecord($arr_param){                                
    
    
        $obj_parent=$this->obj_parent;      
  
        $str_sql="
        INSERT INTO `meta_view`.`meta_view`
          (
          `meta_view`.`ChargePin`,
          `meta_view`.`AutoView`,          
          `meta_view`.`MetaViewSubdomain`,
          `meta_view`.`MetaViewName`,          
          `meta_view`.`MetaViewSystemId`, 
          `meta_view`.`MetaViewOwnerId`,
          `meta_view`.`MetaSchemaName`,    
          `meta_view`.`MetaTableName`,
          `meta_view`.`MetaTableKeyField`,            
          `meta_view`.`MetaOrderBy`,            
          `meta_view`.`JoinType`,
          `meta_view`.`DynamicMenuPin`,
          `meta_view`.`MetaTypeMenu`,
          `meta_view`.`MetaTypeViewMenu`,
          `meta_view`.`MetaTypeViewData`,
          `meta_view`.`MetaTypeViewReport`,
          `meta_view`.`MetaTypeViewWidget`,
          `meta_view`.`MetaTypeViewDashboard`,            
          `meta_view`.`PublishPin`,        
          `meta_view`.`ProtectedPin`,
          `meta_view`.`MetaViewGroup`          
          )
          VALUES
          (
          :ChargePin,    
          :AutoView,              
          :MetaViewSubdomain,
          :MetaViewName,
          :MetaViewSystemId,  
          :MetaViewOwnerId,
          :MetaSchemaName,    
          :MetaTableName,
          :MetaTableKeyField,                    
          :MetaOrderBy,                              
          :JoinType,
          :DynamicMenuPin,
          :MetaTypeMenu,
          :MetaTypeViewMenu,
          :MetaTypeViewData,
          :MetaTypeViewReport,
          :MetaTypeViewWidget,
          :MetaTypeViewDashboard,            
          :PublishPin,        
          :ProtectedPin,
          :MetaViewGroup
          )
        ;";               
        
        
        $stmt=$obj_parent->fn_executeSQLStatement($str_sql, $arr_param);    
        $MetaViewId=$obj_parent->fn_getLastInsertId();
        
        $obj_metaData=new metaData($this->obj_parent);
        $obj_paramMetaData=new stdClass;
        $obj_paramMetaData->MetaDataSystemId=$arr_param["MetaViewSystemId"];
        $obj_paramMetaData->MetaDataOwnerId=$arr_param["MetaViewOwnerId"];
        $obj_paramMetaData->DataSchemaName="meta_view";
        $obj_paramMetaData->DataTableName="meta_view";
        $obj_paramMetaData->DataKeyName="MetaViewId";        
        $obj_paramMetaData->DataKeyValue=$MetaViewId;                                                            
        $obj_paramMetaData->MetaPermissionTag="";              
        $obj_metaData->fn_createRecord($obj_paramMetaData);   
        
        return $MetaViewId;                            
    }

    function fn_addSelectColumn($str_jsonColumn){      

        $obj_parent=$this->obj_parent;
        $obj_paramView=$this->obj_param;            
        if(empty($this->obj_columnDefinition)){                          
          $this->fn_setDefinition();                    
        }            
        $arr_listColumn=(array) json_decode($str_jsonColumn);    
        if(!$this->fn_validateJSONDecode($arr_listColumn))return false;                        
        if(!is_array($arr_listColumn))return false;//must be an array, not an object                
        $this->arr_selectColumn=$this->obj_columnDefinition->fn_filter($arr_listColumn);                                       
        return true;        
    }   
    
    function fn_getListColumnShortDescription($arr_column){                               
      
      $obj_parent=$this->obj_parent;
      $obj_paramView=$this->obj_param;            
      //$obj_parent->fn_varDump($this->arr_selectColumn, "xxx this->arr_selectColumn", true);                                   
      
      $str_sql="";
      foreach($arr_column as $obj_column) {                                                                                   

          $str_sql.="`$obj_column->MetaSchemaName`.`$obj_column->MetaTableName`.`$obj_column->MetaColumnName`";          
          $str_sql.=" AS '$obj_column->MetaColumnAPIName'";
          $str_sql.=", ";
      }        
      $str_sql=trim($str_sql, ", ");
                                              
      return $str_sql;
    }  


    function fn_getListSelectColumnName($get_fqsn, $bln_count=false){                          

      $arr_column=$this->arr_selectColumn;

      $obj_parent=$this->obj_parent;
      $obj_paramView=$this->obj_param;            
      //$obj_parent->fn_varDump($this->arr_selectColumn, "xxx this->arr_selectColumn", true);                                   
      
      $str_sql="";
      foreach($arr_column as $obj_column) {                                                                                   
          
        
          if($get_fqsn){
            $str_sql.="`$obj_column->MetaSchemaName`.`$obj_column->MetaTableName`.`$obj_column->MetaColumnName`";
            if(!$bln_count){
              $str_sql.=" AS '`$obj_column->MetaSchemaName`.`$obj_column->MetaTableName`.`$obj_column->MetaColumnAPIName`'";
            }             
          }
          else{
            $str_sql.="`$obj_column->MetaSchemaName`.`$obj_column->MetaTableName`.`$obj_column->MetaColumnName`";
            if(!$bln_count){              
              $str_sql.=" AS '$obj_paramView->MetaViewId.$obj_column->MetaColumnAPIName'";
            }            
          }
          $str_sql.=", ";
      }        
      $str_sql=trim($str_sql, ", ");
                                              
      return $str_sql;
      
    }  

    function fn_replaceColumnSQL($arr_name, &$str_sql){

      $obj_parent=$this->obj_parent;
      $obj_paramView=$this->obj_param; 
      $MetaViewId=$obj_paramView->MetaViewId;     
      
      if(empty($arr_name)){                          
        return;
      }            

                
      if(empty($this->obj_columnDefinition)){                          
        $this->fn_setDefinition();                    
      }            
      
      $arr_filterColumn=$this->obj_columnDefinition->fn_filter($arr_name);

      //CHECK COLUMN IS SET TO SEARCHPIN=TRUE IN DB !!
      //CHECK VIEW ID IS WHAT IS BEING PASSED
      
      /*
      //if($obj_parent->bln_debug){
        $this->bln_debug=true;
        //$obj_page=$obj_parent->obj_page;
        $obj_page=$obj_parent;
        //$obj_page->fn_varDump($MetaViewId, "MetaViewId", true);
        $obj_page->fn_varDump($arr_name, "arr_name", true);
        //$obj_page->fn_varDump($str_sql, "str_sql", true);
        $obj_page->fn_varDump($arr_filterColumn, "arr_filterColumn", true);        
        $this->fn_varDump($this->obj_columnDefinition->obj_definition, "this->obj_columnDefinition->obj_definition");
        $obj_page->fn_varDump("----------------", "END", true);
      //}
      //*/


                 
      
      $i_count=count($arr_filterColumn);
      for($i_key=0;$i_key<$i_count;$i_key++) {                                                                                   
          $obj_column=$arr_filterColumn[$i_key];           
          
          //REPLACE VIEW ID AND SHORT NAME
          $str_sql=$this->fn_replaceColumnViewShortName($obj_column, $str_sql);            
          //REPLACE VIEW ID AND SHORT NAME
      }                
        
    }

    

    function fn_replaceColumnViewShortName($obj_column, $str_rowSQL){
        $obj_parent=$this->obj_parent;
        $obj_paramView=$this->obj_param;            
        $MetaViewId=$obj_paramView->MetaViewId;    
        
        $str_find="`".$MetaViewId.".".$obj_column->MetaColumnAPIName."`";            
        $str_replace="`$obj_column->MetaSchemaName`.`$obj_column->MetaTableName`.`$obj_column->MetaColumnName`";

        /*
        if($obj_parent->bln_debug){
          $this->bln_debug=true;
          $obj_page=$obj_parent->obj_page;
          $obj_page->fn_varDump($MetaViewId, "MetaViewId", true);
          $obj_page->fn_varDump($str_find, "str_find", true);
          $obj_page->fn_varDump($str_rowSQL, "str_rowSQL", true);          
          
        }
          //*/
        
        
        return str_ireplace($str_find, $str_replace, $str_rowSQL);
    }
    
    function fn_addBodyColumn($arr_nameShort, $arr_valueField, &$str_rowSQL, $str_labelPrefix){

      $obj_parent=$this->obj_parent;
      $obj_paramView=$this->obj_param;            

      $obj_bodyHolder=new stdClass;

      if(empty($this->obj_columnDefinition)){                          
        $this->fn_setDefinition();                    
      }            

      //$obj_parent->fn_varDump($arr_nameShort, "arr_nameShort", true);                                  
      //return;

      $this->obj_columnDefinition->bln_debug=true;
      
      
      $arr_filterColumn=$this->obj_columnDefinition->fn_filter($arr_nameShort);                                             
      

      $MetaViewId=$obj_paramView->MetaViewId;              
      
      $obj_bodyHolder->arr_nameField=[];      
      $obj_bodyHolder->arr_labelField=[];            
      $obj_bodyHolder->arr_valueField=[];
      
      $i_count=count($arr_filterColumn);
      for($i_key=0;$i_key<$i_count;$i_key++) {                                                                                   
          $obj_column=$arr_filterColumn[$i_key];                     
          
          $str_nameField="`$obj_column->MetaSchemaName`.`$obj_column->MetaTableName`.`$obj_column->MetaColumnName`";        
          array_push($obj_bodyHolder->arr_nameField, $str_nameField);                                    

          $str_shortName=strtoupper($obj_column->MetaColumnAPIName);
          $str_labelField=$str_labelPrefix.$obj_paramView->MetaViewId.$str_shortName.$i_key;                    
          
          array_push($obj_bodyHolder->arr_labelField, $str_labelField);                                              
          $obj_bodyHolder->arr_valueField[$str_labelField]=$arr_valueField[$str_labelField];                    

          //REPLACE VIEW ID AND SHORT NAME
          $str_rowSQL=$this->fn_replaceColumnViewShortName($obj_column, $str_rowSQL);            
          //REPLACE VIEW ID AND SHORT NAME
      }              

      return $obj_bodyHolder;
    }

    function fn_getMetaListColumn($int_idMetaViewTarget){

      if(empty($this->obj_columnDefinition)){                          
        $this->fn_setDefinition();                    
      }            

      $obj_parent=$this->obj_parent;
      $obj_paramView=$this->obj_param;        
      $MetaViewId=$obj_paramView->MetaViewId; 

      $arr_column=$this->obj_columnDefinition->fn_filterMetaList($int_idMetaViewTarget);
      //add in obj_Columns which have a metalist 
      //which value starts with the int_idMetaViewTarget
      return $arr_column;


    }

      
    function fn_getMatchColumnList($str_listMetaColumnAPIName){        

        $obj_parent=$this->obj_parent;
        $obj_paramView=$this->obj_param;        
        $MetaViewId=$obj_paramView->MetaViewId;        

        //$str_listColumn=str_replace($MetaViewId.".", "", $str_listColumn);
        //*/        
    
        //*                        
        $str_sql="SELECT CONCAT($MetaViewId, '.', LOWER(`MetaColumnAPIName`)) as 'MetaColumnAPIName' FROM  `meta_column`.`meta_column` WHERE TRUE            
        AND `MatchPin` 
        AND `MetaViewId`=:MetaViewId            
        AND CONCAT($MetaViewId, '.', LOWER(`MetaColumnAPIName`)) IN($str_listMetaColumnAPIName)            
        ;";                  
        //*/            

        //*            
        //$obj_parent->fn_addConsole("obj_paramView->MetaSchemaName", $obj_paramView->MetaSchemaName);          
        //$obj_parent->fn_addConsole("obj_paramView->MetaTableName", $obj_paramView->MetaTableName);          
        //$obj_parent->fn_addConsole("str_list", $str_listColumn);          
        //$obj_parent->fn_addConsole("xx str_sql", $str_sql);          
        //*/                
        
        
        //*            
        $stmt=$obj_parent->fn_executeSQLStatement($str_sql, [    
            'MetaViewId'=>$MetaViewId,
        ]);  
        //*/
        $arr_data=$stmt->fetchAll();
        //$obj_parent->fn_varDump($arr_data, "arr_data", true);                                  
        return array_column($arr_data, "MetaColumnAPIName");
    }

    function fn_getRequiredEmptyStatus($int_recordId){      

      if(empty($this->obj_columnDefinition)){      
        $this->fn_setDefinition();      
      }        
      
      

      $obj_parent=$this->obj_parent;
      $obj_paramView=$this->obj_param;        
      $MetaSchemaName=$obj_paramView->MetaSchemaName;
      $MetaSchemaName=$obj_paramView->MetaSchemaName;
      $MetaTableName=$obj_paramView->MetaTableName;      
      $MetaTableKeyField=$obj_paramView->MetaTableKeyField;      
      
      
      $arr_column=$this->obj_columnDefinition->arr_requiredPin;            
      
      if(empty($arr_column)){
        return false;
      }

      //$this->obj_parent->fn_varDump("123", "123");           
      //return false;

      $str_columnShortDescription=$this->fn_getListColumnShortDescription($arr_column, true);

      $str_sql="SELECT $str_columnShortDescription
      FROM  `$MetaSchemaName`.`$MetaTableName`
      WHERE
      $MetaTableKeyField=$int_recordId;
      ;";      

      $stmt=$obj_parent->fn_executeSQLStatement($str_sql);  
      $arr_rows=$stmt->fetchAll();      
      
      $int_rowCount=count($arr_rows);
      for($i_rows=0;$i_rows<$int_rowCount;$i_rows++) {                                                                                   
        $arr_row=$arr_rows[$i_rows];                        

        foreach ($arr_row as $key => $value) {          
          if(empty($value)){                                          
            $obj_column=$this->obj_columnDefinition->fn_getColumn($key);
            return $obj_column;
          }
        }
      }
      return false;
    }


    function fn_getLiveColumnList($str_listMetaColumnAPIName){        

        $obj_parent=$this->obj_parent;
        $obj_paramView=$this->obj_param;        
        $MetaViewId=$obj_paramView->MetaViewId;        

        //$str_listColumn=str_replace($MetaViewId.".", "", $str_listColumn);
        //*/        
      
        //*                        
        $str_sql="SELECT CONCAT($MetaViewId, '.', LOWER(`MetaColumnAPIName`)) as 'MetaColumnAPIName' FROM  `meta_column`.`meta_column` WHERE TRUE            
        AND `LivePin` 
        AND `MetaViewId`=:MetaViewId            
        AND CONCAT($MetaViewId, '.', LOWER(`MetaColumnAPIName`)) IN($str_listMetaColumnAPIName)            
        ;";                  
        //*/            

        //*            
        //$obj_parent->fn_addConsole("obj_paramView->MetaSchemaName", $obj_paramView->MetaSchemaName);          
        //$obj_parent->fn_addConsole("obj_paramView->MetaTableName", $obj_paramView->MetaTableName);          
        //$obj_parent->fn_addConsole("str_list", $str_listColumn);          
        //$obj_parent->fn_addConsole("xx str_sql", $str_sql);          
        //*/                
        
        
        //*            
        $stmt=$obj_parent->fn_executeSQLStatement($str_sql, [    
            'MetaViewId'=>$MetaViewId,
        ]);  
        //*/
        $arr_data=$stmt->fetchAll();
        //$obj_parent->fn_varDump($arr_data, "arr_data", true);                                  
        return array_column($arr_data, "MetaColumnAPIName");
  }

  function fn_setDefinition(){

      $obj_param=new stdClass;          
      $obj_param->MetaColumnSystemId=$this->obj_parent->obj_userLogin->MetaUserSystemId;                          
      $this->obj_columnDefinition=new columnDefinition($this, $this->obj_parent);      
      $this->obj_columnDefinition->fn_initialize($obj_param);           
  }  
  
  function fn_getAPIPostRequestBody(&$obj_param){      
    return $this->fn_getAPIRequestBody($obj_param);  
}      

function fn_getAPIPatchRequestBody(&$obj_param){        
  return $this->fn_getAPIRequestBody($obj_param);
}      

function fn_getAPIRequestBody(&$obj_param){      
  $obj_paramView=$this->obj_param;
  $MetaViewId=$obj_paramView->MetaViewId;        
  $MetaColumnAPIName=$obj_param->MetaColumnAPIName;
  
  if(empty($this->obj_columnDefinition)){      
    $this->fn_setDefinition();      
  }            

  /*
        $this->fn_varDump($obj_param->MetaColumnAPIName, "obj_param->MetaColumnAPIName");
        $this->fn_varDump($obj_param->MetaColumnValue, "obj_param->MetaColumnValue");
        exit;
        //*/ 
  
  $obj_column=$this->obj_columnDefinition->fn_parseValue($obj_param->MetaColumnAPIName, $obj_param->MetaColumnValue);                          
  $obj_param->MetaColumnValue=$obj_column->MetaColumnValue;
  $obj_param->Column=$obj_column;  
  
  $obj_requestBody=new stdClass;
  $str_item="$MetaViewId.$MetaColumnAPIName";
  $obj_requestBody->{$str_item}=$obj_param->MetaColumnValue;
  
  return $obj_requestBody;    
}



  function fn_validateJSONDecode($result){
    if(is_null($result)){            
        return false;
    }        
    return true;
}

function fn_getFQSNKey(){

  $obj_paramView=$this->obj_param;
  return "`".$obj_paramView->MetaSchemaName."`.`".$obj_paramView->MetaTableName."`.`".$obj_paramView->MetaTableKeyField."`";
                  
}

function fn_getMetaViewNameKey(){
  //GET VIEW NAME AND KEy (DATA IMPORT)
  $obj_paramView=$this->obj_param;        
  $MetaViewName=$obj_paramView->MetaViewName;        
  $MetaTableKeyField=$obj_paramView->MetaTableKeyField;        
  $str_selectColumn=$MetaViewName.".".$MetaTableKeyField;  
  return $str_selectColumn;                
}    

function fn_getIdKey(){        
  //GET VIEW ID AND KEy         
  $obj_paramView=$this->obj_param;
  
  $MetaViewId=$obj_paramView->MetaViewId;        
  $MetaTableKeyField=$obj_paramView->MetaTableKeyField;
  $str_selectColumn=$MetaViewId.".".$MetaTableKeyField;
  return $str_selectColumn;         
                  
}
function fn_getIdValue($obj_callBack){

  $obj_paramView=$this->obj_param;    
  $MetaViewId=$obj_paramView->MetaViewId;        
  $MetaTableKeyField=$obj_paramView->MetaTableKeyField;          
  $obj_responseBody=$obj_callBack->response_body;            
  $obj_row=$obj_responseBody[0];
  $str_label="$MetaViewId.$MetaTableKeyField";//potential issue if row is in different case, to view    
  $int_idRecord=$this->obj_parent->fn_getObjectProperty($obj_row, $str_label);    
  return $int_idRecord;
}
function fn_getFQSNIdValue($obj_callBack){

  $obj_paramView=$this->obj_param;    
  $MetaViewId=$obj_paramView->MetaViewId;        
  $MetaTableKeyField=$obj_paramView->MetaTableKeyField;        
  $obj_responseBody=$obj_callBack->response_body;            
  $obj_row=$obj_responseBody[0];
  $str_label="$MetaViewId.$MetaTableKeyField";  
  $int_idRecord=$this->obj_parent->fn_getObjectProperty($obj_row, $str_label);    
  return $int_idRecord;
}

function fn_getObjectProperty($obj_my, $str_label){
  return $this->obj_parent->fn_getObjectProperty($obj_my, $str_label);  
}
function fn_getArrayMember($arr_my, $str_label){
  return $this->obj_parent->fn_getArrayMember($arr_my, $str_label);  
}

}//END OF CLASS  



?>