
            //XSTART component/form_select
              class form_select extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  this.obj_holder.bln_listenClick=true;                 
                  this.obj_holder.bln_listenChange=true;                
                  this.obj_holder.bln_listenBlur=true;                                            
                }                
                fn_onClick(e){             
                  this.fn_parentEvent("Click", e);
                }                
                fn_onChange(e){                               
                  this.fn_parentEvent("Change", e);
                }
                fn_onBlur(e){                                         
                  this.fn_parentEvent("Blur", e);
                }
                fn_addOption(str_text, str_value){
                  let option = document.createElement("option");
                  option.text = str_text;
                  option.value = str_value;                  
                  this.dom_obj.add(option);                                                                     
                  return option;
                }                
              }//END CLS
              //END TAG
              //END component/form_select