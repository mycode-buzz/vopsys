      //XSTART component/form_menu_button_anchor
      class form_menu_button_anchor extends form_button_anchor{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }                
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_onLoad(){
          super.fn_onLoad();
          this.obj_icon=this.fn_getComponent("form_menu_button_icon");                              
          this.obj_span=this.fn_getComponent("form_menu_button_span");          
        }                
      
        ///////////////////////
        ///////////////////////
        ///////////////////////
      }//END CLS
      //END TAG
      //END component/form_menu_button_anchor        