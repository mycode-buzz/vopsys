
            //XSTART component/xdezign_menu
              class xdezign_menu extends xapp_menu{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_navigateToProject(){}//overidden
                fn_navigateToWelcomeScreen(){}//overidden
                fn_onPaletteItemSelected(){}//overidden
                fn_onProjectNeutral(){}//overidden
                fn_projectOnLoad(){}//overidden                
                fn_setEnabled(){          
                  super.fn_setEnabled(true, true);
                }
              }//END CLS
              //END TAG
              //END component/xdezign_menu