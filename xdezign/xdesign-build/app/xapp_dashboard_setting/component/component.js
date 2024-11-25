      //XSTART component/xapp_dashboard_setting
      class xapp_dashboard_setting extends xapp_dashboard{
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
            this.obj_button_maintain=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_maintain");                                    
            this.obj_button_backup=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_backup");                                    
            this.obj_button_maintain_debug_release=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_maintain_debug_release");                                               
                       
            
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain);     
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_backup);                        
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_maintain_debug_release);          

            
            this.fn_toggleDebugPin();            
          }                    
        } 
        fn_refreshDashboard(){         
        }

        fn_toggleDebugPin(){

          let obj_ini=new Object;            
          obj_ini.str_action="xmaintain_debug_status";                                               
          this.fn_runServerAction(obj_ini);                                                                  
        }

        maintain_debug_status(obj_post){          
          let str_singleQueryValue=obj_post.SingleQueryValue;
          //console.log(str_singleQueryValue);          
          if(str_singleQueryValue==="maintain_debug_status_off"){
            this.obj_consoleContainerMaintain.fn_setDisabledItem(this.obj_button_maintain_debug_release);                      
          }                    
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
        
        
        
      }//END CLS
      //END TAG
      //END component/xapp_dashboard_setting        