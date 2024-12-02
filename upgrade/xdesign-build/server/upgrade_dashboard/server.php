<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
/////////////////////////HEADER

//VER 1.1

class page extends interface_datamanager{  
  function __construct() {    
    
    parent::__construct();
  }    
  function fn_executePage() {        
    parent::fn_executePage();    

    $obj_post=$this->obj_post;
    switch($obj_post->Action){                       
      case "upgradeXDesign":    
        $this->fn_upgradeXDesign();    
      break;                                                  
    }   
}
   
function fn_upgradeXDesign(){                    

  $str_pathFolderXDesignBuild=VOPSYSROOT."/xdezign/xdesign-build";        
  
  //new install or upgrade
  $this->str_labelRecycleRoot="xdesign";  
  $bln_newInstall=true;    
  $bln_upgrade=false;    
  if(file_exists($str_pathFolderXDesignBuild)){
    $bln_newInstall=false;    
    $bln_upgrade=true;    
    $str_processType="UPGRADE...";        
  }
  else{
    $str_processType="NEW_INSTALL...";    
  }    
  $this->fn_addEcho($str_processType);                                         
  //new install or upgrade  
  
  //Check a version folder exists
  $str_pathParent=dirname($str_pathFolderXDesignBuild);        
  $this->str_nameFolderLatestVersion=$this->fn_getFolderLatestVersion($str_pathParent);
  if(empty($this->str_nameFolderLatestVersion)){
    $this->fn_addEcho("ABORT INSTALL: No version folder found in: ".$str_pathParent);                     
    return;
  }         
  //Check a version folder exists  

  //Recycle xdesign-build  
  //$str_pathFolderRecycle=$this->fn_copyToRecycleBin($str_pathFolderXDesignBuild, "UPGRADE");  
  //Recycle xdesign-build
  
  //Check  xdesign-build does not exist
  $bln_exist=file_exists($str_pathFolderXDesignBuild);  
  if(!$bln_exist){   
    $this->fn_addEcho("ABORT INSTALL:: xdesign-build does not  exist: ".$str_pathFolderXDesignBuild);                     
  }
  //Check  xdesign-build does not exist

  
  
  //COPY VERSION FOLDER To XDESIGN-BUILD
  $str_source=$str_pathParent."/".$this->str_nameFolderLatestVersion;          
  $str_destination=$str_pathFolderXDesignBuild;          
  $this->fn_copyFolder($str_source, $str_destination);            
  //COPY VERSION FOLDER TO XDESIGN-BUILD   
  
  if($bln_upgrade){    
    $this->fn_deleteOldVersionFile($str_pathFolderXDesignBuild);//remove any files which have been uneussarilz copied back , due to unique names
  }  

  

  $this->fn_addEcho($this->str_nameFolderLatestVersion." COPIED TO ".$str_pathFolderXDesignBuild);         

  
    
  //IMPORT SQLDUMP FILE
  $this->fn_addEcho("STEP 1: IMPORT MYSQLDUMP TO RELEVANT FOLDER");          
  

  //Set the next instance id to 1000000      
  $this->fn_addEcho("STEP 2: SET AUTO INCREMENT TO 1000000 ON INSTANCE TABLE");                             

  if($bln_upgrade){      
    //Hit the "Import" button in the XDesign Program
    $this->fn_addEcho("STEP 3: HIT THE XDESIGN 'MAINTAIN' BUTTON");
  }  
  
  //$this->fn_addEcho("AUTOMATION END");                           

  

  

}    



function fn_getFolderLatestVersion($str_pathParent) {

  $str_nameFolderLatestVersion="";
  foreach (new DirectoryIterator($str_pathParent) as $fileInfo) {
    if ($fileInfo->isDot()) {continue;}                 
    if ($fileInfo->isFile()) {continue;}                                   
    $str_name=$fileInfo->getBasename();                                          
    $bln_exist=str_contains($str_name, "-version-");
    if(!$bln_exist){continue;}    
    $str_nameFolderLatestVersion=$str_name;      
  }
  return $str_nameFolderLatestVersion;
}

function fn_deleteOldVersionFile($str_pathParent, ) {

  $str_nameFolderLatestVersion="";
  foreach (new DirectoryIterator($str_pathParent) as $fileInfo) {
    if ($fileInfo->isDot()) {continue;}                 
    //if (!$fileInfo->isFile()) {continue;}                                   
    $str_path=$fileInfo->getPathname();                                          
    $str_name=$fileInfo->getBasename(".mjs");                                          
    $bln_exist=str_contains($str_name, "-version-");
    if(!$bln_exist){continue;}
    //$str_name;      
    
    if( strtolower($str_name)===strtolower($this->str_nameFolderLatestVersion)){
      continue;
    }    
    unlink($str_path);
  }
  
}

}//END OF CLASS

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER
?>