
          //XSTART component/xapp_menu
          class xapp_menu extends xapp_menu_operation{
            constructor(obj_ini) {      
              super(obj_ini);        
            } 
            fn_initialize(obj_ini){                
    
              super.fn_initialize(obj_ini);

              this.str_defaultTypeMenu="xapp_menu";                                
              this.str_defaultTypeData="xapp_data_view";                                  
              this.str_defaultTypeDataChildMenu="xapp_data_childmenu";                                            
              
              this.obj_holder.str_queryList="";
              this.obj_holder.str_queryList="";
              
              this.fn_initialize_var();
              this.bln_debugQueryInterface=false;            
            }             

            fn_initialize_var(obj_ini){                

              this.obj_meta=this.fn_getMetaDefault();                        
              this.fn_setQueryList("");                                                                    
              this.fn_setDebugPin(false);                
              this.str_optionData="Data";
              this.str_optionReport="Report";    
              this.str_optionWidget="Widget";
              this.str_optionDashboard="Dashboard";
              this.str_optionMenu="Menu";                
              this.str_optionMenuForm="MenuForm";                
              this.bln_dynamicMenu=false;     

              this.obj_holder.str_queryList="";
              this.obj_holder.str_queryListParent="";
              this.obj_holder.str_queryListDisabled="";
              this.obj_holder.str_queryListParentDisabled="";
      
              this.str_listSeparator="-";
              this.bln_useMetaTemplate=false;
              this.bln_constraintKeyPin=true;
              this.fn_configureObject(false);

              let str_subdomain=this.obj_design.str_releaseLabel;                    
              if(str_subdomain==="notset" ||!str_subdomain){
                str_subdomain=this.obj_design.str_nameShort;                      
              }

              this.obj_holder.arr_standardMenu=[];
              this.obj_holder.arr_dynamicMenu=[];
          
            }
        
            
          /*
        SIGNPOST 1. menu fn_onOpen
        --------------------
        
        SIGNPOST 2. menu fn_referenceObject
        --------------------
        Will create the various objects          
        obj_dataView 
        obj_containerWidgetView      
        arr_dashboardView
        obj_accordionView 
        obj_dataChildMenu 
        obj_accordionChildMenu 
        
        
        SIGNPOST 3. menu fn_runDataChildMenu
        ----------------------------------------
        literally runs the standard menu system
        
        SIGNPOST 4. When that data rs ends, run data View
        ----------------------------------------
        
        SIGNPOST 5. menu fn_formViewRecord
        ----------------------------------------
        
        SIGNPOST 6. menu fn_runDataView
        ----------------------------------------
        
        SIGNPOST 7. obj_dataView fn_initializeRS (this ) (initialze dataview with menubutton obj_pararmRS etc)
        ----------------------------------------
        
        SIGNPOST 8. obj_dataView fn_getDataQuery
        ----------------------------------------
        
        SIGNPOST 9. obj_dataView fn_onDataStartView
        ----------------------------------------
        if bln_displayAccordionView then bln_displayAccordionChildMenu = false
        i.e. if we have a dynamci menu , then turn off standard Child Menu
        
        
        SIGNPOST 10. obj_dataView fn_runComputeRow
        ----------------------------------------
        
        SIGNPOST 11. menu fn_onComputeRowViewea
        ----------------------------------------
        fn_loadDashboard
        fn_loadWidget
        fn_loadMenu
        fn_loadDynamicMenu
        
        SIGNPOST 12. fn_loadDynamicMenu
        ----------------------------------------
        menu Will add a menu button to its accordionView for each row in data set with class in MetaTypeViewMenu (generally menu)
        The menu button will  operata as a standard menu, with menu fn_onOpen driving the operatoin
        
        //*/         
        
          fn_onLoad(){
            super.fn_onLoad();    
            //if(this.fn_hasContextHolderParent()){return;}                        
            this.fn_setDomContainer();

            
          }   

          fn_applyThemeStructure(){                    
            
            this.obj_themeStructure=obj_project.obj_themeMenuButton;                
            this.fn_applyStyle(this.obj_themeStructure);//should be called here . not on base object - due to class hierachy                        
          }
          
          fn_runSearch(){//overridden by Menuform
            this.bln_runSearch=true;            
            this.fn_formViewRecord();
          }      

          fn_loadReportInterface(){

            if(this.fn_getIsDynamicMenu()){return;}
            //ONLY RUNS IF MENU HAS A SEARCH BUTON 
            if(!this.bln_hasSearchButton){return;}     
            if(this.bln_simpleSearch){return;}     

            //ONLY RUNS ONE TIME ON PAGE LOAD / FIRST SEARCH            
            if(this.bln_loadedReportInterface){                          
              if(this.bln_debugQueryInterface){
                console.log("EARLY RETURN READ bln_readQueryOnce: this.bln_loadedReportInterface: " +  this.bln_loadedReportInterface);                
                console.log("EARLY RETURN str_queryList: " +  this.fn_getQueryList());
              }              
              return;
            }
            else{                
              this.bln_loadedReportInterface=true;
              if(this.bln_debugQueryInterface){
                console.log("READ ONCE bln_readQueryOnce: this.bln_loadedReportInterface: " +  this.bln_loadedReportInterface);
                console.log("READ ONCE str_queryList: " +  this.fn_getQueryList());
              }              
            }

            //console.log("fn_loadReportInterface");

            this.fn_loadQueryInterface();            
            this.fn_loadReportInterfaceFieldList();                        
            this.fn_loadReportInterfaceFieldCriteria();                                   

            this.obj_console_search.fn_getTabset();    
            this.obj_console_search.obj_tabset.obj_panellist.fn_displayPanel();              
            
          }

          fn_loadReportInterfaceFieldList(){                        
            this.obj_console_search.fn_addReportInterfaceFieldList();                
          }
          fn_loadReportInterfaceFieldCriteria(){
            this.obj_console_search.fn_addReportInterfaceFieldCriteria();                
          }

          fn_loadQueryInterface(){                        

            if(this.bln_debugQueryInterface){
              this.fn_debugText("START fn_loadQueryInterface: this.bln_hasSearchButton: " + this.bln_hasSearchButton);                
            }            

            let arr_term, str_term, i;
            let obj_button;
            let str_queryList, str_queryListDisabled;
            let obj_console_search=this.obj_console_search;            
            
            if(!this.bln_readQueryList){
              this.bln_readQueryList=true;                
              str_queryList=decodeURIComponent(this.obj_post.QueryList);
              if(this.bln_debugQueryInterface){
                console.log("READ POST str_queryList: " + str_queryList);
              }              
            }
            else{                  
              str_queryList=this.fn_getQueryList();                              
              if(this.bln_debugQueryInterface){
                console.log("CURRENT VALUE str_queryList: " + str_queryList);
              }
            }                
            
            if(str_queryList){                  
              arr_term=str_queryList.split(obj_shared.str_listSeparatorOr);                
              for(i=0;i<arr_term.length;i++){
                str_term=arr_term[i];                                  
                if(this.bln_debugQueryInterface){
                  console.log("str_term: " + str_term);
                }
                this.fn_addQueryTermToList(str_term);                                                       
                obj_button=obj_console_search.fn_addQueryTerm(str_term, true);                  
              }              
            }             
            
            if(!this.bln_readQueryDisabled){
              this.bln_readQueryDisabled=true;                
              str_queryListDisabled=decodeURIComponent(this.obj_post.QueryListDisabled);              
              if(this.bln_debugQueryInterface){
                console.log("READ POST str_queryListDisabled: " + str_queryListDisabled);
              }
            }
            else{                  
              str_queryListDisabled=this.fn_getQueryListDisabled();                                              
              if(this.bln_debugQueryInterface){
                console.log("CURRENT VALUE str_queryListDisabled: " + str_queryListDisabled);
              }
            }              
            if(str_queryListDisabled){                  
              arr_term=str_queryListDisabled.split(obj_shared.str_listSeparatorOr);
              for(i=0;i<arr_term.length;i++){
                str_term=arr_term[i];                
                if(this.bln_debugQueryInterface){
                  console.log("str_term disabled: " + str_term);
                }
                this.fn_addQueryTermToList(str_term);                                                       
                obj_button=obj_console_search.fn_addQueryTerm(str_term, false);                
                obj_console_search.fn_disableQueryTerm(obj_button);                                                       
              }
            }

            if(this.bln_debugQueryInterface){              
              console.log("END fn_loadQueryInterface");
            }            
          }



          
          fn_addQueryTermToList(str_queryTerm=""){

            
            if(!str_queryTerm){return;}              

            if(this.bln_debugQueryInterface){
              console.log("fn_addQueryTermToList: " + str_queryTerm);
            }


            let str_queryList=this.fn_getQueryList();                              
            let bln_found=obj_shared.fn_inString(str_queryTerm, str_queryList, obj_shared.str_listSeparatorOr);                              
                          
            if(!bln_found){                
              
              str_queryList = obj_shared.fn_trimCharacter(str_queryTerm+obj_shared.str_listSeparatorOr+str_queryList, obj_shared.str_listSeparatorOr);                                
              this.fn_setQueryList(str_queryList);                            
            }

            this.fn_removeQueryTermFromListDisabled(str_queryTerm);
          }

          fn_addQueryTermToListDisabled(str_queryTerm=""){

            if(!str_queryTerm){return;}

            if(this.bln_debugQueryInterface){
              console.log("fn_addQueryTermToListDisabled: " + str_queryTerm);
            }

            let str_queryList=this.fn_getQueryListDisabled();                                            
            let bln_found=obj_shared.fn_inString(str_queryTerm, str_queryList, obj_shared.str_listSeparatorOr);                              
            
            if(!bln_found){
              
              str_queryList = obj_shared.fn_trimCharacter(str_queryTerm+obj_shared.str_listSeparatorOr+str_queryList, obj_shared.str_listSeparatorOr);                  

              this.fn_setQueryListDisabled(str_queryList);                            
            }

            this.fn_removeQueryTermFromList(str_queryTerm);
          }

          fn_removeQueryTermFromList(str_queryTerm=""){

            if(!str_queryTerm){return;}

            let str_queryList;                            

            if(this.bln_debugQueryInterface){
              console.log("fn_removeQueryTermFromList: " + str_queryTerm);
            }

          
            
            str_queryList=this.fn_getQueryList();                            
            str_queryList=obj_shared.fn_replace(str_queryList, str_queryTerm, obj_shared.str_listSeparatorOr, obj_shared.str_listSeparatorOr);
            
            let obj_list={
              str_list : str_queryList,                
              str_separator : obj_shared.str_listSeparatorOr,
            };              
            obj_shared.fn_maintainList(obj_list);              
            
            this.fn_setQueryList(obj_list.str_list);                            
          }

          fn_removeQueryTermFromListDisabled(str_queryTerm=""){

            if(!str_queryTerm){return;}

            let str_queryList;                                        
            
            str_queryList=this.fn_getQueryListDisabled();                            
            str_queryList=obj_shared.fn_replace(str_queryList, str_queryTerm, obj_shared.str_listSeparatorOr, obj_shared.str_listSeparatorOr);
            
            let obj_list={
              str_list : str_queryList,                
              str_separator : obj_shared.str_listSeparatorOr,
            };              
            obj_shared.fn_maintainList(obj_list);              
            
            this.fn_setQueryListDisabled(obj_list.str_list);                            
          }            

          
          fn_resetQueryList(){
            this.fn_setQueryList("");
          }

          fn_setQuerySearch(str_querySearch){

            if(this.obj_dataView){   
              this.obj_dataView.fn_setDataQuerySearch(str_querySearch);
            }
            
          }
          fn_getQuerySearch(){
            if(this.obj_dataView){                                  
              return this.obj_dataView.fn_getDataQuerySearch();
            }

          }
          
          fn_setQueryList(str_queryList=""){                                                    

            if(this.fn_getIsDynamicMenu()){return;}
            
            if(this.bln_multiRecordDisplay){//All Record "Report View"                                                          
              this.fn_exitConstraint();
            }         
            
            
            if(this.obj_dataView){                    
              
              this.obj_dataView.fn_setDataQueryList(str_queryList);                                                              
              //console.log("fn_getQueryList: " + this.obj_dataView.fn_getDataQueryList());          
            }              
            else{
              this.obj_holder.str_queryList=str_queryList;//will form the QueryListParent for child menus                            
              //console.log("no data view: " + this.fn_getQueryList());
            }              
            
            if(!this.fn_getQueryList()){
              this.fn_notify(this.obj_console_search, "fn_resetSearchInterface");                
            }              
          }  

          fn_setQueryListDisabled(str_queryList=""){                                                                  
            
            if(this.fn_getIsDynamicMenu()){return "";}
            
            if(this.obj_dataView){              
              this.obj_dataView.fn_setDataQueryListDisabled(str_queryList);                                                              
            }              
            else{
              this.obj_holder.str_queryListDisabled=str_queryList;//will form the QueryListParentDisabled for child menus                            
            }
          }  

          fn_getQueryListDisabled(){                                                              

            if(this.fn_getIsDynamicMenu()){return "";}
            
            let str_value;
            if(this.obj_dataView){
              str_value= this.obj_dataView.fn_getDataQueryListDisabled();
            }
            else{
              str_value= this.obj_holder.str_queryListDisabled;
            }              
            //this.fn_debugText("fn_getQueryList: " + str_value);
            return str_value;
          }                      
          
          fn_getQueryList(){                                                              

            
            if(this.fn_getIsDynamicMenu()){return "";}
            
            let str_value;
            if(this.obj_dataView){
              str_value= this.obj_dataView.fn_getDataQueryList();
              //this.fn_debugText("xxxx DATA fn_getQueryList: " + str_value);
            }
            else{
              str_value= this.obj_holder.str_queryList;
              //this.fn_debugText("xxxx HOLDER fn_getQueryList: " + str_value);
            }              
            
            return str_value;
          }                      
          
          fn_getQueryListParent(){                                                

            if(this.fn_getIsDynamicMenu()){return "";}

            if(!this.obj_parentMenu){
              return "";
            }
            return this.obj_parentMenu.fn_getQueryList();                         
          }  
                                          
          fn_getQueryListParentDisabled(){            
            
            if(this.fn_getIsDynamicMenu()){return "";}

            if(!this.obj_parentMenu){
              return "";
            }
            return this.obj_parentMenu.fn_getQueryListDisabled();                         
          }                                  

          fn_setMetaRowzGroup(str_value){
            this.obj_meta.MetaRowzGroup=str_value;      
          }
          fn_getMetaRowzGroup(){
            return this.obj_meta.MetaRowzGroup;      
          }

          fn_setSubdomain(str_value){
            this.obj_meta.str_subdomain=str_value;
          }
          fn_getSubdomain(){
              return this.obj_meta.str_subdomain;
          }
          fn_getAutoOpenPin(){
            return this.obj_meta.bln_autoOpenPin;
          }
          fn_setAutoOpenPin(bln_value){
            this.obj_meta.bln_autoOpenPin=bln_value;
          }  
          fn_getAutoFetch(){
            return this.obj_meta.bln_autoFetch;
          }
          fn_setAutoFetch(bln_value){
            this.obj_meta.bln_autoFetch=bln_value;
          }            
          fn_getDisabledPin(){
            return this.obj_meta.bln_disabledPin;
          }
          fn_setDisabledPin(bln_value){
            this.obj_meta.bln_disabledPin=bln_value;
          }
          fn_setHiddenPin(bln_value){
            
            if(!this.obj_meta.bln_livePin  && !this.fn_getSettingOperationPin()){
              bln_value=true;
            }
            this.obj_meta.bln_hiddenPin=bln_value;              
            
            if(bln_value){                
              bln_value=false;                   
              this.dom_objContent.style.display="none";//works with fn_display
            }
            else{                           
              bln_value=true;              
            }                                          
            this.fn_setDisplay(bln_value);        
            
          }                                  
          fn_getHiddenPin(){
            return this.obj_meta.bln_hiddenPin;
          }                        
          fn_setLivePin(bln_value){
            this.obj_meta.bln_livePin=bln_value;              
            
            if(!bln_value && !this.fn_getSettingOperationPin()){
              this.fn_setHiddenPin(true);
            }
          }               
          fn_getLivePin(){
            return this.obj_meta.bln_livePin;              
          }    
          fn_getDebugPin(){
            return this.obj_meta.bln_debugPin;
          }               
          fn_setDebugPin(bln_value){
            this.obj_meta.bln_debugPin=bln_value;
            this.obj_holder.bln_debugServer=bln_value;                            
          }                             
          fn_setPublishPin(bln_value){
            this.obj_meta.bln_publishPin=bln_value;              
          }               
          fn_getPublishPin(){
            return this.obj_meta.bln_publishPin;              
          }    
          fn_setViewPin(bln_value){
            this.obj_meta.bln_viewPin=bln_value;              
          }               
          fn_getViewPin(){
            return this.obj_meta.bln_viewPin;              
          }             
          
          fn_setSelectMinimalFieldPin(bln_value){
            this.obj_meta.bln_selectMinimalFieldPin=bln_value;                            
          }               
          fn_getSelectMinimalFieldPin(){
            return this.obj_meta.bln_selectMinimalFieldPin;
          }               
          fn_setDynamicMenuPin(bln_value){              
            this.obj_meta.bln_dynamicMenuPin=bln_value;              
          }
          fn_getDynamicMenuPin(){
            return this.obj_meta.bln_dynamicMenuPin;
          }
          fn_setTemporaryRowzPin(bln_value){              
            this.obj_meta.bln_temporaryRowzPin=bln_value;              
          }
          fn_getTemporaryRowzPin(){
            return this.obj_meta.bln_temporaryRowzPin;
          }
          
          
          fn_autoOpenAccordion(){
            if(this.obj_meta.bln_displayAccordionView){
              this.obj_accordionView.fn_autoOpen();    
            }    
            if(this.obj_meta.bln_displayAccordionChildMenu){
              this.obj_accordionChildMenu.fn_autoOpen();
            }
          }    
          //MENU ACTION
          //----------------------------------------
          //SIGNPOST 1. menu fn_onOpen
          //----------------------------------------
          fn_onClick(e){                      
            super.fn_onClick(e);
            //console.log("menu tab fn_onClick");

            let str_metaRowzName=this.obj_meta.str_metaRowzName;              
            let str_metaRecordId=this.fn_getMenuRecordId();              
            obj_path.fn_pushStateNavigateRecordURL(str_metaRowzName, str_metaRecordId);
          }
          
          fn_onClose(){
            super.fn_onClose();                 
          }            
          fn_onOpen(){  
            super.fn_onOpen();
            
            this.fn_runMenu();  
            
          }

          fn_refreshMenu(){
            this.bln_flagRunOnce=false;                          
            this.fn_runMenu();           
          }      
          
          

          fn_getQueryListMode(){

            if(!this.obj_parentMenu){return;}
            let str_queryList=this.obj_parentMenu.fn_getQueryList();
            if(str_queryList){
              return true;
            }
            return false;
            
          }
          
          fn_runMenu(){
            if(this.fn_hasContextHolderParent()){return;}                                                                                         
            
            
            let bln_autoFetch=this.fn_getAutoFetch();              
            let bln_queryListMode=this.fn_getQueryListMode();                                          
            if(bln_queryListMode){                
              this.bln_flagRunOnce=false;
              bln_autoFetch=true;
            }              
            
            
            if(this.bln_flagRunOnce){                
              this.fn_runClient();    
              //this.fn_debugText("fn_runClient and return");
              return;
            }

            
            
            
            if(!bln_autoFetch){
              //console.log("autofetch is false, set bln_flagRunOnce");
              this.bln_flagRunOnce=true;           
            }                  

            this.fn_classifyLevel();                           
                
            if(this.bln_isJoinedChildMenu){                                
              if(this.fn_getAllowAutoJoinPin()){                  
                if(this.obj_meta.bln_joinTypeMany){                                                          
                  this.fn_setLimitEndMenuChain(true);                  
                }                    
              }
            }  
            //console.log("this.fn_getLimitEndMenuChain(): " + this.fn_getLimitEndMenuChain())

            
              //*
              let obj_accordion=this.fn_getAccordionChildMenu();
              if(obj_accordion){obj_accordion.fn_removeChildren();}
              obj_accordion=this.fn_getAccordionView();
              if(obj_accordion){obj_accordion.fn_removeChildren();}
              //*/
            

              //load child menus, once finished, views are loaded / dynamic menus are loaded.
              //console.log("");

              this.fn_runDataChildMenu();                          
            
            if(this.obj_meta.bln_displayDashboard){
              //console.log("fn_loadDashboards");
              this.fn_loadDashboards();    
            }                  
            
            
          }
        
          fn_notifyDashboard(str_nameFunction, obj_arg){                
            
            let arr_item=this.fn_getDashboardView();    
            if(!arr_item){return;}
            for(let i=0;i<arr_item.length;i++){
              let obj_dashboard=arr_item[i];
              this.fn_notify(obj_dashboard, str_nameFunction, obj_arg);                
            }
          }

          fn_refreshDashboards(){

            let arr_item=this.fn_getDashboardView();    
            if(!arr_item){return;}            
            for(let i=0;i<arr_item.length;i++){
              let obj_dashboard=arr_item[i];
              if(obj_dashboard){
                obj_dashboard.fn_refreshDashboard();
              }  
              //else{//console.log("Error Loading Dashboard: Check for Typos and Context Holders are in place");}
            }

          }

          fn_loadDashboards(){    
            let arr_item=this.fn_getDashboardView();                  
            if(!arr_item){return;}            
            for(let i=0;i<arr_item.length;i++){
              let obj_dashboard=arr_item[i];
              if(obj_dashboard){                  
                obj_dashboard.fn_loadDashboard();
              }  
              //else{//console.log("Error Loading Dashboard: Check for Typos and Context Holders are in place");}
            }              
          }
        
          fn_runClient(){    

            //this.fn_debugText("fn_runClient");
            
            
            if(!this.obj_meta.bln_runDataChildMenu){                  
              this.fn_configureObject(false);             
            }           
            
            this.fn_configureMenuPanel();           
            this.fn_displayObject();          
            this.fn_autoOpenAccordion();
        
            this.fn_endReflow();                
          }              
            //----------------------------------------
          //SIGNPOST 3. menu fn_runDataChildMenu
          //----------------------------------------
          
          fn_runDataChildMenu(){                                                    
            

            let obj_accordion=this.fn_getAccordionChildMenu();
            if(obj_accordion){obj_accordion.fn_removeChildren();}              
            
            if(!this.obj_dataChildMenu){
              //console.log("obj_dataChildMenu is false , return");
              return;
            }                            

            
            //this.fn_debugText("fn_runDataChildMenu");
            
        
            this.obj_dataChildMenu.fn_initializeRS(this);
            this.obj_dataChildMenu.fn_setComputeRows(true);    

            
            let obj_columnKey=this.fn_getContextColumnKey();

            //console.log(obj_columnKey);                                                              
            
            this.obj_dataChildMenu.fn_setMetaKey(obj_columnKey);

            //Meta Expr                                        
            this.obj_dataChildMenu.fn_setMetaViewId(this.fn_getMetaViewId());
            this.obj_dataChildMenu.fn_setMetaRowzId(this.fn_getMetaRowzId());              
            this.obj_dataChildMenu.fn_setMetaRowzName(this.fn_getMetaRowzName());              
            this.obj_dataChildMenu.fn_setMetaRowzTitle(this.fn_getMetaRowzTitle());                            
            
            this.obj_dataChildMenu.fn_setMetaViewId(this.fn_getMetaViewId());                  
            //Meta Expr

            this.obj_dataChildMenu.obj_holder.bln_debugServer=this.obj_holder.bln_debugServer;                                
            this.obj_dataChildMenu.fn_setSubdomain(this.fn_getSubdomain());                                    

            
            this.obj_dataChildMenu.obj_holder.obj_query.bln_loadReportInterface=false;
            if(this.bln_hasSearchButton && !this.bln_loadedReportInterface && this.bln_simpleSearch){                              
              this.obj_dataChildMenu.obj_holder.obj_query.bln_loadReportInterface=true;
            }                                       
            
            //this.fn_debugText();
            this.obj_dataChildMenu.fn_getChildRowz(); 
            
          }
          //MENU ACTIONS         
          
        
        
          //----------------------------------------
          //SIGNPOST 6. menu fn_runDataView
          //----------------------------------------            
        
          
          fn_getRunDataViewQueryExpression(){//can be overidden
            let str_expr="";
            return str_expr;    
          }  
          
          fn_getAutoJoinPin(){
            return this.obj_meta.bln_autoJoinPin;
          }

          fn_getValidView(){
            if(this.fn_getMetaViewId()===100){
              return false;
            }
            return true;
            
          }

          fn_runCount(){
          
            if(this.fn_getSettingOperationPin()){//dont apply to settings ui        
              //return;
            }

            this.fn_setDataViewCount();                              

            if(!this.fn_getValidView()){
              return;
            }

            if(!this.obj_dataView){
              return;
            }                
            if(this.fn_getAutoJoinPin()){
              //return;
            }            

            this.bln_runSearch=true;

            //Configure Query
            this.fn_configureDataViewQuery();                      
            
            this.obj_dataView.fn_getDataCountQuery(this.bln_runSearch);                               
            //this.fn_debugText("fn_runCountQuery");
          }
          
          fn_runDataView(){      

            this.bln_debugRunDataView=false;

            //This is automatically called on form button click by xapp_form_container_search / fn_onSubmit / obj_menuButton.fn_runSearch
            //xapp_console_container listensubmit is true

            //This is also automatically called on form button click by xapp_menu fn_onChildSubmit / this.fn_viewRecord            
            
        
            //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
            //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
            //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
            //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"
            
            if(!this.obj_design.bln_isOpen){
              return;
            }              
            
            //console.log("fn_runDataView");
            
            this.fn_resetArrayDynamicMenu();              
            
            if(!this.obj_dataView){//create relevant data view
              this.fn_setDataView();                              
            }                                            

            //console.log("1 this.obj_dataView.fn_getMetaViewId(): " + this.obj_dataView.fn_getMetaViewId());
            //console.log("2 this.fn_getMetaViewId(): " + this.fn_getMetaViewId());
            //this.obj_dataView.fn_setMetaViewId(this.fn_getMetaViewId());
            //console.log("3 this.obj_dataView.fn_getMetaViewId(): " + this.obj_dataView.fn_getMetaViewId());
            
            //Configure Query
            this.fn_configureDataViewQuery();                                    
            //count menu must go after Configure Query, but can go before Select Query
            
            this.obj_dataView.fn_getDataQuery(this.bln_runSearch);                               
            if(this.bln_simpleSearch){
              //this.fn_resetSearch();
            }
            

            //if(!this.fn_getSettingGroup()){//if not part of the settings ui                                
              this.fn_countMenu();              
            //}              
          }     

          fn_resetSearch(){
            if(this.obj_console_search){
              this.obj_console_search.fn_resetReportInterface();
            }
            this.obj_dataView.fn_setDataQuerySearch("", false);
          }

          fn_getContextColumnKey(){
            return this.obj_columnKey;
          }

          fn_configureDataViewQuery(){//overidden but called

            
            //----------------------------------------
            //SIGNPOST 7. obj_dataView fn_initializeRS (this ) (initialze dataview with menubutton obj_pararmRS etc)
            //----------------------------------------
            

            //Note Set QueryExpression , both occur here

            this.obj_dataView.fn_initializeRS(this);    
                                      
            
            
            //Meta Expr                                        
            this.obj_dataView.fn_setMetaViewId(this.fn_getMetaViewId());
            this.obj_dataView.fn_setMetaRowzId(this.fn_getMetaRowzId());              
            this.obj_dataView.fn_setMetaViewId(this.fn_getMetaViewId());                  
            //Meta Expr
                      
            //Key Expr                                
            let str_expr="";
            str_expr+=this.fn_getRunDataViewQueryExpression();                      
            this.obj_dataView.fn_setQueryExpression(str_expr);        
            
            if(obj_path.str_urlMetaRecordId){                                
              //this.obj_dataView.fn_setURLMetaRecordId(obj_path.str_urlMetaRecordId);
            }

            //*
            if(this.bln_debugRunDataView){              
              //this.fn_debugText("fn_getIsDynamicMenu: " + this.fn_getIsDynamicMenu());
              let str_queryList=this.fn_getQueryList();                                           
              let str_queryListParent=this.fn_getQueryListParent();                                             
              this.fn_debugText("fn_configureDataViewQuery str_queryList: " + str_queryList);              
              this.fn_debugText("fn_configureDataViewQuery str_queryListParent: " + str_queryListParent);
              
            }
            
            //*/

            //Search              
            this.obj_dataView.fn_setDataQueryList(this.fn_getQueryList());
            this.obj_dataView.fn_setDataQueryListDisabled(this.fn_getQueryListDisabled());
            this.obj_dataView.fn_setDataQueryListParent(this.fn_getQueryListParent());                                                  
            this.obj_dataView.fn_setDataQueryListParentDisabled(this.fn_getQueryListParentDisabled());                                                  
            
            //Search

            this.obj_dataView.obj_holder.bln_debugServer=this.obj_holder.bln_debugServer;                                

          }
          
          fn_getConstraintValue(){
            return this.str_constraintParentValue;
          }
          
          
        
        
          //----------------------------------------
          //SIGNPOST 5. menu fn_formViewRecord
          //----------------------------------------
          fn_formViewRecord(){//overidden but called by menuform  //called by crud menu operation data end child menu and search                            
        
            //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
            //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
            //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
            //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"                  
            
            this.fn_setModeViewRecord();                
            this.fn_runDataView();

          }
        
          fn_setModeViewRecord(){ 
        
            
            this.fn_setButtonViewRecord();                          
            if(this.obj_dataView){
              this.obj_dataView.fn_setModeExecuteView(); //update mode value    
            }
            
          }
          fn_setButtonViewRecord(){                          
            
            if(this.bln_topLevelMenu){                
              //let str_name=this.fn_getName();                
            }

            let obj_button, obj_container;
            
            ////ContainerGeneral
            obj_container=this.obj_consoleContainerGeneral;
            if(this.bln_hasOfficeButton){              
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_office");                                          
              obj_container.fn_showItem(obj_button);
              
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_lobby");                                        
              obj_container.fn_showItem(obj_button);
            }
            if(this.bln_hasExitButton){
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_desktop");
              obj_container.fn_showItem(obj_button);                                          
            }                        
            //if(this.bln_hasSettingButton && obj_userHome.Admin){                                                          
            if(this.bln_hasSettingButton){                                                          
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_settings");                                   
              obj_container.fn_showItem(obj_button);   
            }
            if(this.bln_hasNewRowButton){                
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_newrow");              
              obj_container.fn_showItem(obj_button);                                
            }   
            if(this.bln_hasNewColumnButton){                              
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_newcolumn");                          
              obj_container.fn_showItem(obj_button);                                
            }                                       
            ////ContainerGeneral

            ////ContainerLeft            
            obj_container=this.obj_consoleContainerGeneralLeft;
            if(this.bln_hasLoginButton){
              obj_button=obj_container.fn_getConsoleComponent("xapp_button_navigate_login");
              obj_container.fn_showItem(obj_button);
            }              
            ////ContainerLeft

            ////ContainerSearch
            obj_container=this.obj_consoleContainerSearch;
            if(this.bln_hasSearchButton){
              obj_button=this.obj_console_search;
              obj_container.fn_showItem(this.obj_console_search);
            }                          
            
          }

          fn_formHome(){                       
          
            let obj_ini=new Object;            
            obj_ini.int_actionCode=200;            
            obj_ini.str_action="formHome";
            obj_ini.str_nameFolderServer="xapp_dataform_system";            
            this.fn_runServerAction(obj_ini);                                                                  
          }        
          formHome(){
            obj_path.fn_navigateSubdomain("office");
          }
        
          fn_classifyLevel(){
        
            this.bln_isParentMenu=false;
            this.bln_isChildMenu=false;
            
        
            if(this.bln_dynamicMenu){
              this.bln_isChildMenu=true;
              if(this.obj_parentMenu.obj_meta.bln_autoJoinPin){     
                this.bln_isJoinedChildMenu=true;                                  
              }
            }
            else{            
              
              /*
              if(this.fn_getIsMenuWithView()){        
                this.bln_isParentMenuWithView=true;                
              }
              //*/
            }

            //*
            //alternativeyl allow dynamic menu to have this toggle, for use with Add Record command
            //in general dynamic menus will have onl a data set attached so irrelevant
            //there may be circ when a dynamic menu also contains multiple records,  e.g in a  group by having set of menus, in which case the code can be developed to allow additional records to be added.
            if(this.fn_getIsMenuWithView()){
              this.bln_isParentMenuWithView=true;                
            }
            //*/
            
            
            if(this.obj_meta.bln_displayData){
              this.bln_hasChildForm=true;
              
              if(!this.bln_isChildMenu){
                this.bln_multiRecordDisplay=true;                  
              }
            }              
            
          } 
          fn_setLimitEndMenuChain(bln_value){
            this.obj_meta.bln_limitEndMenuChain=bln_value;    
          }
          fn_getLimitEndMenuChain(){                  
            return this.obj_meta.bln_limitEndMenuChain;    
          }
          fn_formNavigateDesktop(){              
            obj_path.fn_navigateSubdomain("desk");                                                  
          }           
          fn_formNavigateMall(){              
            obj_path.fn_navigateSubdomain("mall");                                                  
          }           
          fn_formNavigateOffice(){              
            obj_path.fn_navigateSubdomain("office");                                                  
          }           

          fn_setMarkedParentSchemaName(){
            this.obj_holder.str_markedParentSchemaName=this.obj_parentMenu.fn_getMetaSchemaName();
          }             
          fn_getMarkedParentSchemaName(){
            if(this.obj_holder.str_markedParentSchemaName){
              return this.obj_holder.str_markedParentSchemaName;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentSchemaName();
            }
            return "";
          }
          
          fn_setMarkedParentTableName(){
            this.obj_holder.str_markedParentTableName=this.obj_parentMenu.fn_getMetaTableName();
          }             
          fn_getMarkedParentTableName(){
            if(this.obj_holder.str_markedParentTableName){
              return this.obj_holder.str_markedParentTableName;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentTableName();
            }
            return "";
          }
          fn_setMarkedParentRowzId(){
            this.obj_holder.str_markedParentRowzId=this.obj_parentMenu.fn_getMetaRowzId();
          } 
          fn_getMarkedParentRowzId(){
            if(this.obj_holder.str_markedParentRowzId){
              return this.obj_holder.str_markedParentRowzId;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentRowzId();
            }
            return 0;
          }          
          fn_setMarkedParentViewId(){
            this.obj_holder.str_markedParentViewId=this.obj_parentMenu.fn_getMetaViewId();
          } 
          fn_getMarkedParentViewId(){
            if(this.obj_holder.str_markedParentViewId){
              return this.obj_holder.str_markedParentViewId;
            }
            if(this.obj_parentMenu){
              return this.obj_parentMenu.fn_getMarkedParentViewId();
            }
            return 0;
          }
          fn_formNavigateSettings(){                                                        
            let obj_item=this.fn_getSettingMenu(); 
            //console.log("obj_item: " + obj_item);           
            if(obj_item){
              obj_item.fn_setSettingOperationPinDisplay();                             
            }            
          }                        

          fn_loadformChangeDashboard(){                                                                                              
          
            this.obj_menuPanel=this.fn_getParentComponent();                  
            this.obj_consoleContainerMaintain=this.obj_menuPanel.fn_addConsoleContainer("console_container_maintain", true);            
            this.obj_button_form_movedown=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_movedown");                            
            this.obj_button_form_moveup=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_moveup");                            
            this.obj_button_form_gap=this.obj_consoleContainerMaintain.fn_getConsoleComponent("xapp_button_form_gap");                            
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_gap);
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_moveup);
            this.obj_consoleContainerMaintain.fn_showItem(this.obj_button_form_movedown);
          }                 
          
          fn_formAddGap(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_add_group";
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_add_group(){
            obj_path.fn_navigateSubdomain("app", true);        
          }

          fn_formGap(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_gap";
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_gap(){
            obj_path.fn_navigateSubdomain("app", true);        
          }
          
          fn_formMoveUp(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_moveup";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                               
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_moveup(){            
            //this.obj_parentMenu.obj_parentMenu.fn_refreshMenu();
          }
  
          fn_getMetaFormId(){          
            let obj_menuButton=this;          
            let obj_recordset=obj_menuButton.obj_dataView;
            //obj_recordset.fn_describeMetaColumns();
            let obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("`meta_column`.`meta_column`.`MetaColumnId`");          
            return obj_metaColumn.str_value;
          }

          fn_formMoveDown(){
            let obj_ini=new Object;            
            obj_ini.str_action="form_movedown";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                     
            obj_ini.int_idMetaForm=this.fn_getMetaFormId(); 
            this.fn_runServerAction(obj_ini);                                                                  
          }
          form_movedown(){
            //this.obj_parentMenu.obj_parentMenu.fn_refreshMenu();
          }
          
          
          fn_formNavigateNewColumn(){                              
            
            let obj_settingmenu=this.obj_parentMenu;            
            obj_settingmenu.fn_setSettingOperationPinDisplay();                             
            let obj_standardMenu=obj_settingmenu.obj_parentMenu;

            let obj_ini=new Object;            
            obj_ini.str_action="addNewColumn";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                                     
            obj_ini.int_idMetaRow=obj_standardMenu.fn_getMetaRowzId();
            obj_ini.int_idMetaView=obj_standardMenu.fn_getMetaViewId();
            if(obj_ini.int_idMetaView){            
              this.fn_runServerAction(obj_ini);                                                                  
            }          
          }
          addNewColumn(){            
            obj_path.fn_navigateSubdomain("app", true);        
          }
     
          fn_formNavigateNewRow(){                              
            
            let obj_settingmenu=this.obj_parentMenu;            
            obj_settingmenu.fn_setSettingOperationPinDisplay();                             
            let obj_standardMenu=obj_settingmenu.obj_parentMenu;

            let obj_ini=new Object;            
            obj_ini.str_action="addNewRowz";                                     
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                         
            obj_ini.int_idMetaRowz=obj_standardMenu.fn_getMetaRowzId();
            if(obj_ini.int_idMetaRowz){            
              this.fn_runServerAction(obj_ini);                                                                  
            }          
          }
          addNewRowz(){
            //console.log("addNewRowz return");
            obj_path.fn_navigateSubdomain("app", true);        
          }

          ////////////////
          //SHOW HIDE ARCHIVE
          fn_formShowArchive(){                                          
            this.fn_formDisplayArchive(true);
          }
          showArchive(){
            this.fn_navigateApp(true);            
          }
          fn_formDisplayArchive(bln_value){                                          

            let obj_ini=new Object;            
            obj_ini.str_action="hideArchive";                                     
            if(bln_value){
              obj_ini.str_action="showArchive";                                     
            }            
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                       
            this.fn_formRunRowAction(obj_ini);            
          }          
          fn_formHideArchive(){                                          
            this.fn_formDisplayArchive(false);
          }
          hideArchive(){
            this.fn_navigateApp(true);            
          }
          //SHOW HIDE ARCHIVE
          ////////////////

          ////////////////
          //SHOW HIDE ROWZ
          fn_formShowRowz(){                                          
            this.fn_formDisplayRowz(true);
          }
          showRowz(){
            this.fn_navigateApp(true);            
          }
          fn_formDisplayRowz(bln_value){                                          

            let obj_ini=new Object;            
            obj_ini.str_action="hideRowz";                                     
            if(bln_value){
              obj_ini.str_action="showRowz";                                     
            }            
            obj_ini.str_nameFolderServer="xapp_dashboard_setting";                       
            this.fn_formRunRowAction(obj_ini);            
          }          
          fn_formHideRowz(){                                          
            this.fn_formDisplayRowz(false);
          }          
          hideRowz(){
            this.fn_navigateApp(true);            
          }
          //SHOW HIDE ROWZ
          ////////////////

          fn_navigateApp(bln_value){                               
            if(bln_value){
              obj_shared.fn_messageAlert("The application will now reload.");
            }            
            obj_path.fn_navigateSubdomain("app");                                                
          }

          fn_formRunRowAction(obj_ini){                                          

            let obj_menuButton=this.fn_getMenuButton();                              
            obj_ini.int_idMetaRowz=obj_menuButton.fn_getMenuRecordId();
            if(obj_ini.int_idMetaRowz){            
              this.fn_runServerAction(obj_ini);                                                                  
            }          
          }          
          
          fn_setSettingOperationPinDisplay(){
            
            this.fn_setMarkedParentSchemaName();
            this.fn_setMarkedParentTableName();
            this.fn_setMarkedParentRowzId();                                          
            this.fn_setMarkedParentViewId();
            
            let bln_menuView=this.obj_parentMenu.fn_getIsMenuWithView();            
            let bln_childrenOpen=this.obj_parentMenu.bln_childrenOpen;
            this.fn_toggle();             
            if(this.fn_getIsOpen()){
              if(bln_menuView){
                this.obj_parentMenu.fn_displayAccordionChildMenu(true);             
                this.obj_parentMenu.fn_displayAccordionView(false);
              }                            
              
              this.fn_setHiddenPin(false);                              
              //this.fn_setDisplay(true);                              
            }
            else{
              if(bln_menuView){
                this.obj_parentMenu.fn_displayAccordionChildMenu(false);
                this.obj_parentMenu.fn_displayAccordionView(true);                              
              }              
              this.fn_setHiddenPin(true);                            
              //this.fn_setDisplay(false);                              
            }                          
            this.obj_parentMenu.bln_childrenOpen=bln_childrenOpen;
          }          
          fn_setRowzOrder(int_value){
            this.obj_holder.int_rowzOrder=int_value;
          }    
          fn_getRowzOrder(){
            return this.obj_holder.int_rowzOrder;
          }
          fn_setSettingOperationPin(bln_value){                          
            if(bln_value){              
              if(this.obj_parentMenu){
                this.obj_parentMenu.fn_setSettingMenu(this);            
              }
            }
            
            this.obj_holder.bln_settingOperationPin=bln_value;
          }                         
          fn_getSettingOperationPin(){
            return this.obj_holder.bln_settingOperationPin;
          }    
          fn_getSettingPin(){
            return this.obj_holder.bln_settingPin;
          }
          fn_setSettingPin(bln_value){
            this.obj_holder.bln_settingPin=bln_value;
          }
          fn_setSettingMenu(obj_menu){                     
            this.obj_holder.obj_menuSetting=obj_menu;            
          }               
          fn_getSettingMenu(){
            return this.obj_holder.obj_menuSetting;            
          }    

          
          
          fn_resetMenu(){
            
            this.bln_flagRunOnce=false;    
            //this.fn_setQueryList("");  
            //this.obj_columnKey=false;            
          }  
        
          fn_resetContent(){        
        
            let obj_container;    
        
            obj_container=this.fn_getDataView();        
            if(obj_container){
              obj_container.fn_removeChildren();      
            }      
        
            obj_container=this.fn_getWidgetView();    
            if(obj_container){
              obj_container.fn_removeChildren();      
            }    
            
            obj_container=this.fn_getAccordionView();        
            if(obj_container){
              obj_container.fn_removeChildren();      
            }
          }              

          fn_onDataStart(obj_post){//overidden but called              
            this.obj_post=obj_post;
                             
            this.obj_meta.str_metaConstraintName=obj_post.MetaConstraintName;                                        
            
            //this.fn_debugText("this.bln_runSearch: " + this.bln_runSearch);
            if(this.bln_runSearch){
              this.fn_loadReportInterface();
            }
            this.bln_runSearch=false;             
            
          }
          fn_onDataEnd(obj_post){                          
            //console.log("xapp_menu fn_onDataEnd");
            

            let obj_container, obj_button, obj_button_hide;
            obj_container=this.obj_consoleContainerGeneral;

            let obj_metaColumn, bln_value;

            if(this.obj_meta.bln_displayDashboard){
              this.fn_refreshDashboards();    
            }      

            if(this.bln_hasShowRowButton){          
              if(this.obj_dataView){
                let obj_metaColumnParentRowzId=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ParentRowzId`");
                let int_value=obj_shared.fn_parseInt(obj_metaColumnParentRowzId.str_value);
                if(int_value===0){return};
              
                obj_metaColumn=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`HiddenPin`");                              
                bln_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_row_show");                                      
                obj_button_hide=obj_container.fn_getConsoleComponent("xapp_button_general_row_hide");                                          
                this.obj_consoleContainerGeneral.fn_displayTogglePair(obj_button, obj_button_hide, bln_value);
              }
            }  
            if(this.bln_hasShowArchiveButton){          
              if(this.obj_dataView){
                let obj_metaColumnParentRowzId=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ParentRowzId`");
                let int_value=obj_shared.fn_parseInt(obj_metaColumnParentRowzId.str_value);
                if(int_value===0){return};
              
                obj_metaColumn=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ArchivePin`");                              
                bln_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);
                bln_value=obj_shared.fn_toggleBool(bln_value);
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_archive_show");                                      
                obj_button_hide=obj_container.fn_getConsoleComponent("xapp_button_general_archive_hide");                                          
                this.obj_consoleContainerGeneral.fn_displayTogglePair(obj_button, obj_button_hide, bln_value);
              }
            }  
            if(this.bln_hasUseDateTimeButton){          
              if(this.obj_dataView){

                let obj_metaColumnParentRowzId=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`ParentRowzId`");
                let int_value=obj_shared.fn_parseInt(obj_metaColumnParentRowzId.str_value);
                if(int_value===0){return};
              
                obj_metaColumn=this.obj_dataView.fn_getMetaColumnViaName("`meta_rowz`.`meta_rowz`.`DateTimePin`");                              
                bln_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);
                
                

                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_use_task_date");                                          
                obj_button_hide=obj_container.fn_getConsoleComponent("xapp_button_general_use_task_datetime");                                          
                this.obj_consoleContainerGeneral.fn_displayTogglePair(obj_button, obj_button_hide, bln_value);                                
              }
            }  
            
            if(this.bln_hasShowFormUpButton){          
              if(this.obj_dataView){
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_form_up");                                                      
                obj_container.fn_showItem(obj_button);
              }
            }  
            if(this.bln_hasShowFormDownButton){          
              if(this.obj_dataView){
                
                obj_button=obj_container.fn_getConsoleComponent("xapp_button_general_form_down");                                                      
                obj_container.fn_showItem(obj_button);
              }
            }  
            
          }   
          fn_receiveColumn(obj_data, obj_column, obj_post){

            if(this.bln_dynamicMenu){//menuButton is generated from dataset
              if(obj_post.ReloadSection){
                this.fn_formCompleteRecord(true);
              }
              if(obj_column.obj_metaColumn.MenuPin){                
                this.fn_updateButtonText(obj_data);                               
              }
            }     
          }          

          fn_notifyChildControl(str_nameFunction, obj_arg){                                                                         
                
            this.fn_notifyDashboard(str_nameFunction, obj_arg);
            this.fn_notifyWidget(str_nameFunction, obj_arg);
            this.fn_notifyMenu(str_nameFunction, obj_arg);
          }
          
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
          //SET OBJECT REFERENCE
          //--------------------
          //SIGNPOST 2. menu fn_referenceObject
          //--------------------
          fn_referenceObject(){
        
            if(this.obj_holder.bln_referencedObject){
              //console.log("fn_referenceObject this.obj_holder.bln_referencedObject is true, return");
              //console.log("this.obj_menuPanel: " + this.obj_menuPanel);
              return;
            }    
            super.fn_referenceObject();             
            
            this.fn_setConsole();                    

            this.fn_setDashboardView();                        
            this.fn_setWidgetView();                        
            this.fn_setDataChildMenu();
            this.fn_setDataView();      
            
            this.fn_setAccordionChildMenu();                                   
            this.fn_setAccordionView();      

            this.fn_displayObject(false);
            
          }  
          fn_getMenuPanel(){   
            //console.log("xapp menu fn_getMenuPanel return this.obj_menuPanel"); 
            return this.obj_menuPanel;    
          }
          fn_createForm(){ 
            this.obj_form=this.fn_addContextItem("form_form");
            this.obj_form.fn_setDisplayFlex(true);
            this.obj_form.fn_setFlexDirection("column");    
          }
          fn_registerColumn(obj_column){
        
            this.obj_columnCurrent=obj_column;
          }                        
          fn_onChildSubmit(){                     
            
            //console.log("xapp_menu fn_onChildSubmit: " + obj_project.obj_itemEvent);              
        
                              
            this.fn_unsetEvent();                               

            
            //alert("xapp_menu fn_onChildSubmit");              
            
            this.fn_formViewRecord();//required to be on xapp_menu
          }
          
          
          fn_setMenuPanel(){     
            if(this.obj_menuPanel){
              return;
            }                
              
            this.fn_createForm();              
            this.obj_menuPanel=this.obj_form.fn_addContextItem("xapp_menu_panel");                      
            
            this.obj_menuPanel.obj_parentMenu=this; 
            
            ////ContainerSearch
            this.obj_consoleContainerSearch=this.obj_menuPanel.fn_addConsoleContainer("xapp_form_container_search", false);                                        
            this.obj_console_search=this.obj_consoleContainerSearch.fn_getConsoleComponent("xapp_console_search");
            //obj_console_search
            ////ContainerSearch
            
            
            
            ////ContainerGeneral
            this.obj_consoleContainerGeneral=this.obj_menuPanel.fn_addConsoleContainer("xapp_console_container_general", true);            
            //obj_button_navigate_desktop
            //obj_button_setting
            //obj_button_newrow
            //obj_button_newcolumn            
            //obj_button_row_hide            
            //obj_button_row_show            
            //obj_button_archive_hide            
            //obj_button_archive_show                        
            //obj_button_navigate_office
            //obj_button_navigate_lobby            
            ////ContainerGeneral

            ////ContainerLeft
            this.obj_consoleContainerGeneralLeft=this.obj_menuPanel.fn_addConsoleContainer("xapp_console_container_general", false);
            //obj_button_navigate_login            
            ////ContainerLeft
          }
          //CRUD CONSOLE
          fn_setConsole(){    
            if(this.obj_console){return;}    
            this.obj_console=this.obj_menuPanel.fn_getComponent("xapp_console");                             
            //this.obj_console.fn_setBorder("1.0em solid pink");
          }                                  
          //CRUD CONSOLE
          
          //CRUD VIEW REFERENCE
          //VIEW DASHBOARD
          fn_setDashboardView(){    
            if(this.arr_dashboardView){return;}    
            let obj_container=this.obj_menuPanel;    
            if(!obj_container){return;}   
            
            if(!this.obj_meta.bln_displayDashboard){return;}            
        
            //obj_container=this.obj_menuPanelDashboard;
            obj_container=this.obj_menuPanel;              
            if(!obj_container){return;}   
            let str_metaType="xapp_dashboard";
            if(this.obj_meta.str_metaTypeDashboard){
              str_metaType=this.obj_meta.str_metaTypeDashboard;
            }
            this.arr_dashboardView=[];
            let arr_type=str_metaType.split(";");
            for(let i=0;i<arr_type.length;i++){
              let str_type=arr_type[i].trim();            
              str_type=str_type.replace(/\s/g, '');
              if(!str_type){continue;}                      
              let bln_debug=false;                                
              //if(str_type==="upgrade_dashboard"){bln_debug=true;}                                
              let obj_dashboard=obj_container.fn_addContextItem(str_type);                         
              //*
              if(this.fn_getDebugPin()){
                //console.log("str_type: " + str_type);
                //console.log("obj_dashboard: " + obj_dashboard);
              } 
              //*/                                      
              if(obj_dashboard){
                obj_dashboard.obj_holder.bln_debugServer=this.obj_holder.bln_debugServer;
                this.arr_dashboardView.push(obj_dashboard);
                obj_dashboard.obj_holder.obj_parentMenu=this;                  
                //Dashboard is displayed in fn_displayDashboard
              }              
              else{
                //console.log("Error Loading Dashboard: Check for Typos and Context Holders are in place");
              }
            }
            
            
          } 
          fn_getDashboardView(){
            return this.arr_dashboardView;
          } 
          //VIEW DASHBOARD  
          //VIEW DATA
          fn_setDataViewCount(){
            if(!this.obj_meta.bln_runDataView){return;}                
            //if(this.obj_dataView){return;}    
            this.obj_dataView=this.fn_addContextItem(this.obj_meta.str_metaTypeData);            
            this.obj_dataView.fn_setDisplay(false);
          }
          fn_setDataView(){    
            //if(this.obj_dataView){return;}    
            let obj_container=this.obj_menuPanel;
            if(!obj_container){return;}            
            if(!this.obj_meta.bln_runDataView){return;}                
            this.obj_dataView=obj_container.fn_addContextItem(this.obj_meta.str_metaTypeData);            
          }
          fn_getDataView(){
            return this.obj_dataView;
          } 
          //VIEW DATA
          //VIEW WIDGET
          fn_setWidgetView(){    
            if(this.obj_containerWidgetView){return;}    
            let obj_container=this.obj_menuPanel;
            if(!obj_container){return;}             
            if(!this.obj_meta.bln_displayWidget){return;}            
        
            //obj_container=this.obj_menuPanelDashboard;
            obj_container=this.obj_menuPanel;
            if(!obj_container){return;}   
        
            let str_metaType="xapp_widgetboard";
            if(this.obj_meta.str_metaTypeWidget){
              str_metaType=this.obj_meta.str_metaTypeWidget;
            }              
            this.obj_containerWidgetView=obj_container.fn_addContextItem(str_metaType);                          
          } 
          fn_getWidgetView(){
            return this.obj_containerWidgetView;
          } 
          fn_notifyWidget(str_nameFunction, obj_arg){
            this.fn_notify(this.obj_containerWidgetView, str_nameFunction, obj_arg);
          }
          //VIEW WIDGET
          //VIEW ACCORDION
          fn_setAccordionView(){
            if(this.obj_accordionView){return;}        
            let str_metaType="xapp_accordion";
            this.obj_accordionView=this.fn_addContextItem(str_metaType);                          
          }     
          fn_getAccordionView(){    
            return this.obj_accordionView;
          }
          //VIEW ACCORDION
          //CRUD VIEW REFERENCE  
          //CRUD CHILDMENU REFERENCE
          //CHILDMENU DATA
          fn_setDataChildMenu(){
            //Standard Menu System - not dynamic
            if(this.obj_dataChildMenu){return;}    
            let obj_container=this.obj_menuPanel;    
            if(!obj_container){
              //console.log("fn_setDataChildMenu this.obj_menuPanel is false, return");
              return;
            }                   
            
            this.obj_dataChildMenu=obj_container.fn_addContextItemOnce(this.str_defaultTypeDataChildMenu);
            if(!this.obj_dataChildMenu){
              //console.log("this.obj_dataChildMenu: " + this.obj_dataChildMenu);
              //console.log("this.str_defaultTypeDataChildMenu: " + this.str_defaultTypeDataChildMenu);
            }
            
          }
          fn_getDataMenu(){
            return this.obj_dataChildMenu;
          } 
          //CHILDMENU DATA  
          //CHILDMENU ACCORDION
          fn_setAccordionChildMenu(){
            super.fn_setAccordionChildMenu();
          }     
          fn_getAccordionChildMenu(){    
            return super.fn_getAccordionChildMenu();
          }
          //CHILDMENU ACCORDION
          //CRUD CHILDMENU REFERENCE
          //SET OBJECT REFERENCE 
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //CONFIGURE OBJECT
        fn_configureObject(bln_value){        
        
          //CRUD VIEW
          this.obj_meta.bln_runDataView=bln_value;    
          this.obj_meta.bln_displayDashboard=bln_value;    
          this.obj_meta.bln_displayData=bln_value;
          this.obj_meta.bln_displayWidget=bln_value;        
          this.obj_meta.bln_displayAccordionView=bln_value;                                
          //CRUD VIEW
        
          //CRUD CHILDMENU
          this.obj_meta.bln_runDataChildMenu=bln_value;      
          this.obj_meta.bln_displayDataChildMenu=bln_value;  
          this.obj_meta.bln_displayAccordionChildMenu=bln_value;   
          //CRUD CHILDMENU
          
          this.fn_configureMenuPanel();           
        }  
        //MENU PANEL
        fn_configureMenuPanel(){ 
          let bln_value=false;
          this.obj_meta.bln_displayMenuPanel=false;      
          if(this.obj_meta.bln_displayDashboard){bln_value=true;}      
          if(this.obj_meta.bln_displayData){bln_value=true;}
          if(this.obj_meta.bln_displayWidget){bln_value=true;}      
          if(this.obj_meta.bln_displayDataChildMenu){bln_value=true;}    
          if(this.obj_meta.bln_displayAccordionView){bln_value=true;}      
          if(this.obj_meta.bln_displayConsole){bln_value=true;}                 
          this.obj_meta.bln_displayMenuPanel=bln_value;      
        }
        //MENU PANEL
        //CONFIGURE OBJECT
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //CONFIGURE OPTION  
          //CRUD VIEW    
          //CRUD VIEW      
          //CRUD CHILDMENU
          fn_configureOptionChildMenu(){
        
            
            this.obj_meta.bln_runDataChildMenu=true;            
            this.obj_meta.bln_displayDataChildMenu=false;
            this.obj_meta.bln_displayAccordionChildMenu=true;
            
          }      
          
          //CRUD CHILDMENU   
          fn_configureMetaFromRow(obj_row){               
            if(!obj_row){return;}//can be false at top level   
            
            //when making changes here, consider that the  dynamic menu may need to have similar function applied
            //in crud menu operation fn_configureDynamicMenuFromRow
            this.obj_meta.bln_runDataView=true;       
            this.fn_configureOptionChildMenu();     
                          
            let obj_metaColumn, foo_value, str_metaType;           
            let obj_recordset=obj_row.obj_paramRS.obj_recordset;                

            
            
            //START VIEW               
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzUserId");
            if(obj_metaColumn){                                      
              this.obj_meta.int_MetaRowzUserId=obj_shared.fn_parseInt(obj_metaColumn.str_value);                
            }                      
  
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaSchemaName");
            if(obj_metaColumn){                                    
              this.fn_setMetaSchemaName(obj_metaColumn.str_value);
            }                      
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTableName");
            if(obj_metaColumn){                                      
              this.fn_setMetaTableName(obj_metaColumn.str_value);
            }                      
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTableKeyField");              
            if(obj_metaColumn){                      
              this.obj_meta.str_MetaTableKeyField=obj_metaColumn.str_value;      
            }                      
            else{
              alert("wont see");
            }              
            //END VIEW 

            //START MENU
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzGroup");
            if(obj_metaColumn){                                    
              this.fn_setMetaRowzGroup(obj_metaColumn.str_value);                
            }        

            //START MENU
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("DebugPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              if(this.fn_getDebugPin()){
                foo_value=true;
              }
              this.fn_setDebugPin(foo_value);                                

            }    


            //START MENU
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("PublishPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setPublishPin(foo_value);
            }    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("RowzOrder");//ahead of setting
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseInt(obj_metaColumn.str_value);                                  
              this.fn_setRowzOrder(foo_value);              
            }    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("RowzIcon");
            //console.log("obj_metaColumn: " + obj_metaColumn);
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){                                        
                  this.fn_showIcon(foo_value);          
                }     
            }

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("SettingOperationPin");
            
            if(obj_metaColumn){                  
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              //this.fn_debugText(obj_metaColumn.str_value + ": " + foo_value);
              this.fn_setSettingOperationPin(foo_value);
              if(this.fn_getSettingOperationPin()){
                let int_rowzOrder=this.fn_getRowzOrder();                
                if(int_rowzOrder===0){
                  this.fn_displayOn=new Function;
                  this.fn_displayOff=new Function;
                  this.fn_onClick=new Function;
                }
                //this.fn_displayOn=false; 
                //this.fn_displayOff=false; 
                //this.fn_methodPeers=new Function();        
                //this.fn_methodPeersVertical=new Function();        
              }
            }

            
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("DynamicMenuPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setDynamicMenuPin(foo_value);              
            }    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("TemporaryRowzPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setTemporaryRowzPin(foo_value);

            }    
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaViewName");    
            if(obj_metaColumn){                              
              foo_value=obj_metaColumn.str_value;      
              this.obj_meta.str_metaViewName=foo_value;                

              /*
              this.obj_meta.str_text=foo_value;              
              this.bln_applyAnchor=true;  
              this.fn_setName(foo_value);      
              this.fn_setText(foo_value);      
              //*/                        
            }              

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzName");    
            if(obj_metaColumn){                              
              foo_value=obj_metaColumn.str_value;                                      
              this.fn_setMetaRowzName(foo_value);                          
              this.bln_applyAnchor=true;      
              this.obj_meta.str_text=foo_value;                                          
              this.fn_setText(foo_value);                    
              this.fn_setName(foo_value);                
            }              
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzTitle");    
            if(obj_metaColumn){                              
              foo_value=obj_metaColumn.str_value;                    
              this.obj_meta.str_text=foo_value;              
              this.fn_setText(foo_value);       
              this.fn_setMetaRowzTitle(foo_value);                
            }              

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaRowzId");
            if(obj_metaColumn){            
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);                
              this.fn_setMetaRowzId(foo_value);                
            }                    

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaViewId");
            if(obj_metaColumn){            
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);                
              this.fn_setMetaViewId(foo_value);                
            }                 

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ParentRowzId");
            if(obj_metaColumn){                      
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);
              this.fn_setParentRowzId(foo_value);
            }        
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaViewId");                            
            if(obj_metaColumn){      
              foo_value=obj_shared.fn_cleanId(obj_metaColumn.str_value);
              this.fn_setMetaViewId(foo_value);                
            }                
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ViewPin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                  
              this.fn_setViewPin(foo_value);
            }  
              
            
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("JoinType");
            if(obj_metaColumn){            
              foo_value=obj_shared.fn_parseInt(obj_metaColumn.str_value);               
              this.obj_meta.int_joinType=foo_value;                  
            }                               
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewMenu");                  
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                //if there is any entry in view, then we are going get rs described in menu
                if(foo_value && foo_value===this.str_optionMenu){                                      
                  this.obj_meta.bln_displayAccordionView=true;
                } 
            }   
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeMenu");    
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){                                                  
                  this.obj_meta.str_metaTypeMenu=foo_value;//allow overide default type MenuForm)
                }
            }                
            
            //reportview
            this.obj_meta.str_metaTypeData=this.str_defaultTypeData;                                
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewReport");    
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){          
                  if(foo_value===this.str_optionReport){foo_value="xapp_report_view";}                    
                  this.obj_meta.str_metaTypeData=foo_value;     
                  this.obj_meta.bln_displayData=true;//why is this true
                  this.obj_meta.bln_displayReport=true;        
                } 
            }    
            
            //dataview              
            this.obj_meta.str_metaTypeData=this.str_defaultTypeData;                                              
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewData");    
            if(obj_metaColumn){
                foo_value=obj_metaColumn.str_value;
                if(foo_value){
                  if(foo_value===this.str_optionData){foo_value=this.str_defaultTypeData;}                    
                  this.obj_meta.str_metaTypeData=foo_value;                   
                  this.obj_meta.bln_displayData=true;
                  this.obj_meta.bln_displayReport=false;                                                       
                }        
            }            
            
            this.obj_meta.str_metaTypeWidget="xapp_widgetboard";                                
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewWidget");//set to view widget
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){
                  if(foo_value===this.str_optionWidget){foo_value="xapp_widgetboard";}                    
                  this.obj_meta.str_metaTypeWidget=foo_value;     
                  this.obj_meta.bln_displayWidget=true;                            
                } 
            }     
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeRowzWidget");//overide view widget with rowz
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){
                  if(foo_value===this.str_optionWidget){foo_value="xapp_widgetboard";}                    
                  this.obj_meta.str_metaTypeWidget=foo_value;     
                  this.obj_meta.bln_displayWidget=true;                            
                } 
            }     

            this.obj_meta.str_metaTypeDashboard="xapp_dashboard";                                
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeViewDashboard");//set to view dashboard
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){          
                  if(foo_value===this.str_optionDashboard){foo_value="xapp_dashboard";}                    
                  this.obj_meta.str_metaTypeDashboard=foo_value;                                          
                  this.obj_meta.bln_displayDashboard=true;
                }     
            }
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaTypeRowzDashboard");//overide view dashboard with rowz
            if(obj_metaColumn){    
                foo_value=obj_metaColumn.str_value;        
                if(foo_value){          
                  if(foo_value===this.str_optionDashboard){foo_value="xapp_dashboard";}                    
                  this.obj_meta.str_metaTypeDashboard=foo_value;                                          
                  this.obj_meta.bln_displayDashboard=true;
                }     
            }
            

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("MetaPermissionTag");
            if(obj_metaColumn){                                    
              this.obj_meta.MetaPermissionTag=obj_metaColumn.str_value;      
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("LivePin");
            if(obj_metaColumn){    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                                
              this.fn_setLivePin(foo_value);                                
            }    
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("HiddenPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              this.fn_setHiddenPin(foo_value);                
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ArchivePin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                               
              this.fn_setArchivePin(foo_value);
            }        

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("AdminPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                               
              this.fn_setAdminPin(foo_value);
            }        

            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("LockOpenPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                               
              this.fn_setLockOpenPin(foo_value);
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("DisabledPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              this.fn_setDisabledPin(foo_value);
            }        
            
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("AutoOpenPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                                             
              this.fn_setAutoOpenPin(foo_value);                
            }        
            
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("AutoFetchPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              if(obj_project.obj_design.bln_autoFetch)foo_value=true;
              this.fn_setAutoFetch(foo_value);
            }        
            //*
            if(this.fn_getDebugPin()){
              this.fn_setAutoFetch(true);
            }              
            
        
            /*
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("RolodexPin");
            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);               
              this.obj_meta.bln_rolodexPin=foo_value;      
            } 
            //*/

            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("SettingPin");

            if(obj_metaColumn){                    
              foo_value=obj_shared.fn_parseBool(obj_metaColumn.str_value);                               
              this.fn_setSettingPin(foo_value);
            }        
        
            obj_metaColumn=obj_recordset.fn_getMetaColumnViaName("ButtonConsole");
            if(obj_metaColumn){                          
              foo_value=obj_metaColumn.str_value;
              let str_buttonConsole="";                  
              if(foo_value){        
                str_buttonConsole=foo_value;                
              }       
              if(this.obj_meta.bln_displayAccordionView && foo_value.search("XSearch")===-1){        
                str_buttonConsole+=",";
                //str_buttonConsole+="Search, Record";        
              } 
        
              if(this.obj_meta.bln_displayData){        
                str_buttonConsole+=",";
                //str_buttonConsole+="Record";        
              }                  
              
              if(foo_value.search("XRecord")===-1){}
              else{        
                //str_buttonConsole=str_buttonConsole.replace('Record', '');
                //str_buttonConsole=str_buttonConsole.replace('Search', '');                
              } 
              this.obj_meta.str_buttonConsole=str_buttonConsole;                 
            }                     
          }     
          
          fn_setMetaSchemaName(str_value){
            this.obj_meta.str_metaSchemaName=str_value;      
          }                   
          fn_getMetaSchemaName(){            
            return this.obj_meta.str_metaSchemaName;
          }                                
          fn_setMetaTableName(str_value){
            this.obj_meta.str_metaTableName=str_value;      
          }                   
          fn_getMetaTableName(){            
            return this.obj_meta.str_metaTableName;
          }                                

          fn_setMetaViewId(int_value){           
            this.obj_meta.int_idMetaView=int_value;            
          }
          fn_getMetaViewId(){           
            return this.obj_meta.int_idMetaView;            
          }
          fn_setParentRowzId(int_value){            
            this.obj_meta.int_idParentMetaRowz=int_value;               
          }
          fn_getParentRowzId(){
            return this.obj_meta.int_idParentMetaRowz;            
          }
          fn_setMetaRowzId(int_value){           
            this.obj_meta.int_idMetaRowz=int_value;            
          }
          fn_getMetaRowzId(){           
            return this.obj_meta.int_idMetaRowz;            
          }          
          fn_setMetaRowzName(str_value){           
            this.obj_meta.str_metaRowzName=str_value;            
          }
          fn_getMetaRowzName(){           
            return this.obj_meta.str_metaRowzName;
          }
          fn_setMetaRowzTitle(str_value){           
            this.obj_meta.str_metaRowzTitle=str_value;            
          }
          fn_getMetaRowzTitle(){           
            return this.obj_meta.str_metaRowzTitle;
          }
          

          fn_getMenuButtonViaViewIdGoNorth(int_idMetaView){        
      
            let int_idMetaViewCurrent=this.fn_getMetaViewId(true);              
            if(String(int_idMetaView)===String(int_idMetaViewCurrent)){              
              return this;
            }              
            
            let obj_parent=this.fn_getMenuParent();              
            if(obj_parent){
                return obj_parent.fn_getMenuButtonViaViewIdGoNorth(int_idMetaView);
            }            
            return false;
        }
          
          
          //CONFIGURE OPTION
        
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////
        //DISPLAY OBJECT  
        fn_displayObject(bln_value){                    

          //this.fn_debugText("fn_displayObject");            
          
          this.fn_displayView(bln_value);         
          this.fn_displayChildMenu(bln_value);      
          this.fn_displayMenuPanel(bln_value);           
        }  
        
        //CRUD VIEW        
        fn_displayView(bln_value){
          this.fn_displayDashboard(bln_value);  
          this.fn_displayData(bln_value);  
          this.fn_displayWidget(bln_value);  
          this.fn_displayAccordionView(bln_value);
        }
        fn_displayDashboard(bln_value=this.obj_meta.bln_displayDashboard){
          let arr_item=this.fn_getDashboardView();    
          if(!arr_item){return;}
          for(let i=0;i<arr_item.length;i++){
            let obj_dashboard=arr_item[i];
            if(obj_dashboard && obj_dashboard.obj_design.arr_item.length){                
              obj_dashboard.fn_setDisplayFlex(bln_value);              
            }  
          }
          
          
        }
        fn_displayData(bln_value=this.obj_meta.bln_displayData){        
          //console.log("this.obj_meta.bln_displayData: " + this.obj_meta.bln_displayData);
          //console.log("(this.obj_dataView: " + this.obj_dataView);            
          if(this.obj_dataView){      
            this.obj_dataView.fn_setDisplayFlex(bln_value);                                                        
          }
                         
        }
        fn_displayWidget(bln_value=this.obj_meta.bln_displayWidget){
          let obj_container=this.fn_getWidgetView();    
          if(obj_container){        
            obj_container.fn_setDisplayFlex(bln_value);                  
          }  
        }
        
        fn_displayAccordionView(bln_value=this.obj_meta.bln_displayAccordionView){    
          
          let obj_container=this.fn_getAccordionView();    
          if(obj_container){                            
            obj_container.fn_setDisplay(bln_value);              
          }  
        }   
        //CRUD VIEW
        
        //CRUD CHILDMENU        
        fn_displayChildMenu(bln_value){  
          this.fn_displayDataChildMenu(bln_value);  
          this.fn_displayAccordionChildMenu(bln_value);  
        }
        fn_displayDataChildMenu(bln_value=this.obj_meta.bln_displayDataChildMenu){          
          //bln_value=true;
          if(this.obj_dataChildMenu){      
            this.obj_dataChildMenu.fn_setDisplayFlex(bln_value);              
          }              
        }

        fn_displayAccordionChildMenu(bln_value=this.obj_meta.bln_displayAccordionChildMenu){    
          
          let obj_container=this.fn_getAccordionChildMenu();    
          if(obj_container){
            obj_container.fn_setDisplay(bln_value);                
          }              
        }   

        //CHILDMENU MENU
        //CRUD CONSOLE
        fn_displayConsole(){ 

          //this.fn_debugText("fn_displayConsole");

          
          this.obj_holder.obj_itemConsole=new Set(this.obj_meta.arr_buttonConsole);        
          
          this.fn_getConsoleValues();
          
          let bln_value=false;
          if(this.obj_holder.obj_itemConsole.size){
            bln_value=true;
          }    
          this.obj_meta.bln_displayConsole=bln_value;          

          if(this.obj_console){
            this.obj_console.fn_setDisplayFlex(bln_value);
          }
        }
        
        fn_getConsoleValues(){          

          if(this.obj_holder.bln_displayedConsole){return;}
          this.obj_holder.bln_displayedConsole=true;                    
          
          if(this.fn_getConsoleValue("Login")){this.bln_hasLoginButton=true;}                
          if(this.fn_getConsoleValue("Office")){this.bln_hasOfficeButton=true;}
          
          //this.fn_debugText(this.fn_getSettingPin());
          if(this.fn_getSettingPin()){
            this.bln_hasSettingButton=true;
          }
          //if(this.fn_getConsoleValue("Setting")){this.bln_hasSettingButton=true;}
          if(this.fn_getConsoleValue("NewRow")){this.bln_hasNewRowButton=true;}
          if(this.fn_getConsoleValue("NewColumn")){this.bln_hasNewColumnButton=true;}                    
          if(this.fn_getConsoleValue("UseDateTime")){this.bln_hasUseDateTimeButton=true;}                    

          if(this.fn_getConsoleValue("ShowArchive")){this.bln_hasShowArchiveButton=true;}
          if(this.fn_getConsoleValue("ShowRow")){this.bln_hasShowRowButton=true;}
          if(this.fn_getConsoleValue("Exit")){this.bln_hasExitButton=true;}  

          if(this.fn_getConsoleValue("FormUp")){this.bln_hasShowFormUpButton=true;}
          if(this.fn_getConsoleValue("FormDown")){this.bln_hasShowFormDownButton=true;}
          if(this.fn_getConsoleValue("FormGap")){this.bln_hasShowFormGapButton=true;}
          
          this.bln_simpleSearch=false;
          this.bln_advancedSearch=false;
          if(this.fn_getConsoleValue("Search")){this.bln_hasSearchButton=true;
            this.bln_advancedSearch=true;
          }  
          if(this.fn_getConsoleValue("SimpleSearch")){
            this.bln_hasSearchButton=true;
            this.bln_simpleSearch=true;
            this.bln_advancedSearch=false;
                        
          }  
          
          if(this.fn_getViewPin()){                        

            let bln_isAdmin=obj_permitManger.fn_isAdmin();              
            if(bln_isAdmin){
              
              
            }
            else{
              //this.fn_debugText("user is not admin");
            }
          }
          else{
            
            //this.bln_hasSettingButton=true;
            //this.bln_hasExitButton=true;
          }
        }
        
        fn_setDisplayConsoleItem(str_control, str_value){  
          let obj_control=this.obj_console.fn_getItemGoSouth(str_control);    
          
          let bln_value=this.fn_getConsoleValue(str_value);    
          if(obj_control){obj_control.fn_setDisplayFlex(bln_value);}
        }
        fn_getConsoleValue(str_value){
          return this.obj_holder.obj_itemConsole.has(str_value);
        }
        fn_getConsoleItem(str_value, str_control){
          if(this.fn_getConsoleValue(str_value)){
            let obj_control=this.obj_console.fn_getItemGoSouth(str_control);    
            return obj_control;          
          }
        }
        //CRUD CONSOLE  
        
        
        fn_displayMenuPanel(bln_value){            

          //this.fn_debugText("fn_displayMenuPanel");
          
          
          if(bln_value===undefined){
            bln_value=this.obj_meta.bln_displayMenuPanel;    
          }
          
          this.fn_displayConsole();    
        
          
        
          bln_value=false;

          
          if(this.obj_meta.bln_displayData){                
            bln_value=true;
          }          
          
          if(this.obj_meta.bln_displayDashboard){                
            bln_value=true;
          }
          if(this.obj_meta.bln_displayWidget){                
            bln_value=true;
          }
          if(this.obj_meta.bln_displayConsole){                    
            bln_value=true;
          }
          
          super.fn_displayMenuPanel(bln_value);   
          
          
        }
        
        
        //DISPLAY OBJECT    
        
        
        
        
            //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //OPERATION
        //CRUDMENUOPERATION
        //*
        fn_onDataStartChildMenu(){


        }
        fn_onDataEndChildMenu(obj_post){    
          //----------------------------------------  
          //SIGNPOST 4. When that data rs ends, run data View
          //----------------------------------------            

          //this.fn_debugText("fn_onDataEndChildMenu");

          //console.log("xxxx fn_onDataEndChildMenu");

          //this.fn_debugText("fn_onDataEndChildMenu");

          if(this.fn_getDebugPin()){
            //alert("123");
          }
          
          //this.fn_debugText("this.obj_meta.bln_runDataView: " + this.obj_meta.bln_runDataView);
          if(this.obj_meta.bln_runDataView){            
            this.fn_formViewRecord();            
            
            //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
            //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
            //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
            //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"            
          }                    
          else{
            //for example CRUD top level object            
            this.fn_runClient();
          }        
          //let obj_container=this.fn_getAccordionChildMenu();            
          //let obj_hardrule=obj_container  .fn_addContextItem("form_hardrule");                        
          
          if(this.bln_isAppRoot){
            let obj_item=this.fn_getOnlyStandardMenu();                            
            if(obj_item){              
                obj_item.fn_setLockOpenPin(true);
                obj_item.fn_open();              
            }            
          }

          //Loop thru Standard Menu to check if one of them should be opened
          //let obj_post=this.obj_dataChildMenu.obj_post;
          let str_URLNavigateMenu=obj_post.URLNavigateMenu;            
          if(str_URLNavigateMenu){                          
            let arr_item=this.fn_getArrayStandardMenu();                                                    
            for(let i=0;i<arr_item.length;i++){      
                let obj_item=arr_item[i];                                                  
                let obj_compare=obj_path.fn_compareURLNavigateMenuName(obj_item.obj_meta.str_metaRowzName, str_URLNavigateMenu);
                if(obj_compare.bln_applyURL){                  
                  obj_item.fn_open();
                  break;
                }                    
            }
          }
          
          
        }
          //RECORDSET LEVEL  
        //ROW LEVEL
        fn_onComputeRowChildMenu(obj_row){               
          
          
          if(this.obj_meta.bln_displayAccordionChildMenu){
            let obj_item=this.fn_addStandardMenuToAccordion(obj_row);
            if(obj_row.obj_paramRS.bln_lastRow){
              let obj_container=this.fn_getAccordionChildMenu();
              obj_container.fn_setStyleProperty("margin-bottom", "1.0em");
              
            }
          }        
        }      
        //ROW LEVEL
        //CHILDMENU
        
        //VIEW
        //RECORDSET LEVEL
        //----------------------------------------
        //SIGNPOST 9. obj_dataView fn_onDataStartView
        //----------------------------------------
        //if bln_displayAccordionView then bln_displayAccordionChildMenu = false
        //i.e. if we have a dynamci menu , then turn off standard Child Menu
        fn_onDataStartView(){    
          this.startTime=new Date();            
          
          //if dynamic menu is on , turn off standard menu display          
          if(this.obj_meta.bln_displayAccordionView){                  
            this.obj_meta.bln_displayAccordionChildMenu=false;
          }          
        }
        
        fn_onDataEndView(obj_post){                    

          //this.fn_debugText("START xapp_menu fn_onDataEndView: ");
        
          this.fn_runClient();
          if(!this.obj_dataView.obj_paramRS){
            return;
          }
          this.endTime=new Date();

          
          
          let str_milliseconds=obj_shared.fn_timeDifference(this.startTime, this.endTime); 
          let str_seconds=obj_shared.fn_millisecondsToSeconds(str_milliseconds) + " seconds";    
          
          let str_text=this.obj_dataView.obj_paramRS.int_totalRowReturned + " rows of data returned in " + str_seconds;            
          this.fn_debugText(str_text);

          
          
          
          this.fn_addDataSummary(); 
          
          //If the only dynamic menu then open
          if(this.obj_meta.bln_displayAccordionView){              
            let obj_item=this.fn_getOnlyDynamicMenu();
            
            if(obj_item){
              //this.fn_debugText("Only Dynamic Menu, Open");            
              obj_item.fn_open();
            } 
          }
          
          //If the only child menu then open
          if(this.obj_meta.bln_displayAccordionChildMenu){              
            let obj_item=this.fn_getOnlyStandardMenu();                            
            if(obj_item){
              //this.fn_debugText("Only Standard Menu, Open");                
              obj_item.fn_open();
            } 
          }   
          
          //let obj_hardrule=this.fn_addContextItem("form_hardrule");                              
        }

        
        fn_dataNavBack(){
          //console.log("fn_dataNavBack");
          this.bln_flagRunOnce=false;            
          //this.fn_debugText("int_numRowBack: " + this.int_numRowBack);
          this.obj_dataView.fn_setLimitRowStart(this.int_numRowBack);                         
          this.bln_dataNavToggle=true;
          
          this.fn_runMenu();         
        }
        fn_dataNavForward(){
          //console.log("fn_dataNavForward");
          this.bln_flagRunOnce=false;            
          this.bln_dataNavToggle=false;
          //this.fn_debugText("int_numRowForward: " + this.int_numRowForward);
          this.obj_dataView.fn_setLimitRowStart(this.int_numRowForward);                         
          
          this.fn_runMenu();         
        }
        fn_dataNavToggle(){
          //console.log("fn_dataNavToggle");
          this.bln_flagRunOnce=false;                        
          
          let int_currentRowStart;            
          if(this.bln_dataNavToggle){//true, go to start
            int_currentRowStart=0;            
            this.bln_dataNavToggle=false;
          }
          else{//False , go to end
            let int_mod=this.int_totalRowCount%this.int_limitRowPerPage;
            if(int_mod===0){int_mod=this.int_limitRowPerPage;}
            int_currentRowStart=this.int_totalRowCount-(int_mod);              
            this.bln_dataNavToggle=true;
          }

          //this.fn_debugText("int_currentRowStart: " + int_currentRowStart);
          this.obj_dataView.fn_setLimitRowStart(int_currentRowStart);                         
          
          
          this.fn_runMenu();         
        }

        fn_calculateDataSummary(){
          //console.log("fn_calculateDataSummary");

          let str_displaySummary="";
          let bln_enableButtonDataBack=true;
          let bln_enableButtonDataForward=true;                        
          let bln_enableButtonDataToggle=true;                        
          let bln_displayDataSummary=false;
          let bln_displayDataNavButton=false;                                    
          
          let int_totalRowCount=this.obj_dataView.obj_paramRS.int_totalRowCount;
          let int_totalRowReturned=this.obj_dataView.obj_paramRS.int_totalRowReturned;            
          let int_limitRowPerPage=this.obj_dataView.fn_getLimitRowPerPage();
          let int_currentRowStart=this.obj_dataView.fn_getLimitRowStart();                                     
          
          let int_numRowFrom=int_currentRowStart+1;                                    
          let int_numRowTo=int_currentRowStart+int_limitRowPerPage;                                                

          let int_numRowBack=int_currentRowStart-int_limitRowPerPage;            
          if(int_numRowBack<0){
            int_numRowBack=0;
            bln_enableButtonDataBack=false;
            this.bln_dataNavToggle=false;
          }                                    
          let int_numRowForward=int_numRowTo;
          if(int_numRowTo>=int_totalRowCount){
            int_numRowTo=int_totalRowCount;            
            int_numRowForward=int_currentRowStart;
            bln_enableButtonDataForward=false;
            this.bln_dataNavToggle=true;
            
          }            
          
          //let str_title=obj_shared.fn_capitalizeTheFirstLetterOfEachWord(this.obj_meta.str_metaRowzTitle);
          let str_title=this.obj_meta.str_metaRowzTitle;
          
          if(!int_totalRowReturned){
            int_totalRowReturned=0;
          }
          
          if(int_totalRowCount>int_limitRowPerPage){            
            bln_displayDataSummary=true;
            bln_displayDataNavButton=true;
            str_displaySummary+=int_numRowFrom + "-" + int_numRowTo + " of " + int_totalRowCount +" ";
          }            
          else{              
            str_displaySummary+=int_totalRowReturned + " ";                      
            bln_enableButtonDataToggle=false;
          }             
          str_displaySummary+=str_title + " ";

          if(int_totalRowReturned===0){      
            bln_displayDataSummary=true;
          }            


          this.str_dataSummary=str_displaySummary;                        

          this.bln_enableButtonDataBack=bln_enableButtonDataBack;
          this.bln_enableButtonDataForward=bln_enableButtonDataForward;                        
          this.bln_enableButtonDataToggle=bln_enableButtonDataToggle;                                    
          this.bln_displayDataSummary=bln_displayDataSummary;
          this.bln_displayDataNavButton=bln_displayDataNavButton;                                    
          
          this.int_totalRowCount=int_totalRowCount;
          this.int_totalRowReturned=int_totalRowReturned;
          this.int_limitRowPerPage=int_limitRowPerPage;
          this.int_currentRowStart=int_currentRowStart;
          this.int_numRowFrom=int_numRowFrom;            
          this.int_numRowTo=int_numRowTo;            
          this.int_numRowBack=int_numRowBack;
          this.int_numRowForward=int_numRowForward;

          /*
          this.fn_debugText("int_totalRowCount: " + this.int_totalRowCount);
          this.fn_debugText("int_totalRowReturned: " + this.int_totalRowReturned);
          this.fn_debugText("int_limitRowPerPage: " + this.int_limitRowPerPage);
          this.fn_debugText("int_currentRowStart: " + this.int_currentRowStart);
          this.fn_debugText("int_numRowFrom: " + this.int_numRowFrom);
          this.fn_debugText("int_numRowTo: " + this.int_numRowTo);
          this.fn_debugText("int_numRowBack: " + this.int_numRowBack);
          this.fn_debugText("int_numRowForward: " + this.int_numRowForward);
          //*/

          
        }
        fn_calculateDataSummaryView(){            

          let int_totalRowReturned=this.obj_dataView.obj_paramRS.int_totalRowReturned;
          let int_limitRowPerPage=this.obj_dataView.fn_getLimitRowPerPage();

          
          if(int_totalRowReturned>int_limitRowPerPage){}
          else{            
            this.bln_displayDataSummary=true;
          
          }            

          this.bln_addHardRule=true;  
        }
        fn_addDataSummary(){
          
          this.fn_calculateDataSummary();                        
          this.fn_getViewMenuSummaryContainer();  

          this.fn_addDataSummaryReport();
          this.fn_addDataSummaryDashboard();
          this.fn_addDataSummaryWidget();          

          //this.fn_updateButtonText(this.obj_dataView);            
          
          this.fn_updateButtonCount();          
        }

        fn_getSettingGroup(){

          let str_value=this.fn_getMetaRowzGroup();            
          if(str_value==="settinggroup"){return true;}
          return false;            
        }

        fn_clearButtonCount(){

          if(this.fn_getIsDynamicMenu()){return;}
          if(!this.fn_getIsMenuWithView()){return;}            
          let str_text=this.fn_getMetaRowzTitle();                      
          this.fn_setText(str_text);            
        }        
        fn_updateButtonCount(){

          if(this.fn_getSettingGroup()){return;}
          if(!this.fn_getIsMenuWithView()){return;} 
          if(this.fn_getIsDynamicMenu()){return;}

          /*
          if(this.fn_getAutoJoinPin()){return;}            
          if(this.fn_getSettingGroup()){return;}
          if(this.fn_getIsDynamicMenu()){return;}
          if(!this.fn_getIsMenuWithView()){return;} 
          //*/           
          //if(!this.int_totalRowCount){return;}
          //this.fn_debugText("this.int_totalRowCount: " + this.int_totalRowCount);
          let str_text=this.fn_getMetaRowzTitle();            
          str_text+=" ("+this.int_totalRowCount+")" ;
          this.fn_setText(str_text);            
        }

        fn_onCountStart(obj_post){

          this.fn_onDataStart(obj_post);

          let int_totalRowCount=obj_post.RowCount;
          if(!int_totalRowCount){int_totalRowCount=0;}
          this.int_totalRowCount=int_totalRowCount;
          this.fn_updateButtonCount();                            
          if(this.obj_dataView){
            this.obj_dataView.fn_removeChildren();
          }              
          this.obj_dataView=false;
          //this.fn_debugText("fn_onCountStart");

          this.bln_runSearch=false;             
        }



        
        fn_getDataSummaryContainer(obj_parent){
          let obj_container=obj_parent.fn_addContextItem("block");        
          obj_container.fn_setDisplayFlex(true);                        
          obj_container.fn_setStyleProperty("padding", "1.0em");              
          /*
          obj_container.fn_setStyleProperty("gap", "1.0em");                        
          obj_container.fn_setStyleProperty("display", "flex");                        
          obj_container.fn_setStyleProperty("flex-flow", "column-wrap");            
          //*/
          return obj_container;
        }

        fn_getViewMenuSummaryContainer(){

          if(!this.obj_meta.bln_displayAccordionView){              
            return;
          }

          this.fn_calculateDataSummaryView();
          if(!this.bln_displayDataSummary){return;}

          

          let obj_container=this.fn_getDataSummaryContainer(this.obj_accordionView);                                    
          this.obj_dataSummaryContainer=obj_container;
          obj_container.fn_setStyleProperty("flex-flow", "column wrap");                        
          obj_container.fn_setStyleProperty("gap", "1.0em");  
          
          this.fn_addDataSummaryPanel(obj_container);              

          if(this.bln_displayDataSummary){
            let obj_hardrule=this.obj_dataSummaryContainer.fn_addContextItem("form_hardrule");                                        
          }

          //*                      
          //obj_hardrule.fn_setStyleProperty("width", "100%");                        
          //obj_hardrule.fn_setStyleProperty("display", "block");                                    
          //*/
        }
        fn_addDataSummaryReport(){
          if(!this.obj_meta.bln_displayAccordionView){return;}            
          if(!this.bln_displayDataSummary){return;}
        }

        fn_addDataSummaryDashboard(){

          if(!this.bln_displayDashboard){return;}
          if(!this.bln_displayDataSummary){return;}
          if(1==1){
            return;
          }
          

          let arr_item=this.fn_getDashboardView();    
          if(!arr_item){return;}
          for(let i=0;i<arr_item.length;i++){
            let obj_dashboard=arr_item[i];
            if(obj_dashboard && obj_dashboard.obj_design.arr_item.length){                                                
              let obj_container=this.fn_getDataSummaryContainer(obj_dashboard);                        
              this.fn_addDataSummaryPanel(obj_container);              
            }  
          }
        }
        fn_addDataSummaryWidget(){
          if(!this.obj_meta.bln_displayWidget){return;}
          if(!this.bln_displayDataSummary){return;}
          let obj_container=this.fn_getDataSummaryContainer(this.obj_containerWidgetView);                        
          obj_container.fn_setStyleProperty("padding", "0px");                        
          this.fn_addDataSummaryPanel(obj_container);
          
        }

        fn_addDataSummaryPanel(obj_container){                        

          let obj_button;
          
          let obj_console=obj_container.fn_addContextItem("xapp_console");                  
          obj_console.fn_setDisplayFlex();            
          obj_console.obj_menuButton=this;

          let obj_consoleContainerDataSummary=obj_console.fn_addConsoleContainer("xapp_console_container_datasummary", false);
          obj_consoleContainerDataSummary.fn_setStyleProperty("align-items", "center");            
          obj_consoleContainerDataSummary.fn_setDisplayFlex();            
          obj_consoleContainerDataSummary.obj_menuButton=this;            

          if(this.bln_displayDataNavButton){            
          
            obj_button=obj_consoleContainerDataSummary.fn_getConsoleComponent("xapp_button_data_nav_back");                                                      
            obj_button.fn_setDisplay();
            if(this.bln_enableButtonDataBack){
              obj_button.fn_setEnabled();              
            }
            
            
            obj_button=obj_consoleContainerDataSummary.fn_getConsoleComponent("xapp_button_data_nav_forward");                                        
            obj_button.fn_setDisplay();
            if(this.bln_enableButtonDataForward){
              obj_button.fn_setEnabled();        
            }      
          }                      
          
          if(this.bln_displayDataSummary){              
            obj_button=obj_consoleContainerDataSummary.fn_getConsoleComponent("xapp_button_data_nav_toggle");                                      
            
            if(obj_button){
              obj_button.fn_setText(this.str_dataSummary);            
              obj_button.fn_setDisplay();
              obj_button.fn_setEnabled(this.bln_enableButtonDataToggle);              
              //obj_button.fn_setDisabled();              

            }              
          }
        }
        
        
        //RECORDSET LEVEL
        //ROW LEVEL
        
        //----------------------------------------
        //SIGNPOST 11. menu fn_onComputeRowView
        //----------------------------------------
        //fn_loadDashboard
        //fn_loadWidget
        //fn_loadMenu
        //fn_addDynamicMenuToAccordion
        fn_onComputeRowView(obj_row){
          //if Menu is applied in MetaTypeViewMenu, the data set will be "menufyed"
          //if Data is applied in MetaTypeViewData, the data set will be "datafyed"
          //if Widget is applied in MetaTypeViewWidget, the data set will be "widgetfyed"
          //if Dashboard is applied in MetaTypeViewDashboard, the data set will be "dashboardfyed"
        
          //It seems as if dashboards, widgets, and child menus are add sequentially on each row
        
          
          //console.log("this.obj_meta.bln_displayWidget: " + this.obj_meta.bln_displayWidget)      
          if(this.obj_meta.bln_displayWidget){
            let obj_containerWidgetView=this.fn_getWidgetView();
            obj_containerWidgetView.fn_loadWidget(obj_row);
            
          }       
          if(this.obj_meta.bln_displayAccordionView){//this detemrines wether the row is interpreted as a dynamic menu , or not.
            let obj_item=this.fn_addDynamicMenuToAccordion(obj_row);                          
            if(obj_item){
              //obj_item.fn_debug();              
              obj_item.fn_setStyleProperty("fontWeight", "normal");                                          
              //obj_item.fn_showIcon("replace-row-view");                            
            }
            /*
            const obj_compareURL=obj_path.fn_compareURLNavigateArchive(obj_item.obj_meta.str_metaRowzName);                                    
            if(obj_compareURL.bln_applyURL){                                  
              //obj_item.fn_open();
              //this is not necessary to be here as dynamic menus will have an id and therefore be only menu
            } 
            //*/                           
          }
        }  
        //ROW LEVEL
        //VIEW 
        fn_getMetaTypeFromRow(obj_param){
          
          let obj_metaColumn, str_metaType, foo_value;
          str_metaType=this.str_defaultTypeMenu;//default type is Menu            
          obj_metaColumn=obj_param.obj_rowMenu.obj_paramRS.obj_recordset.fn_getMetaColumnViaName("MetaTypeMenu");                
          if(obj_metaColumn){    
            foo_value=obj_metaColumn.str_value;        
            //allow overide default type 
            if(foo_value){str_metaType=foo_value;}              
            obj_param.str_metaTypeMenu=str_metaType;
          } 
        }   
        
        fn_addStandardMenuToAccordion(obj_row){//overidden, but is called
          //Standard Child Menu    
        
          let obj_accordion=this.fn_getAccordionChildMenu();
          let obj_param={};
          obj_param.obj_accordion=obj_accordion;
          obj_param.obj_rowMenu=obj_row;    
          
          this.fn_getMetaTypeFromRow(obj_param);        
        
          if(!obj_param.str_metaTypeMenu){
            //console.log("ERROR: Child Menu Type is False: obj_param.str_metaTypeMenu: " + obj_param.str_metaTypeMenu);
            return;
          }          
          
          let obj_item=obj_param.obj_accordion.fn_addContextItem(obj_param.str_metaTypeMenu, false);                                                
          if(!obj_item){
            //console.log("ERROR: Child Menu is not an object: obj_param.str_metaTypeMenu: " + obj_param.str_metaTypeMenu);
            return;
          }
          //console.log(obj_item)

          //obj_item.fn_setStyleProperty("fontWeight", "bold");
          
          obj_item.obj_parentMenu=this;                                                  
          obj_item.fn_configureMetaFromRow(obj_row);//1 this order is important, to ensure overide default values such as autoopenparemtMenu and Id is set correctly    
          this.fn_configureChildMenuShared(obj_item);//2 this order is important        
          this.fn_addToArrayStandardMenu(obj_item);            
          
          
          obj_item.fn_configureSelfShared(obj_row);           
          obj_item.fn_configureStandardMenu(obj_row);                                   

          
          return obj_item;     
        }          
        fn_getIsMenuWithView(){          
          //if(!obj_shared.fn_validId(this.obj_meta.int_idMetaView) || obj_shared.fn_compareId(this.obj_meta.int_idMetaView, "100")){return false;}//if no valid view id
          if(!this.fn_getViewPin()){return false;}//if no valid view id
          
          return true;          
        }          
        fn_getTogglePeersPin(){          
          if(!this.obj_menuProject){return false};            
          return this.obj_menuProject.bln_togglePeersPin;    
        }            
        fn_getIsStandardMenu(){
          return this.bln_standardMenu;
        }        
        fn_setIsStandardMenu(bln_value){
          return this.bln_standardMenu;
        }        
        fn_configureStandardMenu(){
          this.fn_setIsStandardMenu(true);            
        }          
        fn_addDynamicMenuToAccordion(obj_row){    
        
          let obj_meta, obj_template;
        
          obj_meta=this.fn_getDynamicMeta();// this order is important, to ensure paremtMenu and Id is set correctly                                  
          
          if(!obj_meta.str_metaTypeMenu){
            obj_meta.str_metaTypeMenu=this.str_defaultTypeMenu;            
          }          
          
          let obj_accordion=this.fn_getAccordionView();    
          let obj_item=obj_accordion.fn_addContextItem(obj_meta.str_metaTypeMenu);                            
          this.fn_configureChildMenuShared(obj_item);//2 this order is important    
          this.fn_addToArrayDynamicMenu(obj_item);                                    
          
          obj_item.obj_meta=this.fn_getDeepCopy(obj_meta);                
          
          //obj_item.obj_meta=obj_meta;                
          obj_item.fn_configureSelfShared(obj_row);            
          
          obj_item.fn_configureDynamicMenuFromRow(obj_row);                                                      
          
          
          
          return obj_item;
        } 
        
        fn_getIsDynamicMenu(){
          return this.bln_dynamicMenu;
        }
        fn_setIsDynamicMenu(bln_value){
          this.bln_dynamicMenu=bln_value;
        }

        fn_configureDynamicMenuFromRow(obj_rowMenu){    
            //this is run by the dynamic menu
          //context dynamic menu button

          this.fn_setIsDynamicMenu(true);

          this.bln_applyAnchor=true;//used to set wether there will be a  menu bar navigation anchor link
          
          //START Configure Dynamic Menu Key
          let obj_recordset=obj_rowMenu.obj_paramRS.obj_recordset;
          //grab column name for dynamic menu button 
          //references the data set of the parent menu   
          //gets the primary key of whichever is the  first column
          
          //set dynamic button text, and id values      
          this.fn_updateButtonText(obj_recordset);                         

          this.obj_columnKey=obj_rowMenu.fn_getColumnKey();                        
          if(this.obj_columnKey){//false on standard xapp_row
            this.obj_columnDataId=obj_rowMenu.fn_getColumnDataId();//required for menu archive button to function
            this.obj_columnArchiveDate=obj_rowMenu.fn_getColumnArchiveDate();//required to toggle archive / restore button text in menupane            
            this.fn_setMenuRecordId(this.obj_columnKey.str_value);            
          }
          //END Configure Dynamic Menu Key
        }

        
        fn_updateButtonText(obj_recordset){
          let str_value=this.fn_formatButtonText(obj_recordset);        

          //console.log("str_value:  " + str_value);
          if(!str_value){return;}            
          this.str_buttonText=str_value;
          //console.log("this.str_buttonText: " + this.str_buttonText);
          this.fn_setText(str_value);            
        }

        //required to be on xapp_menu
        origfn_formatButtonText(obj_recordset){
      
          if(this.bln_modeNewRecord){
            return "New Record";        
          }
      
          let str_value="";                   
          
          let arr_pin=obj_recordset.obj_paramRS.arr_menuPinColumn;
          for(let i=0;i<arr_pin.length;i++){              
            let obj_metaColumn=arr_pin[i];                        
            if(obj_metaColumn && obj_metaColumn.str_value && !obj_metaColumn.HiddenPin){                        

              let str_text=obj_metaColumn.str_value;      
              if(!str_text){continue;}
              str_text+="";
              //*
              const int_max=100;
              if(str_text.length>int_max){
                str_text=str_text.substring(0, int_max);
                str_text+="...";
              }
              //*/              
              str_text=str_text.replace(/(\r\n|\n|\r)/gm, "");
              
              if(str_value){str_value+=" || ";}
              str_value+=str_text;
            }

          }   
          //console.log(str_value);
          return str_value;
        }

        //required to be on xapp_menu
        fn_formatButtonText(obj_recordset){
      
          if(this.bln_modeNewRecord){
            return "New Record";        
          }
      
          let str_value="";                   
          
          let arr_pin=obj_recordset.obj_paramRS.arr_menuPinColumn;

          
          //console.log("arr_pin:  " + arr_pin.length);
          //console.log(arr_pin);
          
          for(let i=0;i<arr_pin.length;i++){              
            let obj_metaColumn=arr_pin[i];            
            //console.log("arr_pin count: " + i);           
            //console.log("obj_metaColumn.str_value: " + obj_metaColumn.str_value);
            //console.log("obj_metaColumn.HiddenPin: " + obj_metaColumn.HiddenPin);
            if(obj_metaColumn && obj_metaColumn.str_value && !obj_metaColumn.HiddenPin){                        

              let str_text=obj_metaColumn.str_value;                    
              if(!str_text){continue;}              
              str_text=obj_shared.fn_formatDisplayValueFromColumn(obj_metaColumn,str_text);

              switch(obj_metaColumn.MetaColumnType.toLowerCase()){                    
                case "note":
                case "text":
                  const int_max=100;
              if(str_text.length>int_max){
                str_text=str_text.substring(0, int_max);
                str_text+="...";
              }
              
              str_text=str_text.replace(/(\r\n|\n|\r)/gm, "");              
                  break;
                case "date":                                            
                case "datetime":
                  str_text=str_text.slice(0, 11);
                  break;
              }
              
              
              
              if(str_value){str_value+=" | ";}
              str_value+=str_text;//rolling loop addition to str_value
            }

          }   
          //console.log(str_value);
          return str_value;
        }

        fn_getMenuParent(obj_item){
          return this.obj_parentMenu;
        }
        
        
        fn_setMenuParent(obj_item){
          obj_item.obj_parentMenu=this;                                                  
          if(this.bln_isAppRoot){
            if(!this.bln_hasTopLevelItem){
              this.bln_hasTopLevelItem=true;
              obj_item.bln_topLevelMenu=true;                              
              obj_item.fn_setAutoOpenPin(true);                
            }
            else{
              obj_item.bln_topLevelMenu=true;                  
              obj_item.fn_setAutoOpenPin(false);                                                        
            }
          }            
        }
        
        //START SHARED BY BOTH STANDARD AND DYNAMIC
        fn_configureChildMenuShared(obj_item){                            
          this.fn_setMenuParent(obj_item);
          
        }  
        
        fn_configureSelfShared(obj_row){ //standard from add to accordion      
        
        this.obj_rowMenu=obj_row;  

        this.obj_menuProject=this.obj_parentMenu.obj_menuProject;
        this.obj_crudHead=this.obj_parentMenu.obj_crudHead;                                                          
                
        this.obj_meta.arr_buttonConsole=obj_shared.fn_stringToArray(this.obj_meta.str_buttonConsole);                        
        this.obj_meta.str_buttonConsole=this.obj_meta.arr_buttonConsole.toString();                                        
        
        
        if(this.fn_getHiddenPin()){
          this.fn_setHiddenPin(true);            
        }
        
        
        if(this.fn_getDisabledPin()){
          this.fn_setDisabled(true);    
        }
        
        //this.fn_scrollIntoView();  
        this.fn_scrollTop(this.obj_parentMenu.int_scrollTopChild);
        
        } 
        fn_setDisabled(){
          super.fn_setDisabled(true);
          this.fn_close();
        }
        
        //END SHARED BY BOTH STANDARD AND DYNAMIC          
        
        fn_getDynamicMeta(){//for dynamic menus which dont have a childmenu template



          let obj_meta, obj_template;              
        
          let bln_useTemplate=true;
          let bln_canUseSelf=true;//self has not been demonstrated to produce useful results
          if(bln_useTemplate){
        
            this.bln_useMetaTemplate=true;                 
            //console.log("use meta template");         
            
            let arr_item=this.obj_accordionChildMenu.obj_design.arr_item;                  
            
            if(arr_item.length===1){                                
              if(arr_item[0].fn_getDynamicMenuPin()){                                                  
                this.obj_template=arr_item[0];                
              }
            }       
            if(this.obj_template){
              obj_meta=this.obj_template.obj_meta;                                      
              //console.log("str_metaConstraintName: " + obj_meta.str_metaConstraintName);                           
            }
            
          }
          
          if(bln_canUseSelf && !obj_meta){   //never user causes recursion    
            //console.log("use meta self");
            //console.log(this.obj_meta);
            //obj_meta=this.fn_getDeepCopy(this.obj_meta);                                              
          
          }    
        
          if(!obj_meta){                      
            obj_meta=this.fn_getMetaDefaultDynamic();
          } 
          return obj_meta;
        }
        fn_getMetaDefault(){
          return {              
            
            bln_togglePeersPin: true, //this needs to be on a toggle button      
            bln_autoOpenPin: false,
            bln_autoFetch: false,              
            bln_debugPin: false,
            bln_displayAccordionChildMenu: false,
            bln_displayAccordionView: false,
            bln_displayDashboard: false,
            bln_displayDataChildMenu: false,
            bln_displayData: false,      
            bln_displayMenuPanel: false,      
            bln_displayReport: false,
            bln_displayWidget: false,            
            bln_runDataChildMenu: false,
            bln_runDataView: false,            
            str_metaConstraintName: "",              
            str_metaRowzName: "",
            int_idMetaRowz: 0,
            int_idParentMetaRowz: 0,                          
            int_idMetaView: 0,                  
            bln_viewPin: 0,                  
            str_buttonConsole: "",            
            MetaPermissionTag: "100",
            str_metaTypeDashboard: "",      
            str_metaTypeData: "",      
            str_optionChildMenu: "",
            str_text: "",
          };
        }
        fn_getMetaDefaultDynamic(){

          let obj_meta=this.fn_getMetaDefault();                
          obj_meta.bln_togglePeersPin=this.obj_meta.bln_togglePeersPin;            
          obj_meta.bln_debugPin=this.fn_getDebugPin();          
          obj_meta.bln_displayDataChildMenu=false;//this should remain false, otherwise additional grid gap is displayed        
          obj_meta.bln_displayAccordionChildMenu=true;//updated for new op            
          obj_meta.bln_displayData=true;                
          obj_meta.bln_displayMenuPanel=true;                
          obj_meta.bln_autoFetch=this.fn_getAutoFetch();          
          obj_meta.bln_runDataChildMenu=true;//this needs to be on to see Data
          obj_meta.bln_runDataView=true;        
          obj_meta.str_metaRowzName=this.obj_meta.str_metaRowzName;            
          obj_meta.int_idMetaRowz=this.obj_meta.int_idMetaRowz;                        
          obj_meta.int_idParentMetaRowz=this.obj_meta.int_idParentMetaRowz;    
          obj_meta.int_idMetaView=this.obj_meta.int_idMetaView;          
          obj_meta.bln_viewPin=this.fn_getViewPin();
          //obj_meta.str_buttonConsole="Search";            
          obj_meta.str_metaTypeData=this.str_defaultTypeData;                            
          obj_meta.str_metaTypeMenu=this.obj_meta.str_metaTypeMenu;                      
          if(!obj_meta.str_metaTypeMenu){       
            obj_meta.str_metaTypeMenu=this.str_defaultTypeMenu;                      
          }                        
          return obj_meta;
        }                              

        fn_navigateOption(){
          //console.log("fn_navigateOption");

        }
        
        
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        //////////////////////////////////////////////

        
        fn_getOnlyDynamicMenu(){return false;}
        //Dynamic Dynamic Menu                   
        fn_hideDynamicMenu(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          for(let i=0;i<arr_item.length;i++){      
            let obj_item=arr_item[i];
                if(obj_item!==obj_exclude){
                    obj_item.fn_close();
                    obj_item.fn_setDisplay(false);           
                }
            }
        }
        fn_closeDynamicMenu(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          for(let i=0;i<arr_item.length;i++){      
            let obj_item=arr_item[i];
                if(obj_item!==obj_exclude){
                    obj_item.fn_close();          
                }
            }
        }
        
        fn_dynamicMenuCloseAndDisable(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          for(let i=0;i<arr_item.length;i++){      
            let obj_item=arr_item[i];
                if(obj_item!==obj_exclude){
                    obj_item.fn_close();          
                    obj_item.fn_setDisabled();                                                  
                }
                obj_item.fn_dynamicMenuCloseAndDisable(obj_exclude);
            }
        }                   
        
        fn_addToArrayDynamicMenu(obj_item){
          this.obj_holder.arr_dynamicMenu.push(obj_item);                        
          this.fn_setMenuParent(obj_item);            
        }
        fn_getArrayDynamicMenu(){
          return this.obj_holder.arr_dynamicMenu;
        }         
        fn_getOnlyDynamicMenu(){
          let arr_item=this.fn_getArrayDynamicMenu();                        
          if(arr_item.length===1){
            return arr_item[0];
          }   
          return false;
        }   

        fn_debugArrayDynamicMenu(obj_exclude){    
          let arr_item=this.fn_getArrayDynamicMenu();
          //this.fn_debugText("arr_dynamic item.length: " + arr_item.length);
          //console.log(arr_item);                    
          /*
          for(let i=0;i<arr_item.length;i++){      
              let obj_item=arr_item[i];
              //obj_item.fn_debug();
          }
          //*/
        }            
        fn_getTopLevelMenuParent(){            
          return this.obj_holder.bln_hasTopLevelParentMenu;
        }
        
        
        fn_hasTopLevelRowzParent(int_idParentMetaRowz){                        
          
          //console.log("this.obj_parentMenu: " + this.obj_parentMenu);
          if(!this.obj_parentMenu){return false;}            
          //console.log("this.obj_parentMenu.bln_topLevelMenu: " + this.obj_parentMenu.bln_topLevelMenu);
          if(this.obj_parentMenu.bln_topLevelMenu){              
            let int_idMetaRowz=this.obj_parentMenu.obj_meta.int_idMetaRowz+"";
            int_idParentMetaRowz+="";              
            //console.log("int_idMetaRowz: " + int_idMetaRowz);
            //console.log("int_idParentMetaRowz: " + int_idParentMetaRowz);
            if(int_idMetaRowz===int_idParentMetaRowz){                             
              return true;                
            }
          }
          return this.obj_parentMenu.fn_hasTopLevelRowzParent(int_idParentMetaRowz);                
        }              
        fn_updateTextHyperlink(){            
          this.fn_setText(this.fn_getText());
        }
        
        fn_getNavigateURL(str_urlBase=""){
          const obj_navigate=this.fn_getNavigate();
          return obj_path.fn_getNavigateRecordURL(obj_navigate.str_urlMetaRowzName, obj_navigate.str_urlMetaRecordId, str_urlBase);
        }
        fn_getNavigate(){                
          let obj_navigate={};             
          //console.log(this.obj_meta);
          obj_navigate.int_idMetaView=this.obj_meta.int_idMetaView;
          //console.log("obj_navigate.int_idMetaView: " + obj_navigate.int_idMetaView);
          obj_navigate.str_urlMetaRowzName=this.obj_meta.str_metaRowzName;
          obj_navigate.str_urlMetaRecordId=this.obj_meta.str_metaRecordId;            
          if(this.obj_columnKey){              
            obj_navigate.str_urlMetaRecordId=this.obj_columnKey.str_value
          }
          
          return obj_navigate;
        }                       

        fn_setNavigationURL(str_value){

          if(this.fn_getSettingOperationPin()){                      
            return;            
          }

          if(obj_project.obj_design.bln_disallowHyperLinkButton){          
            return;
          }
        
          if(this.obj_meta.int_idParentMetaRowz && this.bln_applyAnchor){//check apply
            let bln_value=this.fn_hasTopLevelRowzParent(this.obj_meta.int_idParentMetaRowz);                       
            this.bln_applyAnchor=bln_value;
          }                      

          if(!this.bln_applyAnchor){              
            return;
          }

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setNavigationURL(str_value);          
          } 
        }

        fn_setMenuRecordId(str_value){
          this.obj_meta.str_metaRecordId=str_value;
          this.fn_updateTextHyperlink();
        }

        fn_getMenuRecordId(){
          return this.obj_meta.str_metaRecordId;
        }        

        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        
        fn_setText(str_value){      

          super.fn_setText(str_value);          

          let obj_anchor=this.fn_getComponent("form_button_anchor");                              
          
          if(obj_anchor){          
            obj_anchor.fn_setText(str_value);          
          }
        }        
        fn_getText(){

          let str_text;

          str_text=super.fn_getText();                  

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            str_text=obj_anchor.fn_getText();          
          }                   
          return str_text; 
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        
        
            }//END CLS
            //END TAG
            //END component/xapp_menu