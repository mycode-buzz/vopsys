      //XSTART component/xapp_dashboard_autorowz
      class xapp_dashboard_autorowz extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_loadDashboard(){                                                                                              
          
          this.obj_menuPanel=this.fn_getParentComponent();                  
          this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);                                
          this.obj_button_maintain_debug_on=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_maintain_debug_on");                            
          this.obj_button_maintain_debug_off=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_maintain_debug_off");                            
          this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain_debug_off);          
        }         
        fn_refreshDashboard(){
          //console.log("xapp_dashboard_autorowz refresh xapp_dashboard");                  
          this.obj_consoleContainerMaintain.fn_hide();
          let foo_value=this.fn_getMetaDataValue("`meta_rowz`.`meta_rowz`.`DebugPin`");
          let bln_value=obj_shared.fn_parseBool(foo_value);                                            
          if(bln_value){
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain_debug_off);          
            this.obj_consoleContainerMaintain.fn_hideItem(this.obj_button_maintain_debug_on);          
          }
          else{
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain_debug_on);          
            this.obj_consoleContainerMaintain.fn_hideItem(this.obj_button_maintain_debug_off);          
          }
        }
        

        fn_maintain_getDataRowzId(){
          return this.fn_getMetaDataValue("`meta_rowz`.`meta_rowz`.`MetaRowzId`");
        }

        fn_maintain_debug_on(){
          let obj_ini=new Object;            
          obj_ini.str_action="maintain_debug_on";                                     
          obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                         
          obj_ini.int_idMetaRowz=this.fn_maintain_getDataRowzId();
          if(obj_ini.int_idMetaRowz){            
            this.fn_runServerAction(obj_ini);                                                                  
          }          
        }
        maintain_debug_on(){
          this.fn_refreshMenu();
        }
        fn_maintain_debug_off(){
          let obj_ini=new Object;            
          obj_ini.str_action="maintain_debug_off";
          obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                         
          obj_ini.int_idMetaRowz=this.fn_maintain_getDataRowzId();
          if(obj_ini.int_idMetaRowz){            
            this.fn_runServerAction(obj_ini);                                                                  
          }          
        }
        maintain_debug_off(){
          this.fn_refreshMenu();
        }
        fn_refreshMenu(){
          let obj_menuButton=this.obj_holder.obj_parentMenu;          
          obj_menuButton.fn_refreshMenu();
        }


        
      }//END CLS
      //END TAG
      //END component/xapp_dashboard_autorowz        