<?php

///////////////////////////SERVER KEY
require_once "rowz.key";        
///////////////////////////SERVER KEY

class rowzData {     

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
  
        if(empty($this->pdo_admin)){
          return false;
        }          
        return true;
    }
    function fn_dataConnect($obj_connect) {  
  
      $charset="utf8";
      $str_name="myPDO";          
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
            //$this->fn_setError($str_message);
            //echo($str_sql);
            echo($str_message);
            var_dump($arr_param);
            
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