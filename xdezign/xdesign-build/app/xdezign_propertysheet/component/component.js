      //XSTART component/xdezign_propertysheet
      class xdezign_propertysheet extends xapp_propertysheet{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                

          this.obj_holder.str_typePropertySheetInput="xdezign_propertysheet_input";
        }
        fn_onPaletteItemDeSelected(){}//overiding for safety. can reivew overide.              
        fn_onPaletteItemSelected(obj_arg){          
          this.fn_refreshSheet(obj_arg);          
        }
        fn_setPaletteSelected(){
          let int_modeExecuteCurrent=this.obj_design.int_modeExecute;
          this.obj_design.int_modeExecute=obj_holder.int_modeLocked;
          obj_project.fn_setPaletteSelected();
          this.obj_design.int_modeExecute=int_modeExecuteCurrent;                  
        }
      }//END CLS
      //END TAG
      //END component/xdezign_propertysheet        