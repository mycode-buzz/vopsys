
            //XSTART component/xapp_menuform
            class xapp_menuform extends xapp_menu{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){                
    
                super.fn_initialize(obj_ini);

                this.obj_meta.bln_debugMenu=false;           

                
                this.str_defaultTypeMenu="xapp_menuform";                  
                this.str_defaultTypeData="xapp_dataform_view";                  
                this.str_defaultTypeDataChildMenu="xapp_dataform_childmenu";
                

                this.fn_initialize_var();                
              } 
              

              fn_initialize_var(){
                super.fn_initialize_var();
                this.fn_resetArrayDynamicMenu();

                this.int_totalRowCount=0;
              }

              fn_applyThemeStructure(){                    
                if(!obj_project.obj_theme){return;}
                this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_rowzChild;                
                this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
              }
              
              fn_setMenuPanel(){     
                super.fn_setMenuPanel();                  

                if(this.obj_menuPanel){                  

                  this.obj_consoleContainerRecord=this.obj_menuPanel.fn_addConsoleContainer("console_container_record", true);                                                        
                  this.obj_button_new_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_new_record");                  
                  this.obj_button_filteroff_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_filteroff_record");
                  this.obj_button_filteron_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_filteron_record");
                  this.obj_button_navigate_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_navigate_record");
                  this.obj_button_linkon_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_linkon_record");
                  this.obj_button_linkoff_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_linkoff_record");
                  
                  this.obj_button_complete_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_complete_record");                    

                  this.obj_button_archive_record=this.obj_consoleContainerRecord.fn_getComponent("xapp_button_archive_record");
                  if(this.obj_columnArchiveDate){                                        
                    if(this.obj_columnArchiveDate.str_value){
                      this.obj_button_archive_record.fn_setText("Restore Record");

                    }
                  }
                  
                }
              }              

              fn_runSearch(){

                this.bln_runSearch=true;
                
                if(this.bln_modeNewRecord){                                
                    this.fn_formRefreshRecord(); 
                    return;

                }                 
                
                
                this.fn_formViewRecord();             
                
                
              }
              fn_formRefreshRecord(obj_menuButton){           
            
                if(!obj_menuButton){
                  obj_menuButton=this;    
                  if(this.bln_dynamicMenu){                            
                    obj_menuButton=this.obj_parentMenu;      
                  }    
                }
                obj_menuButton.fn_exitNewRecord();                  
                obj_menuButton.fn_formViewRecord();
              }

              fn_exitNewRecord(){                                  
                this.bln_modeNewRecord=false;                   
                if(this.obj_dataView){                            
                  this.obj_dataView.fn_setQueryModeNewRecord(false);      
                }    
                if(this.obj_parentMenu && this.obj_parentMenu["fn_exitNewRecord"]){
                  this.obj_parentMenu.fn_exitNewRecord();
                  //this.obj_parentMenu.fn_debugText("2 this.obj_parentMenu fn_exitNewRecord");
                  //this.fn_debugText("2 this fn_exitNewRecord");
                }
              }

              fn_formNavigateRecord(){
                //*
                const obj_navigate=this.fn_getNavigate();                
                obj_path.fn_navigateRecordURL(obj_navigate.str_urlMetaRowzName, obj_navigate.str_urlMetaRecordId);                
                //*/

                /*
                const obj_navigate=this.fn_getNavigate();                
                const str_urlBase="";
                const str_url=obj_path.fn_getNavigateRecordURL(obj_navigate.str_urlMetaRowzName, obj_navigate.str_urlMetaRecordId, str_urlBase);
                window.location.href=str_url;
                //*/
              }
              fn_onClose(){
                super.fn_onClose();    
                
                if(this.bln_flagReview){
                  let bln_removeSearch=true;
                  this.fn_removeConstraint(bln_removeSearch);
                }
                this.bln_flagReview=false;
              }
              fn_removeConstraint(bln_removeSearch=false){
                this.fn_setAutoJoinFilterPin(false);
                if(bln_removeSearch){
                  this.fn_setQueryList("");                      
                }    
                this.bln_flagRunOnce=false;    
            
              }
              fn_exitConstraint(){   
                this.fn_setConstraintKeyPin(false);        
              }
              fn_formArchiveRecord(){        
                this.fn_archiveRecord(true);        
              }                 
              fn_formDeleteRecord(){                  
                this.fn_archiveRecord(false);        
              }                 
              fn_archiveRecord(bln_recycle){      
        
                if(!this.obj_dataView){return;}    
                let obj_columnKey;
                //obj_columnKey=this.obj_columnKey;                
                obj_columnKey=this.obj_columnDataId
                if(!obj_columnKey.str_value){return;}//only 1 record with columnkey can be deleted. 
                
                this.obj_dataView.fn_archiveRecord(obj_columnKey, bln_recycle); 
              }
              fn_onArchiveRecord(){                            
                this.fn_formCompleteRecord(false);
              }
              fn_onDeleteDynamicRow(){                
            
                this.fn_displayObject(false);
                this.fn_configureObject(false);//can cause issues     
                this.fn_setDisplay(false);       
                //this.obj_parentMenu.fn_formRefreshRecord();
                this.fn_displayOnPeers();//keep for the momentr , but probably refresh is need for counts etc                  
              }

              fn_debugAutoJoin(str_message=""){    
                console.log("START " + str_message);
                console.log("this.obj_meta.bln_autoJoinPin: "+ this.obj_meta.bln_autoJoinPin);
                console.log("this.obj_meta.str_autoJoinToSource: "+ this.obj_meta.str_autoJoinToSource);
                
                console.log("this.bln_modeNewRecord: "+ this.bln_modeNewRecord);    
                console.log("this.obj_columnKey: "+ this.obj_columnKey);    
                console.log("this.bln_autoJoinFilterPin: "+ this.bln_autoJoinFilterPin);        
                if(this.obj_columnKey){
                  console.log("this.obj_columnKey.str_value: "+ this.obj_columnKey.str_value);    
                }        
                
                console.log("this.obj_parentMenu.obj_meta.bln_autoJoinPin: "+ this.obj_parentMenu.obj_meta.bln_autoJoinPin);
                console.log("this.obj_parentMenu.obj_meta.str_autoJoinToSource: "+ this.obj_parentMenu.obj_meta.str_autoJoinToSource);
                
                console.log("this.obj_parentMenu.bln_modeNewRecord: "+ this.obj_parentMenu.bln_modeNewRecord);    
                console.log("this.obj_parentMenu.obj_columnKey: "+ this.obj_parentMenu.obj_columnKey);    
                console.log("this.obj_parentMenu.bln_autoJoinFilterPin: "+ this.obj_parentMenu.bln_autoJoinFilterPin);    
                if(this.obj_parentMenu.obj_columnKey){
                  console.log("this.obj_parentMenu.obj_columnKey.str_value: "+ this.obj_parentMenu.obj_columnKey.str_value);    
                }
                   
                console.log("END " + str_message);
              }

              fn_formViewRecord(){  //called by crud menu operation data end child menu and search              
        
                //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
                //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
                //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
                //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"        
            
                if(this.bln_modeNewRecord){      
                  this.fn_formNewRecord();
                  return;
                }         
                
                super.fn_formViewRecord();                  
              }              

              

              fn_setButtonViewRecord(){                
        
                super.fn_setButtonViewRecord();                              

                let bln_settingOperationPin=this.fn_getSettingOperationPin();

                
                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_archive_record);                                      
                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_complete_record);                                      

                if(bln_settingOperationPin){                      
                  return;            
                }
                if(this.obj_parentMenu && this.obj_parentMenu.fn_getSettingOperationPin()){                      
                  return;            
                }

                

                let bln_showButtonComplete=true;
                if(this.bln_dynamicMenu){
                  bln_showButtonComplete=false;
                }
                if(bln_settingOperationPin){
                  bln_showButtonComplete=false;
                }
                if(bln_showButtonComplete){                  
                    this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);                                                                            
                }
            
                //*
                //this.fn_classifyLevel();                           
                if(this.bln_isJoinedChildMenu){                                    
                  if(this.fn_getAllowAutoJoinPin()){  
                    this.fn_setButtonChildFilterDisplay();                                  
                    if(this.obj_meta.bln_joinTypeMany){                                              
                      this.obj_consoleContainerRecord.fn_showItem(this.obj_button_navigate_record);                                            
                      //this.fn_setLimitEndMenuChain(true);
                      
                    }                    
                  }
                }  
                  //*/                    
                
                
                //this.fn_debugText("this.bln_hasChildForm: " + this.bln_hasChildForm);
                if(this.bln_hasChildForm){                                    
                  //this.fn_debugText("this.obj_meta.int_idParentMetaRowz: " + this.obj_meta.int_idParentMetaRowz);
                  let bln_value=this.fn_hasTopLevelRowzParent(this.obj_meta.int_idParentMetaRowz);
                  //this.fn_debugText("xxx bln_value: " + bln_value);                  
                  if(bln_value){//show view button if there is a dynamic menu above to the                  
                    this.bln_applyAnchor=true;                    
                    this.str_urlNavigateURL=this.fn_getNavigateURL()                    
                    this.obj_button_navigate_record.fn_setNavigationURL(this.str_urlNavigateURL);
                    this.fn_setNavigationURL(this.str_urlNavigateURL);
                    //this.obj_consoleContainerRecord.fn_showItem(this.obj_button_navigate_record);
                  }
                  

                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_archive_record);                  
                  
                  if(this.bln_multiRecordDisplay){  //All Record "Report View"                                              
                    if(this.bln_recordConsole){                                  
                      this.obj_consoleContainerRecord.fn_showItem(this.obj_button_new_record);
                      this.obj_consoleContainerSearch.fn_showItem(this.obj_console_search);
                    }        
                  }
                  
                }
                else if(this.bln_isParentMenuWithView){                    
                  this.fn_setButtonParentFilterDisplay();        
                  if(this.bln_recordConsole){                              
                    this.obj_consoleContainerRecord.fn_showItem(this.obj_button_new_record);                      
                    //this.obj_consoleContainerSearch.fn_showItem(this.obj_console_search);
                  }     
                } 
                if(this.bln_isJoinedChildMenu){                  
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_archive_record);                                      
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_complete_record);                                      
                }
              }

              fn_setButtonChildFilterDisplay(bln_hideItem=false){
                if(this.obj_parentMenu.bln_autoJoinFilterPin){//any records displayed must therefore be linked                                
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_linkoff_record);                                            
                }
                else{        
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_linkon_record);//any records displayed may or may not  be linked
                  //run ajax view to see if contact is linked or not.      
                }     
                this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);                
              }

              fn_setButtonParentFilterDisplay(bln_hideItem=false){
            
            
                //start get Status CanBeFiltered
                let bln_value=false;                  
                if(this.obj_parentMenu.obj_columnKey && this.obj_parentMenu.obj_columnKey.str_value){bln_value=true;}                  
                //end get Status CanBeFiltered   
            
                if(!bln_value){return;}
                //*
                if(bln_hideItem){
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteron_record);            
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteroff_record);            
                  return;
                }
                //*/
                if(!this.fn_getAllowAutoJoinPin()){return false;}                                
                if(this.fn_getAutoJoinFilterPin()){                    
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteron_record);            
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_filteroff_record);                              
                }
                else{                    
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_filteron_record);            
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_filteroff_record);            
                }
                this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);
              }  

              fn_setQueryList(str_value, bln_isNewRecord){                                      
                super.fn_setQueryList(str_value);                  
                if(!bln_isNewRecord){
                  this.fn_exitNewRecord();                               
                }
              }                                                 

              fn_formNewRecord(){        

                this.bln_modeNewRecord=true;        
            
                this.obj_dataView.fn_setQueryModeNewRecord(true);                            
                
                let bln_isNewRecord=true;
                this.fn_setQueryList("", bln_isNewRecord);

                obj_path.fn_resetNavigateRecordURL();
                let str_metaRowzName=this.obj_meta.str_metaRowzName;                              
                obj_path.fn_pushStateNavigateRecordURL(this.obj_meta.str_metaRowzName);
                
                
                this.fn_setModeNewRecord();            
                this.fn_runDataView();              
                
              }  
              fn_formNewColumn(){        
            
                this.bln_modeNewRecord=true; 
            
                this.obj_dataView.fn_setQueryModeNewRecord(true);                            
                
                let bln_isNewRecord=true;
                this.fn_setQueryList("", bln_isNewRecord);

                obj_path.fn_resetNavigateRecordURL();
                let str_metaRowzName=this.obj_meta.str_metaRowzName;                              
                obj_path.fn_pushStateNavigateRecordURL(this.obj_meta.str_metaRowzName);
                
                
                this.fn_setModeNewRecord();            
                this.fn_runDataView();              
                
              }  
              fn_maintainDebugOn(){        
                
                this.fn_setMaintainDebugOn(true);    
                this.fn_formViewRecord();    
              }  
              fn_formApplyJoinFilter(){                                        
                if(this.obj_dataView){
                  this.obj_dataView.fn_resetDataView();//important to avoid page mis match                
                }                
                this.fn_setAutoJoinFilterPin(true);    
                this.fn_formViewRecord();    
              }  
              fn_formRemoveJoinFilter(){       
                if(this.obj_dataView){
                  this.obj_dataView.fn_resetDataView();//important to avoid page mis match                
                }                
                this.fn_setAutoJoinFilterPin(false);
                this.fn_formViewRecord();    
              }     
              
              fn_formEditRecord(){                   
                
                this.fn_setModeExecuteEdit();            
                this.fn_runDataView();      
              }  
              fn_formLinkOffRecord(){
                
                if(this.obj_parentMenu.obj_dataView){
                  this.obj_parentMenu.obj_dataView.fn_resetDataView();//important to avoid page mis match
                }                
                
                this.bln_linkOffPin=true;            
                this.fn_setQueryList("");                
                this.fn_runDataView();      
              }  
              fn_formLinkOnRecord(){
                if(this.obj_parentMenu.obj_dataView){
                  this.obj_parentMenu.obj_dataView.fn_resetDataView();//important to avoid page mis match
                }                
                this.bln_linkOnPin=true;            
                this.fn_setQueryList("");                
                this.fn_runDataView();      
              }  
            
              fn_onNewRecordUpdateMetaKey(obj_columnKey){
                this.obj_columnKey=obj_columnKey;                  
                this.fn_exitNewRecord();                                    
                /*
                this.fn_resetMenu();
                this.obj_dataView.fn_setModeExecuteView(); //update mode value    
                if(this.bln_dynamicMenu){
                  this.obj_parentMenu.fn_onNewRecordUpdateMetaKey();
                }
                //*/
              }

              fn_formCompleteRecord(bln_selfMenu=false){                

                bln_selfMenu=false;

                let int_countDynamic=this.obj_holder.arr_dynamicMenu.length;
                let int_countStandard=this.obj_holder.arr_standardMenu.length;

                if((int_countDynamic>1) || (int_countStandard>1)){
                  if(this.bln_childrenOpen ){
                    bln_selfMenu=true;
                  }                 
                }
                
              
                if(this.fn_getModeNewRecord()){
                  this.fn_exitNewRecord();                                                                      
                  bln_selfMenu=true;
                }

                if(!bln_selfMenu){
                  this.obj_parentMenu.fn_refreshMenu();
                  return;
                }                

                if(this.obj_dataView){
                  this.obj_dataView.fn_resetDataView();//important to avoid page mis match                
                }                
                
                this.fn_formViewRecord();                               
              }
              
              

              fn_setModeExecuteEdit(){                               
                super.fn_setModeExecuteEdit();
                
                this.fn_setButtonEditRecord();                          
                this.obj_dataView.fn_setModeExecuteEdit();        
              }
              
              fn_setButtonEditRecord(){              
                alert("no longer in use fn_setButtonEditRecord");

                if(this.obj_meta.bln_displayData){
                  
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_archive_record);                  
                  this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);                  
                  this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_navigate_record);
                }   
              }
            
              fn_setModeNewRecord(){    
                this.fn_setButtonNewRecord();                      
                this.obj_dataView.fn_setModeExecuteNew(); //update mode value        
               }
               fn_getModeNewRecord(){                    
                return this.obj_dataView.fn_getModeExecuteNew(); //update mode value        
               }
               fn_setButtonNewRecord(){                  

                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_archive_record);
                this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_navigate_record);                
                //this.obj_consoleContainerRecord.fn_showItem(this.obj_button_complete_record);
                //this.obj_button_complete_record.fn_setDisabled(true); //on in the wrong menu
                
                if(this.bln_multiRecordDisplay){  //All Record "Report View"                                                                    
                  this.obj_consoleContainerSearch.fn_showItem(this.obj_console_search);
                }

                let bln_hideItem=true;
                this.fn_setButtonParentFilterDisplay(bln_hideItem);
                
              }

              
            
    

              fn_onDataStart(obj_post){        
                super.fn_onDataStart(obj_post);                              
                
                if(this.bln_linkOffPin || this.bln_linkOnPin){      
                  if(this.bln_linkOffPin){
                    //this.obj_parentMenu.fn_setAutoJoinFilterPin(false);
                    this.obj_parentMenu.fn_setQueryList("");                    
                  }
                  else if(this.bln_linkOnPin){
                    this.obj_parentMenu.fn_setAutoJoinFilterPin(true);
                  }
                  this.bln_linkOffPin=false;
                  this.bln_linkOnPin=false;                        
                  this.obj_parentMenu.fn_resetMenu();
                  this.obj_parentMenu.fn_formRefreshRecord();     
                  //this.obj_parentMenu.fn_open();
                }    
                
                
              }
              fn_onDataEnd(obj_post){                              
                //console.log("xapp_menuform fn_onDataEnd");
                super.fn_onDataEnd(obj_post);
                
              }

              fn_getConsoleValues(){          
                super.fn_getConsoleValues();
                if(this.fn_getConsoleValue("Record")){this.bln_recordConsole=true;}                       
              }
            
              fn_configureSelfShared(obj_row){ //standard from add to accordion   
                
                //this.fn_debugText("fn_configureSelfShared");
                
                this.bln_modeNewRecord=this.obj_parentMenu.bln_modeNewRecord;
                if(this.bln_modeNewRecord){
                  this.fn_setAutoOpenPin(true);
                  this.obj_meta.bln_displayAccordionChildMenu=false;    
                  //copy autojoin value                
                  this.fn_setAutoJoinPin(this.obj_parentMenu.fn_getAutoJoinPin());                
                  this.fn_setAutoJoinToSource(this.obj_parentMenu.fn_getAutoJoinToSource());                        
                }    
                
                this.fn_setAutoJoinFilterPin(this.obj_meta.bln_autoJoinPin);                
                //console.log("this.fn_getAutoJoinFilterPin: " + this.fn_getAutoJoinFilterPin());
                  
                this.obj_meta.bln_joinTypeOne=false;
                this.obj_meta.bln_joinTypeMany=false;
                this.fn_setAllowAutoJoinPin(false);    
                switch(this.obj_meta.int_joinType){            
                  case(1):
                    this.obj_meta.bln_joinTypeOne=true;
                    break;
                  case(2):
                    this.obj_meta.bln_joinTypeMany=true;                
                    this.fn_setAllowAutoJoinPin(true);    
                    break;
                }    
                
                super.fn_configureSelfShared(obj_row);        
                  
                } 

                

                fn_addStandardMenuToAccordion(obj_row){
                  //Standard Child Menu    

                  let obj_item=super.fn_addStandardMenuToAccordion(obj_row);

                  if(!obj_item){return;}
                  
                  //Parent Menus can be Dynamic Menus to which Standard Menus are added
                  //Parent Menus can be Standard Menus to which Dynamic Menus are added  
                  if(this.fn_getAllowAutoJoinPin()){
                    
                    if(!obj_item.fn_getSettingOperationPin()){
                      let str_text=obj_item.fn_getText();
                      obj_item.fn_setText("[" + str_text + "]", str_text);                  
                      obj_item.fn_setMetaRowzTitle("[" + str_text + "]");                      
                    }
                    else{                      
                    }
                    
                  
                  
                    if(this.bln_dynamicMenu && (obj_item.obj_meta.int_idMetaRowz!==this.obj_meta.int_idMetaRowz)){            
                      obj_item.fn_setAutoJoinPin(true);
                      obj_item.fn_setAutoJoinFilterPin(true);                          
                    }        
                  }            
                }             

                
                
                fn_getRunDataViewQueryExpression(){

                  let str_expr="";              
                  return str_expr;
                  
                  
                }
                

                fn_getContextColumnKey(){

                  //this.fn_debugText("START fn_getContextColumnKey");
                  
                  let obj_columnKey=this.obj_columnKey;  
                  //console.log(obj_columnKey);  
                  //this.fn_debugText("this.bln_autoJoinFilterPin: " + this.bln_autoJoinFilterPin);
                  if(!obj_columnKey && this.bln_autoJoinFilterPin){
                    obj_columnKey=this.obj_parentMenu.obj_columnKey;
                    //this.fn_debugText("get parent column key: " + this.bln_autoJoinFilterPin);
                    //console.log(obj_columnKey);
                  }                      
                  if(this.bln_modeNewRecord && this.bln_autoJoinFilterPin){obj_columnKey=this.obj_parentMenu.obj_parentMenu.obj_columnKey;}
                  
                  

                  //this.fn_debugText("END fn_getContextColumnKey");
                  return obj_columnKey;
                }

                fn_configureDataViewQuery(){

                  super.fn_configureDataViewQuery();       
                  
                  let obj_columnKey=this.fn_getContextColumnKey();                          
                  this.obj_dataView.fn_setMetaKey(obj_columnKey);
            
                  
                  if(this.obj_meta.bln_autoJoinPin && this.bln_autoJoinFilterPin){
                    if(!this.bln_modeNewRecord){
                      this.obj_meta.str_autoJoinToSource=this.obj_parentMenu.fn_getMetaViewId();      
                      //console.log("runDataView adjusted this str_autoJoinToSource: "+ this.obj_meta.str_autoJoinToSource);      
                    }      
                    this.obj_dataView.fn_setAutoJoin(true);      
                    this.obj_dataView.fn_setAutoJoinToSource(this.obj_meta.str_autoJoinToSource);    
                    if(obj_columnKey && obj_columnKey.str_value){
                      this.obj_dataView.fn_setAutoJoinToKeyValue(obj_columnKey.str_value);            
                      this.obj_dataView.fn_setAutoJoinToKeyName(obj_columnKey.fn_getMetaColumnName());            
                    }      
                  }
              
                  if(this.bln_linkOffPin || this.bln_linkOnPin){   
                        
                    this.obj_meta.str_autoJoinToSource=this.obj_parentMenu.obj_parentMenu.fn_getMetaViewId();      
                    this.obj_meta.str_autoJoinToKeyValue=this.obj_parentMenu.obj_parentMenu.obj_columnKey.str_value;                    
                    this.obj_meta.str_autoJoinToKeyName=this.obj_parentMenu.obj_parentMenu.obj_columnKey.fn_getMetaColumnName();
                    this.obj_meta.str_autoJoinFromKeyValue=this.obj_columnKey.str_value;      
              
                    this.obj_dataView.fn_setLinkOffPin(this.bln_linkOffPin);      
                    this.obj_dataView.fn_setLinkOnPin(this.bln_linkOnPin);            
                    this.obj_dataView.fn_setAutoJoinToSource(this.obj_meta.str_autoJoinToSource);    
                    this.obj_dataView.fn_setAutoJoinToKeyValue(this.obj_meta.str_autoJoinToKeyValue);                  
                    this.obj_dataView.fn_setAutoJoinToKeyName(this.obj_meta.str_autoJoinToKeyName);                  
                    this.obj_dataView.fn_setAutoJoinFromKeyValue(this.obj_meta.str_autoJoinFromKeyValue);            
                    this.obj_dataView.fn_setAutoJoinFromKeyName(this.obj_meta.str_autoJoinFromKeyName);                  
                  } 
                  
                }

                fn_getMetaDefault(){

                  let obj_meta=super.fn_getMetaDefault();                                    
                  obj_meta.bln_allowAutoJoinPin=false;                                
                  obj_meta.bln_autoJoinPin=false;            
                  obj_meta.int_joinType=0;            

                  return obj_meta;
                }

                fn_getMetaDefaultDynamic(){

                  let obj_meta=super.fn_getMetaDefaultDynamic();                
                  obj_meta.bln_allowAutoJoinPin=this.fn_getAllowAutoJoinPin();    
                  obj_meta.int_joinType=this.obj_meta.int_joinType;    
                  return obj_meta;
                }

                fn_setConstraintKeyPin(bln_value){
                  this.bln_constraintKeyPin=bln_value;
                }
                
                fn_getConstraintKeyPin(){
                  return this.bln_constraintKeyPin;    
                }  

                fn_setConstraintNamePin(){
                  this.bln_constraintNamePin=false;
                  
                  if(this.bln_dynamicMenu && !this.bln_useMetaTemplate){return;}
                  if(!this.obj_meta.bln_joinTypeOne){return;}
                  if(this.obj_parentMenu.obj_meta.str_metaConstraintName){
                    this.bln_constraintNamePin=true;
                  }
                }
                
                fn_getConstraintNamePin(){
                  return this.bln_constraintNamePin;
                  
                }                                
                fn_setAllowAutoJoinPin(bln_value){
                  //this.fn_debugText("fn_setAllowAutoJoinPin: " + bln_value);
                  this.obj_meta.bln_allowAutoJoinPin=bln_value;    
                }
                fn_getAllowAutoJoinPin(){
                  //this.fn_debugText("fn_getAllowAutoJoinPin: " + this.obj_meta.bln_allowAutoJoinPin);
                  return this.obj_meta.bln_allowAutoJoinPin;
                }
                fn_getAutoJoinToSource(){
                  //this.fn_debugText("fn_getAutoJoinToSource: " + this.obj_meta.str_autoJoinToSource);
                  return this.obj_meta.str_autoJoinToSource;
                }
                fn_setAutoJoinToSource(str_value){
                  //this.fn_debugText("fn_setAutoJoinToSource: " + str_value);
                  this.obj_meta.str_autoJoinToSource=str_value;
                }
                fn_getAutoJoinPin(){
                  return this.obj_meta.bln_autoJoinPin;
                }
                fn_setAutoJoinPin(bln_value){
                  this.obj_meta.bln_autoJoinPin=bln_value;    
                }
                fn_getAutoJoinFilterPin(){    
                  return this.bln_autoJoinFilterPin;    
                }
                fn_setAutoJoinFilterPin(bln_value){
                  this.bln_autoJoinFilterPin=bln_value;  
                  if(!bln_value){                    
                    if(this.obj_dataView){
                      this.obj_dataView.fn_setMetaKey(false);
                    }
                    
                  }
                }
                fn_resetMenu(){
            
                  super.fn_resetMenu();
                  //this.fn_setAutoJoinFilterPin(false);
                }  

                //Menu Command Func
                fn_hideMenu(obj_exclude){
                  this.fn_hideStandardMenu(obj_exclude);              
                  this.fn_hideDynamicMenu(obj_exclude);              
                }
                fn_closeMenu(obj_exclude){    
                  this.fn_closeStandardMenu(obj_exclude)
                  this.fn_closeDynamicMenu(obj_exclude)
                }
                fn_menuCloseAndDisable(obj_exclude){
                  this.fn_standardMenuCloseAndDisable(obj_exclude);
                  this.fn_dynamicMenuCloseAndDisable(obj_exclude);
                }                

                fn_notifyMenu(str_nameFunction, obj_arg=false){
                  this.fn_notifyStandardMenu(str_nameFunction);                    
                  this.fn_notifyDynamicMenu(str_nameFunction);                    
                }
                //Menu Command Func

                
                
                
                

      
            }//END CLS
            //END TAG
            //END component/xapp_menuform