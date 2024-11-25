
            //XSTART component/form_button
              class form_button extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.obj_holder.bln_listenClick=true;                                                      
                  this.bln_enabled=true;
                }        

                
                fn_onLoad(){    
                  super.fn_onLoad();                                          

                  if(this.fn_hasContextHolderParent()){return;}                      

                  if(this.obj_design.bln_expand){                    
                    
                    let str_padding=this.fn_getStyleProperty("padding");
                    let int_padding=parseInt(str_padding);   
                    let int_paddingExpand=int_padding + (int_padding/2);                    

                    this.fn_setStyleProperty("padding", +int_paddingExpand+"px");        
                    str_padding=this.fn_getStyleProperty("padding");
                    
                    this.fn_setStyleProperty("font-weight", "bold");                                                                    
                  }
                }        
              
                fn_onSelectStart(e){
                  console.log("fn_onSelectStart");
                  obj_project.fn_forgetEvent(e); 
                }                

                fn_onClick(e){                  
                  
                  if(this.fn_getDomProperty("type")==="submit"){}                  
                  else{
                    obj_project.fn_forgetEvent(e);    
                  }
                }  

                fn_setStyleProperty(str_name, str_value, str_priority){
                  
                  if(this.dom_obj){this.dom_obj.style.setProperty(str_name, str_value, str_priority);}
              }        
                              

              }//END CLS
              //END TAG
              //END component/form_button