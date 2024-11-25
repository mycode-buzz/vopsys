
            //XSTART component/xapp_button_recycle_record
              class xapp_button_recycle_record extends xapp_console_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onClick(e){                  
                  let obj_menuButton=this.fn_getMenuButton();                  
                  if(!obj_menuButton){return;}                          
                  
                  
                  if (confirm("Archive this record?") == true) {                    
                    obj_menuButton.fn_formRecycleRecord();
                  } else {                    
                  }                  
                  
                  
                  obj_project.fn_forgetEvent(e);
                }
              }//END CLS
              //END TAG
              //END component/xapp_button_recycle_record