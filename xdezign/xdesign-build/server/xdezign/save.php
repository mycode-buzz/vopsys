<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

/////////////////////////HEADER
require_once __DIR__."/package.php";
/////////////////////////HEADER


class page extends package{
  function __construct() {          
    parent::__construct();
  }            
  function fn_executePage() {        
    parent::fn_executePage();          

    

    $obj_post=$this->obj_post;                           
    
    switch($obj_post->Action){                             
    case "save":
          $this->fn_saveComponent();
        break;                
        case "saveAs":
          $this->fn_saveAsComponent();
        break;            
        case "versionProject":
          $this->fn_versionComponent();
        break;                        
        case "releaseProject":
          //global $SYSTEM_APPID;        
          //N.B WHEN CREATING NEW VERISION OF XDEZIGN , BE SURE TO SET STAGERELEASE TO TRUE          
          $this->fn_releaseProject();
        break;                           
      default:          
        $this->fn_setError("APP ACTION Not Handled: [".$obj_post->Action."]");          
        exit;
    }
  }
  
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////

  function fn_versionComponent(){



    //save the instance first.
    //requires obj post to have an accurate dependent id string
    //puboish does use the same  route "actionSave" which runs fn_compileDependentId
    $bln_version=true;    
    $this->fn_saveComponent($bln_version);          
    
    $obj_ini=new stdClass();
    $obj_ini->RecordId=$this->obj_post->RecordId;        
    $obj_ini->bln_version=$bln_version;                    
    $this->fn_packageProject($obj_ini);
  }

function fn_releaseProject(){

  $this->obj_post->CreateRelease=true;          
  
  $obj_ini=new stdClass();
  $obj_ini->RecordId=$this->obj_post->RecordId;        
  $obj_ini->bln_version=false;                      
  $this->fn_packageProject($obj_ini);

}

function fn_insertInstance($int_idRecord){

  $obj_post=$this->obj_post;      
  
  $str_nameRecord=$obj_post->RecordName;
  $str_typeRecord=$obj_post->RecordType;
  $str_objectData=$obj_post->ObjectData;
  
  $str_sql="INSERT INTO `vm-xdesign`.`xdesign_instance` (`id`,`Name`,`Type`,`Serialize`) VALUES (:int_idRecord, :str_nameRecord,:str_typeRecord,:str_objectData);";      
  //$this->fn_addEcho($str_sql);
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    'int_idRecord'=>$int_idRecord, 
    'str_nameRecord'=>$str_nameRecord,
    'str_typeRecord'=>$str_typeRecord,
    'str_objectData'=>$str_objectData,
  ]);  
}

function fn_createMetaData($int_idRecord){
  $obj_param=new stdClass;                  
  $obj_param->MetaDataSystemId=100;
  $obj_param->MetaDataOwnerId=100;
  $obj_param->DataSchemaName="vm-xdesign";
  $obj_param->DataTableName="xdesign_instance";
  $obj_param->DataKeyName="id";
  $obj_param->DataKeyValue=$int_idRecord;
  $obj_param->MetaPermissionTag="";  

  $obj_metaData=new metaData($this);
  $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_param);                                          
  
}



  function fn_saveAsComponent(){

    
    
    $obj_post=$this->obj_post;      

    $int_idRecord=$obj_post->RecordId;            
    $int_dynamicPin=$this->fn_get_intBool($obj_post->DynamicPin);      
    if($int_dynamicPin){
      //return;
    }    
    
    $this->fn_insertInstance($int_idRecord);   
    
    $obj_post->RecordId=$this->fn_getLastInsertId();   

    $this->fn_createMetaData($obj_post->RecordId);   
    
    //Save id record direct into the object data
    $obj_ObjectData=json_decode($obj_post->ObjectData);
    $obj_ObjectData->obj_design->int_idRecord=$obj_post->RecordId;      
    $obj_post->ObjectData=json_encode($obj_ObjectData);          
    $this->fn_saveComponent();          
  }                 
  
  function fn_saveComponent($bln_version=false){      

    //$this->fn_cleanupInstanceTable();//may prevent new components from savng ?

    //requires obj post to have an accurate dependent id string    
    
    $obj_post=$this->obj_post;      
    $obj_post->LastVersionDate=$this->str_runtime;
    if(!$this->fn_validateDate($obj_post->CreatedDate)){$obj_post->CreatedDate="1001-01-01 00:00:00";}    
    if(!$this->fn_validateDate($obj_post->ModifiedDate)){$obj_post->ModifiedDate=date("Y-m-d H:i:s");}            

    $int_dynamicPin=$this->fn_get_intBool($obj_post->DynamicPin);
    if($int_dynamicPin){
      //return;
    }                 


    
    //MANAGE INSTANCE SAVE
    $obj_arg=new stdClass();          
    //shared args
    $obj_arg->str_typeRecord=$obj_post->RecordType;
    $obj_arg->str_createdDate=$obj_post->CreatedDate;
    $obj_arg->str_modifiedDate=$obj_post->ModifiedDate;

    //used by instance
    $obj_arg->str_nameRecord=$obj_post->RecordName;
    $obj_arg->str_nameShortRecord=$obj_post->RecordShortName;    
    $obj_arg->int_classController=$this->fn_get_intBool($obj_post->ClassController);
    $obj_arg->int_editPinRelease=$this->fn_get_intBool($obj_post->EditPinRelease);
    $obj_arg->int_editPin=$this->fn_get_intBool($obj_post->EditPin);    
    $obj_arg->int_palettePinRelease=$this->fn_get_intBool($obj_post->PalettePinRelease);
    $obj_arg->int_palettePin=$this->fn_get_intBool($obj_post->PalettePin);
    $obj_arg->str_lastVersionDate=$this->obj_post->LastVersionDate;
    if(empty($obj_post->CategoryName)){
      $obj_post->CategoryName="Xtra";
    }
    $obj_arg->str_categoryName=$obj_post->CategoryName;
    $obj_arg->str_releaseLabel=$obj_post->ReleaseLabel;
    $obj_arg->str_dependentId=$obj_post->DependentId;
    $obj_arg->str_objectData=$obj_post->ObjectData;      
    $obj_arg->int_idRecordInstance=$obj_post->RecordId;
    
    
    //used by component
    $obj_arg->str_recordExtend=$obj_post->RecordExtend;      
    $obj_arg->str_classList=$obj_post->ClassList;
    $obj_arg->str_code=$obj_post->ComponentCode;   
    
    
    //MANAGE INSTANCE SAVE
    $this->fn_manageInstanceSave($obj_arg);    
    
    //MANAGE COMPONENT SAVE, IF ANY    
    $this->fn_manageComponentSave($obj_arg);


  }
    
  function fn_manageInstanceSave($obj_arg){
    
    $this->fn_updateInstanceToDatabase($obj_arg);
    
    if(empty($this->bln_sendBackObjectDate)){
      $obj_post->ObjectData="{}";
    }          
    
    
    //EXPORT INSTANCE PARAMETERS TO FILE     
    $this->fn_exportInstanceToFile($obj_arg);                
    
    $this->fn_createMetaData($obj_arg->int_idRecordInstance);   
  }


  function fn_updateInstanceToDatabase($obj_arg){

    
    $str_sql="UPDATE `vm-xdesign`.`xdesign_instance` SET `Name`=:Name, `NameShort`=:NameShort,`Type`=:Type, `ClassController`=:ClassController, `EditPinRelease`=:EditPinRelease,`EditPin`=:EditPin,`PalettePinRelease`=:PalettePinRelease, `PalettePin`=:PalettePin, `LastVersionDate`=:LastVersionDate, `CategoryName`=:CategoryName, `ReleaseLabel`=:ReleaseLabel, `DependentId`=:DependentId, `Serialize`=:Serialize, `CreatedDate`=:CreatedDate, `ModifiedDate`=:ModifiedDate WHERE `id`=:id ;";    
    $this->fn_executeSQLStatement($str_sql, [
      'Name' => $obj_arg->str_nameRecord,
      'NameShort' => $obj_arg->str_nameShortRecord,
      'Type' => $obj_arg->str_typeRecord,                    
      'ClassController' => $obj_arg->int_classController,      
      'EditPinRelease' => $obj_arg->int_editPinRelease,      
      'EditPin' => $obj_arg->int_editPin,
      'PalettePinRelease' => $obj_arg->int_palettePinRelease,    
      'PalettePin' => $obj_arg->int_palettePin,
      'LastVersionDate' => $obj_arg->str_lastVersionDate,
      'CategoryName' => $obj_arg->str_categoryName,
      'ReleaseLabel' => $obj_arg->str_releaseLabel,
      'DependentId' => $obj_arg->str_dependentId,
      'Serialize' => $obj_arg->str_objectData,      
      'CreatedDate' => $obj_arg->str_createdDate,
      'ModifiedDate' => $obj_arg->str_modifiedDate,
      'id' => $obj_arg->int_idRecordInstance        
    ]);                                        
    //$this->fn_addConsole("fn_updateInstanceToDatabase sql: ".$str_sql);
    //$this->fn_varDump($obj_arg, "obj_arg");
    
  }   

  //Export instance to file used by save
function fn_exportInstanceToFile($obj_arg){        
  
    $str_path_folder=$this->fn_getFolderPathInstanceRecord($obj_arg->int_idRecordInstance);        
    if(!is_dir($str_path_folder)){
      $this->fn_createFolder($str_path_folder);    
      if(!is_dir($str_path_folder)){
        return;
      }            
    }
    
    $str_value=$obj_arg->str_nameRecord;   
    $str_path_file=$str_path_folder."/"."Name";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values    
      file_put_contents($str_path_file, $str_value);                  
    }
    
    $str_value=$obj_arg->str_nameShortRecord;   
    $str_path_file=$str_path_folder."/"."NameShort";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values    
      file_put_contents($str_path_file, $str_value);                  
    }
    
    $str_value=$obj_arg->str_typeRecord;
    $str_path_file=$str_path_folder."/"."Type";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values    
      file_put_contents($str_path_file, $str_value);                  
    }   

    $int_value=$obj_arg->int_classController;
    $str_path_file=$str_path_folder."/"."ClassController";
    $this->fn_deleteFile($str_path_file);
    if($int_value){//dont export default values    
      file_put_contents($str_path_file, $int_value);                    
    }    
    

    $int_value=$obj_arg->int_editPinRelease;
    $str_path_file=$str_path_folder."/"."EditPinRelease";
    $this->fn_deleteFile($str_path_file);
    if($int_value){//dont export default values    
      file_put_contents($str_path_file, $int_value);                    
    }    
  
    $int_value=$obj_arg->int_editPin;
    $str_path_file=$str_path_folder."/"."EditPin";
    $this->fn_deleteFile($str_path_file);
    if($int_value){//dont export default values    
      file_put_contents($str_path_file, $int_value);                    
    }

    $int_value=$obj_arg->int_palettePinRelease;
    $str_path_file=$str_path_folder."/"."PalettePinRelease";
    $this->fn_deleteFile($str_path_file);
    if($int_value){//dont export default values    
      file_put_contents($str_path_file, $int_value);                    
    }   
    
    
    $int_value=$obj_arg->int_palettePin;
    $str_path_file=$str_path_folder."/"."PalettePin";
    $this->fn_deleteFile($str_path_file);
    if($int_value){//dont export default values    
      file_put_contents($str_path_file, $int_value);                    
    }
    
    $str_value=$obj_arg->str_lastVersionDate;
    $str_path_file=$str_path_folder."/"."LastVersionDate";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){    
      if($str_value!=="notset"){      
        file_put_contents($str_path_file, $str_value);                  
      }
    }    
    
    $str_value=$obj_arg->str_categoryName;
    $str_path_file=$str_path_folder."/"."CategoryName";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){    
      if($str_value!=="notset"){      
        file_put_contents($str_path_file, $str_value);                  
      }
    }  

    $str_value=$obj_arg->str_releaseLabel;
    $str_path_file=$str_path_folder."/"."ReleaseLabel";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){    
      if($str_value!=="notset"){      
        file_put_contents($str_path_file, $str_value);                  
      }
    }  
    
    $str_value=$obj_arg->str_dependentId;
    $str_path_file=$str_path_folder."/"."DependentId";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values    
      file_put_contents($str_path_file, $str_value); 
    }                   
    
    $str_value=$obj_arg->str_objectData;      
    $str_path_file=$str_path_folder."/"."Serialize";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value) && $str_value!=="{}"){//dont export default values      
      file_put_contents($str_path_file, $str_value);                      
    }
    
    $str_value=$obj_arg->str_createdDate;
    $str_path_file=$str_path_folder."/"."CreatedDate";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values
      file_put_contents($str_path_file, $str_value); 
    }                   
    
    $str_value=$obj_arg->str_modifiedDate;
    $str_path_file=$str_path_folder."/"."ModifiedDate";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values    
      file_put_contents($str_path_file, $str_value); 
    }                   
    
    
  }  
  //Export instance to file used by save

  function fn_manageComponentSave($obj_arg){      
    

    $obj_post=$this->obj_post;                

    $bln_classController=$obj_arg->int_classController;//very important      
    if(!$bln_classController){
      return;//must return
    }
    
    if(strtolower($obj_arg->str_typeRecord)==="component"){//saftey if above fails 
      return;//must return
    }

    if(strtolower($obj_arg->str_typeRecord)==="tag"){//saftey if above fails 
      return;//must return
    }

    $obj_arg->str_code="";
    //we are not interested in saving code from the ui.
    
    $int_idRecordComponent=$this->fn_getComponentId($obj_arg->str_typeRecord);//check on type only             
    if($int_idRecordComponent===0){        
      $this->fn_addEcho("NEW CLASS: RE-VERSION XDESIGN AND RE-LOAD REQUIRED: ".$obj_arg->str_createdDate);
      $this->fn_addEcho("int_idRecordComponent: ".$int_idRecordComponent);
      $obj_post->RELOADREQUIRED=true;      
      $obj_post->ClassController=true;   
      $str_sql="INSERT INTO `vm-xdesign`.`xdesign_component` (`id`,`Type`,`CreatedDate`) SELECT :id,:Type,:CreatedDate;";              
      $stmt=$this->fn_executeSQLStatement($str_sql, [
        'id' => $int_idRecordComponent,        
        'Type' => $obj_arg->str_typeRecord,        
        'CreatedDate' => $obj_arg->str_createdDate
        
      ]);            
      
      
      if(empty($obj_arg->str_recordExtend)){
        $obj_arg->str_recordExtend="notset";
      }
      $str_recordExtend=$obj_arg->str_recordExtend;
      if($str_recordExtend==="notset"){
        $str_recordExtend="component";
      }

      $obj_arg->str_code=<<<heredoc
      //XSTART component/$obj_arg->str_typeRecord
      class $obj_arg->str_typeRecord extends $str_recordExtend{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/$obj_arg->str_typeRecord        
heredoc;
      
      $int_idRecordComponent=$this->fn_getLastInsertId();
    }         

    $obj_arg->int_idRecordComponent=$int_idRecordComponent;
    $this->fn_updateFileToComponentTable($obj_arg);      
    $this->fn_exportComponentToFile($obj_arg);        

   
  }

  
  function fn_insertComponentFromUI($int_idRecord, $str_createdDate){                    

    $this->fn_addEcho("checkpoint 1");
      exit;      
    
    if($int_idRecord===0){                
      
    }
  }
  function fn_updateFileToComponentTable($obj_arg){             
    
    $str_sql="UPDATE `vm-xdesign`.`xdesign_component` SET `Type`=:Type, `Extend`=:Extend, `ClassList`=:ClassList, `ModifiedDate`=:ModifiedDate WHERE `id`=:id";    
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'id' => $obj_arg->int_idRecordComponent,
      'Type' => $obj_arg->str_typeRecord,
      'Extend' => $obj_arg->str_recordExtend,                    
      'ClassList' => $obj_arg->str_classList,      
      'ModifiedDate' => $obj_arg->str_modifiedDate
    ]);                                        

    //*
    if(!empty($obj_arg->str_code && $this->obj_post->RELOADREQUIRED)){
      $str_sql="UPDATE `vm-xdesign`.`xdesign_component` SET `Code`=:Code WHERE `id`=:id;";                        
      $stmt=$this->fn_executeSQLStatement($str_sql, [
        'id' => $obj_arg->int_idRecordComponent,
        'Code' => $obj_arg->str_code
      ]);                                          
    }      
    //*/
  }

  //used by save 
  function fn_exportComponentToFile($obj_arg){              
    
    $str_path_folder=$this->fn_getFolderPathComponentRecord($obj_arg->str_typeRecord);
    if(strtolower($obj_arg->str_typeRecord)==="component"){
      return;
    }      
    
    if(!is_dir($str_path_folder)){
      $this->fn_createFolder($str_path_folder);    
      if(!is_dir($str_path_folder)){
        return;
      }            
    }
    
    $str_value=$obj_arg->str_recordExtend;  
    $str_path_file=$str_path_folder."/"."Extend";
    $this->fn_deleteFile($str_path_file);
    if($str_value!=="notset"){    
      file_put_contents($str_path_file, $str_value);                  
    }      
  
    $str_value=$obj_arg->str_classList;  
    $str_path_file=$str_path_folder."/"."ClassList";
    $this->fn_deleteFile($str_path_file);
    if($str_value!=="notset"){    
      file_put_contents($str_path_file, $str_value);                  
    }      
    
    if(!empty($obj_arg->str_code && $this->obj_post->RELOADREQUIRED)){    //dont create folder etc if empty code    
    
      $str_file_path=$this->fn_getFilePathComponentRecordColumn($obj_arg->str_typeRecord, "component.js");                      
      $bln_exist=file_exists($str_file_path);    
      if(!$bln_exist){//If Folder does not exist        
        $str_value=$obj_arg->str_code;
        if(!empty($str_value)){    
          $str_path_file=$str_path_folder."/"."component.js";
          file_put_contents($str_path_file, $str_value);
        }    
      }  
    }
  
    $str_value=$obj_arg->str_createdDate;
    $str_path_file=$str_path_folder."/"."CreatedDate";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values
      file_put_contents($str_path_file, $str_value); 
    }                   
  
    $str_value=$obj_arg->str_modifiedDate;
    $str_path_file=$str_path_folder."/"."ModifiedDate";
    $this->fn_deleteFile($str_path_file);
    if(!empty($str_value)){//dont export default values    
      file_put_contents($str_path_file, $str_value); 
    }                   
  
  } 
  
  
  
  


  
}
/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
