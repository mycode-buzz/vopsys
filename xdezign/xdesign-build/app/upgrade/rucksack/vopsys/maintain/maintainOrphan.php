<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainOrphan extends maintainSystem{
  
  
  function fn_maintainOrphan(){        
    
    
    $this->fn_checkOrphanMetaView();                                  
    $this->fn_checkOrphanMetaLink();                
    $this->fn_checkOrphanMetaSystem();        
    $this->fn_checkOrphanMetaMover();        
    $this->fn_checkOrphanMetaColumn();                
    $this->fn_checkOrphanMetaDesk();     
    $this->fn_checkOrphanMetaRowz();     
    $this->fn_checkOrphanMetaData();                  
  }    

  
  
  function fn_checkOrphanMetaView(){

    //DELETE VIEW ENTRIES WHICH REFER TO NONEXIST META USER
    $str_sql="UPDATE `meta_view`.`meta_view` LEFT JOIN `meta_user`.`meta_user` on `meta_view`.`MetaViewOwnerId`=`meta_user`.`MetaUserId` SET `meta_view`.`MetaViewGroup`='crm-delete' WHERE `meta_user`.`MetaUserId` IS NULL;";        
    //$this->fn_addEcho("UPDATE ORPHAN VIEW SQL : ".$str_sql);                                        
    $stmt=$this->fn_executeSQLStatement($str_sql);                                 


    //DELETE META VIEW ENTRIES WHICH REFER TO NONEXIST MYSQL TABLE        
    $str_sql="UPDATE `meta_view`.`meta_view` LEFT JOIN `INFORMATION_SCHEMA`.`TABLES` on (`meta_view`.`metaschemaname`=`TABLES`.`TABLE_SCHEMA` AND `meta_view`.`metatablename`=`TABLES`.`TABLE_NAME`)  SET `meta_view`.`MetaViewGroup`='crm-delete' WHERE `TABLE_NAME` IS NULL;"; 
    ////$this->fn_addEcho("UPDATE ORPHAN SCHEMA SQL : ".$str_sql);
    //$stmt=$this->fn_executeSQLStatement($str_sql);                               
    
    $str_sql="DELETE FROM `meta_view`.`meta_view` WHERE `MetaViewGroup`='crm-delete' AND `meta_view`.`meta_view`.`ProtectedPin`=0;";
    //$this->fn_addEcho("DELETE ORPHAN VIEW SQL : ".$str_sql);                                
    $stmt=$this->fn_executeSQLStatement($str_sql);               

    $this->fn_resetAutoIncrement("`meta_view`.`meta_view`", "`MetaViewId`");

  }  

  function fn_checkOrphanMetaLink(){             
      
    //DELETE META VIEW ENTRIES WHICH REFER TO NONEXIST META VIEW ID        
    $str_sql="UPDATE `meta_link`.`meta_link` LEFT JOIN `meta_view`.`meta_view` on (`meta_link`.`FromViewId`=`meta_view`.`MetaViewId`)  SET `meta_link`.`DeleteDate`=? WHERE `meta_view`.`MetaViewId` IS NULL;"; 
    //$this->fn_addEcho("UPDATE ORPHAN LINK SQL : ".$str_sql);                                        
    $stmt=$this->fn_executeSQLStatement($str_sql, ["1970-01-01 00:00:00"]);                       

    //DELETE META VIEW ENTRIES WHICH REFER TO NONEXIST META VIEW ID        
    $str_sql="UPDATE `meta_link`.`meta_link` LEFT JOIN `meta_view`.`meta_view` on (`meta_link`.`ToViewId`=`meta_view`.`MetaViewId`)  SET `meta_link`.`DeleteDate`=? WHERE `meta_view`.`MetaViewId` IS NULL;"; 
    //$this->fn_addEcho("UPDATE ORPHAN LINK SQL : ".$str_sql);                                        
    $stmt=$this->fn_executeSQLStatement($str_sql, ["1970-01-01 00:00:00"]);                               

    $str_sql="DELETE FROM `meta_link`.`meta_link` WHERE `meta_link`.`DeleteDate`='1970-01-01 00:00:00';";
    //$this->fn_addEcho("DELETE ORPHAN LINK SQL : ".$str_sql);                                
    $stmt=$this->fn_executeSQLStatement($str_sql);               

    $this->fn_resetAutoIncrement("`meta_link`.`meta_link`", "`MetaLinkId`");
}        

  
  
    
    
    function fn_checkOrphanMetaSystem(){
        
        //DELETE DESK ENTRIES WHICH REFER TO NONEXIST META USER
        $str_sql="UPDATE `meta_user`.`meta_system` LEFT JOIN `meta_user`.`meta_user` on `meta_system`.`MetaSystemUserId`=`meta_user`.`MetaUserId` SET `meta_system`.`MetaSystemGroup`='crm-delete' WHERE `meta_user`.`MetaUserId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN SYSTEM SQL : ".$str_sql);                                                
        ////$this->fn_addEcho("UPDATE ORPHAN SYSTEM SQL : ".$str_sql);                                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
    
        //ATTN: THIS DISALLOWS ONE SYSTEM HAVING MULTIPLE HOME SYSTEMS
        //DELETE DESK ENTRIES WHICH REFER TO NONEXIST META USER        
        $str_sql="UPDATE `meta_user`.`meta_system` LEFT JOIN `meta_user`.`meta_user` on `meta_system`.`MetaSystemId`=`meta_user`.`MetaHomeSystemId` SET `meta_system`.`MetaSystemGroup`='crm-delete' WHERE `meta_user`.`MetaHomeSystemId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN SYSTEM SQL : ".$str_sql);                                                
        ////$this->fn_addEcho("UPDATE ORPHAN SYSTEM SQL : ".$str_sql);                                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
        
        $str_sql="DELETE FROM `meta_user`.`meta_system` WHERE `MetaSystemGroup`='crm-delete' AND `meta_system`.`ProtectedPin`=0;";                
        //$this->fn_addEcho("DELETE ORPHAN SYSTEM SQL : ".$str_sql);                                        
        ////$this->fn_addEcho("DELETE ORPHAN SYSTEM SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);               

        $this->fn_resetAutoIncrement("`meta_user`.`meta_system`", "`MetaSystemId`");
    }
    
    function fn_checkOrphanMetaMover(){
        
        //DELETE MOVER ENTRIES WHICH REFER TO NONEXIST META USER
        $str_sql="UPDATE `meta_user`.`meta_mover` LEFT JOIN `meta_user`.`meta_user` on `meta_mover`.`MetaMoverUserId`=`meta_user`.`MetaUserId` SET `meta_mover`.`MetaMoverGroup`='crm-delete' WHERE `meta_user`.`MetaUserId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN MOVER  SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
    
        //DELETE MOVER ENTRIES WHICH REFER TO NONEXIST SYSTEM
        $str_sql="UPDATE `meta_user`.`meta_mover` LEFT JOIN `meta_user`.`meta_system` on `meta_mover`.`MetaMoverSystemId`=`meta_system`.`MetaSystemId` SET `meta_mover`.`MetaMoverGroup`='crm-delete' WHERE `meta_system`.`MetaSystemId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN MOVER  SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);  
                        
        $str_sql="DELETE FROM `meta_user`.`meta_mover` WHERE `MetaMoverGroup`='crm-delete' AND `meta_mover`.`ProtectedPin`=0;";                
        //$this->fn_addEcho("DELETE ORPHAN MOVER SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);  
        
         //DELETE DATA ENTRIES WHICH REFER TO NONEXIST MOVER
         $str_sql="UPDATE `meta_data`.`meta_data` LEFT JOIN `meta_user`.`meta_mover` on `meta_data`.`DataKeyValue`=`meta_mover`.`MetaMoverId` SET `meta_mover`.`MetaMoverGroup`='crm-keep' WHERE DataTableName='meta_mover' AND `meta_mover`.`MetaMoverId` IS NOT NULL;";        
         //$this->fn_addEcho("UPDATE ORPHAN DATA SQL : ".$str_sql);                                        
         $stmt=$this->fn_executeSQLStatement($str_sql);
    
         $str_sql="DELETE FROM `meta_user`.`meta_mover` WHERE `MetaMoverGroup`<>'crm-keep' AND `meta_mover`.`ProtectedPin`=0;";                
        //$this->fn_addEcho("DELETE ORPHAN MOVER SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);          

        $this->fn_resetAutoIncrement("`meta_user`.`meta_mover`", "`MetaMoverId`");
    }

    function fn_checkOrphanMetaColumn(){

      //DELETE META VIEW ENTRIES WHICH REFER TO NONEXIST MYSQL TABLE        
      $str_sql="UPDATE `meta_column`.`meta_column` LEFT JOIN `INFORMATION_SCHEMA`.`COLUMNS` on (`meta_column`.`metaschemaname`=`COLUMNS`.`TABLE_SCHEMA` AND `meta_column`.`metatablename`=`COLUMNS`.`TABLE_NAME` AND `meta_column`.`metacolumnname`=`COLUMNS`.`COLUMN_NAME` )  SET `meta_column`.`MetaColumnGroup`='crm-delete' WHERE `COLUMN_NAME` IS NULL;"; 
      //$this->fn_addEcho("UPDATE ORPHAN COLUMN SQL : ".$str_sql);                                                
      $stmt=$this->fn_executeSQLStatement($str_sql);            
      
      //DELETE FORM ENTRIES WHICH REFER TO NONEXIST SYSTEM
      $str_sql="UPDATE `meta_column`.`meta_column` LEFT JOIN `meta_user`.`meta_system` on `meta_column`.`MetaColumnSystemId`=`meta_system`.`MetaSystemId` SET `meta_column`.`MetaColumnGroup`='crm-delete' WHERE `meta_system`.`MetaSystemId` IS NULL;";        
      //$this->fn_addEcho("UPDATE ORPHAN COLUMN SQL : ".$str_sql);                                                        
      $stmt=$this->fn_executeSQLStatement($str_sql);                         
      
      $str_sql="DELETE FROM `meta_column`.`meta_column` WHERE `MetaColumnGroup`='crm-delete' AND `meta_column`.`ProtectedPin`=0;";                
      //$this->fn_addEcho("DELETE ORPHAN COLUMN SQL : ".$str_sql);                                                        
      $stmt=$this->fn_executeSQLStatement($str_sql);               

      $str_sql="ALTER TABLE `meta_column`.`meta_column` AUTO_INCREMENT=0;";                        
      $stmt=$this->fn_executeSQLStatement($str_sql);  
      
      $this->fn_resetAutoIncrement("`meta_column`.`meta_column`", "`MetaColumnId`");
  }   
    
    
    function fn_checkOrphanMetaDesk(){
        
        //DELETE DESK ENTRIES WHICH REFER TO NONEXIST META USER
        $str_sql="UPDATE `meta_desk`.`meta_desk` LEFT JOIN `meta_user`.`meta_user` on `meta_desk`.`MetaDeskUserId`=`meta_user`.`MetaUserId` SET `meta_desk`.`MetaDeskGroup`='crm-delete' WHERE `meta_user`.`MetaUserId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN DESK SQL : ".$str_sql);                                                
        ////$this->fn_addEcho("UPDATE ORPHAN DESK SQL : ".$str_sql);                                                
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
    
        //DELETE DESK ENTRIES WHICH REFER TO NONEXIST SYSTEM
        $str_sql="UPDATE `meta_desk`.`meta_desk` LEFT JOIN `meta_user`.`meta_system` on `meta_desk`.`MetaDeskSystemId`=`meta_system`.`MetaSystemId` SET `meta_desk`.`MetaDeskGroup`='crm-delete' WHERE `meta_system`.`MetaSystemId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN DESK SQL : ".$str_sql);                                        
        ////$this->fn_addEcho("UPDATE ORPHAN DESK SQL : ".$str_sql);                                                
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
        
        $str_sql="DELETE FROM `meta_desk`.`meta_desk` WHERE `MetaDeskGroup`='crm-delete' AND `meta_desk`.`ProtectedPin`=0;";                
        //$this->fn_addEcho("DELETE ORPHAN DESK SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);               

        $this->fn_resetAutoIncrement("`meta_desk`.`meta_desk`", "`MetaDeskId`");
    }  
    
    
    function fn_checkOrphanMetaRowz(){
        
        //DELETE ROWZ ENTRIES WHICH REFER TO NONEXIST META USER
        $str_sql="UPDATE `meta_rowz`.`meta_rowz` LEFT JOIN `meta_user`.`meta_user` on `meta_rowz`.`MetaRowzUserId`=`meta_user`.`MetaUserId` SET `meta_rowz`.`MetaRowzGroup`='crm-delete' WHERE `meta_user`.`MetaUserId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN ROWZ SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
        
        //DELETE ROWZ ENTRIES WHICH REFER TO NONEXIST SYSTEM
        $str_sql="UPDATE `meta_rowz`.`meta_rowz` LEFT JOIN `meta_user`.`meta_system` on `meta_rowz`.`MetaRowzSystemId`=`meta_system`.`MetaSystemId` SET `meta_rowz`.`MetaRowzGroup`='crm-delete' WHERE `meta_system`.`MetaSystemId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN ROWZ SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
    
        
        //DELETE ROWZ ENTRIES WHICH REFER TO NONEXIST VIEW
        $str_sql="UPDATE `meta_rowz`.`meta_rowz` LEFT JOIN `meta_view`.`meta_view` on `meta_rowz`.`MetaViewId`<>0 AND `meta_rowz`.`MetaViewId`=`meta_view`.`MetaViewId` SET `meta_rowz`.`MetaRowzGroup`='crm-delete' WHERE `meta_view`.`MetaViewId` IS NULL AND `meta_rowz`.`MetaViewId`<>0 ;";        
        //$this->fn_addEcho("UPDATE ORPHAN ROWZ SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
        //*/
        
        $str_sql="DELETE FROM `meta_rowz`.`meta_rowz` WHERE `MetaRowzGroup`='crm-delete' AND `meta_rowz`.`ProtectedPin`=0;";                
        //$this->fn_addEcho("DELETE ORPHAN DATA ROWZ : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);               

        $this->fn_checkOrphanParentRowz();

        $this->fn_resetAutoIncrement("`meta_rowz`.`meta_rowz`", "`MetaRowzId`");
    }

    function fn_checkOrphanParentRowz(){

      //META_ROWZ        
      $str_sql="SELECT * FROM `meta_rowz`.`meta_rowz` WHERE `ParentRowzId`<>0";
      //$this->fn_addConsole("str_sql: ", $str_sql);      

      $arr_rows=$this->fn_fetchRowz($str_sql);
      
      if($arr_rows){
          $int_rowCount=count($arr_rows);                                                
          for($i_row=0;$i_row<$int_rowCount;$i_row++) {                                      
          
              $arr_row=$arr_rows[$i_row];                
              $MetaRowzId=$arr_row["MetaRowzId"];
              $ParentRowzId=$arr_row["ParentRowzId"];
              $obj_metaRowz=new metaRowz($this);
              $obj_metaRowz->fn_initialize($ParentRowzId);              
              if(empty($obj_metaRowz->obj_param)){                
                $obj_metaRowz=new metaRowz($this);                
                $obj_metaRowz->fn_initialize($MetaRowzId);
                //$obj_metaRowz->fn_debug(true);              
                $obj_metaRowz->fn_delete();
              }
              
          }            
      }
      //exit;

    }
    
    
    function fn_checkOrphanMetaData(){

        //DELETE META VIEW ENTRIES WHICH REFER TO NONEXIST MYSQL TABLE        
        $str_sql="UPDATE `meta_data`.`meta_data` LEFT JOIN `INFORMATION_SCHEMA`.`TABLES` on (`meta_data`.`dataschemaname`=`TABLES`.`TABLE_SCHEMA` AND `meta_data`.`datatablename`=`TABLES`.`TABLE_NAME`)  SET `meta_data`.`MetaDataGroup`='crm-delete' WHERE `TABLE_NAME` IS NULL;"; 
        ////$this->fn_addEcho("UPDATE ORPHAN SCHEMA SQL : ".$str_sql);
        $stmt=$this->fn_executeSQLStatement($str_sql);                               
        
        //DELETE DATA ENTRIES WHICH REFER TO NONEXIST META USER
        $str_sql="UPDATE `meta_data`.`meta_data` LEFT JOIN `meta_user`.`meta_user` on `meta_data`.`MetaDataOwnerId`=`meta_user`.`MetaUserId` SET `meta_data`.`MetaDataGroup`='crm-delete' WHERE `meta_user`.`MetaUserId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN DATA SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);    
        
         //DELETE DATA ENTRIES WHICH REFER TO NONEXIST MOVER
         $str_sql="UPDATE `meta_data`.`meta_data` LEFT JOIN `meta_user`.`meta_mover` on `meta_data`.`DataKeyValue`=`meta_mover`.`MetaMoverId` SET `meta_data`.`MetaDataGroup`='crm-delete' WHERE DataTableName='meta_mover' AND `meta_mover`.`MetaMoverId` IS NULL;";        
         //$this->fn_addEcho("UPDATE ORPHAN DATA SQL : ".$str_sql);                                        
         $stmt=$this->fn_executeSQLStatement($str_sql);   
    
        //DELETE DATA ENTRIES WHICH REFER TO NONEXIST SYSTEM
        $str_sql="UPDATE `meta_data`.`meta_data` LEFT JOIN `meta_user`.`meta_system` on `meta_data`.`MetaDataSystemId`=`meta_system`.`MetaSystemId` SET `meta_data`.`MetaDataGroup`='crm-delete' WHERE `meta_system`.`MetaSystemId` IS NULL;";        
        //$this->fn_addEcho("UPDATE ORPHAN DATA SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);                       
    
        $this->fn_deleteMarked();    
        
        //DELETE DATA ENTRIES WHICH REFER TO NONEXIST RECORDS
        $str_sql="SELECT * FROM  `meta_data`.`meta_data`";        
        $stmt=$this->fn_executeSQLStatement($str_sql);
        $arr_rows=$stmt->fetchAll();
        foreach ($arr_rows as $arr_row) {  
            $DataSchemaName=$arr_row["DataSchemaName"];                                    
            $DataTableName=$arr_row["DataTableName"];                                    
            $DataKeyName=$arr_row["DataKeyName"];                                    
            $DataKeyValue=$arr_row["DataKeyValue"];            
            if($DataTableName==="meta_form"){
              continue;
            }
            
            $str_sql="SELECT count(*) FROM  `$DataSchemaName`.`$DataTableName` WHERE `$DataKeyName`='$DataKeyValue';";                                
            //$this->fn_addEcho("DELETE ORPHAN DATA ITEM : ".$str_sql);                                        
            
            $int_count=$this->fn_fetchCount($str_sql, false, true);//true = cancel debug
            if(empty($int_count)){        
    
                $arr_paramMeta = [                                
                    'DataSchemaName'=> $DataSchemaName,
                    'DataTableName'=> $DataTableName,
                    'DataKeyName'=> $DataKeyName,    
                    'DataKeyValue'=> $DataKeyValue,                                            
                ];      

                $obj_metaData=new metaData($this);
                $obj_metaData->fn_deleteRecord($arr_paramMeta);
                
            }
            
        }        

        $this->fn_resetAutoIncrement("`meta_data`.`meta_data`", "`MetaDataId`");
    }
    
    function fn_markForDeletion($arr_param){//not currently used
        $str_sql="UPDATE `meta_data`.`meta_data` SET `meta_data`.`MetaDataGroup`='crm-delete' WHERE TRUE 
        AND `DataSchemaName`=:DataSchemaName 
        AND `DataTableName`=:DataTableName 
        AND `DataKeyName`=:DataKeyName
        AND `DataKeyValue`=:DataKeyValue
        ;";        
        //$this->fn_addEcho("UPDATE ORPHAN DATA SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql, $arr_param);
      }      

      function fn_deleteMarked(){
        $str_sql="DELETE FROM `meta_data`.`meta_data` WHERE `MetaDataGroup`='crm-delete' AND `meta_data`.`ProtectedPin`=0;";                
        //$this->fn_addEcho("DELETE ORPHAN DATA SQL : ".$str_sql);                                        
        $stmt=$this->fn_executeSQLStatement($str_sql);     
    
        $int_rowCount=$stmt->rowCount();        
        if($this->DebugServer){
          $this->fn_addConsole($int_rowCount." ROWS DELETED");                        
        }
      }
    
    
    
      function fn_metadata_maintainRecord(){         
           
        //DELETE DATA ENTRIES WHICH REFER TO NONEXIST RECORDS
        $str_sql="SELECT * FROM  `meta_data`.`meta_data`";        
        $str_sql="SELECT DISTINCT `DataSchemaName`, `DataTableName`,`DataKeyName` FROM  `meta_data`.`meta_data`";        
        if($this->DebugServer){
          $this->fn_addConsole("fn_metadata_maintainRecord : ".$str_sql);                                                  
        }      
        $stmt=$this->fn_executeSQLStatement($str_sql);
        $arr_rows=$stmt->fetchAll();
    
        foreach ($arr_rows as $arr_row) {  
            $DataSchemaName=$arr_row["DataSchemaName"];                                    
            $DataTableName=$arr_row["DataTableName"];                                    
            $DataKeyName=$arr_row["DataKeyName"];                                    
            
            $str_sql="
            UPDATE `meta_data`.`meta_data` left join `$DataSchemaName`.`$DataTableName` on `meta_data`.`meta_data`.`DataKeyValue`=`$DataSchemaName`.`$DataTableName`.`$DataKeyName` 
            SET
            `meta_data`.`meta_data`.`MetaDataGroup`='crm-delete'
            WHERE TRUE 
            AND `$DataSchemaName`.`$DataTableName`.`$DataKeyName` IS NULL 
            AND `meta_data`.`meta_data`.`DataSchemaName`=:DataSchemaName
            AND `meta_data`.`meta_data`.`DataTableName`=:DataTableName
            AND `meta_data`.`meta_data`.`DataKeyName`=:DataKeyName
            ;";        
            
            if($this->DebugServer){
              $this->fn_addConsole("DELETE ORPHAN DATA ITEM : ".$str_sql);                                        
            }
            
            $stmt=$this->fn_executeSQLStatement($str_sql, [                                
              'DataSchemaName'=> $DataSchemaName,
              'DataTableName'=> $DataTableName,
              'DataKeyName'=> $DataKeyName,              
            ]);         
            $int_rowCount=$stmt->rowCount();        
            if($this->DebugServer){
              $this->fn_addConsole($int_rowCount." ROWS UPDATED");                        
            }
        }        
        $this->fn_metadata_deleteMarked();
    }


}