
            //XSTART component/xdezign_dashboard_component
              class xdezign_dashboard_component extends xapp_dashboard{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }                                               
                
                fn_onOpenMenu(){                  
                  console.log("fn_onOpenMenu");                  
                }
              }//END CLS
              //END TAG
              //END component/xdezign_dashboard_component