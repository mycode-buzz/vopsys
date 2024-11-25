<?php


class metaData {

    function __construct($obj_parent) {                           
      $this->obj_parent=$obj_parent;                
      $this->bln_debug=false;
    }        
    
    function fn_createRecord($obj_param){        

      $obj_parent=$this->obj_parent;
  
      
      $str_sql="SELECT count(*) FROM `meta_data`.`meta_data` WHERE `MetaDataSystemId`=:MetaDataSystemId AND `MetaDataOwnerId`=:MetaDataOwnerId AND  `DataSchemaName`=:DataSchemaName AND `DataTableName`=:DataTableName AND `DataKeyName`=:DataKeyName AND `DataKeyValue`=:DataKeyValue";        
      $int_count=$this->obj_parent->fn_fetchCount($str_sql, [
        'MetaDataSystemId'=>$obj_param->MetaDataSystemId,
        'MetaDataOwnerId'=>$obj_param->MetaDataOwnerId,        
        'DataSchemaName'=>$obj_param->DataSchemaName,
        'DataTableName'=>$obj_param->DataTableName,
        'DataKeyName'=>$obj_param->DataKeyName,    
        'DataKeyValue'=>$obj_param->DataKeyValue,
      ]);         
      
      
      if($int_count>0){        
        return 100;//already exist
      }    
      
      return $this->fn_insertRecord([              
        'MetaDataSystemId'=>$obj_param->MetaDataSystemId, 
        'MetaDataOwnerId'=>$obj_param->MetaDataOwnerId, 
        'DataSchemaName'=>$obj_param->DataSchemaName, 
        'DataTableName'=>$obj_param->DataTableName, 
        'DataKeyName'=>$obj_param->DataKeyName, 
        'DataKeyValue'=>$obj_param->DataKeyValue,         
        'MetaPermissionTag'=>$obj_param->MetaPermissionTag,                   
        'ModifiedDate'=>$obj_parent->obj_userLogin->ModifiedDate, 
        'ModifiedBy'=>$obj_parent->obj_userLogin->ModifiedBy, 
        'CreatedDate'=>$obj_parent->obj_userLogin->CreatedDate, 
        'CreatedBy'=>$obj_parent->obj_userLogin->CreatedBy
      ]);
    }

    function fn_updateRecord($obj_param){     

        $obj_parent=$this->obj_parent;

        if(empty($obj_param->ArchiveDate)){
          $obj_param->ArchiveDate=NULL;
        }

        
        $arr_param['ModifiedDate']=$obj_param->ModifiedDate; 
        $arr_param['ModifiedBy']=$obj_param->ModifiedBy;
        $arr_param['ArchiveDate']=$obj_param->ArchiveDate;

        $arr_param['DataSchemaName']=$obj_param->DataSchemaName;
        $arr_param['DataTableName']=$obj_param->DataTableName;
        $arr_param['DataKeyName']=$obj_param->DataKeyName;
        $arr_param['DataKeyValue']=$obj_param->DataKeyValue;

        $str_sql="
        UPDATE `meta_data`.`meta_data` SET
        `meta_data`.`ModifiedDate`=:ModifiedDate,
        `meta_data`.`ModifiedBy`=:ModifiedBy,
        `meta_data`.`ArchiveDate`=:ArchiveDate
        WHERE TRUE
        AND `DataSchemaName`=:DataSchemaName
        AND `DataTableName`=:DataTableName
        AND `DataKeyName`=:DataKeyName  
        AND `DataKeyValue`=:DataKeyValue
        ;";

        
        $obj_parent->fn_executeSQLStatement($str_sql, $arr_param);        
        return;
    }

    function fn_deleteRecord($arr_param){                                

        $obj_parent=$this->obj_parent;  
        
        $str_sql="DELETE FROM  `meta_data`.`meta_data` WHERE TRUE    
        AND `DataSchemaName`=:DataSchemaName
        AND `DataTableName`=:DataTableName
        AND `DataKeyName`=:DataKeyName  
        AND `DataKeyValue`=:DataKeyValue
        ";        
        $stmt=$obj_parent->fn_executeSQLStatement($str_sql, [    
          'DataSchemaName'=> $arr_param['DataSchemaName'],
          'DataTableName'=> $arr_param['DataTableName'],
          'DataKeyName'=> $arr_param['DataKeyName'],  
          'DataKeyValue'=> $arr_param['DataKeyValue'],  
        ]); 
      }

      function fn_insertRecord($arr_param){       

        $obj_parent=$this->obj_parent;

        $arr_param['ModifiedDate']=$obj_parent->obj_userLogin->ModifiedDate; 
        $arr_param['ModifiedBy']=$obj_parent->obj_userLogin->ModifiedBy;
        $arr_param['CreatedDate']=$obj_parent->obj_userLogin->CreatedDate;        
        $arr_param['CreatedBy']=$obj_parent->obj_userLogin->CreatedBy;                
  
        /*
        $arr_param['ModifiedDate']=$obj_parent->str_runtime; 
        $arr_param['ModifiedBy']=100;
        $arr_param['CreatedDate']=$obj_parent->str_runtime;        
        $arr_param['CreatedBy']=100; 
        //*/

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
            `meta_data`.`CreatedDate`,
            `meta_data`.`CreatedBy`,
            `meta_data`.`ModifiedBy`
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
            :CreatedDate,
            :CreatedBy,
            :ModifiedBy
        )
        ;";                       
      
        $obj_parent->fn_executeSQLStatement($str_sql, $arr_param);
        $intIdRecord=$obj_parent->fn_getLastInsertId();
        return $intIdRecord;
      }


  }//END OF CLASS
 
