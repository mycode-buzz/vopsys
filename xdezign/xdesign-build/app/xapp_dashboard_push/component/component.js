      //XSTART component/xapp_dashboard_push
      class xapp_dashboard_push extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_loadDashboard(){                                                                                              
          
          this.obj_menuPanel=this.fn_getParentComponent();                  
          if(this.obj_menuPanel){
            
            this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);            
            this.obj_button_push_schedule=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_push_schedule");                                    
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_push_schedule);            
          }                    
        }         
        
      }//END CLS
      //END TAG
      //END component/xapp_dashboard_push        