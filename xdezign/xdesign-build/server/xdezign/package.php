<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once __DIR__."/xdezign.php";
/////////////////////////HEADER

set_time_limit(200);

class package extends xdezign{
  function __construct() {          
    parent::__construct();
  }     
  
  function fn_packageProject($obj_ini){
    

    if($this->DebugServer){
      //$this->fn_setError("fn_packageProject: []");          
      //exit;
    }
    
    

    $str_sql="SET SESSION group_concat_max_len = 100000;";    
    $this->fn_executeSQLStatement($str_sql);    
    
    $obj_post=$this->obj_post;

    if($this->DebugServer){
      //exit;
    }
    

    $this->bln_needQuill=false;
    $this->bln_debugPackage=false;
    
    $this->obj_record=new stdClass();
    $this->obj_record->Type="notset";
    $int_idRecord=$obj_ini->RecordId;            
    

    $bln_version=$obj_ini->bln_version;    
    
    if(empty($obj_post->CreateRelease)){$obj_post->CreateRelease=false;}
    if(empty($obj_post->StageRelease)){$obj_post->StageRelease=false;}
    $this->bln_release=$this->fn_get_intBool($obj_post->CreateRelease);            
    $bln_release=$this->bln_release;                
    $bln_stageRelease=$this->fn_get_intBool($obj_post->StageRelease);
    $this->str_virtualFileDelimiter="";
    if($bln_release){
      $this->str_virtualFileDelimiter="/";
    }
    
    
    $str_componentName="New Project";//e.g. id record =0
    $str_componentNameShort="newproject";      
    
    if(empty($int_idRecord)){$int_idRecord=0;}      
    if(empty($bln_version)){$bln_version=false;}      
    $str_nameTargetClass="component";//Default New Project Type, RecordId=0                  
    
    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE Id=?;";
    //$this->fn_addEcho("str_sql: ".$str_sql);       
    
    $stmt=$this->fn_executeSQLStatement($str_sql, [$int_idRecord]);
    $arr_row=$stmt->fetch();            
    if($arr_row){        
      $str_componentName=$arr_row["Name"];
      $str_componentNameShort=$arr_row["NameShort"];        
      $str_nameTargetClass=$arr_row["Type"];        
      $this->obj_record->Type=$arr_row["Type"];
    }//Overide with Custom Project Type, if the component has been Saved, RecordId=x    

    if(empty($str_componentNameShort)){
      $str_componentNameShort=$str_componentName;        
    }
    $str_componentNameShort=str_replace(' ', '', strtolower($str_componentNameShort));      

    $str_componentNameOrig=$str_componentName;
    $str_componentNameShortOrig=$str_componentNameShort;
    
    //0 START Create Project Folder    
    $this->fn_removeBuildPackageFolders();//be aware this can cause issues if it takes a long time to do    
    $obj_pathShared=$this->fn_createPackageFolder($int_idRecord, "shared"); //copy across shared folder to app, server and dbstore                              
    $obj_pathRecord=$this->fn_createPackageFolder($int_idRecord, $str_componentNameShort); //copy across app name to app, server and dbstore                           
    $this->obj_post->URLProjectVersion=$this->path2url($obj_pathRecord->obj_pathBuild->str_folderPathVersion); //note down verison URL                 
    $this->obj_post->URLSubdomain=$this->fn_getSubDomain();
    
    //1 START Create Project Index File              
$str_header1=<<<heredoc
<!DOCTYPE html>
<html lang="en">
<title>$str_componentName</title>
<meta http-equiv="cache-control" content="max-age=0">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="-1">
<meta http-equiv="expires" content="Tue, 01 Jan 1980 11:00:00 GMT">
<meta http-equiv="pragma" content="no-cache">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
heredoc;

$str_quill=<<<heredoc
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>                        
heredoc;
    
$str_header2=<<<heredoc
<script>var ServerQueryString = "<?php echo \$_SERVER['QUERY_STRING']; ?>";</script>
<script type="module" src="$this->str_virtualFileDelimiter$this->str_name_file_project"></script>

<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

<style>
  * {/*NOTE. Box Sizing must be set//*/
    -webkit-box-sizing: border-box;
    box-sizing: border-box;    
  }                
  html{        
    background-color: rgb(43, 44, 52);    
    font-family: tahoma;    
    
  }    
   a {
    color: black;
  }  
  body {
    overflow-y: scroll;
  }
</style>
<body>
heredoc;
/*
overflow: -moz-scrollbars-vertical; 
    overflow-y: scroll;
  //*/  
    
$str_footer=<<<heredoc
</body>
</html>
heredoc;


  if($obj_post->ServerIndex){        
    $str_php_path="/xdesign-build/server/$str_componentNameShort/server.php";  
    $str_serverBody="<?php 
    require_once dirname(\$_SERVER['DOCUMENT_ROOT']).\"$str_php_path\"; 
?>";
  }
    //1 END Create Project Index File

    //---Delete instance Link
    //Remove ExisitngEntries
    $this->fn_removeLinkTableEntries("xdesign_instance_link", $int_idRecord);      
    //Remove ExisitngEntries      
    
    //3 START Create Project Code File            
    $str_code_project="";      
    
    //get runtime code from database
    $str_code_project.="//START RUNTIME".PHP_EOL.PHP_EOL;            
    $str_code=$this->fn_getCompileCode($this->dbtype_runtime);                
    $str_code_project.=$str_code.PHP_EOL.PHP_EOL;            
    $str_code_project.="//END RUNTIME".PHP_EOL.PHP_EOL;            
    
    if($this->bln_debugPackage){
      $this->fn_addEcho("bln_version: ".$bln_version);
      $this->fn_addEcho("bln_release: ".$bln_release);
    }
    
    if(!$bln_version && !$bln_release){//designtime code
      //get designtime code from database
      if($this->bln_debugPackage){$this->fn_addEcho("get designtime code");}
      $str_code_project.="//START DESIGNTIME".PHP_EOL.PHP_EOL;            
      $str_code=$this->fn_getCompileCode($this->dbtype_designtime);      
      $str_code_project.=$str_code.PHP_EOL.PHP_EOL;
      $str_code_project.="//END DESIGNTIME".PHP_EOL.PHP_EOL;            
    }      
    
    $this->arr_ComponentMap=["component"];//This array is altered/addedto in fn_getComponentCodeFromListId            

    //---Add Palette Pinned component (if not version) , 
    //so as they are avaialble for choosing during further project editing         
    
    $str_code_project.="//START LINKTABLE".PHP_EOL.PHP_EOL;                    
    //---Insert List of Required Components into Link table
    //$this->fn_debuglinktable("xdesign_instance_link", "XXXX");
    //$this->fn_addEcho("bln_version: ".$bln_version);
    //$this->fn_addEcho("bln_release: ".$bln_release);

    if(!$bln_version && !$bln_release || $str_componentNameShort==="xdezign"){         
      if($this->bln_debugPackage){$this->fn_addEcho("bln_version is false, adding pallete items: ".$bln_version);}
      $this->fn_addPalettePinComponentToLinkTable($int_idRecord);//add palette pinned components temporarily to packageproject
      //$this->fn_debuglinktable("xdesign_instance_link", "YYYYY");
    }

    $this->fn_addDependentComponentToLinkTable("xdesign_instance_link", $int_idRecord);//this is the complex dependent id function                                    
    //There is now a list of dependent entries in the link table          
    //$this->fn_debuglinktable("xdesign_instance_link", "ZZZZZZZZZ");
    
    //---Write code base 
    //get dependent code from database XTRA CLASSES AND            
    $str_code=$this->fn_compileComponentCodeFromLinkTable($int_idRecord); //this is the complex component code function                                                     
    $str_code_project.=$str_code.PHP_EOL.PHP_EOL;                  
    //$this->fn_addEcho("str_code: " . $str_code);
    $str_code_project.="//END LINKTABLE".PHP_EOL.PHP_EOL;                        
    
    $str_code_project.="//START COMPONENTMAP".PHP_EOL.PHP_EOL;            
    $str_code=$this->fn_getComponentMap();                          
    $str_code_project.=$str_code.PHP_EOL.PHP_EOL;            
    $str_code_project.="//END COMPONENTMAP".PHP_EOL.PHP_EOL;    
    
    //get own code template code from database 
    $str_code_project.="//START TEMPLATE".PHP_EOL.PHP_EOL;            
    $str_code=$this->fn_getCompileCode($this->dbtype_template);//needs to go at the bottom of the file            
    $str_code_project.=$str_code.PHP_EOL.PHP_EOL;      
    $str_code_project.="//END TEMPLATE".PHP_EOL.PHP_EOL;            
    
    //-----Write Project Instance to JSONMap
    //write jsonmap from database to file - map must be included, version or not.
    $str_code_project.="//START JSONMAP".PHP_EOL.PHP_EOL;            
    $str_code=$this->fn_updateProjectFileWithjsonObject($int_idRecord, $bln_version);      
    $str_code_project.=$str_code.PHP_EOL.PHP_EOL;      
    $str_code_project.="//END JSONMAP".PHP_EOL.PHP_EOL;            
    //START Write Code to File                 
    
    //Write Code to File      
    $str_header="";
    $str_header.=$str_header1.PHP_EOL;
    if($this->bln_needQuill){
      $str_header.=$str_quill.PHP_EOL;
    }
    $str_header.=$str_header2.PHP_EOL;
    $str_documentIndex=$str_header.$str_footer;
    if($obj_post->ServerIndex){        
      $str_documentIndex=$str_serverBody;
    }
    $this->str_path_file_index=$obj_pathRecord->obj_pathBuild_AppName->str_folderPathRucksack."/".$this->str_name_file_index;            
    file_put_contents($this->str_path_file_index, $str_documentIndex);               
    
    
    $this->str_path_file_xdesign=$obj_pathRecord->obj_pathBuild_AppName->str_folderPathRucksack."/".$this->str_name_file_project;            
    file_put_contents($this->str_path_file_xdesign, $str_code_project);                                    
    $this->fn_updateTemplateFile($this->str_path_file_xdesign, $int_idRecord, $str_nameTargetClass);//Update Project Code File with RecordId and ClassName                 
    //END Write Code to File
    
    //COPY RUCKSACK CONTENTS INTO BUILD
    $this->fn_copyFolder($obj_pathRecord->obj_pathBuild_AppName->str_folderPathRucksack, $obj_pathRecord->obj_pathBuild->str_folderPathVersion);                              
    //$this->fn_copyFolder($obj_pathShared->obj_pathBuild_AppName->str_folderPathRucksack, $obj_pathShared->obj_pathBuild->str_folderPathVersion);                                      

    $str_pathRucksack=dirname(__FILE__);        
    $str_pathRucksack.="/".$this->str_name_folder_compile;
    $str_pathRucksack.="/shared/rucksack";
    //$this->fn_addEcho("str_pathRucksack: ".$str_pathRucksack);
    $this->fn_copyFolder($str_pathRucksack, $obj_pathShared->obj_pathBuild->str_folderPathVersion);                                  
    //COPY RUCKSACK CONTENTS INTO BUILD
    
    //CLEAN UP
    $this->fn_deleteFolder($obj_pathRecord->obj_pathBuild_AppName->str_folderPathRucksack);        
    $this->fn_deleteFolder($obj_pathRecord->obj_pathBuild_AppName->str_folderPathApp);        
    //$this->fn_deleteFolder($obj_pathShared->obj_pathBuild_AppName->str_folderPathRucksack);        
    //$this->fn_deleteFolder($obj_pathShared->obj_pathBuild_AppName->str_folderPathApp);            
    //CLEAN UP
    
    
    if($bln_version || $bln_release){      
      //"unfortunatel" the instance_link linktable  at this point, will not include the expanded list of extends and xtra classes.
      //This exists only in list form.
      //We are going to add it now.
      //it is important for instance_linktable to include the listexpand in order to package these projects.
      //they may contain assets , or sever files.      
      $str_value=$this->str_listClassExpand;              
      $arr_value = explode(",",$str_value);            
      $this->fn_addBracketArray($arr_value, "'");
      $this->str_listClassExpandLookup=implode(",", $arr_value);                         

      //note cannot use ? method
      $str_sql = "SELECT group_concat(`Id`) as `listIdExpandLookup` FROM `vm-xdesign`.`xdesign_instance` WHERE `type` in(".$this->str_listClassExpandLookup.");";                  
      $stmt=$this->fn_executeSQLStatement($str_sql);
      
      $arr_row=$stmt->fetch();
      if($arr_row){                                   
        $str_listIdExpandLookup=$arr_row["listIdExpandLookup"];        
        $this->fn_addListToLinkTable('xdesign_instance_link', $int_idRecord, $str_listIdExpandLookup); //add self          
      }
      
      
      //Create item folders
      //Loop thru Instance Link Table
      //locate any corresponding existing folders in App folder                    
      $str_sql = "SELECT distinct `xdesign_instance`.`Name` AS `Name` FROM `vm-xdesign`.`xdesign_instance_link` JOIN `vm-xdesign`.`xdesign_instance` ON `xdesign_instance_link`.`LinkDependentId`=`xdesign_instance`.`id` WHERE `InstanceId` =?;";      
      $stmt=$this->fn_executeSQLStatement($str_sql, [$int_idRecord]);      
      while($arr_row=$stmt->fetch()){                                   
        $str_componentName=$arr_row["Name"];        
        $str_componentNameShort="";
        if(empty($str_componentNameShort)){
          $str_componentNameShort=$str_componentName;        
        }        
        $str_componentNameShort=str_replace(' ', '', strtolower($str_componentNameShort));                          
        $obj_path_instance_link=$this->fn_createPackageFolder($int_idRecord, $str_componentNameShort);                                       
        //DELETE UNDEEDED RUCKSACK AND COMPONENT
        $this->fn_deleteFolder($obj_path_instance_link->obj_pathBuild_AppName->str_folderPathRucksack);        
        $this->fn_deleteFolder($obj_path_instance_link->obj_pathBuild_AppName->str_folderPathApp);        
        //DELETE UNDEEDED RUCKSACK AND COMPONENT
      }
    } 
    //*/              
    
    //Remove ExisitngEntries In Instance Link
    //$this->fn_removeLinkTableEntries("xdesign_instance_link", $int_idRecord);      
    //Remove ExisitngEntries In Instance Link    
    //create independent reelase 
    
    if($bln_release){//Start Release
      
      global $SYSTEM_APPID;        

      //*
      if($int_idRecord===$SYSTEM_APPID){
        $str_sql = "UPDATE `vm-xdesign`.`xdesign_instance` SET `EditPin`=`EditPinRelease`;";
        //$this->fn_addEcho($str_sql);                                
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql = "UPDATE `vm-xdesign`.`xdesign_instance` SET `PalettePin`=`PalettePinRelease`;";
        //$this->fn_addEcho($str_sql);                                
        $stmt=$this->fn_executeSQLStatement($str_sql);
      }
      //*/
      
      
      //*      
      $str_sql = "SELECT distinct `xdesign_instance`.`Id`, `xdesign_instance`.`Name` AS `Name` FROM `vm-xdesign`.`xdesign_instance` WHERE `xdesign_instance`.`Id`=?";
      //$this->fn_addEcho($str_sql);                        
      //$this->fn_addEcho("int_idRecord: ".$int_idRecord);                        
      
      $stmt=$this->fn_executeSQLStatement($str_sql, [$int_idRecord]);
      
      //while($arr_row=$stmt->fetch()){                         
        $arr_row=$stmt->fetch();            
        if($arr_row){                
        
        //*                    
        $str_componentName=$arr_row["Name"];                    
        $str_componentNameShort="";
        if(empty($str_componentNameShort)){
          $str_componentNameShort=$str_componentName;        
        }
        $str_componentNameShort=str_replace(' ', '', strtolower($str_componentNameShort));                          
        $obj_path_instance_link=$this->fn_createPackageFolder($int_idRecord, $str_componentNameShort);                               
        //$this->fn_addEcho("obj_path_instance_link: ".$obj_path_instance_link->obj_pathBuild_AppName->str_pathFolder);                        
        
        //DELETE UNDEEDED RUCKSACK AND COMPONENT        
        $this->fn_deleteFolder($obj_path_instance_link->obj_pathBuild_AppName->str_folderPathRucksack);        
        $this->fn_deleteFolder($obj_path_instance_link->obj_pathBuild_AppName->str_folderPathApp);                
        //DELETE UNDEEDED RUCKSACK AND COMPONENT  

        //$this->fn_addToMetaMall();        
        //$this->fn_addToMetaView();
    }


    
    //Delete empty folders    
    $this->fn_removeEmptySubFolders($obj_pathRecord->obj_pathBuild->str_folderPathInstanceRecord);//keep above final copy to release
      
    
    //move build veriosn to release folder
    //$str_path_folder_release_parent=VOPSYSROOT."/".$obj_post->RecordShortName;            
    
    
    $str_path_folder_release_parent=VOPSYSROOT."/".$obj_post->RecordShortName;            
    if($obj_post->ReleaseLabel!=="notset"){          
      $str_path_folder_release_parent=VOPSYSROOT."/".$obj_post->ReleaseLabel;          
    }    
    $this->fn_createFolder($str_path_folder_release_parent);        
    if($bln_stageRelease){
      //Parent of current subdomain. VERSION RELEASE                                 
      $str_path_folder_release_target=$str_path_folder_release_parent."/".$this->str_name_folder_version;            
    }
    else{
      //Parent of current subdomain. HOT RELEASE                        
      $str_path_folder_release_target=$str_path_folder_release_parent."/".$this->str_name_folder_hotinstall;
    }    

    

    $this->fn_deleteFolder($str_path_folder_release_target, true);                        
    $this->fn_createFolder($str_path_folder_release_target);                  
    
    $this->fn_copyFolder($obj_pathRecord->obj_pathBuild->str_folderPathVersion, $str_path_folder_release_target);                 

    global $AuthorizeSuperUser, $AuthorizeSuperPass;
    $this->fn_createFolder($str_path_folder_release_target."/".$this->str_name_folder_DBStore."/".$str_componentNameShortOrig);                      
    $str_pathFolderMySQLDump=$str_path_folder_release_target."/".$this->str_name_folder_DBStore."/".$str_componentNameShortOrig;    
    $str_pathFileMySQLDump=$str_pathFolderMySQLDump."/".$str_componentNameShortOrig.".sql";
    
    $str_nameDB=$str_componentNameShortOrig;        
    
    $bln_execDump=false;        
    //if($str_nameDB==="xdesign"){$bln_execDump=true;}        
    $bln_execDump=true;        
    if($bln_execDump){//careful, as a bad call to exec mysqldump will cause apache to crash
      $bln_exist=$this->fn_databaseExist($str_nameDB);    
      if($bln_exist){
        $str_commandMySQLDump="mysqldump --user=".$AuthorizeSuperUser." --password=".$AuthorizeSuperPass." --host=localhost ".$str_nameDB." > ".$str_pathFileMySQLDump;                          
        exec($str_commandMySQLDump, $output, $return_var);
        $str_value=var_export($output, true);
        $this->fn_addEcho ("output: ".$str_value);        
        $str_value=var_export($return_var, true);
        $this->fn_addEcho ("return_var: ".$str_value);                  
        //$this->fn_addEcho("MYSQLDUMP FILE CREATED: ".$str_pathFileMySQLDump);        
        $this->fn_addEcho ("str_commandMySQLDump: ".$str_commandMySQLDump);        
      }
    }
    else{
      $str_commandMySQLDump="mysqldump -u ".$AuthorizeSuperUser." -p ".$str_nameDB." > ".$str_pathFileMySQLDump;    
      $this->fn_addEcho("RUN MYSQLDUMP: ".$str_commandMySQLDump);        
    }
      
    }//End Release
    //3 END Create Project Code File      
  }  

  
  function fn_getSubDomain(){
    $obj_post=$this->obj_post;    
    $Subdomain=$obj_post->ReleaseLabel;    
    if($Subdomain==="notset"){
      $Subdomain=$obj_post->RecordShortName;    
    }      
    return $Subdomain;
  }  
  
  
  function fn_removeBuildPackageFolders(){   
    
    //global package delete funciton - be careful where this is called.

    $str_path=$this->str_folderPathBuildInstance;
    $this->fn_deleteFolder($str_path);                 
     
   }
    

  function fn_createPackageFolder($int_idRecord, $str_name_app){              

    //1
    $obj_pathGlobal=new stdClass();//This is the folder that is in the global  folder . Not currently used
    $obj_pathGlobal->str_pathFolder=ROOT;
    
    //1
    //CREATE PARENT FOLDERS IN START DESTINATION
    $obj_pathGlobal_App=$this->fn_createFolderInParent(ROOT, $this->str_name_folder_app);                                      
    $obj_pathGlobal_Server=$this->fn_createFolderInParent(ROOT, $this->str_name_folder_server);                      
    $obj_pathGlobal_DBStore=$this->fn_createFolderInParent(ROOT, $this->str_name_folder_DBStore);                      
    //CREATE PARENT FOLDERS IN START DESTINATION       
    
    
    //CREATE NAMED FOLDERS IN START DESTINATION
    $obj_pathGlobal_AppName=$this->fn_createFolderAppName(ROOT, $str_name_app);     
    $obj_pathGlobal_ServerName=$this->fn_createFolderServerName(ROOT, $str_name_app); 
    $obj_pathGlobal_DBStoreName=$this->fn_createFolderDBStoreName(ROOT, $str_name_app);     
    //CREATE NAMED FOLDERS IN START DESTINATION
    
    //2
    //CREATE BUILD FOLDER
    $obj_pathBuild=new stdClass();//This is the folder that is in the destination _build folder
    $obj_pathBuild->str_pathFolder=$this->str_folderPathBuild;    
    
    //str_folderPathInstanceRecord
    $str_path=$this->fn_getBuildFolderPathInstanceRecord($int_idRecord);              
    $this->fn_createFolder($str_path);       
    $obj_pathBuild->str_folderPathInstanceRecord=$str_path;        

    //str_folderPathBuild
    $str_path=$obj_pathBuild->str_folderPathInstanceRecord."/".$this->str_name_folder_package;                        
    $this->fn_createFolder($str_path); 
    $obj_pathBuild->str_folderPathPackage=$str_path;    

    //str_folderPathVersion
    $str_path=$obj_pathBuild->str_folderPathPackage."/".$this->str_name_folder_version;          
    $this->fn_createFolder($str_path); 
    $obj_pathBuild->str_folderPathVersion=$str_path; /////////////////////////////                       
    //CREATE BUILD FOLDER

    //CREATE PARENT FOLDERS IN BUILD FOLDER
    $obj_pathBuild_App=$this->fn_createFolderInParent($obj_pathBuild->str_folderPathVersion, $this->str_name_folder_app);                                     
    $obj_pathBuild_Server=$this->fn_createFolderInParent($obj_pathBuild->str_folderPathVersion, $this->str_name_folder_server);                                     
    $obj_pathBuild_DBStore=$this->fn_createFolderInParent($obj_pathBuild->str_folderPathVersion, $this->str_name_folder_DBStore);                                             
    //CREATE PARENT FOLDERS IN BUILD FOLDER    
    
    //CREATE NAMED FOLDERS IN BUILD FOLDER
    $obj_pathBuild_AppName=$this->fn_createFolderAppName($obj_pathBuild->str_folderPathVersion, $str_name_app);                                     
    $obj_pathBuild_ServerName=$this->fn_createFolderServerName($obj_pathBuild->str_folderPathVersion, $str_name_app);                                     
    $obj_pathBuild_DBStoreName=$this->fn_createFolderDBStoreName($obj_pathBuild->str_folderPathVersion, $str_name_app);                                             
    //CREATE NAMED FOLDERS IN BUILD FOLDER    
    
    //OPERAITONS PERTIANING TO BUILD APP NAME FOLDER
    //str_folderPathRucksackVersion
    $str_path=$obj_pathBuild_AppName->str_pathFolder."/".$this->str_name_folder_rucksack;                                      
    $this->fn_createFolder($str_path); 
    $obj_pathBuild_AppName->str_folderPathRucksack=$str_path; 

    //str_folderPathAppVerison
    $str_path=$obj_pathBuild_AppName->str_pathFolder."/".$this->str_name_folder_component;                                      
    $this->fn_createFolder($str_path); 
    $obj_pathBuild_AppName->str_folderPathApp=$str_path; 

    //str_folderPathAppVerison
    $str_path=$obj_pathBuild_AppName->str_pathFolder."/".$this->str_name_folder_asset;                                      
    $this->fn_createFolder($str_path); 
    $obj_pathBuild_AppName->str_folderPathAsset=$str_path; 
    //OPERAITONS PERTIANING TO BUILD APP NAME FOLDER

    //3
    //COPY APP NAME FOLDER FROM START FOLDER TO BUILD FOLDER
    $str_source=$obj_pathGlobal_AppName->str_pathFolder;          
    $str_destination=$obj_pathBuild_AppName->str_pathFolder;                      
    $this->fn_copyFolder($str_source, $str_destination);            
    //COPY APP FOLDER FROM START FOLDER TO BUILD FOLDER

    //COPY SERVER NAME FOLDER FROM START FOLDER TO BUILD FOLDER
    $str_source=$obj_pathGlobal_ServerName->str_pathFolder;          
    $str_destination=$obj_pathBuild_ServerName->str_pathFolder;                      
    $this->fn_copyFolder($str_source, $str_destination);            
    //COPY SERVER NAME FOLDER FROM START FOLDER TO BUILD FOLDER     
    
    //COPY DBSTORE NAME FOLDER FROM START FOLDER TO BUILD FOLDER
    $str_source=$obj_pathGlobal_DBStoreName->str_pathFolder;          
    $str_destination=$obj_pathBuild_DBStoreName->str_pathFolder;                      
    $this->fn_copyFolder($str_source, $str_destination);                
    //COPY DBSTORE NAME FOLDER FROM START FOLDER TO BUILD FOLDER

    /*
    //OPERAITONS PERTIANING TO DBSTORE APP NAME FOLDER
    $str_versionNumberAppName=$this->fn_getVersionNumberAppName($str_name_app);      
    if($this->bln_release){      
      $str_target=$obj_pathBuild_DBStoreName->str_pathFolder;       
      foreach (new DirectoryIterator($str_target) as $fileInfo) {
        if ($fileInfo->isDot()) {continue;}                 
        $str_ext=$fileInfo->getExtension();                    
        $str_name=$fileInfo->getBasename(".".$str_ext);                                    
        
        //$this->fn_addEcho("str_pathName: ".$str_pathName);            
        $bln_exist=str_contains($str_name, "-version-");
        if(!$bln_exist){                
          $str_pathName=$fileInfo->getPathName();                    
          $str_path_to=$str_target.DIRECTORY_SEPARATOR.$str_versionNumberAppName.".".$str_ext;            
          rename($str_pathName, $str_path_to);
          //$this->fn_addEcho("rename: ".$str_path_to);    
        }            
      }      

      foreach (new DirectoryIterator($str_target) as $fileInfo) {
        if ($fileInfo->isDot()) {continue;}                 
        $str_ext=$fileInfo->getExtension();                    
        $str_name=$fileInfo->getBasename(".".$str_ext);                                    
        $bln_exist=str_contains($str_name, $str_versionNumberAppName);
        if(!$bln_exist){                
          $str_pathName=$fileInfo->getPathName();          
          unlink($str_pathName);
          //$this->fn_addEcho("UNLINK: ".$str_pathName);    
        }            
      }      
    }
    //OPERAITONS PERTIANING TO DBSTORE APP NAME FOLDER
    //*/

    
    
    //4
    //DELETE EMPTY FOLDER FROM START 
    $this->fn_removeEmptySubFolders($obj_pathGlobal_AppName->str_pathFolder);
    $this->fn_removeEmptySubFolders($obj_pathGlobal_ServerName->str_pathFolder);
    $this->fn_removeEmptySubFolders($obj_pathGlobal_DBStoreName->str_pathFolder);
    //DELETE EMPTY FOLDER FROM START     
    

    //5
    //RETURN PATH OBJECT
    $obj_path=new stdClass();                          
    
    $obj_path->obj_pathGlobal=$obj_pathGlobal;      
    $obj_path->obj_pathGlobal_App=$obj_pathGlobal_App;
    $obj_path->obj_pathGlobal_Server=$obj_pathGlobal_Server;
    $obj_path->obj_pathGlobal_DBStore=$obj_pathGlobal_DBStore;

    $obj_path->obj_pathGlobal_AppName=$obj_pathGlobal_AppName;
    $obj_path->obj_pathGlobal_ServerName=$obj_pathGlobal_ServerName;
    $obj_path->obj_pathGlobal_DBStoreName=$obj_pathGlobal_DBStoreName;
    
    $obj_path->obj_pathBuild=$obj_pathBuild;      
    $obj_path->obj_pathBuild_App=$obj_pathBuild_App;
    $obj_path->obj_pathBuild_Server=$obj_pathBuild_Server;
    $obj_path->obj_pathBuild_DBStore=$obj_pathBuild_DBStore;
    
    $obj_path->obj_pathBuild_AppName=$obj_pathBuild_AppName;
    $obj_path->obj_pathBuild_ServerName=$obj_pathBuild_ServerName;
    $obj_path->obj_pathBuild_DBStoreName=$obj_pathBuild_DBStoreName;
    //RETURN PATH OBJECT
    return $obj_path;
  }   

  function fn_createFolderInParent($str_path_folder_parent, $str_name_folder){      

    $obj_path=new stdClass();                  
    $str_path=$str_path_folder_parent."/".$str_name_folder;            
    $this->fn_createFolder($str_path);       
    $obj_path->str_pathFolder=$str_path;            
    return $obj_path;
  }

  function fn_createFolderAppName($str_path_folder_parent, $str_name_app){      
    
    $obj_path=$this->fn_createFolderInParent($str_path_folder_parent, $this->str_name_folder_app);      
    
    $str_path=$obj_path->str_pathFolder."/".$str_name_app;          
    $this->fn_createFolder($str_path); 
    $obj_path->str_pathFolder=$str_path;                  
    return $obj_path;
  }  
  function fn_createFolderCompileName($str_path_folder_parent, $str_name_app){      
    
    $obj_path=$this->fn_createFolderInParent($str_path_folder_parent, $this->str_name_folder_compile);      
    
    $str_path=$obj_path->str_pathFolder."/".$str_name_app;          
    $this->fn_createFolder($str_path); 
    $obj_path->str_pathFolder=$str_path;                  
    return $obj_path;
  }  
  

  function fn_createFolderServerName($str_path_folder_parent, $str_name_app){      
    
    $obj_path=$this->fn_createFolderInParent($str_path_folder_parent, $this->str_name_folder_server);      
    
    $str_path=$obj_path->str_pathFolder."/".$str_name_app;          
    $this->fn_createFolder($str_path); 
    $obj_path->str_pathFolder=$str_path;                  
    return $obj_path;
  }  

  function fn_createFolderDBStoreName($str_path_folder_parent, $str_name_app){      
    
    $obj_path=$this->fn_createFolderInParent($str_path_folder_parent, $this->str_name_folder_DBStore);      
    
    $str_path=$obj_path->str_pathFolder."/".$str_name_app;          
    $this->fn_createFolder($str_path); 
    $obj_path->str_pathFolder=$str_path;                  
    return $obj_path;
  }    
    
  function fn_debuglinktable($str_nameTable, $str_message){       
    //Note: &$arr_listRecord is passed by reference
    
    $str_sql="SELECT * FROM `vm-xdesign`.`$str_nameTable`;";    
    $stmt=$this->fn_executeSQLStatement($str_sql);    
    
    $str="";      

    while($arr_row=$stmt->fetch()){               

      $InstanceId=$arr_row["InstanceId"];              
      $LinkDependentId=$arr_row["LinkDependentId"];              
      
      $str.=$InstanceId." : ". $LinkDependentId.PHP_EOL;              
      
    }    
    
    
    $this->fn_addEcho("MESSAGE: ".$str_message);
    $this->fn_addEcho($str);              
    
  }

  ////////////////////////////////////////////////////////

  function fn_removeLinkTableEntries($str_nameTable, $int_idRecord){       
    //XXXDEBUG

    //Remove ExisitngEntries
    //$str_sql = "DELETE FROM `$str_nameTable` WHERE `InstanceId` =".$int_idRecord.";";            
    $str_sql = "DELETE FROM `vm-xdesign`.`$str_nameTable`;";            
    //$this->fn_addEcho("str_sql: ".$str_sql);
    $this->fn_executeSQLStatement($str_sql);    
    //Remove ExisitngEntries      
  }

  function fn_getCompileCode($str_typeRecord){

    $int_idRecord=0;
    $str_code="";
    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_compile` WHERE `Type`='$str_typeRecord';";      
    //$this->fn_addEcho("str_sql: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);    
    $arr_row=$stmt->fetch();      
    if($arr_row){
      $int_idRecord=$arr_row["id"];                    
      $str_typeRecord=$arr_row["Type"];                    
      $str_code=$arr_row["Code"];                    
    }
    $str_codeBlock=$this->fn_formatComponentCodeBlock($str_typeRecord, $str_code);
    return $str_codeBlock;
  }

  /* was used by get compiled codd functions , presumably for code block formatting ??
  function fn_getComponentCodeFromDBType($str_type){

    $str_code="";            
    
    $str_sql="SELECT group_concat(Id) as `list` FROM `vm-xdesign`.`xdesign_component` WHERE `Type`='$str_type';";      
    //$this->fn_addEcho("str_sql: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    $arr_row=$stmt->fetch();      
    if($arr_row){
      $str_list=$arr_row["list"];                    
    }
    else{        
      //$this->fn_addEcho("NO CODE FOUND");
    }
    
    if(!empty($str_list)){
      $arr_list=[];                      
      $str_code=$this->fn_getComponentCodeFromListId($str_list, $arr_list);                          
    }
    
    return $str_code;
  } 
  //*/   
  

  function fn_getComponentCodeFromListId($str_listRecord, &$arr_listRecord){
    //Note: &$arr_listRecord is passed by reference
    
    $str_listCode="";

    if(empty($str_listRecord)){
      return  $str_listCode;
    }      
    
    $str_sql="SELECT DISTINCT * FROM `vm-xdesign`.`xdesign_component` WHERE `id` IN($str_listRecord) ;";            
    //$this->fn_addEcho("str_sql: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);    
    $str_listCode=PHP_EOL;      
    
    while($arr_row=$stmt->fetch()){               
      $int_idRecord=$arr_row["id"];              
      $str_type=$arr_row["Type"];      
      $str_code=$arr_row["Code"];          
      /*
      $this->fn_addEcho("int_idRecord: ". $int_idRecord);
      $this->fn_addEcho("str_type: ". $str_type);
      $this->fn_addEcho("str_code: ". $str_code);
      //*/
      $str_listCode.=$this->fn_formatComponentCodeBlock($str_type, $str_code);
      
      
      array_push($arr_listRecord, $str_type);
    }
    
    return  $str_listCode;
  }   

  function fn_formatComponentCodeBlock($str_type, $str_code){

    $str_codeBlock="".PHP_EOL;
    $str_codeBlock.="/*START COMPONENT//*/".PHP_EOL;    
    $str_codeBlock.="/*type: ".$str_type."//*/".PHP_EOL;        
    $str_codeBlock.=$str_code.PHP_EOL;            
    $str_codeBlock.="/*type: ".$str_type."//*/".PHP_EOL;        
    $str_codeBlock.="/*END COMPONENT//*/".PHP_EOL;
    $str_codeBlock.=PHP_EOL;

    return  $str_codeBlock;
  }
  

  function fn_updateProjectFileWithjsonObject($int_idRecord, $bln_version){     
    
    $str_code="";      
    $str_listRecord="";

    

    $str_code="";      
    $str_sql="SELECT group_concat(distinct LinkDependentId) as `list` FROM `vm-xdesign`.`xdesign_instance_link` WHERE `InstanceId`='$int_idRecord';";      
    //$this->fn_addEcho($str_sql);      
    $stmt=$this->fn_executeSQLStatement($str_sql);    
    $arr_row=$stmt->fetch();      
    if($arr_row){
      $str_listRecord=$arr_row["list"];                            
    }
    else{
      //$this->fn_addEcho("NO CODE FOUND");
    }

    //$str_listRecord.=",".$int_idRecord;//add reference to self
    
    
    $arr_listRecord=[];
    $str_code_json=$this->fn_getInstanceSerializeFromListId($str_listRecord, $arr_listRecord);

    $str_listCodeStart="";
    $str_listCodeStart.=PHP_EOL;
    $str_listCodeStart.="/*START INSTANCE JSON MAP//*/".PHP_EOL;        
    $str_listCodeStart.="var obj_InstanceJSONMap = new Map([".PHP_EOL;

    $str_listCodeEnd="";
    $str_listCodeEnd.="]);".PHP_EOL;
    $str_listCodeEnd.="/*END INSTANCE JSON MAP//*/".PHP_EOL;

    $str_code.=$str_listCodeStart;
    if($bln_version){
      //$str_code.=$str_code_json;      
    }
    $str_code.=$str_code_json;      
    $str_code.=$str_listCodeEnd;      

    return $str_code;
   }     

   function fn_getInstanceSerializeFromListId($str_listRecord, &$arr_listRecord){
    //Note: &$arr_listRecord is passed by reference
    
    $str_listCode="";

    if(empty($str_listRecord)){
      return  $str_listCode;
    }      
    
    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE `id` IN($str_listRecord) ;";
    //$this->fn_addEcho($str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);
    $str_listCode=PHP_EOL;      

    while($arr_row=$stmt->fetch()){               
      $int_idRecord=$arr_row["id"];              
      $str_type=$arr_row["Type"];      
      $str_code=$arr_row["Serialize"];         
      /*
      $this->fn_addEcho("int_idRecord: ". $int_idRecord);
      $this->fn_addEcho("str_type: ". $str_type);
      $this->fn_addEcho("str_code: ". $str_code);
      //*/

      
      $str_listCode.="[".$int_idRecord.", ".$str_code."],".PHP_EOL;        
      array_push($arr_listRecord, $str_type);
    }

    $str_listCode=trim($str_listCode);//remove whitespace
    $str_listCode=substr($str_listCode, 0, -1);//trim trailing comma      
    $str_listCode.=PHP_EOL;//re-add  new line
    
    return  $str_listCode;
  }

  function fn_getComponentMap(){

    $str_code="";
    
    //Now have a list of all 

    $arr_list=$this->arr_ComponentMap;
    
    $str_map="";
    $str_map.="//START AUTO GENERATED COMPONENT MAP".PHP_EOL;
    $str_map.="const obj_ComponentMap = new Map([";        
    $arr_length = count($arr_list);        
    for($i=0;$i<$arr_length;$i++)
    {        
      $str_val=$arr_list[$i];                
      $str_val=strtolower($str_val);        
      $str_key=$str_val;
      $str_map.="['$str_key', $str_val],";
    }
    $str_map = rtrim($str_map, ',');
    $str_map.="]);".PHP_EOL;        
    $str_map.="//END AUTO GENERATED MAP".PHP_EOL;
    //$this->fn_addEcho("str_map: ".$str_map);

    $str_code.=$str_map;
    
    
    return $str_code;
  }
  

  function fn_updateTemplateFile($str_name_file_xdesign, $int_idRecord, $str_nameTargetClass){     
    

    $str_code = file_get_contents($str_name_file_xdesign);  
    
    $str_search="{int_idRecord}";
    $str_replace=$int_idRecord;
    $str_code = str_replace($str_search, $str_replace, $str_code);
  
    $str_search="{str_nameTargetClass}";
    $str_replace=$str_nameTargetClass;
    $str_code = str_replace($str_search, $str_replace, $str_code);
  
    if(!empty($str_code)){file_put_contents($str_name_file_xdesign, $str_code);}
    //END Write Record
   
   }             

   ////////////////////////////////////////////////

   function fn_addPalettePinComponentToLinkTable($int_idRecordInstance){//added during packageproject           
    //version uses save routnie to construct sufficient list    
    //after this operaiton the list will be technically incorrect - including all pinned, including  required pinned componnents.
    //however the list will be correct again when the operaiton is next saved , or versioned      

    //$this->fn_getMySQLGroupConcatMaxLength();
    
    //get all pinned components , and also any dependnt ids    
    $str_sql="SELECT GROUP_CONCAT(CONCAT_WS(IF(`DependentId`='','',','), `id`, `DependentId`)) AS `list` FROM `vm-xdesign`.`xdesign_instance` WHERE `PalettePin` AND (".$this->str_protectedInstanceCriteria.");";                        
    //$str_sql="SELECT GROUP_CONCAT(CONCAT_WS(IF(`DependentId`='','',','), `id`, `DependentId`)) AS `list` FROM `vm-xdesign`.`xdesign_instance` WHERE `PalettePin`;";                        
    //$this->fn_addEcho("str_sql: ".$str_sql);    
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    $arr_row=$stmt->fetch();      
    if($arr_row){
      $str_list=$arr_row["list"]; 
      $arr_id=explode(",",$str_list);//grab list of child instance ids      
      $arr_length = count($arr_id);
      for($i=0;$i<$arr_length;$i++){
        $int_idRecord=$arr_id[$i];          
        //$this->fn_addEcho($int_idRecordInstance.": ".$int_idRecord);          
        $this->fn_addListToLinkTable("xdesign_instance_link", $int_idRecordInstance, $int_idRecord); //add record    
        $this->fn_compileLinkList("xdesign_instance_link", "", $int_idRecordInstance, $int_idRecord);// recursive function will find all entries in child dependnt lists     
      }                                           
    }
  }       
  

  function fn_compileLinkList($str_nameTable, $str_listDependentRecord, $int_idRecordInstance, $int_idDependentRecord){               
    
    $str_sql = "SELECT `DependentId` as `list` FROM `vm-xdesign`.`xdesign_instance`  WHERE `id` ='$int_idDependentRecord' AND !INSTR('$str_listDependentRecord', `DependentId`);";
    //$this->fn_addEcho("str_sql: ".$str_sql);    
    $stmt=$this->fn_executeSQLStatement($str_sql);                
    $arr_row=$stmt->fetch();                  
    if($arr_row){        
      $str_Newlist=$arr_row["list"];        
      $str_listDependentRecord.=",";        
      $str_listDependentRecord.=$str_Newlist;//Create default dependency list                          
      //$this->fn_addEcho("[$int_idDependentRecord] FOUND NEW LIST: [".$str_Newlist."]");                                    
      $this->fn_addListToLinkTable($str_nameTable, $int_idRecordInstance, $str_Newlist);                                   
      $arr_id=explode(",",$str_Newlist);//grab list of child instance ids      
      $arr_length = count($arr_id);
      for($i=0;$i<$arr_length;$i++){$this->fn_compileLinkList($str_nameTable, $str_listDependentRecord, $int_idRecordInstance, $arr_id[$i]);}        
    }  
  } 
  

  function fn_addDependentComponentToLinkTable($str_nameTable, $int_idRecord){                         
    
    //INSERT REQUIRED ENTRIES 
    $this->fn_addListToLinkTable($str_nameTable, $int_idRecord, $int_idRecord); //add self        
    $this->fn_compileLinkList($str_nameTable, "", $int_idRecord, $int_idRecord);// recursive function will find all entries in child dependnt lists     
    //INSERT REQUIRED ENTRIES      
  }

  

  function fn_addListToLinkTable($str_nameTable, $int_idRecord, $str_listDependentId){

    //create  entries relating to current instance
    $str_sql = "INSERT INTO `vm-xdesign`.`$str_nameTable` (InstanceId, LinkDependentId)  VALUES (?,?);";      
    //$this->fn_addEcho("str_sql: ".$str_sql);
    //create  entries relating to current instance 
    
    if(empty($str_listDependentId)){
      $str_listDependentId="";//safety check , perhaps could be nulkl etc
    }      
    $str_listDependentId=strval($str_listDependentId);
    $arr_id=explode(",",$str_listDependentId);//grab list of child instance ids            
    $arr_length = count($arr_id);                  
    for($i=0;$i<$arr_length;$i++)
    {
      $int_id=$arr_id[$i];                      
      $bln_isNumeric=is_numeric($int_id);        
      if($bln_isNumeric){
        //$this->fn_addEcho("stmt->execute: ".$int_idRecord.": ".$int_id);
        $this->fn_executeSQLStatement($str_sql, [$int_idRecord, $int_id]);        
      }        
    }
  }
  

  function fn_getPaletteComponentListIdFromLinkTable($int_idRecord){        
    
    $str_sql="SELECT group_concat(DISTINCT `xdesign_component`.`id`) AS `listId` FROM `vm-xdesign`.`xdesign_instance_link` JOIN `vm-xdesign`.`xdesign_instance` ON LinkDependentId=`xdesign_instance`.`id` JOIN `vm-xdesign`.`xdesign_component` ON `xdesign_instance`.`type`=`xdesign_component`.`type` ";
    $str_sql.="WHERE ";      
    $str_sql.="`InstanceId`=".$int_idRecord.";";
    //$this->fn_addEcho("str_sql: ".$str_sql);                              
    $stmt=$this->fn_executeSQLStatement($str_sql);    
    $arr_row=$stmt->fetch();            
    if($arr_row){$str_listId=$arr_row["listId"];}      
    //$this->fn_addEcho("xxx str_listId: ".$str_listId);                              
    return $str_listId;
  }           

  function fn_getPaletteComponentListExpand($str_listType){    

    
    /*
    take the given list
    query if that list has a extend or classlist that meets criteria
    ie not in notset, component, tag, not equal to blank, and not already in the same list
    if rows are returned add each colum to the end of the list, and repeat with the expanded list
    if rows are not returned exit and return
    //*/

    //take the given list
    //$this->fn_addEcho("str_listType: ".$str_listType);                   

    $str_listExclude="'','notset','component','tag'";

    if(empty($str_listType)){return $str_listType;}
    $s="";
    $s.="SELECT `Type`, `Extend` AS `listExtend`, `ClassList` AS `listClass` FROM `vm-xdesign`.`xdesign_component` where `Type` IN($str_listType) ";
    $s.="AND ";
    $s.="(";
    $s.="`Extend` ";
    $s.="NOT IN";
    $s.="(";
    $s.=$str_listType.", ";
    $s.=$str_listExclude;
    $s.=") ";
    $s.="OR ";
    $s.="`ClassList` ";
    $s.="NOT IN";
    $s.="(";
    $s.=$str_listType.", ";
    $s.=$str_listExclude;
    $s.=") ";
    $s.=") ";
    $s.=";";                              
    $str_sql=$s;      
    
    //$this->fn_addEcho("str_sql: ".$str_sql);

    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    $this->str_listClassExpand="";    
    while($arr_row=$stmt->fetch(PDO::FETCH_ASSOC)){
        $str_listType="";
        $str_listTypeLookup="";
        //if rows are returned add each colum to the end of the list, and repeat with the expanded list
        $str_listExtend=$arr_row["listExtend"];
        $str_listClass=$arr_row["listClass"];        
        
        $str_value=$str_listExtend;        
        $arr_value = explode(",",$str_value);            
        $this->fn_addBracketArray($arr_value, "'");
        $str_value=implode(",", $arr_value);                  
        $bln_inStr=$this->fn_inStr(",'".$str_listExclude."',", ",".$str_value.",");                        
        if(!$bln_inStr){
          $str_listType.=$str_value.",";          
        }
        
        $str_value=$str_listClass;                
        $arr_value = explode(",",$str_value);            
        $this->fn_addBracketArray($arr_value, "'");
        $str_value=implode(",", $arr_value);                            
        $bln_inStr=$this->fn_inStr(",'".$str_listExclude."',", ",".$str_value.",");                        
        if(!$bln_inStr){
          $str_listType.=$str_value.",";          
        }
        if(!empty($str_listType)){
          $this->str_listClassExpand.=$str_listType;                                  
        }
    }           
    $this->str_listClassExpand=trim($this->str_listClassExpand, ",");          
    //$this->fn_addEcho("str_listClassExpand: ".$this->str_listClassExpand);    
    
  }
  
  
  function fn_cleanArray($arr_ToClean){  
    
    //START Clean Array
    $arr_Clean=[];
    $str_Seen="notset,";
    foreach ($arr_ToClean as $str_ToClean) {                
      $str_Clean = trim(preg_replace('/["\']/', "", $str_ToClean));//replace single and double quotes , and trims                                     
      $bln_inStr=$this->fn_inStr(",".$str_Seen.",", ",".$str_Clean.",");                        
      if($bln_inStr){          
        continue;
      }                        
      $str_Seen.=$str_Clean.",";
      array_push($arr_Clean, $str_Clean);        
    }
    return  array_filter($arr_Clean);//remove any empties              
    //END Clean Array
  }
  function fn_dedupeArray($arr_ToClean){  
    
    //START Clean Array
    $arr_Clean=[];
    $str_Seen="";
    foreach ($arr_ToClean as $str_ToClean) {                
      $str_Clean = trim($str_ToClean);//replace single and double quotes , and trims                                     
      $bln_inStr=$this->fn_inStr(",".$str_Seen.",", ",".$str_Clean.",");                        
      if($bln_inStr){          
        continue;
      }                        
      $str_Seen.=$str_Clean.",";
      array_push($arr_Clean, $str_Clean);        
    }
    return  array_filter($arr_Clean);//remove any empties              
    //END Clean Array
  }

  function fn_getPaletteComponentListType($str_listId){  
    
    if(empty($str_listId)){return;}      
    $str_listType="";      
    $str_sql="SELECT concat(\"'\", group_concat(`Type` SEPARATOR \"','\"), \"'\")  AS `listType` FROM `vm-xdesign`.`xdesign_component` WHERE Id IN($str_listId);";                              
    $stmt=$this->fn_executeSQLStatement($str_sql);      
    $arr_row=$stmt->fetch(); 
    if($arr_row){$str_listType=$arr_row["listType"];}         
    $this->str_listPaletteComponentType=$str_listType;      
  }   
  

  function fn_getComponentLinkList($str_list){      
    
    $this->str_ComponentLinkList="";
    $this->fn_getComponentLinkListRecursive($str_list);                  
    $arr_Clean=$this->fn_cleanArray(explode(",", $this->str_ComponentLinkList));                  
    $str_list=implode(",", $arr_Clean);      
    return $str_list;      
  }
  function fn_getComponentLinkListRecursive($str_list){

    $arr_list=$this->fn_cleanArray(explode(",", $str_list));
    foreach ($arr_list as $str_type) {  

      if($str_type==="notset"){continue;}                
      $this->str_ComponentLinkList.=$str_type.",";           
      
      $str_sql="SELECT Concat(`Extend`, ',', `ClassList`) AS `listExtend` FROM `vm-xdesign`.`xdesign_component` WHERE `Type`=?;";                              
      $stmt=$this->fn_executeSQLStatement($str_sql, [$str_type]);            
      $arr_row=$stmt->fetch();            
      if($arr_row){                
        $str_column_value=$arr_row["listExtend"];              
        if($str_column_value==="notset, notset"){continue;}                                    
        if(!empty($str_column_value)){                    
          $this->str_ComponentLinkList=$str_column_value.",".$this->str_ComponentLinkList;                        
          $this->fn_getComponentLinkListRecursive($str_column_value);                              
        }
      }              
    }                  
  }
  
  

  function fn_compileComponentCodeFromLinkTable($int_idRecord){      

    

    //set default values            
    $this->str_listPaletteComponentType="";
    $this->str_listInstanceLinkExtend="";      
    $this->str_listClassExpand="";    
    //set default values
    
    $str_code="";        
    $str_listClass="";
    $str_listCodeClass="//START LINKTABLE".PHP_EOL;                  
    

    //$this->fn_addEcho("int_id_record: ".$int_idRecord);      
    
    //START Get List of Component Ids listed to be written to the browser.
    //important also generates component map      
    $str_listId=$this->fn_getPaletteComponentListIdFromLinkTable($int_idRecord);            
    //$this->fn_addEcho("xxx str_listId: ".$str_listId);
    //END  Get List of Component Ids listed to be written to the browser.                  

    //link table is no longer referenced past this point    
    
    //START get LIST OF XTRA CLASSES
    $this->fn_getPaletteComponentListType($str_listId);
    //$this->fn_addEcho("xxx str_listPaletteComponentType: ".$this->str_listPaletteComponentType);      
    //END get LIST OF XTRA CLASSES        

    
    
    //START get LIST OF XTRA CLASSES            
    $this->fn_getPaletteComponentListExpand($this->str_listPaletteComponentType);                                          
    $arr_listClassExpand=$this->fn_dedupeArray(explode(",", $this->str_listClassExpand));                        
    $this->str_listClassExpand=implode(",", $arr_listClassExpand);                        
    //END get LIST OF XTRA CLASSES 
    

    $str_list1=$this->str_listPaletteComponentType;
    $str_list2=$this->str_listClassExpand;      
    
    $str_listDependent=$this->fn_getComponentLinkList($str_list2.",".$str_list1);                  ;            
    $str_listClass=$str_listDependent;
    $str_listClass=trim($str_listClass, ',');      
    $arr_listClass=explode(",",$str_listClass);//grab list of child instance ids      
    //$arr_listClass=array_reverse($arr_listClass); 
    $arr_listClass=$this->fn_cleanArray($arr_listClass);                  
    $str_listClass=implode(",", $arr_listClass);                  
    $this->str_listClassExpand=$str_listClass;

    
    
    //START RETRIEVE CLASSES IN ORDER FROM XTRA CLASS LIST         
    foreach ($arr_listClass as $str_nameClass) {                
      //$this->fn_addEcho("AAA str_nameClass ".$str_nameClass);                                 

      $str_sql="SELECT `id` AS `recordId`, `Type` AS `recordType`, `Code` AS  `recordCode` FROM `vm-xdesign`.`xdesign_component` WHERE `Type`=?;";                            
      //dont use protected here as it will be too restrictive
      $stmt=$this->fn_executeSQLStatement($str_sql, [$str_nameClass]);      
      $arr_row=$stmt->fetch();      
      
      if($arr_row){
        $str_recordId=$arr_row["recordId"];   
        $str_recordType=$arr_row["recordType"];                       
        if($str_recordType==="texteditor"){          
          $this->bln_needQuill=true;          
        }

        $str_recordCode=$this->fn_formatComponentCodeBlock($str_recordType, $arr_row["recordCode"]);
        $str_listCodeClass.=$str_recordCode;//add to the lcode block list to add to the return code value at the end of this function
        
        //remove any existing entries with same record id
        //if this is not done , its possible to get adiditonaly classes added twice, which will error
        //also it wont be possible to change order of named classes , should they be pallett items          
        $str_listId = str_replace(",".$str_recordId.",", ",0,", ",".$str_listId.","); 
        $str_listId =trim($str_listId, ",");          
        //Very important, as we have set the ids to zero, they will non longer be added to the component map as part of the $str_listId
        //this step adds them to the array independently of the usual funciton fn_getComponentCodeFromListId
        array_push($this->arr_ComponentMap, $str_recordType);               
      } 
      
    } 
    //END RETRIEVE CLASSES IN ORDER FROM XTRA CLASS LIST
    
    $str_listCodeClass.="//END LINKTABLE".PHP_EOL;   
    
    $str_code="";          
    if(!empty($str_listCodeClass)){
      $str_code.=PHP_EOL.PHP_EOL.$str_listCodeClass.PHP_EOL.PHP_EOL;//tack on ou additional class blocks
    }
    if(!empty($str_listId)){
      $str_code.=$this->fn_getComponentCodeFromListId($str_listId, $this->arr_ComponentMap);//get standard pallet class blocks  
    }      
    return $str_code;
  }

  

  
  
  

}
