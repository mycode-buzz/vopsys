
            //XSTART component/xapp_propertysheet_input
              class xapp_propertysheet_input extends form_input{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                }
                fn_onChange(){                                                 
                  this.fn_setValue(this.dom_obj.value);                                                                  
                  this.obj_holder.obj_propertySheet.fn_onChangeInput(this);
                  this.fn_unsetEvent();                  
                }                                
              }//END CLS
              //END TAG
              //END component/xapp_propertysheet_input