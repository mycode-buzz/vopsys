            //XSTART component/xapp_menu_panel
              class xapp_menu_panel extends form_menu_panel{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                                      

                  //this.obj_holder.bln_listenClick=true;
                }                
                xfn_onClick(){
                  //currently disabled as casuing too many niggly issues - to do find a solution on blur or fix the issues.
                  let obj_menuButton=this.fn_getMenuButton();
                  if(obj_menuButton.obj_dataView){
                    obj_menuButton.obj_dataView.fn_setModeExecuteView();//Closes all editable controls , except lists and currently selected control
                  }
                }

                fn_getMenuButton(){
                  return this.obj_parentMenu;
                }
                
                fn_onLoad(){
                  super.fn_onLoad();                
                  if(!this.obj_console){
                    this.obj_console=this.fn_addContextItem("xapp_console");
                  }                                    
                }                
                fn_getDashboardConsoleContainer(){                                                      
                  return this.fn_getConsoleContainer("xapp_console_container_dashboard");                  
                }                
                
              }//END CLS
              //END TAG
              //END component/xapp_menu_panel