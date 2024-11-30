
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