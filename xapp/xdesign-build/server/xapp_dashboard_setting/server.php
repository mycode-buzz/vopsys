<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
/////////////////////////HEADER

require_once MAINTAINROOT . "/maintain.php";

class page extends maintain{
  function __construct() {          
    parent::__construct();
  }            
  function fn_executePage() {        
    parent::fn_executePage();          
    
    $int_idMetaRowz=$this->obj_post->MetaRowzId;
    if(!isset($this->obj_post->MetaFormId)){        
      $this->obj_post->MetaFormId=0;                
    } 
    $int_idMetaForm=$this->obj_post->MetaFormId;                         
    
    //$this->fn_addEcho("START SETTING  this->obj_post->Action", $this->obj_post->Action, true);                      
    //*
    switch($this->obj_post->Action){                            
        case "maintain_debug_release":           
          $this->fn_maintain_debug_release();
        break;                                                     
        case "maintain":                 
          $this->fn_maintain();
        break;
        case "provision":                 
          $this->fn_provision();
        break;
        case "backup":                 
          $this->fn_backup();
        break;         
        case "form_add_group":       
          $this->fn_form_add_group($int_idMetaRowz);
        break;                        
        case "form_movedown":                             
          $this->fn_form_movedown($int_idMetaForm);
        break;                        
        case "form_moveup":                                              
          $this->fn_form_moveup($int_idMetaForm);
        break;                        
        case "form_gap":                                                  
          $this->fn_form_gap($int_idMetaForm);
        break;                                
        case "addNewRowz":    
          $this->fn_addDefaultRowz();
        break;                                                
        case "addNewColumn":    
          $this->fn_addDefaultColumn();
        break;                                                
        case "hideArchive":                 
          $this->fn_hideArchive();
        break;                                                
        case "showArchive":                 
          $this->fn_showArchive();
        break;                                                
        case "hideRowz":                 
          $this->fn_hideRowz();
        break;                                                
        case "showRowz":                 
          $this->fn_showRowz();
        break;                                                
        case "import_file":                 
          $this->fn_importFile();
        break;                                                
      default:          
        //$this->fn_varDump($_POST, "_POST", true);
        if($_POST["Action"]==="import_file"){          
          $this->fn_importFile();
          return;
        }
        $this->fn_setError("DASHBOARD SETTING APP ACTION Not Handled: [".$this->obj_post->Action."]");          
        exit;
    }    
    //*/

    //$this->fn_addEcho("END SETTING  this->obj_post->Action", $this->obj_post->Action, true);                      

  }
}

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER