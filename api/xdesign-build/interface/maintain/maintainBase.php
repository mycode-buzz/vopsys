<?php



/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainBase extends maintainFile{    

    function fn_getMetaViewId($obj_param){
        $str_sql="SELECT MetaViewId FROM `meta_view`.`meta_view`WHERE LOWER(`MetaSchemaName`)=LOWER(:MetaSchemaName) AND LOWER(`MetaTableName`)=LOWER(:MetaTableName) ORDER BY `MetaViewId` ASC LIMIT 1 ";
        $this->fn_varDump($str_sql, "str_sql", true);
        return $this->fn_fetchColumn($str_sql, [
            'MetaSchemaName'=>$obj_param->MetaSchemaName,
            'MetaTableName'=>$obj_param->MetaTableName            
        ]);
    }

    function fn_doAutoView(){
        $str_sql="SELECT * FROM `meta_view`.`meta_view` 
        WHERE TRUE
        AND NOT `meta_view`.`DynamicMenuPin`
        ";
        
        //$this->fn_varDump($str_sql, "str_sql", true);
        $arr_rows=$this->fn_fetchRowz($str_sql);
        
        
        if(empty($arr_rows)){return;}

        $int_rowCount=count($arr_rows);                                                
        for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
            $arr_row=$arr_rows[$i_row];

            $MetaViewId=$arr_row["MetaViewId"];
            //$this->fn_varDump($MetaViewId, "MetaViewId", true);
            //continue;
            $obj_metaView=new metaView($this);
            $obj_metaView->fn_initialize($MetaViewId);
            $obj_paramView=$obj_metaView->obj_param;                        
            
            if($obj_paramView->AutoView ){                                                                
                $this->fn_autoView($obj_metaView);
            }
        }
    }

    function fn_autoView($obj_metaView){        

        $obj_paramView=$obj_metaView->obj_param;        
        if(empty($obj_paramView->MetaViewParentRowzId)){            
            $obj_paramView->MetaViewParentRowzId=0;                        
        }
        $this->fn_createStructureView($obj_metaView);        
        $this->fn_createStructureRowz($obj_metaView);        
        $this->fn_createStructureColumnz($obj_metaView);
        //$this->fn_createDataMap($obj_metaView);
    }

    function fn_createStructureView($obj_metaView){

        $obj_paramView=$obj_metaView->obj_param;

        if(empty($obj_paramView->MetaViewId || $obj_paramView->DynamicMenuPin)){
            return;
        }   
                
                
        $obj_paramData=new stdClass;                  
        $obj_paramData->MetaDataSystemId=$obj_paramView->MetaViewSystemId;      
        $obj_paramData->MetaDataOwnerId=$obj_paramView->MetaViewOwnerId;

        $obj_paramData->DataSchemaName="meta_view";
        $obj_paramData->DataTableName="meta_view";
        $obj_paramData->DataKeyName="MetaViewId";      
        $obj_paramData->DataKeyValue=$obj_paramView->MetaViewId;                             
        $obj_paramData->MetaPermissionTag="";        

        $obj_metaData=new metaData($this);
        $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_paramData);            
        if($this->bln_debugView){
            $this->fn_addMessage("int_idRecordMeta: ".$int_idRecordMeta);
        }            
    }
    
  function fn_createStructureRowz($obj_metaView){

    $obj_paramView=$obj_metaView->obj_param;

    
    if(empty($obj_paramView->MetaViewId || $obj_paramView->DynamicMenuPin)){
        return;
    }   
                      
    
    $obj_metaRowz=new metaRowz($this);
    $obj_paramRowz=$obj_metaRowz->fn_getParam();

    $obj_paramRowz->MetaRowzSystemId=$obj_paramView->MetaViewSystemId;            
    $obj_paramRowz->MetaRowzUserId=$obj_paramView->MetaViewOwnerId;            
    $obj_paramRowz->MetaViewId=$obj_paramView->MetaViewId;            
    $obj_paramRowz->ParentRowzId=$obj_paramView->MetaViewParentRowzId;                     
    $obj_paramRowz->MetaRowzName=$obj_paramView->MetaViewName;
    $obj_paramRowz->RowzIcon=$obj_paramView->MetaViewIcon;

    $obj_paramRowz->MetaRowzTitle=$obj_paramView->MetaViewName;                                                               
    $obj_paramRowz->ButtonConsole="Record,SimpleSearch";
    $obj_paramRowz->SettingPin=1;
    if($obj_paramView->MetaViewInterfacePin){
        $obj_paramRowz->SettingPin=0;
    }
    
    $obj_paramRowz->MetaRowzPrivatePin=0;                         
    $obj_paramRowz->Subdomain=$obj_paramView->MetaViewSubdomain;

    $int_idRecordRowz=$obj_metaRowz->fn_createRecord($obj_paramRowz);                     
    
    $this->fn_autoSetting($obj_paramRowz, $int_idRecordRowz);
                
    if($this->bln_debugView){
        //$this->fn_addMessage("int_idRecordRowz: ".$int_idRecordRowz);
    }

    /*onlny enable  this if mtarowid id implemented, wont work for parentid
    $str_sql="UPDATE `meta_view`.`meta_view` SET `MetaViewParentRowzId`=:RecordRowzId WHERE `MetaViewId`=$obj_paramRowz->MetaViewId and MetaViewParentRowzId=0;";
    $this->fn_executeSQLStatement($str_sql, [
        'RecordRowzId'=>$int_idRecordRowz
    ]);
    //*/

        

  }  

  function fn_createLookupRowz($str_nameTable){

    switch($str_nameTable){
        case "Sector":

            /*
            INSERT INTO data_000000100.box_xxx
(NAME, MetaGroup)
VALUES
("Agriculture", "Sector"),
("Manufacturing", "Sector"),
("Construction", "Sector"),
("Energy", "Sector"),                  
("Healthcare", "Sector"),                                    
("Finance", "Sector"),                                    
("Information Technology", "Sector"),                                    
("Education", "Sector"),                                    
("Transportation", "Sector"),                                    
("Retail", "Sector"),                                    
("Hospitality", "Sector"),                                    
("Telecommunications", "Sector"),                                    
("Real Estate", "Sector"),                                    
("Entertainment", "Sector"),                                    
("Utilities", "Sector")
;
            //*/
            break;
    }
    
  }
  
  
  //START MISC AUTOFORM FUNCTIONS/////////////////////////////////////////////////////
  function fn_getColumnDefaultValue($obj_columnDictionary, $str_columnName, $str_otherValue=""){
      $str_defaultValue=$obj_columnDictionary->{$str_columnName}->DefaultValue;
      if(empty($str_defaultValue)){$str_defaultValue=$str_otherValue;}
      return $str_defaultValue;
  }

  
  function fn_toggleArchive(){
    
    $MetaRowzId=$this->obj_metaRowz->obj_param->MetaRowzId;

    //$this->fn_varDump($MetaRowzId, "MetaRowzId");
    //$this->fn_debugPost();
    

    $str_sql="UPDATE `meta_rowz`.`meta_rowz` SET `ArchivePin`=
    CASE
        WHEN `ArchivePin` THEN FALSE
        ELSE TRUE
    END
     WHERE `MetaRowzId`=$MetaRowzId;";
    $this->fn_executeSQLStatement($str_sql);
        
  }

    
    
    function fn_autoSchema($obj_param){

        
        $str_sql="SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=:MetaSchemaName";

        //$this->fn_addConsole("str_sql: ".$str_sql);
        //$this->fn_addConsole("obj_param->MetaSchemaName: ".$obj_param->MetaSchemaName);

        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'MetaSchemaName'=>$obj_param->MetaSchemaName
        ]);        
        
        
        $arr_rows=$stmt->fetchAll();     
        $int_rowCount=count($arr_rows);                                        
        
        
        for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
          
            $arr_row=$arr_rows[$i_row];                             
            $this->fn_varDump($arr_row);                          
            $obj_param->MetaSchemaName=$arr_row["TABLE_SCHEMA"];
            $obj_param->MetaTableName=$arr_row["TABLE_NAME"];                                    
            
            
            //$this->fn_addConsole("obj_param->MetaTableName: ".$obj_param->MetaTableName);
            $str_sql="SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TRUE
            AND TABLE_SCHEMA=:TABLE_SCHEMA 
            AND TABLE_NAME=:TABLE_NAME 
            AND COLUMN_KEY='PRI'
            ;";       

            $obj_param->MetaTableKeyField=$this->fn_fetchColumn($str_sql, [
                'TABLE_SCHEMA'=>$obj_param->MetaSchemaName,
                'TABLE_NAME'=>$obj_param->MetaTableName            
            ]);

            /*
            $this->fn_addConsole("i_row", $i_row);
            $this->fn_addConsole("str_sql", $str_sql);
            $this->fn_addConsole("obj_param->MetaSchemaName", $obj_param->MetaSchemaName);
            $this->fn_addConsole("obj_param->MetaTableName", $obj_param->MetaTableName);                                  
            //*/
            
            $obj_metaView=new metaView($this);  
            $obj_paramView=$obj_metaView->fn_getParam();
            $obj_paramView->ChargePin=0;
            $obj_paramView->ViewPin=1;
            $obj_paramView->MetaViewSystemId=$obj_param->MetaViewSystemId;                        
            $obj_paramView->MetaSchemaName=$obj_param->MetaSchemaName;
            $obj_paramView->MetaTableName=$obj_param->MetaTableName;
            $obj_paramView->MetaViewName=$obj_param->MetaTableName;
            $obj_paramView->MetaTableKeyField=$obj_param->MetaTableKeyField;
            $obj_paramView->MetaViewOwnerId=$obj_param->MetaViewOwnerId;                        
            $obj_paramView->MetaViewSystemId=$obj_param->MetaViewSystemId;                        
            $obj_paramView->TemplateViewId=0;
            $obj_paramView->MetaViewParentRowzId=$obj_param->ParentRowzId;            
            $obj_paramView->Subdomain=$obj_param->Subdomain;            
            $obj_paramView->MetaViewIcon="";            
            
            $obj_metaView->fn_createRecord($obj_paramView);//also initiaizes

            if($obj_param->AutoDelete){                                
                $this->fn_autoDelete($obj_metaView);                
            }            

            if($obj_param->AutoView){                                                                
                $this->fn_autoView($obj_metaView);
            }
        }
    }   
  

    function fn_createDataMap($obj_metaView){

        $obj_paramView=$obj_metaView->obj_param;  
        
        if(empty($obj_paramView->MetaViewId || $obj_paramView->DynamicMenuPin)){
            return;
        } 
        
        if($obj_paramView->MetaSchemaName==="meta_data" && $obj_paramView->MetaTableName==="meta_data"){
            return;
        }
         
        $str_sql="SELECT `$obj_paramView->MetaSchemaName`.`$obj_paramView->MetaTableName`.`$obj_paramView->MetaTableKeyField` FROM 
        `$obj_paramView->MetaSchemaName`.`$obj_paramView->MetaTableName` LEFT JOIN `meta_data`.`meta_data` ON 
        (TRUE
        AND `$obj_paramView->MetaSchemaName`.`$obj_paramView->MetaTableName`.`$obj_paramView->MetaTableKeyField`=`meta_data`.`DataKeyValue`
        AND `meta_data`.`MetaDataSystemId`=:MetaDataSystemId        
        AND `meta_data`.`DataSchemaName`=:MetaSchemaName
        AND `meta_data`.`DataTableName`=:MetaTableName
        AND `meta_data`.`DataKeyName`=:MetaTableKeyField
        )
        WHERE `meta_data`.`meta_data`.`MetaDataViewId` IS NULL
        ;";            
        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'MetaDataSystemId'=>$obj_paramView->MetaViewSystemId,            
            'MetaSchemaName'=>$obj_paramView->MetaSchemaName,            
            'MetaTableName'=>$obj_paramView->MetaTableName,            
            'MetaTableKeyField'=>$obj_paramView->MetaTableKeyField
        ]);
        $arr_rows=$stmt->fetchAll();
    
        
    
        $int_rowCount=count($arr_rows);                                
        $int_columnCount=$stmt->columnCount();            
        for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
            $arr_row=$arr_rows[$i_row];                       
            $DataKeyValue=$arr_row[$obj_paramView->MetaTableKeyField];
            $obj_paramData=new stdClass;                                  
            $obj_paramData->MetaDataSystemId=$obj_paramView->MetaViewSystemId;                
            $obj_paramData->MetaDataOwnerId=$obj_paramView->MetaViewOwnerId;                
            $obj_paramData->DataSchemaName=$obj_paramView->MetaSchemaName;
            $obj_paramData->DataTableName=$obj_paramView->MetaTableName;                
            $obj_paramData->DataKeyName=$obj_paramView->MetaTableKeyField;
            $obj_paramData->DataKeyValue=$DataKeyValue;
            $obj_paramData->MetaPermissionTag="";            
            $obj_metaData=new metaData($this);
            $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_paramData);                                          
        }
    }

    function fn_autoDelete($obj_metaView){        

        
        $obj_paramView=$obj_metaView->obj_param;
        //$obj_metaView->fn_debug(true);
        
        //META_DATA
        $str_sql="DELETE FROM `meta_data`.`meta_data` WHERE TRUE
        AND DataSchemaName=:DataSchemaName
        AND DataTableName=:DataTableName
        AND MetaDataOwnerId=:MetaDataOwnerId
        ;";
        
        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'DataSchemaName'=>$obj_paramView->MetaSchemaName,
            'DataTableName'=>$obj_paramView->MetaTableName,
            'MetaDataOwnerId'=>$obj_paramView->MetaViewOwnerId            
        ]);
        //$this->fn_varDump($str_sql, "str_sql", true);            

        $str_sql="SELECT max(MetaDataId) FROM `meta_data`.`meta_data`";
        $int_idMax=$this->fn_fetchColumn($str_sql);       

        if(is_null($int_idMax)){
            $int_idMax=0;
        }

        $str_sql="ALTER TABLE `meta_data`.`meta_data` auto_increment=$int_idMax;";        
        $this->fn_executeSQLStatement($str_sql);      

        $this->fn_checkOrphanMetaColumn();                
        //META_DATA
        
        //META_COLUMN
        $str_sql="DELETE FROM `meta_column`.`meta_column` WHERE TRUE
        AND MetaViewId=:MetaViewId
        AND MetaColumnSystemId=:MetaColumnSystemId
        ;";
        
        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'MetaViewId'=>$obj_paramView->MetaViewId,
            'MetaColumnSystemId'=>$obj_paramView->MetaViewSystemId
        ]);

        $str_sql="SELECT max(MetaColumnId) FROM `meta_column`.`meta_column`";
        $int_idMax=$this->fn_fetchColumn($str_sql);  
        
        if(is_null($int_idMax)){
            $int_idMax=0;
        }


        $str_sql="ALTER TABLE `meta_column`.`meta_column` auto_increment=$int_idMax;";        
        $this->fn_executeSQLStatement($str_sql);      

        $this->fn_checkOrphanMetaColumn();                
        //META_COLUMN

        //META_ROWZ        
        $str_sql="SELECT * FROM `meta_rowz`.`meta_rowz`  JOIN `meta_view`.`meta_view` ON `meta_rowz`.`metaViewId`=`meta_view`.`MetaViewId`
        WHERE TRUE
        AND `meta_view`.`MetaViewId`=:MetaViewId
        AND `meta_rowz`.`MetaRowzSystemId`=:MetaRowzSystemId
        AND `meta_rowz`.`MetaRowzUserId`=:MetaRowzUserId
        ";
        /*
        $this->fn_addConsole("str_sql: ", $str_sql);
        $this->fn_addConsole("MetaViewId: ", $obj_paramView->MetaViewId);
        $this->fn_addConsole("MetaRowzSystemId: ", $obj_paramView->MetaViewSystemId);
        $this->fn_addConsole("MetaRowzUserId: ", $obj_paramView->MetaViewOwnerId);
        //*/

        $arr_rows=$this->fn_fetchRowz($str_sql, [
            'MetaViewId'=>$obj_paramView->MetaViewId,
            'MetaRowzSystemId'=>$obj_paramView->MetaViewSystemId,
            'MetaRowzUserId'=>$obj_paramView->MetaViewOwnerId
        ]);
        
        
        if($arr_rows){
            $int_rowCount=count($arr_rows);                                                
            for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  

                $this->fn_addConsole("obj_param->MetaViewId: ", $obj_paramView->MetaViewId);
        
                $arr_row=$arr_rows[$i_row];                
                $MetaRowzId=$arr_row["MetaRowzId"];
                $obj_metaRowz=new metaRowz($this);
                $obj_metaRowz->fn_initialize($MetaRowzId);                
                $obj_metaRowz->fn_delete();                
            }            
        }
        //exit;
        
        $str_sql="SELECT max(MetaRowzId) FROM `meta_rowz`.`meta_rowz`";
        $int_idMax=$this->fn_fetchColumn($str_sql);     
        
        if(is_null($int_idMax)){
            $int_idMax=0;
        }


        $str_sql="ALTER TABLE meta_rowz auto_increment=$int_idMax;";
        $this->fn_executeSQLStatement($str_sql);              

        $this->fn_checkOrphanMetaRowz();     
        //META_ROWZ

        

        $this->fn_checkOrphanMetaView();                                  
        //META_VIEW        

    }

    
    
}