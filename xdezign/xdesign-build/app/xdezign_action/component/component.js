
            //XSTART component/xdezign_action
              class xdezign_action extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onPaletteItemDeSelected(){//overiding for safety. can reivew overide.      
                }    
                
                fn_onPaletteItemSelected(){
                  
                  let bln_disabled;

                  let obj_selected=obj_project.obj_palettSelected;                                                 
                  let obj_localHome=obj_selected.fn_getLocalHome();      
                  
                  this.fn_removeAllContent();                                    
                  //return;                  
                  
                  bln_disabled=false;      
                  if(!obj_clipboard.fn_validateCopy(obj_selected)){  
                    bln_disabled=true;    
                  }                       
                  
                  //ADD BUTTON TO VALUE CELL                  
                  this.fn_addActionComponent(obj_selected, this, "Copy", bln_disabled);                  
                  //ADD BUTTON TO VALUE CELL
            
                  bln_disabled=false;      
                  if(!obj_clipboard.fn_validatePaste(obj_selected)){  
                    bln_disabled=true;    
                  }            

                  //ADD BUTTON TO VALUE CELL                  
                  this.fn_addActionComponent(obj_selected, this, "Paste", bln_disabled);
                  //ADD BUTTON TO VALUE CELL
            
                  bln_disabled=false;      
                  if(!obj_clipboard.fn_validateDelete(obj_selected)){  
                    bln_disabled=true;    
                  }

                  //ADD BUTTON TO VALUE CELL                  
                  this.fn_addActionComponent(obj_selected, this, "Cut", bln_disabled);                  
                  //ADD BUTTON TO VALUE CELL

                  bln_disabled=false;      
                  if(!obj_clipboard.fn_validateInsert(obj_selected)){  
                    bln_disabled=true;    
                  }                        
      
                  //ADD BUTTON TO VALUE CELL                  
                  this.fn_addActionComponent(obj_selected, this, "Insert", bln_disabled);                  
                  //ADD BUTTON TO VALUE CELL                  
            
                  //*
                  switch(obj_selected.obj_design.str_type.toLowerCase()){
                    case "eazygrid":
                      let obj_ini;
                      //ADD BUTTON TO VALUE CELL
                      bln_disabled=false;      
                      if(!obj_clipboard.fn_validateDelete(obj_selected)){  
                        bln_disabled=true;    
                      }

                      //ADD BUTTON TO VALUE CELL                  
                      this.fn_addActionComponent(obj_selected, this, "Rotate", bln_disabled);                  
                      //ADD BUTTON TO VALUE CELL
                      break;
                  }
                  //*/            
                  
                  bln_disabled=false;                  

                  //ADD BUTTON TO VALUE CELL                  
                  //this.fn_addActionComponent(obj_selected, this, "Home", bln_disabled);                  
                  //ADD BUTTON TO VALUE CELL                  
      
                  bln_disabled=false;      
                  if(!this.fn_validateOpen(obj_selected, obj_localHome)){  
                    bln_disabled=true;    
                  }                  

                  //ADD BUTTON TO VALUE CELL                  
                  this.fn_addActionComponent(obj_selected, this, "Open", bln_disabled);                  
                  //ADD BUTTON TO VALUE CELL                        

                  //ADD BUTTON TO VALUE CELL                  
                  //this.fn_addActionComponent(obj_selected, this, "Toggle", false);                  
                  //ADD BUTTON TO VALUE CELL                        
                  
                }
                fn_rotateComponent(){//EazyGrid
                  
                    let obj_eazygrid=obj_project.obj_palettSelected;            
                    obj_eazygrid.obj_design.int_axis=obj_shared.fn_flipOrientation(obj_eazygrid.obj_design.int_axis);    
                    //console.log("obj_eazygrid.obj_design.int_axis: " + obj_eazygrid.obj_design.int_axis);
                    
                    obj_eazygrid.fn_compileTemplate();                              
                    obj_eazygrid.fn_applyFeatures();//required , or must go in base object additem                             
                    obj_eazygrid.obj_designDelegate.fn_setPaletteSelected();      
                  }
            
                  fn_validateSave(obj_item, obj_localHome){
                    let bln_debug=false;
                    
            
                    if(!obj_item){        
                        return false;
                    }        
            
                    if(obj_item.fn_getDynamic()){
                        if(bln_debug){console.log("VALIDATE SAVE: CANNOT SAVE DYNMAIC PIN")};
                        return false;
                      }
                    
                    let bln_locked=obj_localHome.fn_getDesignLocked();        
                    if(bln_locked){//cannot manipulate locked component
                    //if(bln_locked && obj_localHome!==obj_item){//cannot manipulate locked component
                        if(bln_debug){console.log("VALIDATE SAVE: LOCALHOME IS LOCKED")};
                        return false;
                    //}        
                    }
            
                    if(bln_debug){console.log("VALIDATE SAVE: VALIDATED")};   
                    return true;
            
                }                
                fn_addActionComponent(obj_selected, obj_container, str_text, bln_disabled){

                  let str_action=str_text.toLowerCase();
                  let str_function="fn_" + str_action + "Component";

                  let obj_item=obj_container.fn_addContextItem("xdezign_button_action_item");    
                  obj_item.fn_setDesignProperty("str_linkId", obj_selected.obj_design.str_idXDesign);               
                  obj_item.fn_setDesignProperty("str_buttonAction", str_function);                               
                  obj_item.fn_setText(str_text);
                  obj_item.fn_setDisabled(bln_disabled);
                }
                fn_validateSaveAs(obj_item, obj_localHome){
                    let bln_debug=false;              
            
                    if(!obj_item){        
                        return false;
                    }        
            
                    if(obj_item!==obj_projectTarget){
                        return false;
                      }
      
                      if(!obj_item.obj_design.int_idRecord){                            
                        return false;
                      }
            
                    if(obj_item.fn_getDynamic()){
                        if(bln_debug){console.log("VALIDATE SAVE AS: CANNOT SAVE DYNMAIC PIN")};
                        return false;
                    }
            
                    if(bln_debug){console.log("VALIDATE SAVE AS: VALIDATED")};   
                    return true;
                }
                fn_validateEdit(obj_item, obj_localHome){
                    let bln_debug=false;              
            
                    if(!obj_item){        
                        return false;
                    }        
            
                    if(obj_item.fn_getDynamic()){
                        if(bln_debug){console.log("VALIDATE EDIT: CANNOT SAVE DYNMAIC PIN")};
                        return false;
                      }
                    
                    let bln_locked=obj_localHome.fn_getDesignLocked();        
                    if(bln_locked){//cannot manipulate locked component
                      //if(bln_locked && obj_localHome!==obj_item){//cannot manipulate locked component
                        if(bln_debug){console.log("VALIDATE EDIT: LOCALHOME IS LOCKED")};
                        return false;
                    //}        
                    }              
            
                    if(bln_debug){console.log("VALIDATE EDIT: VALIDATED")};   
                    return true;
                }
                fn_validateOpen(obj_item, obj_localHome){
                    let bln_debug=false;              
            
                    if(!obj_item){        
                        return false;
                    }        
                    if(obj_item.obj_design.int_idRecord===0){
                      if(bln_debug){console.log("VALIDATE OPEN: VALIDATED (ID RECORD IS 0)");}      
                      return false;
                    }            
            
                    /*
                    if(obj_item.fn_getDynamic()){
                        if(bln_debug){console.log("VALIDATE OPEN: CANNOT OPEN DYNMAIC PIN")};
                        return false;
                      }
                    //*/
                    
                    let bln_locked=obj_localHome.fn_getDesignLocked();        
                    if(bln_locked && obj_item!=obj_localHome){
                        if(bln_debug){console.log("VALIDATE OPEN: LOCALHOME IS LOCKED")};
                        return false;
                    }
                    if(obj_item==obj_projectTarget){
                        if(bln_debug){console.log("VALIDATE OPEN: SELECTED IS ALREADY OPEN")};
                        return false;
                    }
                    
                    if(bln_debug){console.log("VALIDATE OPEN: VALIDATED")};   
                    return true;
                }
              }//END CLS
              //END TAG
              //END component/xdezign_action