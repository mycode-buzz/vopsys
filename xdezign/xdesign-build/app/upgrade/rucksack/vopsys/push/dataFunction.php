<?php

class dataFunction extends evalFunction{

  function fn_connect(){

    global $SYSTEM_DEFAULT_DATABASE, $SYSTEM_ADMINISTRATOR_USERNAME, $SYSTEM_ADMINISTRATOR_PASSWORD;
    
    $obj_connect=new stdClass;                              
      $obj_connect->Schema=$SYSTEM_DEFAULT_DATABASE;                               
      $obj_connect->User=$SYSTEM_ADMINISTRATOR_USERNAME;
      $obj_connect->Pass=$SYSTEM_ADMINISTRATOR_PASSWORD; 
      $obj_connect->Host='localhost';       
      $this->pdo_admin=$this->fn_dataConnect($obj_connect);             

      if(empty($this->pdo_admin)){
        this->fn_varDump("obj_pdo is empty", "obj_pdo is empty", true);
        exit;  
      }      

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

  function fn_isObject($obj){
    if(gettype($obj)==="object"){return true;}
    return false;
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
        
        if($this->bln_debugExecute && !$bln_cancelDebug){
          $this->fn_addEcho($str_sql);
        }
      
        $stmt = $pdo_connection->prepare($str_sql);                                
        try{            
          $stmt->execute($arr_param);                                        
        }
        catch (PDOException $e) {                       
          exit;
        }
        if($this->bln_debugExecute){
          $this->fn_addEcho("ROWS RETURNED: ".$stmt->rowCount());//will provide 1 for zero count query
        }
        return $stmt;
      } 
      function fn_fetchRow($str_sql, $arr_param=false){

        $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
        return $stmt->fetch();        
      }
      function fn_fetchCount($str_sql, $arr_param=false){

        $int_count=$this->fn_fetchColumn($str_sql, $arr_param);                
        return $int_count;        
    }
      function fn_fetchColumn($str_sql, $arr_param=false){    

        //$this->fn_addEcho("str_sql: ".$str_sql);
        //$this->fn_varDump($arr_param, "arr_param");
        $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
        //$this->fn_varDump($stmt, "stmt");
        return $stmt->fetchColumn();        
      } 
      function fn_fetchAll($str_sql, $arr_param=false){
        $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
        return $stmt->fetchAll();        
      }


    
}