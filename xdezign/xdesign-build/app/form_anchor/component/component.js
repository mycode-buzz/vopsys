      //XSTART component/form_anchor
      class form_anchor extends component{
        constructor(obj_ini) {      
          super(obj_ini);        

          this.obj_holder.bln_listenClick=true;          
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }

        fn_onClick(e){                  

          obj_project.fn_forgetEvent(e);    
          //foregetevent                

          this.fn_parentEventBubble("Click", e);//this causes things to happen                  
          
        }         

        fn_onLoad(){
          super.fn_onLoad();
          this.obj_icon=this.fn_getComponent("form_button_icon");                              
          this.obj_span=this.fn_getComponent("form_button_span");          
        }

        fn_showIcon(str_value){
          
          if(str_value){                                                    
            this.obj_icon.fn_setText(str_value);                                  
            this.obj_icon.fn_setStyleProperty("fontWeight", "bold");                                  
            this.obj_icon.fn_setDisplay(true);          
            this.obj_icon.fn_setClassName("material-icons");                                              
          }         
          else{
            this.obj_icon.fn_setDisplay(false);            
            /*
            this.fn_showIcon("check_box");                        
            this.obj_icon.fn_setStyleProperty("color", "white");                                              
            //*/
          }

        }  
        fn_hideIcon(){
          this.obj_icon.fn_setDisplay(false);
        }

        fn_setText(str_value){
          this.obj_span.fn_setText(str_value);
      }
      }//END CLS
      //END TAG
      //END component/form_anchor        