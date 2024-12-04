
            //XSTART component/xdezign_dashboard_map
              class xdezign_dashboard_map extends xapp_dashboard{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                     
                }
                fn_onStateChange(){      
                  if(!super.fn_onStateChange()){return;}      
                }                
                fn_loadDashboard(){
                  if(!super.fn_loadDashboard()){return;}//should be overidden                                    
                  
                  let obj_item;
                  //obj_item=this.fn_addContextItem("form_hardrule");                  
                  obj_item=this.fn_addContextItemOnce("xdezign_map");                  
                  obj_item=this.fn_addContextItem("form_hardrule");                  
                  obj_item=this.fn_addContextItemOnce("xdezign_action");                  
                  //obj_item=this.fn_addContextItem("form_hardrule");                                   
                  obj_item=this.fn_addContextItemOnce("xdezign_propertysheet_designui");                  
                  obj_item=this.fn_addContextItemOnce("xdezign_propertysheet_design");
                  obj_item.fn_setDisplay(false);
                  obj_item=this.fn_addContextItemOnce("xdezign_propertysheet_style");                                     
                  obj_item=this.fn_addContextItemOnce("xdezign_propertysheet_property");
                  obj_item.fn_setDisplay(false);
                  obj_item=this.fn_addContextItemOnce("xdezign_propertysheet_attribute");                                                    
                  obj_item.fn_setDisplay(false);
                  
                  let obj_menuPanel=this.fn_getParentComponent();                  
                  let obj_container=this.obj_consoleContainerDashboard=obj_menuPanel.fn_addConsoleContainer("xapp_console_container_dashboard", true);                                    
                  this.obj_button_view_project=obj_container.fn_addConsoleContextItem("xdezign_button_view_project");                                                                                                                                                              
                  this.obj_button_save_project=obj_container.fn_addConsoleContextItem("xdezign_button_save_project");                                                                    
                  this.obj_button_release_project=obj_container.fn_addConsoleContextItem("xdezign_button_release_project");                                                                                                        
                  this.obj_button_locate_project=obj_container.fn_addConsoleContextItem("xdezign_button_locate_project");                                                                                                            
                  this.obj_button_close_project=obj_container.fn_addConsoleContextItem("xdezign_button_close_project");                                                        
                  
                  let obj_containerLeft=this.obj_consoleContainerDashboardLeft=obj_menuPanel.fn_addConsoleContainer("xapp_console_container_dashboard", false);
                  this.obj_button_duplicate_project=obj_containerLeft.fn_addConsoleContextItem("xdezign_button_duplicate_project");                                                                            
                  
                  
                  
                  
                  
                }                
                
                fn_moveCompassUp(){
                  this.obj_holder.obj_xdezign_map.fn_moveCompassUp();
                }
                fn_moveCompassHorizontal(){
                  this.obj_holder.obj_xdezign_map.fn_moveCompassHorizontal();
                }
                fn_moveCompassDown(){
                  this.obj_holder.obj_xdezign_map.fn_moveCompassDown();
                }
            
                fn_getContent(){ 
                  //console.log("TAG fn_getContent: " + obj_project.obj_palettSelected);          
            
                  let obj_container=this.fn_getParentComponent();
                    //console.log("obj_container.obj_design.bln_pin: " + obj_container.obj_design.bln_pin);
                    if(obj_container.obj_design.bln_pin===undefined){
                      obj_container.obj_design.bln_pin=true;
                      //console.log("turn pin on");
                    }      
                    
                    //*
                    if(obj_project.obj_palettSelected){          
                      obj_project.obj_palettSelected.obj_designDelegate.fn_setPaletteSelected();                                                  
                    }
                    //*/
                  
                }
            
                fn_onPaletteItemSelected(){
                  
                  //this.fn_setDisplay(true);

                  let obj_item;  
            
                  //this.fn_addDynamicItems();      
                  /*
                  let obj_selected=obj_project.obj_palettSelected;                
                  let obj_arg=obj_shared.fn_shallowCopy(obj_selected.obj_holder.obj_levelLimit);                
                  obj_arg.obj_selected=obj_selected;            
                  //*/

                  let bln_display=this.bln_showAllPropertySheets;
                  //this.bln_showAllPropertySheets=false;
                  
                  obj_item=this.fn_getComponent("xdezign_map");
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}
            
                  obj_item=this.fn_getComponent("xdezign_action");                                       
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}

                  obj_item=this.fn_getComponent("xdezign_propertysheet_designui");                  
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}                        

                  obj_item=this.fn_getComponent("xdezign_propertysheet_design");                  
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}                        
                  obj_item.fn_setDisplay(bln_display);

                  obj_item=this.fn_getComponent("xdezign_propertysheet_style");
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}
                                    
                  obj_item=this.fn_getComponent("xdezign_propertysheet_property");
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}
                  obj_item.fn_setDisplay(bln_display);

                  obj_item=this.fn_getComponent("xdezign_propertysheet_attribute");                  
                  if(obj_item){obj_item.fn_onPaletteItemSelected();}            
                  obj_item.fn_setDisplay(bln_display);

                  //this.fn_debug();
                  
                }            
                
                fn_linkCompassItem(obj_buttonMap){                     
            
                  this.obj_holder.obj_xdesign1_objectmap.fn_linkCompassItem(obj_buttonMap);
                }

                fn_toggleComponent(){                        

                  this.bln_showAllPropertySheets=obj_shared.fn_toogleBool(this.bln_showAllPropertySheets);
                  let obj_item=obj_project.obj_palettSelected;                        
                  obj_item.obj_designDelegate.fn_setPaletteSelected();                         
                }                  

                fn_copyComponent(){
                  let obj_item=obj_project.obj_palettSelected;      
                  obj_clipboard.fn_copy(obj_item);      
                  obj_item.obj_designDelegate.fn_setPaletteSelected();       
                }
                
                fn_pasteComponent(){      
                  let obj_item=obj_project.obj_palettSelected;                  
                  let obj_container=obj_clipboard.fn_validatePaste(obj_item);
                  if(!obj_container){return;}
            
                  obj_item=obj_clipboard.fn_paste(obj_container);               
               
                  if(obj_item.obj_designDelegate){
                    obj_item.obj_designDelegate.fn_setPaletteSelected();          
                  }
                  else{
                    alert("PASTE Design Delegate is false");
                  }
                }
                fn_insertComponent(){      
                  let obj_item=obj_project.obj_palettSelected;                  
                  let obj_insertNextTo=obj_clipboard.fn_validateInsert(obj_item);
                  if(!obj_insertNextTo){return;}
                  
                  obj_item=obj_clipboard.fn_insert(obj_insertNextTo);                         
                  obj_item.obj_designDelegate.fn_setPaletteSelected();          
                }
                fn_cutComponent(){
                  let obj_item=obj_project.obj_palettSelected;            
                  obj_clipboard.fn_copy(obj_item);
                  this.fn_deleteTag();
                }
                fn_deleteTag(){
                  let obj_item=obj_project.obj_palettSelected;                  
                  let bln_status=obj_clipboard.fn_validateDelete(obj_item);
                  if(!bln_status){return;}
            
                  let obj_container=obj_item.obj_holder.obj_container;
                  obj_item.obj_designDelegate.fn_setPaletteDeSelected();                      
                  let int_index=obj_container.fn_removeItem(obj_item);                  
                  obj_container.obj_design.int_modeExecute=obj_holder.int_modeEdit;
                  obj_container.obj_designDelegate.fn_setPaletteSelected();      
                }        
                fn_locateComponent(){            
                  obj_clipboard.fn_clear();
                  obj_projectTarget.obj_designDelegate.fn_setPaletteSelected();
                }                   
                fn_selectLocalHome(){      
                  let obj_localHome=obj_project.obj_palettSelected.fn_getNextLocalHome();      
                  obj_localHome.obj_designDelegate.fn_setPaletteSelected();
                }    
                fn_editTag(){      
                  alert("ERROR Not in use fn_editTag: " + obj_item.obj_design.str_name);
                  let obj_item=obj_project.obj_palettSelected;                        
                  obj_item.obj_design.int_modeExecute=obj_holder.int_modeEdit;      
                  obj_item.obj_designDelegate.fn_setChildrenModeExecute(obj_holder.int_modeEdit);//new change to also set children to editable
                  obj_item.obj_designDelegate.fn_setParentModeExecute(obj_holder.int_modeEdit);//new change to also set all parent to editable
                  obj_item.obj_designDelegate.fn_setPaletteSelected();       
                }    
                fn_setEazyGridSwitch  (){
                  return this.obj_holder.obj_xdesign1_objectaction.fn_setEazyGridSwitch();
                }  
                fn_rotateComponent(){
                  let obj_item=this.fn_getComponent("xdezign_action");
                  return obj_item.fn_rotateComponent();
                  //return this.obj_holder.obj_xdesign_action.fn_rotateComponent();
                }        
                //START PROPERTY SHEET E-VENT HANDLING                    
                fn_linkDomAttributeChange(){      
                  return this.obj_holder.obj_xdesign1_propertydomattribute.fn_linkDomAttributeChange();
                }
                fn_linkDesignChange(){      
                  return this.obj_holder.obj_xdesign1_propertydesign.fn_linkDesignChange();
                }
                
                fn_linkDomAttributeChange(){
                  return this.obj_holder.obj_xdesign1_propertydomattribute.fn_linkDomAttributeChange();      
            
                }           
                fn_propertyDOMStyleChangeName(){
                  return this.obj_holder.obj_xdesign1_propertydomstyle.fn_propertyDOMStyleChangeName();      
                }
                fn_propertyDOMStyleChangeValue(){
                  return this.obj_holder.obj_xdesign1_propertydomstyle.fn_propertyDOMStyleChangeValue();                  
                }
                fn_propertyDomPropertyChangeName(){
                  return this.obj_holder.obj_xdesign1_propertydomproperty.fn_propertyDomPropertyChangeName();            
                }
                fn_propertyDomPropertyChangeValue(){      
                  return this.obj_holder.obj_xdesign1_propertydomproperty.fn_propertyDomPropertyChangeValue();                  
                }
                fn_propertyDomAttributeChangeName(){
                  return this.obj_holder.obj_xdesign1_propertydomattribute.fn_propertyDomAttributeChangeName();                  
                }
                fn_propertyDomAttributeChangeValue(){
                  return this.obj_holder.obj_xdesign1_propertydomattribute.fn_propertyDomAttributeChangeValue();                        
                }      
                fn_propertyDesignChangeName(){      
                  return this.obj_holder.obj_xdesign1_propertydesign.fn_propertyDesignChangeName();                            
                }
                fn_propertyDesignChangeValue(){
                  return this.obj_holder.obj_xdesign1_propertydesign.fn_propertyDesignChangeValue();                                  
                }
              }//END CLS
              //END TAG
              //END component/xdezign_dashboard_map