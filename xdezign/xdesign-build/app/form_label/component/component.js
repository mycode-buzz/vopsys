
            //XSTART component/form_label
              class form_label extends form_input{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                 
                }
                fn_holdEvent(){
                  super.fn_dropEvent();
  
                  this.obj_holder.bln_listenClick=true;
                  this.obj_holder.bln_listenMouseEnter=true;
                  this.obj_holder.bln_listenMouseLeave=true;
                  this.obj_holder.bln_listenMouseUp=true;
                  this.obj_holder.bln_listenMouseDown=true;                  
                }

                fn_setText(str_value){
                  this.fn_setDomProperty("innerHTML", str_value);                                      
                }

                fn_onLoad(){
                  super.fn_onLoad();                                                      
                }
                fn_applyThemeStructure(){                                                        
                  this.obj_holder.obj_themeStructure=obj_project.obj_holder.obj_themeFormLabel;                
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
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