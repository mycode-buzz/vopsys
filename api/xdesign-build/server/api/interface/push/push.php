<?php

///////////////////////////
require_once dirname(__FILE__)."/include.php";
///////////////////////////


/////////////////////////HEADER

class push extends dataSchedule{

  function __construct() {      
    
    $this->str_messageExecute="";    
    $this->bln_debugExecute=false;
    $this->str_dateScript=$this->fn_getSQLDate();                

    $this->obj_userLogin=new stdClass;
    $this->obj_userLogin->ModifiedDate=$this->str_dateScript;
    $this->obj_userLogin->ModifiedBy=100;
    $this->obj_userLogin->CreatedDate=$this->str_dateScript;
    $this->obj_userLogin->CreatedBy=100;
    
  }     

    function fn_push(){                

      $this->fn_addEcho("DOCUMENT_ROOT:".$_SERVER["DOCUMENT_ROOT"]);
      $this->fn_addEcho("DIR NAME :".dirname($_SERVER["DOCUMENT_ROOT"], 2));
      $this->fn_addEcho("FILE :".dirname(__FILE__));


      $this->fn_connect();             
      
      
      $str_sql="SELECT * FROM `meta_push`.`meta_push` WHERE TRUE
      AND `ScriptStatus`='READY'
      AND (`ScriptDate`<NOW() OR `ScriptDate` IS NULL)
      ORDER BY `ScriptStatus` DESC, `ScriptDate` ASC
      LIMIT 1
      ;";      
      $arr_row=$this->fn_fetchRow($str_sql);      
      if(empty($arr_row)){
        $this->fn_addEcho("No Rowz in the Queue");
        exit;
      }
      //$this->fn_varDump($arr_row);      
      
      $MetaPushId=$arr_row["MetaPushId"];      
      $SystemIdTo=$arr_row["SystemIdTo"];                                                                               
      $SystemIdCurrent=$arr_row["SystemIdCurrent"];                                                                         
      $ScriptName=$arr_row["ScriptName"];                                                                         
      $ScriptValue=$arr_row["ScriptValue"];                                                                         

      $num_system=10;
      
      for($i_count=0;$i_count<$num_system;$i_count++) {                                    
        $SystemIdCurrent=$this->fn_getSystemIdNext($SystemIdCurrent);      
        //$this->fn_addEcho("SystemIdCurrent: ".$SystemIdCurrent);
        if(empty($SystemIdCurrent)){//no more values              
          $this->fn_updateScriptStatus($MetaPushId, "COMPLETE");                    
          break;
        }   

        $this->fn_addEcho("SystemIdTo: ".$SystemIdTo);
        if(empty($SystemIdTo)){
          $this->fn_addEcho("SystemIdTo: ".$SystemIdTo);
          $SystemIdEnd=$this->fn_getSystemIdEnd($SystemIdCurrent);      
          $this->fn_updateSystemIdTo($MetaPushId, $SystemIdEnd);        
        }         
        
        $this->fn_updateSystemIdCurrent($MetaPushId, $SystemIdCurrent);  
      
        $MetaUserSystemId=$SystemIdCurrent;
        $this->fn_addEcho("MetaUserSystemId: ".$MetaUserSystemId);
        $bln_exitLoop=false;
        switch($ScriptName){
          case "PUSH_COLUMNZ":            
            $this->fn_addEcho("PUSH_COLUMNZ");
            $this->fn_pushColumnz($MetaUserSystemId);
          break;        
          case "EVAL_ALL":            
            $this->fn_addEcho("EVAL_ALL");
            $this->fn_evalCode($MetaUserSystemId, $ScriptValue);
          break;        
          case "EVAL_ONCE":            
            $this->fn_addEcho("EVAL_ONCE");
            $this->fn_evalCode(0, $ScriptValue);            
            $bln_exitLoop=true;
          break;        
        }  

        if($bln_exitLoop){
          break;
        }
      }
      $this->fn_addEcho("fn_updateScriptDate");
      $this->fn_updateScriptDate($MetaPushId);
      
      
    }

    

        
}//END OF CLASS



$obj_push=new push;
$obj_push->fn_push();

?>

