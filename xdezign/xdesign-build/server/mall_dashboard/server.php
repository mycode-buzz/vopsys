<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
/////////////////////////HEADER

class page extends interface_datamanager{
  function __construct() {    
    
    parent::__construct();
  }    
  function fn_executePage() {        
    parent::fn_executePage();        

    $this->bln_debugApp=true;

    $obj_post=$this->obj_post;
    switch($obj_post->Action){                       
      case "getMallList":            
        $this->fn_getMallList();
      break;                                                  
      case "subscribeToApp":            
        $this->fn_subscribeToApp();
      break;                                                  
    }   
}

function fn_subscribeToApp(){                    

  $obj_post=$this->obj_post;     
  
  $str_sql="SELECT * FROM `meta_desk`.`meta_desk` 
  WHERE TRUE
  AND `MetaDeskUserId`=:MetaDeskUserId
  AND `MetaMallId`=:MetaMallId;";
  if($this->bln_debugApp){$this->fn_addEcho("SELECT str_sql: ".$str_sql);}                
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    'MetaDeskUserId' => $this->obj_userLogin->MetaUserId,   
    'MetaMallId' => $obj_post->RecordId       
  ]);      
  $arr_row=$stmt->fetch();  
  
  if($arr_row){        
    $ToggleLivePin=0;    
    $LivePin=$arr_row["LivePin"];        
    if(empty($LivePin)){
      $ToggleLivePin=1;
    }    

    
    $str_sql="UPDATE `meta_desk`.`meta_desk` 
    SET `LivePin`=:LivePin 
    WHERE TRUE    
    AND `MetaDeskUserId`=:MetaDeskUserId
    AND `MetaMallId`=:MetaMallId;";    
    if($this->bln_debugApp){$this->fn_addEcho("UPDATE str_sql: ".$str_sql);}                
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'LivePin' => $ToggleLivePin,   
      'MetaDeskUserId' => $this->obj_userLogin->MetaUserId,   
      'MetaMallId' => $obj_post->RecordId
    ]);        
  }
  else{          

    $str_sql="
  INSERT INTO   `meta_desk`.`meta_desk` 
  (
    `MetaDeskUserId`,
    `MetaMallId`,
    `ExpiryDate`,
    `LivePin`,
    `MetaOrder`,    
    `MetaDeskGroup`,
    `ModifiedDate`,
    `ModifiedBy`,
    `CreatedDate`,
    `CreatedBy`
  )
  VALUES
  (
    :MetaDeskUserId,
    :MetaMallId,
    :ExpiryDate,
    :LivePin,
    :MetaOrder,    
    :MetaDeskGroup,
    :ModifiedDate,
    :ModifiedBy,
    :CreatedDate,
    :CreatedBy
  )
  ";                  
  
  if($this->bln_debugApp){$this->fn_addEcho("INSERT str_sql: ".$str_sql);}              
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    'MetaDeskUserId' => $this->obj_userLogin->MetaUserId,   
    'MetaMallId' => $obj_post->RecordId,
    'ExpiryDate' => '3001-01-01 00:00:00',
    'LivePin' => 1,
    'MetaOrder' => 255,
    'MetaDeskGroup' => '',
    'ModifiedDate' => $this->str_runtime,
    'ModifiedBy' => $this->obj_userLogin->MetaUserId,
    'CreatedDate' => $this->str_runtime,
    'CreatedBy' => $this->obj_userLogin->MetaUserId,
  ]);        
    
    
  }          

  
  
}


function fn_getMallList(){                    

  $obj_post=$this->obj_post;     

  $str_sql="SELECT 
  `meta_mall`.`MetaMallId`, `meta_mall`.`Subdomain`, `meta_mall`.`MetaMallTitle` 
  FROM  `meta_mall`.`meta_mall`   
  WHERE 
  `meta_mall`.`LivePin` 
  AND (`meta_mall`.`MetaMallUserId`=:MetaMallUserId OR `meta_mall`.`MetaMallPrivatePin`=0)   
  AND `meta_mall`.`Subdomain` NOT IN ('mall','login','desk')     
  ORDER BY `meta_mall`.`MetaMallTitle` ASC
  ;";                  
  if($this->bln_debugApp){$this->fn_addEcho("str_sql: ".$str_sql);}                
  $stmt=$this->fn_executeSQLStatement($str_sql, [
    'MetaMallUserId' => $this->obj_userLogin->MetaUserId    
  ]);      
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
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER
?>