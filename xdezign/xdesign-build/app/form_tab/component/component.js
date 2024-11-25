      //XSTART component/form_tab
      class form_tab extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.bln_listenFocus=true;                  
        }
        fn_onClick(e){          
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnClick(this, e);
          
          obj_project.fn_forgetEvent(e);    
        }
        fn_onFocus(e){          
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnFocus(this, e);
          
          obj_project.fn_forgetEvent(e);    
        }

      }//END CLS
      //END TAG
      //END component/form_tab        