<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE


class interface_datamanager extends interface_sessionmanager {  
  function __construct() {            
    
    parent::__construct();   
    
    $this->arr_sqlUpgrade=[];                  
    $this->str_dateScript=$this->fn_getSQLDate();            
    $this->str_messageExecute="";    
    $this->int_countIteration=0; 
    
    //register debug varaibles here  to avoid empty error              
    $this->bln_debugExecute=false;//definition in place  
    $this->bln_debugRunSelect=false;
    $this->bln_debugAction=false;
    $this->bln_debugQuery=false;        
    $this->bln_debugView=false;        
    //register debug varaibles here  to avoid empty error                  
      
  }  
  function fn_validateAPIStatusCode($obj_response){
    if($obj_response->status_code===200)return true;
    return false;
  }
  
  function fn_initialize() {          
    
    
    parent::fn_initialize(); 

    $this->bln_debugDataManager=false;
    

    
    
    /////////////////////////              
    $this->fn_initializeConnection();                                 
    /////////////////////////       
    
  }          

    function fn_setMySQLGroupConcatMaxLength(){

    $str_sql="SET SESSION group_concat_max_len = 1000000;";    
    //$this->fn_addEcho("ADJUST  GROUP_CONCAT MAX LENGTH: ".$str_sql);                
    $stmt=$this->fn_executeSQLStatement($str_sql);                        

    //$this->fn_getMySQLGroupConcatMaxLength();
  } 
  function fn_getMySQLGroupConcatMaxLength(){

    $str_sql="SELECT @@group_concat_max_len AS `Result`";
    //$this->fn_addEcho("GET GROUP_CONCAT MAX LENGTH: ".$str_sql);                
    $stmt=$this->fn_executeSQLStatement($str_sql);                        
    $arr_row=$stmt->fetch();
    //$this->fn_varDump($arr_row, "GROUP_CONCAT MAX LENGTH");    
  } 
  
  

    function fn_disarmSQLString($str_sql=""){

      $arr_needle=["UPDATE", "INSERT", "DELETE", "DROP"];
      $str_value="";                
      return str_replace($arr_needle, $str_value, $str_sql);
  }
    function fn_initializeServerPost(){
      parent::fn_initializeServerPost();   

      $obj_post=$this->obj_post;

      

      if(empty($obj_post->MetaUserEmail)){        
        $obj_post->MetaUserEmail="";        
      }   
      if(empty($obj_post->AuthorizeUserPass)){        
        $obj_post->AuthorizeUserPass="";        
      }         

      //Mode Values            
      if(empty($obj_post->ModeNewRecord)){        
        $obj_post->ModeNewRecord=false;        
      }

      if(!isset($obj_post->MetaRowzId)){        
        $obj_post->MetaRowzId=0;                
      } 

      if(!isset($obj_post->MarkedParentSchemaName)){        
        $obj_post->MarkedParentSchemaName="";                
      }      
      if(!isset($obj_post->MarkedParentTableName)){        
        $obj_post->MarkedParentTableName="";                
      } 
      if(!isset($obj_post->MarkedParentRowzId)){        
        $obj_post->MarkedParentRowzId=0;                
      }       
      if(!isset($obj_post->MarkedParentViewId)){        
        $obj_post->MarkedParentViewId=0;                
      }       
      if(!isset($obj_post->MetaRowzName)){        
        $obj_post->MetaRowzName="";                
      } 
      if(!isset($obj_post->MetaRowzTitle)){        
        $obj_post->MetaRowzTitle="";                
      } 
      
      
      

      //For Menu URL Path Tracking 
      if(!isset($obj_post->MetaViewName)){        
        $obj_post->MetaViewName="";                
      } 
      if(!isset($obj_post->URLMetaRowzNameArchive)){        
        $obj_post->URLMetaRowzNameArchive="";                
      } 
      if(!isset($obj_post->URLMetaRecordIdArchive)){        
        $obj_post->URLMetaRecordIdArchive="";                
      }       
      //For Menu URL Path Tracking 

      //*/  
      //Mode Values
      
      //Meta Values      
      if(empty($obj_post->MetaViewId)){        
        $obj_post->MetaViewId="0";        
      }                
      
      
      //Meta Data Values            
      if(empty($obj_post->MetaDataSystemId)){        
        $obj_post->MetaDataSystemId="0";        
      }          
      //Meta Data Values
      

      if(empty($obj_post->MetaSchemaName)){        
        $obj_post->MetaSchemaName="";        
      }          
      else{        
        $obj_post->MetaSchemaName=$this->fn_disarmSQLString($obj_post->MetaSchemaName);
      }

      if(empty($obj_post->MetaTableName)){        
        $obj_post->MetaTableName="";        
      }          
      else{        
        $obj_post->MetaTableName=$this->fn_disarmSQLString($obj_post->MetaTableName);
      }

      if(empty($obj_post->MetaColumnName)){        
        $obj_post->MetaColumnName="";        
      }                
      else{        
        $obj_post->MetaColumnName=$this->fn_disarmSQLString($obj_post->MetaColumnName);
      }

      if(empty($obj_post->MetaColumnAPIName)){        
        $obj_post->MetaColumnAPIName="";        
      }                
      else{        
        $obj_post->MetaColumnAPIName=$this->fn_disarmSQLString($obj_post->MetaColumnAPIName);
      }

      

      
      if(!isset($obj_post->MetaColumnValue)){                        
        $obj_post->MetaColumnValue="";                    
      }
      
      if(!isset($obj_post->LivePin)){                        
        $obj_post->LivePin="";                    
      }
      

      if(!isset($obj_post->MetaColumnPosition)){                
        $obj_post->MetaColumnPosition="";
      }
      if(!isset($obj_post->MetaRowPosition)){                
        $obj_post->MetaRowPosition="";
      }      
      if(!isset($obj_post->MetaList)){                
        $obj_post->MetaList="";
      }
      if(!isset($obj_post->MetaListIdValue)){                
        $obj_post->MetaListIdValue="";
      }
      if(!isset($obj_post->MetaOption)){                
        $obj_post->MetaOption="";
      }      
      if(empty($obj_post->MetaKeySchemaName)){        
        $obj_post->MetaKeySchemaName="";        
      } 
      else{                 
        $obj_post->MetaKeySchemaName=$this->fn_disarmSQLString($obj_post->MetaKeySchemaName);
      }

      if(empty($obj_post->MetaKeyTableName)){        
        $obj_post->MetaKeyTableName="";        
      }
      else{                 
        $obj_post->MetaKeyTableName=$this->fn_disarmSQLString($obj_post->MetaKeyTableName);
      }
      
      if(empty($obj_post->MetaKeyColumnName)){        
        $obj_post->MetaKeyColumnName="";        
      }
      else{        
        $obj_post->MetaKeyColumnName=$this->fn_disarmSQLString($obj_post->MetaKeyColumnName);
      }

      if(empty($obj_post->MetaKeyColumnValue)){        
        $obj_post->MetaKeyColumnValue="";        
      }
      else{        
        $obj_post->MetaKeyColumnValue=$this->fn_disarmSQLString($obj_post->MetaKeyColumnValue);      
      }
      if(empty($obj_post->MetaKeyColumnShortName)){        
        $obj_post->MetaKeyColumnShortName="";        
      }
      else{        
        $obj_post->MetaKeyColumnShortName=$this->fn_disarmSQLString($obj_post->MetaKeyColumnShortName);      
      }
      //Meta Values
      
      //Query Values
      if(empty($obj_post->QueryExpression)){
        $obj_post->QueryExpression="";
      }                          
      else{        
        $obj_post->QueryExpression=$this->fn_disarmSQLString($obj_post->QueryExpression);
      }
      
      if(empty($obj_post->QuerySearch)){        
        $obj_post->QuerySearch="";        
      }
      if(empty($obj_post->SimpleSearch)){        
        $obj_post->SimpleSearch=false;        
      }
      if(empty($obj_post->AdvancedSearch)){        
        $obj_post->AdvancedSearch=false;        
      }      
      if(empty($obj_post->QueryList)){        
          $obj_post->QueryList="";        
      } 
      else{           
        $obj_post->QueryList=$this->fn_disarmSQLString($obj_post->QueryList);      
      }
      if(empty($obj_post->QueryListParent)){        
        $obj_post->QueryListParent="";        
      } 
      else{           
        $obj_post->QueryListParent=$this->fn_disarmSQLString($obj_post->QueryListParent);      
      }

      if(empty($obj_post->QueryListDisabled)){        
        $obj_post->QueryListDisabled="";        
      } 
      else{           
        $obj_post->QueryListDisabled=$this->fn_disarmSQLString($obj_post->QueryListDisabled);      
      }
      if(empty($obj_post->QueryListParentDisabled)){        
        $obj_post->QueryListParentDisabled="";        
      } 
      else{           
        $obj_post->QueryListParentDisabled=$this->fn_disarmSQLString($obj_post->QueryListParentDisabled);      
      }
      if(empty($obj_post->LoadReportInterface)){        
        $obj_post->LoadReportInterface=false;        
      } 
      
      //Query Values

      if(!isset($obj_post->SelectMinimalFieldPin)){        
        $obj_post->SelectMinimalFieldPin=false;        
      }       
      if(!isset($obj_post->SubDomain)){        
        $obj_post->SubDomain="";        
        $this->str_subDomain=explode('.', $_SERVER['HTTP_HOST'])[0];                    
      }       
      else{
        $this->str_subDomain=$obj_post->SubDomain;        
      }
      

      //*
      //Auto Join
      if(!isset($obj_post->AutoJoinPin)){        
        $obj_post->AutoJoinPin=false;        
      }       
      if(!isset($obj_post->AutoJoinFilterPin)){        
        $obj_post->AutoJoinFilterPin=false;        
      }       
      if(!isset($obj_post->AutoJoinToSource)){        
        $obj_post->AutoJoinToSource="";                
      }
      
      if(!isset($obj_post->AutoJoinToKeyName)){        
        $obj_post->AutoJoinToKeyName="";                
      }
      if(!isset($obj_post->AutoJoinToKeyValue)){        
        $obj_post->AutoJoinToKeyValue=0;                
      }
      
      
      //this appears to be required
      if(!isset($obj_post->AutoJoinFromKeyValue)){        
        $obj_post->AutoJoinFromKeyValue=0;                
      }
      //this appears to be required 
        
      if(!isset($obj_post->LinkOffPin)){        
        $obj_post->LinkOffPin=false;        
      } 
      if(!isset($obj_post->LinkOnPin)){        
        $obj_post->LinkOnPin=false;        
      }  
      if(!isset($obj_post->LimitRowPerPage)){        
        $obj_post->LimitRowPerPage=false;        
      }  
      if(!isset($obj_post->LimitRowStart)){        
        $obj_post->LimitRowStart=0;        
      } 
      if(!is_numeric($obj_post->LimitRowPerPage)){
        $obj_post->LimitRowPerPage=100;
      }
      if(!is_numeric($obj_post->LimitRowStart)){
        $obj_post->LimitRowStart=0;
      }
      //Auto Join
      //*/

      if(!isset($obj_post->Action)){        
        $obj_post->Action="";        
      }      
      if(!isset($obj_post->RunSearch)){        
        $obj_post->RunSearch=false;        
      }            
      
      if(!isset($obj_post->ActionCode)){        
        $obj_post->ActionCode=0;        
      }      
      
    }    
    function fn_destruct(){

      $this->pdo_admin=null;      
    }  
    
    
    function fn_initializeConnection(){            
      
    
      $this->obj_rowzAPI=new rowzAPI(); 
      $this->obj_rowzAPI->fn_connect();              
      $this->pdo_admin=$this->obj_rowzAPI->pdo_admin;            
      
      
      global $LOGIN, $SYSTEM_ADMINISTRATOR_USERNAME, $SYSTEM_ADMINISTRATOR_PASSWORD, $SYSTEM_USER_EMAIL;
      
      global $API_AUTHENTICATED;      
      $API_AUTHENTICATED=true;
      
      if($LOGIN){    
        
        //$this->fn_varDump("data manager Login", "note", true);              
        
      
        $arr_row=[];
        $arr_row["MetaUserId"]=100;        
        $arr_row["MetaHomeSystemId"]=100;        
        $arr_row["MetaUserSystemId"]=100;        
        $arr_row["MetaUserGroupId"]=100;        
        $arr_row["MetaUserName"]=$SYSTEM_ADMINISTRATOR_USERNAME;
        $arr_row["MetaUserPassword"]=$SYSTEM_ADMINISTRATOR_PASSWORD;                
        $arr_row["MetaUserEmail"]=$SYSTEM_USER_EMAIL;                
        $arr_row["MetaUserHost"]="localhost";        
        
        $arr_row["MetaUserBaseId"]=100;                        
        $arr_row["MetaSystemOwner"]=false;                
        
        $this->obj_userLogin=$this->fn_loadUser($arr_row);                
        
        $this->obj_userBase=$this->obj_userLogin;                
        $this->obj_userSystem=$this->obj_userLogin;                
        $this->obj_userGroup=$this->obj_userLogin;
        
      }                 
      else{    

        
        
        
        $this->obj_userLogin=$this->fn_loadSessionUser(); 
        //$this->fn_debugSessionUserParam("UserLoginSession");                     
        
        //$this->fn_varDump($this->obj_userLogin, "this->obj_userLogin", true);                
        
        
        $this->fn_loadMetaMoverData();                      


        //$this->fn_addEcho("MetaPermissionTag: ".$this->obj_userLogin->MetaPermissionTag);                                
        //$this->fn_varDump($this->obj_userLogin);                
        //$this->fn_varDump($this->obj_post);                
        
        
        //*        
        $this->obj_userBase=$this->obj_userLogin->obj_userBase;        
        $this->obj_userSystem=$this->obj_userLogin->obj_userSystem;
        $this->obj_userGroup=$this->obj_userLogin->obj_userGroup;
        //*/   
        
        $this->fn_pullSettingzColumnz();        
      }      

      //$this->fn_setSystemOwner();

      //$this->fn_varDump($this->obj_userLogin, "xxx");                     
      //$this->fn_varDump($this->obj_post, "DATA MANAGER RECEIVE POST");                           
      
      /*                  
      if($this->bln_debugExecute){
        $this->fn_addConsole("this->obj_post->RunSearch", $this->obj_post->RunSearch);        
        $this->fn_addConsole("this->obj_post->QueryList", $this->obj_post->QueryList);                     
        $this->fn_addConsole("this->obj_post->QueryListParent", $this->obj_post->QueryListParent);                     
        $this->fn_addConsole("this->obj_post->QueryListDisabled", $this->obj_post->QueryListDisabled);                     
        $this->fn_addConsole("this->obj_post->QueryListParentDisabled", $this->obj_post->QueryListParentDisabled);                     
      }
      //*/
      
      
      
      
      $this->bln_methodRowz=true;      
      
      //$this->fn_debugSessionUserParam("UserLoginSession");                     
      $this->obj_userLogin->MetaUserBaseId=100;                                  
      
      $this->obj_userLogin->int_apiRowsPerPage=10;     

      /////////////
      //this is correct -use logged in user for the api view updates, already authenticated via session.            
      $this->obj_rowzAPI->obj_userLogin=$this->obj_userLogin;
      /////////////
      
      
      $this->userAliasClient=new userAlias($this->obj_userLogin);
      
      //$this->fn_varDump($this->obj_userLogin->obj_metaSystem);
      
      $this->obj_post->UserHome=json_encode($this->userAliasClient);            
      
      $this->fn_validateSystem();      

      //$this->fn_addEcho("AAA MetaPermissionTag: ".$this->obj_userLogin->MetaPermissionTag);                
      
    }    

    

    function fn_runHome(){    
      
      $this->obj_userLogin->MetaUserSystemId=$this->obj_userLogin->MetaHomeSystemId;  
      $MetaMoverSystemIdTarget=$this->obj_userLogin->MetaUserSystemId;
      $this->fn_openSystem($MetaMoverSystemIdTarget);      
    }    
    
    function fn_setSystemOwner(){    
      $this->obj_userLogin->MetaSystemOwner=false;      
      if(!empty($this->obj_userLogin->MetaHomeSystemId) && !empty($this->obj_userLogin->MetaUserSystemId)){
        if($this->obj_userLogin->MetaHomeSystemId===$this->obj_userLogin->MetaUserSystemId){
          $this->obj_userLogin->MetaSystemOwner=true;
        }
      }            
    }
    function fn_openUser($MetaUserId){
      
      $str_sql="SELECT * FROM `meta_user`.`meta_user` WHERE TRUE
      AND `MetaUserId`=:MetaUserId
      ;";          
      
      $stmt = $this->fn_executeSQLStatement($str_sql, [                    
        'MetaUserId' => $MetaUserId
      ]);       
      
      $arr_row=$stmt->fetch();
      
      if($arr_row){   
        $obj_metaUser=$this->fn_loadUser($arr_row);                                     
        return $obj_metaUser;
      } 
      return false;
    }

    function fn_openUserAPI($MetaUserId){      

      $API_BAD_PASSWORD="EMPTYsZOuSf6ZWOBAuc18al9";
      $API_LOGIN_PASSWORD=trim(str_ireplace("Bearer", "", apache_request_headers()["Authorization"]));
      if(empty($API_LOGIN_PASSWORD)){
        $API_LOGIN_PASSWORD=$API_BAD_PASSWORD;
      }        
    
      $str_sql="";
      $str_sql.="SELECT * FROM  `meta_user`.`meta_user` WHERE 
      (`MetaAPIPassword`=:MetaAPIPassword)
      ;";              
      //$this->fn_addEcho("str_sql: ".$str_sql);                                    
      
      $stmt=$this->fn_executeSQLStatement($str_sql, [
        'MetaAPIPassword' => $API_LOGIN_PASSWORD
      ]);             
      $arr_row=$stmt->fetch();        
      
      if($arr_row){                
        $arr_row["MetaUserBaseId"]=100;                
        $arr_row["MetaSystemOwner"]=false;              
        return $this->fn_loadUser($arr_row);                     
      } 
      return false;
      
    }

    
   

    function fn_loadQueryListFromDB(){        

      $MetaRowzId=$this->obj_post->MetaRowzId;
      if(empty($MetaRowzId)){return;}
      
      $str_sql="SELECT `QueryList`, `QueryListDisabled` FROM `meta_rowz`.`meta_rowz`        
      WHERE TRUE AND
      MetaRowzId=:MetaRowzId
      ;";              
    
    
      $stmt = $this->fn_executeSQLStatement($str_sql, [      
          'MetaRowzId'=>$MetaRowzId
      ]);                        
      
      $arr_row=$stmt->fetch();
      if(empty($arr_row)){
          return;
      }
      //there will always be a row, however
      
      $QueryList=$arr_row["QueryList"];            
      $QueryListDisabled=$arr_row["QueryListDisabled"];
      //$this->fn_varDump($QueryList, "LOAD QueryList");

      $this->obj_userLogin->QueryList=$QueryList;
      $this->obj_userLogin->QueryListDisabled=$QueryListDisabled;        
      $this->fn_setSession("UserLoginSession", serialize($this->obj_userLogin));
  }

    
    function fn_getMetaMoverId($obj_user){

      //START Get MetaPermissionTag , Group Owner 
      $str_sql="SELECT * FROM `meta_user`.`meta_mover` JOIN `meta_data`.`meta_data` on `meta_mover`.`MetaMoverId`=`meta_data`.`DataKeyValue`
      WHERE TRUE AND
      (DataSchemaName='meta_user' AND 
      DataTableName='meta_mover' AND
      DataKeyName='MetaMoverId') AND
      MetaMoverSystemId=:MetaMoverSystemId AND 
      MetaMoverUserId=:MetaMoverUserId AND 
      MetaMoverType='User'    
      ;";                    
      
      $stmt = $this->fn_executeSQLStatement($str_sql, [
        'MetaMoverSystemId'=>$obj_user->MetaUserSystemId,
        'MetaMoverUserId'=>$obj_user->MetaUserId
      ]);              
      $arr_row=$stmt->fetch();                              
      
      if(empty($arr_row)){
        $this->fn_varDump("Mover Id Issue", "status", true);                      
        exit;
      }
      $obj_user->MetaMoverId=$arr_row["MetaMoverId"];
      $obj_user->MetaPermissionTag=$arr_row["MetaPermissionTag"];//who created/owns your mover record ?
      $obj_user->MetaDataOwnerId=$arr_row["MetaDataOwnerId"];//who created/owns your mover record ?      

    }

    function fn_onZeroCredit(){
      $MetaSystemId=$this->obj_userLogin->MetaUserSystemId;
      $str_sql="UPDATE `meta_user`.`meta_system` SET        
      `Credit`=:Credit        
      WHERE TRUE
      AND `MetaSystemId`=:MetaSystemId;
      ";                    
      $stmt=$this->fn_executeSQLStatement($str_sql, [
          'MetaSystemId' => $MetaSystemId,
          'Credit' => 0,
          
      ]);            

      //*
      $str_sql="UPDATE `meta_user`.`meta_mover` SET
        `meta_mover`.`SessionPin`=1
        WHERE TRUE 
        AND MetaMoverSystemId=:MetaMoverSystemId 
        AND MetaMoverType='User'
        ;";                              
        $stmt=$this->fn_executeSQLStatement($str_sql, [
          'MetaMoverSystemId' => $MetaSystemId
        ]);        
      //*/
  }
    
    function fn_loadMetaMoverData(){      

      //START Get MetaPermissionTag , Group Owner 
      $str_sql="SELECT       
      `meta_mover`.`SessionPin` AS 'SessionPin',
      `meta_mover`.`MetaPermissionTag` AS 'MetaPermissionTag',
      `meta_mover`.`MetaPermissionStamp` AS 'MetaPermissionStamp' 
      FROM `meta_user`.`meta_mover`
      WHERE TRUE AND                  
      MetaMoverSystemId=:MetaMoverSystemId AND 
      MetaMoverUserId=:MetaMoverUserId AND 
      MetaMoverId=:MetaMoverId AND
      MetaMoverType='User'    
      ;";                    
      //$this->fn_varDump($str_sql, "str_sql");
      
      
      $stmt = $this->fn_executeSQLStatement($str_sql, [          
        'MetaMoverSystemId'=>$this->obj_userLogin->MetaUserSystemId,
        'MetaMoverUserId'=>$this->obj_userLogin->MetaUserId,        
        'MetaMoverId'=>$this->obj_userLogin->MetaMoverId        
      ]);        
      $arr_row=$stmt->fetch();

      $this->obj_userLogin->MetaPermissionTag=$arr_row["MetaPermissionTag"];
      $this->obj_userLogin->MetaPermissionStamp=$arr_row["MetaPermissionStamp"];      


      $this->obj_userLogin->SessionPin=$arr_row["SessionPin"];
      

      if(empty($this->obj_userLogin->SessionPin)){
        return;
      }
      
      $this->fn_openUserViaID($this->obj_userLogin->MetaUserId);            
      $this->fn_updateSessionPin(false);
  }
    
  
  function fn_debugUserParam($obj_userParam){

    $this->fn_varDump($obj_userParam, "obj_userParam", true);                                                
  } 


    function fn_validateSystem($bln_retry=false){      
      
      return;//turn on to ensure the logged in user is still valid.
      $str_sql="SELECT * FROM `meta_user`.`meta_mover` JOIN `meta_user`.`meta_user` ON
      `meta_user`.`meta_mover`.`MetaMoverUserId`=`meta_user`.`meta_user`.`MetaUserId`
      WHERE TRUE      
      AND `MetaUserId`=:MetaUserId 
      AND `MetaMoverUserId`=:MetaMoverUserId       
      AND `MetaMoverSystemId`=:MetaMoverSystemId       
      AND `MetaMoverStatus`='Enabled' 
      AND `MetaMoverType`='User'
      ;";

      $arr_param=[
        'MetaUserId'=>$this->obj_userLogin->MetaUserId,
        'MetaMoverUserId'=>$this->obj_userLogin->MetaUserId,        
        'MetaMoverSystemId'=>$this->obj_userLogin->MetaUserSystemId,        
      ];

      /*      
      $this->fn_addEcho("str_sql: ".$str_sql);
      $this->fn_addEcho("MetaUserId: ".$this->obj_userLogin->MetaUserId);
      $this->fn_addEcho("MetaMoverUserId: ".$this->obj_userLogin->MetaUserId);
      $this->fn_addEcho("MetaUserSystemId: ".$this->obj_userLogin->MetaUserSystemId);      
      //*/
      
      $RowCount=$this->fn_fetchCount($str_sql, $arr_param);                 
      //$this->fn_addEcho("RowCount: ".$RowCount);

      if(empty($RowCount)){        
        if(empty($bln_retry)){
          $this->fn_runHome();          
          $RowCount=true;
        }
      }

      if(empty($RowCount)){
        $this->fn_addConsole("User Is Not Valid");        
        $this->fn_setErrorLogin("Please login again");                
        exit;
      }      
      
      //$this->fn_addEcho("User Validated");      
    }

    
    function fn_updateUserRecordSystemID(){

      
      $str_sql="UPDATE `meta_user`.`meta_user` SET MetaUserSystemId=:MetaUserSystemId WHERE MetaUserId=:MetaMoverUserId;";
      $stmt=$this->fn_executeSQLStatement($str_sql, [
        'MetaUserSystemId'=>$this->obj_userLogin->MetaUserSystemId,
        'MetaMoverUserId'=>$this->obj_userLogin->MetaUserId
      ]);
      
    }
  
    
  function fn_setUserDate($obj_userLogin){

    if(empty($obj_userLogin)){
      return;
    }

    $obj_userLogin->ModifiedDate=$this->str_runtime;  
    $obj_userLogin->ModifiedBy=$obj_userLogin->MetaUserId;  
    $obj_userLogin->CreatedDate=$this->str_runtime;  
    $obj_userLogin->CreatedBy=$obj_userLogin->MetaUserId;  
  }
  
  

  function fn_debugSessionUserParam($str_sessionParam){           
    if(empty($_SESSION[$str_sessionParam])){$_SESSION[$str_sessionParam]="";}
    $obj_userLogin=unserialize($_SESSION[$str_sessionParam]);                              
    $this->fn_debugUserParam($obj_userLogin);
  }
  
  function fn_databaseExist($str_nameDB){

    $str_sql="SHOW DATABASES LIKE '$str_nameDB';";              
    $stmt=$this->fn_executeSQLStatement($str_sql);          
    $arr_rows=$stmt->fetchAll();
    if($arr_rows){return true;}
    return false;
  }      
  

  function fn_dataConnect($obj_connect) {  

    $charset="utf8";
    $str_name="myPDO";    
    if(!$this->fn_isObject($obj_connect)){$obj_connect=new meta_connect();}      
    if(empty($obj_connect->Host)){
      $obj_connect->Host="localhost";
    }  
    $obj_connect->HasError=true;  
    $obj_connect->str_message="Error On Login";      
    $dsn = "mysql:host=$obj_connect->Host;charset=$charset;";
    if(!empty($obj_connect->Schema)){
      $dsn.="dbname=".$obj_connect->Schema;
    }
    
    //$this->fn_addEcho("dsn: ".$dsn);
    
    $options = [
      PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES=>true,
      PDO::ATTR_PERSISTENT=>true
    ];

    $pdo=false;
    try {      
        $pdo = new PDO($dsn, $obj_connect->User, $obj_connect->Pass, $options);      
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->obj_connect=$obj_connect;
        $obj_connect->HasError=false;  
        $obj_connect->str_message="";      
    } catch (PDOException $e) {       
      $obj_connect->HasError=true;              
      $obj_connect->str_message="CONNECT ERROR".$e->getMessage();    
    }  
    
    return $pdo;
  } 
  
  
}//END CLASS  
  ///////////////////////////DATAMANAGER