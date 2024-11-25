
            //XSTART component/xdezign_menu_tag
              class xdezign_menu_tag extends xdezign_menu{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                              
                }    
                                
                fn_navigateToProject(){                                          
                  
                  this.fn_setDisplay(false);                                                                        
                }
                fn_navigateToWelcomeScreen(){                        
                  
                  this.fn_setDisplay(false);                                                                        
                }    

                fn_onOpen(){
                  super.fn_onOpen();  
                  this.fn_onPaletteItemSelected();
                }
                
                fn_onPaletteItemSelected(){                                                   

                  //console.log("xdezign_menu_tag fn_onPaletteItemSelected");
                
                  this.fn_setEnabled();                                                      
                  this.fn_setDisplay();                     
                  this.fn_notifyChildControl("fn_onPaletteItemSelected");
                }
              }//END CLS
              //END TAG
              //END component/xdezign_menu_tag