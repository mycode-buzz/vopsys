
            //XSTART component/xapp_menu_operation
              class xapp_menu_operation extends xapp_component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){                

                  super.fn_initialize(obj_ini);
                  
                  
                  //START INITIALIZE DESIGN        
                  if(this.fn_getIsOpen()===undefined){this.fn_setIsOpen(false);}//ensure visible place holder at front of object defintion        
                  if(this.obj_design.str_text===undefined){this.obj_design.str_text=this.obj_design.str_name;}                              
                  //END INITIALIZE DESIGN     
                  
                  //START INITIALIZE DOM
                  //END INITIALIZE DOM

                  this.fn_resetArrayStandardMenu();                  
              
                  if(this.fn_getAutoPin()){
                      this.obj_design.bln_isPinned=true;
                  };
              
                  
                  this.obj_holder.bln_referencedObject=false;                  
                  this.obj_holder.bln_displayedConsole=false;
              
                  this.obj_holder.bln_listenClick=true;
                  
                  
              } 
              //BASIC OPS                       
              fn_initializeDynamic(){
              //this.fn_setType("menu_button");      
              this.fn_setTag("button", true);                      
              this.fn_setThemeType("menu_button");                      
              }

              fn_setDisplay(bln_value=true){                          
                super.fn_setDisplay(bln_value);       
                if(bln_value){                  
                  this.dom_objContent.style.display="block"; 
                }                 
            }    

              fn_disableConsole(){                
                this.obj_menuPanel.fn_disableConsole();
              }
              fn_hideConsole(){                
                console.log("xapp_menu_operation fn_hideConsole")
                this.obj_menuPanel.fn_hideConsole();
              }


              fn_setDomContainer(){

                let dom_obj;
                dom_obj=document.createElement("div");        
                this.dom_obj.parentNode.insertBefore(dom_obj, this.dom_obj.nextSibling);                
                dom_obj.style.display="none";
                this.dom_objContentContainer=dom_obj;            
            
                dom_obj=document.createElement("div");                  
                dom_obj.style.display="block";        
                dom_obj.style.flexWrap=this.obj_domStyle.flexWrap;        
                dom_obj.style.padding="0px";                        
                dom_obj.style.marginBottom="0px";                        
                dom_obj.style.marginRight="0px";                        
                dom_obj.style.width="100%";                  
                dom_obj.innerHTML=this.obj_design.str_content;                                    
                this.dom_objContentContainer.appendChild(dom_obj);     
                this.dom_objContent=dom_obj;
              }
              
              xfn_createSelf(){
              
                  super.fn_createSelf();
                  
                  this.fn_setDomContainer();
                
              }   
              
              fn_setHTMLContent(){
                  super.fn_setHTMLContent();    
                  this.fn_setText(this.obj_design.str_text);                
              } 
              
              fn_addItem(obj_ini){
                  let obj_item;        
                  if(obj_ini.obj_design.str_type===undefined){
                      obj_ini.obj_design.str_type="button";                   
                  }                
                  obj_item=super.fn_addItem(obj_ini);//CallSuper
                  
                  return obj_item;
              }                 
              
              
              fn_referenceObject(){
                  if(this.obj_holder.bln_referencedObject){return;}
                  this.obj_holder.bln_referencedObject=true;        
                  this.fn_setMenuPanel();        
                  
              }
              fn_configureObject(){}
              fn_displayObject(){}


              //CLICK / OPEN / CLOSE
              fn_onClick(e){                  

                //this.fn_debug();

                obj_project.fn_forgetEvent(e);    
                //foregetevent                
                
                //this.fn_debugText("click");
                this.fn_toggle();
                
            }    

            fn_toggleHidden(){
              let bln_value=this.fn_getHiddenPin();
              let bln_toggle=obj_shared.fn_flipBool(bln_value);
              this.fn_setHiddenPin(bln_toggle);                              
            }
            
              fn_toggle(){   
                
                //this.fn_debugText("fn_toggle");
              
                if(this.fn_hasContextHolderParent()){return;}                     

                let bln_isOpen=this.fn_getIsOpen();
                if(bln_isOpen){                                
                    this.fn_close();                    
                }
                else{                                                    
                  this.fn_open();                  
                } 
                
                
            }                

              fn_open(){                 
                  
                if(this.fn_getIsOpen()){return;}
                
                if(this.fn_getAutoPin()){this.obj_design.bln_isPinned=true;}                
                this.fn_referenceObject();
                this.fn_startReflow();
                


                //*
                let bln_autoFetch=this.fn_getAutoFetch();              
                let bln_queryListMode=this.fn_getQueryListMode();
                if(bln_autoFetch || bln_queryListMode){                
                  this.fn_clearContent();                  
                }              
                //*/


                this.fn_onOpen();
                this.fn_openContent();



                let bln_togglePeers=this.fn_getTogglePeersPin();              
                let bln_closePeers=this.fn_getClosePeersPin();                
                if(this.bln_topLevelMenu){                
                  if(bln_togglePeers){this.fn_closePeers();}//close dont hide on top level
                }
                else{
                  if(bln_closePeers){this.fn_closePeers();}
                  if(bln_togglePeers){this.fn_displayOffPeers();}
                }   
                
                
                if(this.obj_parentMenu){
                  this.obj_parentMenu.bln_childrenOpen=true;
                }
                
              }

              fn_getElementDistanceToTop(element) {
                const rect = element.getBoundingClientRect();
                const distanceToTop = window.pageYOffset + rect.top;
                return distanceToTop;
            }
              
              fn_close(){        

                if(this.obj_parentMenu){
                  this.obj_parentMenu.bln_childrenOpen=false;
                }                                                
                //this.fn_debugText("fn_close");                
              
                  if(!this.fn_getIsOpen()){return;}
                  
                  this.fn_closeChildren();

                  if(this.fn_getLockOpenPin()){                    
                    return;
                  }

                  if(this.fn_getSettingOperationPin()){
                    let str_metaRowzName=this.fn_getMetaRowzName();
                    if(str_metaRowzName==="Settings"){
                      this.fn_setHiddenPin(true);                
                    }                    
                  }               
                  
                  
                  this.fn_onClose();
                  this.fn_closeContent();                          

                  let bln_togglePeers=this.fn_getTogglePeersPin();                                
                  if(bln_togglePeers){this.fn_displayOnPeers();}                  
              } 
              xfn_closeChildren(){

                //this.fn_debugText("fn_closeChildren");
                  
                let arr=this.obj_design.arr_item;
                for(let i=0;i<arr.length;i++){
                    let obj_item=arr[i];                                    
                    let str_method="fn_close";                            
                    if(obj_item && obj_item[str_method]){                                      
                        obj_item[str_method]();
                    }                  
                }
            }

            fn_closeChildren(){

              //this.fn_debugText("fn_closeChildren");
                
              /*
              let obj_accordion=this.fn_getAccordionChildMenu();
              obj_accordion.fn_close();              
              //*/
              
              //*
              this.fn_closeChildMenus();
              //*/
              
          }

          fn_closeChildMenus(){
            this.fn_closeChildMenu(this.obj_holder.arr_standardMenu);
            this.fn_closeChildMenu(this.obj_holder.arr_dynamicMenu);
          }

          fn_closeChildMenu(arr){
            
              for(let i=0;i<arr.length;i++){
                  let obj_item=arr[i];                                    
                  let str_method="fn_close";                            
                  if(obj_item && obj_item[str_method]){                                    
                      obj_item[str_method]();
                  }                  
              }
        } 
            
              fn_onOpen(){              
              }
              fn_onClose(){                      
                  
                  if(this.bln_rebound){this.fn_open();}
                  //this.fn_debugText("fn_onClose");
              } 
              fn_clearContent(){
                let obj_accordion=this.fn_getAccordionChildMenu();
                if(obj_accordion){obj_accordion.fn_removeChildren();}
                obj_accordion=this.fn_getAccordionView();
                if(obj_accordion){obj_accordion.fn_removeChildren();}
              }             
              
              fn_openContent(){          
              
                //this.fn_debugText("fn_openContent");
                  if(this.obj_domProperty.disabled){            
                      return;
                  }
                  
                  this.dom_objContentContainer.style.display="block";                  
                  this.fn_setIsOpen(true);                  
              
                  
                  if(this.fn_getRolodexPin()){
                      this.fn_closeChildren();
                  }
                  
              }
              fn_closeContent(){
                //this.fn_debugText("fn_closeContent");                
                  this.dom_objContentContainer.style.display="none";                  
                  this.fn_setIsOpen(false);                            
              }        
              
              
              //BASIC OPS 
              
              //MENU OPS 
              
              fn_getArchivePin(){
                return this.obj_meta.bln_archivePin;
              }   
              fn_setArchivePin(bln_value){
                this.obj_meta.bln_archivePin=bln_value;      
              }   
              fn_getLockOpenPin(){
                return this.obj_meta.bln_lockOpenPin;
              }   
              fn_setLockOpenPin(bln_value){
                this.obj_meta.bln_lockOpenPin=bln_value;      
              }   
              
              fn_getRolodexPin(){        
                  if(!this.obj_menuProject){return false};
                  return this.obj_menuProject.bln_rolodexPin;
              }
              /*
              fn_getRolodexPin(){                
                  return this.obj_meta.bln_rolodexPin;
              }
              //*/    
              fn_getTogglePeersPin(){
                  
                  if(!this.obj_menuProject){return false};            
                  return this.obj_menuProject.bln_togglePeersPin;
              }  
              
              fn_getClosePeersPin(){
                  
                  if(!this.obj_menuProject){return false};            
                  return this.obj_menuProject.bln_closePeersPin;
              }  
              
              fn_getAutoPin(){        
                  if(!this.obj_menuProject){return false};
                  return this.obj_menuProject.bln_autoPin;
              }    
              fn_setMenuPanel(bln_value){        
                  if(this.obj_menuPanel){return;}                        
                  this.obj_menuPanel=this.fn_addContextItem("xapp_menu_panel");
                }  
                
                
                fn_displayMenuPanel(bln_value){                
                  if(!this.obj_menuPanel){return;}                        
                  this.obj_menuPanel.fn_setDisplayFlex(bln_value);
                  this.obj_menuPanel.fn_setVisible(bln_value);                  
                }  

                fn_interfaceHide(){
                  //console.log("fn_interfaceHide");
                  this.fn_hide();
                }
                fn_interfaceShow(){                  
                  this.fn_show();
                }

                fn_displayOn(){                         
                  let bln_value=this.fn_getHiddenPin();
                  if(bln_value){return;}
                  super.fn_displayOn();                    
              }     
                fn_displayOff(){
                  let bln_value=this.fn_getHiddenPin();
                  if(bln_value){return;}                  
                  super.fn_displayOff();                    
                }     
              
                fn_hide(){
                  super.fn_hide();
                  this.fn_displayCover(true);
                }
                fn_show(){
                  super.fn_show();    
                  this.fn_displayCover(false);  
                }
                
                fn_startReflow(){                
                  this.fn_displayCover(true);    
                  this.fn_hidePeersVertical();         
                }     
                
                fn_endReflow(){
                  if(this.fn_getRolodexPin() && this.obj_parentMenu){this.obj_parentMenu.obj_menuPanel.fn_setDisplayFlex(false);} 
                  this.fn_showPeersVertical();                  
                  this.fn_displayCover(false);    
                }           
                fn_displayCover(bln_value){        
                  let str_value="visible";                
                  if(bln_value){str_value="hidden";}
                  if(this.obj_menuPanel){this.obj_menuPanel.fn_setVisible(str_value);}                  
                  if(this.obj_accordionChildMenu){
                    
                    if(this.fn_getLimitEndMenuChain()){                      
                      this.obj_accordionChildMenu.fn_setDisplay(false);                    
                      let obj_parent=this.obj_accordionChildMenu.fn_getParentComponent();                      
                      obj_parent.fn_addContextItemOnce("form_hardrule");                                                    
                    }                    
                    else{
                      this.obj_accordionChildMenu.fn_setVisible(str_value);                    
                    }
                    
                  }

                  
                }
              
                fn_methodPeersVertical(str_method, obj_exclude, bln_ignoreBefore){                
              
                  this.fn_methodPeers(str_method, obj_exclude, bln_ignoreBefore);
                  let obj_parent=this.obj_parentMenu;        
                  if(obj_parent){
                      obj_parent.fn_methodPeersVertical(str_method, obj_parent, bln_ignoreBefore);
                  }                
              }              
              
              fn_methodPeers(str_method, obj_exclude, bln_ignoreBefore){                
                
              let obj_accordion=this.fn_getParentComponent();                                                 
              if(obj_accordion && obj_accordion[str_method]){
                  obj_accordion[str_method](obj_exclude, bln_ignoreBefore);
              }                    
              }                                   
              fn_closePeersVertical(){                
                  
                  this.fn_closePeers();                
                  if(this.obj_parentMenu){
                    this.obj_parentMenu.fn_closePeersVertical();
                  }                                                
              }
              fn_closePeers(){                
                  
                  this.fn_methodPeers("fn_closeLevel", this, false); 
                  
                  if(this.obj_parentMenu){
                    this.obj_parentMenu.bln_childrenOpen=false;
                  }                                                
              }
              fn_hidePeersVertical(){                
                  this.fn_hidePeers();                
                  if(this.obj_parentMenu){this.obj_parentMenu.fn_hidePeersVertical();}                                                
              }
              fn_hidePeers(){                
                  this.fn_methodPeers("fn_hideLevel", this, true); 
              }
              
              fn_showPeersVertical(){                
                  this.fn_showPeers();                
                  if(this.obj_parentMenu){this.obj_parentMenu.fn_showPeersVertical();}                                                
              }
              fn_showPeers(){                
                  this.fn_methodPeers("fn_showLevel", this, true);                 
              }     
              fn_displayOnPeers(){
                  this.fn_methodPeers("fn_displayOnLevel", this, false);                 
              }         
              fn_displayOffPeers(){
                  this.fn_methodPeers("fn_displayOffLevel", this, false);                 
              }         
                //MENU OPS
                  fn_onStateChange(){}

                  fn_showAccordion(bln_value){
                    let obj_item=this.fn_getAccordionView();    
                    if(obj_item){
                      this.obj_meta.bln_displayAccordionView=bln_value;
                      obj_item.fn_setDisplay(bln_value);
                    }
                  }              

                  //CHILDMENU OPS                  
                fn_setAccordionChildMenu(){
                    if(this.obj_accordionChildMenu){return;}            
                    let obj_container=this.fn_addContextItem("xapp_accordion");
                    if(!obj_container){
                        console.log("ERROR: xapp_menu_operation fn_setAccordionChildMenu contexrt item not found xapp_accordion");
                        return;
                    }             
                    this.obj_accordionChildMenu=obj_container;                      
                  }
                  fn_getAccordionChildMenu(){      
                    return this.obj_accordionChildMenu;
                  }   
                  
                  //Menu Command Func
                  fn_countMenu(){                        
                    let arr_item=this.fn_getArrayStandardMenu();
                    for(let i=0;i<arr_item.length;i++){      
                      let obj_item=arr_item[i];                      
                      obj_item.fn_close();
                      obj_item.fn_clearButtonCount();          
                      obj_item.fn_runCount();          
                      //obj_item.fn_open();          
                      //obj_item.fn_close();          
                      
                    }
                  }
                  fn_hideMenu(obj_exclude){
                    this.fn_hideStandardMenu(obj_exclude);              
                  }
                  fn_closeMenu(obj_exclude){    
                    this.fn_closeStandardMenu(obj_exclude)
                  }
                  fn_menuCloseAndDisable(obj_exclude){
                    this.fn_standardMenuCloseAndDisable(obj_exclude);
                  }
                  fn_notifyMenu(str_nameFunction, obj_arg=false){
                    this.fn_notifyStandardMenu(str_nameFunction, obj_arg);                    
                  }                                    
                  //Menu Command Func

                  fn_notifyStandardMenu(str_nameFunction, obj_arg=false){                  
                    let arr_item=this.fn_getArrayStandardMenu();
                    for(let i=0;i<arr_item.length;i++){      
                      let obj_item=arr_item[i];
                      this.fn_notify(obj_item, str_nameFunction, obj_arg);                                  
                    }
                  }                              
                  
                  
                    fn_hideStandardMenu(obj_exclude){                          
                      let arr_item=this.fn_getArrayStandardMenu();
                      for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                            if(obj_item!==obj_exclude){
                                obj_item.fn_close();
                                obj_item.fn_setDisplay(false);           
                            }
                        }
                    }                   
                    
                    
                    fn_closeStandardMenu(obj_exclude){                                                
                      let arr_item=this.fn_getArrayStandardMenu();
                      for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                            if(obj_item!==obj_exclude){
                                obj_item.fn_close();                                 
                                obj_item.fn_clearButtonCount();
                            }
                        }
                    }
                    
                    fn_standardMenuCloseAndDisable(obj_exclude){                          
                      let arr_item=this.fn_getArrayStandardMenu();
                      for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                            if(obj_item!==obj_exclude){
                                obj_item.fn_close();          
                                obj_item.fn_setDisabled();                                                  
                            }
                            obj_item.fn_standardMenuCloseAndDisable(obj_exclude);
                        }
                    }                                      
                  

                  fn_resetArrayStandardMenu(){                    
                    this.obj_holder.arr_standardMenu=[];                                  
                  }
                  fn_resetArrayDynamicMenu(){                    
                    this.obj_holder.arr_dynamicMenu=[];                                  
                  }
                  
                  fn_addToArrayStandardMenu(obj_item){                    
                    this.obj_holder.arr_standardMenu.push(obj_item);                    
                    this.fn_setMenuParent(obj_item);                    
                    //obj_item.fn_debug();                    
                  }
                  fn_getArrayStandardMenu(){
                    return this.obj_holder.arr_standardMenu;
                  }                          
                  
                  fn_getOnlyStandardMenu(){
                    let arr_item=this.fn_getArrayStandardMenu();                                        
                    //this.fn_debugArrayStandardMenu();                    
                    if(arr_item.length===1){
                      return arr_item[0];
                    }   
                    return false;
                  }                     

                  fn_debugArrayStandardMenu(obj_exclude){    
                    let arr_item=this.fn_getArrayStandardMenu();
                    //this.fn_debugText("arr_standard item.length: " + arr_item.length);
                    //console.log(arr_item);                    
                    /*
                    for(let i=0;i<arr_item.length;i++){      
                        let obj_item=arr_item[i];
                        //obj_item.fn_debug();
                    }
                    //*/
                  }
                  fn_getStandardMenuByName(str_name){                  
                    
                    if(this.obj_design.str_name===str_name){
                      return this;
                    }                                       
                    let arr_item=this.fn_getArrayStandardMenu();                      
                    for(let i=0;i<arr_item.length;i++){      
                        let obj_menuButton=arr_item[i];                                                  
                        return obj_menuButton.fn_getStandardMenuByName(str_name);
                    }
                  }    
                  
                  
                
              
                //CHILDMENU OPS
              
              }//END CLS
              //END TAG
              //END component/xapp_menu_operation