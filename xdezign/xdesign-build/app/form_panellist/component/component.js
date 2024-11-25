      //XSTART component/form_panellist
      class form_panellist extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }        

        fn_addPanel(obj_param){          
          let obj_panel=this.fn_addContextItem(obj_param.str_type);                                                                        
          obj_panel.obj_param=obj_param;          
          //obj_panel.fn_setDisplayFlex(false);
          return obj_panel;
        }
        fn_displayPanel(obj_panel){          

          let i, arr_item, obj_item;
          arr_item=this.obj_design.arr_item;
          if(!obj_panel && arr_item.length){            
            obj_panel=arr_item[0];
          }
          for(i=0;i<arr_item.length;i++){
            obj_item=arr_item[i];            
            if(obj_item===obj_panel){
              obj_item.fn_openFlex();
            }
            else{
              obj_item.fn_closeFlex();
            }
          }

        }
        fn_legendOnClick(obj_panel){                                

          //console.log("form_panellist fn_legendOnClick");

          let obj_parent=this.fn_getParentComponent();          
          this.fn_notify(obj_parent, "fn_legendOnClick", obj_panel);                                  
        }

        
      }//END CLS
      //END TAG
      //END component/form_panellist        