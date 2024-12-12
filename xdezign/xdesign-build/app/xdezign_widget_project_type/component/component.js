
            //XSTART component/xdezign_widget_project_type
            class xdezign_widget_project_type extends xapp_widgetboard{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                
              }              
              fn_loadWidget(obj_row){                
                
                let obj_item=this.fn_addContextItem("xdezign_button_open_project");
                if(obj_item){obj_item.fn_configureFromMeta(obj_row);}                  

                if(!obj_item){return;}                                  
                
                let obj_column;                                                 
                
                obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`id`");                                  
                obj_item.obj_design.int_idTarget=obj_column.fn_getColumnValue();                                                                       
                //console.log("int_idTarget: " + obj_item.obj_design.int_idTarget);

                obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`name`");                                  
                obj_item.obj_design.str_nameShortTarget=obj_column.fn_getColumnValue();                                                                       
                //console.log("str_nameShortTarget: " + obj_item.obj_design.str_nameShortTarget);

                obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`lastversiondate`");                                                  
                obj_item.obj_design.str_lastVersionDate=obj_column.fn_getColumnValue();        
                //console.log("str_lastVersionDate: " + obj_item.obj_design.str_lastVersionDate);                                                                                 

                obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`name`");                                                                  
                obj_item.obj_design.str_controlName=obj_column.fn_getColumnValue();                                    
                obj_item.fn_setText(obj_item.obj_design.str_controlName);                  
                //console.log("str_controlName: " + obj_item.obj_design.str_controlName);                                                                                 

                obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`type`");                                                                                  
                obj_item.obj_design.str_instanceType=obj_column.fn_getColumnValue();                                                                                       
                //console.log("str_instanceType: " + obj_item.obj_design.str_instanceType);                                                                                 


                /*
                console.log("str_controlName: " + obj_item.obj_design.str_controlName);                                                      
                console.log("str_instanceType: " + obj_item.obj_design.str_instanceType);                                                  
                console.log("str_lastVersionDate: " + obj_item.obj_design.str_lastVersionDate);                                
                console.log("int_idTarget: " + obj_item.obj_design.int_idTarget);              
                //*/
                
              }
            }//END CLS
              //END TAG
              //END component/xdezign_widget_project_type