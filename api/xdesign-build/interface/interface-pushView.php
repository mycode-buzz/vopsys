<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE


class pushView extends pushColumn{
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

      
      function fn_addDefaultView(){//USED BY ADD ROWZ BUTTON IN SETTINGS                        

        $str_sql="SELECT MetaViewId FROM meta_view.meta_view WHERE TRUE
        AND MetaViewSystemId=:MetaViewSystemId
        AND MetaViewName=:MetaViewName
        ;";

        $TemplateViewId=$this->fn_fetchColumn($str_sql, [                
            'MetaViewSystemId'=>$this->obj_userLogin->MetaUserSystemId,
            'MetaViewName'=>"mybox_template"
        ]);
        //$this->fn_addConsole("TemplateViewId", $TemplateViewId);            
        
        $obj_metaViewTemplate=new metaView($this);
        $obj_metaViewTemplate->fn_initialize($TemplateViewId, true);//also get metadata              
        $obj_metaViewTemplate->obj_param->MetaViewType="";
        $obj_return=$this->fn_copyMetaView($obj_metaViewTemplate);                        
        return $obj_return;

    }
    

      function fn_copyMetaView($obj_metaViewTemplate, $MetaTableName=false, $MetaViewName=false, $MetaViewInterfacePin=false){//USED BY UI TO CLONE A TEMPLATE               
      
        
        $obj_paramTemplate=$obj_metaViewTemplate->obj_param;          
        $TemplateViewId=$obj_paramTemplate->MetaViewId;

        $MetaSchemaName=$obj_metaViewTemplate->fn_getSchemaName($this->obj_userLogin->MetaUserSystemId);

        if(!$MetaTableName){
            $MetaTableName=$obj_metaViewTemplate->fn_getUniquePrefix("mybox_");
        }

        if(!$MetaViewName){
            $MetaViewName=$MetaTableName;            
        }        
  
        if($MetaViewInterfacePin){//ignore interface menu                
          if($this->bln_debugRowz){
            $this->fn_addConsole("end early - InterfacePin");
          }      
            $obj_return = new stdClass;
            $obj_return->obj_metaViewNew=new stdClass;
            $obj_return->obj_metaViewTemplate=$obj_metaViewTemplate;                  
            return $obj_return;
        }      
   
        $obj_paramView = clone $obj_paramTemplate;                  
        $obj_paramView->TemplateViewId=$TemplateViewId;
        $obj_paramView->MetaPermissionTag=$obj_paramTemplate->MetaPermissionTag;
        $obj_paramView->MetaSchemaNameTemplate=$obj_paramTemplate->MetaSchemaName;
        $obj_paramView->MetaTableNameTemplate=$obj_paramTemplate->MetaTableName;                 
        $obj_paramView->MetaSchemaName=$MetaSchemaName;
        $obj_paramView->MetaTableName=$MetaTableName;                
        $obj_paramView->MetaViewName=$MetaViewName;  
        
        if(empty($obj_paramView->MetaViewType)){
          $obj_paramView->MetaViewType=$this->fn_getMetaViewType();
        }
        $obj_paramView->MetaViewSystemId=$this->obj_userLogin->MetaUserSystemId;
        $obj_paramView->MetaViewOwnerId=$this->obj_userLogin->MetaUserId;            
        $obj_paramView->MetaViewParentRowzId=$this->obj_metaRowz->obj_param->MetaRowzId;
        $obj_paramView->bln_checkExist=true;                  
        $obj_metaViewNew=new metaView($this);                                          
        $obj_metaViewNew->fn_createRecord($obj_paramView);                          

        $obj_return = new stdClass;
        $obj_return->obj_metaViewNew=$obj_metaViewNew;
        $obj_return->obj_metaViewTemplate=$obj_metaViewTemplate;  
        return $obj_return;
    }

    function fn_getMetaViewType(){
      
      $MetaViewId=$this->obj_metaRowz->obj_param->MetaViewId;
      $obj_metaViewNew=new metaView($this);                                          
      $obj_metaViewNew->fn_initialize($MetaViewId); 
      $obj_paramView=$obj_metaViewNew->obj_param;                         

      switch(strtolower($obj_paramView->MetaViewType)){
        case "myviewtype":
          return "main";          
          default:          
            return "asset";                    
        
      }
      
    }

  
}//END OF CLASS
?>