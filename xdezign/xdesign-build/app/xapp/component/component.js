
            //XSTART component/xapp
              class xapp extends xapp_ajax{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                          
                  
                  this.obj_design.int_radioDisplayMode=3;//Menu function Option
                  this.fn_setRadioDisplayMode();                                  
                  this.obj_design.bln_allowDelete=false;
                  this.obj_design.bln_autoFetch=false;

                  this.obj_holder.bln_debugServer=false;

                  
                  this.MetaDataViewId=101426;//meta_data
                  this.MetaDataViewName="meta_data";
          
                  this.MetaUserViewId=1;//meta_user
                  this.MetaUserViewName="meta_user";
          
                  this.MetaLinkViewId=100475;//meta_link
                  this.MetaLinkViewName="meta_link"; 

                  this.obj_themeOptions={
                    

                  };
                  
                  
                  //obj_path.fn_explainNavigateRecordURL();                  
                }           
                fn_getAllowDelete(){
                  return this.obj_design.bln_allowDelete;
                }
                fn_endAuthorize(){                        
                  obj_path.fn_navigateSubdomain("lock");
                }
                
                fn_setRadioDisplayMode(){                  
                  this.bln_togglePeersPin=false;
                  this.bln_closePeersPin=false;
                  this.bln_autoPin=false;
          
                  switch(this.obj_design.int_radioDisplayMode){                              
                    case 1:                                  
                    break;
                    case 2:            
                      this.bln_togglePeersPin=true;
                    break;
                    case 3:                     
                      this.bln_togglePeersPin=true;                       
                      this.bln_closePeersPin=true;
                    break;
                    case 10:
                      this.bln_autoPin=true;                
                    break;
                    default:            
                    break;
                  }       
                }     
                fn_setAccordionChildMenu(){        
                  let obj_container;                  
                  obj_container=this.fn_getComponent("xapp_dynamic_content");
                  if(!obj_container){
                    console.log("ERROR A: XAPP fn_setAccordionChildMenu component not found xapp_dynamic_content");
                    return;
                  }             
                  this.obj_holder.obj_accordionChildMenu=obj_container.fn_addContextItemOnce("xapp_accordion");
                  if(!this.obj_holder.obj_accordionChildMenu){
                              console.log("ERROR B: XAPP fn_setAccordionChildMenu context item not found xapp_accordion");
                  }
                  
                }            
                fn_getAccordionChildMenu(){        
                  return this.obj_holder.obj_accordionChildMenu;
                }
                fn_onAuthorizeUserStatus(){//logged in 
              
                  if(this.fn_hasContextHolderParent()){return;}                                  
                  
                  this.fn_setAccordionChildMenu();                      
                  
                  let obj_container=this.fn_getAccordionChildMenu();                              
                  
                  if(!obj_container){
                    console.log("ERROR C: fn_onAuthorizeUserStatus AccordionChildMenu is false");
                    return;
                  }                
                  
                  let obj_item=obj_container.fn_addContextItem("xapp_menu");                                  
                  if(obj_item){          
                    obj_item.obj_menuProject=this;
                    obj_item.bln_isAppRoot=true;
                    this.obj_menuButton=obj_item;
                    obj_item.fn_setText("APP ROOT");                          


                    //initial menu can be selected, either menuname or subdomain                    
                    let str_subdomain=this.obj_design.str_releaseLabel;                    
                    if(str_subdomain==="notset" ||!str_subdomain){
                      str_subdomain=this.obj_design.str_nameShort;                      
                    }
                
                    obj_item.fn_setSubdomain(str_subdomain);                                                            
                    this.fn_displayMenu(obj_item);//Set to True to display as the first menu, and to debug the first menu
                  } 
                  else{
                    console.log("ERROR: Unable to locate Context Item menu");
                  }   
                }      
                fn_displayMenu(obj_item){                  
                  
                  let bln_debug=obj_path.fn_hasQueryStringValue(window.location.search, "mode", "debug");                                    
                  obj_item.fn_setDisplay(bln_debug);    
                  obj_item.fn_setDebugPin(bln_debug);                
                  obj_item.fn_configureOptionChildMenu();                                                    
                  obj_item.fn_open();          
                } 
                
                fn_getStandardMenuByName(str_name){
                  
                  return this.obj_menuButton.fn_getMenuByName(str_name);
                }    

                
          
                
              }//END CLS
              //END TAG
              //END component/xapp