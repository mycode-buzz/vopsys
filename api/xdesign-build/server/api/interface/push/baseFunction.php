<?php

class baseFunction{    

    function fn_addEcho($str_msg, $foo_val=""){
  
      //$this->fn_addConsole($str_val);      
      if(!empty($foo_val)){
        $str_msg.=": ".$foo_val;
      }
      echo(htmlspecialchars($str_msg)."<BR><BR>");
    }
  
    
    function fn_getSQLDate(){
      return date("Y-m-d H:i:s");
    }
  
    
  
}