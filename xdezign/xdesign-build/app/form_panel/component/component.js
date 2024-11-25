
            //XSTART component/form_panel
              class form_panel extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("purple");}                  
                }       
                fn_legendOnClick(obj_formLegendButton){                                                  
                  obj_formLegendButton.obj_formFieldSet.fn_toggle();        
                }         
              }//END CLS
              //END TAG
              //END component/form_panel