      //XSTART component/xapp_report_interface_fieldcriteria
      class xapp_report_interface_fieldcriteria extends form_fieldset{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}                                     
          //this.fn_setDisplayFlex(false);          
          this.fn_setText("Field Criteria");
        }        
      }//END CLS
      //END TAG
      //END component/xapp_report_interface_fieldcriteria        