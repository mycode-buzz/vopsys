      //XSTART component/xapp_dashboard_autoformname
      class xapp_dashboard_autoformname extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_loadDashboard(){                                                                                              
          
          this.obj_menuPanel=this.fn_getParentComponent();                  
          this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);                      
          this.obj_button_form_add_group=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_add_group");                            
          this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_add_group);          
        }         
        fn_form_add_group(){
          let obj_ini=new Object;            
          obj_ini.str_action="form_add_group";                                     
          obj_ini.str_nameFolderServer="xapp_dashboard_setting";                     
          //console.log("fn_form_add_group");

          let obj_menuButton=this.fn_getMenuButton();                    
          let int_idMetaRowz=obj_menuButton.fn_getMetaRowzId();          
          obj_ini.int_idMetaRowz=int_idMetaRowz;
          this.fn_runServerAction(obj_ini);                                                                  
        }
        form_add_group(){
          console.log("form_add_group");         
          this.fn_refreshMenu();        
        }

        fn_refreshMenu(){
          let obj_menuButton=this.fn_getMenuButton();
          if(!obj_menuButton){return;}                      
          obj_menuButton.fn_refreshMenu();
        }


      }//END CLS
      //END TAG
      //END component/xapp_dashboard_autoformname        