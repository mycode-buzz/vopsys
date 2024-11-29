<?php

class rowzAPISupport extends rowzAPIGet{        

    
    function fn_isObjectEmpty($obj_my){

        if (!is_object($obj_my)) {
            if(empty($obj_my)){
                return true;
            }
            return false;
        }

        if (empty(get_object_vars($obj_my))) {
            return true;
        } else {
            return false;
        }
    }

    

    

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

    
    function fn_trimTo($string, $length) {
        if(is_null($string)){
            return null;            
        }        
        $string=(string)$string;
        return substr($string, 0, $length);
    }    
    
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
        
        if (method_exists($this->obj_page, 'fn_varDump')) {        
            $this->obj_page->fn_varDump($foo_val, $str_message, true);        
            return;
        }
        else{
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

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="metadataownerid";
            $obj_param->MetaColumnName="MetaDataOwnerId";            
            $obj_param->MetaLabel="Mover";            
            $obj_param->MatchPin=1;                   
            $obj_param->HiddenPin=0;                                           
            $obj_param->RecordSummaryPin=0;                                  
            $obj_param->DefaultValue=$this->obj_userLogin->MetaUserId;                        
            $obj_param->MetaColumnType="RecordId";                        
            $obj_param->SectionTitle="Mover";        
            $obj_param->SectionClose=false;        
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                                            

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="metapermissiontag";
            $obj_param->MetaColumnName="MetaPermissionTag";            
            $obj_param->MetaLabel="Permission";
            $obj_param->LockedPin=0;          
            $obj_param->HiddenPin=0;                                           
            $obj_param->RecordSummaryPin=0;                        
            $obj_param->DefaultValue=$this->fn_getMetaPermissionStamp();
            $obj_param->MetaPermissionTag="#ALL WRITEONCE";            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);
            

            
            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="metadataid";            
            $obj_param->MetaColumnName="MetaDataId";            
            $obj_param->MetaLabel="MetaData Id";            
            $obj_param->LockedPin=1;                        
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="RecordId";                        
            $obj_param->PrimaryPin=true;            
            $obj_param->SectionTitle="Record Detail";        
            $obj_param->SectionClose=true;        
            $obj_param->FormPosition="End";        
            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);
            array_push($arr_metaDataColumn, $obj_metaColumn);        

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="datakeyvalue";            
            $obj_param->MetaColumnName="DataKeyValue";            
            $obj_param->MetaLabel="Record Id";            
            $obj_param->FormOrder=1;          
            $obj_param->LockedPin=1;                      
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->MetaPermissionTag="#ADMIN";
            $obj_param->MetaColumnType="RecordId";            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                    

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="metadatasystemid";
            $obj_param->MetaColumnName="MetaDataSystemId";            
            $obj_param->MetaLabel="MetaData SystemId";            
            $obj_param->LockedPin=1;            
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->DefaultValue=$this->obj_userLogin->MetaUserSystemId;            
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="RecordId";            
            $obj_param->RecordSummaryPin=1;                      
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                                            

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="dataschemaname";
            $obj_param->MetaColumnName="DataSchemaName";            
            $obj_param->MetaLabel="MetaData SchemaName";
            $obj_param->LockedPin=1;                        
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->MetaPermissionTag="#INTERFACE";            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);            

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="datatablename";
            $obj_param->MetaColumnName="DataTableName";            
            $obj_param->MetaLabel="MetaData TableName";
            $obj_param->LockedPin=1;            
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->MetaPermissionTag="#INTERFACE";            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);            

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="datakeyname";
            $obj_param->MetaColumnName="DataKeyName";            
            $obj_param->MetaLabel="MetaData KeyName";
            $obj_param->LockedPin=1;                        
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->MetaPermissionTag="#INTERFACE";            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);            
            
            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="createddate";
            $obj_param->MetaColumnName="CreatedDate";            
            $obj_param->MetaLabel="Created On";
            $obj_param->LockedPin=1;            
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->DefaultValue=$this->obj_userLogin->CreatedDate;            
            $obj_param->MetaColumnType="DateTime";  
            $obj_param->MetaOption='{"DateTimeSecond": "true"}';            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                                   

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="createdby";
            $obj_param->MetaColumnName="CreatedBy";            
            $obj_param->MetaLabel="Created By";                        
            $obj_param->LockedPin=1;            
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->DefaultValue=$this->obj_userLogin->CreatedBy;                        
            $obj_param->MetaPermissionTag="#ADMIN";            
            $obj_param->MetaColumnType="RecordId";                        
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="modifieddate";
            $obj_param->MetaColumnName="ModifiedDate";            
            $obj_param->MetaLabel="Modified On";
            $obj_param->LockedPin=1;            
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->DefaultValue=$this->obj_userLogin->ModifiedDate;            
            $obj_param->MetaColumnType="DateTime";  
            $obj_param->MetaOption='{"DateTimeSecond": "true"}';            
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                       

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="modifiedby";
            $obj_param->MetaColumnName="ModifiedBy";            
            $obj_param->MetaLabel="Modified By";                        
            $obj_param->LockedPin=1;            
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_param->DefaultValue=$this->obj_userLogin->ModifiedBy;                        
            $obj_param->MetaPermissionTag="#ADMIN";            
            $obj_param->MetaColumnType="RecordId";                        
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                                            

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="archivedate";        
            $obj_param->MetaColumnName="ArchiveDate";                            
            $obj_param->MetaLabel="Archive Date";            
            $obj_param->MetaColumnType="DateTime";            
            $obj_param->LockedPin=0;          
            $obj_param->HiddenPin=1;                                           
            $obj_param->RecordSummaryPin=1;                      
            $obj_metaColumn=$this->fn_getMetaDataColumn($obj_param);                        
            array_push($arr_metaDataColumn, $obj_metaColumn);                                                                   



            return $arr_metaDataColumn;
        }
        function fn_getMetaDataColumn($obj_param){            

            if(!isset($obj_param->MetaColumnAPIName)){$obj_param->MetaColumnAPIName="Error";}
            if(!isset($obj_param->MetaColumnName)){$obj_param->MetaColumnName="Error";}
            if(!isset($obj_param->MetaLabel)){$obj_param->MetaLabel=$obj_param->MetaColumnAPIName;}            
            if(!isset($obj_param->DebugPin)){$obj_param->DebugPin=0;}                                    
            if(!isset($obj_param->FormOrder)){$obj_param->FormOrder=1000;}                        
            if(!isset($obj_param->MenuPin)){$obj_param->MenuPin=0;}                        
            if(!isset($obj_param->MatchPin)){$obj_param->MatchPin=0;}                        
            if(!isset($obj_param->HiddenPin)){$obj_param->HiddenPin=0;}                        
            if(!isset($obj_param->LockedPin)){$obj_param->LockedPin=0;}                        
            if(!isset($obj_param->RecordSummaryPin)){$obj_param->RecordSummaryPin=0;}                        
            if(!isset($obj_param->DefaultValue)){$obj_param->DefaultValue="";}                        
            if(!isset($obj_param->MetaPermissionTag)){$obj_param->MetaPermissionTag="";}                                                
            if(!isset($obj_param->PrimaryPin)){$obj_param->PrimaryPin=false;}                                 
            if(!isset($obj_param->SectionTitle)){$obj_param->SectionTitle="";}                                
            if(!isset($obj_param->SectionClose)){$obj_param->SectionClose=false;}                                            
            if(!isset($obj_param->MetaColumnType)){$obj_param->MetaColumnType="Text";}                                                  
            if(!isset($obj_param->MetaOption)){   
                $obj_param->MetaOption=new stdClass;
                if(!empty($this->obj_page)){                                        
                    if(method_exists($this->obj_page, "fn_getMetaOptionDefault")){
                        $obj_param->MetaOption=$this->obj_page->fn_getMetaOptionDefault($obj_param->MetaColumnType);                
                    }                    
                }
            }
            
            $obj_metaColumn=new metaColumn();             
            $obj_metaColumn->MetaViewId=$this->MetaDataViewId;            
            $obj_metaColumn->MetaColumnType=$obj_param->MetaColumnType;
            $obj_metaColumn->MetaSchemaName="meta_data";            
            $obj_metaColumn->MetaTableName="meta_data";
            $obj_metaColumn->MetaTableKeyField="MetaDataId";
            $obj_metaColumn->PrimaryPin=$obj_param->PrimaryPin;    
            $obj_metaColumn->MetaColumnAPIName=strtolower($obj_param->MetaColumnAPIName);                        
            $obj_metaColumn->MetaColumnName=$obj_param->MetaColumnName;                                    
            $obj_metaColumn->MetaLabel=$obj_param->MetaLabel;
            $obj_metaColumn->DebugPin=$obj_param->DebugPin;            
            $obj_metaColumn->FormOrder=$obj_param->FormOrder;            
            $obj_metaColumn->PublishPin=0;            
            $obj_metaColumn->LivePin=1;            
            $obj_metaColumn->MenuPin=$obj_param->MenuPin;            
            $obj_metaColumn->MatchPin=$obj_param->MatchPin;            
            $obj_metaColumn->HiddenPin=$obj_param->HiddenPin;            
            $obj_metaColumn->LockedPin=$obj_param->LockedPin;                                    
            $obj_metaColumn->RecordSummaryPin=$obj_param->RecordSummaryPin;                                    
            $obj_metaColumn->RequiredPin=0;      
            $obj_metaColumn->MaxLength=100;            
            $obj_metaColumn->MetaOption=$obj_param->MetaOption;                            
            $obj_metaColumn->DefaultValue=$obj_param->DefaultValue;
            $obj_metaColumn->MetaPermissionTag=$obj_param->MetaPermissionTag;//relates to permission to show these meta tags in the meta tag row
            $obj_metaColumn->IsMetaData=true;        
            $obj_metaColumn->SectionTitle=$obj_param->SectionTitle;  
            $obj_metaColumn->SectionClose=$obj_param->SectionClose;              
            
            return $obj_metaColumn;            
        }

        function fn_collateMetaUser(){       

            $arr_metaUserColumn=[];
            $obj_param=new stdClass;            
            $obj_param->MetaColumnAPIName="MetaUserId";            
            $obj_param->LockedPin=1;                        
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="RecordId";                                  
            $obj_metaColumn=$this->fn_getMetaUserColumn($obj_param);
            array_push($arr_metaUserColumn, $obj_metaColumn);                    

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="MetaHomeSystemId";            
            $obj_param->LockedPin=1;                        
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="RecordId";                                  
            $obj_metaColumn=$this->fn_getMetaUserColumn($obj_param);
            array_push($arr_metaUserColumn, $obj_metaColumn);       
            
            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="MetaUserGroupId";            
            $obj_param->LockedPin=1;                        
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="RecordId";                                  
            $obj_metaColumn=$this->fn_getMetaUserColumn($obj_param);
            array_push($arr_metaUserColumn, $obj_metaColumn);       
            
            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="MetaUserSystemId";            
            $obj_param->LockedPin=1;                        
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="RecordId";                                  
            $obj_metaColumn=$this->fn_getMetaUserColumn($obj_param);
            array_push($arr_metaUserColumn, $obj_metaColumn);  
            
            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="MetaUserEmail";            
            $obj_param->LockedPin=1;                        
            $obj_param->MetaPermissionTag="#INTERFACE";
            $obj_param->MetaColumnType="Email";               
            $obj_metaColumn=$this->fn_getMetaUserColumn($obj_param);
            array_push($arr_metaUserColumn, $obj_metaColumn);  

            $obj_param=new stdClass;
            $obj_param->MetaColumnAPIName="MetaUserAtTag";            
            $obj_param->LockedPin=1;                        
            $obj_param->MetaPermissionTag="#INTERFACE";         
            
            $obj_metaColumn=$this->fn_getMetaUserColumn($obj_param);
            array_push($arr_metaUserColumn, $obj_metaColumn);                              
            
            return $arr_metaUserColumn;
        }
        function fn_getMetaUserColumn($obj_param){
            
            if(!isset($obj_param->MetaColumnAPIName)){$obj_param->MetaColumnAPIName="Error";}
            if(!isset($obj_param->MetaLabel)){$obj_param->MetaLabel=$obj_param->MetaColumnAPIName;}            
            if(!isset($obj_param->DebugPin)){$obj_param->DebugPin=0;}                                    
            if(!isset($obj_param->FormOrder)){$obj_param->FormOrder=100;}                        
            if(!isset($obj_param->MenuPin)){$obj_param->MenuPin=0;}                        
            if(!isset($obj_param->MatchPin)){$obj_param->MatchPin=0;}                        
            if(!isset($obj_param->HiddenPin)){$obj_param->HiddenPin=1;}                        
            if(!isset($obj_param->LockedPin)){$obj_param->LockedPin=0;}                        
            if(!isset($obj_param->DefaultValue)){$obj_param->DefaultValue="";}                        
            if(!isset($obj_param->MetaPermissionTag)){$obj_param->MetaPermissionTag="";}                                                
            if(!isset($obj_param->PrimaryPin)){$obj_param->PrimaryPin=false;}                                 
            if(!isset($obj_param->SectionTitle)){$obj_param->SectionTitle="";}                                
            if(!isset($obj_param->MetaColumnType)){$obj_param->MetaColumnType="Text";}                                                              
            if(!isset($obj_param->MetaOption)){   
                $obj_param->MetaOption=new stdClass;
                if(!empty($this->obj_page)){                                        
                    if(method_exists($this->obj_page, "fn_getMetaOptionDefault")){
                        $obj_param->MetaOption=$this->obj_page->fn_getMetaOptionDefault($obj_param->MetaColumnType);                
                    }                    
                }
            }

            $obj_metaColumn=new metaColumn();                         
            $obj_metaColumn->MetaViewId=$this->MetaUserViewId;           
            $obj_metaColumn->MetaColumnType=$obj_param->MetaColumnType;
            $obj_metaColumn->MetaSchemaName="meta_user";            
            $obj_metaColumn->MetaTableName="meta_user";
            $obj_metaColumn->MetaTableKeyField="MetaUserId";
            $obj_metaColumn->PrimaryPin=$obj_param->PrimaryPin;    
            $obj_metaColumn->MetaColumnAPIName=strtolower($obj_param->MetaColumnAPIName);
            $obj_metaColumn->MetaColumnName=$obj_param->MetaColumnAPIName;                                    
            $obj_metaColumn->MetaLabel=$obj_param->MetaLabel;
            $obj_metaColumn->DebugPin=$obj_param->DebugPin;            
            $obj_metaColumn->FormOrder=$obj_param->FormOrder;
            $obj_metaColumn->PublishPin=0;            
            $obj_metaColumn->LivePin=1;            
            $obj_metaColumn->MenuPin=$obj_param->MenuPin;            
            $obj_metaColumn->MatchPin=$obj_param->MatchPin;            
            $obj_metaColumn->HiddenPin=$obj_param->HiddenPin;            
            $obj_metaColumn->LockedPin=$obj_param->LockedPin;                                    
            $obj_metaColumn->RequiredPin=0;                            
            $obj_metaColumn->MaxLength=100;            
            $obj_metaColumn->MetaOption=$obj_param->MetaOption;                            
            $obj_metaColumn->DefaultValue=$obj_param->DefaultValue;
            $obj_metaColumn->MetaPermissionTag=$obj_param->MetaPermissionTag;//relates to permission to show these meta tags in the meta tag row
            $obj_metaColumn->IsMetaData=true;        
            $obj_metaColumn->SectionTitle=$obj_param->SectionTitle;      

            return $obj_metaColumn;
        }              

        function fn_getMetaOptionDefault($MetaColumnType){
        
            switch(strtolower($MetaColumnType)){
                case "text":
                    return $this->MetaOptionDefaultText;            
                case "recordid":
                    return $this->MetaOptionDefaultRecordId;                        
                case "percent":
                case "number":
                    return $this->MetaOptionDefaultNumber;                        
                case "checkbox":
                    return $this->MetaOptionDefaultCheckbox;                        
                case "date":
                    return $this->MetaOptionDefaultDate;                        
                case "datetime":
                    return $this->MetaOptionDefaultDateTime;                        
                case "json":
                    return $this->MetaOptionDefaultJSON;                        
            }    
        }
}//end of class