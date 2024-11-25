<?php

class metaSystem {
    function __construct($obj_parent) {             
        $this->obj_parent=$obj_parent;                
    }          

    function fn_initialize($arr_row){              

      $obj_param=new stdClass;

      $obj_param->MetaSystemId=$arr_row["MetaSystemId"];                      
      $obj_param->MetaSystemUserId=$arr_row["MetaSystemUserId"];              
      $obj_param->MetaSystemName=$arr_row["MetaSystemName"];                  
      $obj_param->MetaSystemEmail=$arr_row["MetaSystemEmail"];                    
      $obj_param->MetaSystemStatus=$arr_row["MetaSystemStatus"];          
      $obj_param->CurrencySymbol=$arr_row["CurrencySymbol"];          
      $obj_param->Credit=$arr_row["Credit"];                  
      $obj_param->CreditExpiryDate=$arr_row["CreditExpiryDate"];      
      $obj_param->CreditName=$arr_row["CreditName"];      
      $obj_param->FiscalYearEnd=$arr_row["FiscalYearEnd"];      
      $obj_param->MetaSystemGroup=$arr_row["MetaSystemGroup"];      
      $obj_param->ProtectedPin=$arr_row["ProtectedPin"];                 
      $this->obj_param=$obj_param;
      
      $date_creditExpiryDate=$this->obj_parent->fn_getDateFromString($obj_param->CreditExpiryDate);      
      
      if (!empty($obj_param->Credit)) {//subscirption has epxired

        //$this->obj_parent->fn_varDump($this->obj_parent->date_runtime, "this->obj_parent->str_runtime");
        //$this->obj_parent->fn_varDump($date_creditExpiryDate, "date_creditExpiryDate");

        $date1=$this->obj_parent->date_runtime;
        $date2=$date_creditExpiryDate;

         

        //$comparison = $date1 > $date2;        
        //$this->obj_parent->fn_varDump($comparison, "comparison");

        
        if ($this->obj_parent->date_runtime > $date_creditExpiryDate) {//subscirption has epxired
          //$this->obj_parent->fn_varDump("fn_onZeroCredit", "fn_onZeroCredit");
          $this->obj_parent->fn_onZeroCredit();          
        }
      }
    }

   

    function fn_calculateFutureDate($str_modify) {
      // Get the current date
      $currentDate = new DateTime();
      
      // Modify the date to the first day of the current month
      $currentDate->modify('first day of this month');
      
      // Add two months to the date
      $currentDate->modify($str_modify);
      
      // Return the formatted date
      return $currentDate->format('Y-m-d');
    }     

    function fn_createRecord($MetaSystemUserId, $MetaSystemEmail){                    

      
        
        if($this->obj_parent->DebugServer){            
          $this->obj_parent->fn_addEcho("MetaSystemUserId: ".$MetaSystemUserId);  
          $this->obj_parent->fn_addEcho("MetaSystemEmail: ".$MetaSystemEmail);                  
        }
      
        //create if not exist an existing own mover record
        $str_sql="SELECT `MetaSystemId` FROM `meta_user`.`meta_system` WHERE TRUE
          AND `MetaSystemUserId`=:MetaSystemUserId
          AND `MetaSystemEmail`=:MetaSystemEmail 
        ;";                
        
        $MetaSystemId=$this->obj_parent->fn_fetchColumn($str_sql, [
          'MetaSystemUserId'=>$MetaSystemUserId,
          'MetaSystemEmail'=>$MetaSystemEmail,
        ]);        
        
        //$this->obj_parent->fn_addEcho("Existing MetaSystemId: ".$MetaSystemId);          
        
        $obj_userLogin=$this->obj_parent->obj_userLogin;
        
        if(empty($MetaSystemId)){
          if($this->obj_parent->DebugServer){
            $this->obj_parent->fn_addEcho("System fn_createRecord MetaSystemId is empty: ".$MetaSystemId);  
          }
          
          $Credit=5000;
          $CreditName="CALENDAR MONTH";          
          $CreditExpiryDate=$this->fn_calculateFutureDate("+2 months");          
          $MetaSystemName="[".$MetaSystemEmail."]";
          $MetaSystemStatus="Enabled";
          $CurrencySymbol="EUR";
          
          $arr_param=[            
            'MetaSystemUserId'=>$MetaSystemUserId, 
            'Credit'=>$Credit, 
            'CreditExpiryDate'=>$CreditExpiryDate, 
            'CreditName'=>$CreditName, 
            'FiscalYearEnd'=>11, 
            'MetaSystemName'=>$MetaSystemName,     
            'MetaSystemEmail'=>$MetaSystemEmail,         
            'MetaSystemStatus'=>$MetaSystemStatus,
            'CurrencySymbol'=>$CurrencySymbol                                   
          ];
          
          $this->fn_insertRecord($arr_param);                    
          $MetaSystemId=$this->obj_parent->fn_getLastInsertId();              
          //$this->obj_parent->fn_addEcho("New MetaSystemId: ".$MetaSystemId);          
          //add an own data record              

          
          $obj_metaData=new metaData($this->obj_parent);
          //$obj_metaData->bln_debug=true;          
          
          $obj_paramMetaData=new stdClass;          
          $obj_paramMetaData->MetaDataSystemId=$MetaSystemId;
          $obj_paramMetaData->MetaDataOwnerId=$MetaSystemUserId;          
          $obj_paramMetaData->DataSchemaName="meta_user";
          $obj_paramMetaData->DataTableName="meta_system";
          $obj_paramMetaData->DataKeyName="MetaSystemId";        
          $obj_paramMetaData->DataKeyValue=$MetaSystemId;                                                            
          $obj_paramMetaData->MetaPermissionTag="";                
          $obj_metaData->fn_createRecord($obj_paramMetaData);            

          $obj_userLogin->MetaHomeSystemId=$MetaSystemId;//important to get this updated correctly , on new record
          $obj_userLogin->MetaUserSystemId=$MetaSystemId;//important to get this updated correctly , on new record
        
          return true;
        }
        else{
          //system record already present
          if($this->obj_parent->DebugServer){            
            $this->obj_parent->fn_addEcho("System fn_createRecord MetaSystemId is not empty: ".$MetaSystemId);  
          }

          $obj_userLogin->MetaHomeSystemId=$MetaSystemId;//important to get this updated correctly , on new record
          $obj_userLogin->MetaUserSystemId=$MetaSystemId;//important to get this updated correctly , on new record
          
          return false;
            
        }                   
      } 
      function fn_insertRecord($arr_param){                                  
  
        $str_sql="
        INSERT INTO `meta_user`.`meta_system`
        (          
          MetaSystemUserId, 
          Credit, 
          CreditExpiryDate,
          CreditName,
          FiscalYearEnd,          
          MetaSystemName,           
          MetaSystemEmail,           
          MetaSystemStatus,          
          CurrencySymbol
        )
        VALUES
        (
          :MetaSystemUserId, 
          :Credit,
          :CreditExpiryDate,
          :CreditName,
          :FiscalYearEnd,
          :MetaSystemName,            
          :MetaSystemEmail,
          :MetaSystemStatus,
          :CurrencySymbol
        )
        ;";       
        
        //$this->fn_addConsole("INSERT meta_system sql: ".$str_sql);                            
        $stmt=$this->obj_parent->fn_executeSQLStatement($str_sql, $arr_param);
      } 
}