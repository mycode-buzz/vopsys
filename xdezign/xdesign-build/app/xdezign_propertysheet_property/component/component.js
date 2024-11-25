            //XSTART component/xdezign_propertysheet_property
            class xdezign_propertysheet_property extends xdezign_propertysheet{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                                                                               
              }
              fn_onPaletteItemDeSelected(){//overiding for safety. can reivew overide.      
              }    
              fn_onPaletteItemSelected(){   

                let obj_selected=obj_project.obj_palettSelected;                           
                if(!obj_selected.fn_isElement()){
                  return;                }
                

                //START PROPERTY SHEET
                let obj_arg=new Holder;                
                obj_arg.obj_container=this;
                obj_arg.str_text=this.obj_design.str_text;
                obj_arg.obj_item=obj_selected;              
                obj_arg.obj_propertySource=obj_selected.obj_domProperty;                                              
                obj_arg.obj_design.str_linkId=obj_selected.obj_design.str_idXDesign;              
                obj_arg.str_propertySourceChange="fn_propertyDomPropertyChange";//this runs when a new entry is made in the property sheet                            
                obj_arg.obj_design.str_inputAction="fn_linkDomPropertyChange";//this runs when a value in the property sheet is changed                                            
                super.fn_onPaletteItemSelected(obj_arg);
                //END PROPERTY SHEET                          
                }   

                fn_displayPropertySheet(obj_arg){      
                  
                  let str_key, foo_val;    
                  let arr_Property=obj_arg.obj_item.dom_obj.attributes;
                  for(var i = 0; i < arr_Property.length;i++) {
                      
                      obj_arg.str_key=arr_Property[i].name; 
                      //obj_arg.foo_val=arr_Property[i].value;                   
                      //console.log("PROPERTY: " + obj_arg.str_key  + ": " + arr_Property[i].value);

                      obj_arg.foo_val=obj_arg.obj_item.dom_obj[obj_arg.str_key];
                      //console.log("PROPERTY: " + obj_arg.str_key  + ": " + obj_arg.foo_val);
                      this.fn_displayPropertySheetRow(obj_arg);          
                  } 
                }
              

                
                //this runs when a value in the property sheet is changed    
                fn_linkDomPropertyChange(obj_input){      

                  let obj_target, str_propertyName, str_propertyValue;                                                      
                  obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
                  str_propertyName=obj_input.obj_design.str_propertyName;            
                  str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());
                  if(str_propertyName===undefined){return;}
                  if(str_propertyValue===undefined){return;}              
            
                  obj_input.fn_setValue(str_propertyValue);
                  obj_target.fn_setDomProperty(str_propertyName, str_propertyValue);                                                                                  

                  this.fn_setPaletteSelected();                  
                }    
                
                //this runs when a new entry is made in the property sheet 
                fn_propertyDomPropertyChangeName(obj_input){

                  let obj_target, str_propertyName, str_propertyValue;                                                      
                  obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
                  str_propertyName=obj_input.obj_design.str_propertyName;
                  str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());                        
                  if(str_propertyValue===undefined){return;}                    

                  this.foo_propertyDomPropertyChangeName=str_propertyValue;      
                  this.fn_propertyDomPropertyChangeCheck(obj_target);            
                }
                
                //this runs when a new entry is made in the property sheet 
                fn_propertyDomPropertyChangeValue(obj_input){

                  let obj_target, str_propertyName, str_propertyValue;                                                      
                  obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
                  str_propertyName=obj_input.obj_design.str_propertyName;            
                  str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());                        
                  if(str_propertyValue===undefined){return;}                    
                  
                  str_propertyValue=obj_shared.fn_parseBool(str_propertyValue);       
                  this.foo_propertyDomPropertyChangeValue=str_propertyValue;      
                  this.fn_propertyDomPropertyChangeCheck(obj_target);             
                }
                fn_propertyDomPropertyChangeCheck(obj_item){
                  let str_name, foo_value;
                  str_name=this.foo_propertyDomPropertyChangeName;
                  foo_value=this.foo_propertyDomPropertyChangeValue;      
                  if(str_name===undefined){return;}
                  if(foo_value===undefined){return;}
                  this.foo_propertyDomPropertyChangeName=undefined;                                
                  this.foo_propertyDomPropertyChangeValue=undefined;                                
                  obj_item.fn_setDomProperty(str_name, foo_value);      
                  obj_item.obj_designDelegate.fn_setPaletteSelected();//seems to be necessary to do this                                                                       
                  return true;
                }    
                fn_validateItem(obj_item, str_name, str_value){                                    
                  return str_value;
                }
            }//END CLS
            //END TAG
            //END component/xdezign_propertysheet_property