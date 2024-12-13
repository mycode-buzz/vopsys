      //XSTART component/form_showhide
      class form_button_showhide extends form_button_rich{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                

          this.obj_holder.bln_listenClick=true;
        }
        fn_onClick(e){
          
          super.fn_onClick(e);                    
          
          let obj_control=this.obj_controlTarget;
          if(obj_control){
            this.fn_toggleControl();
          }
        }        
        fn_toggleControl(){

          //console.log("fn_toggleOptions");

          let obj_control=this.obj_controlTarget;         

          //obj_control.fn_debugText(obj_control.bln_open);
          
          if(obj_control.bln_open){            
            obj_control.bln_open=false;                        
            obj_control.fn_setDisplay(false);
            //obj_control.fn_debugText("closing");
          }
          else{
            obj_control.bln_open=true;                        
            obj_control.fn_setDisplay(true);
            //obj_control.fn_debugText("opening");
          }
        }
      }//END CLS
      //END TAG
      //END component/form_showhide        