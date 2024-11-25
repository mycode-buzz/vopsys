<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_get extends interface_search{
    function __construct() {                        
        
        parent::__construct();                                        
        
    }    
    
    function fn_interfaceGetDataQuery($bln_getCountOnly=false){                                                         

        
        //$this->bln_debugRunSelect=$this->bln_debugExecute;
        $this->bln_debugRunSelect=false;
        

        if($this->bln_debugRunSelect){
            $this->fn_addEcho("START EXECUTE fn_getDataQuery");                         
            //exit;
        }

        $this->obj_post->RowCount=0;   

        if($this->obj_post->MetaViewId===$this->MetaDataViewId){
            $this->fn_debugPost();
            $this->fn_addEcho("invalid main view");
            exit;
        }        

        //will only run if $this->str_sqlStatement is false;                                        
        if(empty($this->LoadReportInterface)){
            $this->LoadReportInterface=false;
        }
        $LoadReportInterface=$this->obj_post->LoadReportInterface;

        
        
        $this->fn_formatQueryInterface();                                                                
        $this->fn_interfaceFormatSelect();
        
        if(!$this->bln_runQuery){
            if($this->bln_debugExecute){                
                $this->fn_varDump($this->bln_runQuery, "bln_runQuery is false, return");                                                      
            }      
            return;                                             
        }

        

        if($bln_getCountOnly){
            $this->obj_paramAPI->get_count=true;                
        }

        $this->obj_paramAPI->get_archive=false;                
        
        if($this->obj_metaRowz->obj_param->ArchivePin){
            $this->obj_paramAPI->get_archive=true;                
        }
        
        $this->obj_rowzAPI->fn_buildEndPoint($this->obj_paramAPI);              
        
        
        if($this->bln_debugAction || $this->bln_debugExecute){
            //$this->fn_varDump($this->obj_paramAPI, "this->obj_paramAPI", true);                                      
            //exit;
        }                 
        
        if($this->obj_post->ModeNewRecord){                                
            //$this->fn_varDump($this->obj_paramAPI," xxxthis->obj_paramAPI", true);                                      
            //exit;
        }                    
        

        //$this->fn_varDump($this->obj_paramAPI, "this->obj_paramAPI", true);                                      
        //exit;            
                    
        $obj_callBack=$this->fn_callAPIGet($this->obj_paramAPI, $this->obj_requestBodyAPI);                                    
        
        if($this->bln_debugAction || $this->bln_debugExecute){
            //$this->fn_varDump($this->obj_paramAPI," xxxthis->obj_paramAPI", true);                                      
            //exit;
        }     
        
        $bln_debug=$this->DebugServer;
        if($this->bln_debugAction){
            //$bln_debug=true;
        }                                       
        
        $bln_debug=false;
        $this->fn_validateAPICallBack($obj_callBack, $bln_debug);
        
        //$bln_debug=true;
        $bln_debug=false;
        if($bln_debug){
            //$this->fn_varDumpPost(true);
        }
        
        //$this->obj_post->CallBack=obj_callBack;
        $obj_response=$obj_callBack->response;            
        $this->obj_post->RowCount=$obj_response->row_count;

        if($obj_response->api_credit_updated){
            $this->userAliasClient->MetaSystem->Credit=$obj_response->credit;
            $this->fn_setSession("UserLoginSession", serialize($this->obj_userLogin));
            //$this->fn_varDump($obj_response->credit, "obj_response->api_credit_updated is true", true);                                      
        }

        /*
        'status_code' => 200,
        'status_message' => 'OK',
        'row_count' => 147,
        'row_returned' => 10,
        'column_count' => 29,
        'row_more' => true,
        'limit' => '10',
        'offset' => 0,
        //*/

        $obj_request=$obj_callBack->request;            
        $arr_rows=$obj_callBack->response_body;                 
        
        $this->arr_rows=false;
        $this->arr_row=false;
        if(!empty($arr_rows)){                
            
            $this->arr_rows=$arr_rows;
            $this->arr_row=$arr_rows[0];

            $this->obj_post->RowData=json_encode($arr_rows);                                

            if($this->bln_debugAction){
                //$this->fn_varDump($this->obj_post, "this->obj_post", true);                                      
                //exit;
            }     
        }

        $this->fn_interfaceGetStatementMeta($obj_callBack);
        
        if($this->obj_post->LinkOffPin){            
            $this->fn_removeAutoJoinOnLinkOff(false);            
        } 
        else if($this->obj_post->LinkOnPin){                        
            $this->fn_insertAutoJoinOnLinkOn();                        
        } 

        if($this->bln_debugRunSelect){
            $this->fn_addEcho("END EXECUTE fn_getDataQuery");                         
        } 
    }

    function fn_interfaceFormatSelect(){          
        
        $obj_paramView=$this->obj_metaView->obj_param;
        $MetaViewId=$obj_paramView->MetaViewId;
        
        if(empty($MetaViewId)){
            if($this->bln_debugExecute){                
                $this->fn_varDump($this->bln_runQuery, "fn_interfaceFormatSelect empty MetaViewId, return false. MetaRowzName [".$this->obj_post->MetaRowzName. "]");                                                                      
                //$this->fn_varDumpPost();                                                      
            }      
            $this->bln_runQuery=false;
            return;
        }

        if(empty($obj_paramView->ValidView)){
            if($this->bln_debugExecute){                
                $this->fn_varDump($obj_paramView->ValidView, "obj_paramView->ValidView");                                                      
            }      

            $this->bln_runQuery=false;
            return;
        }
        
        $this->obj_paramAPI=$this->obj_rowzAPI->fn_getRequest();                                      
        $this->obj_paramAPI->view_id=$this->obj_metaView->obj_param->MetaViewId;                                                                                
        $this->obj_paramAPI->get_user=true;  
        $this->obj_paramAPI->get_fqsn=true;                                                                                
        
        $str_requestBody=json_encode("");
        $obj_requestBody=new StdClass;
        $this->obj_requestBodyAPI=$obj_requestBody;                
        
        $this->fn_interfaceCollateMetaViewColumns();                                       
        
        //DEBUG
        //$this->fn_varDump($this->arr_metaColumn, "this->arr_metaColumn", true);                   
        //DEBUG
        
        $arr_selectColumn=[];
        foreach($this->arr_metaColumn as $obj_metaColumn){            
            $str_label=$obj_metaColumn->MetaViewId.".".$obj_metaColumn->MetaColumnAPIName;
            array_push($arr_selectColumn, $str_label);
        }        
        
        $str_selectColumn=json_encode($arr_selectColumn);        
        if(count($arr_selectColumn)){
            $this->obj_paramAPI->select_column=$str_selectColumn;                                                                                                
        }
        //$this->obj_paramAPI->select_column='["*"]';  
                
        $this->bln_runQuery=true;
        //return;
        
     
                         
        $this->fn_interfaceFormatSQLQuery();           
        $this->fn_interfaceFormatSQLOrderBy();
        //$this->fn_formatSQLCollate();        
        $this->fn_interfaceFormatSQLLimit();
    }    

    function fn_callAPIGet($obj_param, $obj_requestBody, $bln_debug=false){          

        
        
        $str_requestBody=json_encode($obj_requestBody);        
        
        /*
        $this->fn_varDump($obj_param, "obj_param", true);                                                                                                                          
        $this->fn_varDump($obj_requestBody, "1 obj_requestBody", true);        
        $this->fn_varDump($str_requestBody, "str_requestBody", true);        
        exit;
        //*/
        //return;
        if($this->bln_debugAction){                
            //$this->fn_varDump($obj_param->str_urlEndpoint, "obj_param->str_urlEndpoint", true);                                      
            //exit;
        }           
        $str_response=$this->obj_rowzAPI->fn_get($obj_param->str_urlEndpoint, $str_requestBody, $bln_debug);                                                                
        //$this->fn_varDump($str_response, "str_response", true);                
        $obj_response=json_decode(strval($str_response));                                           
        if(!$this->fn_validateJSONDecode($obj_response, "[Interface Get]"))exit;
        return $obj_response;
    }      
    
    function fn_interfaceGetMetaViewColumnSQL(){                        

        $obj_paramView=$this->obj_metaView->obj_param;
        $obj_paramRowz=$this->obj_metaRowz->obj_param;
        $obj_userLogin=$this->obj_userLogin;        
        
        //Get the Fields shich should be selected from the view form and  column.
        //Meta constraint should ensure that the user is entiled to the view.
        //Currently this is done by a join from the schema to the view and the function fn_get MetaUserIdConstraint
      
        //Proposal:
        //Schema Access wil always be quite wide, as most schemas will be owned by 100
        //Change the join to the user join the rowz table
        //find a way to ensure the schemauserid, viewuserid, metarowzid is within permission
        //presumabyl in the useridconstraint, specified fields names     
        

        //$this->fn_varDump($this->obj_metaView->obj_param, "GET VIEW obj_paramView");
        //$this->fn_varDump($this->bln_selectMinimalFieldPin, "this->bln_selectMinimalFieldPin", true);        
        //$this->fn_varDump($this->bln_selectMinimalFieldPin, "bln_selectMinimalFieldPin", true);    
        
        $str_fieldlist=$this->fn_interfaceSelectFieldListColumnz();            
        //ALWAYS SELECT MINIMAL FIELDS
        //SELECTIVELY APPLY MINIMAL FIELD LIST CRITERIA , Accoring TO DB menu field  or distinct pin                            
                
        
        // grab select columns
        //arrRowzMetaView : the (now non existent?) join below to meta rowz and the user requires that there is permission to access the menu containing the dataset, or childmenus  
        
        //collate the designer field list via sql        
        $str_sql="";        
        $str_sql.="SELECT $str_fieldlist FROM         
        `meta_column`.`meta_column`                     
        ";
        $str_sql.="WHERE ";

        $str_sqlWhere="";
        
        
        if($this->bln_selectMinimalFieldPin){
            $str_fieldQuery=$this->fn_interfaceSelectMinimalFieldCriteria();            
            if(!empty($str_fieldQuery)){
                if(!empty($str_sqlWhere)){$str_sqlWhere.=" AND ";}
                $str_sqlWhere.=$str_fieldQuery;                
            }
            else{
                $this->bln_evaluateMetaViewColumnSQL=true;
            }            
        }    
        

        if(!empty($str_sqlWhere)){$str_sqlWhere.=" AND ";}        
        $str_sqlWhere.="(        
            `meta_column`.`MetaColumnSystemId`=$obj_userLogin->MetaUserSystemId ";             
        if(!empty($obj_paramView->MetaViewId)){          
            
            $str_sqlWhere.="/*METAVIEW*/
            AND `meta_column`.`MetaSchemaName`='$obj_paramView->MetaSchemaName' AND `meta_column`.`MetaTableName`='$obj_paramView->MetaTableName' ";        
        }
        $str_sqlWhere.=" AND `meta_column`.`LivePin`
        ) ";

        $str_sql.=$str_sqlWhere;

        
        

        $str_sql.=" ORDER BY `meta_column`.`FormOrder`, `meta_column`.`MetaLabel`;";                       

        //$this->fn_addConsole("str_sql", $str_sql);  
        
        //$this->fn_varDump($str_sql, "str_sql", true);
  
        return $str_sql;
    }

    function fn_interfaceSelectFieldListColumnz(){        

        $str_fieldlist="                                    
            `meta_column`.`meta_column`.`MetaSchemaName`, 
            `meta_column`.`meta_column`.`MetaTableName`, 
            `meta_column`.`meta_column`.`MetaColumnId`, 
            `meta_column`.`meta_column`.`MetaColumnName`,
            `meta_column`.`meta_column`.`MetaColumnAPIName`,
            `meta_column`.`meta_column`.`SectionTitle`,            
            `meta_column`.`meta_column`.`MetaColumnType`,
            `meta_column`.`meta_column`.`MetaLabel`,
            `meta_column`.`meta_column`.`DebugPin`,             
            `meta_column`.`meta_column`.`FormOrder`,
            `meta_column`.`meta_column`.`MetaList`,
            `meta_column`.`meta_column`.`MetaOption`,
            `meta_column`.`meta_column`.`MetaSQL`,                
            `meta_column`.`meta_column`.`LivePin`,
            `meta_column`.`meta_column`.`SearchPin`,
            `meta_column`.`meta_column`.`HiddenPin`,
            `meta_column`.`meta_column`.`LockedPin`,                                    
            `meta_column`.`meta_column`.`RequiredPin`,                        
            `meta_column`.`meta_column`.`PrimaryPin`,
            `meta_column`.`meta_column`.`MenuPin`,
            `meta_column`.`meta_column`.`MetaPermissionTag`,            
            `meta_column`.`meta_column`.`InfoPin`,            
            `meta_column`.`meta_column`.`DefaultValue`,            
            `meta_column`.`meta_column`.`MetaClassType`,                        
            `meta_column`.`meta_column`.`MetaColumnGroup`            
            ";   
            
            /*            
            `meta_data`.`meta_data`.`MetaDataOwnerId`,                                
            `meta_data`.`meta_data`.`MetaDataSystemId`                                            
            //*/
            

        return $str_fieldlist;
    }
    


    function fn_interfaceSelectMinimalFieldCriteria(){        

        $obj_paramView=$this->obj_metaView->obj_param;
        
        if(empty($obj_paramView->ValidView)){
            //$this->fn_addEcho("fn_selectMinimalFieldCriteria ValidView is Empty Return");            
            return false;
        }    
        
        //$this->fn_varDump("fn_selectMinimalFieldCriteria ", "", true);

        $str_bracket="";//should not have a bracket around id numbers 
        $str_sql="SELECT 
        group_concat(MetaColumnId) as List FROM `meta_column`.`meta_column`         
        WHERE TRUE         
        AND `MetaColumnSystemId`=:MetaColumnSystemId        
        AND `MetaSchemaName`=:MetaSchemaName
        AND `MetaTableName`=:MetaTableName        
        AND (`MenuPin` OR `InfoPin` OR `SearchPin`)
        ;";

        /*
        $this->fn_addEcho("str_sql: ".$str_sql);
        $this->fn_addEcho("MetaColumnSystemId: ".$this->obj_userLogin->MetaUserSystemId);
        $this->fn_addEcho("MetaSchemaName: ".$obj_paramView->MetaSchemaName);
        $this->fn_addEcho("MetaTableName: ".$obj_paramView->MetaTableName);        
        //*/

        $stmt=$this->fn_executeSQLStatement($str_sql, [
            "MetaColumnSystemId" => $this->obj_userLogin->MetaUserSystemId,            
            "MetaSchemaName" => $obj_paramView->MetaSchemaName,
            "MetaTableName" => $obj_paramView->MetaTableName
        ]);  
        
        $str_columnList=$this->fn_fetchColumn($str_sql, [
            "MetaColumnSystemId" => $this->obj_userLogin->MetaUserSystemId,            
            "MetaSchemaName" => $obj_paramView->MetaSchemaName,
            "MetaTableName" => $obj_paramView->MetaTableName
        ]);
        
        if(empty($str_columnList)){
            $this->fn_addEcho("fn_selectMinimalFieldCriteria str_columnList is Empty, return: ".$str_columnList);
            //return " (TRUE) AND ";            
            return false;            
        }

        $str_columnList=$str_bracket.$str_columnList.$str_bracket;        
        $str_fieldQuery=" `meta_column`.`meta_column`.`MetaColumnId` IN($str_columnList) ";     
        
        //$this->fn_varDump($str_fieldQuery, "str_fieldQuery", true);
        return $str_fieldQuery;
        
    }


    function fn_interfaceCollateMetaViewColumns(){                                

        $obj_paramView=$this->obj_metaView->obj_param;

        $this->obj_queryMetaWhere=new stdClass;

        if($this->bln_debugRunSelect){
            $this->fn_addEcho("START fn_collateMetaViewColumns");                
        }

        if(!$obj_paramView->ValidView){                                            
            return;
        }        
        
        if($obj_paramView->MetaViewSystemId===100){            

            /*
            //KEEP FOR REFERENMCE, FOR TROUBLESHOOTING IF ANY FURTURES SYSTE? VIEWS ARE ADDED
            //meta_column, meta_rowz, meta_view, meta_topup, meta_mall, meta_system, meta_mover            
            //handled in fn_pullTemplateColumnz, on first child row with a view
            $obj_paramColumnPull=new stdClass;        
            $obj_paramColumnPull->MetaColumnSystemIdTemplate=$this->obj_userBase->MetaUserSystemId;//used in template            
            $obj_paramColumnPull->MetaColumnSystemId=$this->obj_userLogin->MetaUserSystemId;//create column                
            $obj_paramColumnPull->MetaColumnOwnerId=$this->obj_userLogin->MetaUserSystemId;//create column                
            $obj_paramColumnPull->MetaPullName=$obj_paramView->MetaViewName;        
            $obj_paramColumnPull->MetaSchemaName=$obj_paramView->MetaSchemaName;//create column                
            $obj_paramColumnPull->MetaTableName=$obj_paramView->MetaTableName;//create column                
            $this->fn_pullViewColumnz($obj_paramColumnPull);
            //*/
        }
        

        $this->bln_evaluateMetaViewColumnSQL=false;
        $str_sql=$this->fn_interfaceGetMetaViewColumnSQL();              
        
        if($this->bln_debugRunSelect){            
            $this->fn_addConsole("columns str_sql", $str_sql);
        }

        if($this->bln_debugRunSelect){
            $this->fn_addEcho("obj_paramView->ValidView: ".$obj_paramView->ValidView);                
        }
        

        if($this->bln_debugExecute){
            $this->str_messageExecute="get column data";        
        }
        

        $stmt=$this->fn_executeSQLStatement($str_sql);                
        $arr_rows=$stmt->fetchAll();        
        
        
        if($this->bln_debugQuery){            
            //$this->fn_varDump($arr_rows, "xarr_rows");
        }          

        if($arr_rows){        
            //$this->fn_setMessage("1 META COLUMNS IS NOT EMPTY count[".count($arr_rows)."][ViewId:".$this->obj_metaView->obj_param->MetaViewId."][".$this->obj_metaView->obj_param->MetaSchemaName.".".$this->obj_metaView->obj_param->MetaTableName."][".$str_sql."]");            
        }
        
        if(!$arr_rows && $obj_paramView->ValidView){                                                        
            
            if($this->bln_evaluateMetaViewColumnSQL){
                $str_sql=$this->fn_interfaceGetMetaViewColumnSQL();//repeat, as maybe new rows have been added.      
            }
            $stmt=$this->fn_executeSQLStatement($str_sql);        
            $arr_rows=$stmt->fetchAll();        
        }                
        if(!$arr_rows){
            if($obj_paramView->ValidView){                        
                //$this->fn_setError("META COLUMNS IS EMPTY - AFTER AUTOFORMSYSTEM [ViewId:".$this->obj_metaView->obj_param->MetaViewId."][".$this->obj_metaView->obj_param->MetaSchemaName.".".$this->obj_metaView->obj_param->MetaTableName."][".$str_sql."]");            
            }
            
            if($this->bln_debugRunSelect){
                $this->fn_addEcho("END fn_collateMetaViewColumns");                            
            }
            return;            
        }
        
        $this->arr_rowsMetaView=$arr_rows;
        //$this->fn_varDump($arr_rows, "arr_rows");                    
        
        $this->fn_interfaceCollateMetaColumn();        
        $this->fn_interfaceCollateMetaViewWhere();          
        $this->fn_interfaceCollateMetaViewOrderBy();        
      }   

      
    function fn_interfaceCollateMetaColumn(){        

        $obj_paramView=$this->obj_metaView->obj_param;

        $arr_rows=$this->arr_rowsMetaView; 

        $this->arr_metaColumn=[];
        
        foreach ($arr_rows as $arr_row) {            
            
            $obj_meta=new metaColumn();                 
            $obj_meta->MetaViewId=$obj_paramView->MetaViewId;
            $obj_meta->MetaSchemaName=$obj_paramView->MetaSchemaName;
            $obj_meta->MetaTableName=$obj_paramView->MetaTableName;        
            $obj_meta->MetaTableKeyField=$obj_paramView->MetaTableKeyField;

            $obj_meta->MetaColumnName=$arr_row["MetaColumnName"];
            $obj_meta->MetaColumnAPIName=$arr_row["MetaColumnAPIName"];            
            $obj_meta->MetaColumnId=$arr_row["MetaColumnId"];                
            $obj_meta->SectionTitle=$arr_row["SectionTitle"];
            $obj_meta->MetaColumnType=$arr_row["MetaColumnType"];
            $obj_meta->MetaLabel=$arr_row["MetaLabel"];          
            $obj_meta->DebugPin=$arr_row["DebugPin"];                                  
            $obj_meta->FormOrder=$arr_row["FormOrder"];            
            $obj_meta->MetaList=$arr_row["MetaList"];
            $obj_meta->MetaOption=$arr_row["MetaOption"];
            $obj_meta->MetaSQL=$arr_row["MetaSQL"];            
            $obj_meta->LivePin=$arr_row["LivePin"];
            $obj_meta->SearchPin=$arr_row["SearchPin"];            
            $obj_meta->HiddenPin=$arr_row["HiddenPin"];            
            $obj_meta->LockedPin=$arr_row["LockedPin"];                        
            $obj_meta->RequiredPin=$arr_row["RequiredPin"];                                    
            $obj_meta->PrimaryPin=$arr_row["PrimaryPin"];
            $obj_meta->MenuPin=$arr_row["MenuPin"];
            $obj_meta->MetaPermissionTag=$arr_row["MetaPermissionTag"];
            $obj_meta->InfoPin=$arr_row["InfoPin"];            
            $obj_meta->DefaultValue=$arr_row["DefaultValue"];
            $obj_meta->MetaClassType=$arr_row["MetaClassType"];            
            $obj_meta->MetaColumnGroup=$arr_row["MetaColumnGroup"];                                    
            
            array_push($this->arr_metaColumn, $obj_meta);                
        } 
        //loop haas finished

        $this->arr_metaDataColumn=$this->obj_rowzAPI->fn_addMetaData();
        $this->arr_metaColumn=array_merge($this->arr_metaColumn, $this->arr_metaDataColumn);                            

        $this->arr_metaUserColumn=$this->obj_rowzAPI->fn_addMetaUser();
        $this->arr_metaColumn=array_merge($this->arr_metaColumn, $this->arr_metaUserColumn);                            

        //$this->fn_varDump($this->arr_metaColumn, "this->arr_metaColumn", true);
    }
    function fn_interfaceGetMetaDataOwnerScopeConstraint(){ 

        $this->obj_queryScopeMetaData=new stdClass;

        $MetaUserId=$this->obj_userLogin->MetaUserId;
        $MetaUserGroupId=$this->obj_userLogin->MetaUserGroupId;                
        $MetaDataSystemId=$this->obj_userLogin->MetaUserSystemId;        

        $MetaDataScopeAllAccess=0;        
        $MetaDataScopeGroupAccess=1;
        $MetaDataScopeOwnAccess=2;

        $MetaDataScope=$MetaDataScopeAllAccess;
        
        $arr_where=[];

        switch($MetaDataScope){
            case($MetaDataScopeOwnAccess):

                $obj_where=new stdClass;
                $obj_where->{$this->MetaDataViewId.".MetaDataOwnerId"}=$MetaUserId;            
                array_push($arr_where, $obj_where);    
                $this->obj_queryScopeMetaData->{"\$and"}=$arr_where;            
            break;
            
            case($MetaDataScopeGroupAccess):
                $obj_where=new stdClass;
                $obj_where->{$this->MetaDataViewId.".MetaUserGroupId"}=$MetaUserGroupId;
                array_push($arr_where, obj_where);
                $this->obj_queryScopeMetaData->{"\$and"}=$arr_where;
                break;
        }    
    } 

    function fn_interfaceFormatSQLCollate(){

        $str_sql=" COLLATE utf8mb4_general_ci ";        
        $this->str_sqlStatement.=$str_sql;
        $this->str_sqlStatementCount.=$str_sql;
    }

 
    function fn_interfaceCollateMetaViewWhere(){        

        $obj_paramView=$this->obj_metaView->obj_param;
        $obj_paramRowz=$this->obj_metaRowz->obj_param;

        $MetaViewId=$this->obj_post->MetaViewId;
        $arr_rows=$this->arr_rowsMetaView;        
        //$this->fn_varDump($arr_row, "arr_row");
        $arr_row=$arr_rows[0];        
        
        $this->arr_metaWhere=[];
        $this->str_metaWhere="";
        

        $arr_where=[]; 

        
        if(is_null($obj_paramView->MetaWhere)){
            $obj_paramView->MetaWhere="";            
        }        
        if(!empty($obj_paramView->MetaWhere)){
            $str_metaViewWhere=$this->fn_interfaceReplaceSessionCodes($obj_paramView->MetaWhere);
            $obj_where=json_decode($str_metaViewWhere);
            array_push($arr_where, $obj_where);     
        }

        //this is a convienient way of adding to the where criteria        
        if(!empty($obj_paramView->FilterOnSubDomainPin)){            
           
            
            $str_subdomain=$this->fn_interfaceReplaceSessionCodes("{Subdomain}");
            $str_label=$obj_paramView->MetaViewId.".Subdomain";
            $str_value=$str_subdomain;
            
            $arr_item=array($str_label=>$str_value);
            $str_metaWhere=json_encode($arr_item);
            $obj_where=json_decode($str_metaWhere);            
            array_push($arr_where, $obj_where);
                
        }    

        //$this->fn_varDump($arr_where, "arr_where", true);
       
        if(count($arr_where)){
            $this->obj_queryMetaWhere->{"\$and"}=$arr_where;
            //$this->bln_debug=true;
        }

        //$this->fn_varDump($this->obj_queryMetaWhere, "this->obj_queryMetaWhere", true);   
    }
    function fn_interfaceCollateMetaViewOrderBy(){        

        $obj_paramView=$this->obj_metaView->obj_param;
        
        if(is_null($obj_paramView->MetaOrderBy)){
            $obj_paramView->MetaOrderBy="";            
        }
        if(!empty($obj_paramView->MetaOrderBy)){
            $this->str_jsonMetaOrderByView=urlencode($obj_paramView->MetaOrderBy);
        }
    }    

      
}//END OF CLASS


?>