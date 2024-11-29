<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainSetup extends maintainForm{
    
    function fn_maintainSetup(){       
        
        //----------------------------
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaPermissionTag`=''
        WHERE TRUE                     
        AND `MetaSchemaName` ='meta_user'
        AND `MetaTableName` ='meta_mover'        
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaPermissionTag`='#INTERFACE'
        WHERE TRUE                     
        AND `MetaSchemaName` ='meta_user'
        AND `MetaTableName` ='meta_mover'
        AND `MetaColumnName` IN('MetaMoverSystemId','MetaMoverType','MetaMoverStatus','MetaMoverAutoAccept','MetaColumnGroup','MetaRowzGroup','MetaViewGroup')
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);
        
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaPermissionTag`='#ADMIN'
        WHERE TRUE             
        AND `MetaSchemaName` ='meta_user'
        AND `MetaTableName` ='meta_mover'
        AND `MetaColumnName` IN('MetaPermissionTag','MetaMoverUserId','MetaMoverSystemName')
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MenuPin`=0
        WHERE TRUE             
        AND `MetaSchemaName` ='meta_user'
        AND `MetaTableName` ='meta_mover'
        AND `MetaColumnName` IN('MetaMoverType','MetaMoverStatus','MetaMoverSystemName','MetaColumnGroup','MetaRowzGroup','MetaViewGroup')
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        
        $arr_row=Array("MetaMoverTitle","MetaMoverFirst","MetaMoverLast","MetaMoverEmail","MetaMoverSystemName","MetaPermissionTag","MetaPermissionStamp");
        for($i_row=0;$i_row<count($arr_row);$i_row++) {                                                                                              
            
            $str_columnName=$arr_row[$i_row];            
            $int_formOrder=$i_row+200;
            $str_sql="UPDATE `meta_column`.`meta_column` SET
            `FormOrder`=$int_formOrder
            WHERE TRUE             
            AND `MetaSchemaName` ='meta_user'
            AND `MetaTableName` ='meta_mover'
            AND `MetaColumnName` = '$str_columnName'
            ;";                    
            $stmt=$this->fn_executeSQLStatement($str_sql);
        }
        
        //Global Overides
        
        //META COLUMN
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaPermissionTag`='#ADMIN', `FormOrder`=0
        WHERE TRUE                             
        AND `metaschemaname`='meta_column'
        AND `metatablename`='meta_column'
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        //META COLUMN
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaPermissionTag`='#ADMIN', `FormOrder`=0
        WHERE TRUE                             
        AND `metaschemaname`='meta_rowz'
        AND `metatablename`='meta_rowz'
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `LockedPin`=1, `HiddenPin`=0, MetaPermissionTag='#ADMIN'
        WHERE TRUE             
        AND `MetaColumnName` = 'MetaColumnAPIName'
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaColumnType`='RecordId'
        WHERE TRUE             
        AND `MetaColumnName` LIKE '%Id'      
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `LockedPin`=1, `HiddenPin`=0, MetaPermissionTag='#INTERFACE', SectionTitle=''
        WHERE TRUE             
        AND `MetaColumnType`='RecordId'      
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);        
        
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        MetaPermissionTag='#INTERFACE'
        WHERE TRUE             
        AND `MetaColumnName` IN(
        'MetaColumnId',
        'ProtectedPin',
        'MetaSQL',
        'MetaClassType',
        'Subdomain',        
        'InfoPin',
        'PublishPin',
        'PrimaryPin',
        'MetaColumnSystemId',
        'MetaColumnName',
        'MetaColumnGroup',        
        
        'MetaViewIcon',

        'MetaRowzInterfacePin',
        'ArchivePin',
        'MetaUpdatePin',
        'SettingPin',        
        'ProtectedPin',        
        'SettingOperationPin',
        'MetaRowzPrivatePin',
        'MetaRowzGroup'
        )
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        //OVERIDES
        


        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `LockedPin`=1, `HiddenPin`=1,
        `MetaPermissionTag`='#INTERFACE'
        WHERE TRUE                     
        AND `MetaColumnName` IN(
        'MetaSchemaName',
        'MetaTableName'
        )                
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `LockedPin`=1, `HiddenPin`=0,
        `MetaPermissionTag`='#ADMIN'
        WHERE TRUE                     
        AND `MetaColumnName` IN(
        'MetaSchemaName',
        'MetaTableName'
        )                
        AND (`MetaSchemaName`='meta_view' AND `MetaTableName`='meta_view')
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `LockedPin`=1, `HiddenPin`=0, `MetaPermissionTag`='#ADMIN'
        WHERE TRUE                             
        AND `MetaColumnName` IN (
        'CreditName',
        'Credit', 
        'CreditExpiryDate',
        'MetaRowzName'
        )
        ;";
        $stmt=$this->fn_executeSQLStatement($str_sql);              

        
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MenuPin`=1
        WHERE TRUE             
        AND `MetaColumnType` ='note'
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MenuPin`=1
        WHERE TRUE             
        AND `MetaColumnType` ='note'
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);        

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MetaColumnType`='Checkbox'
        WHERE TRUE             
            AND `MetaSchemaName` ='meta_column'
            AND `MetaTableName` ='meta_column'
            AND `MetaColumnName` IN ('RequiredPin')
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `DefaultValue`='#FFFFFF'
        WHERE TRUE             
            AND `MetaSchemaName` ='meta_column'
            AND `MetaTableName` ='meta_column'
            AND `DefaultValue`=''
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `Subdomain`='Xapp'
        WHERE TRUE             
            AND `MetaSchemaName` ='meta_column'
            AND `MetaTableName` ='meta_column'            
        ;";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);      

        $str_sql="UPDATE `meta_column`.`meta_column` SET
        MetaPermissionTag ='#INTERFACE'
        WHERE
        `MetaSchemaName`='meta_user' AND
        `MetaTableName`='meta_system' AND
        `MetaColumnName` in ('CreditName', 'Credit', 'CreditExpiryDate')
        ;";
        $stmt=$this->fn_executeSQLStatement($str_sql);      
        
    }

}