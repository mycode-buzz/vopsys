      //XSTART component/xapp_dashboard_push_row
      class xapp_dashboard_push_row extends xapp_dashboard{
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
            this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);            
            this.obj_button_push_reset=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_push_reset");                                    
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_push_reset);                                    
          }                    
        } 
        
        fn_push_reset(){

          let obj_column, obj_row;
          let obj_menuButton=this.obj_holder.obj_parentMenu;                             
          let obj_recordset=obj_menuButton.obj_dataView;                              
          obj_row=obj_recordset.fn_getRow(0);          
          
          obj_column=obj_row.fn_getColumnViaName("`meta_push`.`meta_push`.`ScriptStatus`");                    
          this.fn_updateColumnValue(obj_column, "READY");   
          obj_column=obj_row.fn_getColumnViaName("`meta_push`.`meta_push`.`SystemIdCurrent`");                    
          this.fn_updateColumnValue(obj_column, "0");   
          obj_column=obj_row.fn_getColumnViaName("`meta_push`.`meta_push`.`SystemIdTo`");                              
          this.fn_updateColumnValue(obj_column, "0");   
          obj_column=obj_row.fn_getColumnViaName("`meta_push`.`meta_push`.`ScriptDate`");                    
          this.fn_updateColumnValue(obj_column, "");   

        }

        fn_updateColumnValue(obj_column, str_value){
          obj_column.fn_setValue(str_value);
          obj_column.fn_pushColumn();                                 
        }
      }//END CLS
      //END TAG
      //END component/xapp_dashboard_push_row        