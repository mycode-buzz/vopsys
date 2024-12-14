      //XSTART component/xapp_dashboard_setting
      class xapp_dashboard_setting extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }

        fn_loadDashboard(){
          if(!super.fn_loadDashboard()){return;}                                                                                              
          
          this.obj_menuPanel=this.fn_getParentComponent();                  
          if(this.obj_menuPanel){
            let obj_consoleContainerMaintain;
            this.obj_consoleContainerMaintain=obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);                        
            this.obj_button_maintain=obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_maintain");            
            this.obj_button_provision=obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_provision");
            this.obj_button_backup=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_backup");
            this.obj_button_transferdb=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_transferdb");
            this.obj_button_maintain_debug_release=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_maintain_debug_release");                                                                       
            
            obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain);
            obj_consoleContainerMaintain.fn_showItem(this.obj_button_provision);    
            obj_consoleContainerMaintain.fn_showItem(this.obj_button_backup);                        
            obj_consoleContainerMaintain.fn_showItem(this.obj_button_transferdb);                                    
            obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain_debug_release);                      
            

            /*
            this.obj_button_provision_account=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_provision_account");
            this.obj_button_provision_opportunity=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_provision_opportunity");
            this.obj_button_provision_contact=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_provision_contact");
            this.obj_button_provision_task=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_provision_task");
            
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_provision_account);                 
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_provision_opportunity);                 
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_provision_contact);                 
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_provision_task);                 
            //*/
            
            
          }                    
        } 
        fn_refreshDashboard(){         
        }

        fn_refreshMenu(){
          let obj_menuButton=this.obj_holder.obj_parentMenu;          
          obj_menuButton.fn_refreshMenu();
        }        
        
        fn_maintain(){
          let obj_ini=new Object;            
          obj_ini.str_action="maintain";                                     
          this.fn_runServerAction(obj_ini);                                                                  
        }        
        fn_provision(){
          let obj_ini=new Object;            
          obj_ini.str_action="provision";                                     
          this.fn_runServerAction(obj_ini);                                                                  
        }        

        fn_maintain_debug_release(){
          let obj_ini=new Object;            
          obj_ini.str_action="maintain_debug_release";                                               
          this.fn_runServerAction(obj_ini);                                                                  
        }

        maintain_debug_release(){
          this.fn_refreshMenu();
        }

        fn_backup(){
          
          let obj_ini=new Object;            
          obj_ini.str_action="backup";                                     
          this.fn_runServerAction(obj_ini);                                                                  
        } 
        fn_transferdb(){
          
          let obj_ini=new Object;            
          obj_ini.str_action="transferdb";                                     
          this.fn_runServerAction(obj_ini);                                                                  
        } 
        
        
        
      }//END CLS
      //END TAG
      //END component/xapp_dashboard_setting        