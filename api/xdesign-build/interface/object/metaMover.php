<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class metaMover{
    function __construct($obj_parent) {                     
      
        $this->obj_parent=$obj_parent;                
        $this->bln_debugMetaData=false;
    }        

    function fn_createMetaData($obj_param){   
      
      
      //$this->obj_parent->obj_userLogin;
      
      $obj_paramMetaData=new stdClass;                  
      $obj_paramMetaData->MetaDataSystemId=$obj_param->MetaDataSystemId;      
      $obj_paramMetaData->MetaDataOwnerId=$obj_param->MetaDataOwnerId;      
      $obj_paramMetaData->DataSchemaName="meta_user";
      $obj_paramMetaData->DataTableName="meta_mover";
      $obj_paramMetaData->DataKeyName="MetaMoverId";      
      $obj_paramMetaData->DataKeyValue=$obj_param->DataKeyValue;                 
      $obj_paramMetaData->MetaPermissionTag="#OWN";            

      $obj_metaData=new metaData($this->obj_parent);
      $obj_metaData->bln_debug=true;
      $obj_metaData->fn_createRecord($obj_paramMetaData);            
    }
    
      function fn_createRecord($obj_param){                    

        $MetaMoverSystemId=$obj_param->MetaMoverSystemId;
        $MetaMoverUserId=$obj_param->MetaMoverUserId;
        $MetaMoverEmail=$obj_param->MetaMoverEmail;
        $MetaPermissionTag=$obj_param->MetaPermissionTag;        
        
        //$this->obj_parent->obj_userLogin;
  
        $MetaMoverType="User";
        $MetaMoverStatus="Enabled"; 

        if($this->obj_parent->DebugServer){
          $this->obj_parent->fn_addEcho("xxx MetaMoverSystemId: ".$MetaMoverSystemId);  
          $this->obj_parent->fn_addEcho("MetaMoverUserId: ".$MetaMoverUserId);          
          $this->obj_parent->fn_addEcho("MetaMoverEmail: ".$MetaMoverEmail);  
        }
        
        //create if not exist an existing own mover record
        $str_sql="SELECT `MetaMoverId` FROM `meta_user`.`meta_mover` WHERE TRUE
          AND `MetaMoverSystemId`=:MetaMoverSystemId 
          AND `MetaMoverUserId`=:MetaMoverUserId          
          AND `MetaMoverType`=:MetaMoverType
          AND `MetaMoverStatus`=:MetaMoverStatus          
        ;";        
        
        $MetaMoverId=$this->obj_parent->fn_fetchColumn($str_sql, [
          'MetaMoverSystemId'=>$MetaMoverSystemId,
          'MetaMoverUserId'=>$MetaMoverUserId,
          'MetaMoverType'=>$MetaMoverType,
          'MetaMoverStatus'=>$MetaMoverStatus,          
        ]);         

        if($this->obj_parent->DebugServer){
          $this->obj_parent->fn_addEcho("Exisitng MetaMoverId: ".$MetaMoverId);  
        }        
        
        if(empty($MetaMoverId)){
          if($this->obj_parent->DebugServer){
            $this->obj_parent->fn_addEcho("Mover fn_createRecord MetaMoverId is empty: ".$MetaMoverId);  
          }

          $MetaMoverSystemName="[".$MetaMoverEmail."]";                  
          $arr_param=[
            'MetaMoverSystemId'=>$MetaMoverSystemId, 
            'MetaMoverUserId'=>$MetaMoverUserId, 
            'MetaMoverSystemName'=>$MetaMoverSystemName, 
            'MetaMoverType'=>$MetaMoverType, 
            'MetaMoverStatus'=>$MetaMoverStatus, 
            'MetaPermissionTag'=>$MetaPermissionTag,             
            'MetaMoverEmail'=>$MetaMoverEmail,                         
          ];
          
          $this->fn_insertRecord($arr_param);                    

          $MetaMoverId=$this->obj_parent->fn_getLastInsertId();              
          //add an own data record    
          
          $obj_paramPass=new stdClass;
          $obj_paramPass->MetaDataSystemId=$MetaMoverSystemId;
          $obj_paramPass->MetaDataOwnerId=$MetaMoverUserId;
          $obj_paramPass->DataKeyValue=$MetaMoverId;            
          $this->fn_createMetaData($obj_paramPass);                    
        }
        else{
          //mover record already present
          if($this->obj_parent->DebugServer){            
            $this->obj_parent->fn_addEcho("Mover fn_createRecord MetaMoverId is not empty: ".$MetaMoverId);  
          }
        }        
        
      }  

      function fn_insertRecord($arr_param){                                
        
        //$this->obj_parent->obj_userLogin;
  
        $str_sql="
        INSERT INTO `meta_user`.`meta_mover`
        (
          MetaMoverSystemId, 
          MetaMoverUserId, 
          MetaMoverSystemName, 
          MetaMoverType, 
          MetaMoverStatus, 
          MetaPermissionTag,           
          MetaMoverEmail      
        )
        VALUES
        (
          :MetaMoverSystemId, 
          :MetaMoverUserId, 
          :MetaMoverSystemName, 
          :MetaMoverType, 
          :MetaMoverStatus,
          :MetaPermissionTag,          
          :MetaMoverEmail
        )
        ;";       
        
        //$this->fn_addConsole("INSERT meta_mover sql: ".$str_sql);                            
        $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, $arr_param);
      }          
      
      function fn_acceptInvite($MetaMoverSystemIdTarget, $bln_debug=false){      
        
    
        $MetaMoverUserId=$this->obj_parent->obj_userLogin->MetaUserId;           
        $MetaMoverEmail=$this->obj_parent->obj_userLogin->MetaUserEmail;       
        $MetaMoverType="User";
        $MetaMoverStatus="Enabled";
      
        //Update User Button in Target User
        $str_sql="UPDATE 
        `meta_user`.`meta_mover`  
        SET 
        `MetaMoverUserId`=:MetaMoverUserId,
        `MetaMoverAutoAccept`=0      
        WHERE TRUE
        AND `MetaMoverUserId`=0 
        AND `MetaMoverSystemId`=:MetaMoverSystemIdTarget 
        AND `MetaMoverType`=:MetaMoverType 
        AND `MetaMoverStatus`=:MetaMoverStatus 
        AND `MetaMoverEmail`=:MetaMoverEmail
        ;";      
        
        $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, [
          'MetaMoverSystemIdTarget'=>$MetaMoverSystemIdTarget,
          'MetaMoverUserId'=>$MetaMoverUserId,
          'MetaMoverType'=>$MetaMoverType,        
          'MetaMoverStatus'=>$MetaMoverStatus,
          'MetaMoverEmail'=>$MetaMoverEmail,    
        ]);                         
      }
       
      
    
      
  
}