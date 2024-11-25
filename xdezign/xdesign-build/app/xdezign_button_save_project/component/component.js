
            //XSTART component/xdezign_button_save_project
              class xdezign_button_save_project extends form_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onClick(e){                  
                  
                  
                  obj_project.fn_forgetEvent(e);                  
                  
                  let obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_project");
                  if(obj_dashboard){                    
                    obj_dashboard.fn_saveProject();
                  }                  
                }                
              }//END CLS
              //END TAG
              //END component/xdezign_button_save_project