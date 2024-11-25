<?php

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
/////////////////////////HEADER

/////////////////////////AUTOLOAD
require_once dirname(__FILE__ , 7). "/composer/sendgrid/vendor/autoload.php";        
/////////////////////////AUTOLOAD

class page extends interface_datamanager{
  function __construct() {          
    parent::__construct();
  }
  
  function fn_executePage() {            
    parent::fn_executePage();        
    
    
    $this->bln_debugLogin=true;    
    
    

    $obj_post=$this->obj_post;       
    $Action=$obj_post->Action;
    $this->AuthorizeUserStatus=false;     

    

    
    //*
  parse_str($_SERVER['QUERY_STRING'], $query);     
  if(!empty($query["MetaInviteSystemId"])){        
    //*
    $MetaInviteSystemId=$this->fn_getArrayItem($query, "MetaInviteSystemId");        
    $MetaMoverInviteToEmail=$this->fn_getArrayItem($query, "MetaMoverInviteToEmail");    
    $str_sql="UPDATE `meta_user`.`meta_mover` SET `MetaMoverAutoAccept`=1 WHERE TRUE
    AND `MetaMoverUserId`=0 
    AND MetaMoverType='User' 
    AND MetaMoverStatus='Enabled'     
    AND MetaMoverSystemId=:MetaInviteSystemId 
    AND MetaMoverEmail=:MetaMoverInviteToEmail
    ORDER BY `MetaMoverId` DESC LIMIT 1;";    
    $stmt = $this->fn_executeSQLStatementLogin($str_sql, [      
      'MetaInviteSystemId' => $MetaInviteSystemId,
      'MetaMoverInviteToEmail' => $MetaMoverInviteToEmail
    ]);               
    $this->fn_navigateSubdomain("desk");      
    //*/
    //exit;    
  }
  //*/

  

  
    
    $this->MagicLink=false;
    parse_str($_SERVER['QUERY_STRING'], $query);    
    $this->magicLinkEmail=$this->fn_getArrayItem($query, "email");    
    $this->magicLinkCode=$this->fn_getArrayItem($query, "code");            
    
    if(!empty($this->magicLinkCode)){      
      $Action="XDesigner_startAuthorize";
      $this->MagicLink=true;     
      $this->fn_addEcho("magicLinkEmail: ".$this->magicLinkEmail);      
      $this->fn_addEcho("magicLinkCode: ".$this->magicLinkCode);        
      $this->fn_addEcho("MagicLink: ".$this->MagicLink);        
    }    

    
    
    switch($Action){                      
      case "XDesigner_startAuthorize":                        
        $this->fn_XDesigner_startAuthorize();         
      break;                  
      case "XDesigner_endAuthorize":                    
        $this->fn_XDesigner_endAuthorize();                    
      break;                          
    }         
    
  } 
   
  function fn_XDesigner_startAuthorize(){

    if($this->bln_debugLogin){
      $this->fn_addEcho("***START fn_XDesigner_startAuthorize");
    }        

    $obj_post=$this->obj_post;                   
    $this->obj_userLogin->MetaUserEmail=$obj_post->MetaUserEmail;            
    $this->AuthorizeUserPass=$obj_post->AuthorizeUserPass;          
    
    if(!empty($this->magicLinkCode)){
      $this->obj_userLogin->MetaUserEmail=$this->magicLinkEmail;
      $this->AuthorizeUserPass=$this->magicLinkCode;            
      $this->AuthorizeSentPass=$this->magicLinkCode;               
      
      $str_sql="SELECT `AuthorizeSessionKey` FROM `meta_user`.`meta_user`WHERE TRUE          
      AND `MetaUserEmail`=:MetaUserEmail
      AND `AuthorizeSentPass`=:AuthorizeSentPass
      ;";    
      $this->fn_varPre("str_sql", $str_sql);      
      $stmt = $this->fn_executeSQLStatementLogin($str_sql, [                                        
        'MetaUserEmail' => $this->obj_userLogin->MetaUserEmail,
        'AuthorizeSentPass' => $this->AuthorizeSentPass
      ]);               
      $arr_row=$stmt->fetch();             
      if($arr_row){            
        $this->AuthorizeSessionKey=$arr_row["AuthorizeSessionKey"];                                            
        $this->fn_setCookie("AuthorizeSessionKey", $this->AuthorizeSessionKey);
      }                  

      

      /*
      $this->fn_varPre("xxx this->AuthorizeSessionKey", gettype($this->AuthorizeSessionKey));
      $this->fn_varPre("xxx this->AuthorizeSessionKey", $this->AuthorizeSessionKey);
      $this->fn_varPre("xxx this->obj_userLogin->MetaUserEmail", $this->obj_userLogin->MetaUserEmail);
      $this->fn_varPre("xxx this->AuthorizeSentPass", $this->AuthorizeSentPass);
      //*/
      //exit;      
    } 


    $this->fn_setAuthorizeSessionKeyFromCookie();                
    if (empty($this->AuthorizeSessionKey)){
      $str_message="Please Refresh Page and Try Again [StartAuthorize Empty Session Key]";
      $this->fn_addEcho($str_message);                                
      $this->fn_setError($str_message);      
      return;
    }                  
    

    if($this->bln_debugLogin){      
      $this->fn_addEcho("***START CHECK CAN SEND OTP");                           
      //$this->fn_varDump($obj_post, "obj_post");      
      $this->fn_addEcho("MetaUserEmail: ".$this->obj_userLogin->MetaUserEmail);      
      $this->fn_addEcho("AuthorizeUserPass: ".$this->AuthorizeUserPass);            
      $this->fn_addEcho("***END CHECK CAN SEND OTP");                     
    }
    

    

    if(!empty($this->obj_userLogin->MetaUserEmail) && empty($this->AuthorizeUserPass)){        

      
      $this->fn_XDesigner_sendOTP();                
      return;
    }    
    
    if(empty($this->obj_userLogin->MetaUserEmail) || empty($this->AuthorizeUserPass)){                    
      return;
    }    
    
    $str_sql="";
    $str_sql.="UPDATE `meta_user`.`meta_user` SET `AuthorizeUserPass`=:AuthorizeUserPass, `ModifiedDate`=:ModifiedDate WHERE    
    (`AuthorizeSessionKey`=:AuthorizeSessionKey AND `MetaUserEmail`=:MetaUserEmail AND `AuthorizeSentPass`<>'UserLoggedIn')
    ;";                
    $stmt = $this->fn_executeSQLStatementLogin($str_sql, [            
        'AuthorizeUserPass' => $this->AuthorizeUserPass,
        'AuthorizeSessionKey' => $this->AuthorizeSessionKey,
        'MetaUserEmail' => $this->obj_userLogin->MetaUserEmail,
        'ModifiedDate' => $this->str_runtime
    ]);    
    //*
    
    if($this->bln_debugLogin){
      $this->fn_addEcho("***PREPARE FOR VALIDATION");                     
      $this->fn_addEcho("AuthorizeUserPass: ".$this->AuthorizeUserPass);      
      $this->fn_addEcho("AuthorizeSessionKey: ".$this->AuthorizeSessionKey);      
      $this->fn_addEcho("MetaUserEmail: ".$this->obj_userLogin->MetaUserEmail);      
      $this->fn_addEcho("ModifiedDate: ".$this->str_runtime);            
      $this->fn_addEcho("***PREPARE FOR VALIDATION");                     
    }
    //*/
    
    
    
    $this->fn_XDesigner_validateAuthorize();    

    

    if($this->bln_debugLogin){
      $this->fn_addEcho("***END fn_XDesigner_startAuthorize");                     
    }

    
  }

  function fn_executeSQLStatementLogin($str_sql, $arr_param=false){           
    
    if(empty($arr_param)){
        $arr_param=[];
    }    
    $stmt = $this->pdo_admin->prepare($str_sql);                            
    try{            
      $stmt->execute($arr_param);                                        
    }
    catch (PDOException $e) {                   
      global $obj_page;
      $obj_page->fn_setError($e->getMessage());
      exit;
    }
    
    return $stmt;
    }
  
  function fn_XDesigner_endAuthorize(){                    
  
    $this->fn_setAuthorizeSessionKeyFromCookie();
    if (empty($this->AuthorizeSessionKey)){
      $str_message="Please Refresh Page and Try Again [EndAuthorize Empty Session Key]";
      $this->fn_addEcho($str_message);                                
      $this->fn_setError($str_message);
      return;
    }     
  
    $obj_post=$this->obj_post;       
  
    $str_sql="SELECT * FROM  `meta_user`.`meta_user` WHERE `AuthorizeSessionKey`=:AuthorizeSessionKey;";    
    $stmt = $this->fn_executeSQLStatementLogin($str_sql, [      
      'AuthorizeSessionKey' => $this->AuthorizeSessionKey
    ]);
    $arr_row=$stmt->fetch();             
    if($arr_row){            
      $this->obj_userLogin->MetaUserEmail=$arr_row["MetaUserEmail"];                                            
    }                  
    

    $str_sql="UPDATE `meta_user`.`meta_user` SET 
      `AuthorizeSessionKey`='', 
      `AuthorizeUserPass`=:AuthorizeUserPass,
      `AuthorizeSentPass`=:AuthorizeSentPass,
      `AuthorizeIPAddress`=:AuthorizeIPAddress,
      `CreatedDate`=:CreatedDate, 
      `ModifiedDate`=:ModifiedDate
      
      WHERE `AuthorizeSessionKey`=:AuthorizeSessionKey ;";
      //$this->fn_addEcho("str_sql: ".$str_sql);                          
      $stmt = $this->fn_executeSQLStatementLogin($str_sql, [                    
          'AuthorizeSessionKey' => $this->AuthorizeSessionKey,     
          'AuthorizeUserPass' => '',        
          'AuthorizeSentPass' => '',        
          'AuthorizeIPAddress' => $_SERVER['REMOTE_ADDR'],              
          'CreatedDate' => $this->str_runtime,
          'ModifiedDate' => $this->str_runtime,        
        ]);
      
      
    $this->AuthorizeSessionKey="";    
    $this->fn_loginCookie("AuthorizeSessionKey", $this->AuthorizeSessionKey, $bln_expire=true);
    $this->obj_userLogin->MetaUserEmail="";
    $this->AuthorizeUserPass=rand(100000000,999999999);
    $this->AuthorizeUserStatus=false;              
    
    $obj_post->MetaUserEmail=$this->obj_userLogin->MetaUserEmail;
    $obj_post->AuthorizeUserPass=$this->AuthorizeUserPass;
    $obj_post->AuthorizeUserStatus=$this->AuthorizeUserStatus;    
    
    $this->fn_blankSession("UserLoginSession");   
    //$this->fn_addEcho("BLANKED SESSION");
  }  
  
  function fn_setAuthorizeSessionKeyFromCookie(){    
    if(!empty($this->AuthorizeSessionKey)){return;}              
    $this->AuthorizeSessionKey=$this->fn_getCookie("AuthorizeSessionKey");//this will bea new session length coookie or the stored cookie                          
  }
  function fn_getCookie($cookie_name){
      
    $str_value="";
    if(!isset($_COOKIE[$cookie_name])) {        
    } 
    else {
      $str_value=$_COOKIE[$cookie_name];        
    }
    return $str_value;
  }
  
  function fn_XDesigner_validateAuthorize(){

    
    if($this->bln_debugLogin){
      $this->fn_addEcho("START LOGIN VALIDATION ATTEMPT");
    }    
    
    
  
    $this->fn_setAuthorizeSessionKeyFromCookie();
    if (empty($this->AuthorizeSessionKey)){
      $str_message="Please Refresh Page and Try Again [ValidateAuthorize Empty Session Key]";
      $this->fn_addEcho($str_message);                                
      $this->fn_setError($str_message);
      return;
    }      
    
    $str_sql="SELECT * FROM  `meta_user`.`meta_user` WHERE TRUE
    AND `AuthorizeSessionKey`=:AuthorizeSessionKey
    AND `AuthorizeUserPass`=`AuthorizeSentPass`
    ;";          
    $stmt = $this->fn_executeSQLStatementLogin($str_sql, [                    
      'AuthorizeSessionKey' => $this->AuthorizeSessionKey,         
    ]); 
    $arr_row=$stmt->fetch();

    
    
    if($arr_row){
      
      $this->fn_addConsole("VALIDATION SUCCEDED");   
      
      
      //$this->bln_debugAction=true;

    if($this->bln_debugAction){
      //$this->fn_varDump($obj_user, "obj_user", true);      
      $this->fn_varDump($arr_row, "1 arr_row", true);              
    }


    $bln_newSystem=$this->fn_createHomeSystem($arr_row);  
      
      if($bln_newSystem){
          //reload for new system information
          $str_sql="SELECT * FROM  `meta_user`.`meta_user` WHERE TRUE
          AND `AuthorizeSessionKey`=:AuthorizeSessionKey
          AND `AuthorizeUserPass`=`AuthorizeSentPass`
          ;";          
          $stmt = $this->fn_executeSQLStatementLogin($str_sql, [                    
            'AuthorizeSessionKey' => $this->AuthorizeSessionKey,         
          ]); 
          $arr_row=$stmt->fetch();          
        }      
        
      
      $this->obj_userLogin=$this->fn_loadUser($arr_row);                        

           
      $this->fn_checkAutoInvite();//if exist, this will change the userparam

      //We know by this point which system we are in 
      $this->fn_openSystem($this->obj_userLogin->MetaUserSystemId);      
      
      $this->fn_loginCookie("AuthorizeSessionKey", $this->AuthorizeSessionKey);//renew expiry time - push out expiry date each time=never login , unless the cookie expires

      //comment this line out to prevent naviagation away form login page, on successful login
      //$bln_completeValidation=false;
      $bln_completeValidation=true;    
      if($bln_completeValidation){                
        $this->fn_disarmLoginCode($this->obj_userLogin->MetaUserId);            
        $this->AuthorizeUserStatus=true;  
      }
      //*/
    } 
    else{
      //empty rs      
      $this->fn_addConsole("VALIDATION FAILED"); 
      //shurely should return here ?;                                                   
    } 
    
    $this->fn_formatPostAuthorize();  

    if(!empty($this->magicLinkCode)){
      $this->fn_navigateSubdomain("desk");      
      exit;
    }            

    if($this->bln_debugLogin){
      $this->fn_addEcho("END LOGIN VALIDATION ATTEMPT");                                
    }    
  }    


  function fn_createHomeSystem($arr_row){    

    if($this->bln_debugAction){
      //$this->fn_varDump($obj_user, "obj_user", true);      
      //$this->fn_varDump($arr_row, "START fn_createHomeSystem", true);              
    }
    
    /*
    if(!empty($this->obj_userLogin->MetaUserSystemId)){
      //return here to avoid checking meta system and metamover
      return;
    } 
      //*/           

    if($this->bln_debugAction){
      //$this->fn_varDump($obj_user, "obj_user", true);      
      //$this->fn_varDump($arr_row["MetaUserId"], "MID  fn_createHomeSystem", true);              
    }

    

    //create own system and mover record                
    $obj_metaSystem=new metaSystem($this);                             
    $bln_newSystem=$obj_metaSystem->fn_createRecord($arr_row["MetaUserId"], $arr_row["MetaUserEmail"]);            
    $obj_metaMover=new metaMover($this);                                           
    $obj_metaMover->fn_createRecord($this->obj_userLogin->MetaHomeSystemId, $arr_row["MetaUserId"], $arr_row["MetaUserEmail"]);            

    //update user record 
    $str_sql="UPDATE `meta_user`.`meta_user` 
    SET     
    MetaHomeSystemId=:MetaHomeSystemId, 
    MetaUserSystemId=:MetaUserSystemId 
    WHERE MetaUserId=:MetaUserId
    ;";
    //$this->fn_addMessage("update user str_sql: ".$str_sql);                                            
    $this->fn_executeSQLStatementLogin($str_sql, [            
      'MetaHomeSystemId'=>$this->obj_userLogin->MetaHomeSystemId,//set in System CreateRecord    
      'MetaUserSystemId'=>$this->obj_userLogin->MetaUserSystemId,//set in System CreateRecord
      'MetaUserId'=>$arr_row["MetaUserId"]
    ]);       

    return $bln_newSystem;
  }

  
  function fn_checkAutoInvite(){

    $MetaMoverEmail=$this->obj_userLogin->MetaUserEmail;    

    //check for autoaccept
    $str_sql="SELECT `MetaMoverSystemId` FROM `meta_user`.`meta_mover` WHERE TRUE
    AND `MetaMoverUserId`=0 
    AND MetaMoverType='User' 
    AND MetaMoverStatus='Enabled' 
    AND MetaMoverEmail=:MetaMoverEmail         
    AND MetaMoverAutoAccept=1
    ORDER BY `MetaMoverId` DESC LIMIT 1;";            
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'MetaMoverEmail' => $MetaMoverEmail
    ]);                         
    $arr_row=$stmt->fetch();                    
    if($arr_row){            
      $MetaMoverSystemIdTarget=$arr_row["MetaMoverSystemId"];                   
      if(!empty($MetaMoverSystemIdTarget)){            
        $obj_metaMover=new metaMover($this);                                           
        $obj_metaMover=$obj_metaMover->fn_acceptInvite($MetaMoverSystemIdTarget);        
        $this->obj_userLogin->MetaUserSystemId=$MetaMoverSystemIdTarget;        
      }          
    }                 
    //check for autoaccept

  }

  




  function fn_getLastInsertIdLogin(){
    return $this->pdo_admin->lastInsertId();
  }

  

  

function fn_updateInstanceUserPassword($MetaUserName, $MetaUserPassword){

  if($this->bln_debugLogin){
    $this->fn_addEcho("************START fn_updateInstanceUserPassword");          
  }  
    
  $str_sql="ALTER USER :MetaUserName IDENTIFIED BY :MetaUserPassword;";             
  if($this->bln_debugLogin){$this->fn_addEcho("str_sql: ".$str_sql);}
  $stmt=$this->fn_executeSQLStatementLogin($str_sql, [
    'MetaUserName' => $MetaUserName, 
    'MetaUserPassword' => $MetaUserPassword,     
  ]); 
  
  
  if($this->bln_debugLogin){
    $this->fn_addEcho("************END fn_updateInstanceUserPassword");          
  }  
  
}  

function fn_createInstanceUserIfNotExist($MetaUserName, $MetaUserPassword){

  if($this->bln_debugLogin){
    $this->fn_addEcho("************START fn_createInstanceUserIfNotExist");          
  }  

  $this->fn_flushPrivileges();
  
  $str_sql="CREATE USER IF NOT EXISTS `$MetaUserName` IDENTIFIED BY '$MetaUserPassword';";      
  //$str_sql="CREATE USER `" . $MetaUserName . "` IDENTIFIED WITH mysql_native_password AS '" . $MetaUserPassword . "';";

  
  if($this->bln_debugLogin){
    $this->fn_addEcho("MetaUserName: ".$MetaUserName);
    $this->fn_addEcho("MetaUserPassword: ".$MetaUserPassword);
    $this->fn_addEcho("str_sql: ".$str_sql);
  }
  $this->fn_executeSQLStatementLogin($str_sql);
  $stmt->execute();   
  
  if($this->bln_debugLogin){
    $this->fn_addEcho("************END fn_createInstanceUserIfNotExist");          
  }  
} 


  function fn_formatPostAuthorize(){    
    $obj_post=$this->obj_post;          
    $obj_post->MetaUserEmail=$this->obj_userLogin->MetaUserEmail;            
    $obj_post->AuthorizeUserStatus=$this->AuthorizeUserStatus;                  
  }

  
  
  function fn_XDesigner_sendOTP(){               

    global $SYSTEM_SHORTNAME;
    
    $this->fn_setAuthorizeSessionKeyFromCookie();    
    if (empty($this->AuthorizeSessionKey)){      
      $str_message="Please Refresh Page and Try Again [SendOTP Empty Session Key]";
      $this->fn_addEcho($str_message);                                
      $this->fn_setError($str_message);
      return;
    }          
    
    $obj_post=$this->obj_post;
    
    $this->AuthorizeUserPass="";
    $this->AuthorizeSentPass=rand(100000,999999);          
    //$this->AuthorizeSentPass=100;   
    
    $domain_name = substr(strrchr($this->obj_userLogin->MetaUserEmail, "@"), 1);    
    $rr = dns_get_record($domain_name, DNS_MX);                
    if(!$rr){            
      $str_message="ERROR: INVALID EMAIL PROVIDED [DOMAIN DOES NOT EXIST]";
      $this->fn_addEcho($str_message);                                
      $this->fn_setError($str_message);
      exit;      
    }      
    

    $this->AuthorizeSessionKey=session_id();           
    
    $str_sql="";
    $str_sql.="SELECT * FROM  `meta_user`.`meta_user` WHERE 
    (`MetaUserEmail`=:MetaUserEmail)
    ;";              
    //$this->fn_addEcho("str_sql: ".$str_sql);                                    
    
    $stmt=$this->fn_executeSQLStatementLogin($str_sql, [
      'MetaUserEmail' => $this->obj_userLogin->MetaUserEmail         
    ]);             
    $arr_row=$stmt->fetch();
    
    if($arr_row){            
      
      $MetaUserId=$arr_row["MetaUserId"];      
      
      $str_sql="UPDATE `meta_user`.`meta_user` SET       
      `AuthorizeSessionKey`=:AuthorizeSessionKey, 
      `AuthorizeUserPass`=:AuthorizeUserPass, 
      `AuthorizeSentPass`=:AuthorizeSentPass, 
      `AuthorizeIPAddress`=:AuthorizeIPAddress,       
      `CreatedDate`=:CreatedDate, `ModifiedDate`=:ModifiedDate WHERE `MetaUserId`=:MetaUserId ;";      
      //$this->fn_addEcho("update str_sql: ".$str_sql);                                
      
      $this->fn_executeSQLStatementLogin($str_sql, [
        'AuthorizeSessionKey' => $this->AuthorizeSessionKey,       
        'AuthorizeUserPass' => $this->AuthorizeUserPass,        
        'AuthorizeSentPass' => $this->AuthorizeSentPass,        
        'AuthorizeIPAddress' => $_SERVER['REMOTE_ADDR'],        
        'CreatedDate' => $this->str_runtime,
        'ModifiedDate' => $this->str_runtime,
        'MetaUserId' => $MetaUserId        
      ]);
      

    }
    else{
      
      $obj_param=new stdClass();
      $obj_param->AuthorizeSessionKey=$this->AuthorizeSessionKey;
      $obj_param->MetaUserEmail=$this->obj_userLogin->MetaUserEmail;
      $obj_param->AuthorizeUserPass=$this->random_str(20);
      $obj_param->AuthorizeSentPass=$this->AuthorizeSentPass;
      $obj_param->AuthorizeIPAddress=$_SERVER['REMOTE_ADDR'];      
      $obj_param->MetaUserName=$SYSTEM_SHORTNAME.".".$this->obj_userLogin->MetaUserEmail;      
      $obj_param->MetaUserPassword=$this->random_str(20);    
      $obj_param->MetaUserHost="localhost";                  
      
      $this->fn_createMetaUser($obj_param);
    }
    
    
    
    
    //*
    $this->str_methodMailer="SENDGRID";
    switch($this->str_methodMailer){
      case "SENDMAIL":
        $this->fn_sendmail();          
      break;
      case "SENDGRID":          
        $this->fn_login_sendgridmail();
        break;
    } 
    //*/
  } 

  
  

  function fn_createMetaUser($obj_param){       
    
    
    $str_sql="INSERT INTO `meta_user`.`meta_user`
    (`AuthorizeSessionKey`, `MetaUserEmail`, `AuthorizeUserPass`, `AuthorizeSentPass`, `AuthorizeIPAddress`, `MetaUserName`, `MetaUserPassword`, `MetaUserHost`,         
    `ModifiedDate`, `ModifiedBy`, `CreatedDate`, `CreatedBy`
    )
    VALUES
    (:AuthorizeSessionKey, :MetaUserEmail, :AuthorizeUserPass, :AuthorizeSentPass, :AuthorizeIPAddress, :MetaUserName, :MetaUserPassword, :MetaUserHost,     
    :ModifiedDate, :ModifiedBy, :CreatedDate, :CreatedBy
    )
    ;";              
    
    $this->fn_executeSQLStatementLogin($str_sql, [
      'AuthorizeSessionKey' => $obj_param->AuthorizeSessionKey, 
      'MetaUserEmail' => $obj_param->MetaUserEmail,
      'AuthorizeUserPass' => $obj_param->AuthorizeUserPass,        
      'AuthorizeSentPass' => $obj_param->AuthorizeSentPass,        
      'AuthorizeIPAddress' => $obj_param->AuthorizeIPAddress,              
      'MetaUserName' => $obj_param->MetaUserName,        
      'MetaUserPassword' => $obj_param->MetaUserPassword,        
      'MetaUserHost' => $obj_param->MetaUserHost,                          
      'ModifiedDate' => $this->str_runtime,
      'ModifiedBy' => 100,
      'CreatedDate' => $this->str_runtime,
      'CreatedBy' => 100
    ]);              
  }


  function fn_disarmLoginCode($MetaUserId){
    //SET OLD CODES TO DIFFERENT RANDOM VALUES, AS NOW THE LOGIN REQUIRES ONLY VALID COOKIE NAMED AuthorizeSessionKey
    $str_sql="UPDATE `meta_user`.`meta_user` SET
    `AuthorizeUserPass`=:AuthorizeUserPass,
    `AuthorizeSentPass`=:AuthorizeSentPass
    WHERE 
    `MetaUserId`=:MetaUserId      
    ;";         
    if($this->bln_debugLogin){
      $this->fn_addEcho("disarm login code str_sql: ".$str_sql);
      $this->fn_addEcho("META USER ID : ".$MetaUserId);
    }
    $this->fn_executeSQLStatementLogin($str_sql, [
      'AuthorizeUserPass' => $this->str_runtime,         
      'AuthorizeSentPass' => "UserLoggedIn", 
      'MetaUserId' => $MetaUserId,         
    ]);                
  }
  
  function fn_setError($str_message){
    //note one argument only permissible
    $this->obj_post->HasError=true;        
    $this->obj_post->ErrorMessage.=$str_message.PHP_EOL.PHP_EOL;                    
    if($this->MagicLink){$this->fn_navigateSubdomain("lock");}
  } 
  
  function fn_loginCookie($cookie_name, $cookie_value, $bln_expire=false){      
  
    unset($_COOKIE[$cookie_name]);    
  
    $int_CookieStoreDays=28;
    
    if($bln_expire){
      $str_time=time() - 3600;
    }else{
      $str_time=time() + (86400 * $int_CookieStoreDays);    
    }
    
    $arr_domain = explode(".", $_SERVER['HTTP_HOST'], 2);          
    $arr_cookie_options = array (
      'expires' => $str_time,
      'path' => '/',
      'domain' => '.'.$arr_domain[1], 
      'secure' => false,     // or false
      'httponly' => false,    // or false
      'samesite' => 'Lax' // None || Lax  || Strict
      );
      
    setcookie($cookie_name, $cookie_value, $arr_cookie_options);
  }
  
  function fn_login_sendgridmail(){      
    
    global $SENDGRID_API_KEY, $SYSTEM_USER_EMAIL, $SYSTEM_USER_EMAIL_FRIENDLY_NAME;         
  
    /*
    Windows install
    Curl.exe should be installed with GIT
    PHP.INI modified to      
    extension=curl      
    curl.cainfo = "D:\php8\extras\ssl\cacert.pem"             
    Download the ssl certificate from makers of curl https://curl.haxx.se/docs/caextract.html
    Copy the certificate to the above directory
    Copy the following dll from php8 directory to apache/bin directory: libssh2.dll
    Restart apache
    //*/

    $AuthorizeSentPass=$this->AuthorizeSentPass;
    
    
    $URL=$this->fn_getPageURL();            
    $URL.="?";
    $URL.="email=".$this->obj_userLogin->MetaUserEmail;
    $URL.="&";
    $URL.="code=".$this->AuthorizeSentPass;

    //$this->fn_varDump("URL", $URL);
    //return;
    
    //<p><h1>Or Enter Code: $AuthorizeSentPass</a><h1></p>      
    
    $messageHTML=<<<END
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Access</title>
    </head>    
    <body style="font-family:helvetica">                      
    <p><h1><a target="vopsys" href="$URL">Access Code: $AuthorizeSentPass</a><h1></p>          
    </body>
    </html>
    END;      
    
    
    $email = new \SendGrid\Mail\Mail();               
    $email->setFrom($SYSTEM_USER_EMAIL, $SYSTEM_USER_EMAIL_FRIENDLY_NAME);                
    $email->setSubject('Access');                
      
    $email->addTo($this->obj_userLogin->MetaUserEmail, "");      
    $email->addContent("text/plain", "Click Here: ".$URL);            
    $email->addContent("text/html", $messageHTML);                
    $sendgrid = new \SendGrid($SENDGRID_API_KEY);          
    try {          
      $response = $sendgrid->send($email);        
      $this->fn_addEcho("EMAIL PASS SENT");
      $this->fn_addConsole("EMAIL PASS SENT TO: [".$this->obj_userLogin->MetaUserEmail."]");
      
    } catch (Exception $e) {         
      $obj_page->fn_setError($e->getMessage());
      exit;
    }          
  }    
}
/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER
