      //XSTART component/xapp_button_archive_record
      class xapp_button_archive_record extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                  
          let obj_menuButton=this.fn_getMenuButton();                  
          if(!obj_menuButton){return;}                                    

          let bln_value=obj_shared.fn_messageConfirm("Archive this record?");          
          if(bln_value){          
            obj_menuButton.fn_formArchiveRecord();
          } 
          
          obj_project.fn_forgetEvent(e);
        }
      }//END CLS
      //END TAG
      //END component/xapp_button_archive_record        