<?php

class rowzAPI extends rowzAPIWhere{    

    function __construct() {                     

        $this->fn_setLokalDomain();        
                                      
        $this->bln_debug=false;
        $this->limit=10;
        $this->max_limit=100;

        $this->arr_metaColumn=[];
        $this->arr_metaDataColumn=[];

        /////////////////
        $this->MetaDataViewId="101426";//meta_data
        $this->MetaDataViewName="meta_data";

        $this->MetaUserViewId="1";//meta_user
        $this->MetaUserViewName="meta_user";

        $this->MetaLinkViewId="100475";//meta_link
        $this->MetaLinkViewName="meta_link";

        $this->MetaProjectViewId="110";//meta_link
        $this->MetaProjectViewName="Project";

        $this->MetaProjectTypeDynamicViewId="120";//meta_link
        $this->MetaProjectTypeDynamicViewName="ProjectTypeDynamic";

        /*Not currently required
        $this->MetaColumnViewId=45;//meta_user
        $this->MetaColumnViewName="meta_column";
        //*/
        
        $this->arr_listSystemView=array(
            $this->MetaDataViewId, 
            $this->MetaUserViewId, 
            $this->MetaLinkViewId,
            $this->MetaProjectViewId,
            $this->MetaProjectTypeDynamicViewId,            
        );
        /////////////////

        $this->OPEN_USER_API=false;
        $this->str_runtime=date("Y-m-d H:i:s");
        $this->date_runtime=$this->fn_getDateFromString($this->str_runtime);
        
        global $obj_page;
        $this->obj_page=false;
        if(!empty($obj_page)){            
            $this->obj_page=$obj_page;         
        }
    }    

    function fn_setLokalDomain($str_subDomain=false){       

        $this->bln_localHost=false;
        $this->str_lokalDomain="rowz.app";
        $this->str_lokalProtocol="https://";
        if (isset($_SERVER["REMOTE_ADDR"])) {if($_SERVER["REMOTE_ADDR"]==="127.0.0.1"){
          $this->bln_localHost=true;
          $this->str_lokalDomain="lokal-mycode.buzz";
          $this->str_lokalProtocol="http://";          
        }}
        $this->str_lokalURL=$this->str_lokalProtocol.$this->str_lokalDomain;        
        if(!empty($str_subDomain)){
            $this->str_activeSubdomainURL=$this->str_lokalProtocol.$str_subDomain.".".$this->str_lokalDomain;
        }
        else{
            $this->str_activeSubdomainURL=$this->str_lokalURL;
        }
      }

    function fn_exitTest($int_code=601){
        
        $this->response->status_code=$int_code;
        $this->response->status_message="Test";            
        $this->fn_writeResponse();                        
        return $this->obj_call->str_response; 

    }
    

    function fn_buildEndPoint($obj_param){

        //*
        if(empty($obj_param->api_domain)){
            $this->response->status_code=400;
            $this->response->status_message="[API buildEndpoint domain is not valid json]";                                    
            return;
        }        
        //*/

        $str_url="";
        $str_url.=$this->str_lokalProtocol."api.$obj_param->api_domain?";
        if(!empty($obj_param->view_id)){$str_url.="view_id=$obj_param->view_id&";}                
        
        if(!empty($obj_param->select_column)){
            if($obj_param->select_column!=="[]"){$str_url.="select_column=$obj_param->select_column&";}
        }        

        //DEFAULT TO ID IF GIVEN
        if(!empty($obj_param->row_matchid)){
            if(!is_numeric($obj_param->row_matchid)){
                $obj_param->row_matchid=0;
            }
            if($obj_param->row_matchid!==0){$str_url.="row_matchid=$obj_param->row_matchid&";}
        }             
        elseif(!empty($obj_param->row_match)){
            if($obj_param->row_match!=="[]"){$str_url.="row_match=$obj_param->row_match&";}
        }                  

        if(!empty($obj_param->order)){$str_url.="order=$obj_param->order&";}
       
        if(!empty($obj_param->limit)){$str_url.="limit=$obj_param->limit&";}                        
        
        if(!empty($obj_param->offset)){$str_url.="offset=$obj_param->offset&";}                        
        
        if(!empty($obj_param->cancel_get)){$str_url.="cancel_get=true&";} 

        if(!empty($obj_param->get_user)){$str_url.="get_user=true&";}
        
        if(!empty($obj_param->get_fqsn)){$str_url.="get_fqsn=true&";}

        if(!empty($obj_param->get_count)){$str_url.="get_count=true&";}

        if(!empty($obj_param->get_autojoin)){
            $str_url.="get_autojoin=true&";            
            $str_url.="JoinView=$obj_param->JoinView&";            
            $str_url.="JoinKeyName=$obj_param->JoinKeyName&";
            $str_url.="JoinKeyValue=$obj_param->JoinKeyValue&";
        }

        if(!empty($obj_param->get_archive)){$str_url.="get_archive=true&";}
        
        $str_url=trim($str_url, "&");        

        $obj_param->str_urlEndpoint=$str_url;
        
    }    

    
    
    function fn_getRequest(){

        $obj_call=new stdClass;        
        $obj_call->api_domain=$this->str_lokalDomain;
        $obj_call->url="";
        $obj_call->view_id=0;        
        $obj_call->select_column="";
        $obj_call->row_match="";
        $obj_call->row_matchid=0;    
        $obj_call->data_delete_date=NULL;            
        $obj_call->order="";           
        $obj_call->limit=$this->limit;        
        $obj_call->offset=0;                
        $obj_call->method="";        
        $obj_call->request_body="";
        $obj_call->cancel_get="";                   
        $obj_call->get_archive=false; 
        $obj_call->get_user=false; 
        $obj_call->get_fqsn=false;
        $obj_call->get_count=false;
        $obj_call->get_autojoin=false; 
        $obj_call->get_archive=false; 
        $obj_call->JoinView="";
        $obj_call->JoinKeyName="";            
        $obj_call->JoinKeyValue="";
        $obj_call->charge_pin=0;
        $obj_call->credit=0;
        $obj_call->column_count=0;
        $obj_call->HistoryFieldName="";
        $obj_call->HistoryFieldValue="";
        
        
        return $obj_call;
    }


    
    function fn_callInit($url, $method, $request_body=false, $bln_debug=false){        
        
        global $API_AUTHENTICATED;           

        $this->response=new stdClass;                                                        
        $this->response->status_code=500;                
        $this->response->status_message="Internal Server Errorxx";          
        $this->response->row_count=0; 
        $this->response->row_returned=0;  
        $this->response->column_count=0;                  
        $this->response->column_required=false;                                
        $this->response->row_more=false;                  
        
        $this->obj_call=$this->fn_getRequest();                                
        $this->obj_call->str_response="";
        $this->obj_call->response_body=[];                         
        $this->obj_call->method=$method;
        $this->obj_call->url=$url;
        $this->obj_call->obj_metaView=new metaView($this); 
        $this->obj_call->obj_metaView->obj_param=$this->obj_call->obj_metaView->fn_getParam();
        $this->obj_call->api_debug=false;
        $this->obj_call->api_credit_updated=false;        
        
        $this->fn_authenticate();               
        
        if(empty($API_AUTHENTICATED)){
            $this->response->status_code=401;
            $this->response->status_message="Unauthorized";            
            return;
        }
        
    

        $this->obj_call->arr_InOperator=[];
        $this->obj_call->arr_nameQuery=[];        
        $this->obj_call->arr_valueQuery=[];
        $this->obj_call->arr_metaWhere=[];    
        $this->obj_call->arr_valueOrder=[];    
        $this->obj_call->str_orderSQL="";            
        
        
        if(empty($request_body)){
            $this->request_body=file_get_contents("php://input");//str_json
        }
        else{
            $this->request_body=$request_body;
        }

        
        switch($this->obj_call->method){            
            case "PATCH":                
            case "POST":                
                if(is_null($this->request_body)){
                    $this->response->status_code=400;
                    $this->response->status_message="Bad Request [Malformed Request Body]";                        
                    return;
                  }
                break;
        }        
        
          
        $url_components = parse_url($this->obj_call->url);                        
        if(empty($url_components)){
            $this->response->status_code=400;
            $this->response->status_message="Bad Request [Malformed URL]";                        
            return;
        }

        $str_componentQuery="";
        if(!empty($url_components['query'])){$str_componentQuery = $url_components['query'];}                                              
        parse_str($str_componentQuery, $arr_componentQuery);        
        $this->obj_call->arr_componentQuery=$arr_componentQuery;                              
        
        //START INIT QUERY COMPONENTS
        $this->fn_initOptions();                                   
        $this->fn_initBaseView();                          
        $this->fn_initSelectColumn();                        
        $this->fn_initRowMatch();                    
        $this->fn_initRequestBody();             
        $this->fn_initOrderColumn();
        $this->fn_initOffset();                
        //END INIT QUERY COMPONENTS 

        //$this->obj_page->fn_varDump($this->obj_call->charge_pin, "obj_call->charge_pin", true);
        if($this->obj_call->charge_pin){
            

            $API_CREDIT=$this->fn_checkUseageAPI();
            if(empty($API_CREDIT)){                
                $this->response->status_code=402;
                $this->response->status_message="Payment Required [System Id ".$this->obj_userLogin->MetaUserSystemId."]";             
                return;
            }    
        }
        
    }   

        
    
    

    function fn_writeResponse(){        

        $response=$this->response;
        $obj_call=$this->obj_call;
        
        $obj_metaView=$obj_call->obj_metaView;                
        $obj_paramView=$obj_metaView->obj_param;
        
        $obj_param=new stdClass;                
        
        //WRITE OUT REQUEST FIELDS
        $obj_param->request=new stdClass;                  
        $obj_param->request->method=$obj_call->method;                  
        $obj_param->request->url=$obj_call->url;                      
        $obj_param->request->view_id=$obj_call->view_id;     
        
        $cancel_get=$obj_call->cancel_get;                
        if(!empty($cancel_get))$obj_param->request->cancel_get=$cancel_get;        
        

        $get_user=$obj_call->get_user;                
        if(!empty($get_user))$obj_param->request->get_user=$get_user;
        
        $get_fqsn=$obj_call->get_fqsn;                
        if(!empty($get_fqsn))$obj_param->request->get_fqsn=$get_fqsn;

        $get_count=$obj_call->get_count;                
        if(!empty($get_count))$obj_param->request->get_count=$get_count;

        $get_archive=$obj_call->get_archive;                
        if(!empty($get_archive))$obj_param->request->get_archive=$get_archive;
        

        $get_autojoin=$obj_call->get_autojoin;                
        if(!empty($get_autojoin))$obj_param->request->get_autojoin=$get_autojoin;        

        $JoinView=$obj_call->JoinView;                
        if(!empty($JoinView))$obj_param->request->JoinView=$JoinView;
        
        $JoinKeyName=$obj_call->JoinKeyName;                
        if(!empty($JoinKeyName))$obj_param->request->JoinKeyName=$JoinKeyName;

        $JoinKeyValue=$obj_call->JoinKeyValue;                
        if(!empty($JoinKeyValue))$obj_param->request->JoinKeyValue=$JoinKeyValue;

                        
        
        switch($obj_call->method){
            case "GET":
                $select_column=$obj_call->select_column;                
                if($select_column==="[]")$select_column="";                                
                if(!empty($select_column))$obj_param->request->select_column=$select_column;
                                
                                

                $row_matchid=$obj_call->row_matchid;                
                //if(!empty($row_matchid))$obj_param->request->row_matchid=$row_matchid;
                $obj_param->request->row_matchid=$row_matchid;
                
                $row_match=$obj_call->row_match;                                
                if(!empty($row_match))$obj_param->request->row_match=$row_match;      
                
                $limit=$obj_call->limit;                
                if(!empty($limit))$obj_param->request->limit=$limit;                

                $offset=$obj_call->offset;                
                if(!empty($offset))$obj_param->request->offset=$offset;

                

                /*
                $request_body=$obj_call->request_body;                
                if($request_body==="{}")$request_body="";                                
                if(!empty($request_body))$obj_param->request->request_body=$request_body;                                
                //*/

                
                break;
            case "PATCH":
                $select_column=$obj_call->select_column;                
                if($select_column==="[]")$select_column="";                                
                if(!empty($select_column))$obj_param->request->select_column=$select_column;                
                
                $row_matchid=$obj_call->row_matchid;                
                if(!empty($row_matchid))$obj_param->request->row_matchid=$row_matchid;
                
                $request_body=$obj_call->request_body;                
                if($request_body==="{}")$request_body="";                                
                if(!empty($request_body))$obj_param->request->request_body=$request_body;                
                
                break;
            case "POST"            :
                $request_body=$obj_call->request_body;                
                if($request_body==="{}")$request_body="";                                
                if(!empty($request_body))$obj_param->request->request_body=$request_body;                
                break;
        }        
        //WRITE OUT REQUEST FIELDS

        //WRITE OUT RESPONSE FIELDS
        $obj_param->response=new stdClass; 
        $obj_param->response->status_code=$response->status_code;                
        $obj_param->response->status_message=$response->status_message;                
        $obj_param->response->row_count=0;
        $obj_param->response->row_returned=0;
        $obj_param->response->column_count=0;        
        $obj_param->response_body=$obj_call->response_body;
        
        if($obj_param->response->status_code===200){            
            $obj_param->response->row_count=$response->row_count;
            $obj_param->response->row_returned=$response->row_returned;
            $obj_param->response->column_count=$response->column_count;
            $obj_param->response->row_more=$this->fn_getNumericBool($response->row_more);                                            
            $obj_param->response->limit=$obj_call->limit;     
            $obj_param->response->offset=$obj_call->offset;                            
            $obj_param->response->get_count=$this->fn_getNumericBool($obj_call->get_count);            
            if(!empty($obj_call->FieldName)){
            $obj_param->response->fieldname=$obj_call->FieldName;
            $obj_param->response->fieldvalue=$obj_call->FieldValue;                        
            $obj_param->response->history_fieldname=$obj_call->HistoryFieldName;
            $obj_param->response->history_fieldvalue=$obj_call->HistoryFieldValue;            
            }
            
            if($response->column_required){
                $obj_param->response->column_required=$response->column_required;
            }
            
            if($obj_paramView->DistinctPin){
                $obj_param->response->view_distinct=true;
            }           
            
        }        
        //WRITE OUT RESPONSE FIELDS
        
        $this->fn_updateUseageAPI($obj_param);
        
        $obj_param->response->charge_pin=$obj_call->charge_pin;
        $obj_param->response->api_credit_updated=$obj_call->api_credit_updated;        
        if($obj_call->api_credit_updated){
            $obj_param->response->credit=$obj_call->credit;
        }
        
        
        
        
        $obj_call->str_response=json_encode($obj_param);
        
        ///////////////////////////
        ///////////////////////////
        
        
        
        
    }   

    function fn_getNumericBool($obj_val){
        if($obj_val)return 1;
        return 0;
        
    }

    function fn_checkUseageAPI(){

        global $API_AUTHENTICATED;
        if(empty($API_AUTHENTICATED)){
            return;
        }

        
        
        
        if($this->obj_call->method!=="GET"){
            if($this->obj_call->get_count){
                return true;
            }
        }

        $MetaSystemId=$this->obj_userLogin->MetaUserSystemId;

        $str_sql="SELECT `Credit` From `meta_user`.`meta_system` 
        WHERE
        `MetaSystemId`= :MetaSystemId
        AND
        `CreditExpiryDate`>NOW()
        ;";
           
        $int_count=$this->fn_fetchColumn($str_sql, [                
            'MetaSystemId'=>$MetaSystemId,                
        ]);
        if(empty($int_count)){
            $int_count=0;
            $this->fn_onZeroCredit();
            
        }
        return $int_count; 
        

    }    

    function fn_updateUseageAPI($obj_param){

        global $API_AUTHENTICATED;
        if(empty($API_AUTHENTICATED)){
            return;
        }

        $obj_call=$this->obj_call;

        
        $str_runtime=$this->str_runtime;
        $obj_paramView=$obj_call->obj_metaView->obj_param;
        $MetaViewId=$obj_call->view_id;
        if(is_null($MetaViewId)){$MetaViewId=0;}
        $MetaMoverId=$this->obj_userLogin->MetaMoverId;
        $status_code=$obj_param->response->status_code;
        $get_count=$obj_call->get_count;
        $method=$obj_call->method;        
        $row_returned=$obj_param->response->row_returned;
        $MetaSystemId=$this->obj_userLogin->MetaUserSystemId;
        //$MetaSystemId=100;
        //$this->fn_varDump($this->obj_userLogin->MetaSystemId, "this->obj_userLogin->MetaSystemId", true);
        //return;
        
        $charge_pin=$obj_call->charge_pin;
        $bln_chargeable=$charge_pin;
        
        $str_nameTable="meta_api";
        
        if($status_code!==200){ 
            $bln_chargeable=false;
        }

        if($method!=="GET"){
            $bln_chargeable=false;
        }

        if(!empty(array_search($MetaViewId, $this->arr_listSystemView))){
            $bln_chargeable=false;            
        }

        if(!$row_returned){
            $bln_chargeable=false;
            $row_returned=0;            
        }

        if(!$get_count){
            $get_count=0;
        }
        else{
            $bln_chargeable=false;
        }    

        if(!$bln_chargeable){
            $str_nameTable="meta_api_system";
        
        }

        if($bln_chargeable){
            $bln_chargeable=1;
        }
        else{
            $bln_chargeable=0;
        }

        $obj_call->charge_pin=$bln_chargeable;
        
        $str_sql="INSERT INTO `meta_api`.`$str_nameTable` 
        (            
        `MetaMoverId`,
        `MetaViewId`,
        `status_code`,
        `get_count`,
        `charge_pin`,
        `method`,
        `row_returned`,            
        `CreatedDate`
        )
        VALUES
        (             
        :MetaMoverId, 
        :MetaViewId,
        :status_code,
        :get_count,
        :charge_pin,
        :method,
        :row_returned,            
        :CreatedDate
        )
        ;"
        ;
        $this->fn_executeSQLStatement($str_sql, [
            
            'MetaMoverId'=>$MetaMoverId,
            'MetaViewId'=>$MetaViewId,
            'status_code'=>$status_code,
            'get_count'=>$get_count,
            'charge_pin'=>$bln_chargeable,
            'method'=>$method,
            'row_returned'=>$row_returned,                                
            'CreatedDate'=>$str_runtime,
        ]);

        if($str_nameTable==="meta_api"){ 
            $str_sql="UPDATE `meta_user`.`meta_system` SET 
            `Credit`=`Credit`-1
            WHERE
            `MetaSystemId`= :MetaSystemId
            ";
            $this->fn_executeSQLStatement($str_sql, [                
                'MetaSystemId'=>$MetaSystemId,                
            ]);

            $str_sql="SELECT `Credit` FROM `meta_user`.`meta_system`             
            WHERE
            `MetaSystemId`= :MetaSystemId
            ";
            $int_credit=$this->fn_fetchColumn($str_sql, [                
                'MetaSystemId'=>$MetaSystemId,                
            ]);                        
            $this->obj_call->api_credit_updated=true;
            $this->obj_call->credit=$int_credit;            
        }
    }

    function fn_initOptions(){        
        
        $obj_call=$this->obj_call;        
        $arr_componentQuery=$obj_call->arr_componentQuery;

        //CANCEL GET
        $cancel_get="";
        if(!empty($arr_componentQuery["cancel_get"])){
            $cancel_get=$arr_componentQuery["cancel_get"];
        }
        if(!empty($cancel_get)){        
            $cancel_get = filter_var($cancel_get, FILTER_VALIDATE_BOOLEAN);             
            $obj_call->cancel_get=$cancel_get;                                                    
            if(!is_bool($cancel_get)){
                $this->response->status_code=400;
                $this->response->status_message="[API cancel_get is not valid boolean]";                        
                return;         
            };        
        }
        //CANCEL GET

        
        //GET USER
        $get_user="";
        if(!empty($arr_componentQuery["get_user"])){
            $get_user=$arr_componentQuery["get_user"];
        }
        if(!empty($get_user)){        
            $get_user = filter_var($get_user, FILTER_VALIDATE_BOOLEAN);             
            $obj_call->get_user=$get_user;                                                    
            if(!is_bool($get_user)){
                $this->response->status_code=400;
                $this->response->status_message="[API get_user is not valid boolean]";                        
                return;         
            };        
        }
        //GET USER

        //GET FQSN
        $get_fqsn="";
        if(!empty($arr_componentQuery["get_fqsn"])){
            $get_fqsn=$arr_componentQuery["get_fqsn"];
        }
        if(!empty($get_fqsn)){        
            $get_fqsn = filter_var($get_fqsn, FILTER_VALIDATE_BOOLEAN);             
            $obj_call->get_fqsn=$get_fqsn;                                                    
            if(!is_bool($get_fqsn)){
                $this->response->status_code=400;
                $this->response->status_message="[API get_fqsn is not valid boolean]";                        
                return;         
            };        
            
        }
        //GET FQSN

        //GET COUNT
        $get_count="";
        if(!empty($arr_componentQuery["get_count"])){
            $get_count=$arr_componentQuery["get_count"];
        }
        if(!empty($get_count)){        
            $get_count = filter_var($get_count, FILTER_VALIDATE_BOOLEAN);             
            $obj_call->get_count=$get_count;                                                    
            if(!is_bool($get_count)){
                $this->response->status_code=400;
                $this->response->status_message="[API get_count is not valid boolean]";                        
                return;         
            };        
            
        }
        //GET COUNT

        //GET ARCHIVE
        $get_archive="";
        if(!empty($arr_componentQuery["get_archive"])){
            $get_archive=$arr_componentQuery["get_archive"];
        }
        if(!empty($get_archive)){        
            $get_archive = filter_var($get_archive, FILTER_VALIDATE_BOOLEAN);             
            $obj_call->get_archive=$get_archive;                                                    
            if(!is_bool($get_archive)){
                $this->response->status_code=400;
                $this->response->status_message="[API get_archive is not valid boolean]";                        
                return;         
            };        
            
        }
        //GET COUNT

         //GET API_DEBUG
         $api_debug="";
         if(!empty($arr_componentQuery["api_debug"])){
             $api_debug=$arr_componentQuery["api_debug"];
         }
         if(!empty($api_debug)){        
             $api_debug = filter_var($api_debug, FILTER_VALIDATE_BOOLEAN);             
             $obj_call->api_debug=$api_debug;                                                    
             if(!is_bool($api_debug)){
                 $this->response->status_code=400;
                 $this->response->status_message="[API api_debug is not valid boolean]";                        
                 return;         
             };        
             
         }
         //GET API_DEBUG

        //GET AUTOJOIN
        $get_autojoin="";
        if(!empty($arr_componentQuery["get_autojoin"])){
            $get_autojoin=$arr_componentQuery["get_autojoin"];
        }
        if(!empty($get_autojoin)){        
            $get_autojoin = filter_var($get_autojoin, FILTER_VALIDATE_BOOLEAN);             
            $obj_call->get_autojoin=$get_autojoin;                                                    
            if(!is_bool($get_autojoin)){
                $this->response->status_code=400;
                $this->response->status_message="[API get_autojoin is not valid boolean]";                        
                return;         
            };
        }        
        //GET AUTOJOIN
        if($get_autojoin){

            
            $JoinView="";
            if(!empty($arr_componentQuery["JoinView"])){
                $JoinView=$arr_componentQuery["JoinView"];
            }
            $obj_call->JoinView=$JoinView;
            
            $JoinKeyName="";
            if(!empty($arr_componentQuery["JoinKeyName"])){
                $JoinKeyName=$arr_componentQuery["JoinKeyName"];
            }
            $obj_call->JoinKeyName=$JoinKeyName;

            $JoinKeyValue="";
            if(!empty($arr_componentQuery["JoinKeyValue"])){
                $JoinKeyValue=$arr_componentQuery["JoinKeyValue"];
            }
            $obj_call->JoinKeyValue=$JoinKeyValue;
        }

        
        
    }
    

    function fn_initBaseView(){     
        
        $obj_call=$this->obj_call;        
        $arr_componentQuery=$obj_call->arr_componentQuery;        

        //GET MAIN VIEW ID        
        $view_id=0;
        if(!empty($arr_componentQuery["view_id"])){            
            $view_id=$arr_componentQuery["view_id"];
        }                        
        if (!is_numeric($view_id) || empty($view_id)) {                        
            $this->response->status_code=400;
            $this->response->status_message="[API view_id]";                        
            return;
        }                         
        $obj_call->view_id=$view_id;
        //GET MAIN VIEW ID                
        
        
        //SET MAIN VIEW                        
        $int_idMetaView=$view_id;
        $obj_metaView=new metaView($this);                                                
        $obj_metaView->fn_initialize($int_idMetaView);                
        $bln_valid=$this->fn_validateView($obj_metaView, $int_idMetaView); 
        if(!$bln_valid){
            $this->fn_setErrorView($int_idMetaView);            
            return;
        }
        $obj_call->obj_metaView=$obj_metaView; 
        
        $obj_call->charge_pin=$obj_metaView->obj_param->ChargePin;
        //SET MAIN VIEW
        
        
        //SET META VIEW        
        $int_idMetaView=$this->MetaDataViewId;
        $obj_metaView=new metaView($this);        
        $obj_metaView->fn_initialize($int_idMetaView);                                
        $bln_valid=$this->fn_validateView($obj_metaView, $int_idMetaView);                
        if(!$bln_valid){
            $this->fn_setErrorView($int_idMetaView);            
            return;
        }
        $obj_call->obj_metaViewData=$obj_metaView;                                
        //SET META VIEW               

        
        //SET USER VIEW        
        if($obj_call->get_user){
            $int_idMetaView=$this->MetaUserViewId;
            $obj_metaView=new metaView($this);        
            $obj_metaView->fn_initialize($int_idMetaView);                                        
            $bln_valid=$this->fn_validateView($obj_metaView, $int_idMetaView);
            if(!$bln_valid){
                $this->fn_setErrorView($int_idMetaView);            
                return;
            }
            $obj_call->obj_metaViewUser=$obj_metaView;                                
        }
        //SET USER VIEW     
        /*    
         //SET LINK VIEW        
         if($obj_call->get_autojoin){
            $int_idMetaView=$this->MetaLinkViewId;
            $obj_metaView=new metaView($this);        
            $obj_metaView->fn_initialize($int_idMetaView);                                        
            $bln_valid=$this->fn_validateView($obj_metaView, $int_idMetaView);                
            if(!$bln_valid){return;}
            $obj_call->obj_metaViewLink=$obj_metaView;                                
        }
        //*/
        //SET LINK VIEW           
    }       

    function fn_initSelectColumn(){
        $obj_call=$this->obj_call;        
        $arr_componentQuery=$obj_call->arr_componentQuery;        

        
        $obj_call->select_column='["*"]';        
        
        //GET SELECT LIST
        $select_column="";
        if(!empty($arr_componentQuery["select_column"])){
            $select_column=$arr_componentQuery["select_column"];
        }
        
        if(!empty($select_column)){        
            $obj_call->select_column=$select_column;                                                    
            if(!$this->fn_validateJSONDecode(json_decode($select_column))){
                $this->response->status_code=400;
                $this->response->status_message="[API select_column is not valid json]";                        
                return;         
            };        
        }
        //GET SELECT LIST        
    }
    
    function fn_initRowMatch(){
        $obj_call=$this->obj_call;        
        $arr_componentQuery=$obj_call->arr_componentQuery;        
        
        $obj_call->row_match="";        
        $obj_call->str_rowMatchSQL="";
        
        //GET ORDER LIST
        $row_match="";
        if(!empty($arr_componentQuery["row_match"])){
            $row_match=$arr_componentQuery["row_match"];
        }
        else{
            $row_match=$this->request_body;        
        }
        if($row_match=="{}"){$row_match="";}    
        
        //$row_match="";
        
        if(!empty($row_match)){        
            $obj_call->row_match=$row_match;                                                    
            if(!$this->fn_validateJSONDecode(json_decode($row_match))){
                $this->response->status_code=400;
                $this->response->status_message="[API row_match is not valid json]: ".$row_match;                        
                return;         
            };        
        }
        //GET ORDER LIST

        //OVERIDE WITH ROWMATCH ID                
        $row_matchid=0;
        if(!empty($arr_componentQuery["row_matchid"])){
            $row_matchid=$arr_componentQuery["row_matchid"];
        }
        
        if(!empty($row_matchid)){        
            $obj_call->row_matchid=$row_matchid;                                                              
            if(!is_numeric($row_matchid)){
                $this->response->status_code=400;
                $this->response->status_message="[API row_match id is not valid number]";                        
                return;
            }                    
            $obj_call->str_rowMatchSQL=$this->fn_getRecordIdClauseSQL($row_matchid);                                                            
        }                            
        //OVERIDE WITH ROWMATCH ID
        //GET ROW MATCH - MUST COME AFTER MAIN VIEW       
    }

    function fn_initOrderColumn(){
        $obj_call=$this->obj_call;        
        $arr_componentQuery=$obj_call->arr_componentQuery;        
        
        $obj_call->order="";        
        
        //GET ORDER LIST
        $order="";
        if(!empty($arr_componentQuery["order"])){
            $order=$arr_componentQuery["order"];
        }
        
        if(!empty($order)){        
            $obj_call->order=$order;                                                    
            if(!$this->fn_validateJSONDecode(json_decode($order))){
                $this->response->status_code=400;
                $this->response->status_message="[API order is not valid json]";                        
                return;         
            };        
        }
        //GET ORDER LIST
    }

    
    function fn_initOffset(){       
        
        $obj_call=$this->obj_call;        
        $arr_componentQuery=$obj_call->arr_componentQuery;  
        
        //GET ROWS PER PAGE
        $this->obj_userLogin->int_apiRowsPerPage=10;
        $limit=$this->obj_userLogin->int_apiRowsPerPage;//future, can be set per user
        if(!empty($arr_componentQuery["limit"])){
            $limit=$arr_componentQuery["limit"];            
        }        
        
        if (!is_numeric($limit)) {            
            $this->response->status_code=400;
            $this->response->status_message="[API limit]";            
            return;
        } 
        if($limit>$this->max_limit){
            $limit=$this->max_limit;
        }

        $obj_call->limit=$limit;                                                
        //GET ROWS PER PAGE

        //GET OFFSET
        $offset=0;
        if(!empty($arr_componentQuery["offset"])){
            $offset=$arr_componentQuery["offset"];
        }        
        if (!is_numeric($offset)) {
            $offset=0;
        } 
        $obj_call->offset=$offset;                                        
        //GET OFFSET
    }

    function fn_setSelectColumn(){        
        
        $obj_call=$this->obj_call;        
        
        //GET SELECT LIST, IF ANY             
        
        //SET MAIN SELECT        
        $obj_metaView=$obj_call->obj_metaView;        
        $MetaViewId=$obj_metaView->obj_param->MetaViewId;

        $obj_metaView->fn_addSelectColumn($obj_call->select_column);
        if(empty($obj_metaView->arr_selectColumn)){
            $this->response->status_code=500;
            $this->response->status_message="[API order view_data arr_selectColumn is empty]";                            
            return;
        }       
        
        //SET MAIN SELECT        
        
        
        //SET METADATA / USER SELECT        
        if($MetaViewId!=$this->MetaLinkViewId){
            $obj_metaView=$obj_call->obj_metaViewData;        
            $obj_metaView->fn_addSelectColumn($obj_call->select_column);        

            if($obj_call->get_user){
                $obj_metaView=$obj_call->obj_metaViewUser;        
                $obj_metaView->fn_addSelectColumn($obj_call->select_column);        
            }            
        }
        //SET METADATA USER SELECT
        
        //WRITE OUT SELECT COLUMNS FROM ALL VIEWS
        $obj_call->str_sqlSelectColumn=$this->fn_getSQLSelectColumn();
        if($this->response->status_code!==200){return;}
        $obj_call->str_sqlSelectColumnCount=$this->fn_getSQLSelectColumn(true);
        if($this->response->status_code!==200){return;}        
        //WRITE OUT SELECT COLUMNS FROM ALL VIEWS        
    }     
    function fn_getSQLSelectColumn($bln_count=false){

        $obj_call=$this->obj_call;

        

        //WRITE OUT SELECT COLUMNS FROM ALL VIEWS
        $str_sql="";        

        // MAIN SELECT
        $obj_metaView=$obj_call->obj_metaView;                      
        $obj_paramView=$obj_metaView->obj_param;

        $str_list=$obj_metaView->fn_getListSelectColumnName($obj_call->get_fqsn, $bln_count);
        
        
        
        if(!empty($str_list)){
            $str_sql.=$str_list.", ";
        }
        //MAIN SELECT

        if(!$obj_paramView->DistinctPin){
            
            //METADATA/USER SELECT
            if($obj_paramView->MetaViewId!=$this->MetaLinkViewId){
                $obj_metaView=$obj_call->obj_metaViewData;
                $str_list=$obj_metaView->fn_getListSelectColumnName($obj_call->get_fqsn, $bln_count);        
                                                          
                if(!empty($str_list)){
                    $str_sql.=$str_list.", ";
                }

                if($obj_call->get_user){
                    $obj_metaView=$obj_call->obj_metaViewUser;
                    $str_list=$obj_metaView->fn_getListSelectColumnName($obj_call->get_fqsn, $bln_count);        
                                                          
                    if(!empty($str_list)){
                        $str_sql.=$str_list.", ";
                    }
                }
            }
            // METADATA/USER SELECT
        
        }


        $str_sql=trim($str_sql, ", ");                        
        if(empty($str_sql)){                        
            $this->response->status_code=500;
            $this->response->status_message.="select_column sql is blank. fn_setSelectColumn";               
            $this->response->status_message.=var_export($this->obj_call);                              
        }

        return $str_sql;
    }  

    function fn_setRowMatchSQL(){

        //$this->fn_addConsoleAPI("START fn_setRowMatchSQL ---------------------------------");

        //This function will allow the row_match criteria json to be used in the where statement, using $obj_call->str_rowMatchSQL        

        
        
        $obj_call=$this->obj_call;
        if(!empty($obj_call->row_matchid)){                    
            return;            
        }
        
        if(empty($obj_call->row_match)){                        
            return;
        }          
        
        
        
        //$obj_call->row_match='{"$and":[{"101437.company":{"$not":"COMPC"}},{"$or":[{"101437.company":"COMPA"},{"101437.company":"COMPB"}]}]}';                                
        //$obj_call->row_match='{"$and":[{"age": 5},{"name":"Joe"}]}';                
        //$obj_call->row_match='{"name":"Brigadier+Software","Source":"Email"}';                                        
        //$obj_call->row_match='{"age":{"$bt":"[25, 50]"}}';                        
        //$obj_call->row_match='{"name":{"$con":"Distribution"}}';                        
        //$obj_call->row_match='{"name":{"$ncon":"Distribution"}}';                        
        //$obj_call->row_match='{"age":{"$gt":"25"}}';                        
        //$obj_call->row_match='{"age":{"$gte":"25"}}';                        
        //$obj_call->row_match='{"age":{"$lt":"25"}}';                        
        //$obj_call->row_match='{"age":{"$lte":"25"}}';                                
        //$obj_call->row_match='{"name":{"$in":"\"Distribution\",\"Logistics\",\"Transport\""}}';                        
        //$obj_call->row_match='{"name":{"$ne":"Distribution"}}';                        
        //$obj_call->row_match='{"name":{"$nin":"\"Distribution\",\"Logistics\",\"Transport\""}}';                        
        //$obj_call->row_match='{"name":{"$not":"Distribution"}}';                        
        //$obj_call->row_match='{"name":{"$sw":"Dis"}}';                        
        //$obj_call->row_match='{"name":{"$ew":"tion"}}';                        
        
        /*
        {

    "$or":[
        {
            "$and":[
                {
                    "101437.company":"COMPA"
                },
                {
                    "101437.id":{
                        "$lt":25
                    }
                }
            ]
        },
        {
            "101437.company":"tigger plc"
        }
    ]

}
    //*/
        /*
        $obj_call->row_match='
        {
            "$and":[
                {
                    "$or":[
                        {
                            "$and":[
                                {
                                    "101437.company":"COMPA"
                                },
                                {
                                    "101437.company":{
                                        "$not":"ComPB"
                                    }
                                }
                            ]
                        },
                        {
                            "$and":[
                                {
                                    "101437.company":"COMPA"
                                },
                                {
                                    "101437.company":{
                                        "$not":"CompC"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "101437.Company":{
                        "$gt":25
                    }
                }
            ]
        
        }'
        ;
        //*/

        /*
        $obj_call->row_match=
        '
        {
        "$or": [
            {
                "$and": [
                    { "101437.type": "electronics" },
                    { "101437.type": "gadgets" }
                ]
            },
            { "101437.type": "smartphones" }
        ]
        }'
        
        ;

        $obj_call->row_match=
        '
        {
        "$or": [
            {
                "$and": [
                    {"$or": [
                        {
                            "$and": [
                                { "101437.type": "electronics" },
                                { "101437.type": "gadgets" }
                            ]
                        },
                        { "101437.type": "smartphones" }
                    ]},
                    { "101437.type": "gadgets" }
                ]
            },
            { "101437.type": "smartphones" }
        ]
        }'
        
        ;
        //*/

        /*
        $obj_content=new stdClass;
$obj_1=new stdClass;

$obj_1a=new stdClass;
$obj_1a->{"101437.company"}="barclays";

$obj_1b=new stdClass;
$obj_1b->{"101437.company"}="tigger plc";

$arr_where=[];
array_push($arr_where, $obj_1a);
array_push($arr_where, $obj_1b);
$obj_1->{"\$or"}=$arr_where;


$obj_2=new stdClass;
$obj_2a=new stdClass;
$obj_2a->{"101437.company"}="barclays";

$obj_2b=new stdClass;
$obj_2b->{"101437.company"}="tigger plc";

$arr_where=[];
array_push($arr_where, $obj_2a);
array_push($arr_where, $obj_2b);
$obj_2->{"\$or"}=$arr_where;


$obj_3=new stdClass;
$obj_3a=new stdClass;
$obj_3a->{"101437.company"}="barclays";

$obj_3b=new stdClass;
$obj_3b->{"101437.company"}="tigger plc";

$arr_where=[];
array_push($arr_where, $obj_3a);
array_push($arr_where, $obj_3b);
$obj_3->{"\$or"}=$arr_where;


$arr_where=[];
array_push($arr_where, $obj_1);
array_push($arr_where, $obj_2);
array_push($arr_where, $obj_3);


$obj_content->{"\$and"}=$arr_where;

$content=json_encode($obj_content);
//*/
        
        
        $this->arr_nameQuery=[];
        $this->arr_valueQuery=[];
        $this->arr_InOperator=[];        

        
        $obj_jsonOperator=new jsonOperator($this, "WHERE");
        $obj_jsonOperator->obj_metaView=$obj_call->obj_metaView;
        //$obj_jsonOperator->bln_debug=$this->bln_debug;               
        
        try{                         
            $obj_jsonOperator->fn_parseQuery($obj_call->row_match);//EXPECTING  STR JSON                                
        }
        catch(Exception $e) {
            $this->response->status_code=050;
            $this->response->status_message="[API row_match ".$e.getMessage()."]";                        
            return;
        }        

        
        
        
        //*
        $bln_error=false;
        
        if(!empty($obj_jsonOperator->bln_error)){
            $bln_error=true; 
        }
        
        if(empty($obj_jsonOperator->str_sql)){
            $obj_jsonOperator->str_sql="";
            $bln_error=true; 
        }        

        $str_rowMatchSQL="";
        
        if($bln_error){
            $this->response->status_code=400;
            $this->response->status_message="[API row_match]";
            $this->response->status_message.=" 1. API Unknown error. SQL is blank in function 'fn_setRowMatchSQL' ";
            $this->response->status_message.=" 2. JSON Operator Status Message: ".$obj_jsonOperator->status_message;
            $this->response->status_message.=" 3. var_export obj_call: ".var_export($this->obj_call, true);
            return;
        }
        else{                        
            
            //$obj_jsonOperator->str_sql="";
            $str_rowMatchSQL=$obj_jsonOperator->str_sql;               
            
        }                

        
        

        
        $obj_call->arr_nameQuery=$this->arr_nameQuery;        
        $obj_call->arr_valueQuery=$this->arr_valueQuery;
        $obj_call->arr_InOperator=$this->arr_InOperator;
        
        
        if(empty($obj_call->arr_nameQuery))return;      
        
        
        
        //SET MAIN SELECT
        $obj_metaView=$obj_call->obj_metaView;        
        $obj_metaView->fn_replaceColumnSQL($obj_call->arr_nameQuery, $str_rowMatchSQL);        
        
        //SET MAIN SELECT
        
        //*                        
        
        //*/
        //SET METADATA/USER SELECT        
        $obj_metaView=$obj_call->obj_metaViewData;        
        $obj_metaView->fn_replaceColumnSQL($obj_call->arr_nameQuery, $str_rowMatchSQL);                
        
        if($obj_call->get_user){
            $obj_metaView=$obj_call->obj_metaViewUser;        
            $obj_metaView->fn_replaceColumnSQL($obj_call->arr_nameQuery, $str_rowMatchSQL);        
        }
        
        //SET META/USER/LINK SELECT

        $obj_call->str_rowMatchSQL=$str_rowMatchSQL;
    }    

    function fn_setOrderSQL(){        
        
        $obj_call=$this->obj_call;
        if(empty($obj_call->order)){                        
            return;
        }                          
        
        $this->arr_nameQuery=[];
        $this->arr_valueQuery=[];        
        
        $obj_jsonOperator=new jsonOperator($this, "ORDER");
        $obj_jsonOperator->obj_metaView=$obj_call->obj_metaView;
        $obj_jsonOperator->bln_orderByQuery=true;
        //$obj_jsonOperator->bln_debug=$this->bln_debug;                      
        
        try{                         
            $obj_jsonOperator->fn_parseQuery($obj_call->order);//EXPECTING  STR JSON                                
        }
        catch(Exception $e) {
            $this->response->status_code=050;
            $this->response->status_message="[API order ".$e.getMessage()."]";                        
            return;
        }        

        
        $bln_error=false;
        
        if(!empty($obj_jsonOperator->bln_error)){
            $bln_error=true; 
        }
        
        if(empty($obj_jsonOperator->str_sql)){
            $obj_jsonOperator->str_sql="";
            $bln_error=true; 
        }        
        
        if($bln_error){
            $this->response->status_code=400;
            $this->response->status_message.="[order] Unknown error. SQL is blank. fn_setOrderSQL";
            $this->response->status_message.=$obj_jsonOperator->status_message;
            $this->response->status_message.=var_export($this->obj_call);
            return;
        }
        else{
            $obj_call->str_orderSQL=trim($obj_jsonOperator->str_sql, '()');               
        }             
        
        $obj_call->arr_nameOrder=$this->arr_nameQuery;        
        $obj_call->arr_valueOrder=$this->arr_valueQuery;        
        
        if(empty($obj_call->arr_nameOrder))return;        

        //SET MAIN SELECT        
        $obj_metaView=$obj_call->obj_metaView;        
        $obj_metaView->fn_replaceColumnSQL($obj_call->arr_nameOrder, $obj_call->str_orderSQL);        
        //SET MAIN SELECT                
        
        //SET METADATA/USER SELECT        
        $obj_metaView=$obj_call->obj_metaViewData;        
        $obj_metaView->fn_replaceColumnSQL($obj_call->arr_nameOrder, $obj_call->str_orderSQL);        

        if($obj_call->get_user){
            $obj_metaView=$obj_call->obj_metaViewUser;        
            $obj_metaView->fn_replaceColumnSQL($obj_call->arr_nameOrder, $obj_call->str_orderSQL);        
        }
        //SET METADATA/USER SELECT                
    }
    
    function fn_removeOrderOperator($str_sql){

        $arr_key=$this->obj_call->arr_valueOrder;
        $arr_name=&$this->obj_call->arr_nameOrder;
        $arr_value=&$this->obj_call->arr_valueOrder;
        foreach($arr_key as $str_key => $str_value){        

            $str_sql=str_replace(":".$str_key, $str_value, $str_sql);
            
        }   
        
        $str_sql=str_replace(" AND ", ", ", $str_sql);
        $str_sql=str_replace(" OR ", ", ", $str_sql);
        return $str_sql;
    }

    

    function fn_setSQLSource(){
        
        //$this->fn_addConsoleAPI("START fn_setSQLSource ---------------------------------");                    

        $response=$this->response;
        $obj_call=$this->obj_call;

        $obj_metaView=$obj_call->obj_metaView;                
        $obj_paramViewSource=$obj_metaView->obj_param;
        $MetaViewId=$obj_paramViewSource->MetaViewId;
        
        //SET STANDARD SINGLE SOURCE        
        $str_sql="`$obj_paramViewSource->MetaSchemaName`.`$obj_paramViewSource->MetaTableName`";                
        //SET STANDARD SINGLE SOURCE
        if($MetaViewId!=$this->MetaLinkViewId){
            $str_sql.=$this->fn_getMetaDataJoin($obj_call);//ADD IN META JOIN AND USER JOIN AND LINK JOIN TO SOURCE   
            
            
        }
        
        //ADD META
        $obj_call->str_sqlSource=$str_sql;
        //ADD META        
        //$this->fn_addConsoleAPI("END fn_setSQLSource ---------------------------------");            
    }

    function fn_initRequestBody(){

        $obj_call=$this->obj_call;        
        $request_body=$this->request_body;        
        $str_row_request="";
        if(!empty($request_body)){
            //$str_row_request=json_encode($request_body);                        
            $str_row_request=$request_body;                        
        }                
        $obj_call->request_body=$str_row_request;          
    }

    function fn_setOffset(){
        $obj_call=$this->obj_call;        
    }  

    
    
    

    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////        

    
    function fn_removeInOperator($str_sql){

        $arr_key=$this->obj_call->arr_InOperator;
        $arr_name=&$this->obj_call->arr_nameQuery;
        $arr_value=&$this->obj_call->arr_valueQuery;
        foreach($arr_key as $str_key){        
            
            $str_value=$arr_value[$str_key];
            $str_sql=str_replace(":".$str_key, $str_value, $str_sql);
            unset($arr_value[$str_key]);
            $index = array_search($str_key, $arr_name);
            unset($arr_name[$index]);
        }                
        return $str_sql;
    }

    


    
    function fn_getRecordIdClause($int_recordId){
        
        $obj_metaView=$this->obj_call->obj_metaView;        
        $obj_paramView=$obj_metaView->obj_param;        
        return '{"'.$obj_paramView->MetaViewId.'.'.$obj_paramView->MetaTableKeyField.'":'.$int_recordId.'}';                        
    }
    function fn_getRecordIdClauseSQL($int_recordId){
        
        $obj_metaView=$this->obj_call->obj_metaView;        
        $obj_paramView=$obj_metaView->obj_param;                
        return "(`$obj_paramView->MetaSchemaName`.`$obj_paramView->MetaTableName`.`$obj_paramView->MetaTableKeyField` = $int_recordId)";
    }
    function fn_getRecordViaId($int_recordId){
        
        //CHECK EXPLICITLY DEREQUESTED 
        if($this->obj_call->cancel_get){            
            return;
        } 
        //CHECK EXPLICITLY DEREQUESTED
                
        $obj_call=$this->obj_call;        
                
        $obj_metaView=$obj_call->obj_metaView;        
        $obj_paramView=$obj_metaView->obj_param;                

        $obj_param=$this->fn_getRequest();                                            
        $obj_param->view_id=$obj_paramView->MetaViewId;                                            
        $obj_param->row_matchid=$int_recordId;                
        $obj_param->select_column='["*"]';        
        $this->fn_buildEndPoint($obj_param);                   
        
        $this->fn_get($obj_param->str_urlEndpoint, true, $this->bln_debug);                                
    }

    function fn_setDefaultResponse($int_recordId, $int_idRecordMeta=0, $obj_columnRequiredEmpty=false){
        
        $obj_call=$this->obj_call;
        $obj_metaView=$obj_call->obj_metaView;        
        $obj_paramView=$obj_metaView->obj_param;

        $obj_metaViewData=$obj_call->obj_metaViewData;
        $obj_paramViewData=$obj_metaViewData->obj_param;

        $arr_rows=[];

        //$arr_row=array($obj_paramView->MetaViewId.".".$obj_paramView->MetaTableKeyField => $int_recordId);        

        $arr_row=[];
        $arr_row[$obj_paramView->MetaViewId.".".$obj_paramView->MetaTableKeyField] = $int_recordId;        
        if(!empty($int_idRecordMeta)){
            $arr_row[$obj_paramViewData->MetaViewId.".".$obj_paramViewData->MetaTableKeyField] = $int_idRecordMeta;        
        }
        
        $arr_rows[0]=$arr_row; 

        $this->fn_setResponse($arr_rows, 1, 1, $obj_columnRequiredEmpty);    
        
        //REDIRECT - with more fields returned,         
        $this->fn_getRecordViaId($int_recordId);        
        //REDIRECT - with more fields returned  
    }

    function fn_setResponse($arr_rows, $row_count, $row_returned, $obj_columnRequiredEmpty=false){

        $obj_call=$this->obj_call;
        $response=$this->response;        
        
        $obj_call->response_body=$arr_rows;                        

        $response->row_count=$row_count;
        $response->row_returned=$row_returned;
        $response->column_count=$obj_call->column_count;
        
        if(count($arr_rows)){
            $arr_row=(array) $arr_rows[0];
            if($arr_row){
                $response->column_count=count($arr_row);        
            }     
        }

        if($obj_columnRequiredEmpty){                                  
            
            $str_nameRequired=$obj_columnRequiredEmpty->fn_getNameIdentifier($this->obj_call->get_fqsn);
            //$this->fn_varDump($str_nameRequired, "str_nameRequired");
            $response->column_required=$str_nameRequired;

        }

        //$row_count=(int)$row_count;
        $int_workingTotal=$row_returned+$obj_call->offset;        
        //*
        if($row_count>$int_workingTotal){
            $response->row_more=true;        
        } 
        //*/       
    }
}//end of class