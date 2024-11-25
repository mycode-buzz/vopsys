//class Ajaxholder
class AJAX extends component {
    constructor(obj_ini) {
        super(obj_ini); // call the super class constructor
    }
    fn_initialize(obj_ini){
        super.fn_initialize(obj_ini);

        this.obj_holder.bln_debug=false;        
    }
    fn_runServerFileUpload(obj_ini){    
        if(!obj_ini){return;}                        
        let obj_post=this.fn_formatPost(obj_ini);                                                       
        this.fn_putFile(obj_post);   
        //this.fn_putPost(obj_post);        
    }
    fn_runServerAction(obj_ini){    
        if(!obj_ini){return;}                
        let obj_post=this.fn_formatPost(obj_ini);                                               
        this.fn_putPost(obj_post);   
    }

    fn_runAction(obj_ini){    
        if(!obj_ini){return;}        
        let obj_post=this.fn_formatPost(obj_ini);                                       
        this.fn_putPost(obj_post);        
    }

    fn_putFile(obj_post){

        obj_post.Direction="SEND";
        if(obj_post.Action===undefined){      
            console.log("Error: Data Put Post: Action is not specified");
            return;
        }        

        let that=this;
        const xhr = new XMLHttpRequest();

        //this.fn_debugText("fn_putFile: " + obj_post.URL);

        
        xhr.open('POST', obj_post.URL); // Specify your server-side script
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    
                    let data=obj_myJson.fn_deserialize(xhr.responseText, "data");                    
                    that.fn_putPostCallbackFetch(data);                        
                    //console.log('File uploaded successfully:', xhr.responseText);                    
                    // Handle the server response as needed
                } else {
                    console.error('Error uploading file:', xhr.statusText);
                    // Handle errors
                }
            }
        };
        xhr.send(obj_post);    
    }

    
    ///START AJAX     
    fn_putPost(obj_post){
        
        obj_post.Direction="SEND";
        if(obj_post.Action===undefined){      
        console.log("Error: Data Put Post: Action is not specified");
        return;
        }
        
        
        this.fn_debugServerPost(obj_post, "");        
        
        
        if(obj_post.URL===undefined){
            console.log("obj_post.URL is undefined");        
            return;
        }

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        obj_post.method="POST";
        obj_post.headers=myHeaders;
        obj_post.body=JSON.stringify(obj_post);
        
        this.fn_runDataFetch(obj_post);
    }

    fn_runDataFetch(obj_post){

        fetch(obj_post.URL, obj_post)
        .then(Response=> {
            //this.fn_debugServerResponse(Response, true);
            return Response.json();
        })
        .then(data => {            
            this.fn_putPostCallbackFetch(data);                        
            //console.log(data);
        })
        .catch(err => {
            console.log(err);
            console.log("obj_post.URL: " + obj_post.URL);                        
            console.log("obj_post.body: " + obj_post.body);
            //this.fn_debugServerResponse(Response, true);
        })
        
    }

    fn_AJAXLocateObjectInstance(obj_post){//generally overidden
        let int_index;
  
        obj_post.ObjectInstance=false;      
        if(obj_post.DesignId===undefined){return;}
        int_index=obj_post.DesignId.indexOf("myId");
        if(int_index!==-1){                            
            obj_post.ObjectInstance=obj_project.fn_findItemById(obj_post.DesignId);//try to find in own Project        
        }       
        return obj_post.ObjectInstance;
    }    

    fn_AJAXLocateObjectNotifier(obj_post){        
        obj_post.ObjectNotifier=false;         
        obj_post.ObjectNotifier=obj_project.fn_findItemById(obj_post.NotifierId);                                        
        return obj_post.ObjectNotifier;
    }

    fn_putPostCallbackFetch(data){
        let obj_post=this.fn_formatPostFetch(data);            

        //console.log("obj_post.RowCount: " + obj_post.RowCount);        

        switch(obj_post.StatusCode){
            case 200:
                //console.log(obj_post.Response);                                
                break;
            case 402:
                console.log(obj_post.ErrorMessage);
                //alert(obj_post.ErrorMessage);            
                obj_path.fn_navigateSubdomain("office", true);        
                return;
                break;

        }
        
        //console.log("MetaViewId: "+obj_post.MetaViewId);

        
        if(obj_post.HasError){            
            console.log("HasError: " + obj_post.ErrorMessage);
            alert(obj_post.ErrorMessage); 
            if(obj_post.HasLoginError){                       
                obj_path.fn_navigateSubdomain("lock");
                return;
            }
            return;
        }
        
        if(obj_post.HasMessage){            
            console.log("Message: " + obj_post.Message);                        
            alert(obj_post.Message);            
        }
        
        if(obj_post.HasMessageConsole){            
            console.log("Message: " + obj_post.MessageConsole);                                 
        }
        

        if(obj_post.HasSessionError){                        
            alert("obj_post.HasSessionError: " + obj_post.ErrorMessage);            
            obj_path.fn_navigateSubdomain("lock", true);        
            return;
        }        

        if(obj_post.RedirectURL){            
            window.location.href=obj_post.RedirectURL;
            //obj_post.ObjectData="{}";
        }    

        obj_post.ObjectInstance=this.fn_AJAXLocateObjectInstance(obj_post);
        obj_post.ObjectNotifier=this.fn_AJAXLocateObjectNotifier(obj_post);
        
        
        
        this.fn_callbackFetch(obj_post);        
        
    }    
    
    fn_callbackFetch(obj_post){      
        let obj_notifier, str_action, str_actionCallback;   
        str_action=obj_post.Action;                
        str_actionCallback=obj_post.ActionCallBack;      

        
        if(this[str_action]){            
            this[str_action](obj_post);
        }   
        if(str_actionCallback!==str_action){
            if(this[str_actionCallback]){
                this[str_actionCallback](obj_post);
            }     
        }
        
        obj_notifier=obj_post.ObjectNotifier;                
        if(obj_notifier && obj_notifier!=this){                             
            if(obj_notifier[str_actionCallback]){
                obj_notifier[str_actionCallback](obj_post);
            }
        }

        obj_post.AuthorizeUserStatus=obj_shared.fn_parseBool(obj_post.AuthorizeUserStatus);
        //console.log("ajax obj_post.AuthorizeUserStatus: " + obj_post.AuthorizeUserStatus);
        if(!obj_post.AuthorizeUserStatus){
            //console.log("ajax  obj_post.AuthorizeUserStatus is false");
            this.fn_onUnAuthorizeUserStatus(obj_post);            
        }
        else{
            //console.log("ajax  obj_post.AuthorizeUserStatus is true");
            this.fn_onAuthorizeUserStatus(obj_post);            
        }
    }
    fn_onUnAuthorizeUserStatus(obj_post){//overidden
    }  
    fn_onAuthorizeUserStatus (obj_post){
        //console.log("fn_onAuthorizeUserStatus");
        let obj_notifier;        
        obj_notifier=obj_post.ObjectNotifier;       
        let str_method="fn_onAuthorizeUserStatus";         
        if(obj_notifier && obj_notifier!=this) {
            if(obj_notifier[str_method]){
                obj_notifier[str_method](obj_post);
            }
        }
    }    

    
    fn_formatPostFetch(obj_post){//could this be overriden to allow for applicaiton specific processing

        let bln_debug =false;

        obj_post.Direction="RECEIVE";  
        if(bln_debug){            
            console.log("BEFORE DESERIALIZE");
            console.log("typeof obj_post: " + typeof obj_post);
            console.log("typeof obj_post.ObjectData: " + typeof obj_post.ObjectData);
            console.log("typeof obj_post.RowData: " + typeof obj_post.RowData);
        }        

        if(bln_debug){
            obj_shared.fn_debug(obj_post, "obj_post");
        }
        
        
        if(obj_post.ObjectData===undefined){            
            //obj_post.ObjectData="{}";
        }
        if(obj_post.RowData===undefined){            
            //obj_post.RowData="[]";
        }        
        obj_post.StringObjectData=obj_post.ObjectData;        
        obj_post.ObjectData=obj_myJson.fn_deserialize(obj_post.ObjectData, "ObjectData");                  
        obj_post.RowData=obj_myJson.fn_deserialize(obj_post.RowData, "RowData");//Array of  Recordset Rows                  
        //console.log(obj_post.RowData);

        
        
        obj_post.MetaColumn=obj_myJson.fn_deserialize(obj_post.MetaColumn, "MetaColumn");//Array of Column Rows        
        
        obj_post.MetaView=obj_myJson.fn_deserialize(obj_post.MetaView, "MetaView");//Array of View Rows
        //console.log(obj_post.MetaView)
        obj_post.UserHome=obj_myJson.fn_deserialize(obj_post.UserHome, "UserHome");
        obj_userHome.fn_initialize(obj_post.UserHome);
        //console.log(obj_post.ClientUser)        
        
        /*
        console.log("AJAX obj_post.URLNavigateMenu: " + obj_post.URLNavigateMenu);
        console.log("AJAX obj_post.MetaUserId: " + obj_post.MetaUserId);        
        console.log("AJAX obj_post.SingleQueryValue: " + obj_post.SingleQueryValue);
        //*/
        

        if(obj_post.RowData.length){            
            if(obj_shared.fn_isObjectEmpty(obj_post.RowData[0])){obj_post.RowData=[];}            
        }
        //if(!obj_post.DesignId){obj_post.DesignId="";}
        //console.log(obj_post.RowData);
        

        if(bln_debug){
            console.log("AFTER DESERIALIZE");
            console.log("typeof obj_post: " + typeof obj_post);
            console.log("typeof obj_post.ObjectData: " + typeof obj_post.ObjectData);
            console.log("typeof obj_post.RowData: " + typeof obj_post.RowData);
        }        
        

        if(Array.isArray(obj_post.RowData)){
            obj_post.RowObject=obj_post.RowData[0];//1st Row of RecordSet, for handy access ? otheriwse just use obj_post.RowData[0]
        }
        
        
        this.fn_debugServerPost(obj_post, "");        
        
        

        return obj_post;
    }
    

    fn_debugServerPost(obj_post, str_comment){                                        
        
        //console.log("obj_project: " + obj_project.obj_design.int_idRecord);

        //this.obj_holder.bln_debugServer=true;                  
        //console.log("this.obj_holder.bln_debugServer: " + this.obj_holder.bln_debugServer);
        
        if(!this.obj_holder.bln_debugServer){return;}

        
        if(str_comment===undefined){str_comment=""}
        let str_title, s;
        s="";
        if(obj_post.Direction){s+=obj_post.Direction + " ";}
        if(obj_post.Action){s+=obj_post.Action + " ";}
        if(obj_post.RecordName && obj_post.RecordName!="New Project"){s+=obj_post.RecordName + " ";}
        if(obj_post.str_comment){s+=obj_post.str_comment + " ";}        
        str_title=s;        
        
        console.groupCollapsed(str_title);        
        console.log("obj_post.URL: " + obj_post.URL);        
        console.log("obj_post.Action: " + obj_post.Action);
        console.log("obj_post.ActionCallBack: " + obj_post.ActionCallBack);        
        console.log("obj_post.NotifierId: " + obj_post.NotifierId);        
        console.log("obj_post.DesignId: " + obj_post.DesignId);        
        console.log("obj_post.Echo: " + obj_post.Echo);                
        if(obj_post.HasError){            
            console.log("obj_post.ErrorMessage: " + obj_post.ErrorMessage);                
        }
        console.groupCollapsed("OBJECT DATA");                
        console.table(obj_post.ObjectData);                                
        console.groupEnd();
        
        
        console.groupCollapsed("ROW DATA");
        console.table(obj_post.RowData);
        console.groupEnd();
        

        console.groupEnd();
    }


    fn_actionSerialize(obj_myObject){                  
        

        /*/
        let fn_serializeReplacer;      
            this.fn_serializeReplacer=this.fn_serializeReplacerDefault;
            if(obj_myObject.fn_serializeReplacer!==undefined){        
                this.fn_serializeReplacer=obj_myObject.fn_serializeReplacer;
            }      
            
        //*/
        this.obj_myObject=obj_myObject;
        let str_json=JSON.stringify(obj_myObject, this.fn_mySerializeReplacer());                                  
        return str_json;      
    }
    fn_deserialize(obj_post, str_json, str_message){      
        let obj_json={};
        try {
        obj_json=JSON.parse(str_json);
        } catch (error) {
            /*
            console.error("*****START ERROR AJAX DeSerialize*****");            
            console.error("message: " + str_message);
            console.error("Error: " + error);
            console.error("str_json: " + str_json);
            console.error("*****END ERROR AJAX DeSerialize*****\n\n");
            //*/
        }      
        return obj_json;
    }



    fn_formatPost(obj_ini){ 

        
        
        
        
        
        
        
        if(obj_ini.str_action==="import_file"){
            let obj_post;
            obj_post=obj_ini;
            obj_post.URL=obj_ini.str_urlServer;                    
            obj_post.Action=obj_ini.str_action;                
            
            obj_post.ActionCallBack=obj_ini.str_actionCallback;                                        
            if(!obj_post.ActionCallBack){obj_post.ActionCallBack=obj_ini.str_action;}        
            obj_post.NotifierId=obj_ini.str_idAJAXNotifier;              

            obj_post.append('Action', obj_ini.str_action);                               
            obj_post.append('ActionCallBack', obj_post.ActionCallBack);
            obj_post.append('NotifierId', obj_post.NotifierId);
            obj_post.append('MetaViewId', obj_ini.int_idMetaView);
            obj_post.append('MetaRowzId', obj_ini.int_idMetaRowz);            
            //console.log(obj_post);
            return obj_post;
        }        

        let obj_post=new Object;
        
        obj_post.URL=obj_ini.str_urlServer;                    

        obj_post.DebugServer=obj_ini.bln_debugServer;                
        obj_post.PublishPin=obj_ini.bln_publishPin;                        
        obj_post.SelectMinimalFieldPin=obj_ini.bln_selectMinimalFieldPin;                        
        obj_post.SubDomain=obj_ini.str_subdomain;                                
        obj_post.MarkedParentSchemaName=obj_ini.str_markedParentSchemaName;  
        obj_post.MarkedParentTableName=obj_ini.str_markedParentTableName;          
        obj_post.MarkedParentRowzId=obj_ini.str_markedParentRowzId;        
        obj_post.MarkedParentViewId=obj_ini.str_markedParentViewId;        
        
        obj_post.ActionCode=obj_ini.int_actionCode;                        
                        
        obj_post.MetaViewId=obj_ini.int_idMetaView;                 
        obj_post.MetaRowzId=obj_ini.int_idMetaRowz;                
        obj_post.MetaRowzName=obj_ini.str_metaRowzName;                
        
        obj_post.ModeNewRecord=obj_ini.bln_modeNewRecord;          
                
        obj_post.QueryExpression=obj_ini.str_queryExpression;
        
        obj_post.RunSearch=obj_ini.bln_runSearch;  
        obj_post.SimpleSearch=obj_ini.bln_simpleSearch;
        obj_post.AdvancedSearch=obj_ini.bln_advancedSearch;
        
        obj_post.QuerySearch=obj_ini.str_querySearch;
        obj_post.QueryList=obj_ini.str_queryList;
        obj_post.QueryListParent=obj_ini.str_queryListParent;        
        obj_post.QueryListDisabled=obj_ini.str_queryListDisabled;
        
        obj_post.LoadReportInterface=obj_ini.bln_loadReportInterface;                        
        
        obj_post.MetaSchemaName=obj_ini.str_metaSchemaName;//should be needed settings
        obj_post.MetaTableName=obj_ini.str_metaTableName;//needed to for settings
        obj_post.MetaColumnName=obj_ini.str_metaColumnName;//needed for push column
        obj_post.MetaColumnAPIName=obj_ini.str_metaColumnAPIName;//needed for push column
        obj_post.MetaColumnValue=obj_ini.str_metaColumnValue;//needed for push column
        obj_post.MetaColumnPosition=obj_ini.str_metaColumnPosition;//needed for push column
        obj_post.MetaRowPosition=obj_ini.str_metaRowPosition;//needed for push column  
        obj_post.MetaColumnId=obj_ini.str_metaColumnId;//needed for push column
        obj_post.MetaList=obj_ini.str_metaList;        
        obj_post.MetaListIdValue=obj_ini.str_metaListIdValue;        
        
        obj_post.MetaOption=obj_ini.str_metaOption;        

        obj_post.MetaKeySchemaName=obj_ini.str_metaKeySchemaName;
        obj_post.MetaKeyTableName=obj_ini.str_metaKeyTableName;
        obj_post.MetaKeyColumnName=obj_ini.str_metaKeyColumnName;
        obj_post.MetaKeyColumnValue=obj_ini.str_metaKeyColumnValue;
        obj_post.MetaKeyColumnShortName=obj_ini.str_metaKeyColumnShortName;        
        //obj_post.MetaDataId=obj_ini.str_dataId;
        
        obj_post.MetaDataSystemId=obj_ini.str_metaDataSystemId;        
        
        if(obj_ini.str_urlMetaRowzNameArchive){
            //For Menu URL Path Tracking                     
            obj_post.URLMetaRowzNameArchive=obj_ini.str_urlMetaRowzNameArchive;
            obj_post.URLMetaRecordIdArchive=obj_ini.str_urlMetaRecordIdArchive;        
            //For Menu URL Path Tracking         
        }
        
        obj_post.AutoJoinPin=obj_ini.bln_autoJoinPin;        
        obj_post.AutoJoinFilterPin=obj_ini.bln_autoJoinFilterPin;        
        obj_post.AutoJoinToSource=obj_ini.str_autoJoinToSource;
        obj_post.AutoJoinToKeyValue=obj_ini.str_autoJoinToKeyValue;        
        obj_post.AutoJoinToKeyName=obj_ini.str_autoJoinToKeyName;        
        obj_post.AutoJoinFromKeyValue=obj_ini.str_autoJoinFromKeyValue;        
        obj_post.AutoJoinFromKeyName=obj_ini.str_autoJoinFromKeyName;        
        obj_post.LinkOffPin=obj_ini.bln_linkOffPin;
        obj_post.LinkOnPin=obj_ini.bln_linkOnPin;

        obj_post.LimitRowPerPage=obj_ini.int_limitRowPerPage;
        obj_post.LimitRowStart=obj_ini.int_limitRowStart;        
        
        obj_post.Action=obj_ini.str_action;                
        //console.log("AJAX obj_post.Action: " + obj_post.Action)        
        //console.log("AJAX obj_post.URL: " + obj_post.URL)
        obj_post.ActionCallBack=obj_ini.str_actionCallback;                                        
        if(!obj_post.ActionCallBack){            
            obj_post.ActionCallBack=obj_ini.str_action;                
        }        
                      
        
        obj_post.NotifierId=obj_ini.str_idAJAXNotifier;          
        //obj_post.RecordName=obj_ini.str_recordName;
        //obj_post.RecordShortName=obj_ini.str_nameShort;                
        obj_post.RecordId=obj_ini.RecordId;            
        
        return obj_post;
    }   
}//END CLS