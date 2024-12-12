<?php

///////////////////////////DATAMANAGER
class meta_connect{ 

    function __construct($User="connectuser123", $Pass="connectpass123", $Host="localhost", $Schema=false) {                    
      $this->User=$User;
      $this->Pass=$Pass;
      $this->Host=$Host;
      if(!empty($Schema)){
        $this->Schema=$Schema;  
      }    
      $this->HasError=false;  
      $this->str_message="No Message";      
    }
    function fn_initialize(){}
  }//END OF CLASS



?>