
            //XSTART component/xapp_accordion
              class xapp_accordion extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                  
                  // this.fn_extends("component");            

                  //START INITIALIZE STYLE              
                  if(this.obj_domStyle.width===undefined){this.obj_domStyle.width="100%";}            
                  //if(this.obj_domStyle.padding===undefined){this.obj_domStyle.paddingBottom="0px";}
                  if(this.obj_domStyle.display===undefined){this.obj_domStyle.display="block";}                                   
                }
                fn_onLoad(){    
                  super.fn_onLoad();                                    
                }

                fn_addItem(obj_ini=false){
                  let obj_item;        
                  if(!obj_ini){
                    obj_ini=new Holder;
                    obj_ini.obj_design.str_type="menu_button";                                       
                    obj_ini.obj_domStyle.flexDirection="row";           
                      obj_ini.obj_domStyle.flexWrap="wrap";                  
                  }      
                  obj_item=super.fn_addItem(obj_ini);//CallSuper                                              
                  return obj_item;
                }
              
                //START COMPONENTEVENT HANDLING                
                fn_open(){
                    this.fn_openParent();
                }
                fn_close(){
                    this.fn_closeLevel();
                    this.fn_displayOnLevel();                    
                }                                  
                fn_openParent(){        
                    let obj_container=this.fn_getParentComponent();        
                    let str_method="fn_open";        
                    if(obj_container && obj_container[str_method]){
                        obj_container[str_method]();
                    }              
                }
                fn_hasOpenChild(obj_exclude, bln_ignoreBefore){                  
                  let bln_seen=false;                  
                    for(var i=0;i<this.obj_design.arr_item.length;i++){
                        let obj_item=this.obj_design.arr_item[i];
                        if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}
                        if(obj_item && obj_item!==obj_exclude){                                                    
                            if(obj_item.fn_getIsOpen()){                              
                              return true;
                            }
                        }              
                    }
                    return false;

                }             
                fn_closeChildren(){
                  
                }
                fn_closeLevel(obj_exclude, bln_ignoreBefore ){                  
                  let str_method="fn_close";        
                  let bln_seen=false;
                    for(var i=0;i<this.obj_design.arr_item.length;i++){
                        let obj_item=this.obj_design.arr_item[i];
                        if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}
                        if(obj_item && obj_item!==obj_exclude && obj_item[str_method]){
                            if(!obj_item.obj_design.bln_isPinned){                              
                                obj_item[str_method]();
                            }
                        }              
                    }
                }                
                fn_hideLevel(obj_exclude, bln_ignoreBefore){                                    
                  this.fn_notifyChildren("fn_interfaceHide", obj_exclude, bln_ignoreBefore);                  
                }
                fn_showLevel(obj_exclude, bln_ignoreBefore){                                  
                  this.fn_notifyChildren("fn_interfaceShow", obj_exclude, bln_ignoreBefore);                  
                }
                fn_displayOnLevel(obj_exclude, bln_ignoreBefore){                  
                  this.fn_notifyChildren("fn_displayOn", obj_exclude, bln_ignoreBefore);                  
                }                
                fn_displayOffLevel(obj_exclude, bln_ignoreBefore){                  
                  this.fn_notifyChildren("fn_displayOff", obj_exclude, bln_ignoreBefore);                  
                }                                

                fn_autoOpen(obj_exclude, bln_ignoreBefore){
                  //let str_method="fn_open";
                  let str_method="fn_toggle";                  
                  let bln_seen=false;
                  for(var i=0;i<this.obj_design.arr_item.length;i++){
                    let obj_item=this.obj_design.arr_item[i];
                    if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}                             
                    if(obj_item && obj_item!==obj_exclude && obj_item[str_method] && obj_item.fn_getAutoOpenPin()){                        
                        obj_item[str_method]();                                            
                    }                                      
                  }
                }
                fn_notifyChildren(str_method, obj_exclude, bln_ignoreBefore){                  
                  let bln_seen=false;
                  let arr_item=this.obj_design.arr_item;
                  for(var i=0;i<arr_item.length;i++){
                    let obj_item=arr_item[i];
                    if(bln_ignoreBefore){if(obj_item===obj_exclude){bln_seen=true;}if(!bln_seen){continue;}}                             
                    if(obj_item && obj_item!==obj_exclude && obj_item[str_method]){                        
                        obj_item[str_method]();                    
                    }                                      
                  }
                }
              }//END CLS
              //END TAG
              //END component/xapp_accordion