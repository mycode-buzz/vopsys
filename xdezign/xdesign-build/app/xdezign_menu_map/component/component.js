
            //XSTART component/xdezign_menu_map
              class xdezign_menu_map extends xdezign_menu{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }                
                fn_navigateToProject(obj_post){                                                                                       
                  
                  /*
                  this.fn_setText("Project B");
                  this.fn_setEnabled();
                  this.fn_setDisplay();                                                                        
                  //*/
                }                                

                fn_navigateToWelcomeScreen(){                                                    

                  this.fn_close();                  
                  this.fn_setText(" ");
                  this.fn_setDisabled();
                  this.fn_setDisplay(false);                                                      
                }                

                fn_onPaletteItemSelected(){                                                                               

                  //alert();
                  this.fn_setText(obj_project.obj_palettSelected.fn_getDesignProperty("str_name"));
                  this.fn_setEnabled();                                                      
                  this.fn_setDisplay();                                                                        
                  this.fn_open();                                                
                  this.fn_notifyChildControl("fn_onPaletteItemSelected");                  
                }                
                
              }//END CLS
              //END TAG
              //END component/xdezign_menu_map