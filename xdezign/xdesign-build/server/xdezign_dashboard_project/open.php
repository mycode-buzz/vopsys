<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

/////////////////////////HEADER
require_once dirname(__DIR__)."/xdezign/package.php";
/////////////////////////HEADER


class page extends package{
  function __construct() {          
    parent::__construct();
  }            
  function fn_executePage() {        
    parent::fn_executePage();          

    $obj_post=$this->obj_post;                           

    switch($obj_post->Action){                             
      case "openProject":                              
          $this->fn_openProject();          
      break;  
      case "openComponentCode":
        $this->fn_openComponentCode();
      break;                                        
      default:          
        $this->fn_setError("APP ACTION Not Handled: [".$obj_post->Action."]");          
      exit;
    }
  }
  
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////

  
  function fn_openProject(){
      

    $obj_post=$this->obj_post;      
    $int_idRecord=$this->obj_post->RecordId;                  

    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_instance` WHERE `id`=:id; ";                  
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'id' => $int_idRecord
    ]);                 
    
    
    $arr_row=$stmt->fetch();
    if($arr_row){
      $this->fn_formatResponse($arr_row);    
      $obj_post->RowData=json_encode($arr_row);            
    }
    else{
      $obj_post->HasError=true;
      $obj_post->ErrorMessage="RecordIdNotExist";
      $this->fn_addEcho("EMPTY ROW");
      return;
    }

    $str_sql="UPDATE `vm-xdesign`.`xdesign_instance` SET LastVersionDate=null WHERE `id`=:id; ";                  
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'id' => $int_idRecord
    ]);                                
    
    $obj_ini=new stdClass();      
    $obj_ini->RecordId=$int_idRecord;            
    $obj_ini->bln_version=false;                
    $this->fn_packageProject($obj_ini);
  }  
  
  function fn_openComponentCode(){      

    $obj_post=$this->obj_post;
    $str_typeRecord=$obj_post->RecordType;      

    if(empty($obj_post->RecordId)){
      //return;
    }            

    $str_sql="SELECT * FROM `vm-xdesign`.`xdesign_component` WHERE `Type`=:Type;";
    //$this->fn_addEcho($str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql, [
      'Type' => $str_typeRecord                 
    ]);                                        
    $arr_row=$stmt->fetch();      
    if($arr_row){
      $this->fn_formatResponseComponentCode($arr_row);
      
    }
    else{
      //$this->fn_addEcho("EMPTY ROW");
    }
  }



  
}
/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
