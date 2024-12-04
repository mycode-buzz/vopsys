      //XSTART component/form_text
      class form_text extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          
        }
        fn_holdEvent(){
          super.fn_dropEvent();

          this.obj_holder.bln_listenSelectStart=true;                                    
        }
        fn_applyThemeStructure(){                    
          super.fn_applyThemeStructure();
        }
        fn_onSelectStart(e){                                    
          obj_project.fn_calmEvent(e);
        }                
        fn_setText(str_value){
          if(str_value===""){    
            str_value="&nbsp;";//if blank will cause display issue
          } 
          this.fn_setDomProperty("innerHTML", str_value);                                      
      }
      }//END CLS
      //END TAG
      //END component/form_text        