<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/api/include.php";
/////////////////////////AUTHORISE

class page {
  function __construct() {              
  }     

  function fn_execute() {                

    //NOTE the full url is  required
    /*
    api.lokal-mycode.buzz?view_id=101439
    https://curl.se
    //*/
    
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    //$url = htmlspecialchars( $url, ENT_QUOTES, 'UTF-8' );
    
    $str_urlEndpoint=$url;

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    //echo $requestMethod;

    header('Content-Type: application/json');        
    $this->obj_rowzAPI=new rowzAPI();         
    
    switch($requestMethod){
      case("GET"):
        $str_response=$this->obj_rowzAPI->fn_get($str_urlEndpoint);                                                                                    
        break;
      case("POST"):        
        $str_response=$this->obj_rowzAPI->fn_post($str_urlEndpoint);                                                                                
        break;
      case("PATCH"):
        $str_response=$this->obj_rowzAPI->fn_patch($str_urlEndpoint);                                                                        
        break;
      default:          
    }    
    
    echo $str_response;    
  }

}//END OF CLASS

$obj_page=new page();
$obj_page->fn_execute();
?>