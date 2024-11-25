
            //XSTART component/form_inputandbutton_submit
            class form_inputandbutton_submit extends form_button_rich{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);           

                this.obj_holder.bln_listenClick=true;
                this.obj_holder.bln_listenDblClick=true;

                
                this.bln_enabled=true;
              }                              
              fn_onClick(e){                                                      
                
                this.fn_notifyParent("fn_onLinkButtonClick", e);                                    
                obj_project.fn_unsetEvent();    
              }
              fn_onDblClick(e){                                                                    
                //console.log("form_inputandbutton_submit fn_onDblClick");
                
                obj_project.fn_unsetEvent();    
              }
            }//END CLS
            //END TAG
            //END component/form_inputandbutton_submit