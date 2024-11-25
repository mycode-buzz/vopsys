
            //XSTART component/form_inputandbutton
            class form_inputandbutton extends component{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                
              }
              fn_onLoad(){                  
                super.fn_onLoad();
                this.fn_resetInput();  
              } 
              fn_resetInput(){                
                this.fn_setValue("");                  
              } 
              fn_onLinkButtonClick(e){                                       
                return this.fn_getValue();                 
              }
              fn_getValue(){                     
                let str_value=this.fn_notify(this.fn_getComponent("form_inputandbutton_input"), "fn_getValue");                  
                //console.log("str_value: " + str_value);
                return str_value;                  
              }
              fn_setValue(str_value){                     
                this.fn_notify(this.fn_getComponent("form_inputandbutton_input"), "fn_setValue", str_value);                                    
              }
              
              fn_onChildKeyDown(e){this.fn_onLinkInputKeyDown(e);}                
              fn_onLinkInputKeyDown(e){}//overidden
              
              fn_onChildMouseDown(e){this.fn_onLinkInputMouseDown(e);}                
              fn_onLinkInputMouseDown(e){}//overidden
              
              fn_onChildChange(){}                
              
            }//END CLS
            //END TAG
            //END component/form_inputandbutton