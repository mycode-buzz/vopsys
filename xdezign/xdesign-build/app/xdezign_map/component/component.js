
            //XSTART component/xdezign_map
              class xdezign_map extends component{
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
                  obj_selected.fn_setLevelLimit();                  

                  this.fn_removeAllContent();                                                     
                  
                  this.bln_startMap=false;
                  if(obj_projectTarget){
                    this.bln_startMap=obj_projectTarget.obj_design.arr_item.length        
                  }
                  
                  //START LINK PARENT      
                  if(this.bln_startMap){
                    this.fn_getLevelParentObjectMap(obj_selected);
                  }
                  //END LINK PARENT
            
                  //START LINK SELF            
                  this.fn_getLevelSelectedObjectMap(obj_selected);                
                  //START LINK SELF
            
                  //START LINK CHILDREN
                  if(this.bln_startMap){
                    this.fn_getLevelChildObjectMap(obj_selected);      
                  }
                  //END LINK CHILDREN                        
                }   
                
                fn_getLevelParentObjectMap(obj_selected){                                    

                  let obj_levelLimit=obj_selected.obj_holder.obj_levelLimit;
                  let bln_disabled=false;                  
                  if(obj_levelLimit.bln_limitTop){bln_disabled=true;}            
                  
                  let obj_container=this.fn_addContextItem("form_container");                  
                  obj_container.fn_setStyleProperty("width","100%");                  
                  obj_container.fn_setStyleProperty("border","0px");                
                  //ADD BUTTON TO VALUE CELL                  
                  let obj_item=obj_container.fn_addContextItem("xdezign_button_map_nav");                                                      
                  obj_item.fn_setDesignProperty("str_linkId", obj_selected.obj_design.str_idXDesign);               
                  obj_item.fn_setDesignProperty("bln_navigateDirection", 1);             
                  obj_item.fn_setDisabled(bln_disabled);
                  this.objNavElementTop=obj_item;
                  //ADD BUTTON TO VALUE CELL
                              
                  if(!obj_selected.obj_holder.obj_container){                    
                  }
                  else{                                                          
                    obj_item=obj_container.fn_addContextItem("xdezign_button_map_item");                  
                    obj_item.fn_setDesignProperty("str_linkId", obj_selected.obj_holder.obj_container.obj_design.str_idXDesign);               
                    obj_item.fn_setText(obj_selected.obj_holder.obj_container.obj_design.str_tag);                    
                  }
                }
                fn_getLevelSelectedObjectMap(obj_selected){                                    

                  let obj_levelLimit=obj_selected.obj_holder.obj_levelLimit;
                  
                  let obj_container=this.fn_addContextItem("form_container");                                    
                  obj_container.fn_setStyleProperty("width","100%");                
                  obj_container.fn_setStyleProperty("border","0px");                
            
                  //ADD BUTTON TO VALUE CELL                  
                  let obj_item=obj_container.fn_addContextItem("xdezign_button_map_nav");                                    
                  obj_item.fn_setDesignProperty("str_linkId", obj_selected.obj_design.str_idXDesign);           
                  obj_item.fn_setDesignProperty("bln_navigateDirection", 0);                                
                  let bln_disabled=false;
                  if(obj_levelLimit.bln_limitLeft && obj_levelLimit.bln_limitRight){bln_disabled=true;}                  
                  obj_item.fn_setDisabled(bln_disabled);
                  this.objNavElementMiddle=obj_item;                                                      
                  //ADD BUTTON TO VALUE CELL                  

                  //ADD BUTTON TO VALUE CELL
                  obj_item=obj_container.fn_addContextItem("xdezign_button_map_item");                  
                  obj_item.fn_setDesignProperty("str_linkId", obj_selected.obj_design.str_idXDesign);
                  obj_item.fn_setDesignProperty("str_themeType", "form_button_highlight");                  
                  obj_item.fn_setText(obj_selected.obj_design.str_tag);
                  obj_item.fn_applyFeatures();
                  //ADD BUTTON TO VALUE CELL
                }    
                fn_getLevelChildObjectMap(obj_selected){                

                  
                  let obj_levelLimit=obj_selected.obj_holder.obj_levelLimit;            
                  let bln_disabled=false;
                  if(obj_levelLimit.bln_limitBottom){bln_disabled=true;}                                    
                  
                  
                  let obj_container=this.fn_addContextItem("form_container");
                  obj_container.fn_setStyleProperty("width","100%");
                  obj_container.fn_setStyleProperty("border","0px");                
                  
                  //ADD BUTTON TO VALUE CELL
                  let obj_item=obj_container.fn_addContextItem("xdezign_button_map_nav");                  
                  obj_item.fn_setDesignProperty("str_linkId", obj_selected.obj_design.str_idXDesign);           
                  obj_item.fn_setDesignProperty("bln_navigateDirection", -1);                                
                  obj_item.fn_setDisabled(bln_disabled);
                  this.objNavElementBottom=obj_item;                  
            
                  let arr=obj_selected.obj_design.arr_item;                         
                  for(let i=0;i<arr.length;i++){
                    let obj_selectedChild=arr[i];                                      

                    //themetype form_button
                    obj_item=obj_container.fn_addContextItem("xdezign_button_map_item");                  
                    obj_item.fn_setDesignProperty("str_linkId", obj_selectedChild.obj_design.str_idXDesign);
                    obj_item.fn_setText(obj_selectedChild.obj_design.str_tag);
                  }            
                }        
      
                fn_linkCompassItem(obj_buttonMap){                        
                  
                  let obj_target=obj_projectTarget.fn_findItemById(obj_buttonMap.obj_design.str_linkId); //locate the actual object via the link id                                                   
            
                  if(!obj_target){
                    //alert("MAP 3 CHECK obj_target is false, obj_itemEvent.obj_design.str_linkId is undefined");                                        
                    return;
                  }                  
                  else{
                    /*
                    //alert("MAP 4  obj_target is found");                    
                    //console.log("MAP 4  obj_target is found");                    
                    //console.log(obj_target);                    
                    //*/
                  }
                  
                  if(obj_target.obj_designDelegate){                    
                    obj_target.obj_designDelegate.fn_setPaletteSelected();                        
                  }            
                }  
                
                
                fn_moveCompassHome(){//HOME
                  let obj_item=obj_projectTarget;
                  obj_item.obj_designDelegate.fn_setPaletteSelected();                        
                }        
                fn_moveCompassHorizontal(){//HORIZONTAL
                  let obj_item, int_index, obj_container, arr_item;      
                  let obj_selected, obj_itemEvent, obj_itemOriginal, obj_target;                        
                  
                  obj_selected=obj_project.obj_palettSelected;//currently selected item
                  obj_itemEvent=obj_project.obj_itemEvent;//button that was clicked      
                  obj_itemOriginal=obj_projectTarget.fn_findItemById(obj_itemEvent.obj_design.str_linkId);//item that the button is linked to                        
            
                  obj_target=obj_selected;//keep here      
                  
                  if(obj_selected===obj_itemOriginal.obj_holder.obj_container){//parent, requesting sibling                    
                  }
            
                  if(obj_selected===obj_itemOriginal){//currently selected, requesting sibling                  
                  }
            
                  if(obj_selected.obj_holder.obj_container===obj_itemOriginal){//child requesting sibling                  
                  }
                  
                  obj_container=obj_project.obj_palettSelected.obj_holder.obj_container;        
                  arr_item=obj_container.obj_design.arr_item;
                  if(!obj_container){return};
                  obj_item=obj_project.obj_palettSelected;
                  int_index=obj_container.fn_findItemIndex(obj_item);
                  if(int_index===arr_item.length-1){int_index=-1;}
                  obj_item=arr_item[int_index+1];        
                  obj_target=obj_item;                              
                  
                  obj_target.obj_designDelegate.fn_setPaletteSelected();                        
                }   
                fn_moveCompassUp(){//UP
                  let obj_selected, obj_itemEvent, obj_itemOriginal, obj_target, arr_item, obj_item;      
                  
                  
                  obj_selected=obj_project.obj_palettSelected;//currently selected item
                  obj_itemEvent=obj_project.obj_itemEvent;//navigation button that was clicked      
                  obj_itemOriginal=obj_projectTarget.fn_findItemById(obj_itemEvent.obj_design.str_linkId);//item that the button is linked to                        
            
                  obj_target=obj_selected;//keep here      
            
                  if(!obj_itemOriginal){
                    obj_itemEvent.fn_debug("error: obj_itemOriginal is false str_linkId:" + obj_itemEvent.obj_design.str_linkId);        
                    return;
                  }
                  
                  if(obj_selected===obj_itemOriginal.obj_holder.obj_container){//parent, requesting parent                                  
                    let obj_container=obj_selected.obj_holder.obj_container;
                    if(obj_container){
                      obj_target=obj_container;
                    }        
                  }
            
                  if(obj_selected===obj_itemOriginal){//currently selected, requesting parent                
                    obj_target=obj_selected.obj_holder.obj_container;
                  }
            
                  if(obj_selected.obj_holder.obj_container===obj_itemOriginal){//child requesting original selected              
                    obj_target=obj_itemOriginal;
                  }      
                  
                  if(obj_target){
                    if(obj_target.obj_designDelegate){
                      obj_target.obj_designDelegate.fn_setPaletteSelected();                        
                    }
                  }
                } 
                fn_moveCompassDown(){//DOWN      
                  let obj_selected, obj_itemEvent, obj_itemOriginal, obj_target, arr_item, obj_item;      
                  
                  
                  obj_selected=obj_project.obj_palettSelected;//currently selected item
                  obj_itemEvent=obj_project.obj_itemEvent;//button that was clicked      
                  obj_itemOriginal=obj_projectTarget.fn_findItemById(obj_itemEvent.obj_design.str_linkId);//item that the button is linked to                        
            
                  obj_target=obj_selected;//keep here
                  
                  if(obj_selected===obj_itemOriginal.obj_holder.obj_container){//parent, requesting original selected
                    obj_target=obj_itemOriginal;
                  }
            
                  if(obj_selected===obj_itemOriginal){//currently selected, requesting a child                
                    obj_target=obj_selected.fn_getLastItem();
                  }
            
                  if(obj_selected.obj_holder.obj_container===obj_itemOriginal){//child, requesting a subchild                          
                    obj_target=obj_selected.fn_getLastItem();  
                  }                  
                  
                  if(obj_target.obj_designDelegate){
                    obj_target.obj_designDelegate.fn_setPaletteSelected();                        
                  }
                }                
              }//END CLS
              //END TAG
              //END component/xdezign_map