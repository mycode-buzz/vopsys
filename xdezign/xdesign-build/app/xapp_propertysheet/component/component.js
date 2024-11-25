
            //XSTART component/xapp_propertysheet
              class xapp_propertysheet extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                              
                  
                  this.obj_holder.str_typePropertySheetInput="xapp_propertysheet_input";
                }
                fn_onChangeInput(obj_input){                            
                  this.fn_notify(this, obj_input.obj_design.str_inputAction, obj_input);
                }      
                
                fn_refreshSheet(obj_arg){//overiding for safety. can reivew overide.                

                    if(this.obj_design.int_modeExecute===obj_holder.int_modeLocked){return;}

                    this.fn_removeAllContent();                      
            
                    let obj_table;      
                    let str_text=obj_arg.str_text;
                    let obj_container=obj_arg.obj_container;
                  
                    let obj_ini, arr;
                    let obj_row, obj_item;                                        
                  
                    obj_ini=new Holder;            
                    obj_ini.obj_design.str_type="table";       
                    obj_table=obj_container.fn_addItem(obj_ini);//BootItem    
                    obj_arg.obj_table=obj_table;
                    
                    if(str_text){
                      obj_row=obj_table.fn_addItem();//BootItem
                      obj_ini=new Holder;            
                      obj_ini.obj_design.str_type="tableheader";                                        
                      obj_ini.obj_design.str_themeType="form_input";                                        
                      obj_ini.obj_domProperty.colSpan=2;                                  
                      obj_item=obj_row.fn_addItem(obj_ini);//BootItem    
                      obj_item.fn_setText(str_text);                
                    }                                  
                    
                    if(obj_arg.str_propertySourceChange){
                      this.fn_addNewPropertyRow(obj_arg);//add new value row    
                    }                            
                    //Parent class can call from here
                    this.fn_displayPropertySheet(obj_arg);
                    
                  }
                  
                  fn_displayPropertySheet(obj_arg){//to be overriden              
            
                    let arr_Property=Object.entries(obj_arg.obj_propertySource).sort((a, b) => a[0].localeCompare(b[0]));          
                    for (let [str_key, foo_val] of arr_Property) {          
                        obj_arg.str_key=str_key;
                        obj_arg.foo_val=foo_val;
                        this.fn_displayPropertySheetRow(obj_arg);
                      } 
                  }            
                  
                  fn_displayPropertySheetRow(obj_arg){
                
                    let str_key, str_val, foo_val;
                    let obj_row, obj_ini, obj_container, obj_cell, obj_input;
                    let bln_disabled;      
      
                    let obj_item;
      
                    let obj_selected=obj_project.obj_palettSelected;
                    let bln_locked=obj_selected.fn_getDesignLocked();              
                
                    str_key=obj_arg.str_key;    
                    foo_val=obj_arg.foo_val;
                    obj_ini=new Holder;
                    foo_val=this.fn_validateInputValue(str_key, foo_val);
                
                    if(foo_val===undefined){
                      return;
                    } 
                  
                    if(foo_val===""){                      
                      /*
                      return;
                      //*/
                    }   
                      
                    str_val=foo_val;
                    if(typeof foo_val==="object"){     
                      if(foo_val){
                        str_val=foo_val.constructor.name;
                      }
                    }
                    
                
                    let str_keyDisplay, str_valueDisplay;
                    str_keyDisplay=str_key;              
                    str_valueDisplay=str_val;
      
                    if(str_keyDisplay==="bln_registerAtProject"){
                      //console.log("1 " + str_keyDisplay + ": " + str_valueDisplay)
                    }              
                    
                    obj_row=obj_arg.obj_table.fn_addItem();
                    
                    //START CREATE NAME CELL
                    obj_ini=new Holder;                        
                    //obj_ini.obj_design.str_content=str_keyDisplay+":&nbsp;";              
                    obj_ini.obj_domStyle.minWidth="150px";
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem
                    obj_container=obj_cell;          
                    //END CREATE NAME CELL              
      
                    let str_propertyName, str_propertyValue;
                    str_propertyName=str_keyDisplay;
                    str_propertyValue=str_valueDisplay;
                    str_propertyValue=this.fn_validateInputValue(str_propertyName, str_propertyValue);//revison - check backup
      
                    obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);
                    obj_item.obj_holder.obj_propertySheet=this;
                    obj_item.fn_setText(str_propertyName);
                    bln_disabled=true;
                    obj_item.fn_setDisabled(bln_disabled);
                    
                    //START CREATE VALUE CELL
                    obj_ini=new Holder;                
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem          
                    obj_container=obj_cell;          
                    //END CREATE VALUE CELL
                    
                    obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);
                    obj_item.obj_holder.obj_propertySheet=this;              
                    obj_item.fn_setText(str_propertyValue);
                    obj_item.fn_setDesignProperty("str_propertyName", str_propertyName);             
                    obj_item.fn_setDesignProperty("str_linkId", obj_arg.obj_design.str_linkId);             
                    obj_item.fn_setDesignProperty("str_inputAction", obj_arg.obj_design.str_inputAction);             
                    bln_disabled=true;
                    if(obj_arg.obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){bln_disabled=false;}                            
                    if(this.obj_design.int_modeExecute===obj_holder.int_modeReadOnly){bln_disabled=true;}//this is affected if has dynamicParent              
                    if(typeof foo_val==="object"){bln_disabled=true;}        
                    if(bln_locked){bln_disabled=true;}              
                    obj_item.fn_setDisabled(bln_disabled);              
      
                    obj_item=this.fn_validateInput(obj_item);//revison - check backup
                    
                    return obj_item;
                      
                  }
                
                  fn_validateInputValue(str_name, str_value){      
                    return str_value;
                  }
                
                  fn_validateInput(obj_item){}//overidden
                  
                  fn_addNewPropertyRow(obj_arg){                            
                    
                    let obj_table=obj_arg.obj_table;
                    let obj_ini, arr;
                    let obj_row, obj_cell;
                    let obj_input;
                    let bln_disabled;              
                    let obj_selected=obj_project.obj_palettSelected;
                    let bln_locked=obj_selected.fn_getDesignLocked();              
                    
                  
                    let obj_item=obj_arg.obj_item;      
                    let obj_container=obj_arg.obj_container;
                  
                    obj_row=obj_table.fn_addItem();//BootItem
                  
                    //START CREATE NAME CELL
                    obj_ini=new Holder;               
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem          
                    obj_container=obj_cell;          
                    //END CREATE NAME CELL
      
                     obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);               
                     obj_item.obj_holder.obj_propertySheet=this;
                     obj_item.fn_setDesignProperty("str_linkId", obj_arg.obj_design.str_linkId);                           
                    obj_item.fn_setDesignProperty("str_inputAction", obj_arg.str_propertySourceChange + "Name");             
                    bln_disabled=true;
                    if(obj_arg.obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){bln_disabled=false;}                            
                    if(this.obj_design.int_modeExecute===obj_holder.int_modeReadOnly){bln_disabled=true;}//this is affected if has dynamicParent              
                    if(typeof foo_val==="object"){bln_disabled=true;}        
                    if(bln_locked){bln_disabled=true;}              
                    obj_item.fn_setDisabled(bln_disabled);              
                    //END TEXT INPUT TO NAME CELL
                    
                    //START CREATE VALUE CELL
                    obj_ini=new Holder;                   
                    obj_cell=obj_row.fn_addItem(obj_ini);//BootItem          
                    obj_container=obj_cell;          
                    //END CREATE VALUE CELL
      
                    obj_item=obj_container.fn_addContextItem(this.obj_holder.str_typePropertySheetInput);
                    obj_item.obj_holder.obj_propertySheet=this;              
                    obj_item.fn_setDesignProperty("str_linkId", obj_arg.obj_design.str_linkId);             
                    obj_item.fn_setDesignProperty("str_inputAction", obj_arg.str_propertySourceChange + "Value");             
                    bln_disabled=true;
                    if(obj_arg.obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){bln_disabled=false;}                            
                    if(this.obj_design.int_modeExecute===obj_holder.int_modeReadOnly){bln_disabled=true;}//this is affected if has dynamicParent              
                    if(typeof foo_val==="object"){bln_disabled=true;}        
                    if(bln_locked){bln_disabled=true;}              
                    obj_item.fn_setDisabled(bln_disabled);
      
                    return obj_item;
                  }  
              }//END CLS
              //END TAG
              //END component/xapp_propertysheet