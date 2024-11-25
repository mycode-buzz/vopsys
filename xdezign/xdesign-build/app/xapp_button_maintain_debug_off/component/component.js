      //XSTART component/xapp_button_maintain_debug_off
      class xapp_button_maintain_debug_off extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          
          obj_project.fn_forgetEvent(e);                  
          let obj_menuButton=this.fn_getMenuButton();                    
          let obj_dashboard=obj_menuButton.fn_locateItem("xapp_dashboard_autorowz");
          if(obj_dashboard){                    
            obj_dashboard.fn_maintain_debug_off();
          }                            
        }                        
      }//END CLS
      //END TAG
      //END component/xapp_button_maintain_debug_off        