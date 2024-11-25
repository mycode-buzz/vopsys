
            //XSTART component/xdezign_button_maintain_project
              class xdezign_button_maintain_project extends xapp_button{
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
                    obj_dashboard.fn_maintain_project();
                  }                  
                }
              }//END CLS
              //END TAG
              //END component/xdezign_button_maintain_project