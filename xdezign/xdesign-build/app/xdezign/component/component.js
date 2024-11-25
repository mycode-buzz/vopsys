
            //XSTART component/xdezign
              class xdezign extends xapp{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  

                  this.obj_design.int_radioDisplayMode=3;//Close Peers        
                  this.fn_setRadioDisplayMode();                
                }
                fn_onLoad(){
                  super.fn_onLoad();                  
                  
                  let obj_dynamicContent=this.fn_getComponent("xapp_dynamic_content");                  
                  obj_clipboard=obj_dynamicContent.fn_addContextItemOnce("xdezign_clipboard");                  
                };                               
                fn_unLoad(){
                  let arr_item=this.obj_menuButton.fn_getArrayStandardMenu();
                  if(arr_item.length){
                    this.obj_menuButton.fn_menuCloseAndDisable(arr_item[0]);
                  }
                };                               
                
                fn_navigateToProject(obj_post){                       
                  let obj_item;

                  this.fn_notifyChildControl("fn_navigateToProject", obj_post);
                  
                  //obj_clipboard.fn_clear();                   
                  obj_item=this.fn_getComponent("xdezign_iframe");                  
                  if(obj_item){
                    obj_item.fn_navigateToProject(obj_post.URLProjectVersion);                                               
                  }
                }  
                fn_navigateToWelcomeScreen(){                       
                  let obj_item;

                  this.fn_notifyChildControl("fn_navigateToWelcomeScreen");                                    
                  
                  //obj_clipboard.fn_clear();                   
                  obj_item=this.fn_getComponent("xdezign_iframe");                  
                  if(obj_item){
                    obj_item.fn_resetIFrame();                                               
                  }
                  
                }  

                fn_projectTarget_onLoad(){   //project target has been loaded in
                  obj_projectTarget=this.fn_getProjectTarget();                                    
                  if(!obj_projectTarget){
                    console.log("Error: obj_projectTarget is false");
                  }
                  this.fn_markPaletteSelected(obj_projectTarget);      
                  this.fn_onPaletteItemSelected();
                }
                
                fn_onPaletteItemSelected(){                                         

                  this.fn_notifyChildControl("fn_onPaletteItemSelected");                  
                  
                }                                    
                fn_onPaletteItemDeSelected(){
                  let obj_item=this.obj_palettSelected;   
                  if(!obj_item){return;}
                  /*
                  this.obj_holder.obj_managerTag.fn_onPaletteItemDeSelected();  
                  //*/
                }  
                
                fn_getProjectTarget(){
            
                  return this.fn_getGlass().obj_project;
                }
                fn_getGlass(){
                  let obj_item=this.fn_getComponent("xdezign_iframe");
                  if(obj_item){
                    return obj_item.dom_obj.contentWindow;
                  }
                  return false;
                }
                fn_markPaletteSelected(obj_item){
                  this.obj_palettSelectedLast=this.obj_palettSelected=obj_item;                                                 
                }    
                fn_unmarkPaletteSelected(){
                  this.obj_palettSelected=false;               
                }    
                fn_setPaletteSelected(obj_item){
                  if(!obj_item){
                    this.obj_palettSelected.obj_designDelegate.fn_setPaletteSelected();
                  }
                }       
                
                
                
                
                fn_onStateChange(){                      
                }  
                fn_notifyChildControl(str_nameFunction, obj_arg){                       
                  let obj_item;

                  obj_item=this.fn_getComponent("xdezign_menu_map");                                    
                  this.fn_notify(obj_item, str_nameFunction, obj_arg);                  

                  obj_item=this.fn_getComponent("xdezign_menu_tag");                                    
                  this.fn_notify(obj_item, str_nameFunction, obj_arg);                  
                  
                  obj_item=this.fn_getComponent("xdezign_menu_component");                  
                  this.fn_notify(obj_item, str_nameFunction, obj_arg);                  

                  obj_item=this.fn_getComponent("xdezign_menu_project");                  
                  this.fn_notify(obj_item, str_nameFunction, obj_arg);                  
                }                 
                
                fn_projectRemoveId(obj_item){      
                  if(this!==obj_projectTarget){
                    obj_projectTarget.obj_designDelegate.fn_removeIdFromItem(obj_item);
                    return;        
                  }
                  else{
                    this.obj_designDelegate.fn_removeIdFromItem(obj_item);
                  }
                }                    
                
                fn_validateContainer(obj_container, int_idRecordSearch=0){
              
                  let bln_debug_invalid=false;      
                  let bln_debug_valid=false;      
                  let bln_isContainer;
                
                  //At no point in the containers id lineage should int_idRecord occurr
                  //(or possibly any of id records children)          
                  if(!obj_container){//new component
                    if(bln_debug_invalid){console.log("VALIDATE CONTAINER: CONTAINER IS FALSE");}
                    return false;
                  }   
                  
                  bln_isContainer=obj_container.fn_getIsContainer();            
                  if(!bln_isContainer){//new component      
                    if(bln_debug_invalid){console.log("VALIDATE CONTAINER: THIS ITEM IS NOT A CONTAINER");}
                    return false;
                  }      
                  
                  if(obj_container.fn_getDesignLocked()){//new component
                    if(bln_debug_invalid){console.log("VALIDATE CONTAINER: THIS CONTAINER IS LOCKED");}      
                    return false;
                  }                  
                  
                  //CONSIDER REPLACING WITH obj_container.CanHavePaletteChildren
                  //*
                  if(parseInt(obj_container.obj_design.int_modeExecute)!==obj_holder.int_modeEdit){//new component              
                    if(bln_debug_invalid){console.log("VALIDATE CONTAINER: THIS CONTAINER IS NOT EDITABLE");}      
                    return false;
                  }
                  else{//editable but dynamic cannot insert children from palette
                    if(obj_container.fn_getDynamic()){
                      if(bln_debug_invalid){console.log("VALIDATE CONTAINER: THIS CONTAINER IS DYNAMIC");}      
                      return false;
                    }
                  }  
                  let obj_staticParent=obj_container.fn_hasStaticParent();        
                  if(obj_staticParent && obj_staticParent!==obj_projectTarget){            
                      return false;    
                  }       
                  
                  if(obj_container.fn_getStatic() && obj_container!==obj_projectTarget){            
                    if(bln_debug_invalid){console.log("VALIDATE CONTAINER: THIS CONTAINER IS STATIC AND NOT THE PROJECT");}      
                      return false;    
                  }       
                  //*/          
                
                  if(int_idRecordSearch===0){//new component
                    if(bln_debug_valid){console.log("VALIDATE CONTAINER: VALIDATED (ID SEARCH IS 0)");}      
                    return obj_container;
                  }      
                  if(obj_container.obj_design.int_idRecord===0){//new component        
                    if(bln_debug_valid){console.log("VALIDATE CONTAINER: VALIDATED (ID RECORD IS 0)");}      
                    return obj_container;
                  }            
                  
                  let bln_inHistory=obj_container.fn_searchIdHistory(obj_container, int_idRecordSearch);
                  if(bln_inHistory){        
                    if(bln_debug_invalid){console.log("VALIDATE CONTAINER: CANNOT INSERT PARENT INTO CHILD");}
                    return false;
                  }
                
                  if(bln_debug_valid){console.log("VALIDATE CONTAINER: THIS CONTAINER IS VALIDATED");}
                  return obj_container;
                }   
              }//END CLS
              //END TAG
              //END component/xdezign