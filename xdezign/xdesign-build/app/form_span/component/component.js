
            //XSTART component/form_span
              class form_span extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                    
                }                
                fn_onClick(e){   
                  obj_project.fn_forgetEvent(e);    
                }                  
                
              }//END CLS
              //END TAG
              //END component/form_span