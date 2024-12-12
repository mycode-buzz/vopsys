//START RUNTIME


/*START COMPONENT//*/
/*type: RunTimeCode//*/

//START UserSettings.js
const idXdesignTarget="xdesign-target";
//END UserSettings.js


//START PermitManager.js
class PermitManager {  
    constructor(obj_user) {        

        this.bln_debug=false;
        
        let obj_permit;
        obj_permit=new Permit;                    
        this.obj_permit100=obj_permit;

        obj_permit=new Permit;            
        obj_permit.bln_read=false;
        obj_permit.bln_write=false;                  
        this.obj_permit0=obj_permit;

        this.obj_user=obj_user;                    
    }       

    fn_compare(obj_metaSource, obj_metaCompare,  str_message="", bln_debugPermit=false){        

        this.bln_debugPermit=bln_debugPermit;

        if(this.bln_debugPermit){
            console.log(str_message);                    
            console.log(obj_metaSource);                  
            console.log(obj_metaCompare);                  
        }


        if(obj_shared.fn_isEmptyObject(obj_metaSource)){        
            //console.log("source is blank");
            return this.obj_permit100;            
        }

        if(obj_shared.fn_isEmptyObject(obj_metaCompare)){                
            //console.log("compare is blank");
            return this.obj_permit100;            
        }        
        
        obj_metaSource.MetaPermissionTag=this.fn_cleanTag(obj_metaSource.MetaPermissionTag);       
        obj_metaCompare.MetaPermissionTag=this.fn_cleanTag(obj_metaCompare.MetaPermissionTag);               

        let obj_permit;
        obj_permit=this.fn_generalPermission(obj_metaSource.MetaPermissionTag, obj_metaCompare.MetaPermissionTag);             
        if(obj_permit){            
            return obj_permit;
        }

        obj_permit=this.fn_specificPermission(obj_metaSource.MetaPermissionTag, obj_metaCompare.MetaPermissionTag);             
        if(obj_permit){            
            return obj_permit;
        }
        return false;
    }    

    
    fn_generalPermission(MetaPermissionTag, MetaPermissionCompare){
        
        if(this.bln_debugPermit){
            console.log("fn_generalPermission");
        }

        if(this.bln_debugPermit){
            console.log("GEN MetaPermissionTag: [" + MetaPermissionTag + "]");            
            console.log("GEN MetaPermissionCompare: [" + MetaPermissionCompare + "]");                    
        }

        let obj_permit;        

        obj_permit=this.fn_checkInterface(MetaPermissionTag);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return source is INTERFACE");
            }
            return obj_permit;
        }
        obj_permit=this.fn_checkInterface(MetaPermissionCompare);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return source is INTERFACE");
            }
            return obj_permit;
        }
        
        obj_permit=this.fn_checkAdmin(MetaPermissionTag);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return source is ADMIN");
            }
            return obj_permit;
        }
        obj_permit=this.fn_checkAdmin(MetaPermissionCompare);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return compare is ADMIN");
            }
            return obj_permit;
        }        

        if(this.obj_user.MetaUserSystemId===100){   
            return this.obj_permit100;            
        }
        
        //End General Permission
        return false;
    }       
    
    
    fn_checkAdmin(MetaPermissionTag){
        
        let bln_contains=obj_shared.fn_inStr("#ADMIN", MetaPermissionTag);//check against compare for match        
        if(bln_contains){                
            if(this.bln_debugPermit){
                console.log("MetaPermissionTag is ADMIN");
            }

            if(this.obj_user.MetaPermissionTag==="#ADMIN"){                
                if(this.bln_debugPermit){
                    console.log("return this.obj_permit100: MetaPermissionTag and user is ADMIN or SystemOwner");
                }
                return this.obj_permit100;
            }
            else{                
                if(this.bln_debugPermit){
                    console.log("return this.obj_permit0: MetaPermissionTag is ADMIN but user is not");
                }
                return this.obj_permit0;
            }
        }        
        return false;
    }    
    fn_checkInterface(MetaPermissionTag){

        let bln_contains=obj_shared.fn_inStr("#INTERFACE", MetaPermissionTag);//check against compare for match        
        if(bln_contains){                
            if(this.obj_user.MetaUserSystemId===100){                   
                return this.obj_permit100;
            }
            else{                            
                return this.obj_permit0;        
            }   
        }        
        return false;
    }    

    fn_specificPermission(MetaPermissionTag, MetaPermissionCompare){

        if(this.bln_debugPermit){
            console.log("fn_specificPermission");
        }        

        if(this.bln_debugPermit){
            console.log("A MetaPermissionTag: [" + MetaPermissionTag + "]");            
            console.log("B MetaPermissionCompare: [" + MetaPermissionCompare + "]");                    
        }

        let arr_metaPermissionTag=MetaPermissionTag.split("#");        
        
        let bln_foundTag=false;
        let str_tagPermission="";
        var obj_permit;
        for(let i=0;i<arr_metaPermissionTag.length;i++){
            let str_tagFull=arr_metaPermissionTag[i];
            if(!str_tagFull){continue;}            
            
            let arr_tagFull=str_tagFull.split(" ");
            let str_tagName="#"+arr_tagFull[0].trim();
            
            let bln_match;
            
            bln_match = obj_shared.fn_inStr(str_tagName, MetaPermissionCompare);//check against compare for match                        

            if(!MetaPermissionCompare){
                bln_match=true;
            }
            
            if(!bln_match){                
                continue;
            }
            bln_foundTag=true;
            
            let arr_tagPermission=arr_tagFull.slice(1);            
            str_tagPermission=arr_tagPermission.join(" ").trim();            

            if(this.bln_debugPermit){
                console.log("C str_tagName: [" + str_tagName + "]");            
                console.log("D str_tagPermission: [" + str_tagPermission + "]");                    
            }

            obj_permit=new Permit;

            switch(str_tagPermission){
                case "HIDE":
                    obj_permit.bln_read=false;  
                    obj_permit.bln_write=false;  
                break;
                case "LOCK":
                    obj_permit.bln_write=false; 
                break;
                case "LOCKAFTER":
                    obj_permit.bln_writeOnce=true;  
                case "WRITEONCE":
                    obj_permit.bln_writeOnce=true;  
                break;                
            }            
            
        }//END OF LOOP
        if(!bln_foundTag){        
            if(this.bln_debugPermit){
                console.log("no tag found - no change");
            }
            return false;
            //return this.obj_permit0;//NO TAGS WERE MATCHED
            
        }    
        
        if(this.bln_debugPermit){
            console.log("tags found - apply permission");
        }

        //TAGS WERE MATCHED AND STANDARD PERMISSIONS APPLIED        
        return obj_permit;        
    }    

    fn_cleanTag(str_tag){
        if(!str_tag){
            return "";
        }
        str_tag+="";
        return str_tag.toUpperCase().trim();
    }

    fn_applyPermit(obj_target, obj_permit, bln_newRecord=false){       
        
        obj_target.HiddenPin=this.fn_getHiddenPin(obj_permit);        
        obj_target.LockedPin=this.fn_getLocked(obj_permit, bln_newRecord);        

        if(this.bln_debugPermit){
            console.log("obj_target.HiddenPin: " + obj_target.HiddenPin);
            console.log("obj_target.LockedPin: " + obj_target.LockedPin);
        }        
      }    

    fn_getHiddenPin(obj_permit){
        return obj_permit.bln_read ? false : true;
    }
    fn_getLocked(obj_permit, bln_newRecord=false){
        //*
        if(!bln_newRecord && obj_permit.bln_writeOnce){
            return true;
        }
            //*/
        return  obj_permit.bln_write ? false : true;                    
    }    

    fn_runTagAdmin(){
        
        let obj_user=this.obj_user;                        
        if(obj_user.MetaPermissionTag!=="#ADMIN"){
            return this.obj_permit0;
        }
        return this.obj_permit100;
    }
    fn_isAdmin(){
        let obj_permit=this.fn_runTagAdmin();
        if(obj_permit.bln_read)return true;
        return false;
    }

    fn_getPassPermission(){
        return this.obj_permit100;
    }


}//END OF CLASS


class Permit {  
    constructor() {                
        this.bln_read=true;
        this.bln_write=true;
        this.bln_writeOnce=false;
    }   
    fn_debug(){

        //console.log(this);
    }
    
}//END OF CLASS
//END PermitManager.js


//START User.js
class User {    
  constructor() {          
  } 
  fn_initialize(obj_user){//obj_post.UserHome
    this.obj_user=obj_user;  
    let MetaPermissionTag=this.fn_cleanTag(obj_user.MetaPermissionTag);
    let Admin=false;    
    let Interface=false;
    if(this.MetaSystemOwner){
      MetaPermissionTag="#ADMIN";          
    }
    if(MetaPermissionTag.toLowerCase()==="#admin"){
      Admin=true;
    }
    if(this.MetaUserSystemId===100){
      Interface=true;
    }
      
    this.MetaPermissionTag=MetaPermissionTag;
    this.Admin=Admin;
    this.Interface=Interface;
    
    
  }
  fn_cleanTag(str_tag=""){    
    return str_tag.toUpperCase().trim();
}
  fn_debug(){    
    let obj_user=this.obj_user;    
    console.log(obj_user);
  }
  get MetaSystem(){      
    return this.obj_user.MetaSystem;
  }  
  get MetaUserId(){      
    return this.obj_user.MetaUserId;
  }  
  get MetaUserEmail(){      
    return this.obj_user.MetaUserEmail;
  }    
  get MetaUserSystemId(){      
    return this.obj_user.MetaUserSystemId;
  }    
  get Admin(){      
    return this.obj_user.Admin;
  }
  set Admin(bln_value){      
    this.obj_user.Admin=bln_value;
  }
  get Interface(){      
    return this.obj_user.Interface;
  }
  set Interface(bln_value){      
    this.obj_user.Interface=bln_value;
  }
  get MetaPermissionTag(){      
    return this.obj_user.MetaPermissionTag;
  }
  set MetaPermissionTag(str_value){      
    this.obj_user.MetaPermissionTag=str_value;
  }  
  get MetaSystemOwner(){      
    return this.obj_user.MetaSystemOwner;
  }
  get MetaUserGroupId(){      
    return this.obj_user.MetaUserGroupId;
  }
}
//END User.js


//START Path.js
class Path {  
  constructor() {        
      
      this.str_path_document_root="";//client side therefore blank       
      this.str_path_folder_start=this.str_path_document_root;
      this.str_name_folder_app="app";             
      this.str_path_folder_app=this.str_path_folder_start+"/"+this.str_name_folder_app;                                  
      
      this.str_name_folder_asset="asset";           
      this.str_name_folder_server="server";              
      this.str_nameFileServerDefault="server.php";             

      this.bln_isLocal=false;

      this.fn_setIsLocal();
      //let bln_isLocal=this.fn_getIsLocal();
      //console.log("Path bln_isLocal: " + bln_isLocal);

      this.fn_analyseNavigateURL();
  } 

  
  fn_getLokalDomain(){

    let str_domain="rowz.app";
    if(this.fn_getIsLocal()){
      str_domain="lokal-mycode.buzz";
    }
    return str_domain;

  }

  fn_setIsLocal(){
    
    if(obj_shared.fn_inStr("lokal", window.location.href)){    
      this.bln_isLocal=true;
      //console.log("fn_setIsLocal this.bln_isLocal: " + this.bln_isLocal);
      return;
    }        
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
      this.bln_isLocal=true;
      //console.log("fn_setIsLocal this.bln_isLocal: " + this.bln_isLocal);
      return;
    }    
    
    this.bln_isLocal=false;
    //console.log("fn_setIsLocal this.bln_isLocal: " + this.bln_isLocal);
  }

  
  fn_getIsLocal(){

    //console.log("fn_getIsLocal this.bln_isLocal: " + this.bln_isLocal);

    return this.bln_isLocal;   
    
  }
  fn_getAppPath(str_name_app){    
      return this.str_path_folder_app+"/"+str_name_app;
  }
  fn_getURLAssetFile(str_name_app, str_name_file){          
      return this.fn_getAppPath(str_name_app)+"/"+this.str_name_folder_asset+"/"+str_name_file;
  }  
  fn_getURLServerFile(str_folder_app, str_name_file=this.str_nameFileServerDefault){            
    
    
    return this.str_path_document_root +"/"+this.str_name_folder_server+"/"+str_folder_app+"/"+str_name_file;
  }    
  fn_getSubdomain(url){
    if(url===undefined){url=window.location;}
    const urlParts = new URL(url).hostname.split('.')
    const subdomain = urlParts.slice(0, -2).join('.');
    console.log(subdomain); // "my.company"
    return subdomain;  
  }

  fn_setQueryStringValue(str_name, str_value){

    let params = new URLSearchParams(window.location.search);

    // Add a new parameter
    params.set(str_name, str_value);

    // Update the URL with the new query string
    return `${window.location.pathname}?${params}`
  }

  fn_getQueryStringValue(str_name){
    let str_querystring=ServerQueryString.toLowerCase();                
    str_name=str_name.toLowerCase();
    let obj_search = new URLSearchParams(str_querystring); 
    let str_value=obj_search.get(str_name);                   
    return str_value;    
  }

  fn_hasQueryStringValue(queryString, paramName, targetValue) {
    const params = new URLSearchParams(queryString);
    const paramValue = params.get(paramName);    
    return paramValue === targetValue;
  }

  fn_getURLNavigateSubdomain(str_subdomin, foo_returnURL){
    
    const href=window.location.href;
    const obj_url = new URL(href);        
    let str_domain=this.fn_getDomainNoSubdomain(href);    
    str_domain.endsWith('/') ? str_domain.slice(0, -1) : str_domain;
    let  str_url=obj_url.protocol +"//" + str_subdomin + "." + str_domain;    
    if(foo_returnURL){
      str_url+="?returnURL=" + href;
    }
    return str_url;
    
}

  fn_navigateSubdomain(str_subdomin, foo_returnURL){          
    
    let str_url=this.fn_getURLNavigateSubdomain(str_subdomin, foo_returnURL);
    window.location.href=str_url;    
  }
  fn_getURLSiteProtocol(str_path){          
    
    const href=window.location.href;
    const obj_url = new URL(href);            
    let  str_url=obj_url.protocol +"//" + str_path;
    return str_url;    
  }
  
fn_getDomainNoSubdomain (url){
    const urlParts = new URL(url).hostname.split('.')
  
    return urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join('.')
  } 

  fn_getNavigateRecordURL(str_urlMetaRowzName, str_urlMetaRecordId, str_url=""){      

    if(!str_urlMetaRowzName){str_urlMetaRowzName="";}
    if(!str_urlMetaRecordId){str_urlMetaRecordId="";}
    if(!str_url){str_url=window.location.href;} 

    const obj_url = new URL(str_url);        
    const str_baseUrl=obj_shared.fn_getBaseURL(obj_url);        
    const str_searchParams=obj_url.searchParams.toString();    
    str_url=str_baseUrl;
    if(str_urlMetaRowzName){
      str_url+="/" + str_urlMetaRowzName;
    }
    if(str_urlMetaRecordId){
      str_url+="/" + str_urlMetaRecordId;
    }
    if(str_searchParams){
      str_url+="?" + str_searchParams;
    }
    //str_url=str_url.toLowerCase();
    //console.log("str_url: " + str_url);
    return str_url;
  }

  fn_navigateRecordURL(str_urlMetaRowzName, str_urlMetaRecordId, str_urlBase=""){            
    
    window.location.href=this.fn_getNavigateRecordURL(str_urlMetaRowzName, str_urlMetaRecordId, str_urlBase);
  }  

  fn_analyseNavigateURL(){

    //console.log("window.location.href: " + window.location.href);                
    
    this.str_baseUrl=obj_shared.fn_getBaseURL(new URL(window.location.href));            
    let str_serverQueryString=ServerQueryString.toLowerCase();                
    let str_reWritePathName="ReWritePath".toLowerCase();    
    let str_reWritePath=this.fn_getQueryStringValue(str_reWritePathName);
    if(!str_reWritePath){str_reWritePath="";}
    let str_urlMetaRowzName="";
    let str_urlMetaRecordId="";
    let arr_reWritePath=[];
    if(str_reWritePath){
      arr_reWritePath = obj_shared.fn_getFoldersFromPath(str_reWritePath);                
      str_urlMetaRowzName=arr_reWritePath[0].toLowerCase();
      if(arr_reWritePath.length>1){
        str_urlMetaRecordId=arr_reWritePath[1].toLowerCase();
      }
    }

    var str_otherQueryString = str_serverQueryString.replace(str_reWritePathName+"="+str_reWritePath,'');                                
    str_otherQueryString = obj_shared.fn_trimCharacter(str_otherQueryString, "&");                  

    this.str_urlMetaRowzNameArchive=this.str_urlMetaRowzName=str_urlMetaRowzName;
    this.str_urlMetaRecordIdArchive=this.str_urlMetaRecordId=str_urlMetaRecordId;
    this.str_otherQueryStringArchive=this.str_otherQueryString=str_otherQueryString;

    
    /*
    console.log("str_serverQueryString: " + str_serverQueryString);
    console.log("str_reWritePathName: " + str_reWritePathName);                
    console.log("str_reWritePath: " + str_reWritePath);                       
    console.log(arr_reWritePath);         
    console.log("str_urlMetaRowzName: " + str_urlMetaRowzName);                               
    console.log("str_urlMetaRecordId: " + str_urlMetaRecordId);                
    console.log("str_otherQueryString: " + str_otherQueryString);                                
    //*/    
  }


  fn_explainNavigateRecordURL(){
    
    console.log("this.str_urlMetaRowzName: " + this.str_urlMetaRowzName);                               
    console.log("this.str_urlMetaRecordId: " + this.str_urlMetaRecordId);                
    console.log("this.str_otherQueryString: " + this.str_otherQueryString);                                
  }
  fn_pushStateNavigateRecordURL(str_urlMetaRowzName, str_urlMetaRecordId){
    let obj_state={};    
    str_urlMetaRowzName=str_urlMetaRowzName.toLowerCase();
    let str_url=this.fn_getNavigateRecordURL(str_urlMetaRowzName, str_urlMetaRecordId);    
    window.history.pushState(obj_state, "", str_url);
    return str_url;
  }

  fn_resetNavigateRecordURL(){           
    
    this.str_urlMetaRowzName="";
    this.str_urlMetaRecordId="";
    this.str_otherQueryString="";
    
    this.str_urlMetaRowzNameArchive="";
    this.str_urlMetaRecordIdArchive="";
    this.str_otherQueryStringArchive="";
  }

  fn_compareURLNavigateMenuName(str_metaRowzName, str_URLNavigateMenu){

    const obj_compareURL={};
    obj_compareURL.bln_applyURL=false;    
    if(str_metaRowzName.toLowerCase()===str_URLNavigateMenu.toLowerCase()){
      obj_compareURL.bln_applyURL=true;
    }    
    return obj_compareURL;

  }


  fn_compareURLNavigateArchive(str_metaRowzName){

    const obj_compareURL={};
    obj_compareURL.bln_applyURL=false;
    obj_compareURL.bln_applyURLId=false;

    str_metaRowzName=str_metaRowzName.toLowerCase();    
    
    if(!this.str_urlMetaRowzNameArchive.toLowerCase()){
      return obj_compareURL;      
    }    
    if(!str_metaRowzName){
      return obj_compareURL;      
    }    
    if(this.str_urlMetaRowzNameArchive!==str_metaRowzName){
      return obj_compareURL;      
    }    
    
    obj_compareURL.bln_applyURL=true;
    
    if(this.str_urlMetaRecordIdArchive){
      obj_compareURL.bln_applyURLId=true;
    }    
    return obj_compareURL;      

    
  }
}
//END Path.js


//START Shared.js
class Shared{
  constructor(){    
    this.str_listSeparatorOr="XORX";
    this.str_listSeparatorAnd="XANDX";
  }

  fn_messageWarn(str_message){
    alert(str_message);
  }  
  fn_messageAlert(str_message){
    alert(str_message);
  }
  
  fn_messageConfirm(str_message){  
    let bln_value=confirm(str_message);
    return bln_value;
  }  

  fn_getContainerWidthAvailable(obj_my) {
    let minusValue = 0;
    let currentElement = obj_my.dom_obj.parentElement;
    let int_returnValue=0;
    let int_currentValue;
    
    while (currentElement) {                  
      const computedStyle = window.getComputedStyle(currentElement);               
      const int_paddingLeft=parseInt(computedStyle.paddingLeft);
      const int_paddingRight=parseInt(computedStyle.paddingRight);
      const int_borderLeft=parseInt(computedStyle.borderLeftWidth);
      const int_borderRight=parseInt(computedStyle.borderRightWidth);
      int_currentValue=int_paddingLeft+int_paddingRight+int_borderLeft+int_borderRight;
      minusValue+=int_currentValue;
      int_returnValue=currentElement.offsetWidth-minusValue;
      currentElement = currentElement.parentElement;                  
    }
  
    return int_returnValue;
  }

  fn_formatDisplayValueFromColumn(obj_metaColumn, str_value){                                                                                                         

    str_value+="";                  
    if(!str_value){return str_value;}              
    
    switch(obj_metaColumn.MetaColumnType.toLowerCase()){                          
      case "checkbox":               
        if(!str_value){str_value=""};       
        str_value=obj_shared.fn_parseBool(str_value);                       
        if(str_value){str_value="Yes";}
        else{str_value="No";}                                            
        break;   
      case "color":                      
        if(!str_value){str_value=""};                      
        str_value="<div style='border:1px solid grey;background-color:"+str_value+"'>&nbsp;</div>"                      
        break;   
      case "email":
        if(!str_value){str_value="";return str_value;}
        if(str_value){
          str_value="<a href='mailto:"+str_value+"'>"+str_value+"</a>"
        }
        break;
      case "phone":
        if(!str_value){str_value="";return str_value;}
        if(str_value){
          str_value="<a href='tel:"+str_value+"'>"+str_value+"</a>"
        }                      
        break;
      case "url":
        if(!str_value){str_value="";return str_value;}
        if(str_value){
          str_value=str_value.replace(/^https:\/\//, '');                        
          str_value="<a target=\"_blank\" rel=\"noopener noreferrer\" href='https://"+str_value+"'>"+str_value+"</a>"
        }
        break;
      case "currency":              
      case "percent": 
      case "number":                   
        str_value=this.fn_formatNumber(str_value, obj_metaColumn.Decimal);
        str_value = Number(str_value).toLocaleString('en-GB', { minimumFractionDigits: obj_metaColumn.Decimal, maximumFractionDigits: obj_metaColumn.Decimal });
        break;
      case "date":                                            
      case "datetime":
        //if(!str_value){str_value="";return str_value;}                      
        let int_minLen=40;                      
        if(!str_value){str_value="";return str_value;}                      
        let obj_date=obj_shared.fn_getDateObjectFromSystemDate(str_value, obj_metaColumn.DateTime);                                                                                          
        str_value= obj_shared.fn_getCalendarDateStringFromDateObject(obj_date, obj_metaColumn.DateTime, obj_metaColumn.DateTimeSecond);                            
        break;
      case "recordid":                                            
        str_value=this.fn_formatNumber(str_value, 0);
        
    }
    return str_value;
  }
  
  fn_formatNumber(str_value, int_decimal){
    if(!str_value){str_value=0;}   
    str_value=this.fn_formatDecimalPlace(str_value, int_decimal);                     
    str_value=parseFloat(str_value).toFixed(int_decimal);                  
    return str_value;
  }
  
  fn_validNumber(str_value, bln_unsigned){                      
    str_value=this.fn_formatNumber(str_value);                      
    if(str_value<0 && !bln_unsigned){                    
      return false;
    }
    return true;
  }
  fn_getRandomArrayElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  fn_getNameValueFromObject(obj_my, str_name) {  
    
    const obj_new={
      str_name:str_name,
      str_value:obj_my[str_name],
    };
    return obj_new;
  }
  

  fn_getRandomNameValueFromObject(obj_my) {
  
    const keys = Object.keys(obj_my);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return this.fn_getNameValueFromObject(obj_my, randomKey);    
  }
  fn_flipVariable(str_value1, str_value2){    
    return [str_value1, str_value2] = [str_value2, str_value1];  
  }  
  fn_getRandomBool() {
    return Math.random() < 0.5;
  }
  fn_getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  fn_shallowCopy(obj_template){
    return { ...obj_template };            
  }

  fn_assignProperty(obj_target, obj_template){        
    if(!obj_target){
      obj_target=new Object;
    }
    Object.assign(obj_target, obj_template);
  }

  fn_isSmallScreen() {
    return window.innerWidth < 420;
  }
  
   
  fn_extractNumbers(str) {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  }

  fn_getMode(){
    return this.fn_getURLParam("mode");        
}       

  fn_getURLParam(str_name, str_url=""){
    let params;
    str_name=str_name.toLowerCase();
    if(!str_url){
      str_url=location.search;
    }    
    params = new URLSearchParams(str_url.toLowerCase());                
    return params.get(str_name);        
}   

fn_getURLNoParam(str_name){  
  return window.location.href.split('?')[0].slice(0, -1);  
}    

fn_removeObjectFromArray(arr_item, obj_my){
  let index = arr_item.indexOf(obj_my);
  if(index !== -1) {
    arr_item.splice(index, 1);
  }
}

fn_removeAfterLastIndex(str, char){
  
  const lastIndex = str.lastIndexOf(char);
  // Trim the string after the last occurrence of the character
  return str.slice(0, lastIndex);
}

fn_validateDecimalPart(str_value, decimalDigits){   

  // Split the value into whole and decimal parts
  const my_obj=this.fn_getNumberByPart(str_value);

  // Check if the decimal part exceeds the allowed number of digits
  if (my_obj.decimalPart.length > decimalDigits) {
      return  my_obj.wholePart + '.' + my_obj.decimalPart.slice(0, decimalDigits);
  }
  return str_value;
}

fn_validateWholeNumberPart(str_value){  
  
  const my_obj=this.fn_getNumberByPart(str_value);

  // Check if the whole part exceeds 10 digits
  if (my_obj.wholePart.length > 10) {
    return my_obj.wholePart.slice(0, 10) + (my_obj.decimalPart ? '.' + my_obj.decimalPart : '');      
  }
  return str_value;
}

fn_getNumberByPart(str_value){
  const parts = str_value.split('.');
  const wholePart = parts[0].replace(/[^\d]/g, ''); // Remove non-digit characters
  const decimalPart = parts[1] || '';

  let my_obj={};
  my_obj.wholePart=wholePart;
  my_obj.decimalPart=decimalPart;
  return my_obj;
}

fn_validateNumberFormat(value, decimalDigits) {
  // Ensure decimalDigits is between 1 and 5
  if (decimalDigits < 1 || decimalDigits > 5) {
      throw new Error("Decimal digits must be between 1 and 5.");
  }

  // Define the regular expression for the format
  const pattern = new RegExp(`^[+-]?\\d{1,10}(\\.\\d{1,${decimalDigits}})?$`);

  // Check if the value matches the pattern
  return pattern.test(value);
}

fn_isNumeric(value){    
  return /^[0-9]+$/.test(value);
}
fn_rangeNumber(int_value, int_min, int_max){    
  if(int_value<int_min){
    int_value=int_min;
  }
  if(int_value>int_max){
    int_value=int_max;
  }
  return int_value;
}


fn_addToList(obj_list){                  

  //this will set list to blank if a blank value is added
  //this will add the item if not blank, and not already in the list  
  //the list is returned

  let str_list=obj_list.str_list;
  let str_item=obj_list.str_item;
  let str_separator=obj_list.str_separator;  

  obj_list.bln_added=false;
  obj_list.bln_reset=false;
  
  if(!str_item){str_item="";}
  if(str_item){                                      
    //check to see if the given vvalue is already uin the query term.
    //if it is, just return querLi.
    //if it is not add the term, along with a separatorOR.
    let str_needle=str_separator + str_item + str_separator;
    let str_haystack=str_separator + str_list + str_separator;
    if(this.fn_inString(str_needle, str_haystack)){    
      return;
    }
    if(str_list){str_list+=str_separator;}                  
    str_list+=str_item;
    obj_list.bln_added=true;
  } 
  else{
    obj_list.bln_reset=true;
    str_list="";
  }  
  obj_list.str_list=str_list;  
  this.fn_maintainList(obj_list);  
}                                             
fn_maintainList(obj_list){

  let str_list=obj_list.str_list;  
  let str_separator=obj_list.str_separator;  
  if(!str_list){return;}  
  str_list=this.fn_replace(str_list, str_separator+str_separator, str_separator);
  str_list=this.fn_trimCharacter(str_list, str_separator);  
  obj_list.str_list=str_list;
}


  fn_inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

 fn_sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

fn_isANumber(int_val) {    
  if (typeof int_val === "number") {
    if (isNaN(int_val)) {
      return false;      
    } 
    return true;
  } else {
    return false;
  }  
}


  fn_validNumberVanillla(x) {      
    if (isNaN(x)) {
      return false;
    }    
    if (x===false) {
      return false;
    }    
    if (x==="") {
      return false;
    }    
    return true;
  }

  fn_validDate(x) {
    const int_num=Date.parse(x);
    if (isNaN(int_num)) {
      return false;
    }    
    return true;
  }  
  
  fn_validEmail(str_email){      
    const str_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return str_pattern.test(str_email); 
  }
  fn_validPhone(str_tel){
    var str_pattern =  /^[0-9()\[\]\{\} N,;/*#+-.\bext\b]+?$/i;    
    //*
    if(str_pattern.test(str_tel)){
      str_pattern =  /n/;    
      if(str_pattern.test(str_tel)){
        return false;
      }
      return true;      
    }
      //*/
    
    return false;
 }
  fn_validURL(str_url){    
    const str_pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return str_pattern.test(str_url);
  }



  fn_expireCookie(cname) {
    this.fn_setCookie(cname, "", 0);            
  }
  fn_setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Lax";
  }

  fn_getCookie(cname) {            
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  fn_leadingZero(int_num){
    let str_num=int_num;
    if(int_num<10){str_num="0"+int_num};
    return str_num;
  }
  
  fn_getDate(int_flag){
    switch(int_flag){
      case obj_const.int_dateNow:      
      let date=new Date();
      //Y-m-d H:i:s
      let Y=date.getFullYear();      
      let m=this.fn_leadingZero(date.getMonth()+1);            
      let d=this.fn_leadingZero(date.getDate());            
      let H=this.fn_leadingZero(date.getHours());            
      let i=this.fn_leadingZero(date.getMinutes());            
      let s=this.fn_leadingZero(date.getSeconds());                  
      return Y+"-"+m+"-"+d+" "+H+":"+i+":"+s; 
    }  
  }
  fn_onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  

  fn_formatUniqueList(str_list){    

    let arr_list=str_list.split(",");        
    arr_list=arr_list.map(s => s.replace(/\s+/g, ' ').trim());     
    
    let arr_unique = arr_list.filter(this.fn_onlyUnique);            
    str_list=arr_unique.toString();
    return str_list;
  }  

  fn_formatString(str_value, int_flag){
    
    switch(int_flag){
      case obj_const.int_alpha:      
      return str_value.replace(/[^A-Z a-z_]+/g, "");        
      case obj_const.int_alphaComma:      
      return str_value.replace(/[^A-Z a-z,_]+/g, "");            
      case obj_const.int_alphaNumeric:      
      return str_value.replace(/[^A-Za-z0-9_]+/g, "");        
      case obj_const.int_alphaNumericComma:      
      return str_value.replace(/[^A-Za-z0-9,_]+/g, "");            
      case obj_const.int_trimCommas:          
      return str_value.replace(/^,|,$/gi,"");            
    }
  }
  
  /////PERIOD/////////////////    
  fn_getDatePeriod(){
    let obj_period={};                
    let date_period;

    date_period = new Date();          
    date_period.setDate(date_period.getDate() + 1);
    date_period.setHours(0, 0, 0, 0);
    obj_period.date_expireThisPeriod=date_period;                              
    
    date_period = new Date();          
    date_period.setDate(date_period.getDate() + 2);
    date_period.setHours(0, 0, 0, 0);
    obj_period.date_expireNextPeriod=date_period;                    

    return obj_period;
  }
  fn_getMonthPeriod(){
    let obj_period={};                
    obj_period.date_expireThisPeriod=obj_shared.fn_getDateFirstDayOfMonth(1);
    obj_period.date_expireNextPeriod=obj_shared.fn_getDateFirstDayOfMonth(2);
    return obj_period;
  }
  fn_getDateFirstDayOfMonth(int_addMonth=0) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + int_addMonth; // Next month

    // Handle the case where the next month is January of the next year
    const nextMonth = month % 12;
    const nextYear = year + Math.floor(month / 12);

    const date_result=new Date(nextYear, nextMonth, 1);
    date_result.setHours(0, 0, 0, 0);

    return date_result;
}
  fn_isTomorrow(date) {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure the time is set to midnight    
    
    const tomorrow = new Date();          
    tomorrow.setDate(today.getDate() + 1);          
    tomorrow.setHours(0, 0, 0, 0); // Ensure the time is set to midnight

    return date.getFullYear() === tomorrow.getFullYear() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getDate() === tomorrow.getDate();
  }

  fn_debugQuarterDate(str_title, obj_date, bln_writeTitle=false){
    
    str_title+=": ";
    if(bln_writeTitle){
      console.log(str_title + obj_date);
    }
    else{
        console.log(obj_date);
    }
  }
  
  fn_debugQuarterDates(obj_period, bln_writeTitle=false){

    this.fn_debugQuarterDate("date_q04", obj_period.date_q04, bln_writeTitle);
    this.fn_debugQuarterDate("date_q03", obj_period.date_q03, bln_writeTitle);    
    this.fn_debugQuarterDate("date_q02", obj_period.date_q02, bln_writeTitle);
    this.fn_debugQuarterDate("date_q01", obj_period.date_q01, bln_writeTitle);
    console.log("---");

    this.fn_debugQuarterDate("date_q1", obj_period.date_q1, bln_writeTitle);
    this.fn_debugQuarterDate("date_q2", obj_period.date_q2, bln_writeTitle);
    this.fn_debugQuarterDate("date_q3", obj_period.date_q3, bln_writeTitle);
    this.fn_debugQuarterDate("date_q4", obj_period.date_q4, bln_writeTitle);
    console.log("---");

    this.fn_debugQuarterDate("date_q5", obj_period.date_q5, bln_writeTitle);
    this.fn_debugQuarterDate("date_q6", obj_period.date_q6, bln_writeTitle);
    this.fn_debugQuarterDate("date_q7", obj_period.date_q7, bln_writeTitle);
    this.fn_debugQuarterDate("date_q8", obj_period.date_q8, bln_writeTitle);
    console.log("---");  
  }  

  fn_formatNumberPeriod(obj_period, int_numberPeriod){

    switch(int_numberPeriod){
      case(1):
        //console.log("int_numberPeriod: 1")
        obj_period.int_thisQuarter=1;
        obj_period.int_nextQuarter=2;
        obj_period.int_next1Quarter=3;
        obj_period.int_next2Quarter=4;

        obj_period.str_thisQuarter="1st";
        obj_period.str_nextQuarter="2nd";
        obj_period.str_next1Quarter="3rd";
        obj_period.str_next2Quarter="4th";
        
        break;
      case(2):
        //console.log("int_numberPeriod: 2")
        obj_period.int_thisQuarter=2;
        obj_period.int_nextQuarter=3;
        obj_period.int_next1Quarter=4;
        obj_period.int_next2Quarter=1;

        obj_period.str_thisQuarter="2nd";
        obj_period.str_nextQuarter="3rd";
        obj_period.str_next1Quarter="4th";
        obj_period.str_next2Quarter="1st";

        break;
      case(3):
        //console.log("int_numberPeriod: 3")
        obj_period.int_thisQuarter=3;
        obj_period.int_nextQuarter=4;
        obj_period.int_next1Quarter=1;
        obj_period.int_next2Quarter=2;

        obj_period.str_thisQuarter="3rd";
        obj_period.str_nextQuarter="4th";
        obj_period.str_next1Quarter="1st";
        obj_period.str_next2Quarter="2nd";      
        
        break;
      case(4):
        //console.log("int_numberPeriod: 4")
        obj_period.int_thisQuarter=4;
        obj_period.int_nextQuarter=1;
        obj_period.int_next1Quarter=2;
        obj_period.int_next2Quarter=3;

        obj_period.str_thisQuarter="4th";
        obj_period.str_nextQuarter="1st";
        obj_period.str_next1Quarter="2nd";
        obj_period.str_next2Quarter="3rd";      
        break;
    }
  }
  
  fn_getQuarterPeriod(int_fiscalYearEndMonth, date_today=false){
    //int_fiscalYearEndMonth(ZeorIndexed Month January =0, February=1...)

    let obj_period={};                
    let bln_debugPeriod=false;                
    
    let today=date_today;
    if(!date_today){
      today=new Date();
    }
    if(bln_debugPeriod){
      console.log("today: " + today);
    }    

    let str_thisYear=today.getFullYear();    
    let date_yearEndMonth=new Date(str_thisYear, int_fiscalYearEndMonth, 1);       
    
    if(bln_debugPeriod){
      const arr_monthNames = ["January", "February", "March","April","May","June","July","August","September","October","November","December"];    
      let str_yearEndMonthName=arr_monthNames[int_fiscalYearEndMonth];
      console.log(str_yearEndMonthName + ", " +  str_thisYear);
    }    

    let date_q01, date_q02, date_q03, date_q04;
    let date_q1, date_q2, date_q3, date_q4;
    let date_q5, date_q6, date_q7, date_q8;

    
    date_q01=new Date(date_yearEndMonth.getFullYear(), 0, 1);            
    date_q01.setMonth(date_yearEndMonth.getMonth()-2); //note minus 2       
    //console.log(date_q01);

    date_q02=new Date(date_q01.getFullYear(), 0, 1);            
    date_q02.setMonth(date_q01.getMonth()-3);        
    //console.log(date_q02);
    
    date_q03=new Date(date_q02.getFullYear(), 0, 1);            
    date_q03.setMonth(date_q02.getMonth()-3);    
    //console.log(date_q03);
    
    date_q04=new Date(date_q03.getFullYear(), 0, 1);            
    date_q04.setMonth(date_q03.getMonth()-3);    
    //console.log(date_q04);

    //-----------------
    
    date_q1=new Date(date_yearEndMonth.getFullYear(), 0, 1);            
    date_q1.setMonth(date_yearEndMonth.getMonth()+1); //note plus 1        
    //console.log(date_q1);

    date_q2=new Date(date_q1.getFullYear(), 0, 1);            
    date_q2.setMonth(date_q1.getMonth()+3);        
    //console.log(date_q2);
    
    date_q3=new Date(date_q2.getFullYear(), 0, 1);            
    date_q3.setMonth(date_q2.getMonth()+3);    
    //console.log(date_q3);
    
    date_q4=new Date(date_q3.getFullYear(), 0, 1);            
    date_q4.setMonth(date_q3.getMonth()+3);    
    //console.log(date_q4);

    date_q5=new Date(date_q4.getFullYear(), 0, 1);            
    date_q5.setMonth(date_q4.getMonth()+3);        
    //console.log(date_q5);

    date_q6=new Date(date_q5.getFullYear(), 0, 1);            
    date_q6.setMonth(date_q5.getMonth()+3);        
    //console.log(date_q6);
    
    date_q7=new Date(date_q6.getFullYear(), 0, 1);            
    date_q7.setMonth(date_q6.getMonth()+3);    
    //console.log(date_q7);
    
    date_q8=new Date(date_q7.getFullYear(), 0, 1);            
    date_q8.setMonth(date_q7.getMonth()+3);    
    //console.log(date_q8);

    
    if(bln_debugPeriod){      
      obj_period.date_q01=date_q01;obj_period.date_q02=date_q02;obj_period.date_q03=date_q03;obj_period.date_q04=date_q04;
      obj_period.date_q1=date_q1;obj_period.date_q2=date_q2;obj_period.date_q3=date_q3;obj_period.date_q4=date_q4;
      obj_period.date_q5=date_q5;obj_period.date_q6=date_q6;obj_period.date_q7=date_q7;obj_period.date_q8=date_q8;    

      this.fn_debugQuarterDates(obj_period);
    }    

    if(today>=date_q04 && today<date_q03){ //note q04
      if(bln_debugPeriod){console.log("PAST current quarter is q1")}  
      
      this.fn_formatNumberPeriod(obj_period, 1);      

      obj_period.date_quarter1=date_q04;
      obj_period.date_quarter2=date_q03;
      obj_period.date_quarter3=date_q02;
      obj_period.date_quarter4=date_q01;      
      
      obj_period.date_thisQuarter=date_q04;
      obj_period.date_nextQuarter=date_q03;            
      obj_period.date_next1Quarter=date_q02;            
      obj_period.date_next2Quarter=date_q01;            
      
    }

    if(today>=date_q03 && today<date_q02){ //note q03
      if(bln_debugPeriod){console.log("PAST current quarter is q2")}              
      
      this.fn_formatNumberPeriod(obj_period, 2);     

      obj_period.date_quarter2=date_q03;
      obj_period.date_quarter3=date_q02;
      obj_period.date_quarter4=date_q01;
      obj_period.date_quarter1=date_q1;

      obj_period.date_thisQuarter=date_q03;
      obj_period.date_nextQuarter=date_q02;            
      obj_period.date_next1Quarter=date_q01;            
      obj_period.date_next2Quarter=date_q1;            
    }

    if(today>=date_q02 && today<date_q01){ //note q02
      if(bln_debugPeriod){console.log("PAST current quarter is q3")}                    

      this.fn_formatNumberPeriod(obj_period, 3);

      obj_period.date_quarter3=date_q02;
      obj_period.date_quarter4=date_q01;
      obj_period.date_quarter1=date_q1;
      obj_period.date_quarter2=date_q2;      

      obj_period.date_thisQuarter=date_q02;
      obj_period.date_nextQuarter=date_q01;           
      obj_period.date_next1Quarter=date_q1;            
      obj_period.date_next2Quarter=date_q2;             
    }
    if(today>=date_q01 && today<date_q1){ //note q01
      if(bln_debugPeriod){console.log("PAST current quarter is q4")}                    

      this.fn_formatNumberPeriod(obj_period, 4);

      obj_period.date_quarter4=date_q01;
      obj_period.date_quarter1=date_q1;
      obj_period.date_quarter2=date_q2;
      obj_period.date_quarter3=date_q3;
      
      obj_period.date_thisQuarter=date_q01;
      obj_period.date_nextQuarter=date_q1;            
      obj_period.date_next1Quarter=date_q2;            
      obj_period.date_next2Quarter=date_q3;             
    }
    //---

    if(today>=date_q1 && today<date_q2){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q1")}                                

      this.fn_formatNumberPeriod(obj_period, 1);

      obj_period.date_quarter1=date_q1;
      obj_period.date_quarter2=date_q2;
      obj_period.date_quarter3=date_q3;
      obj_period.date_quarter4=date_q4;      

      obj_period.date_thisQuarter=date_q1;
      obj_period.date_nextQuarter=date_q2;            
      obj_period.date_next1Quarter=date_q3;            
      obj_period.date_next2Quarter=date_q4;             
    }
    if(today>=date_q2 && today<date_q3){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q2")}                                
      
      this.fn_formatNumberPeriod(obj_period, 2);      
      
      obj_period.date_quarter2=date_q2;
      obj_period.date_quarter3=date_q3;
      obj_period.date_quarter4=date_q4;      
      obj_period.date_quarter1=date_q5;

      obj_period.date_thisQuarter=date_q2;
      obj_period.date_nextQuarter=date_q3;            
      obj_period.date_next1Quarter=date_q4;            
      obj_period.date_next2Quarter=date_q5;             
    }
    if(today>=date_q3 && today<date_q4){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q3")}                                      
      
      this.fn_formatNumberPeriod(obj_period, 3);   
      
      obj_period.date_quarter3=date_q3;
      obj_period.date_quarter4=date_q4;      
      obj_period.date_quarter1=date_q5;
      obj_period.date_quarter2=date_q6;

      obj_period.date_thisQuarter=date_q3;
      obj_period.date_nextQuarter=date_q4;            
      obj_period.date_next1Quarter=date_q5;            
      obj_period.date_next2Quarter=date_q6;             
    }
    if(today>=date_q4 && today<date_q5){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q4")}                                            
      
      this.fn_formatNumberPeriod(obj_period, 4);      
      
      obj_period.date_quarter4=date_q4;      
      obj_period.date_quarter1=date_q5;
      obj_period.date_quarter2=date_q6;
      obj_period.date_quarter3=date_q7;

      obj_period.date_thisQuarter=date_q4;
      obj_period.date_nextQuarter=date_q5;            
      obj_period.date_next1Quarter=date_q6;            
      obj_period.date_next2Quarter=date_q7;             
    }
    //---

    if(today>=date_q5 && today<date_q6){
      if(bln_debugPeriod){console.log("FUTURE current quarter is q1")}                                            
      
      this.fn_formatNumberPeriod(obj_period, 1);      
      
      obj_period.date_quarter1=date_q5;
      obj_period.date_quarter2=date_q6;
      obj_period.date_quarter3=date_q7;
      obj_period.date_quarter4=date_q8;      

      obj_period.date_thisQuarter=date_q5;
      obj_period.date_nextQuarter=date_q6;            
      obj_period.date_next1Quarter=date_q7;            
      obj_period.date_next2Quarter=date_q8;             
    }
    //*
    if(today>=date_q6 && today<date_q7){
      if(bln_debugPeriod){console.log("WONT SEE FUTURE current quarter is q2")}                                                        
      
      this.fn_formatNumberPeriod(obj_period, 2);      
      
      obj_period.date_quarter2=date_q6;
      obj_period.date_quarter3=date_q7;
      obj_period.date_quarter4=date_q8;            
      
      obj_period.date_thisQuarter=date_q6;
      obj_period.date_nextQuarter=date_q7;            
      obj_period.date_next1Quarter=date_q8;                  
    }
    if(today>=date_q7 && today<date_q8){
      if(bln_debugPeriod){console.log("WONT SEE FUTURE current quarter is q3")}                                                  
      
      this.fn_formatNumberPeriod(obj_period, 3);         
      
      obj_period.date_quarter3=date_q7;
      obj_period.date_quarter4=date_q8;                  

      obj_period.date_thisQuarter=date_q7;
      obj_period.date_nextQuarter=date_q8;            
    }
    if(today>=date_q8){
      if(bln_debugPeriod){console.log("WONT SEE FUTURE current quarter is q4")}                                                  
      
      this.fn_formatNumberPeriod(obj_period, 4);         
      
      obj_period.date_quarter4=date_q8;            

      obj_period.date_thisQuarter=date_q8;      
    }   
    
    obj_period.date_expireThisPeriod=obj_period.date_nextQuarter;    
    obj_period.int_thisPeriod=obj_period.int_thisQuarter;    
    obj_period.str_thisPeriod=obj_period.str_thisQuarter;    

    obj_period.date_expireNextPeriod=obj_period.date_next1Quarter;
    obj_period.int_nextPeriod=obj_period.int_nextQuarter;    
    obj_period.str_nextPeriod=obj_period.str_nextQuarter;    

    
    

    obj_period.date_quarterYearEnd=obj_period.date_quarter4;
    obj_period.date_quarterYearStart=obj_period.date_quarter1;
    //console.log("obj_period.date_quarterYearEnd: " + obj_period.date_quarterYearEnd);
    //console.log("obj_period.date_quarterYearStart: " + obj_period.date_quarterYearStart);

    let str_year, str_month;
    str_year=obj_period.date_quarterYearStart.getFullYear();
    
    if(today>obj_period.date_quarterYearStart){
      str_year=obj_period.date_quarterYearStart.getFullYear()+1;
    }
    str_month=obj_period.date_quarterYearStart.getMonth();
    obj_period.date_expireThisYearPeriod=new Date(str_year, str_month, 1)
    str_year=obj_period.date_expireThisYearPeriod.getFullYear()+1;
    obj_period.date_expireNextYearPeriod=new Date(str_year, str_month, 1)    
    

    return obj_period;
  }

  fn_getYearPeriod(int_fiscalYearEndMonth, date_today=false){
    //int_fiscalYearEndMonth(ZeorIndexed Month January =0, February=1...)

    let obj_period=obj_shared.fn_getQuarterPeriod(int_fiscalYearEndMonth, date_today=false);    
    obj_period.date_expireThisPeriod=obj_period.date_expireThisYearPeriod;
    obj_period.date_expireNextPeriod=obj_period.date_expireNextYearPeriod;
    return obj_period;
  }
  fn_getFirstDayOfYearFromNow(yearsToAdd) {
    
    let today = new Date();
    let targetYear = today.getFullYear() + yearsToAdd;
    let firstDayOfYear = new Date(targetYear, 0, 1);
    return firstDayOfYear;
  }  

  /////PERIOD/////////////////

  fn_formatDisplayNumber(int_num, int_digits=0){

    return Number(int_num).toLocaleString('en-GB', { minimumFractionDigits: int_digits, maximumFractionDigits: int_digits });
  }


  fn_parseDateTimeString(dateTimeString, bln_addTime=false) {
    if(!dateTimeString){      
      return "";
    }
    if(dateTimeString===undefined){      
      return "";
    }
    if(dateTimeString==="undefined"){      
      return "";
    }

    dateTimeString=dateTimeString.replace("T", " ");    
    //Remove the T
    
    // Split the date and time parts    
    let [datePart, timePart] = dateTimeString.split(' ');

    // Split the date part into year, month, and day
    let [year, month, day] = datePart.split('-');

    
    // Create a new Date object
    if(bln_addTime){
      // Split the time part into hours, minutes, and seconds      

      let [hours, minutes, seconds] = timePart.split(':');

      return new Date(year, month - 1, day, hours, minutes, seconds); // Months are zero-based
    }    

    return new Date(year, month - 1, day); // Months are zero-based
}

  fn_isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  fn_getDateStringFromDateObject(dateString) {
    
    // Split the date string into components
    let [day, month, year] = dateString.split('-');

    // Convert the month abbreviation to a month number
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let monthIndex = monthNames.indexOf(month.toUpperCase());

    // Create a new Date object
    return new Date(year, monthIndex, day);
  }
  fn_getUnixTimeStampFromDateObject(date_obj){
    const unixTimestamp = Math.floor(date_obj.getTime() / 1000);
    return unixTimestamp;

  }
  fn_formatSystemDateString(obj_date, bln_addTime=false, bln_addSeconds=false){        

    let year = obj_date.getFullYear();
    let month = (obj_date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = obj_date.getDate().toString().padStart(2, '0');
    
    if(bln_addTime){        
      let hours = obj_date.getHours().toString().padStart(2, '0');
      let minutes = obj_date.getMinutes().toString().padStart(2, '0');
      let seconds = obj_date.getSeconds().toString().padStart(2, '0');            
      if(bln_addSeconds){
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;            
      }
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;      
    }
    
    return `${year}-${month}-${day}`;
  }

  fn_formatISODateString(date, bln_addTime=false, bln_addSeconds=false){

    if(date==="Invalid Date"){
      return "";
    }
    
    if(!date){
      return "";
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();      
    
    if(bln_addTime){
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      if(bln_addSeconds){
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;  
      }
      return `${year}-${month}-${day}T${hours}:${minutes}`;
      
    }    
    return  `${year}-${month}-${day}`;
  }

  fn_getCalendarDateStringFromDateObject(date, bln_addTime=false, bln_addSeconds=false){

    if(date==="Invalid Date"){
      return "";
    }
   
    if(!date){
      return "";
    }
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];            
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      if(bln_addTime){
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        if(bln_addSeconds){
          return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }
        return `${day}-${month}-${year} ${hours}:${minutes}`;
      }
      
      return `${day}-${month}-${year}`;
      
  }

  fn_getDateObjectFromCalendarDate(dateTimeString, bln_addTime=false) {    
    
    // Split the date and time parts
    let [datePart, timePart] = dateTimeString.split(' ');

    // Split the date part into day, month, and year
    let [day, month, year] = datePart.split('-');

    // Convert the month abbreviation to a month number
    //const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let monthIndex = monthNames.indexOf(month.toUpperCase());
    //let monthIndex = monthNames.indexOf(month);
     // Create a new Date object
     if(bln_addTime){     
        // Split the time part into hours, minutes, and seconds
      let [hours, minutes, seconds] = timePart.split(':')
    
      return new Date(year, monthIndex, day, hours, minutes, seconds);
     }
     
     return new Date(year, monthIndex, day);
     
     
  }
  fn_getDateObjectFromSystemDate(dateTimeString, bln_addTime){        
    return this.fn_parseDateTimeString(dateTimeString, bln_addTime);
  } 

  fn_formatDate(str_value){
    
    return str_value.replace(/[^A-Za-z0-9 :\-_]+/g, "");            
    //return str_value;
  }
  fn_searchObject(obj_value, key) {
        
    if (key in obj_value) {
      return obj_value[key];
    } else {
      return null; // Or throw an error if you prefer
    }
  }


  fn_formatShortName(str_value){                    
    if(!str_value){str_value="";}
    str_value=str_value.toLowerCase().replace(/-/gi, "_");;                    
    str_value=this.fn_removeSpace(str_value);            
    str_value=this.fn_formatString(str_value, obj_const.int_alphaNumeric);                                      
    return str_value;
  }
  fn_formatShortDate(str_value){                    
    str_value=this.fn_formatDate(str_value);                                      
    return str_value;
  }  

  fn_formatPlural(int_value, str_value, bln_flip=false){

    let bln_value=false;    
    if(int_value>1){
      bln_value=true;            
    }

    if(bln_flip){
      bln_value=this.fn_flipBool(bln_value);      
    }

    if(bln_value){
      str_value+="s";
    }
    return str_value;
  }
  fn_stringToArray(str_value=""){     
    if(!str_value){return [];}
    let arr_item = str_value.split(",").map(item => item.trim());    
    return this.fn_cleanArray(arr_item);        
  }

  fn_cleanArray(arr_item){                                
    return [...new Set(arr_item)].filter((str) => str !== '');    
  }

  fn_cleanId(foo_idRecord){                                               
    if(!foo_idRecord){return 0;} 
    foo_idRecord+='';
    if(foo_idRecord.length>100){return 0;}                
    foo_idRecord=this.fn_alphanumericOnly(foo_idRecord);                
    if(this.fn_inStr("SELECT", foo_idRecord)){return 0;}
    if(this.fn_inStr("UPDATE", foo_idRecord,)){return 0;}
    if(this.fn_inStr("INSERT", foo_idRecord)){return 0;}
    if(this.fn_inStr("DELETE", foo_idRecord)){return 0;}                    
    return foo_idRecord;
  }
  fn_validId(foo_val){
    if(!foo_val || foo_val==="0")return false;    
    return true;
  }
  fn_compareId(str_id, str_compare){    
    str_id+="";    
    str_compare+="";    
    if(str_id===str_compare){return true;}
    return false;
  }  
  

  fn_formatDecimalPlace(str_value, decimal){
    const num = Number(str_value);
    return num.toFixed(decimal);        
  }  
  fn_cleanValue(str_value){                                               
    return this.fn_cleanId(str_value);                
  }

  fn_alphanumericOnly(foo_value, str=""){
    return foo_value.replace(/[\W_]+/g, str);
  }

  
  fn_getHTMLTable(arr_name, arr_value){
    let str_table, str_row, str_cell, str_name, str_value;
    str_table=`<TABLE>`;    
    for (let i = 0; i < arr_name.length; i++) {
      str_name=arr_name[i];      
      str_value=arr_value[i];      
      str_value=this.fn_replace(str_value, "&nbsp;", "");
      if(str_value==102){
        //str_value="John Collins";
      }
      str_row="";
      if(str_value){
        str_row=`
        <TR>
        <TD style="text-align: right;">${str_name}:</TD>
        <TD>${str_value}</TD>
        </TR>`;
      }
      
      if(str_row){str_table+=str_row;}
    }
    str_table+="</TABLE>";
    return str_table;

  }


  fn_replace(str_source, str_find, str_replace, str_brackets=""){  
    str_source=str_brackets+str_source+str_brackets;
    str_find=str_brackets+str_find+str_brackets;    
    let re=new RegExp(str_find, "gi");
    
    return str_source.replace(re, str_replace);
  }
  fn_remove(str_source, str_remove){
    let re=new RegExp(str_remove, "g");
    return str_source.replace(re, "");
  }

  fn_trimCharacter(inputString, characterToTrim) {
    // Create a regular expression that matches the specified character at the beginning and end of the string
    const regex = new RegExp(`^${characterToTrim}+|${characterToTrim}+$`, 'g');
    
    // Use the replace method to remove the character from the string
    const trimmedString = inputString.replace(regex, '');
  
    return trimmedString;
  } 

  fn_getBaseURL(obj_url){
    return `${obj_url.protocol}//${obj_url.host}`;
  }

  fn_promoteArrayItem(arr_item, foo_item){

    if(!Array.isArray(arr_item))return;

    const index = arr_item.indexOf(foo_item);
    if (index !== -1) {
      arr_item.splice(index, 1); // Remove the item from its current position
      arr_item.unshift(foo_item); // Add it to the front
    }           
  }
  

  fn_getFoldersFromPath(folderPath) {
    // Split the folderPath using forward slash (/) as the delimiter
    const folders = folderPath.split('/');
  
    // Filter out any empty folder names (resulting from multiple consecutive slashes)
    const filteredFolders = folders.filter(folder => folder.length > 0);
  
    return filteredFolders;
  }  
  
  fn_trimComma(str){        
    str = str.replace(/(^,)|(,$)/g, "")    
    return str;
  }
  fn_removeSpace(str){        
    str = str.replace(/\s+/g, '');    
    return str;
  }

  fn_isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  fn_isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  fn_hasMembersObject(obj) {
    return Object.keys(obj).length !== 0;
  }

  fn_capitalize(words="") {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
    }
    return separateWord.join(' ');
  } 

  fn_inString(str_needle="", str_haystack="", str_brackets=""){
    return this.fn_inStr(str_needle, str_haystack, str_brackets);
  }

  fn_inStr(str_needle="", str_haystack="", str_brackets=""){  

    str_needle=str_brackets+str_needle+str_brackets;
    str_haystack=str_brackets+str_haystack+str_brackets;

    let int_pos=str_haystack.toLowerCase().indexOf(str_needle.toLowerCase());
    if(int_pos===-1){return false;}
    return true;
  }

  fn_isEmptyObject(my_obj) { 

    if(!my_obj){return true;}

    if(my_obj.constructor === Object && Object.keys(my_obj).length === 0){
      return true;
    } 
    return false;
  }

  fn_removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }
  
  fn_hyphenToCamelCase(str) {
      return str.replace(/-(\w)/g, (match, char) => char.toUpperCase());
    }

  fn_camelCaseToHyphen(str) { 

      return str.replace(/([A-Z])/g, "-$1").toLowerCase();  
  }

  fn_debug(obj_myObj, str_message=""){
    this.fn_enumerateObject(obj_myObj, str_message="");
  }

  fn_debugArrayItem(item, index) {
    console.log("array item: " + index + ": " + item); 
  }

  fn_listObject(obj_my, str_msg=""){
    if(str_msg){
      console.log("fn_listObject: " + str_msg);
    }
    const keys = Object.keys(obj_my);
    keys.forEach(key => {
        console.log(`${key}: ${obj_my[key]}`);
    });
  }

  fn_enumerateObject(obj_myObj, str_message=""){

      console.groupCollapsed("ENUMERATE OBJECT :" + str_message);

      for (let [key, foo_value] of Object.entries(obj_myObj)) {
          console.log(`${key}: ${foo_value}`);
          console.log("typeof : " + typeof foo_value);
          //if (typeof foo_value === "object" && foo_value !== null && (key=="obj_design" || key=="obj_domProperty") )  {
          //if (typeof foo_value === "object" && foo_value !== null && (key=="obj_design"))  {
          //if (typeof foo_value === "object" && foo_value !== null && (key.indexOf("obj_")===0))  {          
          switch(typeof foo_value){
            case "object":
              this.fn_enumerateObject(foo_value, "");
              break;
            case "array":
              foo_value.forEach(this.fn_debugArrayItem);
              break;
            default:
              //console.log(`${key}: ${foo_value}`);
              
          }        
      }
      console.groupEnd();
    }
    fn_iteratePropertyNames(obj){
      do Object.getOwnPropertyNames(obj).forEach(function(name) {
          console.log(name);
      });
      while(obj = Object.getPrototypeOf(obj));
    }

    fn_findInObject(obj_myObj, str_search){
      for (let [key, foo_value] of Object.entries(obj_myObj)) {
          console.log(`${key}: ${foo_value}`);
      }
    }

    fn_getUniquePrefix(str_name="my_"){
      let str_value=str_name+this.fn_getUnique(5);   
      return str_value.toLowerCase();
    }   

    fn_getUnique(length) {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);   
    
        result += characters.charAt(randomIndex);
      }
    
      return result;
    }

    fn_getUniqueId(str_value){
      let generator = new IDGenerator();
      return str_value +"_" + generator.generate();
    }
    fn_getRandom(number) {
      return Math.floor(Math.random() * (number+1));
    }

    fn_getRandomColor() {
      return 'rgb(' + this.fn_getRandom(255) + ',' + this.fn_getRandom(255) + ',' + this.fn_getRandom(255) + ')';
    }

    fn_flipOrientation(int_axis){
      if(int_axis==obj_const.int_axisHorizontal){return obj_const.int_axisVertical;}
      if(int_axis==obj_const.int_axisVertical){return obj_const.int_axisHorizontal;}
      return int_axis;

    }
    fn_toogleBool(bln_val){
      if(bln_val){return false;}
      else{return true;}
    }
    fn_flipBool(bln_val){
      return this.fn_toogleBool(bln_val);      
    }
    fn_timeDifference(startTime, endTime) {
      // Convert start and end times to Date objects
      var start = new Date(startTime);
      var end = new Date(endTime);
    
      // Calculate the difference in milliseconds
      var difference = end - start;
    
      // Return the difference in milliseconds
      return difference;
    }
    fn_millisecondsToSeconds(milliseconds) {
      // Divide the number of milliseconds by 1000 to convert it to seconds
      var seconds = milliseconds / 1000;
    
      // Round the result to 2 decimal places
      seconds = Math.round(seconds * 100) / 100;
    
      // Return the result
      return seconds;
    }

    fn_parseInt(int_value){
      if(!int_value){int_value=0;}                        
      return parseInt(int_value);              
    }
    fn_parseString(foo_val){      
      if(!foo_val){
        foo_val="";
      }
      return String(foo_val);
    }

    fn_parseBoolString(foo_val){  
      let bln_value=this.fn_parseBool(foo_val);
      if(bln_value){
        return "true";
      }
      return "false";
    }

    fn_isBool(foo_value) {
      return typeof foo_value === 'boolean';
    }
    
    fn_parseBool(foo_val){  

      switch(typeof(foo_val)){              
        case "number":
          switch(foo_val){      
            case 0:
              return false;                
            default:
              return true;
          }
        case undefined:
            return false;                         
        case "undefined":
            return false;                         
        case "boolean":
            return foo_val;                         
        case "string":
          switch(foo_val.toLowerCase()){      
            case "false":
              return false;                
            case "0":
              return false;        
            case "no":
              return false;        
            case "off":
              return false;
            case "true":
              return true;        
            case "1":
              return true;        
            case "yes":
              return true;        
            case "on":
              return true;                                   
            default:
              // other string e.g. "green"              
          }            
        default:                  
      }
      //return foo_val ? true : false;           
      return foo_val;           
    }
    fn_toggleBool(foo_val){  
      foo_val=this.fn_parseBool(foo_val);
      if(foo_val){return false;}
      return true;
    }

    getAllFuncs(toCheck) {
      var props = [];
      var obj = toCheck;
      do {
          props = props.concat(Object.getOwnPropertyNames(obj));
      } while (obj = Object.getPrototypeOf(obj));

      return props.sort().filter(function(e, i, arr) {
        if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
      });
    }

    fn_removeArrOfArrays(arr_first, arrOfArrays) {
      let str_value1, str_value2;
      let i, j;
      for (i=0; i<arr_first.length; i++) {
          str_value1=arr_first[i];

          for (j=0; j<arrOfArrays.length; j++) {
            str_value2=arrOfArrays[j][0];
            if(str_value1===str_value2){
              arrOfArrays.splice(j, 1);
            }
          }

      }
      return arrOfArrays;
  }

  fn_getNextMapItem(myMap, key) {
    const iterator = myMap.entries();
    let found = false;
    let nextValue;

    for (const [currentKey, currentValue] of iterator) {
        if (found) {
            nextValue = currentValue;
            break;
        }
        if (currentKey === key) {
            found = true;
        }
    }

    return nextValue;
  }

  

    fn_setMapItem(obj_map, foo_key, foo_value){
      //console.log("fn_setMapItem foo_key: " + foo_key);
      //*
      //console.log(foo_key);
      //console.log(foo_value);      
      obj_map.set(foo_key, foo_value);
      //*/
    }
    fn_getMapItem(obj_map, foo_key){
      return obj_map.get(foo_key);
    }   
    fn_deletetMapItem(obj_map, foo_key){
      //console.log("fn_deletetMapItem foo_key: " + foo_key);
      return obj_map.delete(foo_key);
    }   
    
    fn_debugMap(myMap){   
      console.log("START fn_debugMap");
      for (const [key, value] of myMap.entries()) {
          console.log(key, value);
        }
        console.log("END fn_debugMap");

    }   

    // Parameters:
    // code 								- (string) code you wish to format
    // stripWhiteSpaces			- (boolean) do you wish to remove multiple whitespaces coming after each other?
    // stripEmptyLines 			- (boolean) do you wish to remove empty lines?
    fn_formatCode(code, stripWhiteSpaces=true, stripEmptyLines=true) {
      //"use strict";
      var whitespace          = ' '.repeat(4);             // Default indenting 4 whitespaces
      var currentIndent       = 0;
      var char                = null;
      var nextChar            = null;


      var result = '';
      for(var pos=0; pos <= code.length; pos++) {
          char            = code.substr(pos, 1);
          nextChar        = code.substr(pos+1, 1);

          // If opening tag, add newline character and indention
          if(char === '<' && nextChar !== '/') {
              result += '\n' + whitespace.repeat(currentIndent);
              currentIndent++;
          }
          // if Closing tag, add newline and indention
          else if(char === '<' && nextChar === '/') {
              // If there're more closing tags than opening
              if(--currentIndent < 0) currentIndent = 0;
              result += '\n' + whitespace.repeat(currentIndent);
          }

          // remove multiple whitespaces
          else if(stripWhiteSpaces === true && char === ' ' && nextChar === ' ') char = '';
          // remove empty lines
          else if(stripEmptyLines === true && char === '\n' ) {
              //debugger;
              if(code.substr(pos, code.substr(pos).indexOf("<")).trim() === '' ) char = '';
          }

          result += char;
      }
      return result;
    }

    fn_quantifyRGB(rgb) {

      let [r, g, b] = rgb.match(/\d+/g).map(x => parseInt(x));
      return r+g+b;
    }    

    fn_domMoveElementToFront(elementToMove) {
    
      const container = elementToMove.parentNode;
  
      // Move the element to the front
      container.insertBefore(elementToMove, container.firstChild);
    }

    fn_getObjectProperty(obj_my, str_label){            

      if(obj_my[str_label]===undefined){
          str_label=str_label.toLowerCase();     
      }
      return obj_my[str_label];             
    }

    fn_formatString(str_my){
      if(!str_my){str_my="";}                  
      return str_my+="";
    }
    
    fn_interfaceReplaceSessionCodes(str_text){

      //check default is set correctly in the client system (not just 100!)

      let arr_needle=[                        
          "{MetaUserId}",
          "{MetaUserEmail}",
          "{MetaUserSystemId}",     
          "{MetaMoverSystemId}", 
          "{MetaMoverSystemName}", 
      ];
      let arr_replace=[            
        obj_userHome.MetaUserId,            
        obj_userHome.MetaUserEmail,            
        obj_userHome.MetaUserSystemId,      
        obj_userHome.MetaUserSystemId,      
        "["+obj_userHome.MetaUserEmail+"]",            
      ];
      
      for(var x = 0 ; x < arr_needle.length; x++){  
        str_text = str_text.replace(new RegExp(arr_needle[x], "g"), arr_replace[x])      
      }    
      str_text+="";
      return str_text;    
  }   

  fn_detectBrowser() {
    const userAgent = navigator.userAgent;
    //console.log("userAgent: " + userAgent);
    let browserName;

    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("rv:") > -1) {
        browserName = "Internet Explorer";
    } else if (userAgent.indexOf("OP") > -1) {
        browserName = "Opera";
    } else {
        browserName = "Unknown";
    }

    return browserName;
  }

  fn_isMobile() {
    return window.matchMedia("(max-width: 767px)").matches ? true : false;
  }       
  fn_parseList(str_json){                  
    if(!str_json){
      return {};
    }
    return JSON.parse(str_json);
  }

//START SHARED THEME HANDLER
fn_getShade(obj_shade){        
  let str_hsla;
  str_hsla=obj_shade.str_hsla;            
  let obj_gradient=this.fn_getGradientObjectFromHSLA(str_hsla);    
  str_hsla=this.fn_setHueHSLA(obj_gradient, obj_shade.int_percentHue, obj_shade.bln_value);        
  str_hsla=this.fn_setSaturateHSLA(obj_gradient, obj_shade.int_percentSaturation, obj_shade.bln_value);    
  str_hsla=this.fn_setLightHSLA(obj_gradient, obj_shade.int_percentLight, obj_shade.bln_value); 
  str_hsla=this.fn_formatHSLA(str_hsla);
  return str_hsla;
}       
fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, str_hsla, str_label="MyColor"){
  
  const obj_gradient={          
    int_hue:int_hue,
    int_saturation:int_saturation,
    int_light:int_light,
    int_alpha:int_alpha,
  }
  if(!str_hsla){
    str_hsla=this.fn_getHSLAString(obj_gradient);                
  }
  
  obj_gradient.str_hsla=str_hsla;  
  obj_gradient.str_label=str_label;        
  if(obj_gradient.int_alpha===1){
    obj_gradient.bln_transparent=true;
  }
  return obj_gradient;
}   
fn_getGradientObjectFromHSLA(str_hsla, str_label="MyColor"){      

  const arr_value=this.fn_splitGradient(str_hsla);              
  const obj_gradient=this.fn_getGradientObjectFromArray(arr_value, str_label);  
  return obj_gradient;
  
}
fn_getGradientObjectFromArray(arr_value, str_label){

  let int_hue=this.fn_getGradientValue(arr_value, 0);//hue      
  let int_saturation=this.fn_getGradientValue(arr_value, 1);//saturation
  let int_light=this.fn_getGradientValue(arr_value, 2);//light      
  let int_alpha=this.fn_getGradientValue(arr_value, 3);//alpha
  let obj_gradient;
  if(!this.fn_isANumber(int_alpha)){//HSL string passed
    int_alpha=1;                
    obj_gradient=this.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, false, str_label);//empty string will force str hlsa to be got.        
  } 
  if(!obj_gradient){
    obj_gradient=this.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, false, str_label);          
  }    
  return obj_gradient;
  
}

fn_getGradientObjectFromGradient(obj_hsla, str_label="MyColor"){      
  const obj_gradient=this.fn_getGradientObject(obj_hsla.int_hue, obj_hsla.int_saturation, obj_hsla.int_light, obj_hsla.int_alpha, false, str_label);            
  return obj_gradient;
}

fn_setHueHSLA(obj_gradient, int_amount, bln_value){
  const int_position=0;    
  let int_value=obj_gradient.int_hue;
  int_value=this.fn_changeValue(int_value, int_amount, bln_value);    
  int_value=this.fn_boundDegree(int_value);    
  return this.fn_setHSLA(obj_gradient.str_hsla, int_position, int_value);
}  
fn_setSaturateHSLA(obj_gradient, int_amount, bln_value){

  const int_position=1;    
  let int_value=obj_gradient.int_saturation;
  int_value=this.fn_changeValue(int_value, int_amount, bln_value);    
  int_value=this.fn_boundPercentage(int_value);    
  return this.fn_setHSLA(obj_gradient.str_hsla, int_position, int_value);
}    
fn_setLightHSLA(obj_gradient, int_amount, bln_value){

  const int_position=2;    
  let int_value=obj_gradient.int_light;
  int_value=this.fn_changeValue(int_value, int_amount, bln_value);    
  int_value=this.fn_boundPercentage(int_value);    
  return this.fn_setHSLA(obj_gradient.str_hsla, int_position, int_value);
}    
fn_setHSLA(str_hsla, int_position, int_value) {                     
  let str_value=this.fn_setGradientValue(str_hsla, int_position, int_value);            
  str_value="HSLA"+str_value;
  return str_value;
}
fn_getGradientValue(arr_value, int_position){      
  return Number(arr_value[int_position]);    
}
fn_setGradientValue(str_value, int_position, int_value){
  const arr_value=this.fn_splitGradient(str_value);          
  arr_value[int_position]=int_value;     
  return this.fn_getGradientString(arr_value);          
}  
fn_getGradientString(arr_value){    
  const str_value="("+arr_value.join(',')+")";          
  return str_value;
}
fn_splitGradient(str_value){          
  str_value=this.fn_replace(str_value, "%", "");        
  str_value=str_value.replace("°", "");
  str_value=str_value.replace("(", "");
  str_value=str_value.replace(")", "");
  str_value=str_value.replace("hsla", "");    
  str_value=str_value.replace("HSLA", "");    
  str_value=str_value.replace("hsl", "");
  str_value=str_value.replace("HSL", "");        
  let arr_value=str_value.split(",");  
  return arr_value;  
}    
fn_formatHSLA(str_value){      
  const arr_value=this.fn_splitGradient(str_value);          
  arr_value[1]+="%";
  arr_value[2]+="%";
  str_value="HSLA("+arr_value.join(',')+")";      
  return str_value;  
}
fn_changeValue(int_value, int_amount, bln_value){    
  if(bln_value){int_value+=int_amount;}
  else{int_value-=int_amount;}
  return int_value;
}

fn_boundPercentage(int_value){
  return this.fn_boundValue(int_value, 0,100);   
}
fn_boundDegree(int_value){
  return this.fn_boundValue(int_value, 0, 359);   
}  
fn_boundValue(int_value, int_min, int_max){    
  if(int_value<int_min){int_value=int_min;}
  if(int_value>int_max){int_value=int_max;}        
  return int_value;
}
fn_filterValue(int_value, int_min, int_max){    
  if(int_value<int_min){return false;}
  if(int_value>int_max){return false;}        
  return true;
}
fn_getHSLString(obj_gradient){  
  const int_hue=obj_gradient.int_hue;
  const int_saturation=obj_gradient.int_saturation;
  const int_light=obj_gradient.int_light;      
  return `hsl(${int_hue}, ${int_saturation}%, ${int_light}%)`;
}  
fn_getHSLAString(obj_gradient){  
  const int_hue=obj_gradient.int_hue;
  const int_saturation=obj_gradient.int_saturation;
  const int_light=obj_gradient.int_light;
  const int_alpha=obj_gradient.int_alpha;
  return `hsla(${int_hue}, ${int_saturation}%, ${int_light}%, ${int_alpha})`;
} 
fn_groupColorList(){  
  this.fn_sortColorList();
  const entries = Object.entries(this.obj_colorList);
  //console.log(obj_shared.entries);
  for (const [str_name, arr_value] of Object.entries(this.obj_colorList)) {    
    let int_hue=arr_value[0];
    let int_saturation=arr_value[1];
    let int_light=arr_value[2];    
    let str_value=`HSLA(${int_hue}, ${int_saturation}, ${int_light})`;
    let obj_color={str_name:str_name,str_value:str_value};     
    //console.log("str_name: " + str_name);
    //console.log("str_value: " + str_value);
    //console.log(obj_color);    
  }
  
  }
fn_sortColorList(){  
  //*
  // Sort by the first value of each array
  this.obj_colorList = Object.entries(this.obj_colorList)
    .sort((a, b) => a[1][0] - b[1][0])
    .reduce((acc, [color, value]) => ({ ...acc, [color]: value }), {});
//*/

/*
    // Sort by the middle value of each array
this.obj_colorList = Object.entries(this.obj_colorList)
.sort((a, b) => a[1][1] - b[1][1])
.reduce((acc, [color, value]) => ({ ...acc, [color]: value }), {});
//*/
}
fn_getRandomColorName(){    
  const obj_my=this.fn_getRandomNameValueFromObject(this.obj_colorList);    
  return obj_my.str_name;
}
fn_getColorNameValue(str_name){          
  const obj_color=this.fn_getNameValueFromObject(this.obj_colorList, str_name);          
  return obj_color;
}
fn_setColorList(){
  this.obj_colorList = {    
    "aliceblue": [208, 100, 97],
      "antiquewhite": [34, 78, 91],
      "aqua": [180, 100, 50],
      "aquamarine": [160, 100, 75],
      "azure": [180, 100, 97],
      "beige": [60, 56, 91],
      "bisque": [33, 100, 88],
      "black": [0, 0, 0],
      "blanchedalmond": [36, 100, 90],
      "blue": [240, 100, 50],
      "blueviolet": [271, 76, 53],
      "brown": [0, 59, 41],
      "burlywood": [34, 57, 70],
      "cadetblue": [182, 25, 50],
      "chartreuse": [90, 100, 50],
      "chocolate": [25, 75, 47],
      "coral": [16, 100, 66],
      "cornflowerblue": [219, 79, 66],
      "cornsilk": [48, 100, 93],
      "crimson": [348, 83, 47],
      "cyan": [180, 100, 50],
      "darkblue": [240, 100, 27],
      "darkcyan": [180, 100, 27],
      "darkgoldenrod": [43, 89, 38],
      "darkgray": [0, 0, 66],
      "darkgreen": [120, 100, 20],
      "darkkhaki": [56, 38, 58],
      "darkmagenta": [300, 100, 27],
      "darkolivegreen": [82, 39, 30],
      "darkorange": [33, 100, 50],
      "darkorchid": [280, 61, 50],
      "darkred": [0, 100, 27],
      "darksalmon": [15, 72, 70],
      "darkseagreen": [120, 25, 65],
      "darkslateblue": [248, 39, 39],
      "darkslategray": [180, 25, 25],
      "darkturquoise": [181, 100, 41],
      "darkviolet": [282, 100, 41],
      "deeppink": [328, 100, 54],
      "deepskyblue": [195, 100, 50],
      "dimgray": [0, 0, 41],
      "dodgerblue": [210, 100, 56],
      "firebrick": [0, 68, 42],
      "floralwhite": [40, 100, 97],
      "forestgreen": [120, 61, 34],
      "fuchsia": [300, 100, 50],
      "gainsboro": [0, 0, 86],
      "ghostwhite": [240, 100, 99],
      "gold": [51, 100, 50],
      "goldenrod": [43, 74, 49],
      "gray": [0, 0, 50],
      "green": [120, 100, 25],
      "greenyellow": [84, 100, 59],
      "honeydew": [120, 100, 97],
      "hotpink": [330, 100, 71],
      "indianred": [0, 53, 58],
      "indigo": [275, 100, 25],
      "ivory": [60, 100, 97],
      "khaki": [54, 77, 75],
      "lavender": [240, 67, 94],
      "lavenderblush": [340, 100, 97],
      "lawngreen": [90, 100, 50],
      "lemonchiffon": [54, 100, 90],
      "lightblue": [195, 53, 79],
      "lightcoral": [0, 79, 72],
      "lightcyan": [180, 100, 94],
      "lightgoldenrodyellow": [60, 80, 90],
      "lightgray": [0, 0, 83],
      "lightgreen": [120, 73, 75],
      "lightpink": [351, 100, 86],
      "lightsalmon": [17, 100, 74],
      "lightseagreen": [177, 70, 41],
      "lightskyblue": [203, 92, 75],
      "lightslategray": [210, 14, 53],
      "lightsteelblue": [214, 41, 78],
      "lightyellow": [60, 100, 94],
      "lime": [120, 100, 50],
      "limegreen": [120, 61, 50],
      "linen": [30, 67, 94],
      "magenta": [300, 100, 50],
      "maroon": [0, 100, 25],
      "mediumaquamarine": [160, 51, 60],
      "mediumblue": [240, 100, 40],
      "mediumorchid": [288, 59, 58],
      "mediumpurple": [260, 60, 65],
      "mediumseagreen": [147, 50, 47],
      "mediumslateblue": [249, 80, 67],
      "mediumspringgreen": [157, 100, 49],
      "mediumturquoise": [178, 60, 55],
      "mediumvioletred": [322, 81, 43],
      "midnightblue": [240, 64, 27],
      "mintcream": [150, 100, 98],            
      "mistyrose": [6, 100, 94],
      "moccasin": [38, 100, 85],
      "navajowhite": [36, 100, 84],
      "navy": [240, 100, 25],
      "oldlace": [39, 85, 95],
      "olive": [60, 100, 25],
      "olivedrab": [80, 60, 35],
      "orange": [39, 100, 50],
      "orangered": [16, 100, 50],
      "orchid": [302, 59, 65],
      "palegoldenrod": [55, 67, 80],
      "palegreen": [120, 93, 79],
      "paleturquoise": [180, 65, 81],
      "palevioletred": [340, 60, 65],
      "papayawhip": [37, 100, 92],
      "peachpuff": [28, 100, 86],
      "peru": [30, 59, 53],
      "pink": [350, 100, 88],
      "plum": [300, 47, 75],
      "powderblue": [187, 52, 80],
      "purple": [300, 100, 25],
      "rebeccapurple": [270, 50, 40],
      "red": [0, 100, 50],
      "rosybrown": [0, 25, 65],
      "royalblue": [225, 73, 57],
      "saddlebrown": [25, 276, 31],
      "salmon": [6, 93, 71],
      "sandybrown": [28, 87, 67],
      "seagreen": [146, 50, 36],
      "seashell": [25, 100, 97],
      "sienna": [19, 56, 40],
      "silver": [0, 0, 75],
      "skyblue": [197, 71, 73],
      "slateblue": [248, 53, 58],
      "slategray": [210, 13, 50],
      "snow": [0, 100, 99],
      "springgreen": [150, 100, 50],
      "steelblue": [207, 44, 49],
      "tan": [34, 44, 69],
      "teal": [180, 100, 25],
      "thistle": [300, 24, 80],
      "tomato": [9, 100, 64],
      "turquoise": [174, 72, 56],
      "violet": [300, 76, 72],
      "wheat": [39, 77, 83],
      "white": [0, 30, 100],
      "whitesmoke": [0, 0, 96],
      "yellow": [60, 100, 50],
      "yellowgreen": [80, 61, 50]      
  }
}
//END SHARED THEME HANDLER
    
}//END CLS

  //START SHARED GLOBAL SCOPE
  function IDGenerator() {

    this.length = 8;
    this.timestamp = +new Date;

    var _getRandomInt = function( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }

    this.generate = function() {
      var ts = this.timestamp.toString();
      var parts = ts.split( "" ).reverse();
      var id = "";

      for( var i = 0; i < this.length; i++ ) {
      var index = _getRandomInt( 0, parts.length - 1 );
      id += parts[index];
      }

      return id;
    }  
  }

  String.prototype.trimLeft = function(str_char) {
    if (str_char === undefined)
    str_char = "\s";  
  return this.replace(new RegExp("^" + str_char + "+"), "");
  };

  String.prototype.trimRight = function(str_char) {
    if (str_char === undefined)
    str_char = "\s";  
  return this.replace(new RegExp("" + str_char + "+$"), "");
  };
//END SHARED GLOBAL SCOPE



//END Shared.js


//START LevelObject.js
class LevelObject {
    constructor() {      
    }  
    fn_isObject(foo_val){
      if(typeof foo_val === 'object' && foo_val !== null){
        return true;
      }
      return false;
    }                  
    fn_flipBool(bln_bool){
      if(bln_bool){return false;}
      return true;
    }
    fn_debug(obj_debug=false, str_message=""){

      if(!obj_debug){
        obj_debug=this;
      }
      console.groupCollapsed("DEBUG OBJECT " + str_message);    
      console.log("obj_design.str_type: " + obj_debug.obj_design.str_type);
      console.log("str_name: " + obj_debug.obj_design.str_name);
      console.log("obj_design.str_tag: " + obj_debug.obj_design.str_tag);
      console.log("str_idXDesign: " + obj_debug.obj_design.str_idXDesign);
      console.groupEnd();
      //this.fn_enumerateObject(obj_debug, "LEVEL OBJECT DEBUG")
    }    
   fn_enumerateObject(obj_myObj, str_message="level enumerate"){            
    
      console.groupCollapsed("ENUMERATE OBJECT " + str_message);    
  
      for (let [key, foo_value] of Object.entries(obj_myObj)) {        
          console.log(`${key}: ${foo_value}`);        
          if (typeof foo_value === "object" && foo_value !== null) {            
              //fn_enumerateObject(foo_value, "");
          }
          else{
              //console.log(`${key}: ${foo_value}`);        
          }
      }    
      console.groupEnd();
  }  
  
}
//END CLASS
//END LevelObject.js


//START Holder.js
class Holder extends LevelObject{  
    constructor() {      
      super();            
      this.int_modeUnLocked=0;       
      this.int_modeReadOnly=1;       
      this.int_modeEdit=2;       
      this.int_modeBoot=3;       
      this.int_modeNew=4;             
      this.int_modeRuntime=10;             
      this.int_modeDelete=11;       
      this.int_modeLocked=100;       
      
      
      
      
      this.obj_design={
        arr_item:[]
      }

      this.obj_domStyle={};   
      this.obj_domProperty={};         
      this.obj_domAttribute={};               
    } 
    fn_getShortName(){            
      return this.obj_design.str_name.toLowerCase().replace(/\s/g, '');    
    }
}

class Constant extends LevelObject{  
  constructor() {      
    super();            
    
    this.int_alpha=10; 
    this.int_alphComma=20; 
    this.int_alphaNumeric=30; 
    this.int_alphaNumericComma=40;   
    this.int_trimCommas=41;   

    this.int_dateNow=10;   

    this.int_axisHorizontal=1;
    this.int_axisVertical=2;
  }   
}
//END Holder.js


//START BaseObject.js
class BaseObject extends LevelObject{
    constructor(obj_ini) {
        super(obj_ini); 
        
        this.fn_initialize(obj_ini);
        //1234
        
    }    
    fn_initialize(obj_ini){                           
        
        this.obj_ini=obj_ini;//required   
        if(!this.obj_holder){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_holder=new Holder;//required
        }     
        if(!this.obj_ini.obj_holder){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_ini.obj_holder=new Holder;//required
        }     
        //this.obj_holder.bln_loaded=false;
        
        //START INITIALIZE DESIGN        
        this.obj_design=obj_ini.obj_design;                
        if(!this.obj_design){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_design={};//required        
        }     
        if(this.obj_design.arr_item===undefined){
            this.obj_design.arr_item=[];
        }      
        if(this.obj_design.arr_item.length===0){
            //this.obj_design.arr_item=[];
        }           

        this.obj_holder.obj_themeStructure=new Object;
        
        //this.fn_setIsContainer(false);               

        if(this.obj_design.str_idXDesign===undefined){this.fn_setIDXDesign();}
        if(this.obj_design.str_idXDesign===""){this.fn_setIDXDesign();}
        if(this.obj_design.str_name==undefined){this.obj_design.str_name=undefined;}//ensure visible place holder at front of object defintion
        if(this.obj_design.str_nameRegistrator==undefined){this.obj_design.str_nameRegistrator="notset";}//ensure visible place holder at front of object defintion
        if(this.obj_design.str_nameShort==undefined){this.obj_design.str_nameShort="notset";}//ensure visible place holder at front of object defintion
        

        //*        
        if(this.obj_design.str_idProject==undefined){this.obj_design.str_idProject="notset";}        
        if(obj_project){
            if(obj_project.obj_design.bln_isContextHolder){this.obj_design.str_idProject="notset";}
            else if(this.obj_design.str_idProject==="notset" && this!==obj_project && !this.obj_design.bln_isContextHolder){
                this.obj_design.str_idProject=obj_project.obj_design.str_idXDesign;
            } 
            
            if(obj_project.obj_design.str_type==="xapp_theme"){this.obj_design.bln_isThemeItem=true;}
        }
        //*/
        
        if(this.obj_design.str_type===undefined){this.obj_design.str_type=undefined;}//ensure visible place holder at front of object defintion
        if(this.obj_design.str_themeType===undefined){
            if(this.obj_design.str_type==="tag"){
                this.obj_design.str_themeType=this.obj_design.str_tag;
            }
            else{
                this.obj_design.str_themeType=this.obj_design.str_type;
            }
        }        
        
        if(this.obj_design.str_tag===undefined){this.obj_design.str_tag=undefined;}//ensure visible place holder at front of object defintion                               
        
        
        if(this.obj_design.str_content===undefined){this.obj_design.str_content="";}                
        
        
        //if(this.obj_design.str_content==="<p><br></p>"){this.obj_design.str_content="";}
        
        this.obj_design.int_modeExecute=obj_ini.obj_design.int_modeExecute;         
        if(this.obj_design.int_modeExecute===undefined){this.obj_design.int_modeExecute=undefined;}  
             

        //Start Click E-vent
        this.obj_holder.bln_listenClick=obj_ini.obj_holder.bln_listenClick;
        if(this.obj_holder.bln_listenClick===undefined){this.obj_holder.bln_listenClick=undefined;}
        //End Click E-vent

        //Start Change E-vent
        this.obj_holder.bln_listenChange=obj_ini.obj_holder.bln_listenChange;
        if(this.obj_holder.bln_listenChange===undefined){this.obj_holder.bln_listenChange=undefined;}                       
        //End Change E-vent

        
        //Start E-vent Management
        //Optional: LinkId refers to the target component for theevent
        //often used for to link a component to a  xapp_dynamic_content control.
        this.obj_design.str_linkId=obj_ini.obj_design.str_linkId;
        if(this.obj_design.str_linkId===undefined){this.obj_design.str_linkId=undefined;}       
        //End E-vent Management        
        
        //this.obj_holder.str_nameFileServer="abc.php"; define here or in class definition to overide default path file name
        //END INITIALIZE DESIGN        
        
        //START INITIALIZE DOM PROPERTY
        this.obj_domProperty=obj_ini.obj_domProperty;                              
        if(!this.obj_domProperty){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_domProperty={};//required
        }     
        //END INITIALIZE DOM PROPERTY

        //START INITIALIZE DOM ATTRIBUTE
        this.obj_domAttribute=obj_ini.obj_domAttribute;   
        if(!this.obj_domAttribute){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_domAttribute={};//required
        }                                     
        //END INITIALIZE DOM ATTRIBUTE
        
        //START INITIALIZE STYLE        
        /*
        DONT set str_height, str_width, str_padding on base object         
        AVOID specified values here. Leave them undefined. Allow sub class to overidde undefined.
        //*/
        this.obj_domStyle=obj_ini.obj_domStyle;
        if(!this.obj_domStyle){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_domStyle={};//required            
        }     
        //END INITIALIZE STYLE        
        
        //No need to show if negative                 
        this.obj_design.bln_dynamicPin=obj_ini.obj_design.bln_dynamicPin;        
        if(this.fn_getDynamic()){
            this.fn_initializeDynamic();
        }   
        
        this.fn_holdEvent();                  
    }        

    fn_initializeDynamic(){}//overidden        

    fn_getIDXDesign(){
        
        return this.obj_design.str_idXDesign;
    }
    

    fn_setIDXDesign(str_idXDesign=false){
        
        if(!str_idXDesign){
            this.obj_design.str_idXDesign=obj_shared.fn_getUniqueId("myId");
        }
        
        this.fn_setDomProperty("Id", this.obj_design.str_idXDesign);
        
    }
    fn_debugProp(foo_val="", str_property){        
        console.log(this.fn_getDebugText(foo_val, str_property));
    }    
    fn_debugName(foo_val){        
        console.log(this.fn_getDebugText(foo_val, "str_name"));
    }    
    fn_debugType(foo_val){        
        console.log(this.fn_getDebugText(foo_val, "str_type"));
    }    
    fn_debugText(foo_val){        
        console.log(this.fn_getDebugText(foo_val, "str_text"));
    }    

    fn_getDebugText(foo_val="", str_property){        
        
        let str_label=this.obj_design[str_property];
        
        if(!str_label){            
            str_label=this.obj_design.str_name;
        }
        
        return (str_label + ": " + foo_val);
    }

    

    //START CONTAINER FUNCTION
    fn_addItem(obj_ini){        
        
        
        if(obj_ini==undefined){
            return;
        }        
        
        let obj_item=this.fn_createChildObject(obj_ini);

        if(this.fn_getDynamic()){         
            obj_item.obj_design.bln_dynamicPin=true;
        }

        
        this.fn_createChildDom(obj_item);
        //creae dom object into HTML
        
        //END CREATE DOM ELEMENT        
        obj_item.fn_execute();

        if(this.bln_debugContextItem){        
            //obj_item.fn_debug("xxxx");
        }
                    
        return obj_item;
    }

    fn_checkIni(obj_ini){

        let str_type, int_idRecord, bln_removeId, bln_addPaletterItemEvent, bln_startPosition;        

        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF

        int_idRecord=obj_ini.obj_design.int_idRecord;           
        str_type=obj_ini.obj_design.str_type;                                   
        bln_removeId=obj_ini.bln_removeId;
        bln_addPaletterItemEvent=obj_ini.bln_addPaletterItemEvent;
        bln_startPosition=obj_ini.obj_design.bln_startPosition;                                
        
        if(!obj_ini.obj_design.arr_item){ 
            //console.log("obj_ini.obj_design.arr_item is false");           
            obj_ini=new Holder;            
            obj_ini.obj_design.int_idRecord=int_idRecord;           
            obj_ini.obj_design.str_type=str_type;                                   
            obj_ini.bln_removeId=bln_removeId;            
            obj_ini.bln_addPaletterItemEvent=bln_addPaletterItemEvent;            
            obj_ini.obj_design.bln_startPosition=bln_startPosition;                        
        }        

        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF
        
        return obj_ini;
    }

    fn_createChildObject(obj_ini){

        let str_type, int_idRecord, obj_item, bln_removeId, bln_addPaletterItemEvent, bln_startPosition;         

        

        //*
        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF
        obj_ini=this.fn_checkIni(obj_ini);        
        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF
        
        int_idRecord=obj_ini.obj_design.int_idRecord;           
        str_type=obj_ini.obj_design.str_type;                        
        bln_removeId=obj_ini.bln_removeId;
        bln_addPaletterItemEvent=obj_ini.bln_addPaletterItemEvent;
        bln_startPosition=obj_ini.obj_design.bln_startPosition;                        

        //PLACE NUMBER 2 WHEN OBJ INI CAN GET KNOCKED OFF
        if(obj_ini){//see if we can get the correct ini object, partucuarly to ensure the type is correct.
            if(obj_ini.obj_design){
                int_idRecord=parseInt(obj_ini.obj_design.int_idRecord);        
                if(int_idRecord){
                    let ObjectData=obj_shared.fn_getMapItem(obj_InstanceJSONMap,  int_idRecord);//get a reference to the the object that has been published from the db                                            
                    if(ObjectData){
                        //console.log(ObjectData);
                        //console.log("get new ini from map object");                                   
                        var NewObjectData=JSON.parse(JSON.stringify(ObjectData));        
                        if(NewObjectData.obj_design){
                            obj_ini=NewObjectData;
                        }
                    }
                }
            }
        } 
        //*/

        //PLACE NUMBER 2 WHEN OBJ INI CAN GET KNOCKED OFF
        
        obj_ini.bln_removeId=bln_removeId;      
        obj_ini.bln_addPaletterItemEvent=bln_addPaletterItemEvent;  
        //obj_ini.obj_design.str_type=str_type;
        obj_ini.obj_design.bln_startPosition=bln_startPosition;          

        //console.log("str_type: " + str_type);
        if(str_type==="xapp_theme"){//hide any theme                                 
            if(obj_ini.obj_domStyle){                     
                obj_ini.obj_domStyle.display="none";            
            }
        }        
        
        try {                        
            obj_item = new (obj_ComponentMap.get(str_type))(obj_ini);            
            //obj_item = new (obj_ComponentMap.get(str_type))();            
        }        
        catch(err) {                           
            if(str_type!=="tag"){                
                console.log("SUBSTITUTING Tag: " + obj_ini.obj_design.str_type);                            
                console.log("str_type: " + str_type);            
                console.log({ name: err.name, message: err.message });
                console.log("Attempt to correct by resaving parent object.");                            
            }
            obj_item = new tag(obj_ini);  //consider implementing special tag and get from server with id                      
        }   
        
        //create the dom with the informaiton saved into parent component
        if(!obj_item){
            console.log("Error: Object Creation");
            return;
        }
        
        obj_item.fn_setParentComponent(this);                

        if(this.fn_getDynamic() || this.fn_hasDynamicParent()){                    
            if(obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){            
                obj_item.obj_design.int_modeExecute=obj_holder.int_modeReadOnly;                     
            } 
        } 
        
        if(obj_item.obj_design.int_modeExecute===undefined){      //baseobjects will get parents modeExecute            
            obj_item.obj_design.int_modeExecute=this.obj_design.int_modeExecute;                     
        }   
        
        

        return obj_item;
    }

    fn_createChildDom(obj_item){//not overiddn

        let str_type=obj_item.fn_getType();              
        //let str_tag=obj_item.fn_getTag();

        //Following options:            
        //START CREATE DOM ELEMENTyy
        //To Do
        //1. Creating Own Tag                 
        //2. Use Exisitng Tag and Allow/DisAllow manipulation of this e.g color, padding etc
        //*/
        let int_index, int_remove=0;        
        switch(str_type){  
            case "tablerow"://assumes table is adding                                
                //POSITION DOM ELEMENT                
                int_index=this.obj_design.arr_item.length;
                this.obj_design.arr_item.splice(int_index, int_remove, obj_item);                
                obj_item.dom_obj = this.dom_obj.insertRow();                                
            break;            
            case "tablecell"://assumes row is adding
                //POSITION DOM ELEMENT                
                int_index=this.obj_design.arr_item.length;
                this.obj_design.arr_item.splice(int_index, int_remove, obj_item);
                obj_item.dom_obj = this.dom_obj.insertCell();                
            break;                                    
            default:
                switch(str_type){//.nodeType
                    case "textnode":
                        obj_item.dom_obj = document.createTextNode(obj_item.obj_design.str_content);                        
                        break;
                    case "comment":
                    obj_item.dom_obj = document.createComment(obj_item.obj_design.str_content);                                                      
                        break;
                    default:
                        obj_item.dom_obj = document.createElement(obj_item.obj_design.str_tag);                                                      
                        break;
                }                                            
                //POSITION DOM ELEMENT                                
                this.fn_positionDomElement(obj_item);
                //We need to get the item dom into the page, as fn_create_self may be overriden        
        }
        
        obj_item.dom_objContent=obj_item.dom_obj;//potentially not necessary as this should be set in createSelf
        obj_item.bln_removeId=this.bln_removeId;                
        obj_item.bln_debug_removeId=this.bln_debug_removeId;        

        this.fn_setIDXDesign(this.fn_getIDXDesign());
    }

    fn_positionDomElement(obj_item){  
        //Part of  the Add Item Process
        //allows child item to be inserted at a position in the item array and the parent container
        
        let int_index, int_remove=0;        
        
        if(this.obj_holder.obj_insertNextTo){
            let obj_insertNextTo=this.obj_holder.obj_insertNextTo;
            int_index = this.fn_findItemIndex(obj_insertNextTo);
            obj_insertNextTo.dom_objContent.before(obj_item.dom_obj);
            this.obj_design.arr_item.splice(int_index, int_remove, obj_item);
            this.obj_holder.obj_insertNextTo=false;
            return;
        }

        let bln_endPosition=true;        
        let bln_startPosition=obj_item.obj_design.bln_startPosition;        

        if(obj_item.blnDebugPosition){
            console.log("obj_item.obj_design.bln_startPosition: " + obj_item.obj_design.bln_startPosition);
        }
        
        if(bln_startPosition){
            bln_endPosition=false;
        }        

        if(obj_item.obj_design.str_type==="xapp_theme"){
            bln_endPosition=false;
        }                
        
        if(bln_endPosition){//End
            int_index=this.obj_design.arr_item.length;
            this.dom_objContent.append(obj_item.dom_obj);                
        }
        else{//Start            
            int_index=0;
            this.dom_objContent.prepend(obj_item.dom_obj);
        }                

        this.obj_design.arr_item.splice(int_index, int_remove, obj_item);

        /* 
        //useful for future insert funciton ?
        if(obj_ini.obj_ItemTemplate){//to do with the mask maybe
        int_index_object = this.fn_findItemIndex(obj_ini.obj_ItemTemplate);
        if(bln_startPosition){//After
        int_index=int_index_object+1;
        obj_ini.obj_ItemTemplate.fn_positionAfter(obj_item);
        }
        else{//Before
        int_index=int_index_object;
        obj_ini.obj_ItemTemplate.dom_objContent.before(obj_item.dom_obj);
        }
        this.obj_design.arr_item.splice(int_index, int_remove, obj_item);
        }
        //*/
    }
    //END CONTAINER FUNCTION
    
    
    //START CHILD FUNCTION
    fn_isElement(){return this.dom_obj.nodeType===1;}
    
    fn_execute(){//overidden by component object - but not called by component object
     // should always be overidden so not necxessay to have any funciton here
    }  

    fn_createSelf(){//can be overidden, but should be called 
        

        //dom object must be in place by now        

        if(!this.fn_isElement()){return;}        

        this.dom_objContent=this.dom_obj;//can be overidden to be another than own dom obj
        this.dom_objContentContainer=this.dom_objContent;

        //let str_designMarker=obj_project.obj_holder.str_prefix;//needs to go into design object        
        //this.dom_obj.setAttribute("str_designMarker + "id"", this.obj_design.str_idXDesign);                            
        //this.dom_obj.setAttribute("idXDesign", this.obj_design.str_idXDesign);                    
        
        this.fn_setEventAttributes();        
        
        if(this.obj_design.str_linkId!==undefined){
            this.dom_obj.setAttribute("linkId", this.obj_design.str_linkId);                      
        }
        
        
        this.fn_setHTMLContent();
        

        //BY THIS POINT THE ITEM WILL HAVE AN ELEMENT, INSERTED IN THE DOM                
        this.fn_onLocateInDom();
        
    }
    fn_onLocateInDom(){//overidden to do nothing in project instance          
        //this is essential to fire on any published object.
        //called at end of create self
        //console.log(this.obj_design.str_type);        
        
        
        this.fn_addEventListener();
    }  
    
    fn_beforeAddChildren(){        
    }

    fn_onOpenInstance(){//not overidden by component
        
        //quesiton: should we validate with project before or after loading children
        //currently it is before

        this.fn_beforeAddChildren();
        
        if(this.obj_design.arr_item.length===0 ){            
            //for component, if no server trip, (due to recordid=0), length will be zero. Otherwise , the server trip will have completed, arr_item will be full
            //other objects can have default add children methods
            //therefoere we avoid the need to overide this for component using intiIdRecord=0            
            this.fn_bootChildren();                        
        }
        else{
          this.fn_loadChildren();//if obj_design.arr_item is in place, eg from JSON seriolization
        } 
        
        
        //OCCURS AFTER LOAD CHILDREN
        this.fn_onLoad();//validate //pulgins //etc after loading children

        
    }

    fn_loadChildren(){

        let obj_ini, obj_item;
        let arr_ini;
        arr_ini=this.obj_design.arr_item.slice();//creat ea temporary copy of obj_design.arr_item which will contain "ini objects"
        this.obj_design.arr_item=[];//reset this arr item to empty array .

        arr_ini.forEach(obj_ini => {            
            if(obj_ini){
                //obj_shared.fn_enumerateObject(obj_ini.obj_design, "BaseObject fn_loadChildren");                                                                
                obj_item=this.fn_addItem(obj_ini);//ServerSideItem or BootItem
            }
            else{                                
                if (obj_ini === null){
                    console.log("BaseObject fn_loadChildren OBJ INI IS NULL");                                                
                    
                }                
            }
         });

         
        /*
        let arr_item=this.obj_design.arr_item;
        if(arr_item.length){
            this.obj_holder.obj_lastItem=this.obj_design.arr_item[0];
        }
        //*/
    } 

    fn_expandMultiple(int_number){
        if(this.obj_design.bln_expand){                                
            let str_fontSize;            
            str_fontSize="1.2rem";                   
            let int_padding=10;
            let int_paddingExpand=(int_padding*int_number);                                          
            this.fn_setStyleProperty("padding", +int_paddingExpand+"px");        
            this.fn_setStyleProperty("font-weight", "bold");        
            this.fn_setStyleProperty("font-size", str_fontSize);        
            
          }
      }
    
    
      fn_expand(){        
      }
    
    fn_onLoad(){//can be overriden , but should be called                      

        
        this.fn_applyFeatures();//apply style, them, domproperties etc // this appears to not ref to children        
        this.fn_initializePlugins();//attach design helpers etc                
        this.fn_actionRegister();//attach design helpers etc                                
        
        /*//
        //disabling this function for the moment - as not in use
        //this is the end of the object creation process
        //this.obj_holder.bln_loaded=true; 
        let arr, obj_item
        arr=this.obj_design.arr_item;                        
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];                        
            obj_item.fn_onLoadParent();            
        } 
        //*/    
        
        /*
        //add this.obj_domProperty.type==="submit" if start using input submit        
        if(this.obj_design.str_tag==="input" && this.obj_domProperty.type==="submit"){//applies to submt buttons            
            this.fn_setText(this.obj_design.str_value);            
        }                
        //*/
        

        
        if(this.obj_design.str_tag==="button"){//applies to submt buttons            
            this.fn_setText(this.obj_design.str_text);            
        }                
    }   
    fn_initializePlugins(){//can be overidden                
        
        
        let dom_frameElement=window.frameElement;        
        if(!dom_frameElement){return;}
        let str_name=dom_frameElement.getAttribute("name");                
        if(str_name==="xdesign-frame"){//ie a project that is being designed}        
            if(this.obj_design.int_modeExecute<10){
                this.fn_initializePluginDesign();//can be overidden                
                this.obj_designDelegate.fn_setup();//must be 2 separatre functions                                
                //console.log("this.obj_designDelegate: " + this.obj_designDelegate);
            }
        }
    }    
    fn_initializePluginDesign(){//overidden by ProjectInstance and GridItem                        
        this.obj_designDelegate=new DesignDelegate(this);                
    }
    fn_onLoadParent(){}//should be overidden        
    
    fn_actionRegister(){
        
        let obj_item, obj_container, obj_projectLocal;
        
        if(this.obj_design.bln_registerAtContainer===true){
            obj_container=this.obj_holder.obj_container;        
            if(obj_container){                        
                obj_container.fn_registerContainedObject(this);                        
            }
        }        
        if(this.obj_design.str_nameRegistrator!=="notset"){                  
            obj_item=obj_project.fn_findItemByVariableName(this.obj_design.str_nameRegistrator);             
            if(obj_item){                                                
                obj_item.fn_registerObject(this);                        
            }
        }           
        if(this.obj_design.bln_registerAtProject===true &&(this!==obj_project)){              
            /*
            obj_projectLocal=false;  
            let str_idProject=this.obj_design.str_idProject;
            let str_idXDesign=this.obj_design.str_idXDesign;
            if(str_idProject && (str_idProject!==str_idXDesign)){
                obj_projectLocal=obj_project.fn_findItemById(str_idProject);
            }           
            //*/
            obj_projectLocal=obj_project;
            if(obj_projectLocal){                                     
                obj_projectLocal.fn_registerProjectObject(this);                                                    
            }
            
        }
    }
    
    fn_debugDesign(obj_design, str_title=""){                
        
        console.groupCollapsed(str_title);        
        console.log("int_idRecord: " + obj_design.int_idRecord);                
        console.log("str_idXDesign: " + obj_design.str_idXDesign);
        console.log("int_modeExecute: " + obj_design.int_modeExecute);                              
        console.log("bln_isLocalHome: " + obj_design.bln_isLocalHome);                              
        console.log("str_name: " + obj_design.str_name);        
        console.log("str_type: " + obj_design.str_type);        
        console.log("str_tag: " + obj_design.str_tag);        
        console.log("int_axis: " + obj_design.int_axis);        
        console.log("str_classList: " + obj_design.str_classList);        
        console.log("str_themeType: " + obj_design.str_themeType);        
        console.groupEnd();
    }

    fn_debugDom(dom_obj, str_title=""){                
        
        if(!dom_obj){
            console.log("dom_obj is not yet in place");                    
            return;
        }
        console.groupCollapsed(str_title);                
        console.log("outerHTML: " + dom_obj.outerHTML);                
        console.log("innerHTML: " + dom_obj.innerHTML);                
        console.groupEnd();
    }    

    fn_debugTypeItems(){
        let arr, obj_item
        arr=this.obj_design.arr_item;        
        this.fn_debug("DEBUG: " + this.obj_design.str_type);
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];
            obj_item.fn_debugItems();            
        }        
    }    

    fn_debug(str_title=""){                
        
        if(str_title===undefined){str_title=this.obj_design.str_name;}
        let str_name=this.obj_design.str_name;
        if(str_name===undefined){str_name="";}        
        if(str_name){str_title+=": " + str_name;}
        console.groupCollapsed(str_title);        
        console.log("typeof: " + typeof this);
        console.log("constructor: " + this.constructor.name);
        console.log("obj_designDelegate: " + this.obj_designDelegate);                
        this.fn_debugDesign(this.obj_design, "Design");              
        this.fn_debugDom(this.dom_obj, "Dom");   


        let arr, obj_item
        arr=this.obj_design.arr_item;        
        //this.fn_debug("DEBUG: " + this.obj_design.str_type);
        console.log("begin debug arr_item");                
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];
            if(obj_item.fn_debug){
                obj_item.fn_debug("base debug");            
            }
        }        
        console.groupEnd();
    }
    
    fn_debugAlert(){
        let s="";
        s+="typeof: " + typeof this + "\r";
        s+="str_idXDesign: " + this.obj_design.str_idXDesign + "\r";
        s+="str_type: " + this.obj_design.str_type + "\r";
        alert(s);
    }   
    
    fn_setDebugOperation(bln_value){
        this.obj_holder.bln_debugOperation=bln_value;        
    }           
    fn_getDebugOperation(bln_value){
        return this.obj_holder.bln_debugOperation;
    }           
    

    fn_compileDependentClassList(){
        let str_val="";        
        str_val+=this.fn_listDependentClass();//Get List of Compone Ids
        str_val=str_val.slice(0,-1);                 
        return str_val;
    }
    fn_listDependentClass(){        
        let str_val="";
        let arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];
            if(obj_item.bln_isComponent){
                str_val+=obj_item.fn_listClass();                
            }
            str_val+=obj_item.fn_listDependentClass();
        }                
        return str_val;
    }

    fn_listClass(){

        let str_val, str_classList, str_delim;
        str_val="";
        str_delim=",";                
        str_classList=this.obj_design.str_classList;        
        if(str_classList && str_classList!=="notset"){                
            str_val=str_classList.trim() + str_delim;        
        }
        return str_val;
    }
    
    fn_compileDependentId(){
        let str_val="";        
        str_val+=this.fn_listDependentId();//Get List of Compone Ids
        str_val=str_val.slice(0,-1);         
        return str_val;
    }

    fn_listDependentId(){        
        let str_val="";
        let arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];
            if(obj_item.bln_isComponent){
                str_val+=obj_item.fn_listId();                
            }
            //str_val+=obj_item.fn_listDependentId();
            //dont list child dependents as this may change by external edit of child components
            //we need to rely on a server side aclomergeration
        }                
        return str_val;
    }

    fn_listId(){

        let str_val, int_idRecord, str_delim;
        str_val="";
        str_delim=",";                
        int_idRecord=this.obj_design.int_idRecord;
        if(int_idRecord){                
            str_val=int_idRecord + str_delim;
            //this.fn_debug("Dependentid");
        }
        return str_val;
    }


    fn_validIdHistory(){

        let int_id_record=this.obj_design.int_idRecord;
        if(!int_id_record){return true;}
        let obj_container=this.fn_getParentComponent();
        if(!obj_container){return true;}
        let bln_exist=this.fn_searchIdHistory(obj_container, int_id_record);
        if(bln_exist){return false;}
        return true;
    }

    fn_searchIdHistory(obj_item, str_listIdRecordSearch){

        let bln_debug=false;      
        
        
        let int_idRecord=obj_item.obj_design.int_idRecord;
        
            
        str_listIdRecordSearch+="";
        int_idRecord+="";

        let str_testA="," + int_idRecord + ",";
        let str_testB="," + str_listIdRecordSearch + ",";        
        let bln_val=obj_shared.fn_inStr(str_testA, str_testB);        

        if(bln_debug){            
            console.log("str_listIdRecordSearch: " + str_listIdRecordSearch);
            console.log("int_idRecord: " + int_idRecord);
        }
        
        if(bln_val){            
            return true;
        }
        let obj_parent=obj_item.fn_getParentComponent();
        if(!obj_parent){return false;}

        return this.fn_searchIdHistory(obj_parent, str_listIdRecordSearch);        
    }

    
    fn_getContainer(){

        //duplicate of getParentComponent
        let obj_container=this.obj_holder.obj_container;
        if(obj_container && obj_container.bln_isComponent){
            return obj_container;
        }
        return false;
    }

    fn_setParentComponent(obj_parent){        
        this.obj_holder.obj_container=obj_parent;         
        this.fn_setDebugPin(obj_parent.fn_getDebugPin());        
    }   

    fn_getParentComponent(){

        let obj_parent=this.obj_holder.obj_container;
        if(obj_parent && obj_parent.bln_isComponent){
            return obj_parent;
        }
        return false;

    }
    
    fn_getDeepCopy(obj_template){
        return JSON.parse(JSON.stringify(obj_template));//deep copy            
      }
    
    
    fn_popItem(){
        if(!this.dom_objContent.lastChild){
            return;
        }
        this.dom_objContent.removeChild(this.dom_obj.lastChild);
    }
    fn_positionAfter(obj_item){
        this.dom_objContent.after(obj_item.dom_obj);
    }    
    
    fn_removeChildren(){
        this.fn_removeAllItems();        
    }

    fn_bootChildren(){//in boot phase , and often overidden        
    }    

    fn_removeAllContent(){        
        this.obj_design.str_content="";
        this.dom_objContent.innerHTML="";
        this.dom_objContent.data="";        
        this.dom_objContentContainer.innerHTML="";
        this.obj_design.arr_item=[];        
    }  
    
    fn_removeAllItems(){//use this fuinction to completely clear the children of a container

        let arr, obj_item                
        arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            if(!obj_item){
                //alert("!obj_item");
            }
            else{
                this.fn_removeItem(obj_item);
            }
        }
        this.fn_removeAllContent();//issue here ? as this will set arr to new array
    }     
    fn_removeId(){        
        this.obj_design.int_idRecord=0;                         
        this.fn_setIDXDesign();
        this.fn_removeIdChildren();
    }
    fn_removeIdChildren(){        

        let obj_item, arr;
        
        arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            obj_item.fn_removeId();
        }
    }

    
    
    fn_removeItem(obj_item){

        if(!obj_item){return;}

        obj_item.fn_removeAllItems();
        
        let arr, int_index;
        arr=this.obj_design.arr_item;
        int_index=0;
        if(arr.length){
            int_index=this.obj_design.arr_item.indexOf(obj_item);            
            if (int_index!==(-1)) {                
                arr.splice(int_index, 1);                        
            }
            else{
                alert("error: remove item");//should never see
            }
        }
        obj_item.fn_onRemove();        
        return int_index;
    }   

    fn_onRemove(){
        this.dom_obj.remove();        
    }    

    
    
    fn_getIsContainer(bln_val){
        //equivalent of can have chlidren        
        return this.obj_design.bln_isContainer;
    }    
    
    fn_setIsContainer(bln_val){
        //equivalent of can have chlidren        
        this.obj_design.bln_isContainer=bln_val;                
    }    
    fn_copyArray(arr_source){
        return arr_source.slice();
    }   
    
    fn_getLastItem(){        

        let obj_target=this.obj_holder.obj_lastItem;
        let arr_item=this.obj_design.arr_item;        
        if(!arr_item.length){return false;}        
        if(!obj_target){
            obj_target=arr_item[0];
        }
        return obj_target;
    }     
    fn_getEndItem(){
        
        let arr, obj_item;
        arr=this.obj_design.arr_item;        
        obj_item=this;
        if(arr.length){
            obj_item=arr[arr.length-1];                        
            //obj_item=obj_item.fn_getEndItem();
        }
        return obj_item;
    }

    fn_getStartItem(){
        
        let arr, obj_item;
        arr=this.obj_design.arr_item;        
        obj_item=this;
        if(arr.length){
            obj_item=arr[0];                                    
        }
        return obj_item;
    }

    fn_getLimitLeft(){            
        
        let obj_container, int_index;
        obj_container=this.obj_holder.obj_container;
        if(!obj_container){return true;};
        int_index=obj_container.fn_findItemIndex(this);
        if(int_index<=0){return true;}            
        return false;
      }
      fn_getLimitRight(){                                
        let obj_container, int_index;
        obj_container=this.obj_holder.obj_container;
        if(!obj_container){return true;};
        int_index=obj_container.fn_findItemIndex(this);
        if(int_index===obj_container.obj_design.arr_item.length-1){return true;}
        return false;
      }      
      fn_getLimitTop(){                        
        let obj_container=this.obj_holder.obj_container;        
        if(!this.obj_holder.obj_container){return true;}      
        if(this===obj_project){return true;}                        
        return false;
      }
      fn_getLimitBottom(){                
        let arr=this.obj_design.arr_item;       
        let bln_has_grandChildren;
        if(!arr.length){return true;}        
        return false;
      }
      fn_getLimitGrandChild(){
        let bln_has_grandChild=this.fn_hasGrandChild();
        if(!bln_has_grandChild){return true;}        
        return false;
      }
      fn_hasGrandChild(){        
        let arr, int_val, obj_item;        
        arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            obj_item=arr[i];
            int_val=obj_item.obj_design.arr_item.length;
            if(int_val>0){return true;}
        }
        return false;
    }
    fn_setLevelLimit(){        
        
        let obj_levelLimit=new Object;              
        obj_levelLimit.obj_item=this;        
        obj_levelLimit.bln_limitTop=this.fn_getLimitTop();      
        obj_levelLimit.bln_limitLeft=this.fn_getLimitLeft();      
        obj_levelLimit.bln_limitRight=this.fn_getLimitRight();      
        obj_levelLimit.bln_limitBottom=this.fn_getLimitBottom();     
        obj_levelLimit.bln_limitGrandChild=this.fn_getLimitGrandChild();     
        obj_levelLimit.bln_hasAllLimit=false;
        if(obj_levelLimit.bln_limitTop && obj_levelLimit.bln_limitLeft && obj_levelLimit.bln_limitRight && obj_levelLimit.bln_limitBottom){
            obj_levelLimit.bln_hasAllLimit=true;            
        }
        this.obj_holder.obj_levelLimit=obj_levelLimit;        
    }

    fn_findItemByIdRecord(int_idRecord){        
        var obj_match, obj_item;
        if(this.obj_design.int_idRecord===int_idRecord){
            return this;
        }
        for(var i=0;i<this.obj_design.arr_item.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            obj_match=obj_item.fn_findItemByIdRecord(int_idRecord);
            if(obj_match){
                break;
            }
        }
        if(obj_match){return obj_match;}
        return false;
    }

    fn_isDuplicateObject(obj_a, obj_b){
        let bln_value=true;
        if(obj_a==obj_b){bln_value=false;}
        return bln_value;
    }
    
    fn_findItemById(str_idXDesign){        
        var obj_match, obj_item;
        if(this.obj_design.str_idXDesign===str_idXDesign){
            return this;
        }
        for(var i=0;i<this.obj_design.arr_item.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            obj_match=obj_item.fn_findItemById(str_idXDesign);
            if(obj_match){
                break;
            }
        }
        if(obj_match){return obj_match;}
        return false;
    }

    
    
    fn_getChildItem(str_nameShort){return this.fn_findItemByVariableName(str_nameShort);}
    
    fn_findItemByVariableName(str_nameShort, obj_exclude=false){        
        var obj_match, obj_item;
        
        if(this.obj_design.str_nameShort===str_nameShort){   
            if(obj_exclude && obj_exclude===this){

            }
            else return this;            
        }
        for(var i=0;i<this.obj_design.arr_item.length;i++){
            obj_item=this.obj_design.arr_item[i];                         
            obj_match=obj_item.fn_findItemByVariableName(str_nameShort, obj_exclude);
            if(obj_match){break;}
        }
        if(obj_match){return obj_match;}
        return false;
    }
    fn_findItemIndex(obj_item){
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            if(arr[i]===obj_item){
                return i;
            }
        }
        return -1;
    }    
    
    fn_applyFeatures(){

        //if(this.obj_design.bln_debugDesign){        
            //this.fn_debugText("fn_applyFeatures");
        //}

        //N.B Theme MUST be set to register with Project to run here        
        let obj_contextHolderParent=this.fn_hasContextHolderParent();                
        /*
        if(this.obj_design.bln_debug){                        
            if(obj_contextHolderParent){
                obj_contextHolderParent.fn_debug();
            }
        }
        //*/

        

        if(!obj_project.fn_isContextHolder() && obj_contextHolderParent){        
            //console.log("fn_hasContextHolderParent");            
            return;
        }
        
        
        this.fn_applyTheme();        
        if(!obj_project.fn_isTheme()){                        
            this.fn_applyThemeStructure();                    
        }        
        this.fn_applyDesign();                                                                         
        this.fn_applyDomProperty();                                                                         
        //this.fn_applyDomAttribute();
        this.fn_applyStyle();               
        this.fn_expand();
        this.fn_onApplyFeatures();
    }

    fn_holdEvent(){}//overidden
    fn_dropEvent(){}//overidden    
    
    fn_applyThemeStructure(){}//overidden
    fn_onApplyFeatures(){}//overidden
    fn_applyDesign(){}//overidden
    

    fn_applyThemeError(str_colorBackground, str_colorBorder="white"){                       

        if(!this.obj_holder.bln_logStyleOnce){
            this.fn_logStyleOutline();                                
        }        
        
        this.fn_setStyleOutline(str_colorBackground, str_colorBorder);                            
    }    
    fn_applyThemeEdit(str_colorBackground, str_colorBorder="white"){                        
        
        this.fn_setStyleOutline(str_colorBackground, str_colorBorder);                    
    }
    fn_removeStyleOutline(){           
                
        this.fn_setStyleProperty("backgroundColor", this.obj_holder.str_backgroundColor);                      
        this.fn_setStyleProperty("borderColor", this.obj_holder.str_borderColor);                      
        this.fn_setStyleProperty("borderWidth", this.obj_holder.str_borderWidth);                      
    }
    fn_logStyleOutline(){   
        this.obj_holder.bln_logStyleOnce=true;                 
        this.obj_holder.str_backgroundColor=this.fn_getComputedStyleProperty("backgroundColor");                          
        this.obj_holder.str_borderColor=this.fn_getComputedStyleProperty("borderColor");                          
        this.obj_holder.str_borderWidth=this.fn_getComputedStyleProperty("borderWidth");                          
    }    
    fn_setStyleOutline(str_colorBackground, str_colorBorder){        
        
        this.fn_setStyleProperty("backgroundColor", str_colorBackground);        
        this.fn_setStyleProperty("borderColor", str_colorBorder);                      
    }    

    

    fn_getThemeObject(str_themeType){   

        return this.fn_applyTheme(str_themeType, true);

    }

    
    
    fn_applyTheme(str_themeType=false, bln_returnThemeItem=false){   
        
        //N.B Theme MUST be set to register with Project to run here
        const bln_debug=this.bln_debugButtonSettings;        
        const obj_theme=obj_project.obj_theme;                
        if(!obj_theme){
            if (bln_debug){console.log("PROJECT THEME IS FALSE" + this.obj_design.str_name);}
            return;
        }
        
        if(obj_project.fn_isTheme()){return;}//dont theme a theme project        

        if(this.obj_design.bln_isThemeItem){return;}//dont theme a theme item            

        const str_type=this.obj_design.str_type.toLowerCase();                
        if(str_type==="xapp_theme"){return;}//dont theme a theme               

        let str_name, obj_themeItem;
        
        
        //*//turn on to debug    
        /*
        if(this.obj_design.str_themeType==="menu_button"){    
            bln_debug=true;        
        }       
        if(this.obj_design.str_name==="form_input_lxogin_emxail"){    
            bln_debug=true;        
        } 
        //*/

        /*
        if(this===obj_project){    
            bln_debug=true;        
        } 
        //*/

        /*
        if(this.obj_design.str_themeType==="menu_button"){    
            bln_debug=true;        
        }       
        //*/
    

        if(this.obj_design.bln_debugDesign){    
            bln_debug=true;        
            console.log("fn_applyTheme");
        }    
        //*/

        /*//turn on to debug
        if(this.obj_design.str_name="xdebug"){
            bln_debug=true;
        }
        //*/
    
        
    
    
    
        str_name=this.obj_design.str_name;    
        if(!str_themeType){
            str_themeType=this.obj_design.str_themeType;        
            if(!str_themeType){str_themeType="notset"};  
        }
  
        if (bln_debug){console.log("START APPLY THEME: [" + str_name + "][" + str_themeType + "]");}    
    
    
        //Match App Item str_themeType to Theme Object str_type                                 
        if(!obj_themeItem && str_themeType!=="notset"){ 
            obj_themeItem=obj_theme.fn_getThemeViaThemeType(str_themeType, bln_debug);                              
            if(obj_themeItem){                
                if (bln_debug){console.log("FOUND THEME ITEM VIA THEMETYPE: [" + str_name + "][" + str_themeType + "]");}

                if(bln_returnThemeItem){                
                    return obj_themeItem;                
                }
            }
        }        

        if(bln_returnThemeItem){
            return false;
        }
    
        //If there is now a Theme Object Item, then clone style to App Item
        let str_success="NO THEME APPLIED";
        if(obj_themeItem){                        
            let str_display=this.obj_domStyle.display;
            this.obj_domStyle=obj_shared.fn_shallowCopy(obj_themeItem.obj_domStyle);        
            let obj_parent=this.fn_getParentComponent();
            if(obj_parent && obj_parent.bln_debg123){
                obj_themeItem.fn_debug();
                this.obj_domStyle.background==="transparent";
            }            
            this.obj_domStyle.display=str_display;    
            //note: this display needs to be block flex etc for background to be applied                
            str_success="THEME APPLIED";        
            if(bln_debug){
                obj_themeItem.fn_debug("theme item");
                this.fn_debug("apply theme item");
            }
        }
        if (bln_debug){console.log("END APPLY THEME: [" + str_name + "][" + str_success + "]");}

        
  }
  
  fn_getThemeViaThemeType(str_themeType, bln_debug){          
    
    var obj_match, obj_item;    

    if(bln_debug){
        if (this.obj_design.str_themeType){
            //console.log("THEME: [" + this.obj_design.str_name + "][" + this.obj_design.str_themeType + "]");
            console.log("THEME: [" + this.obj_design.str_themeType + "]");
            //console.log("ITEM: [" + str_themeType + "]");                        
        }
    }
    
    if(this.obj_design.str_themeType.toLowerCase()===str_themeType.toLowerCase()){               
        if(bln_debug){
            console.log("SUCCESSFUL MATCH: [" + str_themeType + "]");            
        }
        obj_match=this;    
    }
    else{
        if(bln_debug){
            //console.log("NO MATCH THEMETYPE: [" + this.obj_design.str_themeType + "]");            
        }
    }

    if(obj_match){return obj_match;}
    
    for(var i=0;i<this.obj_design.arr_item.length;i++){
        obj_item=this.obj_design.arr_item[i];                         
        obj_match=obj_item.fn_getThemeViaThemeType(str_themeType, bln_debug);
        if(obj_match){break;}
    }
    if(obj_match){return obj_match;}
    return false;
  } 

  fn_scrollIntoView(){
    this.dom_obj.scrollIntoView();
  }

  fn_scrollTop(int_scrollTop=0){    
    this.dom_obj.scrollTop=int_scrollTop;
  }

  fn_setFocus(){

    this.dom_obj.focus();

  }  

    fn_applyStyle(obj_style){        
        if(!obj_style){
            obj_style=this.obj_domStyle;
        }        
        let arr_Property=Object.entries(obj_style);      
        for (let [str_key, foo_val] of arr_Property) {    
            //make sure camelCase is converted to hyphen prior to this function            
            //console.log(this.obj_design.str_name + ": " + str_key + ": " + foo_val);            
          this.fn_setStyleProperty(str_key, foo_val);          
        }
    }       

    fn_getNumericComputedStyleProperty(str_property){
        let str_value=this.fn_getComputedStyleProperty(str_property);
        return Number(this.fn_getNumericStyle(str_value));
      }
      
      fn_getNumericStyle(str){
        return str.replace("px", "");
      }

    fn_setClassName(str_className){                   
    this.dom_obj.className=str_className;
    }

    fn_setControlStyleProperty(obj_control, str_name, str_value){
        if(obj_control){obj_control.fn_setStyleProperty(str_name, str_value);}            
      }
      fn_getControlStyleProperty(obj_control, str_name, str_value){
        if(obj_control){ return obj_control.fn_getStyleProperty(str_name, str_value);}            
      }
      fn_getControlComputedStyleProperty(obj_control, str_name, str_value){
        if(obj_control){ return obj_control.fn_getComputedStyleProperty(str_name, str_value);}            
      }
      

    fn_getComputedStyleProperty(str_name){                

        const cssObj = window.getComputedStyle(this.dom_obj, null);          
        str_name=obj_shared.fn_camelCaseToHyphen(str_name);// check camel case to hyphen
        return cssObj[str_name];
    }

    fn_getStyleProperty(str_name){                
        str_name=obj_shared.fn_camelCaseToHyphen(str_name);// check camel case to hyphen
        //return this.obj_domStyle[str_name];
        return this.dom_obj.style[str_name];
    }

    fn_removeStyleAttribute(str_name){        
        if(this.dom_obj){
            this.dom_obj.style.removeProperty(str_name);
        }
        delete this.obj_domStyle[str_name];
    }

    fn_removeStyleProperty(str_name){

        if(this.dom_obj){this.dom_obj.style.removeProperty(str_name);}        
    }

    fn_setStyleProperty(str_name, str_value, str_priority){

        delete this.obj_domStyle[str_name];//remove the item from virtualdom (e.g. camelCased property name)
        
        /*
        if(!str_value){//allow undefined for most style attributes                                      
            this.fn_removeStyleAttribute(str_name);            
            return;
        } 
        //*/     
        
        str_name=obj_shared.fn_camelCaseToHyphen(str_name);// check camel case to hyphen
        
        switch(this.fn_getType()){
            case "eazygrid":
                if(str_name==="background-color"){
                    this.fn_setItemStyleProperty("eazygrid", "background-color", str_value);        
                }
            break;            
        }        

        this.obj_domStyle[str_name]=str_value;                
        if(this.dom_obj){this.dom_obj.style.setProperty(str_name, str_value, str_priority);}
    }        
    
    fn_applyDomProperty(){                     
        let arr_Property=Object.entries(this.obj_domProperty);      
        for (let [str_key, foo_val] of arr_Property) {              
            switch(str_key){                
                case "innerText":
                case "innerHTML":                                    
                    if(this.obj_design.arr_item.length){
                        continue;
                    }                    
                    break;
                default:
                    break;
            }
            this.fn_setDomProperty(str_key, foo_val);            
        }        
    }
    
    fn_getDomProperty(str_name){           
        return this.obj_domProperty[str_name];        
    }

    fn_removeDomProperty(str_name){        
        if(this.dom_obj){            
            this.dom_obj.removeAttribute(str_name);               
            this.dom_obj[str_name]=undefined;                                      
        }
        delete this.obj_domProperty[str_name];
        //delete this.obj_domAttribute[str_name];
    }

    fn_setDomProperty(str_name, foo_value){                          

        let bln_value;

        if(!this.obj_domProperty){
            return;
         }  
         

        //VIRTUAL DOM
        delete this.obj_domProperty[str_name];//remove the item from virtualdom         
        this.obj_domProperty[str_name]=foo_value;                
        //VIRTUAL DOM               
        
        
        switch(str_name.toLowerCase()){
          case "disabled":
            bln_value=obj_shared.fn_parseBool(foo_value);                        
            this.fn_beforeDomPropertyDisabled(bln_value);
            //DOM
            if(this.dom_obj){                                   
                if(bln_value){
                    this.dom_obj.setAttribute(str_name, bln_value);
                    this.dom_obj[str_name]=bln_value;                                        
                }
                else{                    
                    this.dom_obj.removeAttribute("disabled");
                }                
                this.dom_obj.disabled=bln_value;                
            }                  
            //DOM                        
            this.fn_afterDomPropertyDisabled(bln_value);
            break;
          default:            

            /*
            if(!foo_value){//allow undefined for most style attributes                                                  
                this.fn_removeDomProperty(str_name);            
                return;
            } 
            //*/     

            //DOM
            if(this.dom_obj){
                this.dom_obj.setAttribute(str_name, foo_value);
                this.dom_obj[str_name]=foo_value;//this is required for html button innerText to work                              
            }                  
            //DOM            
        }
    }    
    
    
    fn_enableAllFlex(){            
        this.fn_setDisplayFlex(true);        
        if(this.obj_holder.bln_debugNavigate){
            this.fn_debugText("xxx fn_enableAllFlex");
        }
        this.fn_setDisabled(false);
    }      

    fn_enableAll(){               
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_enableAll");
        }
        this.fn_setDisplay(true);        
        this.fn_setDisabled(false);        
    }      
    fn_disableAll(){                  
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_disableAll");
        }
        this.fn_setDisplay(false);        
        this.fn_setDisabled(true);        
    }      

    fn_setEnabled(bln_value=true, bln_enableChildren=false){          
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_setEnabled: " + bln_value);
        }
        if(!bln_value){            
            this.fn_setDisabled(true);
            return;
        }        

        if(bln_enableChildren){
            let arr_item=this.obj_design.arr_item;        
            for(let i=0;i<arr_item.length;i++){                    
                let obj_item=arr_item[i];                    
                obj_item.fn_setEnabled(bln_value, bln_enableChildren);
            }
        }
        
        bln_value=obj_shared.fn_flipBool(bln_value);
        this.fn_setDomProperty("disabled", bln_value);                       
    }  

    fn_setDisabled(bln_value=true, bln_disableChildren=false){ 
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_setDisabled: " + bln_value);
        }
        
        if(!bln_value){
            this.fn_setEnabled(true);
            return;
        }         
        if(bln_disableChildren){
            let arr_item=this.obj_design.arr_item;        
            for(let i=0;i<arr_item.length;i++){                    
                let obj_item=arr_item[i];                    
                obj_item.fn_setDisabled(bln_value, bln_disableChildren);
            }
        }

        this.fn_setDomProperty("disabled", true);                                  
    }        

    fn_beforeDomPropertyDisabled(bln_value=false){                                     
          
        if(!this.obj_holder.obj_enabled){            
          this.fn_recordDomProperty();
        }
    }                       


    fn_recordDomProperty(){                                                       
        
        let obj_enabled=new Object;        
        this.obj_holder.obj_enabled=obj_enabled;
        
        const computedStyle = window.getComputedStyle(this.dom_obj);                                     
        obj_enabled.pointerEvents = computedStyle.getPropertyValue("pointer-events");
        if(obj_enabled.pointerEvents==="none"){obj_enabled.pointerEvents="auto";}
        obj_enabled.cursor = computedStyle.getPropertyValue("cursor");                                          
        obj_enabled.color = this.fn_getComputedStyleProperty("color");        
      }

    fn_afterDomPropertyDisabled(bln_value){
        
        if(this.obj_holder.bln_debugNavigate){
          this.fn_debugText("fn_afterDomProperty_disabled: " + bln_value);
        }
        switch(bln_value){
          case true:              
              this.fn_setStyleProperty("pointer-events", "none");                  
              this.fn_setStyleProperty("cursor", "default");                                                    
              this.fn_setStyleProperty("color", "gray");                                                               
              break;
          case false:              
              this.fn_setStyleProperty("pointer-events", this.obj_holder.obj_enabled.pointerEvents);          
              this.fn_setStyleProperty("cursor", this.obj_holder.obj_enabled.cursor);                                      
              this.fn_setStyleProperty("color", this.obj_holder.obj_enabled.color);                                    
              break;            
          }              
    }       
    
    
    fn_setDesignProperty(str_name, str_value){                
        //console.log("fn_setDesignProperty: " + str_name + "[" + str_value + "]");
        this.obj_design[str_name]=str_value;
    }

    fn_getDesignProperty(str_name){                
        let foo_value=this.obj_design[str_name];
        foo_value=obj_shared.fn_parseBool(foo_value);
        return foo_value;
    }
    fn_getType(){                
        return this.obj_design.str_type.toLowerCase();
    }
    fn_getTag(){                
        return this.obj_design.str_tag.toLowerCase();
    }    

    fn_camoText(){
        
        this.fn_setColor(this.fn_getBackground());
    }

    fn_setHiddenPin(){
        this.bln_hiddenPin=true;                  
        this.fn_setDisplay(false);                                        
      }
    fn_getHiddenPin(){
        return this.bln_hiddenPin;                                    
    }                

    
    
    fn_setText(str_value){//can be overidden, but should be called       

        /*
        str_value+="";        
        if(str_value==="xdesignblank"){
            str_value="";              
        }                             

        if(str_value===undefined){
            str_value="";              
        }                                     
        if(str_value==="undefined"){
            str_value="";              
        }

        //this.obj_design.str_text=str_value;            
        this.fn_setValue(str_value);                

        if(str_value==="notset"){
            str_value="";       
        }
        const searchRegExp = /\n/g;
        const replaceWith = '<br>';
        str_value=str_value.replace(searchRegExp, replaceWith);        
        //*/

        if(str_value===undefined){
            str_value="";              
        }                                     

        if(str_value==="notset"){
            str_value="";       
        }

        this.obj_design.str_text=str_value;        
        
        if(this.obj_design.arr_item.length){                                                    
            return;
        }
        this.fn_setDomProperty("innerHTML", str_value);                                      
    }
    fn_getText(){//should be overidden, but called
        return this.obj_design.str_text;
    }        
    fn_getValue(){               
        
        //let str_value=this.dom_obj.getAttribute('value');//can be blank dont use
        let str_value=this.dom_obj.value;
        if(str_value==="undefined"){str_value="";}                
        this.obj_design.str_value=str_value;        

        return str_value;    
        
    }    
    fn_setValue(str_value){         

        str_value+="";                       
        this.obj_design.str_text=str_value;        
        this.obj_design.str_value=str_value;
        //DOM Update Follows            
        
        this.dom_obj.setAttribute('value', str_value); //required to show in HTML, eg perhaps for color control
        this.dom_obj.value=str_value;//required for text areas.
    }         

    
    fn_setItemStyleProperty(str_type, str_name, str_value){          

        let obj_item, arr;
        arr=this.obj_design.arr_item;        
        for(var i=0;i<arr.length;i++){
            obj_item=arr[i];              
            if(obj_item.fn_getType()===str_type){                                
                obj_item.fn_setStyleProperty(str_name, str_value);      
            }
            obj_item.fn_setItemStyleProperty(str_type, str_name, str_value);
            
        }
    }

    

    
    
    fn_getHTMLContent(){        
        let str_content=this.obj_design.str_content;        
        return str_content;
    } 

    
    
    fn_setHTMLContent(){

        

        let str_content=this.fn_getHTMLContent();

        if(str_content==="nocontent"){
                return;
        }

        if(this.obj_design.arr_item.length){
            return;
        }
        this.fn_removeAllContent();        
        this.fn_setContent(str_content); 
        
        this.dom_objContent.innerHTML=str_content;        
        
    }                
    fn_getHTMLContent(str_value){              

        
        
        str_value=this.obj_design.str_content;
        
        
        if(str_value==="xdesignblank"){
            return "";
        }
        else if(!str_value || str_value===undefined){
            return "nocontent";
        }        
        return str_value;

    }   
    fn_setContent(str_value){  
        
        if(str_value==="xdesignblank"){
            str_value="";
        }
        this.obj_design.str_content=str_value;
    } 
    
    fn_setPosition(str_value){
        this.fn_setStyleProperty("position", str_value);                                
    }

    fn_setDisplayFlex(bln_value=true){
        this.fn_setDisplay(bln_value, "flex");
    }
    fn_setFlexDirection(str_value){
        this.fn_setStyleProperty("flexDirection", str_value);
    }
    fn_setFlex(str_value){
        this.fn_setStyleProperty("flex", str_value);
    }
    fn_setLeft(str_value){
        this.fn_setStyleProperty("left", str_value);
    }
    fn_setTop(str_value){
        this.fn_setStyleProperty("top", str_value);
    }    

    fn_toggleDisplayFlex(){
        if(this.bln_open){            
          this.fn_closeFlex();
          return false;
        }          
        this.fn_openFlex();
        return true;        
    }
    fn_closeFlex(){                    
        this.bln_open=false;
        this.fn_setDisplayFlex(false);
      }
      fn_openFlex(){
        this.bln_open=true;
        this.fn_setDisplayFlex(true);
      }

    fn_toggleDisplay(){
        if(this.bln_open){            
          this.fn_close();
          return false;
        }          
        this.fn_open();
        return true;        
    }
    fn_close(){                    
        this.bln_open=false;
        this.fn_setDisplay(false);
      }
      fn_open(){
        this.bln_open=true;
        this.fn_setDisplay(true);
      }
    
    fn_setDisplay(foo_val=true, str_displayType="block"){  

        let str_value, str_valueContent;
        str_value="none";                      
        if(foo_val===true){                          
            str_value=str_displayType;                
        }        
        
        this.fn_setStyleProperty("display", str_value);                                
    }          
    
    fn_getDisplay(){                  
        return this.fn_getStyleProperty("display");        
    }         
    fn_getBooleanDisplay(){                  
        let str_display=this.fn_getDisplay();
        if(str_display && str_display!=="none"){return true;}            
        return false;
    }     
    fn_displayOn(){
        this.fn_setDisplay(true);
    }     
    fn_displayOff(){
        this.fn_setDisplay(false);
    }     
    
    fn_getVisible(){ 
        return this.fn_getStyleProperty("visibility");                                            

    }    
    fn_disable(){//overridden        
    }
    fn_hide(){
        this.fn_setVisible(false);      
    }
    fn_show(){
        this.fn_setVisible(true);      
    }
    fn_setPadding(str_value){  
        this.fn_setStyleProperty("padding", str_value);
    }
    fn_setMargin(str_value){  
        this.fn_setStyleProperty("margin", str_value);
    }
    fn_setVisible(foo_val=true){  

        let str_value;
        if(foo_val===true){                          
            str_value="visible";
        }
        else if(foo_val===false){                          
            str_value="hidden";
        }    
        else{
            str_value=foo_val;
        }            
        this.fn_setStyleProperty("visibility", str_value);
    }      
    fn_setHeight(str_value){
        this.fn_setStyleProperty("height", str_value);
    }
    fn_setWidth(str_value){
        this.fn_setStyleProperty("width", str_value);
    }
    fn_setZIndex(str_value){
        this.fn_setStyleProperty("zIndex", str_value);
    }
    fn_setColor(str_value){
        this.fn_setStyleProperty("color", str_value);
    }    
    fn_getColor(){
        return this.fn_getStyleProperty("color");        
    }        
    
    fn_setBorder(str_value){
        this.fn_setStyleProperty("border", str_value);        
    }    
    fn_setBackground(str_value){
        this.fn_setStyleProperty("background", str_value);        
    }    
    fn_getBackground(){        
        return this.fn_getStyleProperty("background");        
    }          
    fn_setBackgroundColor(str_value){
        this.fn_setStyleProperty("backgroundColor", str_value);        
    }    
    fn_getBackgroundColor(str_value){
        return this.fn_getStyleProperty("backgroundColor");        
    }    
    fn_getOpacity(){
        return this.fn_getStyleProperty("opacity");        
    }    
    fn_setOpacity(str_value){
        this.fn_setStyleProperty("opacity", str_value);        
    }    
    fn_setOpacityNormal(){
        if(this.bln_enabled){
          this.fn_setOpacity("1");                  
        }                                                                  
      }
      fn_setOpacityGraded(){
        if(this.bln_enabled){
          this.fn_setOpacity("0.75");                  
        }                                                                  
      }
    fn_setFontFamily(str_value){
        this.fn_setStyleProperty("fontFamily", str_value);        
    }    
    fn_getFontFamily(str_value){
        return this.fn_getStyleProperty("fontFamily");        
    }    
    fn_setFontSize(str_value){
        this.fn_setStyleProperty("fontSize", str_value);        
    }    
    fn_getFontSize(str_value){
        return this.fn_getStyleProperty("fontSize");        
    }        
    
    
    
    
    
    fn_getObjectMatching(str_method){        

        if(this[str_method]){
            return this;
        }   
        let obj_container=this.fn_getParentComponent();                                
        if(obj_container){                    
            return obj_container.fn_getObjectMatching(str_method);
        }
        return false;        
        
    }
    

    fn_getNextLocalHome(){                        
        
        let bln_isLocalHome=this.fn_isLocalHome();
        let obj_parent=this.fn_getParentComponent();//parent or false        

        let obj_item=this;
        if(bln_isLocalHome && obj_parent){        
            obj_item=obj_parent;            
        }
        return obj_item.fn_getLocalHome();
    }    
    fn_getLocalHome(){        

        let bln_isLocalHome=this.fn_isLocalHome();
        let obj_parent=this.fn_getParentComponent();//parent or false
        if(bln_isLocalHome || !obj_parent){
            return this;
        }
        return obj_parent.fn_getLocalHome();        
    }  
    xfn_getNextLocalHome(){                
        return this.fn_getLocalHome(true);
    }    
    xfn_getLocalHome(bln_nextLocalHome=false){        

        let bln_isLocalHome=this.fn_isLocalHome();
        if(bln_isLocalHome){if(!bln_nextLocalHome){return this;}}

        let obj_parent=this.fn_getParentComponent();//parent or false
        if(!obj_parent){            
            return this;
        }
        return obj_parent.fn_getLocalHome();        
    }      
    fn_isLocalHome(){        
        return this.obj_design.bln_isLocalHome;
    }
    fn_setDesignLocked(bln_status){//should be run on local home only 
        this.obj_design.bln_lockComponent=bln_status;
    }       
    fn_getDesignLocked(){//should be run on local home only 
        if(this===obj_project){return false;}
        if(obj_project.fn_isContextHolder()){return false;}
        return obj_shared.fn_parseBool(this.obj_design.bln_lockComponent);//dont switch to getDesginAttrib as this may be called by a "ini object witout funcitons"        
    }  
    

}//END CLS
//END BaseObject.js


//START Component.js
class component extends BaseObject {
    constructor(obj_ini) {
        super(obj_ini); // call the super class constructor
    }
    fn_initialize(obj_ini){//COMPONENT: fn_initialize is called again upon component.openInstance from db
        super.fn_initialize(obj_ini);

        
        //START INITIALIZE DESIGN
        this.obj_design.int_idRecord=obj_ini.obj_design.int_idRecord;
        if(this.obj_design.int_idRecord==undefined){this.obj_design.int_idRecord=0;}
        
        if(this.obj_design.int_modeExecute===undefined){                                    
            this.obj_design.int_modeExecute=this.obj_holder.int_modeRuntime;        
            let dom_frameElement=window.frameElement;                
            if(dom_frameElement){
            let str_name=dom_frameElement.getAttribute("name");        
                if(str_name==="xdesign-frame"){//ie a project that is being designed}        
                    this.obj_design.int_modeExecute=this.obj_holder.int_modeReadOnly;                                
                    if(this.obj_design.int_idRecord===0){
                        this.obj_design.int_modeExecute=this.obj_holder.int_modeEdit;
                    }
                }
            }
        }  
        
        if(this.obj_design.str_type===undefined){this.obj_design.str_type="component";}                

        let str_name=this.obj_design.str_name;
        if(str_name==undefined){
            str_name="My " + this.obj_design.str_type;
            //str_name=obj_shared.fn_getUniqueId(str_name);
        }         
        this.fn_setName(str_name);
        this.fn_setRegisterAtProject(this.obj_design.bln_registerAtProject);
        this.fn_setRegisterAtContainer(this.obj_design.bln_registerAtContainer);
        

        if(this.obj_design.str_tag===undefined){this.obj_design.str_tag="component";}                                                
        if(this.fn_getIsContainer()==undefined){this.fn_setIsContainer(true);}        
        this.bln_isComponent=true;                
        if(!this.obj_design.bln_classController){this.obj_design.bln_classController="false";}//undefined or empty string or false                        
        if(!this.obj_design.str_classList){this.obj_design.str_classList="notset";}//undefined or empty string or false
        if(!this.obj_design.str_classExtend){this.obj_design.str_classExtend="notset";}//undefined or empty string or false                                        
        
        if(!this.obj_design.str_createdDate){this.obj_design.str_createdDate=obj_shared.fn_getDate(obj_const.int_dateNow);}//undefined or empty string or false                
        if(!this.obj_design.str_modifiedDate){this.obj_design.str_modifiedDate=obj_shared.fn_getDate(obj_const.int_dateNow);}//undefined or empty string or false                

        //this.obj_holder.bln_listenClick=true;                        
        
        this.obj_holder.str_prefix="xDesign_";                
        
        //END INITIALIZE DESIGN

        //START INITIALIZE STYLE
        //if(this.fn_getStyleProperty("fontFamily")===undefined){this.obj_domStyle.fontFamily="Helvetica";}
        //if(this.obj_domStyle.flexWrap===undefined){this.obj_domStyle.flexWrap="wrap";}              
        //END INITIALIZE STYLE
    }   

    fn_getComponentViaFlagVertical(str_flag){
        if(!str_flag)return false;
        let bln_value=this.obj_holder[str_flag];
        if(bln_value)return this;
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
            return obj_parent.fn_getComponentViaFlagVertical(str_flag);
        }

    }

    fn_configureFromMeta(){}
    fn_configureFromView(){}
    
    
    xfn_cascadeFlipHeading(bln_showFieldHeading){                
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];                                                
            obj_item.xfn_cascadeFlipHeading(bln_showFieldHeading);            
        }        
      }  

    xfn_cascadeFlipAxis(bln_axis){//overdidden        

        //bln_axis=this.fn_flipAxis(bln_axis);
        
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];                                                
            //obj_item.xfn_cascadeFlipAxis(bln_axis);
        }        
    }

    fn_maintainAxis(bln_axis){        
        this.fn_setAxis(bln_axis);        
    }    

    fn_flipAxis(bln_axis){                
        if(bln_axis===undefined){bln_axis=this.fn_getAxis();}        
        this.fn_setAxis(obj_shared.fn_flipBool(bln_axis));                
    }

    fn_setAxis(bln_axis){
        this.obj_holder.bln_axis=bln_axis;        
        //this.fn_setStyleProperty("display", "flex");
        if(!bln_axis){//true=row
            this.fn_setStyleProperty("flex-direction", "row");
            
        }
        else{//true=column
            this.fn_setStyleProperty("flex-direction", "column");
        }
    }

    fn_getAxis(){
        return this.obj_holder.bln_axis;
    }

    fn_flipDisplay(bln_value){
        if(bln_value===undefined){            
            bln_value=this.fn_getBooleanDisplay();            
        }        
        this.fn_setDisplay(obj_shared.fn_flipBool(bln_value));
    }         
    fn_flipDisplayFlex(bln_value){
        if(bln_value===undefined){            
            bln_value=this.fn_getBooleanDisplay();            
        }        
        this.fn_setDisplayFlex(obj_shared.fn_flipBool(bln_value));
    }         
    
    
    fn_isEmpty(){                
        return this.obj_design.arr_item.length ? false:true;        
    }

    fn_getDynamicContent(bln_refuseSave=false){

        let obj_item=this.fn_getComponent("xapp_dynamic_content")
        if(obj_item){return obj_item;}
        let obj_ini=new Holder;                                    
        obj_ini.obj_design.str_type="xapp_dynamic_content";    
        obj_ini.obj_design.str_name="xapp_dynamic_content";            
        obj_ini.obj_design.bln_refuseSave=bln_refuseSave;                    
        this.fn_addItem(obj_ini);        
        return this.fn_getComponent("xapp_dynamic_content");
    }
    
    fn_addContextItemOnce(str_nameShort, bln_debug=false){
        
        this.bln_debugContextItem=bln_debug;                

        if(str_nameShort==="xapp_dynamic_content"){
            console.log("cannot add dynamic context due to recursion issue. use getComponent instead.");
            return;
        }
        
        let obj_item=this.fn_getComponent(str_nameShort);
        if(!obj_item){
            //obj_item=this.fn_useContextItem(str_nameShort);
            let obj_contextItem=this.fn_useContextItem(str_nameShort);
            obj_item=this.fn_addItem(obj_contextItem);        
            obj_item=this.fn_formatContextItem(obj_item);            
        }
        return obj_item;
    }
    fn_addContextItem(str_nameShort, bln_startPosition=false, bln_debug=false){
        this.bln_debugContextItem=bln_debug;        

        if(str_nameShort==="xapp_dynamic_content"){
            console.log("cannot add dynamic context due to recursion issue. use getComponent instead.");
            return;
        }
        
        let obj_contextItem=this.fn_useContextItem(str_nameShort);
        if(obj_contextItem){
            obj_contextItem.obj_design.bln_startPosition=bln_startPosition;
        }        
        let obj_item=this.fn_addItem(obj_contextItem);        
        obj_item=this.fn_formatContextItem(obj_item);        
        return obj_item;
    }

    fn_useContextItem(str_nameShort){               

        let obj_item,   obj_contextItem;                
        let obj_contextHolder, obj_dynamicContent;        

        if(str_nameShort==="xapp_dynamic_content"){return;}

        if(this.bln_debugContextItem){
            console.log("SEARCH ["+ str_nameShort +"] FOR [" + this.obj_design.str_name + "]");    
        }
        
        //Get context item from project
        obj_contextHolder=obj_project.fn_getComponent("xapp_context_holder");
        if(!obj_contextHolder){
            if(this.bln_debugContextItem){console.log("ERROR fn_useContextItem Cannot locate xapp_context_holder");}
            return;
        }        
        
        obj_dynamicContent=obj_contextHolder.fn_getDynamicContent(true);        
        if(!obj_dynamicContent){
            if(this.bln_debugContextItem){console.log("ERROR fn_useContextItem Cannot locate xapp_dynamic_content");}
            return;
        }

        obj_contextItem=obj_dynamicContent.fn_getComponent(str_nameShort);
        //check in top level to see if we have retrieved this before
        if(obj_contextItem){            
            if(this.bln_debugContextItem){console.log("REUSE [" + str_nameShort + "] FOR [" + this.obj_design.str_name + "]");}
        }
        else{
            if(this.bln_debugContextItem){console.log("GET [" + str_nameShort + "] FOR [" + this.obj_design.str_name + "]");}
            obj_contextItem=obj_contextHolder.fn_getContextItem(str_nameShort, this.bln_debugContextItem);                
            if(this.bln_debugContextItem){console.log("obj_contextItem: " + str_nameShort + ": " + obj_contextItem);}
            if(!obj_contextItem){
                if(this.bln_debugContextItem){
                    console.log("GETCONTEXT ITEM NOT FOUND: " + str_nameShort + ": " + obj_contextItem);
                    console.log("1. CHECK REGISTER AT CONTAINER IS TRUE");
                    console.log("2. CHECK NAME OF COMPONENT");
                }                
                return;
            }
            obj_contextItem.obj_design.bln_registerAtContainer=true;            
            obj_contextItem.obj_design.bln_registerAtContainer=true;
            obj_dynamicContent.fn_addItem(obj_contextItem);//add to context holder dynamic top level for reuse
        }

        return obj_contextItem;
    }   
    
    fn_formatContextItem(obj_item){

        if(!obj_item){return;}
        obj_item.fn_setParentComponent(this);        
        obj_item.fn_removeId();              
        obj_item.fn_setDynamic(true);
        return obj_item;

    }
    fn_getContextItem(str_nameShort, bln_debug){        

        let i, arr_item, obj_item, obj_target;        


        this.bln_debugContextItem=bln_debug;        

        if(this.bln_debugContextItem){console.log("PARENT [" + this.obj_design.str_name + "]");}        
        
        obj_target=false;
        if(this.obj_design.bln_isContextHolder){                         
            obj_target=this.fn_getComponent(str_nameShort);                                                                
            if(obj_target){
                if(this.bln_debugContextItem){console.log("FOUND [" + str_nameShort + "] PARENT [" + this.obj_design.str_name + "]");}                                
                return obj_target;
            }
        }
        
        arr_item=this.obj_design.arr_item;        
        for(i=0;i<arr_item.length;i++){
            obj_item=arr_item[i];                         
            if(this.bln_debugContextItem){console.log("CHILD [" + obj_item.obj_design.str_name + "]");}                            
            if(obj_item.obj_design.bln_isContextHolder){                                
                if(this.bln_debugContextItem){console.log("IS CONTEXT HOLDER [" + obj_item.obj_design.bln_isContextHolder + "]");}                            
                obj_target=obj_item.fn_getContextItem(str_nameShort, bln_debug);
                if(obj_target){return obj_target;}
            }            
        }
        return false;
    } 

    fn_highlightBorder(str_color){
        this.fn_setStyleProperty("border", "1.0em solid " + str_color);
    }
    
    fn_getDebugPin(){
        return this.obj_holder.bln_debugPin;
    }
    fn_setDebugPin(bln_value){                                    
        this.obj_holder.bln_debugPin=bln_value;
    }               
    fn_getIsOpen(){
        return this.obj_design.bln_isOpen;
    }
    fn_setIsOpen(bln_value){
        this.obj_design.bln_isOpen=bln_value;
    }

    fn_locateItemForPalette(str_nameShort, bln_searchContextItem, bln_debug){
        return this.fn_getItemGoSouth(str_nameShort, bln_searchContextItem, bln_debug);
    }

    fn_locateItemIgnoreContextItem(str_nameShort, bln_debug){
        return this.fn_getItemGoSouth(str_nameShort, false, bln_debug);
    }

    fn_locateItem(str_nameShort, bln_debug){
        return this.fn_getItemGoSouth(str_nameShort, false, bln_debug);
    }
    
    fn_getItemGoSouth(str_nameShort, bln_searchContextItem, bln_debug){        

        let i, arr_item, obj_item, obj_target;

        if(bln_debug){
            console.log("str_nameShort: " + str_nameShort);
        }

        if(!bln_searchContextItem){
            if(this.fn_isContextHolder()){
                return false;
            }
        }
        

        obj_target=this.fn_getComponent(str_nameShort);                                
        if(obj_target){
            if(bln_debug){
                this.fn_debugText("FOUND");
            }    
            return obj_target;
        }
    

        arr_item=this.obj_design.arr_item;        
        for(i=0;i<arr_item.length;i++){
            obj_item=arr_item[i];                        
            
            obj_target=obj_item.fn_getItemGoSouth(str_nameShort, bln_searchContextItem, bln_debug);            
            if(obj_target){
                return obj_target;                          
            }
            
        }
        return false;
    }   

    fn_getBaseClassParent(str_baseClass){

        let obj_item=this.fn_getParentComponent();
        
        
        if(obj_item && obj_item.fn_getDesignProperty("str_baseClass", str_baseClass)){
            return obj_item;
        }
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
            return obj_parent.fn_getBaseClassParent(str_baseClass);
        }            
        return false;

    }


    fn_getItemGoNorth(str_nameShort){        

        
        let obj_item=this.fn_getComponent(str_nameShort);
        
        if(obj_item){
            return obj_item;
        }
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
            return obj_parent.fn_getItemGoNorth(str_nameShort);
        }            
        return false;
    }
    
    fn_call(str_method, foo_arg){    
        if(this[str_method]){
            return this[str_method](foo_arg);
        }                            
    }

    fn_notifyItem(str_notify, str_method, foo_arg){        
        return this.fn_notify(this.fn_getComponent(str_notify), str_method, foo_arg);
    }

    fn_notifyObject(obj_notify, str_method, foo_arg){
        return this.fn_notify(obj_notify, str_method, foo_arg);
    }
    fn_notify(obj_notify, str_method, foo_arg){            
        if(obj_notify && obj_notify[str_method]){
            return obj_notify[str_method](foo_arg);
        }                        
    }
    fn_notifyParent(str_method, foo_arg){
        let obj_container=this.fn_getParentComponent();                  
        return this.fn_notify(obj_container, str_method, foo_arg);        
    }
    
    fn_execute(){        

        if(!this.obj_design.int_idRecord){            
            this.fn_stepEnd();
            return;
        }       
        
        if(!this.fn_validIdHistory()){
            this.fn_stepEnd();
            return;
        }   

        //check on client        
        
        if(this.fn_loadJSONInstanceFromClient()){                        
            //console.log("fn_loadJSONInstanceFromClient: " + this.obj_design.int_idRecord);
            this.fn_stepEnd();
            return;
        } 

        //goto to server
        this.fn_loadJSONInstanceFromServer();
    }

    
    
    //*
    fn_setModeExecute(int_mode){        

        //dont allow dynamic objects to set mode execute / add from palette
        if(this.fn_getDynamic()){            
            //return false;    
        }       
        
        //dont allow children of dynamic parents to set mode execute / add from palette
        if(this.fn_hasDynamicParent()){            
            return false;    
        }      

        //dont allow children of static object to set mode execute / add from palette        
        let obj_staticParent=this.fn_hasStaticParent();
        if(obj_staticParent && obj_staticParent!==obj_project){            
            return false;    
        }       

        //set mode execute
        this.obj_design.int_modeExecute=int_mode;         
        return true;
    }

    
    
    fn_preventSave(){
        

        //allow dynamic objects to be saved, its only the children that should not be saved
        if(this.fn_getDynamic()){
            //return true;
        }
        if(this.fn_getRefuseSave()){
            return true;
        }
        

        //dont save the children !
        if(this.fn_hasDynamicParent()){
            return true;
        }
        
        //dont enable this otherwise children of static parents are rmeoved on parent save        
        //if(this.fn_hasStaticParent()){
          //return true;
        //}        
        
        return false;
        
    }
    //*/

    fn_hasContextHolderParent(bln_debug){ 
        
        let obj_container=this.fn_getParentComponent();        
        if(!obj_container){
            if(bln_debug){
                this.fn_debugText("debug parent not found return false");
            }
            return false;
        }        

        if(bln_debug){
            this.fn_debugText("debug fn_hasContextHolderParent");
        }
        

        if(obj_container.fn_isContextHolder()){            
            if(bln_debug){
                this.fn_debugText("debug i am a context holder return true");
            }
            return obj_container;
        }                
        
        return obj_container.fn_hasContextHolderParent(bln_debug);
    }    
    fn_isContextHolder(){                 
        return this.obj_design.bln_isContextHolder;
    }    

    fn_hasStaticParent(){  
        
        //if(obj_project.fn_isContextHolder()){return false}//will cause issues with save on locked components
        
        let obj_container=this.fn_getParentComponent();        
        if(!obj_container){return false;}        

        if(obj_container.fn_getStatic()){            
            return obj_container;
        }                
        
        return obj_container.fn_hasStaticParent();
    }        
    
    fn_getStatic(){                
        return this.fn_getDesignLocked();
        //return this.obj_design.bln_lockComponent;        
    }        

    fn_getRefuseSave(){                
        return this.obj_design.bln_refuseSave;
    }

    fn_getDynamic(){                

        
        let bln_value=false;        
        if(this.obj_design.bln_dynamicPin){
            bln_value=true;
        }

        return bln_value;
    }        
    fn_hasDynamicParent(){ 
        
        let bln_value;
        let obj_container=this.fn_getParentComponent();        
        if(!obj_container){return false;}        

        if(obj_container.obj_design.str_type==="xapp_dynamic_content"){//covers dynamic tag, in parent lookup
            bln_value=true;
        }


        if(obj_container.fn_getDynamic()){            
            return true;
        }                
        return obj_container.fn_hasDynamicParent();
    }    
    fn_setDynamic(bln_value=true){
        this.obj_design.bln_dynamicPin=bln_value;
    }
    

    fn_loadJSONInstanceFromServer(){      
        //we need to wait for trip back from server before loading any children
        this.obj_design.arr_item=[];            

        //console.log("fn_loadJSONInstanceFromServer: " + this.obj_design.int_idRecord);
        let obj_ini=new Holder;            
        let obj_AJAX=new AJAX(obj_ini);
        let obj_post=new Object;                         
        obj_post.URL=obj_path.fn_getURLServerFile(this.obj_design.str_type, this.obj_holder.str_nameFileServer);
        obj_post.NotifierId=this.obj_design.str_idXDesign;                        
        obj_post.Action="getInstance";                
        obj_post.ActionCallBack="fn_loadJSONInstanceFromServerCallBack";                
        obj_post.RecordId=this.obj_design.int_idRecord;//could get complicated if obj_instance supplied                            
        obj_AJAX.fn_putPost(obj_post);        
    }
    fn_loadJSONInstanceFromServerCallBack(obj_post){        
        let int_id_record=obj_post.RecordId;                
        let ObjectData=obj_post.ObjectData; 
        if(obj_post.HasError && obj_post.ErrorMessage==="RecordIdNotExist"){                        
            this.fn_stepEnd();
            return;
        }        
        this.fn_loadJSONInstance(ObjectData);        
        this.fn_addToClientMap(int_id_record, ObjectData);                                     
        this.fn_stepEnd();
    }    
    fn_addToClientMap(int_id_record, ObjectData){                        
        obj_shared.fn_setMapItem(obj_InstanceJSONMap, int_id_record, ObjectData);                        
    }    
    fn_loadJSONInstanceFromClient(){
        let int_id_record=parseInt(this.obj_design.int_idRecord);                                        
        let ObjectData=obj_shared.fn_getMapItem(obj_InstanceJSONMap,  int_id_record);//get a reference to the the object that has been published from the db                
        return this.fn_loadJSONInstance(ObjectData);
    }
    fn_loadJSONInstance(ObjectData){ 

        if(!ObjectData){return false;}
        if(!ObjectData.obj_design){return true;}
        //indicate success, but dont initialize with a blank object                
        //may be a blank object if instance id has been renamed/deleted/corrupted etc on the server
        
        var NewObjectData=JSON.parse(JSON.stringify(ObjectData));        
        NewObjectData.obj_holder=new Holder;                 
        NewObjectData.obj_design.int_modeExecute=this.obj_design.int_modeExecute;//Continuity of Mode                                                                                        
        this.fn_initialize(NewObjectData);//initialize with self from db                                
        return true;
    }    
    fn_stepEnd(){                
        this.fn_createSelf();//create self                        
        this.fn_onOpenInstance();//run  baseobvject onopeninstance
    }     
    //START COMPONENT OPERATION FUNCTIONS  
    
    
    fn_getComponent(str_nameShort){        
        
        let str_name="obj_" + obj_shared.fn_formatShortName(str_nameShort);                                        
        let obj_my=this.obj_holder[str_name];        
        return obj_my;
    } 
    fn_setComponent(obj_item, str_nameShort){
        this.fn_register(obj_item, str_nameShort);        
    }

    fn_getProjectLocal(){                   
        
        if(this===obj_project){return this;}//logically ok but not tested
    
        return this.obj_holder.obj_projectLocal;                        
    }    
    
    fn_getRecordStatus(){//deprecated, not used ?
        alert("check defunct")

        let arr, obj_item, bln_recordStatus;
        arr=this.obj_design.arr_item;
        
        if(this.bln_isComponent){
            if(!this.obj_design.int_idRecord){
                return false;
            }
        }      
        //*          
        for(let i=0;i<arr.length;i++){
            obj_item=arr[i];

            bln_recordStatus=obj_item.fn_getRecordStatus();
            if(!bln_recordStatus){
                obj_item.fn_debug("CHILD NOT SAVED");
                return false;
            }            
        } 
        //*/       
        return true;
    }    

    fn_onBeforeSave(){}//to be overidden

    fn_extends(str_nameClass){        

        this.obj_design.str_classExtend=str_nameClass;

        //this.fn_addClass(str_nameClass);        
        //this.fn_addClass(this.obj_design.str_type);        
    }

    fn_requires(str_nameClass){        
        this.fn_addClass(str_nameClass);        
    }

    fn_addClass(str_nameClass){ 
        let str_classList=this.obj_design.str_classList;
        let int_index;
        let s1, s2;
        s1=","+str_classList+",";
        s2=","+str_nameClass+",";
        int_index=s1.indexOf(s2);                
        if(int_index!==-1){
            return;
        }
        if(str_classList==="notset"){
            str_classList="";
        }
        if(str_classList!==""){
            str_classList+=",";            
        }
        str_classList+=str_nameClass;
        this.obj_design.str_classList=str_classList;        
    }

    
    fn_getClassExtend(){
        return this.obj_design.str_classExtend;
    }          
    
    
    fn_getType(){
        return this.obj_design.str_type;
    }          
    fn_setType(str_value){    

        if(str_value===""){str_value="tag";}                            
        str_value=obj_shared.fn_formatShortName(str_value);                    
        this.obj_design.str_type=str_value;
    }          
    fn_setThemeType(str_value){    

        if(str_value===""){str_value="notset";}                            
        str_value=obj_shared.fn_formatShortName(str_value);                    
        this.obj_design.str_themeType=str_value;
    }                  
    fn_getTag(){
        return this.obj_design.str_tag;
    }
    fn_setTag(str_value, bln_mandatory){
        if(str_value===""){str_value="component";}
        str_value=obj_shared.fn_formatShortName(str_value);        
        if(this.obj_design.str_tag===undefined || this.obj_design.str_tag==="component"){        
            this.obj_design.str_tag=str_value;      
        }              
        if(bln_mandatory){
            this.obj_design.str_tag=str_value;      
        }
        
    }    
    fn_getName(){
        return this.obj_design.str_name;
    }
    fn_setName(str_name){        
        if(!str_name){
            return false;
        }        
        this.obj_design.str_name=str_name;                
        let str_value=obj_shared.fn_formatShortName(this.obj_design.str_name);        
        let str_nameShort=this.fn_setVariableName(str_value);
        if(this.fn_getRegisterAtProject()){
            if(!obj_project.fn_getComponent(str_nameShort)){
                obj_project.fn_setComponent(this, str_nameShort);
            }
        }
        return str_value;
    }
    fn_setVariableName(str_value){           
        return this.obj_design.str_nameShort=str_value;                    
    }
    fn_getVariableName(){        
        return this.obj_design.str_nameShort;
    }    
    
    
    /////////////////////START REGISTRATIONEVENT
    fn_register(obj_item){                 
        this.fn_registerName(obj_item, obj_item.obj_design.str_nameShort);        
    }    
    fn_registerName(obj_item, str_nameShort){ 
        let str_name;    
        str_name="obj_" + obj_shared.fn_formatShortName(str_nameShort);                                        
        this.obj_holder[str_name]=obj_item;                                
    }    
    /////////////////////END REGISTRATIONEVENT
    ///////////////////// START REGISTRATOR EVENTS 
    fn_registerObject(obj_item){ //object is registering a child                  
        this.fn_register(obj_item);                
        this.fn_onRegisterItem(obj_item);
    }    
    fn_registerContainedObject(obj_item){ //Container is registering a child          
        this.fn_register(obj_item);        
        //this.fn_onRegisterContainedObject(obj_item);
    }
    fn_registerProjectObject(obj_item){  //Project is registering a child      
        if(obj_item===obj_project){//never see
            alert("PROJECT/CHILD ARE EQUAL");                                
            return;
        }
        if(obj_item===this){//never see
            alert("ATTEMPT TO SELF REGISTER PROJECT WITH PROJECTOBJECT");                                
            return;
        }
        
        this.fn_register(obj_item);        
        this.fn_onRegisterProjectItem(obj_item);
    }
    ///////////////////// END REGISTRATOR EVENTS 
    
    ///////////////////// START PARENT POST REGISTER EVENTS
    fn_onRegisterItem(obj_item){ //post register        
        //console.log("POST OBJECT REGISTRATION OF: " + obj_item.obj_design.str_name);
        obj_item.fn_onRegisterWithObject(this);
    }
    fn_onRegisterContainedObject(obj_item){        
        //console.log("POST CONTAINER REGISTRATION OF: " + obj_item.obj_design.str_name);
        obj_item.fn_onRegisterWithContainer(this);
    }
    fn_onRegisterProjectItem(obj_item){                                
        //console.log("POST PROJECT REGISTRATION OF: " + obj_item.obj_design.str_name);
        obj_item.fn_onRegisterWithProject(this);
        if(!this.obj_theme && obj_item.obj_design.str_type==="xapp_theme"){                                            
            this.obj_theme=obj_item;
            if(this!==obj_project){alert("check project theme")};
        }
    }

    fn_setModeExecuteNew(){
        this.int_modeExecute=obj_holder.int_modeNew;                          
      }
      fn_getModeExecuteNew(){
        if(this.int_modeExecute===obj_holder.int_modeNew){return true;}
        return false;
      }
      fn_setModeExecuteEdit(){                                    
        this.int_modeExecute=obj_holder.int_modeEdit;                     
      }
      fn_getModeExecuteEdit(){        
        if(this.int_modeExecute===obj_holder.int_modeEdit){return true;}
        //if(this.fn_getModeExecuteNew()){return true;}
        return false;
      }
      fn_setModeExecuteView(){                  
        this.int_modeExecute=obj_holder.int_modeReadOnly;                                
      }
      fn_getModeExecuteView(){        
        if(this.int_modeExecute===obj_holder.int_modeReadOnly){return true;}
        return false;
      }
      
    
    ///////////////////// END PARENT POST REGISTER EVENTS
    ///////////////////// START CHILD POST REGISTER EVENTS
    fn_onRegisterWithObject(obj_registrator){//post register
        this.obj_holder.obj_registrator=obj_registrator;        
    }
    fn_onRegisterWithContainer(obj_container){//post register
        //
    }
    fn_onRegisterWithProject(obj_projectLocal){//post register        
        this.obj_holder.obj_projectLocal=obj_projectLocal;                
        //
    }        
    ///////////////////// END CHILD POST REGISTER EVENTS
    
    /////////////////////START REGISTRATION GETTER SETTER
    fn_setRegisterAtProject(bln_value){           
        if(bln_value==undefined){bln_value=false;}        
        this.obj_design.bln_registerAtProject=bln_value;                    
    }
    fn_getRegisterAtProject(){
        return this.obj_design.bln_registerAtProject;
    }
    fn_setRegisterAtContainer(bln_value){           
        if(bln_value==undefined){bln_value=false;}        
        this.obj_design.bln_registerAtContainer=bln_value;                    
    }
    fn_getRegisterAtContainer(){
        return this.obj_design.bln_registerAtContainer;
    }
    /////////////////////END REGISTRATION GETTER SETTER
    
    fn_setTypeable(bln_value){           
        if(bln_value==undefined){bln_value=false;}        
        this.obj_design.bln_typeable=bln_value;                    
    }
    fn_getTypeable(){                   
        return this.obj_design.bln_typeable;                    
    }
    fn_setClassController(bln_value){                   
    }
    fn_getClassController(){                   
        let bln_value=obj_shared.fn_parseBool(this.obj_design.bln_classController);        
        if(!this.fn_proposeClassController()){
            bln_value=false;
        }
        return bln_value;
    }    
    fn_proposeClassController(){                           
        let bln_value=true;
        if(this.obj_design.str_type==="component"){
            bln_value=false;
        }                
        return bln_value;
    }   
    fn_proposeEditLock(){                           
        let bln_value=true;
        if(this.obj_design.bln_registerAtProject){
            //bln_value=false;
        }                        
        return bln_value;
    }   
    fn_proposeRegisterAtProject(){                           
        
        let bln_value=true;
        if(this.obj_design.bln_lockComponent){
            //bln_value=false;
        }                   
        return bln_value;
    }   
    fn_proposeClassExtend(str_value){                           
        let bln_value=true;
        if(this.obj_design.str_type===str_value){
            bln_value=false;
        }                        
        return bln_value;
    }   
    fn_proposeType(str_value){                           
        let bln_value=true;
        if(this.obj_design.str_classExtend===str_value){
            bln_value=false;
        }                        
        return bln_value;
    }       
    
    fn_parentEvent(str_event, e){        
        let str_method="fn_onChild" + str_event;        
        let obj_parent=this.fn_getParentComponent();        
        if(obj_parent && obj_parent[str_method]){obj_parent[str_method](e);}    
        else{this.fn_unsetEvent();}
        
    }    
    fn_parentEventBubble(str_event, e){                
        
        
        if(!obj_project.obj_nativeEvent){
            return;
        }       
        
        

        let obj_parent=this.fn_getParentComponent();                                  
        console.log("obj_parent: " + obj_parent);
        if(obj_parent)
        {   
            

            if(obj_parent[str_method]){                
                obj_parent[str_method](e);
                this.fn_unsetEvent();
            }    
            else{                
                obj_parent.fn_parentEventBubble(str_event, e);                
                return;
            }
        }
        else{
            this.fn_unsetEvent();
        }
    }    
    fn_unsetEvent(){
        //console.log("fn_unsetEvent");
        obj_project.fn_unsetEvent();
    }

    
    fn_handleEvent(str_event, e){    
        obj_project.fn_setEvent(e, this);                        
        let str_method="fn_on" + str_event;
        //console.log("str_method: " + str_method);
        if(str_event==="Submit"){            
            //obj_project.fn_forgetEvent(e);
            //return;
        }
        if(this[str_method]){
            this[str_method](e);
        }        
        if(this===obj_project){this.fn_unsetEvent();}
    }
    
    //START COMPONENTEVENT HANDLING- CONSIDER MOVING to BASEOBJECT IF NECESSARY    
    fn_addEventListener(){
        let arr_event=[];        
        //arr_event.push("SelectStart");                
        if(this.obj_holder.bln_listenInput){arr_event.push("Input");}
        if(this.obj_holder.bln_listenSelectStart){arr_event.push("SelectStart");}                
        if(this.obj_holder.bln_listenClick){arr_event.push("Click");}
        if(this.obj_holder.bln_listenDblClick){arr_event.push("DblClick");}
        if(this.obj_holder.bln_listenBlur){arr_event.push("Blur");}
        if(this.obj_holder.bln_listenFocus){arr_event.push("Focus");}
        if(this.obj_holder.bln_listenChange){arr_event.push("Change");}
        if(this.obj_holder.bln_listenSubmit){arr_event.push("Submit");}
        if(this.obj_holder.bln_listenMouseEnter){arr_event.push("MouseEnter");}
        if(this.obj_holder.bln_listenMouseLeave){arr_event.push("MouseLeave");}
        if(this.obj_holder.bln_listenMouseDown){arr_event.push("MouseDown");}
        if(this.obj_holder.bln_listenMouseUp){arr_event.push("MouseUp");}
        if(this.obj_holder.bln_listenKeyDown){arr_event.push("KeyDown");}
        if(this.obj_holder.bln_listenKeyUp){arr_event.push("KeyUp");}        
        if(this.dom_obj){
            arr_event.forEach(function(str_event) {                            
                this.dom_obj.addEventListener(
                    str_event.toLowerCase(), 
                    this.fn_handleEvent.bind(this, str_event));
            }.bind(this));
        }        
    }        
    
    fn_onSelectStart(e){
        console.log("hit generic");
        obj_project.fn_forgetEvent(e);}                    
    fn_notifyChildControl(){}
    fn_onBlur(e){}
    fn_onClick(e){}
    fn_onDblClick(e){}
    fn_onChange(e){}
    fn_onKeyDown(e){}
    fn_onKeyUp(e){}    
    fn_blankEvent(){}        
    fn_setEventAttributes(){}    
    
    //*/       
    //END COMPONENTEVENT HANDLING
    //END COMPONENT OPERATION FUNCTIONS
}//END CLS



//END Component.js


//START AJAX.js
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
        obj_post.MetaFormId=obj_ini.int_idMetaForm;
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
//END AJAX.js


//START Tag.js
class tag extends component{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);        

    //this.obj_design.str_type="tag";      
    this.obj_design.str_type=obj_ini.obj_design.str_type;    
    this.obj_design.str_tag=obj_ini.obj_design.str_tag;        
    if(this.obj_design.str_type===undefined){
      alert("this.obj_design.str_type===undefined");
      this.obj_design.str_type="tag";
    }        
    if(this.obj_design.str_tag===undefined){
      alert("this.obj_design.str_tag===undefined");
      this.obj_design.str_tag="tag";
    }        

    this.obj_design.blnIsTag=true;

    if(this.obj_design.tagTitle!==undefined){
      //alert(this.obj_design.tagTitle)
      this.obj_domProperty.innerText=this.obj_design.tagTitle;      
      this.obj_design.str_tag=this.obj_design.tagTitle;            
    }    
    this.fn_setIsContainer(obj_ini.obj_design.bln_isContainer);
  }        

  //cannot call fn_onClick here this as otherwise the wrong "tag" will likely be set   

}//END CLS
//END Tag.js


//START Debug.js
  class Debug {
    constructor() {      
    }        

    fn_debugServerResponse(Response, bln_expanded=false){        

        
        let str_title="DEBUG SERVER RESPONSE";
        //if(!bln_expanded){console.groupCollapsed(str_title);}
        //else{console.group(str_title);}
        console.group(str_title);

        console.log("Response.headers: " + Response.headers);
        console.log("Response.ok: " + Response.ok);
        console.log("Response.redirected : " + Response.redirected);
        console.log("Response.status : " + Response.status);
        console.log("Response.statusText : " + Response.statusText);
        console.log("Response.trailers : " + Response.trailers);
        console.log("Response.type : " + Response.type);
        console.log("Response.url : " + Response.url);
        console.log("Response.useFinalURL : " + Response.useFinalURL);
        //console.log("Response.body : " + Response.body);
        //console.log("Response.bodyUsed : " + Response.bodyUsed);
        //console.log("Response.formData : " + Response.formData());
        //console.log("Response.json : " + Response.json());
        //console.log("Response.text : " + Response.text());
        console.groupEnd();

    }    
}//END CLS


//END Debug.js


//START myJSON.js
class myJSON  {
    constructor() {      
    }
    fn_serialize(obj_myObject){                  
      let fn_serializeReplacer;      
      this.fn_serializeReplacer=this.fn_serializeReplacerDefault;
      if(obj_myObject.fn_serializeReplacer!==undefined){        
        this.fn_serializeReplacer=obj_myObject.fn_serializeReplacer;
      }            
      this.obj_myObject=obj_myObject;
      let str_json=JSON.stringify(obj_myObject, this.fn_serializeReplacer())
      str_json=str_json.replace("xcludex", );
      
      return str_json;      
    }
    fn_deserialize(str_json, str_message){  
      
      let bln_debug =false;
      
      let obj_json={};
      try {
        obj_json=JSON.parse(str_json);
      } catch (error) {
        /*
          console.error("*****START ERROR myJSON DeSerialize*****");          
          console.error("ClientSide Information: " + str_message);
          console.error("Error: " + error);
          console.error("str_json: " + str_json);          
          console.error("*****END ERROR myJSON DeSerialize*****\n\n");
        //*/
      }      
      return obj_json;
    }
    fn_serializeReplacerDefault = () => {
      //myJSON default serialize object
      
        const seen = new WeakSet();
        return (key, value) => {
          switch(key){
              case "obj_ini":
              return undefined;
              break;
          }
          //console.log(key + ": " + value);
          if (typeof value === "object" && value !== null) {

              //fn_enumerateObject(value, "myJSON fn_serializeReplacerDefault");
              //const found = this.arr_exclude.find(element => element === value);
              //if (found) {return "";}
              if (seen.has(value)) {
                return "circular";
                //return;
              }
              seen.add(value);
          }
          return value;
        };
    };
  }//END CLS

//END myJSON.js


//START Main.js
var  obj_project, obj_myJson, obj_shared, obj_boot, obj_holder, obj_const, obj_clipboard, obj_path, obj_permitManger, obj_userHome;
var obj_projectTarget;
var obj_projectParent;


obj_shared=new Shared;
obj_myJson=new myJSON(new Object);
obj_boot=new Holder;
obj_holder=new Holder;
obj_const=new Constant;
obj_path=new Path;
obj_userHome=new User();
obj_permitManger=new PermitManager(obj_userHome);


document.addEventListener('DOMContentLoaded', (e) => {
  
  obj_project=new Project(obj_boot);      
  window.obj_project=obj_project;//expose main base object to window scope
  window.name = "vopsys"; 
  obj_project.fn_execute();   

  
  document.body.addEventListener('selectstart', function(e) {e.preventDefault();});  
  
});





//END Main.js


/*type: RunTimeCode//*/
/*END COMPONENT//*/



//END RUNTIME

//START LINKTABLE



//START LINKTABLE

/*START COMPONENT//*/
/*type: form_button//*/

            //XSTART component/form_button
              class form_button extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.obj_holder.bln_listenClick=true;                                                      
                  this.bln_enabled=true;
                }        

                
                fn_onLoad(){    
                  super.fn_onLoad();                                          

                  if(this.fn_hasContextHolderParent()){return;}                      
                }   
                fn_applyThemeStructure(){
                  if(!obj_project.obj_theme){return;}
                  this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formButton;                                                    
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
                }

                fn_expand(){//called by base onload                  
                  this.fn_expandMultiple(1.5);
                }
              
                fn_onSelectStart(e){
                  console.log("fn_onSelectStart");
                  obj_project.fn_forgetEvent(e); 
                }                

                fn_onClick(e){                  
                  
                  if(this.fn_getDomProperty("type")==="submit"){}                  
                  else{
                    obj_project.fn_forgetEvent(e);    
                  }
                }  

                xfn_setStyleProperty(str_name, str_value, str_priority){//n ot sure why this is necessary
                  
                  if(this.dom_obj){this.dom_obj.style.setProperty(str_name, str_value, str_priority);}
              }        
                              

              }//END CLS
              //END TAG
              //END component/form_button
/*type: form_button//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_button_rich//*/
      //XSTART component/form_button_rich
      class form_button_rich extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_setText(str_value){          
          
          super.fn_setText(str_value);          
          
          if(this.obj_design.str_themeType==="form_button"){
            if(obj_project.bln_isMobile){
              
              if(obj_shared.fn_isSmallScreen()){//less than 400              
                if(this.obj_design.str_icon){
                  this.fn_showIcon(this.obj_design.str_icon);                  
                  //str_value="";
                  
                } 
              }
            }
          }

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setText(str_value);          
          }          
        }
        fn_onLoad(){          
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}              
          
          this.fn_showIcon(this.obj_design.str_icon);                    
        }                        

        fn_applyThemeStructure(){      
          if(!obj_project.obj_theme){return;}
          super.fn_applyThemeStructure();          
        }
        fn_setSubDomain(str_value){
          this.obj_design.str_subdomain=str_value;
        }
        fn_getMenuButton(){
                  
          let obj_menuPanel=this.fn_getMenuPanel();
          if(!obj_menuPanel){return;}
          let obj_menuButton=obj_menuPanel.obj_parentMenu;                  
          if(!obj_menuButton){
            console.log("obj_menuButton is not an object");
            return;
          }
          return obj_menuButton;
        }
        fn_getMenuPanel(){
          
          let obj_menuPanel=this.fn_getItemGoNorth("xapp_menu_panel");                  
          if(!obj_menuPanel){
            console.log("obj_menuPanel is not an object");
            return;
          }
          return obj_menuPanel;                  
        }

        fn_setNavigationURL(str_value){
          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setNavigationURL(str_value);          
          }
        }
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_showIcon(str_value){

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          
          if(obj_anchor){                
            obj_anchor.bln_debugButtonDisable=this.bln_debugButtonDisable;
            obj_anchor.fn_showIcon(str_value);                          
          }  
        } 
        
        fn_getText(){

          let str_text;

          str_text=super.fn_getText();          

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            str_text=obj_anchor.fn_getText();          
          }         
          return str_text; 

        }
        
        
        fn_setStyleProperty(str_name, str_value){                          

          let obj_anchor=this.fn_getComponent("form_button_anchor");                             

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);

          switch(str_name){
            case "fontWeight":                                          
            case "color":                                        
            case "fontSize":                           
              this.fn_setControlStyleProperty(obj_anchor, str_name, str_value);
              break;                      
          }
          
          super.fn_setStyleProperty(str_name, str_value);                  

        }
        
        fn_getComputedStyleProperty(str_name){
          
          let obj_anchor=this.fn_getComponent("form_button_anchor");          

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);
          
          switch(str_name){
            case "fontWeight":                                          
            case "color":                            
            case "fontSize":                           
              return this.fn_getControlComputedStyleProperty(obj_anchor, str_name);                            
            default:
              return super.fn_getComputedStyleProperty(str_name);                  
          }
        }  
        ///////////////////////
        ///////////////////////
        ///////////////////////             

      }//END CLS
      //END TAG
      //END component/form_button_rich        
/*type: form_button_rich//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button//*/
      //XSTART component/xapp_button
      class xapp_button extends form_button_rich{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        
      }//END CLS
      //END TAG
      //END component/xapp_button        
/*type: xapp_button//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_console_button//*/

            //XSTART component/console_button
              class xapp_console_button extends xapp_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }                
                fn_configureFromMeta(obj_row){
    
                  if(!obj_row){return;}//can be false at top level  
                            
                  console.log("xapp_console_button fn_configureFromMeta");
                  let obj_metaColumn;        
                  let obj_recordset=obj_row.obj_paramRS.obj_recordset;
                  
                  obj_metaColumn=obj_recordset.fn_getMetaColumnViaFieldName("MetaRowzTitle");
                  if(obj_metaColumn){                              
                    this.fn_setText(obj_metaColumn.str_value);                 
                  } 
                }                 
              }//END CLS
              //END TAG
              //END component/console_button
/*type: xapp_console_button//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_input//*/

            //XSTART component/form_input
              class form_input extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.fn_setIsContainer(false);                                                                       
                  
                }    
                fn_holdEvent(){

                  this.obj_holder.bln_listenFocus=true;        
                  this.obj_holder.bln_listenBlur=true;        
                  this.obj_holder.bln_listenChange=true;
                  this.obj_holder.bln_listenKeyDown=true;
                  this.obj_holder.bln_listenKeyUp=true;        
                  this.obj_holder.bln_listenClick=true;
                  this.obj_holder.bln_listenDblClick=true;
                  this.obj_holder.bln_listenMouseDown=true;
                  this.obj_holder.bln_listenInput=true;
                  this.obj_holder.bln_listenSelectStart=true;
                }
                fn_dropEvent(){

                  this.obj_holder.bln_listenFocus=false;        
                  this.obj_holder.bln_listenBlur=false;        
                  this.obj_holder.bln_listenChange=false;
                  this.obj_holder.bln_listenKeyDown=false;
                  this.obj_holder.bln_listenKeyUp=false;        
                  this.obj_holder.bln_listenClick=false;
                  this.obj_holder.bln_listenDblClick=false;                                    
                  this.obj_holder.bln_listenMouseDown=false;                  
                  this.obj_holder.bln_listenInput=false;
                  this.obj_holder.bln_listenSelectStart=false;
                }
                fn_applyThemeStructure(){                  
                  if(!obj_project.obj_theme){return;}
                  this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formInput;                
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
                }
                fn_onSelectStart(e){
                  //console.log("hit input");
                  obj_project.eventCancelledByChild=false;
                  e.stopPropagation();
                  return true;
                }                                    
                fn_setControlType(str_value){
                  this.fn_setDomProperty("type", str_value);

                }
                fn_onApplyDomSettings(){
                  this.fn_parentEvent("Click", e);                                    

                }
                fn_onApplyFeatures(){                
                  //console.log("fn_onApplyFeatures");
                  //this.fn_notifyParent("fn_onApplyInputFeatures", this);                                    
                }
                fn_onLoad(){    
                  super.fn_onLoad();                                          
                  
                  
                }
                fn_expand(){//called by base onload
                  this.fn_expandMultiple(2);
                }
                
                fn_setText(str_value){    
                  //no need to set text as innerHTML is not supported on input
                  this.fn_setValue(str_value);
                }
                fn_setPlaceholder(str_value){ 
                  str_value+="";    
                  this.fn_setDomProperty("placeholder", str_value);        
                }  
                fn_getPlaceholder(){       
                  return this.fn_getDomProperty("placeholder");        
                }

                fn_onClick(e){             
                  //obj_project.fn_forgetEvent(e);//this will cancel default actions , such as color control and checkbox from operating                       
                  obj_project.fn_calmEvent(e);//stop event bubble, not required , but can help where event is required  on parant form elements                  
                  this.fn_parentEvent("Click", e);
                }
                fn_onDblClick(e){             
                  obj_project.fn_calmEvent(e);                  
                  this.fn_parentEvent("DblClick", e);                  
                }
                fn_onInput(e){                    
                  obj_project.fn_calmEvent(e);                
                  this.fn_parentEvent("Input", e);                  
                }                
                fn_onChange(e){                  
                  obj_project.fn_calmEvent(e);
                  this.fn_setValue(this.dom_obj.value, e);                                                                  
                  this.fn_parentEvent("Change");                  
                }                
                fn_onKeyDown(e){                     
                  obj_project.fn_calmEvent(e);
                  this.fn_parentEvent("KeyDown", e);                  
                }
                fn_onKeyUp(e){                                                                      
                  obj_project.fn_calmEvent(e);
                  this.fn_parentEvent("KeyUp", e);                  
                }
                fn_onMouseDown(e){                                  
                  obj_project.fn_calmEvent(e);
                  this.fn_parentEvent("MouseDown", e);                  
                }
                fn_onFocus(e){                       
                  obj_project.fn_calmEvent(e);                  
                  this.fn_parentEvent("Focus", e);                  
                }
                fn_onBlur(e){     
                  obj_project.fn_calmEvent(e);                  
                  this.fn_parentEvent("Blur", e);
                }

                
              }//END CLS
              //END TAG
              //END component/form_input
/*type: form_input//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: eazygriditem//*/
  class eazygriditem extends component {
    constructor(obj_ini) {
      super(obj_ini); // call the super class constructor
    }  
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);
      
      //START INITIALIZE DESIGN
      //this.fn_setType("eazygriditem");      
      this.fn_setTag("eazygriditem");                  
      
      if(this.obj_design.str_name==undefined){this.obj_design.str_name="My Grid Item";}           

      
      //END  INITIALIZE DESIGN

      //START INITIALIZE STYLE                    
      //END INITIALIZE STYLE        
    }      
    fn_onLoad(){
      super.fn_onLoad();
      //START INITIALIZE STYLE                          
      if(this.fn_getStyleProperty("backgroundColor")===undefined){this.obj_domStyle.backgroundColor="#414141";}      
      if(this.obj_design.str_minDim==undefined){this.obj_design.str_minDim="100px";}      
      if(this.obj_design.gridTemplate==undefined){this.fn_setGridTemplate(1);}                 
      //END INITIALIZE STYLE
    }
    fn_setGridTemplate(int_val){
      this.obj_design.gridTemplate="minmax(" + this.obj_design.str_minDim + ", "+int_val+"fr)";
    }            
    
}//END CLS
//END eazygriditem
/*type: eazygriditem//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: block//*/

      //XSTART component/block
        class block extends component{
          constructor(obj_ini) {      
            super(obj_ini);        
          } 
          fn_initialize(obj_ini){
            super.fn_initialize(obj_ini);                                        
            
          }
        }//END CLS
        //END TAG
        //END component/block
        
/*type: block//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: eazygrid//*/
class eazygrid extends component {
    constructor(obj_ini) {            
      super(obj_ini); // call the super class constructor       
    } 
    fn_initialize(obj_ini){      
      super.fn_initialize(obj_ini);

      //START INITIALIZE DESIGN
      //this.fn_setType("eazygrid");      
      this.fn_setTag("eazygrid");      
      this.fn_requires("eazygriditem");      

      if(this.obj_design.int_axis===undefined){              
        this.obj_design.int_axis=obj_const.int_axisHorizontal;              
      }
      
      if(this.obj_ini.bln_addPaletterItemEvent){
        this.obj_holder.bln_addPaletterItemEvent=obj_ini.bln_addPaletterItemEvent;
      }      
      
            
      if(this.obj_design.bln_eazyGrid===undefined){this.obj_design.bln_eazyGrid=true;}      
      //if(this.obj_design.bln_isLocalHome===undefined){this.obj_design.bln_isLocalHome=true;}      
      
      if(this.obj_design.str_minDim==undefined){this.obj_design.str_minDim="100px";}      
      if(this.obj_design.str_gridTemplateDefault==undefined){this.obj_design.str_gridTemplateDefault="minmax(" + this.obj_design.str_minDim + ", 1fr)";}
      
      //END  INITIALIZE DESIGN
      
      
    }

    fn_applyThemeStructure(){
      if(!obj_project.obj_theme){return;}
      this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_xappAccordion;                                                          
      this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy      
    }
    fn_applyStyle(obj_style){
      super.fn_applyStyle(obj_style);
      //START INITIALIZE STYLE                          
      this.obj_domStyle.display="grid";
      if(this.obj_domStyle.height===undefined){this.obj_domStyle.height="100%";}
      if(this.obj_domStyle.width===undefined){this.obj_domStyle.width="100%";}
      if(this.obj_domStyle.padding===undefined){this.obj_domStyle.padding="0px";}      
      if(this.obj_domStyle.overflow==undefined){this.obj_domStyle.overflow="hidden";} 
      //if(this.fn_getStyleProperty("backgroundColor")===undefined){this.obj_domStyle.backgroundColor="#2b2c34";}     
      if(this.fn_getStyleProperty("grid-gap")===undefined){this.fn_setStyleProperty("grid-gap", "1.0em");}
      if(this.fn_getStyleProperty("grid-auto-rows")===undefined){this.fn_setStyleProperty("grid-auto-rows", this.obj_design.str_gridTemplateDefault);}
      if(this.fn_getStyleProperty("grid-auto-columns")===undefined){this.fn_setStyleProperty("grid-auto-columns", this.obj_design.str_gridTemplateDefault);}
      if(this.fn_getStyleProperty("grid-template-rows")===undefined){this.fn_setStyleProperty("grid-template-rows", this.obj_design.str_gridTemplateDefault);}
      if(this.fn_getStyleProperty("grid-template-columns")===undefined){this.fn_setStyleProperty("grid-template-columns", this.obj_design.str_gridTemplateDefault);}                 
      //END INITIALIZE STYLE
    }
    fn_beforeAddChildren(){      

      //if this doesnt work, its likely because the palette easygrid object was saved with inti_axis=1. It should be undefined.
      //to do this nk of betting way f indicating this is a palette add, as opposed to a saved object add.                  
      
      
      if(this.obj_holder.bln_addPaletterItemEvent){              
        
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
          let obj_container=obj_parent.fn_getParentComponent();
          if(obj_container && obj_container.obj_design.str_type==="eazygrid"){
              let int_value=obj_container.obj_design.int_axis;
              this.obj_design.int_axis=obj_shared.fn_flipOrientation(int_value);
          }
        }
      }            
    }    
    
    fn_addItem(obj_ini){
      //console.log("fn_addItem");
      let obj_item;        
      if(obj_ini.obj_design.str_type===undefined){
        obj_ini.obj_design.str_type="eazygriditem";
      }       
      
      obj_item=super.fn_addItem(obj_ini)//CallSuper

      this.fn_applyFeatures();
      return obj_item;
    }
    
    fn_getIsEmpty(){
      let arr, obj_item;
      arr=this.obj_design.arr_item;
      if(arr.length>1){
        console.log("arr.length>1")
        return false;
      }
      if(!arr.length){        
        return true;
      }
      obj_item=arr[0];
      if(obj_item.fn_getType()!=="eazygriditem"){
        console.log("obj_item !==eazygriditem")
        return false;
      }
      if(obj_item.obj_design.arr_item.length){
        console.log("(obj_item.obj_design.arr_item.length is true")
        return false;
      }
      return true;
    }
      
      
    
    fn_bootChildren(){//only in boot/pallteItem phase
      
      console.log("fn_bootChildren");
      
      let obj_ini;
      
      
      if(this.obj_design.bln_eazyGrid){        
        
        obj_ini=new Holder;                             
        //obj_ini.obj_domStyle.backgroundColor=obj_shared.fn_getRandomColor();                                
        this.fn_addItem(obj_ini);//BootItem     
      
        obj_ini=new Holder;                             
        //obj_ini.obj_domStyle.backgroundColor=obj_shared.fn_getRandomColor();                        
        this.fn_addItem(obj_ini);//BootItem                
      }    
    }        
    
    fn_compileTemplate(){      

      this.obj_domStyle.gridTemplateRows=this.obj_design.str_gridTemplateDefault;
      this.obj_domStyle.gridTemplateColumns=this.obj_design.str_gridTemplateDefault;     

      if(this.obj_design.int_axis===undefined){        
        return;
      }
      
      let obj_item;
      let s="";            
      this.obj_design.arr_item.forEach(obj_item => {                
        if(obj_item.obj_design.gridTemplate){
          s+=obj_item.obj_design.gridTemplate;        
          s+=" ";
        }
      });      


      if(s){
        s=s.trim();
      }

      //console.log(" eazygrid s: " + s);      

      switch(this.obj_design.int_axis){
            case(obj_const.int_axisVertical):            
              this.obj_domStyle.gridTemplateColumns=s;              
            break;
            case(obj_const.int_axisHorizontal):            
              this.obj_domStyle.gridTemplateRows=s;
            break;
            default:              
      }      
      if(this.bln_debug){
        let s_debug;
        s_debug="fn_compileTemplate"  +"\n";        
        s_debug+="str_gridTemplateRows: " + this.obj_domStyle.gridTemplateRows  +"\n";
        s_debug+="str_gridTemplateColumns: " + this.obj_domStyle.gridTemplateColumns +"\n";
        //console.log(s_debug);        
      }      
    }
    
    fn_applyFeatures(){
      this.fn_compileTemplate();           
      super.fn_applyFeatures();      
    }    
    
}//END CLS
//END eazygrid
/*type: eazygrid//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_button_anchor//*/
      //XSTART component/form_button_anchor
      class form_button_anchor extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                  

          obj_project.fn_forgetEvent(e);    
          //foregetevent                

          this.fn_parentEventBubble("Click", e);//this causes things to happen                            
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_onLoad(){
          super.fn_onLoad();
          this.obj_icon=this.fn_getComponent("form_button_icon");                              
          this.obj_span=this.fn_getComponent("form_button_span");          
        }                
        fn_setNavigationURL(str_value){                    
          this.fn_setDomProperty("href", str_value);
        }        

        
        fn_showIcon(str_value){

          let bln_debug=false;          
          
          switch(str_value){                        
              case "":                         
              case "rowz_icon_blank":                         
              //str_value="blank";
              str_value='<svg width="0px" height="24px"></svg>';
              break;              
              case "xapp_xdezign":
              //brush
              str_value="brush";
              break;
              case "xdezign_project":
              //str_value="flowchart";
              str_value='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M600-160v-80H440v-200h-80v80H80v-240h280v80h80v-200h160v-80h280v240H600v-80h-80v320h80v-80h280v240H600Z"/></svg>';                            
              break;              
              case "xdezign_tag":
              str_value="sell";
              break;         
              case "xdezign_map":
              str_value="map";
              break;         
              case "xapp_desk":            
              str_value="chair";
              break;
              case "xapp_lock":
              str_value="lock";
              break;                     
              case "xapp_rowz":
              str_value="tag";
              break;        
              case "xapp_office":
              //str_value="trophy";
              str_value='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z"/></svg>';
              break;
              case "rowz_activity":
              str_value="alternate_email";
              break;
              case "rowz_contact":
              //str_value="contacts_product" //not correctly hosted
              str_value='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M185-80q-17 0-29.5-12.5T143-122v-105q0-90 56-159t144-88q-40 28-62 70.5T259-312v190q0 11 3 22t10 20h-87Zm147 0q-17 0-29.5-12.5T290-122v-190q0-70 49.5-119T459-480h189q70 0 119 49t49 119v64q0 70-49 119T648-80H332Zm148-484q-66 0-112-46t-46-112q0-66 46-112t112-46q66 0 112 46t46 112q0 66-46 112t-112 46Z"/></svg>';
              break;
              case "rowz_hashtag":
              str_value="tag";
              break;
              case "rowz_tag":
              str_value="sell";
              break;
              case "rowz_upload_file":
              str_value="upload_file";
              break;              
              case "rowz_template":
              str_value="star";
              break;
              case "rowz_account":
              str_value="attach_money";
              break;
              case "rowz_opportunity":
              str_value="trending_up";              
              break;
              case "rowz_task":              
              str_value="attach_file";              
              break;
              case "xapp_linkon":  
              str_value="link";   
              break;            
              case "xapp_linkoff":  
              str_value="link_off";   
              break;            
              case "xapp_top":  
              str_value="arrow_upward";   
              break;   
              case "xapp_chevron_left":  
              str_value="chevron_left";   
              break;                 
              case "xapp_chevron_right":  
              str_value="chevron_right";   
              break;                 
              case "xapp_refresh":  
              str_value="refresh";   
              break;              
              case "xapp_settings":  
              str_value="settings";   
              break;     
              case "xapp_star":  
              str_value="star";   
              break;
              case "xapp_wrench":  
              str_value="build";   
              break;              
              case "xapp_visibility_off":  
              str_value="visibility_off";   
              break;              
              case "xapp_visibility_on":  
              str_value="visibility";   
              break;  
              case "xapp_calendar_month":  
              str_value="calendar_month";   
              break;  
              case "xapp_search":  
              str_value="search";   
              break;
              case "xapp_circle_plus":  
              str_value="circle_plus";   
              break;              
              case "xapp_send":  
              str_value="send";   
              break;              
              case "xapp_key":  
              str_value="key";   
              break;            
              case "xapp_add":  
              str_value="add";   
              break;            
              
              
            default:
              str_value=str_value;
          }
          
          if(str_value){                                                    
            
            this.obj_icon.fn_setText(str_value);                                                
            this.obj_icon.fn_setClassName("material-icons");                                                                      
            this.obj_icon.fn_setDisplay(true); 
            if(bln_debug){
              this.obj_icon.fn_debug();
            }                                 
            
            /*
            this.obj_icon.fn_setDisplay(true);          
            this.obj_icon.fn_setFontSize("100px");          
            this.obj_icon.fn_setStylePropertxy("height", "200px");                                  
            //*/
            
          }         
          else{
            this.fn_showIcon("rowz_icon_blank");                                    
          }
          if(bln_debug){
            this.fn_debug();
          }

        }  
        fn_setText(str_value){ 
          
          if(str_value=="notset"){
            str_value="";
          }          
          
          if(str_value){                                                    
            this.obj_span.fn_setText(str_value);
            this.obj_span.fn_setDisplay(true);          
          }         
          else{
            this.obj_span.fn_setDisplay(false);
          }
        }
        fn_getText(){
          let str_text;          
          str_text=this.obj_span.fn_getText();                    
          return str_text;
        }
        
        
        fn_setStyleProperty(str_name, str_value){          

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);          
          
          switch(str_name){
            case "fontSize":                                        
              this.fn_setControlStyleProperty(this.obj_span, str_name, str_value);
              this.fn_setControlStyleProperty(this.obj_icon, str_name, "1.5em");//note: 1.5em relative to parent container
              break;
            case "color":                            
            case "fontWeight":                                                    
              this.fn_setControlStyleProperty(this.obj_span, str_name, str_value);
              this.fn_setControlStyleProperty(this.obj_icon, str_name, str_value);            
              break;
            default:              
          }   
          super.fn_setStyleProperty(str_name, str_value);              
        }
        fn_getStyleProperty(str_name){

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);
        
          switch(str_name){
            case "fontWeight":                                          
            case "color":                            
            case "fontSize":                            
              return this.fn_getControlStyleProperty(this.obj_span, str_name);
            default:
              return super.fn_getStyleProperty(str_name);                  
          }
        }
        fn_getComputedStyleProperty(str_name){

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);
          
          switch(str_name){
            case "fontWeight":                                          
            case "color":                            
            case "fontSize":                                     
              return this.fn_getControlComputedStyleProperty(this.obj_span, str_name);              
            default:
              return super.fn_getComputedStyleProperty(str_name);                  
          }
        }
        ///////////////////////
        ///////////////////////
        ///////////////////////
      }//END CLS
      //END TAG
      //END component/form_button_anchor        
/*type: form_button_anchor//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_button_icon//*/
      //XSTART component/form_button_icon
      class form_button_icon extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                          
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_setStyleProperty(str_name, str_value){          
          
          super.fn_setStyleProperty(str_name, str_value);

          const svgElement =this.dom_obj.querySelector('svg');
          //font awesome will nest a new svg tag into the icon i element
          //this is only seen in the HTML after program execution breaks , for eaxmampel after the first trip to the server.
          if(svgElement){            
            svgElement.style.setProperty(str_name, str_value);
          }
          else{
            //this is generally the case, surprisingly
            //console.log("no font awsome svg");            
          }
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////          
      }//END CLS
      //END TAG
      //END component/form_button_icon        
/*type: form_button_icon//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_button_span//*/
      //XSTART component/form_button_span
      class form_button_span extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        ///////////////////////
        ///////////////////////
        ///////////////////////
        
        ///////////////////////
        ///////////////////////
        ///////////////////////
      }//END CLS
      //END TAG
      //END component/form_button_span        
/*type: form_button_span//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_field//*/

            //XSTART component/form_field
              class form_field extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }  
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("gray");}                                    
                }                
                fn_onChildClick(e){                                                      
                  
                  this.fn_parentEvent("Click", e);

                                    
                  this.fn_unsetEvent();
                }  
                fn_onChildDblClick(e){                                                      
                  
                  this.fn_parentEvent("DblClick", e);
                  this.fn_unsetEvent();
                }                                                 
                fn_onChildMouseUp(e){
                  this.fn_parentEvent("MouseUp", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildMouseDown(e){
                  this.fn_parentEvent("MouseDown", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildMouseEnter(e){                                                                                          
                  this.fn_parentEvent("MouseEnter", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildMouseLeave(e){                                                                                          
                  this.fn_parentEvent("MouseLeave", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildFocus(e){                                                                                          
                  this.fn_parentEvent("Focus", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildInput(e){                                                                                          
                  this.fn_parentEvent("Input", e);
                  this.fn_unsetEvent();
                }                  
                fn_onChildChange(e){                                   
                  this.fn_parentEvent("Change", e);
                  this.fn_unsetEvent();
                }
                fn_onChildKeyDown(e){     
                  this.fn_parentEvent("KeyDown", e);
                  this.fn_unsetEvent();
                }
                fn_onChildKeyUp(e){                                  
                  //console.log("Form Field KeyUp keyCode: " + e.keyCode);                           

                                    
                  this.fn_parentEvent("KeyUp", e);

                                    
                  this.fn_unsetEvent();
                }
                fn_onChildBlur(e){                               
                                    
                  this.fn_parentEvent("Blur", e);

                                    
                  this.fn_unsetEvent();
                }
                
              }//END CLS
              //END TAG
              //END component/form_field
/*type: form_field//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_fieldset//*/
//XSTART component/form_fieldset
class form_fieldset extends component{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                
    this.obj_design.lockOpen=true;
  }
  fn_onLoad(){
    super.fn_onLoad();
    if(this.fn_hasContextHolderParent()){return;}    
    this.obj_formLegend=this.fn_addContextItem("form_legend");
    this.bln_toggleState=true;
    
    this.obj_themeItemSection=this.fn_getThemeObject("form_section");    
    this.fn_setStyleProperty("overflow", "hidden");                      
    this.fn_setStyleProperty("margin", "0px");                      
  }
  fn_applyThemeStructure(){                        
    if(!obj_project.obj_theme){return;}
    this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formFieldset;                
    this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy                          
  }
  fn_onRowMember(obj_row){

    this.obj_row=obj_row;                  
    this.obj_paramRow=this.obj_row.obj_paramRow;                                    
    this.obj_paramRS=this.obj_paramRow.obj_paramRS;                                                       
    
    this.fn_setStyleProperty("display", "flex");
    this.fn_setStyleProperty("flex-wrap", "wrap");
    this.fn_setAxis(this.obj_paramRS.bln_axisFieldset);
    

  }
  
  fn_setText(str_value){         
    if(this.fn_hasContextHolderParent()){return;}    
    if(!this.obj_formLegend){return;}    
    this.obj_formLegend.fn_setText(str_value);                           
  }  
  fn_legendOnClick(){    
    
    if(this.obj_design.lockOpen){
      return;
    }               
    this.fn_toggleLegend();        
  }

  fn_toggleLegend(){       
    
    let bln_value=this.bln_toggleState;
    if(!bln_value){
      this.fn_open();             
    }
    else{
      this.fn_close();                    
    }
  }

  fn_open(){    

    let obj_themeItem=this.obj_themeItemSection;
    if(obj_themeItem){      
      this.fn_setStyleProperty("border", obj_themeItem.fn_getStyleProperty("border"));    
      this.fn_setStyleProperty("boxShadow", obj_themeItem.fn_getStyleProperty("boxShadow"));    
      this.fn_setStyleProperty("padding", obj_themeItem.fn_getStyleProperty("padding"));
      this.fn_setStyleProperty("backgroundColor", obj_themeItem.fn_getStyleProperty("backgroundColor"));
    }        
    
    

    this.bln_toggleState=true;    
    this.fn_setDisplayChildren(true);
  }  
  
  fn_close(e){        
    
    this.fn_setStyleProperty("border", "none");          
    this.fn_setStyleProperty("boxShadow", "none");    
    this.fn_setStyleProperty("paddingTop", "0px");            
    this.fn_setStyleProperty("paddingBottom", "0px");               
    this.fn_setStyleProperty("backgroundColor", "transparent");

    this.bln_toggleState=false;            
    this.fn_setDisplayChildren(false);    
    
  }  

  fn_setDisplayChildren(bln_value){   

    let arr_item, obj_item;
    arr_item=this.obj_design.arr_item;
    
    for(let i=1;i<arr_item.length;i++){                    
      obj_item=arr_item[i];      
      if(bln_value && obj_item.fn_getHiddenPin()){
        continue;
      }
      obj_item.fn_setDisplayFlex(bln_value);      
    }
  }

  fn_getMenuPanel(){
                      
    let obj_menuPanel=this.fn_getItemGoNorth("xapp_menu_panel");                  
    if(!obj_menuPanel){
      console.log("obj_menuPanel is not an object");
      return;
    }
    return obj_menuPanel;                  
  }  
  
}//END CLS
//END TAG
//END component/form_fieldset        
/*type: form_fieldset//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_form//*/

            //XSTART component/form_form
              class form_form extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                }                

                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                      
                  
                  this.obj_holder.bln_listenSubmit=true;
              }    

              fn_onSubmit(e){                              

                //alert("form fn_onSubmit: " + e.type);
                obj_project.fn_forgetEvent(e);                
                this.fn_parentEventBubble("Submit", e);//this causes things to happen                  
              }
              }//END CLS
              //END TAG
              //END component/form_form
/*type: form_form//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_hardrule//*/
      //XSTART component/form_hardrule
      class form_hardrule extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_applyThemeStructure(){                              
          if(!obj_project.obj_theme){return;}
          this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formHardRule;                
          this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy                                
        }
      }//END CLS
      //END TAG
      //END component/form_hardrule        
/*type: form_hardrule//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_label//*/

            //XSTART component/form_label
              class form_label extends form_input{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                 
                }
                fn_holdEvent(){
                  super.fn_dropEvent();
  
                  this.obj_holder.bln_listenClick=true;
                  this.obj_holder.bln_listenMouseEnter=true;
                  this.obj_holder.bln_listenMouseLeave=true;
                  this.obj_holder.bln_listenMouseUp=true;
                  this.obj_holder.bln_listenMouseDown=true;                  
                }

                fn_setText(str_value){
                  this.fn_setDomProperty("innerHTML", str_value);                                      
                }

                fn_onLoad(){
                  super.fn_onLoad();                                                      
                }
                fn_applyThemeStructure(){                                                        
                  if(!obj_project.obj_theme){return;}
                  this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formLabel;                
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
                }

                fn_setUnLocked(){
                  this.bln_locked=false;
                  this.fn_setStyleProperty('cursor', 'pointer');                  
                }
                fn_setLocked(){
                  if(this.bln_locked){return;}
                  this.bln_locked=true;
                  this.fn_setStyleProperty('cursor', 'default');                  
                }
                fn_getLocked(){
                  return this.bln_locked;
                }
                fn_onClick(e){                  
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("Click", e);
                }
                fn_onMouseUp(e){        
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseUp", e);
                }
                fn_onMouseDown(e){        
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseDown", e);
                }
                fn_onMouseEnter(e){        
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseEnter", e);
                }
                fn_onMouseLeave(e){         
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseLeave", e);
                }
                
              }//END CLS
              //END TAG
              //END component/form_label
/*type: form_label//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_legend//*/
      //XSTART component/form_legend
      class form_legend extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.bln_listenClick=true;                  
          this.obj_holder.bln_listenKeyUp=true;                  
          
        }

        fn_onLoad(){          
          super.fn_onLoad();
          this.fn_setDomProperty("tabIndex", "0");
          this.fn_setStyleProperty("userSelect", "none");
          this.fn_setStyleProperty("opacity", "1");          
        }

        fn_applyThemeStructure(){                              
          if(!obj_project.obj_theme){return;}
          this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formLegend;                
          this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy                      
        }

        

        fn_onClick(e){                            
          this.fn_fireLegend(e);  
        }
        fn_onKeyUp(e){      
          
          if(e.key==="Enter"){
            this.fn_fireLegend(e);  
          }

          
        }
        fn_fireLegend(e){
          //console.log("xxxxRebbit");                                    
          
          
          obj_project.fn_forgetEvent(e);    

          let obj_parent=this.fn_getParentComponent();          
          this.fn_notify(obj_parent, "fn_legendOnClick", this);                                  
        }
      }//END CLS
      //END TAG
      //END component/form_legend        
/*type: form_legend//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_menu_panel//*/
      //XSTART component/form_menu_panel
      class form_menu_panel extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_getDebugPin()){this.fn_highlightBorder("black");}                       
        }
        fn_addConsoleContainer(str_consoleContainer, bln_side){                                    
          let obj_item=this.obj_console.fn_addConsoleContainer(str_consoleContainer, bln_side);                    
          return obj_item;
          //this.obj_console.fn_debug();
        }
        fn_disableConsole(){
          this.obj_console.fn_disable();
        }
        fn_hideConsole(){
          this.obj_console.fn_hide();
        }
        fn_getConsoleContainer(str_consoleContainer){
          let obj_item=this.obj_console.fn_getConsoleContainer(str_consoleContainer);
          return obj_item;
          //this.obj_console.fn_debug();
        }
      }//END CLS
      //END TAG
      //END component/form_menu_panel        
/*type: form_menu_panel//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_panel//*/

            //XSTART component/form_panel
              class form_panel extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("purple");}                  
                }                       

                fn_onRowMember(obj_row){                         

                  this.obj_row=obj_row;                  
                  this.obj_paramRow=this.obj_row.obj_paramRow;                                    
                  this.obj_paramRS=this.obj_paramRow.obj_paramRS;                                                       
                  
                  this.fn_setStyleProperty("display", "flex");
                  this.fn_setStyleProperty("flex-wrap", "wrap");
                  this.fn_setAxis(this.obj_paramRS.bln_axisPanel);                                                                                          
                }
              }//END CLS
              //END TAG
              //END component/form_panel
/*type: form_panel//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_span//*/

            //XSTART component/form_span
              class form_span extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                    
                }                
                fn_onClick(e){   
                  obj_project.fn_forgetEvent(e);    
                }                  
                
              }//END CLS
              //END TAG
              //END component/form_span
/*type: form_span//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_text//*/
      //XSTART component/form_text
      class form_text extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          
        }
        fn_holdEvent(){
          super.fn_dropEvent();

          this.obj_holder.bln_listenSelectStart=true;                                    
        }
        fn_applyThemeStructure(){                    
          if(!obj_project.obj_theme){return;}
          super.fn_applyThemeStructure();
        }
        fn_onSelectStart(e){                                    
          obj_project.fn_calmEvent(e);
        }                
        fn_setText(str_value){
          if(str_value===""){    
            str_value="&nbsp;";//if blank will cause display issue
          } 
          this.fn_setDomProperty("innerHTML", str_value);                                      
      }
      }//END CLS
      //END TAG
      //END component/form_text        
/*type: form_text//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: panel//*/
class panel extends component {
  constructor(obj_ini) {
    super(obj_ini); // call the super class constructor
  }    
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);    
  }  

}//END CLS
//END PANEL

/*type: panel//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_accordion//*/

            //XSTART component/xapp_accordion
              class xapp_accordion extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                  
                  // this.fn_extends("component");            

                  //START INITIALIZE STYLE              
                  if(this.obj_domStyle.width===undefined){this.obj_domStyle.width="100%";}            
                  //if(this.obj_domStyle.padding===undefined){this.obj_domStyle.paddingBottom="0px";}
                  if(this.obj_domStyle.display===undefined){this.obj_domStyle.display="block";}                                   
                }
                fn_onLoad(){    
                  super.fn_onLoad();                                    
                }
                fn_applyThemeStructure(){                        
                  if(!obj_project.obj_theme){return;}
                  this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_xappAccordion;                  
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy                                            
                }

                fn_addItem(obj_ini=false){
                  let obj_item;        
                  if(!obj_ini){
                    obj_ini=new Holder;
                    obj_ini.obj_design.str_type="menu_button";                                       
                    obj_ini.obj_domStyle.flexDirection="row";           
                      obj_ini.obj_domStyle.flexWrap="wrap";                  
                  }      
                  obj_item=super.fn_addItem(obj_ini);//CallSuper                                              
                  return obj_item;
                }
              
                //START COMPONENTEVENT HANDLING                
                fn_open(){
                    this.fn_openParent();
                }
                fn_close(){
                    this.fn_closeLevel();
                    this.fn_displayOnLevel();                    
                }                                  
                fn_openParent(){        
                    let obj_container=this.fn_getParentComponent();        
                    let str_method="fn_open";        
                    if(obj_container && obj_container[str_method]){
                        obj_container[str_method]();
                    }              
                }
                fn_hasOpenChild(obj_exclude, bln_ignoreBefore){                  
                  let bln_seen=false;                  
                    for(var i=0;i<this.obj_design.arr_item.length;i++){
                        let obj_item=this.obj_design.arr_item[i];
                        if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}
                        if(obj_item && obj_item!==obj_exclude){                                                    
                            if(obj_item.fn_getIsOpen()){                              
                              return true;
                            }
                        }              
                    }
                    return false;

                }             
                fn_closeChildren(){
                  
                }
                fn_closeLevel(obj_exclude, bln_ignoreBefore ){                  
                  let str_method="fn_close";        
                  let bln_seen=false;
                    for(var i=0;i<this.obj_design.arr_item.length;i++){
                        let obj_item=this.obj_design.arr_item[i];
                        if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}
                        if(obj_item && obj_item!==obj_exclude && obj_item[str_method]){
                            if(!obj_item.obj_design.bln_isPinned){                              
                                obj_item[str_method]();
                            }
                        }              
                    }
                }                
                fn_hideLevel(obj_exclude, bln_ignoreBefore){                                    
                  this.fn_notifyChildren("fn_interfaceHide", obj_exclude, bln_ignoreBefore);                  
                }
                fn_showLevel(obj_exclude, bln_ignoreBefore){                                  
                  this.fn_notifyChildren("fn_interfaceShow", obj_exclude, bln_ignoreBefore);                  
                }
                fn_displayOnLevel(obj_exclude, bln_ignoreBefore){                  
                  this.fn_notifyChildren("fn_displayOn", obj_exclude, bln_ignoreBefore);                  
                }                
                fn_displayOffLevel(obj_exclude, bln_ignoreBefore){                  
                  this.fn_notifyChildren("fn_displayOff", obj_exclude, bln_ignoreBefore);                  
                }                                

                fn_autoOpen(obj_exclude, bln_ignoreBefore){
                  //let str_method="fn_open";
                  let str_method="fn_toggle";                  
                  let bln_seen=false;
                  for(var i=0;i<this.obj_design.arr_item.length;i++){
                    let obj_item=this.obj_design.arr_item[i];
                    if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}                             
                    if(obj_item && obj_item!==obj_exclude && obj_item[str_method] && obj_item.fn_getAutoOpenPin()){                        
                        obj_item[str_method]();                                            
                    }                                      
                  }
                }
                fn_notifyChildren(str_method, obj_exclude, bln_ignoreBefore){                  
                  let bln_seen=false;
                  let arr_item=this.obj_design.arr_item;
                  for(var i=0;i<arr_item.length;i++){
                    let obj_item=arr_item[i];
                    if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}                             
                    if(obj_item && obj_item!==obj_exclude && obj_item[str_method]){                        
                        obj_item[str_method]();                    
                    }                                      
                  }
                }
              }//END CLS
              //END TAG
              //END component/xapp_accordion
/*type: xapp_accordion//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_rowz//*/
      //XSTART component/xapp_button_navigate_rowz
      class xapp_button_navigate_rowz extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){    
                                        
          obj_path.fn_navigateSubdomain("desk");
          obj_project.fn_forgetEvent(e);    
        }                
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_rowz        
/*type: xapp_button_navigate_rowz//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_theme//*/

//XSTART component/xapp_theme
class xapp_theme extends component{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                           
    
    if(this===obj_project){
      this.fn_setDisplay(true);
    }
    else{
      this.fn_setDisplay(false);
    }
  }  
  fn_onLoad(){
    super.fn_onLoad();                                        
  
    //some code requires themeobjects empty or not
    if(obj_project.fn_isTheme()){
      return;
    }
    
    this.bln_debug=true;  
    
    this.fn_setUserTheme();
    this.fn_setThemeItem();

    if(this.bln_debug){
      this.fn_logThemeSummary();    
    }
  }
  //START THEME HANDLER
  
  fn_setUserTheme(){    

    if(obj_project.fn_isTheme()){//dont run when editing theme
      return;
    }
    this.obj_base=new Object;
    const obj_base=this.obj_base;

    //https://convertingcolors.com/hex-color-A52A2A.html?search=brown
    //https://coolors.co/palettes/trending
    //https://imagecolorpicker.com/
    //coolors affiliate link https://coolors.co/?ref=6754517d5fa59e000b79f378   

    /////////////////////////////////////////
    /////////////////////////////////////////
    //THEME      
    //STRUCTURE             
    obj_base.display="flex";        
    obj_base.padding="1em";        
    obj_base.gap="1em";    
    //STRUCTURE    
    
    //OPTION                      
    obj_base.str_borderStyle="solid";//user session                        
    obj_base.str_borderSize="none";                 
    obj_base.str_borderRadiusSize="medium";//set to none for square
    obj_base.str_deviderSize="none";      
    obj_base.str_fontSize="medium";                            
    //OPTION                  
    //THEME
    /////////////////////////////////////////
    /////////////////////////////////////////        

    //Load Border and Radius Option
    obj_base.bln_borderDisplay=false;
    obj_base.bln_borderRadiusDisplay=false;      
    this.fn_setBorderDisplay();      
    this.fn_setBorderRadiusDisplay();
    obj_base.bln_borderRowz=false;  
    obj_base.bln_borderRadiusRowz=false;  
    obj_base.bln_borderButton=true;
    obj_base.bln_borderRadiusButton=true;
    obj_base.bln_borderSearch=true;  
    obj_base.bln_borderRadiusSearch=true;  
    obj_base.bln_borderFieldset=true;
    obj_base.bln_borderRadiusFieldset=true;
    obj_base.bln_borderLegend=true;
    obj_base.bln_borderRadiusLegend=true;
    obj_base.bln_borderLabel=true;
    obj_base.bln_borderRadiusLabel=true;
    obj_base.bln_borderInput=true;
    obj_base.bln_borderRadiusInput=true;
    //Load Border and Radius Option

    obj_base.str_highLightFill="orange";     

    //get darker
    //opaque
    //high contrast
    //2 base,border,form
    let str_gradientUser=`{
      "str_name":"steelblue",
      "bln_transparent":false,  
      "bln_lighten":false,
      "bln_contrast":true,
      "int_fillSpread":2,
      "bln_matchFillSearch":true,
      "bln_matchFillTextInput":false
    }`;  

    this.bln_saved=true;    
    if(!this.bln_saved){              
      /////////////////////MOVE TO EDIT SCREEN    
      const obj_gradientUser={
        str_name:"green",      
        bln_transparent:obj_shared.fn_getRandomBool(),             
        bln_lighten:obj_shared.fn_getRandomBool(),      
        bln_contrast:obj_shared.fn_getRandomBool(),      
        int_fillSpread:obj_shared.fn_getRandomInt(1, 6),
        bln_matchFillSearch:true,
        bln_matchFillTextInput:false
      };
      str_gradientUser=JSON.stringify(obj_gradientUser);    
      //SAVE TO DB
      /////////////////////MOVE TO EDIT SCREEN    
    }  

    //CREATE GRADIENT  
    const obj_gradientUser=JSON.parse(str_gradientUser);
    const obj_gradient=this.fn_getColorGradient(obj_gradientUser);//generate array of hsl colors            
    obj_base.obj_gradient=obj_gradient;
    //CREATE GRADIENT
    

    obj_gradient.str_fillTextUI="white";                                
    obj_gradient.str_fillTextInput="black";
    obj_gradient.str_fillInput="white";        
    obj_gradient.str_fillSearch="white";          
    
    this.fn_setFillPalette();//we can choose to lighten, or darken based on wether the main color is light or dark
    this.fn_setFillArea();//we can choose which areas are lighter or darker  
    this.fn_setFillOption();//we can choose which areas are lighter or darker   
    this.fn_calculateFontSize();                    
  }
  fn_getColorGradient(obj_gradientUser){  

    let obj_gradient;    
    obj_shared.fn_setColorList();    
    obj_shared.fn_groupColorList();
    let str_name=obj_gradientUser.str_name;
    //str_name=obj_shared.fn_getRandomColorName();
    let obj_color=obj_shared.fn_getColorNameValue(str_name);        
    if(!obj_color.str_value){
      obj_color=obj_shared.fn_getColorNameValue("gray");      
    }
    obj_gradient=obj_shared.fn_getGradientObjectFromArray(obj_color.str_value, obj_color.str_name);          
    obj_gradient.int_alpha=1;
    if(obj_gradientUser.bln_transparent){obj_gradient.int_alpha=0.2;}
    obj_gradient=obj_shared.fn_getGradientObjectFromGradient(obj_gradient, obj_color.str_name);                  
    obj_gradient.str_fill=obj_gradient.str_hsla;//v important, this is when it is defined
    obj_gradient.bln_transparent=obj_gradientUser.bln_transparent;
    obj_gradient.bln_lighten=obj_gradientUser.bln_lighten;  
    obj_gradient.bln_contrast=obj_gradientUser.bln_contrast;
    obj_gradient.int_fillSpread=obj_gradientUser.int_fillSpread;
    obj_gradient.bln_matchFillSearch=obj_gradientUser.bln_matchFillSearch;
    obj_gradient.bln_matchFillTextInput=obj_gradientUser.bln_matchFillTextInput;
    return obj_gradient;
  }

  
  fn_setFillPalette(){  

    const obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;

    this.fn_boundFillLighten();

    let obj_shade, obj_contrast;
    let int_percentLight, int_percentContrast;
    int_percentLight=10;
    int_percentContrast=5;  

    int_percentLight=10;
    int_percentContrast=5;  
    if(obj_gradient.bln_contrast){
      int_percentLight=15;
      int_percentContrast=10;      
    }  
    let int_totalLight=(int_percentLight+(int_percentLight+int_percentContrast));
    obj_base.int_percentLight=int_percentLight;
    obj_base.int_percentContrast=int_percentContrast;
    obj_base.int_totalLight=int_totalLight;

    obj_base.int_min=0;
    obj_base.int_max=100;
    if(obj_gradient.bln_lighten){//due to getting lighter    
      obj_base.int_min=0;
      obj_base.int_max=(100-int_totalLight);//due to getting darker
    }
    else{    
      obj_base.int_min=0+int_totalLight;
      obj_base.int_max=100;//due to getting darker
    }
    obj_base.bln_filterPass=this.fn_filterGradientLight();        
    if(!obj_base.bln_filterPass){
      obj_gradient.str_fillBase="hsla(0, 0%, 50%, 1)";
      obj_gradient.str_fillForm="hsla(0, 0%, 65%, 1)";
      obj_gradient.str_fillBorder="hsla(0, 0%, 85%, 1)";  
      return;
    }

    obj_contrast={    
      int_percentHue:0,
      int_percentSaturation:0,
      int_percentLight:int_percentLight,
    }  

    //FILL 1
    obj_shade=new Object;    
    obj_shade.str_hsla=obj_gradient.str_hsla;//use fill1 as starting point  
    obj_shade.bln_value=obj_gradient.bln_lighten;  
    obj_shared.fn_assignProperty(obj_shade, obj_contrast);    
    obj_gradient.str_fill_1=obj_shared.fn_getShade(obj_shade);      
    //FILL 1            

    //FILL 2
    obj_contrast.int_percentLight=(int_percentLight+int_percentContrast);//10 percent more than fill 1    
    obj_shade.str_hsla=obj_gradient.str_hsla;//use fill1 as starting point
    obj_shared.fn_assignProperty(obj_shade, obj_contrast);    
    
    obj_gradient.str_fill_2=obj_shared.fn_getShade(obj_shade);                
    //FILL 1

    obj_base.bln_filterPass=true;  
  }

  fn_filterGradientLight(){        

    let obj_base=this.obj_base;
    
    let int_value=obj_base.obj_gradient.int_light;  
    let bln_value=obj_shared.fn_filterValue(int_value, obj_base.int_min,obj_base.int_max);         
    if(!bln_value){
      console.log("failed int_value: " + int_value);
      console.log("failed obj_base.int_min: " + obj_base.int_min);
      console.log("failed obj_base.int_max: " + obj_base.int_max);
    }
    return bln_value;
  }
  fn_boundFillLighten(){
    let obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;
    
    if(obj_gradient.int_light>=60){  
      obj_gradient.bln_lighten=false;
    }
    else if(obj_gradient.int_light<=40){  
      obj_gradient.bln_lighten=true;
    }
  }


  fn_setFillArea(){

    let obj_base=this.obj_base;

    let str_fillBase, str_fillForm, str_fillBorder;  

    const obj_gradient=obj_base.obj_gradient;
    
    const str_fill=obj_gradient.str_fill;
    const str_fill_1=obj_gradient.str_fill_1;
    const str_fill_2=obj_gradient.str_fill_2;    
    
    
    switch (obj_gradient.int_fillSpread) {
      case 1:
          obj_gradient.str_fillSpread="base-form-border";
          str_fillBase = str_fill;
          str_fillForm = str_fill_1;
          str_fillBorder = str_fill_2;
          break;
      case 2:
          obj_gradient.str_fillSpread="base-border-form";
          str_fillBase = str_fill;
          str_fillForm = str_fill_2;
          str_fillBorder = str_fill_1;
          break;
      case 3:
          obj_gradient.str_fillSpread="form-base-border";
          str_fillBase = str_fill_1;
          str_fillForm = str_fill;
          str_fillBorder = str_fill_2;
          break;
      case 4:
          obj_gradient.str_fillSpread="border-base-form";
          str_fillBase = str_fill_1;
          str_fillForm = str_fill_2;
          str_fillBorder = str_fill;
          break;
      case 5:
          obj_gradient.str_fillSpread="form-border-base";
          str_fillBase = str_fill_2;
          str_fillForm = str_fill;
          str_fillBorder = str_fill_1;
          break;
      case 6:
          obj_gradient.str_fillSpread="border-form-base";
          str_fillBase = str_fill_2;
          str_fillForm = str_fill_1;
          str_fillBorder = str_fill;
          break;
      default:
        obj_gradient.str_fillSpread="invalid-int_fillSpread[" + obj_gradient.int_fillSpread + "]";
          // Handle invalid input or other cases
          str_fillBase = str_fill;
          str_fillForm = str_fill_1;
          str_fillBorder = str_fill_2;
          break;
  }  
    
    obj_gradient.str_fillBase=str_fillBase;
    obj_gradient.str_fillForm=str_fillForm;
    obj_gradient.str_fillBorder=str_fillBorder;  
  }

  fn_setFillOption(){

    const obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;

    if(obj_gradient.bln_matchFillSearch){
      obj_gradient.str_fillSearch=obj_gradient.str_fillForm;
    }

    obj_gradient.bln_matchFillInput=false;
    if(obj_gradient.bln_matchFillInput){
      obj_gradient.str_fillInput=obj_gradient.str_fillForm;  
    }

    /////SET TEXT COLOR  
    if(obj_gradient.bln_matchFillTextInput){
      obj_gradient.str_fillTextInput=obj_gradient.str_fillForm;  
    }
    if(obj_gradient.int_light>80){      
      let obj_hslaText;
      obj_hslaText=obj_shared.fn_getGradientObjectFromHSLA(obj_gradient.str_fillBorder, "New Text Color");
      obj_hslaText.int_alpha=1;
      obj_hslaText=obj_shared.fn_getGradientObjectFromGradient(obj_hslaText, "New Text Color");
      obj_gradient.str_fillTextUI=obj_hslaText.str_hsla;        
      obj_gradient.str_fillTextInput="Dark Gray";              
      //console.log("caught white text: " + obj_gradient.str_fillTextInput);
    }
    
    /////SET TEXT COLOR

    /////SET BODY BACKGROUND COLOR
    document.body.style.backgroundColor="rgb(43, 44, 52)";        
    document.body.style.backgroundColor=obj_gradient.str_fillBorder;        
    if(obj_gradient.bln_transparent){    
      document.body.style.backgroundColor=obj_gradient.str_fillBorder;              
    }
    /////SET BODY BACKGROUND COLOR

  }
  
  fn_setThemeItem(){
    const obj_base=this.obj_base;            
    const obj_gradient=obj_base.obj_gradient;    
    
    let obj_themeItem; 
    this.arr_theme=[];
    /////////////////////////////////////////
    /////////////////////////////////////////
    //XAPPACCORDION
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                             
    obj_themeItem.padding="0em";
    obj_themeItem.display="block";
    //STRUCTURE     
    //OPTION        
    obj_themeItem.bln_border=false;         
    obj_themeItem.backgroundColor=obj_gradient.str_fillBase;        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION            
    this.obj_xappAccordion=obj_themeItem;                      
    //XAPPACCORDION
    /////////////////////////////////////////
    /////////////////////////////////////////        
    
    
    /////////////////////////////////////////
    /////////////////////////////////////////
    //MENUBUTTON
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                           
    obj_themeItem.fontWeight="bold";                                
    obj_themeItem.width="100%";        
    obj_themeItem.cursor="pointer";                                       
    obj_themeItem.justifyContent="center";
    obj_themeItem.alignItems="center";        
    //STRUCTURE
    //OPTION       
    obj_themeItem.str_label="form_rowz";                    
    obj_themeItem.bln_border=obj_base.bln_borderRowz;              
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusRowz;                          
    obj_themeItem.borderColor=obj_gradient.str_fillBorder;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillForm;                
    
    obj_themeItem.color=obj_gradient.str_fillTextUI;
    obj_themeItem.str_deviderSize="small";      
    this.fn_applyThemeOption(obj_themeItem);  
    //OPTION                        
    this.obj_rowz=obj_themeItem;
    //MENUBUTTON
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //CHILDMENU        
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_rowz);                
    //STRUCTURE                                   
    //STRUCTURE
    //OPTION                
    obj_themeItem.str_label="form_rowzchild";                        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                                
    this.obj_rowzChild=obj_themeItem;
    //CHILDMENU             
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //DYNAMICMENU
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_rowzChild);                        
    //STRUCTURE                                   
    //STRUCTURE
    //OPTION                
    obj_themeItem.str_label="form_rowzdynamic";                        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                        
    this.obj_rowzDynamic=obj_themeItem;
    //DYNAMICMENU
    /////////////////////////////////////////
    /////////////////////////////////////////          
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMBUTTON        
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                           
    //STRUCTURE           
    //OPTION                                  
    obj_themeItem.str_label="form_button";                                
    obj_themeItem.bln_border=obj_base.bln_borderButton;    
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusButton;              
    obj_themeItem.borderColor=obj_gradient.str_fillBorder;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillForm;                
    obj_themeItem.color=obj_gradient.str_fillTextUI;        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                
    this.obj_formButton=obj_themeItem;        
    //FORMBUTTON
    /////////////////////////////////////////
    ///////////////////////////////////////// 
    
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMFIELDSET        
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                     
    obj_themeItem.str_label="form_fieldset";              
    obj_themeItem.bln_border=obj_base.bln_borderFieldset;      
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusFieldset;          
    obj_themeItem.bln_borderExpand=true;
    obj_themeItem.borderColor=obj_gradient.str_fillBorder;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillForm;                
    obj_themeItem.color=obj_gradient.str_fillTextUI;
    this.fn_applyThemeOption(obj_themeItem);
    obj_themeItem.bln_borderExpand=false;
    //OPTION    
    this.obj_formFieldset=obj_themeItem;        
    //FORMFIELDSET        
    /////////////////////////////////////////
    /////////////////////////////////////////
    
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMLEGEND
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formFieldset);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                          
    obj_themeItem.str_label="form_legend";                                
    //obj_themeItem.fontWeight="bold";
    obj_themeItem.bln_border=obj_base.bln_borderLegend;      
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusLegend;           
    this.fn_applyThemeOption(obj_themeItem);
    
    //OPTION    
    this.obj_formLegend=obj_themeItem;        
    //FORMLEGEND
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMLABEL
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formLegend);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                
    obj_themeItem.str_label="form_label";                                
    //obj_themeItem.fontWeight="normal";
    obj_themeItem.bln_border=obj_base.bln_borderLabel;      
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusLabel;              
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION      
    this.obj_formLabel=obj_themeItem;              
    //FORMLABEL
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMINPUT        
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formLabel);
    //STRUCTURE                                           
    obj_themeItem.fontWeight="normal";                        
    obj_themeItem.maxHeight="500px";                                          
    obj_themeItem.overflow="Auto";                                          
    obj_themeItem.wordBreak="normal";                      
    //STRUCTURE
    //OPTION                      
    obj_themeItem.str_label="form_input";                                
    obj_themeItem.bln_border=obj_base.bln_borderInput;
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusInput;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillInput;                                                                         
    obj_themeItem.color=obj_gradient.str_fillTextInput;          
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                
    this.obj_formInput=obj_themeItem;        
    //FORMINPUT
    /////////////////////////////////////////
    /////////////////////////////////////////      
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMINPUT        
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formInput);
    //STRUCTURE                                                             
    obj_themeItem.fontWeight="bold";
    //STRUCTURE
    //OPTION                      
    obj_themeItem.str_label="rowz_search";                                      
    obj_themeItem.bln_border=obj_base.bln_borderSearch;  
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusSearch;  
    obj_themeItem.borderColor=this.obj_formButton.borderColor;    
    obj_themeItem.backgroundColor=obj_gradient.str_fillSearch;
    obj_themeItem.color=obj_gradient.str_fillTextUI;        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                
    this.obj_rowzSearch=obj_themeItem;        
    //FORMINPUT
    /////////////////////////////////////////
    /////////////////////////////////////////  
    
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMHARDRULE
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                             
    obj_themeItem.padding="0.5em";                  
    //STRUCTURE           
    //OPTION                
    obj_themeItem.str_label="form_hardrule";                                      
    obj_themeItem.bln_border=this.obj_rowz.bln_border;  
    obj_themeItem.bln_borderRadius=this.obj_rowz.bln_borderRadius;  
    obj_themeItem.borderColor=this.obj_rowz.borderColor;       
    obj_themeItem.backgroundColor=this.obj_rowz.backgroundColor;
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION            
    this.obj_formHardRule=obj_themeItem;        
    //FORMHARDRULE
    /////////////////////////////////////////
    /////////////////////////////////////////  
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //*
    //THEMEBACKGROUND      
    obj_themeItem=this.fn_getComponent("form_blockbackground");                          
    obj_themeItem.fn_applyStyle(this.obj_xappAccordion)
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockBackground=obj_themeItem;      
    //THEMEBACKGROUND
    //THEMEMIDGROUND
    obj_themeItem=this.fn_getComponent("form_blockmidground");                      
    obj_themeItem.fn_applyStyle(this.obj_formFieldset)  
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockMidground=obj_themeItem;                
    //THEMEMIDGROUND
    //THEMEFORGROUND
    obj_themeItem=this.fn_getComponent("form_blockforground");                      
    obj_themeItem.fn_applyStyle(this.obj_formFieldset)
    obj_themeItem.backgroundColor=obj_themeItem.borderColor;  
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockForground=obj_themeItem;                
    //THEMEFORGROUND
    //THEMEFORGROUND
    obj_themeItem=this.fn_getComponent("form_blockhighlight");                      
    obj_themeItem.fn_applyStyle(this.obj_formFieldset)
    obj_themeItem.backgroundColor="orange";  
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockHighlight=obj_themeItem;    
    //*/
    //THEMEFORGROUND
    /////////////////////////////////////////
    /////////////////////////////////////////     
    
    this.fn_stripStyle();
  }
  
  fn_stripStyle() {    
    
    this.arr_theme.forEach(obj => {      
      for (const key in obj) {
        if (key.includes('_')) {      
          delete obj[key];
        } 
      }
    });
    
  }
  
  
  fn_applyThemeOption(obj_themeItem){
  this.arr_theme.push(obj_themeItem);
  this.fn_applyThemeFont(obj_themeItem);
  this.fn_applyThemeBorder(obj_themeItem);
  this.fn_applyThemeDevider(obj_themeItem);
  }
  
  fn_applyThemeFont(obj_themeItem){      
  
  //FONTSIZE
  let int_fontSize;  
  switch(obj_themeItem.str_label){                    
    case "form_rowz":
      int_fontSize=obj_themeItem.int_fontSize5;            
      break;          
    case "form_rowzchild":
      int_fontSize=obj_themeItem.int_fontSize4;            
      break;                                
    case "form_rowzdynamic":
      int_fontSize=obj_themeItem.int_fontSize3;
      break;                  
    case "form_button":
      int_fontSize=obj_themeItem.int_fontSize2;
      break;
    case "form_input":
      int_fontSize=obj_themeItem.int_fontSize1;
      break;
    case "standard":
      int_fontSize=obj_themeItem.int_fontSize1;
      break;
    default:
      int_fontSize=obj_themeItem.int_fontSize1;
  }         
  obj_themeItem.fontSize=int_fontSize + "rem";                     
  //FONTSIZE
  }
  
  fn_applyThemeBorder(obj_themeItem){  
  
  //BORDER            
  let str_borderSize="none";      
  if(obj_themeItem.bln_border)      {
    str_borderSize=obj_themeItem.str_borderSize;        
    if(str_borderSize==="none"){
      str_borderSize="medium";
    }        
  }
  let int_borderSize;                                 
  switch(str_borderSize){                    
    case "small":
      int_borderSize=0.3;                    
      break;
    case "medium":
      int_borderSize=0.5;                    
      break;
    case "large":    
      int_borderSize=1.0;                    
      break;  
    default:
      int_borderSize=0;                    
  }         
  
  if(obj_themeItem.bln_borderExpand){
    switch(str_borderSize){                    
      case "small":      
        int_borderSize=0.5;                    
        break;
      case "medium":
        int_borderSize=1.0;                    
        break;
      case "large":    
        int_borderSize=1.5;                    
        break;  
      default:
        int_borderSize=0;                    
    }         
  }
  
  obj_themeItem.borderWidth=int_borderSize + "em";
  //BORDER
  
  //BORDERRADIUS
  let str_borderRadiusSize="none"      
  if(obj_themeItem.bln_borderRadius){
    str_borderRadiusSize=obj_themeItem.str_borderRadiusSize;
    if(!int_borderSize){int_borderSize=0.5;}        
  }            
  let int_borderRadiusSize;
  switch(str_borderRadiusSize){                          
    case "small":
      int_borderRadiusSize=1;                    
      break;
    case "medium":
      int_borderRadiusSize=1.5;                    
      break;
    case "large":
      int_borderRadiusSize=2;                    
      break;
    default:
      int_borderRadiusSize=0;                    
  }                         
  obj_themeItem.borderRadius=(int_borderRadiusSize*int_borderSize) + "em";                                            
  //BORDERRADIUS       
  }
  
  fn_applyThemeDevider(obj_themeItem){ 
  
  //DEVIDER
  let int_deviderSize;                        
  switch(obj_themeItem.str_deviderSize){                                    
    case "small":
      int_deviderSize=0.1;                        
      break;
    case "medium":
      int_deviderSize=0.5;                        
      break;
    case "large":
      int_deviderSize=1;                        
      break;
    default:
      int_deviderSize=0;                        
  }        
  obj_themeItem.marginBottom=int_deviderSize + "rem";                  
  //DEVIDER  
  }
  fn_calculateFontSizeIncrement(obj_base, int_fontSize, int_increment=0){
    obj_base.int_fontSize1=int_fontSize;
    obj_base.int_fontSize2=obj_base.int_fontSize1+int_increment;
    obj_base.int_fontSize3=obj_base.int_fontSize2+int_increment;
    obj_base.int_fontSize4=obj_base.int_fontSize3+int_increment;
    obj_base.int_fontSize5=obj_base.int_fontSize4+int_increment;      
  }

  fn_calculateFontSize(){ 

    let obj_base=this.obj_base;
    
    switch(obj_base.str_fontSize){        
        case "small":        
            this.fn_calculateFontSizeIncrement(obj_base, 10, 0);                            
            obj_base.int_fontSize4=obj_base.int_fontSize3+1;
            obj_base.int_fontSize5=obj_base.int_fontSize4+2;      
            break;
        case "medium":                            
            this.fn_calculateFontSizeIncrement(obj_base, 10, 1);                            
            break;          
        case "large":        
            this.fn_calculateFontSizeIncrement(obj_base, 13, 1);                            
            break;                      
        default:
          this.fn_calculateFontSize("medium");
          return;
    }

    
    obj_base.int_fontSize1=obj_base.int_fontSize1/10;
    obj_base.int_fontSize2=obj_base.int_fontSize2/10;
    obj_base.int_fontSize3=obj_base.int_fontSize3/10;
    obj_base.int_fontSize4=obj_base.int_fontSize4/10;
    obj_base.int_fontSize5=obj_base.int_fontSize5/10;
  }

  fn_setBorderDisplay(){  
    
    let obj_base=this.obj_base;
    let bln_value=obj_base.bln_borderDisplay;
    obj_base.bln_borderRowz=bln_value;
    obj_base.bln_borderButton=bln_value;
    obj_base.bln_borderFieldset=bln_value;
    obj_base.bln_borderLegend=bln_value;    
    obj_base.bln_borderLabel=bln_value;      
    obj_base.bln_borderInput=bln_value;                
    obj_base.bln_borderSearch=bln_value;                    
  }
  fn_setBorderRadiusDisplay(){  
    let obj_base=this.obj_base;
    let bln_value=obj_base.bln_borderRadiusDisplay;
    obj_base.bln_borderRadiusRowz=bln_value;
    obj_base.bln_borderRadiusButton=bln_value;
    obj_base.bln_borderRadiusFieldset=bln_value;
    obj_base.bln_borderRadiusLegend=bln_value;    
    obj_base.bln_borderRadiusLabel=bln_value;      
    obj_base.bln_borderRadiusInput=bln_value;        
    obj_base.bln_borderRadiusSearch=bln_value;        
  }

  fn_addColorItemCustom(obj_current){  

    this.arr_color.push(obj_current);    
    
    let int_hue, int_saturation, int_light, int_alpha;
    let obj_hsla, str_label;  
    int_hue=obj_current.int_hue;
    int_saturation=obj_current.int_saturation;  
    int_alpha=obj_current.int_alpha;

    int_hue=obj_current.int_hue;
    int_saturation=obj_current.int_saturation;
    int_light=60;  
    str_label=obj_current.str_label + "-light"
    obj_hsla=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, "", str_label);    
    this.arr_color.push(obj_hsla);

    int_hue=obj_current.int_hue;
    int_saturation=obj_current.int_saturation;
    int_light=30;  
    str_label=obj_current.str_label + "-dark"
    obj_hsla=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, "", str_label);    
    this.arr_color.push(obj_hsla);
    
    if(obj_current.int_hue>=10){
      int_hue=obj_current.int_hue-10;
      int_saturation=obj_current.int_saturation;
      int_light=30;      
      str_label=obj_current.str_label + "-alt"
      obj_hsla=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, "", str_label);    
      this.arr_color.push(obj_hsla);  
    }
  }



  fn_getColorMapCustom(){

    let obj_base=this.obj_base;

    let obj_hsla;  
    let int_saturation, int_light, int_alpha
    //SET EFFECT  
    obj_base.arr_effect=["mono", "leisure", "bold", "electric"];
    obj_base.str_effect=obj_shared.fn_getRandomArrayElement(obj_base.arr_effect);    
    obj_gradient.str_effect=obj_base.str_effect;

    //SET EFFECT
      switch(obj_base.str_effect){    
        case "mono":
        int_saturation=25;
        break;
        case "leisure":
        int_saturation=50;
        break;
        case "bold":
        int_saturation=60;
        break;    
        case "electric":
          int_saturation=100;
          break;    
        default:
          int_saturation=50;
      }
      
      int_saturation=100;
      int_light=50;
      int_alpha=obj_base.int_alpha;    

      this.arr_color = [];      
      //MAIN COLORS PLUS VARIANT
      obj_hsla=obj_shared.fn_getGradientObject(0, int_saturation, int_light, int_alpha, "", "red");//red
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(30, int_saturation, int_light, int_alpha, "", "Orange");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(60, int_saturation, int_light, int_alpha, "", "Yellow");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(120, int_saturation, int_light, int_alpha, "", "Green");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(180, int_saturation, int_light, int_alpha, "", "Cyan");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(240, int_saturation, int_light, int_alpha, "", "Blue");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(270, int_saturation, int_light, int_alpha, "", "Purple");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(300, int_saturation, int_light, int_alpha, "", "Magenta");
      this.fn_addColorItemCustom(obj_hsla);
      
      let arr_item=this.arr_color;
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 100, int_alpha, "", "White");
      arr_item.push(obj_hsla);  
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 0, int_alpha, "", "Black");
      arr_item.push(obj_hsla);  
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 50, int_alpha, "", "Gray");
      arr_item.push(obj_hsla); 
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 60, int_alpha, "", "Gray-light");
      arr_item.push(obj_hsla);   
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 30, int_alpha, "", "Gray-dak");
      arr_item.push(obj_hsla);             
      let int_max=this.arr_color.length-1;
      let int_value=obj_shared.fn_getRandomInt(0, int_max); // Generates a random integer between 1 and 8    
      obj_hsla=this.arr_color[int_value];  
      //obj_hsla=obj_shared.fn_getGradientObject(270, 100, 50, int_alpha, "", "black");  
      return obj_hsla;
  }

  fn_logThemeSummary(){
    const obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;
    
    let str_fillSpread=obj_gradient.str_fillSpread;  
  
    let str_lighten="darken";
    if(obj_gradient.bln_lighten){
      str_lighten="lighten";
    }
    let str_contrast="lowcontrast";
    if(obj_gradient.bln_lighten){
      str_contrast="highcontrast";
    }
    let str_transparent="opaque";
    if(obj_gradient.bln_transparent){
      str_transparent="transparent";
    }
  
    obj_gradient.str_label+="-"+str_fillSpread+"-"+str_lighten+"-"+str_contrast+"-"+str_transparent;  
  
    console.log("str_label: " + obj_gradient.str_label);
    console.log("obj_gradient.str_fill:" + obj_gradient.str_fill);
    console.log("obj_gradient.bln_transparent: " + obj_gradient.bln_transparent);    
    console.log("obj_gradient.bln_lighten: " + obj_gradient.bln_lighten);
    console.log("obj_gradient.bln_contrast: " + obj_gradient.bln_contrast);
  
    console.log("obj_gradient.int_hue: " + obj_gradient.int_hue);
    console.log("obj_gradient.int_saturation: " + obj_gradient.int_saturation);
    console.log("obj_gradient.int_light: " + obj_gradient.int_light);
    console.log("obj_base.bln_filterPass: " + obj_base.bln_filterPass);
  
    console.log("obj_gradient.int_fillSpread:" + obj_gradient.int_fillSpread);  
    console.log("obj_gradient.str_fill:" + obj_gradient.str_fill);
    console.log("str_fillBase:" + obj_gradient.str_fillBase);
    console.log("str_fillForm:" + obj_gradient.str_fillForm);    
    console.log("str_fillBorder:" + obj_gradient.str_fillBorder);

    console.log(this);
  }


  
  //END THEME HANDLER
}//END CLS

//END component/xapp_theme
/*type: xapp_theme//*/
/*END COMPONENT//*/

//END LINKTABLE





//END LINKTABLE

//START COMPONENTMAP

//START AUTO GENERATED COMPONENT MAP
const obj_ComponentMap = new Map([['component', component],['form_button', form_button],['form_button_rich', form_button_rich],['xapp_button', xapp_button],['xapp_console_button', xapp_console_button],['form_input', form_input],['eazygriditem', eazygriditem],['block', block],['eazygrid', eazygrid],['form_button_anchor', form_button_anchor],['form_button_icon', form_button_icon],['form_button_span', form_button_span],['form_field', form_field],['form_fieldset', form_fieldset],['form_form', form_form],['form_hardrule', form_hardrule],['form_label', form_label],['form_legend', form_legend],['form_menu_panel', form_menu_panel],['form_panel', form_panel],['form_span', form_span],['form_text', form_text],['panel', panel],['xapp_accordion', xapp_accordion],['xapp_button_navigate_rowz', xapp_button_navigate_rowz],['xapp_theme', xapp_theme]]);
//END AUTO GENERATED MAP


//END COMPONENTMAP

//START TEMPLATE


/*START COMPONENT//*/
/*type: TemplateCode//*/

//START Project.js
class Project extends component{
  constructor(obj_ini) {
    super(obj_ini); // call the super class constructor

    /*
    The use of this wrapper function allows items to be called form database , rather than hard-written into the code.        
    //e.g it allows the use of a simple Main procedure "new wrapper" which is name agnostic.
    //*/
  }  
  fn_onLoad(){
    super.fn_onLoad();        
    //console.log("Project Loaded: " + this.obj_design.str_name);
    //alert(obj_projectTarget)      
  }
  fn_setEvent(e, obj_itemEvent){                        
      if(!this.obj_itemEvent){                  
          this.obj_nativeEvent=e;
          this.obj_itemEvent=obj_itemEvent;          
      }  
  }        
  fn_unsetEvent(){              
      this.obj_nativeEvent=false;
      this.obj_itemEvent=false;  
  }       
  fn_calmEvent(e){        
      if(!e){return;}
      e.stopPropagation();                                                           
  }
  fn_forgetEvent(e){
      this.fn_unsetEvent();
      if(!e){return;}
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();                                                           
  }
  fn_debugEvent(){

      //console.log("this.obj_nativeEvent: " + this.obj_nativeEvent);
      //console.log("this.obj_itemEvent: " + this.obj_itemEvent);
      if(this.obj_itemEvent){
          this.obj_itemEvent.fn_debug("debug event");
      }
  }
  
  
  fn_initialize(obj_ini){        
      super.fn_initialize(obj_ini);
      
      //START INITIALIZE DESIGN        
      if(this.obj_design.int_idRecord==undefined){this.obj_design.int_idRecord=0;}        

      if(this.obj_design.str_name==undefined){this.obj_design.str_name="My Project";}       

      
      //if(this.obj_domStyle.display==undefined){this.obj_domStyle.display="block";}              

      
      
      if(this.obj_design.bln_isContainer==undefined){this.obj_design.bln_isContainer=true;}       
      
      
      
      this.fn_loadBootVariables();
      //END INITIALIZE DESIGN

      //START INITIALIZE DOM PROPERTY                
      //END INITIALIZE DOM PROPERTY

      //START INITIALIZE DOM ATTRIBUTE
      //END INITIALIZE DOM ATTRIBUTE
      
      //START INITIALIZE STYLE
      //END INITIALIZE STYLE

      //START INITIALIZE THEME           
      //END INITIALIZE THEME 
      
      this.user_agent=obj_shared.fn_detectBrowser()
      this.bln_isMobile=obj_shared.fn_isMobile()
      //console.log("this.user_agent: " + this.user_agent)
    } 
    
    fn_isTheme(){      
      if(this.obj_design.str_type.toLowerCase()==="xapp_theme"){
        return true;}
      return false;
    }
    

    fn_setParentComponent(obj_parent){    
        console.log("PROJECT dont set Parent Component");
    }       
    

    fn_loadBootVariables(){

        let str_mode=obj_shared.fn_getMode();

        switch(str_mode){            
            case "edit":
                this.obj_design.int_modeExecute=this.obj_holder.int_modeEdit;                                                                
                break;         
            case "boot":
                this.obj_design.int_modeExecute=this.obj_holder.int_modeBoot;                                                                
                break;         
            default:
                this.obj_design.int_modeExecute=this.obj_holder.int_modeRuntime;                                
        }                        
        
        let int_idRecord;        
        int_idRecord=this.obj_design.int_idRecord;
        this.obj_design.int_idRecord=parseInt(int_idRecord);        

    }
    
    fn_createSelf(){        
        this.fn_setTagOption();
        super.fn_createSelf();        
    }                
    
     fn_viewInBrowser(){
        let o=window.open("../../myProject/", "xDesignViewInBrowser");
        if(o){o.focus()}
    }          
    
     //END Project Instance Functions

     fn_setTagOption(){

        /*COMPONENT TAG    
        //Following options for Project Wrapper:            
        1. Use No Tag
        2. Creating A Tag                 
        2. Use Exisitng Tag and Allow/DisAllow manipulation of this e.g color, padding etc
        //*/
        
        //Create own publish tag 
        //If used, publish does create its own tag , which will prevent any ammendments being made to its  parent HTML        
        //POSITION SELF
        this.dom_obj = document.createElement(this.obj_design.str_tag);                          
        //APPLIES ONLY TO PUBLISH AS IT IS THE ONLY ITEM THAT IS NOT INSERTED VIA ADDITEM
        //now position element in parent Dom                
        let dom_element=document.getElementById(idXdesignTarget);
        if(!dom_element){dom_element=document.body;}        
        obj_shared.fn_removeAllChildNodes(dom_element);
        dom_element.append(this.dom_obj);             
        //POSITION SELF
    }            

  }//END OF CLS

  //START DESIGN BOOT VARIABLE
  obj_boot.obj_design.int_idRecord=77264; 
  //END DESIGN BOOT VARIABLE
//END Project.js


/*type: TemplateCode//*/
/*END COMPONENT//*/



//END TEMPLATE

//START JSONMAP


/*START INSTANCE JSON MAP//*/
var obj_InstanceJSONMap = new Map([
[77262, {"obj_design": {"str_tag": "eazygriditem", "arr_item": [{"obj_design": {"str_type": "eazygrid", "int_idRecord": "77274"}}], "str_name": "My eazygriditem", "str_text": "notset", "str_type": "eazygriditem", "str_minDim": "100px", "bln_editPin": true, "str_content": "", "gridTemplate": "minmax(100px, 1fr)", "int_idRecord": "77262", "str_classList": "notset", "str_idProject": "myId_54166875", "str_idXDesign": "myId_40797111", "str_nameShort": "myeazygriditem", "str_themeType": "eazygriditem", "bln_palettePin": true, "str_classExtend": "notset", "str_createdDate": "2022-02-21 18:51:32", "str_modifiedDate": "2022-02-21 18:51:32", "str_releaseLabel": "notset", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"background-color": "#414141"}, "obj_domProperty": {"Id": "myId_40797111"}, "dom_objContentContainer": {"Id": "myId_40797111"}}],
[77263, {"obj_design": {"str_tag": "eazygrid", "arr_item": [{"obj_design": {"str_type": "eazygriditem", "int_idRecord": "77262"}}, {"obj_design": {"str_type": "eazygriditem", "int_idRecord": "77270"}}], "int_axis": 1, "str_name": "eazygrid", "str_text": "notset", "str_type": "eazygrid", "str_minDim": "100px", "bln_editPin": true, "str_content": "", "bln_eazyGrid": true, "int_idRecord": "77263", "str_classList": "eazygriditem", "str_idProject": "myId_01221712", "str_idXDesign": "myId_10717310", "str_nameShort": "eazygrid", "str_themeType": "eazygrid", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:08:50", "str_modifiedDate": "2022-01-31 21:08:50", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "str_gridTemplateDefault": "minmax(100px, 1fr)"}, "obj_domStyle": {"gap": "1em", "width": "100%", "height": "100%", "display": "grid", "padding": "0px", "grid-gap": "1.0em", "overflow": "hidden", "grid-auto-rows": "minmax(100px, 1fr)", "background-color": "orange", "grid-auto-columns": "minmax(100px, 1fr)", "grid-template-rows": "minmax(100px, 1fr) minmax(100px, 1fr)", "grid-template-columns": "minmax(100px, 1fr)"}, "obj_domProperty": {"Id": "myId_10717310"}, "dom_objContentContainer": {"Id": "myId_10717310"}}],
[77264, {"obj_theme": {"obj_design": {"str_type": "xapp_theme", "int_idRecord": 77570}}, "obj_design": {"str_tag": "component", "arr_item": [{"obj_design": {"str_type": "xapp_theme", "int_idRecord": 77570}}, {"obj_design": {"str_type": "eazygrid", "int_idRecord": "77263"}}], "str_name": "www", "str_text": "notset", "str_type": "component", "bln_editPin": true, "str_content": "", "int_idRecord": 77264, "str_classList": "notset", "str_idProject": "notset", "str_idXDesign": "myId_01221712", "str_nameShort": "www", "str_themeType": "component", "str_classExtend": "notset", "str_createdDate": "2024-08-16 11:31:56", "str_categoryName": "www", "str_modifiedDate": "2024-08-16 11:31:56", "str_releaseLabel": "notset", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset"}, "user_agent": "Firefox", "obj_domProperty": {"Id": "myId_01221712"}, "dom_objContentContainer": {"Id": "myId_01221712"}}],
[77270, {"obj_design": {"str_tag": "eazygriditem", "arr_item": [{"obj_design": {"str_type": "panel", "int_idRecord": "77432"}}], "str_name": "eazygriditem", "str_text": "notset", "str_type": "eazygriditem", "str_minDim": "100px", "bln_editPin": true, "str_content": "", "gridTemplate": "minmax(100px, 1fr)", "int_idRecord": "77270", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_32337313", "str_nameShort": "eazygriditem", "str_themeType": "eazygriditem", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:09:35", "str_modifiedDate": "2022-01-31 21:09:35", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"background-color": "#414141"}, "obj_domProperty": {"Id": "myId_32337313"}, "dom_objContentContainer": {"Id": "myId_32337313"}}],
[77272, {"obj_design": {"str_tag": "eazygriditem", "arr_item": [{"obj_design": {"str_type": "panel", "int_idRecord": "77278"}}], "str_name": "My eazygriditem", "str_text": "notset", "str_type": "eazygriditem", "str_minDim": "100px", "bln_editPin": true, "str_content": "", "gridTemplate": "minmax(100px, 1fr)", "int_idRecord": "77272", "str_classList": "notset", "str_idProject": "myId_54166875", "str_idXDesign": "myId_48434440", "str_nameShort": "myeazygriditem", "str_themeType": "eazygriditem", "bln_palettePin": true, "str_classExtend": "notset", "str_createdDate": "2022-02-21 18:51:32", "str_modifiedDate": "2022-02-21 18:51:32", "str_releaseLabel": "notset", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"background-color": "#414141"}, "obj_domProperty": {"Id": "myId_48434440"}, "dom_objContentContainer": {"Id": "myId_48434440"}}],
[77274, {"obj_design": {"str_tag": "eazygrid", "arr_item": [{"obj_design": {"str_type": "eazygriditem", "int_idRecord": "77272"}}, {"obj_design": {"str_type": "eazygriditem", "int_idRecord": "77286"}}], "int_axis": 2, "str_name": "eazygrid", "str_text": "notset", "str_type": "eazygrid", "str_minDim": "100px", "bln_editPin": true, "str_content": "", "bln_eazyGrid": true, "int_idRecord": "77274", "str_classList": "eazygriditem", "str_idProject": "myId_01221712", "str_idXDesign": "myId_34050020", "str_nameShort": "eazygrid", "str_themeType": "eazygrid", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:08:50", "str_modifiedDate": "2022-01-31 21:08:50", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "str_gridTemplateDefault": "minmax(100px, 1fr)"}, "obj_domStyle": {"width": "100%", "height": "100%", "display": "grid", "padding": "0px", "grid-gap": "1.0em", "overflow": "hidden", "grid-auto-rows": "minmax(100px, 1fr)", "background-color": "orange", "grid-auto-columns": "minmax(100px, 1fr)", "grid-template-rows": "minmax(100px, 1fr)", "grid-template-columns": "minmax(100px, 1fr) minmax(100px, 1fr)"}, "obj_domProperty": {"Id": "myId_34050020"}, "dom_objContentContainer": {"Id": "myId_34050020"}}],
[77277, {"obj_design": {"str_tag": "block", "str_name": "block", "str_text": "Welcome.", "str_type": "block", "bln_editPin": true, "str_content": "", "int_idRecord": "77277", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_31713903", "str_nameShort": "block", "str_themeType": "block", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:10:58", "str_modifiedDate": "2022-01-31 21:10:58", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"color": "orange", "width": "100%", "height": "100%", "display": "flex", "padding": "1.0em", "font-style": "", "font-family": "", "font-weight": "", "background-color": "rgb(65,65,65)"}, "obj_domProperty": {"innerHTML": "Welcome."}}],
[77278, {"obj_design": {"str_tag": "panel", "arr_item": [{"obj_design": {"str_type": "block", "int_idRecord": "77277"}}], "str_name": "flexpanel", "str_text": "notset", "str_type": "panel", "bln_editPin": true, "str_content": "", "int_idRecord": "77278", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_82328711", "str_nameShort": "flexpanel", "str_themeType": "", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-02-02 20:10:52", "str_modifiedDate": "2022-02-02 20:10:52", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"color": "", "border": "", "height": "100%", "display": "flex", "padding": "", "overflow": "", "maxheight": "175", "background": "rgb(64, 169, 236)", "max-height": "", "word-break": "", "font-family": "", "border-radius": ""}, "obj_domProperty": {"Id": "myId_82328711"}, "dom_objContentContainer": {"Id": "myId_82328711"}}],
[77286, {"obj_design": {"str_tag": "eazygriditem", "arr_item": [{"obj_design": {"str_type": "panel", "int_idRecord": "77287"}}], "str_name": "eazygriditem", "str_text": "notset", "str_type": "eazygriditem", "str_minDim": "100px", "bln_editPin": true, "str_content": "", "gridTemplate": "minmax(100px, 1fr)", "int_idRecord": "77286", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_00703001", "str_nameShort": "eazygriditem", "str_themeType": "eazygriditem", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:09:35", "str_modifiedDate": "2022-01-31 21:09:35", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"background-color": "#414141"}, "obj_domProperty": {"Id": "myId_00703001"}, "dom_objContentContainer": {"Id": "myId_00703001"}}],
[77287, {"obj_design": {"str_tag": "panel", "arr_item": [{"obj_design": {"str_type": "xapp_button_navigate_rowz", "int_idRecord": 77486}}], "str_name": "flexpanel", "str_text": "notset", "str_type": "panel", "bln_editPin": true, "str_content": "", "int_idRecord": "77287", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_18815515", "str_nameShort": "flexpanel", "str_themeType": "", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-02-02 20:10:52", "str_modifiedDate": "2022-02-02 20:10:52", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"color": "", "border": "", "height": "100%", "display": "flex", "padding": "1.0em", "overflow": "", "maxheight": "175", "background": "rgb(65,65,65)", "max-height": "", "word-break": "", "font-family": "", "border-radius": ""}, "obj_domProperty": {"Id": "myId_18815515"}, "dom_objContentContainer": {"Id": "myId_18815515"}}],
[77386, {"obj_design": {"str_tag": "span", "blnIsTag": true, "str_name": "form_button_span", "str_text": "xapp_menu", "str_type": "form_button_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": 77386, "str_classList": "notset", "str_idProject": "notset", "str_idXDesign": "myId_57242915", "str_nameShort": "form_button_span", "str_themeType": "form_button_span", "bln_palettePin": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "Form", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "notset", "bln_lockComponent": true, "bln_classController": true, "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "orange", "display": "block", "font-size": "1rem", "maxheight": "175"}, "obj_domProperty": {"Id": "myId_57242915", "innerHTML": "xapp_menu"}, "dom_objContentContainer": {"Id": "myId_57242915"}}],
[77387, {"obj_design": {"str_tag": "i", "str_name": "form_button_icon", "str_text": "notset", "str_type": "form_button_icon", "bln_editPin": true, "str_content": "", "int_idRecord": 77387, "str_classList": "notset", "str_idProject": "notset", "str_idXDesign": "myId_24281989", "str_nameShort": "form_button_icon", "str_themeType": "form_button_icon", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "Form", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_lockComponent": true, "bln_classController": true, "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "orange", "font-size": "1.5em"}, "obj_domProperty": {"Id": "myId_24281989"}, "dom_objContentContainer": {"Id": "myId_24281989"}}],
[77393, {"obj_icon": {"obj_design": {"str_type": "form_button_icon", "int_idRecord": 77387}}, "obj_span": {"obj_design": {"str_type": "form_button_span", "int_idRecord": 77386}}, "obj_design": {"str_tag": "a", "arr_item": [{"obj_design": {"str_type": "form_button_span", "int_idRecord": 77386}}, {"obj_design": {"str_type": "form_button_icon", "int_idRecord": 77387}}], "str_name": "form_button_anchor", "str_text": "notset", "str_type": "form_button_anchor", "bln_editPin": true, "str_content": "", "int_idRecord": 77393, "str_classList": "notset", "str_idProject": "notset", "str_idXDesign": "myId_66119667", "str_nameShort": "form_button_anchor", "str_themeType": "form_button_anchor", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "Form", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_lockComponent": true, "bln_classController": true, "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "1.0em", "text": "de", "color": "white", "border": "0px solid black", "display": "flex", "font-size": "100%", "align-items": "center", "justify-content": "center", "text-decoration": "none"}, "obj_domProperty": {"Id": "myId_66119667", "target": "_blank"}, "dom_objContentContainer": {"Id": "myId_66119667"}}],
[77432, {"obj_design": {"str_tag": "panel", "arr_item": [{"obj_design": {"str_type": "block", "int_idRecord": "77450"}}], "str_name": "flexpanel", "str_text": "notset", "str_type": "panel", "bln_editPin": true, "str_content": "", "int_idRecord": "77432", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_64023910", "str_nameShort": "flexpanel", "str_themeType": "", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-02-02 20:10:52", "str_categoryName": "", "str_modifiedDate": "2022-02-02 20:10:52", "str_releaseLabel": "", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"color": "", "border": "", "height": "100%", "display": "flex", "padding": "", "overflow": "", "maxheight": "175", "background": "rgb(64, 169, 236)", "max-height": "", "word-break": "", "font-family": "", "border-radius": ""}, "obj_domProperty": {"Id": "myId_64023910"}, "dom_objContentContainer": {"Id": "myId_64023910"}}],
[77450, {"obj_design": {"str_tag": "block", "str_name": "block", "str_text": "mycode.buzz @ gmail.com", "str_type": "block", "bln_editPin": true, "str_content": "", "int_idRecord": "77450", "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_22406430", "str_nameShort": "block", "str_themeType": "block", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:10:58", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:10:58", "str_releaseLabel": "", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"color": "orange", "width": "100%", "height": "", "display": "flex", "padding": "1.0em", "font-style": "", "font-family": "", "font-weight": "", "background-color": "rgb(65,65,65)"}, "obj_domProperty": {"innerHTML": "mycode.buzz @ gmail.com"}}],
[77486, {"obj_design": {"str_tag": "button", "arr_item": [{"obj_design": {"str_type": "form_button_anchor", "int_idRecord": 77393}}], "blnIsTag": true, "str_icon": "rowz_hashtag", "str_name": "xapp_button_navigate_rowz", "str_text": "Rowz", "str_type": "xapp_button_navigate_rowz", "bln_editPin": true, "str_content": "My component", "bln_typeable": true, "int_idRecord": 77486, "str_classList": "notset", "str_idProject": "notset", "str_idXDesign": "myId_36003113", "str_nameShort": "xapp_button_navigate_rowz", "str_themeType": "form_button", "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "xapp_console_button", "str_createdDate": "2022-02-02 19:54:40", "str_categoryName": "www", "str_modifiedDate": "2022-02-02 19:54:40", "str_releaseLabel": "notset", "bln_createRelease": "false", "bln_lockComponent": true, "bln_classController": true, "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "bln_enabled": true, "obj_domStyle": {"color": "orange", "border": "0.5em solid orange", "display": "flex", "padding": "1em", "font-size": "1rem", "background": "rgb(65, 65, 65)"}, "obj_domProperty": {"Id": "myId_36003113", "str_name": "xapp_button_navigate_desktop", "innerHTML": "Office", "innerText": "Desktop"}, "dom_objContentContainer": {"Id": "myId_36003113", "str_name": "xapp_button_navigate_desktop"}}],
[77570, {"gap": "1em", "display": "flex", "int_max": 100, "int_min": 40, "padding": "1em", "bln_debug": true, "bln_saved": true, "obj_design": {"str_tag": "theme_ocean", "arr_item": [{"obj_design": {"str_type": "xapp_accordion", "int_idRecord": "77906"}}, {"obj_design": {"str_type": "form_span", "int_idRecord": "77907"}}, {"obj_design": {"str_type": "form_span", "int_idRecord": "77908"}}, {"obj_design": {"str_type": "form_span", "int_idRecord": "77909"}}, {"obj_design": {"str_type": "form_span", "int_idRecord": "77910"}}], "str_name": "theme_ocean", "str_text": "notset", "str_type": "xapp_theme", "bln_editPin": true, "str_content": "", "int_idRecord": 77570, "str_classList": "notset", "str_idProject": "myId_01221712", "str_idXDesign": "myId_29727565", "str_nameShort": "theme_ocean", "str_themeType": "xapp_theme", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2024-11-30 12:02:09", "str_categoryName": "Anchor", "str_modifiedDate": "2024-11-30 12:02:09", "str_releaseLabel": "notset", "bln_lockComponent": true, "bln_classController": true, "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtProject": true, "bln_registerAtContainer": true}, "obj_domStyle": {"display": "none", "font-size": "", "font-family": ""}, "obj_gradient": {"int_hue": 207, "str_fill": "hsla(207, 44%, 49%, 1)", "str_hsla": "hsla(207, 44%, 49%, 1)", "int_alpha": 1, "int_light": 49, "str_label": "steelblue-base-border-form-darken-lowcontrast-opaque", "str_fill_1": "HSLA(207, 44%,34%, 1)", "str_fill_2": "HSLA(207, 44%,24%, 1)", "bln_contrast": true, "str_fillBase": "hsla(207, 44%, 49%, 1)", "str_fillForm": "HSLA(207, 44%,24%, 1)", "str_fillInput": "white", "int_fillSpread": 2, "int_saturation": 44, "str_fillBorder": "HSLA(207, 44%,34%, 1)", "str_fillSearch": "HSLA(207, 44%,24%, 1)", "str_fillSpread": "base-border-form", "str_fillTextUI": "white", "str_fillTextInput": "black", "bln_matchFillSearch": true}, "str_fontSize": "medium", "int_fontSize1": 1, "int_fontSize2": 1.1, "int_fontSize3": 1.2, "int_fontSize4": 1.3, "int_fontSize5": 1.4, "bln_filterPass": true, "int_totalLight": 40, "str_borderSize": "none", "bln_borderInput": true, "bln_borderLabel": true, "obj_domProperty": {"Id": "myId_29727565"}, "str_borderStyle": "solid", "str_deviderSize": "small", "bln_borderButton": true, "bln_borderLegend": true, "bln_borderSearch": true, "int_percentLight": 15, "str_highLightFill": "orange", "bln_borderFieldset": true, "int_percentContrast": 10, "str_borderRadiusSize": "medium", "bln_borderRadiusInput": true, "bln_borderRadiusLabel": true, "bln_borderRadiusButton": true, "bln_borderRadiusLegend": true, "bln_borderRadiusSearch": true, "dom_objContentContainer": {"Id": "myId_29727565"}, "bln_borderRadiusFieldset": true}],
[77887, {"obj_design": {"str_tag": "span", "blnIsTag": true, "str_name": "form_button_span", "str_text": "My Button", "str_type": "form_button_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77887", "str_classList": "notset", "str_idProject": "myId_11190110", "str_idXDesign": "myId_29737515", "str_nameShort": "form_button_span", "str_themeType": "form_button_span", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "white", "display": "block", "font-size": "1.2rem", "maxheight": "175", "font-weight": "bold"}, "obj_domProperty": {"Id": "myId_29737515", "innerHTML": "My Button"}, "dom_objContentContainer": {"Id": "myId_29737515"}}],
[77888, {"obj_design": {"str_tag": "i", "str_name": "form_button_icon", "str_text": "star", "str_type": "form_button_icon", "bln_editPin": true, "str_content": "", "int_idRecord": "77888", "str_classList": "notset", "str_idProject": "myId_79120090", "str_idXDesign": "myId_55231325", "str_nameShort": "form_button_icon", "str_themeType": "form_button_icon", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "white", "display": "block", "font-size": "1.5em", "font-weight": "bold"}, "obj_domProperty": {"Id": "myId_55231325", "innerHTML": "star"}, "dom_objContentContainer": {"Id": "myId_55231325"}}],
[77889, {"obj_icon": {"obj_design": {"str_type": "form_button_icon", "int_idRecord": 77888}}, "obj_span": {"obj_design": {"str_type": "form_button_span", "int_idRecord": 77887}}, "obj_design": {"str_tag": "a", "arr_item": [{"obj_design": {"str_type": "form_button_span", "int_idRecord": 77887}}, {"obj_design": {"str_type": "form_button_icon", "int_idRecord": 77888}}], "str_name": "form_button_anchor", "str_text": "notset", "str_type": "form_button_anchor", "bln_editPin": true, "str_content": "", "int_idRecord": "77889", "str_classList": "notset", "str_idProject": "myId_77377077", "str_idXDesign": "myId_52971117", "str_nameShort": "form_button_anchor", "str_themeType": "form_button_anchor", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "0.5em", "text": "de", "color": "white", "border": "0px solid black", "display": "flex", "font-size": "1.2rem", "align-items": "center", "font-weight": "bold", "justify-content": "center", "text-decoration": "none"}, "obj_domProperty": {"Id": "myId_52971117", "target": "_blank"}, "dom_objContentContainer": {"Id": "myId_52971117"}}],
[77890, {"obj_design": {"str_tag": "button", "arr_item": [{"obj_design": {"str_type": "form_button_anchor", "int_idRecord": 77889}}], "blnIsTag": true, "str_icon": "xapp_star", "str_name": "menu_button", "str_text": "My Button", "str_type": "form_button_rich", "bln_editPin": true, "str_content": "My component", "bln_typeable": true, "int_idRecord": "77890", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_95797735", "str_nameShort": "menu_button", "str_themeType": "menu_button", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "form_button", "str_createdDate": "2022-02-02 19:54:40", "str_categoryName": "", "str_modifiedDate": "2022-02-02 19:54:40", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "bln_enabled": true, "obj_domStyle": {"gap": "1em", "color": "white", "width": "100%", "border": "1em solid orange", "cursor": "pointer", "display": "flex", "padding": "1em", "font-size": "1.2rem", "background": "green", "align-items": "center", "font-weight": "bold", "margin-bottom": "", "justify-content": "center"}, "obj_domProperty": {"Id": "myId_95797735", "str_name": "xapp_button_navigate_desktop", "innerHTML": "Office", "innerText": "Desktop"}, "dom_objContentContainer": {"Id": "myId_95797735", "str_name": "xapp_button_navigate_desktop"}}],
[77891, {"obj_design": {"str_tag": "legend", "str_name": "form_legend", "str_text": "MyText", "str_type": "form_legend", "bln_editPin": true, "str_content": "", "int_idRecord": "77891", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_75739225", "str_nameShort": "form_legend", "str_themeType": "form_legend", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "form_button", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "bln_enabled": true, "obj_domStyle": {"gap": "1em", "color": "white", "border": "0.5em solid orange", "display": "flex", "opacity": "1", "padding": "1em", "background": "green", "user-select": "none", "border-radius": "0.5em", "text-decoration": ""}, "obj_domProperty": {"Id": "myId_75739225", "href": "https://www.mycode.buzz", "target": "_blank", "tabIndex": "0", "innerHTML": "MyText"}, "dom_objContentContainer": {"Id": "myId_75739225", "href": "https://www.mycode.buzz", "target": "_blank"}}],
[77894, {"obj_design": {"str_tag": "field", "arr_item": [{"obj_design": {"str_type": "form_label", "int_idRecord": 77921}}, {"obj_design": {"str_type": "form_text", "int_idRecord": "77920"}}], "str_name": "form_field", "str_text": "notset", "str_type": "form_field", "bln_editPin": true, "str_content": "", "int_idRecord": "77894", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_22775991", "str_nameShort": "form_field", "str_themeType": "form_field", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "1em", "border": "", "display": "flex", "padding": "0em", "flex-flow": "", "flex-wrap": "column wrap", "align-items": "", "justify-content": "", " justify-content": "center"}, "obj_domProperty": {"Id": "myId_22775991"}, "dom_objContentContainer": {"Id": "myId_22775991"}}],
[77895, {"obj_design": {"str_tag": "span", "blnIsTag": true, "str_name": "form_button_span", "str_text": "My Button", "str_type": "form_button_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77895", "str_classList": "notset", "str_idProject": "myId_11190110", "str_idXDesign": "myId_29571371", "str_nameShort": "form_button_span", "str_themeType": "form_button_span", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "white", "display": "block", "font-size": "1.1rem", "maxheight": "175", "font-weight": "bold", "font-wiegth": "bold"}, "obj_domProperty": {"Id": "myId_29571371", "innerHTML": "My Button"}, "dom_objContentContainer": {"Id": "myId_29571371"}}],
[77896, {"obj_design": {"bln": "expand", "str_tag": "i", "str_name": "form_button_icon", "str_text": "star", "str_type": "form_button_icon", "str_class": "star", "bln_expand": true, "bln_editPin": true, "str_content": "", "int_idRecord": "77896", "str_classList": "notset", "str_idProject": "myId_79120090", "str_idXDesign": "myId_19252325", "str_nameShort": "form_button_icon", "str_themeType": "form_button_icon", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "white", "display": "block", "font-size": "1.5em", "font-weight": "bold"}, "obj_domProperty": {"Id": "myId_19252325", "innerHTML": "star"}, "dom_objContentContainer": {"Id": "myId_19252325"}}],
[77897, {"obj_icon": {"obj_design": {"str_type": "form_button_icon", "int_idRecord": 77896}}, "obj_span": {"obj_design": {"str_type": "form_button_span", "int_idRecord": 77895}}, "obj_design": {"str_tag": "a", "arr_item": [{"obj_design": {"str_type": "form_button_span", "int_idRecord": 77895}}, {"obj_design": {"str_type": "form_button_icon", "int_idRecord": 77896}}], "str_name": "form_button_anchor", "str_text": "notset", "str_type": "form_button_anchor", "bln_editPin": true, "str_content": "", "int_idRecord": "77897", "str_classList": "notset", "str_idProject": "myId_11190110", "str_idXDesign": "myId_51522125", "str_nameShort": "form_button_anchor", "str_themeType": "form_button_anchor", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "0.5em", "text": "de", "color": "white", "border": "0px solid black", "display": "flex", "font-size": "1.1rem", "align-items": "center", "font-weight": "bold", "justify-content": "center", "text-decoration": "none"}, "obj_domProperty": {"Id": "myId_51522125", "target": "_blank"}, "dom_objContentContainer": {"Id": "myId_51522125"}}],
[77898, {"obj_design": {"str_tag": "button", "arr_item": [{"obj_design": {"str_type": "form_button_anchor", "int_idRecord": 77897}}], "blnIsTag": true, "str_icon": "xapp_star", "str_name": "form_button_rich", "str_text": "My Button", "str_type": "form_button_rich", "bln_editPin": true, "str_content": "My component", "bln_typeable": true, "int_idRecord": "77898", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_11722572", "str_nameShort": "form_button_rich", "str_themeType": "form_button", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "form_button", "str_createdDate": "2022-02-02 19:54:40", "str_categoryName": "", "str_modifiedDate": "2022-02-02 19:54:40", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "bln_enabled": true, "obj_domStyle": {"gap": "1em", "color": "white", "border": "0.5em solid orange", "cursor": "pointer", "display": "flex", "padding": "1em", "font-size": "1.1rem", "background": "green", "align-items": "center", "font-weight": "bold", "border-radius": "0.5em"}, "obj_domProperty": {"Id": "myId_11722572", "str_name": "xapp_button_navigate_desktop", "innerHTML": "Office", "innerText": "Desktop"}, "dom_objContentContainer": {"Id": "myId_11722572", "str_name": "xapp_button_navigate_desktop"}}],
[77899, {"obj_design": {"str_tag": "legend", "str_name": "form_legend", "str_text": "MyText", "str_type": "form_legend", "bln_editPin": true, "str_content": "", "int_idRecord": "77899", "str_classList": "notset", "str_idProject": "myId_63641161", "str_idXDesign": "myId_22552219", "str_nameShort": "form_legend", "str_themeType": "form_legend", "bln_dynamicPin": true, "bln_palettePin": true, "bln_isLocalHome": true, "str_classExtend": "form_button", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "bln_enabled": true, "obj_domStyle": {"gap": "1em", "color": "white", "border": "0.5em solid orange", "display": "flex", "opacity": "1", "padding": "1em", "background": "green", "user-select": "none", "border-radius": "0.5em", "text-decoration": ""}, "obj_domProperty": {"Id": "myId_22552219", "href": "https://www.mycode.buzz", "target": "_blank", "tabIndex": "0", "innerHTML": "MyText"}, "dom_objContentContainer": {"Id": "myId_22552219", "href": "https://www.mycode.buzz", "target": "_blank"}}],
[77900, {"obj_design": {"str_tag": "fieldset", "arr_item": [{"obj_design": {"str_type": "form_legend", "int_idRecord": "77891"}}, {"obj_design": {"str_type": "form_field", "int_idRecord": "77894"}}, {"obj_design": {"str_type": "form_button_rich", "int_idRecord": "77898"}}, {"obj_design": {"str_type": "form_legend", "int_idRecord": "77899"}}], "lockOpen": true, "str_name": "form_fieldset", "str_text": "notset", "str_type": "form_fieldset", "bln_editPin": true, "str_content": "", "int_idRecord": "77900", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_59192925", "str_nameShort": "form_fieldset", "str_themeType": "form_section", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "1em", "border": "1em solid orange", "margin": "0px", "display": "flex", "padding": "1em", "overflow": "hidden", "flex-flow": "row wrap", "flex-wrap": "wrap", "align-self": "", "background": "green", "align-items": "start", "border-radius": "0.5em", "flex-direction": "row"}, "bln_toggleState": true, "obj_domProperty": {"Id": "myId_59192925"}, "dom_objContentContainer": {"Id": "myId_59192925"}}],
[77901, {"obj_design": {"str_tag": "form_panel", "arr_item": [{"obj_design": {"str_type": "form_fieldset", "int_idRecord": "77900"}}], "str_name": "form_panel", "str_text": "notset", "str_type": "form_panel", "bln_editPin": true, "str_content": "", "int_idRecord": "77901", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_71299727", "str_nameShort": "form_panel", "str_themeType": "form_panel", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:05:11", "str_categoryName": "", "str_modifiedDate": "2022-01-31 21:05:11", "str_releaseLabel": "", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "1em", "border": "0px solid red", "display": "flex", "padding": "1em", "flex-flow": "", "flex-wrap": "column wrap", "background": "", "align-items": "end"}, "obj_domProperty": {"Id": "myId_71299727"}, "dom_objContentContainer": {"Id": "myId_71299727"}}],
[77902, {"obj_design": {"str_tag": "hr", "str_name": "form_hardrule", "str_text": "notset", "str_type": "form_hardrule", "bln_editPin": true, "str_content": "", "int_idRecord": "77902", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_72512221", "str_nameShort": "form_hardrule", "str_themeType": "form_hardrule", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2023-09-28 17:30:59", "str_categoryName": "", "str_modifiedDate": "2023-09-28 17:30:59", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "white", "width": "100%", "border": "1em solid orange", "height": "1.0em", "padding": "1em", "background": "green", "border-radius": "0em"}, "obj_domProperty": {"Id": "myId_72512221"}, "dom_objContentContainer": {"Id": "myId_72512221"}}],
[77903, {"obj_design": {"str_tag": "form_container", "arr_item": [{"obj_design": {"str_type": "form_panel", "int_idRecord": "77901"}}, {"obj_design": {"str_type": "form_hardrule", "int_idRecord": "77902"}}], "str_name": "form_container", "str_text": "notset", "str_type": "block", "bln_editPin": true, "str_content": "", "int_idRecord": "77903", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_11533137", "str_nameShort": "form_container", "str_themeType": "form_container", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-01-31 21:10:58", "str_categoryName": "Xtra", "str_modifiedDate": "2022-01-31 21:10:58", "str_releaseLabel": "", "bln_createRelease": "false", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true}, "obj_domStyle": {"gap": "1em", "border": "", "display": "flex", "padding": "0em", "flex-flow": "wrap", "background": "transparent", "align-items": "", "background-color": "transparent"}, "obj_domProperty": {"Id": "myId_11533137"}, "dom_objContentContainer": {"Id": "myId_11533137"}}],
[77904, {"obj_design": {"str_tag": "form_menu_panel", "arr_item": [{"obj_design": {"str_type": "block", "int_idRecord": "77903"}}], "str_name": "form_menu_panel", "str_text": "notset", "str_type": "form_menu_panel", "bln_editPin": true, "str_content": "", "int_idRecord": "77904", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_72912232", "str_nameShort": "form_menu_panel", "str_themeType": "form_menu_panel", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-15 08:47:57", "str_categoryName": "", "str_modifiedDate": "2022-11-15 08:47:57", "str_releaseLabel": "", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "1em", "border": "0px solid white", "display": "flex", "padding": "1em", "flex flow": "column wrap", "flexdirection": "column", "flex-direction": "column"}, "obj_domProperty": {"Id": "myId_72912232"}, "dom_objContentContainer": {"Id": "myId_72912232"}}],
[77905, {"obj_design": {"str_tag": "form", "arr_item": [{"obj_design": {"str_type": "form_menu_panel", "int_idRecord": "77904"}}], "str_name": "form_form", "str_text": "notset", "str_type": "form_form", "bln_editPin": true, "str_content": "", "int_idRecord": "77905", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_32992237", "str_nameShort": "form_form", "str_themeType": "form_form", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "component", "str_createdDate": "2022-11-01 21:47:45", "str_categoryName": "", "str_modifiedDate": "2022-11-01 21:47:45", "str_releaseLabel": "", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"gap": "1.0em", "display": "flex", "flex-wrap": "wrap", "flex-direction": "column", " background-color": "coral"}, "obj_domProperty": {"Id": "myId_32992237"}, "dom_objContentContainer": {"0": {"Id": "myId_59192925"}, "1": {"Id": "myId_11722572", "str_name": "xapp_button_navigate_desktop"}, "Id": "myId_32992237"}}],
[77906, {"obj_design": {"str_tag": "xapp_accordion", "arr_item": [{"obj_design": {"str_type": "form_button_rich", "int_idRecord": "77890"}}, {"obj_design": {"str_type": "form_form", "int_idRecord": "77905"}}], "blnIsTag": true, "str_name": "xapp_accordion", "str_text": "notset", "str_type": "xapp_accordion", "bln_editPin": true, "str_content": "", "int_idRecord": "77906", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_79557593", "str_nameShort": "xapp_accordion", "str_themeType": "xapp_accordion", "bln_palettePin": true, "bln_isLocalHome": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-01 21:51:10", "str_categoryName": "", "str_modifiedDate": "2022-11-01 21:51:10", "str_releaseLabel": "", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"flex": "wrap", "width": "100%", "border": "0em solid orange", "display": "block", "padding": "0em", "justify-content": "", "background-color": "green"}, "obj_domProperty": {"Id": "myId_79557593"}, "dom_objContentContainer": {"Id": "myId_79557593"}}],
[77907, {"obj_design": {"str_tag": "form_blockbackground", "blnIsTag": true, "str_name": "form_blockbackground", "str_text": "notset", "str_type": "form_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77907", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_92917315", "str_nameShort": "form_blockbackground", "str_themeType": "form_blockbackground", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "", "border": "", "padding": "1.0em", "overflow": "", "maxheight": "175", "background": "rgb(37, 150, 190)", "max-height": "", "word-break": "", "font-family": "", "border-radius": "4px"}, "obj_domProperty": {"Id": "myId_92917315"}, "dom_objContentContainer": {"Id": "myId_92917315"}}],
[77908, {"obj_design": {"str_tag": "form_blockmidground", "blnIsTag": true, "str_name": "form_blockmidground", "str_text": "", "str_type": "form_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77908", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_27252222", "str_nameShort": "form_blockmidground", "str_themeType": "form_blockmidground", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "", "border": "", "padding": "1.0em", "overflow": "", "maxheight": "175", "background": "rgb(64, 169, 236)", "max-height": "", "word-break": "", "font-family": "", "border-radius": "4px"}, "obj_domProperty": {"Id": "myId_27252222", "innerHTML": ""}, "dom_objContentContainer": {"Id": "myId_27252222"}}],
[77909, {"obj_design": {"str_tag": "form_blockforground", "blnIsTag": true, "str_name": "form_blockforground", "str_text": "notset", "str_type": "form_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77909", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_27252271", "str_nameShort": "form_blockforground", "str_themeType": "form_blockforground", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "", "border": "", "padding": "1.0em", "overflow": "", "maxheight": "175", "background": "white", "max-height": "", "word-break": "", "font-family": "", "border-radius": "4px"}, "obj_domProperty": {"Id": "myId_27252271"}, "dom_objContentContainer": {"Id": "myId_27252271"}}],
[77910, {"obj_design": {"str_tag": "form_blockhighlight", "blnIsTag": true, "str_name": "form_blockhighlight", "str_text": "notset", "str_type": "form_span", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77910", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_39551552", "str_nameShort": "form_blockhighlight", "str_themeType": "form_blockhighlight", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "", "border": "", "padding": "1.0em", "overflow": "", "maxheight": "175", "background": "orange", "max-height": "", "word-break": "", "font-family": "", "border-radius": "4px"}, "obj_domProperty": {"Id": "myId_39551552"}, "dom_objContentContainer": {"Id": "myId_39551552"}}],
[77920, {"obj_design": {"str_tag": "text", "blnIsTag": true, "str_name": "form_text", "str_text": "-", "str_type": "form_text", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77920", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_93792335", "str_nameShort": "form_text", "str_themeType": "form_input", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "form_input", "str_createdDate": "2022-11-18 16:02:10", "str_categoryName": "", "str_modifiedDate": "2022-11-18 16:02:10", "str_releaseLabel": "", "bln_classController": "false", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "black", "border": "0.5em solid orange", "padding": "1.0em", "overflow": "auto", "maxheight": "175", "min-width": "", "background": "white", "max-height": "500px", "word-break": "normal", "border-radius": "0em"}, "obj_domProperty": {"Id": "myId_09599995", "innerHTML": "-"}, "dom_objContentContainer": {"Id": "myId_09599995"}}],
[77921, {"obj_design": {"str_tag": "label", "str_name": "form_label", "str_text": "My Label", "str_type": "form_label", "bln_editPin": true, "str_content": "", "bln_typeable": true, "int_idRecord": "77921", "str_classList": "notset", "str_idProject": "myId_29727565", "str_idXDesign": "myId_53155553", "str_nameShort": "form_label", "str_themeType": "form_label", "bln_palettePin": true, "bln_isThemeItem": true, "str_classExtend": "notset", "str_createdDate": "2022-11-13 21:59:51", "str_categoryName": "", "str_modifiedDate": "2022-11-13 21:59:51", "str_releaseLabel": "", "str_lastVersionDate": "notset", "str_nameRegistrator": "notset", "bln_palettePinRelease": true, "bln_registerAtContainer": true}, "obj_domStyle": {"color": "orange", "border": "0.5em solid orange", "cursor": "pointer", "margin": "3px", "padding": "1.0em", "overflow": "auto", "max-width": "", "min-width": "", "align-self": "flex-start", "background": "green", "max-height": "", "word-break": "", "border-radius": "0px"}, "obj_domProperty": {"Id": "myId_53155553", "innerText": "My Label"}, "dom_objContentContainer": {"Id": "myId_53155553"}}]
]);
/*END INSTANCE JSON MAP//*/


//END JSONMAP

