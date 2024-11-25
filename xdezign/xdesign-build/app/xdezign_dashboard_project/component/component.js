
            //XSTART component/xdezign_dashboard_project
              class xdezign_dashboard_project extends xapp_dashboard{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
                  this.obj_holder.bln_debugServer=false;                                    
                }
                fn_loadDashboard(){                                                                            
                  
                  let obj_menuPanel=this.fn_getParentComponent();                  
                  let obj_container=this.obj_consoleContainerDashboard=obj_menuPanel.fn_addConsoleContainer("xapp_console_container_dashboard", true);
                  this.obj_button_new_project=obj_container.fn_addConsoleContextItem("xdezign_button_new_project");                                        
                  
                  let obj_containerLeft=this.obj_consoleContainerDashboardLeft=obj_menuPanel.fn_addConsoleContainer("xapp_console_container_dashboard", false);
                  this.obj_button_maintain_project=obj_containerLeft.fn_addConsoleContextItem("xdezign_button_maintain_project");
                  
                  //this.obj_hardrule=this.fn_addContextItem("form_hardrule");                                    
                  this.fn_onProjectNeutral();                  
                }                                
                fn_showHardRule(bln_value){                  
                  this.fn_notify(this.obj_hardrule, "fn_setDisplay", bln_value);
                }                

                //NEW
                fn_newProject(){//BUTTON PRESS            
                  obj_project.fn_unLoad();   

                  let obj_ini=new Object;            
                  obj_ini.str_action="newProject";                           
                  obj_ini.str_nameFileServer="new.php";                                                                                            
                  this.fn_runServerAction(obj_ini);                                                        
                }                 
                newProject(obj_post){                               
                  this.fn_onNewProject(obj_post);
                }   
                fn_onNewProject(obj_post){                                
                  obj_post.RecordName="New Project";
                  obj_project.fn_navigateToProject(obj_post);                        
                }
                //NEW
                
                fn_openComponent(){      
                  let int_idRecord=obj_project.obj_palettSelected.obj_design.int_idRecord;                  
                  let str_nameShort=obj_project.obj_palettSelected.obj_design.str_nameShort;                  
                  this.fn_openProject(int_idRecord, str_nameShort);
                }
                //OPEN
                fn_openProject(int_idRecord, str_nameShort){//BUTTON PRESS            
                  //console.log("fn_openProject");
                  obj_project.fn_unLoad();   

                  let obj_ini=new Object;            
                  obj_ini.str_action="openProject";                           
                  obj_ini.str_nameFileServer="open.php";                                                                                            
                  obj_ini.RecordId=int_idRecord;          
                  obj_ini.str_nameShort=str_nameShort;                            
                  this.fn_runServerAction(obj_ini);                                         
                } 
                openProject(obj_post){                               
                  this.fn_onOpenProject(obj_post);
                }   
                fn_onOpenProject(obj_post){     
                  //console.log("fn_onOpenProject");                           
                  obj_project.fn_navigateToProject(obj_post);                        
                }
                //OPEN
                fn_navigateToProject(){                  

                  let obj_dashboard;                  
                  obj_dashboard=this;
                  obj_dashboard.fn_disable();
                  obj_project.fn_forgetEvent();                                    
                  //obj_project.fn_debugEvent();                                    
                }                
                fn_closeProject(){                  
                  obj_project.fn_navigateToWelcomeScreen();                                                            
                }
                fn_locateProject(){                  

                  let obj_button, obj_dashboard;                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");                  
                  obj_dashboard.fn_hide();                  

                  obj_dashboard.fn_locateComponent();
                }
                
                
                fn_navigateToWelcomeScreen(){
                  this.fn_onProjectNeutral()                  
                }
                
                fn_onProjectNeutral(){                                    

                  let obj_dashboard;                  
                  obj_dashboard=this;
                  obj_dashboard.fn_hide();                                                      
                  
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_new_project);                 
                  obj_dashboard.obj_consoleContainerDashboardLeft.fn_showItem(obj_dashboard.obj_button_maintain_project);                   
                  
                }
                
                fn_onPaletteItemSelected(){

                  let obj_button, obj_dashboard;                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");
                  obj_dashboard.fn_hide();                                    

                  obj_button=obj_dashboard.obj_button_locate_project;                                    
                  obj_dashboard.obj_consoleContainerDashboard.fn_setDisabledItem(obj_button);
                  if(obj_project.obj_palettSelected!==obj_projectTarget){
                    obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_button);
                  }
                  
                  obj_button=obj_dashboard.obj_button_save_project;                                    
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_button);
                  if(obj_project.obj_palettSelected!==obj_projectTarget){
                    obj_dashboard.obj_consoleContainerDashboard.fn_setDisabledItem(obj_button);                    
                  }

                  obj_button=obj_dashboard.obj_button_close_project;                                    
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_button);
                  if(obj_project.obj_palettSelected!==obj_projectTarget){
                    obj_dashboard.obj_consoleContainerDashboard.fn_setDisabledItem(obj_button);
                  }
                }

                //SAVE
                fn_saveProject(){

                  obj_project.fn_setPaletteSelected();

                  let obj_dashboard;                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");                                    
                  obj_dashboard.fn_disable();                  
                  
                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_save");
                  if(obj_dashboard){                                      
                    obj_dashboard.fn_saveProject();
                  }                  

                }                                  


                fn_onPublishProject(){
                  let str_date=obj_projectTarget.obj_design.str_lastVersionDate;
                  let bln_value=obj_shared.fn_validDate(str_date);                  
                  //console.log("str_lastVersionDate: " + obj_projectTarget.obj_design.str_lastVersionDate);
                  obj_project.fn_setPaletteSelected();
                  if(bln_value){                                        

                    obj_projectTarget.obj_design.str_lastVersionDate=str_date;

                    let obj_button, obj_dashboard;                  
                    obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");
                    
                    obj_dashboard.fn_hide();                  

                    obj_dashboard.obj_consoleContainerDashboardLeft.fn_showItem(obj_dashboard.obj_button_duplicate_project);                      
                    
                    obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_locate_project);                 
                    obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_release_project);                 
                    obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_close_project);                                                           
                  }                    

                  let obj_menuButton;                  
                  obj_menuButton=obj_project.fn_locateItem("xdezign_menu_map");
                  obj_menuButton.fn_setEnabled();
                  obj_menuButton.fn_open();                  
                }
                //SAVE
                

                fn_releaseProject(){

                  let obj_button, obj_dashboard;                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");                  
                  obj_dashboard.fn_disable();                  
                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_save");
                  if(obj_dashboard){                    
                    obj_dashboard.fn_releaseProject();
                  }                  
                }
                
                fn_onReleaseProject(){

                  let obj_dashboard;                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");                                                                                          
                  obj_dashboard.obj_consoleContainerDashboardLeft.fn_showItem(obj_dashboard.obj_button_duplicate_project);                   
                  
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_locate_project);                   
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_release_project);                   
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_close_project);                   
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_view_project);                  

                  let obj_menuButton;                  
                  obj_menuButton=obj_project.fn_locateItem("xdezign_menu_map");
                  obj_menuButton.fn_setEnabled();
                  obj_menuButton.fn_open();                  
                }
                

                fn_onMaintainProject(){
                  this.fn_onProjectNeutral();                  
                }
                
                
                //DUPLICATE                
                fn_duplicateProject(){

                  let obj_dashboard;                  
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_map");                  
                  obj_dashboard.fn_disable();                  

                  let bln_protectChildren=true;                    
                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_save")                  
                  if(obj_dashboard){                                      
                    obj_dashboard.fn_saveAsProject(bln_protectChildren);
                  }                  
                }
                //DUPLICATE          

                

                //VIEW
                fn_viewProject(){                        
                  let str_subdomin=obj_project.obj_design.str_urlSubdomain;
                  let str_url=obj_path.fn_getURLNavigateSubdomain(str_subdomin);
                  let o=window.open(str_url, "xDesignViewInBrowser");
                  if(o){o.focus();}
                }
                //VIEW      

                //MAINTAIN
                fn_maintain_project(){                        

                  let obj_dashboard;
                  obj_dashboard=this;
                  obj_dashboard.fn_disable();                                    

                  obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_save");
                  if(obj_dashboard){                    
                    obj_dashboard.fn_maintain();
                  }                                    
                }
                fn_onMaintainProject(){                

                  let obj_dashboard;                  
                  obj_dashboard=this;                  
                  obj_dashboard.obj_consoleContainerDashboard.fn_showItem(obj_dashboard.obj_button_new_project);                                   
                  obj_dashboard.obj_consoleContainerDashboardLeft.fn_showItem(obj_dashboard.obj_button_maintain_project);                  
                  
                  //obj_project.fn_debugText("Complete Maintain");                        
                  obj_project.fn_navigateToWelcomeScreen();            
                }  
                //MAINTAIN
         
              }//END CLS
              //END TAG
              //END component/xdezign_dashboard_project