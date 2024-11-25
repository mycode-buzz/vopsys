      //XSTART component/xapp_button_data_nav_toggle
      class xapp_button_data_nav_toggle extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){        
          let obj_parent=this.fn_getParentComponent();          
          let obj_menuButton=obj_parent.obj_menuButton;                  
          if(!obj_menuButton){return;}                                    
          obj_menuButton.fn_dataNavToggle();                    
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_data_nav_toggle        