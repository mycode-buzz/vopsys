      //XSTART component/xapp_console_container_search
      class xapp_form_container_search extends xapp_console_container{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onSubmit(e){                          

          if(!obj_project.obj_itemEvent){//check to see if the e-vent has been cancelled
            return;
          }
        
          obj_project.fn_forgetEvent(e);

          //HOW THIS WORKS
          //the search value is already updated first , via the search button click on submit
          //console.log("xapp_console_container_search onsubmit");
          //console.log(" xapp_console_container_search fn_onSubmit")                    
          let obj_menuButton=this.fn_getMenuButton();          
          obj_menuButton.fn_runSearch();
        }
      }//END CLS
      //END TAG
      //END component/xapp_console_container_search        