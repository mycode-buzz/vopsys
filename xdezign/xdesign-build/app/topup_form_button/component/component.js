      //XSTART component/topup_form_button
      class topup_form_button extends xapp_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }                
        fn_onClick(e){                    
          
          obj_project.fn_forgetEvent(e);    
          this.obj_holder.obj_dashboard.fn_topUpSubmitOnClick(this);          
        }  
        
      }//END CLS
      //END TAG
      //END component/topup_form_button        