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

        this.obj_themeStructure=new Object;
        
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
        if(!dom_frameElement){
            return;
        }
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
        this.fn_applyThemeStructure();                    
        this.fn_applyDesign();                                                                         
        this.fn_applyDomProperty();                                                                         
        //this.fn_applyDomAttribute();
        this.fn_applyStyle();               
        this.fn_expand();
        this.fn_onApplyFeatures();
    }

    fn_applyThemeStructure(){                        
    }

    fn_onApplyFeatures(){//overidden        
    }

    fn_applyDesign(){//overidden        
    }

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
        this.fn_setStyleProperty("borderWidth", "3px");
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
        if(obj_project.obj_design.str_type.toLowerCase()==="xapp_theme"){return;}//dont theme a theme project        

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
        this.fn_setStyleProperty("border", "10px solid " + str_color);
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

    

    fn_setStandardStyle(){                    
        
        //*
        if(this.obj_domStyle.height===undefined){this.obj_domStyle.height="40px";}              
        if(this.obj_domStyle.padding===undefined){this.obj_domStyle.padding="3px 12px";}
        if(this.obj_domStyle.border===undefined){this.obj_domStyle.border="0px solid black";}                                  
        if(this.obj_domStyle.cursor===undefined){this.obj_domStyle.cursor="pointer";}
        if(this.obj_domStyle.marginRight===undefined){this.obj_domStyle.marginRight="1px";}      
        if(this.obj_domStyle.marginBottom===undefined){this.obj_domStyle.marginBottom="1px";}              
        //*/
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
/*type: xapp_ajax//*/

//XSTART component/xdesign_ajax
  class xapp_ajax extends AJAX{
    constructor(obj_ini) {      
      super(obj_ini);        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);                
    }    
  
    fn_formatPost(obj_ini){ //overides parent AJAX format post    
    
      if(!obj_ini){return;}            
      
      obj_ini.bln_debugServer=this.obj_holder.bln_debugServer;      
      if(!obj_ini.str_recordName){
        obj_ini.str_recordName=this.obj_design.str_recordName;
      }
      if(!obj_ini.str_nameShort){
        obj_ini.str_nameShort=this.obj_design.str_nameShort;
      }
      
      if(!obj_ini.str_idAJAXNotifier){
        obj_ini.str_idAJAXNotifier=this.obj_design.str_idXDesign;
      }
      if(this.obj_design.str_nameFolderServer){obj_ini.str_nameFolderServer=this.obj_design.str_nameFolderServer;}
      if(this.obj_design.str_nameFileServer){obj_ini.str_nameFolderServer=this.obj_design.str_nameFileServer;}
      if(!obj_ini.str_nameFolderServer){obj_ini.str_nameFolderServer=this.obj_design.str_type;}
      if(!obj_ini.str_nameFileServer){obj_ini.str_nameFileServer=this.obj_holder.str_nameFileServer;}    
      obj_ini.str_urlServer=obj_path.fn_getURLServerFile(obj_ini.str_nameFolderServer, obj_ini.str_nameFileServer);                 
      
      //console.log("xapp_Ajax obj_ini.str_idAJAXNotifier: " + obj_ini.str_idAJAXNotifier);
      //console.log("xapp_Ajax obj_ini.str_action: " + obj_ini.str_action)
      //console.log("xapp_Ajax obj_ini.str_urlServer: " + obj_ini.str_urlServer)
      return super.fn_formatPost(obj_ini); // returns an obj_post
    }   

    fn_createDynamicContent(){
      let obj_ini;
      obj_ini=new Holder;                                    
      obj_ini.obj_design.str_type="xapp_dynamic_content";    
      obj_ini.obj_design.str_name="xapp_dynamic_content";          
      this.obj_holder.obj_dynamicContent=this.fn_addItem(obj_ini);                    
    }
  
  }//END CLS
  //END TAG
  //END component/xdesign_ajax
/*type: xapp_ajax//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_component//*/

            //XSTART component/xapp_component
              class xapp_component extends xapp_ajax{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
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
              }//END CLS
              //END TAG
              //END component/xapp_component
/*type: xapp_component//*/
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
/*type: form_input//*/

            //XSTART component/form_input
              class form_input extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.fn_setIsContainer(false);                                                      
                  

                  //*
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

                  //*/
                }    
                fn_applyThemeStructure(){                    
                  this.obj_themeStructure=obj_project.obj_themeFormInput;                
                  this.fn_applyStyle(this.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
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
/*type: tablecell//*/
class tablecell extends component {
    constructor(obj_ini) {      
      super(obj_ini); // call the super class constructor        
    }    
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);

      //this.fn_setType("tablecell");      
      this.fn_setTag("td", true);                  

      //START INITIALIZE DOM        
      //if(this.obj_domStyle.border===undefined){this.obj_domStyle.border="1px solid black";}                
      //END INITIALIZE DOM        
      
      //START INITIALIZE STYLE        
      //if(this.obj_domStyle.padding==undefined){this.obj_domStyle.padding="10px";}                      
      
      //END INITIALIZE STYLE 
    }         
  fn_locateItem(str_idXDesign, str_type){
    let arr, obj_item;
    arr=this.obj_design.arr_item;
    for(let i=0;i<arr.length;i++){
        obj_item=arr[i];     
        
        if(obj_item.fn_getType()===str_type){
          if(obj_item.obj_design.str_idXDesign==str_idXDesign){
            return obj_item;
          }
          if(obj_item.obj_design.str_linkId==str_idXDesign){
            return obj_item;
          }
        }
    }
    return false;
  }   
  
}//END CLS
//END tablecell

/*type: tablecell//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: tableheader//*/
class tableheader extends tablecell {
    constructor(obj_ini) {      
      super(obj_ini); // call the super class constructor        
    }  
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);      

      //this.fn_setType("tableheader");      
      this.fn_setTag("th", true);                       
    }
      
    
}//END CLS
/*type: tableheader//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: tablerow//*/
class tablerow extends component{
    constructor(obj_ini) {            
      super(obj_ini); // call the super class constructor                
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);

      //this.fn_setType("tablerow");      
      this.fn_setTag("tr", true);                  

      //START INITIALIZE DESIGN      
      //END INITIALIZE DESIGN     
      
    }       
    fn_addItem(obj_ini){
      let obj_item;  

      if(obj_ini.obj_design.str_type===undefined){
        obj_ini.obj_design.str_type="tablecell";                         
      }
      obj_item=super.fn_addItem(obj_ini);//CallSuper          
      return obj_item;
    }
    fn_setCellStyle(str_name, str_value){

      let arr, obj_item;
      arr=this.obj_design.arr_item;
      for(let i=0;i<arr.length;i++){
          obj_item=arr[i];              
          obj_item.fn_setStyleProperty(str_name, str_value);            
      }
    }
    fn_locateItem(str_idXDesign, str_type){
      let arr, obj_item, obj_locate;
      arr=this.obj_design.arr_item;
      for(let i=0;i<arr.length;i++){
          obj_item=arr[i];              
          obj_locate=obj_item.fn_locateItem(str_idXDesign, str_type);            
          if(obj_locate){
            return obj_locate;
          }
      }
      return false;
    }
}//END CLS


/*type: tablerow//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: table//*/
class table extends component {
    constructor(obj_ini) {      
      super(obj_ini); // call the super class constructor        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);

      //this.fn_setType("table");      
      this.fn_setTag("table", true); 
      
      this.fn_requires("tablerow");          
      this.fn_requires("tablecell");          
      this.fn_requires("tableheader");          

      //START INITIALIZE DESIGN      
      //END INITIALIZE DESIGN

      //START INITIALIZE DOM          
      //END INITIALIZE DOM              
    }       
    fn_addItem(obj_ini=false){
      let obj_item;        
      if(!obj_ini){
        obj_ini=new Holder;
        obj_ini.obj_design.str_type="tablerow";                   
      }      
      obj_item=super.fn_addItem(obj_ini);//CallSuper          
      return obj_item;
    }
    fn_setCellStyle(str_name, str_value){
      let arr, obj_item;
      arr=this.obj_design.arr_item;
      for(let i=0;i<arr.length;i++){
          obj_item=arr[i];              
          obj_item.fn_setCellStyle(str_name, str_value);            
      }
    }
    fn_locateItem(str_idXDesign, str_type){
      if(str_idXDesign===undefined){return;}
      if(str_idXDesign===""){return;}
      let arr, obj_item, obj_locate;
      arr=this.obj_design.arr_item;
      for(let i=0;i<arr.length;i++){
          obj_item=arr[i];              
          obj_locate=obj_item.fn_locateItem(str_idXDesign, str_type);            
          if(obj_locate){
            return obj_locate;
          }
      }
      return false;

    }
}//END CLS
//END IMG

/*type: table//*/
/*END COMPONENT//*/


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
        fn_onLoad(){          
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}              
          
          this.fn_showIcon(this.obj_design.str_icon);                    
        }                
        
        fn_applyThemeStructure(){                    
          this.obj_themeStructure=obj_project.obj_themeFormButton;                
          this.fn_applyStyle(this.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
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
        fn_setText(str_value){          
          
          super.fn_setText(str_value);
          
          if(this.obj_design.str_themeType==="form_button"){
            if(obj_project.bln_isMobile){
              if(obj_shared.fn_isSmallScreen()){//less than 400              
                if(this.obj_design.str_icon){
                  this.fn_showIcon(this.obj_design.str_icon);                  
                  str_value="";
                } 
              }
            }
          }

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setText(str_value);          
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
/*type: xapp_menu_operation//*/

            //XSTART component/xapp_menu_operation
              class xapp_menu_operation extends form_button_rich{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){                

                  super.fn_initialize(obj_ini);
                  
                  
                  //START INITIALIZE DESIGN        
                  if(this.fn_getIsOpen()===undefined){this.fn_setIsOpen(false);}//ensure visible place holder at front of object defintion        
                  if(this.obj_design.str_text===undefined){this.obj_design.str_text=this.obj_design.str_name;}                              
                  //END INITIALIZE DESIGN     
                  
                  //START INITIALIZE DOM
                  //END INITIALIZE DOM

                  this.fn_resetArrayStandardMenu();                  
              
                  if(this.fn_getAutoPin()){
                      this.obj_design.bln_isPinned=true;
                  };
              
                  
                  this.obj_holder.bln_referencedObject=false;
                  this.obj_holder.bln_displayedConsole=false;
              
                  this.obj_holder.bln_listenClick=true;
                  
                  
              } 
              //BASIC OPS                       
              fn_initializeDynamic(){              
              this.fn_setTag("button", true);                      
              this.fn_setThemeType("menu_button");                      
              }

              fn_setDisplay(bln_value=true){                          
                super.fn_setDisplay(bln_value);       
                if(bln_value){                  
                  this.dom_objContent.style.display="block"; 
                }                 
            }    

              fn_disableConsole(){                
                this.obj_menuPanel.fn_disableConsole();
              }
              fn_hideConsole(){                
                console.log("xapp_menu_operation fn_hideConsole")
                this.obj_menuPanel.fn_hideConsole();
              }


              fn_setDomContainer(){

                let dom_obj;
                dom_obj=document.createElement("div");        
                this.dom_obj.parentNode.insertBefore(dom_obj, this.dom_obj.nextSibling);                
                dom_obj.style.display="none";
                this.dom_objContentContainer=dom_obj;            
            
                dom_obj=document.createElement("div");                  
                dom_obj.style.display="block";        
                dom_obj.style.flexWrap=this.obj_domStyle.flexWrap;        
                dom_obj.style.padding="0px";                        
                dom_obj.style.marginBottom="0px";                        
                dom_obj.style.marginRight="0px";                        
                dom_obj.style.width="100%";                  
                dom_obj.innerHTML=this.obj_design.str_content;                                    
                this.dom_objContentContainer.appendChild(dom_obj);     
                this.dom_objContent=dom_obj;
              }
              
              xfn_createSelf(){
              
                  super.fn_createSelf();
                  
                  this.fn_setDomContainer();
                
              }   
              
              fn_setHTMLContent(){
                  super.fn_setHTMLContent();    
                  this.fn_setText(this.obj_design.str_text);                
              } 
              
              fn_addItem(obj_ini){
                  let obj_item;        
                  if(obj_ini.obj_design.str_type===undefined){
                      obj_ini.obj_design.str_type="button";                   
                  }                
                  obj_item=super.fn_addItem(obj_ini);//CallSuper
                  
                  return obj_item;
              }                 
              
              
              fn_referenceObject(){
                  if(this.obj_holder.bln_referencedObject){return;}
                  this.obj_holder.bln_referencedObject=true;        
                  this.fn_setMenuPanel();        
                  
              }
              fn_configureObject(){}
              fn_displayObject(){}


              //CLICK / OPEN / CLOSE
              fn_onClick(e){                  

                //this.fn_debug();

                obj_project.fn_forgetEvent(e);    
                //foregetevent                
                
                //this.fn_debugText("click");
                this.fn_toggle();
                
            }    

            fn_toggleHidden(){
              let bln_value=this.fn_getHiddenPin();
              let bln_toggle=obj_shared.fn_flipBool(bln_value);
              this.fn_setHiddenPin(bln_toggle);                              
            }
            
              fn_toggle(){   
                
                //this.fn_debugText("fn_toggle");
              
                if(this.fn_hasContextHolderParent()){return;}                     

                let bln_isOpen=this.fn_getIsOpen();
                if(bln_isOpen){                                
                    this.fn_close();                    
                }
                else{                                                    
                  this.fn_open();                  
                } 
                
                
            }                

              fn_open(){                 
                  
                if(this.fn_getIsOpen()){return;}
                
                if(this.fn_getAutoPin()){this.obj_design.bln_isPinned=true;}                
                this.fn_referenceObject();
                this.fn_startReflow();

                //*
                let bln_autoFetch=this.fn_getAutoFetch();              
                let bln_queryListMode=this.fn_getQueryListMode();
                if(bln_autoFetch || bln_queryListMode){                
                  this.fn_clearContent();                  
                }              
                //*/

                //this.fn_setStyleProperty("borderTopWidth", "1px");
                
                

                this.fn_onOpen();
                this.fn_openContent();



                let bln_togglePeers=this.fn_getTogglePeersPin();              
                let bln_closePeers=this.fn_getClosePeersPin();                
                if(this.bln_topLevelMenu){                
                  if(bln_togglePeers){this.fn_closePeers();}//close dont hide on top level
                }
                else{
                  if(bln_closePeers){this.fn_closePeers();}
                  if(bln_togglePeers){this.fn_displayOffPeers();}
                }   
                
                
                if(this.obj_parentMenu){
                  this.obj_parentMenu.bln_childrenOpen=true;
                }
                
              }

              fn_getElementDistanceToTop(element) {
                const rect = element.getBoundingClientRect();
                const distanceToTop = window.pageYOffset + rect.top;
                return distanceToTop;
            }
              
              fn_close(){        

                if(this.obj_parentMenu){
                  this.obj_parentMenu.bln_childrenOpen=false;
                }                                                
                //this.fn_debugText("fn_close");                
              
                  if(!this.fn_getIsOpen()){return;}
                  
                  this.fn_closeChildren();

                  if(this.fn_getLockOpenPin()){                    
                    return;
                  }

                  if(this.fn_getSettingOperationPin()){
                    let str_metaRowzName=this.fn_getMetaRowzName();
                    if(str_metaRowzName==="Settings"){
                      this.fn_setHiddenPin(true);                
                    }                    
                  }               
                  
                  /*
                  let str_borderWidth="0px";
                  if(this.obj_parentMenu){                    
                    let bln_value=this.obj_parentMenu.fn_isChildTop(this);
                    if(bln_value){
                      str_borderWidth="1px";
                    }
                  }
                    this.fn_setStyleProperty("borderTopWidth", str_borderWidth);                  
                  //*/
                  //this.fn_setStyleProperty("borderTopWidth", "0px");                  
                  

                  this.fn_onClose();
                  this.fn_closeContent();                          

                  let bln_togglePeers=this.fn_getTogglePeersPin();                                
                  if(bln_togglePeers){this.fn_displayOnPeers();}                  
              } 

              fn_isChildTop(obj_childMenu){
                let arrChildMenu;
                if(obj_childMenu.fn_getIsDynamicMenu()){
                  arrChildMenu=this.obj_holder.arr_dynamicMenu;                      
                }
                else{
                  arrChildMenu=this.obj_holder.arr_standardMenu;
                }
                let obj_candidate=arrChildMenu[0];
                if(obj_candidate===obj_childMenu){
                  return true;
                }
                return false;

              }
              xfn_closeChildren(){

                //this.fn_debugText("fn_closeChildren");
                  
                let arr=this.obj_design.arr_item;
                for(let i=0;i<arr.length;i++){
                    let obj_item=arr[i];                                    
                    let str_method="fn_close";                            
                    if(obj_item && obj_item[str_method]){                                      
                        obj_item[str_method]();
                    }                  
                }
            }

            fn_closeChildren(){

              //this.fn_debugText("fn_closeChildren");
                
              /*
              let obj_accordion=this.fn_getAccordionChildMenu();
              obj_accordion.fn_close();              
              //*/
              
              //*
              this.fn_closeChildMenus();
              //*/
              
          }

          fn_closeChildMenus(){
            this.fn_closeChildMenu(this.obj_holder.arr_standardMenu);
            this.fn_closeChildMenu(this.obj_holder.arr_dynamicMenu);
          }

          fn_closeChildMenu(arr){
            
              for(let i=0;i<arr.length;i++){
                  let obj_item=arr[i];                                    
                  let str_method="fn_close";                            
                  if(obj_item && obj_item[str_method]){                                    
                      obj_item[str_method]();
                  }                  
              }
        } 
            
              fn_onOpen(){
                  this.fn_setStyleProperty("marginBottom", "0em");              
              }
              fn_onClose(){                      
                
                const str_value=this.obj_themeStructure.marginBottom;                
                this.fn_setStyleProperty("marginBottom", str_value);                              
                console.log("fn_onClose this.obj_themeStructure");            
                console.log(this.obj_themeStructure);            
                  
                if(this.bln_rebound){this.fn_open();}
                //this.fn_debugText("fn_onClose");
              } 
              fn_clearContent(){
                let obj_accordion=this.fn_getAccordionChildMenu();
                if(obj_accordion){obj_accordion.fn_removeChildren();}
                obj_accordion=this.fn_getAccordionView();
                if(obj_accordion){obj_accordion.fn_removeChildren();}
              }             
              
              fn_openContent(){          
              
                //this.fn_debugText("fn_openContent");
                  if(this.obj_domProperty.disabled){            
                      return;
                  }
                  
                  this.dom_objContentContainer.style.display="block";                  
                  this.fn_setIsOpen(true);                  
              
                  
                  if(this.fn_getRolodexPin()){
                      this.fn_closeChildren();
                  }
                  
              }
              fn_closeContent(){
                //this.fn_debugText("fn_closeContent");                
                  this.dom_objContentContainer.style.display="none";                  
                  this.fn_setIsOpen(false);                            
              }        
              
              
              //BASIC OPS 
              
              //MENU OPS 
              fn_getAdminPin(){
                return this.obj_meta.bln_adminPin;
              }   
              fn_setAdminPin(bln_value){
                this.obj_meta.bln_adminPin=bln_value;      
              }   
              fn_getArchivePin(){
                return this.obj_meta.bln_archivePin;
              }   
              fn_setArchivePin(bln_value){
                this.obj_meta.bln_archivePin=bln_value;      
              }   
              fn_getLockOpenPin(){
                return this.obj_meta.bln_lockOpenPin;
              }   
              fn_setLockOpenPin(bln_value){
                this.obj_meta.bln_lockOpenPin=bln_value;      
              }   
              
              fn_getRolodexPin(){        
                  if(!this.obj_menuProject){return false};
                  return this.obj_menuProject.bln_rolodexPin;
              }
              /*
              fn_getRolodexPin(){                
                  return this.obj_meta.bln_rolodexPin;
              }
              //*/    
              fn_getTogglePeersPin(){
                  
                  if(!this.obj_menuProject){return false};            
                  return this.obj_menuProject.bln_togglePeersPin;
              }  
              
              fn_getClosePeersPin(){
                  
                  if(!this.obj_menuProject){return false};            
                  return this.obj_menuProject.bln_closePeersPin;
              }  
              
              fn_getAutoPin(){        
                  if(!this.obj_menuProject){return false};
                  return this.obj_menuProject.bln_autoPin;
              }    
              fn_setMenuPanel(bln_value){        
                  if(this.obj_menuPanel){return;}                        
                  this.obj_menuPanel=this.fn_addContextItem("xapp_menu_panel");
                }  
                
                
                fn_displayMenuPanel(bln_value){                
                  if(!this.obj_menuPanel){return;}                        
                  this.obj_menuPanel.fn_setDisplayFlex(bln_value);
                  this.obj_menuPanel.fn_setVisible(bln_value);                  
                }  

                fn_interfaceHide(){
                  //console.log("fn_interfaceHide");
                  this.fn_hide();
                }
                fn_interfaceShow(){                  
                  this.fn_show();
                }

                fn_displayOn(){                         
                  let bln_value=this.fn_getHiddenPin();
                  if(bln_value){return;}
                  super.fn_displayOn();                    
              }     
                fn_displayOff(){
                  let bln_value=this.fn_getHiddenPin();
                  if(bln_value){return;}                  
                  super.fn_displayOff();                    
                }     
              
                fn_hide(){
                  super.fn_hide();
                  this.fn_displayCover(true);
                }
                fn_show(){
                  super.fn_show();    
                  this.fn_displayCover(false);  
                }
                
                fn_startReflow(){                
                  this.fn_displayCover(true);    
                  this.fn_hidePeersVertical();         
                }     
                
                fn_endReflow(){
                  if(this.fn_getRolodexPin() && this.obj_parentMenu){this.obj_parentMenu.obj_menuPanel.fn_setDisplayFlex(false);} 
                  this.fn_showPeersVertical();                  
                  this.fn_displayCover(false);    
                }           
                fn_displayCover(bln_value){        
                  let str_value="visible";                
                  if(bln_value){str_value="hidden";}
                  if(this.obj_menuPanel){this.obj_menuPanel.fn_setVisible(str_value);}                  
                  if(this.obj_accordionChildMenu){
                    
                    if(this.fn_getLimitEndMenuChain()){                      
                      this.obj_accordionChildMenu.fn_setDisplay(false);                    
                      let obj_parent=this.obj_accordionChildMenu.fn_getParentComponent();                      
                      obj_parent.fn_addContextItemOnce("form_hardrule");                                                    
                    }                    
                    else{
                      this.obj_accordionChildMenu.fn_setVisible(str_value);                    
                    }
                    
                  }

                  
                }
              
                fn_methodPeersVertical(str_method, obj_exclude, bln_ignoreBefore){                
              
                  this.fn_methodPeers(str_method, obj_exclude, bln_ignoreBefore);
                  let obj_parent=this.obj_parentMenu;        
                  if(obj_parent){
                      obj_parent.fn_methodPeersVertical(str_method, obj_parent, bln_ignoreBefore);
                  }                
              }              
              
              fn_methodPeers(str_method, obj_exclude, bln_ignoreBefore){                
                
              let obj_accordion=this.fn_getParentComponent();                                                 
              if(obj_accordion && obj_accordion[str_method]){
                  obj_accordion[str_method](obj_exclude, bln_ignoreBefore);
              }                    
              }                                   
              fn_closePeersVertical(){                
                  
                  this.fn_closePeers();                
                  if(this.obj_parentMenu){
                    this.obj_parentMenu.fn_closePeersVertical();
                  }                                                
              }
              fn_closePeers(){                
                  
                  this.fn_methodPeers("fn_closeLevel", this, false); 
                  
                  if(this.obj_parentMenu){
                    this.obj_parentMenu.bln_childrenOpen=false;
                  }                                                
              }
              fn_hidePeersVertical(){                
                  this.fn_hidePeers();                
                  if(this.obj_parentMenu){this.obj_parentMenu.fn_hidePeersVertical();}                                                
              }
              fn_hidePeers(){                
                  this.fn_methodPeers("fn_hideLevel", this, true); 
              }
              
              fn_showPeersVertical(){                
                  this.fn_showPeers();                
                  if(this.obj_parentMenu){this.obj_parentMenu.fn_showPeersVertical();}                                                
              }
              fn_showPeers(){                
                  this.fn_methodPeers("fn_showLevel", this, true);                 
              }     
              fn_displayOnPeers(){
                  this.fn_methodPeers("fn_displayOnLevel", this, false);                 
              }         
              fn_displayOffPeers(){
                  this.fn_methodPeers("fn_displayOffLevel", this, false);                 
              }         
                //MENU OPS
                  fn_onStateChange(){}

                  fn_showAccordion(bln_value){
                    let obj_item=this.fn_getAccordionView();    
                    if(obj_item){
                      this.obj_meta.bln_displayAccordionView=bln_value;
                      obj_item.fn_setDisplay(bln_value);
                    }
                  }              

                  //CHILDMENU OPS                  
                fn_setAccordionChildMenu(){
                    if(this.obj_accordionChildMenu){return;}            
                    let obj_container=this.fn_addContextItem("xapp_accordion");
                    if(!obj_container){
                        console.log("ERROR: xapp_menu_operation fn_setAccordionChildMenu contexrt item not found xapp_accordion");
                        return;
                    }             
                    this.obj_accordionChildMenu=obj_container;                      
                  }
                  fn_getAccordionChildMenu(){      
                    return this.obj_accordionChildMenu;
                  }   
                  
                  //Menu Command Func
                  fn_countMenu(){                        
                    let arr_item=this.fn_getArrayStandardMenu();
                    for(let i=0;i<arr_item.length;i++){      
                      let obj_item=arr_item[i];                      
                      obj_item.fn_close();
                      obj_item.fn_clearButtonCount();          
                      obj_item.fn_runCount();          
                      //obj_item.fn_open();          
                      //obj_item.fn_close();          
                      
                    }
                  }
                  fn_hideMenu(obj_exclude){
                    this.fn_hideStandardMenu(obj_exclude);              
                  }
                  fn_closeMenu(obj_exclude){    
                    this.fn_closeStandardMenu(obj_exclude)
                  }
                  fn_menuCloseAndDisable(obj_exclude){
                    this.fn_standardMenuCloseAndDisable(obj_exclude);
                  }
                  fn_notifyMenu(str_nameFunction, obj_arg=false){
                    this.fn_notifyStandardMenu(str_nameFunction, obj_arg);                    
                  }                                    
                  //Menu Command Func

                  fn_notifyStandardMenu(str_nameFunction, obj_arg=false){                  
                    let arr_item=this.fn_getArrayStandardMenu();
                    for(let i=0;i<arr_item.length;i++){      
                      let obj_item=arr_item[i];
                      this.fn_notify(obj_item, str_nameFunction, obj_arg);                                  
                    }
                  }                              
                  
                  
                    fn_hideStandardMenu(obj_exclude){                          
                      let arr_item=this.fn_getArrayStandardMenu();
                      for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                            if(obj_item!==obj_exclude){
                                obj_item.fn_close();
                                obj_item.fn_setDisplay(false);           
                            }
                        }
                    }                   
                    
                    
                    fn_closeStandardMenu(obj_exclude){                                                
                      let arr_item=this.fn_getArrayStandardMenu();
                      for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                            if(obj_item!==obj_exclude){
                                obj_item.fn_close();                                 
                                obj_item.fn_clearButtonCount();
                            }
                        }
                    }
                    
                    fn_standardMenuCloseAndDisable(obj_exclude){                          
                      let arr_item=this.fn_getArrayStandardMenu();
                      for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                            if(obj_item!==obj_exclude){
                                obj_item.fn_close();          
                                obj_item.fn_setDisabled();                                                  
                            }
                            obj_item.fn_standardMenuCloseAndDisable(obj_exclude);
                        }
                    }                                      
                  

                  fn_resetArrayStandardMenu(){                    
                    this.obj_holder.arr_standardMenu=[];                                  
                  }
                  fn_resetArrayDynamicMenu(){                    
                    this.obj_holder.arr_dynamicMenu=[];                                  
                  }
                  
                  fn_addToArrayStandardMenu(obj_item){                    
                    this.obj_holder.arr_standardMenu.push(obj_item);                    
                    this.fn_setMenuParent(obj_item);                    
                    //obj_item.fn_debug();                    
                  }
                  fn_getArrayStandardMenu(){
                    return this.obj_holder.arr_standardMenu;
                  }                          
                  
                  fn_getOnlyStandardMenu(){
                    let arr_item=this.fn_getArrayStandardMenu();                                        
                    //this.fn_debugArrayStandardMenu();                    
                    if(arr_item.length===1){
                      return arr_item[0];
                    }   
                    return false;
                  }                     

                  fn_debugArrayStandardMenu(obj_exclude){    
                    let arr_item=this.fn_getArrayStandardMenu();
                    //this.fn_debugText("arr_standard item.length: " + arr_item.length);
                    //console.log(arr_item);                    
                    /*
                    for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                        //obj_item.fn_debug();
                    }
                    //*/
                  }
                  fn_getStandardMenuByName(str_name){                  
                    
                    if(this.obj_design.str_name===str_name){
                      return this;
                    }                                       
                    let arr_item=this.fn_getArrayStandardMenu();                      
                    for(let i=0;i<arr_item.length;i++){      
                        let obj_menuButton=arr_item[i];                                                  
                        return obj_menuButton.fn_getStandardMenuByName(str_name);
                    }
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
                  
                
              
                //CHILDMENU OPS
              
              }//END CLS
              //END TAG
              //END component/xapp_menu_operation
/*type: xapp_menu_operation//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_menu//*/

          //XSTART component/xapp_menu
          class xapp_menu extends xapp_menu_operation{
            constructor(obj_ini) {      
              super(obj_ini);        
            } 
            fn_initialize(obj_ini){                
    
              super.fn_initialize(obj_ini);

              this.str_defaultTypeMenu="xapp_menu";                                
              this.str_defaultTypeData="xapp_data_view";                                  
              this.str_defaultTypeDataChildMenu="xapp_data_childmenu";                                            
              
              this.obj_holder.str_queryList="";
              this.obj_holder.str_queryList="";
              
              this.fn_initialize_var();
              this.bln_debugQueryInterface=false;            
            }             

            fn_initialize_var(obj_ini){                

              this.obj_meta=this.fn_getMetaDefault();                        
              this.fn_setQueryList("");                                                                    
              this.fn_setDebugPin(false);                
              this.str_optionData="Data";
              this.str_optionReport="Report";    
              this.str_optionWidget="Widget";
              this.str_optionDashboard="Dashboard";
              this.str_optionMenu="Menu";                
              this.str_optionMenuForm="MenuForm";                
              this.bln_dynamicMenu=false;     

              this.obj_holder.str_queryList="";
              this.obj_holder.str_queryListParent="";
              this.obj_holder.str_queryListDisabled="";
              this.obj_holder.str_queryListParentDisabled="";
      
              this.str_listSeparator="-";
              this.bln_useMetaTemplate=false;
              this.bln_constraintKeyPin=true;
              this.fn_configureObject(false);

              let str_subdomain=this.obj_design.str_releaseLabel;                    
              if(str_subdomain==="notset" ||!str_subdomain){
                str_subdomain=this.obj_design.str_nameShort;                      
              }

              this.obj_holder.arr_standardMenu=[];
              this.obj_holder.arr_dynamicMenu=[];
          
            }
        
            
          /*
        SIGNPOST 1. menu fn_onOpen
        --------------------
        
        SIGNPOST 2. menu fn_referenceObject
        --------------------
        Will create the various objects          
        obj_dataView 
        obj_containerWidgetView      
        arr_dashboardView
        obj_accordionView 
        obj_dataChildMenu 
        obj_accordionChildMenu 
        
        
        SIGNPOST 3. menu fn_runDataChildMenu
        ----------------------------------------
        literally runs the standard menu system
        
        SIGNPOST 4. When that data rs ends, run data View
        ----------------------------------------
        
        SIGNPOST 5. menu fn_formViewRecord
        ----------------------------------------
        
        SIGNPOST 6. menu fn_runDataView
        ----------------------------------------
        
        SIGNPOST 7. obj_dataView fn_initializeRS (this ) (initialze dataview with menubutton obj_pararmRS etc)
        ----------------------------------------
        
        SIGNPOST 8. obj_dataView fn_getDataQuery
        ----------------------------------------
        
        SIGNPOST 9. obj_dataView fn_onDataStartView
        ----------------------------------------
        if bln_displayAccordionView then bln_displayAccordionChildMenu = false
        i.e. if we have a dynamci menu , then turn off standard Child Menu
        
        
        SIGNPOST 10. obj_dataView fn_runComputeRow
        ----------------------------------------
        
        SIGNPOST 11. menu fn_onComputeRowViewea
        ----------------------------------------
        fn_loadDashboard
        fn_loadWidget
        fn_loadMenu
        fn_loadDynamicMenu
        
        SIGNPOST 12. fn_loadDynamicMenu
        ----------------------------------------
        menu Will add a menu button to its accordionView for each row in data set with class in MetaTypeViewMenu (generally menu)
        The menu button will  operata as a standard menu, with menu fn_onOpen driving the operatoin
        
        //*/         
        
          fn_onLoad(){
            super.fn_onLoad();    
            //if(this.fn_hasContextHolderParent()){return;}                        
            this.fn_setDomContainer();

            
          }   

          fn_applyThemeStructure(){                    
            this.obj_themeStructure=obj_project.obj_themeMenuButton;                
            this.fn_applyStyle(this.obj_themeStructure);//should be called here . not on base object - due to class hierachy                        
          }
          
          fn_runSearch(){//overridden by Menuform
            this.bln_runSearch=true;            
            this.fn_formViewRecord();
          }      

          fn_loadReportInterface(){

            if(this.fn_getIsDynamicMenu()){return;}
            //ONLY RUNS IF MENU HAS A SEARCH BUTON 
            if(!this.bln_hasSearchButton){return;}     
            if(this.bln_simpleSearch){return;}     

            //ONLY RUNS ONE TIME ON PAGE LOAD / FIRST SEARCH            
            if(this.bln_loadedReportInterface){                          
              if(this.bln_debugQueryInterface){
                console.log("EARLY RETURN READ bln_readQueryOnce: this.bln_loadedReportInterface: " +  this.bln_loadedReportInterface);                
                console.log("EARLY RETURN str_queryList: " +  this.fn_getQueryList());
              }              
              return;
            }
            else{                
              this.bln_loadedReportInterface=true;
              if(this.bln_debugQueryInterface){
                console.log("READ ONCE bln_readQueryOnce: this.bln_loadedReportInterface: " +  this.bln_loadedReportInterface);
                console.log("READ ONCE str_queryList: " +  this.fn_getQueryList());
              }              
            }

            //console.log("fn_loadReportInterface");

            this.fn_loadQueryInterface();            
            this.fn_loadReportInterfaceFieldList();                        
            this.fn_loadReportInterfaceFieldCriteria();                                   

            this.obj_console_search.fn_getTabset();    
            this.obj_console_search.obj_tabset.obj_panellist.fn_displayPanel();              
            
          }

          fn_loadReportInterfaceFieldList(){                        
            this.obj_console_search.fn_addReportInterfaceFieldList();                
          }
          fn_loadReportInterfaceFieldCriteria(){
            this.obj_console_search.fn_addReportInterfaceFieldCriteria();                
          }

          fn_loadQueryInterface(){                        

            if(this.bln_debugQueryInterface){
              this.fn_debugText("START fn_loadQueryInterface: this.bln_hasSearchButton: " + this.bln_hasSearchButton);                
            }            

            let arr_term, str_term, i;
            let obj_button;
            let str_queryList, str_queryListDisabled;
            let obj_console_search=this.obj_console_search;            
            
            if(!this.bln_readQueryList){
              this.bln_readQueryList=true;                
              str_queryList=decodeURIComponent(this.obj_post.QueryList);
              if(this.bln_debugQueryInterface){
                console.log("READ POST str_queryList: " + str_queryList);
              }              
            }
            else{                  
              str_queryList=this.fn_getQueryList();                              
              if(this.bln_debugQueryInterface){
                console.log("CURRENT VALUE str_queryList: " + str_queryList);
              }
            }                
            
            if(str_queryList){                  
              arr_term=str_queryList.split(obj_shared.str_listSeparatorOr);                
              for(i=0;i<arr_term.length;i++){
                str_term=arr_term[i];                                  
                if(this.bln_debugQueryInterface){
                  console.log("str_term: " + str_term);
                }
                this.fn_addQueryTermToList(str_term);                                                       
                obj_button=obj_console_search.fn_addQueryTerm(str_term, true);                  
              }              
            }             
            
            if(!this.bln_readQueryDisabled){
              this.bln_readQueryDisabled=true;                
              str_queryListDisabled=decodeURIComponent(this.obj_post.QueryListDisabled);              
              if(this.bln_debugQueryInterface){
                console.log("READ POST str_queryListDisabled: " + str_queryListDisabled);
              }
            }
            else{                  
              str_queryListDisabled=this.fn_getQueryListDisabled();                                              
              if(this.bln_debugQueryInterface){
                console.log("CURRENT VALUE str_queryListDisabled: " + str_queryListDisabled);
              }
            }              
            if(str_queryListDisabled){                  
              arr_term=str_queryListDisabled.split(obj_shared.str_listSeparatorOr);
              for(i=0;i<arr_term.length;i++){
                str_term=arr_term[i];                
                if(this.bln_debugQueryInterface){
                  console.log("str_term disabled: " + str_term);
                }
                this.fn_addQueryTermToList(str_term);                                                       
                obj_button=obj_console_search.fn_addQueryTerm(str_term, false);                
                obj_console_search.fn_disableQueryTerm(obj_button);                                                       
              }
            }

            if(this.bln_debugQueryInterface){              
              console.log("END fn_loadQueryInterface");
            }            
          }



          
          fn_addQueryTermToList(str_queryTerm=""){

            
            if(!str_queryTerm){return;}              

            if(this.bln_debugQueryInterface){
              console.log("fn_addQueryTermToList: " + str_queryTerm);
            }


            let str_queryList=this.fn_getQueryList();                              
            let bln_found=obj_shared.fn_inString(str_queryTerm, str_queryList, obj_shared.str_listSeparatorOr);                              
                          
            if(!bln_found){                
              
              str_queryList = obj_shared.fn_trimCharacter(str_queryTerm+obj_shared.str_listSeparatorOr+str_queryList, obj_shared.str_listSeparatorOr);                                
              this.fn_setQueryList(str_queryList);                            
            }

            this.fn_removeQueryTermFromListDisabled(str_queryTerm);
          }

          fn_addQueryTermToListDisabled(str_queryTerm=""){

            if(!str_queryTerm){return;}

            if(this.bln_debugQueryInterface){
              console.log("fn_addQueryTermToListDisabled: " + str_queryTerm);
            }

            let str_queryList=this.fn_getQueryListDisabled();                                            
            let bln_found=obj_shared.fn_inString(str_queryTerm, str_queryList, obj_shared.str_listSeparatorOr);                              
            
            if(!bln_found){
              
              str_queryList = obj_shared.fn_trimCharacter(str_queryTerm+obj_shared.str_listSeparatorOr+str_queryList, obj_shared.str_listSeparatorOr);                  

              this.fn_setQueryListDisabled(str_queryList);                            
            }

            this.fn_removeQueryTermFromList(str_queryTerm);
          }

          fn_removeQueryTermFromList(str_queryTerm=""){

            if(!str_queryTerm){return;}

            let str_queryList;                            

            if(this.bln_debugQueryInterface){
              console.log("fn_removeQueryTermFromList: " + str_queryTerm);
            }

          
            
            str_queryList=this.fn_getQueryList();                            
            str_queryList=obj_shared.fn_replace(str_queryList, str_queryTerm, obj_shared.str_listSeparatorOr, obj_shared.str_listSeparatorOr);
            
            let obj_list={
              str_list : str_queryList,                
              str_separator : obj_shared.str_listSeparatorOr,
            };              
            obj_shared.fn_maintainList(obj_list);              
            
            this.fn_setQueryList(obj_list.str_list);                            
          }

          fn_removeQueryTermFromListDisabled(str_queryTerm=""){

            if(!str_queryTerm){return;}

            let str_queryList;                                        
            
            str_queryList=this.fn_getQueryListDisabled();                            
            str_queryList=obj_shared.fn_replace(str_queryList, str_queryTerm, obj_shared.str_listSeparatorOr, obj_shared.str_listSeparatorOr);
            
            let obj_list={
              str_list : str_queryList,                
              str_separator : obj_shared.str_listSeparatorOr,
            };              
            obj_shared.fn_maintainList(obj_list);              
            
            this.fn_setQueryListDisabled(obj_list.str_list);                            
          }            

          
          fn_resetQueryList(){
            this.fn_setQueryList("");
          }

          fn_setQuerySearch(str_querySearch){

            if(this.obj_dataView){   
              this.obj_dataView.fn_setDataQuerySearch(str_querySearch);
            }
            
          }
          fn_getQuerySearch(){
            if(this.obj_dataView){                                  
              return this.obj_dataView.fn_getDataQuerySearch();
            }

          }
          
          fn_setQueryList(str_queryList=""){                                                    

            if(this.fn_getIsDynamicMenu()){return;}
            
            if(this.bln_multiRecordDisplay){//All Record "Report View"                                                          
              this.fn_exitConstraint();
            }         
            
            
            if(this.obj_dataView){                    
              
              this.obj_dataView.fn_setDataQueryList(str_queryList);                                                              
              //console.log("fn_getQueryList: " + this.obj_dataView.fn_getDataQueryList());          
            }              
            else{
              this.obj_holder.str_queryList=str_queryList;//will form the QueryListParent for child menus                            
              //console.log("no data view: " + this.fn_getQueryList());
            }              
            
            if(!this.fn_getQueryList()){
              this.fn_notify(this.obj_console_search, "fn_resetSearchInterface");                
            }              
          }  

          fn_setQueryListDisabled(str_queryList=""){                                                                  
            
            if(this.fn_getIsDynamicMenu()){return "";}
            
            if(this.obj_dataView){              
              this.obj_dataView.fn_setDataQueryListDisabled(str_queryList);                                                              
            }              
            else{
              this.obj_holder.str_queryListDisabled=str_queryList;//will form the QueryListParentDisabled for child menus                            
            }
          }  

          fn_getQueryListDisabled(){                                                              

            if(this.fn_getIsDynamicMenu()){return "";}
            
            let str_value;
            if(this.obj_dataView){
              str_value= this.obj_dataView.fn_getDataQueryListDisabled();
            }
            else{
              str_value= this.obj_holder.str_queryListDisabled;
            }              
            //this.fn_debugText("fn_getQueryList: " + str_value);
            return str_value;
          }                      
          
          fn_getQueryList(){                                                              

            
            if(this.fn_getIsDynamicMenu()){return "";}
            
            let str_value;
            if(this.obj_dataView){
              str_value= this.obj_dataView.fn_getDataQueryList();
              //this.fn_debugText("xxxx DATA fn_getQueryList: " + str_value);
            }
            else{
              str_value= this.obj_holder.str_queryList;
              //this.fn_debugText("xxxx HOLDER fn_getQueryList: " + str_value);
            }              
            
            return str_value;
          }                      
          
          fn_getQueryListParent(){                                                

            if(this.fn_getIsDynamicMenu()){return "";}

            if(!this.obj_parentMenu){
              return "";
            }
            return this.obj_parentMenu.fn_getQueryList();                         
          }  
                                          
          fn_getQueryListParentDisabled(){            
            
            if(this.fn_getIsDynamicMenu()){return "";}

            if(!this.obj_parentMenu){
              return "";
            }
            return this.obj_parentMenu.fn_getQueryListDisabled();                         
          }                                  

          fn_setMetaRowzGroup(str_value){
            this.obj_meta.MetaRowzGroup=str_value;      
          }
          fn_getMetaRowzGroup(){
            return this.obj_meta.MetaRowzGroup;      
          }

          fn_setSubdomain(str_value){
            this.obj_meta.str_subdomain=str_value;
          }
          fn_getSubdomain(){
              return this.obj_meta.str_subdomain;
          }
          fn_getAutoOpenPin(){
            return this.obj_meta.bln_autoOpenPin;
          }
          fn_setAutoOpenPin(bln_value){
            this.obj_meta.bln_autoOpenPin=bln_value;
          }  
          fn_getAutoFetch(){
            return this.obj_meta.bln_autoFetch;
          }
          fn_setAutoFetch(bln_value){
            this.obj_meta.bln_autoFetch=bln_value;
          }            
          fn_getDisabledPin(){
            return this.obj_meta.bln_disabledPin;
          }
          fn_setDisabledPin(bln_value){
            this.obj_meta.bln_disabledPin=bln_value;
          }
          fn_setHiddenPin(bln_value){
            
            if(!this.obj_meta.bln_livePin  && !this.fn_getSettingOperationPin()){
              bln_value=true;
            }
            this.obj_meta.bln_hiddenPin=bln_value;              
            
            if(bln_value){                
              bln_value=false;                   
              this.dom_objContent.style.display="none";//works with fn_display
            }
            else{                           
              bln_value=true;              
            }                                          
            this.fn_setDisplay(bln_value);        
            
          }                                  
          fn_getHiddenPin(){
            return this.obj_meta.bln_hiddenPin;
          }                        
          fn_setLivePin(bln_value){
            this.obj_meta.bln_livePin=bln_value;              
            
            if(!bln_value && !this.fn_getSettingOperationPin()){
              this.fn_setHiddenPin(true);
            }
          }               
          fn_getLivePin(){
            return this.obj_meta.bln_livePin;              
          }    
          fn_getDebugPin(){
            return this.obj_meta.bln_debugPin;
          }               
          fn_setDebugPin(bln_value){
            this.obj_meta.bln_debugPin=bln_value;
            this.obj_holder.bln_debugServer=bln_value;                            
          }                             
          fn_setPublishPin(bln_value){
            this.obj_meta.bln_publishPin=bln_value;              
          }               
          fn_getPublishPin(){
            return this.obj_meta.bln_publishPin;              
          }    
          fn_setViewPin(bln_value){
            this.obj_meta.bln_viewPin=bln_value;              
          }               
          fn_getViewPin(){
            return this.obj_meta.bln_viewPin;              
          }             
          
          fn_setSelectMinimalFieldPin(bln_value){
            this.obj_meta.bln_selectMinimalFieldPin=bln_value;                            
          }               
          fn_getSelectMinimalFieldPin(){
            return this.obj_meta.bln_selectMinimalFieldPin;
          }               
          fn_setDynamicMenuPin(bln_value){              
            this.obj_meta.bln_dynamicMenuPin=bln_value;              
          }
          fn_getDynamicMenuPin(){
            return this.obj_meta.bln_dynamicMenuPin;
          }
          fn_setTemporaryRowzPin(bln_value){              
            this.obj_meta.bln_temporaryRowzPin=bln_value;              
          }
          fn_getTemporaryRowzPin(){
            return this.obj_meta.bln_temporaryRowzPin;
          }
          
          
          fn_autoOpenAccordion(){
            if(this.obj_meta.bln_displayAccordionView){
              this.obj_accordionView.fn_autoOpen();    
            }    
            if(this.obj_meta.bln_displayAccordionChildMenu){
              this.obj_accordionChildMenu.fn_autoOpen();
            }
          }    
          //MENU ACTION
          //----------------------------------------
          //SIGNPOST 1. menu fn_onOpen
          //----------------------------------------
          fn_onClick(e){                      
            super.fn_onClick(e);
            //console.log("menu tab fn_onClick");

            let str_metaRowzName=this.obj_meta.str_metaRowzName;              
            let str_metaRecordId=this.fn_getMenuRecordId();              
            obj_path.fn_pushStateNavigateRecordURL(str_metaRowzName, str_metaRecordId);
          }
          
          fn_onClose(){
            super.fn_onClose();                 
          }            
          fn_onOpen(){  
            super.fn_onOpen();
            
            this.fn_runMenu();  
            
          }

          fn_refreshMenu(){
            this.bln_flagRunOnce=false;                          
            this.fn_runMenu();           
          }      
          
          

          fn_getQueryListMode(){

            if(!this.obj_parentMenu){return;}
            let str_queryList=this.obj_parentMenu.fn_getQueryList();
            if(str_queryList){
              return true;
            }
            return false;
            
          }
          
          fn_runMenu(){
            if(this.fn_hasContextHolderParent()){return;}                                                                                         
            
            
            let bln_autoFetch=this.fn_getAutoFetch();              
            let bln_queryListMode=this.fn_getQueryListMode();                                          
            if(bln_queryListMode){                
              this.bln_flagRunOnce=false;
              bln_autoFetch=true;
            }              
            
            
            if(this.bln_flagRunOnce){                
              this.fn_runClient();    
              //this.fn_debugText("fn_runClient and return");
              return;
            }

            
            
            
            if(!bln_autoFetch){
              //console.log("autofetch is false, set bln_flagRunOnce");
              this.bln_flagRunOnce=true;           
            }                  

            this.fn_classifyLevel();                           
                
            if(this.bln_isJoinedChildMenu){                                
              if(this.fn_getAllowAutoJoinPin()){                  
                if(this.obj_meta.bln_joinTypeMany){                                                          
                  this.fn_setLimitEndMenuChain(true);                  
                }                    
              }
            }  
            //console.log("this.fn_getLimitEndMenuChain(): " + this.fn_getLimitEndMenuChain())

            
              //*
              let obj_accordion=this.fn_getAccordionChildMenu();
              if(obj_accordion){obj_accordion.fn_removeChildren();}
              obj_accordion=this.fn_getAccordionView();
              if(obj_accordion){obj_accordion.fn_removeChildren();}
              //*/
            

              //load child menus, once finished, views are loaded / dynamic menus are loaded.
              //console.log("");

              this.fn_runDataChildMenu();                          
            
            if(this.obj_meta.bln_displayDashboard){
              //console.log("fn_loadDashboards");
              this.fn_loadDashboards();    
            }                  
            
            
          }
        
          fn_notifyDashboard(str_nameFunction, obj_arg){                
            
            let arr_item=this.fn_getDashboardView();    
            if(!arr_item){return;}
            for(let i=0;i<arr_item.length;i++){
              let obj_dashboard=arr_item[i];
              this.fn_notify(obj_dashboard, str_nameFunction, obj_arg);                
            }
          }

          fn_refreshDashboards(){

            let arr_item=this.fn_getDashboardView();    
            if(!arr_item){return;}            
            for(let i=0;i<arr_item.length;i++){
              let obj_dashboard=arr_item[i];
              if(obj_dashboard){
                obj_dashboard.fn_refreshDashboard();
              }  
              //else{//console.log("Error Loading Dashboard: Check for Typos and Context Holders are in place");}
            }

          }

          fn_loadDashboards(){    
            let arr_item=this.fn_getDashboardView();                  
            if(!arr_item){return;}            
            for(let i=0;i<arr_item.length;i++){
              let obj_dashboard=arr_item[i];
              if(obj_dashboard){                  
                obj_dashboard.fn_loadDashboard();
              }  
              //else{//console.log("Error Loading Dashboard: Check for Typos and Context Holders are in place");}
            }              
          }
        
          fn_runClient(){    

            //this.fn_debugText("fn_runClient");
            
            
            if(!this.obj_meta.bln_runDataChildMenu){                  
              this.fn_configureObject(false);             
            }           
            
            this.fn_configureMenuPanel();           
            this.fn_displayObject();          
            this.fn_autoOpenAccordion();
        
            this.fn_endReflow();                
          }              
            //----------------------------------------
          //SIGNPOST 3. menu fn_runDataChildMenu
          //----------------------------------------
          
          fn_runDataChildMenu(){                                                    
            

            let obj_accordion=this.fn_getAccordionChildMenu();
            if(obj_accordion){obj_accordion.fn_removeChildren();}              
            
            if(!this.obj_dataChildMenu){
              //console.log("obj_dataChildMenu is false , return");
              return;
            }                            

            
            //this.fn_debugText("fn_runDataChildMenu");
            
        
            this.obj_dataChildMenu.fn_initializeRS(this);
            this.obj_dataChildMenu.fn_setComputeRows(true);    

            
            let obj_columnKey=this.fn_getContextColumnKey();

            //console.log(obj_columnKey);                                                              
            
            this.obj_dataChildMenu.fn_setMetaKey(obj_columnKey);

            //Meta Expr                                        
            this.obj_dataChildMenu.fn_setMetaViewId(this.fn_getMetaViewId());
            this.obj_dataChildMenu.fn_setMetaRowzId(this.fn_getMetaRowzId());              
            this.obj_dataChildMenu.fn_setMetaRowzName(this.fn_getMetaRowzName());              
            this.obj_dataChildMenu.fn_setMetaRowzTitle(this.fn_getMetaRowzTitle());                            
            
            this.obj_dataChildMenu.fn_setMetaViewId(this.fn_getMetaViewId());                  
            //Meta Expr

            this.obj_dataChildMenu.obj_holder.bln_debugServer=this.obj_holder.bln_debugServer;                                
            this.obj_dataChildMenu.fn_setSubdomain(this.fn_getSubdomain());                                    

            
            this.obj_dataChildMenu.obj_holder.obj_query.bln_loadReportInterface=false;
            if(this.bln_hasSearchButton && !this.bln_loadedReportInterface && this.bln_simpleSearch){                              
              this.obj_dataChildMenu.obj_holder.obj_query.bln_loadReportInterface=true;
            }                                       
            
            //this.fn_debugText();
            this.obj_dataChildMenu.fn_getChildRowz(); 
            
          }
          //MENU ACTIONS         
          
        
        
          //----------------------------------------
          //SIGNPOST 6. menu fn_runDataView
          //----------------------------------------            
        
          
          fn_getRunDataViewQueryExpression(){//can be overidden
            let str_expr="";
            return str_expr;    
          }  
          
          fn_getAutoJoinPin(){
            return this.obj_meta.bln_autoJoinPin;
          }

          fn_getValidView(){
            if(this.fn_getMetaViewId()===100){
              return false;
            }
            return true;
            
          }

          fn_runCount(){
          
            if(this.fn_getSettingOperationPin()){//dont apply to settings ui        
              //return;
            }

            this.fn_setDataViewCount();                              

            if(!this.fn_getValidView()){
              return;
            }

            if(!this.obj_dataView){
              return;
            }                
            if(this.fn_getAutoJoinPin()){
              //return;
            }            

            this.bln_runSearch=true;

            //Configure Query
            this.fn_configureDataViewQuery();                      
            
            this.obj_dataView.fn_getDataCountQuery(this.bln_runSearch);                               
            //this.fn_debugText("fn_runCountQuery");
          }
          
          fn_runDataView(){      

            this.bln_debugRunDataView=false;

            //This is automatically called on form button click by xapp_form_container_search / fn_onSubmit / obj_menuButton.fn_runSearch
            //xapp_console_container listensubmit is true

            //This is also automatically called on form button click by xapp_menu fn_onChildSubmit / this.fn_viewRecord            
            
        
            //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
            //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
            //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
            //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"
            
            if(!this.obj_design.bln_isOpen){
              return;
            }              
            
            //console.log("fn_runDataView");
            
            this.fn_resetArrayDynamicMenu();              
            
            if(!this.obj_dataView){//create relevant data view
              this.fn_setDataView();                              
            }                                            

            //console.log("1 this.obj_dataView.fn_getMetaViewId(): " + this.obj_dataView.fn_getMetaViewId());
            //console.log("2 this.fn_getMetaViewId(): " + this.fn_getMetaViewId());
            //this.obj_dataView.fn_setMetaViewId(this.fn_getMetaViewId());
            //console.log("3 this.obj_dataView.fn_getMetaViewId(): " + this.obj_dataView.fn_getMetaViewId());
            
            //Configure Query
            this.fn_configureDataViewQuery();                                    
            //count menu must go after Configure Query, but can go before Select Query
            
            this.obj_dataView.fn_getDataQuery(this.bln_runSearch);                               
            if(this.bln_simpleSearch){
              //this.fn_resetSearch();
            }
            

            //if(!this.fn_getSettingGroup()){//if not part of the settings ui                                
              this.fn_countMenu();              
            //}              
          }     

          fn_resetSearch(){
            if(this.obj_console_search){
              this.obj_console_search.fn_resetReportInterface();
            }
            this.obj_dataView.fn_setDataQuerySearch("", false);
          }

          fn_getContextColumnKey(){
            return this.obj_columnKey;
          }

          fn_configureDataViewQuery(){//overidden but called

            
            //----------------------------------------
            //SIGNPOST 7. obj_dataView fn_initializeRS (this ) (initialze dataview with menubutton obj_pararmRS etc)
            //----------------------------------------
            

            //Note Set QueryExpression , both occur here

            this.obj_dataView.fn_initializeRS(this);    
                                      
            
            
            //Meta Expr                                        
            this.obj_dataView.fn_setMetaViewId(this.fn_getMetaViewId());
            this.obj_dataView.fn_setMetaRowzId(this.fn_getMetaRowzId());              
            this.obj_dataView.fn_setMetaViewId(this.fn_getMetaViewId());                  
            //Meta Expr
                      
            //Key Expr                                
            let str_expr="";
            str_expr+=this.fn_getRunDataViewQueryExpression();                      
            this.obj_dataView.fn_setQueryExpression(str_expr);        
            
            if(obj_path.str_urlMetaRecordId){                                
              //this.obj_dataView.fn_setURLMetaRecordId(obj_path.str_urlMetaRecordId);
            }

            //*
            if(this.bln_debugRunDataView){              
              //this.fn_debugText("fn_getIsDynamicMenu: " + this.fn_getIsDynamicMenu());
              let str_queryList=this.fn_getQueryList();                                           
              let str_queryListParent=this.fn_getQueryListParent();                                             
              this.fn_debugText("fn_configureDataViewQuery str_queryList: " + str_queryList);              
              this.fn_debugText("fn_configureDataViewQuery str_queryListParent: " + str_queryListParent);
              
            }
            
            //*/

            //Search              
            this.obj_dataView.fn_setDataQueryList(this.fn_getQueryList());
            this.obj_dataView.fn_setDataQueryListDisabled(this.fn_getQueryListDisabled());
            this.obj_dataView.fn_setDataQueryListParent(this.fn_getQueryListParent());                                                  
            this.obj_dataView.fn_setDataQueryListParentDisabled(this.fn_getQueryListParentDisabled());                                                  
            
            //Search

            this.obj_dataView.obj_holder.bln_debugServer=this.obj_holder.bln_debugServer;                                

          }
          
          fn_getConstraintValue(){
            return this.str_constraintParentValue;
          }
          
          
        
        
          //----------------------------------------
          //SIGNPOST 5. menu fn_formViewRecord
          //----------------------------------------
          fn_formViewRecord(){//overidden but called by menuform  //called by crud menu operation data end child menu and search                            
        
            //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
            //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
            //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
            //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"                  
            
            this.fn_setModeViewRecord();                
            this.fn_runDataView();

          }
        
          fn_setModeViewRecord(){ 
        
            
            this.fn_setButtonViewRecord();                          
            if(this.obj_dataView){
              this.obj_dataView.fn_setModeExecuteView(); //update mode value    
            }
            
          }
          fn_setButtonViewRecord(){                          
            
            if(this.bln_topLevelMenu){                
              //let str_name=this.fn_getName();                
            }

            let obj_button, obj_container;
            
            ////ContainerGeneral
            obj_container=this.obj_consoleContainerGeneral;
            if(this.bln_hasOfficeButton){              
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_office");                                          
              obj_container.fn_showItem(obj_button);
              
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_lobby");                                        
              obj_container.fn_showItem(obj_button);
            }
            if(this.bln_hasExitButton){
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_desktop");
              obj_container.fn_showItem(obj_button);                                          
            }                        
            //if(this.bln_hasSettingButton && obj_userHome.Admin){                                                          
            if(this.bln_hasSettingButton){                                                          
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_settings");                                   
              obj_container.fn_showItem(obj_button);   
            }
            if(this.bln_hasNewRowButton){                
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_newrow");              
              obj_container.fn_showItem(obj_button);                                
            }   
            if(this.bln_hasNewColumnButton){                              
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_newcolumn");                          
              obj_container.fn_showItem(obj_button);                                
            }                                       
            ////ContainerGeneral

            ////ContainerLeft            
            obj_container=this.obj_consoleContainerGeneralLeft;
            if(this.bln_hasLoginButton){
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_login");
              obj_container.fn_showItem(obj_button);
            }              
            ////ContainerLeft

            ////ContainerSearch
            obj_container=this.obj_consoleContainerSearch;
            if(this.bln_hasSearchButton){
              obj_button=this.obj_console_search;
              obj_container.fn_showItem(this.obj_console_search);
            }                          
            
          }

          fn_formHome(){                       
          
            let obj_ini=new Object;            
            obj_ini.int_actionCode=200;            
            obj_ini.str_action="formHome";
            obj_ini.str_nameFolderServer="xapp_dataform_system";            
            this.fn_runServerAction(obj_ini);                                                                  
          }        
          formHome(){
            obj_path.fn_navigateSubdomain("office");
          }
        
          fn_classifyLevel(){
        
            this.bln_isParentMenu=false;
            this.bln_isChildMenu=false;
            
        
            if(this.bln_dynamicMenu){
              this.bln_isChildMenu=true;
              if(this.obj_parentMenu.obj_meta.bln_autoJoinPin){     
                this.bln_isJoinedChildMenu=true;                                  
              }
            }
            else{            
              
              /*
              if(this.fn_getIsMenuWithView()){        
                this.bln_isParentMenuWithView=true;                
              }
              //*/
            }

            //*
            //alternativeyl allow dynamic menu to have this toggle, for use with Add Record command
            //in general dynamic menus will have onl a data set attached so irrelevant
            //there may be circ when a dynamic menu also contains multiple records,  e.g in a  group by having set of menus, in which case the code can be developed to allow additional records to be added.
            if(this.fn_getIsMenuWithView()){
              this.bln_isParentMenuWithView=true;                
            }
            //*/
            
            
            if(this.obj_meta.bln_displayData){
              this.bln_hasChildForm=true;
              
              if(!this.bln_isChildMenu){
                this.bln_multiRecordDisplay=true;                  
              }
            }              
            
          } 
          fn_setLimitEndMenuChain(bln_value){
            this.obj_meta.bln_limitEndMenuChain=bln_value;    
          }
          fn_getLimitEndMenuChain(){                  
            return this.obj_meta.bln_limitEndMenuChain;    
          }
          fn_formNavigateDesktop(){              
            obj_path.fn_navigateSubdomain("desk");                                                  
          }           
          fn_formNavigateMall(){              
            obj_path.fn_navigateSubdomain("mall");                                                  
          }           
          fn_formNavigateOffice(){              
            obj_path.fn_navigateSubdomain("office");                                                  
          }           

          fn_setMarkedParentSchemaName(){
            this.obj_holder.str_markedParentSchemaName=this.obj_parentMenu.fn_getMetaSchemaName();
          }             
          fn_getMarkedParentSchemaName(){
            if(this.obj_holder.str_markedParentSchemaName){
              return this.obj_holder.str_markedParentSchemaName;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentSchemaName();
            }
            return "";
          }
          
          fn_setMarkedParentTableName(){
            this.obj_holder.str_markedParentTableName=this.obj_parentMenu.fn_getMetaTableName();
          }             
          fn_getMarkedParentTableName(){
            if(this.obj_holder.str_markedParentTableName){
              return this.obj_holder.str_markedParentTableName;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentTableName();
            }
            return "";
          }
          fn_setMarkedParentRowzId(){
            this.obj_holder.str_markedParentRowzId=this.obj_parentMenu.fn_getMetaRowzId();
          } 
          fn_getMarkedParentRowzId(){
            if(this.obj_holder.str_markedParentRowzId){
              return this.obj_holder.str_markedParentRowzId;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentRowzId();
            }
            return 0;
          }          
          fn_setMarkedParentViewId(){
            this.obj_holder.str_markedParentViewId=this.obj_parentMenu.fn_getMetaViewId();
          } 
          fn_getMarkedParentViewId(){
            if(this.obj_holder.str_markedParentViewId){
              return this.obj_holder.str_markedParentViewId;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentViewId();
            }
            return 0;
          }
          fn_formNavigateSettings(){                                                        
            let obj_item=this.fn_getSettingMenu(); 
            //console.log("obj_item: " + obj_item);           
            if(obj_item){
              obj_item.fn_setSettingOperationPinDisplay();                             
            }            
          }                        

          fn_loadformChangeDashboard(){                                                                                              
          
            this.obj_menuPanel=this.fn_getParentComponent();                  
            this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);            
            this.obj_button_form_movedown=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_movedown");                            
            this.obj_button_form_moveup=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_moveup");                            
            this.obj_button_form_gap=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_gap");                            
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_gap);
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_moveup);
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_movedown);
          }                 
          
          fn_formAddGap(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_add_group";
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_add_group(){
            obj_path.fn_navigateSubdomain("app", true);        
          }

          fn_formGap(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_gap";
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_gap(){
            obj_path.fn_navigateSubdomain("app", true);        
          }
          
          fn_formMoveUp(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_moveup";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                               
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_moveup(){            
            //this.obj_parentMenu.obj_parentMenu.fn_refreshMenu();
          }
  
          fn_getMetaFormId(){          
            let obj_menuButton=this;          
            let obj_recordset=obj_menuButton.obj_dataView;
            //obj_recordset.fn_describeMetaColumns();
            let obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("`meta_column`.`meta_column`.`MetaColumnId`");          
            return obj_metaColumn.str_value;
          }

          fn_formMoveDown(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_movedown";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                     
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_movedown(){
            //this.obj_parentMenu.obj_parentMenu.fn_refreshMenu();
          }
          
          
          fn_formNavigateNewColumn(){                              
            
            let obj_settingmenu=this.obj_parentMenu;            
            obj_settingmenu.fn_setSettingOperationPinDisplay();                             
            let obj_standardMenu=obj_settingmenu.obj_parentMenu;

            let obj_ini=new Object;            
            obj_ini.str_action="addNewColumn";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                                     
            obj_ini.int_idMetaRow=obj_standardMenu.fn_getMetaRowzId();
            obj_ini.int_idMetaView=obj_standardMenu.fn_getMetaViewId();
            if(obj_ini.int_idMetaView){            
              this.fn_runServerAction(obj_ini);                                                                  
            }          
          }
          addNewColumn(){            
            obj_path.fn_navigateSubdomain("app", true);        
          }
     
          fn_formNavigateNewRow(){                              
            
            let obj_settingmenu=this.obj_parentMenu;            
            obj_settingmenu.fn_setSettingOperationPinDisplay();                             
            let obj_standardMenu=obj_settingmenu.obj_parentMenu;

            let obj_ini=new Object;            
            obj_ini.str_action="addNewRowz";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                         
            obj_ini.int_idMetaRowz=obj_standardMenu.fn_getMetaRowzId();
            if(obj_ini.int_idMetaRowz){            
              this.fn_runServerAction(obj_ini);                                                                  
            }          
          }
          addNewRowz(){
            //console.log("addNewRowz return");
            obj_path.fn_navigateSubdomain("app", true);        
          }

          ////////////////
          //SHOW HIDE ARCHIVE
          fn_formShowArchive(){                                          
            this.fn_formDisplayArchive(true);
          }
          showArchive(){
            this.fn_navigateApp(true);            
          }
          fn_formDisplayArchive(bln_value){                                          

            let obj_ini=new Object;            
            obj_ini.str_action="hideArchive";                                     
            if(bln_value){
              obj_ini.str_action="showArchive";                                     
            }            
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                       
            this.fn_formRunRowAction(obj_ini);            
          }          
          fn_formHideArchive(){                                          
            this.fn_formDisplayArchive(false);
          }
          hideArchive(){
            this.fn_navigateApp(true);            
          }
          //SHOW HIDE ARCHIVE
          ////////////////

          ////////////////
          //SHOW HIDE ROWZ
          fn_formShowRowz(){                                          
            this.fn_formDisplayRowz(true);
          }
          showRowz(){
            this.fn_navigateApp(true);            
          }
          fn_formDisplayRowz(bln_value){                                          

            let obj_ini=new Object;            
            obj_ini.str_action="hideRowz";                                     
            if(bln_value){
              obj_ini.str_action="showRowz";                                     
            }            
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                       
            this.fn_formRunRowAction(obj_ini);            
          }          
          fn_formHideRowz(){                                          
            this.fn_formDisplayRowz(false);
          }          
          hideRowz(){
            this.fn_navigateApp(true);            
          }
          //SHOW HIDE ROWZ
          ////////////////

          fn_navigateApp(bln_value){                               
            if(bln_value){
              obj_shared.fn_messageAlert("The application will now reload.");
            }            
            obj_path.fn_navigateSubdomain("app");                                                
          }

          fn_formRunRowAction(obj_ini){                                          

            let obj_menuButton=this.fn_getMenuButton();                              
            obj_ini.int_idMetaRowz=obj_menuButton.fn_getMenuRecordId();
            if(obj_ini.int_idMetaRowz){            
              this.fn_runServerAction(obj_ini);                                                                  
            }          
          }          
          
          fn_setSettingOperationPinDisplay(){
            
            this.fn_setMarkedParentSchemaName();
            this.fn_setMarkedParentTableName();
            this.fn_setMarkedParentRowzId();                                          
            this.fn_setMarkedParentViewId();
            
            let bln_menuView=this.obj_parentMenu.fn_getIsMenuWithView();            
            let bln_childrenOpen=this.obj_parentMenu.bln_childrenOpen;
            this.fn_toggle();             
            if(this.fn_getIsOpen()){
              if(bln_menuView){
                this.obj_parentMenu.fn_displayAccordionChildMenu(true);             
                this.obj_parentMenu.fn_displayAccordionView(false);
              }                            
              
              this.fn_setHiddenPin(false);                              
              //this.fn_setDisplay(true);                              
            }
            else{
              if(bln_menuView){
                this.obj_parentMenu.fn_displayAccordionChildMenu(false);
                this.obj_parentMenu.fn_displayAccordionView(true);                              
              }              
              this.fn_setHiddenPin(true);                            
              //this.fn_setDisplay(false);                              
            }                          
            this.obj_parentMenu.bln_childrenOpen=bln_childrenOpen;
          }          
          fn_setRowzOrder(int_value){
            this.obj_holder.int_rowzOrder=int_value;
          }    
          fn_getRowzOrder(){
            return this.obj_holder.int_rowzOrder;
          }
          fn_setSettingOperationPin(bln_value){                          
            if(bln_value){              
              if(this.obj_parentMenu){
                this.obj_parentMenu.fn_setSettingMenu(this);            
              }
            }
            
            this.obj_holder.bln_settingOperationPin=bln_value;
          }                         
          fn_getSettingOperationPin(){
            return this.obj_holder.bln_settingOperationPin;
          }    
          fn_getSettingPin(){
            return this.obj_holder.bln_settingPin;
          }
          fn_setSettingPin(bln_value){
            this.obj_holder.bln_settingPin=bln_value;
          }
          fn_setSettingMenu(obj_menu){                     
            this.obj_holder.obj_menuSetting=obj_menu;            
          }               
          fn_getSettingMenu(){
            return this.obj_holder.obj_menuSetting;            
          }    

          
          
          fn_resetMenu(){
            
            this.bln_flagRunOnce=false;    
            //this.fn_setQueryList("");  
            //this.obj_columnKey=false;            
          }  
        
          fn_resetContent(){        
        
            let obj_container;    
        
            obj_container=this.fn_getDataView();        
            if(obj_container){
              obj_container.fn_removeChildren();      
            }      
        
            obj_container=this.fn_getWidgetView();    
            if(obj_container){
              obj_container.fn_removeChildren();      
            }    
            
            obj_container=this.fn_getAccordionView();        
            if(obj_container){
              obj_container.fn_removeChildren();      
            }
          }              

          fn_onDataStart(obj_post){//overidden but called              
            this.obj_post=obj_post;
                             
            this.obj_meta.str_metaConstraintName=obj_post.MetaConstraintName;                                        
            
            //this.fn_debugText("this.bln_runSearch: " + this.bln_runSearch);
            if(this.bln_runSearch){
              this.fn_loadReportInterface();
            }
            this.bln_runSearch=false;             
            
          }
          fn_onDataEnd(obj_post){                          
            //console.log("xapp_menu fn_onDataEnd");
            

            let obj_container, obj_button, obj_button_hide;
            obj_container=this.obj_consoleContainerGeneral;

            let obj_metaColumn, bln_value;

            if(this.obj_meta.bln_displayDashboard){
              this.fn_refreshDashboards();    
            }      

            if(this.bln_hasShowRowButton){          
              if(this.obj_dataView){
                let obj_metaColumnParentRowzId=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ParentRowzId`");
                let int_value=obj_shared.fn_parseInt(obj_metaColumnParentRowzId.str_value);
                if(int_value===0){return};
              
                obj_metaColumn=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`HiddenPin`");                              
                bln_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_row_show");                                      
                obj_button_hide=obj_container.fn_getConsoleComponent("xapp_button_general_row_hide");                                          
                this.obj_consoleContainerGeneral.fn_displayTogglePair(obj_button, obj_button_hide, bln_value);
              }
            }  
            if(this.bln_hasShowArchiveButton){          
              if(this.obj_dataView){
                let obj_metaColumnParentRowzId=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ParentRowzId`");
                let int_value=obj_shared.fn_parseInt(obj_metaColumnParentRowzId.str_value);
                if(int_value===0){return};
              
                obj_metaColumn=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ArchivePin`");                              
                bln_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);
                bln_value=obj_shared.fn_toggleBool(bln_value);
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_archive_show");                                      
                obj_button_hide=obj_container.fn_getConsoleComponent("xapp_button_general_archive_hide");                                          
                this.obj_consoleContainerGeneral.fn_displayTogglePair(obj_button, obj_button_hide, bln_value);
              }
            }  
            if(this.bln_hasUseDateTimeButton){          
              if(this.obj_dataView){

                let obj_metaColumnParentRowzId=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ParentRowzId`");
                let int_value=obj_shared.fn_parseInt(obj_metaColumnParentRowzId.str_value);
                if(int_value===0){return};
              
                obj_metaColumn=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`DateTimePin`");                              
                bln_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);
                
                

                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_use_task_date");                                          
                obj_button_hide=obj_container.fn_getConsoleComponent("xapp_button_general_use_task_datetime");                                          
                this.obj_consoleContainerGeneral.fn_displayTogglePair(obj_button, obj_button_hide, bln_value);                                
              }
            }  
            
            if(this.bln_hasShowFormUpButton){          
              if(this.obj_dataView){
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_form_up");                                                      
                obj_container.fn_showItem(obj_button);
              }
            }  
            if(this.bln_hasShowFormDownButton){          
              if(this.obj_dataView){
                
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_form_down");                                                      
                obj_container.fn_showItem(obj_button);
              }
            }  
            
          }   
          fn_receiveColumn(obj_data, obj_column, obj_post){

            if(this.bln_dynamicMenu){//menuButton is generated from dataset
              if(obj_post.ReloadSection){
                this.fn_formCompleteRecord(true);
              }
              if(obj_column.obj_metaColumn.MenuPin){                
                this.fn_updateButtonText(obj_data);                               
              }
            }     
          }          

          fn_notifyChildControl(str_nameFunction, obj_arg){                                                                         
                
            this.fn_notifyDashboard(str_nameFunction, obj_arg);
            this.fn_notifyWidget(str_nameFunction, obj_arg);
            this.fn_notifyMenu(str_nameFunction, obj_arg);
          }
          
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
          //SET OBJECT REFERENCE
          //--------------------
          //SIGNPOST 2. menu fn_referenceObject
          //--------------------
          fn_referenceObject(){
        
            if(this.obj_holder.bln_referencedObject){
              //console.log("fn_referenceObject this.obj_holder.bln_referencedObject is true, return");
              //console.log("this.obj_menuPanel: " + this.obj_menuPanel);
              return;
            }    
            super.fn_referenceObject();             
            
            this.fn_setConsole();                    

            this.fn_setDashboardView();                        
            this.fn_setWidgetView();                        
            this.fn_setDataChildMenu();
            this.fn_setDataView();      
            
            this.fn_setAccordionChildMenu();                                   
            this.fn_setAccordionView();      

            this.fn_displayObject(false);
            
          }  
          fn_getMenuPanel(){   
            //console.log("xapp menu fn_getMenuPanel return this.obj_menuPanel"); 
            return this.obj_menuPanel;    
          }
          fn_createForm(){ 
            this.obj_form=this.fn_addContextItem("form_form");
            this.obj_form.fn_setDisplayFlex(true);
            this.obj_form.fn_setFlexDirection("column");    
          }
          fn_registerColumn(obj_column){
        
            this.obj_columnCurrent=obj_column;
          }                        
          fn_onChildSubmit(){                     
            
            //console.log("xapp_menu fn_onChildSubmit: " + obj_project.obj_itemEvent);              
        
                              
            this.fn_unsetEvent();                               

            
            //alert("xapp_menu fn_onChildSubmit");              
            
            this.fn_formViewRecord();//required to be on xapp_menu
          }
          
          
          fn_setMenuPanel(){     
            if(this.obj_menuPanel){
              return;
            }                
              
            this.fn_createForm();              
            this.obj_menuPanel=this.obj_form.fn_addContextItem("xapp_menu_panel");                      
            
            this.obj_menuPanel.obj_parentMenu=this; 
            
            ////ContainerSearch
            this.obj_consoleContainerSearch=this.obj_menuPanel.fn_addConsoleContainer("xapp_form_container_search", false);                                        
            this.obj_console_search=this.obj_consoleContainerSearch.fn_getConsoleComponent("xapp_console_search");
            //obj_console_search
            ////ContainerSearch
            
            
            
            ////ContainerGeneral
            this.obj_consoleContainerGeneral=this.obj_menuPanel.fn_addConsoleContainer("xapp_console_container_general", true);            
            //obj_button_navigate_desktop
            //obj_button_setting
            //obj_button_newrow
            //obj_button_newcolumn            
            //obj_button_row_hide            
            //obj_button_row_show            
            //obj_button_archive_hide            
            //obj_button_archive_show                        
            //obj_button_navigate_office
            //obj_button_navigate_lobby            
            ////ContainerGeneral

            ////ContainerLeft
            this.obj_consoleContainerGeneralLeft=this.obj_menuPanel.fn_addConsoleContainer("xapp_console_container_general", false);
            //obj_button_navigate_login            
            ////ContainerLeft
          }
          //CRUD CONSOLE
          fn_setConsole(){    
            if(this.obj_console){return;}    
            this.obj_console=this.obj_menuPanel.fn_getComponent("xapp_console");                             
            //this.obj_console.fn_setBorder("10px solid pink");
          }                                  
          //CRUD CONSOLE
          
          //CRUD VIEW REFERENCE
          //VIEW DASHBOARD
          fn_setDashboardView(){    
            if(this.arr_dashboardView){return;}    
            let obj_container=this.obj_menuPanel;    
            if(!obj_container){return;}   
            
            if(!this.obj_meta.bln_displayDashboard){return;}            
        
            //obj_container=this.obj_menuPanelDashboard;
            obj_container=this.obj_menuPanel;              
            if(!obj_container){return;}   
            let str_metaType="xapp_dashboard";
            if(this.obj_meta.str_metaTypeDashboard){
              str_metaType=this.obj_meta.str_metaTypeDashboard;
            }
            this.arr_dashboardView=[];
            let arr_type=str_metaType.split(";");
            for(let i=0;i<arr_type.length;i++){
              let str_type=arr_type[i].trim();            
              str_type=str_type.replace(/\s/g, '');
              if(!str_type){continue;}                      
              let bln_debug=false;                                
              //if(str_type==="upgrade_dashboard"){bln_debug=true;}                                
              let obj_dashboard=obj_container.fn_addContextItem(str_type);                         
              //*
              if(this.fn_getDebugPin()){
                //console.log("str_type: " + str_type);
                //console.log("obj_dashboard: " + obj_dashboard);
              } 
              //*/                                      
              if(obj_dashboard){
                obj_dashboard.obj_holder.bln_debugServer=this.obj_holder.bln_debugServer;
                this.arr_dashboardView.push(obj_dashboard);
                obj_dashboard.obj_holder.obj_parentMenu=this;                  
                //Dashboard is displayed in fn_displayDashboard
              }              
              else{
                //console.log("Error Loading Dashboard: Check for Typos and Context Holders are in place");
              }
            }
            
            
          } 
          fn_getDashboardView(){
            return this.arr_dashboardView;
          } 
          //VIEW DASHBOARD  
          //VIEW DATA
          fn_setDataViewCount(){
            if(!this.obj_meta.bln_runDataView){return;}                
            //if(this.obj_dataView){return;}    
            this.obj_dataView=this.fn_addContextItem(this.obj_meta.str_metaTypeData);            
            this.obj_dataView.fn_setDisplay(false);
          }
          fn_setDataView(){    
            //if(this.obj_dataView){return;}    
            let obj_container=this.obj_menuPanel;
            if(!obj_container){return;}            
            if(!this.obj_meta.bln_runDataView){return;}                
            this.obj_dataView=obj_container.fn_addContextItem(this.obj_meta.str_metaTypeData);            
          }
          fn_getDataView(){
            return this.obj_dataView;
          } 
          //VIEW DATA
          //VIEW WIDGET
          fn_setWidgetView(){    
            if(this.obj_containerWidgetView){return;}    
            let obj_container=this.obj_menuPanel;
            if(!obj_container){return;}             
            if(!this.obj_meta.bln_displayWidget){return;}            
        
            //obj_container=this.obj_menuPanelDashboard;
            obj_container=this.obj_menuPanel;
            if(!obj_container){return;}   
        
            let str_metaType="xapp_widgetboard";
            if(this.obj_meta.str_metaTypeWidget){
              str_metaType=this.obj_meta.str_metaTypeWidget;
            }              
            this.obj_containerWidgetView=obj_container.fn_addContextItem(str_metaType);                          
          } 
          fn_getWidgetView(){
            return this.obj_containerWidgetView;
          } 
          fn_notifyWidget(str_nameFunction, obj_arg){
            this.fn_notify(this.obj_containerWidgetView, str_nameFunction, obj_arg);
          }
          //VIEW WIDGET
          //VIEW ACCORDION
          fn_setAccordionView(){
            if(this.obj_accordionView){return;}        
            let str_metaType="xapp_accordion";
            this.obj_accordionView=this.fn_addContextItem(str_metaType);                          
          }     
          fn_getAccordionView(){    
            return this.obj_accordionView;
          }
          //VIEW ACCORDION
          //CRUD VIEW REFERENCE  
          //CRUD CHILDMENU REFERENCE
          //CHILDMENU DATA
          fn_setDataChildMenu(){
            //Standard Menu System - not dynamic
            if(this.obj_dataChildMenu){return;}    
            let obj_container=this.obj_menuPanel;    
            if(!obj_container){
              //console.log("fn_setDataChildMenu this.obj_menuPanel is false, return");
              return;
            }                   
            
            this.obj_dataChildMenu=obj_container.fn_addContextItemOnce(this.str_defaultTypeDataChildMenu);
            if(!this.obj_dataChildMenu){
              //console.log("this.obj_dataChildMenu: " + this.obj_dataChildMenu);
              //console.log("this.str_defaultTypeDataChildMenu: " + this.str_defaultTypeDataChildMenu);
            }
            
          }
          fn_getDataMenu(){
            return this.obj_dataChildMenu;
          } 
          //CHILDMENU DATA  
          //CHILDMENU ACCORDION
          fn_setAccordionChildMenu(){
            super.fn_setAccordionChildMenu();
          }     
          fn_getAccordionChildMenu(){    
            return super.fn_getAccordionChildMenu();
          }
          //CHILDMENU ACCORDION
          //CRUD CHILDMENU REFERENCE
          //SET OBJECT REFERENCE 
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //CONFIGURE OBJECT
        fn_configureObject(bln_value){        
        
          //CRUD VIEW
          this.obj_meta.bln_runDataView=bln_value;    
          this.obj_meta.bln_displayDashboard=bln_value;    
          this.obj_meta.bln_displayData=bln_value;
          this.obj_meta.bln_displayWidget=bln_value;        
          this.obj_meta.bln_displayAccordionView=bln_value;                                
          //CRUD VIEW
        
          //CRUD CHILDMENU
          this.obj_meta.bln_runDataChildMenu=bln_value;      
          this.obj_meta.bln_displayDataChildMenu=bln_value;  
          this.obj_meta.bln_displayAccordionChildMenu=bln_value;   
          //CRUD CHILDMENU
          
          this.fn_configureMenuPanel();           
        }  
        //MENU PANEL
        fn_configureMenuPanel(){ 
          let bln_value=false;
          this.obj_meta.bln_displayMenuPanel=false;      
          if(this.obj_meta.bln_displayDashboard){bln_value=true;}      
          if(this.obj_meta.bln_displayData){bln_value=true;}
          if(this.obj_meta.bln_displayWidget){bln_value=true;}      
          if(this.obj_meta.bln_displayDataChildMenu){bln_value=true;}    
          if(this.obj_meta.bln_displayAccordionView){bln_value=true;}      
          if(this.obj_meta.bln_displayConsole){bln_value=true;}                 
          this.obj_meta.bln_displayMenuPanel=bln_value;      
        }
        //MENU PANEL
        //CONFIGURE OBJECT
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //CONFIGURE OPTION  
          //CRUD VIEW    
          //CRUD VIEW      
          //CRUD CHILDMENU
          fn_configureOptionChildMenu(){
        
            
            this.obj_meta.bln_runDataChildMenu=true;            
            this.obj_meta.bln_displayDataChildMenu=false;
            this.obj_meta.bln_displayAccordionChildMenu=true;
            
          }      
          
          //CRUD CHILDMENU   
          fn_configureMetaFromRow(obj_row){               
            if(!obj_row){return;}//can be false at top level   
            
            //when making changes here, consider that the  dynamic menu may need to have similar function applied
            //in crud menu operation fn_configureDynamicMenuFromRow
            this.obj_meta.bln_runDataView=true;       
            this.fn_configureOptionChildMenu();     
                          
            let obj_metaColumn, foo_value, str_metaType;           
            let obj_recordset=obj_row.obj_paramRS.obj_recordset;                

            
            
            //START VIEW               
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzUserId");
            if(obj_metaColumn){                                      
              this.obj_meta.int_MetaRowzUserId=obj_shared.fn_parseInt(obj_metaColumn.str_value);                
            }                      
  
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaSchemaName");
            if(obj_metaColumn){                                    
              this.fn_setMetaSchemaName(obj_metaColumn.str_value);
            }                      
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTableName");
            if(obj_metaColumn){                                      
              this.fn_setMetaTableName(obj_metaColumn.str_value);
            }                      
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTableKeyField");              
            if(obj_metaColumn){                      
              this.obj_meta.str_MetaTableKeyField=obj_metaColumn.str_value;      
            }                      
            else{
              alert("wont see");
            }              
            //END VIEW 

            //START MENU
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzGroup");
            if(obj_metaColumn){                                    
              this.fn_setMetaRowzGroup(obj_metaColumn.str_value);                
            }        

            //START MENU
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("DebugPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              if(this.fn_getDebugPin()){
                foo_value=true;
              }
              this.fn_setDebugPin(foo_value);                                

            }    


            //START MENU
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("PublishPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setPublishPin(foo_value);
            }    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("RowzOrder");//ahead of setting
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseInt(obj_metaColumn.str_value);                                  
              this.fn_setRowzOrder(foo_value);              
            }    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("RowzIcon");
            //console.log("obj_metaColumn: " + obj_metaColumn);
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){                                        
                  this.fn_showIcon(foo_value);          
                }     
            }

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("SettingOperationPin");
            
            if(obj_metaColumn){                  
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              //this.fn_debugText(obj_metaColumn.str_value + ": " + foo_value);
              this.fn_setSettingOperationPin(foo_value);
              if(this.fn_getSettingOperationPin()){
                let int_rowzOrder=this.fn_getRowzOrder();                
                if(int_rowzOrder===0){
                  this.fn_displayOn=new Function;
                  this.fn_displayOff=new Function;
                  this.fn_onClick=new Function;
                }
                //this.fn_displayOn=false; 
                //this.fn_displayOff=false; 
                //this.fn_methodPeers=new Function();        
                //this.fn_methodPeersVertical=new Function();        
              }
            }

            
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("DynamicMenuPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setDynamicMenuPin(foo_value);              
            }    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("TemporaryRowzPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setTemporaryRowzPin(foo_value);

            }    
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaViewName");    
            if(obj_metaColumn){                              
              foo_value=obj_metaColumn.str_value;      
              this.obj_meta.str_metaViewName=foo_value;                

              /*
              this.obj_meta.str_text=foo_value;              
              this.bln_applyAnchor=true;  
              this.fn_setName(foo_value);      
              this.fn_setText(foo_value);      
              //*/                        
            }              

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzName");    
            if(obj_metaColumn){                              
              foo_value=obj_metaColumn.str_value;                                      
              this.fn_setMetaRowzName(foo_value);                          
              this.bln_applyAnchor=true;      
              this.obj_meta.str_text=foo_value;                                          
              this.fn_setText(foo_value);                    
              this.fn_setName(foo_value);                
            }              
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzTitle");    
            if(obj_metaColumn){                              
              foo_value=obj_metaColumn.str_value;                    
              this.obj_meta.str_text=foo_value;              
              this.fn_setText(foo_value);       
              this.fn_setMetaRowzTitle(foo_value);                
            }              

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzId");
            if(obj_metaColumn){            
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);                
              this.fn_setMetaRowzId(foo_value);                
            }                    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaViewId");
            if(obj_metaColumn){            
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);                
              this.fn_setMetaViewId(foo_value);                
            }                 

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ParentRowzId");
            if(obj_metaColumn){                      
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);
              this.fn_setParentRowzId(foo_value);
            }        
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaViewId");                            
            if(obj_metaColumn){      
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);
              this.fn_setMetaViewId(foo_value);                
            }                
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ViewPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setViewPin(foo_value);
            }  
              
            
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("JoinType");
            if(obj_metaColumn){            
              foo_value=obj_shared.fn_parseInt(obj_metaColumn.str_value);               
              this.obj_meta.int_joinType=foo_value;                  
            }                               
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewMenu");                  
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                //if there is any entry in view, then we are going get rs described in menu
                if(foo_value && foo_value===this.str_optionMenu){                                      
                  this.obj_meta.bln_displayAccordionView=true;
                } 
            }   
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeMenu");    
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){                                                  
                  this.obj_meta.str_metaTypeMenu=foo_value;//allow overide default type MenuForm)
                }
            }                
            
            //reportview
            this.obj_meta.str_metaTypeData=this.str_defaultTypeData;                                
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewReport");    
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){          
                  if(foo_value===this.str_optionReport){foo_value="xapp_report_view";}                    
                  this.obj_meta.str_metaTypeData=foo_value;     
                  this.obj_meta.bln_displayData=true;//why is this true
                  this.obj_meta.bln_displayReport=true;        
                } 
            }    
            
            //dataview              
            this.obj_meta.str_metaTypeData=this.str_defaultTypeData;                                              
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewData");    
            if(obj_metaColumn){
                foo_value=obj_metaColumn.str_value;
                if(foo_value){
                  if(foo_value===this.str_optionData){foo_value=this.str_defaultTypeData;}                    
                  this.obj_meta.str_metaTypeData=foo_value;                   
                  this.obj_meta.bln_displayData=true;
                  this.obj_meta.bln_displayReport=false;                                                       
                }        
            }            
            
            this.obj_meta.str_metaTypeWidget="xapp_widgetboard";                                
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewWidget");//set to view widget
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){
                  if(foo_value===this.str_optionWidget){foo_value="xapp_widgetboard";}                    
                  this.obj_meta.str_metaTypeWidget=foo_value;     
                  this.obj_meta.bln_displayWidget=true;                            
                } 
            }     
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeRowzWidget");//overide view widget with rowz
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){
                  if(foo_value===this.str_optionWidget){foo_value="xapp_widgetboard";}                    
                  this.obj_meta.str_metaTypeWidget=foo_value;     
                  this.obj_meta.bln_displayWidget=true;                            
                } 
            }     

            this.obj_meta.str_metaTypeDashboard="xapp_dashboard";                                
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewDashboard");//set to view dashboard
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){          
                  if(foo_value===this.str_optionDashboard){foo_value="xapp_dashboard";}                    
                  this.obj_meta.str_metaTypeDashboard=foo_value;                                          
                  this.obj_meta.bln_displayDashboard=true;
                }     
            }
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeRowzDashboard");//overide view dashboard with rowz
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){          
                  if(foo_value===this.str_optionDashboard){foo_value="xapp_dashboard";}                    
                  this.obj_meta.str_metaTypeDashboard=foo_value;                                          
                  this.obj_meta.bln_displayDashboard=true;
                }     
            }
            

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaPermissionTag");
            if(obj_metaColumn){                                    
              this.obj_meta.MetaPermissionTag=obj_metaColumn.str_value;      
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("LivePin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                                
              this.fn_setLivePin(foo_value);                                
            }    
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("HiddenPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              this.fn_setHiddenPin(foo_value);                
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ArchivePin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                               
              this.fn_setArchivePin(foo_value);
            }        

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("AdminPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                               
              this.fn_setAdminPin(foo_value);
            }        

            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("LockOpenPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                               
              this.fn_setLockOpenPin(foo_value);
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("DisabledPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              this.fn_setDisabledPin(foo_value);
            }        
            
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("AutoOpenPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                             
              this.fn_setAutoOpenPin(foo_value);                
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("AutoFetchPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              if(obj_project.obj_design.bln_autoFetch)foo_value=true;
              this.fn_setAutoFetch(foo_value);
            }        
            //*
            if(this.fn_getDebugPin()){
              this.fn_setAutoFetch(true);
            }              
            
        
            /*
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("RolodexPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);               
              this.obj_meta.bln_rolodexPin=foo_value;      
            } 
            //*/

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("SettingPin");

            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              this.fn_setSettingPin(foo_value);
            }        
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ButtonConsole");
            if(obj_metaColumn){                          
              foo_value=obj_metaColumn.str_value;
              let str_buttonConsole="";                  
              if(foo_value){        
                str_buttonConsole=foo_value;                
              }       
              if(this.obj_meta.bln_displayAccordionView && foo_value.search("XSearch")===-1){        
                str_buttonConsole+=",";
                //str_buttonConsole+="Search, Record";        
              } 
        
              if(this.obj_meta.bln_displayData){        
                str_buttonConsole+=",";
                //str_buttonConsole+="Record";        
              }                  
              
              if(foo_value.search("XRecord")===-1){}
              else{        
                //str_buttonConsole=str_buttonConsole.replace('Record', '');
                //str_buttonConsole=str_buttonConsole.replace('Search', '');                
              } 
              this.obj_meta.str_buttonConsole=str_buttonConsole;                 
            }                     
          }     
          
          fn_setMetaSchemaName(str_value){
            this.obj_meta.str_metaSchemaName=str_value;      
          }                   
          fn_getMetaSchemaName(){            
            return this.obj_meta.str_metaSchemaName;
          }                                
          fn_setMetaTableName(str_value){
            this.obj_meta.str_metaTableName=str_value;      
          }                   
          fn_getMetaTableName(){            
            return this.obj_meta.str_metaTableName;
          }                                

          fn_setMetaViewId(int_value){           
            this.obj_meta.int_idMetaView=int_value;            
          }
          fn_getMetaViewId(){           
            return this.obj_meta.int_idMetaView;            
          }
          fn_setParentRowzId(int_value){            
            this.obj_meta.int_idParentMetaRowz=int_value;               
          }
          fn_getParentRowzId(){
            return this.obj_meta.int_idParentMetaRowz;            
          }
          fn_setMetaRowzId(int_value){           
            this.obj_meta.int_idMetaRowz=int_value;            
          }
          fn_getMetaRowzId(){           
            return this.obj_meta.int_idMetaRowz;            
          }          
          fn_setMetaRowzName(str_value){           
            this.obj_meta.str_metaRowzName=str_value;            
          }
          fn_getMetaRowzName(){           
            return this.obj_meta.str_metaRowzName;
          }
          fn_setMetaRowzTitle(str_value){           
            this.obj_meta.str_metaRowzTitle=str_value;            
          }
          fn_getMetaRowzTitle(){           
            return this.obj_meta.str_metaRowzTitle;
          }
          

          fn_getMenuButtonViaViewIdGoNorth(int_idMetaView){        
      
            let int_idMetaViewCurrent=this.fn_getMetaViewId(true);              
            if(String(int_idMetaView)===String(int_idMetaViewCurrent)){              
              return this;
            }              
            
            let obj_parent=this.fn_getMenuParent();              
            if(obj_parent){
                return obj_parent.fn_getMenuButtonViaViewIdGoNorth(int_idMetaView);
            }            
            return false;
        }
          
          
          //CONFIGURE OPTION
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //DISPLAY OBJECT  
        fn_displayObject(bln_value){                    

          //this.fn_debugText("fn_displayObject");            
          
          this.fn_displayView(bln_value);         
          this.fn_displayChildMenu(bln_value);      
          this.fn_displayMenuPanel(bln_value);           
        }  
        
        //CRUD VIEW        
        fn_displayView(bln_value){
          this.fn_displayDashboard(bln_value);  
          this.fn_displayData(bln_value);  
          this.fn_displayWidget(bln_value);  
          this.fn_displayAccordionView(bln_value);
        }
        fn_displayDashboard(bln_value=this.obj_meta.bln_displayDashboard){
          let arr_item=this.fn_getDashboardView();    
          if(!arr_item){return;}
          for(let i=0;i<arr_item.length;i++){
            let obj_dashboard=arr_item[i];
            if(obj_dashboard && obj_dashboard.obj_design.arr_item.length){                
              obj_dashboard.fn_setDisplayFlex(bln_value);              
            }  
          }
          
          
        }
        fn_displayData(bln_value=this.obj_meta.bln_displayData){        
          //console.log("this.obj_meta.bln_displayData: " + this.obj_meta.bln_displayData);
          //console.log("(this.obj_dataView: " + this.obj_dataView);            
          if(this.obj_dataView){      
            this.obj_dataView.fn_setDisplayFlex(bln_value);                                                        
          }
                         
        }
        fn_displayWidget(bln_value=this.obj_meta.bln_displayWidget){
          let obj_container=this.fn_getWidgetView();    
          if(obj_container){        
            obj_container.fn_setDisplayFlex(bln_value);                  
          }  
        }
        
        fn_displayAccordionView(bln_value=this.obj_meta.bln_displayAccordionView){    
          
          let obj_container=this.fn_getAccordionView();    
          if(obj_container){                            
            obj_container.fn_setDisplay(bln_value);              
          }  
        }   
        //CRUD VIEW
        
        //CRUD CHILDMENU        
        fn_displayChildMenu(bln_value){  
          this.fn_displayDataChildMenu(bln_value);  
          this.fn_displayAccordionChildMenu(bln_value);  
        }
        fn_displayDataChildMenu(bln_value=this.obj_meta.bln_displayDataChildMenu){          
          //bln_value=true;
          if(this.obj_dataChildMenu){      
            this.obj_dataChildMenu.fn_setDisplayFlex(bln_value);              
          }              
        }

        fn_displayAccordionChildMenu(bln_value=this.obj_meta.bln_displayAccordionChildMenu){    
          
          let obj_container=this.fn_getAccordionChildMenu();    
          if(obj_container){
            obj_container.fn_setDisplay(bln_value);                
          }              
        }   

        //CHILDMENU MENU
        //CRUD CONSOLE
        fn_displayConsole(){ 

          //this.fn_debugText("fn_displayConsole");

          
          this.obj_holder.obj_itemConsole=new Set(this.obj_meta.arr_buttonConsole);        
          
          this.fn_getConsoleValues();
          
          let bln_value=false;
          if(this.obj_holder.obj_itemConsole.size){
            bln_value=true;
          }    
          this.obj_meta.bln_displayConsole=bln_value;          

          if(this.obj_console){
            this.obj_console.fn_setDisplayFlex(bln_value);
          }
        }
        
        fn_getConsoleValues(){          

          if(this.obj_holder.bln_displayedConsole){return;}
          this.obj_holder.bln_displayedConsole=true;                    
          
          if(this.fn_getConsoleValue("Login")){this.bln_hasLoginButton=true;}                
          if(this.fn_getConsoleValue("Office")){this.bln_hasOfficeButton=true;}
          
          //this.fn_debugText(this.fn_getSettingPin());
          if(this.fn_getSettingPin()){
            this.bln_hasSettingButton=true;
          }
          //if(this.fn_getConsoleValue("Setting")){this.bln_hasSettingButton=true;}
          if(this.fn_getConsoleValue("NewRow")){this.bln_hasNewRowButton=true;}
          if(this.fn_getConsoleValue("NewColumn")){this.bln_hasNewColumnButton=true;}                    
          if(this.fn_getConsoleValue("UseDateTime")){this.bln_hasUseDateTimeButton=true;}                    

          if(this.fn_getConsoleValue("ShowArchive")){this.bln_hasShowArchiveButton=true;}
          if(this.fn_getConsoleValue("ShowRow")){this.bln_hasShowRowButton=true;}
          if(this.fn_getConsoleValue("Exit")){this.bln_hasExitButton=true;}  

          if(this.fn_getConsoleValue("FormUp")){this.bln_hasShowFormUpButton=true;}
          if(this.fn_getConsoleValue("FormDown")){this.bln_hasShowFormDownButton=true;}
          if(this.fn_getConsoleValue("FormGap")){this.bln_hasShowFormGapButton=true;}
          
          this.bln_simpleSearch=false;
          this.bln_advancedSearch=false;
          if(this.fn_getConsoleValue("Search")){this.bln_hasSearchButton=true;
            this.bln_advancedSearch=true;
          }  
          if(this.fn_getConsoleValue("SimpleSearch")){
            this.bln_hasSearchButton=true;
            this.bln_simpleSearch=true;
            this.bln_advancedSearch=false;
                        
          }  
          
          if(this.fn_getViewPin()){                        

            let bln_isAdmin=obj_permitManger.fn_isAdmin();              
            if(bln_isAdmin){
              
              
            }
            else{
              //this.fn_debugText("user is not admin");
            }
          }
          else{
            
            //this.bln_hasSettingButton=true;
            //this.bln_hasExitButton=true;
          }
        }
        
        fn_setDisplayConsoleItem(str_control, str_value){  
          let obj_control=this.obj_console.fn_getItemGoSouth(str_control);    
          
          let bln_value=this.fn_getConsoleValue(str_value);    
          if(obj_control){obj_control.fn_setDisplayFlex(bln_value);}
        }
        fn_getConsoleValue(str_value){
          return this.obj_holder.obj_itemConsole.has(str_value);
        }
        fn_getConsoleItem(str_value, str_control){
          if(this.fn_getConsoleValue(str_value)){
            let obj_control=this.obj_console.fn_getItemGoSouth(str_control);    
            return obj_control;          
          }
        }
        //CRUD CONSOLE  
        
        
        fn_displayMenuPanel(bln_value){            

          //this.fn_debugText("fn_displayMenuPanel");
          
          
          if(bln_value===undefined){
            bln_value=this.obj_meta.bln_displayMenuPanel;    
          }
          
          this.fn_displayConsole();    
        
          
        
          bln_value=false;

          
          if(this.obj_meta.bln_displayData){                
            bln_value=true;
          }          
          
          if(this.obj_meta.bln_displayDashboard){                
            bln_value=true;
          }
          if(this.obj_meta.bln_displayWidget){                
            bln_value=true;
          }
          if(this.obj_meta.bln_displayConsole){                    
            bln_value=true;
          }
          
          super.fn_displayMenuPanel(bln_value);   
          
          
        }
        
        
        //DISPLAY OBJECT    
        
        
        
        
            //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //OPERATION
        //CRUDMENUOPERATION
        //*
        fn_onDataStartChildMenu(){


        }
        fn_onDataEndChildMenu(obj_post){    
          //----------------------------------------  
          //SIGNPOST 4. When that data rs ends, run data View
          //----------------------------------------            

          //this.fn_debugText("fn_onDataEndChildMenu");

          //console.log("xxxx fn_onDataEndChildMenu");

          //this.fn_debugText("fn_onDataEndChildMenu");

          if(this.fn_getDebugPin()){
            //alert("123");
          }
          
          //this.fn_debugText("this.obj_meta.bln_runDataView: " + this.obj_meta.bln_runDataView);
          if(this.obj_meta.bln_runDataView){            
            this.fn_formViewRecord();            
            
            //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
            //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
            //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
            //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"            
          }                    
          else{
            //for example CRUD top level object            
            this.fn_runClient();
          }        
          //let obj_container=this.fn_getAccordionChildMenu();            
          //let obj_hardrule=obj_container  .fn_addContextItem("form_hardrule");                        
          
          if(this.bln_isAppRoot){
            let obj_item=this.fn_getOnlyStandardMenu();                            
            if(obj_item){              
                obj_item.fn_setLockOpenPin(true);
                obj_item.fn_open();              
            }            
          }

          //Loop thru Standard Menu to check if one of them should be opened
          //let obj_post=this.obj_dataChildMenu.obj_post;
          let str_URLNavigateMenu=obj_post.URLNavigateMenu;            
          if(str_URLNavigateMenu){                          
            let arr_item=this.fn_getArrayStandardMenu();                                                    
            for(let i=0;i<arr_item.length;i++){      
                let obj_item=arr_item[i];                                                  
                let obj_compare=obj_path.fn_compareURLNavigateMenuName(obj_item.obj_meta.str_metaRowzName, str_URLNavigateMenu);
                if(obj_compare.bln_applyURL){                  
                  obj_item.fn_open();
                  break;
                }                    
            }
          }
          
          
        }
          //RECORDSET LEVEL  
        //ROW LEVEL
        fn_onComputeRowChildMenu(obj_row){               
          
          
          if(this.obj_meta.bln_displayAccordionChildMenu){
            let obj_item=this.fn_addStandardMenuToAccordion(obj_row);
            if(obj_row.obj_paramRS.bln_lastRow){
              let obj_container=this.fn_getAccordionChildMenu();
              obj_container.fn_setStyleProperty("margin-bottom", "10px");
              
            }
          }        
        }      
        //ROW LEVEL
        //CHILDMENU
        
        //VIEW
        //RECORDSET LEVEL
        //----------------------------------------
        //SIGNPOST 9. obj_dataView fn_onDataStartView
        //----------------------------------------
        //if bln_displayAccordionView then bln_displayAccordionChildMenu = false
        //i.e. if we have a dynamci menu , then turn off standard Child Menu
        fn_onDataStartView(){    
          this.startTime=new Date();            
          
          //if dynamic menu is on , turn off standard menu display          
          if(this.obj_meta.bln_displayAccordionView){                  
            this.obj_meta.bln_displayAccordionChildMenu=false;
          }          
        }
        
        fn_onDataEndView(obj_post){                    

          //this.fn_debugText("START xapp_menu fn_onDataEndView: ");
        
          this.fn_runClient();
          if(!this.obj_dataView.obj_paramRS){
            return;
          }
          this.endTime=new Date();

          
          
          let str_milliseconds=obj_shared.fn_timeDifference(this.startTime, this.endTime); 
          let str_seconds=obj_shared.fn_millisecondsToSeconds(str_milliseconds) + " seconds";    
          
          let str_text=this.obj_dataView.obj_paramRS.int_totalRowReturned + " rows of data returned in " + str_seconds;            
          this.fn_debugText(str_text);

          
          
          
          this.fn_addDataSummary(); 
          
          //If the only dynamic menu then open
          if(this.obj_meta.bln_displayAccordionView){              
            let obj_item=this.fn_getOnlyDynamicMenu();
            
            if(obj_item){
              //this.fn_debugText("Only Dynamic Menu, Open");            
              obj_item.fn_open();
            } 
          }
          
          //If the only child menu then open
          if(this.obj_meta.bln_displayAccordionChildMenu){              
            let obj_item=this.fn_getOnlyStandardMenu();                            
            if(obj_item){
              //this.fn_debugText("Only Standard Menu, Open");                
              obj_item.fn_open();
            } 
          }   
          
          //let obj_hardrule=this.fn_addContextItem("form_hardrule");                              
        }

        
        fn_dataNavBack(){
          //console.log("fn_dataNavBack");
          this.bln_flagRunOnce=false;            
          //this.fn_debugText("int_numRowBack: " + this.int_numRowBack);
          this.obj_dataView.fn_setLimitRowStart(this.int_numRowBack);                         
          this.bln_dataNavToggle=true;
          
          this.fn_runMenu();         
        }
        fn_dataNavForward(){
          //console.log("fn_dataNavForward");
          this.bln_flagRunOnce=false;            
          this.bln_dataNavToggle=false;
          //this.fn_debugText("int_numRowForward: " + this.int_numRowForward);
          this.obj_dataView.fn_setLimitRowStart(this.int_numRowForward);                         
          
          this.fn_runMenu();         
        }
        fn_dataNavToggle(){
          //console.log("fn_dataNavToggle");
          this.bln_flagRunOnce=false;                        
          
          let int_currentRowStart;            
          if(this.bln_dataNavToggle){//true, go to start
            int_currentRowStart=0;            
            this.bln_dataNavToggle=false;
          }
          else{//False , go to end
            let int_mod=this.int_totalRowCount%this.int_limitRowPerPage;
            if(int_mod===0){int_mod=this.int_limitRowPerPage;}
            int_currentRowStart=this.int_totalRowCount-(int_mod);              
            this.bln_dataNavToggle=true;
          }

          //this.fn_debugText("int_currentRowStart: " + int_currentRowStart);
          this.obj_dataView.fn_setLimitRowStart(int_currentRowStart);                         
          
          
          this.fn_runMenu();         
        }

        fn_calculateDataSummary(){
          //console.log("fn_calculateDataSummary");

          let str_displaySummary="";
          let bln_enableButtonDataBack=true;
          let bln_enableButtonDataForward=true;                        
          let bln_enableButtonDataToggle=true;                        
          let bln_displayDataSummary=false;
          let bln_displayDataNavButton=false;                                    
          
          let int_totalRowCount=this.obj_dataView.obj_paramRS.int_totalRowCount;
          let int_totalRowReturned=this.obj_dataView.obj_paramRS.int_totalRowReturned;            
          let int_limitRowPerPage=this.obj_dataView.fn_getLimitRowPerPage();
          let int_currentRowStart=this.obj_dataView.fn_getLimitRowStart();                                     
          
          let int_numRowFrom=int_currentRowStart+1;                                    
          let int_numRowTo=int_currentRowStart+int_limitRowPerPage;                                                

          let int_numRowBack=int_currentRowStart-int_limitRowPerPage;            
          if(int_numRowBack<0){
            int_numRowBack=0;
            bln_enableButtonDataBack=false;
            this.bln_dataNavToggle=false;
          }                                    
          let int_numRowForward=int_numRowTo;
          if(int_numRowTo>=int_totalRowCount){
            int_numRowTo=int_totalRowCount;            
            int_numRowForward=int_currentRowStart;
            bln_enableButtonDataForward=false;
            this.bln_dataNavToggle=true;
            
          }            
          
          //let str_title=obj_shared.fn_capitalizeTheFirstLetterOfEachWord(this.obj_meta.str_metaRowzTitle);
          let str_title=this.obj_meta.str_metaRowzTitle;
          
          if(!int_totalRowReturned){
            int_totalRowReturned=0;
          }
          
          if(int_totalRowCount>int_limitRowPerPage){            
            bln_displayDataSummary=true;
            bln_displayDataNavButton=true;
            str_displaySummary+=int_numRowFrom + "-" + int_numRowTo + " of " + int_totalRowCount +" ";
          }            
          else{              
            str_displaySummary+=int_totalRowReturned + " ";                      
            bln_enableButtonDataToggle=false;
          }             
          str_displaySummary+=str_title + " ";

          if(int_totalRowReturned===0){      
            bln_displayDataSummary=true;
          }            


          this.str_dataSummary=str_displaySummary;                        

          this.bln_enableButtonDataBack=bln_enableButtonDataBack;
          this.bln_enableButtonDataForward=bln_enableButtonDataForward;                        
          this.bln_enableButtonDataToggle=bln_enableButtonDataToggle;                                    
          this.bln_displayDataSummary=bln_displayDataSummary;
          this.bln_displayDataNavButton=bln_displayDataNavButton;                                    
          
          this.int_totalRowCount=int_totalRowCount;
          this.int_totalRowReturned=int_totalRowReturned;
          this.int_limitRowPerPage=int_limitRowPerPage;
          this.int_currentRowStart=int_currentRowStart;
          this.int_numRowFrom=int_numRowFrom;            
          this.int_numRowTo=int_numRowTo;            
          this.int_numRowBack=int_numRowBack;
          this.int_numRowForward=int_numRowForward;

          /*
          this.fn_debugText("int_totalRowCount: " + this.int_totalRowCount);
          this.fn_debugText("int_totalRowReturned: " + this.int_totalRowReturned);
          this.fn_debugText("int_limitRowPerPage: " + this.int_limitRowPerPage);
          this.fn_debugText("int_currentRowStart: " + this.int_currentRowStart);
          this.fn_debugText("int_numRowFrom: " + this.int_numRowFrom);
          this.fn_debugText("int_numRowTo: " + this.int_numRowTo);
          this.fn_debugText("int_numRowBack: " + this.int_numRowBack);
          this.fn_debugText("int_numRowForward: " + this.int_numRowForward);
          //*/

          
        }
        fn_calculateDataSummaryView(){            

          let int_totalRowReturned=this.obj_dataView.obj_paramRS.int_totalRowReturned;
          let int_limitRowPerPage=this.obj_dataView.fn_getLimitRowPerPage();

          
          if(int_totalRowReturned>int_limitRowPerPage){}
          else{            
            this.bln_displayDataSummary=true;
          
          }            

          this.bln_addHardRule=true;  
        }
        fn_addDataSummary(){
          
          this.fn_calculateDataSummary();                        
          this.fn_getViewMenuSummaryContainer();  

          this.fn_addDataSummaryReport();
          this.fn_addDataSummaryDashboard();
          this.fn_addDataSummaryWidget();          

          //this.fn_updateButtonText(this.obj_dataView);            
          
          this.fn_updateButtonCount();          
        }

        fn_getSettingGroup(){

          let str_value=this.fn_getMetaRowzGroup();            
          if(str_value==="settinggroup"){return true;}
          return false;            
        }

        fn_clearButtonCount(){

          if(this.fn_getIsDynamicMenu()){return;}
          if(!this.fn_getIsMenuWithView()){return;}            
          let str_text=this.fn_getMetaRowzTitle();                      
          this.fn_setText(str_text);            
        }        
        fn_updateButtonCount(){

          if(this.fn_getSettingGroup()){return;}
          if(!this.fn_getIsMenuWithView()){return;} 
          if(this.fn_getIsDynamicMenu()){return;}

          /*
          if(this.fn_getAutoJoinPin()){return;}            
          if(this.fn_getSettingGroup()){return;}
          if(this.fn_getIsDynamicMenu()){return;}
          if(!this.fn_getIsMenuWithView()){return;} 
          //*/           
          //if(!this.int_totalRowCount){return;}
          //this.fn_debugText("this.int_totalRowCount: " + this.int_totalRowCount);
          let str_text=this.fn_getMetaRowzTitle();            
          str_text+=" ("+this.int_totalRowCount+")" ;
          this.fn_setText(str_text);            
        }

        fn_onCountStart(obj_post){

          this.fn_onDataStart(obj_post);

          let int_totalRowCount=obj_post.RowCount;
          if(!int_totalRowCount){int_totalRowCount=0;}
          this.int_totalRowCount=int_totalRowCount;
          this.fn_updateButtonCount();                            
          if(this.obj_dataView){
            this.obj_dataView.fn_removeChildren();
          }              
          this.obj_dataView=false;
          //this.fn_debugText("fn_onCountStart");

          this.bln_runSearch=false;             
        }



        
        fn_getDataSummaryContainer(obj_parent){
          let obj_container=obj_parent.fn_addContextItem("block");        
          obj_container.fn_setDisplayFlex(true);                        
          obj_container.fn_setStyleProperty("padding", "10px");              
          /*
          obj_container.fn_setStyleProperty("gap", "10px");                        
          obj_container.fn_setStyleProperty("display", "flex");                        
          obj_container.fn_setStyleProperty("flex-flow", "column-wrap");            
          //*/
          return obj_container;
        }

        fn_getViewMenuSummaryContainer(){

          if(!this.obj_meta.bln_displayAccordionView){              
            return;
          }

          this.fn_calculateDataSummaryView();
          if(!this.bln_displayDataSummary){return;}

          

          let obj_container=this.fn_getDataSummaryContainer(this.obj_accordionView);                                    
          this.obj_dataSummaryContainer=obj_container;
          obj_container.fn_setStyleProperty("flex-flow", "column wrap");                        
          obj_container.fn_setStyleProperty("gap", "10px");  
          
          this.fn_addDataSummaryPanel(obj_container);              

          if(this.bln_displayDataSummary){
            let obj_hardrule=this.obj_dataSummaryContainer.fn_addContextItem("form_hardrule");                                        
          }

          //*                      
          //obj_hardrule.fn_setStyleProperty("width", "100%");                        
          //obj_hardrule.fn_setStyleProperty("display", "block");                                    
          //*/
        }
        fn_addDataSummaryReport(){
          if(!this.obj_meta.bln_displayAccordionView){return;}            
          if(!this.bln_displayDataSummary){return;}
        }

        fn_addDataSummaryDashboard(){

          if(!this.bln_displayDashboard){return;}
          if(!this.bln_displayDataSummary){return;}
          if(1==1){
            return;
          }
          

          let arr_item=this.fn_getDashboardView();    
          if(!arr_item){return;}
          for(let i=0;i<arr_item.length;i++){
            let obj_dashboard=arr_item[i];
            if(obj_dashboard && obj_dashboard.obj_design.arr_item.length){                                                
              let obj_container=this.fn_getDataSummaryContainer(obj_dashboard);                        
              this.fn_addDataSummaryPanel(obj_container);              
            }  
          }
        }
        fn_addDataSummaryWidget(){
          if(!this.obj_meta.bln_displayWidget){return;}
          if(!this.bln_displayDataSummary){return;}
          let obj_container=this.fn_getDataSummaryContainer(this.obj_containerWidgetView);                        
          obj_container.fn_setStyleProperty("padding", "0px");                        
          this.fn_addDataSummaryPanel(obj_container);
          
        }

        fn_addDataSummaryPanel(obj_container){                        

          let obj_button;
          
          let obj_console=obj_container.fn_addContextItem("xapp_console");                  
          obj_console.fn_setDisplayFlex();            
          obj_console.obj_menuButton=this;

          let obj_consoleContainerDataSummary=obj_console.fn_addConsoleContainer("xapp_console_container_datasummary", false);
          obj_consoleContainerDataSummary.fn_setStyleProperty("align-items", "center");            
          obj_consoleContainerDataSummary.fn_setDisplayFlex();            
          obj_consoleContainerDataSummary.obj_menuButton=this;            

          if(this.bln_displayDataNavButton){            
          
            obj_button=obj_consoleContainerDataSummary.fn_getConsoleComponent("xapp_button_data_nav_back");                                                      
            obj_button.fn_setDisplay();
            if(this.bln_enableButtonDataBack){
              obj_button.fn_setEnabled();              
            }
            
            
            obj_button=obj_consoleContainerDataSummary.fn_getConsoleComponent("xapp_button_data_nav_forward");                                        
            obj_button.fn_setDisplay();
            if(this.bln_enableButtonDataForward){
              obj_button.fn_setEnabled();        
            }      
          }                      
          
          if(this.bln_displayDataSummary){              
            obj_button=obj_consoleContainerDataSummary.fn_getConsoleComponent("xapp_button_data_nav_toggle");                                      
            
            if(obj_button){
              obj_button.fn_setText(this.str_dataSummary);            
              obj_button.fn_setDisplay();
              obj_button.fn_setEnabled(this.bln_enableButtonDataToggle);              
              //obj_button.fn_setDisabled();              

            }              
          }
        }
        
        
        //RECORDSET LEVEL
        //ROW LEVEL
        
        //----------------------------------------
        //SIGNPOST 11. menu fn_onComputeRowView
        //----------------------------------------
        //fn_loadDashboard
        //fn_loadWidget
        //fn_loadMenu
        //fn_addDynamicMenuToAccordion
        fn_onComputeRowView(obj_row){
          //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
          //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
          //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
          //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"
        
          //It seems as if dashboards, widgets, and child menus are add sequentially on each row
        
          
          //console.log("this.obj_meta.bln_displayWidget: " + this.obj_meta.bln_displayWidget)      
          if(this.obj_meta.bln_displayWidget){
            let obj_containerWidgetView=this.fn_getWidgetView();
            obj_containerWidgetView.fn_loadWidget(obj_row);
            
          }       
          if(this.obj_meta.bln_displayAccordionView){//this detemrines wether the row is interpreted as a dynamic menu , or not.
            let obj_item=this.fn_addDynamicMenuToAccordion(obj_row);                          
            if(obj_item){
              //obj_item.fn_debug();              
              obj_item.fn_setStyleProperty("fontWeight", "normal");                                          
              //obj_item.fn_showIcon("replace-row-view");                            
            }
            /*
            const obj_compareURL=obj_path.fn_compareURLNavigateArchive(obj_item.obj_meta.str_metaRowzName);                                    
            if(obj_compareURL.bln_applyURL){                                  
              //obj_item.fn_open();
              //this is not necessary to be here as dynamic menus will have an id and therefore be only menu
            } 
            //*/                           
          }
        }  
        //ROW LEVEL
        //VIEW 
        fn_getMetaTypeFromRow(obj_param){
          
          let obj_metaColumn, str_metaType, foo_value;
          str_metaType=this.str_defaultTypeMenu;//default type is Menu            
          obj_metaColumn=obj_param.obj_rowMenu.obj_paramRS.obj_recordset.fn_getMetaColumnViaName("MetaTypeMenu");                
          if(obj_metaColumn){    
            foo_value=obj_metaColumn.str_value;        
            //allow overide default type 
            if(foo_value){str_metaType=foo_value;}              
            obj_param.str_metaTypeMenu=str_metaType;
          } 
        }   
        
        fn_addStandardMenuToAccordion(obj_row){//overidden, but is called
          //Standard Child Menu    
        
          let obj_accordion=this.fn_getAccordionChildMenu();
          let obj_param={};
          obj_param.obj_accordion=obj_accordion;
          obj_param.obj_rowMenu=obj_row;    
          
          this.fn_getMetaTypeFromRow(obj_param);        
        
          if(!obj_param.str_metaTypeMenu){
            //console.log("ERROR: Child Menu Type is False: obj_param.str_metaTypeMenu: " + obj_param.str_metaTypeMenu);
            return;
          }          
          
          let obj_item=obj_param.obj_accordion.fn_addContextItem(obj_param.str_metaTypeMenu, false);                                                
          if(!obj_item){
            //console.log("ERROR: Child Menu is not an object: obj_param.str_metaTypeMenu: " + obj_param.str_metaTypeMenu);
            return;
          }
          //console.log(obj_item)

          //obj_item.fn_setStyleProperty("fontWeight", "bold");
          
          obj_item.obj_parentMenu=this;                                                  
          obj_item.fn_configureMetaFromRow(obj_row);//1 this order is important, to ensure overide default values such as autoopenparemtMenu and Id is set correctly    
          this.fn_configureChildMenuShared(obj_item);//2 this order is important        
          this.fn_addToArrayStandardMenu(obj_item);            
          
          
          obj_item.fn_configureSelfShared(obj_row);           
          obj_item.fn_configureStandardMenu(obj_row);                                   

          
          return obj_item;     
        }          
        fn_getIsMenuWithView(){          
          //if(!obj_shared.fn_validId(this.obj_meta.int_idMetaView) || obj_shared.fn_compareId(this.obj_meta.int_idMetaView, "100")){return false;}//if no valid view id
          if(!this.fn_getViewPin()){return false;}//if no valid view id
          
          return true;          
        }          
        fn_getTogglePeersPin(){          
          if(!this.obj_menuProject){return false};            
          return this.obj_menuProject.bln_togglePeersPin;    
        }            
        fn_getIsStandardMenu(){
          return this.bln_standardMenu;
        }        
        fn_setIsStandardMenu(bln_value){
          return this.bln_standardMenu;
        }        
        fn_configureStandardMenu(){
          this.fn_setIsStandardMenu(true);            
        }          
        fn_addDynamicMenuToAccordion(obj_row){    
        
          let obj_meta, obj_template;
        
          obj_meta=this.fn_getDynamicMeta();// this order is important, to ensure paremtMenu and Id is set correctly                                  
          
          if(!obj_meta.str_metaTypeMenu){
            obj_meta.str_metaTypeMenu=this.str_defaultTypeMenu;            
          }          
          
          let obj_accordion=this.fn_getAccordionView();    
          let obj_item=obj_accordion.fn_addContextItem(obj_meta.str_metaTypeMenu);                            
          this.fn_configureChildMenuShared(obj_item);//2 this order is important    
          this.fn_addToArrayDynamicMenu(obj_item);                                    
          
          obj_item.obj_meta=this.fn_getDeepCopy(obj_meta);                
          
          //obj_item.obj_meta=obj_meta;                
          obj_item.fn_configureSelfShared(obj_row);            
          
          obj_item.fn_configureDynamicMenuFromRow(obj_row);                                                      
          
          
          
          return obj_item;
        } 
        
        fn_getIsDynamicMenu(){
          return this.bln_dynamicMenu;
        }
        fn_setIsDynamicMenu(bln_value){
          this.bln_dynamicMenu=bln_value;
        }

        fn_configureDynamicMenuFromRow(obj_rowMenu){    
            //this is run by the dynamic menu
          //context dynamic menu button

          this.fn_setIsDynamicMenu(true);

          this.bln_applyAnchor=true;//used to set wether there will be a  menu bar navigation anchor link
          
          //START Configure Dynamic Menu Key
          let obj_recordset=obj_rowMenu.obj_paramRS.obj_recordset;
          //grab column name for dynamic menu button 
          //references the data set of the parent menu   
          //gets the primary key of whichever is the  first column
          
          //set dynamic button text, and id values      
          this.fn_updateButtonText(obj_recordset);                         

          this.obj_columnKey=obj_rowMenu.fn_getColumnKey();                        
          if(this.obj_columnKey){//false on standard xapp_row
            this.obj_columnDataId=obj_rowMenu.fn_getColumnDataId();//required for menu archive button to function
            this.obj_columnArchiveDate=obj_rowMenu.fn_getColumnArchiveDate();//required to toggle archive / restore button text in menupane            
            this.fn_setMenuRecordId(this.obj_columnKey.str_value);            
          }
          //END Configure Dynamic Menu Key
        }

        
        fn_updateButtonText(obj_recordset){
          let str_value=this.fn_formatButtonText(obj_recordset);        

          //console.log("str_value:  " + str_value);
          if(!str_value){return;}            
          this.str_buttonText=str_value;
          //console.log("this.str_buttonText: " + this.str_buttonText);
          this.fn_setText(str_value);            
        }

        //required to be on xapp_menu
        origfn_formatButtonText(obj_recordset){
      
          if(this.bln_modeNewRecord){
            return "New Record";        
          }
      
          let str_value="";                   
          
          let arr_pin=obj_recordset.obj_paramRS.arr_menuPinColumn;
          for(let i=0;i<arr_pin.length;i++){              
            let obj_metaColumn=arr_pin[i];                        
            if(obj_metaColumn && obj_metaColumn.str_value && !obj_metaColumn.HiddenPin){                        

              let str_text=obj_metaColumn.str_value;      
              if(!str_text){continue;}
              str_text+="";
              //*
              const int_max=100;
              if(str_text.length>int_max){
                str_text=str_text.substring(0, int_max);
                str_text+="...";
              }
              //*/              
              str_text=str_text.replace(/(\r\n|\n|\r)/gm, "");
              
              if(str_value){str_value+=" || ";}
              str_value+=str_text;
            }

          }   
          //console.log(str_value);
          return str_value;
        }

        //required to be on xapp_menu
        fn_formatButtonText(obj_recordset){
      
          if(this.bln_modeNewRecord){
            return "New Record";        
          }
      
          let str_value="";                   
          
          let arr_pin=obj_recordset.obj_paramRS.arr_menuPinColumn;

          
          //console.log("arr_pin:  " + arr_pin.length);
          //console.log(arr_pin);
          
          for(let i=0;i<arr_pin.length;i++){              
            let obj_metaColumn=arr_pin[i];            
            //console.log("arr_pin count: " + i);           
            //console.log("obj_metaColumn.str_value: " + obj_metaColumn.str_value);
            //console.log("obj_metaColumn.HiddenPin: " + obj_metaColumn.HiddenPin);
            if(obj_metaColumn && obj_metaColumn.str_value && !obj_metaColumn.HiddenPin){                        

              let str_text=obj_metaColumn.str_value;                    
              if(!str_text){continue;}              
              str_text=obj_shared.fn_formatDisplayValueFromColumn(obj_metaColumn,str_text);

              switch(obj_metaColumn.MetaColumnType.toLowerCase()){                    
                case "note":
                case "text":
                  const int_max=100;
              if(str_text.length>int_max){
                str_text=str_text.substring(0, int_max);
                str_text+="...";
              }
              
              str_text=str_text.replace(/(\r\n|\n|\r)/gm, "");              
                  break;
                case "date":                                            
                case "datetime":
                  str_text=str_text.slice(0, 11);
                  break;
              }
              
              
              
              if(str_value){str_value+=" | ";}
              str_value+=str_text;//rolling loop addition to str_value
            }

          }   
          //console.log(str_value);
          return str_value;
        }

        fn_getMenuParent(obj_item){
          return this.obj_parentMenu;
        }
        
        
        fn_setMenuParent(obj_item){
          obj_item.obj_parentMenu=this;                                                  
          if(this.bln_isAppRoot){
            if(!this.bln_hasTopLevelItem){
              this.bln_hasTopLevelItem=true;
              obj_item.bln_topLevelMenu=true;                              
              obj_item.fn_setAutoOpenPin(true);                
            }
            else{
              obj_item.bln_topLevelMenu=true;                  
              obj_item.fn_setAutoOpenPin(false);                                                        
            }
          }            
        }
        
        //START SHARED BY BOTH STANDARD AND DYNAMIC
        fn_configureChildMenuShared(obj_item){                            
          this.fn_setMenuParent(obj_item);
          
        }  
        
        fn_configureSelfShared(obj_row){ //standard from add to accordion      
        
        this.obj_rowMenu=obj_row;  

        this.obj_menuProject=this.obj_parentMenu.obj_menuProject;
        this.obj_crudHead=this.obj_parentMenu.obj_crudHead;                                                          
                
        this.obj_meta.arr_buttonConsole=obj_shared.fn_stringToArray(this.obj_meta.str_buttonConsole);                        
        this.obj_meta.str_buttonConsole=this.obj_meta.arr_buttonConsole.toString();                                        
        
        
        if(this.fn_getHiddenPin()){
          this.fn_setHiddenPin(true);            
        }
        
        
        if(this.fn_getDisabledPin()){
          this.fn_setDisabled(true);    
        }
        
        //this.fn_scrollIntoView();  
        this.fn_scrollTop(this.obj_parentMenu.int_scrollTopChild);
        
        } 
        fn_setDisabled(){
          super.fn_setDisabled(true);
          this.fn_close();
        }
        
        //END SHARED BY BOTH STANDARD AND DYNAMIC          
        
        fn_getDynamicMeta(){//for dynamic menus which dont have a childmenu template



          let obj_meta, obj_template;              
        
          let bln_useTemplate=true;
          let bln_canUseSelf=true;//self has not been demonstrated to produce useful results
          if(bln_useTemplate){
        
            this.bln_useMetaTemplate=true;                 
            //console.log("use meta template");         
            
            let arr_item=this.obj_accordionChildMenu.obj_design.arr_item;                  
            
            if(arr_item.length===1){                                
              if(arr_item[0].fn_getDynamicMenuPin()){                                                  
                this.obj_template=arr_item[0];                
              }
            }       
            if(this.obj_template){
              obj_meta=this.obj_template.obj_meta;                                      
              //console.log("str_metaConstraintName: " + obj_meta.str_metaConstraintName);                           
            }
            
          }
          
          if(bln_canUseSelf && !obj_meta){   //never user causes recursion    
            //console.log("use meta self");
            //console.log(this.obj_meta);
            //obj_meta=this.fn_getDeepCopy(this.obj_meta);                                              
          
          }    
        
          if(!obj_meta){                      
            obj_meta=this.fn_getMetaDefaultDynamic();
          } 
          return obj_meta;
        }
        fn_getMetaDefault(){
          return {              
            
            bln_togglePeersPin: true, //this needs to be on a toggle button      
            bln_autoOpenPin: false,
            bln_autoFetch: false,              
            bln_debugPin: false,
            bln_displayAccordionChildMenu: false,
            bln_displayAccordionView: false,
            bln_displayDashboard: false,
            bln_displayDataChildMenu: false,
            bln_displayData: false,      
            bln_displayMenuPanel: false,      
            bln_displayReport: false,
            bln_displayWidget: false,            
            bln_runDataChildMenu: false,
            bln_runDataView: false,            
            str_metaConstraintName: "",              
            str_metaRowzName: "",
            int_idMetaRowz: 0,
            int_idParentMetaRowz: 0,                          
            int_idMetaView: 0,                  
            bln_viewPin: 0,                  
            str_buttonConsole: "",            
            MetaPermissionTag: "100",
            str_metaTypeDashboard: "",      
            str_metaTypeData: "",      
            str_optionChildMenu: "",
            str_text: "",
          };
        }
        fn_getMetaDefaultDynamic(){

          let obj_meta=this.fn_getMetaDefault();                
          obj_meta.bln_togglePeersPin=this.obj_meta.bln_togglePeersPin;            
          obj_meta.bln_debugPin=this.fn_getDebugPin();          
          obj_meta.bln_displayDataChildMenu=false;//this should remain false, otherwise additional grid gap is displayed        
          obj_meta.bln_displayAccordionChildMenu=true;//updated for new op            
          obj_meta.bln_displayData=true;                
          obj_meta.bln_displayMenuPanel=true;                
          obj_meta.bln_autoFetch=this.fn_getAutoFetch();          
          obj_meta.bln_runDataChildMenu=true;//this needs to be on to see Data
          obj_meta.bln_runDataView=true;        
          obj_meta.str_metaRowzName=this.obj_meta.str_metaRowzName;            
          obj_meta.int_idMetaRowz=this.obj_meta.int_idMetaRowz;                        
          obj_meta.int_idParentMetaRowz=this.obj_meta.int_idParentMetaRowz;    
          obj_meta.int_idMetaView=this.obj_meta.int_idMetaView;          
          obj_meta.bln_viewPin=this.fn_getViewPin();
          //obj_meta.str_buttonConsole="Search";            
          obj_meta.str_metaTypeData=this.str_defaultTypeData;                            
          obj_meta.str_metaTypeMenu=this.obj_meta.str_metaTypeMenu;                      
          if(!obj_meta.str_metaTypeMenu){       
            obj_meta.str_metaTypeMenu=this.str_defaultTypeMenu;                      
          }                        
          return obj_meta;
        }                              

        fn_navigateOption(){
          //console.log("fn_navigateOption");

        }
        
        
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////

        
        fn_getOnlyDynamicMenu(){return false;}
        //Dynamic Dynamic Menu                   
        fn_hideDynamicMenu(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          for(let i=0;i<arr_item.length;i++){      
            let obj_item=arr_item[i];
                if(obj_item!==obj_exclude){
                    obj_item.fn_close();
                    obj_item.fn_setDisplay(false);           
                }
            }
        }
        fn_closeDynamicMenu(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          for(let i=0;i<arr_item.length;i++){      
            let obj_item=arr_item[i];
                if(obj_item!==obj_exclude){
                    obj_item.fn_close();          
                }
            }
        }
        
        fn_dynamicMenuCloseAndDisable(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          for(let i=0;i<arr_item.length;i++){      
            let obj_item=arr_item[i];
                if(obj_item!==obj_exclude){
                    obj_item.fn_close();          
                    obj_item.fn_setDisabled();                                                  
                }
                obj_item.fn_dynamicMenuCloseAndDisable(obj_exclude);
            }
        }                   
        
        fn_addToArrayDynamicMenu(obj_item){
          this.obj_holder.arr_dynamicMenu.push(obj_item);                        
          this.fn_setMenuParent(obj_item);            
        }
        fn_getArrayDynamicMenu(){
          return this.obj_holder.arr_dynamicMenu;
        }         
        fn_getOnlyDynamicMenu(){
          let arr_item=this.fn_getArrayDynamicMenu();                        
          if(arr_item.length===1){
            return arr_item[0];
          }   
          return false;
        }   

        fn_debugArrayDynamicMenu(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          //this.fn_debugText("arr_dynamic item.length: " + arr_item.length);
          //console.log(arr_item);                    
          /*
          for(let i=0;i<arr_item.length;i++){      
              let obj_item=arr_item[i];
              //obj_item.fn_debug();
          }
          //*/
        }            
        fn_getTopLevelMenuParent(){            
          return this.obj_holder.bln_hasTopLevelParentMenu;
        }
        
        
        fn_hasTopLevelRowzParent(int_idParentMetaRowz){                        
          
          //console.log("this.obj_parentMenu: " + this.obj_parentMenu);
          if(!this.obj_parentMenu){return false;}            
          //console.log("this.obj_parentMenu.bln_topLevelMenu: " + this.obj_parentMenu.bln_topLevelMenu);
          if(this.obj_parentMenu.bln_topLevelMenu){              
            let int_idMetaRowz=this.obj_parentMenu.obj_meta.int_idMetaRowz+"";
            int_idParentMetaRowz+="";              
            //console.log("int_idMetaRowz: " + int_idMetaRowz);
            //console.log("int_idParentMetaRowz: " + int_idParentMetaRowz);
            if(int_idMetaRowz===int_idParentMetaRowz){                             
              return true;                
            }
          }
          return this.obj_parentMenu.fn_hasTopLevelRowzParent(int_idParentMetaRowz);                
        }              
        fn_updateTextHyperlink(){            
          this.fn_setText(this.fn_getText());
        }
        
        fn_getNavigateURL(str_urlBase=""){
          const obj_navigate=this.fn_getNavigate();
          return obj_path.fn_getNavigateRecordURL(obj_navigate.str_urlMetaRowzName, obj_navigate.str_urlMetaRecordId, str_urlBase);
        }
        fn_getNavigate(){                
          let obj_navigate={};             
          //console.log(this.obj_meta);
          obj_navigate.int_idMetaView=this.obj_meta.int_idMetaView;
          //console.log("obj_navigate.int_idMetaView: " + obj_navigate.int_idMetaView);
          obj_navigate.str_urlMetaRowzName=this.obj_meta.str_metaRowzName;
          obj_navigate.str_urlMetaRecordId=this.obj_meta.str_metaRecordId;            
          if(this.obj_columnKey){              
            obj_navigate.str_urlMetaRecordId=this.obj_columnKey.str_value
          }
          
          return obj_navigate;
        }                       

        fn_setNavigationURL(str_value){

          if(this.fn_getSettingOperationPin()){                      
            return;            
          }

          if(obj_project.obj_design.bln_disallowHyperLinkButton){          
            return;
          }
        
          if(this.obj_meta.int_idParentMetaRowz && this.bln_applyAnchor){//check apply
            let bln_value=this.fn_hasTopLevelRowzParent(this.obj_meta.int_idParentMetaRowz);                       
            this.bln_applyAnchor=bln_value;
          }                      

          if(!this.bln_applyAnchor){              
            return;
          }

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setNavigationURL(str_value);          
          } 
        }

        fn_setMenuRecordId(str_value){
          this.obj_meta.str_metaRecordId=str_value;
          this.fn_updateTextHyperlink();
        }

        fn_getMenuRecordId(){
          return this.obj_meta.str_metaRecordId;
        }        

        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        
        fn_setText(str_value){      

          super.fn_setText(str_value);          

          let obj_anchor=this.fn_getComponent("form_button_anchor");                              
          
          if(obj_anchor){          
            obj_anchor.fn_setText(str_value);          
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
        ///////////////////////
        ///////////////////////
        ///////////////////////
        
        
            }//END CLS
            //END TAG
            //END component/xapp_menu
/*type: xapp_menu//*/
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
/*type: xapp_base//*/
      //XSTART component/xapp_base
      class xapp_base extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
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
      }//END CLS
      //END TAG
      //END component/xapp_base        
/*type: xapp_base//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_console_container//*/

            //XSTART component/xapp_console_container
              class xapp_console_container extends xapp_base{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                     

                  this.obj_holder.bln_listenSubmit=true;

                  this.bln_debugContainer=false;
                  this.obj_design.str_themeType="form_section";
                  this.obj_design.str_themeType="form_container";
                }                

                fn_displayTogglePair(obj_a, obj_b, bln_value){            
    
                  if(bln_value){
                    this.fn_showItem(obj_a);                                  
                    this.fn_hideItem(obj_b);                                                                  
                  }
                  else{
                    this.fn_showItem(obj_b);                                                                  
                    this.fn_hideItem(obj_a);                                                                  
                  }                          
              }

                fn_onSubmit(e){                                                                                         

                  //this.fn_debugName("fn_onSubmit");

                  obj_project.fn_forgetEvent(e);          

                  this.fn_parentEventBubble("Submit", e);//this causes things to happen                  
                }

                fn_getConsoleComponent(str_value){
                  let obj_item=this.fn_getComponent(str_value);                  
                  return obj_item;
                }
                fn_addConsoleContextItem(str_value){
                  let obj_item=this.fn_addContextItem(str_value);                  
                  return obj_item;
                }

                fn_hide(){               
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_hide");
                  }
                  
                  this.fn_disableAllItems();
                  this.fn_checkDisplayFlex();
                }

                fn_disableAllItems(){                   
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_disableAllItems");
                    alert("deprecated will not see");
                  }                  
                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];
                    obj_item.fn_disableAll();                    
                  
                  }
                }
                

                fn_checkDisplayFlex(){                       
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_checkDisplayFlex");
                  }
                  
                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  let bln_found=false;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];
                    let str_value=obj_item.fn_getStyleProperty("display");
                    //this.fn_debugName("str_value: "  + str_value);                    
                    if(str_value!=="none"){
                      bln_found=true;
                    }                    
                  }
                  
                  if(!bln_found){                    
                    this.fn_setDisplayFlex(false);
                  }                                    
                }


                fn_setDisabledItems(){                   
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_setDisabledItems");
                  }
                  
                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  let bln_value=false;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];                    
                    bln_value=true;
                    
                    if(this.bln_debugContainer){                    
                      obj_item.fn_debug("console container fn_setDisabledItems fn_setDisabled true");                    
                    }                    

                    obj_item.fn_setDisabled();               
                  }
                  return bln_value;
                }

                fn_disable(){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_disable true");
                  }                    
                  
                  let bln_value=this.fn_setDisabledItems();
                  this.fn_setDisplayFlex(bln_value);
                  this.fn_checkDisplayFlex();
                }

                
                fn_hideItem(obj_item){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_hideItem");
                  }                    
                  
                  if(!obj_item)return;                  

                  if(this.bln_debugContainer){                                        
                    obj_item.fn_debug("console container hide item");                    
                  }                    

                  obj_item.fn_setDisplay(false);                  
                  this.fn_checkDisplayFlex();                  
                }
                fn_showItem(obj_item){                  
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_showItem");
                  }                                      
                  
                  if(!obj_item)return;                                    

                  if(this.bln_debugContainer){                    
                    obj_item.fn_debug("console container show item");
                  }                    

                  obj_item.fn_enableAllFlex();
                  this.fn_setDisplayFlex(true);                                                      

                  if(this.bln_debugContainer){                    
                    obj_item.fn_debug("console container show item");
                  }                                      
                
                  let obj_menuButton=this.fn_getMenuButton();                                                 
                  let arr_item=obj_menuButton.obj_meta.arr_buttonConsole;
                  if (!arr_item.includes(obj_item)) {
                    arr_item.push(obj_item);
                    obj_menuButton.fn_displayMenuPanel(arr_item);        
                  }                                 
                }
                
                fn_coverItem(obj_item){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_coverItem");
                  }                    
                  
                  if(!obj_item)return;
                  obj_item.fn_setVisible(false);
                  this.fn_checkDisplayFlex();
                }

                fn_setDisabledItem(obj_item){  
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_setDisabledItem");
                  }                                    
                  
                  if(obj_item){                     
                    if(this.bln_debugContainer){                    
                      obj_item.fn_debug("console container fn_setDisabledItem true");
                    }                                                       

                    obj_item.fn_setDisabled();                                        
                  }                  
                  this.fn_checkDisplayFlex();
                }                
                
                fn_unLockAll(){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_unLockAll");
                  }                                                                         
                  this.fn_lockAll(false);
                }

                fn_lockAll(bln_value){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_lockAll");
                  }

                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];                    
                    obj_item.fn_setDisabled(bln_value);                    
                  }
                  this.fn_checkDisplayFlex();
                }
              }//END CLS
              //END TAG
              //END component/xapp_console_container
/*type: xapp_console_container//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_data//*/

            //XSTART component/xapp_data
            class xapp_data extends xapp_ajax{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                          

                this.obj_holder.bln_debugServer=true;                  

                this.str_defaultTypeRow="xapp_row";
                this.str_defaultTypeColumn="xapp_column";
                this.fn_initialize_var();
              }
              fn_onLoad(){    
                super.fn_onLoad();                  
                if(this.fn_getDebugPin()){this.fn_highlightBorder("blue");}                  
              }
              fn_initialize_var(obj_ini){
                
                this.obj_holder.str_typeColumn=this.str_defaultTypeColumn;
                this.obj_holder.bln_reportView=false;
                this.obj_holder.bln_editable=false;
                this.obj_holder.obj_query={};      
                this.obj_holder.obj_query.str_querySearch="";
                this.obj_holder.obj_query.str_queryList="";
                this.obj_holder.obj_query.str_queryListParent="";
                this.obj_holder.obj_query.str_queryListDisabled="";
                this.obj_holder.obj_query.str_queryListParentDisabled="";
                this.obj_holder.obj_query.bln_loadReportInterface=false;
                this.fn_setComputeRows(true);      
                this.fn_setLimitRowPerPage(10);                        
                this.fn_resetDataView();
               
              }                  
              fn_resetDataView(){
                this.fn_setLimitRowStart(0);
              }
              fn_setLimitRowPerPage(int_limitRowPerPage){                  
                this.obj_holder.obj_query.int_limitRowPerPage=int_limitRowPerPage;                          
              }
              fn_setLimitRowStart(int_limitRowStart){                  
                this.obj_holder.obj_query.int_limitRowStart=int_limitRowStart;                                                  
              }
              fn_getLimitRowPerPage(){                  
                return this.obj_holder.obj_query.int_limitRowPerPage;                          
              }
              fn_getLimitRowStart(){                  
                return this.obj_holder.obj_query.int_limitRowStart;                                
              }
              fn_setComputeRows(bln_value){
                this.obj_holder.bln_computeRows=bln_value;
              }
              fn_getComputeRows(){
                return this.obj_holder.bln_computeRows;
              }
              fn_initializeRS(obj_menuButton){                                  
                
                this.obj_paramRS={};                                  
                this.obj_paramRS.obj_recordset=this;                                    
                this.obj_paramRS.int_totalRowReturned=0;
                this.obj_paramRS.str_typeColumn=this.obj_holder.str_typeColumn;//can choose which class will the column be eg reporrtcolumn
                this.obj_paramRS.bln_reportView=this.obj_holder.bln_reportView;                  

                this.obj_paramRS.obj_menuButton=obj_menuButton;                                   

                if(obj_path.str_urlMetaRowzNameArchive){
                  this.obj_holder.obj_query.int_idMetaView=obj_menuButton.obj_meta.int_idMetaView;                    
                  this.obj_holder.obj_query.int_idMetaRowz=obj_menuButton.obj_meta.int_idMetaRowz;                                        
                  this.obj_holder.obj_query.str_metaRowzName=obj_menuButton.obj_meta.str_metaRowzName;
                  this.obj_holder.obj_query.str_urlMetaRowzNameArchive=obj_path.str_urlMetaRowzNameArchive;
                  this.obj_holder.obj_query.str_urlMetaRecordIdArchive=obj_path.str_urlMetaRecordIdArchive;
                }
                

                /*
                console.log("this.obj_meta.int_idMetaRowz: " + this.obj_meta.int_idMetaRowz);
                console.log("this.obj_meta.str_metaRowzName: " + this.obj_meta.str_metaRowzName);
                console.log("obj_path.str_urlMetaRowzNameArchive: " + obj_path.str_urlMetaRowzNameArchive);
                console.log("obj_path.str_urlMetaRecordIdArchive: " + obj_path.str_urlMetaRecordIdArchive);
                //*/                

                const int_horizontal=false, int_vertical=true;
                
                /*
                // Horizontal-tb: English, French, Spanish, etc. 
                p {
                  writing-mode: horizontal-tb;
                }

                //* Vertical-lr: Chinese, Japanese, Korean 
                p.vertical-lr {
                  writing-mode: vertical-lr;
                  text-orientation: upright;
                }

                // Vertical-rl: Arabic, Hebrew 
                p.vertical-rl {
                  writing-mode: vertical-rl;
                  text-orientation: upright;
                }

                // Horizontal-bt: A less common direction, but could be used for artistic effects or specific languages 
                p.horizontal-bt {
                  writing-mode: horizontal-bt;
                  text-orientation: mixed;
                }
                //*/
                
                /*
                //HORIZONTAL, HORIZONTAL, HORIZONTAL OK
                this.obj_paramRS.bln_axisPanel=int_horizontal;
                this.obj_paramRS.bln_axisFieldset=int_horizontal;
                this.obj_paramRS.bln_axisColumn=int_horizontal;                
                //*/

                //STANDARD
                /*
                //HORIZONTAL, HORIZONTAL, VERTICAL OK
                this.obj_paramRS.bln_axisPanel=int_horizontal;
                this.obj_paramRS.bln_axisFieldset=int_horizontal;
                this.obj_paramRS.bln_axisColumn=int_vertical;                
                //*/

                /*
                //HORIZONTAL, VERTICAL, VERTICAL OK FOR VERTICAL WRITING SYSTEMS
                //writing-mode: vertical-lr;
                this.obj_paramRS.bln_axisPanel=int_horizontal;
                this.obj_paramRS.bln_axisFieldset=int_vertical;
                this.obj_paramRS.bln_axisColumn=int_vertical;                
                //*/
                
                /*
                //HORIZONTAL, VERTICAL, HORIZONTAL OK FOR VERTICAL WRITING SYSTEMS
                this.obj_paramRS.bln_axisPanel=int_horizontal;
                this.obj_paramRS.bln_axisFieldset=int_vertical;
                this.obj_paramRS.bln_axisColumn=int_horizontal;                
                //*/

                /*
                //VERTICAL, VERTICAL, VERTICAL - no good, only 1 column down the page
                this.obj_paramRS.bln_axisPanel=int_vertical;
                this.obj_paramRS.bln_axisFieldset=int_vertical;
                this.obj_paramRS.bln_axisColumn=int_vertical;                
                //*/

                /*
                //VERTICAL, VERTICAL, HORIZONTA - no good, only 1 column down the page
                this.obj_paramRS.bln_axisPanel=int_vertical;
                this.obj_paramRS.bln_axisFieldset=int_vertical;
                this.obj_paramRS.bln_axisColumn=int_horizontal;                
                //*/
                

                /* 
                //VERTICAL, HORIZONTAL, HORIZONTAL - OK
                this.obj_paramRS.bln_axisPanel=int_vertical;
                this.obj_paramRS.bln_axisFieldset=int_horizontal;
                this.obj_paramRS.bln_axisColumn=int_horizontal;                
                //*/

                /*
                //VERTICAL, HORIZONTAL, VERTICAL OK
                this.obj_paramRS.bln_axisPanel=int_vertical;
                this.obj_paramRS.bln_axisFieldset=int_horizontal;
                this.obj_paramRS.bln_axisColumn=int_vertical;                
                //*/
                
                
                //STANDARD
                //*
                //HORIZONTAL, HORIZONTAL, VERTICAL OK
                this.obj_paramRS.bln_axisPanel=int_horizontal;
                this.obj_paramRS.bln_axisFieldset=int_horizontal;
                this.obj_paramRS.bln_axisColumn=int_vertical;                
                if(obj_project.bln_isMobile){
                  this.obj_paramRS.bln_axisColumn=int_vertical;
                }
                //*/

                this.obj_paramRS.bln_axis=false;//row              
                //this.fn_setAxis(this.obj_paramRS.bln_axis);
                this.obj_paramRS.int_separator=10;                                  
                this.obj_paramRS.bln_showFieldHeading=true;
                this.obj_paramRS.bln_autoSection=false;//1 row many sections                                                       
                this.obj_paramRS.bln_hasMultipleRow=false;
                this.obj_paramRS.bln_NoRowFound=false;
                this.obj_paramRS.bln_singleRowFound=false;                                    
                this.obj_paramRS.int_countRow=0;                                  
                this.obj_paramRS.bln_lastRow=false;

                this.bln_debug=obj_menuButton.bln_debug;                                                
              }                                 
              
                              
              fn_setMetaRowzId(int_value){           
                this.obj_holder.obj_query.int_idMetaRowz=int_value;
              }              
              fn_setMetaRowzTitle(int_value){           
                this.obj_holder.obj_query.str_metaRowzTitle=int_value;
              }              
              fn_setMetaRowzName(int_value){           
                this.obj_holder.obj_query.str_metaRowzName=int_value;
              }              
              
              fn_setMetaViewId(int_value){           
                this.obj_holder.obj_query.int_idMetaView=int_value;
              }
              fn_getMetaViewId(int_value){           
                return this.obj_holder.obj_query.int_idMetaView;
              }            
              
              
              fn_getQueryExpression(){                                  
                return this.obj_holder.obj_query.str_queryExpression;
              }                                
              
              fn_setQueryExpression(str_value){                                      
                /*
                let str_expr;                  
                str_expr="(";        
                str_expr+=str_value;        
                str_expr+="TRUE ";                
                str_expr+=")";
                this.obj_holder.obj_query.str_queryExpression=str_expr;
                //*/

                this.obj_holder.obj_query.str_queryExpression=str_value;
              }                                 
            
              fn_setMetaKey(obj_columnKey){

                //this.fn_debugText("fn_setMetaKey");

                
                this.obj_holder.obj_query.str_metaKeySchemaName="";
                this.obj_holder.obj_query.str_metaKeyTableName="";
                this.obj_holder.obj_query.str_metaKeyColumnName="";
                this.obj_holder.obj_query.str_metaKeyColumnValue="";

                if(!obj_columnKey){
                  return;
                }
                
                let obj_metaColumn=obj_columnKey.obj_metaColumn;                                                                
                this.obj_holder.obj_query.str_metaKeySchemaName=obj_metaColumn.MetaSchemaName;
                this.obj_holder.obj_query.str_metaKeyTableName=obj_metaColumn.MetaTableName;
                this.obj_holder.obj_query.str_metaKeyColumnName=obj_metaColumn.MetaColumnName;
                this.obj_holder.obj_query.str_metaKeyColumnShortName=obj_metaColumn.MetaColumnAPIName;
                this.obj_holder.obj_query.str_metaKeyColumnValue=obj_columnKey.str_value;                
              }

              
              fn_setModeExecuteViewRecord(){                  
                this.int_modeExecute=obj_holder.int_modeReadOnly;                  
                return false;
              }
              fn_getModeExecuteViewRecord(){
                if(this.int_modeExecute===obj_holder.int_modeReadOnly){return true;}
                return false;
              }

              fn_setSubdomain(str_value){                                  
                this.obj_holder.obj_query.str_subdomain=str_value;                  
              }

              fn_setDataQuerySearch(str_querySearch, bln_resetDataView=true){ 
                if(bln_resetDataView){
                  this.fn_resetDataView();                                 
                }
                
                this.obj_holder.obj_query.str_querySearch=str_querySearch;
              }                                                
              fn_getDataQuerySearch(){                                                  
                return this.obj_holder.obj_query.str_querySearch;
              }                                                
              
              fn_setDataQueryList(str_queryList){                                  
                //this.fn_resetDataView();                
                this.obj_holder.obj_query.str_queryList=str_queryList;
              }                                                
              fn_getDataQueryList(){                                  
                return this.obj_holder.obj_query.str_queryList;
              } 
              fn_setDataQueryListParent(str_queryList){          
                this.obj_holder.obj_query.str_queryListParent=str_queryList;
              } 
              fn_getDataQueryListParent(){
                return this.obj_holder.obj_query.str_queryListParent;
              } 
              fn_setDataQueryListDisabled(str_queryList){                                  
                //this.fn_resetDataView();                
                this.obj_holder.obj_query.str_queryListDisabled=str_queryList;
              }                                                
              fn_getDataQueryListDisabled(){                                  
                return this.obj_holder.obj_query.str_queryListDisabled;                  
              } 
              fn_setDataQueryListParentDisabled(str_queryList){                           
                this.obj_holder.obj_query.str_queryListParentDisabled=str_queryList;
              } 
              fn_getDataQueryListParentDisabled(){
                return this.obj_holder.obj_query.str_queryListParentDisabled;
              }               

              fn_setPublishPin(bln_value){                                                    
                this.obj_holder.obj_query.bln_publishPin=bln_value;                  
              }                                                
              fn_getPublishPin(){                                  
                return this.obj_holder.obj_query.bln_publishPin;
              }                               
              fn_setMarkedParentSchemaName(str_value){
                this.obj_holder.obj_query.str_markedParentSchemaName=str_value;                                    
            }
              fn_setMarkedParentTableName(str_value){
                  this.obj_holder.obj_query.str_markedParentTableName=str_value;                                    
              }
              fn_setMarkedParentRowzId(int_value){
                this.obj_holder.obj_query.str_markedParentRowzId=int_value;                                    
              }              
              fn_setMarkedParentViewId(int_value){
                this.obj_holder.obj_query.str_markedParentViewId=int_value;                                    
              }                
              fn_setSelectMinimalFieldPin(bln_value){                                                    
                this.obj_holder.obj_query.bln_selectMinimalFieldPin=bln_value;                  
              }                                                
              fn_getSelectMinimalFieldPin(){                                  
                return this.obj_holder.obj_query.bln_selectMinimalFieldPin;
              }                 
              //----------------------------------------
              //SIGNPOST 8. obj_dataView fn_getDataQuery
              //----------------------------------------
              fn_getDataCountQuery(bln_runSearch=false){

                /*
                let str_queryList=this.fn_getDataQueryList();                                    
                let str_queryListDisabled=this.fn_getDataQueryListDisabled();
                let str_queryListParent=this.fn_getDataQueryListParent();                  
                let str_queryListParentDisabled=this.fn_getDataQueryListParentDisabled();
                this.fn_debugText("fn_runCountQuery str_queryList: " + str_queryList);
                this.fn_debugText("fn_runCountQuery str_queryListDisabled: " + str_queryListDisabled);
                this.fn_debugText("fn_runCountQuery str_queryListParent: " + str_queryListParent);
                this.fn_debugText("fn_runCountQuery str_queryListParentDisabled: " + str_queryListParentDisabled);
                //*/
                
                let obj_menuButton=this.obj_paramRS.obj_menuButton;

                let obj_ini=this.obj_holder.obj_query;                                          
                obj_ini.str_action="getDataCountQuery";                                                   
                obj_ini.bln_runSearch=bln_runSearch;
                obj_ini.bln_simpleSearch=obj_menuButton.bln_simpleSearch;
                obj_ini.bln_advancedSearch=obj_menuButton.bln_advancedSearch;
                this.fn_runServerAction(obj_ini);                                                      
              }                
              getDataCountQuery(obj_post){                    
                
                this.obj_post=obj_post;                            
                //console.log(this.obj_post);
                let obj_menuButton=this.obj_paramRS.obj_menuButton;                  
                obj_menuButton.fn_onCountStart(this.obj_post);
              }  
              
              fn_getChildRowz(bln_runSearch=false){

                let obj_menuButton=this.obj_paramRS.obj_menuButton;  
                this.fn_setDebugPin(obj_menuButton.fn_getDebugPin()); 
                this.fn_setPublishPin(obj_menuButton.fn_getPublishPin());                  
                this.fn_setMarkedParentSchemaName(obj_menuButton.fn_getMarkedParentSchemaName());                  
                this.fn_setMarkedParentTableName(obj_menuButton.fn_getMarkedParentTableName());                  
                this.fn_setMarkedParentRowzId(obj_menuButton.fn_getMarkedParentRowzId());                                  
                this.fn_setMarkedParentViewId(obj_menuButton.fn_getMarkedParentViewId());   
                
                

                /*
                let str_queryList, str_queryListDisabled, str_queryListParent, str_queryListParentDisabled;                  
                str_queryList=this.fn_getDataQueryList();                                    
                str_queryListDisabled=this.fn_getDataQueryListDisabled();
                str_queryListParent=this.fn_getDataQueryListParent();                  
                str_queryListParentDisabled=this.fn_getDataQueryListParentDisabled();
                this.fn_debugText("str_queryList: " + str_queryList);
                this.fn_debugText("str_queryListDisabled: " + str_queryListDisabled);
                this.fn_debugText("str_queryListParent: " + str_queryListParent);
                this.fn_debugText("str_queryListParentDisabled: " + str_queryListParentDisabled);
                //*/

                
                
                let obj_ini=this.obj_holder.obj_query;                                          
                obj_ini.str_action="getChildRowz";
                obj_ini.bln_runSearch=bln_runSearch;
                obj_ini.bln_simpleSearch=obj_menuButton.bln_simpleSearch;
                obj_ini.bln_advancedSearch=obj_menuButton.bln_advancedSearch;
                this.fn_runServerAction(obj_ini);
              }

              getChildRowz(obj_post){                    
                
                this.obj_post=obj_post;                            
                //console.log(this.obj_post);
                this.fn_onDataStart();                                                                  
                this.fn_computeRows();
                this.fn_onDataEnd(obj_post);                       
              }


              fn_getDataQuery(bln_runSearch=false){                                                       

                let obj_menuButton=this.obj_paramRS.obj_menuButton;  
                this.fn_setDebugPin(obj_menuButton.fn_getDebugPin());
                this.fn_setPublishPin(obj_menuButton.fn_getPublishPin());
                this.fn_setMarkedParentSchemaName(obj_menuButton.fn_getMarkedParentSchemaName());                  
                this.fn_setMarkedParentTableName(obj_menuButton.fn_getMarkedParentTableName());                  
                this.fn_setMarkedParentRowzId(obj_menuButton.fn_getMarkedParentRowzId());                                  
                this.fn_setMarkedParentViewId(obj_menuButton.fn_getMarkedParentViewId());   
                

                                                

                let obj_ini=this.obj_holder.obj_query;                                          
                obj_ini.str_action="getDataQuery";
                obj_ini.bln_runSearch=bln_runSearch;
                obj_ini.bln_simpleSearch=obj_menuButton.bln_simpleSearch;
                obj_ini.bln_advancedSearch=obj_menuButton.bln_advancedSearch;
                this.fn_runServerAction(obj_ini);                                                                        
              } 
              
              getDataQuery(obj_post){                    
                
                this.obj_post=obj_post;                            
                //console.log(this.obj_post);
                this.fn_onDataStart();                                                                  
                this.fn_computeRows();
                this.fn_onDataEnd(obj_post);                       
              }                  

              fn_onDataStart(){
                
                
                this.obj_paramRS.arr_metaColumn=this.obj_post.MetaColumn;                                                      
                
                this.fn_getMenuPinColumn();                  
                
                let obj_menuButton=this.obj_paramRS.obj_menuButton;                  
                
                
                obj_menuButton.fn_resetContent();                                                    
                
                obj_menuButton.fn_onDataStart(this.obj_post);
                
                
              }                          
              fn_onDataEnd(obj_post){ 
                
                //this.fn_iniTotalRow(true);//post process - not operaitonal

                let obj_menuButton=this.obj_paramRS.obj_menuButton;                  
                obj_menuButton.fn_onDataEnd(obj_post);
              }                                     

              fn_onRecordSetDataView(){                                  
                this.obj_paramRS.arr_rows=[];                      
                if(!this.obj_paramRS.arr_metaColumn){return;}
                if(!this.obj_paramRS.arr_metaColumn.length){return false;}
                
                //this.fn_describeMetaColumns();


                this.fn_iniDataView();

                this.fn_iniTotalRow();
              }
              
              fn_iniDataView(){}//overidden, but called                

        
              
              //*
              fn_iniTotalRow(){ //overidden, but called
                
                let int_totalRowCount=this.obj_post.RowCount;                  
                if(!int_totalRowCount){int_totalRowCount=0;}
                this.obj_paramRS.int_totalRowCount=int_totalRowCount;                  

                let int_totalRowReturned=this.obj_post.RowData.length;
                if(!int_totalRowReturned){int_totalRowReturned=0;}
                this.obj_paramRS.int_totalRowReturned=int_totalRowReturned;                                                
                
                let arr_metaColumn=this.obj_paramRS.arr_metaColumn;
                if(obj_shared.fn_isObjectEmpty(arr_metaColumn[0])){arr_metaColumn=[];}                                    
                this.obj_paramRS.arr_metaColumn=arr_metaColumn;                
                this.obj_paramRS.int_totalColumn=arr_metaColumn.length;

                switch(this.obj_paramRS.int_totalRowReturned){
                  case (0)://no row found
                    this.obj_paramRS.bln_NoRowFound=true;                                                          
                  break;
                  case (1)://single row found
                    this.obj_paramRS.bln_singleRowFound=true;                                                      
                  break;                    
                  default:
                    if(this.obj_paramRS.int_totalRowReturned>1){//many rows                  
                      this.obj_paramRS.bln_hasMultipleRow=true;                                        
                    }
                }                                    
              } 
              //*/               

              
              fn_computeRows(){ 

                if(!this.fn_getComputeRows()){return;}    
                
                this.fn_removeChildren();                                                                      
                this.fn_onRecordSetDataView();
                
                if(this.obj_paramRS.bln_NoRowFound){                                    
                  return;
                }

                //should align with this.obj_paramRS.int_totalRowReturned

                let arr_row=this.obj_post.RowData;
                //console.log(arr_row)
                const int_rowLength=arr_row.length;                  
                for(var i=0;i<arr_row.length;i++){                            
                  //cannot add any properties to obj_ROW as they will be considered part of the record set name/value pairs
                  this.obj_paramRS.obj_ROW=this.obj_post.RowData[i];
                  //console.log(this.obj_paramRS.obj_ROW);
                  
                  this.obj_paramRS.int_ordinalPosition=i;                  
                  if(i===int_rowLength-1){
                    this.obj_paramRS.bln_lastRow=true;
                  }                    

                  this.fn_onComputeRowStart();                    

                  
                  this.fn_computeRow();      
                  
                  this.fn_onComputeRowEnd();              
                  this.obj_paramRS.int_countRow++;
                }

                
              }                                
              
              fn_computeRow(){//overidden, not called
                
                //RowData Can contain a single empty object                                  
                if(obj_shared.fn_isObjectEmpty(this.obj_paramRS.obj_ROW)){ return;}                
                
                let bln_addRow=this.fn_addRow();
                
                if(bln_addRow){
                  this.fn_onComputeRow();                  
                }
                
                
              }

              fn_getRow(int_num){                  
                return this.obj_paramRS.arr_rows[int_num];
              }

              fn_getPermissionAddRow(obj_row){
                
                const obj_metaDataRow=obj_row.obj_paramRow.obj_metaData;

                if(obj_shared.fn_isEmptyObject(obj_metaDataRow)){
                  return true;
                }          
                
                const obj_permit=obj_permitManger.fn_compare(obj_metaDataRow, obj_userHome);
                if(!obj_permit){
                  return true;
                }
                let bln_hiddenPin=obj_permitManger.fn_getHiddenPin(obj_permit);                                         
                if(bln_hiddenPin){                    
                  return false;
                }                  
                return true;                
              }

              fn_addRow(){                  
                let obj_row=this.obj_paramRS.obj_row=this.fn_addContextItem(this.str_defaultTypeRow);                  
                if(!obj_row){                    
                  return false;
                }                                 
                
                
                obj_row.fn_initializeRow(this.obj_paramRS);                       
                let bln_addRow=this.fn_getPermissionAddRow(obj_row);                                
                if(bln_addRow){
                  this.obj_paramRS.arr_rows.push(obj_row);                  
                  obj_row.fn_computeColumns();                                                                              
                  
                  if(this.obj_post.MetaKeySchemaName==="meta_column" && this.obj_post.MetaKeyTableName==="meta_column"){                  
                      obj_row.fn_settingsColumnInterfaceLockedPin("mycol_");                                                               
                  }
                  
                  if(this.obj_post.MetaKeySchemaName==="meta_rowz" && this.obj_post.MetaKeyTableName==="meta_rowz"){                  
                    //console.log(this.obj_post);
                    obj_row.fn_settingsColumnInterfaceLockedPin("mybox_");                                                               
                  }
                  
                  
                }
                
                return bln_addRow;                                  
              }
              
              fn_onComputeRow(){}                              
              fn_onComputeRowStart(){}                              
              fn_onComputeRowEnd(){} 

              fn_onComputeRow(){                                                   
              }                  
              
              fn_setModeExecuteView(){
                
                super.fn_setModeExecuteView();
                
                if(!this.obj_paramRS){return;}
                if(!this.obj_paramRS.arr_rows){return;}
                let arr_rows=this.obj_paramRS.arr_rows;
              
                const int_rowLength=arr_rows.length;                  
                for(var i=0;i<int_rowLength;i++){                                          
                  let obj_row=arr_rows[i];                                                     
                  obj_row.obj_selectedColumn=false;
                  obj_row.fn_setModeExecuteView();
                  
                }

              }


              
              
              //START Meta Column Function
              /////////////////////////
              /////////////////////////
              /////////////////////////  
              fn_getMetaView(){
                return this.obj_paramRS.obj_metaView;
              }
              fn_setMetaColumnValue(int_num, str_value){
                let obj_metaColumn=this.fn_getMetaColumnViaOrdinalPosition(int_num);//the column meta is used as a base for the ui column                                    
                if(!obj_metaColumn){return;}
                obj_metaColumn.str_value=str_value;
                this.obj_paramRS.obj_ROW[obj_metaColumn.str_name]=str_value;                                      
                return obj_metaColumn;
              }
              
              fn_getMetaColumn(int_num){
                
                let obj_metaColumn=this.fn_getMetaColumnViaOrdinalPosition(int_num);//the column meta is used as a base for the ui column                                                                             
                obj_metaColumn.str_name=this.fn_getPDOMetaValue(obj_metaColumn, "name");
                if(this.obj_paramRS.obj_ROW){
                  obj_metaColumn.str_value=this.obj_paramRS.obj_ROW[obj_metaColumn.str_name];                    
                }                  
                obj_metaColumn.int_ordinalPosition=int_num;                  
                obj_metaColumn.PrimaryPin=obj_shared.fn_parseBool(obj_metaColumn.PrimaryPin);
                return obj_metaColumn;
              }                

              xfn_describeMetaColumns(){                  
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn;i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                        
                  console.log("["+ i + "]: " + obj_metaColumn.str_name.toLowerCase());                    
                }
              }

              fn_describeMetaColumns(){                  
                if(!this.obj_paramRS){return;}
                let arr=this.obj_paramRS.arr_metaColumn;
                for (let i = 0; i < arr.length; i++) {                        
                  let obj_metaColumn=arr[i];
                  console.log("["+ i + "]: " + obj_metaColumn.str_name + " MenuPin: " + obj_metaColumn.MenuPin);                    
                }
              }

              fn_getMenuPinColumn(){                  
                let arr=this.obj_paramRS.arr_metaColumn;                  
                this.obj_paramRS.arr_menuPinColumn=[];
                this.obj_paramRS.arr_infoPinColumn=[];
                for (let i = 0; i < arr.length; i++) {                        
                  let obj_metaColumn=arr[i];
                  
                  if(obj_metaColumn.MenuPin){                      
                    this.obj_paramRS.arr_menuPinColumn.push(obj_metaColumn);
                  }
                  if(obj_metaColumn.InfoPin){
                    this.obj_paramRS.arr_infoPinColumn.push(obj_metaColumn);
                  }                    
                }                  
              }

              
              
              fn_getMetaColumnViaName(str_name){


                
                let str_lname=str_name.toLowerCase();
                let int_totalColumn=this.obj_paramRS.int_totalColumn;                  
                
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                        
                  if(obj_metaColumn.str_name.toLowerCase()===str_lname){
                    return obj_metaColumn;
                  }
                }
              }
              fn_getMetaColumnViaOrdinalPosition(int_num){
                if(!this.obj_paramRS.arr_metaColumn){return;}
                return this.obj_paramRS.arr_metaColumn[int_num];
              }                
              fn_getPDOMetaValue(obj_metaColumn, str_search){                  
                let arr=obj_metaColumn.arr_metaColumnPDO;
                if(!arr){//can be empty object meta column, need to trap before this
                  return;
                }
                return arr[str_search];        
              }
              fn_getMetaFlag(obj_metaColumn, str_search){                  
                //console.log(obj_metaColumn);                  
                let arr=obj_metaColumn.arr_metaColumnPDO;                  
                //console.log("obj_metaColumn.arr_metaColumnPDO follows");                  
                //console.log(arr);                  
                let arrFlag=arr["flags"];                                    
                return obj_shared.fn_inArray(str_search, arrFlag);
              }
              fn_getMetaColumnViaMetaName(MetaSchemaName, MetaTableName, MetaColumnName){
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                      
                  if(obj_metaColumn.MetaSchemaName!==MetaSchemaName){continue;}
                  if(obj_metaColumn.MetaTableName!==MetaTableName){continue;}
                  if(obj_metaColumn.MetaColumnName!==MetaColumnName){continue;}
                  return obj_metaColumn;
                }
                return false;
              }    
              fn_getMetaColumnViaMetaShortName(MetaSchemaName, MetaTableName, MetaColumnAPIName){
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  if(obj_metaColumn.MetaSchemaName!==MetaSchemaName){continue;}
                  if(obj_metaColumn.MetaTableName!==MetaTableName){continue;}
                  if(obj_metaColumn.MetaColumnAPIName!==MetaColumnAPIName){continue;}
                  return obj_metaColumn;
                }
                return false;
              }    
              
              
              fn_getMetaColumnViaFieldName(str_name){//should be deprecated in favour of fn_getMetaColumnViaMetaName, which includes schemaane                  

                let str_lname=str_name.toLowerCase();
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  let str_lnameField=obj_metaColumn.MetaColumnName.toLowerCase();                                        
                  if(str_lnameField===str_lname){
                    return obj_metaColumn;
                  }
                }
              }    
              fn_getMetaColumnViaFieldShortName(str_shortname){//should be deprecated in favour of fn_getMetaColumnViaMetaName, which includes schemaane                  

                let str_lshortname=str_shortname.toLowerCase();
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  let str_lshortnameField=obj_metaColumn.MetaColumnAPIName.toLowerCase();                                        
                  if(str_lshortnameField===str_lshortname){
                    return obj_metaColumn;
                  }
                }
              }    
              
              fn_onComputeColumn(){}

              fn_getMetaColumnPrimaryKey(obj_metaColumnTemplate){                  

                //console.log("obj_metaColumnTemplate follows");
                //console.log(obj_metaColumnTemplate);

                let obj_metaColumn=obj_metaColumnTemplate;

                if(obj_metaColumn.PrimaryPin){//MARKED IN DFATABASE, SET ON AUTOFORM                                                                               
                  return obj_metaColumn;
                }

                //if(this.fn_getMetaFlag(obj_metaColumn, "primary_key")){//AUTO GENERATED NOT IDEAL AFFECTED BY ORDER BY                                                                                  
                  //return obj_metaColumn;
                //}
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                                            
                  if(!obj_metaColumn){continue;}                                          

                  if(obj_metaColumn.MetaSchemaName!==obj_metaColumnTemplate.MetaSchemaName){continue;}                      
                  if(obj_metaColumn.MetaTableName!==obj_metaColumnTemplate.MetaTableName){continue;}                      

                  if(obj_metaColumn===obj_metaColumnTemplate){                      
                    continue;
                  }                      
                  if(obj_metaColumn.PrimaryPin){//MARKED IN DFATABASE, SET ON AUTOFORM
                    return obj_metaColumn;
                  }

                  //if(this.fn_getMetaFlag(obj_metaColumn, "primary_key")){//AUTO GENERATED NOT IKDEAL AFFECTED BY ORDER BY                  
                   // return obj_metaColumn;
                  //}
                }
                return false;
              }                
              
              


              /////////////////////////
              /////////////////////////
              /////////////////////////
              //END Meta Column Function
              
            }//END CLS
            //END TAG
            //END component/xapp_data
/*type: xapp_data//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_dataform//*/

            //XSTART component/xapp_dataform
              class xapp_dataform extends xapp_data{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                          

                  this.str_defaultTypeRow="xapp_rowform";
                  this.str_defaultTypeColumn="xapp_columnform";                  
                  this.fn_initialize_var();
                }

                fn_initializeRS(obj_menuButton){                                  

                  super.fn_initializeRS(obj_menuButton);
                  
                  this.fn_setAutoJoin(false);                      
                }

                fn_onDataStart(){                  
                  super.fn_onDataStart();
                  let obj_menuButton=this.obj_paramRS.obj_menuButton;  
                }

                fn_iniDataView(){
                  super.fn_iniDataView();

                  let bln_value=this.fn_getQueryModeNewRecord();
                  if(bln_value){                                    
                    //1 row full of qualifiedname emptyvalue pairs                  

                    this.obj_post.RowData=[];
                    this.obj_post.RowData[0]={};
                    let obj_ROW=this.obj_post.RowData[0];                                          
                    let obj_meta;
                    let arr_metaColumn=this.obj_paramRS.arr_metaColumn;
                    for(var i=0;i<arr_metaColumn.length;i++){                            
                      obj_meta=arr_metaColumn[i];                      
                      obj_ROW[obj_meta.str_nameQualified]="";                      
                    }
                  }  
                }

                fn_iniTotalRow(bln_postProcess){ 
                  super.fn_iniTotalRow(bln_postProcess);

                  switch(this.obj_paramRS.int_totalRowReturned){
                    case (0)://no row found
                      this.fn_setDisplay(false);                  
                    break;
                    case (1)://single row found                                     
                      this.obj_paramRS.bln_showFieldHeading=true;                               
                      this.obj_paramRS.bln_autoSection=true;//one section                                    
                      this.obj_paramRS.bln_axis=false;//flex column
                      this.fn_setAxis(this.obj_paramRS.bln_axis);
                    break;
                    default:
                      if(this.obj_paramRS.int_totalRowReturned>1){//many rows                                    
                        this.obj_paramRS.bln_showFieldHeading=false;                               
                        this.obj_paramRS.bln_autoSection=false;//one section                                    
                        this.obj_paramRS.bln_axis=false;//flex row
                        this.fn_setAxis(this.obj_paramRS.bln_axis);
                      }
                  }                                    
                }

                fn_getPermissionAddRow(obj_row){

                  if(this.fn_getQueryModeNewRecord()){                    
                    let obj_permitParam=obj_row.obj_paramRow.obj_metaData;                                                 
                    obj_permitParam.MetaPermissionTag="100";                    
                  }
                  
                  return super.fn_getPermissionAddRow(obj_row);
                }
                
                fn_runPushColumn(obj_column){                     
                  //console.log("fn_runPushColumn");                  

                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="runPushColumn";                  
                  
                  //console.log("send MetaKeyColumnValue: " + obj_ini.str_metaKeyColumnValue);

                  obj_ini.str_nameFolderServer=this.obj_holder.obj_query.str_nameFolderServer;                     
                  
                  
                  this.fn_runServerAction(obj_ini);
                } 
                fn_resetAutoJoin(){
                  this.fn_debugText("fn_resetAutoJoin");
                  this.fn_setAutoJoin(false);
                  this.fn_setAutoJoinToSource("");                  
                  this.fn_setAutoJoinToKeyValue("");                  
                  this.fn_setAutoJoinToKeyName("");                  
                  this.fn_setAutoJoinFromKeyValue("");                  
                  this.fn_setAutoJoinFromKeyName("");                  
                  this.fn_setLinkOffPin(false);
                  this.fn_setLinkOnPin(false);                  
                }
                fn_setAutoJoin(bln_value){
                  this.fn_setAutoJoinPin(bln_value);
                  this.fn_setAutoJoinFilterPin(bln_value);                                    
                }
                fn_setAutoJoinPin(bln_value){                                  
                  this.obj_holder.obj_query.bln_autoJoinPin=bln_value;                  
                }     
                fn_setAutoJoinFilterPin(bln_value){                              
                  this.obj_holder.obj_query.bln_autoJoinFilterPin=bln_value;                  
                }     
                fn_setAutoJoinToSource(str_value){                                                    
                  this.obj_holder.obj_query.str_autoJoinToSource=str_value;
                }     
                fn_setAutoJoinToKeyValue(str_value){                                                    
                  this.obj_holder.obj_query.str_autoJoinToKeyValue=str_value;                  
                }                                     
                fn_setAutoJoinToKeyName(str_value){                  
                  this.obj_holder.obj_query.str_autoJoinToKeyName=str_value;                  
                }     
                
                fn_setAutoJoinFromKeyValue(str_value){
                  this.obj_holder.obj_query.str_autoJoinFromKeyValue=str_value;
                }
                fn_setAutoJoinFromKeyName(str_value){                  
                  this.obj_holder.obj_query.str_autoJoinFromKeyName=str_value;                  
                }
                fn_setLinkOffPin(bln_value){                                                    
                  this.obj_holder.obj_query.bln_linkOffPin=bln_value;
                }
                fn_setLinkOnPin(bln_value){                                                    
                  this.obj_holder.obj_query.bln_linkOnPin=bln_value;
                }               
                
                
                runPushColumn(obj_post){  
                  this.obj_post=obj_post;
                  this.fn_receiveColumn(obj_post);
                }
                
                fn_receiveColumn(obj_post){      
                  
                  //reset to original id                
                  this.obj_holder.obj_query.int_idMetaView=this.obj_paramRS.obj_menuButton.fn_getMetaViewId();                
                  //reset to original id

                  //to do check wether the form has not been altered by another user action in the meantime                  
                  if(!this.obj_paramRS.arr_rows){return;}                  

                  //currently not used , but remains as template for row-wide event handle
                  //this.fn_setModeUnLocked();                    
                  
                  let obj_metaColumn=this.fn_setMetaColumnValue(this.obj_post.MetaColumnPosition, this.obj_post.MetaColumnValue);
                  if(!obj_metaColumn){
                    console.log("Error: DataForm- Column Not found. fn_receiveColumn.");
                    return;
                  } 

                  //console.log("obj_metaColumn.str_name: " + obj_metaColumn.str_name);                 

                  if(obj_post.ModeNewRecord){
                    this.fn_setQueryModeNewRecord(false);//turn off new record mode
                    this.fn_onNewRecordUpdateMetaKey(obj_post);
                    this.fn_onNewRecordUpdateDataKey(obj_post);                    
                  }                

                  this.obj_paramRS.obj_row.fn_removeThemeError();                                    
                  
                  if(obj_post.Response && obj_post.Response.column_required){                                               
                    let obj_columnRequired=this.obj_paramRS.obj_row.fn_getColumnViaName(obj_post.Response.column_required);                    
                    obj_columnRequired.fn_applyThemeError();
                  }                  

                  let obj_column=this.obj_paramRS.obj_row.fn_getColumnViaName(obj_metaColumn.str_name);                                      
                  obj_column.fn_receiveColumn();
                  
                  this.obj_paramRS.obj_menuButton.fn_receiveColumn(this, obj_column, obj_post);
                  /*
                  if(this.obj_paramRS.obj_menuButton.bln_dynamicMenu){//menuButton is generated from dataset
                    if(obj_metaColumn.MenuPin){
                      this.obj_paramRS.obj_menuButton.fn_updateButtonText(this);                    
                    }
                  } 
                    //*/            
                }

                fn_onNewRecordUpdateMetaKey(obj_post){

                  let obj_metaColumnKey
                  obj_metaColumnKey=this.fn_getMetaColumnViaMetaName(obj_post.MetaKeySchemaName, obj_post.MetaKeyTableName, obj_post.MetaKeyColumnName);
                  if(!obj_metaColumnKey){
                    alert("1 fn_onNewRecordUpdateMetaKey obj_metaColumnKey is false");
                    return;};
                  obj_metaColumnKey.str_value=obj_post.MetaKeyColumnValue;  

                  let obj_columnKey=this.obj_paramRS.obj_row.fn_getColumnViaPosition(obj_metaColumnKey.int_ordinalPosition);                                                                                                            
                  obj_columnKey.fn_setValue(obj_metaColumnKey.str_value);                                    
                  obj_columnKey.fn_setText(obj_metaColumnKey.str_value);                                    
                  

                  //console.log(obj_columnKey);                  
                  //obj_columnKey.fn_debug();
                  
                  

                  this.fn_onNewRecordPushDefaultValueColumns();

                  let obj_menuButton=this.obj_paramRS.obj_menuButton;
                  obj_menuButton.fn_onNewRecordUpdateMetaKey(obj_columnKey);

                }
                fn_onNewRecordUpdateDataKey(obj_post){

                  let obj_metaColumnKey;
                  obj_metaColumnKey=this.fn_getMetaColumnViaMetaName("meta_data", "meta_data", "MetaDataId");
                  if(!obj_metaColumnKey){
                    alert("2 fn_onNewRecordUpdateDataKey obj_metaColumnKey is false");
                    return;};
                  obj_metaColumnKey.str_value=obj_post.DataKeyColumnValue;                                      

                  let obj_columnKey=this.obj_paramRS.obj_row.fn_getColumnViaPosition(obj_metaColumnKey.int_ordinalPosition);
                  obj_columnKey.fn_setValue(obj_metaColumnKey.str_value);                                    
                  obj_columnKey.fn_setText(obj_metaColumnKey.str_value);                                    
                  
                  this.fn_onNewRecordPushDefaultValueColumns(true);
                }

                
                fn_onNewRecordPushDefaultValueColumns(bln_isData=false){

                  let obj_row, obj_column;
                  obj_row=this.obj_paramRS.arr_rows[0];
                  if(obj_row){
                    obj_row.fn_onNewRecordPushDefaultValueColumns(bln_isData);                                    
                  }
                  return false;
                }

                fn_setMetaColumnKey(obj_column){                  
                  
                  if(!obj_column.fn_getMetaColumnKey() || this.fn_getQueryModeNewRecord()){
                    let obj_metaColumnTemplate=obj_column.obj_metaColumn;
                    let obj_metaColumnKey=this.fn_getMetaColumnPrimaryKey(obj_metaColumnTemplate);                                                                          
                    obj_column.fn_setMetaColumnKey(obj_metaColumnKey);
                  }
                }

                
                fn_getColumnViaRowColumnPosition(int_rowPosition, int_columnPosition){

                  let obj_row, obj_column;
                  obj_row=this.obj_paramRS.arr_rows[int_rowPosition];
                  if(obj_row){
                    obj_column=obj_row.fn_getColumnViaPosition(int_columnPosition);                  
                    if(obj_column){
                      return obj_column;
                    }
                  }
                  return false;
                }                

                fn_archiveRecord(obj_columnKey){   

                  let int_columnKey=obj_columnKey.fn_getColumnValue();
                  this.obj_holder.obj_query.str_metaKeyColumnValue=int_columnKey;
                  this.fn_runArchiveRecord();
                }

                fn_runArchiveRecord(){                                       
                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="runArchiveRecord";                                                              
                  this.fn_runServerAction(obj_ini);
                }
                runDeleteRow(){                                      
                  this.obj_paramRS.obj_menuButton.fn_onDeleteDynamicRow();//should be a dynamic menu                                    
                } 
                runArchiveRecord(){
                  //console.log("runArchiveRecord");
                  this.obj_paramRS.obj_menuButton.fn_onArchiveRecord();//should be a dynamic menu                                    
                } 
                

                
                fn_pushColumn(obj_column){                             
                  //console.log("data fn_pushColumn");

                  //currently not used , but remains as template for row-wide event handle
                  //this.fn_setModeLocked();                  
                  
                  //used to update or insert or delete record                                    
                  let bln_value=this.fn_formatColumnQuery(obj_column);                  
                  if(!bln_value){return;}
                  
                  this.fn_runPushColumn(obj_column);
                } 

                fn_formatColumnQuery(obj_column){

                  let obj_row, obj_columnKey, obj_metaColumn, obj_metaColumnKey;

                  let bln_formNewRecord=this.obj_holder.obj_query.bln_modeNewRecord;                                    

                  obj_metaColumn=obj_column.obj_metaColumn;

                  this.fn_setMetaColumnKey(obj_column);                  
                  obj_metaColumnKey=obj_column.fn_getMetaColumnKey();//we dont have akey for this field, so no update , (but can insert ?)                                    
                  if(!obj_metaColumnKey && !bln_formNewRecord){                    
                    //alert("!obj_metaColumnKey && !bln_formNewRecord");
                    return false;//no update
                  }             

                  obj_row=obj_column.obj_row;
                  obj_columnKey=obj_row.fn_getColumnKey(obj_column);//either the record id or  metadata id                                                            
                  if(!obj_columnKey){
                    //alert("fn_formatColumnQuery: column key is false");
                    return false;
                  }
                  
                  //console.log("obj_columnKey.str_value: " + obj_columnKey.str_value);
                  //We have potentially just changed the view from the main menu view                                    
                  this.obj_holder.obj_query.int_idMetaView=obj_metaColumn.MetaViewId;
                  //We have potentially just changed the view from the main menu view
                  //we will reset on return

                  this.obj_holder.obj_query.str_metaSchemaName=obj_metaColumn.MetaSchemaName;
                  this.obj_holder.obj_query.str_metaTableName=obj_metaColumn.MetaTableName;
                  this.obj_holder.obj_query.str_metaColumnName=obj_metaColumn.MetaColumnName;
                  this.obj_holder.obj_query.str_metaColumnAPIName=obj_metaColumn.MetaColumnAPIName;
                  this.obj_holder.obj_query.str_metaColumnValue=obj_column.fn_getColumnValue();
                  this.obj_holder.obj_query.str_metaList=obj_metaColumn.MetaList;
                  this.obj_holder.obj_query.str_metaListIdValue=obj_column.str_metaListIdValue;
                  this.obj_holder.obj_query.str_metaOption=obj_metaColumn.MetaOption;
                  
                  
                  this.obj_holder.obj_query.str_metaColumnPosition=obj_column.obj_metaColumn.int_ordinalPosition;
                  this.obj_holder.obj_query.str_metaRowPosition=obj_row.obj_paramRow.int_ordinalPosition;                  
                  this.obj_holder.obj_query.str_metaColumnId=obj_column.obj_metaColumn.MetaColumnId;

                  this.obj_holder.obj_query.str_metaKeySchemaName=obj_metaColumnKey.MetaSchemaName;
                  this.obj_holder.obj_query.str_metaKeyTableName=obj_metaColumnKey.MetaTableName;
                  this.obj_holder.obj_query.str_metaKeyColumnName=obj_metaColumnKey.MetaColumnName;
                  this.obj_holder.obj_query.str_metaKeyColumnValue=obj_columnKey.str_value;

                  //USED TO CHANGE BETWEEN SYSTEMS IN OFFICE
                  let obj_metaColumnMetaSystemId=this.fn_getMetaColumnViaMetaName("meta_data", "meta_data", "MetaDataSystemId");                                    
                  if(obj_metaColumnMetaSystemId){
                    let obj_columnDataSystemId=obj_row.fn_getColumnViaPosition(obj_metaColumnMetaSystemId.int_ordinalPosition);                                                        
                    if(obj_columnDataSystemId){
                      this.obj_holder.obj_query.str_metaDataSystemId=obj_columnDataSystemId.fn_getValue();                    
                    }
                  };                                     
                  //USED TO CHANGE BETWEEN SYSTEMS IN OFFICE

                  return true;
                }                               

                //UPDATE LIST
                fn_updateListSelect(obj_column){                     

                  let bln_value=this.fn_formatColumnQuery(obj_column);                  
                  if(!bln_value){return;}

                  this.fn_runUpdateListSelect(obj_column);
                }                

                fn_runUpdateListSelect(obj_column){                                       

                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="updateDropdownList";
                  obj_ini.str_nameFolderServer=this.obj_holder.obj_query.str_nameFolderServer;                  
                  this.fn_runServerAction(obj_ini);
                }

                updateDropdownList(obj_post){  
                  this.obj_post=obj_post;                                   
                  
                } 
                //UPDATE LIST

                //GET LIST
                fn_getListSelectFromServer(obj_column){                                       

                  let bln_value=this.fn_formatColumnQuery(obj_column);                  
                  if(!bln_value){return;}
                  
                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="getDropdownList";
                  obj_ini.str_nameFolderServer=this.obj_holder.obj_query.str_nameFolderServer;                  
                  this.fn_runServerAction(obj_ini);
                }
                getDropdownList(obj_post){  
                  this.obj_post=obj_post;                                   
                  this.fn_receiveDropdownList(obj_post);
                }                 
                fn_receiveDropdownList(obj_post){   
                  //locate column and update list
                  let obj_column=this.fn_getColumnViaRowColumnPosition(obj_post.MetaRowPosition, obj_post.MetaColumnPosition);                                                                        
                  if(!obj_column){return;}                                    
                  obj_column.fn_receiveDropdownList(obj_post);
                }
                //GET LIST

                fn_setModeExecuteNew(){
                  this.int_modeExecute=obj_holder.int_modeNew;                  
                  return false;
                }
                fn_getModeExecuteNew(){
                  if(this.int_modeExecute===obj_holder.int_modeNew){return true;}
                  return false;
                }
                fn_setModeExecuteEdit(){                                                      
                  super.fn_setModeExecuteEdit();                                 

                  let i, arr_rows, obj_row;
                  arr_rows=this.obj_paramRS.arr_rows;
                  if(!arr_rows){return;}
                  for(i=0;i<arr_rows.length;i++){
                    obj_row=arr_rows[i];
                    obj_row.fn_setModeExecuteEdit();
                  }
                }                
                
                fn_setQueryModeNewRecord(bln_value){
                  this.obj_holder.obj_query.bln_modeNewRecord=bln_value;                                                     
                  
                }                
                fn_getQueryModeNewRecord(){
                  return this.obj_holder.obj_query.bln_modeNewRecord;                  
                }                
                                 
                                               
                fn_setModeLocked(){                                    
                  //currently not used , but remains as template for row-wide event handle
                  let i, arr_rows, obj_row;
                  arr_rows=this.obj_paramRS.arr_rows;
                  for(i=0;i<arr_rows.length;i++){
                    obj_row=arr_rows[i];
                    obj_row.fn_onDataSetModeLocked();                                      
                  }                  
                }
                fn_setModeUnLocked(){  
                  //currently not used , but remains as template for row-wide event handle
                  let i, arr_rows, obj_row;
                  arr_rows=this.obj_paramRS.arr_rows;
                  if(!arr_rows){                    
                    return;
                  }
                  for(i=0;i<arr_rows.length;i++){
                    obj_row=arr_rows[i];
                    obj_row.fn_onDataSetModeUnLocked();                                      
                  }
                }
                fn_getModeLocked(){                  
                  if(this.int_modeExecute===obj_holder.int_modeLocked){
                    return true;
                  }             
                  return false;                       
                }

                xfn_cascadeFlipHeading(){        
                  this.obj_paramRS.bln_showFieldHeading=obj_shared.fn_flipBool(this.obj_paramRS.bln_showFieldHeading);
                  super.xfn_cascadeFlipHeading(this.obj_paramRS.bln_showFieldHeading);                
                }                 
                
                fn_onComputeColumn(obj_column){}
              }//END CLS
              //END TAG
              //END component/xapp_dataform
/*type: xapp_dataform//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_inputandbutton//*/

            //XSTART component/form_inputandbutton
            class form_inputandbutton extends component{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                
              }
              fn_onLoad(){                  
                super.fn_onLoad();
                this.fn_resetInput();  
              } 
              fn_resetInput(){                
                this.fn_setValue("");                  
              } 
              fn_onLinkButtonClick(e){                                       
                return this.fn_getValue();                 
              }
              fn_getValue(){                     
                let str_value=this.fn_notify(this.fn_getComponent("form_inputandbutton_input"), "fn_getValue");                  
                //console.log("str_value: " + str_value);
                return str_value;                  
              }
              fn_setValue(str_value){                     
                this.fn_notify(this.fn_getComponent("form_inputandbutton_input"), "fn_setValue", str_value);                                    
              }
              
              fn_onChildKeyDown(e){this.fn_onLinkInputKeyDown(e);}                
              fn_onLinkInputKeyDown(e){}//overidden
              
              fn_onChildMouseDown(e){this.fn_onLinkInputMouseDown(e);}                
              fn_onLinkInputMouseDown(e){}//overidden
              
              fn_onChildChange(){}                
              
            }//END CLS
            //END TAG
            //END component/form_inputandbutton
/*type: form_inputandbutton//*/
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
/*type: xapp_dashboard//*/

            //XSTART component/xapp_dashboard
              class xapp_dashboard extends xapp_component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("pink");}                  
                }
                fn_loadDashboard(){//should be overidden
                  //console.log("default load xapp_dashboard");                                           

                  let obj_menuButton=this.fn_getMenuButton();                  
                  let bln_adminPin=obj_menuButton.fn_getAdminPin();
                  if(bln_adminPin){
                    let bln_isAdminUser=obj_userHome.Admin;
                    if(!bln_isAdminUser){                                            
                      return false;
                    }                    
                  }
                  return true;                  

                  //console.log("bln_adminPin: " + bln_adminPin);
                  //console.log("bln_isAdminUser: " + bln_isAdminUser);
                  //console.log(obj_userHome);                  
                }

                

                fn_refreshDashboard(){
                  //console.log("default refresh xapp_dashboard");                  
                }

                fn_hide(){
                  
                  let obj_console;
                  obj_console=this.obj_consoleContainerDashboard;
                  if(obj_console){obj_console.fn_hide();}
                  obj_console=this.obj_consoleContainerDashboardLeft;
                  if(obj_console){obj_console.fn_hide();}

                  //will cause other consoles to be hidden so dont use
                  //let obj_menuButton=this.fn_getMenuButton();                  
                  //obj_menuButton.fn_hideMenuPanel();                                    
                  
                }
                fn_disable(){
                  let obj_menuButton=this.fn_getMenuButton();                  
                  obj_menuButton.fn_disableConsole();                                    
                }
                fn_getMetaColumn(str_fieldName){
                  let obj_menuButton=this.obj_holder.obj_parentMenu;          
                  let obj_recordset=obj_menuButton.obj_dataView;                                      
                  return obj_recordset.fn_getMetaColumnViaName(str_fieldName);                    
                }
                fn_getMetaDataValue(str_fieldName){
                  let obj_metaColumn=this.fn_getMetaColumn(str_fieldName);
                  if(obj_metaColumn){
                    return obj_metaColumn.str_value;                                  
                  }          
                }
                
                
              }//END
              //END TAG
              //END component/xapp_dashboard
/*type: xapp_dashboard//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp//*/

            //XSTART component/xapp
              class xapp extends xapp_ajax{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                          
                  
                  this.obj_design.int_radioDisplayMode=3;//Menu function Option
                  this.fn_setRadioDisplayMode();                                  
                  this.obj_design.bln_allowDelete=false;
                  this.obj_design.bln_autoFetch=false;

                  this.obj_holder.bln_debugServer=false;

                  
                  this.MetaDataViewId=101426;//meta_data
                  this.MetaDataViewName="meta_data";
          
                  this.MetaUserViewId=1;//meta_user
                  this.MetaUserViewName="meta_user";
          
                  this.MetaLinkViewId=100475;//meta_link
                  this.MetaLinkViewName="meta_link"; 

                  this.obj_themeOptions={
                    

                  };
                  
                  
                  //obj_path.fn_explainNavigateRecordURL();                  
                }           
                fn_getAllowDelete(){
                  return this.obj_design.bln_allowDelete;
                }
                fn_endAuthorize(){                        
                  obj_path.fn_navigateSubdomain("lock");
                }
                
                fn_setRadioDisplayMode(){                  
                  this.bln_togglePeersPin=false;
                  this.bln_closePeersPin=false;
                  this.bln_autoPin=false;
          
                  switch(this.obj_design.int_radioDisplayMode){                              
                    case 1:                                  
                    break;
                    case 2:            
                      this.bln_togglePeersPin=true;
                    break;
                    case 3:                     
                      this.bln_togglePeersPin=true;                       
                      this.bln_closePeersPin=true;
                    break;
                    case 10:
                      this.bln_autoPin=true;                
                    break;
                    default:            
                    break;
                  }       
                }     
                fn_setAccordionChildMenu(){        
                  let obj_container;                  
                  obj_container=this.fn_getComponent("xapp_dynamic_content");
                  if(!obj_container){
                    console.log("ERROR A: XAPP fn_setAccordionChildMenu component not found xapp_dynamic_content");
                    return;
                  }             
                  this.obj_holder.obj_accordionChildMenu=obj_container.fn_addContextItemOnce("xapp_accordion");
                  if(!this.obj_holder.obj_accordionChildMenu){
                              console.log("ERROR B: XAPP fn_setAccordionChildMenu context item not found xapp_accordion");
                  }
                  
                }            
                fn_getAccordionChildMenu(){        
                  return this.obj_holder.obj_accordionChildMenu;
                }
                fn_onAuthorizeUserStatus(){//logged in 
              
                  if(this.fn_hasContextHolderParent()){return;}                                  
                  
                  this.fn_setAccordionChildMenu();                      
                  
                  let obj_container=this.fn_getAccordionChildMenu();                              
                  
                  if(!obj_container){
                    console.log("ERROR C: fn_onAuthorizeUserStatus AccordionChildMenu is false");
                    return;
                  }                
                  
                  let obj_item=obj_container.fn_addContextItem("xapp_menu");                                  
                  if(obj_item){          
                    obj_item.obj_menuProject=this;
                    obj_item.bln_isAppRoot=true;
                    this.obj_menuButton=obj_item;
                    obj_item.fn_setText("APP ROOT");                          


                    //initial menu can be selected, either menuname or subdomain                    
                    let str_subdomain=this.obj_design.str_releaseLabel;                    
                    if(str_subdomain==="notset" ||!str_subdomain){
                      str_subdomain=this.obj_design.str_nameShort;                      
                    }
                
                    obj_item.fn_setSubdomain(str_subdomain);                                                            
                    this.fn_displayMenu(obj_item);//Set to True to display as the first menu, and to debug the first menu
                  } 
                  else{
                    console.log("ERROR: Unable to locate Context Item menu");
                  }   
                }      
                fn_displayMenu(obj_item){                  
                  
                  let bln_debug=obj_path.fn_hasQueryStringValue(window.location.search, "mode", "debug");                                    
                  obj_item.fn_setDisplay(bln_debug);    
                  obj_item.fn_setDebugPin(bln_debug);                
                  obj_item.fn_configureOptionChildMenu();                                                    
                  obj_item.fn_open();          
                } 
                
                fn_getStandardMenuByName(str_name){
                  
                  return this.obj_menuButton.fn_getMenuByName(str_name);
                }    

                
          
                
              }//END CLS
              //END TAG
              //END component/xapp
/*type: xapp//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_tablecell//*/

            //XSTART component/form_tablecell
              class form_tablecell extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);            
                }         
              fn_locateItem(str_idXDesign, str_type){
                let arr, obj_item;
                arr=this.obj_design.arr_item;
                for(let i=0;i<arr.length;i++){
                    obj_item=arr[i];     
                    
                    if(obj_item.fn_getType()===str_type){
                      if(obj_item.obj_design.str_idXDesign==str_idXDesign){
                        return obj_item;
                      }
                      if(obj_item.obj_design.str_linkId==str_idXDesign){
                        return obj_item;
                      }
                    }
                }
                return false;
              } 
              }//END CLS
              //END TAG
              //END component/form_tablecell
/*type: form_tablecell//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_inputandbutton_submit//*/

            //XSTART component/form_inputandbutton_submit
            class form_inputandbutton_submit extends form_button_rich{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);           

                this.obj_holder.bln_listenClick=true;
                this.obj_holder.bln_listenDblClick=true;

                
                this.bln_enabled=true;
              }                              
              fn_onClick(e){                                                      
                
                this.fn_notifyParent("fn_onLinkButtonClick", e);                                    
                obj_project.fn_unsetEvent();    
              }
              fn_onDblClick(e){                                                                    
                //console.log("form_inputandbutton_submit fn_onDblClick");
                
                obj_project.fn_unsetEvent();    
              }
            }//END CLS
            //END TAG
            //END component/form_inputandbutton_submit
/*type: form_inputandbutton_submit//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: authorise_end//*/
      //XSTART component/authorise_end
      class authorise_end extends xapp_ajax{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                      
          this.obj_holder.bln_debugServer=false;
        }
        fn_onLoad(){ //base object should be called
          super.fn_onLoad();     
          
          if(obj_project.fn_hasContextHolderParent()){return;}                          
      
          this.fn_endAuthorize();        
        }  
        fn_endAuthorize(){  
      
          let obj_ini=new Object;            
          obj_ini.str_action="endAuthorize";                    
          this.fn_runServerAction(obj_ini);                                          
      }       
      }//END CLS
      //END TAG
      //END component/authorise_end        
/*type: authorise_end//*/
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
/*type: block_structure//*/
      //XSTART component/block_structure
      class block_structure extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();                

          this.fn_setStyleProperty("display", "flex");
          this.fn_setStyleProperty("flex-wrap", "wrap");
          this.fn_setStyleProperty("flex", "1 1 auto");         
          
          let str_position=this.obj_design.str_position;          
          switch(str_position){
            case "start":                        
            case "end":              
              this.fn_setStyleProperty("justifyContent", str_position);              
              break;
          }          
        }
      }//END CLS
      //END TAG
      //END component/block_structure        
/*type: block_structure//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_anchor//*/
      //XSTART component/form_anchor
      class form_anchor extends component{
        constructor(obj_ini) {      
          super(obj_ini);        

          this.obj_holder.bln_listenClick=true;          
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }

        fn_onClick(e){                  

          obj_project.fn_forgetEvent(e);    
          //foregetevent                

          this.fn_parentEventBubble("Click", e);//this causes things to happen                  
          
        }         

        fn_onLoad(){
          super.fn_onLoad();
          this.obj_icon=this.fn_getComponent("form_button_icon");                              
          this.obj_span=this.fn_getComponent("form_button_span");          
        }

        fn_showIcon(str_value){
          
          if(str_value){                                                    
            this.obj_icon.fn_setText(str_value);                                  
            this.obj_icon.fn_setStyleProperty("fontWeight", "bold");                                  
            this.obj_icon.fn_setDisplay(true);          
            this.obj_icon.fn_setClassName("material-icons");                                              
          }         
          else{
            this.obj_icon.fn_setDisplay(false);            
            /*
            this.fn_showIcon("check_box");                        
            this.obj_icon.fn_setStyleProperty("color", "white");                                              
            //*/
          }

        }  
        fn_hideIcon(){
          this.obj_icon.fn_setDisplay(false);
        }

        fn_setText(str_value){
          this.obj_span.fn_setText(str_value);
      }
      }//END CLS
      //END TAG
      //END component/form_anchor        
/*type: form_anchor//*/
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
/*type: form_button_search//*/

            //XSTART component/form_button_search
              class form_button_search extends form_inputandbutton_submit{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
              }//END CLS
              //END TAG
              //END component/form_button_search
/*type: form_button_search//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_button_showhide//*/
      //XSTART component/form_showhide
      class form_button_showhide extends form_button_rich{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                

          this.obj_holder.bln_listenClick=true;
        }
        fn_onClick(e){
          
          super.fn_onClick(e);                    
          
          let obj_control=this.obj_controlTarget;
          if(obj_control){
            this.fn_toggleControl();
          }
        }
        fn_toggleControl(){

          //console.log("fn_toggleOptions");

          let obj_control=this.obj_controlTarget;         

          //obj_control.fn_debugText(obj_control.bln_open);
          
          if(obj_control.bln_open){            
            obj_control.bln_open=false;                        
            obj_control.fn_setDisplay(false);
            //obj_control.fn_debugText("closing");
          }
          else{
            obj_control.bln_open=true;                        
            obj_control.fn_setDisplay(true);
            //obj_control.fn_debugText("opening");
          }
        }
      }//END CLS
      //END TAG
      //END component/form_showhide        
/*type: form_button_showhide//*/
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
/*type: form_checkbox//*/
      //XSTART component/form_checkbox
      class form_checkbox extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);   
        }

        fn_getValue(){                    
          
            let bln_value =this.fn_getDomProperty("checked");
            bln_value=obj_shared.fn_parseBool(bln_value);                      
            //console.log("checkbox fn_getValue: " + bln_value);
            return bln_value;
        }

        fn_setValue(str_value="off"){                    
          let bln_value=obj_shared.fn_parseBool(str_value);          
          this.fn_setDomProperty("checked", bln_value);
          //console.log("checkbox fn_setValue: " + bln_value);
        }

        fn_setText(){}

        fn_onChange(e){                                        
          let bln_value=obj_shared.fn_parseBool(this.fn_getDomProperty("checked"));                                        
          //it seems we need to flip the bool , as we are getting the current value , not the new value
          bln_value=obj_shared.fn_flipBool(bln_value);                              

          if(bln_value){
            this.dom_obj.value="on"
            this.fn_setDomProperty("checked", true);
          }
          else{
            this.dom_obj.value="off"
            this.fn_setDomProperty("checked", false);          
          }          
          super.fn_onChange(e);
        }        
      }//END CLS
      //END TAG
      //END component/form_checkbox        
/*type: form_checkbox//*/
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
/*type: form_hardrule//*/
      //XSTART component/form_hardrule
      class form_hardrule extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/form_hardrule        
/*type: form_hardrule//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_icon//*/
      //XSTART component/form_icon
      class form_icon extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }      
        xfn_setDisabled(bln_value){          
        }  
      }//END CLS
      //END TAG
      //END component/form_icon        
/*type: form_icon//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_iframe//*/

            //XSTART component/form_iframe
              class form_iframe extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_navigateURL(str_url){                              
                  if(this.fn_hasContextHolderParent()){return;}
                  let obj_glass;
                  if(this["fn_getGlass"]){
                    obj_glass=this.fn_getGlass();        
                  }          
                  if(!obj_glass){return;}              
                  obj_glass.location.href=str_url;                        
                }          
                fn_getGlass(){
                  return this.dom_obj.contentWindow;
                }
              }//END CLS
              //END TAG
              //END component/form_iframe
/*type: form_iframe//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_input_login_email//*/
      //XSTART component/form_input_login_email
      class form_input_login_email extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/form_input_login_email        
/*type: form_input_login_email//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_input_login_pass//*/
      //XSTART component/form_input_login_pass
      class form_input_login_pass extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/form_input_login_pass        
/*type: form_input_login_pass//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_label//*/

            //XSTART component/form_label
              class form_label extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
                  this.obj_holder.bln_listenClick=true;
                  this.obj_holder.bln_listenMouseEnter=true;
                  this.obj_holder.bln_listenMouseLeave=true;
                  this.obj_holder.bln_listenMouseUp=true;
                  this.obj_holder.bln_listenMouseDown=true;                  
                }

                fn_onLoad(){
                  super.fn_onLoad();                  
                  
                  /*
                  this.fn_setStyleProperty('border', '1px solid rgba(255, 255, 255, 0.0)');                  
                  this.fn_setStyleProperty('borderRadius', '3px');                  
                  this.fn_setStyleProperty('margin', '3px');                  
                  this.fn_setStyleProperty('alignSelf', 'flex-start');                  
                  this.fn_setStyleProperty('cursor', 'pointer');                  
                  //*/
                  
                  //console.log("flexBasis: " + this.fn_getStyleProperty('flexBasis'));                  
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
/*type: form_nonbreakingspace//*/
      //XSTART component/form_nonbreakingspace
      class form_nonbreakingspace extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/form_nonbreakingspace        
/*type: form_nonbreakingspace//*/
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
/*type: form_panellist//*/
      //XSTART component/form_panellist
      class form_panellist extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }        

        fn_addPanel(obj_param){          
          let obj_panel=this.fn_addContextItem(obj_param.str_type);                                                                        
          obj_panel.obj_param=obj_param;          
          //obj_panel.fn_setDisplayFlex(false);
          return obj_panel;
        }
        fn_displayPanel(obj_panel){          

          let i, arr_item, obj_item;
          arr_item=this.obj_design.arr_item;
          if(!obj_panel && arr_item.length){            
            obj_panel=arr_item[0];
          }
          for(i=0;i<arr_item.length;i++){
            obj_item=arr_item[i];            
            if(obj_item===obj_panel){
              obj_item.fn_openFlex();
            }
            else{
              obj_item.fn_closeFlex();
            }
          }

        }
        fn_legendOnClick(obj_panel){                                

          //console.log("form_panellist fn_legendOnClick");

          let obj_parent=this.fn_getParentComponent();          
          this.fn_notify(obj_parent, "fn_legendOnClick", obj_panel);                                  
        }

        
      }//END CLS
      //END TAG
      //END component/form_panellist        
/*type: form_panellist//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_radio//*/
      //XSTART component/form_radio
      class form_radio extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/form_radio        
/*type: form_radio//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_section//*/

            //XSTART component/form_section
              class form_section extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                                     
                }  
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("red");}                  
                }                
              }//END CLS
              //END TAG
              //END component/form_section
/*type: form_section//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_select//*/

            //XSTART component/form_select
              class form_select extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  this.obj_holder.bln_listenClick=true;                 
                  this.obj_holder.bln_listenChange=true;                
                  this.obj_holder.bln_listenBlur=true;                                            
                }                
                fn_onClick(e){             
                  this.fn_parentEvent("Click", e);
                }                
                fn_onChange(e){                               
                  this.fn_parentEvent("Change", e);
                }
                fn_onBlur(e){                                         
                  this.fn_parentEvent("Blur", e);
                }
                fn_addOption(str_text, str_value){
                  let option = document.createElement("option");
                  option.text = str_text;
                  option.value = str_value;                  
                  this.dom_obj.add(option);                                                                     
                  return option;
                }                
              }//END CLS
              //END TAG
              //END component/form_select
/*type: form_select//*/
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
/*type: form_tab//*/
      //XSTART component/form_tab
      class form_tab extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.bln_listenFocus=true;                  
        }
        fn_onClick(e){          
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnClick(this, e);
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onFocus(e){          
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnFocus(this, e);
          
          obj_project.fn_forgetEvent(e);    
        }

      }//END CLS
      //END TAG
      //END component/form_tab        
/*type: form_tab//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_table//*/

            //XSTART component/form_table
              class form_table extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);  
                }       
                fn_addItem(obj_ini=false){
                  let obj_item;        
                  if(!obj_ini){
                    obj_ini=new Holder;
                    obj_ini.obj_design.str_type="tablerow";                   
                  }      
                  obj_item=super.fn_addItem(obj_ini);//CallSuper          
                  return obj_item;
                }
                fn_setCellStyle(str_name, str_value){
                  let arr, obj_item;
                  arr=this.obj_design.arr_item;
                  for(let i=0;i<arr.length;i++){
                      obj_item=arr[i];              
                      obj_item.fn_setCellStyle(str_name, str_value);            
                  }
                }
                fn_locateItem(str_idXDesign, str_type){
                  if(str_idXDesign===undefined){return;}
                  if(str_idXDesign===""){return;}
                  let arr, obj_item, obj_locate;
                  arr=this.obj_design.arr_item;
                  for(let i=0;i<arr.length;i++){
                      obj_item=arr[i];              
                      obj_locate=obj_item.fn_locateItem(str_idXDesign, str_type);            
                      if(obj_locate){
                        return obj_locate;
                      }
                  }
                  return false;
                }
            
            
              }//END CLS
              //END TAG
              //END component/form_table
/*type: form_table//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_tableheader//*/

            //XSTART component/form_tableheader
              class form_tableheader extends tablecell{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
              }//END CLS
              //END TAG
              //END component/form_tableheader
/*type: form_tableheader//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_tablerow//*/

            //XSTART component/form_tablerow
              class form_tablerow extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                }       
                fn_addItem(obj_ini){
                  let obj_item;  
            
                  if(obj_ini.obj_design.str_type===undefined){
                    obj_ini.obj_design.str_type="tablecell";                         
                  }
                  obj_item=super.fn_addItem(obj_ini);//CallSuper          
                  return obj_item;
                }
                fn_setCellStyle(str_name, str_value){
            
                  let arr, obj_item;
                  arr=this.obj_design.arr_item;
                  for(let i=0;i<arr.length;i++){
                      obj_item=arr[i];              
                      obj_item.fn_setStyleProperty(str_name, str_value);            
                  }
                }
                fn_locateItem(str_idXDesign, str_type){
                  let arr, obj_item, obj_locate;
                  arr=this.obj_design.arr_item;
                  for(let i=0;i<arr.length;i++){
                      obj_item=arr[i];              
                      obj_locate=obj_item.fn_locateItem(str_idXDesign, str_type);            
                      if(obj_locate){
                        return obj_locate;
                      }
                  }
                  return false;
                }
              }//END CLS
              //END TAG
              //END component/form_tablerow
/*type: form_tablerow//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_tablist//*/
      //XSTART component/form_tablist
      class form_tablist extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_addTab(obj_param){
          let obj_tab=this.fn_addContextItem("form_tab");                                                                                  
          obj_tab.fn_setText(obj_param.str_name);
          obj_tab.obj_param=obj_param;          
          return obj_tab;
        }
        
        fn_tagOnClick(obj_tab, e){
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnClick(obj_tab, e);
        }
        fn_fireFocus(obj_tab=false){
          let arr_item=this.obj_design.arr_item;          
          if(!obj_tab && arr_item.length){            
            obj_tab=arr_item[0];
          }          
          if(!obj_tab){
            //strange as this is the whole point
            return;
          }
          const e = new Event("focus");
          obj_tab.dom_obj.dispatchEvent(e);
        }
        fn_tagOnFocus(obj_tab, e){          
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnFocus(obj_tab, e);
        }
      }//END CLS
      //END TAG
      //END component/form_tablist        
/*type: form_tablist//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_tabset//*/
      //XSTART component/form_tabset
      class form_tabset extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_mapPanel=new Map();          
          this.obj_mapTab=new Map();                   

        }       
        fn_onLoad(obj_ini){
          super.fn_onLoad(obj_ini);                
          this.obj_panellist=this.fn_getComponent("form_panellist");          
          this.obj_tablist=this.fn_getComponent("form_tablist");          
          this.fn_setDisplayFlex(false);         
        }

        fn_hideInterface(){
          
          this.fn_closeFlex();
        } 
        fn_showInterface(){          

          if(!this.bln_opened){
            this.bln_opened=true;                        
            this.obj_tablist.fn_fireFocus();  
          }
          this.fn_openFlex();
        } 
        fn_toggleInterface(){

          if(!this.bln_opened){
            this.bln_opened=true;            
            this.obj_panellist.fn_displayPanel();  
          }

          this.fn_toggleDisplayFlex();
        }        

        
        fn_getTabPanel(obj_param){          
          let obj_panel;
          obj_panel=this.obj_mapPanel.get(obj_param.str_name);
          if(!obj_panel){                                                                             
            obj_panel=this.obj_panellist.fn_addPanel(obj_param);
            this.obj_mapPanel.set(obj_param.str_name, obj_panel);                       
            if(!this.bln_tabLegend){
              let obj_tab=this.obj_tablist.fn_addTab(obj_param);
              this.obj_mapTab.set(obj_param.str_name, obj_tab);                                   
            }
            
          }                    
          return obj_panel;
        }    
        fn_tagOnClick(obj_tab, e){                                
          this.fn_showTab(obj_tab);            
        }
        fn_tagOnFocus(obj_tab, e){                                
          this.fn_showTab(obj_tab);            
        }
        fn_showTab(obj_tab){
          let obj_panel=this.fn_getTabPanel(obj_tab.obj_param);          
          this.obj_panellist.fn_displayPanel(obj_panel);
          return obj_panel;
        }
        fn_legendOnClick(obj_panel){                                         
         
         let obj_panelNext=obj_shared.fn_getNextMapItem(this.obj_mapPanel, obj_panel.obj_param.str_name)
         this.obj_panellist.fn_displayPanel(obj_panelNext);
         
        }

      }//END CLS
      //END TAG
      //END component/form_tabset        
/*type: form_tabset//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_text//*/
      //XSTART component/form_text
      class form_text extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.bln_listenSelectStart=true;                                    
        }
        fn_onSelectStart(e){                                    
          obj_project.fn_calmEvent(e);
        }                
        fn_setText(str_value){
          if(str_value===""){    
            str_value="&nbsp;";//if blank will cause display issue
          } 
          super.fn_setText(str_value);       
      }
      }//END CLS
      //END TAG
      //END component/form_text        
/*type: form_text//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: form_textarea//*/
      //XSTART component/form_textarea
      class form_textarea extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                          
        }                
      }//END CLS
      //END TAG
      //END component/form_textarea        
/*type: form_textarea//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: lock//*/
      //XSTART component/lock
      class lock extends xapp{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          this.fn_onAuthorizeUserStatus();
        }
      }//END CLS
      //END TAG
      //END component/lock        
/*type: lock//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: login_dashboard//*/
//XSTART component/login_dashboard
class login_dashboard extends xapp_dashboard{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                

    this.obj_holder.bln_debugServer=true;      

    this.obj_holder.bln_listenSubmit=true;
  }

  fn_onLoad(){
    super.fn_onLoad();
    
    let obj_item;
    obj_item=obj_project.fn_getComponent("form_button_login_email");                
    obj_item.fn_setDisplay(true);                 

    obj_item=obj_project.fn_getComponent("form_button_login_pass");                
    obj_item.fn_setDisplay(false);             
  }

  fn_onSubmit(e){      
   alert(e);
    return;
    obj_project.fn_forgetEvent(e);                                    
    let obj_dashboard=obj_project.fn_locateItem("login_dashboard");
    if(obj_dashboard){                    
      obj_dashboard.fn_startAuthorize();
    }                                    
  }

  fn_formatPost(obj_ini){  

    let obj_post;
    
    obj_post=super.fn_formatPost(obj_ini);   
    
    obj_post.MetaUserEmail=obj_ini.MetaUserEmail;        
    obj_post.AuthorizeUserPass=obj_ini.AuthorizeUserPass;       
        
    return obj_post;
}  


  fn_loadDashboard(){
    if(!super.fn_loadDashboard()){return;}         

    if(obj_shared.fn_inStr("login.", location.hostname)){      
      this.fn_XDesigner_endAuthorize();//logout                    
      //console.log("login end auth");
    }
    else{
      //console.log("no login subdomain so no end auth");
    } 
    //this.fn_addContextItem("login_panel");                                    
  }   

  
  fn_XDesigner_endAuthorize(){    
    let obj_ini=new Object;         
    obj_ini.str_action="XDesigner_endAuthorize";                
    this.fn_runServerAction(obj_ini);          
  }
  
  XDesigner_endAuthorize(){    
    //console.log("Session Authorisation Cookie Removed");  
  }
  fn_onUnAuthorizeUserStatus(obj_post){    
    obj_project.fn_setVisible(true);
  }
  fn_onAuthorizeUserStatus(){    
  }
  fn_startAuthorize(){        

    let obj_item, bln_valid;
    let MetaUserEmail, AuthorizeUserPass;
    MetaUserEmail="";
    AuthorizeUserPass="";
    
    
    obj_item=obj_project.fn_getComponent("form_input_login_email");
    if(obj_item){
      MetaUserEmail=obj_item.fn_getValue();                  
      /*
      obj_item.fn_setDomProperty("autocomplete", "email");        
      obj_item.fn_setDomProperty("type", "email");    
      //*/   
    }                            
    
    obj_item=obj_project.fn_getComponent("form_input_login_pass");
    if(obj_item){
      AuthorizeUserPass=obj_item.fn_getValue();                                          
      /*
      obj_item.fn_setDomProperty("placeholder", "One Time Pass");        
      obj_item.fn_setDomProperty("inputmode", "numeric");        
      obj_item.fn_setDomProperty("pattern", "[0-9]*");        
      obj_item.fn_setDomProperty("autocomplete", "one-time-code");        
      obj_item.fn_setDomProperty("type", "text");     
      //*/   
    }                

    bln_valid=obj_shared.fn_validEmail(MetaUserEmail);    
    if(!bln_valid){      
      return false;
    }

    let bln_validAuthorizeUserEmail=this.fn_getAuthorizeUserEmail()
    if(bln_validAuthorizeUserEmail){
      if(!AuthorizeUserPass){
        return false;
      }
      if(AuthorizeUserPass.length<6){
        return false;
      }
    }  

    let obj_auth={        
      MetaUserEmail:MetaUserEmail,
      AuthorizeUserPass:AuthorizeUserPass
    };

    this.fn_setAuthorizeObject(obj_auth);    
    this.fn_getAuthorizeObject(obj_auth);
    return this.fn_XDesigner_startAuthorize(obj_auth);

  }
  fn_setAuthorizeObject(obj_post){
      
    let bln_valid;
    bln_valid=obj_shared.fn_validEmail(obj_post.MetaUserEmail);
    if(!bln_valid){obj_post.MetaUserEmail="";}
    this.fn_setAuthorizeUserEmail(obj_post.MetaUserEmail);
    
    bln_valid=false;    
    if(obj_post.AuthorizeUserPass){
      bln_valid=true;
    }
    
    
    if(!bln_valid){obj_post.AuthorizeUserPass="";}
    this.fn_setAuthorizeUserPass(obj_post.AuthorizeUserPass);    
    
    let bln_value=obj_shared.fn_parseBool(obj_post.AuthorizeUserStatus)
    this.fn_setAuthorizeUserStatus(bln_value);        
}    
  /////////////////////            
  fn_getAuthorizeUserEmail(){
    return this.obj_holder.MetaUserEmail;    
  }                
  fn_setAuthorizeUserEmail(MetaUserEmail){
    this.obj_holder.MetaUserEmail=MetaUserEmail;    
  }                  
  fn_setAuthorizeUserPass(AuthorizeUserPass){                          
    this.obj_holder.AuthorizeUserPass=AuthorizeUserPass;
  }              
  fn_setAuthorizeUserStatus(AuthorizeUserStatus){                          
    this.obj_holder.AuthorizeUserStatus=AuthorizeUserStatus;
  }              
  /////////////////////        
  fn_getAuthorizeObject(){
    return {        
      AuthorizeSessionKey:obj_shared.fn_getCookie("AuthorizeSessionKey"),
      MetaUserEmail:this.obj_holder.MetaUserEmail,
      AuthorizeUserPass:this.obj_holder.AuthorizeUserPass,
      AuthorizeUserStatus:this.obj_holder.AuthorizeUserStatus
    };
  }   
  
  fn_XDesigner_startAuthorize(obj_auth){       

    obj_auth.str_action="XDesigner_startAuthorize";                
    this.fn_runServerAction(obj_auth);          
  }
  XDesigner_startAuthorize(obj_post){    

    let bln_value;          
    let obj_item;
    
    this.fn_setAuthorizeObject(obj_post);//set values from server on client
    let obj_auth=this.fn_getAuthorizeObject();//get client values      
    
    let bln_valid=obj_shared.fn_validEmail(obj_auth.MetaUserEmail);
    if(!bln_valid){
      bln_value=this.fn_requireAuthorizeUserEmail();        
      if(!bln_value){return false;}
    }              

    obj_item=obj_project.fn_getComponent("form_input_login_email");                    
    obj_item.fn_setDisplay(false);            

    obj_item=obj_project.fn_getComponent("form_input_login_pass");                                
    obj_item.fn_setDisplay(true);             

    
    obj_item=obj_project.fn_getComponent("form_button_login_email");                
    obj_item.fn_setDisplay(false);                 

    obj_item=obj_project.fn_getComponent("form_button_login_pass");                
    obj_item.fn_setDisplay(true);             
    
    
    if(!obj_auth.AuthorizeUserPass){
      bln_value=this.fn_requireAuthorizeUserPass();        
      if(!bln_value){return false;}             
    }

    //obj_auth.AuthorizeUserStatus=true;
    console.log("obj_auth.AuthorizeUserStatus: " + obj_auth.AuthorizeUserStatus);
    if(!obj_auth.AuthorizeUserStatus){      
      return;
    }
    
    let str_returnURL=obj_shared.fn_getURLParam("returnURL");    
    if(str_returnURL){                  
      window.location.href=str_returnURL;
    }
    else{      
      obj_path.fn_navigateSubdomain("desk");
    }

    
  }  
  fn_requireAuthorizeUserEmail(){                                      
    let obj_item=obj_project.fn_getComponent("form_input_login_email");                    
    
    let MetaUserEmail;
    if(obj_item){      
      MetaUserEmail=obj_item.fn_getValue();        
    }
    
    let bln_valid=obj_shared.fn_validEmail(MetaUserEmail);      
    if(!bln_valid){              
      return false;
    }

    this.fn_setAuthorizeUserEmail(MetaUserEmail);      
    return true;
  }
  
  fn_requireAuthorizeUserPass(){
    
    let AuthorizeUserPass;                                
    let obj_item=obj_project.fn_getComponent("form_input_login_pass");                                
    if(obj_item){      
      AuthorizeUserPass=obj_item.fn_getValue();
    }
    if(!AuthorizeUserPass){              
      return false;
    }
    this.fn_setAuthorizeUserPass(AuthorizeUserPass);    
    obj_item.fn_setText("");              
    return true;
  }
}//END CLS
//END TAG
//END component/login_dashboard
/*type: login_dashboard//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: loginpanelform//*/

            //XSTART component/loginpanelform
              class loginpanelform extends form_form{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }
                fn_onSubmit(e){      
                  
                  obj_project.fn_forgetEvent(e);                                    
                  let obj_dashboard=obj_project.fn_locateItem("login_dashboard");
                  if(obj_dashboard){                    
                    obj_dashboard.fn_startAuthorize();
                  }                                    
                }
              }//END CLS
              //END TAG
              //END component/loginpanelform
/*type: loginpanelform//*/
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
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("white");}                  
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
/*type: xapp_button_general_archive_hide//*/
      //XSTART component/xapp_button_general_archive_hide
      class xapp_button_general_archive_hide extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formHideArchive();          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_general_archive_hide        
/*type: xapp_button_general_archive_hide//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_archive_show//*/
      //XSTART component/xapp_button_general_archive_show
      class xapp_button_general_archive_show extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formShowArchive();          
          
          obj_project.fn_forgetEvent(e);    
        }        
      }//END CLS
      //END TAG
      //END component/xapp_button_general_archive_show        
/*type: xapp_button_general_archive_show//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_form_down//*/
      //XSTART component/xapp_button_general_form_down
      class xapp_button_general_form_down extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formMoveDown();          
          
          obj_project.fn_forgetEvent(e);    
        }                
      }//END CLS
      //END TAG
      //END component/xapp_button_general_form_down        
/*type: xapp_button_general_form_down//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_form_gap//*/
      //XSTART component/xapp_button_general_form_gap
      class xapp_button_general_form_gap extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formGap();          
          
          obj_project.fn_forgetEvent(e);    
        }                
      }//END CLS
      //END TAG
      //END component/xapp_button_general_form_gap        
/*type: xapp_button_general_form_gap//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_form_group//*/
      //XSTART component/xapp_button_general_form_group
      class xapp_button_general_form_group extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formAddGroup();          
          
          obj_project.fn_forgetEvent(e);    
        }                
      }//END CLS
      //END TAG
      //END component/xapp_button_general_form_group        
/*type: xapp_button_general_form_group//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_form_up//*/
      //XSTART component/xapp_button_general_form_up
      class xapp_button_general_form_up extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formMoveUp();          
          
          obj_project.fn_forgetEvent(e);    
        }        
      }//END CLS
      //END TAG
      //END component/xapp_button_general_form_up        
/*type: xapp_button_general_form_up//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_row_hide//*/
      //XSTART component/xapp_button_general_row_hide
      class xapp_button_general_row_hide extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formHideRowz();          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_general_row_hide        
/*type: xapp_button_general_row_hide//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_row_show//*/
      //XSTART component/xapp_button_general_row_show
      class xapp_button_general_row_show extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formShowRowz();          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_general_row_show        
/*type: xapp_button_general_row_show//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_use_task_date//*/
      //XSTART component/xapp_button_general_use_task_date
      class xapp_button_general_use_task_date extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_general_use_task_date        
/*type: xapp_button_general_use_task_date//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_general_use_task_datetime//*/
      //XSTART component/xapp_button_general_use_task_datetime
      class xapp_button_general_use_task_datetime extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_general_use_task_datetime        
/*type: xapp_button_general_use_task_datetime//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_desktop//*/

            //XSTART component/xapp_button_navigate_desktop
              class xapp_button_navigate_desktop extends xapp_console_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  //this.obj_holder.bln_debugNavigate=true;                  
                }                
                fn_onClick(e){                                    
                  obj_path.fn_navigateSubdomain("desk");
                  obj_project.fn_forgetEvent(e);    
                }
              }//END CLS
              //END TAG
              //END component/xapp_button_navigate_desktop
/*type: xapp_button_navigate_desktop//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_lobby//*/
      //XSTART component/xapp_button_navigate_lobby
      class xapp_button_navigate_lobby extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          obj_path.fn_navigateSubdomain("www");
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_lobby        
/*type: xapp_button_navigate_lobby//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_login//*/

            //XSTART component/xapp_button_navigate_login
              class xapp_button_navigate_login extends xapp_console_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onClick(e){                                    
                                 
                  
                  obj_path.fn_navigateSubdomain("lock");                                    
                  
                  
                  obj_project.fn_forgetEvent(e);    
                }
              }//END CLS
              //END TAG
              //END component/xapp_button_navigate_login
/*type: xapp_button_navigate_login//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_mall//*/
      //XSTART component/xapp_button_navigate_mall
      class xapp_button_navigate_mall extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formNavigateMall();
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_mall        
/*type: xapp_button_navigate_mall//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_newcolumn//*/
      //XSTART component/xapp_button_navigate_newcolumn
      class xapp_button_navigate_newcolumn extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formNavigateNewColumn();
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_newcolumn        
/*type: xapp_button_navigate_newcolumn//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_newrow//*/
      //XSTART component/xapp_button_navigate_newrow
      class xapp_button_navigate_newrow extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formNavigateNewRow();
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_newrow        
/*type: xapp_button_navigate_newrow//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_navigate_office//*/
      //XSTART component/xapp_button_navigate_office
      class xapp_button_navigate_office extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }        
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formNavigateOffice();
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_office        
/*type: xapp_button_navigate_office//*/
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
/*type: xapp_button_navigate_settings//*/
      //XSTART component/xapp_button_navigate_settings
      class xapp_button_navigate_settings extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                          
          //this.bln_debugButtonSettings=true;          
        }        
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formNavigateSettings();
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_navigate_settings        
/*type: xapp_button_navigate_settings//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_button_queryterm//*/
      //XSTART component/xapp_button_queryterm
      class xapp_button_queryterm extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.bln_enabled=true;

          this.obj_holder.bln_listenMouseDown=true;                  
          this.obj_holder.bln_listenMouseUp=true;                  
        }
        fn_onMouseDown(e){                            

          this.obj_parentInterface.fn_queryTermButtonOnMouseDown(this, e);          
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onMouseUp(e){                  
          this.obj_parentInterface.fn_queryTermButtonOnMouseUp(this, e);          
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onClick(e){                  
          this.obj_parentInterface.fn_queryTermButtonOnClick(this, e);
          
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onDblClick(e){ 
          
          this.obj_parentInterface.fn_queryTermButtonOnDblClick(this, e);
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_queryterm        
/*type: xapp_button_queryterm//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_column//*/
            //XSTART component/xapp_column
              class xapp_column extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }                   
                fn_onLoad(){
                  super.fn_onLoad();
                  //this.fn_setStyleProperty("border", "10px solid orange");                                    

                  
                  
                  this.obj_themeItemHighlight=this.fn_getThemeObject("form_blockHighlight");                  
                  this.str_colorHighlight="orange";
                  if(this.obj_themeItemHighlight){
                    this.str_colorHighlight=this.obj_themeItemHighlight.fn_getStyleProperty("background");                  
                  }
                }
                
                fn_filterArray(item, thisArg) {
                  return item.startsWith(thisArg.str_tag);
                }

                fn_initializeColumn(obj_row){                                                      

                  this.debugTypeColumn="xapp_column";                  

                  this.obj_row=obj_row;                  
                  this.obj_paramRow=this.obj_row.obj_paramRow;                                    
                  this.obj_paramRS=this.obj_paramRow.obj_paramRS;                                                       

                  
                  if(this.obj_paramRS.obj_recordset.fn_getModeExecuteNew){
                    this.bln_modeNewRecord=this.obj_paramRS.obj_recordset.fn_getModeExecuteNew();                    
                  }
                  
                  this.bln_locked=false;
                  let obj_metaColumn=this.obj_metaColumn=this.obj_paramRow.obj_metaColumn;                  

                  this.str_valueInitial=obj_metaColumn.str_value;                  
                  
                  //console.log(obj_metaColumn);

                  if(obj_metaColumn.MetaList){                
                    obj_metaColumn.obj_metaList=obj_shared.fn_parseList(obj_metaColumn.MetaList);
                  }
                  let obj_metaOption=obj_shared.fn_parseList(obj_metaColumn.MetaOption);                  
                  if(obj_metaColumn.MetaOption){                      
                    
                    //META OPTION
                    for (let str_property in obj_metaOption) {//add metaoption if not existing as independent feature
                      let bln_writeOption=false;
                      
                      let str_value=obj_metaOption[str_property];
                      
                      delete obj_metaOption[str_property];//remove any miscase.
                      
                      str_property=str_property.toLowerCase();

                      obj_metaOption[str_property]=str_value;

                      switch(str_property){                                                
                        case "placeholder":
                        case "formexpand":
                        case "formposition":                        
                        case "unsigned":
                        case "decimal": 
                        case "datetimesecond":                        
                            bln_writeOption=true;
                        break;
                      }
                      
                      if(bln_writeOption){
                        obj_metaColumn[str_property]=obj_metaOption[str_property];
                        
                        if(this.obj_metaColumn.DebugPin){
                          this.fn_debugLabel(str_property + ": " + obj_metaColumn[str_property]);                    
                        }
                      }
                    }
                    //META OPTION
                  }  
                  
                  
                  
                  obj_metaColumn.DebugPin=obj_shared.fn_parseBool(obj_metaColumn.DebugPin);                                    
                  obj_metaColumn.ValidationError=false;                  
                  obj_metaColumn.LivePin=obj_shared.fn_parseBool(obj_metaColumn.LivePin);                                    
                  obj_metaColumn.HiddenPin=obj_shared.fn_parseBool(obj_metaColumn.HiddenPin);                                                                        
                  obj_metaColumn.MaxLength=obj_shared.fn_parseInt(obj_metaColumn.MaxLength);                                       
                  obj_metaColumn.RequiredPin=obj_shared.fn_parseBool(obj_metaColumn.RequiredPin);                                    
                  obj_metaColumn.PrimaryPin=obj_shared.fn_parseBool(obj_metaColumn.PrimaryPin);                                                      
                  obj_metaColumn.LockedPin=obj_shared.fn_parseBool(obj_metaColumn.LockedPin);                                    
                  obj_metaColumn.FormOrder=obj_shared.fn_parseInt(obj_metaColumn.FormOrder);
                  
                  obj_metaColumn.FormExpand=obj_shared.fn_parseBool(obj_metaColumn.formexpand);//MetaOption LCase
                  obj_metaColumn.FormPosition=obj_shared.fn_parseString(obj_metaColumn.formposition);//MetaOption LCase                                                            
                  obj_metaColumn.PlaceHolder=obj_shared.fn_parseString(obj_metaColumn.placeholder);//MetaOption LCase                                                            
                  obj_metaColumn.UnSigned=obj_shared.fn_parseInt(obj_metaColumn.unsigned);//MetaOption LCase                                          
                  obj_metaColumn.Decimal=obj_shared.fn_parseInt(obj_metaColumn.decimal);//MetaOption LCase                                                            
                  obj_metaColumn.DateTimeSecond=obj_shared.fn_parseBool(obj_metaColumn.datetimesecond);//MetaOption LCase                                                            
                                    

                  delete obj_metaColumn["formexpand"];//remove lcase
                  delete obj_metaColumn["formposition"];//remove lcase
                  delete obj_metaColumn["placeholder"];//remove lcase
                  delete obj_metaColumn["unsigned"];//remove lcase
                  delete obj_metaColumn["decimal"];//remove lcase
                  delete obj_metaColumn["datetimesecond"];//remove lcase                  

                  obj_metaColumn.DateTime=false;                  
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){
                    case "date":
                      obj_metaColumn.DateTimeSecond=false;
                      break;
                    case "datetime":
                      obj_metaColumn.DateTime=true;                      
                      obj_metaColumn.DateTimeSecond=obj_shared.fn_parseBool(obj_metaColumn.DateTimeSecond);                          
                      break;
                    case "currency":
                    case "percent":
                    case "number":                      
                      obj_metaColumn.Decimal=obj_shared.fn_parseInt(obj_metaColumn.Decimal);                                                                        
                      obj_metaColumn.UnSigned=obj_shared.fn_parseBool(obj_metaColumn.UnSigned);                                                   
                      break;   
                    case "note":
                    case "text":
                      obj_metaColumn.MaxLength=obj_shared.fn_parseInt(obj_metaColumn.MaxLength);                                            
                  }   

                  if(obj_metaColumn.DebugPin){                          
                    //this.fn_debugText("obj_metaColumn.MaxLength", obj_metaColumn.MaxLength)
                    console.log(obj_metaOption);
                    console.log(obj_metaColumn);                        
                }
                  
                  
                  
                  

                  
                  //this.bln_debugColumn=this.obj_metaColumn.DebugPin;
                  this.bln_debugColumn=false;
                  //IMPORTANT DONT SET VALUE BEFORE THIS POINT

                  
                  if(this.obj_metaColumn.DebugPin){
                    //console.log(obj_metaColumn);                    
                  }
                  if(obj_metaColumn.FormPosition){
                    this.bln_isMarked=true;                                                            
                  }
                  if(obj_metaColumn.FormExpand){
                    this.bln_isMarked=true;                                                            
                  }

                  if(obj_project.bln_isMobile){
                    obj_metaColumn.FormExpand=true;
                  }                      
                  
                  /*
                  if(obj_metaColumn.FormExpand){
                    let bln_value=true;
                    if(obj_project.bln_isMobile){
                      bln_value=true;
                    }                      
                    if(bln_value){
                      this.fn_setStyleProperty("width", "100%");                                                                  
                    } 
                  }
                  //*/

                  

                  
                  
                  
                  
                  if(obj_metaColumn.LockedPin){
                    this.fn_setLocked();                                            
                  }                           

                  if(obj_metaColumn.HiddenPin){
                    this.fn_setHiddenPin();                        
                  }                   

                  const obj_metaDataRow=JSON.parse(JSON.stringify(this.obj_paramRow.obj_metaData));                  
                  
                  let bln_debugPermit=false;
                  
                  if(this.bln_debugColumn){                    
                    //console.log("DEBUG SET FOR [" + obj_metaColumn.str_property + "]");
                    //console.log(obj_metaColumn);                    
                    //bln_debugPermit=true;
                  }
                  

                  //allows for more or less strict permissions to be applied to this object
                  
                  let obj_permit;                  
                  obj_permit=obj_permitManger.fn_compare(obj_userHome, obj_metaDataRow, "COMPARE USER TO ROW",  bln_debugPermit);                                      
                  if(obj_permit){
                    obj_permitManger.fn_applyPermit(this.obj_metaColumn, obj_permit, this.bln_modeNewRecord);                                                      
                  }                    
                  
                  //IF INDIVIDUAL ROW LEVEL PERMISSON TICKED , APPLY - TODO!)
                  /*                  
                  obj_permit=obj_permitManger.fn_compare(obj_metaDataRow, obj_userHome, "COMPARE ROW TO USER", bln_debugPermit);
                  if(obj_permit){
                    obj_permitManger.fn_applyPermit(this.obj_metaColumn, obj_permit, this.bln_modeNewRecord);                    
                  }                                      
                  //*/                  
                  
                  obj_permit=obj_permitManger.fn_compare(obj_metaColumn, obj_userHome, "COMPARE COLUMN TO USER",  bln_debugPermit);
                  if(obj_permit){
                    obj_permitManger.fn_applyPermit(this.obj_metaColumn, obj_permit, this.bln_modeNewRecord);                    
                  }   
                  
                  if(obj_metaColumn.PrimaryPin){
                    this.obj_metaColumn.LockedPin=true;
                  }                       

                  if(this.obj_metaColumn.LockedPin){
                    this.fn_setLocked();                        
                  }                                                                                                       

                  if(this.obj_metaColumn.HiddenPin){
                    this.fn_setHiddenPin();                        
                  }                                    

                  if(bln_debugPermit){                    
                    //this.fn_debugText("this.obj_metaColumn.HiddenPin: " + this.obj_metaColumn.HiddenPin);
                    //this.fn_debugText("this.obj_metaColumn.LockedPin: " + this.obj_metaColumn.LockedPin);
                    //this.fn_debug();
                  }                  

                  //END. SET VALUE
                  this.fn_setValue(obj_metaColumn.str_value);
                  
                }

                fn_settingsColumnInterfaceLockedPin(){                  
                  //only on settings meta column
                  //console.log(this.obj_metaColumn.MetaColumnName);
                  switch(this.obj_metaColumn.MetaColumnName.toLowerCase()){
                    //case("metaoption"):
                    case("metacolumntype"):
                    case("metacolumnname"):
                    
                    case("buttonconsole"):
                    case("metatyperowzdashboard"):
                    case("metatyperowzwidget"):
                    case("rowzicon"):                    
                      this.fn_setLocked();                                              
                      break;
                    default:                        
                      
                  }
                  
                }

                fn_onMarkColumn(){

                  this.bln_isMarked=false;
                  
                  if(this.obj_metaColumn.FormPosition){
                    this.fn_moveFormPosition(this.obj_metaColumn.FormPosition);
                  }
                  if(this.obj_metaColumn.FormExpand){
                    this.fn_formExpand(this.obj_metaColumn.FormExpand);
                  }
                  
                }                

                fn_formExpand(bln_value){
                  
                  if(!obj_shared.fn_isBool(bln_value)){
                    return;
                  }
                  
                  if(!bln_value){
                    return;
                  }
                  
                  let bln_formExpand=false;
                  switch(this.obj_metaColumn.MetaColumnType.toLowerCase()){                    
                    case "note":
                      bln_formExpand=true;
                      break;
                    default:
                      break;
                  }

                  if(this.obj_metaColumn.MetaList && obj_project.bln_isMobile){                  
                    bln_formExpand=true;
                  }

                  if(bln_formExpand){
                    this.fn_setStyleProperty("width", "100%");                                                                  
                  }
                  
                }
                
                fn_moveFormPosition(str_formPosition){

                  const childElement = this.dom_obj;
                  const parentElement = childElement.parentNode;
                  
                  switch(str_formPosition.toLowerCase()){
                    case "end":                      
                        parentElement.removeChild(childElement);                        
                        parentElement.appendChild(childElement);                        
                      break;
                    case "start":                      
                      parentElement.removeChild(childElement);                        
                      parentElement.insertBefore(childElement, parentElement.firstChild);
                      break;
                  }
                }
                fn_getColumnValue(){
                  return this.fn_getValue();
                }             
                fn_setColumnValue(str_value){
                  this.fn_setValue(str_value);
                }
                fn_getEditControlValue(){                                                                                           
                  return this.obj_controlEdit.fn_getValue(this);                                                      
                }
                fn_getValue(){                                                       
                  return this.str_value;//column value not control value                  
                }
                fn_setValue(str_value){//column value not control value, tho control values are set here                  

                  str_value=String(str_value);

                  if(str_value.toLowerCase()==="null"){
                    str_value="";
                  }                                    
                  if(str_value.toLowerCase()===undefined){
                    str_value="";
                  }                                                     
                  
                  this.str_value=str_value;                                    

                  this.str_valueDisplay=this.fn_formatDisplayValueFromColumn(str_value);                  
                  this.str_valueEdit=this.fn_formatEditValueFromColumn(str_value);     
                  if(this.bln_debugColumn){
                    //this.fn_debugLabel("fn_setValue this.str_valueEdit: " + this.str_valueEdit);
                    //this.fn_debug();
                  }                
                }                                
                fn_applyValueDisplay(){                  

                  let str_valueDisplay;
                  if(str_valueDisplay===undefined){
                    str_valueDisplay=this.str_valueDisplay;
                  }
                  
                  if(this.obj_control){
                    this.obj_control.fn_setValue(str_valueDisplay, this);
                    this.obj_control.fn_setText(str_valueDisplay, this);
                  }                    
                  
                  if(this.bln_debugColumn){                                        
                    /*
                    console.log("str_valueDisplay: " + str_valueDisplay);
                    this.obj_control.fn_debug();                    
                    this.fn_debug();
                    //*/
                  }
                  this.fn_updateRequiredError();
                }  
                fn_applyValueEdit(str_valueEdit){                  

                  if(str_valueEdit===undefined){
                    str_valueEdit=this.str_valueEdit;
                  }

                  
                  if(this.obj_controlEdit){
                    this.obj_controlEdit.fn_setValue(str_valueEdit, this);                  
                    this.obj_controlEdit.fn_setText(str_valueEdit, this);                                      
                  }                    
                  
                  if(this.bln_debugColumn){                    
                    /*
                    console.log("str_valueEdit: " + str_valueEdit);
                    this.obj_control.fn_debug();                    
                    this.fn_debug();
                    //*/
                  }
                  this.fn_updateRequiredError();
                }                                

                fn_updateRequiredError(){
                  let obj_metaColumn=this.obj_metaColumn;  

                  if(obj_metaColumn.RequiredPin){                    
                    if(!this.fn_getValue()){
                      this.fn_applyThemeError();                        
                    }
                    else{
                      obj_metaColumn.ValidationError=false;                                                        
                      this.fn_removeThemeError();                                          
                    }
                  }     
                }

                
                fn_setUnLocked(){                
                  if(this.bln_debugColumn){
                    this.fn_debugLabel("fn_setUnLocked");                                        
                  }
                  this.bln_locked=false;
                  if(this.obj_controlEdit){this.obj_controlEdit.fn_setDomProperty("readOnly", false);}
                }                
                fn_setLocked(){                  
                  if(this.bln_debugColumn){
                    this.fn_debugLabel("fn_setLocked");
                  }
                  
                  this.bln_locked=true;
                  if(this.obj_controlEdit){this.obj_controlEdit.fn_setDomProperty("readOnly", true);}                                    
                }
                fn_getLocked(){
                  return this.bln_locked;                  
                }
                fn_onDataSetModeLocked(){                  
                  //currently not used , but remains as template for row-wide event handle
                  this.fn_setLocked();
                }
  
                fn_onDataSetModeUnLocked(){                  
                  //currently not used , but remains as template for row-wide event handle
                  this.fn_setUnLocked();
                }                
                //////////////////////////
                //////////////////////////
                //////////////////////////
                //////////////////////////
                
                
                fn_formattMetaColumnLabel(){
                  let obj_metaColumn=this.obj_metaColumn;
                  
                  let str_label=obj_metaColumn.MetaLabel;                       
                  if(!str_label){                                        
                    str_label=obj_metaColumn.str_name;                                        
                    obj_metaColumn.MetaLabel=str_label;
                  } 
                  if(obj_metaColumn.MetaLabel==="Date" && obj_metaColumn.DateTime){
                    obj_metaColumn.MetaLabel="Date & Time";
                  }
                }                
                fn_getControlLabel(){
                  if(!this.obj_label){this.obj_label=this.obj_field.fn_getComponent("form_label");}
                }
                fn_getControlText(){                  
                  
                  if(this.obj_text){return;}
                  
                  this.obj_text=this.obj_field.fn_getComponent("form_text");                  
                
                }
                fn_setText(str_text){
                  
                  if(this.bln_debugColumn){
                    //console.log("str_text: " + str_text);
                  }
                  
                  if(this.obj_control){
                    this.obj_control.fn_setText(str_text);                  
                  }

                }
                fn_formatDisplayValueFromColumn(str_value){                                                  
                  return str_value;
                }                                  
                fn_formatEditValueFromColumn(str_value){
                  return str_value;
                }
                fn_formatColumnValueFromEdit(str_value){
                  return str_value;
                }              

                
                fn_computeField(){                                    
                  
                }                

                fn_getMenuButton(){
                  return this.obj_paramRS.obj_recordset.obj_paramRS.obj_menuButton;
                }                                                
                
                fn_setMetaColumnKey(obj_metaColumnKey){                  
                  this.obj_metaColumnKey=obj_metaColumnKey;
                }
                fn_getMetaColumnKey(){                  
                  return this.obj_metaColumnKey;
                }
                fn_getMetaColumnName(){
                  return this.obj_metaColumn.MetaColumnName;                  
                }                
                fn_getMetaColumnAPIName(){
                  return this.obj_metaColumn.MetaColumnAPIName;                  
                }                                                   
                
                fn_setControl(obj_control){    
                  
                  if(this.obj_control){                    
                    this.obj_control.fn_setDisplay(false);
                  }
                  
                  this.obj_control=obj_control; 

                  if(this.obj_control){                    
                    this.obj_control.fn_setDisplay(true);                                        
                  }
                  else{
                    console.log("error: obj_control is false");
                  }
                }                                                
                fn_hideControl(){

                  if(this.obj_control){                                      
                    this.obj_control.fn_setDisplay(false);
                    this.obj_label.fn_setDisplay(false);                    
                  }
                }

                fn_explain(){
                  console.log("Column Explain");
                  console.log("MetaColumnName: " + this.fn_getMetaColumnName());
                  console.log("MetaColumnAPIName: " + this.fn_getMetaColumnAPIName());
                  console.log("int_ordinalPosition: " + this.obj_metaColumn.int_ordinalPosition);
                  console.log("str_value: " + this.fn_getColumnValue());                                    
                  console.log("obj_metaColumnKey.MetaColumnName: " + this.fn_getMetaColumnKeyName());                                    
                  
                }                        
                fn_debugLabel(str_text, bln_debugPin=false){
                  if(bln_debugPin && !this.obj_metaColumn.DebugPin){
                    return;
                  }
                  let obj_author=this.obj_label;
                  if(!obj_author){
                    obj_author=this;
                  }                  
                  obj_author.fn_debugText(str_text);
                }      
                fn_debug(str_title){
                  super.fn_debug(str_title);
                  this.fn_debugLabel("fn_debug");
                  console.log(this.obj_metaColumn);                  
                }
              }//END CLS
              //END TAG
              //END component/xapp_column
/*type: xapp_column//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_console//*/

            //XSTART component/xapp_console
              class xapp_console extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                    
                  this.bln_debugContainer=false;
                }
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("orange");}                  
                  this.fn_highlightBorder("orange");
                }

                fn_disable(){               
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_disable");      
                  }               
                  
                  this.fn_disableBlock(this.obj_blockStart);
                  this.fn_disableBlock(this.obj_blockEnd);
                }
                fn_hide(){        
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_hide");      
                  }                                  
                  
                  this.fn_hideBlock(this.obj_blockStart);
                  this.fn_hideBlock(this.obj_blockEnd);
                }

                fn_disableBlock(obj_block){          
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_disableBlock");       
                  }                                         
                  
                  let arr_item=obj_block.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){
                    let obj_item=arr_item[i];                       
                    obj_item.fn_disable();                    
                  }
                }
                fn_hideBlock(obj_block){                  
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_hideBlock");       
                  }                                         
                  
                  let arr_item=obj_block.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){
                    let obj_item=arr_item[i];                    
                    obj_item.fn_hide();                    
                  }
                }

                fn_addConsoleContainerGeneric(bln_side){
                  return this.fn_addConsoleContainer("xapp_console_container", bln_side)
                }

                fn_addConsoleContainer(str_nameContextItem, bln_side){
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_addConsoleContainer");       
                  }                                         
                  let obj_block, obj_item;                  
                  obj_block=this.obj_blockStart;                                                                        
                  
                  if(bln_side){
                    obj_block=this.obj_blockEnd;                    
                  }

                  if(!obj_block){return;}                  
                  

                  if(bln_side){
                    obj_item=obj_block.fn_getComponent(str_nameContextItem);
                    if(!obj_item){         
                        
                        let obj_contextItem=obj_block.fn_useContextItem(str_nameContextItem);
                        if(!obj_contextItem){
                          console.log("[" + str_nameContextItem + "]: " + obj_contextItem + ", is false, check context items have been added - e.g data context form holder. compare with a working model.");
                        }
                        else{
                          //console.log("[" + str_nameContextItem + "]: " + obj_contextItem);
                        }
                        obj_contextItem.obj_design.bln_startPosition=true;                        
                        obj_contextItem.blnDebugPosition=true;
                        obj_item=obj_block.fn_addItem(obj_contextItem);        
                        obj_item=obj_block.fn_formatContextItem(obj_item);                                    
                    }            
                  }      
                  else{                    
                    obj_item=obj_block.fn_addContextItemOnce(str_nameContextItem);
                  }

                  if(obj_item){                    
                    obj_item.fn_setDisplayFlex(false);                                                            
                    obj_item.fn_hide();                    
                  }                  

                  //console.log(" obj_item [" + str_nameContextItem + "]: " + obj_item);
                  

                  return obj_item;
                }

                fn_getConsoleContainer(str_nameConsoleContainer){
                  let obj_block, obj_item;                  
                  
                  obj_block=this.obj_blockStart;
                  if(!obj_block){return;}                  
                  obj_item=obj_block.fn_getComponent(str_nameConsoleContainer);
                  if(obj_item){return obj_item;}
                  
                  obj_block=this.obj_blockEnd;
                  if(!obj_block){return;}                  
                  obj_item=obj_block.fn_getComponent(str_nameConsoleContainer);
                  if(obj_item){return obj_item;}                  
                }
                fn_onLoad(){
                  super.fn_onLoad();                                                      
                  
                  this.obj_blockStart=this.fn_getItemGoSouth("block_start");                  
                  this.obj_blockEnd=this.fn_getItemGoSouth("block_end");                 
                  

                  //this.obj_blockStart.fn_highlightBorder("green");
                  //this.obj_blockEnd.fn_highlightBorder("purple");                
                  
                }
                
              }//END CLS
              //END TAG
              //END component/xapp_console
/*type: xapp_console//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_console_search//*/

            //XSTART component/xapp_console_search
            class xapp_console_search extends form_inputandbutton{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                                                    
              }                              

              fn_onLoad(){            
                super.fn_onLoad();      
                if(this.fn_hasContextHolderParent()){return;}                           
                if(this.fn_getDebugPin()){this.fn_highlightBorder("pink");}                                  
      
                let obj_parent=this.fn_getParentComponent();                  
                if(!obj_parent){
                  //eg in design mode
                  return;
                }
                obj_parent=obj_parent.fn_getParentComponent();                
                this.obj_parentContainer=obj_parent;

                
                this.fn_resetReportInterface();

                //this.fn_debug();
      
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
      
              

              fn_onLinkButtonClick(e){//fires when form is submitted - clicked

                
                //GET SEARCH INPUT VALUE
                let str_value=super.fn_onLinkButtonClick();                
                //GET SEARCH INPUT VALUE
                //alert("str_value:" + str_value)
                let obj_menuButton=this.fn_getMenuButton();                                    
                if(obj_menuButton.bln_simpleSearch){
                  obj_menuButton.fn_setQuerySearch(str_value);                   
                  return;
                }

                if(!str_value){                  
                  this.fn_toggleReportInterface();
                  return false;
                }
                
                /*
                if (e.detail === 2) {                
                  return false;
                }
                //*/

                this.fn_addQueryTermToList(str_value);                

                this.fn_showReportInterface();                
              }
              fn_onLinkInputMouseDown(){}
              fn_onLinkInputKeyDown(){}                

              fn_getInterfaceBlock(){
                let obj_container=this.obj_parentContainer;                  
                //return obj_container;
                
                if(!obj_container.obj_console){
                  obj_container.obj_console=obj_container.fn_addContextItem("xapp_console");                  
                }            
                //obj_container.fn_setBorder("10px solid white");
                //obj_container.obj_console.fn_setBorder("10px solid yellow");      
                //obj_container.obj_console.obj_blockStart.fn_setBorder("10px solid blue");      
                //obj_container.obj_console.obj_blockEnd.fn_setBorder("10px solid orange");      
                return obj_container.obj_console.obj_blockStart;
              }

              fn_toggleReportInterface(){

                this.fn_getTabset();    
                this.obj_tabset.fn_toggleInterface();                
                
              }
              
              fn_resetReportInterface(){                                    
                this.fn_resetInput();                
                this.fn_notifyItem("form_button_search", "fn_setDisplay", true);                                  
              }                                         
              
              fn_getTabset(){

                
                if(this.obj_tabset)return;

                let obj_container=this.fn_getInterfaceBlock();                    
                let obj_tabset=obj_container.fn_getComponent("form_tabset");                
                if(!obj_tabset){                                                                                   
                  obj_tabset=obj_container.fn_addContextItem("form_tabset");                    
                  obj_tabset.obj_parentInterface=this;                                                      
                  obj_tabset.bln_tabLegend=true;
                }
                this.obj_tabset=obj_tabset;                
              }

              fn_hideReportInterface(){
                console.log("fn_hideReportInterface");

                this.fn_getTabset();    
                this.obj_tabset.fn_hideInterface();
              } 
              fn_showReportInterface(){
                //console.log("fn_showReportInterface");

                this.fn_getTabset();    
                this.obj_tabset.fn_showInterface();
              } 
              
              
              fn_addReportInterface(obj_param){

                this.fn_getTabset();    
                
                //*
                let obj_panel=this.obj_tabset.fn_getTabPanel(obj_param);                
                obj_panel.obj_parentInterface=this;                                                    
                return obj_panel;
                //*/
              }    
              


              fn_removeReportInterface(str_interface){                  

                console.log("fn_removeReportInterface");;

                let obj_interface=this.obj_tabset.fn_getComponent(str_interface);                
                
                let obj_container;
                
                obj_container=this.fn_getInterfaceBlock();
                
                
                if(obj_container){
                  obj_container.fn_removeItem(obj_interface);
                }


                //let obj_menuButton=this.fn_getMenuButton();                  
                //obj_menuButton.fn_resetQueryList();                
              }                






              
              fn_getReportFieldCriteriaParam(){
                let obj_param={}
                obj_param.str_name="Report Criteria";
                obj_param.str_type="xapp_report_interface_fieldcriteria";               
                return obj_param;
              }              
              fn_addReportInterfaceFieldCriteria(){                  
                let obj_param=this.fn_getReportFieldCriteriaParam();
                return this.fn_addReportInterface(obj_param);
              }              

              fn_getReportFieldListParam(){
                let obj_param={}
                obj_param.str_name="Report Fields";
                obj_param.str_type="xapp_report_interface_fieldlist";               
                return obj_param;
              }              
              fn_addReportInterfaceFieldList(){                  
                let obj_param=this.fn_getReportFieldListParam();
                return this.fn_addReportInterface(obj_param);
              }              




              fn_getQueryTermParam(){
                let obj_param={}
                obj_param.str_name="Tag List";
                obj_param.str_type="xapp_queryterm_interface";               
                return obj_param;
              }              
              fn_addQueryTermInterface(){
                  
                let obj_param=this.fn_getQueryTermParam();
                return this.fn_addReportInterface(obj_param);

              }              
              fn_removeQueryTermInterface(){

                console.log("fn_removeQueryTermInterface");
                let obj_param=this.fn_getQueryTermParam();
                return this.fn_removeReportInterface(obj_param);
              }             


              fn_addQueryTermToList(str_value){                                  
                
                this.fn_addQueryTerm(str_value, true);                
                let obj_menuButton=this.fn_getMenuButton();                                  
                obj_menuButton.fn_addQueryTermToList(str_value);             
                //console.log("QueryList: " + obj_menuButton.fn_getQueryList());                
              }                                       

              fn_addQueryTerm(str_queryTerm, bln_startPosition=false){               

                if(!str_queryTerm){return;}
                
                this.fn_resetInput();                
                
                let obj_interface=this.fn_addQueryTermInterface()
                return obj_interface.fn_addQueryTerm(str_queryTerm, bln_startPosition);                
              }

              fn_queryTermButtonOnMouseDown(obj_button, e){                               


                this.timerQueryTerm= setTimeout(function () {                    
                    this.fn_removeQueryTermDisabled(obj_button);
                    this.fn_removeQueryTerm(obj_button);                
                    let obj_menuButton=this.fn_getMenuButton();                                                        
                    obj_menuButton.fn_runSearch();
                }.bind(this), 1000);
              }
              
              fn_queryTermButtonOnMouseUp(obj_button, e){
                
                window.clearTimeout(this.timerQueryTerm);
              }

              fn_queryTermButtonOnClick(obj_button, e){                
                
                /*
                if (e.detail === 2) {
                  return;
                }
                //*/
                
                
                if(obj_button.bln_enabled){
                  this.fn_disableQueryTerm(obj_button);
                }
                else{
                  this.fn_enableQueryTerm(obj_button);
                }
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                obj_menuButton.fn_runSearch();
              }

              
              fn_queryTermButtonOnDblClick(obj_button, e){                                               
                
              }
              
              fn_enableQueryTerm(obj_button){
                
                let obj_interface=this.fn_addQueryTermInterface();                  
                obj_interface.fn_enableQueryTerm(obj_button);                
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();
                obj_menuButton.fn_addQueryTermToList(str_value);                                       
              }


              fn_disableQueryTerm(obj_button){
              
                let obj_interface=this.fn_addQueryTermInterface();                  
                obj_interface.fn_disableQueryTerm(obj_button);
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();
                obj_menuButton.fn_addQueryTermToListDisabled(str_value);                        
              }

              fn_removeQueryTerm(obj_button){                                
                
                let obj_interface=this.fn_addQueryTermInterface();                  
                obj_interface.fn_removeQueryTerm(obj_button);                                   
                if(!obj_interface.fn_getCountQueryTerm()){                    
                  console.log("obj_interface.fn_getCountQueryTerm fn_removeQueryTermInterface");
                  this.fn_removeQueryTermInterface();                  
                }     
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();                
                obj_menuButton.fn_removeQueryTermFromList(str_value);                                                       
              }
              fn_removeQueryTermDisabled(obj_button){                                                               
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();
                obj_menuButton.fn_removeQueryTermFromListDisabled(str_value);                                                                      
              }              
              
              

              
            }//END CLS
            //END TAG
            //END component/xapp_console_search              
/*type: xapp_console_search//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_context_holder//*/

            //XSTART component/xapp_context_holder
              class xapp_context_holder extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  this.obj_design.bln_isContextHolder=true;                  
                }
                fn_addItem(obj_ini){
                  obj_ini.obj_design.bln_registerAtContainer=true;                  
                  return super.fn_addItem(obj_ini);//CallSuper          
                }
                fn_onLoad(obj_ini){
                  super.fn_onLoad(obj_ini);
                  
                  if(obj_project.fn_isContextHolder()){
                    this.fn_setDisplayFlex(true);
                  }
                  else{
                    this.fn_setDisplayFlex(false);
                  }
                }
              }//END CLS
              //END TAG
              //END component/xapp_context_holder
/*type: xapp_context_holder//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_data_childmenu//*/

            //XSTART component/xapp_data_childmenu
              class xapp_data_childmenu extends xapp_data{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  this.obj_holder.bln_computeRows=false;                  

                  this.obj_holder.bln_debugServer=false;                  
                }                
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("aqua");}                  
                }
                fn_onDataStart(){                
                  super.fn_onDataStart();
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onDataStartChildMenu();                                    
                }
                fn_onDataEnd(obj_post){                  
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onDataEndChildMenu(obj_post);                                    
                }
                fn_onComputeRow(){                                   
                
                  let obj_row=this.obj_paramRS.obj_row;                  
                  if(!obj_row){return;}
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onComputeRowChildMenu(obj_row);                                    
                }                  
              }//END CLS
              //END TAG
              //END component/xapp_data_childmenu
/*type: xapp_data_childmenu//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_data_view//*/

            //XSTART component/xapp_data_view
              class xapp_data_view extends xapp_data{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                 
                }
                fn_onDataStart(){                
                  super.fn_onDataStart();
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                                  
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onDataStartView();                                    
                }
                fn_onDataEnd(obj_post){
                  super.fn_onDataEnd(obj_post);
                  let obj_menuButton=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_menuButton){return;}                                    
                  obj_menuButton.fn_onDataEndView(obj_post);                                    
                }                
                //----------------------------------------
                //SIGNPOST 10. obj_dataView fn_runComputeRow
                //----------------------------------------
                fn_onComputeRow(){                

                  let obj_row=this.obj_paramRS.obj_row;                                  
                  if(!obj_row){return;}
                  let obj_parentMenu=this.obj_paramRS.obj_menuButton;                                                                  
                  if(!obj_parentMenu){return;}                  
                  obj_parentMenu.fn_onComputeRowView(obj_row);                   
                }     
                fn_getWidgetView(){
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(obj_parent){return obj_parent.fn_getWidgetView();}                
                }
              }//END CLS
              //END TAG
              //END component/xapp_data_view
/*type: xapp_data_view//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_dynamic_content//*/

            //XSTART component/xapp_dynamic_content
              class xapp_dynamic_content extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
      
                  //START INITIALIZE DESIGN                       
                  this.obj_design.bln_registerAtContainer=true;
                  this.fn_setDynamic(true);                              
                  this.fn_setTag("xapp_dynamic_content", true);                                  
                  //END  INITIALIZE DESIGN
      
                  //START INITIALIZE STYLE            
                  //*
                  //if(this.fn_getStyleProperty("background-color")===undefined){this.fn_setStyleProperty("background-color", "red");}
                  //if(this.fn_getStyleProperty("padding")===undefined){this.fn_setStyleProperty("padding", "10px");}            
                  //*/

                  
      
                  //*            
                  //*/
                  //END  INITIALIZE STYLE  
                }
                fn_prepare(){
                  this.fn_removeChildren();                         
                }          
                fn_onBeforeSave(){            
                  //console.log("fn_onBeforeSave");
                  this.fn_prepare();            
      
                }
              }//END CLS
              //END TAG
              //END component/xapp_dynamic_content
/*type: xapp_dynamic_content//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_form_container_search//*/
      //XSTART component/xapp_console_container_search
      class xapp_form_container_search extends xapp_console_container{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onSubmit(e){                          

          if(!obj_project.obj_itemEvent){//check to see if the e-vent has been cancelled
            return;
          }
        
          obj_project.fn_forgetEvent(e);

          //HOW THIS WORKS
          //the search value is already updated first , via the search button click on submit
          //console.log("xapp_console_container_search onsubmit");
          //console.log(" xapp_console_container_search fn_onSubmit")                    
          let obj_menuButton=this.fn_getMenuButton();          
          obj_menuButton.fn_runSearch();
        }
      }//END CLS
      //END TAG
      //END component/xapp_console_container_search        
/*type: xapp_form_container_search//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_menu_panel//*/
            //XSTART component/xapp_menu_panel
              class xapp_menu_panel extends form_menu_panel{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                                      

                  //this.obj_holder.bln_listenClick=true;
                }                
                xfn_onClick(){
                  //currently disabled as casuing too many niggly issues - to do find a solution on blur or fix the issues.
                  let obj_menuButton=this.fn_getMenuButton();
                  if(obj_menuButton.obj_dataView){
                    obj_menuButton.obj_dataView.fn_setModeExecuteView();//Closes all editable controls , except lists and currently selected control
                  }
                }

                fn_getMenuButton(){
                  return this.obj_parentMenu;
                }
                
                fn_onLoad(){
                  super.fn_onLoad();                
                  if(!this.obj_console){
                    this.obj_console=this.fn_addContextItem("xapp_console");
                  }                                    
                }                
                fn_getDashboardConsoleContainer(){                                                      
                  return this.fn_getConsoleContainer("xapp_console_container_dashboard");                  
                }                
                
              }//END CLS
              //END TAG
              //END component/xapp_menu_panel
/*type: xapp_menu_panel//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_menuform//*/

            //XSTART component/xapp_menuform
            class xapp_menuform extends xapp_menu{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){                
    
                super.fn_initialize(obj_ini);

                this.obj_meta.bln_debugMenu=false;           

                
                this.str_defaultTypeMenu="xapp_menuform";                  
                this.str_defaultTypeData="xapp_dataform_view";                  
                this.str_defaultTypeDataChildMenu="xapp_dataform_childmenu";
                

                this.fn_initialize_var();                
              } 
              

              fn_initialize_var(){
                super.fn_initialize_var();
                this.fn_resetArrayDynamicMenu();

                this.int_totalRowCount=0;
              }

              fn_applyThemeStructure(){    
                this.obj_themeStructure=obj_project.obj_themeChildMenu;                
                this.fn_applyStyle(this.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
              }

              
              fn_setMenuPanel(){     
                super.fn_setMenuPanel();                  

                if(this.obj_menuPanel){                  

                  this.obj_consoleContainerRecord=this.obj_menuPanel.fn_addConsoleContainer("console_container_record", true);                                                        
                  this.obj_button_new_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_new_record");                  
                  this.obj_button_filteroff_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_filteroff_record");
                  this.obj_button_filteron_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_filteron_record");
                  this.obj_button_navigate_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_navigate_record");
                  this.obj_button_linkon_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_linkon_record");
                  this.obj_button_linkoff_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_linkoff_record");
                  
                  this.obj_button_complete_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_complete_record");                    

                  this.obj_button_archive_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_archive_record");
                  if(this.obj_columnArchiveDate){                                        
                    if(this.obj_columnArchiveDate.str_value){
                      this.obj_button_archive_record.fn_setText("Restore Record");

                    }
                  }
                  
                }
              }              

              fn_runSearch(){

                this.bln_runSearch=true;
                
                if(this.bln_modeNewRecord){                                
                    this.fn_formRefreshRecord(); 
                    return;

                }                 
                
                
                this.fn_formViewRecord();             
                
                
              }
              fn_formRefreshRecord(obj_menuButton){           
            
                if(!obj_menuButton){
                  obj_menuButton=this;    
                  if(this.bln_dynamicMenu){                            
                    obj_menuButton=this.obj_parentMenu;      
                  }    
                }
                obj_menuButton.fn_exitNewRecord();                  
                obj_menuButton.fn_formViewRecord();
              }

              fn_exitNewRecord(){                                  
                this.bln_modeNewRecord=false;                   
                if(this.obj_dataView){                            
                  this.obj_dataView.fn_setQueryModeNewRecord(false);      
                }    
                if(this.obj_parentMenu && this.obj_parentMenu["fn_exitNewRecord"]){
                  this.obj_parentMenu.fn_exitNewRecord();
                  //this.obj_parentMenu.fn_debugText("2 this.obj_parentMenu fn_exitNewRecord");
                  //this.fn_debugText("2 this fn_exitNewRecord");
                }
              }

              fn_formNavigateRecord(){
                //*
                const obj_navigate=this.fn_getNavigate();                
                obj_path.fn_navigateRecordURL(obj_navigate.str_urlMetaRowzName, obj_navigate.str_urlMetaRecordId);                
                //*/

                /*
                const obj_navigate=this.fn_getNavigate();                
                const str_urlBase="";
                const str_url=obj_path.fn_getNavigateRecordURL(obj_navigate.str_urlMetaRowzName, obj_navigate.str_urlMetaRecordId, str_urlBase);
                window.location.href=str_url;
                //*/
              }
              fn_onClose(){
                super.fn_onClose();    
                
                if(this.bln_flagReview){
                  let bln_removeSearch=true;
                  this.fn_removeConstraint(bln_removeSearch);
                }
                this.bln_flagReview=false;
              }
              fn_removeConstraint(bln_removeSearch=false){
                this.fn_setAutoJoinFilterPin(false);
                if(bln_removeSearch){
                  this.fn_setQueryList("");                      
                }    
                this.bln_flagRunOnce=false;    
            
              }
              fn_exitConstraint(){   
                this.fn_setConstraintKeyPin(false);        
              }
              fn_formArchiveRecord(){        
                this.fn_archiveRecord(true);        
              }                 
              fn_formDeleteRecord(){                  
                this.fn_archiveRecord(false);        
              }                 
              fn_archiveRecord(bln_recycle){      
        
                if(!this.obj_dataView){return;}    
                let obj_columnKey;
                //obj_columnKey=this.obj_columnKey;                
                obj_columnKey=this.obj_columnDataId
                if(!obj_columnKey.str_value){return;}//only 1 record with columnkey can be deleted. 
                
                this.obj_dataView.fn_archiveRecord(obj_columnKey, bln_recycle); 
              }
              fn_onArchiveRecord(){                            
                this.fn_formCompleteRecord(false);
              }
              fn_onDeleteDynamicRow(){                
            
                this.fn_displayObject(false);
                this.fn_configureObject(false);//can cause issues     
                this.fn_setDisplay(false);       
                //this.obj_parentMenu.fn_formRefreshRecord();
                this.fn_displayOnPeers();//keep for the momentr , but probably refresh is need for counts etc                  
              }

              fn_debugAutoJoin(str_message=""){    
                console.log("START " + str_message);
                console.log("this.obj_meta.bln_autoJoinPin: "+ this.obj_meta.bln_autoJoinPin);
                console.log("this.obj_meta.str_autoJoinToSource: "+ this.obj_meta.str_autoJoinToSource);
                
                console.log("this.bln_modeNewRecord: "+ this.bln_modeNewRecord);    
                console.log("this.obj_columnKey: "+ this.obj_columnKey);    
                console.log("this.bln_autoJoinFilterPin: "+ this.bln_autoJoinFilterPin);        
                if(this.obj_columnKey){
                  console.log("this.obj_columnKey.str_value: "+ this.obj_columnKey.str_value);    
                }        
                
                console.log("this.obj_parentMenu.obj_meta.bln_autoJoinPin: "+ this.obj_parentMenu.obj_meta.bln_autoJoinPin);
                console.log("this.obj_parentMenu.obj_meta.str_autoJoinToSource: "+ this.obj_parentMenu.obj_meta.str_autoJoinToSource);
                
                console.log("this.obj_parentMenu.bln_modeNewRecord: "+ this.obj_parentMenu.bln_modeNewRecord);    
                console.log("this.obj_parentMenu.obj_columnKey: "+ this.obj_parentMenu.obj_columnKey);    
                console.log("this.obj_parentMenu.bln_autoJoinFilterPin: "+ this.obj_parentMenu.bln_autoJoinFilterPin);    
                if(this.obj_parentMenu.obj_columnKey){
                  console.log("this.obj_parentMenu.obj_columnKey.str_value: "+ this.obj_parentMenu.obj_columnKey.str_value);    
                }
                   
                console.log("END " + str_message);
              }

              fn_formViewRecord(){  //called by crud menu operation data end child menu and search              
        
                //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
                //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
                //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
                //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"        
            
                if(this.bln_modeNewRecord){      
                  this.fn_formNewRecord();
                  return;
                }         
                
                super.fn_formViewRecord();                  
              }              

              

              fn_setButtonViewRecord(){                
        
                super.fn_setButtonViewRecord();                              

                let bln_settingOperationPin=this.fn_getSettingOperationPin();

                
                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_archive_record);                                      
                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_complete_record);                                      

                if(bln_settingOperationPin){                      
                  return;            
                }
                if(this.obj_parentMenu && this.obj_parentMenu.fn_getSettingOperationPin()){                      
                  return;            
                }

                

                let bln_showButtonComplete=true;
                if(this.bln_dynamicMenu){
                  bln_showButtonComplete=false;
                }
                if(bln_settingOperationPin){
                  bln_showButtonComplete=false;
                }
                if(bln_showButtonComplete){                  
                    this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);                                                                            
                }
            
                //*
                //this.fn_classifyLevel();                           
                if(this.bln_isJoinedChildMenu){                                    
                  if(this.fn_getAllowAutoJoinPin()){  
                    this.fn_setButtonChildFilterDisplay();                                  
                    if(this.obj_meta.bln_joinTypeMany){                                              
                      this.obj_consoleContainerRecord.fn_showItem(this.obj_button_navigate_record);                                            
                      //this.fn_setLimitEndMenuChain(true);
                      
                    }                    
                  }
                }  
                  //*/                    
                
                
                //this.fn_debugText("this.bln_hasChildForm: " + this.bln_hasChildForm);
                if(this.bln_hasChildForm){                                    
                  //this.fn_debugText("this.obj_meta.int_idParentMetaRowz: " + this.obj_meta.int_idParentMetaRowz);
                  let bln_value=this.fn_hasTopLevelRowzParent(this.obj_meta.int_idParentMetaRowz);
                  //this.fn_debugText("xxx bln_value: " + bln_value);                  
                  if(bln_value){//show view button if there is a dynamic menu above to the                  
                    this.bln_applyAnchor=true;                    
                    this.str_urlNavigateURL=this.fn_getNavigateURL()                    
                    this.obj_button_navigate_record.fn_setNavigationURL(this.str_urlNavigateURL);
                    this.fn_setNavigationURL(this.str_urlNavigateURL);
                    //this.obj_consoleContainerRecord.fn_showItem(this.obj_button_navigate_record);
                  }
                  

                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_archive_record);                  
                  
                  if(this.bln_multiRecordDisplay){  //All Record "Report View"                                              
                    if(this.bln_recordConsole){                                  
                      this.obj_consoleContainerRecord.fn_showItem(this.obj_button_new_record);
                      this.obj_consoleContainerSearch.fn_showItem(this.obj_console_search);
                    }        
                  }
                  
                }
                else if(this.bln_isParentMenuWithView){                    
                  this.fn_setButtonParentFilterDisplay();        
                  if(this.bln_recordConsole){                              
                    this.obj_consoleContainerRecord.fn_showItem(this.obj_button_new_record);                      
                    //this.obj_consoleContainerSearch.fn_showItem(this.obj_console_search);
                  }     
                } 
                if(this.bln_isJoinedChildMenu){                  
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_archive_record);                                      
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_complete_record);                                      
                }
              }

              fn_setButtonChildFilterDisplay(bln_hideItem=false){
                if(this.obj_parentMenu.bln_autoJoinFilterPin){//any records displayed must therefore be linked                                
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_linkoff_record);                                            
                }
                else{        
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_linkon_record);//any records displayed may or may not  be linked
                  //run ajax view to see if contact is linked or not.      
                }     
                this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);                
              }

              fn_setButtonParentFilterDisplay(bln_hideItem=false){
            
            
                //start get Status CanBeFiltered
                let bln_value=false;                  
                if(this.obj_parentMenu.obj_columnKey && this.obj_parentMenu.obj_columnKey.str_value){bln_value=true;}                  
                //end get Status CanBeFiltered   
            
                if(!bln_value){return;}
                //*
                if(bln_hideItem){
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteron_record);            
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteroff_record);            
                  return;
                }
                //*/
                if(!this.fn_getAllowAutoJoinPin()){return false;}                                
                if(this.fn_getAutoJoinFilterPin()){                    
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteron_record);            
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_filteroff_record);                              
                }
                else{                    
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_filteron_record);            
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteroff_record);            
                }
                this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);
              }  

              fn_setQueryList(str_value, bln_isNewRecord){                                      
                super.fn_setQueryList(str_value);                  
                if(!bln_isNewRecord){
                  this.fn_exitNewRecord();                               
                }
              }                                                 

              fn_formNewRecord(){        

                this.bln_modeNewRecord=true;        
            
                this.obj_dataView.fn_setQueryModeNewRecord(true);                            
                
                let bln_isNewRecord=true;
                this.fn_setQueryList("", bln_isNewRecord);

                obj_path.fn_resetNavigateRecordURL();
                let str_metaRowzName=this.obj_meta.str_metaRowzName;                              
                obj_path.fn_pushStateNavigateRecordURL(this.obj_meta.str_metaRowzName);
                
                
                this.fn_setModeNewRecord();            
                this.fn_runDataView();              
                
              }  
              fn_formNewColumn(){        
            
                this.bln_modeNewRecord=true; 
            
                this.obj_dataView.fn_setQueryModeNewRecord(true);                            
                
                let bln_isNewRecord=true;
                this.fn_setQueryList("", bln_isNewRecord);

                obj_path.fn_resetNavigateRecordURL();
                let str_metaRowzName=this.obj_meta.str_metaRowzName;                              
                obj_path.fn_pushStateNavigateRecordURL(this.obj_meta.str_metaRowzName);
                
                
                this.fn_setModeNewRecord();            
                this.fn_runDataView();              
                
              }  
              fn_maintainDebugOn(){        
                
                this.fn_setMaintainDebugOn(true);    
                this.fn_formViewRecord();    
              }  
              fn_formApplyJoinFilter(){                                        
                if(this.obj_dataView){
                  this.obj_dataView.fn_resetDataView();//important to avoid page mis match                
                }                
                this.fn_setAutoJoinFilterPin(true);    
                this.fn_formViewRecord();    
              }  
              fn_formRemoveJoinFilter(){       
                if(this.obj_dataView){
                  this.obj_dataView.fn_resetDataView();//important to avoid page mis match                
                }                
                this.fn_setAutoJoinFilterPin(false);
                this.fn_formViewRecord();    
              }     
              
              fn_formEditRecord(){                   
                
                this.fn_setModeExecuteEdit();            
                this.fn_runDataView();      
              }  
              fn_formLinkOffRecord(){
                
                if(this.obj_parentMenu.obj_dataView){
                  this.obj_parentMenu.obj_dataView.fn_resetDataView();//important to avoid page mis match
                }                
                
                this.bln_linkOffPin=true;            
                this.fn_setQueryList("");                
                this.fn_runDataView();      
              }  
              fn_formLinkOnRecord(){
                if(this.obj_parentMenu.obj_dataView){
                  this.obj_parentMenu.obj_dataView.fn_resetDataView();//important to avoid page mis match
                }                
                this.bln_linkOnPin=true;            
                this.fn_setQueryList("");                
                this.fn_runDataView();      
              }  
            
              fn_onNewRecordUpdateMetaKey(obj_columnKey){
                this.obj_columnKey=obj_columnKey;                  
                this.fn_exitNewRecord();                                    
                /*
                this.fn_resetMenu();
                this.obj_dataView.fn_setModeExecuteView(); //update mode value    
                if(this.bln_dynamicMenu){
                  this.obj_parentMenu.fn_onNewRecordUpdateMetaKey();
                }
                //*/
              }

              fn_formCompleteRecord(bln_selfMenu=false){                

                bln_selfMenu=false;

                let int_countDynamic=this.obj_holder.arr_dynamicMenu.length;
                let int_countStandard=this.obj_holder.arr_standardMenu.length;

                if((int_countDynamic>1) || (int_countStandard>1)){
                  if(this.bln_childrenOpen ){
                    bln_selfMenu=true;
                  }                 
                }
                
              
                if(this.fn_getModeNewRecord()){
                  this.fn_exitNewRecord();                                                                      
                  bln_selfMenu=true;
                }

                if(!bln_selfMenu){
                  this.obj_parentMenu.fn_refreshMenu();
                  return;
                }                

                if(this.obj_dataView){
                  this.obj_dataView.fn_resetDataView();//important to avoid page mis match                
                }                
                
                this.fn_formViewRecord();                               
              }
              
              

              fn_setModeExecuteEdit(){                               
                super.fn_setModeExecuteEdit();
                
                this.fn_setButtonEditRecord();                          
                this.obj_dataView.fn_setModeExecuteEdit();        
              }
              
              fn_setButtonEditRecord(){              
                alert("no longer in use fn_setButtonEditRecord");

                if(this.obj_meta.bln_displayData){
                  
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_archive_record);                  
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);                  
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_navigate_record);
                }   
              }
            
              fn_setModeNewRecord(){    
                this.fn_setButtonNewRecord();                      
                this.obj_dataView.fn_setModeExecuteNew(); //update mode value        
               }
               fn_getModeNewRecord(){                    
                return this.obj_dataView.fn_getModeExecuteNew(); //update mode value        
               }
               fn_setButtonNewRecord(){                  

                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_archive_record);
                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_navigate_record);                
                //this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);
                //this.obj_button_complete_record.fn_setDisabled(true); //on in the wrong menu
                
                if(this.bln_multiRecordDisplay){  //All Record "Report View"                                                                    
                  this.obj_consoleContainerSearch.fn_showItem(this.obj_console_search);
                }

                let bln_hideItem=true;
                this.fn_setButtonParentFilterDisplay(bln_hideItem);
                
              }

              
            
    

              fn_onDataStart(obj_post){        
                super.fn_onDataStart(obj_post);                              
                
                if(this.bln_linkOffPin || this.bln_linkOnPin){      
                  if(this.bln_linkOffPin){
                    //this.obj_parentMenu.fn_setAutoJoinFilterPin(false);
                    this.obj_parentMenu.fn_setQueryList("");                    
                  }
                  else if(this.bln_linkOnPin){
                    this.obj_parentMenu.fn_setAutoJoinFilterPin(true);
                  }
                  this.bln_linkOffPin=false;
                  this.bln_linkOnPin=false;                        
                  this.obj_parentMenu.fn_resetMenu();
                  this.obj_parentMenu.fn_formRefreshRecord();     
                  //this.obj_parentMenu.fn_open();
                }    
                
                
              }
              fn_onDataEnd(obj_post){                              
                //console.log("xapp_menuform fn_onDataEnd");
                super.fn_onDataEnd(obj_post);
                
              }

              fn_getConsoleValues(){          
                super.fn_getConsoleValues();
                if(this.fn_getConsoleValue("Record")){this.bln_recordConsole=true;}                       
              }
            
              fn_configureSelfShared(obj_row){ //standard from add to accordion   
                
                //this.fn_debugText("fn_configureSelfShared");
                
                this.bln_modeNewRecord=this.obj_parentMenu.bln_modeNewRecord;
                if(this.bln_modeNewRecord){
                  this.fn_setAutoOpenPin(true);
                  this.obj_meta.bln_displayAccordionChildMenu=false;    
                  //copy autojoin value                
                  this.fn_setAutoJoinPin(this.obj_parentMenu.fn_getAutoJoinPin());                
                  this.fn_setAutoJoinToSource(this.obj_parentMenu.fn_getAutoJoinToSource());                        
                }    
                
                this.fn_setAutoJoinFilterPin(this.obj_meta.bln_autoJoinPin);                
                //console.log("this.fn_getAutoJoinFilterPin: " + this.fn_getAutoJoinFilterPin());
                  
                this.obj_meta.bln_joinTypeOne=false;
                this.obj_meta.bln_joinTypeMany=false;
                this.fn_setAllowAutoJoinPin(false);    
                switch(this.obj_meta.int_joinType){            
                  case(1):
                    this.obj_meta.bln_joinTypeOne=true;
                    break;
                  case(2):
                    this.obj_meta.bln_joinTypeMany=true;                
                    this.fn_setAllowAutoJoinPin(true);    
                    break;
                }    
                
                super.fn_configureSelfShared(obj_row);        
                  
                } 

                

                fn_addStandardMenuToAccordion(obj_row){
                  //Standard Child Menu    

                  let obj_item=super.fn_addStandardMenuToAccordion(obj_row);

                  if(!obj_item){return;}
                  
                  //Parent Menus can be Dynamic Menus to which Standard Menus are added
                  //Parent Menus can be Standard Menus to which Dynamic Menus are added  
                  if(this.fn_getAllowAutoJoinPin()){
                    
                    if(!obj_item.fn_getSettingOperationPin()){
                      let str_text=obj_item.fn_getText();
                      obj_item.fn_setText("[" + str_text + "]", str_text);                  
                      obj_item.fn_setMetaRowzTitle("[" + str_text + "]");                      
                    }
                    else{                      
                    }
                    
                  
                  
                    if(this.bln_dynamicMenu && (obj_item.obj_meta.int_idMetaRowz!==this.obj_meta.int_idMetaRowz)){            
                      obj_item.fn_setAutoJoinPin(true);
                      obj_item.fn_setAutoJoinFilterPin(true);                          
                    }        
                  }            
                }             

                
                
                fn_getRunDataViewQueryExpression(){

                  let str_expr="";              
                  return str_expr;
                  
                  
                }
                

                fn_getContextColumnKey(){

                  //this.fn_debugText("START fn_getContextColumnKey");
                  
                  let obj_columnKey=this.obj_columnKey;  
                  //console.log(obj_columnKey);  
                  //this.fn_debugText("this.bln_autoJoinFilterPin: " + this.bln_autoJoinFilterPin);
                  if(!obj_columnKey && this.bln_autoJoinFilterPin){
                    obj_columnKey=this.obj_parentMenu.obj_columnKey;
                    //this.fn_debugText("get parent column key: " + this.bln_autoJoinFilterPin);
                    //console.log(obj_columnKey);
                  }                      
                  if(this.bln_modeNewRecord && this.bln_autoJoinFilterPin){obj_columnKey=this.obj_parentMenu.obj_parentMenu.obj_columnKey;}
                  
                  

                  //this.fn_debugText("END fn_getContextColumnKey");
                  return obj_columnKey;
                }

                fn_configureDataViewQuery(){

                  super.fn_configureDataViewQuery();       
                  
                  let obj_columnKey=this.fn_getContextColumnKey();                          
                  this.obj_dataView.fn_setMetaKey(obj_columnKey);
            
                  
                  if(this.obj_meta.bln_autoJoinPin && this.bln_autoJoinFilterPin){
                    if(!this.bln_modeNewRecord){
                      this.obj_meta.str_autoJoinToSource=this.obj_parentMenu.fn_getMetaViewId();      
                      //console.log("runDataView adjusted this str_autoJoinToSource: "+ this.obj_meta.str_autoJoinToSource);      
                    }      
                    this.obj_dataView.fn_setAutoJoin(true);      
                    this.obj_dataView.fn_setAutoJoinToSource(this.obj_meta.str_autoJoinToSource);    
                    if(obj_columnKey && obj_columnKey.str_value){
                      this.obj_dataView.fn_setAutoJoinToKeyValue(obj_columnKey.str_value);            
                      this.obj_dataView.fn_setAutoJoinToKeyName(obj_columnKey.fn_getMetaColumnName());            
                    }      
                  }
              
                  if(this.bln_linkOffPin || this.bln_linkOnPin){   
                        
                    this.obj_meta.str_autoJoinToSource=this.obj_parentMenu.obj_parentMenu.fn_getMetaViewId();      
                    this.obj_meta.str_autoJoinToKeyValue=this.obj_parentMenu.obj_parentMenu.obj_columnKey.str_value;                    
                    this.obj_meta.str_autoJoinToKeyName=this.obj_parentMenu.obj_parentMenu.obj_columnKey.fn_getMetaColumnName();
                    this.obj_meta.str_autoJoinFromKeyValue=this.obj_columnKey.str_value;      
              
                    this.obj_dataView.fn_setLinkOffPin(this.bln_linkOffPin);      
                    this.obj_dataView.fn_setLinkOnPin(this.bln_linkOnPin);            
                    this.obj_dataView.fn_setAutoJoinToSource(this.obj_meta.str_autoJoinToSource);    
                    this.obj_dataView.fn_setAutoJoinToKeyValue(this.obj_meta.str_autoJoinToKeyValue);                  
                    this.obj_dataView.fn_setAutoJoinToKeyName(this.obj_meta.str_autoJoinToKeyName);                  
                    this.obj_dataView.fn_setAutoJoinFromKeyValue(this.obj_meta.str_autoJoinFromKeyValue);            
                    this.obj_dataView.fn_setAutoJoinFromKeyName(this.obj_meta.str_autoJoinFromKeyName);                  
                  } 
                  
                }

                fn_getMetaDefault(){

                  let obj_meta=super.fn_getMetaDefault();                                    
                  obj_meta.bln_allowAutoJoinPin=false;                                
                  obj_meta.bln_autoJoinPin=false;            
                  obj_meta.int_joinType=0;            

                  return obj_meta;
                }

                fn_getMetaDefaultDynamic(){

                  let obj_meta=super.fn_getMetaDefaultDynamic();                
                  obj_meta.bln_allowAutoJoinPin=this.fn_getAllowAutoJoinPin();    
                  obj_meta.int_joinType=this.obj_meta.int_joinType;    
                  return obj_meta;
                }

                fn_setConstraintKeyPin(bln_value){
                  this.bln_constraintKeyPin=bln_value;
                }
                
                fn_getConstraintKeyPin(){
                  return this.bln_constraintKeyPin;    
                }  

                fn_setConstraintNamePin(){
                  this.bln_constraintNamePin=false;
                  
                  if(this.bln_dynamicMenu && !this.bln_useMetaTemplate){return;}
                  if(!this.obj_meta.bln_joinTypeOne){return;}
                  if(this.obj_parentMenu.obj_meta.str_metaConstraintName){
                    this.bln_constraintNamePin=true;
                  }
                }
                
                fn_getConstraintNamePin(){
                  return this.bln_constraintNamePin;
                  
                }                                
                fn_setAllowAutoJoinPin(bln_value){
                  //this.fn_debugText("fn_setAllowAutoJoinPin: " + bln_value);
                  this.obj_meta.bln_allowAutoJoinPin=bln_value;    
                }
                fn_getAllowAutoJoinPin(){
                  //this.fn_debugText("fn_getAllowAutoJoinPin: " + this.obj_meta.bln_allowAutoJoinPin);
                  return this.obj_meta.bln_allowAutoJoinPin;
                }
                fn_getAutoJoinToSource(){
                  //this.fn_debugText("fn_getAutoJoinToSource: " + this.obj_meta.str_autoJoinToSource);
                  return this.obj_meta.str_autoJoinToSource;
                }
                fn_setAutoJoinToSource(str_value){
                  //this.fn_debugText("fn_setAutoJoinToSource: " + str_value);
                  this.obj_meta.str_autoJoinToSource=str_value;
                }
                fn_getAutoJoinPin(){
                  return this.obj_meta.bln_autoJoinPin;
                }
                fn_setAutoJoinPin(bln_value){
                  this.obj_meta.bln_autoJoinPin=bln_value;    
                }
                fn_getAutoJoinFilterPin(){    
                  return this.bln_autoJoinFilterPin;    
                }
                fn_setAutoJoinFilterPin(bln_value){
                  this.bln_autoJoinFilterPin=bln_value;  
                  if(!bln_value){                    
                    if(this.obj_dataView){
                      this.obj_dataView.fn_setMetaKey(false);
                    }
                    
                  }
                }
                fn_resetMenu(){
            
                  super.fn_resetMenu();
                  //this.fn_setAutoJoinFilterPin(false);
                }  

                //Menu Command Func
                fn_hideMenu(obj_exclude){
                  this.fn_hideStandardMenu(obj_exclude);              
                  this.fn_hideDynamicMenu(obj_exclude);              
                }
                fn_closeMenu(obj_exclude){    
                  this.fn_closeStandardMenu(obj_exclude)
                  this.fn_closeDynamicMenu(obj_exclude)
                }
                fn_menuCloseAndDisable(obj_exclude){
                  this.fn_standardMenuCloseAndDisable(obj_exclude);
                  this.fn_dynamicMenuCloseAndDisable(obj_exclude);
                }                

                fn_notifyMenu(str_nameFunction, obj_arg=false){
                  this.fn_notifyStandardMenu(str_nameFunction);                    
                  this.fn_notifyDynamicMenu(str_nameFunction);                    
                }
                //Menu Command Func

                
                
                
                

      
            }//END CLS
            //END TAG
            //END component/xapp_menuform
/*type: xapp_menuform//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_propertysheet//*/

            //XSTART component/xapp_propertysheet
              class xapp_propertysheet extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                              
                  
                  this.obj_holder.str_typePropertySheetInput="xapp_propertysheet_input";
                }
                fn_onChangeInput(obj_input){                            
                  this.fn_notify(this, obj_input.obj_design.str_inputAction, obj_input);
                }      
                
                fn_refreshSheet(obj_arg){//overiding for safety. can reivew overide.                

                    if(this.obj_design.int_modeExecute===obj_holder.int_modeLocked){return;}

                    this.fn_removeAllContent();                      
            
                    let obj_table;      
                    let str_text=obj_arg.str_text;
                    let obj_container=obj_arg.obj_container;
                  
                    let obj_ini, arr;
                    let obj_row, obj_item;                                        
                  
                    obj_ini=new Holder;            
                    obj_ini.obj_design.str_type="table";       
                    obj_table=obj_container.fn_addItem(obj_ini);//BootItem    
                    obj_arg.obj_table=obj_table;
                    
                    if(str_text){
                      obj_row=obj_table.fn_addItem();//BootItem
                      obj_ini=new Holder;            
                      obj_ini.obj_design.str_type="tableheader";                                        
                      obj_ini.obj_design.str_themeType="form_input";                                        
                      obj_ini.obj_domProperty.colSpan=2;                                  
                      obj_item=obj_row.fn_addItem(obj_ini);//BootItem    
                      obj_item.fn_setText(str_text);                
                    }                                  
                    
                    if(obj_arg.str_propertySourceChange){
                      this.fn_addNewPropertyRow(obj_arg);//add new value row    
                    }                            
                    //Parent class can call from here
                    this.fn_displayPropertySheet(obj_arg);
                    
                  }
                  
                  fn_displayPropertySheet(obj_arg){//to be overriden              
            
                    let arr_Property=Object.entries(obj_arg.obj_propertySource).sort((a, b) => a[0].localeCompare(b[0]));          
                    for (let [str_key, foo_val] of arr_Property) {          
                        obj_arg.str_key=str_key;
                        obj_arg.foo_val=foo_val;
                        this.fn_displayPropertySheetRow(obj_arg);
                      } 
                  }            
                  
                  fn_displayPropertySheetRow(obj_arg){
                
                    let str_key, str_val, foo_val;
                    let obj_row, obj_ini, obj_container, obj_cell, obj_input;
                    let bln_disabled;      
      
                    let obj_item;
      
                    let obj_selected=obj_project.obj_palettSelected;
                    let bln_locked=obj_selected.fn_getDesignLocked();              
                
                    str_key=obj_arg.str_key;    
                    foo_val=obj_arg.foo_val;
                    obj_ini=new Holder;
                    foo_val=this.fn_validateInputValue(str_key, foo_val);
                
                    if(foo_val===undefined){
                      return;
                    } 
                  
                    if(foo_val===""){                      
                      /*
                      return;
                      //*/
                    }   
                      
                    str_val=foo_val;
                    if(typeof foo_val==="object"){     
                      if(foo_val){
                        str_val=foo_val.constructor.name;
                      }
                    }
                    
                
                    let str_keyDisplay, str_valueDisplay;
                    str_keyDisplay=str_key;              
                    str_valueDisplay=str_val;
      
                    if(str_keyDisplay==="bln_registerAtProject"){
                      //console.log("1 " + str_keyDisplay + ": " + str_valueDisplay)
                    }              
                    
                    obj_row=obj_arg.obj_table.fn_addItem();
                    
                    //START CREATE NAME CELL
                    obj_ini=new Holder;                        
                    //obj_ini.obj_design.str_content=str_keyDisplay+":&nbsp;";              
                    obj_ini.obj_domStyle.minWidth="150px";
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem
                    obj_container=obj_cell;          
                    //END CREATE NAME CELL              
      
                    let str_propertyName, str_propertyValue;
                    str_propertyName=str_keyDisplay;
                    str_propertyValue=str_valueDisplay;
                    str_propertyValue=this.fn_validateInputValue(str_propertyName, str_propertyValue);//revison - check backup
      
                    obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);
                    obj_item.obj_holder.obj_propertySheet=this;
                    obj_item.fn_setText(str_propertyName);
                    bln_disabled=true;
                    obj_item.fn_setDisabled(bln_disabled);
                    
                    //START CREATE VALUE CELL
                    obj_ini=new Holder;                
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem          
                    obj_container=obj_cell;          
                    //END CREATE VALUE CELL
                    
                    obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);
                    obj_item.obj_holder.obj_propertySheet=this;              
                    obj_item.fn_setText(str_propertyValue);
                    obj_item.fn_setDesignProperty("str_propertyName", str_propertyName);             
                    obj_item.fn_setDesignProperty("str_linkId", obj_arg.obj_design.str_linkId);             
                    obj_item.fn_setDesignProperty("str_inputAction", obj_arg.obj_design.str_inputAction);             
                    bln_disabled=true;
                    if(obj_arg.obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){bln_disabled=false;}                            
                    if(this.obj_design.int_modeExecute===obj_holder.int_modeReadOnly){bln_disabled=true;}//this is affected if has dynamicParent              
                    if(typeof foo_val==="object"){bln_disabled=true;}        
                    if(bln_locked){bln_disabled=true;}              
                    obj_item.fn_setDisabled(bln_disabled);              
      
                    obj_item=this.fn_validateInput(obj_item);//revison - check backup
                    
                    return obj_item;
                      
                  }
                
                  fn_validateInputValue(str_name, str_value){      
                    return str_value;
                  }
                
                  fn_validateInput(obj_item){}//overidden
                  
                  fn_addNewPropertyRow(obj_arg){                            
                    
                    let obj_table=obj_arg.obj_table;
                    let obj_ini, arr;
                    let obj_row, obj_cell;
                    let obj_input;
                    let bln_disabled;              
                    let obj_selected=obj_project.obj_palettSelected;
                    let bln_locked=obj_selected.fn_getDesignLocked();              
                    
                  
                    let obj_item=obj_arg.obj_item;      
                    let obj_container=obj_arg.obj_container;
                  
                    obj_row=obj_table.fn_addItem();//BootItem
                  
                    //START CREATE NAME CELL
                    obj_ini=new Holder;               
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem          
                    obj_container=obj_cell;          
                    //END CREATE NAME CELL
      
                     obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);               
                     obj_item.obj_holder.obj_propertySheet=this;
                     obj_item.fn_setDesignProperty("str_linkId", obj_arg.obj_design.str_linkId);                           
                    obj_item.fn_setDesignProperty("str_inputAction", obj_arg.str_propertySourceChange + "Name");             
                    bln_disabled=true;
                    if(obj_arg.obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){bln_disabled=false;}                            
                    if(this.obj_design.int_modeExecute===obj_holder.int_modeReadOnly){bln_disabled=true;}//this is affected if has dynamicParent              
                    if(typeof foo_val==="object"){bln_disabled=true;}        
                    if(bln_locked){bln_disabled=true;}              
                    obj_item.fn_setDisabled(bln_disabled);              
                    //END TEXT INPUT TO NAME CELL
                    
                    //START CREATE VALUE CELL
                    obj_ini=new Holder;                   
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem          
                    obj_container=obj_cell;          
                    //END CREATE VALUE CELL
      
                    obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);
                    obj_item.obj_holder.obj_propertySheet=this;              
                    obj_item.fn_setDesignProperty("str_linkId", obj_arg.obj_design.str_linkId);             
                    obj_item.fn_setDesignProperty("str_inputAction", obj_arg.str_propertySourceChange + "Value");             
                    bln_disabled=true;
                    if(obj_arg.obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){bln_disabled=false;}                            
                    if(this.obj_design.int_modeExecute===obj_holder.int_modeReadOnly){bln_disabled=true;}//this is affected if has dynamicParent              
                    if(typeof foo_val==="object"){bln_disabled=true;}        
                    if(bln_locked){bln_disabled=true;}              
                    obj_item.fn_setDisabled(bln_disabled);
      
                    return obj_item;
                  }  
              }//END CLS
              //END TAG
              //END component/xapp_propertysheet
/*type: xapp_propertysheet//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_propertysheet_input//*/

            //XSTART component/xapp_propertysheet_input
              class xapp_propertysheet_input extends form_input{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                }
                fn_onChange(){                                                 
                  this.fn_setValue(this.dom_obj.value);                                                                  
                  this.obj_holder.obj_propertySheet.fn_onChangeInput(this);
                  this.fn_unsetEvent();                  
                }                                
              }//END CLS
              //END TAG
              //END component/xapp_propertysheet_input
/*type: xapp_propertysheet_input//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_queryterm_interface//*/
      //XSTART component/xapp_queryterm_interface
      class xapp_queryterm_interface extends form_fieldset{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.arr_button=[];
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}                                     
          //this.fn_setDisplayFlex(false);          
          this.fn_setText("Tag List");
          
        }        

        
        fn_getCountQueryTerm(){          
          return this.obj_holder.arr_button.length;
        }
        fn_getArrayQueryTerm(){          
          return this.obj_holder.arr_button;
        }
        
        fn_addQueryTerm(str_queryTerm, bln_startPosition=false){          

          //console.log("fn_addQueryTerm :" + str_queryTerm);

          let arr_button=this.fn_getArrayQueryTerm();
          for(let i=0;i<arr_button.length;i++){
            let obj_button=arr_button[i];
            if(str_queryTerm===obj_button.fn_getText()){
              //console.log("FOUND MATCH");
              return obj_button;
            }            
          }
          
          //console.log("NO FOUND MATCH");          
          

          if(this.obj_hideButton){
            this.obj_holder.obj_insertNextTo=this.obj_hideButton;
          }
          let obj_container, obj_button;
          obj_container=this;          
          obj_button=obj_container.fn_addContextItem("xapp_button_queryterm", bln_startPosition);                                                  
          obj_button.obj_parentInterface=this;          
          obj_button.fn_setText(str_queryTerm);          

          if(bln_startPosition){
            this.obj_holder.arr_button.unshift(obj_button);          
            obj_button.bln_wasEnabled=true;
          }          
          else{
            this.obj_holder.arr_button.push(obj_button);          
          }
          
          return obj_button;
          
        }        
        fn_queryTermButtonOnMouseDown(obj_button, e){          

          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnMouseDown(obj_button, e);
        }
        fn_queryTermButtonOnMouseUp(obj_button, e){
          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnMouseUp(obj_button, e);
        }
        fn_queryTermButtonOnDblClick(obj_button, e){                    
          
          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnDblClick(obj_button, e);
        }        
        fn_queryTermButtonOnClick(obj_button, e){                    
          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnClick(obj_button, e);
        }
        
        fn_disableQueryTerm(obj_button){          
        
          obj_button.bln_enabled=false;
          obj_button.fn_setOpacity("0.50");                    
        }
        fn_enableQueryTerm(obj_button){          
        
          obj_button.bln_enabled=true;
          obj_button.fn_setOpacity("1");                    

          let arr_button=this.fn_getArrayQueryTerm();
          obj_shared.fn_promoteArrayItem(arr_button, obj_button);          
          
          if(!obj_button.bln_wasEnabled){
            obj_button.bln_wasEnabled=true;
            //obj_shared.fn_domMoveElementToFront(obj_button.dom_obj);            
          }
          
          
        }
        
        fn_removeQueryTerm(obj_button){          
          //console.log("fn_removeQueryTerm");
          let obj_container=this;          
          obj_container.fn_removeItem(obj_button);              
          obj_shared.fn_removeObjectFromArray(this.obj_holder.arr_button, obj_button);                    
        }
      }//END CLS
      //END TAG
      //END component/xapp_queryterm_interface        
/*type: xapp_queryterm_interface//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_report_interface_fieldcriteria//*/
      //XSTART component/xapp_report_interface_fieldcriteria
      class xapp_report_interface_fieldcriteria extends form_fieldset{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}                                     
          //this.fn_setDisplayFlex(false);          
          this.fn_setText("Field Criteria");
        }        
      }//END CLS
      //END TAG
      //END component/xapp_report_interface_fieldcriteria        
/*type: xapp_report_interface_fieldcriteria//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_report_interface_fieldlist//*/
      //XSTART component/xapp_report_interface_fieldlist
      class xapp_report_interface_fieldlist extends form_fieldset{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}                                     
          //this.fn_setDisplayFlex(false);          
          this.fn_setText("Field List");
        }        
      }//END CLS
      //END TAG
      //END component/xapp_report_interface_fieldlist        
/*type: xapp_report_interface_fieldlist//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_row//*/

            //XSTART component/xapp_row
              class xapp_row extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_initializeRow(obj_paramRS){                  
                  
                  this.obj_paramRS=obj_paramRS;                                                                                          
                  

                  this.obj_paramRow={};                  
                  this.obj_paramRow.int_countColumn=0;                  
                  this.obj_paramRow.int_countSection=0;                                    
                  this.obj_paramRow.int_sectionColumnCount=0;   
                  
                  this.obj_paramRow.int_ordinalPosition=this.obj_paramRS.int_ordinalPosition;                                    
                  this.obj_paramRow.obj_paramRS=this.obj_paramRS;  
                  
                  this.obj_holder.obj_fieldset=this;//"menu" columns will be added to this row
                  

                  this.fn_computeMetaColumn();                                  
                  
                  this.fn_removeChildren();                                       
                }    
                  
                fn_preComputeColumn(){
                }

                fn_postComputeColumn(){}

                fn_computeMetaColumn(){ 
                  
                  let arr_item=this.obj_paramRow.arr_metaColumn=[];
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  let int_totalColumn=this.obj_paramRS.int_totalColumn;                  
                  let obj_metaData=this.obj_paramRow.obj_metaData={};                                   
                  
                  for (let i = 0; i < int_totalColumn;i++) {                                                                
                    let obj_metaColumn=obj_recordset.fn_getMetaColumn(i);                                                                                                    
                    arr_item.push(obj_metaColumn);                    
                    if(obj_metaColumn.IsMetaData){                                            
                      obj_metaData.bln_hasData=true;                                                                                        
                      obj_metaData[obj_metaColumn.MetaColumnName]=obj_metaColumn.str_value;                                            
                    }                    
                  }
                }

                fn_settingsColumnInterfaceLockedPin(str_exempt){
                
                  this.obj_paramRow.CustomPin=false;
                  let arr_column=this.obj_paramRow.arr_column;                                    
                  this.obj_paramRow.bln_interfaceLockedPin=true;
                  for(let i=0;i<arr_column.length;i++){

                    let obj_column=arr_column[i];                                        
                    let obj_metaColumn=obj_column.obj_metaColumn;                                        
                    if(obj_metaColumn.MetaColumnName.toLowerCase()!=='metacolumnname' && obj_metaColumn.MetaColumnName.toLowerCase()!=='metarowzname'){
                      continue;
                    }
                    
                    let bln_value=obj_shared.fn_inString(str_exempt, obj_metaColumn.str_value);                    
                    if(bln_value){                    
                      this.obj_paramRow.bln_interfaceLockedPin=false;
                      break;
                    }
                    
                  }                                     

                  
                  if(this.obj_paramRow.bln_interfaceLockedPin){

                    for(let i=0;i<arr_column.length;i++){

                      let obj_column=arr_column[i];                                        
                      obj_column.fn_settingsColumnInterfaceLockedPin();                      
                    }                                      

                  }
                }


                
                fn_computeColumns(){                  

                  this.obj_paramRow.arr_column=[];

                  let int_totalColumn=this.obj_paramRS.int_totalColumn;
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  
                  for (let i = 0; i < int_totalColumn; i++) {                                            
                    
                    this.fn_preComputeColumn();                    

                    let obj_metaColumn=obj_recordset.fn_getMetaColumn(i);                                                            
                    //console.log(obj_metaColumn);
                    this.obj_paramRow.obj_metaColumn=obj_metaColumn;                                        
                    //to do : check the column type
                    
                    this.fn_computeColumn(i);                    
                    
                    
                    this.obj_paramRow.int_countColumn++;                    
                    
                    this.fn_postComputeColumn();                                        
                  }

                  this.fn_postComputeColumns();                                       
                  
                } 
                
                fn_postComputeColumns(){                  
                  this.fn_parseColumns();
                }                

                fn_parseColumns(){

                  const arr_nameSummary=[];
                  const arr_valueSummary=[];
                  
                  let arr, i, obj_column;
                  arr=this.obj_paramRow.arr_column;                  
                  let obj_columnMarked;
                  for (i=0;i<arr.length;i++){                    
                    obj_column=arr[i];
                    if(obj_column.bln_isMarked){
                      obj_column.fn_onMarkColumn();
                    }
                    //console.log(obj_column);
                    //if(obj_column.obj_metaColumn.SectionTitle==="Meta"){
                    if(obj_column.obj_metaColumn.MetaColumnAPIName==="metadataid"){                      
                      obj_columnMarked=obj_column;
                    }
                    
                    let bln_addRecordSummary=obj_column.obj_metaColumn.RecordSummaryPin;
                    if(obj_column.obj_metaColumn.MetaPermissionTag.toLowerCase()==="#interface"){
                      if(!obj_userHome.Interface){
                        bln_addRecordSummary=false;                        
                      }
                      
                    }
                    
                    if(bln_addRecordSummary){
                      //console.log(obj_column);
                      //console.log(obj_column.obj_metaColumn);
                      //obj_column.fn_setHiddenPin(true);
                      let str_name=obj_column.obj_metaColumn.MetaLabel;
                      let str_value=obj_shared.fn_replace(obj_column.str_valueDisplay, "&nbsp;", "");                      
                      if(str_value){
                        //console.log("[" + str_value + "]");                        
                        arr_nameSummary.push(str_name);
                        arr_valueSummary.push(str_value);
                      }
                    }
                  }
                  
                  if(obj_columnMarked){//position Meta at End
                    let obj_parent=obj_columnMarked.fn_getParentComponent();                    
                    const childElement = obj_parent.dom_obj;
                    const parentElement = childElement.parentNode;                  
                    parentElement.removeChild(childElement);                        
                    parentElement.appendChild(childElement);
                    
                    let str_html=obj_shared.fn_getHTMLTable(arr_nameSummary, arr_valueSummary );                    
                    if(str_html){
                      let obj_control=obj_parent.fn_addContextItem("form_span");   
                      obj_control.fn_setText(str_html);
                      //obj_control.fn_setDisabled(true);
                    }
                  } 
                }



                
                fn_describeRow(){

                  let arr_item=this.obj_paramRow.arr_metaColumn;                  
                  console.log("arr_metaColumn.length: " + arr_item.length);                    
                  for (let i = 0; i < arr_item.length; i++) {                        
                    let obj_metaColumn=arr_item[i];
                    console.log("obj_metaColumn.str_name: " + obj_metaColumn.str_name);                    
                    console.log("obj_metaColumn.str_value: " + obj_metaColumn.str_value);
                    console.log(obj_metaColumn);                    
                    console.log("-----------------");                    
                  }
                  return false;
                }

                fn_getColumnViaName(str_name){
                  let str_lname=str_name.toLowerCase();                 
                  let arr_item=this.obj_paramRow.arr_column;                                    
                  for (let i = 0; i < arr_item.length; i++) {                        
                    let obj_column=arr_item[i];
                    let obj_metaColumn=obj_column.obj_metaColumn;                    
                 
                    if(obj_metaColumn.str_name.toLowerCase()===str_lname){                 
                      return obj_column;
                    }
                  }
                  
                  return false;
                }

                
                fn_getColumnViaNameSpecial(str_name){
                  let str_lname=str_name.toLowerCase();
                  //console.log("fn_getColumnViaName: " + str_lname);
                  //console.log("str_lname: " + str_lname);
                  let arr_item=this.obj_paramRow.arr_column;                  
                  
                  for (let i = 0; i < arr_item.length; i++) {                        
                    let obj_column=arr_item[i];
                    let obj_metaColumn=obj_column.obj_metaColumn;                    
                    //console.log("obj_metaColumn: " + obj_metaColumn.str_name.toLowerCase());
                    if(obj_metaColumn.str_name.toLowerCase()===str_lname){
                      //console.log("FOUND SEARCH FOR: " + str_lname);
                      return obj_column;
                    }
                  }
                  //console.log("NOT FOUND SEARCH FOR: " + str_lname);
                  return false;
                }
                
                fn_getColumnViaPosition(int_ordinalPosition){
                  return this.obj_paramRow.arr_column[int_ordinalPosition];                  
                }
                
                fn_computeColumn(int_countColumn){ 

                  let str_type, obj_column;
                  
                  str_type=this.obj_paramRS.str_typeColumn;                    
                  if(this.obj_paramRow.obj_metaColumn.MetaClassType){                                        
                    str_type=this.obj_paramRow.obj_metaColumn.MetaClassType;                    
                  }

                  obj_column=this.obj_holder.obj_fieldset.fn_addContextItem(str_type);   
                  
                  //console.log("str_type:" + str_type);
                  
                  if(obj_column){
                    this.obj_paramRow.arr_column.push(obj_column);                    
                    obj_column.fn_initializeColumn(this);//after value will now in place.                                        
                    obj_column.fn_computeField();                  
                  
                    this.fn_onComputecolumn(obj_column);                  
                  
                  }

                //obj_column.fn_debug();

                  
                }                                
                
                fn_onComputecolumn(obj_column){
                  this.obj_paramRS.obj_recordset.fn_onComputeColumn(obj_column);
                }

                fn_getColumnKey(obj_column=false){                                  
                }
                fn_getColumnDataId(){                  
                }
                fn_getColumnArchiveDate(){                
                }
                

                
                
              }//END CLS
              //END TAG
              //END component/xapp_row
/*type: xapp_row//*/
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
              }//END CLS
              //END TAG
              //END component/xapp_theme
/*type: xapp_theme//*/
/*END COMPONENT//*/


/*START COMPONENT//*/
/*type: xapp_widgetboard//*/

            //XSTART component/xapp_widgetboard
              class xapp_widgetboard extends xapp_component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("orange");}                  
                }
                fn_loadWidget(obj_row){                

                  let obj_item=this.fn_addContextItem("form_button");
                  if(obj_item){obj_item.fn_configureFromMeta(obj_row);}
                  return obj_item;

                }
              }//END CLS
              //END TAG
              //END component/xapp_widgetboard
/*type: xapp_widgetboard//*/
/*END COMPONENT//*/

//END LINKTABLE





//END LINKTABLE

//START COMPONENTMAP

//START AUTO GENERATED COMPONENT MAP
const obj_ComponentMap = new Map([['component', component],['xapp_ajax', xapp_ajax],['xapp_component', xapp_component],['form_fieldset', form_fieldset],['form_input', form_input],['tablecell', tablecell],['tableheader', tableheader],['tablerow', tablerow],['table', table],['form_button', form_button],['form_button_rich', form_button_rich],['xapp_menu_operation', xapp_menu_operation],['xapp_menu', xapp_menu],['form_menu_panel', form_menu_panel],['xapp_base', xapp_base],['xapp_console_container', xapp_console_container],['xapp_data', xapp_data],['xapp_dataform', xapp_dataform],['form_inputandbutton', form_inputandbutton],['xapp_button', xapp_button],['xapp_console_button', xapp_console_button],['form_form', form_form],['xapp_dashboard', xapp_dashboard],['xapp', xapp],['form_tablecell', form_tablecell],['form_inputandbutton_submit', form_inputandbutton_submit],['authorise_end', authorise_end],['block', block],['block_structure', block_structure],['form_anchor', form_anchor],['form_button_anchor', form_button_anchor],['form_button_icon', form_button_icon],['form_button_search', form_button_search],['form_button_showhide', form_button_showhide],['form_button_span', form_button_span],['form_checkbox', form_checkbox],['form_field', form_field],['form_hardrule', form_hardrule],['form_icon', form_icon],['form_iframe', form_iframe],['form_input_login_email', form_input_login_email],['form_input_login_pass', form_input_login_pass],['form_label', form_label],['form_legend', form_legend],['form_nonbreakingspace', form_nonbreakingspace],['form_panel', form_panel],['form_panellist', form_panellist],['form_radio', form_radio],['form_section', form_section],['form_select', form_select],['form_span', form_span],['form_tab', form_tab],['form_table', form_table],['form_tableheader', form_tableheader],['form_tablerow', form_tablerow],['form_tablist', form_tablist],['form_tabset', form_tabset],['form_text', form_text],['form_textarea', form_textarea],['lock', lock],['login_dashboard', login_dashboard],['loginpanelform', loginpanelform],['xapp_accordion', xapp_accordion],['xapp_button_general_archive_hide', xapp_button_general_archive_hide],['xapp_button_general_archive_show', xapp_button_general_archive_show],['xapp_button_general_form_down', xapp_button_general_form_down],['xapp_button_general_form_gap', xapp_button_general_form_gap],['xapp_button_general_form_group', xapp_button_general_form_group],['xapp_button_general_form_up', xapp_button_general_form_up],['xapp_button_general_row_hide', xapp_button_general_row_hide],['xapp_button_general_row_show', xapp_button_general_row_show],['xapp_button_general_use_task_date', xapp_button_general_use_task_date],['xapp_button_general_use_task_datetime', xapp_button_general_use_task_datetime],['xapp_button_navigate_desktop', xapp_button_navigate_desktop],['xapp_button_navigate_lobby', xapp_button_navigate_lobby],['xapp_button_navigate_login', xapp_button_navigate_login],['xapp_button_navigate_mall', xapp_button_navigate_mall],['xapp_button_navigate_newcolumn', xapp_button_navigate_newcolumn],['xapp_button_navigate_newrow', xapp_button_navigate_newrow],['xapp_button_navigate_office', xapp_button_navigate_office],['xapp_button_navigate_rowz', xapp_button_navigate_rowz],['xapp_button_navigate_settings', xapp_button_navigate_settings],['xapp_button_queryterm', xapp_button_queryterm],['xapp_column', xapp_column],['xapp_console', xapp_console],['xapp_console_search', xapp_console_search],['xapp_context_holder', xapp_context_holder],['xapp_data_childmenu', xapp_data_childmenu],['xapp_data_view', xapp_data_view],['xapp_dynamic_content', xapp_dynamic_content],['xapp_form_container_search', xapp_form_container_search],['xapp_menu_panel', xapp_menu_panel],['xapp_menuform', xapp_menuform],['xapp_propertysheet', xapp_propertysheet],['xapp_propertysheet_input', xapp_propertysheet_input],['xapp_queryterm_interface', xapp_queryterm_interface],['xapp_report_interface_fieldcriteria', xapp_report_interface_fieldcriteria],['xapp_report_interface_fieldlist', xapp_report_interface_fieldlist],['xapp_row', xapp_row],['xapp_theme', xapp_theme],['xapp_widgetboard', xapp_widgetboard]]);
//END AUTO GENERATED MAP


//END COMPONENTMAP

//START TEMPLATE


/*START COMPONENT//*/
/*type: TemplateCode//*/

//START Project.js
class Project extends lock{
    constructor(obj_ini) {
        super(obj_ini); // call the super class constructor
        
        /*
        THe use of this wrapper function allows items to be called form database , rather than hard-written into the code.        
        //e.g it allows the use of a simple Main procedure "new wrapper" which is name agnostic.
        //*/
    }  
    fn_onLoad(){
        super.fn_onLoad();        
        //console.log("Project Loaded: " + this.obj_design.str_name);
        //alert(obj_projectTarget)
        
    }    

    fn_applyThemeStructure(){
        let obj_theme, obj_themeItem;
        obj_theme=this.obj_theme;
        //some code requires themeobjects empty or not

        if(!obj_theme){
            return;
        }

        this.obj_themeBackground=this.fn_getThemeObject("form_blockbackground");
        this.obj_themeMidground=this.fn_getThemeObject("form_blockmidground");
        this.obj_themeForground=this.fn_getThemeObject("form_blockforground");
        this.obj_themeHighlight=this.fn_getThemeObject("form_blockhighlight");          


        obj_theme.str_backGround=this.obj_themeBackground.fn_getStyleProperty("background");
        obj_theme.str_midGround=this.obj_themeMidground.fn_getStyleProperty("background");
        obj_theme.str_forGround=this.obj_themeForground.fn_getStyleProperty("background");
        obj_theme.str_highLight=this.obj_themeHighlight.fn_getStyleProperty("background");

        /*        
        //*/
        
        /*
        //options reuqired for             
        borderColor:relevant themecolor
        color:relevant themecolor
        backgroundColor:relevant themecolor        

        borderStyle:"solid",dotted,dashed etc
        borderWidth:on,off
        marginBottom:large/small or a em size, not zero        
        //*/
        
        this.obj_themeProject={
            //*//STRUCTURE                
            display:"flex",                                    
            fontSize:"1.0rem",
            display:"flex",                                    
            padding:"1.0em",                                    
            gap:"1.0em",                                    
            fontWeight:"normal",                                    
            cusor:"pointer",                                                
            justifyContent:"center",
            alignItems:"center",                      
            //STRUCTURE                              
            //*/
        
            //*//OPTION
            borderColor:"orange",                    
            color:"white",            
            backgroundColor:"rgb(65,65,65)",

            borderWidth:"0em",
            borderRadius:"0em",            
            borderStyle:"solid",           
            marginBottom:"0em",            
            //OPTION
            //*/
        }                               
        
        
        /////////////////////////////////////////
        /////////////////////////////////////////
        //MENUBUTTON
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeProject);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.3rem";                
        obj_themeItem.fontWeight="bold";                        
        obj_themeItem.padding="1.0em";                                
        obj_themeItem.width="100%";        
        obj_themeItem.cursor="pointer";                               
        //STRUCTURE   
        //*/

        //*//OPTION                
        obj_themeItem.borderColor=obj_theme.str_forGround;
        obj_themeItem.color=obj_theme.str_forGround;
        obj_themeItem.backgroundColor=obj_theme.str_midGround;
        obj_themeItem.borderStyle="solid";
        obj_themeItem.bln_border=false;
        obj_themeItem.int_borderWidth=0;
        obj_themeItem.bln_margin=false;
        obj_themeItem.int_marginEnd=0;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeMenuButton=obj_themeItem;        
        //MENUBUTTON
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //CHILDMENU
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeMenuButton);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.2rem";
        obj_themeItem.padding="1.0em";                 
        //STRUCTURE   
        //*/

        //*//OPTION        
        obj_themeItem.bln_margin=false;
        obj_themeItem.int_marginEnd=0.5;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeChildMenu=obj_themeItem;        
        //CHILDMENU             
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //DYNAMICMENU
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeChildMenu);                
        //*//STRUCTURE                   
        //STRUCTURE   
        //*/

        //*//OPTION        
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeDynamicMenu=obj_themeItem;        
        //DYNAMICMENU
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //FORMBUTTON
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeProject);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.1rem";                        
        obj_themeItem.fontWeight="bold";  
        obj_themeItem.cursor="pointer";                              
        //STRUCTURE   
        //*/

        //*//OPTION
        obj_themeItem.borderColor=obj_theme.str_midGround;
        obj_themeItem.color=obj_theme.str_midGround;        
        obj_themeItem.backgroundColor=obj_theme.str_forGround;        
        obj_themeItem.borderStyle="solid";        
        obj_themeItem.bln_border=false;
        obj_themeItem.int_borderWidth=0.5;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeFormButton=obj_themeItem;        
        //FORMBUTTON
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //FORMINPUT
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeProject);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.1rem";                        
        obj_themeItem.fontWeight="normal";                        
        //STRUCTURE   
        //*/

        //*//OPTION
        obj_themeItem.borderColor=obj_theme.str_midGround;
        obj_themeItem.color="dark gray";        
        obj_themeItem.backgroundColor=obj_theme.str_forGround;        
        obj_themeItem.borderStyle="solid";
        obj_themeItem.bln_border=false;
        obj_themeItem.int_borderWidth=0.5;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeFormInput=obj_themeItem;        
        //FORMINPUT
        /////////////////////////////////////////
        /////////////////////////////////////////
        
        
    }

    fn_applyThemeOption(obj_themeItem){

        /*
        obj_themeItem.borderColor;
        obj_themeItem.color=;        
        obj_themeItem.backgroundColor;        
        obj_themeItem.borderStyle;
        obj_themeItem.bln_border;
        obj_themeItem.int_borderWidth;
        obj_themeItem.bln_margin;
        obj_themeItem.int_marginEnd;
        //*/
      
      let int_borderWidth=0;            
      if(obj_themeItem.bln_border){
        int_borderWidth=0.5;            
        if(obj_themeItem.int_borderWidth){          
          int_borderWidth=obj_themeItem.int_borderWidth;                
        }
      }
      const int_borderRadius=(2*int_borderWidth);
      obj_themeItem.borderWidth=int_borderWidth + "em";      
      obj_themeItem.borderRadius=int_borderRadius + "em";                    

      let int_marginEnd=0.1;              
      if(obj_themeItem.bln_margin){
        int_marginEnd=0.5;                
        if(obj_themeItem.int_marginEnd){
          int_marginEnd=obj_themeItem.int_marginEnd;          
        }
      }
      obj_themeItem.marginBottom=int_marginEnd + "em";            
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

  /*START DESIGN BOOT VARIABLE//*/
obj_boot.obj_design.int_idRecord=6014; 
/*END DESIGN BOOT VARIABLE//*/
//END Project.js


/*type: TemplateCode//*/
/*END COMPONENT//*/



//END TEMPLATE

//START JSONMAP


/*START INSTANCE JSON MAP//*/
var obj_InstanceJSONMap = new Map([
[6014, {"obj_design":{"int_idRecord":6014,"str_idXDesign":"myId_60426365","str_name":"lock","str_nameShort":"lock","str_type":"lock","str_tag":"lock","str_classExtend":"xapp","str_createdDate":"2022-09-11 20:12:26","str_modifiedDate":"2022-09-11 20:12:26","str_categoryName":"Lock","bln_isLocalHome":true,"arr_item":[{"obj_design":{"int_idRecord":77570,"str_type":"xapp_theme"}},{"obj_design":{"int_idRecord":77532,"str_type":"authorise_end"}},{"obj_design":{"int_idRecord":"76967","str_type":"xapp_dynamic_content"}},{"obj_design":{"int_idRecord":"76968","str_type":"xapp_context_holder"}}],"bln_classController":true,"bln_editPin":true,"str_themeType":"lock","int_radioDisplayMode":3,"str_text":"CRUD","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_60426365"},"obj_domStyle":{"visibility":"visible"},"bln_togglePeersPin":true,"bln_closePeersPin":true,"MetaDataViewId":101426,"MetaDataViewName":"meta_data","MetaUserViewId":1,"MetaUserViewName":"meta_user","MetaLinkViewId":100475,"MetaLinkViewName":"meta_link","user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_60426365"},"obj_theme":{"obj_design":{"int_idRecord":77570,"str_type":"xapp_theme"}},"obj_themeBackground":{"obj_design":{"int_idRecord":"77774","str_type":"form_span"}},"obj_themeMidground":{"obj_design":{"int_idRecord":"77775","str_type":"form_span"}},"obj_themeForground":{"obj_design":{"int_idRecord":"77776","str_type":"form_span"}},"obj_themeHighlight":{"obj_design":{"int_idRecord":"77777","str_type":"form_span"}},"obj_themeProject":{"display":"flex","fontSize":"1.0rem","padding":"1.0em","gap":"1.0em","fontWeight":"normal","cusor":"pointer","justifyContent":"center","alignItems":"center","borderColor":"orange","color":"white","backgroundColor":"rgb(65,65,65)","borderWidth":"0em","borderRadius":"0em","borderStyle":"solid","marginBottom":"0em"},"obj_themeMenuButton":{"display":"flex","fontSize":"1.3rem","padding":"1.0em","gap":"1.0em","fontWeight":"bold","cusor":"pointer","justifyContent":"center","alignItems":"center","borderColor":"white","color":"white","backgroundColor":"rgb(64, 169, 236)","borderWidth":"0em","borderRadius":"0em","borderStyle":"solid","marginBottom":"0.1em","width":"100%","cursor":"pointer","int_borderWidth":0,"int_marginEnd":0},"obj_themeChildMenu":{"display":"flex","fontSize":"1.2rem","padding":"1.0em","gap":"1.0em","fontWeight":"bold","cusor":"pointer","justifyContent":"center","alignItems":"center","borderColor":"white","color":"white","backgroundColor":"rgb(64, 169, 236)","borderWidth":"0em","borderRadius":"0em","borderStyle":"solid","marginBottom":"0.1em","width":"100%","cursor":"pointer","int_borderWidth":0,"int_marginEnd":0.5},"obj_themeDynamicMenu":{"display":"flex","fontSize":"1.2rem","padding":"1.0em","gap":"1.0em","fontWeight":"bold","cusor":"pointer","justifyContent":"center","alignItems":"center","borderColor":"white","color":"white","backgroundColor":"rgb(64, 169, 236)","borderWidth":"0em","borderRadius":"0em","borderStyle":"solid","marginBottom":"0.1em","width":"100%","cursor":"pointer","int_borderWidth":0,"int_marginEnd":0.5},"obj_themeFormButton":{"display":"flex","fontSize":"1.1rem","padding":"1.0em","gap":"1.0em","fontWeight":"bold","cusor":"pointer","justifyContent":"center","alignItems":"center","borderColor":"rgb(64, 169, 236)","color":"rgb(64, 169, 236)","backgroundColor":"white","borderWidth":"0em","borderRadius":"0em","borderStyle":"solid","marginBottom":"0.1em","cursor":"pointer","int_borderWidth":0.5},"obj_themeFormInput":{"display":"flex","fontSize":"1.1rem","padding":"1.0em","gap":"1.0em","fontWeight":"normal","cusor":"pointer","justifyContent":"center","alignItems":"center","borderColor":"rgb(64, 169, 236)","color":"dark gray","backgroundColor":"white","borderWidth":"0em","borderRadius":"0em","borderStyle":"solid","marginBottom":"0.1em","int_borderWidth":0.5}}],
[7585, {"obj_design":{"int_idRecord":7585,"str_idXDesign":"myId_98446896","str_name":"form_inputandbutton_input","str_nameShort":"form_inputandbutton_input","str_type":"form_input","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_classController":true,"bln_lockComponent":true,"bln_mouseDown":true,"bln_debug":true,"str_categoryName":"Other","str_idProject":"notset","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"","str_lastVersionDate":"notset","str_value":""},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"user_agent":"Firefox"}],
[7775, {"obj_design":{"int_idRecord":7775,"str_idXDesign":"myId_71626268","str_name":"form_context","str_nameShort":"form_context","str_type":"xapp_context_holder","str_tag":"form_context","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"str_themeType":"xapp_context_holder","bln_isLocalHome":true,"str_categoryName":"Form","bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":77012,"str_type":"form_form"}},{"obj_design":{"int_idRecord":77018,"str_type":"form_menu_panel"}},{"obj_design":{"int_idRecord":77019,"str_type":"form_panel"}},{"obj_design":{"int_idRecord":76753,"str_type":"form_iframe"}},{"obj_design":{"int_idRecord":77020,"str_type":"form_section"}},{"obj_design":{"int_idRecord":77024,"str_type":"form_field"}},{"obj_design":{"int_idRecord":77025,"str_type":"form_textarea"}},{"obj_design":{"int_idRecord":77084,"str_type":"form_checkbox"}},{"obj_design":{"int_idRecord":77026,"str_type":"form_input"}},{"obj_design":{"int_idRecord":"77335","str_type":"form_radio"}},{"obj_design":{"int_idRecord":77490,"str_type":"form_button"}},{"obj_design":{"int_idRecord":77489,"str_type":"form_button_rich"}},{"obj_design":{"int_idRecord":77379,"str_type":"form_button_search"}},{"obj_design":{"int_idRecord":77491,"str_type":"form_button_showhide"}},{"obj_design":{"int_idRecord":77195,"str_type":"form_tab"}},{"obj_design":{"int_idRecord":"77027","str_type":"form_select"}},{"obj_design":{"int_idRecord":77030,"str_type":"form_inputandbutton"}},{"obj_design":{"int_idRecord":77032,"str_type":"block"}},{"obj_design":{"int_idRecord":76764,"str_type":"form_table"}},{"obj_design":{"int_idRecord":76766,"str_type":"form_tablerow"}},{"obj_design":{"int_idRecord":76767,"str_type":"form_tablecell"}},{"obj_design":{"int_idRecord":76765,"str_type":"form_tableheader"}},{"obj_design":{"int_idRecord":77033,"str_type":"form_hardrule"}},{"obj_design":{"int_idRecord":"77337","str_type":"form_nonbreakingspace"}},{"obj_design":{"int_idRecord":77034,"str_type":"form_anchor"}},{"obj_design":{"int_idRecord":77381,"str_type":"form_icon"}},{"obj_design":{"int_idRecord":77184,"str_type":"form_fieldset"}},{"obj_design":{"int_idRecord":77187,"str_type":"form_legend"}},{"obj_design":{"int_idRecord":77192,"str_type":"form_tabset"}},{"obj_design":{"int_idRecord":77339,"str_type":"form_label"}},{"obj_design":{"int_idRecord":77341,"str_type":"form_span"}}],"bln_isContextHolder":true,"bln_lockComponent":true,"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_71626268"},"obj_domStyle":{"flex-flow":"wrap","gap":"10px","display":"flex"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_71626268"}}],
[75368, {"obj_design":{"int_idRecord":75368,"str_idXDesign":"myId_67217171","str_name":"menu_context","str_nameShort":"menu_context","str_type":"xapp_context_holder","str_tag":"menu_context","bln_registerAtContainer":true,"str_classExtend":"xapp_ajax","str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"str_themeType":"xapp_context_holder","bln_isLocalHome":true,"str_categoryName":"Xapp","bln_isContextHolder":true,"bln_lockComponent":true,"bln_classController":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":77082,"str_type":"xapp_base"}},{"obj_design":{"int_idRecord":77451,"str_type":"xapp_menu"}},{"obj_design":{"int_idRecord":76683,"str_type":"xapp_menuform"}},{"obj_design":{"int_idRecord":76596,"str_type":"xapp_context_holder"}},{"obj_design":{"int_idRecord":76650,"str_type":"xapp_menu_operation"}},{"obj_design":{"int_idRecord":76146,"str_type":"xapp_menu_panel"}},{"obj_design":{"int_idRecord":"77454","str_type":"xapp_console"}},{"obj_design":{"int_idRecord":76771,"str_type":"xapp_component"}},{"obj_design":{"int_idRecord":76255,"str_type":"xapp_dashboard"}},{"obj_design":{"int_idRecord":76171,"str_type":"xapp_widgetboard"}},{"obj_design":{"int_idRecord":76677,"str_type":"xapp_accordion"}},{"obj_design":{"int_idRecord":76799,"str_type":"xapp_propertysheet"}},{"obj_design":{"int_idRecord":76801,"str_type":"xapp_propertysheet_input"}}],"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_67217171"},"obj_domStyle":{"flex-flow":"wrap","gap":"10px","display":"flex"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_67217171"}}],
[75418, {"obj_design":{"int_idRecord":75418,"str_idXDesign":"myId_16137562","str_name":"xapp_console_button","str_nameShort":"xapp_console_button","str_type":"xapp_console_button","str_themeType":"form_button","str_tag":"button","bln_registerAtContainer":true,"str_createdDate":"2022-11-20 23:26:20","str_modifiedDate":"2022-11-20 23:26:20","bln_editPin":true,"str_text":"xapp_console_button","bln_classController":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_classExtend":"xapp_button","bln_lockComponent":true,"str_categoryName":"Xtra"},"obj_domProperty":{"innerText":"My Button","innerHTML":"xapp_console_button"},"obj_domStyle":{"padding":"10px"}}],
[76146, {"obj_design":{"int_idRecord":76146,"str_idXDesign":"myId_11592266","str_name":"xapp_menu_panel","str_nameShort":"xapp_menu_panel","str_type":"xapp_menu_panel","str_themeType":"form_menu_panel","str_tag":"xapp_menu_panel","bln_registerAtContainer":true,"str_createdDate":"2022-11-15 08:47:57","str_modifiedDate":"2022-11-15 08:47:57","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_classExtend":"form_menu_panel","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"flexdirection":"column","gap":"10px","padding":"10px","background":"grey","display":"flex","flex flow":"column wrap","flex-direction":"column","column":"wrap","flex-wrap":"wrap"}}],
[76171, {"obj_design":{"int_idRecord":76171,"str_idXDesign":"myId_25555422","str_name":"xapp_widgetboard","str_nameShort":"xapp_widgetboard","str_type":"xapp_widgetboard","str_tag":"xapp_widgetboard","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_classExtend":"xapp_component"},"obj_domStyle":{"flex-direction":"column","padding":"10px","flex-wrap":"wrap","flex-flow":"row wrap","border":"1px solid white","gap":"10px","display":"none"}}],
[76255, {"obj_design":{"int_idRecord":76255,"str_idXDesign":"myId_81785083","str_name":"xapp_dashboard","str_nameShort":"xapp_dashboard","str_type":"xapp_dashboard","str_tag":"xapp_dashboard","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_classExtend":"xapp_component","bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"form_section"},"obj_domStyle":{"flex-direction":"column","flex-wrap":"wrap","flex-flow":"row wrap","border":"1px solid white","gap":"10px","display":"none","padding":"0px"}}],
[76394, {"obj_design":{"int_idRecord":76394,"str_idXDesign":"myId_91985606","str_name":"xapp_menu_context_holder","str_nameShort":"xapp_menu_context_holder","str_type":"xapp_context_holder","str_tag":"xapp_menu_context_holder","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"bln_isLocalHome":true,"bln_isContextHolder":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":7775,"str_type":"xapp_context_holder"}},{"obj_design":{"int_idRecord":75368,"str_type":"xapp_context_holder"}},{"obj_design":{"int_idRecord":76686,"str_type":"xapp_context_holder"}}],"bln_classController":"false","bln_lockComponent":true,"str_categoryName":"Xapp","str_themeType":"xapp_context_holder"},"obj_domProperty":{"Id":"myId_91985606"},"obj_domStyle":{"flex flow":"row wrap","flex-flow":"row wrap","gap":"10px","display":"none"},"dom_objContentContainer":{"Id":"myId_91985606"}}],
[76596, {"obj_design":{"int_idRecord":76596,"str_idXDesign":"myId_58935386","str_name":"menu_console","str_nameShort":"menu_console","str_type":"xapp_context_holder","str_tag":"menu_console","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"str_themeType":"xapp_context_holder","bln_isLocalHome":true,"bln_isContextHolder":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":76746,"str_type":"xapp_console_container"}},{"obj_design":{"int_idRecord":77152,"str_type":"xapp_button"}},{"obj_design":{"int_idRecord":75418,"str_type":"xapp_console_button"}},{"obj_design":{"int_idRecord":76655,"str_type":"xapp_console_container"}},{"obj_design":{"int_idRecord":76626,"str_type":"xapp_form_container_search"}},{"obj_design":{"int_idRecord":76605,"str_type":"xapp_console_container"}},{"obj_design":{"int_idRecord":77171,"str_type":"xapp_button_queryterm"}},{"obj_design":{"int_idRecord":77173,"str_type":"xapp_queryterm_interface"}},{"obj_design":{"int_idRecord":77200,"str_type":"xapp_report_interface_fieldlist"}},{"obj_design":{"int_idRecord":77201,"str_type":"xapp_report_interface_fieldcriteria"}}],"bln_classController":"false","str_categoryName":"Other","bln_lockComponent":true,"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_58935386"},"obj_domStyle":{"gap":"10px","flex-flow":"row wrap","display":"flex"},"dom_objContentContainer":{"Id":"myId_58935386"}}],
[76605, {"obj_design":{"int_idRecord":76605,"str_idXDesign":"myId_36985869","str_name":"xapp_console_container_general","str_nameShort":"xapp_console_container_general","str_type":"xapp_console_container","str_tag":"xapp_console_container_general","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","arr_item":[{"obj_design":{"int_idRecord":77396,"str_type":"xapp_button_navigate_settings"}},{"obj_design":{"int_idRecord":77037,"str_type":"xapp_button_navigate_mall"}},{"obj_design":{"int_idRecord":77397,"str_type":"xapp_button_navigate_desktop"}},{"obj_design":{"int_idRecord":77485,"str_type":"xapp_button_navigate_lobby"}},{"obj_design":{"int_idRecord":77486,"str_type":"xapp_button_navigate_rowz"}},{"obj_design":{"int_idRecord":77038,"str_type":"xapp_button_navigate_office"}},{"obj_design":{"int_idRecord":77430,"str_type":"xapp_button_navigate_login"}},{"obj_design":{"int_idRecord":77496,"str_type":"xapp_button_navigate_newrow"}},{"obj_design":{"int_idRecord":77497,"str_type":"xapp_button_navigate_newcolumn"}},{"obj_design":{"int_idRecord":77520,"str_type":"xapp_button_general_archive_hide"}},{"obj_design":{"int_idRecord":77519,"str_type":"xapp_button_general_archive_show"}},{"obj_design":{"int_idRecord":77530,"str_type":"xapp_button_general_use_task_date"}},{"obj_design":{"int_idRecord":77531,"str_type":"xapp_button_general_use_task_datetime"}},{"obj_design":{"int_idRecord":77517,"str_type":"xapp_button_general_row_hide"}},{"obj_design":{"int_idRecord":77518,"str_type":"xapp_button_general_row_show"}},{"obj_design":{"int_idRecord":77523,"str_type":"xapp_button_general_form_up"}},{"obj_design":{"int_idRecord":77522,"str_type":"xapp_button_general_form_down"}},{"obj_design":{"int_idRecord":77524,"str_type":"xapp_button_general_form_gap"}},{"obj_design":{"int_idRecord":77525,"str_type":"xapp_button_general_form_group"}}],"bln_lockComponent":true,"str_categoryName":"Xapp","str_themeType":"form_container","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_36985869"},"obj_domStyle":{"str_name":"crud_console_record_control","display":"flex","gap":"10px","backkground":"red","flex-flow":"row wrap","border":"0px solid purple"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_36985869"}}],
[76626, {"obj_design":{"int_idRecord":76626,"str_idXDesign":"myId_66136639","str_name":"xapp_form_container_search","str_nameShort":"xapp_form_container_search","str_type":"xapp_form_container_search","str_tag":"form","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"bln_isLocalHome":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":76627,"str_type":"xapp_console_search"}}],"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"form_section","str_classExtend":"xapp_console_container","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_66136639"},"obj_domStyle":{"display":"flex","flex-flow":"row wrap","gap":"10px"},"dom_objContentContainer":{"1":{"Id":"myId_50437881","aria-label":"New Record"},"Id":"myId_66136639"}}],
[76627, {"obj_design":{"int_idRecord":76627,"str_idXDesign":"myId_08666691","str_name":"xapp_console_search","str_nameShort":"xapp_console_search","str_type":"xapp_console_search","str_tag":"xapp_console_search","bln_registerAtContainer":true,"str_createdDate":"2022-11-12 12:20:33","str_modifiedDate":"2022-11-12 12:20:33","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":7585,"str_type":"form_input"}},{"obj_design":{"int_idRecord":77500,"str_type":"form_button_search"}}],"str_classExtend":"form_inputandbutton","bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xapp","str_themeType":"form_container","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_08666691"},"obj_domStyle":{"display":"flex","flex-flow":"row wrap","gap":"1em","border":"0px solid purple"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_08666691"}}],
[76650, {"obj_design":{"int_idRecord":76650,"str_idXDesign":"myId_56611515","str_name":"xapp_menu_operation","str_nameShort":"xapp_menu_operation","str_type":"xapp_menu_operation","str_tag":"xapp_menu_operation","str_createdDate":"2022-02-02 20:04:57","str_modifiedDate":"2022-02-02 20:04:57","bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"Xtra","bln_createRelease":"false","bln_isLocalHome":true,"bln_classController":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_lockComponent":true,"str_text":"xapp_menu_operation","str_themeType":"xapp_menu_operation","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"form_button_rich","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"xDesign_MenuButtonClick":"fn_MenuButtonClick","innerText":"xapp_menu_operation","innerHTML":"xapp_menu_operation"},"obj_domStyle":{"padding-bottom":"2px"},"user_agent":"Firefox","dom_objContentContainer":{"xDesign_MenuButtonClick":"fn_MenuButtonClick"}}],
[76655, {"obj_design":{"int_idRecord":76655,"str_idXDesign":"myId_51089095","str_name":"xapp_console_container","str_nameShort":"xapp_console_container","str_type":"xapp_console_container","str_tag":"xapp_console_container","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"bln_isLocalHome":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Anchor","str_themeType":"form_section","str_classExtend":"xapp_base","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"display":"flex","flex-flow":"row wrap","gap":"10px","justify-content":"end"}}],
[76677, {"obj_design":{"int_idRecord":76677,"str_idXDesign":"myId_11651443","str_name":"xapp_accordion","str_nameShort":"xapp_accordion","str_type":"xapp_accordion","str_tag":"xapp_accordion","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:51:10","str_modifiedDate":"2022-11-01 21:51:10","bln_editPin":true,"str_themeType":"xapp_accordion","bln_isLocalHome":true,"blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xapp","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"width":"100%","display":"block"}}],
[76683, {"obj_design":{"int_idRecord":76683,"str_idXDesign":"myId_37375355","str_name":"xapp_menuform","str_nameShort":"xapp_menuform","str_type":"xapp_menuform","str_tag":"button","str_createdDate":"2022-02-02 20:04:57","str_modifiedDate":"2022-02-02 20:04:57","str_text":"xapp_menuform","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_classController":true,"bln_editPin":true,"str_themeType":"menu_button","bln_registerAtContainer":true,"bln_lockComponent":true,"str_classExtend":"xapp_menu","str_categoryName":"Xapp","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset","str_icon":"star"},"obj_domProperty":{"innerText":"xapp_menuform","innerHTML":"xapp_menuform","xDesign_MenuButtonClick":"fn_MenuButtonClick","Id":"myId_37375355"},"obj_domStyle":{"padding":"1em","font-size":"1rem","align-text":"center","margin-bottom":"1em","width":"100%","display":"flex","background":"rgb(65,65,65)","padding":"1em","color":"orange","border":"0.5rem solid orange"},"bln_enabled":true,"str_defaultTypeMenu":"xapp_menuform","str_defaultTypeData":"xapp_dataform_view","str_defaultTypeDataChildMenu":"xapp_dataform_childmenu","obj_meta":{"bln_togglePeersPin":true,"str_metaConstraintName":"","str_metaRowzName":"","int_idMetaRowz":0,"int_idParentMetaRowz":0,"int_idMetaView":0,"bln_viewPin":0,"str_buttonConsole":"","MetaPermissionTag":"100","str_metaTypeDashboard":"","str_metaTypeData":"","str_optionChildMenu":"","str_text":"","int_joinType":0},"str_optionData":"Data","str_optionReport":"Report","str_optionWidget":"Widget","str_optionDashboard":"Dashboard","str_optionMenu":"Menu","str_optionMenuForm":"MenuForm","str_listSeparator":"-","bln_constraintKeyPin":true,"int_totalRowCount":0,"user_agent":"Firefox"}],
[76685, {"obj_design":{"int_idRecord":76685,"str_idXDesign":"myId_62156312","str_name":"xapp_data","str_nameShort":"xapp_data","str_type":"xapp_data","str_tag":"xapp_data","str_createdDate":"2022-02-02 20:10:52","str_modifiedDate":"2022-02-02 20:10:52","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_classExtend":"xapp_ajax","bln_registerAtContainer":true,"bln_dynamicPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"str_themeType":"xapp_data","bln_classController":true,"str_categoryName":"Xtra"},"obj_domStyle":{"flex-wrap":"wrap","display":"flex","gap":"10px","flex-direction":"column"},"str_defaultTypeRow":"xapp_row","str_defaultTypeColumn":"xapp_column"}],
[76686, {"obj_design":{"int_idRecord":76686,"str_idXDesign":"myId_99139996","str_name":"xapp_context_data","str_nameShort":"xapp_context_data","str_type":"xapp_context_holder","str_tag":"xapp_context_data","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"bln_isLocalHome":true,"bln_isContextHolder":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":76689,"str_type":"xapp_row"}},{"obj_design":{"int_idRecord":76687,"str_type":"xapp_column"}},{"obj_design":{"int_idRecord":76690,"str_type":"xapp_data_childmenu"}},{"obj_design":{"int_idRecord":76688,"str_type":"xapp_data_view"}},{"obj_design":{"int_idRecord":76685,"str_type":"xapp_data"}}],"str_categoryName":"Xtra","bln_lockComponent":true,"bln_classController":"false","str_themeType":"xapp_context_holder"},"obj_domProperty":{"Id":"myId_99139996"},"obj_domStyle":{"flex-flow":"wrap","gap":"10px","display":"flex"},"dom_objContentContainer":{"Id":"myId_99139996"}}],
[76687, {"obj_design":{"int_idRecord":76687,"str_idXDesign":"myId_17696919","str_name":"xapp_column","str_nameShort":"xapp_column","str_type":"xapp_column","str_tag":"xapp_column","bln_registerAtContainer":true,"str_createdDate":"2022-11-20 18:03:50","str_modifiedDate":"2022-11-20 18:03:50","bln_editPin":true,"str_context":"crud_context","bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"bln_classController":true,"str_categoryName":"Xtra","str_themeType":"xapp_column"},"obj_domStyle":{"display":"flex","flex-flow":"column wrap"}}],
[76688, {"obj_design":{"int_idRecord":76688,"str_idXDesign":"myId_81939143","str_name":"xapp_data_view","str_nameShort":"xapp_data_view","str_type":"xapp_data_view","str_tag":"xapp_data_view","str_createdDate":"2022-02-02 20:10:52","str_modifiedDate":"2022-02-02 20:10:52","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_classExtend":"xapp_data","bln_registerAtContainer":true,"bln_dynamicPin":true,"bln_classController":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"xapp_data_view"},"obj_domStyle":{"flex-wrap":"wrap","display":"flex","gap":"10px","flex-direction":"column","width":"100%"},"str_defaultTypeRow":"xapp_row","str_defaultTypeColumn":"xapp_column"}],
[76689, {"obj_design":{"int_idRecord":76689,"str_idXDesign":"myId_83616961","str_name":"xapp_row","str_nameShort":"xapp_row","str_type":"xapp_row","str_themeType":"xapp_rowform","str_tag":"xapp_row","bln_registerAtContainer":true,"str_createdDate":"2022-11-20 17:23:17","str_modifiedDate":"2022-11-20 17:23:17","bln_editPin":true,"str_context":"crud_context","bln_dynamicPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra"},"obj_domStyle":{"gap":"10px","display":"flex","flex-flow":"row wrap"}}],
[76690, {"obj_design":{"int_idRecord":76690,"str_idXDesign":"myId_21162586","str_name":"xapp_data_childmenu","str_nameShort":"xapp_data_childmenu","str_type":"xapp_data_childmenu","str_tag":"xapp_data_childmenu","str_createdDate":"2022-02-02 20:10:52","str_modifiedDate":"2022-02-02 20:10:52","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_classExtend":"xapp_data","bln_registerAtContainer":true,"bln_dynamicPin":true,"bln_classController":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"blnIsTag":true,"str_categoryName":"Xtra","str_themeType":"xapp_data_childmenu"},"obj_domStyle":{"flex-wrap":"wrap","display":"flex","gap":"10px","flex-direction":"column"},"str_defaultTypeRow":"xapp_row","str_defaultTypeColumn":"xapp_column"}],
[76746, {"obj_design":{"int_idRecord":76746,"str_idXDesign":"myId_63061603","str_name":"xapp_console_container_dashboard","str_nameShort":"xapp_console_container_dashboard","str_type":"xapp_console_container","str_tag":"xapp_console_container_dashboard","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","bln_lockComponent":true,"str_categoryName":"Xtra","xapp_console_container_dashboard":true,"str_themeType":"form_section"},"obj_domStyle":{"str_name":"crud_console_record_control","display":"flex","gap":"10px","backkground":"red","flex-flow":"row wrap","justify-content":"end","border":"0px solid purple"}}],
[76753, {"obj_design":{"str_tag":"iframe","str_type":"form_iframe","str_idXDesign":"myId_11161693","str_name":"form_iframe","str_nameShort":"form_iframe","str_themeType":"form_iframe","int_idRecord":76753,"str_createdDate":"2023-06-24 10:22:13","str_modifiedDate":"2023-06-24 10:22:13","blnIsTag":true,"bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_registerAtContainer":true,"bln_lockComponent":true,"str_categoryName":"Xtra","bln_registerAtProject":true,"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"name":"xdesign-frame"},"obj_domStyle":{"width":"100%","height":"250px","border":"10px outset grey","corner-radius ":"4px","corner-radius":"4px","border-radius":"4px"}}],
[76764, {"obj_design":{"int_idRecord":76764,"str_idXDesign":"myId_10601224","str_name":"form_table","str_nameShort":"form_table","str_type":"form_table","str_tag":"table","str_classList":"tablerow,tablecell,tableheader","str_createdDate":"2022-02-02 20:26:22","str_modifiedDate":"2022-02-02 20:26:22","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_classController":true,"str_themeType":"form_table","bln_registerAtContainer":true,"bln_editPin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"}}],
[76765, {"obj_design":{"int_idRecord":76765,"str_idXDesign":"myId_13010303","str_name":"form_tableheader","str_nameShort":"form_tableheader","str_type":"form_tableheader","str_tag":"td","str_createdDate":"2022-02-02 20:33:17","str_modifiedDate":"2022-02-02 20:33:17","bln_palettePinRelease":true,"bln_palettePin":true,"bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_classController":true,"str_themeType":"form_tableheader","bln_registerAtContainer":true,"str_classExtend":"form_tablecell","bln_editPin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"}}],
[76766, {"obj_design":{"int_idRecord":76766,"str_idXDesign":"myId_73093409","str_name":"form_tablerow","str_nameShort":"form_tablerow","str_type":"form_tablerow","str_tag":"tr","str_createdDate":"2022-02-02 20:30:36","str_modifiedDate":"2022-02-02 20:30:36","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_classList":"tablecell,tableheader","bln_classController":true,"str_themeType":"form_tablerow","bln_editPin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","bln_registerAtContainer":true,"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"}}],
[76767, {"obj_design":{"int_idRecord":76767,"str_idXDesign":"myId_16109202","str_name":"form_tablecell","str_nameShort":"form_tablecell","str_type":"form_tablecell","str_tag":"td","str_createdDate":"2022-02-02 20:32:17","str_modifiedDate":"2022-02-02 20:32:17","bln_palettePinRelease":true,"bln_palettePin":true,"bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_classController":true,"str_themeType":"form_tablecell","bln_registerAtContainer":true,"bln_editPin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"}}],
[76771, {"obj_design":{"int_idRecord":76771,"str_idXDesign":"myId_12259382","str_name":"xapp_component","str_nameShort":"xapp_component","str_type":"xapp_component","str_tag":"xapp_component","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_classExtend":"xapp_ajax","bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"xapp_component"},"obj_domStyle":{"flex-direction":"column","padding":"10px","flex-wrap":"wrap","flex-flow":"row wrap","border":"1px solid white","gap":"10px","display":"none"}}],
[76799, {"obj_design":{"int_idRecord":76799,"str_idXDesign":"myId_78332315","str_name":"xapp_propertysheet","str_nameShort":"xapp_propertysheet","str_type":"xapp_propertysheet","str_tag":"xapp_propertysheet","bln_classController":true,"str_createdDate":"2022-10-22 22:43:39","str_modifiedDate":"2022-10-22 22:43:39","bln_editPin":true,"bln_isLocalHome":true,"str_classList":"input,table","blnIsTag":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"xapp_propertysheet"}}],
[76801, {"obj_design":{"int_idRecord":76801,"str_idXDesign":"myId_11033391","str_name":"xapp_propertysheet_input","str_nameShort":"xapp_propertysheet_input","str_type":"xapp_propertysheet_input","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_classExtend":"form_input"},"obj_domStyle":{"padding":"10px","cursor":"pointer","border":"0px none"}}],
[76967, {"obj_design":{"int_idRecord":"76967","str_idXDesign":"myId_67767017","str_name":"xapp_dynamic_content","str_nameShort":"xapp_dynamic_content","str_type":"xapp_dynamic_content","str_tag":"xapp_dynamic_content","bln_registerAtContainer":true,"str_createdDate":"2022-02-02 20:12:17","str_modifiedDate":"2022-02-02 20:12:17","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_dynamicPin":true,"bln_editPin":true,"str_idProject":"myId_24662136","str_themeType":"xapp_dynamic_content","str_nameRegistrator":"notset","str_content":"","bln_classController":"false","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_67767017"},"obj_domStyle":{"cursor":"default","display":"flex","flex-wrap":"wrap","height":"100%","width":"100%","overflow":"auto"},"dom_objContentContainer":{"Id":"myId_67767017"}}],
[76968, {"obj_design":{"int_idRecord":"76968","str_idXDesign":"myId_42742327","str_name":"xapp_context_holder","str_nameShort":"xapp_context_holder","str_type":"xapp_context_holder","str_tag":"xapp_context_holder","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"bln_isLocalHome":true,"bln_isContextHolder":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_themeType":"xapp_context_holder","arr_item":[{"obj_design":{"int_idRecord":76969,"str_type":"xapp_context_holder"}},{"obj_design":{"int_idRecord":76394,"str_type":"xapp_context_holder"}}],"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_42742327"},"obj_domStyle":{"flex-flow":"wrap","gap":"10px","display":"none"},"dom_objContentContainer":{"Id":"myId_42742327"}}],
[76969, {"obj_design":{"int_idRecord":76969,"str_idXDesign":"myId_11678710","str_name":"login_context_holder","str_nameShort":"login_context_holder","str_type":"xapp_context_holder","str_tag":"login_context_holder","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"bln_isLocalHome":true,"bln_isContextHolder":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_themeType":"xapp_context_holder","bln_classController":"false","arr_item":[{"obj_design":{"int_idRecord":76970,"str_type":"login_dashboard"}}],"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_11678710"},"obj_domStyle":{"flex-flow":"wrap","gap":"10px","display":"none"},"dom_objContentContainer":{"Id":"myId_11678710"}}],
[76970, {"obj_design":{"int_idRecord":76970,"str_idXDesign":"myId_79770339","str_name":"login_dashboard","str_nameShort":"login_dashboard","str_type":"login_dashboard","str_tag":"login_dashboard","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_classExtend":"xapp_dashboard","bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Lock","str_themeType":"login_dashboard","str_idProject":"myId_60426365","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset","arr_item":[{"obj_design":{"int_idRecord":77544,"str_type":"form_section"}}]},"obj_domProperty":{"Id":"myId_79770339"},"obj_domStyle":{"flex-direction":"column","flex-wrap":"wrap","flex-flow":"row wrap","gap":"10px","align-items":"center","justify-content":"center","border":"0px solid white","display":"none"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_79770339"}}],
[77012, {"obj_design":{"int_idRecord":77012,"str_idXDesign":"myId_09399160","str_name":"form_form","str_nameShort":"form_form","str_type":"form_form","str_tag":"form","bln_registerAtContainer":true,"str_classExtend":"component","str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"str_themeType":"form_form","bln_isLocalHome":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"flex-wrap":"wrap","display":"flex"," background-color":"coral","flex-direction":"column","gap":"10px"},"user_agent":"Firefox"}],
[77018, {"obj_design":{"int_idRecord":77018,"str_idXDesign":"myId_29791368","str_name":"form_menu_panel","str_nameShort":"form_menu_panel","str_type":"form_menu_panel","str_themeType":"form_menu_panel","str_tag":"form_menu_panel","bln_registerAtContainer":true,"str_createdDate":"2022-11-15 08:47:57","str_modifiedDate":"2022-11-15 08:47:57","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_isThemeItem":true,"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset","str_categoryName":"Xtra"},"obj_domProperty":{"Id":"myId_29791368"},"obj_domStyle":{"flexdirection":"column","gap":"10px","display":"flex","padding":"10px","flex-direction":"column","flex flow":"column wrap","border":"0px solid white"},"dom_objContentContainer":{"Id":"myId_29791368"}}],
[77019, {"obj_design":{"int_idRecord":77019,"str_idXDesign":"myId_21969641","str_name":"form_panel","str_nameShort":"form_panel","str_type":"form_panel","str_tag":"form_panel","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_panel","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset","str_categoryName":"Form"},"obj_domStyle":{"display":"flex","flex-wrap":"column wrap","gap":"10px","padding":"10px","flex-flow":"wrap"},"user_agent":"Firefox"}],
[77020, {"obj_design":{"int_idRecord":77020,"str_idXDesign":"myId_77411197","str_name":"form_section","str_nameShort":"form_section","str_type":"form_section","str_tag":"form_section","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Form","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"display":"flex","flex-direction":"column","padding":"10px","flex-wrap":"wrap","gap":"10px","flex-flow":"wrap"}}],
[77022, {"obj_design":{"int_idRecord":77022,"str_idXDesign":"myId_00003971","str_name":"form_label","str_nameShort":"form_label","str_type":"form_label","str_themeType":"form_label","str_tag":"label","str_createdDate":"2022-11-13 21:59:51","str_modifiedDate":"2022-11-13 21:59:51","bln_editPin":true,"bln_typeable":true,"str_text":"My Label","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"myId_13000276","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"My Label"},"obj_domStyle":{"padding":"10px","align-self":"flex-start","cursor":"pointer","border-radius":"4px","border":"1px solid transparent","color":"white","margin":"","max-height":"","max-width":"","min-width":"","overflow":"","word-break":""}}],
[77023, {"obj_design":{"str_tag":"text","str_type":"form_text","str_idXDesign":"myId_72217349","str_name":"form_text","str_nameShort":"form_text","str_themeType":"form_input","int_idRecord":77023,"str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"myId_13000276","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"-","str_lastVersionDate":"notset"},"obj_domProperty":{"innerHTML":"-"},"obj_domStyle":{"padding":"10px","word-break":"normal","background":"white","maxheight":"175","overflow":"auto","color":"black","border":"1px solid white","max-height":"500px","min-width":"","border-radius":"4px"}}],
[77024, {"obj_design":{"int_idRecord":77024,"str_idXDesign":"myId_13000276","str_name":"form_field","str_nameShort":"form_field","str_type":"form_field","str_tag":"field","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_field","bln_editPin":true,"bln_registerAtContainer":true,"arr_item":[{"obj_design":{"int_idRecord":77022,"str_type":"form_label"}},{"obj_design":{"int_idRecord":77023,"str_type":"form_text"}}],"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Form","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_13000276"},"obj_domStyle":{"flex-wrap":"wrap"," justify-content":"center","align-items":"","justify-content":"","gap":"","flex-flow":"","display":""},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_13000276"}}],
[77025, {"obj_design":{"int_idRecord":77025,"str_idXDesign":"myId_77699970","str_name":"form_textarea","str_nameShort":"form_textarea","str_type":"form_textarea","str_tag":"textarea","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"form_input","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"padding":"10px","cursor":"pointer","border":"0px none"}}],
[77026, {"obj_design":{"int_idRecord":77026,"str_idXDesign":"myId_20112132","str_name":"form_input","str_nameShort":"form_input","str_type":"form_input","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Form","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"padding":"10px","cursor":"pointer","border":"0px none"}}],
[77027, {"obj_design":{"int_idRecord":"77027","str_idXDesign":"myId_49913170","str_name":"form_select","str_nameShort":"form_select","str_type":"form_select","str_tag":"select","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"cursor":"pointer","padding":"10px","border":"0px","color":"black"}}],
[77028, {"obj_design":{"int_idRecord":"77028","str_idXDesign":"myId_19213742","str_name":"form_inputandbutton_input","str_nameShort":"form_inputandbutton_input","str_type":"form_input","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false"},"obj_domStyle":{"padding":"10px","cursor":"pointer","border":"0px none"}}],
[77029, {"obj_design":{"int_idRecord":77029,"str_idXDesign":"myId_32160437","str_name":"form_inputandbutton_submit","str_nameShort":"form_inputandbutton_submit","str_type":"form_inputandbutton_submit","str_tag":"button","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_inputandbutton_submit","bln_registerAtContainer":true,"str_classExtend":"form_button_rich","str_text":"My Button","bln_palettePinRelease":true,"bln_palettePin":true,"str_idProject":"myId_36537180","str_nameRegistrator":"notset","str_content":"","bln_classController":true,"str_classList":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset","str_categoryName":"Xtra","str_value":"My Button"},"obj_domProperty":{"type":"submit"},"obj_domStyle":{"cursor":"pointer","border":"0px none","height":"40px","padding":"0px"},"bln_enabled":true,"user_agent":"Firefox"}],
[77030, {"obj_design":{"int_idRecord":77030,"str_idXDesign":"myId_62726192","str_name":"form_inputandbutton","str_nameShort":"form_inputandbutton","str_type":"form_inputandbutton","str_themeType":"form_panel","str_tag":"inputandbutton","str_createdDate":"2022-11-20 10:37:36","str_modifiedDate":"2022-11-20 10:37:36","bln_editPin":true,"bln_registerAtContainer":true,"arr_item":[{"obj_design":{"int_idRecord":"77028","str_type":"form_input"}},{"obj_design":{"int_idRecord":77029,"str_type":"form_inputandbutton_submit"}}],"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_62726192"},"dom_objContentContainer":{"Id":"myId_62726192"}}],
[77032, {"obj_design":{"int_idRecord":77032,"str_idXDesign":"myId_72497127","str_name":"block","str_nameShort":"block","str_type":"block","str_tag":"block","str_createdDate":"2022-01-31 21:10:58","str_modifiedDate":"2022-01-31 21:10:58","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"block","bln_editPin":true,"bln_registerAtContainer":true,"bln_classController":"false","str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"display":"block"}}],
[77033, {"obj_design":{"int_idRecord":77033,"str_idXDesign":"myId_79277021","str_name":"form_hardrule","str_nameShort":"form_hardrule","str_type":"form_hardrule","str_themeType":"form_hardrule","str_tag":"hr","bln_registerAtContainer":true,"str_createdDate":"2023-09-28 17:30:59","str_modifiedDate":"2023-09-28 17:30:59","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Form","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domStyle":{"height":"10px","width":"100%","border":"0px","background":"gray"},"user_agent":"Firefox"}],
[77034, {"obj_design":{"int_idRecord":77034,"str_idXDesign":"myId_79120090","str_name":"form_anchor","str_nameShort":"form_anchor","str_type":"form_anchor","str_tag":"a","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_anchor","bln_editPin":true,"bln_registerAtContainer":true,"bln_classController":"false","str_categoryName":"Xtra","str_idProject":"notset","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"target":"_blank","Id":"myId_79120090"},"obj_domStyle":{"width":"100%","display":"block","text-decoration":"none","border":"1px solid black"},"dom_objContentContainer":{"Id":"myId_79120090"}}],
[77037, {"obj_design":{"int_idRecord":77037,"str_idXDesign":"myId_01089000","str_name":"xapp_button_navigate_mall","str_nameShort":"xapp_button_navigate_mall","str_type":"xapp_button_navigate_mall","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"str_text":"Mall","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869"},"obj_domProperty":{"innerText":"Desktop","str_name":"xapp_button_navigate_desktop","innerHTML":"Mall"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"str_name":"xapp_button_navigate_desktop"}}],
[77038, {"obj_design":{"int_idRecord":77038,"str_idXDesign":"myId_76211896","str_name":"xapp_button_navigate_office","str_nameShort":"xapp_button_navigate_office","str_type":"xapp_button_navigate_office","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_office","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Office","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_76211896"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_76211896","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77082, {"obj_design":{"int_idRecord":77082,"str_idXDesign":"myId_76307086","str_name":"xapp_base","str_nameShort":"xapp_base","str_type":"xapp_base","str_themeType":"component","str_tag":"xapp_base","bln_classController":true,"str_createdDate":"2023-11-19 12:58:13","str_modifiedDate":"2023-11-19 12:58:13","bln_editPin":true,"bln_lockComponent":true,"str_categoryName":"Xtra","bln_palettePinRelease":true,"bln_palettePin":true,"blnIsTag":true}}],
[77084, {"obj_design":{"int_idRecord":77084,"str_idXDesign":"myId_61351551","str_name":"form_checkbox","str_nameShort":"form_checkbox","str_type":"form_checkbox","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Xtra","str_text":"on","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"type":"checkbox","checked":true},"obj_domStyle":{"cursor":"pointer","border":"0px none","content":"\\2713","height":"40px","width":"40px","vertical-align":"middle","margin":"0px"}}],
[77152, {"obj_design":{"int_idRecord":77152,"str_idXDesign":"myId_11190110","str_name":"xapp_button","str_nameShort":"xapp_button","str_type":"xapp_button","str_themeType":"form_button","str_tag":"button","bln_registerAtContainer":true,"str_createdDate":"2022-11-20 23:26:20","str_modifiedDate":"2022-11-20 23:26:20","bln_editPin":true,"str_text":"xapp_button","bln_classController":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_classExtend":"form_button_rich","bln_lockComponent":true,"str_categoryName":"Xtra","str_icon":"xapp_desk","arr_item":[{"obj_design":{"int_idRecord":77388,"str_type":"form_anchor"}}],"str_idProject":"myId_36985869","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"My Button","innerHTML":"xapp_button","Id":"myId_11190110"},"obj_domStyle":{"aliign-items":"center","padding":"10px"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_11190110"}}],
[77171, {"obj_design":{"int_idRecord":77171,"str_idXDesign":"myId_05444353","str_name":"xapp_button_queryterm","str_nameShort":"xapp_button_queryterm","str_type":"xapp_button_queryterm","str_themeType":"form_button","str_tag":"button","bln_registerAtContainer":true,"str_createdDate":"2022-11-20 23:26:20","str_modifiedDate":"2022-11-20 23:26:20","bln_editPin":true,"str_text":"My Button","bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","bln_lockComponent":true,"str_classExtend":"form_button"},"obj_domProperty":{"innerText":"My Button"},"obj_domStyle":{"cursor":"pointer","border":"0px none","height":"40px","padding":"10px","border-radius":"2px"}}],
[77173, {"obj_design":{"int_idRecord":77173,"str_idXDesign":"myId_41499791","str_name":"xapp_queryterm_interface","str_nameShort":"xapp_queryterm_interface","str_type":"xapp_queryterm_interface","str_tag":"fieldset","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","bln_lockComponent":true,"str_classExtend":"form_fieldset"},"obj_domStyle":{"display":"flex","flex-direction":"column","padding":"10px","flex-wrap":"wrap","gap":"10px","flex-flow":"wrap"}}],
[77184, {"obj_design":{"int_idRecord":77184,"str_idXDesign":"myId_01091007","str_name":"form_fieldset","str_nameShort":"form_fieldset","str_type":"form_fieldset","str_tag":"fieldset","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Form","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset","lockOpen":true},"obj_domStyle":{"display":"flex","flex-direction":"column","padding":"10px","flex-wrap":"wrap","gap":"10px","flex-flow":"wrap","align-self":"flex-start","background":"gray","border-radius":"4px","border":"1px outset gray"},"user_agent":"Firefox","bln_toggleState":true}],
[77187, {"obj_design":{"int_idRecord":77187,"str_idXDesign":"myId_82227821","str_name":"form_legend","str_nameShort":"form_legend","str_type":"form_legend","str_tag":"legend","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_legend","bln_editPin":true,"bln_registerAtContainer":true,"bln_classController":"false","str_classExtend":"form_button","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"MyText","str_lastVersionDate":"notset","str_categoryName":"Form"},"obj_domProperty":{"href":"https://www.mycode.buzz","target":"_blank","tabIndex":"0","innerHTML":"MyText"},"obj_domStyle":{"display":"block","text-decoration":"none","color":"white","user-select":"none","background":"gray","border-radius":"4px","border":"1px outset gray","padding":"10px","opacity":"1"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"href":"https://www.mycode.buzz","target":"_blank"}}],
[77192, {"obj_design":{"int_idRecord":77192,"str_idXDesign":"myId_13355182","str_name":"form_tabset","str_nameShort":"form_tabset","str_type":"form_tabset","str_tag":"tabset","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","arr_item":[{"obj_design":{"int_idRecord":77193,"str_type":"form_panellist"}},{"obj_design":{"int_idRecord":77194,"str_type":"form_tablist"}}],"str_themeType":"form_tabset","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"role":"tablist","aria-label":"Tab Set","Id":"myId_13355182"},"obj_domStyle":{"flex-direction":"column","flex-wrap":"wrap","gap":"10px","display":"none"},"dom_objContentContainer":{"Id":"myId_13355182","aria-label":"Tab Set"},"obj_panellist":{"obj_design":{"int_idRecord":77193,"str_type":"form_panellist"}},"obj_tablist":{"obj_design":{"int_idRecord":77194,"str_type":"form_tablist"}}}],
[77193, {"obj_design":{"int_idRecord":77193,"str_idXDesign":"myId_25489299","str_name":"form_panellist","str_nameShort":"form_panellist","str_type":"form_panellist","str_tag":"panellist","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"form_panellist"},"obj_domProperty":{"role":"tablist","aria-label":"Tab Set"},"obj_domStyle":{"flex-direction":"column","flex-wrap":"wrap"},"dom_objContentContainer":{"aria-label":"Tab Set"}}],
[77194, {"obj_design":{"int_idRecord":77194,"str_idXDesign":"myId_15515595","str_name":"form_tablist","str_nameShort":"form_tablist","str_type":"form_tablist","str_tag":"tablist","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_themeType":"form_tablist"},"obj_domProperty":{"role":"tablist","aria-label":"Tab Set"},"obj_domStyle":{"flex-direction":"column","flex-wrap":"wrap","display":"flex","flex-flow":"row wrap","gap":"10px"},"dom_objContentContainer":{"aria-label":"Tab Set"}}],
[77195, {"obj_design":{"int_idRecord":77195,"str_idXDesign":"myId_03131030","str_name":"form_tab","str_nameShort":"form_tab","str_type":"form_tab","str_themeType":"form_button","str_tag":"button","bln_registerAtContainer":true,"str_createdDate":"2022-11-20 23:26:20","str_modifiedDate":"2022-11-20 23:26:20","bln_editPin":true,"str_text":"My Button","bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","bln_lockComponent":true,"str_classExtend":"form_button","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"My Button","innerHTML":"My Button"},"obj_domStyle":{"cursor":"pointer","border":"0px none","height":"40px","padding":"10px","border-radius":"2px"},"bln_enabled":true}],
[77200, {"obj_design":{"int_idRecord":77200,"str_idXDesign":"myId_04630046","str_name":"xapp_report_interface_fieldlist","str_nameShort":"xapp_report_interface_fieldlist","str_type":"xapp_report_interface_fieldlist","str_tag":"fieldset","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","bln_lockComponent":true,"str_classExtend":"form_fieldset"},"obj_domStyle":{"display":"flex","flex-direction":"column","padding":"10px","flex-wrap":"wrap","gap":"10px","flex-flow":"wrap"}}],
[77201, {"obj_design":{"int_idRecord":77201,"str_idXDesign":"myId_30910110","str_name":"xapp_report_interface_fieldcriteria","str_nameShort":"xapp_report_interface_fieldcriteria","str_type":"xapp_report_interface_fieldcriteria","str_tag":"fieldset","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"str_categoryName":"Xtra","bln_lockComponent":true,"str_classExtend":"form_fieldset"},"obj_domStyle":{"display":"flex","flex-direction":"column","padding":"10px","flex-wrap":"wrap","gap":"10px","flex-flow":"wrap"}}],
[77335, {"obj_design":{"int_idRecord":"77335","str_idXDesign":"myId_74996919","str_name":"form_radio","str_nameShort":"form_radio","str_type":"form_radio","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"checked":true,"type":"radio","Id":"myId_74996919","innerHTML":"&nbsp;"},"obj_domStyle":{"cursor":"pointer","border":"0px none","content":"\\2713","height":"40px","width":"40px","vertical-align":"middle","margin":"0px"},"dom_objContentContainer":{"Id":"myId_74996919"}}],
[77337, {"obj_design":{"int_idRecord":"77337","str_idXDesign":"myId_88201141","str_name":"form_nonbreakingspace","str_nameShort":"form_nonbreakingspace","str_type":"form_nonbreakingspace","str_themeType":"form_nonbreakingspace","str_tag":"br","bln_registerAtContainer":true,"str_createdDate":"2023-09-28 17:30:59","str_modifiedDate":"2023-09-28 17:30:59","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_88201141"},"obj_domStyle":{"height":"10px","width":"100%","background":"yellow","border":"0px"},"dom_objContentContainer":{"Id":"myId_88201141"}}],
[77339, {"obj_design":{"int_idRecord":77339,"str_idXDesign":"myId_11122295","str_name":"form_label","str_nameShort":"form_label","str_type":"form_label","str_themeType":"form_label","str_tag":"label","str_createdDate":"2022-11-13 21:59:51","str_modifiedDate":"2022-11-13 21:59:51","bln_editPin":true,"bln_typeable":true,"str_text":"My Label","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"My Label","Id":"myId_11122295"},"obj_domStyle":{"padding":"10px","word-break":"normal","min-width":"175px","max-width":"175px","max-height":"175px","overflow":"auto","color":"black","align-self":"flex-start","border":"1px solid rgba(255, 255, 255, 0.0)","margin":"3px","cursor":"pointer","border-radius":"4px"},"dom_objContentContainer":{"Id":"myId_11122295"}}],
[77341, {"obj_design":{"str_tag":"span","str_type":"form_span","str_idXDesign":"myId_18418551","str_name":"form_span","str_nameShort":"form_span","str_themeType":"form_input","int_idRecord":77341,"str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":"false","str_categoryName":"Form","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_18418551"},"obj_domStyle":{"padding":"10px","word-break":"normal","background":"white","maxheight":"175","overflow":"auto","color":"black","border-radius":"4px","border":"0px solid black","font-family":"Tahoma","max-height":"500px"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_18418551"}}],
[77377, {"obj_design":{"int_idRecord":77377,"str_idXDesign":"myId_29131132","str_name":"loginpanelform","str_nameShort":"loginpanelform","str_type":"loginpanelform","str_tag":"form","str_classExtend":"form_form","str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"str_themeType":"form_form","bln_isLocalHome":true,"bln_palettePinRelease":true,"bln_palettePin":true,"arr_item":[{"obj_design":{"int_idRecord":77538,"str_type":"form_input_login_email"}},{"obj_design":{"int_idRecord":77533,"str_type":"form_input_login_pass"}},{"obj_design":{"int_idRecord":77541,"str_type":"form_button_rich"}},{"obj_design":{"int_idRecord":77545,"str_type":"form_button_rich"}}],"str_idProject":"myId_06166711","bln_classController":true,"str_categoryName":"lock","bln_lockComponent":true,"bln_registerAtProject":true,"str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_29131132"},"obj_domStyle":{"flex-wrap":"wrap","display":"flex"," background-color":"coral","flex-direction":"column","gap":"10px"},"user_agent":"Firefox","dom_objContentContainer":{"0":{"maxlength":"100","font-weight":"bold","Id":"myId_37191444"},"1":{"Id":"myId_17521741","minlength":"6","maxlength":"6","inputmode":"numeric"},"2":{"Id":"myId_07559595","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"},"3":{"Id":"myId_78332329","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"},"Id":"myId_29131132"}}],
[77379, {"obj_design":{"int_idRecord":77379,"str_idXDesign":"myId_48693643","str_name":"form_button_search","str_nameShort":"form_button_search","str_type":"form_button_search","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"str_text":"Search","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_inputandbutton_submit","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_isThemeItem":true,"bln_classController":true,"str_categoryName":"Xtra","bln_lockComponent":true,"str_nameRegistrator":"notset","str_idProject":"notset","str_classList":"notset","str_releaseLabel":"notset","str_lastVersionDate":"notset","str_value":"Search"},"obj_domProperty":{"type":"submit","innerText":"Submit","Id":"myId_48693643","innerHTML":"Search"},"obj_domStyle":{"padding":"10px","cursor":"pointer","border-radius":"2px","border":"0px none white","background-color":"white","flex flow":"column wrap","pointer":"black","rgb(18, 47, 66)":"rgb(18, 47, 66)"},"bln_enabled":true,"dom_objContentContainer":{"data":"","Id":"myId_48693643"}}],
[77381, {"obj_design":{"int_idRecord":77381,"str_idXDesign":"myId_92278787","str_name":"form_icon","str_nameShort":"form_icon","str_type":"form_icon","str_tag":"i","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_icon","bln_editPin":true,"bln_registerAtContainer":true,"bln_classController":true,"str_categoryName":"Xtra","str_idProject":"notset","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_92278787"},"obj_domStyle":{"margin":"10px"},"dom_objContentContainer":{"Id":"myId_92278787"}}],
[77386, {"obj_design":{"str_tag":"span","str_type":"form_button_span","str_idXDesign":"myId_57242915","str_name":"form_button_span","str_nameShort":"form_button_span","str_themeType":"form_button_span","int_idRecord":77386,"str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_idProject":"myId_11190110","bln_classController":true,"str_text":"form_button_span","str_categoryName":"Form","bln_lockComponent":true},"obj_domProperty":{"Id":"myId_57242915","innerHTML":"form_button_span"},"obj_domStyle":{"maxheight":"175"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_57242915"}}],
[77387, {"obj_design":{"int_idRecord":77387,"str_idXDesign":"myId_24281989","str_name":"form_button_icon","str_nameShort":"form_button_icon","str_type":"form_button_icon","str_tag":"i","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_button_icon","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_79120090","bln_classController":true,"str_categoryName":"Form","bln_lockComponent":true},"obj_domProperty":{"Id":"myId_24281989"},"obj_domStyle":{"color":"rgb(64, 169, 236)"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_24281989"}}],
[77388, {"obj_design":{"int_idRecord":77388,"str_idXDesign":"myId_00791702","str_name":"xapp_form_anchor","str_nameShort":"xapp_form_anchor","str_type":"form_anchor","str_tag":"a","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_anchor","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_11190110","arr_item":[{"obj_design":{"int_idRecord":77386,"str_type":"form_button_span"}},{"obj_design":{"int_idRecord":77387,"str_type":"form_button_icon"}}],"bln_classController":"false","bln_lockComponent":true,"str_categoryName":"Xtra"},"obj_domProperty":{"target":"_blank","Id":"myId_00791702"},"obj_domStyle":{"display":"flex","justify-content":"center","align-items":"center","border":"0px solid black","gap":"10px","text":"de","text-decoration":"none"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_00791702"},"obj_icon":{"obj_design":{"int_idRecord":77387,"str_type":"form_button_icon"}},"obj_span":{"obj_design":{"int_idRecord":77386,"str_type":"form_button_span"}}}],
[77393, {"obj_design":{"int_idRecord":77393,"str_idXDesign":"myId_66119667","str_name":"form_button_anchor","str_nameShort":"form_button_anchor","str_type":"form_button_anchor","str_tag":"a","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_button_anchor","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_77377077","arr_item":[{"obj_design":{"int_idRecord":77386,"str_type":"form_button_span"}},{"obj_design":{"int_idRecord":77387,"str_type":"form_button_icon"}}],"bln_classController":true,"str_categoryName":"Form","bln_lockComponent":true,"str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"target":"_blank","Id":"myId_66119667"},"obj_domStyle":{"justify-content":"center","align-items":"center","text-decoration":"none","font-size":"1rem","display":"flex","gap":"10px","text":"de","border":"0px solid black","color":"white"},"dom_objContentContainer":{"Id":"myId_66119667"},"obj_icon":{"obj_design":{"int_idRecord":77387,"str_type":"form_button_icon"}},"obj_span":{"obj_design":{"int_idRecord":77386,"str_type":"form_button_span"}}}],
[77396, {"obj_design":{"int_idRecord":77396,"str_idXDesign":"myId_25205280","str_name":"xapp_button_navigate_settings","str_nameShort":"xapp_button_navigate_settings","str_type":"xapp_button_navigate_settings","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Other","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_idProject":"myId_25365115","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"","str_lastVersionDate":"notset","str_icon":"xapp_settings"},"obj_domProperty":{"innerText":"Complete","innerHTML":"Refresh","aria-label":"Settings","Id":"myId_25205280","title":"Settings"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_25205280","aria-label":"Settings"}}],
[77397, {"obj_design":{"int_idRecord":77397,"str_idXDesign":"myId_15925355","str_name":"xapp_button_navigate_desktop","str_nameShort":"xapp_button_navigate_desktop","str_type":"xapp_button_navigate_desktop","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Other","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_idProject":"myId_25365115","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Home","str_lastVersionDate":"notset","str_icon":"xapp_desk"},"obj_domProperty":{"innerText":"Complete","innerHTML":"Refresh","aria-label":"Home","title":"Home","Id":"myId_15925355"},"obj_domStyle":{"opacity":"1","background":"rgb(65, 65, 65)","border":"0.4rem solid orange","color":"orange","display":"flex","padding":"1em","cursor":""},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_15925355","aria-label":"Home"}}],
[77430, {"obj_design":{"int_idRecord":77430,"str_idXDesign":"myId_23559322","str_name":"xapp_button_navigate_login","str_nameShort":"xapp_button_navigate_login","str_type":"xapp_button_navigate_login","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_lock","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Exit","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_23559322"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_23559322","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77451, {"obj_design":{"int_idRecord":77451,"str_idXDesign":"myId_77377077","str_name":"xapp_menu","str_nameShort":"xapp_menu","str_type":"xapp_menu","str_tag":"button","str_createdDate":"2022-02-02 20:04:57","str_modifiedDate":"2022-02-02 20:04:57","str_text":"xapp_menu","bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"Xapp","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"menu_button","bln_registerAtContainer":true,"str_classExtend":"xapp_menu_operation","blnIsTag":true,"arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"","str_lastVersionDate":"notset","bln_classController":"false","str_icon":"star"},"obj_domProperty":{"innerText":"xapp_menu","innerHTML":"xapp_menu","xDesign_MenuButtonClick":"fn_MenuButtonClick","Id":"myId_77377077"},"obj_domStyle":{"font-size":"1rem","padding-bottom":"2px","margin-bottom":"1em","justify-content":"","align-items":"","border-radius":"","width":"100%","display":"flex","background":"rgb(65, 65, 65)","padding":"1em","color":"yellow","border":"0.5rem solid yellow","cursor":""},"bln_enabled":true,"str_defaultTypeMenu":"xapp_menu","str_defaultTypeData":"xapp_data_view","str_defaultTypeDataChildMenu":"xapp_data_childmenu","obj_meta":{"bln_togglePeersPin":true,"str_metaConstraintName":"","str_metaRowzName":"","int_idMetaRowz":0,"int_idParentMetaRowz":0,"int_idMetaView":0,"bln_viewPin":0,"str_buttonConsole":"","MetaPermissionTag":"100","str_metaTypeDashboard":"","str_metaTypeData":"","str_optionChildMenu":"","str_text":""},"str_optionData":"Data","str_optionReport":"Report","str_optionWidget":"Widget","str_optionDashboard":"Dashboard","str_optionMenu":"Menu","str_optionMenuForm":"MenuForm","str_listSeparator":"-","bln_constraintKeyPin":true,"user_agent":"Firefox"}],
[77452, {"obj_design":{"int_idRecord":77452,"str_idXDesign":"myId_37013033","str_name":"block_start","str_nameShort":"block_start","str_type":"block_structure","str_tag":"block_start","str_createdDate":"2022-01-31 21:10:58","str_modifiedDate":"2022-01-31 21:10:58","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_container","bln_editPin":true,"bln_registerAtContainer":true,"str_categoryName":"xapp","str_idProject":"notset","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_classController":true,"bln_lockComponent":true,"str_position":"start"},"obj_domProperty":{"Id":"myId_37013033"},"obj_domStyle":{"justify-content":"start","gap":"10px","1 1 50%":"10px","border":"0px solid yellow","display":"flex","flex-wrap":"wrap","flex":"1 1 auto"},"dom_objContentContainer":{"Id":"myId_37013033"}}],
[77453, {"obj_design":{"int_idRecord":77453,"str_idXDesign":"myId_01401823","str_name":"block_end","str_nameShort":"block_end","str_type":"block_structure","str_tag":"block_end","str_createdDate":"2022-01-31 21:10:58","str_modifiedDate":"2022-01-31 21:10:58","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_container","bln_editPin":true,"bln_registerAtContainer":true,"str_categoryName":"xapp","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_classController":true,"bln_lockComponent":true,"str_position":"end"},"obj_domProperty":{"Id":"myId_01401823"},"obj_domStyle":{"justify-content":"end","gap":"10px","border":"0px solid blue","background":"green","display":"flex","flex-wrap":"wrap","flex":"1 1 auto"},"dom_objContentContainer":{"Id":"myId_01401823"}}],
[77454, {"obj_design":{"int_idRecord":"77454","str_idXDesign":"myId_22307377","str_name":"xapp_console","str_nameShort":"xapp_console","str_type":"xapp_console","str_tag":"xapp_console","str_createdDate":"2022-02-02 20:10:52","str_modifiedDate":"2022-02-02 20:10:52","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"arr_item":[{"obj_design":{"int_idRecord":77452,"str_type":"block_structure"}},{"obj_design":{"int_idRecord":77453,"str_type":"block_structure"}}],"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"xapp","str_themeType":"form_container","str_nameRegistrator":"notset","str_idProject":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_classController":"false"},"obj_domProperty":{"Id":"myId_22307377"},"obj_domStyle":{"flexdirection":"column","gap":"10px","display":"flex","flex-wrap":"wrap"},"dom_objContentContainer":{"Id":"myId_22307377"},"obj_blockStart":{"obj_design":{"int_idRecord":77452,"str_type":"block_structure"}},"obj_blockEnd":{"obj_design":{"int_idRecord":77453,"str_type":"block_structure"}}}],
[77485, {"obj_design":{"int_idRecord":77485,"str_idXDesign":"myId_31653329","str_name":"xapp_button_navigate_lobby","str_nameShort":"xapp_button_navigate_lobby","str_type":"xapp_button_navigate_lobby","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_star","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Lobby","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_31653329"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_31653329","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77486, {"obj_design":{"int_idRecord":77486,"str_idXDesign":"myId_36003113","str_name":"xapp_button_navigate_rowz","str_nameShort":"xapp_button_navigate_rowz","str_type":"xapp_button_navigate_rowz","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"www","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"rowz_hashtag","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Rowz","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_36003113"},
"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_36003113","str_name":"xapp_button_navigate_desktop"}}],
[77489, {"obj_design":{"int_idRecord":77489,"str_idXDesign":"myId_11150032","str_name":"form_button_rich","str_nameShort":"form_button_rich","str_type":"form_button_rich","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Form","str_idProject":"notset","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"star","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"My Button","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_11150032"},"obj_domStyle":{"align-items":"","justify-content":"","cursor":"pointer","display":"flex","background":"rgb(65, 65, 65)","border":"0.4rem solid orange","padding":"1em","color":"orange"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_11150032","str_name":"xapp_button_navigate_desktop"}}],
[77490, {"obj_design":{"int_idRecord":77490,"str_idXDesign":"myId_12330123","str_name":"form_button","str_nameShort":"form_button","str_type":"form_button","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"notset","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"notset","str_icon":"xapp_star","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"My Button","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","str_name":"xapp_button_navigate_desktop","Id":"myId_12330123","innerHTML":"My Button"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"data":"","str_name":"xapp_button_navigate_desktop","Id":"myId_12330123"}}],
[77491, {"obj_design":{"int_idRecord":77491,"str_idXDesign":"myId_78802071","str_name":"form_button_showhide","str_nameShort":"form_button_showhide","str_type":"form_button_showhide","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_button_rich","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"notset","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_star","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"My Button","str_lastVersionDate":"notset","bln_expand":true},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_78802071"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_78802071","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77496, {"obj_design":{"int_idRecord":77496,"str_idXDesign":"myId_18827111","str_name":"xapp_button_navigate_newrow","str_nameShort":"xapp_button_navigate_newrow","str_type":"xapp_button_navigate_newrow","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"New Row","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_18827111"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_18827111","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77497, {"obj_design":{"int_idRecord":77497,"str_idXDesign":"myId_52721115","str_name":"xapp_button_navigate_newcolumn","str_nameShort":"xapp_button_navigate_newcolumn","str_type":"xapp_button_navigate_newcolumn","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"New Column","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_52721115"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_52721115","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77500, {"obj_design":{"int_idRecord":77500,"str_idXDesign":"myId_50437881","str_name":"form_button_search","str_nameShort":"form_button_search","str_type":"form_button_search","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_inputandbutton_submit","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Other","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_idProject":"notset","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Search","str_lastVersionDate":"notset","str_icon":"xapp_search","str_value":"Search"},"obj_domProperty":{"innerText":"Complete","innerHTML":"Refresh","aria-label":"New Record","Id":"myId_50437881"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_50437881","aria-label":"New Record"}}],
[77517, {"obj_design":{"int_idRecord":77517,"str_idXDesign":"myId_07873870","str_name":"xapp_button_general_row_hide","str_nameShort":"xapp_button_general_row_hide","str_type":"xapp_button_general_row_hide","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_visibility_off","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Hide Row","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_07873870"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_07873870","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77518, {"obj_design":{"int_idRecord":77518,"str_idXDesign":"myId_70742723","str_name":"xapp_button_general_row_show","str_nameShort":"xapp_button_general_row_show","str_type":"xapp_button_general_row_show","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_visibility_on","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Show Row","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_70742723"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_70742723","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77519, {"obj_design":{"int_idRecord":77519,"str_idXDesign":"myId_11317771","str_name":"xapp_button_general_archive_show","str_nameShort":"xapp_button_general_archive_show","str_type":"xapp_button_general_archive_show","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_visibility_on","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Show Archive","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_11317771"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_11317771","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77520, {"obj_design":{"int_idRecord":77520,"str_idXDesign":"myId_31872371","str_name":"xapp_button_general_archive_hide","str_nameShort":"xapp_button_general_archive_hide","str_type":"xapp_button_general_archive_hide","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_visibility_off","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Hide Archive","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_31872371"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_31872371","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77522, {"obj_design":{"int_idRecord":77522,"str_idXDesign":"myId_51052090","str_name":"xapp_button_general_form_down","str_nameShort":"xapp_button_general_form_down","str_type":"xapp_button_general_form_down","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Move Down","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_51052090"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_51052090","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77523, {"obj_design":{"int_idRecord":77523,"str_idXDesign":"myId_37265133","str_name":"xapp_button_general_form_up","str_nameShort":"xapp_button_general_form_up","str_type":"xapp_button_general_form_up","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Move Up","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_37265133"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_37265133","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77524, {"obj_design":{"int_idRecord":77524,"str_idXDesign":"myId_23224334","str_name":"xapp_button_general_form_gap","str_nameShort":"xapp_button_general_form_gap","str_type":"xapp_button_general_form_gap","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Form Gap","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_23224334"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_23224334","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77525, {"obj_design":{"int_idRecord":77525,"str_idXDesign":"myId_43777772","str_name":"xapp_button_general_form_group","str_nameShort":"xapp_button_general_form_group","str_type":"xapp_button_general_form_group","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Form Group","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_43777772"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_43777772","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77530, {"obj_design":{"int_idRecord":77530,"str_idXDesign":"myId_92128822","str_name":"xapp_button_general_use_task_date","str_nameShort":"xapp_button_general_use_task_date","str_type":"xapp_button_general_use_task_date","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_calendar_month","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Use Task Date","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_92128822"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_92128822","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77531, {"obj_design":{"int_idRecord":77531,"str_idXDesign":"myId_22868883","str_name":"xapp_button_general_use_task_datetime","str_nameShort":"xapp_button_general_use_task_datetime","str_type":"xapp_button_general_use_task_datetime","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"xapp_console_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_classController":true,"bln_lockComponent":true,"str_categoryName":"Xtra","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_calendar_month","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Use Date & Time","str_lastVersionDate":"notset"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_22868883"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_22868883","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77532, {"obj_design":{"int_idRecord":77532,"str_idXDesign":"myId_17387151","str_name":"authorise_end","str_nameShort":"authorise_end","str_type":"authorise_end","str_tag":"authorise_end","str_createdDate":"2022-09-10 18:52:39","str_modifiedDate":"2022-09-10 18:52:39","bln_isLocalHome":true,"str_idProject":"myId_38012811","bln_classController":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_classExtend":"xapp_ajax","str_categoryName":"Anchor","str_themeType":"authorise_end","bln_editPin":true,"bln_lockComponent":true,"str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_17387151"},"dom_objContentContainer":{"Id":"myId_17387151"}}],
[77533, {"obj_design":{"int_idRecord":77533,"str_idXDesign":"myId_17521741","str_name":"form_input_login_pass","str_nameShort":"form_input_login_pass","str_type":"form_input_login_pass","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"Xtra","str_nameRegistrator":"notset","str_idProject":"myId_29131132","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_registerAtProject":true,"bln_classController":true,"bln_expand":true,"bln_lockComponent":true},"obj_domProperty":{"Id":"myId_17521741","minlength":"6","maxlength":"6","placeholder":"One Time Pass","inputmode":"numeric","pattern":"[0-9]*","size":"20","type":""},"obj_domStyle":{"cursor":"pointer","border":"0px none","background-color":"","border-radius":"","display":"none","padding":"20px","font-weight":"bold","font-size":"1.2rem"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_17521741","minlength":"6","maxlength":"6","inputmode":"numeric"}}],
[77538, {"obj_design":{"int_idRecord":77538,"str_idXDesign":"myId_37191444","str_name":"form_input_login_email","str_nameShort":"form_input_login_email","str_type":"form_input_login_email","str_tag":"input","str_createdDate":"2022-02-02 19:57:30","str_modifiedDate":"2022-02-02 19:57:30","bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_input","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29131132","str_content":"","str_classList":"notset","str_classExtend":"form_input","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_registerAtProject":true,"bln_expand":true,"bln_classController":"false"},"obj_domProperty":{"maxlength":"100","placeholder":"Your email address","type":"email","required":true,"autocomplete":"on","font-weight":"bold","Id":"myId_37191444","name":"email"},"obj_domStyle":{"cursor":"pointer","border":"0px none","padding":"30px","font-weight":"bold"},"user_agent":"Firefox","dom_objContentContainer":{"maxlength":"100","font-weight":"bold","Id":"myId_37191444"}}],
[77541, {"obj_design":{"int_idRecord":77541,"str_idXDesign":"myId_07559595","str_name":"form_button_login_email","str_nameShort":"form_button_login_email","str_type":"form_button_rich","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"str_categoryName":"lock","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_send","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Send Key","str_lastVersionDate":"notset","bln_classController":"false","bln_expand":true,"bln_registerAtProject":true},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","type":"submit","Id":"myId_07559595"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_07559595","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77544, {"obj_design":{"int_idRecord":"77544","str_idXDesign":"myId_34183798","str_name":"form_section","str_nameShort":"form_section","str_type":"form_section","str_tag":"section","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_06166711","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","arr_item":[{"obj_design":{"int_idRecord":77377,"str_type":"loginpanelform"}}],"bln_expand":true},"obj_domProperty":{"Id":"myId_34183798"},"obj_domStyle":{"display":"flex","flex-direction":"column","flex-wrap":"wrap","gap":"10px","flex-flow":"wrap","align-items":"center","justify-content":"center","padding":"30px","font-weight":"bold"},"dom_objContentContainer":{"Id":"myId_34183798"}}],
[77545, {"obj_design":{"int_idRecord":77545,"str_idXDesign":"myId_78332329","str_name":"form_button_login_pass","str_nameShort":"form_button_login_pass","str_type":"form_button_rich","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_lockComponent":true,"str_categoryName":"lock","str_idProject":"myId_36985869","arr_item":[{"obj_design":{"int_idRecord":77393,"str_type":"form_button_anchor"}}],"str_icon":"xapp_key","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"notset","str_text":"Enter Pass","str_lastVersionDate":"notset","bln_classController":"false","bln_expand":true,"bln_registerAtProject":true},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","type":"submit","Id":"myId_78332329"},"obj_domStyle":{"background":"rgb(65, 65, 65)","border":"0.5rem solid orange","color":"orange","display":"flex","fontSize":"1rem","padding":"1em"},"bln_enabled":true,"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_78332329","str_name":"xapp_button_navigate_desktop","arial-label":"Goto Office"}}],
[77570, {"obj_design":{"int_idRecord":77570,"str_idXDesign":"myId_29727565","str_name":"theme_ocean","str_nameRegistrator":"notset","str_nameShort":"theme_ocean","str_idProject":"myId_01221712","str_type":"xapp_theme","str_themeType":"xapp_theme","str_tag":"theme_ocean","str_content":"","bln_registerAtProject":true,"bln_registerAtContainer":true,"bln_classController":true,"str_classList":"notset","str_classExtend":"notset","str_createdDate":"2024-11-30 12:02:09","str_modifiedDate":"2024-11-30 12:02:09","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_releaseLabel":"notset","str_text":"notset","str_lastVersionDate":"notset","str_categoryName":"Anchor","bln_isThemeItem":true,"bln_lockComponent":true,"arr_item":[{"obj_design":{"int_idRecord":"77773","str_type":"xapp_accordion"}},{"obj_design":{"int_idRecord":"77774","str_type":"form_span"}},{"obj_design":{"int_idRecord":"77775","str_type":"form_span"}},{"obj_design":{"int_idRecord":"77776","str_type":"form_span"}},{"obj_design":{"int_idRecord":"77777","str_type":"form_span"}}]},"obj_domProperty":{"Id":"myId_29727565"},"obj_domStyle":{"font-family":"","font-size":"","display":"block"},"user_agent":"Firefox","dom_objContentContainer":{"Id":"myId_29727565"}}],
[77771, {"obj_design":{"int_idRecord":"77771","str_idXDesign":"myId_99777780","str_name":"form_menu_panel","str_nameShort":"form_menu_panel","str_type":"form_menu_panel","str_themeType":"form_menu_panel","str_tag":"form_menu_panel","bln_registerAtContainer":true,"str_createdDate":"2022-11-15 08:47:57","str_modifiedDate":"2022-11-15 08:47:57","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"bln_isThemeItem":true,"str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","str_categoryName":"","arr_item":[{"obj_design":{"int_idRecord":77821,"str_type":"block"}}],"bln_classController":"false"},"obj_domProperty":{"Id":"myId_99777780"},"obj_domStyle":{"flexdirection":"column","display":"flex","flex-direction":"column","flex flow":"column wrap","padding":"1em","gap":"1em","border":"0px solid white"},"dom_objContentContainer":{"Id":"myId_99777780"}}],
[77772, {"obj_design":{"int_idRecord":"77772","str_idXDesign":"myId_04703888","str_name":"form_form","str_nameShort":"form_form","str_type":"form_form","str_tag":"form","bln_registerAtContainer":true,"str_classExtend":"component","str_createdDate":"2022-11-01 21:47:45","str_modifiedDate":"2022-11-01 21:47:45","bln_editPin":true,"str_themeType":"form_form","bln_isLocalHome":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","arr_item":[{"obj_design":{"int_idRecord":"77771","str_type":"form_menu_panel"}}],"bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_04703888"},"obj_domStyle":{"flex-wrap":"wrap","display":"flex"," background-color":"coral","flex-direction":"column","gap":"10px"},"dom_objContentContainer":{"0":{"Id":"myId_62839939"},"1":{"Id":"myId_48263332","str_name":"xapp_button_navigate_desktop"},"Id":"myId_04703888"}}],
[77773, {"obj_design":{"int_idRecord":"77773","str_idXDesign":"myId_38394983","str_name":"xapp_accordion","str_nameShort":"xapp_accordion","str_type":"xapp_accordion","str_tag":"xapp_accordion","bln_registerAtContainer":true,"str_createdDate":"2022-11-01 21:51:10","str_modifiedDate":"2022-11-01 21:51:10","bln_editPin":true,"str_themeType":"xapp_accordion","bln_isLocalHome":true,"blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"arr_item":[{"obj_design":{"int_idRecord":77816,"str_type":"form_button_rich"}},{"obj_design":{"int_idRecord":"77772","str_type":"form_form"}}],"bln_classController":"false"},"obj_domProperty":{"Id":"myId_38394983"},"obj_domStyle":{"width":"100%","flex":"wrap","justify-content":"","display":"block","background-color":"rgb(37, 150, 190)"},"dom_objContentContainer":{"Id":"myId_38394983"}}],
[77774, {"obj_design":{"str_tag":"form_blockbackground","str_type":"form_span","str_idXDesign":"myId_58870858","str_name":"form_blockbackground","str_nameShort":"form_blockbackground","str_themeType":"form_blockbackground","int_idRecord":"77774","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_58870858"},"obj_domStyle":{"padding":"10px","maxheight":"175","border-radius":"4px","background":"rgb(37, 150, 190)","word-break":"","overflow":"","max-height":"","font-family":"","color":"","border":""},"dom_objContentContainer":{"Id":"myId_58870858"}}],
[77775, {"obj_design":{"str_tag":"form_blockmidground","str_type":"form_span","str_idXDesign":"myId_37817050","str_name":"form_blockmidground","str_nameShort":"form_blockmidground","str_themeType":"form_blockmidground","int_idRecord":"77775","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"innerHTML":"","Id":"myId_37817050"},"obj_domStyle":{"maxheight":"175","background":"rgb(64, 169, 236)","border":"","color":"","font-family":"","max-height":"","overflow":"","word-break":"","padding":"10px","border-radius":"4px"},"dom_objContentContainer":{"Id":"myId_37817050"}}],
[77776, {"obj_design":{"str_tag":"form_blockforground","str_type":"form_span","str_idXDesign":"myId_18017798","str_name":"form_blockforground","str_nameShort":"form_blockforground","str_themeType":"form_blockforground","int_idRecord":"77776","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_18017798"},"obj_domStyle":{"padding":"10px","background":"white","maxheight":"175","border-radius":"4px","border":"","color":"","font-family":"","max-height":"","overflow":"","word-break":""},"dom_objContentContainer":{"Id":"myId_18017798"}}],
[77777, {"obj_design":{"str_tag":"form_blockhighlight","str_type":"form_span","str_idXDesign":"myId_89738359","str_name":"form_blockhighlight","str_nameShort":"form_blockhighlight","str_themeType":"form_blockhighlight","int_idRecord":"77777","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_89738359"},"obj_domStyle":{"padding":"10px","maxheight":"175","border-radius":"4px","background":"orange","border":"","color":"","font-family":"","max-height":"","overflow":"","word-break":""},"dom_objContentContainer":{"Id":"myId_89738359"}}],
[77813, {"obj_design":{"str_tag":"span","str_type":"form_button_span","str_idXDesign":"myId_67672923","str_name":"form_button_span","str_nameShort":"form_button_span","str_themeType":"form_button_span","int_idRecord":"77813","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_idProject":"myId_11190110","str_text":"My Button","str_categoryName":"","str_nameRegistrator":"notset","bln_isThemeItem":true,"str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_67672923","innerHTML":"My Button"},"obj_domStyle":{"maxheight":"175","font-size":"1.2rem","font-weight":"bold","color":"white","display":"block"},"dom_objContentContainer":{"Id":"myId_67672923"}}],
[77814, {"obj_design":{"int_idRecord":"77814","str_idXDesign":"myId_67661363","str_name":"form_button_icon","str_nameShort":"form_button_icon","str_type":"form_button_icon","str_tag":"i","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_button_icon","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_79120090","str_categoryName":"","str_nameRegistrator":"notset","bln_isThemeItem":true,"str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"star","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_67661363","innerHTML":"star"},"obj_domStyle":{"font-size":"1.5em","font-weight":"bold","color":"white","display":"block"},"dom_objContentContainer":{"Id":"myId_67661363"}}],
[77815, {"obj_design":{"int_idRecord":77815,"str_idXDesign":"myId_37371641","str_name":"form_button_anchor","str_nameShort":"form_button_anchor","str_type":"form_button_anchor","str_tag":"a","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_button_anchor","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_77377077","arr_item":[{"obj_design":{"int_idRecord":"77813","str_type":"form_button_span"}},{"obj_design":{"int_idRecord":"77814","str_type":"form_button_icon"}}],"str_categoryName":"","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"target":"_blank","Id":"myId_37371641"},"obj_domStyle":{"justify-content":"center","align-items":"center","text-decoration":"none","font-size":"1.2rem","font-weight":"bold","display":"flex","text":"de","border":"0px solid black","gap":"0.5em","color":"white"},"dom_objContentContainer":{"Id":"myId_37371641"},"obj_icon":{"obj_design":{"int_idRecord":"77814","str_type":"form_button_icon"}},"obj_span":{"obj_design":{"int_idRecord":"77813","str_type":"form_button_span"}}}],
[77816, {"obj_design":{"int_idRecord":77816,"str_idXDesign":"myId_14263737","str_name":"menu_button","str_nameShort":"menu_button","str_type":"form_button_rich","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"menu_buttonx","bln_registerAtContainer":true,"str_classExtend":"form_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_idProject":"myId_29727565","arr_item":[{"obj_design":{"int_idRecord":77815,"str_type":"form_button_anchor"}}],"str_icon":"xapp_star","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"","str_text":"My Button","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_14263737"},"obj_domStyle":{"font-size":"1.2rem","font-weight":"bold","margin-bottom":"1px","justify-content":"center","align-items":"center","cursor":"pointer","color":"white","width":"100%","display":"flex","padding":"1em","gap":"1em","background":"green","border":"10px solid orange"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_14263737","str_name":"xapp_button_navigate_desktop"}}],
[77821, {"obj_design":{"int_idRecord":77821,"str_idXDesign":"myId_29752282","str_name":"form_container","str_nameShort":"form_container","str_type":"block","str_tag":"form_container","str_createdDate":"2022-01-31 21:10:58","str_modifiedDate":"2022-01-31 21:10:58","bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","bln_createRelease":"false","bln_isLocalHome":true,"bln_classController":"false","str_themeType":"form_container","bln_editPin":true,"arr_item":[{"obj_design":{"int_idRecord":"77835","str_type":"form_panel"}},{"obj_design":{"int_idRecord":"77836","str_type":"form_hardrule"}}],"str_nameRegistrator":"notset","str_idProject":"myId_29727565","bln_isThemeItem":true,"str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset"},"obj_domProperty":{"Id":"myId_29752282"},"obj_domStyle":{"display":"flex","gap":"1em","flex-flow":"wrap","padding":"0em","background":"transparent"},"dom_objContentContainer":{"Id":"myId_29752282"}}],
[77826, {"obj_design":{"int_idRecord":"77826","str_idXDesign":"myId_75931362","str_name":"form_legend","str_nameShort":"form_legend","str_type":"form_legend","str_tag":"legend","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_legend","bln_editPin":true,"bln_registerAtContainer":true,"str_classExtend":"form_button","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_releaseLabel":"","str_text":"MyText","str_lastVersionDate":"notset","str_categoryName":"","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"href":"https:\/\/www.mycode.buzz","target":"_blank","innerHTML":"MyText","Id":"myId_37333474","tabIndex":"0"},"obj_domStyle":{"display":"block","text-decoration":"none","color":"white","user-select":"none","background":"rgb(64, 169, 236)","gap":"1em","padding":"1em","border-radius":"0.5em","border":"3px solid rgb(37, 150, 190)","opacity":"1"},"bln_enabled":true,"dom_objContentContainer":{"href":"https:\/\/www.mycode.buzz","target":"_blank","Id":"myId_37333474"}}],
[77827, {"obj_design":{"int_idRecord":"77827","str_idXDesign":"myId_15775917","str_name":"form_label","str_nameShort":"form_label","str_type":"form_label","str_themeType":"form_label","str_tag":"label","str_createdDate":"2022-11-13 21:59:51","str_modifiedDate":"2022-11-13 21:59:51","bln_editPin":true,"bln_typeable":true,"str_text":"My Label","bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_13000276","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"innerText":"My Label","Id":"myId_35320233"},"obj_domStyle":{"align-self":"flex-start","cursor":"pointer","color":"white","margin":"","max-height":"","max-width":"","min-width":"","overflow":"","word-break":"","padding":"1em","gap":"1em","border-radius":"0.5em","background":"","border":"3px solid rgb(37, 150, 190)"},"dom_objContentContainer":{"Id":"myId_35320233"}}],
[77828, {"obj_design":{"str_tag":"text","str_type":"form_text","str_idXDesign":"myId_11977716","str_name":"form_text","str_nameShort":"form_text","str_themeType":"form_input","int_idRecord":"77828","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_13000276","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"-","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"innerHTML":"-","Id":"myId_07195217"},"obj_domStyle":{"word-break":"normal","background":"white","maxheight":"175","overflow":"auto","color":"black","max-height":"500px","min-width":"","padding":"1em","gap":"1em","border-radius":"0.5em","border":"3px solid rgb(37, 150, 190)","font-size":"1.1rem"},"dom_objContentContainer":{"Id":"myId_07195217"}}],
[77829, {"obj_design":{"int_idRecord":"77829","str_idXDesign":"myId_21663177","str_name":"form_field","str_nameShort":"form_field","str_type":"form_field","str_tag":"field","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_field","bln_editPin":true,"bln_registerAtContainer":true,"arr_item":[{"obj_design":{"int_idRecord":"77827","str_type":"form_label"}},{"obj_design":{"int_idRecord":"77828","str_type":"form_text"}}],"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_21663177"},"obj_domStyle":{"flex-wrap":"wrap"," justify-content":"center","align-items":"","justify-content":"","border":"","flex-flow":"","display":"flex","gap":"1em","padding":"0em"},"dom_objContentContainer":{"Id":"myId_21663177"}}],
[77834, {"obj_design":{"int_idRecord":"77834","str_idXDesign":"myId_62839939","str_name":"form_fieldset","str_nameShort":"form_fieldset","str_type":"form_fieldset","str_tag":"fieldset","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_section","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","arr_item":[{"obj_design":{"int_idRecord":"77826","str_type":"form_legend"}},{"obj_design":{"int_idRecord":"77829","str_type":"form_field"}},{"obj_design":{"int_idRecord":77848,"str_type":"form_button_rich"}}],"bln_isThemeItem":true,"lockOpen":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_62839939"},"obj_domStyle":{"display":"flex","flex-direction":"column","flex-wrap":"wrap","flex-flow":"wrap","align-self":"flex-start","padding-top":"0px","padding-bottom":"0px","background-color":"transparent","box-shadow":"","padding":"1em","gap":"1em","border":"0px outset rgb(64, 169, 236)","background":"rgb(64, 169, 236)","border-radius":"0.5em","overflow":"hidden","margin":"0px"},"dom_objContentContainer":{"Id":"myId_62839939"},"bln_toggleState":true}],
[77835, {"obj_design":{"int_idRecord":"77835","str_idXDesign":"myId_81978191","str_name":"form_panel","str_nameShort":"form_panel","str_type":"form_panel","str_tag":"form_panel","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_panel","bln_editPin":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","str_categoryName":"","arr_item":[{"obj_design":{"int_idRecord":"77834","str_type":"form_fieldset"}}],"bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_81978191"},"obj_domStyle":{"display":"flex","flex-wrap":"column wrap","flex-flow":"","gap":"1em","background":"","border":"0px solid red","padding":"1em"},"dom_objContentContainer":{"Id":"myId_81978191"}}],
[77836, {"obj_design":{"int_idRecord":"77836","str_idXDesign":"myId_33710013","str_name":"form_hardrule","str_nameShort":"form_hardrule","str_type":"form_hardrule","str_themeType":"form_hardrule","str_tag":"hr","bln_registerAtContainer":true,"str_createdDate":"2023-09-28 17:30:59","str_modifiedDate":"2023-09-28 17:30:59","bln_editPin":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_nameRegistrator":"notset","str_idProject":"myId_29727565","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_78947874"},"obj_domStyle":{"height":"10px","width":"100%","border":"0px","background":"rgb(64, 169, 236)"},"dom_objContentContainer":{"Id":"myId_78947874"}}],
[77845, {"obj_design":{"str_tag":"span","str_type":"form_button_span","str_idXDesign":"myId_83303612","str_name":"form_button_span","str_nameShort":"form_button_span","str_themeType":"form_button_span","int_idRecord":"77845","str_createdDate":"2022-11-18 16:02:10","str_modifiedDate":"2022-11-18 16:02:10","blnIsTag":true,"bln_editPin":true,"bln_typeable":true,"bln_registerAtContainer":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_idProject":"myId_11190110","str_text":"My Button","str_categoryName":"","str_nameRegistrator":"notset","bln_isThemeItem":true,"str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_lastVersionDate":"notset","bln_classController":"false"},"obj_domProperty":{"Id":"myId_87111743","innerHTML":"My Button"},"obj_domStyle":{"maxheight":"175","font-wiegth":"bold","font-weight":"bold","font-size":"1.1rem","color":"rgb(64, 169, 236)","display":"block"},"dom_objContentContainer":{"Id":"myId_87111743"}}],
[77846, {"obj_design":{"int_idRecord":"77846","str_idXDesign":"myId_40873233","str_name":"form_button_icon","str_nameShort":"form_button_icon","str_type":"form_button_icon","str_tag":"i","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_button_icon","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_79120090","str_categoryName":"","str_nameRegistrator":"notset","bln_isThemeItem":true,"str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"star","str_lastVersionDate":"notset","str_class":"star","bln":"expand","bln_expand":true,"bln_classController":"false"},"obj_domProperty":{"Id":"myId_17078909","innerHTML":"star"},"obj_domStyle":{"font-weight":"bold","font-size":"1.5em","color":"rgb(64, 169, 236)","display":"block"},"dom_objContentContainer":{"Id":"myId_17078909"}}],
[77847, {"obj_design":{"int_idRecord":77847,"str_idXDesign":"myId_37442227","str_name":"form_button_anchor","str_nameShort":"form_button_anchor","str_type":"form_button_anchor","str_tag":"a","str_createdDate":"2022-01-31 21:05:11","str_modifiedDate":"2022-01-31 21:05:11","bln_palettePinRelease":true,"bln_palettePin":true,"bln_createRelease":"false","bln_isLocalHome":true,"str_themeType":"form_button_anchor","bln_editPin":true,"bln_registerAtContainer":true,"str_idProject":"myId_11190110","arr_item":[{"obj_design":{"int_idRecord":"77845","str_type":"form_button_span"}},{"obj_design":{"int_idRecord":"77846","str_type":"form_button_icon"}}],"str_categoryName":"","str_nameRegistrator":"notset","str_content":"","str_classList":"notset","str_classExtend":"notset","str_releaseLabel":"","str_text":"notset","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"target":"_blank","Id":"myId_37442227"},"obj_domStyle":{"justify-content":"center","align-items":"center","text-decoration":"none","font-size":"1.1rem","font-weight":"bold","display":"flex","text":"de","border":"0px solid black","gap":"0.5em","color":"rgb(64, 169, 236)"},"dom_objContentContainer":{"Id":"myId_37442227"},"obj_icon":{"obj_design":{"int_idRecord":"77846","str_type":"form_button_icon"}},"obj_span":{"obj_design":{"int_idRecord":"77845","str_type":"form_button_span"}}}],
[77848, {"obj_design":{"int_idRecord":77848,"str_idXDesign":"myId_48263332","str_name":"form_button_rich","str_nameShort":"form_button_rich","str_type":"form_button_rich","str_tag":"button","str_content":"My component","str_createdDate":"2022-02-02 19:54:40","str_modifiedDate":"2022-02-02 19:54:40","bln_typeable":true,"bln_createRelease":"false","bln_isLocalHome":true,"bln_editPin":true,"str_themeType":"form_button","bln_registerAtContainer":true,"str_classExtend":"form_button","blnIsTag":true,"bln_palettePinRelease":true,"bln_palettePin":true,"str_categoryName":"","str_idProject":"myId_29727565","arr_item":[{"obj_design":{"int_idRecord":77847,"str_type":"form_button_anchor"}}],"str_icon":"xapp_star","str_nameRegistrator":"notset","str_classList":"notset","str_releaseLabel":"","str_text":"My Button","str_lastVersionDate":"notset","bln_isThemeItem":true,"bln_classController":"false"},"obj_domProperty":{"innerText":"Desktop","innerHTML":"Office","str_name":"xapp_button_navigate_desktop","Id":"myId_48263332"},"obj_domStyle":{"border-radius":"0.5em","align-items":"center","font-size":"1.1rem","font-weight":"bold","cursor":"pointer","color":"rgb(64, 169, 236)","display":"flex","padding":"1em","gap":"1em","background":"white","border":"3px solid rgb(37, 150, 190)"},"bln_enabled":true,"dom_objContentContainer":{"Id":"myId_48263332","str_name":"xapp_button_navigate_desktop"}}]
]);
/*END INSTANCE JSON MAP//*/


//END JSONMAP

