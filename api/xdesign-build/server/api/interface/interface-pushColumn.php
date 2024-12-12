<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE


class pushColumn extends pushRowz{
    function __construct() {             
        parent::__construct();                        
        
    }          

    function fn_initialize() {                        
        parent::fn_initialize();                                
    }
    
    //START CALL AUTOFORM FUNCTIONS/////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    function fn_addDefaultColumn(){ //USED BY ADD COLUMN  BUTTON IN SETTINGS               
        $MetaViewId=$this->obj_metaView->obj_param->MetaViewId;
        //$this->fn_addMessage("fn_addDefaultColumn View: ".$MetaViewId);
        $ColumnNameUnique=$this->obj_metaView->fn_createColumn();        
        $this->bln_reloadSection=true;
    }


    function fn_createStructureColumnz($obj_metaView){                             
        
        
        $obj_paramView=$obj_metaView->obj_param;                                                                                   
        //$obj_paramView->MetaTableName=strtoLower($obj_paramView->MetaTableName);                
        
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

            $MetaOption=NULL;
            $MetaLabel=$COLUMN_NAME;
    
            
            $this->bln_debugColumn=false;
            if($COLUMN_NAME==="Currency"){
                //$this->bln_debugColumn=true;
                //$this->fn_createLookupRowz("Sector");
            }
    
            if($this->bln_debugColumn){                
                //$this->fn_addConsole("COLUMN_NAME", $COLUMN_NAME);                                      
                //$this->fn_addConsole("DATA_TYPE", $DATA_TYPE);                                      
            }

            //$this->fn_addConsole("COLUMN_NAME", $COLUMN_NAME);                                                  
            
            
            $MenuPin=0;            
            $MetaPermissionTag="";                
            $PublishPin=1;
            $LivePin=1;
            $SearchPin=0;
            $HiddenPin=0;                                                    
            $LockedPin=0;                      
            $RequiredPin=0;                                    
            $PrimaryPin=0;  
            $InfoPin=0;
            $SystemPin=0;                        
            $DebugPin=0;                        
            $SectionTitle="";                        
            $MatchPin=0;
            $MaxLength=100;
            
            switch(strtolower($DATA_TYPE)){
            case "decimal":
            case "smallint":
            case "int":
                $MetaColumnType="Number";
            break;
            case "tinyint":
                $MetaColumnType="Checkbox";
            break;
            case "varchar":
                $MetaColumnType="Text";
            break;
            case "text":
            case "mediumtext":
            case "longtext":
                $MetaColumnType="Note";                            
            break;
            case "date":
                $MetaColumnType="Date";            
                $DefaultValue="NOW";
            break;
            case "datetime":
                $MetaColumnType="DateTime";            
                $DefaultValue="NOW";
            break;            
            case "json":
                $MetaColumnType="JSON";                        
            break;
            default:
                $MetaColumnType="Text";                
                break;
            }   


            if($COLUMN_NAME==="Percent"){
                $MetaColumnType="Percent";
            }        
            if($COLUMN_NAME==="Color"){
                $MetaColumnType="Color";
            }        
            if($COLUMN_NAME==="Email"){
                $MetaColumnType="Email";
            }        
            if($COLUMN_KEY==="PRI"){
                $MetaColumnType="RecordId";
            }         

            switch(strtolower($MetaColumnType)){                
                case "color":                                
                break;
                case "email":                                
                    $MetaOption=$this->MetaOptionDefaultEmail;
                break;
                case "recordid":                      
                    $LivePin=1;//guarantee live key            
                    $HiddenPin=0;                                            
                    $LockedPin=1;                                    
                    $PrimaryPin=1;
                    $InfoPin=1;                
                    $SearchPin=1;
                    $MetaPermissionTag="#ADMIN #MAINTAIN";              
                    $MetaOption=$this->MetaOptionDefaultRecordId;
                break;
                case "number":                                    
                    $MetaOption=$this->MetaOptionDefaultNumber;                                 
                break;
                case "checkbox":                
                break;
                case "text":                    
                    $SearchPin=1;                                        
                    $MetaOption=$this->MetaOptionDefaultText;
                    $MaxLength=$CHARACTER_MAXIMUM_LENGTH;
                break;
                case "note":                                        
                    $MetaOption=$this->MetaOptionDefaultNote;
                    $MaxLength=10000;
                break;                
                case "date":                
                    $MetaLabel="Date";
                    $DefaultValue="NOW";
                    $SearchPin=1;
                    $MenuPin=1;                            
                    $MetaOption=$this->MetaOptionDefaultDate;
                break;
                case "datetime":                    
                    $MetaLabel="Date & Time";
                    $DefaultValue="NOW";
                    $SearchPin=1;
                    $MenuPin=1;                                
                    $MetaOption=$this->MetaOptionDefaultDateTime;
                break;            
                case "json":                
                    $MetaOption=$this->MetaOptionDefaultJSON;                    
                break;                
                case "url":                
                    $MetaOption=$this->MetaOptionDefaultURL;                    
                break;  
                case "color":                
                    $MetaOption=$this->MetaOptionDefaultColor;                    
                break;  
                case "phone":                
                    $MetaOption=$this->MetaOptionDefaultPhone;                    
                break;                  
            }                          
            
            
            if(str_ends_with(strtolower("$COLUMN_NAME"), 'id')){
                $MetaColumnType="RecordId";                 
            }
    
            if($this->fn_inString($COLUMN_NAME, "Value")){
                $MetaColumnType="Currency";                     
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
                $MatchPin=1;                         
            }      
            if($this->fn_inString($COLUMN_NAME, "Note")){
                $SearchPin=1;               
                $Live=1;             
            }
            if($this->fn_inString($COLUMN_NAME, "City")){$MenuPin=1;}        
            if($this->fn_inString($COLUMN_NAME, "Zip")){$MenuPin=1;$MatchPin=1;}        
            if($this->fn_inString($COLUMN_NAME, "Subdomain")){$MenuPin=1;}        
            if($this->fn_inString($COLUMN_NAME, "First")){$MenuPin=1;}        
            if($this->fn_inString($COLUMN_NAME, "Last")){$MenuPin=1;$MenuPin=1;}        
            if($this->fn_inString($COLUMN_NAME, "Email")){$MenuPin=1;$MenuPin=1;}                                
            if($this->fn_inString($COLUMN_NAME, "CreatedDate")){$MenuPin=0;}        
            if($this->fn_inString($COLUMN_NAME, "ModifiedDate")){$MenuPin=0;}                        
            if($this->fn_inString($COLUMN_NAME, "mycol_")){        
                $LivePin=1;
                $SystemPin=0;                
            }
            
            $obj_paramColumn=new stdClass;                          
            $obj_paramColumn->MetaColumnSystemId=$obj_paramView->MetaViewSystemId;//user , hopefully 100            
            $obj_paramColumn->MetaColumnOwnerId=$obj_paramView->MetaViewOwnerId;            
            $obj_paramColumn->MetaPermissionTag=$MetaPermissionTag;                         
            $obj_paramColumn->MetaSchemaName=$TABLE_SCHEMA;
            $obj_paramColumn->MetaTableName=$TABLE_NAME;        
            $obj_paramColumn->MetaColumnName=$COLUMN_NAME;                            
            $obj_paramColumn->MetaColumnAPIName=strtolower($COLUMN_NAME);     
            $obj_paramColumn->MetaColumnType=$MetaColumnType;     
            $obj_paramColumn->MetaLabel=$MetaLabel;              
            $obj_paramColumn->DebugPin=$DebugPin;              
            $obj_paramColumn->SectionTitle=$SectionTitle;                                      
            $obj_paramColumn->FormOrder=$FormOrder;     
            $obj_paramColumn->PrimaryPin=$PrimaryPin;                                   
            $obj_paramColumn->InfoPin=$InfoPin;        
            $obj_paramColumn->MenuPin=$MenuPin;                    
            $obj_paramColumn->LivePin=$LivePin;        
            $obj_paramColumn->PublishPin=$PublishPin;        
            $obj_paramColumn->SearchPin=$SearchPin;            
            $obj_paramColumn->MatchPin=$MatchPin;                        
            $obj_paramColumn->HiddenPin=$HiddenPin;                                 
            $obj_paramColumn->LockedPin=$LockedPin;                             
            $obj_paramColumn->RequiredPin=$RequiredPin;
            $obj_paramColumn->MaxLength=$MaxLength;     
            $obj_paramColumn->MetaList=NULL;     
            $obj_paramColumn->MetaOption=$MetaOption;            
            $obj_paramColumn->MetaSQL="";
            $obj_paramColumn->DefaultValue=$DefaultValue;     
            $obj_paramColumn->MetaClassType="";     
            $obj_paramColumn->MetaColumnGroup="";                             
            $obj_paramColumn->Subdomain="";                             
            $obj_paramColumn->ProtectedPin=0;            
            $obj_metaColumn=new metaColumn($this);                                           
            $obj_metaColumn->fn_createRecord($obj_paramColumn);                            
            $int_idRecordColumn=$obj_metaColumn->obj_param->MetaColumnId;
            
            if($this->bln_debugColumn){
                $this->fn_varDump($int_idRecordColumn, "int_idRecordColumn");
            }
            
            if($this->fn_inString($TABLE_NAME, "mybox_")){
                $str_sql="UPDATE meta_column.meta_column SET FormOrder=:FormOrder WHERE MetaColumnId=:MetaColumnId;";            
                $stmt=$this->fn_executeSQLStatement($str_sql, [
                'MetaColumnId'=>$int_idRecordColumn,
                'FormOrder'=>$FormOrder,
                ]);
            }
            
            
    
        }//LOOP ROW                      
    
        
        $this->obj_post->RowData=false;      
        
        if($this->bln_debugView){
            $this->fn_addMessage("END CREATE COLUMNZ");
        }        
        
    }         

    function fn_pullTemplateColumnz($obj_metaViewNew, $obj_metaViewTemplate=false){                                                                         

        
        $obj_paramViewNew=$obj_metaViewNew->obj_param;     

        //$this->fn_addConsole("fn_pullTemplateColumnz", $obj_paramViewNew->MetaViewName);        

        if(empty($obj_paramViewNew->ValidView)){
            $this->fn_addConsole("VALID VIEW IS FALSE");                
            return false;
        }

        $obj_paramViewTemplate=false;
        if(!empty($obj_metaViewTemplate)){            
            $obj_paramViewTemplate=$obj_metaViewTemplate->obj_param;
            $obj_paramViewTemplate->MetaColumnSystemIdTemplate=$obj_paramViewTemplate->MetaViewSystemId;
        }
        
        $obj_paramColumnPull=new stdClass;        
        $obj_paramColumnPull->MetaPullName=$obj_paramViewNew->MetaViewName;        
        $obj_paramColumnPull->MetaColumnSystemId=$obj_paramViewNew->MetaViewSystemId;//create column
        $obj_paramColumnPull->MetaColumnOwnerId=$obj_paramViewNew->MetaViewOwnerId;//create column
        $obj_paramColumnPull->MetaSchemaName=$obj_paramViewNew->MetaSchemaName;//create column                
        $obj_paramColumnPull->MetaTableName=$obj_paramViewNew->MetaTableName;//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, $obj_paramViewTemplate);
    }    

    function fn_pullSettingzColumnz(){
        
        if(!empty($this->obj_userLogin->PulledSettingColumnz)){
            return;
        }
        $this->obj_userLogin->PulledSettingColumnz=true;
        $this->fn_setSession("UserLoginSession", serialize($this->obj_userLogin));

        $this->fn_addConsole("fn_pullSettingzColumnz");        
        
        $obj_paramColumnPull=new stdClass;        
        $obj_paramColumnPull->MetaColumnSystemIdTemplate=$this->obj_userBase->MetaUserSystemId;//used in template
        $obj_paramColumnPull->MetaColumnSystemId=$this->obj_userLogin->MetaUserSystemId;//create column
        $obj_paramColumnPull->MetaColumnOwnerId=$this->obj_userLogin->MetaUserId;//create column        

        //meta_column, meta_rowz, meta_view, meta_topup, meta_mall, meta_system, meta_mover
        
        $obj_paramColumnPull->MetaPullName="SettingColumn";
        $obj_paramColumnPull->MetaSchemaName="meta_column";//create column
        $obj_paramColumnPull->MetaTableName="meta_column";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

        $obj_paramColumnPull->MetaPullName="SettingRow";
        $obj_paramColumnPull->MetaSchemaName="meta_rowz";//create column                
        $obj_paramColumnPull->MetaTableName="meta_rowz";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

        $obj_paramColumnPull->MetaPullName="SettingView";
        $obj_paramColumnPull->MetaSchemaName="meta_view";//create column                
        $obj_paramColumnPull->MetaTableName="meta_view";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

        $obj_paramColumnPull->MetaPullName="meta_topup";
        $obj_paramColumnPull->MetaSchemaName="meta_user";//create column                
        $obj_paramColumnPull->MetaTableName="meta_topup";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

        $obj_paramColumnPull->MetaPullName="meta_mall";
        $obj_paramColumnPull->MetaSchemaName="meta_mall";//create column                
        $obj_paramColumnPull->MetaTableName="meta_mall";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

        $obj_paramColumnPull->MetaPullName="meta_system";
        $obj_paramColumnPull->MetaSchemaName="meta_user";//create column                
        $obj_paramColumnPull->MetaTableName="meta_system";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

        $obj_paramColumnPull->MetaPullName="meta_mover";
        $obj_paramColumnPull->MetaSchemaName="meta_user";//create column                
        $obj_paramColumnPull->MetaTableName="meta_mover";//create column                
        $this->fn_pullViewColumnz($obj_paramColumnPull, false);//required for interface pinz, where view is base

    }



    function fn_pullViewColumnz($obj_paramColumnPull, $obj_paramViewTemplate=false){                                          
        
        $this->fn_addConsole("fn_pullViewColumnz", $obj_paramColumnPull->MetaPullName);        
        
        
        if($obj_paramColumnPull->MetaColumnSystemId===$this->obj_userBase->MetaUserSystemId){        
            return false;
        }
        
        $str_sql="SELECT * 
        FROM `meta_column`.`meta_column` WHERE TRUE                         
        AND `MetaColumnSystemid`=:MetaColumnSystemIdTemplate
        AND `MetaSchemaName`=:MetaSchemaNameTemplate
        AND `MetaTableName`=:MetaTableNameTemplate        
        AND `PublishPin`
        ;";        

        //if a new view , use that schema name. otherwise use the template system schema name        
        
        $obj_paramTemplate=$obj_paramColumnPull;        
        if(!empty($obj_paramViewTemplate)){
            $obj_paramTemplate=$obj_paramViewTemplate;                     
        }
        
        $stmt=$this->fn_executeSQLStatement($str_sql, [             
            'MetaColumnSystemIdTemplate' => $obj_paramTemplate->MetaColumnSystemIdTemplate,
            'MetaSchemaNameTemplate' => $obj_paramTemplate->MetaSchemaName,
            'MetaTableNameTemplate' => $obj_paramTemplate->MetaTableName,
        ]);       
        
        $arr_rows=$stmt->fetchAll();              
        
        foreach ($arr_rows as $arr_row) {
            
            $obj_paramColumn=new stdClass;                                      
            $obj_paramColumn->MetaColumnSystemId=$obj_paramColumnPull->MetaColumnSystemId;//user 
            $obj_paramColumn->MetaColumnOwnerId=$obj_paramColumnPull->MetaColumnOwnerId;            
            $obj_paramColumn->MetaPermissionTag=$arr_row["MetaPermissionTag"];
            $obj_paramColumn->MetaSchemaName=$obj_paramColumnPull->MetaSchemaName;
            $obj_paramColumn->MetaTableName=$obj_paramColumnPull->MetaTableName;            
            $obj_paramColumn->MetaColumnName=$arr_row["MetaColumnName"];
            $obj_paramColumn->MetaColumnAPIName=$arr_row["MetaColumnAPIName"];            
            $obj_paramColumn->MetaColumnType=$arr_row["MetaColumnType"];            
            $obj_paramColumn->MetaLabel=$arr_row["MetaLabel"];            
            $obj_paramColumn->DebugPin=$arr_row["DebugPin"];            
            $obj_paramColumn->SectionTitle=$arr_row["SectionTitle"];                        
            $obj_paramColumn->FormOrder=$arr_row["FormOrder"];            
            $obj_paramColumn->PrimaryPin=$arr_row["PrimaryPin"];            
            $obj_paramColumn->InfoPin=$arr_row["InfoPin"];
            $obj_paramColumn->MenuPin=$arr_row["MenuPin"];
            $obj_paramColumn->LivePin=$arr_row["LivePin"];
            $obj_paramColumn->PublishPin=$arr_row["PublishPin"];            
            $obj_paramColumn->SearchPin=$arr_row["SearchPin"];
            $obj_paramColumn->MatchPin=$arr_row["MatchPin"];
            $obj_paramColumn->HiddenPin=$arr_row["HiddenPin"];            
            $obj_paramColumn->LockedPin=$arr_row["LockedPin"];
            $obj_paramColumn->RequiredPin=$arr_row["RequiredPin"];
            $obj_paramColumn->MaxLength=$arr_row["MaxLength"];
            $obj_paramColumn->MetaList=$arr_row["MetaList"];            
            $obj_paramColumn->MetaOption=$arr_row["MetaOption"];            
            $obj_paramColumn->MetaSQL=$arr_row["MetaSQL"];
            $obj_paramColumn->DefaultValue=$arr_row["DefaultValue"];
            $obj_paramColumn->MetaClassType=$arr_row["MetaClassType"];
            $obj_paramColumn->MetaColumnGroup=$arr_row["MetaColumnGroup"];
            $obj_paramColumn->Subdomain=$arr_row["Subdomain"];
            $obj_paramColumn->ProtectedPin=$arr_row["ProtectedPin"];
            $obj_metaColumn=new metaColumn($this);                              
            $obj_metaColumn->fn_createRecord($obj_paramColumn);
            $int_idRecordColumn=$obj_metaColumn->obj_param->MetaColumnId;
        }        
      }        
      
      
      
}//END OF CLASS
?>