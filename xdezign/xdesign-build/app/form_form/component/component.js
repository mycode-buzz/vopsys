
            //XSTART component/form_form
              class form_form extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                }                

                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                      
                  
                  this.obj_holder.bln_listenSubmit=true;
              }    

              fn_onSubmit(e){                              

                //alert("form fn_onSubmit: " + e.type);
                obj_project.fn_forgetEvent(e);                
                this.fn_parentEventBubble("Submit", e);//this causes things to happen                  
              }
              }//END CLS
              //END TAG
              //END component/form_form