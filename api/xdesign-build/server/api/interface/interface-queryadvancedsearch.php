<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class interface_advancedsearch extends interface_advancedsearchinterface{
    function __construct() {                        
        
        parent::__construct();                                        
    } 

    function fn_interfaceFormatAdvancedSearch(){        


        $obj_paramView=$this->obj_metaView->obj_param;
        $MetaViewId=$obj_paramView->MetaViewId;
        $str_key=$obj_paramView->MetaTableKeyField;


        $this->obj_queryAdvancedSearch=new stdClass;
        
        $this->arr_whereAdvancedSearch=[];  

        /*
        $obj_where=new stdClass;
        $obj_where->{$MetaViewId.".AddressZip"}="12345";
        array_push($this->arr_whereAdvancedSearch, $obj_where);
        //*/
        
        
        
        //$this->bln_debugQuerySearch=$this->bln_debugExecute;
        $this->bln_debugQuerySearch=false;        

        $obj_paramRowz=$this->obj_metaRowz->obj_param;
        
        if($this->bln_debugQuerySearch){
            $this->fn_addEcho("START SEARCH fn_formatSQLQuerySearch");                     
            $this->fn_addEcho("obj_paramRowz->MetaRowzId: ".$obj_paramRowz->MetaRowzId);
        }

        if($obj_paramRowz->MetaRowzId=="0"){
            $this->fn_addEcho("MetaRowzId is 0 return");
            return;
        }

        
        //*
        if(empty($this->obj_userLogin->QueryList) && empty($this->obj_post->QueryList)){
            return;//this may need to be moved below fn_loadQueryListFromDB
        }

        $this->fn_interfaceLoadQueryListFromDB(); 
        
        //$this->fn_varDump($this->obj_userLogin->QueryList, "this->obj_userLogin->QueryList", true);
        //$this->fn_varDump($this->obj_post->QueryList, "this->obj_post->QueryList", true);
        
        $str_1=$this->obj_userLogin->QueryList;
        $str_2=$this->obj_post->QueryList;
        $QueryList=$this->fn_mergeList($str_1, $str_2, $this->str_listSeparatorOr);
        
        if($this->bln_debugRunSelect){                                
            $this->fn_varDump($QueryList, "QueryList");
        }
        //*/

        $this->str_queryList=$QueryList;

        if(empty($this->str_queryList)){            
            return;
        }

        
        
        //$this->str_queryList=$this->obj_post->QueryList;        
        $this->str_queryListParent=$this->obj_post->QueryListParent;        

        if($this->bln_debugQuerySearch){                       
            $this->fn_addEcho("this->str_queryList", $this->str_queryList);                    
            $this->fn_addEcho("this->str_queryListParent", $this->str_queryListParent);                          
        }        
       
        $this->int_labelCount=0;        

        $str_queryList=$this->str_queryList;        
        $str_queryListParent=$this->str_queryListParent;                
        //$str_queryListParent="";                
        
        $obj_queryListParent=$this->fn_interfaceFormatSQLQueryString($str_queryListParent);        
        $this->fn_interfaceCombineQueryList($obj_queryListParent);
        
        $obj_queryList=$this->fn_interfaceFormatSQLQueryString($str_queryList);
       
        $this->fn_interfaceCombineQueryList($obj_queryList);
       
        if($this->bln_debugQuerySearch){
            $this->fn_addEcho("END SEARCH fn_formatSQLQuerySearch");                     
        }

        if(count($this->arr_whereAdvancedSearch)){
            $this->obj_queryAdvancedSearch->{"\$or"}=$this->arr_whereAdvancedSearch;
            //$this->bln_debug=true;
        }

    }
    
    function fn_interfaceCombineQueryList($obj_queryList){

        $str_logicalOperator=" AND ";

        if(!empty($obj_queryList->str_sql)){
            if(!empty($this->obj_paramQuery->str_sql)){
                $this->obj_paramQuery->str_sql.=" $str_logicalOperator ";
            }            
        }
        

        //START UPDATE PARAMQUERY
        $this->obj_paramQuery->str_sql.=$obj_queryList->str_sql;                        
        $this->obj_paramQuery->arr_sql=array_merge(
            $this->obj_paramQuery->arr_sql,
            $obj_queryList->arr_sql           
        );                                

        return;//search pin is issue
        if ($obj_queryList->bln_hasSearchPin) {
            $this->obj_paramQuery->bln_hasSearchPin=true;
        }                
        //END UPDATE PARAMQUERY
    }
    function fn_interfaceFormatSQLQueryString($str_queryList){          
        
        $obj_queryList=new stdClass;
        $obj_queryList->bln_hasSearchPin=false;
        $obj_queryList->str_sql="";                
        $obj_queryList->arr_sql=[];                                        

        if(empty($str_queryList)){return $obj_queryList;}//no need to continue processing empty string       

        
        //$this->fn_varDump($str_queryList, "str_queryList", true);                    
        

        // Initialize empty arrays for the two groups
        $arr_data=explode($this->str_listSeparatorOr, $str_queryList);        
        $arr_tag = [];
        $arr_user=[];
        $arr_field = [];

        if(!empty($arr_data)){
            if($this->bln_debugQuerySearch){
                $this->fn_varDump($arr_data, "arr_data");                    
            }
        }

        // Iterate through each item in the original array
        foreach ($arr_data as $str_item) {            
            if (strpos($str_item, '#') === 0) {
                // Item starts with '#', add it to the hashtag array
                $arr_tag[] = $str_item; 
            } else if (strpos($str_item, '@') === 0) {            
                // Item starts with '@', add it to the userhashtag array                
                $arr_user[] = $str_item;            
            } else {
                // Item does not start with '#' or '@', add it to the field array
                $arr_field[] = $str_item;
            }
        }               

        $str_label="n/a";
        $MetaViewId=$this->MetaDataViewId;
        $this->fn_addEcho("//START TAG PARAM");                    
        $obj_paramTag=$this->fn_interfaceFormatQueryTag($arr_tag, $str_label, $MetaViewId, "OR", "MetaPermissionTag");//"`meta_data`.`meta_data`.`MetaPermissionTag`"                                        
        //END TAG PARAM    
        
        //$this->fn_varDump($arr_tag, "$arr_tag", true); 
        
        //START USER PARAM       
        $MetaViewId=$this->MetaUserViewId;
        $this->fn_addEcho("//START USER PARAM");                    
        $obj_paramUser=$this->fn_interfaceFormatQueryTag($arr_user, $str_label, $MetaViewId, "OR", "MetaUserAtTag");//"`meta_user`.`meta_user`.`MetaUserAtTag`"                                
        //END USER PARAM                        
        
        //START FIELD PARAM               
        $MetaViewId=$this->obj_metaView->obj_param->MetaViewId;                
        $this->fn_addEcho("//START FIELD PARAM");
        $str_label="FIELDQUERY";                    
        $obj_paramField=$this->fn_interfaceFormatQueryTag($arr_field, $str_label, $MetaViewId, "OR");
        //END FIELD PARAM                                
        
        /*
        //START COMBINE INTO QUERY
        $str_sql="";
        $arr_sql=[];
        $str_sql.=$obj_paramTag->str_sql;        
        if(!empty($obj_paramUser->str_sql)){
            if(!empty($str_sql)){
                $str_sql.=" AND ";
            }            
            $str_sql.=$obj_paramUser->str_sql;               
        }
        if(!empty($obj_paramField->str_sql)){
            if(!empty($str_sql)){
                $str_sql.=" AND ";
            }            
            $str_sql.=$obj_paramField->str_sql;               
        }

        if(!empty($str_sql)){
            $str_sql="(".$str_sql.")";
        }

        $arr_sql=array_merge(
            $obj_paramTag->arr_sql, 
            $obj_paramUser->arr_sql, 
            $obj_paramField->arr_sql            
        );                                

        //START UPDATE PARAMQUERY
        $obj_queryList->str_sql=$str_sql;                
        $obj_queryList->arr_sql=$arr_sql;

        if ($obj_paramTag->bln_hasSearchPin || $obj_paramUser->bln_hasSearchPin || $obj_paramField->bln_hasSearchPin) {
            $obj_queryList->bln_hasSearchPin=true;
        }                
        if($this->bln_debugQuerySearch){
            $this->fn_varDump($obj_queryList->str_sql, "obj_queryList->str_sql");                    
            $this->fn_varDump($obj_queryList->arr_sql, "obj_queryList->arr_sql");                                
        }
        //END UPDATE PARAMQUERY
        //*/

        return $obj_queryList;        
    }    

    function fn_interfaceFormatQueryTag($arr_term, $str_label, $MetaViewId, $str_logicalOperator, $MetaColumnAPIName=""){
        
        $str_comparisonOperator="LIKE";        
        $str_wildcardCharacter="%";
        

        //$MetaViewId=$this->obj_metaView->obj_param->MetaViewId;
        
        //START TAG PARAM
        $str_sql="";        
        $arr_sql=[];                
        if($arr_term){ 
            
            if($this->bln_debugQuerySearch){
                $this->fn_varDump($arr_term, $str_label." xarr_term");                    
            }   

            $int_count=count($arr_term);                
            for($i=0;$i<$int_count;$i++) {                                           
                $str_term=$this->fn_disarmSQLString($arr_term[$i]);        
                if(empty($str_term)){continue;}                             
                $str_labelCount=$str_label.$this->int_labelCount;                
                $this->int_labelCount++;

                if($str_label==="FIELDQUERY"){//if a field query

                    if($this->bln_debugQuerySearch){
                        $this->fn_addEcho("SPECIAL CASE: THIS IS A FIELD QUERY");                    
                    }   

                    //START DIFFERENCE BETWEEN THE 2 FORMAT QUERY FUNCTION
                    $arr_metaColumn=$this->arr_metaColumn;                
                    //$this->fn_varDump($arr_metaColumn, "arr_metaColumn", true);
                    $int_countColumn=count($arr_metaColumn);              

                    if($this->bln_debugQuerySearch){
                        $this->fn_addEcho("FIELD QUERY COUNT arr_metaColumn: ", $int_countColumn);                    
                    }   
                    for($i_column=0;$i_column<$int_countColumn;$i_column++) {                                                           
                            
                        $obj_metaColumn=$arr_metaColumn[$i_column];                                                                        
                        //$MetaColumnAPIName=$obj_metaColumn->MetaColumnAPIName;
                        if($obj_metaColumn->MetaViewId!==$MetaViewId){continue;}
                        
                        if(!$obj_metaColumn->SearchPin){
                            if($this->bln_debugQuerySearch){
                                $this->fn_addEcho("FIELD QUERY: COLUMN IS NOT A SEARCH PIN, CONTINUE: ", $MetaColumnAPIName);                    
                            }   
                            continue;
                        }                    
                       
                        //$this->fn_varDump($obj_metaColumn, "obj_metaColumn", true);
                         //$this->fn_varDump($MetaViewId, "MetaViewId", true);
                         //$this->fn_varDump($MetaColumnAPIName, "MetaColumnAPIName", true);
                        
                        $obj_where=new stdClass;	
                        $obj_querySearchLike=new stdClass;
                        $obj_querySearchLike->{"\$con"}=$str_term;          
                        $obj_where->{$MetaViewId.".".$obj_metaColumn->MetaColumnAPIName}=$obj_querySearchLike;
                        array_push($this->arr_whereAdvancedSearch, $obj_where);
                        //$this->fn_varDump($obj_where, "obj_where", true);

                        
                        //$str_sql.="/*$str_label*/$MetaColumnAPIName $str_comparisonOperator :$str_labelCount $str_logicalOperator";                                                      
                        //$this->fn_addEcho("[$i][$i_column] str_sql", $str_sql);
                        
                    }                    
                    //END DIFFERENCE BETWEEN THE 2 FORMAT QUERY FUNCTION

                }
                else{
                    $str_sql.="/*$str_label*/$MetaColumnAPIName $str_comparisonOperator :$str_labelCount $str_logicalOperator ";
                    /*
        $obj_where=new stdClass;
        $obj_where->{$MetaViewId.".AddressZip"}="12345";
        array_push($this->arr_whereAdvancedSearch, $obj_where);
        //*/     
        
        $obj_where=new stdClass;	
        $obj_querySearchLike=new stdClass;
        $obj_querySearchLike->{"\$con"}=$str_term;          
        $obj_where->{$MetaViewId.".".$MetaColumnAPIName}=$obj_querySearchLike;
        array_push($this->arr_whereAdvancedSearch, $obj_where);
        //$this->fn_varDump($obj_where, "obj_where", true);

        
                }

                //$str_sql=trim($str_sql, " $str_logicalOperator ");        
                $arr_sql=array_merge(
                    $arr_sql, 
                    [$str_labelCount => $str_wildcardCharacter.$str_term.$str_wildcardCharacter]
                );                            
            }   
        }       
        
        $obj_param=new stdClass();        
        $obj_param->str_sql="";        
        $obj_param->arr_sql=[];        
        $obj_param->bln_hasSearchPin=false;                    
        if(!empty($str_sql)){            
            $str_sql=trim($str_sql, " $str_logicalOperator ");        
            $str_sql="($str_sql)";            
            $obj_param->str_sql=$str_sql;        
            $obj_param->arr_sql=$arr_sql;
            $obj_param->bln_hasSearchPin=true;
        }   
        
        return $obj_param;

    }   
      
}//END OF CLASS


?>