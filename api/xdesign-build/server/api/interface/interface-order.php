<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class interface_order extends interface_post{
    function __construct() {                        
        
        parent::__construct();                                        
    }    
    
   
    
    function fn_interfaceFormatSQLOrderBy(){
       

        $str_jsonMetaOrderByView="";
        if(!empty($this->str_jsonMetaOrderByView)){                        
            $str_jsonMetaOrderByView=$this->str_jsonMetaOrderByView;
        }        
        $this->obj_paramAPI->order=$str_jsonMetaOrderByView;
    }

    function fn_interfaceFormatSQLLimit(){  
        
        $int_limit_row_per_page=$this->obj_post->LimitRowPerPage;
        $int_limit_row_start=$this->obj_post->LimitRowStart;

        if($this->obj_post->ModeNewRecord){                     
      
            $int_limit_row_per_page=0;
            $int_limit_row_start=0;            
        }             
        
        $this->obj_paramAPI->limit=$int_limit_row_per_page;
        $this->obj_paramAPI->offset=$int_limit_row_start;

    }
}//END OF CLASS


?>