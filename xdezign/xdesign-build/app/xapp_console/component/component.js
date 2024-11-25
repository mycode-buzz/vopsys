
            //XSTART component/xapp_console
              class xapp_console extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                    
                  this.bln_debugContainer=false;
                }
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("orange");}                  
                  this.fn_highlightBorder("orange");
                }

                fn_disable(){               
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_disable");      
                  }               
                  
                  this.fn_disableBlock(this.obj_blockLeft);
                  this.fn_disableBlock(this.obj_blockRight);
                }
                fn_hide(){        
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_hide");      
                  }                                  
                  
                  this.fn_hideBlock(this.obj_blockLeft);
                  this.fn_hideBlock(this.obj_blockRight);
                }

                fn_disableBlock(obj_block){          
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_disableBlock");       
                  }                                         
                  
                  let arr_item=obj_block.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){
                    let obj_item=arr_item[i];                       
                    obj_item.fn_disable();                    
                  }
                }
                fn_hideBlock(obj_block){                  
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_hideBlock");       
                  }                                         
                  
                  let arr_item=obj_block.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){
                    let obj_item=arr_item[i];                    
                    obj_item.fn_hide();                    
                  }
                }

                fn_addConsoleContainerGeneric(bln_side){
                  return this.fn_addConsoleContainer("xapp_console_container", bln_side)
                }

                fn_addConsoleContainer(str_nameContextItem, bln_side){
                  if(this.bln_debugContainer){
                    console.log("xapp_console fn_addConsoleContainer");       
                  }                                         
                  let obj_block, obj_item;                  
                  obj_block=this.obj_blockLeft;                                                                        
                  
                  if(bln_side){
                    obj_block=this.obj_blockRight;                    
                  }

                  if(!obj_block){return;}                  
                  

                  if(bln_side){
                    obj_item=obj_block.fn_getComponent(str_nameContextItem);
                    if(!obj_item){         
                        
                        let obj_contextItem=obj_block.fn_useContextItem(str_nameContextItem);
                        if(!obj_contextItem){
                          console.log("[" + str_nameContextItem + "]: " + obj_contextItem + ", is false, check context items have been added - e.g data context form holder. compare with a working model.");
                        }
                        else{
                          //console.log("[" + str_nameContextItem + "]: " + obj_contextItem);
                        }
                        obj_contextItem.obj_design.bln_startPosition=true;                        
                        obj_contextItem.blnDebugPosition=true;
                        obj_item=obj_block.fn_addItem(obj_contextItem);        
                        obj_item=obj_block.fn_formatContextItem(obj_item);                                    
                    }            
                  }      
                  else{                    
                    obj_item=obj_block.fn_addContextItemOnce(str_nameContextItem);
                  }

                  if(obj_item){                    
                    obj_item.fn_setDisplayFlex(false);                                                            
                    obj_item.fn_hide();                    
                  }                  

                  //console.log(" obj_item [" + str_nameContextItem + "]: " + obj_item);
                  

                  return obj_item;
                }

                fn_getConsoleContainer(str_nameConsoleContainer){
                  let obj_block, obj_item;                  
                  
                  obj_block=this.obj_blockLeft;
                  if(!obj_block){return;}                  
                  obj_item=obj_block.fn_getComponent(str_nameConsoleContainer);
                  if(obj_item){return obj_item;}
                  
                  obj_block=this.obj_blockRight;
                  if(!obj_block){return;}                  
                  obj_item=obj_block.fn_getComponent(str_nameConsoleContainer);
                  if(obj_item){return obj_item;}                  
                }
                fn_onLoad(){
                  super.fn_onLoad();                                                      
                  
                  this.obj_blockLeft=this.fn_getItemGoSouth("block_left");                  
                  this.obj_blockRight=this.fn_getItemGoSouth("block_right");                 

                  if(this.fn_getDebugPin()){this.obj_blockLeft.fn_highlightBorder("green");}
                  if(this.fn_getDebugPin()){this.obj_blockRight.fn_highlightBorder("purple");}                  
                  
                }
                
              }//END CLS
              //END TAG
              //END component/xapp_console