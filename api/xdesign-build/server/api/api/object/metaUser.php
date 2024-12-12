<?php 
    class metaUser{
        function __construct() {                               
        }    
        
        function fn_initialize($arr_row, $OPEN_USER_API=false){              

            global $SYSTEM_DEFAULT_DATABASE;            

             //$this->obj_parent->fn_varDump($arr_row, "arr_row", true);                   

            $this->MetaUserId=$arr_row["MetaUserId"];                      
            $this->MetaHomeSystemId=$arr_row["MetaHomeSystemId"];              
            $this->MetaUserSystemId=$arr_row["MetaUserSystemId"];                  
            $this->MetaUserGroupId=$arr_row["MetaUserGroupId"];                    
            $this->MetaUserName=$arr_row["MetaUserName"];    
            $this->MetaUserPassword=$arr_row["MetaUserPassword"];                  
            $this->MetaUserEmail=$arr_row["MetaUserEmail"];      
            $this->MetaUserHost=$arr_row["MetaUserHost"];      
            $this->MetaUserSchemaDefault=$SYSTEM_DEFAULT_DATABASE;     
            $this->MetaPermissionStamp="";     
            $this->MetaPermissionTag="";     
            

            if($OPEN_USER_API){//lock system to home system
                $this->MetaUserSystemId=$this->MetaHomeSystemId;                
            }

            

            $this->MetaSystemOwner=false;      
            if(!empty($this->MetaHomeSystemId) && !empty($this->MetaUserSystemId)){
            if($this->MetaHomeSystemId===$this->MetaUserSystemId){
                $this->MetaSystemOwner=true;
            }



      }            

            $this->int_apiRowsPerPage=10;     
            
        
            $str_runtime=date("Y-m-d H:i:s");              
            

            $this->ModifiedDate=$str_runtime;  
            $this->ModifiedBy=$this->MetaUserId;  
            $this->CreatedDate=$str_runtime;  
            $this->CreatedBy=$this->MetaUserId;    
        }
        function fn_getArrayItem($arr, $str_name){

            if(empty($arr[$str_name])){$arr[$str_name]="";}
            return $arr[$str_name];
          }

    }
?>