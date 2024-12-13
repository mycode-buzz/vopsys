<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class server_interface extends interface_legacy{
    function __construct() {                        
        
        parent::__construct();                                        
    }

    function fn_getMetaOptionDefault($MetaColumnType){

        
        switch(strtolower($MetaColumnType)){
            case "text":
                return $this->MetaOptionDefaultText;            
            case "recordid":
                return $this->MetaOptionDefaultRecordId;                        
            case "number":
                return $this->MetaOptionDefaultNumber;                        
            case "currency":
                return $this->MetaOptionDefaultCurrency;                        
            case "percent":
                return $this->MetaOptionDefaultPercent;                        
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
    
    function fn_initialize() {
        
        
        parent::fn_initialize();                                        
        //initalization code needs to remain here rather than in the consturctor, due to object hierachy functions                
        
        
        $obj_post=$this->obj_post;                
        $obj_post->RowData="[{}]";                
        $this->bln_runQuery=true;       
        $this->bln_reloadSection=false;
        $this->bln_reloadPage=false; 
        $this->str_sqlStatement="";
        $this->str_sqlStatementCount="";

        $this->arr_param=[];                                                   
        $this->MetaOptionDefaultNumber='{"Decimal": "0"}';
        $this->MetaOptionDefaultRecordId=$this->MetaOptionDefaultNumber;
        $this->MetaOptionDefaultCurrency='{"UnSigned": "true", "Decimal": "2"}';
        $this->MetaOptionDefaultPercent='{"UnSigned": "true", "Decimal": "2"}';        
        $this->MetaOptionDefaultCheckbox=NULL;
        $this->MetaOptionDefaultDate=NULL;
        $this->MetaOptionDefaultDateTime='{"DateTimeSecond": "false"}';
        $this->MetaOptionDefaultText=NULL;        
        $this->MetaOptionDefaultNote=NULL;                        
        $this->MetaOptionDefaultJSON=$this->MetaOptionDefaultNote;        
        $this->MetaOptionDefaultEmail=NULL;                        
        $this->MetaOptionDefaultURL=$this->MetaOptionDefaultText;
        $this->MetaOptionDefaultColor=NULL;
        $this->MetaOptionDefaultPhone=NULL;

        //metaList
        //{"MetaViewId":"200007","SelectField":"Name","WhereField":"MetaGroup","WhereCriteria":"","AllowMultiple":false}        
        //{"ListMember":"Apple,Orange,Pear"}
        //Type//{"ListMember": "Suspect,Prospect,Customer"}
        //Status//{"ListMember": "Lead,Contacted,Qualified,Nurturing,Mid-Stage,Proposal,Meeting,Demo,Negotiating,Contract Sent,Contract Signed,Won,Lost,Disqualified,Inactive","ArchiveStatus": "Won,Lost,Disqualified,Inactive"}
        //Currency//{"ListMember": "USD,GBP,EUR"}
        
        //MaxLength//{"ListMember": "25,50,100,1000,5000,10000"}
        
        //Sector//{"ListMember": "Technology,Finance,Healthcare,Real Estate,Retail,Manufacturing,Professional Services,Education,Non-profit"}
        //Priority//{"ListMember": "Low,Normal,Important,Urgent"}        
        //Country//{"ListMember": "Australia,Brazil,Canada,China,France,Germany,India,Italy,Japan,Mexico,Russia,SouthKorea,Spain,UnitedKingdom,UnitedStates"}
        //Product//{"ListMember": "Widget,Service"}
        //State//{"ListMember": "State1,State2,State3"}
        //Title//{"ListMember": "Sir,Madam,M.,Mr.,Mrs.,Ms."}
        //Role//{"ListMember": "Decision Maker,Owner,Director,Manager,Supervisor,Assistant,Consultant,CEO,CFO,CTO,VP"}
        //Task//{"ListMember": "Call,Email,Meeting,Send Contract"}
        //Favourite//{"ListMember": "Golf,Football,Rugby,Cricket,Sailing,Baseball,Basketball,Boxing,Tennis,Cycling,Swimming,Surfing,Track and Field,Gymnastics,Other","AllowMultiple":"true"}
        //{"ListMember":"Number,RecordId,Currency,Checkbox,Date,DateTime,Text,Note,JSON,Email,URL,Color,Phone"}
        
        /*
        $obj_metaList->MetaViewId
        $obj_metaList->ListMember
        $obj_metaList->SelectField
        $obj_metaList->WhereField=
        $obj_metaList->WhereCriteria
        $obj_metaList->AllowMultiple
        //*/
        
        if($this->obj_post->MetaSchemaName==="meta_data" && $this->obj_post->MetaTableName==="meta_data"){
            //$this->obj_post->MetaViewId=$this->MetaDataViewId;
            //for when meta data is updated, check if this can be achieved differently                
        }

        
        $this->obj_metaView=new metaView($this);
        $this->obj_metaView->fn_initialize($this->obj_post->MetaViewId);
        
        $this->obj_metaRowz=new metaRowz($this);        
        $this->obj_metaRowz->fn_initialize($this->obj_post->MetaRowzId);        
        
        ///////////////////////////
        
        $this->bln_hasSimpleSearch=false;        

        $this->obj_post->URLNavigateMenu=$this->fn_getURLNavigateStandardMenu($this->obj_post->URLMetaRowzNameArchive);

        /////////////////////////
             
        
        $this->str_listSeparator="-";                        
        $this->str_listSeparatorOr="XORX";
        $this->str_listSeparatorAnd="XANDX";
                
        $this->arr_metaColumn=[];        
        
        $this->str_queryExpression=$obj_post->QueryExpression;      
        

        
        if($this->bln_debugExecute){
            $this->fn_debugPost();
        }

        
        

      
        $this->bln_hasValidKey=false;
        if(!empty($this->obj_post->MetaKeyColumnValue) && empty($this->obj_post->AutoJoinPin)){
            $this->bln_hasValidKey=true;
        }

        $this->bln_selectMinimalFieldPin=true;  
        
        if($this->obj_metaView->obj_param->DynamicMenuPin || $this->bln_hasValidKey || $this->obj_metaView->obj_param->SystemPin || $this->obj_post->ModeNewRecord){            
            $this->bln_selectMinimalFieldPin=false;
        }
            
        /*
        if($this->bln_selectMinimalFieldPin){
            $this->fn_addEcho("this->obj_post->MetaKeyColumnValue", $this->obj_post->MetaKeyColumnValue);
            $this->fn_addEcho("this->bln_hasValidKey", $this->bln_hasValidKey);
            $this->fn_addEcho("bln_selectMinimalFieldPin", $this->bln_selectMinimalFieldPin);            
        }
        //*/
        
    }  

    function fn_getObjectProperty($obj_my, $str_label){

        /*
        if($this->bln_debugAction){
            $this->fn_varDump($obj_my, "obj_my");                      
            $this->fn_varDump($str_label, "str_label");                      
            exit;                        
        }  
        //*/                             
        
        if(empty($obj_my->{$str_label})){
            $str_label=strtolower($str_label);     
        }
        return $obj_my->{$str_label};             
    }


    function fn_debugPost(){
        $obj_post=$this->obj_post;      
        //$this->fn_addEcho("obj_post->ClassList: ".$obj_post->ClassList);
        //$this->fn_addEcho("obj_post", $obj_post);
      }

    function fn_executePage() {                
        
        
        parent::fn_executePage();


        
        
        //$this->fn_addEcho("START INTERFACE  this->obj_post->Action", $this->obj_post->Action, true);                      
        
        //$this->fn_varDumpPost();

        if($this->bln_debugAction || $this->bln_debugExecute){
            //$this->fn_varDump($this->obj_post->Action, "this->obj_post->Action", true);                                                          
            //$this->fn_varDump($this->obj_metaView->obj_param, "this->obj_metaView", true);                                                                      
            //exit;                        
        }                                
                
        switch($this->obj_post->Action){                       
            case "getDataCountQuery":                                                                      
                //$this->bln_debugAction=true;                                        
                $this->fn_interfaceGetDataQuery(true);                                                
            break;       
            case "getDataQuery":                                                                     
                $this->fn_interfaceGetDataQuery();                                            
            break;                   
            case "runPushColumn":                             
                //$this->bln_debugAction=true;
                $this->fn_runPushColumn();
            break; 
            case "runArchiveRecord":
                $this->fn_runArchiveRecord();
            break; 
            case "getChildRowz":                                                              
                $this->fn_getChildRowz();                                 
            break;
            case "getDropdownList":                    
                $this->fn_getDropdownList();
            break;                   
            case "getAdditionalButton":
                $this->fn_getAdditionalButton();
            break;                           
          default:          
        }   
        
        
        
        //$this->fn_addEcho("END INTERFACE  this->obj_post->Action", $this->obj_post->Action, true);                      
        
        if($this->bln_debugAction){
            //$this->fn_addEcho("zz DebugAction, return");                      
            //exit;                        
        }                               

        if($this->bln_reloadPage){            
            $this->obj_post->RedirectURL=$this->fn_getSubdomainURL("app");                        
        }
 
        if($this->bln_reloadSection){            
            $this->obj_post->ReloadSection=true;                        
            //$this->fn_varDumpPost();
        }
                
    }

    

    function fn_interfaceCleanTag($str_tag){
        
        return strtoupper(trim($str_tag));                                            
    }
    
    
    function fn_interfaceGetStatementMeta($obj_callback){      
        

        $obj_response=$obj_callback->response;
        $obj_response_body=$obj_callback->response_body;
        //$this->fn_varDump($obj_callback, "obj_callback", true);
        //return;
        
        $int_columnCount=$obj_response->column_count;            

        //$this->fn_varDump($int_columnCount, "int_columnCount");
                       
        
        $arr_metaColumn=$this->arr_metaColumn;                
        $int_metaColumn=count($arr_metaColumn);        

        for($i=0;$i<$int_columnCount;$i++) {                                                                       
            
            if($int_metaColumn<$int_columnCount){
                $obj_metaColumn=new metaColumn();                                
                array_push($arr_metaColumn, $obj_metaColumn);
            }            
            else{
                $obj_metaColumn=$arr_metaColumn[$i];
            }                             
            
            $obj_metaColumn->arr_metaColumnPDO=$arr_metaColumnPDO=$this->obj_rowzAPI->stmt->getColumnMeta($i);                                                            
            //$this->fn_varDump($obj_metaColumn->arr_metaColumnPDO, "obj_metaColumn->arr_metaColumnPDO 6789");
            
        }                  
        
        $this->obj_post->MetaColumn=json_encode($arr_metaColumn);                        
        //$this->obj_post->MetaView=json_encode($this->obj_metaView->obj_param);        
        //$this->fn_varDump($this->obj_post->MetaView, "MetaViewx");
        //$this->fn_varDump($arr_metaColumn, "arr_metaColumn 12345");
    }

    
    function fn_validateAPICallBack($obj_callBack, $bln_debug=false){



        if($bln_debug){
            //$this->fn_varDump($obj_callBack, "obj_callBack", true);              
        }

        
         
        $obj_response=$obj_callBack->response;
        $obj_request=$obj_callBack->request;
        $this->obj_post->StatusCode=$obj_response->status_code;
        $this->obj_post->MetaViewId=$obj_request->view_id;   
        
        


        switch($obj_response->status_code){
            case "490"://error view
            case "200"://ok
                $this->fn_setResponse($obj_response);
            break;
            default:
                $this->fn_setError($obj_response->status_message);
            break;
        }        
        return true;
    }
    
        
    
    
    function fn_interfaceReplaceSessionCodes($str_text){

        $arr_needle=[                        
            "{AuthUserId}",
            "{AuthUserEmail}",
            "{MetaUserId}",
            "{MetaUserEmail}",
            "{MetaUserSystemId}",
            "{MarkedParentSchemaName}",
            "{MarkedParentTableName}",
            "{MarkedParentRowzId}",               
            "{MarkedParentViewId}",   
            "{Subdomain}",
            "{MetaViewId}",            
        ];
        $arr_replace=[            
            $this->obj_userLogin->MetaUserId,            
            $this->obj_userLogin->MetaUserEmail,            
            $this->obj_userLogin->MetaUserId,            
            $this->obj_userLogin->MetaUserEmail,            
            $this->obj_userLogin->MetaUserSystemId,
            $this->obj_post->MarkedParentSchemaName,                        
            $this->obj_post->MarkedParentTableName,                        
            $this->obj_post->MarkedParentRowzId,                        
            $this->obj_post->MarkedParentViewId,            
            $this->str_subDomain,            
            $this->obj_post->MetaViewId,            
        ];

        $str_value=str_replace($arr_needle, $arr_replace, $str_text);                
        
        return $str_value;
        
    }

    function fn_interfaceLoadQueryListFromDB(){        

        $MetaRowzId=$this->obj_post->MetaRowzId;
        if(empty($MetaRowzId)){return;}
        
        $str_sql="SELECT `QueryList`, `QueryListDisabled` FROM `meta_rowz`.`meta_rowz`        
        WHERE TRUE AND
        MetaRowzId=:MetaRowzId
        ;";              
      
      
        $stmt = $this->fn_executeSQLStatement($str_sql, [      
            'MetaRowzId'=>$MetaRowzId
        ]);                        
        
        $arr_row=$stmt->fetch();
        if(empty($arr_row)){
            return;
        }
        //there will always be a row, however
        
        $QueryList=$arr_row["QueryList"];            
        $QueryListDisabled=$arr_row["QueryListDisabled"];
        //$this->fn_varDump($QueryList, "LOAD QueryList");
  
        $this->obj_userLogin->QueryList=$QueryList;
        $this->obj_userLogin->QueryListDisabled=$QueryListDisabled;        
        $this->fn_setSession("UserLoginSession", serialize($this->obj_userLogin));
    }
  
    
      
}//END OF CLASS


?>