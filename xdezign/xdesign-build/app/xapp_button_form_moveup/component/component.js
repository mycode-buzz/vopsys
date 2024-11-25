      //XSTART component/xapp_button_form_moveup
      class xapp_button_form_moveup extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }        
        fn_onClick(e){                                    
          
          obj_project.fn_forgetEvent(e);                  
          let obj_menuButton=this.fn_getMenuButton();
          let obj_dashboard=obj_menuButton.fn_locateItem("xapp_dashboard_autoformdata");
          if(obj_dashboard){                    
            obj_dashboard.fn_form_moveup();
          }                  
        }                             
      }//END CLS
      //END TAG
      //END component/xapp_button_form_moveup        