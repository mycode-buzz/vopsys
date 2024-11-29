<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
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
      case "maintain":
        $this->fn_runPage();                  
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

  function fn_runPage(){

    //$this->fn_runScript();//used to run any scripts as part of the devleopment process.

    /*
    MAINTAIN will:
    1. Compile the Runtime and Buildtime files from local machine "compile" folder and create records in the "compile" table 
    2. Import any instance id files from local machine "instance" folder and create records in the "instance" table 
    3. Maintain the instance table  and remove any record (and associated local file) that is not linked to another instance via DependentId and do not have a CategoryName. 
    4. Import any component files and create records in the "component" table
    5. Maintain the component table  and remove any record (and associated local file) that is not linked to another instance via Type.
    //*/
    
    //$this->fn_copyToRecycleBin(ROOT, "MAINTAIN");      

    
    $this->fn_XDesigner_compileFiles();                     
    
    //*
    $this->fn_importInstanceFiles();                
    $this->fn_XDesigner_maintainInstance();                
    $this->fn_importComponentFiles();                  
    $this->fn_XDesigner_maintainComponent();
    //*/
  }   

  //START IMPORT INSTANCE
  function fn_importInstanceFiles(){    

    global $SYSTEM_APPID;        
    //if($int_idRecord===$SYSTEM_APPID){
      $str_sql = "UPDATE `vm-xdesign`.`xdesign_instance` SET `EditPin`=`EditPinRelease`;";
      //$this->fn_addEcho($str_sql);                              
      $stmt=$this->fn_executeSQLStatement($str_sql);

      $str_sql = "UPDATE `vm-xdesign`.`xdesign_instance` SET `PalettePin`=`PalettePinRelease`;";
      //$this->fn_addEcho($str_sql);                        
      $stmt=$this->fn_executeSQLStatement($str_sql);
    //}
      
    
    //NB Under no circumstances run fn_removeOrphanFolderInstance //IMPORT
    //That would mean foldres cannot be imported from script source - on future upgrade or which have been erroneously deleted from the db!      
    
    $arr_fobj = scandir($this->str_folderPathInstance);
    
    foreach ($arr_fobj as $str_name) {  
      if($str_name=="." || $str_name==".."){
        continue;
      }
                      
      $str_path=$this->str_folderPathInstance."/".$str_name;
      if(!is_dir($str_path)){
        continue;
      }
      
      $int_idRecord=$str_name;
      //$this->fn_addEcho("int_idRecord: ".$int_idRecord);        
    
      if($int_idRecord==="0"){
        continue;
      }
        
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "Name");        
      $str_name=$this->fn_getStringFromFile($str_file_path, "");
      
      if($str_name===""){//N.B does not contain an import file                    
        continue;
      }
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "Type");        
      $str_type=$this->fn_getStringFromFile($str_file_path, "Tag");            
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "DependentId");        
      $str_dependentId=$this->fn_getStringFromFile($str_file_path,"");    

      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "ClassController");                
      $bln_classController=$this->fn_getBooleanFromFile($str_file_path, "0");                                  

      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "EditPinRelease");                
      $bln_editPinRelease=$this->fn_getBooleanFromFile($str_file_path, "0");                                  
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "EditPin");                
      $bln_editPin=$this->fn_getBooleanFromFile($str_file_path, "0");                            

      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "PalettePinRelease");                
      $bln_palettePinRelease=$this->fn_getBooleanFromFile($str_file_path, "0");                            
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "PalettePin");                
      $bln_palettePin=$this->fn_getBooleanFromFile($str_file_path, "0");                            
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "LastVersionDate");                        
      $str_lastVersionDate=$this->fn_getStringFromFile($str_file_path, NULL);        
    
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "CategoryName");                        
      $str_categoryName=$this->fn_getStringFromFile($str_file_path, NULL);        
      if(empty($str_categoryName)){
        $str_categoryName="Xtra";
      }

      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "ReleaseLabel");                        
      $str_releaseLabel=$this->fn_getStringFromFile($str_file_path, NULL);        
      
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "Serialize");                
      $str_serialize=$this->fn_getStringFromFile($str_file_path, "{}");    
    
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "CreatedDate");                
      $str_createdDate=$this->fn_getStringFromFile($str_file_path, NULL);    
    
      $str_file_path=$this->fn_getFilePathInstanceRecordColumn($int_idRecord, "ModifiedDate");                
      $str_modifiedDate=$this->fn_getStringFromFile($str_file_path, NULL);                
      
      $this->fn_XDesginer_transferFileToInstanceTable($int_idRecord, $str_name, $str_type, $str_dependentId, $bln_classController, $bln_editPinRelease, $bln_editPin, $bln_palettePinRelease, $bln_palettePin, $str_lastVersionDate, $str_categoryName, $str_releaseLabel, $str_serialize, $str_createdDate, $str_modifiedDate);                          
    }      
  }    
  function fn_XDesginer_transferFileToInstanceTable($int_idRecord, $str_name, $str_type, $str_dependentId, $bln_classController, $bln_editPinRelease, $bln_editPin, $bln_palettePinRelease, $bln_palettePin, $str_lastVersionDate, $str_categoryName, $str_releaseLabel, $str_serialize, $str_createdDate, $str_modifiedDate){                   
    
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_instance` WHERE `id`=?";    
    $stmt=$this->fn_executeSQLStatement($str_sql, [$int_idRecord]);
    
    $str_sql="INSERT INTO `vm-xdesign`.`xdesign_instance` (`id`, `Name`,`Type`, `DependentId`, `ClassController`, `EditPinRelease`, `EditPin`, `PalettePinRelease`, `PalettePin`, `LastVersionDate`, `CategoryName`, `ReleaseLabel`, `Serialize`,`CreatedDate`, `ModifiedDate`) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?;";        
    $stmt=$this->fn_executeSQLStatement($str_sql, [$int_idRecord, $str_name, $str_type, $str_dependentId, $bln_classController, $bln_editPinRelease, $bln_editPin, $bln_palettePin, $bln_palettePinRelease, $str_lastVersionDate, $str_categoryName, $str_releaseLabel, $str_serialize, $str_createdDate, $str_modifiedDate]);
  }   
  //END IMPORT INSTANCE

  //START IMPORT COMPONENT
  function fn_importComponentFiles(){ 
    
    //$this->fn_addEcho("fn_importComponentFiles");                        
  
    $arr_fobj = scandir($this->str_folderPathApp);
    
    foreach ($arr_fobj as $str_type) {
      $this->fn_importComponentFile($str_type);
    }   
  }
    
  function fn_importComponentFile($str_type){
    
    
    //$this->fn_addEcho("fn_importComponentFile");
  
    if($str_type=="." || $str_type==".."){
      return;
    }                  
    
    $str_path_folder=$this->fn_getFolderPathComponentRecord($str_type);      
    
    if(!is_dir($str_path_folder)){
      return;
    }
    
    
    $str_file_path=$this->fn_getFilePathComponentRecordColumn($str_type, "Extend");                  
    $str_extend=$this->fn_getStringFromFile($str_file_path, "notset");            
  
    $str_file_path=$this->fn_getFilePathComponentRecordColumn($str_type, "ClassList");                  
    $str_classList=$this->fn_getStringFromFile($str_file_path, "notset");                
    
    $str_file_path=$this->fn_getFilePathComponentRecordColumn($str_type, "component.js");                  
    $str_code=$this->fn_getStringFromFile($str_file_path, "");        
    
    $str_file_path=$this->fn_getFilePathComponentRecordColumn($str_type, "CreatedDate");                    
    $str_createdDate=$this->fn_getStringFromFile($str_file_path, NULL);    
  
    $str_file_path=$this->fn_getFilePathComponentRecordColumn($str_type, "ModifiedDate");                      
    $str_modifiedDate=$this->fn_getStringFromFile($str_file_path, NULL);                  
    
    $this->fn_XDesginer_transferFileToComponentTable($str_type, $str_extend, $str_classList, $str_code, $str_createdDate, $str_modifiedDate);                  
  } 
  
  function fn_XDesginer_transferFileToComponentTable($str_dbtype, $str_extend, $str_classList, $str_code,  $str_createdDate, $str_modifiedDate){          
  
  
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_component` WHERE `Type`=?";
    //$this->fn_addEcho("str_sql: ".$str_sql);    
    $stmt=$this->fn_executeSQLStatement($str_sql, [$str_dbtype]);
    
    $str_sql="INSERT INTO `vm-xdesign`.`xdesign_component` (`Type`, `Extend`, `ClassList`, `Code`, `CreatedDate`, `ModifiedDate`) SELECT ?,?, ?, ?, ?, ?;";        
    $stmt=$this->fn_executeSQLStatement($str_sql, [$str_dbtype, $str_extend, $str_classList, $str_code, $str_createdDate, $str_modifiedDate]);
    
    
  }   
  //END IMPORT COMPONENT
    


  ///////////////////////////////////////////////////////
  //START COMPILE FUNCTIONS

  function fn_XDesigner_compileFiles(){    
    
    //////////////////////////COMPILE          
    
    $this->filename_runtime="filename_runtime.js";        
    $this->filename_template="filename_template.js";
    $this->filename_designtime="filename_designtime.js";
    
    $this->str_folder_name_runtime="runtime";
    $this->str_folder_path_runtime=$this->str_folderPathCompile."/".$this->str_folder_name_runtime;  
    $this->str_file_path_runtime=$this->str_folder_path_runtime."/".$this->filename_runtime;             
    
    $this->str_folder_name_template="runtime";
    $this->str_folder_path_template=$this->str_folderPathCompile."/".$this->str_folder_name_template;  
    $this->str_file_path_template=$this->str_folder_path_template."/".$this->filename_template;
    
    $this->str_folder_name_designtime="designtime";  
    $this->str_folder_path_designtime=$this->str_folderPathCompile."/".$this->str_folder_name_designtime;  
    $this->str_file_path_designtime=$this->str_folder_path_designtime."/".$this->filename_designtime;  
    
    $this->fn_XDesigner_compile_RunTimeFile();              
    $this->fn_XDesigner_compile_DesigntimeFile();       
    $this->fn_XDesigner_compile_TemplateFile();     
    
    
    //write runtime code from file to database        
    $str_code = file_get_contents($this->str_file_path_runtime);          
    $this->fn_XDesginer_transferFileToCompileTable($this->dbtype_runtime, $str_code);                    
    
    //write designtime code from file to database      
    $str_code = file_get_contents($this->str_file_path_designtime);          
    $this->fn_XDesginer_transferFileToCompileTable($this->dbtype_designtime, $str_code);                    
    //write template code from file to database      
    $str_code = file_get_contents($this->str_file_path_template);  
    $this->fn_XDesginer_transferFileToCompileTable($this->dbtype_template, $str_code);                        
  }

  function fn_XDesginer_transferFileToCompileTable($str_typeRecord, $str_code){            
  
    
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_compile` WHERE `Type`=?";    
    $stmt=$this->fn_executeSQLStatement($str_sql, [$str_typeRecord]);
    
    $str_sql="INSERT INTO `vm-xdesign`.`xdesign_compile` (`Type`, `Code`) SELECT ?,?;";        
    $stmt=$this->fn_executeSQLStatement($str_sql, [$str_typeRecord, $str_code]);
  }   
  
  function fn_XDesigner_compile_RunTimeFile(){
  
    $str_path=$this->str_folder_path_runtime."/";    
    $arr_file=[
      //RunTime must be at the top of the file    
      
      $str_path."UserSettings.js",
      $str_path."PermitManager.js",          
      $str_path."User.js",    
      $str_path."Path.js",    
      $str_path."Shared.js",
      $str_path."LevelObject.js",
      $str_path."Holder.js",  
      $str_path."BaseObject.js",          
      $str_path."Component.js",    
      $str_path."AJAX.js",    
      $str_path."Tag.js",    
          
      $str_path."Debug.js",  
      $str_path."myJSON.js",        
      $str_path."Main.js"
      
      //RunTime must be at the top of the file
    ];   
    
    $this->fn_XDesigner_concat_fileList($this->str_file_path_runtime, $arr_file); 
  }
  
  function fn_XDesigner_compile_DesigntimeFile(){  
  
    $str_path=$this->str_folder_path_designtime."/";  
    
    $arr_file=[                  
      
      $str_path."DesignDelegate.js",    
      //$str_path."DesignDelegateeazygrid.js",
      //$str_path."DesignDelegateeazygriditem.js",
      //$str_path."DesignDelegategrid.js",    
      //$str_path."DesignDelegateProjectInstance.js",    
      $str_path."GlobalVariable.js"
    ];
    $this->fn_XDesigner_concat_fileList($this->str_file_path_designtime, $arr_file);
  }
  
  function fn_XDesigner_compile_TemplateFile(){  
  
    $str_path=$this->str_folder_path_template."/";  
    
    $arr_file=[      
      $str_path."Project.js"
    ];
    $this->fn_XDesigner_concat_fileList($this->str_file_path_template, $arr_file);
    }
    function fn_XDesigner_concat_fileList($str_file_target, $arr_list){    
    
    file_put_contents($str_file_target, "");            
    
    
    $arr_length = count($arr_list);        
    for($i=0;$i<$arr_length;$i++)
    {
      $str_pathFile=$arr_list[$i];
      $str_basename=basename($str_pathFile);
      $str_code="";
      $str_code.=PHP_EOL;
      $str_code.="//START ".$str_basename.PHP_EOL;    
      $str_code.=file_get_contents($str_pathFile).PHP_EOL;
      $str_code.="//END ".$str_basename.PHP_EOL;        
      $str_code.=PHP_EOL;
      file_put_contents($str_file_target, $str_code, FILE_APPEND);
    }
  }
//END COMPILE FUNCTIONS
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
//START MAINTAIN INSTANCE FUNCTIONS

  function fn_XDesigner_maintainInstance(){

    //$this->fn_addEcho("fn_XDesigner_maintain");
    
    $obj_post=$this->obj_post;           
    
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_maintain_link`"; //future where userid =x
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    $str_sql="UPDATE `vm-xdesign`.`xdesign_instance` SET MaintainStatus=0";            
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    
    $str_sql="UPDATE `vm-xdesign`.`xdesign_instance` SET MaintainStatus=1 WHERE (".$this->str_protectedInstanceCriteria.") ";            
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    $str_sql="SELECT `id` As `int_idRecord` FROM `vm-xdesign`.`xdesign_instance` WHERE MaintainStatus;";
    //$this->fn_addEcho("MaintainStatus str_list: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    
    while($arr_row=$stmt->fetch(PDO::FETCH_ASSOC)){
      
      $int_idRecord=$arr_row["int_idRecord"];        
      //---Insert List of Required Components into Link table
      $this->fn_addDependentComponentToLinkTable("xdesign_maintain_link", $int_idRecord);//this is the complex dependent id function                                    
      //There is now a list of dependent entries in the link table      
    }         
    
    $str_list=$this->fn_getlistLinkTableEntries("xdesign_maintain_link");
    //$this->fn_addConsole("str_list maintain: ".$str_list);      

    //$this->fn_addEcho("fn_XDesigner_maintain 4");   
    
    $str_sql="UPDATE `vm-xdesign`.`xdesign_instance` SET MaintainStatus=1 WHERE id in($str_list)";            
    $stmt=$this->fn_executeSQLStatement($str_sql);

    //ARCHIVE INSTANCE TABLE
    $str_sql="DROP TABLE IF EXISTS `vm-xdesign`.`xdesign_instance_archive`;";              
    $stmt=$this->fn_executeSQLStatement($str_sql);

    $str_sql="CREATE TABLE `vm-xdesign`.`xdesign_instance_archive` LIKE `vm-xdesign`.`xdesign_instance`;";              
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    //$str_sql="INSERT INTO `xdesign_instance_archive` SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE Id NOT IN(SELECT LinkDependentId FROM `maintainlink`);"; //future where userid =x            
    $str_sql="INSERT INTO `vm-xdesign`.`xdesign_instance_archive` SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE MaintainStatus=0;"; //future where userid =x                  
    $stmt=$this->fn_executeSQLStatement($str_sql);
    //ARCHIVE INSTANCE TABLE


    
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_instance` WHERE MaintainStatus=0;";                
    $stmt=$this->fn_executeSQLStatement($str_sql);
    $this->fn_removeOrphanFolderInstanceFiles();//MAINTAIN

    
    
    
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_maintain_link`"; //future where userid =x
    $stmt=$this->fn_executeSQLStatement($str_sql);

    $obj_pathGlobal_App=$this->fn_createFolderInParent(ROOT, $this->str_name_folder_app);                     
    $this->fn_removeEmptySubFolders($obj_pathGlobal_App->str_pathFolder);        
    
  }     
  

  function fn_getlistLinkTableEntries($str_nameTable){//maintain function
    $str_sql = "SELECT GROUP_CONCAT(LinkDependentId) as 'list' FROM `vm-xdesign`.`xdesign_maintain_link`;";
    $stmt=$this->fn_executeSQLStatement($str_sql);
    $arr_row=$stmt->fetch();            
    if($arr_row){                
      $str_list=$arr_row["list"];              
    }
    return $str_list;
  }  
  
    
//END MAINTAIN INSTANCE FUNCTIONS
//START MAINTAIN COMPONENT FUNCTIONS
function fn_XDesigner_maintainComponent(){    
    
  $obj_post=$this->obj_post;               
  
  $str_sql="UPDATE `vm-xdesign`.`xdesign_component` SET `MaintainStatus`=1;";            
  $stmt=$this->fn_executeSQLStatement($str_sql);
  
  $str_sql="UPDATE `vm-xdesign`.`xdesign_component` left join `vm-xdesign`.`xdesign_instance` on `xdesign_component`.`type`=`xdesign_instance`.`type` SET `xdesign_component`.`MaintainStatus`=0 where `xdesign_instance`.`type` is null;";              
  $stmt=$this->fn_executeSQLStatement($str_sql);
  
  $str_sql="DELETE FROM `vm-xdesign`.`xdesign_component` where MaintainStatus=0;";            
  $stmt=$this->fn_executeSQLStatement($str_sql);
  
  $this->fn_removeOrphanFolderComponentFiles();
}    

//END MAINTAIN COMPONENT FUNCTIONS
///////////////////////////////////////////////////////  

//START FILE OPERATON
function fn_runScript(){
  /*    
    $str_path="D:/temp";    
    $bln_exist=is_dir($str_path);    
    if($bln_exist){
      $this->fn_addEcho("xbln_exist: ".$bln_exist);        
      //$this->fn_deleteFolder($str_path);
    }    
    return;
    //*/

    /*    
    $str_path=$this->str_folderPathInstance;        
    $str_nameFile="EditPinHome";    
    $str_pathCopyFrom=$this->str_folderPathInstance."/".$str_nameFile;    
    $this->fn_fileOperation($str_path, $str_pathCopyFrom, $str_nameFile);
    return;
    //*/
}

function fn_fileOperation($source, $str_pathCopyFrom, $str_nameFile, $bln_recur=true)
{
  // Check for symlinks

  if (is_link($source)) {
      return symlink(readlink($source), $dest);
  }

  //$this->fn_addEcho("source: " .$source);                        

  /* 
  //copy file into folder
  if (is_dir($source)) {
    //action goes here          
    $this->fn_addEcho("str_pathCopyFrom: " .$str_pathCopyFrom);                        
      if (file_exists($str_pathCopyFrom)) {          
        $str_pathCopyTo=$source."/".$str_nameFile;            
        copy($str_pathCopyFrom, $str_pathCopyTo);
        
      }
  }   
  //*/

  /* 
  //copy file into folder, if another file exists in same folder
  if (is_file($source)) {
    //action goes here                    
      $str_nameFileTarget=basename($source);          
      if($str_nameFileTarget==="PalettePin"){
        //$this->fn_addEcho("str_nameFile: " .$str_nameFile);                                        
        $str_pathCopyTo=dirname($source)."/".$str_nameFile;                                 
        //$this->fn_addEcho("str_pathCopyFrom: " .$str_pathCopyFrom);                                
        //$this->fn_addEcho("str_pathCopyTo: " .$str_pathCopyTo);                        
        copy($str_pathCopyFrom, $str_pathCopyTo);
      }
      
      return;
  }  
  //*/ 


  //* 
  //delete file from folder
  if (is_file($source)) {
    //action goes here                    
      $str_nameFile=basename($source);          
      if($str_nameFile==="EditPinHome"){            
        $this->fn_addEcho("source: " .$source);                                                  
        /*
        $str_valueFile=file_get_contents($source);            
        if($str_valueFile=="Other"){                            
          unlink($source);
        }
        //*/
        //unlink($source);
        
      }
      
      return;
  }  
  //*/ 

  
  if (is_file($source)) {//dont remove !!      
    return;
  }

  $dir = dir($source);
  while (false !== $entry = $dir->read()) {
      // Skip pointers

      if ($entry == '.' || $entry == '..') {
          continue;
      }    
      
      if($bln_recur){
        $this->fn_fileOperation("$source/$entry", $str_pathCopyFrom, $str_nameFile, $bln_recur);
      }      
      
  }

  // Clean up

  $dir->close();
  return true;
}  
//END FILE OPERATION
  
}
/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER
