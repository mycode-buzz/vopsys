      //XSTART component/xapp_dashboard_autoformdata
      class xapp_dashboard_autoformdata extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_loadDashboard(){                                                                                              
          
          this.obj_menuPanel=this.fn_getParentComponent();                  
          this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);            
          this.obj_button_form_movedown=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_movedown");                            
          this.obj_button_form_moveup=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_moveup");                            
          this.obj_button_form_gap=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_gap");                            
          this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_gap);
          this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_moveup);
          this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_movedown);
        }                 
        fn_form_gap(){
          let obj_ini=new Object;            
          obj_ini.str_action="form_gap";
          obj_ini.str_nameFolderServer="xapp_dashboard_setting";
          obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
          this.fn_runServerAction(obj_ini);                                                                  
        }
        fn_form_moveup(){
          let obj_ini=new Object;            
          obj_ini.str_action="form_moveup";                                     
          obj_ini.str_nameFolderServer="xapp_dashboard_setting";                               
          obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
          this.fn_runServerAction(obj_ini);                                                                  
        }

        fn_getMetaFormId(){          
          let obj_menuButton=this.obj_holder.obj_parentMenu;          
          let obj_recordset=obj_menuButton.obj_dataView;
          //obj_recordset.fn_describeMetaColumns();
          let obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("`meta_column`.`meta_column`.`MetaColumnId`");          
          return obj_metaColumn.str_value;
        }

        fn_form_movedown(){
          let obj_ini=new Object;            
          obj_ini.str_action="form_movedown";                                     
          obj_ini.str_nameFolderServer="xapp_dashboard_setting";                     
          obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
          this.fn_runServerAction(obj_ini);                                                                  
        }
        fn_formatPost(obj_ini){
          super.fn_formatPost(obj_ini);
          obj_post.MetaFormId=obj_ini.int_idMetaForm;
        }
        form_movedown(){
          //console.log("form_movedown");
          this.fn_refreshMenu();        
        }
        form_moveup(){
          //console.log("form_moveup");
          this.fn_refreshMenu();        
        }
        form_gap(){
          //console.log("form_gap");
          this.fn_refreshMenu();        
        }
        fn_refreshMenu(){
          let obj_menuButton=this.obj_holder.obj_parentMenu;
          if(!obj_menuButton){return;}                      
          let obj_parent=obj_menuButton.fn_getMenuButtonViaViewIdGoNorth(10);                           
          obj_parent.fn_refreshMenu();
        }
  

      }//END CLS
      //END TAG
      //END component/xapp_dashboard_autoformdata        