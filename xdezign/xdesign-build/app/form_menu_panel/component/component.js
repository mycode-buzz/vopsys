      //XSTART component/form_menu_panel
      class form_menu_panel extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_getDebugPin()){this.fn_highlightBorder("black");}                       
        }
        fn_addConsoleContainer(str_consoleContainer, bln_side){                                    
          let obj_item=this.obj_console.fn_addConsoleContainer(str_consoleContainer, bln_side);                    
          return obj_item;
          //this.obj_console.fn_debug();
        }
        fn_disableConsole(){
          this.obj_console.fn_disable();
        }
        fn_hideConsole(){
          this.obj_console.fn_hide();
        }
        fn_getConsoleContainer(str_consoleContainer){
          let obj_item=this.obj_console.fn_getConsoleContainer(str_consoleContainer);
          return obj_item;
          //this.obj_console.fn_debug();
        }
      }//END CLS
      //END TAG
      //END component/form_menu_panel        