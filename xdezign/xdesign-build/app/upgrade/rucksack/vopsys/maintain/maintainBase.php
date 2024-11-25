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
        
        //$this->fn_varDump($obj_paramView->MetaViewId, "obj_paramView->MetaViewId", true);
        //$this->fn_varDump($obj_paramView->InterfacePin, "obj_paramView->InterfacePin", true);

        //return;

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
    $obj_paramRowz->ButtonConsole="Record,Setting,SimpleSearch";
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
            INSERT INTO data_000000100.box_200007
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

  function fn_autoSetting($obj_paramRowzParent, $int_idRecordRowz){

    $obj_metaRowz=new metaRowz($this);        
    $obj_metaRowz->fn_initialize($int_idRecordRowz); 

    $bln_value=$this->fn_inString($obj_metaRowz->obj_param->ButtonConsole, "Setting");
    if(!$bln_value){                                                
        return;
    }    
    
    $obj_metaRowz=new metaRowz($this);
    $obj_paramRowz=$obj_metaRowz->fn_getParam();            

    $obj_paramRowz->MetaRowzSystemId=$obj_paramRowzParent->MetaRowzSystemId;            
    $obj_paramRowz->MetaRowzUserId=$obj_paramRowzParent->MetaRowzUserId;            
    $obj_paramRowz->MetaViewId=0;            
    $obj_paramRowz->ParentRowzId=$int_idRecordRowz;             
    $obj_paramRowz->MetaRowzName="Settings";            
    $obj_paramRowz->MetaRowzTitle="[Settings]";                                                               
    $obj_paramRowz->ButtonConsole="";
    $obj_paramRowz->MetaRowzPrivatePin=0;
    $obj_paramRowz->SettingOperationPin=1;
    $obj_paramRowz->HiddenPin="1";
    $obj_paramRowz->Subdomain=$obj_paramRowzParent->Subdomain;    
    $int_idRecordSettingRowz=$obj_metaRowz->fn_createRecord($obj_paramRowz);

    if(!empty($int_idRecordSettingRowz)){
        $obj_paramData=new stdClass;                                  
        $obj_paramData->MetaDataSystemId=$obj_paramView->MetaViewSystemId;      
        $obj_paramData->MetaDataOwnerId=$obj_paramView->MetaViewOwnerId;
        $obj_paramData->DataSchemaName="meta_rowz";
        $obj_paramData->DataTableName="meta_rowz";
        $obj_paramData->DataKeyName="MetaRowzId";      
        $obj_paramData->DataKeyValue=$int_idRecordSettingRowz;                                 
        $obj_paramData->MetaPermissionTag="";             
        
        $obj_metaData=new metaData($this);
        $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_paramData);            
    }

           
  }

  function fn_createStructureColumnz($obj_metaView){                      
        
        
    $obj_paramView=$obj_metaView->obj_param;                                                                                   
    $obj_paramView->MetaTableName=strtoLower($obj_paramView->MetaTableName);                
    
  //loop thru rows 
  //Create a column entry for each column        
  //create a form entry for each column      
  $str_sql="SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$obj_paramView->MetaSchemaName' AND TABLE_NAME='$obj_paramView->MetaTableName' ORDER BY ORDINAL_POSITION;";            
  $stmt=$this->fn_executeSQLStatement($str_sql);
  $arr_rows=$stmt->fetchAll();  
  
  if(empty($arr_rows)){
    //$this->fn_varDump($obj_metaView->obj_param, "0 obj_metaView->obj_paramView", true);  
    //return;
    $int_rowCount=0;                                
    $int_columnCount=0;
  }
  else{

    $int_rowCount=count($arr_rows);                                
    $int_columnCount=$stmt->columnCount();

  }

              
    
  
  //$this->fn_addConsole("int_rowCount: ".$int_rowCount);
  //$this->fn_addConsole("int_columnCount: ".$int_columnCount);      
  
      for($i_row=0;$i_row<$int_rowCount;$i_row++) {     
      
        $arr_row=$arr_rows[$i_row];                       

        
        $DATA_TYPE=$arr_row["DATA_TYPE"];
        $COLUMN_KEY=$arr_row["COLUMN_KEY"];                
        $TABLE_SCHEMA=$arr_row["TABLE_SCHEMA"];
        $TABLE_NAME=$arr_row["TABLE_NAME"];          
        $COLUMN_NAME=$arr_row["COLUMN_NAME"];
        $CHARACTER_MAXIMUM_LENGTH=$arr_row["CHARACTER_MAXIMUM_LENGTH"];        
        $NUMERIC_PRECISION=$arr_row["NUMERIC_PRECISION"];
        $ORDINAL_POSITION=$arr_row["ORDINAL_POSITION"];

        $FormOrder=($ORDINAL_POSITION*5);
        $DefaultValue="";

        
        $this->bln_debugColumn=false;
        if($COLUMN_NAME==="Sector"){
            //$this->bln_debugColumn=true;
            $this->fn_createLookupRowz("Sector");
        }

        if($this->bln_debugColumn){
            $this->fn_varDump($COLUMN_NAME, "COLUMN_NAME");
        }


        
        
        $MenuPin=0;            
        $MetaPermissionTag="";                
        $PublishPin=1;
        $LivePin=1;
        $SearchPin=0;
        $HiddenPin=0;                                                    
        $LockedPin=0;          
        $Decimal=0;
        $UnSigned=0;                
        $MaxLength=$CHARACTER_MAXIMUM_LENGTH;                        
        if(is_null($MaxLength))$MaxLength=0;
        $RequiredPin=0;                        
        $DateTime=0;
        $DateTimeSecond=0;
        $PrimaryPin=0;  
        $InfoPin=0;
        $SystemPin=0;
        
        
        switch($DATA_TYPE){
        case "smallint":
        case "int":
            $MetaType="Number";
        break;
        case "tinyint":
            $MetaType="Checkbox";
        break;
        case "varchar":
            $MetaType="Text";
        break;
        case "text":
        case "mediumtext":
        case "longtext":
            $MetaType="Memo";            
            $MaxLength=10000;
        break;
        case "date":
            $MetaType="Date";            
            $DefaultValue="NOW";
        break;
        case "datetime":
            $MetaType="DateTime";            
            $DefaultValue="NOW";
        break;
        case "json":
            $MetaType="JSON";                        
        break;
        default:
        $MetaType="Text";                
        }   

        if($COLUMN_KEY==="PRI"){
            $LivePin=1;//guarantee live key            
            $HiddenPin=0;                                            
            $LockedPin=1;                                    
            $PrimaryPin=1;
            $InfoPin=1;                
            $SearchPin=1;
            $MetaType="RecordId";
            $MetaPermissionTag="#ADMIN #MAINTAIN";
        }         
        
        if(strtolower($MetaType)==="number"){
            $MaxLength=$NUMERIC_PRECISION;                        
        }
        
        if(strtolower($MetaType)==="text"){
            $SearchPin=1;
        }
        if(strtolower($MetaType)==="date"){
            $SearchPin=1;
            $MenuPin=1;        
            $MaxLength=20;                        
        }

        if(strtolower($MetaType)==="datetime"){
            $SearchPin=1;
            $MenuPin=1;            
            $MaxLength=20;                        
        }

        
        if(str_ends_with(strtolower("$COLUMN_NAME"), 'id')){
            $MetaType="RecordId";
        }

        if($this->fn_inString($COLUMN_NAME, "Value")){
            $MetaType="Currency";                
        }

        
        if($this->fn_inString($COLUMN_NAME, "Group")){
            $MenuPin=1;
        }
        
        if($this->fn_inString($COLUMN_NAME, "Type")){
            $MenuPin=1;
        }

        if($this->fn_inString($COLUMN_NAME, "Name")){
            $SearchPin=1;
            $MenuPin=1;   
            $Live=1;             
        }      
        if($this->fn_inString($COLUMN_NAME, "Notes")){
            $SearchPin=1;               
            $Live=1;             
        }
        
        if($COLUMN_NAME==="Color"){
            $MetaType="Color";
        }        

        
        if($this->fn_inString($COLUMN_NAME, "City")){$MenuPin=1;}        
        if($this->fn_inString($COLUMN_NAME, "Zip")){$MenuPin=1;}        
        if($this->fn_inString($COLUMN_NAME, "Subdomain")){$MenuPin=1;}        
        if($this->fn_inString($COLUMN_NAME, "First")){$MenuPin=1;}        
        if($this->fn_inString($COLUMN_NAME, "Last")){$MenuPin=1;}        
        if($this->fn_inString($COLUMN_NAME, "Email")){$MenuPin=1;}                            

        if($this->fn_inString($COLUMN_NAME, "CreatedDate")){$MenuPin=0;}        
        if($this->fn_inString($COLUMN_NAME, "ModifiedDate")){$MenuPin=0;}                        
        if($this->fn_inString($COLUMN_NAME, "Custom")){        
            $LivePin=0;
            $SystemPin=0;
        }

        $MetaLabel=$COLUMN_NAME;
        if(strtolower($MetaLabel)==="date"){
            $MetaLabel="Date";
            $DateTime=1;
            $DateTimeSecond=0;
        }        

        $DebugPin=0;
        
        $obj_paramColumn=new stdClass;                          
        $obj_paramColumn->MetaColumnSystemId=$obj_paramView->MetaViewSystemId;//user , hopefully 100            
        $obj_paramColumn->MetaColumnOwnerId=$obj_paramView->MetaViewOwnerId;            
        $obj_paramColumn->MetaSchemaName=$TABLE_SCHEMA;
        $obj_paramColumn->MetaTableName=$TABLE_NAME;        
        $obj_paramColumn->MetaColumnName=$COLUMN_NAME;                
        $obj_paramColumn->MetaColumnAPIName=$COLUMN_NAME;     
        $obj_paramColumn->MetaType=$MetaType;     
        $obj_paramColumn->MetaLabel=$MetaLabel;  
        $obj_paramColumn->DebugPin=$DebugPin;  
        $obj_paramColumn->FormOrder=$FormOrder;     
        $obj_paramColumn->MetaList=NULL;     
        $obj_paramColumn->MetaOption=NULL;             
        $obj_paramColumn->MetaSQL="";                     
        $obj_paramColumn->MenuPin=$MenuPin;                    
        $obj_paramColumn->MetaPermissionTag=$MetaPermissionTag;             
        $obj_paramColumn->InfoPin=$InfoPin;        
        $obj_paramColumn->PublishPin=$PublishPin;        
        $obj_paramColumn->LivePin=$LivePin;        
        $obj_paramColumn->SearchPin=$SearchPin;
        $obj_paramColumn->HiddenPin=$HiddenPin;                                 
        $obj_paramColumn->LockedPin=$LockedPin;     
        $obj_paramColumn->Decimal=$Decimal;     
        $obj_paramColumn->UnSigned=$UnSigned;             
        $obj_paramColumn->MaxLength=$MaxLength;                     
        $obj_paramColumn->RequiredPin=$RequiredPin;                     
        $obj_paramColumn->DateTime=$DateTime;             
        $obj_paramColumn->DateTimeSecond=$DateTimeSecond;             
        $obj_paramColumn->PrimaryPin=$PrimaryPin;                       
        $obj_paramColumn->PlaceHolder="";     
        $obj_paramColumn->DefaultValue=$DefaultValue;     
        $obj_paramColumn->MetaColumnGroup="";                             
        $obj_paramColumn->Subdomain="";                             
        
        $obj_metaColumn=new metaColumn($this);                  
        $int_idRecordColumn=$obj_metaColumn->fn_createRecord($obj_paramColumn);      
        
        if($this->bln_debugColumn){
            $this->fn_varDump($int_idRecordColumn, "int_idRecordColumn");
        }

    }//LOOP ROW                      

    
    $this->obj_post->RowData=false;      
    
    if($this->bln_debugView){
        $this->fn_addMessage("START CREATE MENU");
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
  
    function fn_addNewRowz(){

        $int_idRecordSystem=$this->obj_userLogin->MetaUserSystemId;
        $schema_name="data_".substr("000000000",strlen($int_idRecordSystem)).$int_idRecordSystem;

        $randomNumber = rand(1, 100); // You can adjust the range as needed
        $currentDateTime = new DateTime();
        $currentDateTime = $currentDateTime->format('YmdHis');
        $ViewName="MyBox_".$currentDateTime."_".$randomNumber;

        $obj_metaView=new metaView($this);  
        $obj_paramView=$obj_metaView->fn_getParam();
        $obj_paramView->ChargePin=1;
        $obj_paramView->AutoView=1;        
        $obj_paramView->MetaViewSystemId=$this->obj_userLogin->MetaUserSystemId;            
        $obj_paramView->MetaViewName=$ViewName;
        $obj_paramView->MetaSchemaName=$schema_name;
        $obj_paramView->MetaTableName="";
        $obj_paramView->MetaOrderBy=NULL;
        $obj_paramView->MetaTableKeyField="Id";
        $obj_paramView->MetaViewOwnerId=$this->obj_userLogin->MetaUserId;
        $obj_paramView->MetaViewSystemId=$this->obj_userLogin->MetaUserSystemId;
        $obj_paramView->MetaViewSubdomain=$this->obj_metaRowz->obj_param->Subdomain;                
        $int_idMetaView=$obj_metaView->fn_createRecord($obj_paramView);


        $table_name="box_".$int_idMetaView;

        $str_sql="UPDATE `meta_view`.`meta_view` SET `MetaTableName`='$table_name' WHERE `MetaViewId`=$int_idMetaView;";
        $this->fn_executeSQLStatement($str_sql);
        
        //$this->obj_metaRowz->fn_debug();    
        $obj_metaRowz=new metaRowz($this);    
        $obj_paramRowz=$obj_metaRowz->fn_getParam();
        $obj_paramRowz->MetaRowzSystemId=$this->obj_userLogin->MetaUserSystemId;            
        $obj_paramRowz->MetaRowzUserId=$this->obj_userLogin->MetaUserId;
        $obj_paramRowz->MetaViewId=$int_idMetaView;
        $obj_paramRowz->ParentRowzId=$this->obj_metaRowz->obj_param->MetaRowzId;
        $obj_paramRowz->MetaRowzName=$ViewName;
        $obj_paramRowz->MetaRowzTitle="My Row";                              
        $obj_paramRowz->Subdomain=$this->obj_metaRowz->obj_param->Subdomain;        
        $obj_paramRowz->ButtonConsole="Record,Setting,SimpleSearch";
        $obj_paramRowz->MetaRowzPrivatePin=0; 
        $obj_paramRowz->RowzOrder=$this->fn_fetchColumn("SELECT Max(`RowzOrder`)+10 FROM `meta_rowz`.`meta_rowz`  where `ParentRowzId`=:ParentRowzId;", [            
            'ParentRowzId'=>$obj_paramRowz->ParentRowzId
        ]);   

        $str_sql="
        UPDATE `meta_view`.`meta_view` 
        SET `MetaViewParentRowzId`=".$obj_paramRowz->ParentRowzId.", `MetaOrderBy`='{\"$int_idMetaView.Id\": \"DESC\"}' 
        WHERE `MetaViewId`=$int_idMetaView
        ;
        ";
        $this->fn_executeSQLStatement($str_sql);
        


        
        $int_idRecordRowz=$obj_metaRowz->fn_createRecord($obj_paramRowz);                                  
        //$this->fn_addConsole("int_idRecordRowz: ", $int_idRecordRowz);       
        $bln_value=$this->fn_inString($obj_paramRowz->ButtonConsole, "Setting");
        if($bln_value){                                                
            $this->fn_autoSetting($obj_paramRowz, $int_idRecordRowz);
        }; 

        
        
        $str_sql="CREATE SCHEMA IF NOT EXISTS `$schema_name`;";            
        $stmt=$this->fn_executeSQLStatement($str_sql);        
        
        $str_sql="CREATE TABLE IF NOT EXISTS `$schema_name`.`$table_name`  LIKE `data_000000100`.`box_200000`;";            
        $stmt=$this->fn_executeSQLStatement($str_sql);

        $obj_metaView=new metaView($this);  
        $obj_metaView->fn_initialize($int_idMetaView);                
        
        $this->fn_createStructureColumnz($obj_metaView);
        
    }

    function fn_hideRowz(){        
        $this->obj_metaRowz->fn_hide();                
    }
    function fn_showRowz(){        
        $this->obj_metaRowz->fn_show();                
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
            $obj_paramView->MetaViewSystemId=$obj_param->MetaViewSystemId;            
            $obj_paramView->MetaViewName=$obj_param->MetaTableName;
            $obj_paramView->MetaSchemaName=$obj_param->MetaSchemaName;
            $obj_paramView->MetaTableName=$obj_param->MetaTableName;
            $obj_paramView->MetaTableKeyField=$obj_param->MetaTableKeyField;
            $obj_paramView->MetaViewOwnerId=$obj_param->MetaViewOwnerId;                        
            $obj_paramView->MetaViewSystemId=$obj_param->MetaViewSystemId;                        
            $int_idRecord=$obj_metaView->fn_createRecord($obj_paramView);

            $this->fn_addConsole("int_idRecord", $int_idRecord, true);                                  
            //$obj_metaView->fn_debug(true);
            
            
            $obj_metaView->obj_param->MetaViewParentRowzId=$obj_param->ParentRowzId;            
            $obj_metaView->obj_param->Subdomain=$obj_param->Subdomain;            
            

            

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
        if($obj_paramView->MetaSchemaName==="data_template" && $obj_paramView->MetaTableName==="mybox_template"){
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