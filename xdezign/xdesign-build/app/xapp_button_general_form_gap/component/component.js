      //XSTART component/xapp_button_general_form_gap
      class xapp_button_general_form_gap extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}  
          
          obj_menuButton.fn_formGap();          
          
          obj_project.fn_forgetEvent(e);    
        }                
      }//END CLS
      //END TAG
      //END component/xapp_button_general_form_gap        