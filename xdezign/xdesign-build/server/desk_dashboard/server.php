<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

class page extends interface_datamanager{
  function __construct() {    
    
    parent::__construct();
  }    

  function fn_initialize() {          
    
    parent::fn_initialize();    

    $this->str_nameTableRowz="meta_desk";
  }
  function fn_executePage() {        
    parent::fn_executePage();

    $obj_post=$this->obj_post;
    switch($obj_post->Action){                       
      case "getSubscribedList":            
        $this->fn_getSubscribedList();
      break;                                                  
    }   
}


  function fn_getSubscribedList(){                  

    //$this->fn_addEcho("xxx fn_getSubscribedList");              

    $obj_post=$this->obj_post;     

    //$this->fn_createDefaultDesktop();
    $str_nameTableRowz=$this->str_nameTableRowz;
    $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
    $MetaUserId=$this->obj_userLogin->MetaUserId;               
    $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;           
  
    $str_sql="SELECT * FROM 
     `meta_desk`.`meta_desk` 
      JOIN `meta_user`.`meta_user` ON `meta_desk`.`MetaDeskUserId`=`meta_user`.`MetaUserId` 
      JOIN `meta_mall`.`meta_mall` ON `meta_desk`.`MetaMallId`=`meta_mall`.`MetaMallId` 
      WHERE
      (
      `meta_user`.`MetaUserId` IN($MetaBaseUserId) AND `meta_desk`.`MetaDeskPrivatePin`=0
      OR
      `meta_user`.`MetaUserId` IN($MetaUserId) 
      )
      AND
      TRUE
      AND `meta_mall`.`LivePin` 
      AND `meta_desk`.`LivePin`  
      ORDER BY `meta_desk`.`MetaOrder` ASC, `meta_mall`.`MetaMallTitle` ASC 
    ";    
    $stmt=$this->fn_executeSQLStatement($str_sql);
    
    $arr_rows=$stmt->fetchAll();
    if($arr_rows){                 
      $obj_post->RowData=json_encode($arr_rows);
      //$this->fn_addEcho("ROW HAS DATA");
    }
    else{          
      $obj_post->RowData="[{}]";
      //$this->fn_addEcho("ROW HAS ZERO DATA");
    }      
  }

}//END OF CLASS

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
?>