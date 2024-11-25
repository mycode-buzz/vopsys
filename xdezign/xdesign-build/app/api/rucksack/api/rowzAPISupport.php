<?php

class rowzAPISupport extends rowzAPIGet{        

    

    //System Function    
    function fn_getObjectProperty($obj_my, $str_label){            

        if($str_label=="metauserid"){//debug
            //*
            $this->fn_varDump($obj_my, "obj_my");                      
            $this->fn_varDump($str_label, "str_label");                                                  
            //*/                   
        }
        
    
        if(empty($obj_my->{$str_label})){
            $str_label=strtolower($str_label);     
        }
        return $obj_my->{$str_label};             
    }
    function fn_getArrayMember($arr_my, $str_label){
    
        if(empty($arr_my[$str_label])){
            $str_label=strtolower($str_label);     
        }
        return $arr_my[$str_label];             
    }
    
    function fn_cleanAPITag($str_tag){
        $str_tag=strtoupper(trim($str_tag));
        $str_tag=$this->fn_removeAfterChar($str_tag, " ");
        $str_tag=strtoupper(trim($str_tag));
        return $str_tag;
    }
    
    function fn_getMetaDataJoin($obj_call){
        
        $obj_metaView=$obj_call->obj_metaView;                
        $obj_paramView=$obj_metaView->obj_param;
        $MetaViewId=$obj_paramView->MetaViewId;

        
        $KeyValue=$obj_metaView->fn_getFQSNKey();

        
        
        //this function is refrenced in the main body of the code

        //$this->fn_addEcho("Adding join to meta_data owner  ");                                
        $str_sql="";
        if($MetaViewId!=$this->MetaDataViewId){
        $str_sql.=" JOIN `meta_data`.`meta_data` 
            ON '".$obj_paramView->MetaSchemaName."'=`meta_data`.`DataSchemaName` 
            AND '".$obj_paramView->MetaTableName."'=`meta_data`.`DataTableName` 
            AND `".$obj_paramView->MetaSchemaName."`.`".$obj_paramView->MetaTableName."`.`".$obj_paramView->MetaTableKeyField."`=`meta_data`.`DataKeyValue`
            ";
        }
        $str_sql.="JOIN `meta_user`.`meta_user` 
        ON `meta_data`.`MetaDataOwnerId`=`meta_user`.`MetaUserId` ";

        if($obj_call->get_autojoin){
            
            $str_sql.="JOIN `meta_link`.`meta_link` ";
            $str_sql.=
            "
            ON
            (
            FromViewId=$obj_paramView->MetaViewId
            AND FromKeyName='$obj_paramView->MetaTableKeyField'
            AND FromKeyValue=$KeyValue
            AND ToViewId=$obj_call->JoinView                
            AND ToKeyName='$obj_call->JoinKeyName'
            AND ToKeyValue=$obj_call->JoinKeyValue
            )
            OR
            (
            ToViewId=$obj_paramView->MetaViewId
            AND ToKeyName='$obj_paramView->MetaTableKeyField'
            AND ToKeyValue=$KeyValue
            AND FromViewId=$obj_call->JoinView                
            AND FromKeyName='$obj_call->JoinKeyName'
            AND FromKeyValue=$obj_call->JoinKeyValue
            )
            ";
        }
            
        return $str_sql;
    }    
        
    function fn_parseViewId($str_key){
        $str_viewId="";
        if(!empty($str_key) && $this->fn_inString($str_key, ".")){
            $arr_key=explode(".", $str_key);        
            $str_viewId=$arr_key[0];
        }
        return $str_viewId;    
    }
    //System Function    

    //Validate Function    
    function fn_validateView($obj_metaView, $MetaViewId){
        $bln_validView=$this->fn_validView($obj_metaView);
        if(empty($bln_validView)){
            $this->fn_setErrorView($MetaViewId);                    
            return false;
        }
        return true;
        }
    
        function fn_validView($obj_metaView){
            $obj_paramView=$obj_metaView->obj_param;
            if(empty($obj_paramView->ValidView)){
                return false;
            }
            return true;
        }

    function fn_validateJSONDecode($result){
        if(is_null($result)){            
            return false;
        }        
        return true;
    }
    function fn_isObject($obj){
        if(gettype($obj)==="object"){return true;}
        return false;
        } 
    //Validate Function
    
    function fn_trimEnd($string, $word) {
        // Create a pattern to match the word at the end of the string
        $pattern = '/\s*' . preg_quote($word, '/') . '$/';
        // Replace the word at the end with an empty string
        $trimmedString = preg_replace($pattern, '', $string);
        return $trimmedString;
    }    

    function fn_removeAfterChar($string, $char) {
        $position = strpos($string, $char);
        if ($position !== false) {
            return substr($string, 0, $position);
        }
        return $string; // Return the original string if no space is found
    }

    function fn_addEcho  ($str_message, $foo_val=""){
        $this->fn_addConsoleAPI($str_message, $foo_val);
    }
    function fn_addConsole($str_message, $foo_val=""){              
        $str_content=$str_message."<BR />";
        $str_content.=var_dump($foo_val)."<BR />";
        echo($str_content);
    }        
    function fn_varDumpAPI($foo_val=false, $str_message="DUMP", $bln_console=false){            
        $this->fn_varDump($foo_val, $str_message, $bln_console);
    }    
    function fn_varDump($foo_val=false, $str_message="DUMP", $bln_console=false){        
        
        $bln_proceed=true;
        if(!empty($this->obj_page)){
            if(!empty($this->obj_page->fn_varDump)){
              $this->obj_page->fn_varDump($foo_val, $str_message, true);        
              $bln_proceed=false;
            }
        }
        if($bln_proceed){
            $str_val=var_export($foo_val, true);
            $this->fn_addConsole($str_message, $str_val);        
        }
    }

    function fn_varExportAPI($foo_val){      
        return var_export($foo_val, true);            
        }
    function fn_setError($str_message="Error"){
        $this->response->status_code=500;
        $this->response->status_message="[$str_message]";                                                
    }
    function fn_setErrorView($MetaViewId){            
        $this->response->status_code=490;            
        $this->response->status_message="Invalid View Found: [".$MetaViewId."]";                                                
    }
    function fn_setErrorLogin($str_message){    
        $this->obj_post->HasLoginError=true;            
        $this->fn_setError($str_message);
    } 
    function fn_getDateFromString($dateString){
        return  DateTime::createFromFormat("Y-m-d H:i:s", $dateString);
    }
    function fn_protectSQLValue($str_value){             
        
        if(empty($str_value)){        
            return "";
        }      
        if($str_value==="''"){        
            return "";
        }      
        $arr_remove = array("SELECT", "FROM", "*", "COUNT(*)", "INSERT", "UPDATE", "DELETE", "WHERE", "HAVING", "TRUE", "FALSE", "0");      
        $arr_value=explode(" ", $str_value);                       
        $arr_value=array_udiff($arr_value, $arr_remove, 'strcasecmp');      
        $str_value=implode("", $arr_value);            
        return $str_value;      
        }
        function fn_stripSpace($str){    
        return preg_replace('/\s+/', '', $str);
        } 
        function fn_inString($str_haystack, $str_needle){

        $int_pos=strpos($str_haystack, $str_needle);
        if($int_pos===false){return false;}
        else return true;
        }

        function fn_getMetaPermissionStamp(){

            $MetaPermissionStamp=$this->obj_userLogin->MetaPermissionStamp;            
            if(empty($MetaPermissionStamp)){
                $MetaPermissionStamp=$this->obj_userLogin->MetaPermissionTag;                
            }            
            return $this->fn_removePermissionDetail($MetaPermissionStamp);            
        }
        function fn_removePermissionDetail($MetaPermissionStamp){
        
            $arr_metaPermissionTag = explode("#", $MetaPermissionStamp);        
            $int_count=count($arr_metaPermissionTag);                
            $arr_clean=[];
            for($i=0;$i<$int_count;$i++) {                                                                               
                
                $str_metaPermissionTag=$this->fn_cleanAPITag($arr_metaPermissionTag[$i]);
                if(empty($str_metaPermissionTag)){
                    continue;
                }
                /*
                if(strtoupper($str_metaPermissionTag)==="ADMIN"){
                    $str_metaPermissionTag="ALL";                
                }
                //*/
                array_push($arr_clean, "#".$str_metaPermissionTag);
            } 
            return implode(" ", $arr_clean);        
        }

        function fn_onZeroCredit(){
            $MetaSystemId=$this->obj_userLogin->MetaUserSystemId;
            $str_sql="UPDATE `meta_user`.`meta_system` SET        
            `Credit`=:Credit        
            WHERE TRUE
            AND `MetaSystemId`=:MetaSystemId;
            ";                    
            $stmt=$this->fn_executeSQLStatement($str_sql, [
                'MetaSystemId' => $MetaSystemId,
                'Credit' => 0,
                
            ]);            
    
            $str_sql="UPDATE `meta_user`.`meta_mover` SET
              `meta_mover`.`SessionPin`=1
              WHERE TRUE 
              AND MetaMoverSystemId=:MetaMoverSystemId 
              AND MetaMoverType='User'
              ;";                              
              $stmt=$this->fn_executeSQLStatement($str_sql, [
                'MetaSystemId' => $MetaSystemId
              ]);        
        }
    
    

        function fn_addMetaData(){            
            return $this->fn_collateMetaData();                                                
        }
        function fn_addMetaUser(){            
            return $this->fn_collateMetaUser();                                    
        }
        function fn_collateMetaData(){                                    

            $arr_metaDataColumn=[];
        
            $obj_metaColumn=$this->fn_getMetaDataColumn("MetaDataId", "MetaDataId", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Text", $DateTime=0, $DateTimeSecond=0, $PrimaryPin=true, $SectionTitle="Meta");
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("DataKeyValue", "Key", $DebugPin=0, $FormOrder=1, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue="", $MetaPermissionTag="#ADMIN");            
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("MetaDataSystemId", "MetaDataSystemId", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue=$this->obj_userLogin->MetaUserSystemId, $MetaPermissionTag="#INTERFACE");            
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("MetaDataOwnerId", "Owner", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=1, $HiddenPin=0, $LockedPin=0, $DefaultValue=$this->obj_userLogin->MetaUserId, $MetaPermissionTag="");            
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("ArchiveDate", "Archive Date", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=0, $DefaultValue="", $MetaPermissionTag="", $MetaType="Date", $DateTime=1);
            array_push($arr_metaDataColumn, $obj_metaColumn);                    
            
            $MetaPermissionStamp=$this->fn_getMetaPermissionStamp();
            $obj_metaColumn=$this->fn_getMetaDataColumn("MetaPermissionTag", "Permission", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=0, $DefaultValue=$MetaPermissionStamp, $MetaPermissionTag="#ALL WRITEONCE");
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("DataSchemaName", "Schema Name", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue="", $MetaPermissionTag="#INTERFACE");            
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("DataTableName", "Table Name", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1,  $DefaultValue="", $MetaPermissionTag="#INTERFACE");            
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("DataKeyName", "Key Name", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue="", $MetaPermissionTag="#INTERFACE");            
            array_push($arr_metaDataColumn, $obj_metaColumn);        

            
            
            $obj_metaColumn=$this->fn_getMetaDataColumn("ModifiedDate", "Modified Date", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue=$this->obj_userLogin->ModifiedDate, $MetaPermissionTag="", $MetaType="DateTime", $DateTime=1, $DateTimeSecond=1);
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("ModifiedBy", "Modified By", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue=$this->obj_userLogin->ModifiedBy, $MetaPermissionTag="#ADMIN");
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("CreatedDate", "Created Date", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue=$this->obj_userLogin->CreatedDate, $MetaPermissionTag="", $MetaType="DateTime", $DateTime=1, $DateTimeSecond=1);
            array_push($arr_metaDataColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaDataColumn("CreatedBy", "Created By", $DebugPin=0, $FormOrder=100, $MenuPin=0, $MatchPin=0, $HiddenPin=0, $LockedPin=1, $DefaultValue=$this->obj_userLogin->CreatedBy, $MetaPermissionTag="#ADMIN");
            array_push($arr_metaDataColumn, $obj_metaColumn);        

            return $arr_metaDataColumn;
        }
        function fn_getMetaDataColumn(            
            $MetaColumnName, 
            $MetaLabel, 
            $DebugPin=0,
            $FormOrder=100, 
            $MenuPin="0",
            $MatchPin=0, 
            $HiddenPin=0, 
            $LockedPin=0, 
            
            $DefaultValue="",         
            $MetaPermissionTag="", 
            $MetaType="Text",      
            $DateTime=0, 
            $DateTimeSecond=0,   
            $PrimaryPin=false, 
            $SectionTitle=""
            ){
                
        
            $obj_metaColumn=new metaColumn();             
            $obj_metaColumn->MetaViewId=$this->MetaDataViewId;
            $obj_metaColumn->MetaType=$MetaType;
            $obj_metaColumn->MetaSchemaName="meta_data";            
            $obj_metaColumn->MetaTableName="meta_data";
            $obj_metaColumn->MetaTableKeyField="MetaDataId";
            $obj_metaColumn->PrimaryPin=$PrimaryPin;    
            $obj_metaColumn->MetaColumnName=$MetaColumnName;                        
            $obj_metaColumn->MetaColumnAPIName=$MetaColumnName;            
            $obj_metaColumn->MetaLabel=$MetaLabel;
            $obj_metaColumn->DebugPin=$DebugPin;
            $obj_metaColumn->FormOrder=$FormOrder;
            $obj_metaColumn->PublishPin=0;            
            $obj_metaColumn->LivePin=true;            
            $obj_metaColumn->MenuPin=$MenuPin;            
            $obj_metaColumn->MatchPin=$MatchPin;            
            $obj_metaColumn->HiddenPin=$HiddenPin;            
            $obj_metaColumn->LockedPin=$LockedPin;            
            $obj_metaColumn->Decimal=0;                
            $obj_metaColumn->UnSigned=0;                            
            $obj_metaColumn->MaxLength=25;
            $obj_metaColumn->RequiredPin=0;                            
            $obj_metaColumn->DateTime=$DateTime;                
            $obj_metaColumn->DateTimeSecond=$DateTimeSecond;                
            $obj_metaColumn->DefaultValue=$DefaultValue;
            $obj_metaColumn->MetaPermissionTag=$MetaPermissionTag;//relates to permission to show these meta tags in the meta tag row
            $obj_metaColumn->IsMetaData=true;        
            $obj_metaColumn->SectionTitle=$SectionTitle;  
            return $obj_metaColumn;
            
        }

        
        function fn_collateMetaUser(){       

            $arr_metaUserColumn=[];
            
            $obj_metaColumn=$this->fn_getMetaUserColumn("MetaUserId", "MetaUserId", $DebugPin=0, $FormOrder=100,$HiddenPin=0, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Text");                           
            array_push($arr_metaUserColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaUserColumn("MetaHomeSystemId", "MetaHomeSystemId", $DebugPin=0, $FormOrder=100, $HiddenPin=0, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Number");                           
            array_push($arr_metaUserColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaUserColumn("MetaUserGroupId", "MetaUserGroupId", $DebugPin=0, $FormOrder=100, $HiddenPin=0, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Number");                                   
            array_push($arr_metaUserColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaUserColumn("MetaUserSystemId", "MetaUserSystemId", $DebugPin=0, $FormOrder=100, $HiddenPin=0, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Number");                                   
            array_push($arr_metaUserColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaUserColumn("MetaUserEmail", "MetaUserEmail", $DebugPin=0, $FormOrder=100, $HiddenPin=0, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Email");                                           
            array_push($arr_metaUserColumn, $obj_metaColumn);        
            $obj_metaColumn=$this->fn_getMetaUserColumn("MetaUserAtTag", "MetaUserAtTag", $DebugPin=0, $FormOrder=100, $HiddenPin=0, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="#INTERFACE", $MetaType="Text");                           
            array_push($arr_metaUserColumn, $obj_metaColumn);        

            return $arr_metaUserColumn;
        }
        function fn_getMetaUserColumn($MetaColumnName, $MetaLabel, $DebugPin, $FormOrder, $HiddenPin=true, $LockedPin=true, $DefaultValue="", $MetaPermissionTag="", $MetaType="Text", $PrimaryPin=false, $SectionTitle=""){
    
            $obj_metaColumn=new metaColumn();                                                                        
            $obj_metaColumn->MetaViewId=$this->MetaUserViewId;           
            $obj_metaColumn->MetaType=$MetaType;
            $obj_metaColumn->MetaSchemaName="meta_user";            
            $obj_metaColumn->MetaTableName="meta_user";
            $obj_metaColumn->MetaTableKeyField="MetaUserId";
            $obj_metaColumn->PrimaryPin=$PrimaryPin;    
            $obj_metaColumn->MetaColumnName=$MetaColumnName;                                
            $obj_metaColumn->MetaColumnAPIName=$MetaColumnName;
            $obj_metaColumn->MetaLabel=$MetaLabel;
            $obj_metaColumn->DebugPin=$DebugPin;
            $obj_metaColumn->FormOrder=$FormOrder;
            $obj_metaColumn->PublishPin=0;            
            $obj_metaColumn->LivePin=true;
            $obj_metaColumn->HiddenPin=$HiddenPin;            
            $obj_metaColumn->LockedPin=$LockedPin;            
            $obj_metaColumn->DefaultValue=$DefaultValue;
            $obj_metaColumn->MetaPermissionTag=$MetaPermissionTag;//relates to permission to show these meta tags in the meta tag row
            $obj_metaColumn->IsMetaData=true;        
            $obj_metaColumn->SectionTitle=$SectionTitle;                
            return $obj_metaColumn;        
        }        
}//end of class