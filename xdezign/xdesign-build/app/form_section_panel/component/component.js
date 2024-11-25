
            //XSTART component/form_section_panel
              class form_section_panel extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }             
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("green");}                  
                }                
              }//END CLS
              //END TAG
              //END component/form_section_panel