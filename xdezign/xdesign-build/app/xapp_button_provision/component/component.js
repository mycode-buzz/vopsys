      //XSTART component/xapp_button_provision
      class xapp_button_provision extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          obj_project.fn_forgetEvent(e);                            
          let bln_value=obj_shared.fn_messageConfirm("Really Provision?");
          if(bln_value){          
            let obj_menuButton=this.fn_getMenuButton();          
            let obj_dashboard=obj_menuButton.fn_locateItem("xapp_dashboard_setting");          
            if(obj_dashboard){                    
              obj_dashboard.fn_provision();
            }                    
          } 
        }           
      }//END CLS
      //END TAG
      //END component/xapp_button_provision        