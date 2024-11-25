      //XSTART component/xapp_button_file_import
      class xapp_button_file_import extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                  

          
          obj_project.fn_forgetEvent(e);    

          let obj_menuButton=this.fn_getMenuButton();                  
          if(!obj_menuButton){return;}                                    

          let obj_dashboard=obj_menuButton.fn_locateItem("xapp_dashboard_view");
          if(obj_dashboard){                    
            obj_dashboard.fn_buttonFileImportOnClick();
          }                  
          
        
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_file_import        