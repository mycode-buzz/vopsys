
            //XSTART component/xapp_dashboard
              class xapp_dashboard extends xapp_component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("pink");}                  
                }
                fn_loadDashboard(){//should be overidden                  
                  console.log("default load xapp_dashboard");                  
                }
                fn_refreshDashboard(){
                  //console.log("default refresh xapp_dashboard");                  
                }

                fn_hide(){
                  
                  let obj_console;
                  obj_console=this.obj_consoleContainerDashboard;
                  if(obj_console){obj_console.fn_hide();}
                  obj_console=this.obj_consoleContainerDashboardLeft;
                  if(obj_console){obj_console.fn_hide();}

                  //will cause other consoles to be hidden so dont use
                  //let obj_menuButton=this.fn_getMenuButton();                  
                  //obj_menuButton.fn_hideMenuPanel();                                    
                  
                }
                fn_disable(){
                  let obj_menuButton=this.fn_getMenuButton();                  
                  obj_menuButton.fn_disableConsole();                                    
                }
                fn_getMetaColumn(str_fieldName){
                  let obj_menuButton=this.obj_holder.obj_parentMenu;          
                  let obj_recordset=obj_menuButton.obj_dataView;                                      
                  return obj_recordset.fn_getMetaColumnViaName(str_fieldName);                    
                }
                fn_getMetaDataValue(str_fieldName){
                  let obj_metaColumn=this.fn_getMetaColumn(str_fieldName);
                  if(obj_metaColumn){
                    return obj_metaColumn.str_value;                                  
                  }          
                }
                
                
              }//END
              //END TAG
              //END component/xapp_dashboard