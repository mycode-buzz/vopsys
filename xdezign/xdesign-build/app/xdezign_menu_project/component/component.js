
            //XSTART component/xdezign_menu_project
              class xdezign_menu_project extends xdezign_menu{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                  
                  this.obj_holder.bln_debugServer=false;                  
                }                                                
                fn_navigateToProject(obj_post){                                    

                  this.fn_setText("Project");
                  this.fn_setEnabled();
                  this.fn_setDisplay();                                                                        
                  this.fn_open();                                                      

                  /*                  
                  this.fn_setDisabled();                  
                  this.fn_setDisplay(false);
                  //*/
                  this.fn_notifyChildControl("fn_navigateToProject");                  
                }      
                fn_navigateToWelcomeScreen(){                  
                  
                  //*                  
                  this.fn_setText("Project");
                  this.fn_setEnabled();
                  this.fn_setDisplay();                                                                        
                  this.fn_open();                                                      
                  //*/

                  this.fn_notifyChildControl("fn_navigateToWelcomeScreen");
                }
                fn_onPaletteItemSelected(){      
                  
                  //*                  
                  this.fn_setDisabled();                  
                  this.fn_setDisplay(false);
                  this.fn_close();                                   
                  //*/
                  
                  //this.fn_close();                                   
                  //this.fn_setDisplay(false);                                   
                  this.fn_notifyChildControl("fn_onPaletteItemSelected");
                }                
                
                fn_showAccordion(bln_value){
                  super.fn_showAccordion(bln_value);                  
                  
                  let bln_valueFlip=obj_shared.fn_flipBool(bln_value);                                    
                  let obj_dashboard=this.fn_locateItemIgnoreContextItem("xdezign_dashboard_project");                  
                  this.fn_notify(obj_dashboard, "fn_showHardRule", bln_valueFlip);                  
                }  
                
                
              }//END CLS
              //END TAG
              //END component/xdezign_menu_project