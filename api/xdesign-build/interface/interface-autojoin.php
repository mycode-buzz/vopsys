<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_autojoin extends interface_get{
    function __construct() {                        
        
        parent::__construct();                                        
    }    

    function fn_initialize() {        
        
        parent::fn_initialize();        
        

        $obj_metaViewLink=new metaView($this);
        $obj_metaViewLink->fn_initialize($this->MetaLinkViewId);                                            
        $this->obj_metaViewLink=$obj_metaViewLink;
    }

    function fn_insertAutoJoinOnLinkOn(){
        
        $obj_paramFrom=new stdClass;
        $obj_paramFrom->MetaViewId=$this->obj_metaView->obj_param->MetaViewId;                
        $obj_paramFrom->KeyName=$this->obj_metaView->obj_param->MetaTableKeyField;
        $obj_paramFrom->KeyValue=$this->obj_post->AutoJoinFromKeyValue;                
        $obj_paramTo=$this->fn_getJoinToSource();
        $this->fn_insertAutoJoin($obj_paramFrom, $obj_paramTo);
        $this->fn_checkMetaListUpdate($obj_paramFrom, $obj_paramTo, $bln_addValue=true);
        //*/
    }

    

    function fn_removeAutoJoinOnLinkOff(){

        $obj_paramFrom=new stdClass;
        $obj_paramFrom->MetaViewId=$this->obj_metaView->obj_param->MetaViewId;             
        $obj_paramFrom->KeyName=$this->obj_metaView->obj_param->MetaTableKeyField;
        $obj_paramFrom->KeyValue=$this->obj_post->AutoJoinFromKeyValue;                        
        $obj_paramTo=$this->fn_getJoinToSource();         
        
        $this->fn_removeAutoJoin($obj_paramFrom, $obj_paramTo);
        $this->fn_checkMetaListUpdate($obj_paramFrom, $obj_paramTo, $bln_addValue=false);

        
    }
    function fn_removeAutoJoin($obj_paramFrom, $obj_paramTo){  
        
        ////////////////////
        $obj_callBack=$this->fn_autoJoinGetPatchRequest($obj_paramFrom, $obj_paramTo);
        
        if(empty($obj_callBack)){//Does not exist            
            return;
        }               
        $this->fn_validateAPICallBack($obj_callBack, false);        
        
        
        $int_idRecord=$this->obj_metaViewLink->fn_getIdValue($obj_callBack);

        $obj_param=new stdClass;                            
        $obj_param->MetaColumnAPIName="deletedate";                    
        $obj_param->MetaColumnValue=$this->str_runtime;                                                                
        $obj_requestBody=$this->obj_metaViewLink->fn_getAPIPatchRequestBody($obj_param);                                     
        
        $obj_callBack=$this->fn_callAPIPatch($this->obj_metaViewLink, $int_idRecord, $obj_requestBody);
    }   


    function fn_checkMetaListUpdate($obj_keyFrom, $obj_keyTo, $bln_addValue=false){

        //$obj_paramFrom, $obj_paramTo are pseudo params
        //necessary to get actuall views and params

        $int_idMetaViewFrom=$obj_keyFrom->MetaViewId;
        $int_idMetaViewTo=$obj_keyTo->MetaViewId;


        $obj_metaViewTo=new MetaView($this);
        $obj_metaViewTo->fn_initialize($int_idMetaViewTo);                        
        $obj_paramTo=$obj_metaViewTo->obj_param;

        $obj_metaViewFrom=new MetaView($this);
        $obj_metaViewFrom->fn_initialize($int_idMetaViewFrom);
        $obj_paramFrom=$obj_metaViewFrom->obj_param;

        
        $arr_columnTo=$obj_metaViewTo->fn_getMetaListColumn($int_idMetaViewFrom);

        foreach($arr_columnTo as $obj_columnTo){
            
            //get target field/value
            $srt_fieldTarget=$obj_columnTo->MetaColumnAPIName;
            //get target value
            
            //get meta list components            
            $str_metaListTo=$obj_columnTo->MetaList;                        
            $arr_metaListTo = explode(".", $str_metaListTo);
            $str_viewFromID=$arr_metaListTo[0];
            $str_viewFromDisplay=$arr_metaListTo[1];
            $str_viewFromField=$arr_metaListTo[2];         
            //get meta list components
            
            //*
            $this->fn_varDump($str_viewFromID, "str_viewFromID");
            $this->fn_varDump($str_viewFromDisplay, "str_viewFromDisplay");
            $this->fn_varDump($str_viewFromField, "str_viewFromField");
            //*/

            //get relevant value in rowfrom

            //e.g Select Name From TagTable WHERE Group = 'Status'
            //e.g Engineering
            $str_sql="SELECT `$str_viewFromDisplay` FROM  `$obj_paramFrom->MetaSchemaName`.`$obj_paramFrom->MetaTableName` 
            WHERE TRUE
            AND `$obj_paramFrom->MetaTableName`.`$str_viewFromField`='$srt_fieldTarget'            
            AND `$obj_paramFrom->MetaTableName`.`$obj_paramFrom->MetaTableKeyField`=$obj_keyFrom->KeyValue
            ;";                        

            $str_valueFrom=$this->fn_fetchColumn($str_sql);
            if(empty($str_valueFrom)){
               continue; 
            }
            //get relevant value in rowfrom            
            
            //get relevant value in rowto
            //e.g Select Status from CompanyTable WHERE id=CompanyTableKey
            //e.g CompanyTable.Status Exisitng Value= Pharma,Sport
            $str_sql="SELECT `$srt_fieldTarget` FROM  `$obj_paramTo->MetaSchemaName`.`$obj_paramTo->MetaTableName`             
            WHERE TRUE            
            AND `$obj_paramTo->MetaTableName`.`$obj_paramTo->MetaTableKeyField`=$obj_keyTo->KeyValue
            ;";                                    

            $str_valueTo=$this->fn_fetchColumn($str_sql);
            //get relevant value in rowto

            //get if exist
            //strpos haystack needle Pharma,Sport contains Engineering
            $bln_valueExist=$this->fn_inString(",".$str_valueTo.",", ",".$str_valueFrom.",");
            //get if exist            

            //compose new value
            if($bln_addValue){
                //if already exist, continue                
                if($bln_valueExist){continue;}                        
                $str_valueNew=$str_valueTo.",".$str_valueFrom;                
            }
            else{                
                //if dont exist, continue                
                if(!$bln_valueExist){continue;}                        
                $str_valueNew=$this->fn_replace($str_valueFrom, ",", $str_valueTo);                
            }

            $str_valueNew=$this->fn_replace(",,", "", $str_valueNew);            
            
            $bln_comma=$this->fn_isComposedOfChar($str_valueNew, ",");
            if($bln_comma){
                $str_valueNew="";
            }            

            if(!empty($str_valueNew)){
                //sort new array
                $arr_valueNew = explode(",", $str_valueNew);                            
                natcasesort($arr_valueNew);                
                $str_valueNew=implode(",", $arr_valueNew);
                $this->fn_varDump($str_valueNew, "result str_valueNew");
                //sort new array
            }
            
            
            $str_valueNew=$this->fn_trimBoth($str_valueNew, ",");
            //update field target
            $str_sql="UPDATE `$obj_paramTo->MetaSchemaName`.`$obj_paramTo->MetaTableName`             
            SET `$srt_fieldTarget`='$str_valueNew'
            WHERE TRUE            
            AND `$obj_paramTo->MetaTableName`.`$obj_paramTo->MetaTableKeyField`=$obj_keyTo->KeyValue
            ;";                        
            $this->fn_executeSQLStatement($str_sql);
            //update field target
        }
    }
    
    function fn_getJoinToSource(){
       
        $obj_param=new stdClass;
        $obj_param->MetaViewId=$this->obj_post->AutoJoinToSource;
        $obj_param->KeyName=$this->obj_post->AutoJoinToKeyName;          
        $obj_param->KeyValue=$this->obj_post->AutoJoinToKeyValue;             
        return $obj_param;
    }

    function fn_autoJoinGetRequestObject($obj_paramFrom, $obj_paramTo){          

        $MetaUserSystemId =$this->obj_userLogin->MetaUserSystemId;        
        $MetaLinkViewId=$this->MetaLinkViewId;

        
        $arr_param=Array(                                   
            "$MetaLinkViewId.metalinksystemid"=>$MetaUserSystemId,
            "$MetaLinkViewId.deletedate"=>"IS NULL"
        );                          
        
        $arr_paramFrom=$this->fn_autoJoinGetDirectionParam("From", $obj_paramFrom);        
        $arr_paramTo=$this->fn_autoJoinGetDirectionParam("To", $obj_paramTo);        
        $str_requestBody=json_encode(array_merge($arr_param, $arr_paramFrom, $arr_paramTo));                                
        $obj_requestBody=json_decode($str_requestBody);
        return $obj_requestBody;
    }

    function fn_autoJoinGetDirectionParam($str_direction, $obj_param){
        
        $MetaLinkViewId=$this->MetaLinkViewId;

        return Array(                       
            "$MetaLinkViewId.$str_direction"."viewid"=>$obj_param->MetaViewId,            
            "$MetaLinkViewId.$str_direction"."keyname"=>$obj_param->KeyName,
            "$MetaLinkViewId.$str_direction"."keyvalue"=>$obj_param->KeyValue
        );

        /*
        $MetaLinkViewId=$this->MetaLinkViewId;

        return Array(                       
            "$MetaLinkViewId.$str_direction"."schema"=>$obj_param->SchemaName,
            "$MetaLinkViewId.$str_direction"."table"=>$obj_param->TableName,
            "$MetaLinkViewId.$str_direction"."keyname"=>$obj_param->KeyName,
            "$MetaLinkViewId.$str_direction"."keyvalue"=>$obj_param->KeyValue
        );
        //*/
    }


    function fn_insertAutoJoin($obj_paramFrom, $obj_paramTo){  
        
        $obj_requestBody=$this->fn_autoJoinGetPostRequest($obj_paramFrom, $obj_paramTo);        
        
        if(empty($obj_requestBody)){//Exists already
            return;
        }              
        
        $obj_callBack=$this->fn_callAPIPost($this->obj_metaViewLink, $obj_requestBody, false);                                                                
        
        $this->fn_validateAPICallBack($obj_callBack, false);//true to debug
    }   

    function fn_autoJoinGetPostRequest($obj_paramFrom, $obj_paramTo){

        $obj_requestBodyA=$this->fn_autoJoinGetRequestObject($obj_paramFrom, $obj_paramTo);                
        $obj_callBackA=$this->fn_doAutoJoinCheckExist($obj_requestBodyA);
        if(!empty($obj_callBackA)){
            return false;
        }                                    

        $obj_requestBodyB=$this->fn_autoJoinGetRequestObject($obj_paramTo, $obj_paramFrom);                
        $obj_callBackB=$this->fn_doAutoJoinCheckExist($obj_requestBodyB);        
        if(!empty($obj_callBackB)){
            return false;
        }

        return $obj_requestBodyA;
    }

    function fn_autoJoinGetPatchRequest($obj_paramFrom, $obj_paramTo){

        $obj_requestBodyA=$this->fn_autoJoinGetRequestObject($obj_paramFrom, $obj_paramTo);                
        $obj_callBackA=$this->fn_doAutoJoinCheckExist($obj_requestBodyA);
        if(!empty($obj_callBackA)){
            return $obj_callBackA;
        }                                 
        $obj_requestBodyB=$this->fn_autoJoinGetRequestObject($obj_paramTo, $obj_paramFrom);                
        $obj_callBackB=$this->fn_doAutoJoinCheckExist($obj_requestBodyB);
        if(!empty($obj_callBackB)){
            return $obj_callBackB;
        }
        return false;
    }

    
    function fn_doAutoJoinCheckExist($obj_requestBody){          
        
        
        $obj_param=$this->obj_rowzAPI->fn_getRequest();
        $obj_param->view_id=$this->obj_metaViewLink->obj_param->MetaViewId;   
                        
        $select_column=$this->obj_metaViewLink->fn_getIdKey();
        $arr_selectColumn=array($select_column);
        $select_column=json_encode($arr_selectColumn);                                                                             
        $obj_param->select_column=$select_column;                                                                                
        $this->obj_rowzAPI->fn_buildEndPoint($obj_param);                                             
        
        $obj_callBack=$this->fn_callAPIGet($obj_param, $obj_requestBody);                                                         
        $this->fn_validateAPICallBack($obj_callBack, false);
        
        $obj_response=$obj_callBack->response;            
        $int_rowTotal=$obj_response->row_count;
        if($int_rowTotal){
            return $obj_callBack;
        }        
        return false;                                         

    }
      
}//END OF CLASS




?>