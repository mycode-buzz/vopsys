//XSTART component/login_dashboard
class login_dashboard extends xapp_dashboard{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                

    this.obj_holder.bln_debugServer=true;      
  }

  fn_formatPost(obj_ini){  

    let obj_post;
    
    obj_post=super.fn_formatPost(obj_ini);   
    
    obj_post.MetaUserEmail=obj_ini.MetaUserEmail;        
    obj_post.AuthorizeUserPass=obj_ini.AuthorizeUserPass;       
        
    return obj_post;
}  


  fn_loadDashboard(){         
    if(obj_shared.fn_inStr("login.", location.hostname)){      
      this.fn_XDesigner_endAuthorize();//logout                    
      //console.log("login end auth");
    }
    else{
      //console.log("no login subdomain so no end auth");
    } 
    this.fn_addContextItem("login_panel");                                    
  }   

  fn_resetForm(){          
    let obj_item;    
    obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserEmail");                                                
    if(obj_item){
      obj_item.fn_setDisplay(true);        
      obj_item.fn_setText("");                    
      //obj_item.fn_debug("fn_resetForm");
    }                    
    obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserPass");
    if(obj_item){
      obj_item.fn_setDisplay(false);        
      obj_item.fn_setText("");                    
    }    
  }
  fn_XDesigner_endAuthorize(){
    this.fn_resetForm();
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
    
    
    obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserEmail");
    if(obj_item){
      MetaUserEmail=obj_item.fn_getValue();            
      obj_item.fn_setDisplay(true);        
      /*
      obj_item.fn_setDomProperty("autocomplete", "email");        
      obj_item.fn_setDomProperty("type", "email");    
      //*/   
    }                            
    
    obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserPass");
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
      return;
    }

    let obj_auth={        
      MetaUserEmail:MetaUserEmail,
      AuthorizeUserPass:AuthorizeUserPass
    };

    this.fn_setAuthorizeObject(obj_auth);    
    this.fn_getAuthorizeObject(obj_auth);
    this.fn_XDesigner_startAuthorize(obj_auth);

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
    
    this.fn_setAuthorizeObject(obj_post);//set values from server on client
    let obj_auth=this.fn_getAuthorizeObject();//get client values      
    
    let bln_valid=obj_shared.fn_validEmail(obj_auth.MetaUserEmail);
    if(!bln_valid){
      bln_value=this.fn_requireAuthorizeUserEmail();        
      if(!bln_value){return false;}
    }          
    
    //*
    if(!obj_auth.AuthorizeUserPass){
      bln_value=this.fn_requireAuthorizeUserPass();        
      if(!bln_value){return false;}             
    }
    //*/

    /*
    let obj_item=obj_project.fn_getComponent("login_button_send");                
    obj_item.fn_setText("Sent");    
    obj_item.fn_setDisabled();
    //*/

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
    let obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserEmail");                    
    
    let MetaUserEmail;
    if(obj_item){
      obj_item.fn_setDisplay(true);        
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
    let obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserPass");                                
    if(obj_item){
      obj_item.fn_setDisplay(true);        
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