
            //XSTART component/form_field
              class form_field extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }  
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("gray");}                                    
                }                
                fn_onChildClick(e){                                                      
                  
                  this.fn_parentEvent("Click", e);

                                    
                  this.fn_unsetEvent();
                }  
                fn_onChildDblClick(e){                                                      
                  
                  this.fn_parentEvent("DblClick", e);
                  this.fn_unsetEvent();
                }                                                 
                fn_onChildMouseUp(e){
                  this.fn_parentEvent("MouseUp", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildMouseDown(e){
                  this.fn_parentEvent("MouseDown", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildMouseEnter(e){                                                                                          
                  this.fn_parentEvent("MouseEnter", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildMouseLeave(e){                                                                                          
                  this.fn_parentEvent("MouseLeave", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildFocus(e){                                                                                          
                  this.fn_parentEvent("Focus", e);
                  this.fn_unsetEvent();
                } 
                fn_onChildInput(e){                                                                                          
                  this.fn_parentEvent("Input", e);
                  this.fn_unsetEvent();
                }                  
                fn_onChildChange(e){                                   
                  this.fn_parentEvent("Change", e);
                  this.fn_unsetEvent();
                }
                fn_onChildKeyDown(e){     
                  this.fn_parentEvent("KeyDown", e);
                  this.fn_unsetEvent();
                }
                fn_onChildKeyUp(e){                                  
                  //console.log("Form Field KeyUp keyCode: " + e.keyCode);                           

                                    
                  this.fn_parentEvent("KeyUp", e);

                                    
                  this.fn_unsetEvent();
                }
                fn_onChildBlur(e){                               
                                    
                  this.fn_parentEvent("Blur", e);

                                    
                  this.fn_unsetEvent();
                }
                
              }//END CLS
              //END TAG
              //END component/form_field