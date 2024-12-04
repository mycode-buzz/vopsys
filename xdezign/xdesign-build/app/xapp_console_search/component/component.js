
            //XSTART component/xapp_console_search
            class xapp_console_search extends form_inputandbutton{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                                                    
              }                              

              fn_onLoad(){            
                super.fn_onLoad();      
                if(this.fn_hasContextHolderParent()){return;}                           
                if(this.fn_getDebugPin()){this.fn_highlightBorder("pink");}                                  
      
                let obj_parent=this.fn_getParentComponent();                  
                if(!obj_parent){
                  //eg in design mode
                  return;
                }
                obj_parent=obj_parent.fn_getParentComponent();                
                this.obj_parentContainer=obj_parent;

                
                this.fn_resetReportInterface();

                //this.fn_debug();
      
              }

              fn_getMenuButton(){
                
                let obj_menuPanel=this.fn_getMenuPanel();
                if(!obj_menuPanel){return;}
                let obj_menuButton=obj_menuPanel.obj_parentMenu;                  
                if(!obj_menuButton){
                  console.log("obj_menuButton is not an object");
                  return;
                }
                return obj_menuButton;
              }
              fn_getMenuPanel(){
                      
                let obj_menuPanel=this.fn_getItemGoNorth("xapp_menu_panel");                  
                if(!obj_menuPanel){
                  console.log("obj_menuPanel is not an object");
                  return;
                }
                return obj_menuPanel;                  
              }  
      
              

              fn_onLinkButtonClick(e){//fires when form is submitted - clicked

                
                //GET SEARCH INPUT VALUE
                let str_value=super.fn_onLinkButtonClick();                
                //GET SEARCH INPUT VALUE
                //alert("str_value:" + str_value)
                let obj_menuButton=this.fn_getMenuButton();                                    
                if(obj_menuButton.bln_simpleSearch){
                  obj_menuButton.fn_setQuerySearch(str_value);                   
                  return;
                }

                if(!str_value){                  
                  this.fn_toggleReportInterface();
                  return false;
                }
                
                /*
                if (e.detail === 2) {                
                  return false;
                }
                //*/

                this.fn_addQueryTermToList(str_value);                

                this.fn_showReportInterface();                
              }
              fn_onLinkInputMouseDown(){}
              fn_onLinkInputKeyDown(){}                

              fn_getInterfaceBlock(){
                let obj_container=this.obj_parentContainer;                  
                //return obj_container;
                
                if(!obj_container.obj_console){
                  obj_container.obj_console=obj_container.fn_addContextItem("xapp_console");                  
                }                            
                return obj_container.obj_console.obj_blockStart;
              }

              fn_toggleReportInterface(){

                this.fn_getTabset();    
                this.obj_tabset.fn_toggleInterface();                
                
              }
              
              fn_resetReportInterface(){                                    
                this.fn_resetInput();                
                this.fn_notifyItem("form_button_search", "fn_setDisplay", true);                                  
              }                                         
              
              fn_getTabset(){

                
                if(this.obj_tabset)return;

                let obj_container=this.fn_getInterfaceBlock();                    
                let obj_tabset=obj_container.fn_getComponent("form_tabset");                
                if(!obj_tabset){                                                                                   
                  obj_tabset=obj_container.fn_addContextItem("form_tabset");                    
                  obj_tabset.obj_parentInterface=this;                                                      
                  obj_tabset.bln_tabLegend=true;
                }
                this.obj_tabset=obj_tabset;                
              }

              fn_hideReportInterface(){
                console.log("fn_hideReportInterface");

                this.fn_getTabset();    
                this.obj_tabset.fn_hideInterface();
              } 
              fn_showReportInterface(){
                //console.log("fn_showReportInterface");

                this.fn_getTabset();    
                this.obj_tabset.fn_showInterface();
              } 
              
              
              fn_addReportInterface(obj_param){

                this.fn_getTabset();    
                
                //*
                let obj_panel=this.obj_tabset.fn_getTabPanel(obj_param);                
                obj_panel.obj_parentInterface=this;                                                    
                return obj_panel;
                //*/
              }    
              


              fn_removeReportInterface(str_interface){                  

                console.log("fn_removeReportInterface");;

                let obj_interface=this.obj_tabset.fn_getComponent(str_interface);                
                
                let obj_container;
                
                obj_container=this.fn_getInterfaceBlock();
                
                
                if(obj_container){
                  obj_container.fn_removeItem(obj_interface);
                }


                //let obj_menuButton=this.fn_getMenuButton();                  
                //obj_menuButton.fn_resetQueryList();                
              }                






              
              fn_getReportFieldCriteriaParam(){
                let obj_param={}
                obj_param.str_name="Report Criteria";
                obj_param.str_type="xapp_report_interface_fieldcriteria";               
                return obj_param;
              }              
              fn_addReportInterfaceFieldCriteria(){                  
                let obj_param=this.fn_getReportFieldCriteriaParam();
                return this.fn_addReportInterface(obj_param);
              }              

              fn_getReportFieldListParam(){
                let obj_param={}
                obj_param.str_name="Report Fields";
                obj_param.str_type="xapp_report_interface_fieldlist";               
                return obj_param;
              }              
              fn_addReportInterfaceFieldList(){                  
                let obj_param=this.fn_getReportFieldListParam();
                return this.fn_addReportInterface(obj_param);
              }              




              fn_getQueryTermParam(){
                let obj_param={}
                obj_param.str_name="Tag List";
                obj_param.str_type="xapp_queryterm_interface";               
                return obj_param;
              }              
              fn_addQueryTermInterface(){
                  
                let obj_param=this.fn_getQueryTermParam();
                return this.fn_addReportInterface(obj_param);

              }              
              fn_removeQueryTermInterface(){

                console.log("fn_removeQueryTermInterface");
                let obj_param=this.fn_getQueryTermParam();
                return this.fn_removeReportInterface(obj_param);
              }             


              fn_addQueryTermToList(str_value){                                  
                
                this.fn_addQueryTerm(str_value, true);                
                let obj_menuButton=this.fn_getMenuButton();                                  
                obj_menuButton.fn_addQueryTermToList(str_value);             
                //console.log("QueryList: " + obj_menuButton.fn_getQueryList());                
              }                                       

              fn_addQueryTerm(str_queryTerm, bln_startPosition=false){               

                if(!str_queryTerm){return;}
                
                this.fn_resetInput();                
                
                let obj_interface=this.fn_addQueryTermInterface()
                return obj_interface.fn_addQueryTerm(str_queryTerm, bln_startPosition);                
              }

              fn_queryTermButtonOnMouseDown(obj_button, e){                               


                this.timerQueryTerm= setTimeout(function () {                    
                    this.fn_removeQueryTermDisabled(obj_button);
                    this.fn_removeQueryTerm(obj_button);                
                    let obj_menuButton=this.fn_getMenuButton();                                                        
                    obj_menuButton.fn_runSearch();
                }.bind(this), 1000);
              }
              
              fn_queryTermButtonOnMouseUp(obj_button, e){
                
                window.clearTimeout(this.timerQueryTerm);
              }

              fn_queryTermButtonOnClick(obj_button, e){                
                
                /*
                if (e.detail === 2) {
                  return;
                }
                //*/
                
                
                if(obj_button.bln_enabled){
                  this.fn_disableQueryTerm(obj_button);
                }
                else{
                  this.fn_enableQueryTerm(obj_button);
                }
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                obj_menuButton.fn_runSearch();
              }

              
              fn_queryTermButtonOnDblClick(obj_button, e){                                               
                
              }
              
              fn_enableQueryTerm(obj_button){
                
                let obj_interface=this.fn_addQueryTermInterface();                  
                obj_interface.fn_enableQueryTerm(obj_button);                
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();
                obj_menuButton.fn_addQueryTermToList(str_value);                                       
              }


              fn_disableQueryTerm(obj_button){
              
                let obj_interface=this.fn_addQueryTermInterface();                  
                obj_interface.fn_disableQueryTerm(obj_button);
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();
                obj_menuButton.fn_addQueryTermToListDisabled(str_value);                        
              }

              fn_removeQueryTerm(obj_button){                                
                
                let obj_interface=this.fn_addQueryTermInterface();                  
                obj_interface.fn_removeQueryTerm(obj_button);                                   
                if(!obj_interface.fn_getCountQueryTerm()){                    
                  console.log("obj_interface.fn_getCountQueryTerm fn_removeQueryTermInterface");
                  this.fn_removeQueryTermInterface();                  
                }     
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();                
                obj_menuButton.fn_removeQueryTermFromList(str_value);                                                       
              }
              fn_removeQueryTermDisabled(obj_button){                                                               
                
                let obj_menuButton=this.fn_getMenuButton();                                    
                let str_value=obj_button.fn_getText();
                obj_menuButton.fn_removeQueryTermFromListDisabled(str_value);                                                                      
              }              
              
              

              
            }//END CLS
            //END TAG
            //END component/xapp_console_search              