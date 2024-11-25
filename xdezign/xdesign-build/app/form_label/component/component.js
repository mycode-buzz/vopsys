
            //XSTART component/form_label
              class form_label extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
                  this.obj_holder.bln_listenClick=true;
                  this.obj_holder.bln_listenMouseEnter=true;
                  this.obj_holder.bln_listenMouseLeave=true;
                  this.obj_holder.bln_listenMouseUp=true;
                  this.obj_holder.bln_listenMouseDown=true;                  
                }

                fn_onLoad(){
                  super.fn_onLoad();                  
                  
                  /*
                  this.fn_setStyleProperty('border', '1px solid rgba(255, 255, 255, 0.0)');                  
                  this.fn_setStyleProperty('borderRadius', '3px');                  
                  this.fn_setStyleProperty('margin', '3px');                  
                  this.fn_setStyleProperty('alignSelf', 'flex-start');                  
                  this.fn_setStyleProperty('cursor', 'pointer');                  
                  //*/
                  
                  //console.log("flexBasis: " + this.fn_getStyleProperty('flexBasis'));                  
                }

                fn_setUnLocked(){
                  this.bln_locked=false;
                  this.fn_setStyleProperty('cursor', 'pointer');                  
                }
                fn_setLocked(){
                  if(this.bln_locked){return;}
                  this.bln_locked=true;
                  this.fn_setStyleProperty('cursor', 'default');                  
                }
                fn_getLocked(){
                  return this.bln_locked;
                }
                fn_onClick(e){                  
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("Click", e);
                }
                fn_onMouseUp(e){        
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseUp", e);
                }
                fn_onMouseDown(e){        
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseDown", e);
                }
                fn_onMouseEnter(e){        
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseEnter", e);
                }
                fn_onMouseLeave(e){         
                  obj_project.fn_calmEvent(e);       
                  if(this.fn_getLocked()){return;}                                    
                  this.fn_parentEvent("MouseLeave", e);
                }
                
              }//END CLS
              //END TAG
              //END component/form_label