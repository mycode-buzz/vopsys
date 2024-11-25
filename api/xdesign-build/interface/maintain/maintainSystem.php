<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainSystem extends maintainForm{


    function fn_installMetaLink(){
                       
    }

    function fn_checkMetaView(){            
    }

    function fn_checkMetaMover(){            

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `DefaultValue`='User'
      WHERE TRUE 
      AND `MetaSchemaName`='meta_user'                  
      AND `MetaTableName`='meta_mover'                        
      AND `MetaColumnName`='MetaMoverType'                        
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);
    }    

    function fn_checkColumnz(){

      //*
      $str_sql="UPDATE `meta_column`.`meta_column` JOIN `meta_view`.`meta_view` ON (`meta_column`.`MetaSchemaName`=`meta_view`.`MetaSchemaName` AND  `meta_column`.`MetaTableName`=`meta_view`.`MetaTableName`)
      SET `meta_column`.`InfoPin`=1 WHERE TRUE
      AND `meta_column`.`PrimaryPin` 
      AND `meta_column`.`MetaColumnSystemId`=:MetaColumnSystemId
      AND `meta_column`.`MetaTableName` NOT IN('xdesign_instance')
      ;";                    
      $this->fn_executeSQLStatement($str_sql, [      
        'MetaColumnSystemId'=>$this->obj_userLogin->MetaUserSystemId
      ]);
      //*/

      $str_sql="UPDATE `meta_column`.`meta_column` JOIN `meta_view`.`meta_view` ON (`meta_column`.`MetaSchemaName`=`meta_view`.`MetaSchemaName` AND  `meta_column`.`MetaTableName`=`meta_view`.`MetaTableName`)
      SET `meta_column`.`MenuPin`=1 WHERE TRUE      
      AND `meta_column`.`MetaColumnAPIName`='MetaColumnAPIName'
      AND `meta_column`.`MetaColumnSystemId`=:MetaColumnSystemId;`";                    
      $this->fn_executeSQLStatement($str_sql, [      
        'MetaColumnSystemId'=>$this->obj_userLogin->MetaUserSystemId
      ]);

    }

    function fn_maintainMetaRowzScope(){

      $MetaUserBaseId=$this->obj_userLogin->MetaUserBaseId;      
      
      $str_sql="UPDATE `meta_rowz`.`meta_rowz` SET
      `MetaPermissionTag`='ADMIN'
      WHERE TRUE 
      AND `MetaRowzSystemId`=$MetaUserBaseId                  
      AND `SettingOperationPin`='2'
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);
      //value of 2 this no longer is used


    }

    
    function fn_checkMetaRowz(){                
      

      //create Rowz for user 100 for each meta_view            
      $MetaUserBaseId=$this->obj_userLogin->MetaUserBaseId;

      $DataSchemaName='meta_view';
      $DataTableName='meta_view';
      $DataKeyName='MetaViewId';      
      //CREATE DATA ENTRIES WHICH ARE MISSING FROM SYSTEM 100 user only
      $str_sql="SELECT * FROM  `meta_view`.`meta_view`";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);
      $arr_rows=$stmt->fetchAll();        
      foreach ($arr_rows as $arr_row) {  
          $MetaViewId=$arr_row["MetaViewId"];                                              
          $ParentRowzId=0;
          $RowzOrder=0;
          $MetaViewName=$arr_row["MetaViewName"];                                              
          $MetaPermissionTag="";          
      } 
        
    }        
    
    function fn_checkMetaDataForMetaView(){
      $obj_param=new stdClass();      
      $obj_param->MetaUserSystemId=$this->obj_userLogin->MetaUserBaseId;
      $obj_param->DataSchemaName="meta_view";
      $obj_param->DataTableName="meta_view";
      $obj_param->DataKeyName="MetaViewId";      
      $obj_param->MetaDataSystemConstraint="MetaViewSystemId";                  
      $obj_param->MetaDataUserConstraint="";                        
      $obj_param->MetaPermissionTag="";              
      $this->fn_checkMetaDataSystem($obj_param);      
    }
    
    function fn_checkMetaDataForMetaRowz(){
      $obj_param=new stdClass();
      $obj_param->MetaUserSystemId=$this->obj_userLogin->MetaUserBaseId;
      $obj_param->DataSchemaName="meta_rowz";
      $obj_param->DataTableName="meta_rowz";
      $obj_param->DataKeyName="MetaRowzId";      
      $obj_param->MetaDataSystemConstraint="MetaRowzSystemId";      
      $obj_param->MetaDataUserConstraint="MetaRowzUserId";                            
      $obj_param->MetaDataUserConstraint="";                        
      $obj_param->MetaPermissionTag="";              
      $this->fn_checkMetaDataSystem($obj_param);
    }
    
    function fn_checkMetaDataForMetaColumn(){
      $obj_param=new stdClass();
      $obj_param->MetaUserSystemId=$this->obj_userLogin->MetaUserBaseId;
      $obj_param->DataSchemaName="meta_column";
      $obj_param->DataTableName="meta_column";
      $obj_param->DataKeyName="MetaColumnId";      
      $obj_param->MetaDataSystemConstraint="MetaColumnSystemId";                  
      $obj_param->MetaDataUserConstraint="";                        
      $obj_param->MetaPermissionTag="";              
      $this->fn_checkMetaDataSystem($obj_param);
    }   

    function fn_checkMetaDataForMetaLink(){

      $MetaUserSystemId =$this->obj_userLogin->MetaUserSystemId;        
      
      $obj_param=new stdClass();
      $obj_param->MetaUserSystemId=$this->obj_userLogin->MetaUserBaseId;
      $obj_param->DataSchemaName="meta_link";
      $obj_param->DataTableName="meta_link";
      $obj_param->DataKeyName="MetaLinkId";      
      $obj_param->MetaDataSystemConstraint=$MetaUserSystemId;                        
      $obj_param->MetaPermissionTag="#OWN";              
      $this->fn_checkMetaDataSystem($obj_param);
    }   

    function fn_checkMetaDataSystem($obj_param){      
    
      $MetaUserSystemId=$obj_param->MetaUserSystemId;
      $MetaUserId=$this->obj_userLogin->MetaUserId;
      $DataSchemaName=$obj_param->DataSchemaName;
      $DataTableName=$obj_param->DataTableName;
      $DataKeyName=$obj_param->DataKeyName;              
      $MetaDataSystemConstraint=$obj_param->MetaDataSystemConstraint;                
      $MetaDataUserConstraint=$obj_param->MetaDataUserConstraint;        
      $MetaPermissionTag=$obj_param->MetaPermissionTag;                
      //CREATE DATA ENTRIES WHICH ARE MISSING FROM SYSTEM      
      $str_sql="
      SELECT * FROM  `$DataSchemaName`.`$DataTableName` WHERE TRUE 
      ";
  
      if(!empty($MetaDataSystemConstraint)){
          $str_sql.="AND `$MetaDataSystemConstraint`=$MetaUserSystemId ";
      }        
      if(!empty($MetaDataUserConstraint)){
          $str_sql.="AND `$MetaDataUserConstraint`=$MetaUserId";
      }        
      
      $str_sql.=";";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);
      $arr_rows=$stmt->fetchAll();
      
      foreach ($arr_rows as $arr_row) {  
          $DataKeyValue=$arr_row[$DataKeyName];                                                          
          $obj_paramData=new stdClass;                  
          $obj_paramData->MetaDataSystemId=$MetaUserSystemId;      
          $obj_paramData->MetaDataOwnerId=$MetaUserId;      
          $obj_paramData->DataSchemaName=$DataSchemaName;
          $obj_paramData->DataTableName=$DataTableName;
          $obj_paramData->DataKeyName=$DataKeyName;      
          $obj_paramData->DataKeyValue=$DataKeyValue;               
          $obj_paramData->MetaPermissionTag=$MetaPermissionTag;                           
          
          $obj_metaData=new metaData($this);
          $obj_metaData->fn_createRecord($obj_paramData);                        
      } 
    }
  
    
       

}