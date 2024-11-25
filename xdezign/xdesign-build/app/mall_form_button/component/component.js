
            //XSTART component/mall_form_button
              class mall_form_button extends xapp_console_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                             
                }                                
                fn_onClick(e){                                      
                  let obj_parentDashboard=this.fn_getParentComponent();
                  obj_parentDashboard.fn_subscribeToApp(this.obj_design.int_idRecord);
                  //obj_path.fn_navigateSubdomain(this.obj_design.str_subdomain);
                  
                  obj_project.fn_forgetEvent(e);    
                }  
              }//END CLS
              //END TAG
              //END component/mall_form_button