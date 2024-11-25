
            //XSTART component/xdezign_menu_component
              class xdezign_menu_component extends xdezign_menu{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_navigateToProject(obj_post){                                                                      
                  this.fn_setDisplay(false);                                                      
                }
                fn_navigateToWelcomeScreen(){                                                  
                  this.fn_setDisplay(false);                                                                        
                }
                fn_onOpen(){                  
                  this.fn_notifyChildControl("fn_onOpenMenu");
                }
                fn_onPaletteItemSelected(){                                                                              
                  this.fn_setEnabled();                                                      
                  this.fn_setDisplay();                     
                  this.fn_notifyChildControl("fn_onPaletteItemSelected");
                }                
              }//END CLS
              //END TAG
              //END component/xdezign_menu_component