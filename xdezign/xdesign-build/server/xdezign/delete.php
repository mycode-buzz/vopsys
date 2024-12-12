<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

/////////////////////////HEADER
require_once __DIR__."/xdesign.php";
/////////////////////////HEADER


class page extends xdesign{
  function __construct() {          
    parent::__construct();
  }            
  function fn_executePage() {        
    parent::fn_executePage();          

    $obj_post=$this->obj_post;                           
    
    switch($obj_post->Action){                             
        case "delete":
            $this->fn_deleteInstance();
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

  function fn_deleteInstance(){
    $obj_post=$this->obj_post;      

    $int_idRecord=$obj_post->RecordId;

    global $SYSTEM_APPID;        
    
    if($int_idRecord===$SYSTEM_APPID){
      return;//safety patch
    }    

    $bln_protected=$this->fn_isProtectedInstance($int_idRecord);    
    
    if($bln_protected){
      return;
    }    

    $obj_instance=$this->fn_getInstance($int_idRecord);
    //Get instance to pass type thru to component

    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_instance` WHERE `id`=:id;";                          
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'id' => $int_idRecord
    ]);

    //$this->fn_addEcho("Database Instance Deleted: " .$int_idRecord);                                  

    $this->fn_removeOrphanFolderInstanceFile($int_idRecord);//relates to single deleted folder              

    $this->fn_deleteComponent($obj_instance);
  }
  function fn_deleteComponent($obj_instance){      

    $bln_protected=$this->fn_isProtectedComponent($obj_instance);
    if($bln_protected){      
      return;
    }           
    
    $str_sql="DELETE FROM `vm-xdesign`.`xdesign_component` where `type`=:str_typeRecord;";                
    //$this->fn_addEcho("str_sql: ".$str_sql);            
    $stmt=$this->fn_executeSQLStatement($str_sql, ['str_typeRecord' => $obj_instance->Type]);        

    $this->fn_removeOrphanFolderComponentFile($obj_instance->Type);//relates to single deleted folder              
  }
  
}
/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
