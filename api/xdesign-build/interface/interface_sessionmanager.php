<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE


class interface_sessionmanager extends interface_servermanager {  
  function __construct() {            
    
    parent::__construct();  
      
  }  
  function fn_loadUser($arr_row, $bln_val=false){   

    global $SYSTEM_DEFAULT_DATABASE;  
    
     //$this->fn_varDump($arr_row, "arr_row", true);       
    //this is where user param object is created.  
    //this funciton is used by this page where no session exists before login.  
    //this function is used by login, once the user is authenticated.
    //The session is created from this object.  
    //From then on the userParam is created from session in fn_load SessionUser    

    $obj_user=new metaUser();    
    $obj_user->fn_initialize($arr_row);  
    $this->fn_getMetaMoverId($obj_user);            
    return $obj_user;
  }
    
  function fn_loadSessionUser(){ 

    $str_sessionParam="UserLoginSession";
    
    global $SYSTEM_DEFAULT_DATABASE;              
    if(empty($SYSTEM_DEFAULT_DATABASE)){
      //$this->fn_setError("SYSTEM DEFAULT DATABASE IS EMPTY");            
      //exit;
    } 

    
    //$this->fn_varDump($_SESSION, "_SESSION");
    //$this->fn_varDump($_COOKIE, "_COOKIE");        

    //Session has timed out 
    $str_sessionValue="";
    if(!empty($_SESSION[$str_sessionParam])){
      $str_sessionValue=$_SESSION[$str_sessionParam];
    }
    
    //$str_sessionValue="";    
    
    if(empty($str_sessionValue)){    
      $this->fn_varDump("Open User Via Cookie AuthorizeUserId", "", true);
      
      $str_authorizeUserId=$this->fn_getCookie("AuthorizeUserId");      
      if(empty($str_authorizeUserId)){
        //$this->fn_setErrorLogin("Please login again");                        
        exit;
      }

      $this->fn_openUserViaID($str_authorizeUserId);                 
    }    
    else{
      //$this->fn_addConsole("Session is valid");      
    }   
    
    //safety check
    if(empty($_SESSION[$str_sessionParam])){
      $this->fn_setSessionError("Session is not valid: [$str_sessionParam]");                                
        exit;
    }   
    
    $obj_userSession=unserialize($_SESSION[$str_sessionParam]);                                          
    $this->fn_setUserDate($obj_userSession);//Set Date
    //$this->fn_debugUserParam($obj_userSession);          
    //$this->fn_varDump($obj_userSession, "obj_userSession", true);
    
    return $obj_userSession;        
  } 

  function fn_openSystem($MetaMoverSystemIdTarget){    
      
    //$this->fn_varDump($MetaMoverSystemIdTarget, "MetaMoverSystemIdTarget", true);
    
    //$_COOKIE["USER_LOGIN"]=serialize($_SESSION["UserLoginSession"]);                              
    
    $this->obj_userLogin->MetaUserSystemId=$MetaMoverSystemIdTarget;              
    $this->fn_updateUserRecordSystemID();    
    $this->fn_openUserViaID($this->obj_userLogin->MetaUserId);    
    
  }

  
  function fn_openUserViaID($MetaUserId){    
      
    $this->obj_userLogin=$this->fn_openUser($MetaUserId);           
    

    $this->fn_loadQueryListFromDB();    
    
    //Write Cookie for  cookie login
    $this->fn_setCookie("AuthorizeUserId", $this->obj_userLogin->MetaUserId);
    //Write Cookie for  cookie login
    
    $obj_userGroup=$this->fn_openUser($this->obj_userLogin->MetaDataOwnerId);          
    //END Get Group Owner and Admin 
    
    //START Get System Owner and Base User of New System
    $str_sql="SELECT * FROM `meta_user`.`meta_system` JOIN `meta_data`.`meta_data` on `meta_system`.`MetaSystemId`=`meta_data`.`DataKeyValue`
    WHERE TRUE AND
    (DataSchemaName='meta_user' AND 
    DataTableName='meta_system' AND
    DataKeyName='MetaSystemId') AND
    MetaSystemId=:MetaSystemId 
    ;";         
    
    
    $stmt = $this->fn_executeSQLStatement($str_sql, [
      'MetaSystemId'=>$this->obj_userLogin->MetaUserSystemId        
    ]);        
        
    $arr_row=$stmt->fetch();  
    
    $obj_metaSystem=new metaSystem($this);                             
    $obj_metaSystem->fn_initialize($arr_row);

    


    if(empty($arr_row)){
      
      $this->fn_addMessage("Error: No System Record Found or without Data Record: fn_openUserViaID");
      return;
    }

    $MetaSystemUserId=$arr_row["MetaSystemUserId"];
    $obj_userSystem=$this->fn_openUser($MetaSystemUserId);
    
    $MetaDataOwnerId=$arr_row["MetaDataOwnerId"];
    $obj_userBase=$this->fn_openUser(100);
    //END Get System Owner and Base User of New System
    
    $this->obj_userLogin->obj_userBase=$obj_userBase;
    $this->obj_userLogin->obj_userSystem=$obj_userSystem;                        
    $this->obj_userLogin->obj_userGroup=$obj_userGroup; 
    $this->obj_userLogin->obj_metaSystem=$obj_metaSystem->obj_param; 
    
    
    //$this->fn_varDump($this->obj_userLogin, "fn_openUserViaID this->obj_userLogin", true);                       
    
    $this->fn_setSystemOwner();      
    $this->fn_blankSession("UserLoginSession");
    $this->fn_setSession("UserLoginSession", serialize($this->obj_userLogin));                        
  }  

  function fn_updateSessionPinAll($bln_value, $MetaMoverSystemId=0){

    $int_value=0;
    if($bln_value){
      $int_value=1;
    }

    if(!$MetaMoverSystemId){
      $MetaMoverSystemId=$this->obj_userLogin->MetaUserSystemId;
    }

    

    $str_sql="UPDATE      
       `meta_user`.`meta_mover`
      SET
      `meta_mover`.`SessionPin`=$int_value
      WHERE TRUE AND                  
      MetaMoverSystemId=:MetaMoverSystemId AND 
      MetaMoverType='User'
      ;";                    
      $stmt = $this->fn_executeSQLStatement($str_sql, [          
        'MetaMoverSystemId'=>$MetaMoverSystemId,
      ]);        
  }
  
  
  function fn_updateSessionPin($bln_value){

    $int_value=0;
    if($bln_value){
      $int_value=1;
    }

    $str_sql="UPDATE      
       `meta_user`.`meta_mover`
      SET
      `meta_mover`.`SessionPin`=$int_value
      WHERE TRUE AND                  
      MetaMoverSystemId=:MetaMoverSystemId AND 
      MetaMoverType='User' AND
      MetaMoverUserId=:MetaMoverUserId AND 
      MetaMoverId=:MetaMoverId
      ;";                    
      $stmt = $this->fn_executeSQLStatement($str_sql, [          
        'MetaMoverSystemId'=>$this->obj_userLogin->MetaUserSystemId,
        'MetaMoverUserId'=>$this->obj_userLogin->MetaUserId,        
        'MetaMoverId'=>$this->obj_userLogin->MetaMoverId        
      ]);              
      
  }

  

}//END CLASS  
  ///////////////////////////DATAMANAGER