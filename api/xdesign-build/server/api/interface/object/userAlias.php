<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE
///////////////////////////DATAMANAGER
class userAlias{
    function __construct($obj_user) {

        if(empty($obj_user->MetaSystemOwner)){
            $obj_user->MetaSystemOwner=false;
        }        

        if(empty($obj_user->MetaPermissionTag)){
            $obj_user->MetaPermissionTag="";
        }        

        $this->MetaUserId=$obj_user->MetaUserId;
        $this->MetaUserSystemId=$obj_user->MetaUserSystemId;                            
        $this->MetaSystemOwner=$obj_user->MetaSystemOwner;        
        $this->MetaPermissionTag=$obj_user->MetaPermissionTag;
        $this->MetaUserEmail=$obj_user->MetaUserEmail;                        
        $this->MetaUserEmail=$obj_user->MetaUserEmail;                        
        if(!empty($obj_user->obj_metaSystem)){
            $this->MetaSystem=$obj_user->obj_metaSystem;                        
        }
        

        

        
    }
}//END OF CLASS  
?>