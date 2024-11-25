<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE


class pushRowz extends childrowz{
    function __construct() {             
        parent::__construct();                        
        
    }          

    function fn_initialize() {                        
        parent::fn_initialize();                                
    }
    
    //START CALL AUTOFORM FUNCTIONS/////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
      
    function fn_addDefaultRowz(){ //USED BY ADD ROWZ BUTTON IN SETTINGS               
            
    
        //$this->fn_addConsole("this->obj_post->MetaRowzId", $this->obj_post->MetaRowzId);       
        //$this->fn_addConsole("this->obj_metaRowz->obj_param->MetaRowzId", $this->obj_metaRowz->obj_param->MetaRowzId);            
        //return;
        
        //$this->fn_addConsole("this->obj_metaView->obj_param", $this->obj_metaView->obj_param);               
        
        $obj_return=$this->fn_addDefaultView();        
        $obj_metaViewNew=$obj_return->obj_metaViewNew;
        $obj_metaViewTemplate=$obj_return->obj_metaViewTemplate;        
        //$obj_paramView=$obj_metaViewNew->obj_param; 

        $str_sql="SELECT MetaRowzId FROM meta_rowz.meta_rowz WHERE TRUE
        AND MetaRowzSystemId=:MetaRowzSystemId
        AND MetaRowzName=:MetaRowzName
        ;";

        $TemplateRowzId=$this->fn_fetchColumn($str_sql, [                
            'MetaRowzSystemId'=>$this->obj_userLogin->MetaUserSystemId,
            'MetaRowzName'=>"mybox_template"
        ]);

        $obj_metaRowzTemplate=new metaRowz($this);


        $obj_metaRowzTemplate->fn_initialize($TemplateRowzId, true);//also get metadata      
        $obj_paramTemplate=$obj_metaRowzTemplate->obj_param;                              
        $obj_paramTemplate->LivePin=1;        
        $obj_paramTemplate->MetaRowzTitle="My Row";                                      
        //$$obj_paramTemplate->Subdomain=$this->obj_metaRowz->obj_param->Subdomain;        
        //$$obj_paramTemplate->ButtonConsole="Record,SimpleSearch";
        //$$obj_paramTemplate->SettingPin=1;
        //$$obj_paramTemplate->MetaRowzPrivatePin=0;         
        $obj_metaRowzNew=$this->fn_copyMetaRowz($obj_metaRowzTemplate, $obj_metaViewNew, $obj_metaViewTemplate);       
        
        $obj_paramRowz=$obj_metaRowzNew->obj_param;        
        $int_idRecordRowz=$obj_paramRowz->MetaRowzId;

        //ADD SETTING        
        if($obj_paramRowz->SettingPin){                                                
            $this->fn_autoSetting($obj_paramRowz, $int_idRecordRowz);
        };         
        //ADD SETTING

    
    }

    function fn_copyMetaRowz($obj_metaRowzTemplate, $obj_metaViewNew, $obj_metaViewTemplate){ //USED BY UI TO CLONE A TEMPLATE          
        
        if($this->fn_isObjectEmpty($obj_metaViewNew)){                  
            //$this->fn_addConsole("obj_metaViewNew fn_isObjectEmpty");                

            $MetaViewId=$obj_metaRowzTemplate->obj_param->MetaViewId;//0
            $MetaViewName=$obj_metaRowzTemplate->obj_param->MetaRowzName;
            //very important to ensure unique rowzname (per system) ie not blank - objrowz.createrecord must not not find false duplicates.
        }
        else{
            //*
            //This needs to be here on rowz, not on the view etc
            $obj_paramViewNew=$obj_metaViewNew->obj_param;
            $MetaViewId=$obj_paramViewNew->MetaViewId;                       
            $MetaViewName=$obj_paramViewNew->MetaViewName;
            
            $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
            $MetaUserId=$this->obj_userLogin->MetaUserId;
            $obj_paramViewNew->MetaViewSystemId=$MetaUserSystemId;
            $obj_paramViewNew->MetaViewOwnerId=$MetaUserId;        
            $obj_paramViewNew->MetaColumnSystemId=$MetaUserSystemId;        
            /*
            $this->fn_addConsole("fn_copyMetaRowz", $obj_metaViewNew->obj_param->MetaViewName);
            $this->fn_addConsole("obj_metaViewNew", $obj_metaViewNew->obj_param);
            $this->fn_addConsole("obj_metaViewTemplate", $obj_metaViewTemplate->obj_param);          
            //*/          
            $this->fn_pullTemplateColumnz($obj_metaViewNew, $obj_metaViewTemplate);             
            
            //*/
        }
        
        $obj_paramRowz=$obj_metaRowzTemplate->obj_param;                                      
        $obj_paramRowz->MetaRowzSystemId=$this->obj_userLogin->MetaUserSystemId;
        $obj_paramRowz->MetaRowzUserId=$this->obj_userLogin->MetaUserId;
        $obj_paramRowz->MetaViewId=$MetaViewId;
        
        $obj_paramRowz->MetaRowzName=$MetaViewName;        
        $obj_paramRowz->MetaRowzPublishPin=1;                        
        $obj_paramRowz->TemplateRowzId=$obj_paramRowz->MetaRowzId;        
        $obj_paramRowz->ParentRowzId=$this->obj_metaRowz->obj_param->MetaRowzId;
        $obj_paramRowz->QueryList="";                        
        $obj_paramRowz->QueryListDisabled="";                                          
        $obj_metaRowz=new metaRowz($this);                
        
        $int_idRecordRowz=$obj_metaRowz->fn_createRecord($obj_paramRowz);                    
        return $obj_metaRowz;
    }


    

    function fn_autoSetting($obj_paramRowzParent, $int_idRecordRowz){

        $obj_metaRowz=new metaRowz($this);        
        $obj_metaRowz->fn_initialize($int_idRecordRowz); 
        
        if(!$obj_paramRowzParent->SettingPin){                                                
            return;
        }    
        
        $obj_metaRowz=new metaRowz($this);
        $obj_paramRowz=$obj_metaRowz->fn_getParam();            
    
        $obj_paramRowz->MetaRowzSystemId=$obj_paramRowzParent->MetaRowzSystemId;            
        $obj_paramRowz->MetaRowzUserId=$obj_paramRowzParent->MetaRowzUserId;            
        $obj_paramRowz->MetaViewId=0;            
        $obj_paramRowz->ParentRowzId=$int_idRecordRowz;             
        $obj_paramRowz->MetaRowzName="Settings";            
        $obj_paramRowz->MetaRowzTitle="[Settings]";                                                               
        $obj_paramRowz->ButtonConsole="";
        $obj_paramRowz->SettingPin=0;
        $obj_paramRowz->MetaRowzPrivatePin=0;
        $obj_paramRowz->SettingOperationPin=1;
        $obj_paramRowz->HiddenPin="1";
        $obj_paramRowz->Subdomain=$obj_paramRowzParent->Subdomain;    
        $int_idRecordSettingRowz=$obj_metaRowz->fn_createRecord($obj_paramRowz);
    
        if(!empty($int_idRecordSettingRowz)){
            $obj_paramData=new stdClass;                                  
            $obj_paramData->MetaDataSystemId=$obj_paramRowzParent->MetaRowzSystemId;              
            $obj_paramData->MetaDataOwnerId=$obj_paramRowzParent->MetaRowzUserId;
            $obj_paramData->DataSchemaName="meta_rowz";
            $obj_paramData->DataTableName="meta_rowz";
            $obj_paramData->DataKeyName="MetaRowzId";      
            $obj_paramData->DataKeyValue=$int_idRecordSettingRowz;                                 
            $obj_paramData->MetaPermissionTag="";             
            
            $obj_metaData=new metaData($this);
            $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_paramData);            
        }
    
               
      }
    

          function fn_hideRowz(){        
            $this->obj_metaRowz->fn_hide();                
        }
        function fn_showRowz(){        
            $this->obj_metaRowz->fn_show();                
        }


      
      
      
  
}//END OF CLASS
?>