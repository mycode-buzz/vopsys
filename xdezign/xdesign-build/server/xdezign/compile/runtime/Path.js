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