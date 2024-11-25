
            //XSTART component/desk_form_button
              class desk_form_button extends xapp_console_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onClick(e){                                                        
                  obj_path.fn_navigateSubdomain(this.obj_design.str_subdomain);
                  
                  obj_project.fn_forgetEvent(e);    
                }  
              }//END CLS
              //END TAG
              //END component/desk_form_button