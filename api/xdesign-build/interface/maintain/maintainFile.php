<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainFile extends maintainSetup{
    function fn_importFile(){                

        //FILE UPLOAD: WRITE REQUIRED POST VALUES BACK TO obj_post
        $this->obj_post->Action=$_POST["Action"];          
        $this->obj_post->ActionCallBack=$_POST["ActionCallBack"];          
        $this->obj_post->NotifierId=$_POST["NotifierId"];          
        $this->obj_post->MetaViewId=$_POST["MetaViewId"];
        $this->obj_post->MetaRowzId=$_POST["MetaRowzId"];
        //FILE UPLOAD: WRITE REQUIRED POST VALUES BACK TO obj_post

        $this->bln_verbose=false;
        $this->bln_debug=false;


        $this->fn_doImportFile();
        $this->fn_addMessage("Maintain File is complete");                  
    }

    function fn_doImportFile(){

        
        //SAVE FILE
        //Save Import File - GetPath
        /*
        if($this->bln_localHost){
            $str_pathFile="D:/var/www/html/vm-xdesign/vopsys/upgrade/xdesign-build/upload/FileImport.csv";        
        }
        else{
            $str_pathFile=$this->fn_saveImportFile();                    
        } 
        //*/       
        
        $this->str_pathFile=$this->fn_saveImportFile();                    
        $this->obj_post->str_pathFileUploaded=dirname($this->str_pathFile);
        if(empty($this->str_pathFile)){            
            $this->fn_addMessage("FilePath is Empty");          
            return;
        }
        
        
        //SAVE FILE

        $this->arr_headerCSV=[];        
        $this->arr_headerMatch=[];        
        $this->arr_duplicate=[];        

        $this->arr_viewId=[];
        $this->arr_view=[];        



        //CREATE ARRAY OF DATA FROM FILE
        $arr_dataCSV=$this->fn_processCSV($this->str_pathFile);
        if(empty($arr_dataCSV)){
            $this->fn_addMessage("Error: Processing CSV did not complete");                  
            return;
        }
        $this->arr_dataCSV=$arr_dataCSV;        
        $this->arr_headerCSV=$arr_dataCSV[0];                        
        //CREATE ARRAY OF DATA FROM FILE
        
        //CREATE ARRAY OF VIEW ID FROM HEADER
        $this->fn_getListViewId($this->arr_headerCSV);        
        //CREATE ARRAY OF VIEW ID FROM HEADER
        
        //CREATE ARRAY OF VIEW OBJECTS FROM ARRAY OF VIEW ID
        $this->fn_getArrayView();
        //CREATE ARRAY OF VIEW OBJECTS FROM ARRAY OF VIEW ID
        
        //CREATE ARRAY OF JSON OBJECTS FROM DATA ARRAY
        $this->fn_processCSVtoJSON($this->arr_dataCSV);                                 
        if(empty($this->str_jsonCSV)){
            $this->fn_setError("Error : Proccessing CSV");
            return;
        }        
        $this->arr_jsonCSV=json_decode($this->str_jsonCSV);                
        if(!$this->fn_validateJSONDecode($this->arr_jsonCSV, "[MaintainFile NameValue]"))exit;                
        //CREATE ARRAY OF JSON OBJECTS FROM DATA ARRAY                        
        
        
        //CYCLE VIEWS AND PROCESS INSERTS AND UPDATES, ADD LINKS
        $this->fn_cycleView();                       
        //CYCLE VIEWS AND PROCESS INSERTS AND UPDATES, ADD LINKS
        
        //PROCESS LINKS
        $this->fn_processLinks();               
        //PROCESS LINKS              
        

        $data=$this->arr_dataCSV;
        
        $this->obj_post->str_pathFileUploaded.="/uploaded";
        $this->fn_createFolder($this->obj_post->str_pathFileUploaded);       
        $str_filename=$this->fn_getRandomFileName();
        //$str_filename="output";
        $str_filename.=".csv";
        $this->obj_post->str_pathFileUploaded.="/".$str_filename;        
        //$this->obj_post->str_pathFileUploaded=tempnam($this->obj_post->str_pathFileUploaded, "upload");                
        $this->fn_writeDataToFile($this->obj_post->str_pathFileUploaded, $data);
    }


    function fn_cycleView(){
        
        $arr_key=$this->arr_view;        
        $i_count=count($arr_key);                
        for($i_key=0;$i_key<$i_count;$i_key++) {                                                                                   
            $obj_metaView=$arr_key[$i_key];                                          
            $obj_paramView=$obj_metaView->obj_param;            

            $this->obj_metaViewCurrent=$obj_metaView;
            
            $this->fn_triageListColumn($this->arr_headerViewFormat);                                            
            
            $this->fn_FILEGetData();
            
        }

        //if($this->bln_verbose){
            //$this->fn_varDump($this->arr_dataCSV, "this->arr_dataCSV", true);                            
            //$this->fn_varDump($this->arr_jsonCSV, "this->arr_nameValue", true);                            
        //}

    }
    
    function fn_FILEGetData(){//array of json objects        
        
        $arr_dataCSV=&$this->arr_dataCSV;
        $arr_jsonCSV=$this->arr_jsonCSV;
        $arr_headerMatch=$this->arr_headerMatch;
        //$this->fn_varDump($arr_headerMatch, "arr_headerMatch", true);
        
        $obj_paramView=$this->obj_metaViewCurrent->obj_param;        
        $MetaViewId=$obj_paramView->MetaViewId;                
        
        $MetaTableKeyField=$obj_paramView->MetaTableKeyField;            
        $str_viewNameKey=$this->obj_metaViewCurrent->fn_getMetaViewNameKey();
        array_push($arr_dataCSV[0], $str_viewNameKey);                                                                    
        
        $select_column=$this->obj_metaViewCurrent->fn_getIdKey();
        $arr_selectColumn=array($select_column);
        $select_column=json_encode($arr_selectColumn);                                                                             
        //$obj_param->select_column=$select_column;        
        $str_selectColumn=$select_column;                        
        //$this->fn_varDump($str_selectColumn, "fn_FILEGetData str_selectColumn", true);
        //exit;
        
        $i_count=count($arr_jsonCSV);        
        for($i_row=0;$i_row<$i_count;$i_row++){

            $this->arr_duplicate=[];            
            
            $this->arr_rowCurrent=&$arr_dataCSV[$i_row+1];                                                            
            $this->obj_rowCurrent=$arr_jsonCSV[$i_row];                                                                        
            
            $arr_query=$this->fn_getQuery($this->obj_rowCurrent, $arr_headerMatch);                                                
            /*
            $this->fn_varDump($obj_rowCurrent, "UPLOAD obj_rowCurrent", true);
            $this->fn_varDump($arr_headerMatch, "UPLOAD arr_headerMatch", true);
            $this->fn_varDump($arr_query, "UPLOAD arr_query", true);
            //*/
            $str_query=json_encode($arr_query);                        
            //$this->fn_varDump($str_query, "UPLOAD str_query", true);
            
            $obj_param=$this->obj_rowzAPI->fn_getRequest();                                
            $obj_param->view_id=$MetaViewId;                                
            $obj_param->select_column=$str_selectColumn;            
            $obj_param->row_match=$str_query;
            //$this->fn_varDump($obj_param, "UPLOAD obj_param", true);
            $this->obj_rowzAPI->fn_buildEndPoint($obj_param); 
            
            //DUMP TO VIEW BEFORE GOING TO API
            //$this->fn_varDump($obj_param->str_urlEndpoint, "UPLOAD obj_param->str_urlEndpoint", true);
            //exit
            //DUMP TO VIEW BEFORE GOING TO API
            $this->fn_FILERunRow($obj_param);            
            
        }  //END OF LOOP
    }

    function fn_FILERunRow($obj_param){//array of json objects                               
        
        //$this->fn_varDump($obj_param->str_urlEndpoint, "obj_param->str_urlEndpoint", true);

        $str_response=$this->obj_rowzAPI->fn_get($obj_param->str_urlEndpoint);                                                                                                
        $obj_responseGet=json_decode($str_response);                                                               
        if(!$this->fn_validateJSONDecode($obj_responseGet, "[MaintainFile Post]"))exit;
        //SHOW POST RETURNED
        //$this->fn_varDump($obj_responseGet, "GET obj_response", true);
        //SHOW POST RETURNED                    
        if(!$this->fn_validateAPIStatusCode($obj_responseGet->response)){
            $this->fn_addConsole("GET API Status Code Invalid", $obj_responseGet->response->status_code);                    
            return;
        }
        

        
        $responseGet=$obj_responseGet->response;            
        $requestGet=$obj_responseGet->request;        

        
        
        $bln_rowmatchGet=true;
        if(empty($requestGet->row_match) && empty($requestGet->row_matchid)){
            $bln_rowmatchGet=false;
        }                 

        //$this->fn_varDump($bln_rowmatchGet, "bln_rowmatchGet", true);
        //$this->fn_varDump($responseGet->row_count, "responseGet->row_count", true);
        
        if(!$responseGet->row_count ||  !$bln_rowmatchGet ){
            if($this->bln_verbose){
                $this->fn_addConsole("row_count is empty - insert");                    
            }                                    
            $obj_responsePost=$this->fn_callAPIPost($this->obj_metaViewCurrent, $this->obj_rowCurrent);                        
            //$this->fn_varDump($obj_responsePost, "POST obj_response", true);
            
            //GET SINGLE RESPONSE ID                   
            if(!empty($obj_responsePost)){                
                
                $row_matchid=0;
                if(empty($obj_responsePost->response_body)){
                    $this->fn_addMessage("Error: POST request returned empty response_body");                  
                    return false;
                }
                else if(!$this->fn_validateAPIStatusCode($obj_responsePost->response)){
                    $this->fn_addConsole("POST API Status Code Invalid", $obj_responsePost->response->status_code);                    
                    return false;
                }
                else{
                    $this->fn_getResponseBodyRowMatch($obj_responsePost->response_body[0], $str_rowMatchName, $row_matchid);                                                                   
                    $this->obj_rowCurrent->{$str_rowMatchName}=$row_matchid;                        
                    array_push($this->arr_rowCurrent, $row_matchid);
                }
            }
            //GET SINGLE RESPONSE ID                        
        }            
        else if ($responseGet->row_count===1){
            if($this->bln_verbose){
                $this->fn_addConsole("row_count is not empty - update");    
            }
            
            $row_matchid=0;
            if(!empty($obj_responseGet)){
                //GET SINGLE RESPONSE ID                                                                
                $this->fn_getResponseBodyRowMatch($obj_responseGet->response_body[0], $str_rowMatchName, $row_matchid);                        
                $this->obj_rowCurrent->{$str_rowMatchName}=$row_matchid;                        
                array_push($this->arr_rowCurrent, $row_matchid);
                //GET SINGLE RESPONSE ID                        
            }                        
            
            $int_idRecord=$row_matchid;                            
            $obj_responsePatch=$this->fn_callAPIPatch($this->obj_metaViewCurrent, $int_idRecord, $this->obj_rowCurrent);            
            //$this->fn_varDump($obj_responsePatch, "obj_responsePatch obj_response", true);
            if(empty($obj_responsePatch->response_body)){
                $this->fn_addMessage("Error: PATCH request returned empty response_body");                  
                return false;
            }
            if(!$this->fn_validateAPIStatusCode($obj_responsePatch->response)){
                $this->fn_addConsole("PATCH API Status Code Invalid", $obj_responsePatch->response->status_code);                    
                $this->fn_varDump($obj_responsePatch, "obj_responsePatch obj_response", true);
                return false;
            }
        }
        else if($responseGet->row_count>1 && $bln_rowmatchGet){
            if($this->bln_verbose){
                $this->fn_addConsole("row_count is greater than 1 - duplicate");
            }
            $obj_responseAction=array_push($this->arr_duplicate, $obj_responseGet);
        }   
        else{
            if($this->bln_verbose){
                $this->fn_addConsole("response meets no condition");
            }            

        }                   

    }   

    function fn_processLinks(){

        
        $obj_metaView=new metaView($this);
        $obj_metaView->fn_initialize($this->MetaLinkViewId);            
        $this->obj_metaLinkView=$obj_metaView;
        $obj_paramLinkView=$this->obj_metaLinkView->obj_param;        
        //$this->fn_varDump($obj_paramLinkView, "obj_paramLinkView", true);                            

        $this->obj_metaViewCurrent=$this->obj_metaLinkView;
        
        
        $arr_jsonCSV=$this->arr_jsonCSV;
        $i_countJsonCSV=count($arr_jsonCSV);            
        
        for($i_jsonCSV=0;$i_jsonCSV<$i_countJsonCSV;$i_jsonCSV++) {//FOR EACH ROW
            
            $obj_row=&$this->arr_jsonCSV[$i_jsonCSV];//by reference                                                        
            $this->arr_rowCurrent=[];
            $this->obj_rowCurrent=new stdClass;
            $this->arr_metaViewIdComplete=[];
            
            $i_count=count($this->arr_view);        
            for($i_view=0;$i_view<$i_count;$i_view++) {//FOR EACH VIEW
                $this->obj_metaViewFrom=$this->arr_view[$i_view];                                                                          
                array_push($this->arr_metaViewIdComplete, $this->obj_metaViewFrom->obj_param->MetaViewId);                
                
                $this->fn_FILEGetLink($obj_row);                                
            }
            
        }
    }


    function fn_FILEGetLink($obj_row){        
        
        //return; 
        $arr_dataCSV=&$this->arr_dataCSV;
        $arr_jsonCSV=$this->arr_jsonCSV;
        $arr_headerMatch=$this->arr_headerMatch;        
        
        $obj_paramLinkView=$this->obj_metaLinkView->obj_param;                
        $MetaLinkViewId=$obj_paramLinkView->MetaViewId;                
        $MetaTableKeyField=$obj_paramLinkView->MetaTableKeyField;        
        
        $obj_metaViewFrom=$this->obj_metaViewFrom;        
        $obj_paramViewFrom=$obj_metaViewFrom->obj_param;                
        
        /*
        $this->fn_varDump($obj_paramLinkView, "obj_paramLinkView", true);                            
        $this->fn_varDump($obj_paramViewFrom->MetaViewId, "obj_paramViewFrom->MetaViewId", true);                                            
        $this->fn_varDump($obj_paramViewFrom->MetaTableKeyField, "obj_paramViewFrom->MetaTableKeyField", true);                                            
        $this->fn_varDump($obj_row, "obj_row", true);                        
        //*/

        $str_property=$obj_paramViewFrom->MetaViewId.".".$obj_paramViewFrom->MetaTableKeyField;        
        //$this->fn_varDump($obj_row, "obj_row", true);                        
        //$this->fn_varDump($str_property, "str_property", true);                        
        if (!property_exists($obj_row, $str_property)){
            return;    
        }        

        //$this->fn_varDump($str_property, "xx str_property", true);                        
        $FromKeyValue=$obj_row->{$str_property};                            
        //$this->fn_varDump($FromKeyValue, "FromKeyValue", true);
        
        $str_selectColumn=$this->obj_metaLinkView->fn_getIdKey();                
        //$this->fn_varDump($str_selectColumn, "fn_FILEGetLink str_selectColumn", true);                            

        //*
        $select_column=$this->obj_metaLinkView->fn_getIdKey();
        $arr_selectColumn=array($select_column);
        $select_column=json_encode($arr_selectColumn);                                                                             
        //$obj_param->select_column=$select_column;        
        $str_selectColumn=$select_column;                        
        //$this->fn_varDump($str_selectColumn, "fn_FILEGetLink str_selectColumn", true);
        //*/




        $MetaUserId=$this->obj_userLogin->MetaUserId;        
        $MetaUserGroupId=$this->obj_userLogin->MetaUserGroupId;        
        $MetaUserSystemId =$this->obj_userLogin->MetaUserSystemId;        
        
        $arr_from=Array(                                   
            
            "$MetaLinkViewId.metalinksystemid"=>$MetaUserSystemId,            
            "$MetaLinkViewId.fromviewid"=>$obj_paramViewFrom->MetaViewId,                        
            "$MetaLinkViewId.fromkeyname"=>$obj_paramViewFrom->MetaTableKeyField,
            "$MetaLinkViewId.fromkeyvalue"=>$FromKeyValue,            
        );
        $str_queryFrom=json_encode($arr_from);         
        /*
        //$this->fn_varDump($arr_from, "arr_from", true);        
        //$this->fn_varDump($str_queryFrom, "str_queryFrom", true);   
        //*/
        
        $i_count=count($this->arr_view);        
        for($i_view=0;$i_view<$i_count;$i_view++) {//FOR EACH VIEW        
            $obj_metaViewTo=$this->arr_view[$i_view];                                                      
            $obj_paramViewTo=$obj_metaViewTo->obj_param;                        
            $bln_value=in_array($obj_paramViewTo->MetaViewId, $this->arr_metaViewIdComplete);
            if($bln_value){
                continue;
            }

            if($obj_metaViewTo==$this->obj_metaViewFrom){
                continue;
            }
            

            /*            
            FromSchema
            FromTable
            FromKeyName            
            FromKeyValue
            //*/

            /*
            ToSchema
            ToTable
            ToKeyName
            ToKeyValue
            //*/

            $ToKeyValue=$obj_row->{$obj_paramViewTo->MetaViewId.".".$obj_paramViewTo->MetaTableKeyField};                    
            $arr_to=Array(                           
                
                "$MetaLinkViewId.toviewid"=>$obj_paramViewTo->MetaViewId,                                        
                "$MetaLinkViewId.tokeyname"=>$obj_paramViewTo->MetaTableKeyField,
                "$MetaLinkViewId.tokeyvalue"=>$ToKeyValue,            
            );
            
            $str_queryTo=json_encode($arr_to);         
            /*
            //$this->fn_varDump($arr_to, "arr_to", true);        
            //$this->fn_varDump($str_queryTo, "str_queryTo", true);   
            //*/
            
            $arr_query=array_merge($arr_from, $arr_to);
            $str_query=json_encode($arr_query);        
            /*
            //$this->fn_varDump($arr_query, "arr_query", true);        
            //$this->fn_varDump($str_query, "str_query", true);   
            //*/

            $this->arr_rowCurrent=$arr_query;
            $this->obj_rowCurrent=json_decode($str_query);            
            
            $obj_param=$this->obj_rowzAPI->fn_getRequest();                                
            //return;
            $obj_param->view_id=$MetaLinkViewId;                                            
            $obj_param->select_column=$str_selectColumn;            
            $obj_param->row_match=$str_query;                                           
            $this->obj_rowzAPI->fn_buildEndPoint($obj_param);                                 
            
            //*
            //DUMP TO VIEW BEFORE GOING TO API
            //$this->fn_varDump($obj_param->row_match, "obj_param->row_match", true);        
            //$this->fn_varDump($obj_param->str_urlEndpoint, "obj_param->str_urlEndpoint", true);                    
            //continue;            
            //DUMP TO VIEW BEFORE GOING TO API
            //*/
            
            $this->bln_debug=true;                        
            $this->fn_FILERunRow($obj_param);

            //$this->fn_addConsole("END LOOP fn_FILEGetLink");                    
            
        }//END LOOP
    }

    
    
    function fn_getResponseBodyRowMatch($obj_row, &$str_rowMatchName, &$str_rowMatchId){

        $arr_row=(array)$obj_row;
        $arr_key=array_keys($arr_row);
        $str_rowMatchName=$arr_key[0];        
        $str_rowMatchId=$arr_row[$str_rowMatchName];        
    }    
    
    function fn_FILEDuplicateDataArr(){}    

    function fn_curl_request($url, $apitoken, $content, $method){          
        
        //CURL IS SYNCHRONOUS, PROGRAM EXECUTION WILL WAIT TILL CURL RETURNS
        $ch=curl_init();
        $arr_options=array();
        array_push($arr_options, 'Content-Type: application/json');
        array_push($arr_options, 'Authorization: Bearer ' . $apitoken);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $arr_options);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
        $str_json = curl_exec($ch);
        curl_close($ch);                
        return $str_json;
      }
      
      


    function fn_getQuery($obj_row, $arr_headerMatch){//array of json objects        

        
        $int_matchCount=count($arr_headerMatch);        
        $arr_query=[];
        for($i_match=0;$i_match<$int_matchCount;$i_match++) {                              
        
            $str_name=strtolower($arr_headerMatch[$i_match]);                                                        
            $str_value=$obj_row->{$str_name};            
            //$this->fn_addConsole("str_name", $str_name);                                                   
            //$this->fn_addConsole("str_value", $str_value);                                                                   
            if($str_value){
                $arr_query[$str_name] = $str_value;                                                
            }
        }                                  
        return $arr_query;            
    }

    
    function fn_runPatch(){//array of json objects        
        $arr_data=$this->arr_update;
    }

    function fn_triageListColumn($arr_headerCSV){        

        $obj_metaView=$this->obj_metaViewCurrent;
        $arr_listColumn=$this->fn_getListViewId($arr_headerCSV);                        
        $arr_listColumn=$this->fn_getIMPORTNameList($arr_headerCSV);                        
        $str_listColumn=$this->fn_getList($arr_listColumn);                                        
        //$this->fn_addConsole("this->obj_metaViewCurrent", $this->obj_metaViewCurrent->obj_param);                                                           
        //$this->fn_addConsole("str_listColumn", $str_listColumn);                                                           
        $arr_headerMatch=$obj_metaView->fn_getMatchColumnList($str_listColumn);                                                
        $this->arr_headerMatch=array_values(array_unique($arr_headerMatch));//de-deuped, reindexed                    
        //$this->fn_addConsole("this->arr_headerMatch", $this->arr_headerMatch);                                                           
        //THIS IS USED TO CREATE EXTENDED MATCH COLUMN 
    }    

    function fn_getIMPORTNameList($arr_headerCSV){

        $obj_paramView=$this->obj_metaViewCurrent->obj_param;        
        $MetaViewName=strtolower($obj_paramView->MetaViewName);
        $MetaViewId=strtolower($obj_paramView->MetaViewId);
        $MetaViewIdData=$this->MetaDataViewId;
        
        $arr_key=array_values($arr_headerCSV);
        $arr_list=[];           
        foreach ($arr_key as $str_key ) {     

            $str_key=strtolower($str_key);                                                
            if(!empty($str_key) && $this->fn_inString($str_key, ".")){
                $arr_key=explode(".", $str_key);
                $str_viewName=$arr_key[0];
                $str_columnShortName=$arr_key[1];
                if($str_viewName==$MetaViewId){                    
                    array_push($arr_list, $str_key);
                }
                elseif($str_viewName==$MetaViewName){                    
                    array_push($arr_list, $str_key);
                }
                elseif($str_viewName==$MetaViewIdData){                    
                    array_push($arr_list, $str_key);
                    
                }                
                
            }            
        }                                    
        //$arr_list=array_unique($arr_list);
        return $arr_list;
    }

    function fn_getIMPORTNameListExtended($arr_headerCSV){

        $obj_paramView=$this->obj_metaViewCurrent->obj_param;        
        $MetaViewName=strtolower($obj_paramView->MetaViewName);
        $MetaViewId=$obj_paramView->MetaViewId;
        $MetaViewIdData=$this->MetaDataViewId;
        
        $arr_key=array_values($arr_headerCSV);
        $arr_list=[];           
        foreach ($arr_key as $str_key ) {     

            $str_key=strtolower($str_key);                                                
            if(!empty($str_key) && $this->fn_inString($str_key, ".")){
                $arr_key=explode(".", $str_key);
                $str_viewName=$arr_key[0];
                $str_columnShortName=$arr_key[1];
                
                if($str_viewName==$MetaViewName){                                        
                    continue;
                }
                elseif($str_viewName==$MetaViewId){                                        
                    continue;
                }
                elseif($str_viewName==$MetaViewIdData){                                        
                    continue;
                }                
                else{                                   
                    array_push($arr_list, $str_key);                                     
                }
            }            
        }                                            
        return $arr_list;
        
    }  

    function fn_getListViewId($arr_headerCSV){

        $arr_key=array_values($arr_headerCSV);
        $arr_list=[];           
        foreach ($arr_key as $str_key ) {     
            $str_key=strtolower($str_key);       
            if(!empty($str_key) && $this->fn_inString($str_key, ".")){                
                //$this->fn_addConsole("str_key", $str_key);                                        
                $arr_key=explode(".", $str_key);
                $str_viewName=$arr_key[0];
                $str_columnShortName=$arr_key[1];                                         
                $str_viewId=$this->fn_callUpViewId($str_viewName);
                array_push($arr_list, $str_viewId);                                                     
            }
        }    
        $this->arr_viewId=array_values(array_unique($arr_list));//de-deuped, reindexed        

    }
    function fn_callUpViewId($str_viewName){        
        
        $str_sql="SELECT `MetaViewId` FROM `meta_view`.`meta_view` WHERE TRUE
        AND `MetaViewSystemId`=:MetaViewSystemId
        AND `MetaViewName`=:MetaViewName
        ;";
        $str_viewId=$this->fn_fetchColumn($str_sql, [            
            'MetaViewSystemId'=>$this->obj_userLogin->MetaUserSystemId,                    
            'MetaViewName'=>$str_viewName,
        ]);                           
        return $str_viewId;
    }    
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    

    function fn_processCSVtoJSON($arr_data){        
        
        $arr_headerViewFormat=[];
        $arr_headerCSV=$this->arr_headerCSV;
        
        $count_header=count($arr_headerCSV);
        $count_data=count($arr_data);
        
        $arr_rows=[];
        for($i_data=0;$i_data<$count_data;$i_data++){            
            $obj_row=new stdClass;        
            
            for($i_header=0;$i_header<$count_header;$i_header++){            
                $str_key=strtolower($arr_headerCSV[$i_header]);                
                $str_value=$arr_data[$i_data][$i_header];   
                
                $arr_key=explode(".", $str_key);
                $str_viewName=$arr_key[0];
                $str_columnShortName=$arr_key[1];                                                
                
                $str_viewId=$this->fn_callUpViewId($str_viewName);                
                $str_viewValue=$str_viewId.".".$str_columnShortName;    
                $obj_row->{$str_viewValue}=$str_value;                                                  
                if($i_data===0){                
                    array_push($arr_headerViewFormat, $str_viewValue);                    
                }
            } //END OF LOOP

            if($i_data>0){                                                        
                if(!empty((array)$obj_row)){
                    array_push($arr_rows, $obj_row);
                }                
            }            
        }

        $this->arr_headerViewFormat=$arr_headerViewFormat;
        $this->str_jsonCSV=json_encode($arr_rows);        
    }

    

    function fn_allowedMimeType($str_pathFile){
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $str_pathFile);        
        //$this->fn_addConsole("xCurrent File MIME", $mime);
        finfo_close($finfo);

        $allowed_mime = array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', 'text/plain');
        if(in_array($mime, $allowed_mime)) {
            return true;
        }
        return false;
    }

    function fn_processCSV($str_pathFile){
        
        $bln_allowedMime=$this->fn_allowedMimeType($str_pathFile);

        if(!$bln_allowedMime) {
            $this->fn_addMessage("Error: Mime Type not recognised");                  
            return false;
        }

        $f = fopen($str_pathFile, 'r');

        $arr_data = array();            
        
        $bln_row=false;

        while($arr_row = fgetcsv($f)) {                
            //$this->fn_varDump($arr_row, "arr_row", true);                

            $bln_valid=true;
            
            if(empty($arr_row)){            
                $bln_valid=false;
            }
            if(count($arr_row)<1){                
                $bln_valid=false;
            }
            if(is_null($arr_row[0])){                
                $bln_valid=false;
            }

            if($bln_valid){                
                $this->fn_cleanRow($arr_row);            
                array_push($arr_data, $arr_row);            
            }
        }

        fclose($f);               
        
        return $arr_data;                    
    }

    function fn_cleanRow(&$arr_row){//pass array by reference
        $i_count=count($arr_row);        
        for($i=0;$i<$i_count;$i++){
            $this->fn_cleanValue($arr_row[$i]);                        
        }
    }

    function fn_cleanValue(&$str_value){//pass value by reference    
        $str_value=trim($str_value);            
    }

    function fn_saveImportFile(){
        
        $arr_file=$_FILES["file"];
        $obj_file=(object)$arr_file;
        $str_pathFolder = dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/upload/";
        $this->fn_createFolder($str_pathFolder);       
                
    
        $str_pathFile = $str_pathFolder . basename($obj_file->name); // Path of the uploaded file    

        $str_fileType = strtolower(pathinfo($str_pathFile, PATHINFO_EXTENSION)); // File extension (in lowercase)
        $bln_ok=true;
        // Check if the uploaded file is a CSV or XLS
        if ($bln_ok && ($str_fileType !== "csv" && $str_fileType !== "xls")) {            
            $this->fn_addMessage("Error: Only CSV or XLS files accepted");                  
            $bln_ok=false;
        }

        if ($bln_ok && file_exists($str_pathFile)) {
            //$this->fn_addMessage("Error: File already exists.");                  
            //$bln_ok=false;
        }

        // Limit file size (e.g., 500KB)
        if ($bln_ok && ($obj_file->size > 500000)) {
            $this->fn_addMessage("Error: File size too large.");                  
            
            $bln_ok=false;
        }
        
        if ($bln_ok &&move_uploaded_file($obj_file->tmp_name, $str_pathFile)) {            
            return $str_pathFile;
        }
        
        $this->fn_addMessage("File has not been uploaded");                                                  
        return false;        

    }//end of funciton

    function fn_getRandomFileName(){
        $timestamp = date('Y-m-d_H-i-s'); // Get the current date and time
        $random_number = mt_rand(1000000000, 9999999999); // Generate a 10-digit random number
        return $timestamp . '_' . $random_number; // Combine the timestamp and random number
    }

    function fn_writeDataToFile($str_pathFile, $arr_data){                                
        
        // Open the CSV file for writing (you can change the filename)        
        $fp = fopen($str_pathFile, 'w');
        
        // Write each row from the array
        foreach ($arr_data as $row) {
            fputcsv($fp, $row);
        }

        // Close the file
        fclose($fp);
    }

    function fn_getArrayView(){

        $arr_key=$this->arr_viewId;        
        $i_count=count($arr_key);
        for($i_key=0;$i_key<$i_count;$i_key++) {                                                                                   
            $MetaViewId=$arr_key[$i_key];                              
            $obj_metaView=new metaView($this);
            $obj_metaView->fn_initialize($MetaViewId);            
            array_push($this->arr_view, $obj_metaView);                                     
        }                
    }


     
}//end of class