<?php


class rowzAPIData extends rowzAPISupport{     

  function fn_connect(){

    global $SYSTEM_DEFAULT_DATABASE, $SYSTEM_ADMINISTRATOR_USERNAME, $SYSTEM_ADMINISTRATOR_PASSWORD;
    

    if(!empty($this->pdo_admin)){
      return;        
    }    
    
      $obj_connect=new stdClass;                              
      $obj_connect->Schema=$SYSTEM_DEFAULT_DATABASE;                               
      $obj_connect->User=$SYSTEM_ADMINISTRATOR_USERNAME;
      $obj_connect->Pass=$SYSTEM_ADMINISTRATOR_PASSWORD; 
      $obj_connect->Host='localhost';       
      $this->pdo_admin=$this->fn_dataConnect($obj_connect);             

      if($obj_connect->HasError){        
        $this->fn_varDump($obj_connect->str_message, "Connect Error");            
      }

      if(empty($this->pdo_admin)){
        return false;
      }          
      return true;
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
  
  function fn_authenticate(){
    
    global $API_AUTHENTICATED;         
        
    if($API_AUTHENTICATED){                 
      $this->response->status_code=200;          
      $this->response->status_message="OK";                
      return;
    }    
    
    $bln_connect=$this->fn_connect();        
    if(!$bln_connect){
        $this->response->status_code=500;                
        $this->response->status_message="Internal Server Error";                    
        exit;
    }    
    
    $this->obj_userLogin=$this->fn_openUserAPI();           
    if($this->obj_userLogin){
      $this->obj_userLogin->int_apiRowsPerPage=10;     
      $this->response->status_code=200;    
      $this->response->status_message="OK";                
      $API_AUTHENTICATED=true;       
      return;
    }    
    else{

        $this->response->status_code=401;
        $this->response->status_message="Unauthorizedxx";                    
        $API_AUTHENTICATED=false;
        //$this->fn_addEcho("this->response->status_code: ".$this->response->status_code);
        return;
    }    
  }

  function fn_openUserAPI(){      

    $API_BAD_PASSWORD="EMPTYsZOuSf6ZWOBAuc18al9";
    $str_authorisation="authorization";
    if($this->bln_localHost){
      $str_authorisation="Authorization";
    }
    
    if(!empty(apache_request_headers()[$str_authorisation])){          
      //print_r(apache_request_headers());
      $API_LOGIN_PASSWORD=trim(str_ireplace("Bearer", "", apache_request_headers()[$str_authorisation]));              
    }

    if(empty($API_LOGIN_PASSWORD)){
      $API_LOGIN_PASSWORD=$API_BAD_PASSWORD;    
    }                
    
  
    $str_sql="";
    $str_sql.="SELECT * FROM  `meta_user`.`meta_user` WHERE 
    (`MetaAPIPassword`=:MetaAPIPassword)
    ;";              
    //$this->fn_addEcho("str_sql: ".$str_sql);
    //$this->fn_addEcho("API_LOGIN_PASSWORD: ".$API_LOGIN_PASSWORD);                                    
    
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'MetaAPIPassword' => $API_LOGIN_PASSWORD
    ]);             
    $arr_row=$stmt->fetch();            
    
    if($arr_row){                
      $arr_row["MetaUserBaseId"]=100;                
      $arr_row["MetaSystemOwner"]=false;     
      $this->OPEN_USER_API=true;    
      return $this->fn_loadUser($arr_row);                     
    } 

    return false;
    
  }

  function fn_loadUser($arr_row){       
    
     //$this->fn_varDump($arr_row, "arr_row", true);       
    //this is where user param object is created.  
    //this funciton is used by this page where no session exists before login.  
    //this function is used by login, once the user is authenticated.
    //The session is created from this object.  
    //From then on the userParam is created from session in fn_load SessionUser
    
    $obj_user=new metaUser();   
    $obj_user->fn_initialize($arr_row, $this->OPEN_USER_API);  
    
    $this->fn_getMetaMoverId($obj_user);            
    return $obj_user;
  }

  function fn_getMetaMoverId($obj_user){

    if(empty($obj_user)){
      return false;
    }

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
    
    $obj_user->MetaMoverId=$arr_row["MetaMoverId"];
    $obj_user->MetaPermissionTag=$arr_row["MetaPermissionTag"];//what permission do you have    
    $obj_user->MetaDataOwnerId=$arr_row["MetaDataOwnerId"];//who created/owns your mover record ?      
    
    $Admin=false;//see if this will "work"
    if(strtolower($obj_user->MetaPermissionTag)==="#admin"){
      $Admin=true;
    }
    $obj_user->Admin=$Admin;
  }

  function fn_setSystemOwner(){    
    $this->obj_userLogin->MetaSystemOwner=false;      
    if(!empty($this->obj_userLogin->MetaHomeSystemId) && !empty($this->obj_userLogin->MetaUserSystemId)){
      if($this->obj_userLogin->MetaHomeSystemId===$this->obj_userLogin->MetaUserSystemId){
        $this->obj_userLogin->MetaSystemOwner=true;
      }
    }            
  }


  

  //Data Function
  function fn_fetchRow($str_sql, $arr_param=false){

    $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
    return $stmt->fetch();        
}

  function fn_fetchCount($str_sql, $arr_param=false, $bln_cancelDebug=false){

      $int_count=$this->fn_fetchColumn($str_sql, $arr_param, $bln_cancelDebug);                
      return $int_count;        
  }
  function fn_fetchColumn($str_sql, $arr_param=false, $bln_cancelDebug=false){    
      
      $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param, $bln_cancelDebug);  
      return $stmt->fetchColumn();        
  }
  function fn_executeSQLStatement($str_sql, $arr_param=false, $bln_cancelDebug=false){                                                      


      $pdo_connection=$this->pdo_admin;
  
      /*
      if($this->str_messageExecute){
        $this->fn_addEcho($this->str_messageExecute);
        $this->str_messageExecute="";
      }
      //*/
  
      if(empty($arr_param)){
          
          $arr_param=[];
      }            
  
      $stmt = $pdo_connection->prepare($str_sql);                                
      try{            
        $stmt->execute($arr_param);                                        
      }
      catch (PDOException $e) {                                       
          $str_message=$e->getMessage().PHP_EOL.PHP_EOL;
          $str_message.=$str_sql;
          $this->fn_setError($str_message);
          if(!empty($this->obj_page)){
            //$this->obj_page->fn_varDump($str_message, "str_message", true);
          }
          return $stmt;
      }     
      
      if(!empty($this->obj_page)){
        //$this->obj_page->fn_varDump($str_sql, "str_sql", true);
      }
    
      
      return $stmt;
  }    
  function fn_getLastInsertId(){
      return $this->pdo_admin->lastInsertId();
    }
  //Data Function    

}//end of class