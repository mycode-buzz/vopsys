
            //XSTART component/xapp_context_holder
              class xapp_context_holder extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  this.obj_design.bln_isContextHolder=true;                  
                }
                fn_addItem(obj_ini){
                  obj_ini.obj_design.bln_registerAtContainer=true;                  
                  return super.fn_addItem(obj_ini);//CallSuper          
                }
                fn_onLoad(obj_ini){
                  super.fn_onLoad(obj_ini);
                  
                  if(obj_project.fn_isContextHolder()){
                    this.fn_setDisplayFlex(true);
                  }
                  else{
                    this.fn_setDisplayFlex(false);
                  }
                }
              }//END CLS
              //END TAG
              //END component/xapp_context_holder