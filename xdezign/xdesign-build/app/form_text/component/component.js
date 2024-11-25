      //XSTART component/form_text
      class form_text extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.bln_listenSelectStart=true;                                    
        }
        fn_onSelectStart(e){                                    
          obj_project.fn_calmEvent(e);
        }                
        fn_setText(str_value){
          if(str_value===""){    
            str_value="&nbsp;";//if blank will cause display issue
          } 
          super.fn_setText(str_value);       
      }
      }//END CLS
      //END TAG
      //END component/form_text        