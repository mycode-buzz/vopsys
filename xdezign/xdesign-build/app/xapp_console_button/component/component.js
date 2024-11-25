
            //XSTART component/console_button
              class xapp_console_button extends xapp_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }                
                fn_configureFromMeta(obj_row){
    
                  if(!obj_row){return;}//can be false at top level  
                            
                  console.log("xapp_console_button fn_configureFromMeta");
                  let obj_metaColumn;        
                  let obj_recordset=obj_row.obj_paramRS.obj_recordset;
                  
                  obj_metaColumn=obj_recordset.fn_getMetaColumnViaFieldName("MetaRowzTitle");
                  if(obj_metaColumn){                              
                    this.fn_setText(obj_metaColumn.str_value);                 
                  } 
                }                 
              }//END CLS
              //END TAG
              //END component/console_button