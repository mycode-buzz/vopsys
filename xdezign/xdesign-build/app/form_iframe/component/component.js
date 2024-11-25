
            //XSTART component/form_iframe
              class form_iframe extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_navigateURL(str_url){                              
                  if(this.fn_hasContextHolderParent()){return;}
                  let obj_glass;
                  if(this["fn_getGlass"]){
                    obj_glass=this.fn_getGlass();        
                  }          
                  if(!obj_glass){return;}              
                  obj_glass.location.href=str_url;                        
                }          
                fn_getGlass(){
                  return this.dom_obj.contentWindow;
                }
              }//END CLS
              //END TAG
              //END component/form_iframe