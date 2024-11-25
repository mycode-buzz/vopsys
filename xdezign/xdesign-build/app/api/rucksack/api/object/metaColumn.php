<?php

///////////////////////////DATAMANAGER
class metaColumn{
    function __construct($obj_parent=false) {                            
        
        $this->MetaColumnId="0";
        $this->MetaSchemaName="";
        $this->MetaTableName="";
        $this->MetaColumnName="true";
        $this->MetaColumnAPIName="";                
        $this->MetaType="";
        $this->MetaLabel="";
        $this->DebugPin=0;        
        $this->FormOrder=0;
        $this->MetaList="";        
        $this->MetaOption="";                
        $this->PublishPin=0;
        $this->LivePin=0;
        $this->MenuPin=0;
        $this->SearchPin="";        
        $this->Decimal=0;        
        $this->UnSigned=0;        
        $this->MaxLength=0;        
        $this->RequiredPin=0;                
        $this->DateTime=0;        
        $this->DateTimeSecond=0;        
        $this->CreatedDate="";
        $this->ModifiedDate="";     
        $this->IsMetaData=false;    

        $this->obj_parent=$obj_parent;                
        $this->bln_debug=false;
    }
    function fn_initialize(){         

        $str_bracketField="`";                 
        $this->str_nameQualified=$str_bracketField.$this->MetaColumnName.$str_bracketField;
        if(!empty($this->MetaTableName)){
            $this->str_nameQualified="`".$this->MetaTableName."`.".$this->str_nameQualified;
        }
        if(!empty($this->MetaSchemaName)){
            $this->str_nameQualified="`".$this->MetaSchemaName."`.".$this->str_nameQualified;
        }        
    }

    function fn_getNameIdentifier($bln_getFQSN){
      if($bln_getFQSN){
        return "`".$this->MetaSchemaName."`.`".$this->MetaTableName."`.`".$this->MetaColumnAPIName."`";
      }
      else{        
        return "`".$this->MetaViewId."`.`".$this->MetaColumnAPIName."`";
      }
    }
    //*/
    
    function fn_createRecord($obj_param){              
    

        $obj_parent=$this->obj_parent;
    
        //generic create Record function
        $str_sql="SELECT `MetaColumnId` FROM `meta_column`.`meta_column` WHERE TRUE 
        AND `MetaColumnSystemId`=:MetaColumnSystemId 
        AND `MetaSchemaName`=:MetaSchemaName 
        AND `MetaTableName`=:MetaTableName 
        AND `MetaColumnName`=:MetaColumnName         
        ;";        
        $MetaColumnId=$obj_parent->fn_fetchColumn($str_sql, [    
          'MetaColumnSystemId'=>$obj_param->MetaColumnSystemId,        
          'MetaSchemaName'=>$obj_param->MetaSchemaName,        
          'MetaTableName'=>$obj_param->MetaTableName,            
          'MetaColumnName'=>$obj_param->MetaColumnName,                                  
        ]);                 
        
        if(!empty($MetaColumnId)){        
          return $MetaColumnId;//already exist
        }            
        
        return $int_idRecord=$this->fn_insertRecord([                
          'MetaColumnSystemId'=>$obj_param->MetaColumnSystemId,           
          'MetaSchemaName'=>$obj_param->MetaSchemaName,  
          'MetaTableName'=>$obj_param->MetaTableName,       
          'MetaColumnName'=>$obj_param->MetaColumnName, 
          'MetaColumnAPIName'=>$obj_param->MetaColumnAPIName,           
          'MetaType'=>$obj_param->MetaType,   
          'MetaLabel'=>$obj_param->MetaLabel,
          'DebugPin'=>$obj_param->DebugPin, 
          'FormOrder'=>$obj_param->FormOrder,
          'MetaList'=>$obj_param->MetaList,
          'MetaOption'=>$obj_param->MetaOption,          
          'MetaSQL'=>$obj_param->MetaSQL,
          'MenuPin'=>$obj_param->MenuPin,    
          'MetaPermissionTag'=>$obj_param->MetaPermissionTag,                    
          'InfoPin'=>$obj_param->InfoPin,    
          'LivePin'=>$obj_param->LivePin,    
          'PublishPin'=>$obj_param->PublishPin,
          'SearchPin'=>$obj_param->SearchPin,       
          'HiddenPin'=>$obj_param->HiddenPin,       
          'LockedPin'=>$obj_param->LockedPin,
          'Decimal'=>$obj_param->Decimal,
          'UnSigned'=>$obj_param->UnSigned,          
          'MaxLength'=>$obj_param->MaxLength,                    
          'RequiredPin'=>$obj_param->RequiredPin,                    
          'DateTime'=>$obj_param->DateTime,          
          'DateTimeSecond'=>$obj_param->DateTimeSecond,          
          'PrimaryPin'=>$obj_param->PrimaryPin,
          'PlaceHolder'=>$obj_param->PlaceHolder,
          'DefaultValue'=>$obj_param->DefaultValue,
          'MetaColumnGroup'=>$obj_param->MetaColumnGroup,
          'Subdomain'=>$obj_param->Subdomain
        ]);          
        
      }
    
        function fn_insertRecord($arr_param){                                
          
    
          $obj_parent=$this->obj_parent;      

          
    
          $str_sql="
          INSERT INTO `meta_column`.`meta_column`
            (               
            `meta_column`.`MetaColumnSystemId`,    
            `meta_column`.`MetaSchemaName`,
            `meta_column`.`MetaTableName`,        
            `meta_column`.`MetaColumnName`,
            `meta_column`.`MetaColumnAPIName`,            
            `meta_column`.`MetaType`,    
            `meta_column`.`MetaLabel`,
            `meta_column`.`DebugPin`,
            `meta_column`.`FormOrder`,            
            `meta_column`.`MetaList`,
            `meta_column`.`MetaOption`,            
            `meta_column`.`MetaSQL`,
            `meta_column`.`MenuPin`,    
            `meta_column`.`MetaPermissionTag`,            
            `meta_column`.`InfoPin`,    
            `meta_column`.`LivePin`,    
            `meta_column`.`PublishPin`,                
            `meta_column`.`SearchPin`,
            `meta_column`.`HiddenPin`,          
            `meta_column`.`LockedPin`,      
            `meta_column`.`Decimal`,      
            `meta_column`.`UnSigned`,      
            `meta_column`.`MaxLength`,                  
            `meta_column`.`RequiredPin`,                  
            `meta_column`.`DateTime`,                  
            `meta_column`.`DateTimeSecond`,                  
            `meta_column`.`PrimaryPin`,        
            `meta_column`.`PlaceHolder`,    
            `meta_column`.`DefaultValue`,
            `meta_column`.`MetaColumnGroup`,    
            `meta_column`.`Subdomain`        
            )
            VALUES
            (            
            :MetaColumnSystemId,    
            :MetaSchemaName,  
            :MetaTableName,        
            :MetaColumnName,
            :MetaColumnAPIName,            
            :MetaType,            
            :MetaLabel,
            :DebugPin,            
            :FormOrder,            
            :MetaList,
            :MetaOption,            
            :MetaSQL,        
            :MenuPin,    
            :MetaPermissionTag,    
            :InfoPin,    
            :LivePin,
            :PublishPin,            
            :SearchPin,    
            :HiddenPin,              
            :LockedPin,     
            :Decimal,
            :UnSigned,
            :MaxLength,            
            :RequiredPin,            
            :DateTime,            
            :DateTimeSecond,            
            :PrimaryPin,        
            :PlaceHolder,        
            :DefaultValue,
            :MetaColumnGroup, 
            :Subdomain       
            )
          ;";               
          
          
          
          $stmt=$obj_parent->fn_executeSQLStatement($str_sql, $arr_param);            
          return $obj_parent->fn_getLastInsertId();                            
      }
     
      
      
}//END OF CLASS  



?>