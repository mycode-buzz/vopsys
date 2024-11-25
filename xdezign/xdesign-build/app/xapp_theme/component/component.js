
            //XSTART component/xapp_theme
              class xapp_theme extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                           
                  
                  if(this===obj_project){
                    this.fn_setDisplay(true);
                  }
                  else{
                    this.fn_setDisplay(false);
                  }
                }                          
              }//END CLS
              //END TAG
              //END component/xapp_theme