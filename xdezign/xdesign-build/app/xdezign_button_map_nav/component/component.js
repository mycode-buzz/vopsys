
            //XSTART component/xdezign_button_map_nav
              class xdezign_button_map_nav extends form_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                }     
              
                fn_onClick(e){    
                  
                  let obj_dashboard=this.fn_getBaseClassParent("xapp_dashboard");
                  
                  switch(this.obj_design.bln_navigateDirection){
                    case 1:
                      obj_dashboard.fn_moveCompassUp();    
                    break;
                    case 0:
                      obj_dashboard.fn_moveCompassHorizontal();    
                    break;
                    case -1:
                      obj_dashboard.fn_moveCompassDown();    
                    break;              
                  }
                  obj_project.fn_unsetEvent();    
                }
              }//END CLS
              //END TAG
              //END component/xdezign_button_map_nav