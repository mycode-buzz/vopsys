
            //XSTART component/xdezign_button_action_item
              class xdezign_button_action_item extends form_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                } 
                fn_onClick(e){        
                  
                  
                  let obj_dashboardMap=obj_project.fn_locateItem("xdezign_dashboard_map");
                  switch(this.obj_design.str_buttonAction){
                    case"fn_copyComponent":      
                      obj_dashboardMap.fn_copyComponent();
                    break;
                    case"fn_pasteComponent":      
                      obj_dashboardMap.fn_pasteComponent();
                    break;
                    case"fn_cutComponent":      
                      obj_dashboardMap.fn_cutComponent();
                    break;
                    case"fn_insertComponent":      
                      obj_dashboardMap.fn_insertComponent();
                    break;
                    case"fn_setEazyGridSwitch":      
                      obj_dashboardMap.fn_setEazyGridSwitch();
                    break;                    
                    case"fn_openComponent":      
                      let obj_dashboardProject=obj_project.fn_locateItem("xdezign_dashboard_project");   
                      obj_dashboardProject.fn_openComponent();
                    break;
                    case"fn_toggleComponent":                            
                      obj_dashboardMap.fn_toggleComponent();
                    break; 
                    case "fn_rotateComponent":
                      obj_dashboardMap.fn_rotateComponent();
                    break;                   
                    
              
                  }
                  
                  
                  obj_project.fn_unsetEvent();    
                }  
              }//END CLS
              //END TAG
              //END component/xdezign_button_action_item