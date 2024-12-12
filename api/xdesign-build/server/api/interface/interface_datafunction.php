<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE


///////////////////////////DATAFUNCTION

class interface_datafunction extends interface_support{  
  function __construct() {              
  }    

  function fn_initialize() {                        
    parent::fn_initialize();            
    
    ///////////////////////////        
    $this->MetaDataViewId="101426";//meta_data
    $this->MetaDataViewName="meta_data";

    $this->MetaUserViewId="1";//meta_user
    $this->MetaUserViewName="meta_user";
    
    $this->MetaLinkViewId="100475";//meta_link
    $this->MetaLinkViewName="meta_link";

    $this->MetaColumnViewId="45";//meta_user
    $this->MetaColumnViewName="meta_column";

    /*Not currently required
    $this->MetaProjectViewId="110";//meta_link
    $this->MetaProjectViewName="Project";

    $this->MetaProjectTypeDynamicViewId="120";//meta_link
    $this->MetaProjectTypeDynamicViewName="ProjectTypeDynamic";        
    
    $this->arr_listSystemView=array(
        $this->MetaDataViewId, 
        $this->MetaUserViewId, 
        $this->MetaLinkViewId,
        $this->MetaProjectViewId,
        $this->MetaProjectTypeDynamicViewId,            
    );
    //*/
    /////////////////
}

    
    function fn_getColumnListNoPrimaryKey($obj_param){        
  
      $REMOVE_LIST=$obj_param->REMOVE_LIST;
      //concat(\"'\",group_concat(COLUMN_NAME separator \"','\"),\"'\") AS `FieldList`
      //group_concat(COLUMN_NAME separator ',') AS `FieldList`
      $str_sql="SELECT         
      group_concat(COLUMN_NAME separator \"`,`\") AS `FieldList`
      FROM INFORMATION_SCHEMA.COLUMNS WHERE TRUE AND 
      TABLE_SCHEMA=:TABLE_SCHEMA AND 
      TABLE_NAME=:TABLE_NAME AND 
      COLUMN_NAME NOT IN ($obj_param->REMOVE_LIST)
      ;";        
      if($this->bln_debugQuery){            
          //$this->fn_addEcho("GET INSERT LIST str_sql: ".$str_sql);                
          $this->str_messageExecute="GET INSERT LIST";
      }
      $str_listField=$this->fn_fetchColumn($str_sql, [            
          "TABLE_SCHEMA" => $obj_param->TABLE_SCHEMA,
          "TABLE_NAME" => $obj_param->TABLE_NAME            
      ]);               
    
    
      return "`".$str_listField."`";
    }

    function fn_flushPrivileges(){

      if($this->bln_debugLogin){
        //$this->fn_addEcho("************START fn_flushPrivileges");          
      }  
      
      $str_sql="FLUSH PRIVILEGES;";                 
      $stmt=$this->fn_executeSQLStatement($str_sql);      
  
      if($this->bln_debugLogin){
        //$this->fn_addEcho("************END fn_flushPrivileges");          
      }  
    }  
  

    //START FILE FOLDER FUNCTIONS
  function fn_copyToRecycleBin($str_path, $str_label){                  
    return $this->fn_recycle($str_path, $str_label, $bln_copy=true);                  
  }

  function fn_recycle($str_pathRecycleFrom, $str_label, $bln_copy=false){                  

    if(!file_exists($str_pathRecycleFrom)){return;}  
    
    $str_pathFolderRecycleRoot=VOPSYSROOT."/recyclebin";        
    $str_pathFolderRecycleRoot=$this->fn_createFolder($str_pathFolderRecycleRoot);                
    $str_labelCustom=$this->str_UniqueName."_".$str_label;
    
    $str_pathFolderRecycleProcess=$this->fn_createFolder($str_pathFolderRecycleRoot."/xdesign");            
    $this->fn_maintainRecycle($str_pathFolderRecycleProcess);

    $str_pathFolderRecycleCustom=$this->fn_createFolder($str_pathFolderRecycleProcess."/".$str_labelCustom);
    $str_pathRecycleTo=$this->fn_createFolder($str_pathFolderRecycleCustom."/".basename($str_pathRecycleFrom));        
    
    if(empty($str_pathRecycleFrom)){return;}      
    if(empty($str_pathRecycleTo)){return;}          
    if($bln_copy){$this->fn_copyFolder($str_pathRecycleFrom, $str_pathRecycleTo);}
    else{rename($str_pathRecycleFrom, $str_pathRecycleTo);}
    //$this->fn_addEcho("str_pathRecycleFrom: ".$str_pathRecycleFrom);
    //$this->fn_addEcho("str_pathRecycleTo: ".$str_pathRecycleTo);
    return $str_pathRecycleTo;  
  } 
  
  function fn_maintainRecycle($str_pathFolder){

    $int_count=0;
    $arr_files = scandir($str_pathFolder, 1);
    foreach ($arr_files as $str_file) {            
      if($str_file=="."){continue;}
      if($str_file==".."){continue;}
      //$this->fn_addEcho("str_file: ".$str_file);
      $str_path=$str_pathFolder."/".$str_file;      
      //$this->fn_addEcho("int_count: ".$int_count);
      
      //$this->fn_addEcho("str_path: ".$str_path);      
      if($int_count>3){
        //$this->fn_addEcho("unlink str_path: ".$str_path);
        $this->fn_deleteFolder($str_path);
      }      
      $int_count++;
    }
  }
  function fn_createFolder($str_path_folder){
    $bln_fileexist=file_exists($str_path_folder);           
    if(!$bln_fileexist){                              
      mkdir($str_path_folder, 0755, true);            
    }
    return $str_path_folder;
  }       
  function fn_deleteFolder($dir, $bln_val=false) {//will delete folder, empty or not         
      
    if(!file_exists($dir)){return false;}
    if(!is_dir($dir)){return false;}
    
    $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
      (is_dir("$dir/$file")) ? $this->fn_deleteFolder("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir);
  } 
  function fn_copyFolder($source, $dest){

    $this->fn_createFolder($dest);
    
    
    foreach (
    $iterator = new \RecursiveIteratorIterator(
      new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
      \RecursiveIteratorIterator::SELF_FIRST) as $item
    ) {
      if ($item->isDir()) {
        $this->fn_createFolder($dest . DIRECTORY_SEPARATOR . $iterator->getSubPathname());
        
      } else {
        copy($item, $dest . DIRECTORY_SEPARATOR . $iterator->getSubPathname());
      }
    }
  } 
  function fn_removeEmptySubFolders($path)
  {
      $empty = true;
      foreach (glob($path . DIRECTORY_SEPARATOR . "*") as $file) {
          $empty &= is_dir($file) && $this->fn_removeEmptySubFolders($file);
      }
      return $empty && (is_readable($path) && count(scandir($path)) == 2) && rmdir($path);
  }
  function fn_deleteFile($str_path){      
    if(!file_exists($str_path)){return false;}
    if(!is_file($str_path)){return false;}  
    unlink($str_path);
  }    
  function path2url($str_file_path) {      
    $str_protocol='http://';      
    if(!empty($_SERVER['HTTPS'])){$str_protocol='https://';}
    $str_HTTP_HOST=$_SERVER['HTTP_HOST'];            
    $str_DOCUMENT_ROOT=str_replace("\\", "/", $_SERVER['DOCUMENT_ROOT']);;      
    $str_file_path=str_replace("\\", "/", $str_file_path);
    $str_url_path=str_replace($_SERVER['DOCUMENT_ROOT'], '', $str_file_path);
    $str_url=$str_protocol.$str_HTTP_HOST.$str_url_path;      
    return $str_url;
  } 
  //END FILE FOLDER FUNCTIONS
  //START SQL FUNCTION 
    
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
      //$this->fn_addEcho($str_sql);
    }
    

    $stmt = $pdo_connection->prepare($str_sql);                                
    try{            
      $stmt->execute($arr_param);                                        
    }
    catch (PDOException $e) {                   
      global $obj_page;
      $obj_page->fn_setError(
        $e->getMessage().PHP_EOL.PHP_EOL.$str_sql
      );
      exit;
    }
    
    //*
    if($this->bln_debugExecute && !$bln_cancelDebug){
      //$this->fn_addEcho("ROWS RETURNED: ".$stmt->rowCount());//will provide 1 for zero count query
    }
    //*/
    return $stmt;
    }
    
    function fn_getLastInsertId(){
      return $this->pdo_admin->lastInsertId();
    }
    function fn_fetchRow($str_sql, $arr_param=false){

        $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
        return $stmt->fetch();        
    }

    function fn_fetchRowz($str_sql, $arr_param=false){

      $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
      return $stmt->fetchAll();              
  }


    function fn_fetchColumn($str_sql, $arr_param=false, $bln_cancelDebug=false){    
        
        $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param, $bln_cancelDebug);
        $foo_value=$stmt->fetchColumn();
        if(is_null($foo_value)){
            $foo_value=NULL;
        }
        else{
          $foo_value=trim($foo_value);
        }
        return $foo_value;        
    }
    function fn_columnExist($str_sql, $arr_param=false){
        
        $bln_value=$this->fn_fetchColumn($str_sql, $arr_param);                
        if(empty($bln_value)){
            return false;
        }
        return true;
    }
    function fn_fetchCount($str_sql, $arr_param=false, $bln_cancelDebug=false){

        $int_count=$this->fn_fetchColumn($str_sql, $arr_param, $bln_cancelDebug);                
        return $int_count;        
    }

    function fn_rowExist($str_sql, $arr_param=false){                                
        
        $arr_value=$this->fn_fetchRow($str_sql, $arr_param);                
        if(empty($arr_value)){
            return false;
        }
        return true;
    }
    function fn_mysqlSchemaExist($MetaSchemaName){
        $str_sql="SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?";            
        return $this->fn_rowExist($str_sql, [$MetaSchemaName]);
    }    
    function fn_mysqlTableExist($MetaSchemaName,$MetaTableName){
        $str_sql="SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";        
        return $this->fn_rowExist($str_sql, [$MetaSchemaName, $MetaTableName]);
    }    
    function fn_mysqlColumnExist($MetaSchemaName,$MetaTableName,$MetaColumnName){      
      $str_sql="SHOW COLUMNS FROM `$MetaSchemaName`.`$MetaTableName` LIKE '$MetaColumnName';";
      return $this->fn_rowExist($str_sql);
  }    

  function fn_mysqlChangeType($MetaSchemaName, $MetaTableName, $MetaColumnName, $MetaColumnDefinition){       
    
    $bln_exist=$this->fn_mysqlColumnExist($MetaSchemaName, $MetaTableName, $MetaColumnName);    
    if($bln_exist){   
      $str_sql="ALTER TABLE `$MetaSchemaName`.`$MetaTableName` 
      MODIFY COLUMN `$MetaColumnName` $MetaColumnDefinition;
      ;";                        
      //$this->fn_addConsole("str_sql", $str_sql);                                                          
      $this->fn_executeSQLStatement($str_sql);                          
    }           
  }
  
    
    function fn_resetAutoIncrement($str_source, $str_key){                   

      $str_sql="SELECT MAX($str_key) as `MaxId` FROM $str_source;";
      $int_maxId=$this->fn_fetchColumn($str_sql);                
      if(is_null($int_maxId)){
        $int_maxId=0;
      }
      if(empty($int_maxId)){
        $int_maxId=0;
      }      
      $int_maxId+=1;

      $str_sql="ALTER TABLE $str_source AUTO_INCREMENT=$int_maxId;";
      $stmt=$this->fn_executeSQLStatement($str_sql);                
    }
    function fn_protectSQLValue($str_value){             
     
      if(empty($str_value)){        
        return "";
      }      
      if($str_value==="''"){        
        return "";
      }      
      $arr_remove = array("SELECT", "FROM", "*", "COUNT(*)", "INSERT", "UPDATE", "DELETE", "WHERE", "HAVING", "TRUE", "FALSE", "0");      
      $arr_value=explode(" ", $str_value);                       
      $arr_value=array_udiff($arr_value, $arr_remove, 'strcasecmp');      
      $str_value=implode("", $arr_value);            
      return $str_value;      
    }
    //END SQL FUNCTION
}//END CLASS  
  ///////////////////////////DATAFUNCTION