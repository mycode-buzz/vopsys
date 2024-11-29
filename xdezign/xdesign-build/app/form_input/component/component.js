
            //XSTART component/form_input
              class form_input extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.fn_setIsContainer(false);                                                      
                  

                  //*
                  this.obj_holder.bln_listenFocus=true;        
                  this.obj_holder.bln_listenBlur=true;        
                  this.obj_holder.bln_listenChange=true;
                  this.obj_holder.bln_listenKeyDown=true;
                  this.obj_holder.bln_listenKeyUp=true;        

                  this.obj_holder.bln_listenClick=true;
                  this.obj_holder.bln_listenDblClick=true;                                    

                  this.obj_holder.bln_listenMouseDown=true;                  

                  this.obj_holder.bln_listenInput=true;

                  this.obj_holder.bln_listenSelectStart=true;

                  //*/
                }    
                fn_onSelectStart(e){
                  //console.log("hit input");
                  obj_project.eventCancelledByChild=false;
                  e.stopPropagation();
                  return true;
                }                                    
                fn_setControlType(str_value){
                  this.fn_setDomProperty("type", str_value);

                }
                fn_onApplyDomSettings(){
                  this.fn_parentEvent("Click", e);                                    

                }
                fn_onApplyFeatures(){                
                  //console.log("fn_onApplyFeatures");
                  //this.fn_notifyParent("fn_onApplyInputFeatures", this);                                    
                }
                fn_onLoad(){    
                  super.fn_onLoad();                                          

                  if(this.obj_design.bln_expand){
                    
                    let str_padding=this.fn_getStyleProperty("padding");
                    let int_padding=parseInt(str_padding);   
                    let int_paddingExpand=(int_padding*3);                    
                    //console.log("int_paddingExpand: " + int_paddingExpand);

                    this.fn_setStyleProperty("padding", +int_paddingExpand+"px");        
                    this.fn_setStyleProperty("font-weight", "bold");        
                  }
                }
                fn_setText(str_value){    
                  //no need to set text as innerHTML is not supported on input
                  this.fn_setValue(str_value);
                }
                fn_setPlaceholder(str_value){ 
                  str_value+="";    
                  this.fn_setDomProperty("placeholder", str_value);        
                }  
                fn_getPlaceholder(){       
                  return this.fn_getDomProperty("placeholder");        
                }

                fn_onClick(e){             
                  //obj_project.fn_forgetEvent(e);//this will cancel default actions , such as color control and checkbox from operating                       
                  obj_project.fn_calmEvent(e);//stop event bubble, not required , but can help where event is required  on parant form elements                  
                  this.fn_parentEvent("Click", e);                                    
                }
                fn_onDblClick(e){             
                  obj_project.fn_calmEvent(e);                  
                  this.fn_parentEvent("DblClick", e);                  
                }
                fn_onInput(e){                    
                  obj_project.fn_calmEvent(e);                
                  this.fn_parentEvent("Input", e);                  
                }                
                fn_onChange(e){                  
                  obj_project.fn_calmEvent(e);
                  this.fn_setValue(this.dom_obj.value, e);                                                                  
                  this.fn_parentEvent("Change");                  
                }                
                fn_onKeyDown(e){                     
                  obj_project.fn_calmEvent(e);
                  this.fn_parentEvent("KeyDown", e);                  
                }
                fn_onKeyUp(e){                                                                      
                  obj_project.fn_calmEvent(e);
                  this.fn_parentEvent("KeyUp", e);                  
                }
                fn_onMouseDown(e){                                  
                  obj_project.fn_calmEvent(e);
                  this.fn_parentEvent("MouseDown", e);                  
                }
                fn_onFocus(e){                       
                  obj_project.fn_calmEvent(e);                  
                  this.fn_parentEvent("Focus", e);                  
                }
                fn_onBlur(e){     
                  obj_project.fn_calmEvent(e);                  
                  this.fn_parentEvent("Blur", e);
                }

                
              }//END CLS
              //END TAG
              //END component/form_input