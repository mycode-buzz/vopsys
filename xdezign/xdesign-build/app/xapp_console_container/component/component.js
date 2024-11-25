
            //XSTART component/xapp_console_container
              class xapp_console_container extends xapp_base{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                     

                  this.obj_holder.bln_listenSubmit=true;

                  this.bln_debugContainer=false;
                }                

                fn_onSubmit(e){                                                                                         

                  //this.fn_debugName("fn_onSubmit");

                  obj_project.fn_forgetEvent(e);          

                  this.fn_parentEventBubble("Submit", e);//this causes things to happen                  
                }

                fn_getConsoleComponent(str_value){
                  let obj_item=this.fn_getComponent(str_value);                  
                  return obj_item;
                }
                fn_addConsoleContextItem(str_value){
                  let obj_item=this.fn_addContextItem(str_value);                  
                  return obj_item;
                }

                fn_hide(){               
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_hide");
                  }
                  
                  this.fn_disableAllItems();
                  this.fn_checkDisplayFlex();
                }

                fn_disableAllItems(){                   
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_disableAllItems");
                    alert("deprecated will not see");
                  }                  
                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];
                    obj_item.fn_disableAll();                    
                  
                  }
                }
                

                fn_checkDisplayFlex(){                       
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_checkDisplayFlex");
                  }
                  
                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  let bln_found=false;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];
                    let str_value=obj_item.fn_getStyleProperty("display");
                    //this.fn_debugName("str_value: "  + str_value);                    
                    if(str_value!=="none"){
                      bln_found=true;
                    }                    
                  }
                  
                  if(!bln_found){                    
                    this.fn_setDisplayFlex(false);
                  }                                    
                }


                fn_setDisabledItems(){                   
                  if(this.bln_debugContainer){
                    this.fn_debugName("fn_setDisabledItems");
                  }
                  
                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  let bln_value=false;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];                    
                    bln_value=true;
                    
                    if(this.bln_debugContainer){                    
                      obj_item.fn_debug("console container fn_setDisabledItems fn_setDisabled true");                    
                    }                    

                    obj_item.fn_setDisabled();               
                  }
                  return bln_value;
                }

                fn_disable(){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_disable true");
                  }                    
                  
                  let bln_value=this.fn_setDisabledItems();
                  this.fn_setDisplayFlex(bln_value);
                  this.fn_checkDisplayFlex();
                }

                
                fn_hideItem(obj_item){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_hideItem");
                  }                    
                  
                  if(!obj_item)return;                  

                  if(this.bln_debugContainer){                                        
                    obj_item.fn_debug("console container hide item");                    
                  }                    

                  obj_item.fn_setDisplay(false);                  
                  this.fn_checkDisplayFlex();                  
                }
                fn_showItem(obj_item){                  
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_showItem");
                  }                                      
                  
                  if(!obj_item)return;                                    

                  if(this.bln_debugContainer){                    
                    obj_item.fn_debug("console container show item");
                  }                    

                  obj_item.fn_enableAllFlex();
                  this.fn_setDisplayFlex(true);                                                      

                  if(this.bln_debugContainer){                    
                    obj_item.fn_debug("console container show item");
                  }                                      
                
                  let obj_menuButton=this.fn_getMenuButton();                                                 
                  let arr_item=obj_menuButton.obj_meta.arr_buttonConsole;
                  if (!arr_item.includes(obj_item)) {
                    arr_item.push(obj_item);
                    obj_menuButton.fn_displayMenuPanel(arr_item);        
                  }                                 
                }
                
                fn_coverItem(obj_item){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_coverItem");
                  }                    
                  
                  if(!obj_item)return;
                  obj_item.fn_setVisible(false);
                  this.fn_checkDisplayFlex();
                }

                fn_setDisabledItem(obj_item){  
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_setDisabledItem");
                  }                                    
                  
                  if(obj_item){                     
                    if(this.bln_debugContainer){                    
                      obj_item.fn_debug("console container fn_setDisabledItem true");
                    }                                                       

                    obj_item.fn_setDisabled();                                        
                  }                  
                  this.fn_checkDisplayFlex();
                }                
                
                fn_unLockAll(){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_unLockAll");
                  }                                                                         
                  this.fn_lockAll(false);
                }

                fn_lockAll(bln_value){
                  if(this.bln_debugContainer){                    
                    this.fn_debugName("fn_lockAll");
                  }

                  let arr_item, obj_item;
                  arr_item=this.obj_design.arr_item;
                  for(let i=0;i<arr_item.length;i++){                    
                    obj_item=arr_item[i];                    
                    obj_item.fn_setDisabled(bln_value);                    
                  }
                  this.fn_checkDisplayFlex();
                }
              }//END CLS
              //END TAG
              //END component/xapp_console_container