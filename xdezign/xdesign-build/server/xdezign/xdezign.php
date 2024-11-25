<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class xdezign extends interface_datamanager{
  function __construct() {      
    parent::__construct();
  }            
  function fn_executePage() { 
    
    parent::fn_executePage();          

    $this->fn_setMySQLGroupConcatMaxLength();        
    
    $this->fn_intializeServerPostXDesign();
    $this->fn_setPath();      
  }

  function fn_intializeServerPostXDesign(){
    $obj_post=$this->obj_post;      
    if(empty($obj_post->RecordId)){$obj_post->RecordId="0";}       
    if(empty($obj_post->DesignId)){$obj_post->DesignId="DesignIdNotSet";}                                             
    if(empty($obj_post->RecordName)){$obj_post->RecordName="NewProject";}                             
    if(empty($obj_post->RecordType)){$obj_post->RecordType="notset";}                                                                

    if(empty($obj_post->CreatedDate)){
      $obj_post->CreatedDate="1101-01-01 00:00:00";
    }
    if(empty($obj_post->ModifiedDate)){
      $obj_post->ModifiedDate="1101-01-01 00:00:00";
    }
    if(empty($obj_post->LastVersionDate)){
      $obj_post->LastVersionDate="1101-01-01 00:00:00";
    }
    
    $this->bln_sendBackObjectDate=true;      
    
    if(empty($obj_post->Action)){
      $obj_post->Action="";
    }
    if(empty($obj_post->Context)){
      $obj_post->Context="";
    }    
    if(empty($obj_post->QueryExpression)){
      $obj_post->QueryExpression="";
    }              
    if(empty($obj_post->QueryString)){
      $obj_post->QueryString="";
    }              
    if(empty($obj_post->QueryList)){
      $obj_post->QueryList="";
    }      
    if(empty($obj_post->QueryListParent)){
      $obj_post->QueryListParent="";
    }          
    if(empty($obj_post->DependentId)){
      $obj_post->DependentId="";
    }      

    if(empty($obj_post->ClassList)){        
      $obj_post->ClassList="notset";        
    }      
    else{
      $obj_post->ClassList=trim($obj_post->ClassList, ",");        
    }        
    if(empty($obj_post->RecordName)){
      $obj_post->RecordName="New Project";
    }
    if(empty($obj_post->RecordShortName)){
      $obj_post->RecordShortName="myproject";
    }
    if(empty($obj_post->NotifierId)){
      $obj_post->NotifierId="NotifierIdNotSet";
    }                
    if(empty($obj_post->RecordExtend)){
      $obj_post->RecordExtend="notset";
    }                  

    if(empty($obj_post->ClassController)){        
      $obj_post->ClassController=false;        
    }      

    if(empty($obj_post->EditPinRelease)){        
      $obj_post->EditPinRelease=false;
    }          

    if(empty($obj_post->EditPin)){        
      $obj_post->EditPin=false;
    }      

    if(empty($obj_post->PalettePinRelease)){        
      $obj_post->PalettePinRelease=false;
    }          

    if(empty($obj_post->PalettePin)){        
      $obj_post->PalettePin=false;
    }      
    
    if(empty($obj_post->CatQuery)){        
      $obj_post->CatQuery="notset";        
    }            
    if(empty($obj_post->ReleaseLabel)){        
      $obj_post->ReleaseLabel="notset";        
    }          
    if(empty($obj_post->CategoryName)){
      $obj_post->CategoryName="Xtra";
    }
    if(empty($obj_post->DynamicPin)){        
      $obj_post->DynamicPin=false;
    }          
    if(empty($obj_post->ComponentCode)){        
      $obj_post->ComponentCode=false;
    }            
    if(empty($obj_post->HasError)){
      $obj_post->HasError=false;
    }
    if(empty($obj_post->ErrorMessage)){
      $obj_post->ErrorMessage="";
    }              

    //$this->fn_debugPost();
    
  }

  function fn_debugPost(){
    $obj_post=$this->obj_post;      
    //$this->fn_addEcho("obj_post->ClassList: ".$obj_post->ClassList);
    $this->fn_addEcho("obj_post->RecordExtend: ".$obj_post->RecordExtend);
  }

  function fn_getVersionNumberAppName($str_name_app){
    return $str_name_app."-".$this->str_versionNumber;
    //return $this->str_versionNumber;
  }
  function fn_setPath(){       
    
    /////////////////////////GENERIC NAME                  
    $this->str_name_folder_rucksack="rucksack";   
    $this->str_name_folder_asset="asset";         
    $this->str_name_folder_shared="shared";       
    
    $this->str_name_folder_build="_build";
    $this->str_name_folder_app="app";                    
    $this->str_name_folder_compile="compile";                          
    $this->str_name_folder_instance="instance";//used within build and compile
    $this->str_name_folder_DBStore="dbstore";              
    $this->str_name_folder_server="server";              
    $this->str_name_folder_component="component";//used within the app folder
    
    $this->dbtype_runtime="RunTimeCode";                   
    $this->dbtype_designtime="DesigntimeCode";
    $this->dbtype_template="TemplateCode";            
    /////////////////////////GENERIC NAME                        

    //////////////////////////BUILD      
    $this->str_folderPathBuild=ROOT."/".$this->str_name_folder_build;
    $this->str_folderPathBuildInstance=$this->str_folderPathBuild."/".$this->str_name_folder_instance;                
    //////////////////////////BUILD

    //////////////////////////APP      
    $this->str_folderPathApp=ROOT."/".$this->str_name_folder_app;
    //////////////////////////APP

    //////////////////////////COMPONENT
    $this->str_folderPathComponent=$this->str_folderPathApp;
    //////////////////////////COMPONENT
    
    //////////////////////////INSTANCE
    $this->str_folderPathInstance=ROOT."/".$this->str_name_folder_instance;                  
    //////////////////////////INSTANCE

    //////////////////////////SERVER
    $this->str_folderPathServer=ROOT."/".$this->str_name_folder_server;                  
    //////////////////////////SERVER

    //////////////////////////SERVER
    $this->str_folderPathServer=ROOT."/".$this->str_name_folder_server;                  
    //////////////////////////SERVER

    //////////////////////////COMPILE
    $this->str_folderPathCompile=dirname(__FILE__)."/".$this->str_name_folder_compile;                      
    //////////////////////////COMPILE

    //////////////////////////SQL
    $this->str_protectedInstanceCriteria="(CategoryName IS NOT NULL AND CategoryName<>'notset' AND CategoryName<>'' AND CategoryName<>'Xtra')";
    //////////////////////////SQL

    
    
    
    //////////////////////////PACKAGE
    $this->str_name_folder_package="package";
    $this->str_versionNumber="version-".$this->str_UniqueName;
    $this->str_versionNumberAppName=$this->fn_getVersionNumberAppName($this->obj_post->RecordShortName);      
    $this->str_name_folder_version=$this->str_versionNumberAppName;
    $this->str_name_folder_hotinstall="xdesign-build";
    
    $this->str_name_file_index="index.php";            
    $this->str_name_file_project=$this->str_name_folder_version.".mjs";
    $this->str_name_file_hotinstall=$this->str_name_folder_hotinstall.".mjs";
    //////////////////////////PACKAGE
    
    
  } 

  
  function fn_formatResponse($arr_row){
    $obj_post=$this->obj_post;
    if($arr_row){
      $obj_post->RecordId=$arr_row["id"];
      $obj_post->RecordName=$arr_row["Name"];        
      $obj_post->RecordType=$arr_row["Type"];        
      $obj_post->ObjectData=$arr_row["Serialize"];                              
    }
  }  
  function fn_formatResponseComponentCode($arr_row){
    $obj_post=$this->obj_post;
    if($arr_row){
      $obj_post->RecordId=$arr_row["id"];        
      $obj_post->RecordType=$arr_row["Type"];        
      $obj_post->RecordExtend=$arr_row["Extend"];                
      $obj_post->ComponentCode=$arr_row["Code"];                 
    }
  } 

               

  //BUILD PATH INSTANCE    
  function fn_getBuildFolderPathInstanceRecord($int_idRecord){  
    
    $str_value=$this->str_folderPathBuildInstance."/".$int_idRecord;          
    return $str_value;
  }                
  function fn_getBuildFolderPathPackageViaID($int_idRecord){

    return $this->fn_getBuildFolderPathInstanceRecord($int_idRecord)."/".$this->str_name_folder_package;      
  }                    
  //BUILD PATH INSTANCE

  //COMPONENT PATH 
  function fn_getFolderPathComponentRecord($str_name_component){                
    $str_value=$this->str_folderPathApp."/".$str_name_component."/".$this->str_name_folder_component;          
    return $str_value;
    
  }        
  function fn_getFilePathComponentRecordColumn($str_name_component, $str_name_file){    

    $str_path_folder=$this->fn_getFolderPathComponentRecord($str_name_component);
    $str_file_path=$str_path_folder."/".$str_name_file;      
    return $str_file_path;      
  }           
  //COMPONENT PATH 

  //PATH INSTANCE    
  function fn_getFolderPathInstanceRecord($int_idRecord){  
    
    $str_value=$this->str_folderPathInstance."/".$int_idRecord;          
    return $str_value;
  }            

  function fn_getFilePathInstanceRecordColumn($int_idRecord, $str_column){    
    
    $str_path_folder=$this->fn_getFolderPathInstanceRecord($int_idRecord);
    $str_file_path=$str_path_folder."/".$str_column;      
    return $str_file_path;      
  }  
  
  function fn_isProtectedInstance($int_idRecord){          
  
    $str_sql="SELECT `Id` FROM `vm-xdesign`.`xdesign_instance` WHERE `Id`=:Id AND ".$this->str_protectedInstanceCriteria.";";    
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'Id' => $int_idRecord
    ]);    
    $arr_row=$stmt->fetch();
    if($arr_row){
      return true;                    ;
    }
    return false;
  }                       
  function fn_isProtectedComponent($obj_instance){          

    $bln_isProtected=false;

    //Protected because not clas controller
    if(empty($obj_instance->ClassController)){      
      $bln_isProtected=true;
    }
    
    //Protected because type is component 
    if($obj_instance->Type==="component"){$bln_isProtected=true;}

    //Protected because in use by other instant
    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` where `xdesign_instance`.`Type`=:str_typeRecord;";            
    $stmt=$this->fn_executeSQLStatement($str_sql, ['str_typeRecord' => $obj_instance->Type]);              
    $arr_row=$stmt->fetch();
    if($arr_row){    
      $bln_isProtected=true;
    }

    if($bln_isProtected){
      //$this->fn_addEcho("Component is protected: " .$obj_instance->Type);                                  
      return true;
    }
    else{
      //$this->fn_addEcho("Component is not protected: " .$obj_instance->Type);                                  
      return false;
    }    
  }                       
  function fn_existInstance($int_idRecord){
      
    $obj_post=$this->obj_post;

    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE `id`=?;";            
    $stmt=$this->fn_executeSQLStatement($str_sql, [$int_idRecord]);          
    $arr_row=$stmt->fetch();
    if($arr_row){
      return true;
    }
    return false;
  }  
  function fn_existComponent($str_typeRecord){
      
    $obj_post=$this->obj_post;
  
    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE `type`=?;";            
    $stmt=$this->fn_executeSQLStatement($str_sql, [$str_typeRecord]);      
    $arr_row=$stmt->fetch();
    if($arr_row){
      return true;
    }
    return false;
  }    
  function fn_getInstance($int_idRecord){

    $obj_instance=new stdClass();          
    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE `Id`=:Id;";
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'Id' => $int_idRecord
    ]);
    
    $arr_row=$stmt->fetch();    
    if(!$arr_row){      
      return $obj_instance;
    }    
    if($arr_row){
      $obj_instance->Id=$arr_row["Id"];
      $obj_instance->Type=$arr_row["Type"];      
      $obj_instance->ClassController=$arr_row["ClassController"];      
    }    
    return $obj_instance;
  }
  function fn_getComponentId($str_typeRecord, $int_idSearch=0){
    

    $str_sql="SELECT Id FROM `vm-xdesign`.`xdesign_component` WHERE ";
    $str_sql.="Type =? ";    
    $myArr=[$str_typeRecord];  
    if($int_idSearch>0){
      $str_sql.="AND Id=?";    
      array_push($myArr, $int_idSearch);
    }
    $str_sql.=";";      
    $stmt=$this->fn_executeSQLStatement($str_sql, $myArr);    
    $arr_row=$stmt->fetch();        
    $int_idRecord=0;  
    if($arr_row){$int_idRecord=$arr_row["Id"];}
    return $int_idRecord;  
  }
  function fn_removeOrphanFolderInstanceFiles(){
    
    $arr_fobj = scandir($this->str_folderPathInstance);
    
    foreach ($arr_fobj as $str_name) {  
      if($str_name=="." || $str_name==".."){
        continue;
      }
    
      $int_idRecord=$str_name;    
      $this->fn_removeOrphanFolderInstanceFile($int_idRecord);          
    }
  }
  function fn_removeOrphanFolderInstanceFile($int_idRecord){
    
    if($int_idRecord==="0"){return;}      
    
    $str_path=$this->str_folderPathInstance."/".$int_idRecord;      
    if(!is_dir($str_path)){return;}
    $bln_exist=$this->fn_existInstance($int_idRecord);          
    if(!$bln_exist){
      $this->fn_addEcho("fn_removeOrphanFolderInstanceFile: ".$str_path);
      $this->fn_deleteFolder($str_path);
    }
  }   
  function fn_removeOrphanFolderComponentFiles(){
  
    $arr_fobj = scandir($this->str_folderPathComponent);
    
    foreach ($arr_fobj as $str_typeRecord) {  
      if($str_typeRecord=="." || $str_typeRecord==".."){
        continue;
      }
      $this->fn_removeOrphanFolderComponentFile($str_typeRecord);          
    }
  }
  function fn_removeOrphanFolderComponentFile($str_typeRecord){
    
    if(empty($str_typeRecord)){return;}      
    
    $str_path=$this->str_folderPathComponent."/".$str_typeRecord;      
    if(!is_dir($str_path)){return;}
    $bln_exist=$this->fn_existComponent($str_typeRecord);      
    if(!$bln_exist){
      //$this->fn_addEcho("fn_deleteFolder: " .$str_path);                        
      $this->fn_deleteFolder($str_path);
    }
  } 
  //PATH INSTANCE     
  
  ////XDESIGN FOLDER
  function fn_validateDate($date, $format = 'Y-m-d H:i:s'){
    $d = DateTime::createFromFormat($format, $date);      
    return $d && $d->format($format) === $date;
  }  
  
  function fn_getUniqueName(){
    return date("Y-m-d-H-i-s").rand(0,100);
  }
  function fn_getSQLDate(){
    return date("Y-m-d H:i:s");
  }
  
  function fn_addEchoArray($str_title, $arr){      
    $int_count=0;      
    $this->fn_addEcho($str_title);
    foreach ($arr as &$str_value) {          
        $this->fn_addEcho($int_count.": ".$str_value);
        $int_count++;
    }    
  }

  function fn_addBracketArray(&$arr_item, $str_bracket){

    foreach ($arr_item as &$str_item) {
      $str_item=$str_bracket.trim($str_item).$str_bracket;
    }
  }
  
  
  function fn_getStringFromFile($str_file_path, $str_default){  
    
    if(file_exists($str_file_path)){
      $str_value=file_get_contents($str_file_path);    
    }
    else{
      $str_value=$str_default;
    }    
    //N.B Bizzarley, allowing string value of "true" to be returned causes error. Likely also applies to false.
    if($str_value==="true"){$str_value=true;}
    if($str_value==="false"){$str_value=false;}
    if($str_value==="yes"){$str_value=true;}
    if($str_value==="no"){$str_value=false;}
    return $str_value;
    }
    
    function fn_getBooleanFromFile($str_file_path, $str_default){
    $str_value=false;
    if(file_exists($str_file_path)){
      $str_value=file_get_contents($str_file_path);  
    }
    else{
      $str_value=$str_default;  
    }
    return $this->fn_get_intBool($str_value);      
    } 
    
    function fn_get_intBool($foo_val){
    
      $int_val=1; 
      if(empty($foo_val)){$int_val=0;}                   
      switch ($foo_val) {                                  
        case "no":          
          break;  
        case "false":          
          $int_val=0;          
          break;            
        case false:          
          $int_val=0;          
          break;            
        case 0:
          $int_val=0;          
          break;        
        case "0":
          $int_val=0;          
          break;        
      }              
      return $int_val;
    }
    function fn_inStr($str_haystack, $str_search){
      $int_pos=strpos($str_haystack, $str_search);   
      if($int_pos===false){return false;}        
      return true;
    }      
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////    
}
