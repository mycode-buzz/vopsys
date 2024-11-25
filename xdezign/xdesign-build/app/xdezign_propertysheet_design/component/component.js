
            //XSTART component/xdezign_propertysheet_design
              class xdezign_propertysheet_design extends xdezign_propertysheet{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                                

                  this.obj_holder.str_listInDesignUI="bln_classController,bln_lockComponent,bln_palettePin,bln_palettePinRelease,bln_registerAtContainer,bln_registerAtProject,int_idRecord,str_classExtend,str_categoryName,str_name,str_themeType,str_subType,str_type,str_tag,str_text,str_value,";
                }

                fn_displayPropertySheet(obj_arg){//to be overriden              

                  let str_listInDesignUI=this.obj_holder.str_listInDesignUI;
                  
            
                  let arr_Property=Object.entries(obj_arg.obj_propertySource).sort((a, b) => a[0].localeCompare(b[0]));          
                  for (let [str_key, foo_val] of arr_Property) {          

                      
                      let bln_display=true;
                      if(obj_shared.fn_inStr(","+str_key+",", ","+str_listInDesignUI+",")){                                  
                        bln_display=false;
                      }            
                      

                      if(bln_display){
                        obj_arg.str_key=str_key;
                        obj_arg.foo_val=foo_val;
                        this.fn_displayPropertySheetRow(obj_arg);
                      }
            
                      
                    } 
                }            
      
                fn_onPaletteItemDeSelected(){//overiding for safety. can reivew overide.      
                }    
                fn_onPaletteItemSelected(){   
            
                  let obj_selected=obj_project.obj_palettSelected;             
                  if(!obj_selected.fn_isElement()){
                    return;
                  }                                
                  
                  //START PROPERTY SHEET
                  let obj_arg=new Holder;              
                  obj_arg.obj_container=this;
                  obj_arg.str_text=this.obj_design.str_text;
                  obj_arg.obj_item=obj_selected;              
                  obj_arg.obj_propertySource=obj_selected.obj_design;                                              
                  obj_arg.obj_design.str_linkId=obj_selected.obj_design.str_idXDesign;              
                  obj_arg.str_propertySourceChange="fn_propertyDesignChange";//this runs when a new entry is made in the property sheet                            
                  obj_arg.obj_design.str_inputAction="fn_linkDesignChange";//this runs when a value in the property sheet is changed                                            
                  super.fn_onPaletteItemSelected(obj_arg);
                  //END PROPERTY SHEET                          
                }         
                  
                //this runs when a value in the property sheet is changed
                fn_linkDesignChange(obj_input){                    

                  let obj_target, str_propertyName, str_propertyValue;                                                      
                  obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
                  str_propertyName=obj_input.obj_design.str_propertyName;            
                  str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());
                  str_propertyValue=obj_shared.fn_parseBool(str_propertyValue);                         
                  if(str_propertyName===undefined){return;}
                  if(str_propertyValue===undefined){return;}                                            
                  
                  obj_input.fn_setValue(str_propertyValue);
                  obj_target.obj_designDelegate.fn_setDesignProperty(str_propertyName, str_propertyValue);                                                                                  
                  
                  this.fn_setPaletteSelected();                  
                }
                  
                fn_propertyDesignChangeName(obj_input){//when adidng a new item

                  let obj_target, str_propertyName, str_propertyValue;                                                      
                  obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
                  str_propertyName=obj_input.obj_design.str_propertyName;            
                  str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());
                  if(str_propertyValue===undefined){return;}                    

                  this.foo_propertyDesignChangeName=str_propertyValue;                  
                  this.fn_propertyDesignChangeCheck(obj_target);      
                }
                fn_propertyDesignChangeValue(obj_input){//when adding a new item

                  let obj_target, str_propertyName, str_propertyValue;                                                      
                  obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
                  str_propertyName=obj_input.obj_design.str_propertyName;            
                  str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());
                  str_propertyValue=obj_shared.fn_parseBool(str_propertyValue);                           
                  if(str_propertyValue===undefined){return;}                          

                  this.foo_propertyDesignChangeValue=str_propertyValue;                                
                  this.fn_propertyDesignChangeCheck(obj_target);      
                }
                fn_propertyDesignChangeCheck(obj_item){
          
                  let str_name, str_value;
                  str_name=this.foo_propertyDesignChangeName;
                  str_value=this.foo_propertyDesignChangeValue;                  
                  //console.log("str_name: " + str_name);
                  //console.log("str_value: " + str_value);
                  if(str_name===undefined){return;}                  
                  if(str_value===undefined){return;}                                    
                  this.foo_propertyDesignChangeName=undefined;                                
                  this.foo_propertyDesignChangeValue=undefined;                                
                  obj_item.obj_designDelegate.fn_setDesignProperty(str_name, str_value);                                              
                  obj_item.obj_designDelegate.fn_setPaletteSelected();
                  return true;
                }
                
          
                fn_validateItem(obj_item, str_name, str_value){                        
          
                  let obj_instance, bln_value;
    
                  let int_idRecordProjectTarget=obj_projectTarget.obj_design.int_idRecord;
                  let int_idRecordProject=obj_project.obj_design.int_idRecord;
                  let blnEditXDesigner=false;
                  //console.log("int_idRecordProjectTarget: " + int_idRecordProjectTarget);
                  //console.log("int_idRecordProject: " + int_idRecordProject);
                  if(int_idRecordProjectTarget===int_idRecordProject){
                    blnEditXDesigner=true;
                  }
            
                  switch(str_name){        
                    case "str_categoryName":                  
                    if(str_value===""){
                      str_value="Xtra";
                    }                      
                    break;
                    case "str_classExtend":                  
                      bln_value=obj_item.fn_proposeClassExtend(str_value);
                      if(!bln_value){str_value=obj_item.fn_getClassExtend();}
                    break;
                    case "str_type":                  
                      bln_value=obj_item.fn_proposeType(str_value);
                      if(!bln_value){str_value=obj_item.fn_getType();}
                      if(obj_item===obj_projectTarget){                            
                        obj_projectTarget.obj_holder.str_componentCode=false; 
                        obj_item.obj_holder.bln_changeRecordType=true;                            
                        obj_project.fn_onStateChange();
                        //obj_project.obj_palettSelected.obj_designDelegate.fn_setPaletteSelected();       
                      }   
                      else{   
                        str_value="error";
                      }          
                    
                    break;   
                    case "str_idXDesign":
                        if(!blnEditXDesigner){                                     
                          obj_instance=obj_projectTarget.fn_findItemById(str_value);                                
                          if(obj_instance){
                            //internal duplicate error                 
                            str_value="internal duplicateerror str_idXDesign";
                          }                
                          obj_instance=obj_project.fn_findItemById(str_value);                                
                          if(obj_instance){
                            //designer duplicate error                 
                            str_value="designer duplicateerror str_idXDesign";
                          }                
                        }
                    break;    
                    case "bln_registerAtProject":                                           
    
                          if(!blnEditXDesigner){
                            obj_instance=obj_projectTarget.fn_findItemByVariableName(obj_project.obj_palettSelected.obj_design.str_nameShort, obj_project.obj_palettSelected);
                            if(obj_instance && obj_instance!==obj_project.obj_palettSelected){
                              //internal duplicate error                 
                              //console.log("internal duplicate error bln_registerAtProject obj_projectTarget/obj_instance: " + obj_instance + "[" + obj_project.obj_palettSelected.obj_design.str_nameShort + "]");
                              obj_instance.fn_debug("internal duplicate error bln_registerAtProject obj_project/obj_instance");
                              str_value=obj_project.obj_palettSelected.fn_getRegisterAtProject();
                            }
    
                            obj_instance=obj_project.fn_findItemByVariableName(obj_project.obj_palettSelected.obj_design.str_nameShort, obj_project.obj_palettSelected);
                            if(obj_instance && obj_instance!==obj_project.obj_palettSelected){
                              //designer duplicate error                                 
                              console.log("designer duplicate error bln_registerAtProject obj_project/obj_instance: " + obj_instance  + "[" + obj_project.obj_palettSelected.obj_design.str_nameShort + "]");
                              obj_instance.fn_debug("designer duplicate error bln_registerAtProject obj_project/obj_instance");
                              str_value=obj_project.obj_palettSelected.fn_getRegisterAtProject();
                            }
                          }
                    break;                        
                    case "str_name":                       
                          if(!blnEditXDesigner){               
                            /*
                            let str_nameShort=obj_shared.fn_formatShortName(str_value);     
                            obj_instance=obj_projectTarget.fn_findItemByVariableName(str_nameShort, obj_project.obj_palettSelected);                                                
                            if(obj_instance && obj_instance!==obj_project.obj_palettSelected){
                              //internal duplicate error                                                     
                              console.log("internal duplicate error str_name: " + obj_instance.obj_design.str_name);
                              str_value=obj_project.obj_palettSelected.fn_getName();
                            }   
                            //*/             
    
                            /*
                            obj_instance=obj_project.fn_findItemByVariableName(str_nameShort, obj_project.obj_palettSelected);
                            if(obj_instance && obj_instance!==obj_project.obj_palettSelected){                          
                              //designer duplicate error                                             
                              console.log("designer  duplicate error str_name: " + obj_instance.obj_design.str_name);                          
                              str_value=obj_project.obj_palettSelected.fn_getName();
                            } 
                            //*/               
                          }
                            
                    break;              
                    case "str_nameShort":                     
                          obj_instance=obj_projectTarget.fn_findItemByVariableName(str_value, obj_project.obj_palettSelected);                                                                
                          if(obj_instance){                
                            str_value=obj_project.obj_palettSelected.fn_getVariableName();;
                          }
                    break;              
                    }     
                  
                  
                  return str_value;
                }
          
                fn_isDuplicateVariableName(){        
                  
                }
                
            
                fn_validateInput(obj_item){       
                  
                  let bln_isProject=false;
                  let obj_selected=obj_project.obj_palettSelected;

                  let bln_debug=false;
                  if(obj_item.obj_design.str_propertyName==="xxxbln_lockComponent"){
                    bln_debug=true;
                  }
                  
                  if(obj_selected.obj_design.int_modeExecute!==obj_holder.int_modeEdit){                                    
                    obj_item.fn_setDisabled(true);                  
                    return;
                  }                        
                  if(obj_selected===obj_projectTarget){//probably ok to leave disabled global if selected component is not the project        
                    bln_isProject=true;
                  }                                                   
                  
                  let str_listIn="bln_debugDesign,bln_editPinRelease,bln_editPin,bln_expand,bln_isContainer,bln_lockComponent,bln_palettePinRelease,bln_palettePin,bln_registerAtContainer,bln_registerAtProject,bln_showToolbar,bln_startPosition,bln_typeable,str_nameRegistrator,dataSVG,filterSVG,gridTemplate,int_idMetaRowz,str_categoryName,str_icon,str_releaseLabel,str_createdDate,str_idProject,str_modifiedDate,str_name,str_nameFileServer,str_subType,str_tag,str_text,str_themeType,str_value";              
                  let str_listInProjectOnly="bln_classController,bln_dynamicPin,bln_isContextHolder,bln_palettePin,bln_serverIndex,bln_stageRelease,str_classList,str_classExtend,str_nameFileServer,str_type";              
                  let str_listReadOnly="int_idRecord";                            
                  let str_listAllAccess="gridTemplate";

                  let str_name=obj_item.obj_design.str_propertyName;                                    
                  

                  let bln_disabled=true;                   
                  
                  let str_method="fn_validateDesignInput";
                  if(obj_selected && obj_selected[str_method]){
                    bln_disabled=obj_selected[str_method](obj_item);
                  }                        
                  
    
                  if(obj_shared.fn_inStr(","+str_name+",", ","+str_listIn+",")){                
                    bln_disabled=false;
                  }              
                  if(bln_isProject){
                    if(obj_shared.fn_inStr(","+str_name+",", ","+str_listInProjectOnly+",")){                
                      bln_disabled=false;
                    }            
                  }              

                  if(bln_debug){
                    obj_selected.fn_debugText("bln_disabled: " + bln_disabled);
                    obj_selected.fn_debugText("str_name: " + str_name);
                    obj_selected.fn_debugText("str_listIn: " + str_listIn);
                  }
                  
                  if(!bln_isProject){
                    if(obj_shared.fn_inStr(","+str_name+",", ","+str_listInProjectOnly+",")){                
                      bln_disabled=true;
                    }            
                  } 
                  
                  switch(str_name){                                            
                    case "str_text": 
                      if(obj_selected.fn_getTypeable()){
                        //bln_disabled=false;
                      }            
                    break;
                    case "bln_lockComponent":                                                                           
                      if(!obj_selected.fn_proposeEditLock()){
                          bln_disabled=true;
                      }
                    break;                
                    case "bln_registerAtProject":                                                                           
                      if(!obj_selected.fn_proposeRegisterAtProject()){
                          bln_disabled=true;
                      }
                    break;                
                    
                    case "bln_classController":                                                                           
                      if(!obj_selected.fn_proposeClassController()){                    
                          bln_disabled=true;
                      }
                      break;
                    case "str_classList":                                                         
                    case "str_classExtend":                                    
                      if(!obj_selected.fn_getClassController()){
                        bln_disabled=true;
                      }            
                    break;                   
                  }

                  if(obj_shared.fn_inStr(","+ str_name +",", ","+ str_listReadOnly +",")){                
                    bln_disabled=true;    
                  }  
                  if(obj_shared.fn_inStr(","+ str_name +",", ","+ str_listAllAccess +",")){
                    bln_disabled=false;    
                  }  

                  let bln_locked=obj_selected.fn_getDesignLocked();              
                  if(bln_locked){
                    bln_disabled=true;
                  }

    
                  obj_item.fn_setDisabled(bln_disabled);                                    
                  
                  return;
                }
              }//END CLS
              //END TAG
              //END component/xdezign_propertysheet_design