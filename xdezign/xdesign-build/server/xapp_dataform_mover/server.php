<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

/////////////////////////AUTOLOAD
require_once dirname(__FILE__ , 7). "/composer/sendgrid/vendor/autoload.php";        
/////////////////////////AUTOLOAD

class page extends server_interface{
  function __construct() {          
    parent::__construct();      

    
    //used by crud
  } 
  function fn_initialize() {            
    parent::fn_initialize();       
    
    //initalization code needs to remain here rather than in the consturctor, due to object hierachy functions
    //$this->fn_varDump($this->obj_post, "obj_post");
    
    $this->bln_debugAction=false;                
                           

}       
function fn_executePage() {        
  parent::fn_executePage();                           
  
  //$this->fn_varDump($this->arr_row, "xxxxxxxx arr_row");  
  
  switch($this->obj_post->Action){    
    case "runPushColumn":                
      $this->fn_updateUserRecord();
      break;           
  }  

  //$this->fn_addEcho("this->obj_post->ActionCode: ".$this->obj_post->ActionCode);  
  //$this->fn_addConsole("this->obj_post->ActionCode: ".$this->obj_post->ActionCode);  

  switch($this->obj_post->ActionCode){
    case "10":            
      $this->fn_runSendInvite();                
      break;      
    case "20"://Disable
      $this->fn_runMoverStatus(false);
      $this->fn_setAutoAcceptStatus(false);      
      break;      
    case "50"://Enable            
      $this->fn_runMoverStatus(true);
      break;      
    case "100"://Accept and Open         
      $obj_row=$this->arr_row;
      $str_label="`meta_user`.`meta_mover`.`MetaMoverSystemId`";
      $MetaMoverSystemIdTarget=$this->fn_getObjectProperty($obj_row, $str_label);
      
      $obj_metaMover=new metaMover($this);                                           
      $obj_metaMover->fn_acceptInvite($MetaMoverSystemIdTarget);
      $this->fn_openSystem($MetaMoverSystemIdTarget);
      break;      
    case "200":            
      $this->fn_runHome();                
      break;      
    default:           
  }
}


function fn_updateUserRecord(){

  if(empty($this->str_queryExpression)){            
    return;    
  }                

  $MetaMoverSystemId=$this->obj_userLogin->MetaUserSystemId;  
  $MetaUserId=$this->obj_userLogin->MetaUserId;            
  $MetaUserEmail=$this->obj_userLogin->MetaUserEmail;  
  
  $obj_post=$this->obj_post;          
  $MetaColumnName=$obj_post->MetaColumnName;
  $MetaColumnValue=$obj_post->MetaColumnValue;
  //$this->fn_addEcho("MetaColumnName: ".$MetaColumnName);  
  //$this->fn_addEcho("MetaColumnValue: ".$MetaColumnValue);

  $MetaKeyColumnValue=$obj_post->MetaKeyColumnValue;
  $MetaMoverId=$MetaKeyColumnValue;

  $str_sql="SELECT `meta_user`.`meta_mover`.`MetaMoverUserId` FROM `meta_user`.`meta_mover` WHERE `meta_user`.`meta_mover`.`MetaMoverId`=:MetaMoverId;";
  //$this->fn_addEcho("str_sql: ".$str_sql);  
  $MetaMoverUserId=$this->fn_fetchColumn($str_sql, ['MetaMoverId'=>$MetaMoverId]);  
  //$this->fn_addEcho("MetaMoverUserId: ".$MetaMoverUserId);

  //$this->fn_varDump($obj_post, "obj_post");      
  
  if($MetaMoverUserId===$MetaUserId){ //apply to own record only 
    switch($MetaColumnName){
      case "MetaMoverEmail":      
        $str_sql="UPDATE `meta_user`.`meta_user` join `meta_user`.`meta_mover` ON MetaUserId=MetaMoverUserId
        SET `meta_user`.`meta_user`.`MetaUserEmail`=:MetaColumnValue
        WHERE ".$this->str_queryExpression.";";
        //$this->fn_addEcho("str_sql: ".$str_sql);
        $stmt=$this->fn_executeSQLStatement($str_sql, ['MetaColumnValue'=>$MetaColumnValue]);               
        break;
      default:          
    }  
  }
  
  
  if($this->obj_post->ModeNewRecord){
    $MetaMoverId=$this->obj_post->LastInsertId;
    $str_sql="UPDATE `meta_user`.`meta_mover`
    SET `meta_user`.`meta_mover`.`MetaMoverSystemId`=$MetaMoverSystemId
    WHERE `meta_user`.`meta_mover`.`MetaMoverId`=$MetaMoverId
    ;";
    
    //$this->fn_addEcho("xxxxxxxxxxx str_sql new record: ".$str_sql);  
    $stmt=$this->fn_executeSQLStatement($str_sql);               
  }
}



function fn_checkDefaultEntry(){
    
    $this->fn_matchSystems();
}




function fn_matchSystems(){//Adds a meta_data record for loged in user to invtied systems

  $MetaUserId=$this->obj_userLogin->MetaUserId;          
  $MetaMoverSystemId=$this->obj_userLogin->MetaUserSystemId;  
  $MetaUserEmail=$this->obj_userLogin->MetaUserEmail;  
  $MetaMoverEmail=$MetaUserEmail;  

  $str_sql="SELECT * FROM `meta_user`.`meta_mover` WHERE `MetaMoverType`='Login' AND `MetaMoverEmail`=:MetaMoverEmail";
  //$this->fn_addEcho("fn_matchSystems sql: ".$str_sql);
  //$this->fn_addConsole("fn_matchSystems sql: ".$str_sql);
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    'MetaMoverEmail'=>$MetaMoverEmail
  ]); 
  $arr_rows=$stmt->fetchAll();        
  $i_rows_count=$stmt->rowCount();
  
  for($i_row=0;$i_row<$i_rows_count;$i_row++) {

    
    
    $arr_row=$arr_rows[$i_row];
    $MetaMoverId=$arr_row["MetaMoverId"];
    //$this->fn_addEcho("MetaMoverId: ".$MetaMoverId);  

    $str_sql="UPDATE `meta_user`.`meta_mover` SET `MetaMoverUserId`=:MetaMoverUserId 
    WHERE TRUE
    AND `MetaMoverId`=:MetaMoverId
    ;";    
    $this->fn_executeSQLStatement($str_sql, [
      'MetaMoverUserId'=>$MetaUserId,
      'MetaMoverId'=>$MetaMoverId
    ]); 
    
    //CREATE META DATA FOR EXTERNAL SYSTEM
    $obj_paramPass=new stdClass;
    $obj_paramPass->MetaDataSystemId=$this->obj_userLogin->MetaHomeSystemId;
    $obj_paramPass->MetaDataOwnerId=$this->obj_userLogin->MetaUserId;
    $obj_paramPass->DataKeyValue=$MetaMoverId;            
    $obj_metaMover=new metaMover($this);                                           
    $obj_metaMover->fn_createMetaData($obj_paramPass);                  
  }//LOOP

}



function fn_runSendInvite(){

  $MetaMoverEmail=$this->fn_getFormEmail();  
  $MetaMoverSystemId=$this->obj_userLogin->MetaUserSystemId;      
  $MetaMoverUserId=$this->obj_userLogin->MetaUserId;             
  $this->fn_createSystemFromUser($MetaMoverSystemId, $MetaMoverUserId, $MetaMoverEmail);  

  $this->fn_runMoverStatus(true);
  $this->fn_setAutoAcceptStatus(true);  
  
  
  
  $obj_param=new stdClass;
 
  $obj_row=$this->arr_row;
  $str_label="`meta_user`.`meta_mover`.`MetaMoverEmail`";  
  $obj_param->MetaMoverInviteToEmail=$this->fn_getObjectProperty($obj_row, $str_label);
  
    
  $obj_param->MetaMoverInvitedByEmail=$this->obj_userLogin->MetaUserEmail;
  $obj_param->MetaMoverInvitedByFirst=$this->obj_userLogin->MetaUserEmail;
  $obj_param->MetaMoverInvitedBySystem=$this->obj_userLogin->MetaUserId;
  $obj_param->messageHTML=$this->fn_getInviteMessageNewUser($obj_param);
  $this->fn_mover_sendgridmail($obj_param);  

}

function fn_createSystemFromUser($MetaMoverSystemId, $MetaMoverUserId, $MetaMoverEmail){

  //$this->fn_addConsole(" CREATE SYSTEM FOR [".$MetaMoverEmail."]");
  

  $str_sql="SELECT count(*) FROM `meta_user`.`meta_mover` WHERE TRUE
  AND `MetaMoverEmail`=:MetaMoverEmail 
  AND `MetaMoverSystemId`=:MetaMoverSystemId 
  AND `MetaMoverUserId`=:MetaMoverUserId 
  AND MetaMoverType=:MetaMoverType
  ;";  
  //$this->fn_addEcho("Count Existing SQL: ".$str_sql);     
  $int_count=$this->fn_fetchCount($str_sql, [
    'MetaMoverEmail'=>$MetaMoverEmail,
    'MetaMoverSystemId'=>$MetaMoverSystemId,
    'MetaMoverUserId'=>$MetaMoverUserId,
    'MetaMoverType'=>'Login',
  ]);           
  //$this->fn_addEcho("Count Existing System: ".$int_count);     
  //$this->fn_addConsole("Count Existing System: ".$int_count);     
  if($int_count>0){        
      return;
  }    
  
  //$this->fn_addEcho("this->str_queryExpression: ".$this->str_queryExpression);      

  //Create System Button in Target User
  $str_sql="INSERT INTO `meta_user`.`meta_mover`
  (MetaMoverSystemId, MetaMoverUserId, MetaMoverSystemName, MetaMoverType, MetaPermissionTag, MetaMoverStatus, MetaMoverTitle, MetaMoverFirst, MetaMoverLast, MetaMoverEmail)
  SELECT 
  MetaMoverSystemId, MetaMoverUserId, MetaMoverSystemName, 'Login', '#ADMIN', 'Enabled', MetaMoverTitle, MetaMoverFirst, MetaMoverLast, :MetaMoverEmail  
  FROM `meta_user`.`meta_mover` WHERE TRUE
  AND MetaMoverSystemId=:MetaMoverSystemId 
  AND MetaMoverUserId=:MetaMoverUserId 
  AND MetaMoverType=:MetaMoverType
  ;
    ";    
    //*
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'MetaMoverSystemId'=>$MetaMoverSystemId,
      'MetaMoverUserId'=>$MetaMoverUserId,
      'MetaMoverType'=>'User',
      'MetaMoverEmail'=>$MetaMoverEmail,
    ]);                   
    //*/
    $MetaMoverId=$this->fn_getLastInsertId();

}



function fn_getInviteMessageNewUser($obj_param){

  $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
  $MetaMoverInviteToEmailEncode=urlencode($obj_param->MetaMoverInviteToEmail);  
  $str_QS="?MetaInviteSystemId=".$MetaUserSystemId."&MetaMoverInviteToEmail=".$MetaMoverInviteToEmailEncode;    

  $URL=$this->str_lokalProtocol."lock.".$this->str_lokalDomain."/server/login_dashboard/server.php".$str_QS;  
  

  /*
  $URL=$this->fn_getPageURL();                
  $URL.="?";
  $URL.="MetaInviteSystemId=".$MetaUserSystemId;  
  $this->fn_addConsole("URL: ".$URL);    
  //*/
  
  $messageHTML=<<<END
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <title>Invite</title>
  </head>    
  <body style="font-family:helvetica">                    

  <p>
  You have been invited to join Rowz:
  <br>
  System  Name: $obj_param->MetaMoverInvitedBySystem  
  <br>
  Invited By Name: $obj_param->MetaMoverInvitedByFirst
  <br>
  Invited By Email: $obj_param->MetaMoverInvitedByEmail  
  </p>

  <p><h1><a target="vopsys" href="$URL">$URL</a><h1></p>
  <p><h1><a target="vopsys" href="$URL"><button>Click To Join rowz.app</button></a><h1></p>      

  </body>
  </html>
  END;      

  return $messageHTML;

}

function fn_getInviteMessageExistingUser($obj_param){
  $messageHTML=<<<END
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <title>Invite</title>
  </head>    
  <body style="font-family:helvetica">                    

  <p>
  You have been invited to join Rowz:
  <br>
  System  Name: $obj_param->MetaMoverInvitedBySystem  
  <br>
  Invited By Name: $obj_param->MetaMoverInvitedByFirst
  <br>
  Invited By Email: $obj_param->MetaMoverInvitedByEmail  
  </p>

  <p><h1><a target="vopsys" href="$URL">$URL</a><h1></p>
  <p><h1><a target="vopsys" href="$URL"><button>Click To Join rowz.app</button></a><h1></p>      

  </body>
  </html>
  END;      

  return $messageHTML;

}
function fn_runMoverStatus($bln_value){

  $MetaMoverStatus="Disabled";  
  if($bln_value){
    $MetaMoverStatus="Enabled";  
  }

  //$MetaMoverEmail=$this->fn_getFormEmail();
  $MetaMoverId=$this->obj_post->MetaKeyColumnValue; 

  $str_sql="UPDATE `meta_user`.`meta_mover`
  SET `meta_user`.`meta_mover`.`MetaMoverStatus`=:MetaMoverStatus   
  WHERE TRUE
  AND `MetaMoverSystemId`=:MetaMoverSystemId
  AND `MetaMoverId`=:MetaMoverId
  ;";  
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    "MetaMoverSystemId"=>$this->obj_userLogin->MetaUserSystemId,
    "MetaMoverId"=>$MetaMoverId,
    "MetaMoverStatus"=>$MetaMoverStatus    
  ]);                   
}

function fn_setAutoAcceptStatus($bln_value){
  
  $MetaMoverAutoAccept=0;
  if($bln_value){  
    $MetaMoverAutoAccept=1;
  }

  //$MetaMoverEmail=$this->fn_getFormEmail();
  $MetaMoverId=$this->obj_post->MetaKeyColumnValue;
  

  $str_sql="UPDATE `meta_user`.`meta_mover`
  SET `meta_user`.`meta_mover`.`MetaMoverAutoAccept`=:MetaMoverAutoAccept
  WHERE TRUE
  AND `MetaMoverSystemId`=:MetaMoverSystemId
  AND `MetaMoverId`=:MetaMoverId
  AND `MetaMoverType`=:MetaMoverType
  ;";  
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    "MetaMoverSystemId"=>$this->obj_userLogin->MetaUserSystemId,
    "MetaMoverId"=>$MetaMoverId,
    "MetaMoverAutoAccept"=>$MetaMoverAutoAccept,
    "MetaMoverType"=>"User"
  ]);
}

function fn_getFormEmail(){

  //$this->fn_varDumpPost();
  //exit;
  $MetaMoverId=$this->obj_post->MetaKeyColumnValue; 
  
  $str_sql="SELECT `MetaMoverEmail` FROM `meta_user`.`meta_mover`  
  WHERE TRUE
  AND `MetaMoverSystemId`=:MetaMoverSystemId
  AND `MetaMoverId`=:MetaMoverId
  ;";
  //$this->fn_addConsole("str_sql update status: ".$str_sql);    
  return $this->fn_fetchColumn($str_sql, [
    "MetaMoverSystemId"=>$this->obj_userLogin->MetaUserSystemId,
    "MetaMoverId"=>$MetaMoverId,
  ]);
}

function fn_mover_sendgridmail($obj_param){
      
  global $SENDGRID_API_KEY, $SYSTEM_USER_EMAIL, $SYSTEM_USER_EMAIL_FRIENDLY_NAME;           

  //$this->fn_addConsole("fn_mover_sendgridmail START SEND EMAIL TO: [".$MetaMoverInviteToEmail."]");    

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

  if(empty($obj_param->MetaMoverInviteToEmail)){
    //$this->fn_addEcho("EMAIL IS BLANK : CANNOT SEND EMAIL SENT TO: [".$obj_param->MetaMoverInviteToEmail."]");    
    //$this->fn_addConsole("EMAIL IS BLANK : CANNOT SEND EMAIL SENT TO: [".$obj_param->MetaMoverInviteToEmail."]");
    return;
  }
    
  $email = new \SendGrid\Mail\Mail();               
  $email->setFrom($SYSTEM_USER_EMAIL, $SYSTEM_USER_EMAIL_FRIENDLY_NAME);                
  $email->setSubject('Invite to rowz.app');            
  $email->addTo($obj_param->MetaMoverInviteToEmail, "");        
  $email->addContent("text/html", $obj_param->messageHTML);                
  $sendgrid = new \SendGrid($SENDGRID_API_KEY);          
  try {          
    $response = $sendgrid->send($email);        
    $this->fn_varDump("INVITATION EMAIL SENT TO: [".$obj_param->MetaMoverInviteToEmail."]", "", true);
    //$this->fn_addConsole("INVITATION EMAIL SENT TO: [".$obj_param->MetaMoverInviteToEmail."]");
    
  } catch (Exception $e) {         
    $obj_page->fn_setError($e->getMessage());
    exit;
  }          
}    

}//END OF CLASS

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
?>