      //XSTART component/form_tablist
      class form_tablist extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_addTab(obj_param){
          let obj_tab=this.fn_addContextItem("form_tab");                                                                                  
          obj_tab.fn_setText(obj_param.str_name);
          obj_tab.obj_param=obj_param;          
          return obj_tab;
        }
        
        fn_tagOnClick(obj_tab, e){
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnClick(obj_tab, e);
        }
        fn_fireFocus(obj_tab=false){
          let arr_item=this.obj_design.arr_item;          
          if(!obj_tab && arr_item.length){            
            obj_tab=arr_item[0];
          }          
          if(!obj_tab){
            //strange as this is the whole point
            return;
          }
          const e = new Event("focus");
          obj_tab.dom_obj.dispatchEvent(e);
        }
        fn_tagOnFocus(obj_tab, e){          
          let obj_parent=this.fn_getParentComponent();
          obj_parent.fn_tagOnFocus(obj_tab, e);
        }
      }//END CLS
      //END TAG
      //END component/form_tablist        