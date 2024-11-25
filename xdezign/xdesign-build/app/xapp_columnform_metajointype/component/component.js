
            //XSTART component/xapp_columnform_metajointype
              class xapp_columnform_metajointype extends xapp_columnform{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onLoad(){
                  super.fn_onLoad();                
                  if(this.fn_hasContextHolderParent()){return;}                           
                }
                fn_onChildChange(){                   

                  super.fn_onChildChange();

                  if(this.str_value==="2"){
                    //console.log("change auto join , chnaage type menu ");  
                  }
                  
                  
                  
                }                                         
              }//END CLS
              //END TAG
              //END component/xapp_columnform_metajointype