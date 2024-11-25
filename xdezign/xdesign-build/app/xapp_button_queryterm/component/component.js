      //XSTART component/xapp_button_queryterm
      class xapp_button_queryterm extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.bln_enabled=true;

          this.obj_holder.bln_listenMouseDown=true;                  
          this.obj_holder.bln_listenMouseUp=true;                  
        }
        fn_onMouseDown(e){                            

          this.obj_parentInterface.fn_queryTermButtonOnMouseDown(this, e);          
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onMouseUp(e){                  
          this.obj_parentInterface.fn_queryTermButtonOnMouseUp(this, e);          
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onClick(e){                  
          this.obj_parentInterface.fn_queryTermButtonOnClick(this, e);
          
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onDblClick(e){ 
          
          this.obj_parentInterface.fn_queryTermButtonOnDblClick(this, e);
          
          
          obj_project.fn_forgetEvent(e);    
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_queryterm        