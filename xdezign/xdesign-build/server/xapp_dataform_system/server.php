<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

class page extends server_interface{
  function __construct() {          
    parent::__construct();      

    //used by crud
  } 
  function fn_initialize() {            
    parent::fn_initialize();       
    
    //initalization code needs to remain here rather than in the consturctor, due to object hierachy functions
    //$this->fn_varDump($this->obj_post, "obj_post");

                               

    //$this->fn_addEcho("this->obj_userLogin->MetaUserSystemId: ".$this->obj_userLogin->MetaUserSystemId);  

    $this->bln_debugAction=false;
}      

function fn_runPushColumn() {          
  parent::fn_runPushColumn();              

  //$this->fn_varDump($this->obj_post);

  $MetaColumnName=$this->obj_post->MetaColumnName;    
  $MetaMoverSystemName=$this->obj_post->MetaColumnValue;
  $MetaMoverSystemId=$this->obj_post->MetaDataSystemId;
  
  if($MetaColumnName==="MetaSystemName"){//already updated in runstatement above    
      
      $str_sql="UPDATE `meta_user`.`meta_mover` SET 
        `MetaMoverSystemName`=:MetaMoverSystemName
        WHERE TRUE                          
        AND `MetaMoverSystemId`=:MetaMoverSystemId
        ;";              
        $this->fn_executeSQLStatement($str_sql, [
          "MetaMoverSystemName"=>$MetaMoverSystemName,
          "MetaMoverSystemId"=>$MetaMoverSystemId
        ]);        
  }   
}
function fn_executePage() {          
  

  parent::fn_executePage();                             
  
  //$this->fn_addEcho("this->obj_post->ActionCode: ".$this->obj_post->ActionCode);  
  
  

  switch($this->obj_post->ActionCode){    
    case "200":            
      $this->fn_runHome();                
      break;      
    default:           
  }
}

function fn_checkDefaultEntry(){  

  $str_sql="
        SELECT count(*) FROM `meta_user`.`meta_system` join `meta_data`.`meta_data` ON 
        `meta_user`.`meta_system`.`MetaSystemId`=`meta_data`.`meta_data`.`DataKeyValue`
        WHERE
        (
          `meta_data`.`MetaDataSystemId`=:MetaUserSystemId AND        
          `meta_data`.`DataSchemaName`='meta_user' AND
          `meta_data`.`DataTableName`='meta_system' AND
          `meta_data`.`DataKeyName`='MetaSystemId' 
        )
        ;";
      
        //$this->fn_addConsole("CHECK SYSTEM METADATA SQL: ".$str_sql);                        
        $int_count=$this->fn_fetchCount($str_sql, [        
          'MetaUserSystemId'=>$this->obj_userLogin->MetaHomeSystemId,
        ]); 

        if(empty($int_count)){
            
            $obj_param=new stdClass;                  
            $obj_param->MetaDataSystemId=$this->obj_userLogin->MetaUserSystemId;
            $obj_param->MetaDataOwnerId=$this->obj_userLogin->MetaUserId;
            $obj_param->DataSchemaName="meta_user";
            $obj_param->DataTableName="meta_system";
            $obj_param->DataKeyName="MetaSystemId";      
            $obj_param->DataKeyValue=$this->obj_userLogin->MetaHomeSystemId;
            $obj_param->MetaPermissionTag="";            

            $obj_metaData=new metaData($this);
            $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_param);                                          
        }
        
  
}


}//END OF CLASS

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
?>