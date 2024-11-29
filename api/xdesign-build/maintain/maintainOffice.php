<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainOffice extends maintainXDezign{

    function fn_maintainOffice(){                    
        
        

        $this->fn_maintainColumnzOffice();      
        $this->fn_maintainRowzOffice();                           
        
        
    }    

    function fn_maintainColumnzOffice(){                

        $MetaUserSystemId=$this->obj_userBase->MetaUserSystemId;
        
        //Start Default Values
        //User
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `DefaultValue`='User'
        WHERE TRUE  
        AND `MetaViewId`=101433 
        AND `MetaColumnSystemId`=$MetaUserSystemId
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_mover'                  
        AND `MetaColumnName`='MetaMoverType'                          
        ;";              
        $this->fn_executeSQLStatement($str_sql);        

        //Login
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `DefaultValue`='Login'
        WHERE TRUE 
        AND `MetaViewId`=101434
        AND `MetaColumnSystemId`=$MetaUserSystemId
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_mover'                  
        AND `MetaColumnName`='MetaMoverType'                          
        ;";              
        $this->fn_executeSQLStatement($str_sql);
        //End Default Values

        //Start Mover
        //Start MenuPin
        //Shared
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `MenuPin`=0
        WHERE TRUE                  
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_mover'                          
        ;";              
        $this->fn_executeSQLStatement($str_sql);        

        //User
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `MenuPin`=1
        WHERE TRUE                  
        AND `MetaViewId`=101433
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_mover'                          
        AND `MetaColumnName` IN('MetaMoverEmail')
        ;";              
        $this->fn_executeSQLStatement($str_sql);        

        //Login
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `MenuPin`=1
        WHERE TRUE                  
        AND `MetaViewId`=101434
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_mover'                          
        AND `MetaColumnName` IN('MetaMoverSystemName')
        ;";              
        $this->fn_executeSQLStatement($str_sql);        
        //End MenuPin

        //Start HiddenPin
        //Shared
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `HiddenPin`=0
        WHERE TRUE                          
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_mover'                          
        AND `MetaColumnName` IN('MetaMoverSystemName')
        ;";              
        $this->fn_executeSQLStatement($str_sql);        

        //Login
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `HiddenPin`=1
        WHERE TRUE                          
        AND `MetaSchemaName`='meta_user'
        AND `MetaTableName`='meta_mover'                          
        AND `MetaColumnName` IN('MetaMoverStatus')
        ;";              
        $this->fn_executeSQLStatement($str_sql);        

        //End HiddenPin
        //End Mover

        //Start System
        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `MenuPin`=0
        WHERE TRUE                  
        AND `MetaSchemaName`='meta_user'
        AND `MetaTableName`='meta_system'
        ;";              
        $this->fn_executeSQLStatement($str_sql);        

        $str_sql="UPDATE `meta_column`.`meta_column` SET 
        `MenuPin`=1
        WHERE TRUE          
        
        AND `MetaSchemaName`='meta_user'            
        AND `MetaTableName`='meta_system'                          
        AND `MetaColumnName` IN('MetaSystemName')
        ;";              
        $this->fn_executeSQLStatement($str_sql);        
        //End System
    }
    function fn_maintainRowzOffice(){        
    }
}