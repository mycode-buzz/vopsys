<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

//////////////////////
//Instance Creation goes at bottom the page
$obj_page=new page();
try {  
  $obj_page->fn_execute();    
} catch (Error $e) { // Error is the base class for all internal PHP error exceptions.  
  $s="";    
  $s.="MESSAGE: ".$e->getMessage().PHP_EOL;
  $s.="FILENAME: ".$e->getFile().PHP_EOL;
  $s.="LINE: ".$e->getLine().PHP_EOL;
  $str_message=$s;
  $obj_page->fn_setError($str_message);
  exit;
}
//Instance Creation goes at bottom the page
//////////////////////
?>