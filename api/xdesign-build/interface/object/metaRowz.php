<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

///////////////////////////DATAMANAGER
class metaRowz {  
  function __construct($obj_parent=false) {                

    
    $this->obj_param=$this->fn_getParam();    
    $this->obj_parent=$obj_parent;
  }      

  function fn_getParam(){
    
    $obj_param=new stdClass;                          
    
    $obj_param->MetaRowzId=0;
    $obj_param->MetaRowzSystemId=0;
    $obj_param->MetaRowzUserId=0;
    $obj_param->MetaRowzInterfacePin=0;    
    $obj_param->MetaPermissionTag="#OWN";    
    $obj_param->MetaViewId=100;            
    $obj_param->TemplateRowzId=0;
    $obj_param->ParentRowzId=0;
    $obj_param->MetaRowzName="";
    $obj_param->MetaRowzTitle="";
    $obj_param->LivePin=1;
    $obj_param->DebugPin=0;
    $obj_param->RowzOrder=0;
    $obj_param->RowzIcon="";    
    $obj_param->SettingPin=0;
    $obj_param->DisabledPin=0;
    $obj_param->HiddenPin=0;       
    $obj_param->ArchivePin=0;   
    $obj_param->AdminPin=0;   
    $obj_param->LockOpenPin=0;   
    $obj_param->AutoFetchPin=0;   
    $obj_param->AutoOpenPin=0;   
    $obj_param->MetaRowzGroup="";   
    $obj_param->ProtectedPin=0;   
    $obj_param->MetaTypeRowzWidget="";   
    $obj_param->MetaTypeRowzDashboard="";   
    $obj_param->QueryList="";   
    $obj_param->QueryListDisabled="";   
    $obj_param->Subdomain="";      
    $obj_param->SettingOperationPin=0;     
    return $obj_param;
  }
    
  function fn_initialize($MetaRowzId){

    if(!empty($MetaRowzId)){
      $str_sql="SELECT *  FROM `meta_rowz`.`meta_rowz`  WHERE `MetaRowzId`=:MetaRowzId;";        
      $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, [
        "MetaRowzId" => $MetaRowzId
      ]);      
      $this->obj_param=$stmt->fetchObject();                                        
    }            
  }

  function fn_debug($bln_console=false){
    $this->obj_parent->fn_varDump($this->obj_param, "debug rowz", $bln_console);
  }

  function fn_hide(){    
    $this->fn_display(false);
  }
  function fn_show(){    
    $this->fn_display(true);
  }

  function fn_hideArchive(){    
    $this->fn_displayArchive(false);
  }
  function fn_showArchive(){    
    $this->fn_displayArchive(true);
  }

  function fn_displayArchive($bln_value){

    $bln_value=boolval($bln_value);
    $int_valueFlip=intval(!$bln_value);    
    $int_value=intval($bln_value);    

    $obj_param=$this->obj_param;
    $obj_parent=$this->obj_parent;
    $MetaRowzId=$obj_param->MetaRowzId;
    
    $str_sql="UPDATE `meta_rowz`.`meta_rowz` SET `ArchivePin`=:ArchivePin WHERE TRUE
    AND `MetaRowzId`=:MetaRowzId;";
    $stmt=$obj_parent->fn_executeSQLStatement($str_sql, [
      "MetaRowzId" => $MetaRowzId,
      "ArchivePin" => $int_value,      
    ]);      
  }

  function fn_delete(){    

    $obj_param=$this->obj_param;
    $obj_parent=$this->obj_parent;
    $MetaRowzId=$obj_param->MetaRowzId;

    $str_sql="DELETE FROM `meta_rowz`.`meta_rowz` WHERE TRUE 
    AND `MetaRowzId`=:MetaRowzId;";        
    $obj_parent->fn_executeSQLStatement($str_sql, [
      "MetaRowzId" => $MetaRowzId
    ]);      

    $str_sql="SELECT * FROM `meta_rowz`.`meta_rowz` WHERE `meta_rowz`.`ParentRowzId`=:ParentRowzId;";
    //$obj_parent->fn_addConsole("str_sql: ", $str_sql);
    //$obj_parent->fn_addConsole("obj_param->MetaRowzId: ", $obj_param->MetaRowzId);
    $arr_rows=$obj_parent->fn_fetchRowz($str_sql, [
      'ParentRowzId'=>$MetaRowzId
    ]);
    
    if($arr_rows){
      $int_rowCount=count($arr_rows);                                                
      for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
  
          $arr_row=$arr_rows[$i_row];                
          $MetaRowzId=$arr_row["MetaRowzId"];
          $obj_metaRowz=new metaRowz($obj_parent);
          $obj_metaRowz->fn_initialize($MetaRowzId);
          $obj_metaRowz->fn_delete();                
      }
    }
  }


  function fn_display($bln_value){    

    $bln_value=boolval($bln_value);
    $int_valueFlip=intval(!$bln_value);    

    $obj_param=$this->obj_param;
    $obj_parent=$this->obj_parent;
    $MetaRowzId=$obj_param->MetaRowzId;
    
    $str_sql="UPDATE `meta_rowz`.`meta_rowz` 
    SET     
    HiddenPin=$int_valueFlip
    WHERE TRUE
    AND `meta_rowz`.`MetaRowzId`=:MetaRowzId
    AND `meta_rowz`.`MetaRowzUserId`=:MetaRowzUserId    
    AND !`meta_rowz`.`SettingOperationPin`    
    ;";    
    
    /*
    $obj_parent->fn_addConsole("str_sql: ", $str_sql);
    $obj_parent->fn_addConsole("MetaRowzId: ", $MetaRowzId);
    $obj_parent->fn_addConsole("obj_parent->obj_userLogin->MetaUserId: ", $obj_parent->obj_userLogin->MetaUserId);
    return;
    //*/

    $obj_parent->fn_executeSQLStatement($str_sql, [
      "MetaRowzId" => $MetaRowzId,
      "MetaRowzUserId" =>$obj_parent->obj_userLogin->MetaUserId
    ]);      
    
    $str_sql="SELECT * FROM `meta_rowz`.`meta_rowz` WHERE TRUE
    AND `meta_rowz`.`ParentRowzId`=:ParentRowzId
    AND `meta_rowz`.`MetaRowzUserId`=:MetaRowzUserId    
    ;";
    //$obj_parent->fn_addConsole("str_sql: ", $str_sql);
    //$obj_parent->fn_addConsole("obj_param->MetaRowzId: ", $obj_param->MetaRowzId);
    $arr_rows=$obj_parent->fn_fetchRowz($str_sql, [
      'ParentRowzId'=>$MetaRowzId,
      "MetaRowzUserId" =>$obj_parent->obj_userLogin->MetaUserId
    ]);
    
    if($arr_rows){
      $int_rowCount=count($arr_rows);                                                
      for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
  
          $arr_row=$arr_rows[$i_row];                
          $MetaRowzId=$arr_row["MetaRowzId"];
          $obj_metaRowz=new metaRowz($obj_parent);
          $obj_metaRowz->fn_initialize($MetaRowzId);
          $obj_metaRowz->fn_display($bln_value);                
      }            
      
      //*/
    }
  }

  function fn_createRecord($obj_param){            

    $obj_parent=$this->obj_parent;

    
    if(is_null($obj_param->MetaViewId)){
      $obj_param->MetaViewId=0;
    }
    if(is_null($obj_param->MetaRowzGroup)){
      $obj_param->MetaRowzGroup="";
    }
    
    //generic metadata create Record      
    //AND `TemplateRowzId`=:TemplateRowzId
    //'TemplateRowzId'=>$obj_param->TemplateRowzId,

    $str_sql="SELECT `MetaRowzId` FROM `meta_rowz`.`meta_rowz` WHERE TRUE 
    AND `MetaRowzSystemId`=:MetaRowzSystemId 
    AND `MetaRowzUserId`=:MetaRowzUserId
    AND `ParentRowzId`=:ParentRowzId
    AND `MetaRowzName`=:MetaRowzName
    ";        
    $int_idRecord=$this->obj_parent->fn_fetchColumn($str_sql, [        
      'MetaRowzSystemId'=>$obj_param->MetaRowzSystemId,        
      'MetaRowzUserId'=>$obj_param->MetaRowzUserId,                              
      
      'ParentRowzId'=>$obj_param->ParentRowzId,
      'MetaRowzName'=>$obj_param->MetaRowzName      
    ]);                 
    
    
    if($obj_parent->DebugServer){
      /*
      $obj_parent->fn_varDump($obj_param, "META ROWZ PARAM ", true);          
      $obj_parent->fn_varDump($int_idRecord, "Int_idRecord", true);     
      $obj_parent->fn_varDump($str_sql, "META ROWZ CHECK RECORD str_sql", true);             
      //*/
    }         

    if(!empty($int_idRecord)){                
      return $int_idRecord;//already exist
    }    
    
    if(empty($obj_param->DebugPin)){
      $obj_param->DebugPin=0;
    }        

    
    if($obj_param->SettingOperationPin){

    }
    else if(empty($obj_param->ButtonConsole)){
      //$obj_parent->fn_addConsole("obj_param->ButtonConsole: ", $obj_param->ButtonConsole);    
      $obj_param->ButtonConsole="Record,SimpleSearch";
      $obj_param->SettingPin=1;
      if($obj_param->MetaRowzInterfacePin){
        $obj_param->ButtonConsole="Record,SimpleSearch";
        $obj_param->SettingPin=0;
      }
    }
    
    $arr_param= [        
      'MetaRowzSystemId'=>$obj_param->MetaRowzSystemId, 
      'MetaRowzUserId'=>$obj_param->MetaRowzUserId,       
      'MetaRowzInterfacePin'=>$obj_param->MetaRowzInterfacePin,       
      'MetaRowzPrivatePin'=>$obj_param->MetaRowzPrivatePin,       
      'MetaViewId'=>$obj_param->MetaViewId,            
      'TemplateRowzId'=>$obj_param->TemplateRowzId,               
      'ParentRowzId'=>$obj_param->ParentRowzId,               
      'MetaRowzName'=>$obj_param->MetaRowzName, 
      'MetaRowzTitle'=>$obj_param->MetaRowzTitle,       
      'LivePin'=>$obj_param->LivePin,
      'DebugPin'=>$obj_param->DebugPin,                        
      'RowzOrder'=>$obj_param->RowzOrder,       
      'RowzIcon'=>$obj_param->RowzIcon,       
      'ButtonConsole'=>$obj_param->ButtonConsole,                           
      'SettingPin'=>$obj_param->SettingPin,                           
      'DisabledPin'=>$obj_param->DisabledPin,             
      'HiddenPin'=>$obj_param->HiddenPin,      
      'ArchivePin'=>$obj_param->ArchivePin,       
      'AdminPin'=>$obj_param->AdminPin,       
      'LockOpenPin'=>$obj_param->LockOpenPin,       
      'AutoFetchPin'=>$obj_param->AutoFetchPin,                           
      'AutoOpenPin'=>$obj_param->AutoOpenPin,                        
      'MetaRowzGroup'=>$obj_param->MetaRowzGroup,
      'MetaTypeRowzWidget'=>$obj_param->MetaTypeRowzWidget,
      'MetaTypeRowzDashboard'=>$obj_param->MetaTypeRowzDashboard,
      'QueryList'=>$obj_param->QueryList,
      'QueryListDisabled'=>$obj_param->QueryListDisabled,            
      'Subdomain'=>$obj_param->Subdomain,
      'SettingOperationPin'=>$obj_param->SettingOperationPin
    ];
    $int_idRecord=$this->fn_insertRecord($arr_param);                              
    $this->fn_initialize($int_idRecord);      

    $obj_metaData=new metaData($this->obj_parent);
    //$obj_metaData->bln_debug=true;                
    $obj_paramMetaData=new stdClass;          
    $obj_paramMetaData->MetaDataSystemId=$obj_param->MetaRowzSystemId;
    $obj_paramMetaData->MetaDataOwnerId=$obj_param->MetaRowzUserId;          
    $obj_paramMetaData->DataSchemaName="meta_rowz";
    $obj_paramMetaData->DataTableName="meta_rowz";
    $obj_paramMetaData->DataKeyName="MetaRowzId";        
    $obj_paramMetaData->DataKeyValue=$int_idRecord;                                                            
    $obj_paramMetaData->MetaPermissionTag="#ALL";          
    $obj_metaData->fn_createRecord($obj_paramMetaData);     

    return $int_idRecord;
    
  }

    function fn_insertRecord($arr_param){   

      $obj_parent=$this->obj_parent;

      $str_sql="

      INSERT INTO `meta_rowz`.`meta_rowz`
      (   
          `meta_rowz`.`MetaRowzSystemId`,                        
          `meta_rowz`.`MetaRowzUserId`,                      
          `meta_rowz`.`MetaRowzInterfacePin`,                    
          `meta_rowz`.`MetaRowzPrivatePin`,                    
          `meta_rowz`.`MetaViewId`,
          `meta_rowz`.`TemplateRowzId`,            
          `meta_rowz`.`ParentRowzId`,          
          `meta_rowz`.`MetaRowzName`,
          `meta_rowz`.`MetaRowzTitle`,
          `meta_rowz`.`LivePin`,
          `meta_rowz`.`DebugPin`,
          `meta_rowz`.`RowzOrder`,                                      
          `meta_rowz`.`RowzIcon`,                            
          `meta_rowz`.`ButtonConsole`,                
          `meta_rowz`.`SettingPin`,                          
          `meta_rowz`.`DisabledPin`,        
          `meta_rowz`.`HiddenPin`,          
          `meta_rowz`.`ArchivePin`,          
          `meta_rowz`.`AdminPin`,          
          `meta_rowz`.`LockOpenPin`,          
          `meta_rowz`.`AutoFetchPin`,        
          `meta_rowz`.`AutoOpenPin`,        
          `meta_rowz`.`MetaRowzGroup`,
          `meta_rowz`.`MetaTypeRowzWidget`,
          `meta_rowz`.`MetaTypeRowzDashboard`,
          `meta_rowz`.`QueryList`,
          `meta_rowz`.`QueryListDisabled`,          
          `meta_rowz`.`Subdomain`,          
          `meta_rowz`.`SettingOperationPin`          
      )
      VALUES
      (   
          :MetaRowzSystemId, 
          :MetaRowzUserId,          
          :MetaRowzInterfacePin,                    
          :MetaRowzPrivatePin,                    
          :MetaViewId,
          :TemplateRowzId,            
          :ParentRowzId,          
          :MetaRowzName,
          :MetaRowzTitle,
          :LivePin,
          :DebugPin,
          :RowzOrder,                            
          :RowzIcon,                            
          :ButtonConsole,
          :SettingPin,          
          :DisabledPin,        
          :HiddenPin,          
          :ArchivePin,
          :AdminPin,
          :LockOpenPin,
          :AutoFetchPin,        
          :AutoOpenPin,        
          :MetaRowzGroup,
          :MetaTypeRowzWidget,
          :MetaTypeRowzDashboard,
          :QueryList,
          :QueryListDisabled,          
          :Subdomain,
          :SettingOperationPin
      )
      ;";               


      $stmt=$obj_parent->fn_executeSQLStatement($str_sql, $arr_param);            
      return $obj_parent->fn_getLastInsertId();                            
    }

    
}//END CLASS  
  ///////////////////////////DATAMANAGER