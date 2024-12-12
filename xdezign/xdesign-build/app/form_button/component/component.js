
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
                }   
                fn_applyThemeStructure(){
                  if(!obj_project.obj_theme){return;}
                  this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formButton;                                                    
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
                }

                fn_expand(){//called by base onload                  
                  this.fn_expandMultiple(1.5);
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

                xfn_setStyleProperty(str_name, str_value, str_priority){//n ot sure why this is necessary
                  
                  if(this.dom_obj){this.dom_obj.style.setProperty(str_name, str_value, str_priority);}
              }        
                              

              }//END CLS
              //END TAG
              //END component/form_button