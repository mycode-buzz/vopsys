<?php

class metaTopup {
    function __construct($obj_parent) {             
        $this->obj_parent=$obj_parent;                

        $obj_param=new stdClass;
        $obj_param->MetaSystemId="";
        $obj_param->MetaSystemUserId=100;

        $obj_param->MetaTopupId=0;
        $obj_param->ProductDate="";        
        $obj_param->ProductName="";        
        $obj_param->ProductToken=0;        

        $obj_param->PreExpiry="";        
        $obj_param->PreToken=0;                
        $obj_param->PostExpiry="";
        $obj_param->PostToken=0;                
        $obj_param->ProviderName="";

        $obj_param->ProviderCheckoutId="";
        $obj_param->ProviderCurrencyAmount="";
        $obj_param->ProviderCurrencySymbol="";        

        $obj_param->ModifiedDate="";        
        $obj_param->ModifiedBy="";        
        $obj_param->CreatedDate="";        
        $obj_param->CreatedBy="";        

        $this->obj_param=$obj_param;
    }   
    
    function fn_initialize($obj_param){
        $this->obj_param=$obj_param;

        /*MetaTopUp must complete these values
        $obj_param->ProductToken="";//dependent on Product
        $obj_param->PreExpiry="";        
        $obj_param->PreToken="";                        
        //*/
        $this->fn_setProductToken();
        
        $MetaSystemId=$obj_param->MetaSystemId;
        $str_sql="SELECT * FROM `meta_user`.`meta_system` WHERE `MetaSystemId`=:MetaSystemId;";            
        $stmt=$this->obj_parent->obj_rowzData->fn_executeSQLStatement($str_sql, [
            'MetaSystemId' => $MetaSystemId,
        ]);            
        $arr_row=$stmt->fetch();          
        
        $obj_param->MetaSystemUserId=$arr_row["MetaSystemUserId"];        
        $obj_param->PreExpiry=$arr_row["CreditExpiryDate"];        
        $obj_param->PreToken=$arr_row["Credit"];                
        //$obj_param->PostToken=$obj_param->ProductToken+$obj_param->PreToken;        
        $obj_param->PostToken=$obj_param->PostToken+$obj_param->PreToken;        
        $this->obj_parent->fn_varDump($obj_param);
    }

    

    function fn_setProductToken(){
        $obj_param=$this->obj_param;
        switch($obj_param->ProductName){
            case "CALENDAR DAY":
            case "CALENDAR DAY SANDBOX":
                $obj_param->ProductToken=500;
                break;
            case "CALENDAR MONTH":
            case "CALENDAR MONTH SANDBOX":
                $obj_param->ProductToken=5000;
                break;
            case "FISCAL QUARTER":
            case "FISCAL QUARTER SANDBOX":
                $obj_param->ProductToken=60000;
                break;
            case "FISCAL YEAR":
            case "FISCAL YEAR SANDBOX":
                $obj_param->ProductToken=1000000;
                break;                        
        }
    }
    
    function fn_setGoPayStatus($bln_value){
        $this->obj_param->bln_goPayStatus=$bln_value;
    }
    function fn_getGoPayStatus(){
        return $this->obj_param->bln_goPayStatus;
    }
    function fn_setGoPayLabel($bln_value){
        $this->obj_param->bln_goPayLabel=$bln_value;
    }
    function fn_getGoPayLabel(){
        return $this->obj_param->bln_goPayLabel;
    }    
    function fn_setProductName($bln_value){
        $this->obj_param->ProductName=$bln_value;
    }
    function fn_getProductName(){
        return $this->obj_param->ProductName;
    }    
    function fn_getMetaSystemId(){
        return $this->obj_param->MetaSystemId;
    }
    
    function fn_createRecord(){                    

        $obj_param=$this->obj_param;
        
        if($this->obj_parent->bln_debug){
            $this->obj_parent->fn_addEcho("TOPUP fn_createRecord ProviderCheckoutId: ".$obj_param->ProviderCheckoutId);          
        }
      
        //create if not exist an existing own mover record
        $str_sql="SELECT `ProviderCheckoutId` FROM `meta_user`.`meta_topup` WHERE TRUE
          AND `ProviderCheckoutId`=:ProviderCheckoutId
        ;";                
        
        $ProviderCheckoutId=$this->obj_parent->obj_rowzData->fn_fetchColumn($str_sql, [
          'ProviderCheckoutId'=>$obj_param->ProviderCheckoutId,          
        ]);     
        
        if($this->obj_parent->bln_debug){
            $this->obj_parent->fn_addEcho("TOPUP fn_createRecord ProviderCheckoutId: ".$obj_param->ProviderCheckoutId);  
        }

        
        $obj_param->bln_recordExisted=false;

        if(!empty($ProviderCheckoutId)){
            //system record already present
            if($this->obj_parent->bln_debug){
                $this->obj_parent->fn_addEcho("TOPUP fn_createRecord ProviderCheckoutId exists, return");  
            }        
            $obj_param->bln_recordExisted=true;
            return false;
        }
        
        if($this->obj_parent->bln_debug){
            $this->obj_parent->fn_addEcho("TOPUP fn_createRecord ProviderCheckoutId does not exist, create");  
        }                  

        $arr_data=[
            
            'ProductDate'=>$obj_param->ProductDate, 
            'ProductName'=>$obj_param->ProductName,             
            
            'ProductToken'=>$obj_param->ProductToken, 
            'PreExpiry'=>$obj_param->PreExpiry, 
            'PreToken'=>$obj_param->PreToken, 
            'PostExpiry'=>$obj_param->PostExpiry,             
            'PostToken'=>$obj_param->PostToken,             
            'ProviderName'=>$obj_param->ProviderName, 

            'ProviderCheckoutId'=>$obj_param->ProviderCheckoutId,             
            'ProviderCurrencyAmount'=>$obj_param->ProviderCurrencyAmount, 
            'ProviderCurrencySymbol'=>$obj_param->ProviderCurrencySymbol,             
            
            'ModifiedDate'=>$this->obj_parent->str_runtime,            
            'ModifiedBy'=>100,            
            'CreatedDate'=>$this->obj_parent->str_runtime,            
            'CreatedBy'=>100            
        ];

        
        if($this->obj_parent->bln_debug){$this->obj_parent->fn_varDump($arr_data);}                                    
        
        $MetaTopupId=$this->fn_insertRecord($arr_data);          
        
        
        
        //add an own data record              
        
        $obj_param->MetaTopupId=$MetaTopupId;                

        $arr_param=[
            'MetaDataSystemId'=>$obj_param->MetaSystemId, 
            'MetaDataOwnerId'=>$obj_param->MetaSystemUserId, 
            'DataSchemaName'=>"meta_user", 
            'DataTableName'=>"meta_topup",
            'DataKeyName'=>"MetaTopupId",            
            'DataKeyValue'=>$MetaTopupId,            
            'MetaPermissionTag'=>"",            
            'ModifiedDate'=>$this->obj_parent->str_runtime,            
            'ModifiedBy'=>$obj_param->MetaSystemUserId,            
            'CreatedDate'=>$this->obj_parent->str_runtime,            
            'CreatedBy'=>$obj_param->MetaSystemUserId            
            
        ];        
        $obj_param->int_idMetaData=$this->fn_insertMetaDataRecord($arr_param);    

        //'ModifiedBy`'=>"100",            
         //'CreatedBy`'=>"100"
    
        return $MetaTopupId;

      } 

      function fn_insertRecord($arr_param){                                  
  
        $obj_parent=$this->obj_parent;
        $str_sql="
        INSERT INTO `meta_user`.`meta_topup`
        (
            `ProductDate`, 
            `ProductName`,

            `ProductToken`,
            `PreExpiry`,
            `PreToken`,
            `PostExpiry`,            
            `PostToken`,            
            `ProviderName`,

            `ProviderCheckoutId`,
            `ProviderCurrencyAmount`,
            `ProviderCurrencySymbol`,

            `ModifiedDate`,
            `ModifiedBy`,                        
            `CreatedDate`,
            `CreatedBy`
        )
        VALUES
        (
          :ProductDate,
          :ProductName,
          
          :ProductToken,
          :PreExpiry,
          :PreToken,
          :PostExpiry,          
          :PostToken,          
          :ProviderName,
          
          :ProviderCheckoutId,
          :ProviderCurrencyAmount,
          :ProviderCurrencySymbol,

          :ModifiedDate,          
          :ModifiedBy,          
          :CreatedDate,
          :CreatedBy         
          
        )
        ;";   
        
        /*


            
        //*/
        $stmt=$obj_parent->obj_rowzData->fn_executeSQLStatement($str_sql, $arr_param);
        if($this->obj_parent->bln_debug){$this->obj_parent->fn_varDump($str_sql);}                                    
        $intIdRecord=$obj_parent->obj_rowzData->fn_getLastInsertId();
        return $intIdRecord;
      } 
      
      function fn_insertMetaDataRecord($arr_param){       

        $obj_parent=$this->obj_parent;
        
        $str_sql="
        INSERT INTO `meta_data`.`meta_data`
        (   
            `meta_data`.`MetaDataSystemId`,                        
            `meta_data`.`MetaDataOwnerId`,            
            `meta_data`.`DataSchemaName`,
            `meta_data`.`DataTableName`,
            `meta_data`.`DataKeyName`,
            `meta_data`.`DataKeyValue`,        
            `meta_data`.`MetaPermissionTag`,                    
            `meta_data`.`ModifiedDate`,            
            `meta_data`.`ModifiedBy`,
            `meta_data`.`CreatedDate`,
            `meta_data`.`CreatedBy`
            
        )
        VALUES
        (   
            :MetaDataSystemId, 
            :MetaDataOwnerId,
            :DataSchemaName,
            :DataTableName,
            :DataKeyName,
            :DataKeyValue,        
            :MetaPermissionTag,                    
            :ModifiedDate,          
            :ModifiedBy,          
            :CreatedDate,
            :CreatedBy         
        )
        ;";                       
      
        $obj_parent->obj_rowzData->fn_executeSQLStatement($str_sql, $arr_param);
        if($this->obj_parent->bln_debug){$this->obj_parent->fn_varDump($str_sql);}                                    
        $intIdRecord=$obj_parent->obj_rowzData->fn_getLastInsertId();
        return $intIdRecord;
      }
}