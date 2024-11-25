      //XSTART component/xapp_button_file_select
      class xapp_button_file_select extends form_button_rich{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){          

          
          obj_project.fn_calmEvent(e);//dont cancel the event 

          let obj_menuButton=this.fn_getMenuButton();                  
          if(!obj_menuButton){return;}                                    

          let obj_dashboard=obj_menuButton.fn_locateItem("xapp_dashboard_view");
          if(obj_dashboard){                    
            obj_dashboard.fn_buttonFileSelectOnClick();
          }                  
        }

        fn_inputFileSelectOnChange(){
        
          let obj_menuButton=this.fn_getMenuButton();                  
          if(!obj_menuButton){return;}                                    

          let obj_dashboard=obj_menuButton.fn_locateItem("xapp_dashboard_view");
          if(obj_dashboard){                    
            obj_dashboard.fn_inputFileSelectOnChange();
          }                  
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_file_select        