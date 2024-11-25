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

        ///////////////////////////        
        $this->MetaPushViewId=3;        
        $this->MetaPushDynamicViewId=3;        
        /////////////////        
        
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



    
}