<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_list extends interface_datamanager{
    function __construct() {                        
        
        parent::__construct();                                        
    }

    function fn_getAdditionalButton(){
        
           
    }   

    function fn_getDropdownListSQLSource($obj_param, $obj_metaList){     

        $MetaUserSystemId =$this->obj_userLogin->MetaUserSystemId;        
        
        
        $str_sql="";
        //exit;
        $str_sql.="FROM `$obj_param->MetaSchemaName`.`$obj_param->MetaTableName` ";        
        $str_sql.="JOIN `meta_data`.`meta_data` ON '$obj_param->MetaSchemaName'=`meta_data`.`DataSchemaName` AND '$obj_param->MetaTableName'=`meta_data`.`DataTableName` ";
        $str_sql.="AND `$obj_param->MetaSchemaName`.`$obj_param->MetaTableName`.`$obj_param->MetaTableKeyField`=`meta_data`.`DataKeyValue` ";
        $str_sql.="WHERE TRUE ";
        $str_sql.="AND `meta_data`.`MetaDataSystemId`=$MetaUserSystemId ";
        $str_sql.="AND `$obj_param->MetaTableName`.`$obj_metaList->WhereField`=:FieldTarget ";
        $str_sql.=";";
        return $str_sql;
    }

    function fn_getDropdownListSQL($obj_param, $obj_metaList, $str_listExist=false){     
        
        $str_sql="";
        $str_sql.=$this->fn_getDropdownListSQLSource($obj_param, $obj_metaList);                        
        //exit;
        
        if(!empty($str_listExist)){            
            $str_sql.=" AND `$obj_param->MetaTableName`.`$obj_metaList->SelectField` IN($str_listExist)";
        }
        $str_sql.="ORDER BY `$obj_param->MetaTableName`.`$obj_metaList->SelectField`
        ;";

        //$this->fn_varDump($str_sql, "str_sql");
        return $str_sql;
        
    }
    
    
    function fn_getDropdownList(){     

        $obj_post=$this->obj_post;

        //$this->fn_varDump("fn_getDropdownList", "fn_getDropdownList");
        //$this->fn_varDumpPost();
        //exit;
        

        //Get MetaList From Post
        $str_metaList=$obj_post->MetaList;
        $obj_metaList=$this->fn_parseMetaList($str_metaList);        
        //$this->fn_varDump($str_metaList, "str_metaList");
        //$this->fn_varDump($obj_metaList, "obj_metaList");
        //exit;
        
        
        $int_idMetaView=$obj_metaList->MetaViewId;

        $obj_metaView=new metaView($this);                                                
        $obj_metaView->fn_initialize($int_idMetaView);                
        $obj_paramView=$obj_metaView->obj_param;

        
        $FieldTarget=$obj_post->MetaColumnAPIName;        
        //$this->fn_varDump($FieldTarget, "FieldTarget");

        $MetaUserSystemId =$this->obj_userLogin->MetaUserSystemId;

        $str_sql="SELECT 
        `$obj_paramView->MetaSchemaName`.`$obj_paramView->MetaTableName`.`$obj_paramView->MetaTableKeyField` AS 'RecordId', 
        `$obj_paramView->MetaTableName`.`$obj_metaList->SelectField` ";
        $str_sql.=$this->fn_getDropdownListSQL($obj_paramView, $obj_metaList, $str_listExist=false);
        $stmt=$this->fn_executeSQLStatement($str_sql, [
            'FieldTarget'=>$FieldTarget
        ]);                 
        
        $arr_rows=$stmt->fetchAll();
        
        //$this->fn_varDump($arr_rows, "arr_rows");
        
        if($arr_rows){                 
            //$this->fn_varDump($arr_rows, "arr rows has data");
            $obj_post->RowData=json_encode($arr_rows);        
        }
        else{          
            //$this->fn_varDump($arr_rows, "arr rows is empty");
            $obj_post->RowData="[{}]";        
        }                  
    }
    function fn_parseMetaList($str_metaList){
        //$this->fn_varDump($str_metaList, "str_metaList");                
        $obj_metaList=json_decode($str_metaList);        
        //$this->fn_varDump($obj_metaList, "$obj_metaList");       
        
        return $obj_metaList;

    }

    function fn_onPushProcessList($obj_column){

        $obj_metaList=$this->fn_parseMetaList($obj_column->MetaList);                
        if($obj_metaList->ListMember){

        }
        else{
            $this->fn_updateListLink($obj_metaList);

        }
    }
    function fn_updateListLink($obj_metaList){                
        
        $obj_metaViewBlue=new metaView($this);                                                
        $obj_metaViewBlue->fn_initialize($obj_metaList->MetaViewId);                        
        $obj_paramViewBlue=$obj_metaViewBlue->obj_param;        

        $obj_paramBlue=new stdClass;
        $obj_paramBlue->MetaViewId=$obj_paramViewBlue->MetaViewId;
        $obj_paramBlue->KeyName=$obj_paramViewBlue->MetaTableKeyField;

        $obj_paramBlue->MetaSchemaName=$obj_paramViewBlue->MetaSchemaName;
        $obj_paramBlue->MetaTableName=$obj_paramViewBlue->MetaTableName;
        $obj_paramBlue->MetaTableKeyField=$obj_paramViewBlue->MetaTableKeyField;
        //$this->fn_varDump($obj_paramBlue, "obj_paramBlue");                        
        
        $obj_paramViewRed=$this->obj_metaView->obj_param;
        $obj_paramRed=new stdClass;
        $obj_paramRed->MetaViewId=$obj_paramViewRed->MetaViewId;                
        $obj_paramRed->KeyName=$obj_paramViewRed->MetaTableKeyField;
        $obj_paramRed->KeyValue=$this->obj_post->MetaKeyColumnValue;                
        //$this->fn_varDump($obj_paramRed, "obj_paramRed");                
        
        $str_listExist=false;

        $FieldTarget=$this->obj_post->MetaColumnAPIName;
        $this->fn_deleteExistingListLinks($obj_paramBlue, $obj_paramRed, $obj_metaList, $FieldTarget, $str_listExist);
        //exit;
        
        //$this->fn_varDump($this->obj_post->MetaListIdValue, "this->obj_post->MetaListIdValue", true);                
        if(empty($this->obj_post->MetaListIdValue)){
            return;
        }        
        if($this->obj_post->MetaListIdValue===""){
            return;
        }        
        
        $arr_metaListIdValue = explode(", ", $this->obj_post->MetaListIdValue);
        //$this->fn_varDump($arr_metaListIdValue, "arr_metaListIdValue", true);                                       
        
        foreach ($arr_metaListIdValue  as $str_metaListIdValue) {            
            $obj_paramBlue->KeyValue=$str_metaListIdValue;
            if(empty($obj_paramBlue->KeyValue)){
                continue;
            }
            $this->fn_insertAutoJoin($obj_paramBlue, $obj_paramRed);            
        }
    }
    function fn_deleteExistingListLinks($obj_paramBlue, $obj_paramRed, $obj_metaList, $FieldTarget, $str_listExist=false){        
        
        

        $str_sql="SET SESSION group_concat_max_len = 100000;";        
        $this->fn_executeSQLStatement($str_sql);
        $str_sql="SELECT group_concat(`$obj_paramBlue->MetaSchemaName`.`$obj_paramBlue->MetaTableName`.`$obj_paramBlue->MetaTableKeyField`) AS 'RemoveRecordId' ";        
        //$this->fn_varDump($str_sql, "str_sql");        
        //exit;        
        $str_sql.=$this->fn_getDropdownListSQL($obj_paramBlue, $obj_metaList, $str_listExist);                
        //$this->fn_varDump($str_sql, "str_sql");        
        $str_removeRecordId=$this->fn_fetchColumn($str_sql, [
            'FieldTarget'=>$FieldTarget
        ]);        
        if(!empty($str_removeRecordId)){
            $MetaUserSystemId =$this->obj_userLogin->MetaUserSystemId;        
            $str_sql="DELETE FROM `meta_link`.`meta_link` WHERE TRUE
            AND `MetaLinkSystemId`= $MetaUserSystemId
            AND `FromViewId`= $obj_paramBlue->MetaViewId
            AND `FromKeyName`= '$obj_paramBlue->KeyName'
            AND `FromKeyValue` IN($str_removeRecordId)
            AND `ToViewId`= $obj_paramRed->MetaViewId
            AND `ToKeyName`= '$obj_paramRed->KeyName'        
            AND `ToKeyValue`=$obj_paramRed->KeyValue
            ;";
            //$this->fn_varDump($str_sql, "str_sql");
            $this->fn_executeSQLStatement($str_sql);                 
        }
        

    }
    
      
      
}//END OF CLASS


?>