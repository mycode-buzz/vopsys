
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