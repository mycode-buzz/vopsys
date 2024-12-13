
            //XSTART component/form_section
              class form_section extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                                     
                }  
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("red");}                  
                }                
                fn_applyThemeStructure(){                                                            
                  if(!obj_project.obj_theme){return;}                  
                  this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formFieldset;                
                  this.fn_applyStyle(this.obj_holder.obj_themeStructure);                                            
                }                                  
              }//END CLS
              //END TAG
              //END component/form_section