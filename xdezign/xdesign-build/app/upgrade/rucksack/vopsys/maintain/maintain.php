<?php

set_time_limit(500);

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

require_once MAINTAINROOT . "/include.php";

class maintain extends maintainBackup{

    
    function fn_maintain(){                      

        $this->bln_debug=false;  
        $this->bln_debugColumn=false;  
        

        //XAPP 
        $this->str_view_meta_view=52;       
        $this->str_view_meta_push=3;
        $this->str_view_PushDynamic=4;
        $this->str_view_meta_column=200;
        $this->str_view_meta_rowz=196;
        $this->str_view_meta_link=100475;        
        //XAPP

        //XDEZIGN
        $this->str_view_Project=110;
        $this->str_view_Tag=115;
        $this->str_view_ProjectTypeDynamic=120;
        $this->str_view_TagTypeDynamic=125;
        //XDEZIGN

        //OFFICE
        $this->str_view_meta_mall=101429;
        $this->str_view_meta_mover=101433;
        $this->str_view_meta_OtherSystem=101434;
        $this->str_view_meta_meta_system=101436;
        //OFFICE
        
        
        //return;//SAFETY AS NOT STABLE CURRENTLY        
        $this->fn_doMaintain();                          
        $this->fn_setMessage("fn_maintain is COMPLETE");        
    }
    
    function fn_doMaintain(){

          //MAINTAIN ORPHAN
          $this->fn_maintainOrphan();                
          //MAINTAIN ORPHAN
        
        $this->fn_doAutoView();

        $this->fn_maintainXDezign();
        $this->fn_maintainSetup();
        
        return;
        //*
      
        //*/
        
        //MAINTAIN BASE
        //*
        $this->fn_maintainPush();                 
        $this->fn_maintainXapp();            
        $this->fn_maintainOffice();                  
        
        $this->fn_maintainMyCRM();        
        //*/
        //MAINTAIN BASE          

        //MAINTAIN SYSTEM
        //*                                      
        $this->fn_checkMetaView();                        
        $this->fn_checkMetaMover();                       
        $this->fn_checkColumnz();                        
        $this->fn_checkMetaRowz();                       
        $this->fn_maintainMetaRowzScope();                    
        //*/
        //MAINTAIN SYSTEM

        //CHECK ALL SYSTEM VIEWS HAVE META DATA
        //*
        $this->fn_checkMetaDataForMetaView();            
        $this->fn_checkMetaDataForMetaRowz();      
        $this->fn_checkMetaDataForMetaColumn();
        $this->fn_checkMetaDataForMetaLink();        
        //*/
        //CHECK ALL SYSTEM VIEWS HAVE META DATA
    }



    function fn_import(){

        $this->fn_import_100();
        //$this->fn_import_290();

        //$this->fn_maintainOrphan();                  

        $this->fn_setMessage("fn_import is COMPLETE");        
    }

    function fn_import_100(){

        $obj_param=new stdClass;                        
        $obj_param->MetaViewSystemId=$this->obj_userLogin->MetaUserSystemId;                    
        $obj_param->MetaColumnSystemId=$this->obj_userLogin->MetaUserSystemId;
        $obj_param->Subdomain="app";                               
        $obj_param->AutoDelete=true;                   
        $obj_param->AutoView=true;           
        $obj_param->MetaViewDataSystemId=100;                           
        $obj_param->MetaViewOwnerId=100;                                                            
        
        
        //*
        $obj_param->MetaSchemaName="vm-crm";                          
        $obj_param->ParentRowzId=1000;                   
        $this->fn_autoSchema($obj_param);                            
        //*/
        
        //*
        $obj_param->MetaSchemaName="northwind";        
        $obj_param->ParentRowzId=1010;                              
        $this->fn_autoSchema($obj_param);    
        
        
        //*/

    }

    function fn_import_290(){

        $obj_param=new stdClass;                                
        $obj_param->MetaViewSystemId=$this->obj_userLogin->MetaUserSystemId;                    
        $obj_param->MetaColumnSystemId=$this->obj_userLogin->MetaUserSystemId;
        $obj_param->Subdomain="app";                               
        $obj_param->MetaViewDataSystemId=1072;                           
        $obj_param->MetaViewOwnerId=290;                                                                    
        $obj_param->AutoDelete=true;                   
        $obj_param->AutoView=false;                            
        
        
        
        //*
        $obj_param->MetaSchemaName="vm-crm";                          
        $obj_param->ParentRowzId=1000;                   
        $this->fn_autoSchema($obj_param);                            
        //*/
        
        /*
        $obj_param->MetaSchemaName="northwind";        
        $obj_param->ParentRowzId=1010;                              
        $this->fn_autoSchema($obj_param);     
        //*/

    }
}