
            //XSTART component/xapp_data
            class xapp_data extends xapp_ajax{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                          

                this.obj_holder.bln_debugServer=true;                  

                this.str_defaultTypeRow="xapp_row";
                this.str_defaultTypeColumn="xapp_column";
                this.fn_initialize_var();
              }
              fn_onLoad(){    
                super.fn_onLoad();                  
                if(this.fn_getDebugPin()){this.fn_highlightBorder("blue");}                  
              }
              fn_initialize_var(obj_ini){
                
                this.obj_holder.str_typeColumn=this.str_defaultTypeColumn;
                this.obj_holder.bln_reportView=false;
                this.obj_holder.bln_editable=false;
                this.obj_holder.obj_query={};      
                this.obj_holder.obj_query.str_querySearch="";
                this.obj_holder.obj_query.str_queryList="";
                this.obj_holder.obj_query.str_queryListParent="";
                this.obj_holder.obj_query.str_queryListDisabled="";
                this.obj_holder.obj_query.str_queryListParentDisabled="";
                this.obj_holder.obj_query.bln_loadReportInterface=false;
                this.fn_setComputeRows(true);      
                this.fn_setLimitRowPerPage(10);                        
                this.fn_resetDataView();
               
              }                  
              fn_resetDataView(){
                this.fn_setLimitRowStart(0);
              }
              fn_setLimitRowPerPage(int_limitRowPerPage){                  
                this.obj_holder.obj_query.int_limitRowPerPage=int_limitRowPerPage;                          
              }
              fn_setLimitRowStart(int_limitRowStart){                  
                this.obj_holder.obj_query.int_limitRowStart=int_limitRowStart;                                                  
              }
              fn_getLimitRowPerPage(){                  
                return this.obj_holder.obj_query.int_limitRowPerPage;                          
              }
              fn_getLimitRowStart(){                  
                return this.obj_holder.obj_query.int_limitRowStart;                                
              }
              fn_setComputeRows(bln_value){
                this.obj_holder.bln_computeRows=bln_value;
              }
              fn_getComputeRows(){
                return this.obj_holder.bln_computeRows;
              }
              fn_initializeRS(obj_menuButton){                                  
                
                this.obj_paramRS={};                                  
                this.obj_paramRS.obj_recordset=this;                                    
                this.obj_paramRS.int_totalRowReturned=0;
                this.obj_paramRS.str_typeColumn=this.obj_holder.str_typeColumn;//can choose which class will the column be eg reporrtcolumn
                this.obj_paramRS.bln_reportView=this.obj_holder.bln_reportView;                  

                this.obj_paramRS.obj_menuButton=obj_menuButton;                                   

                if(obj_path.str_urlMetaRowzNameArchive){
                  this.obj_holder.obj_query.int_idMetaView=obj_menuButton.obj_meta.int_idMetaView;                    
                  this.obj_holder.obj_query.int_idMetaRowz=obj_menuButton.obj_meta.int_idMetaRowz;                                        
                  this.obj_holder.obj_query.str_metaRowzName=obj_menuButton.obj_meta.str_metaRowzName;
                  this.obj_holder.obj_query.str_urlMetaRowzNameArchive=obj_path.str_urlMetaRowzNameArchive;
                  this.obj_holder.obj_query.str_urlMetaRecordIdArchive=obj_path.str_urlMetaRecordIdArchive;
                }
                

                /*
                console.log("this.obj_meta.int_idMetaRowz: " + this.obj_meta.int_idMetaRowz);
                console.log("this.obj_meta.str_metaRowzName: " + this.obj_meta.str_metaRowzName);
                console.log("obj_path.str_urlMetaRowzNameArchive: " + obj_path.str_urlMetaRowzNameArchive);
                console.log("obj_path.str_urlMetaRecordIdArchive: " + obj_path.str_urlMetaRecordIdArchive);
                //*/

                this.obj_paramRS.bln_axis=false;//row              
                //this.fn_setAxis(this.obj_paramRS.bln_axis);
                this.obj_paramRS.int_separator=10;                                  
                this.obj_paramRS.bln_showFieldHeading=true;
                this.obj_paramRS.bln_autoSection=false;//1 row many sections                                                       
                this.obj_paramRS.bln_hasMultipleRow=false;
                this.obj_paramRS.bln_NoRowFound=false;
                this.obj_paramRS.bln_singleRowFound=false;                                    
                this.obj_paramRS.int_countRow=0;                                  
                this.obj_paramRS.bln_lastRow=false;

                this.bln_debug=obj_menuButton.bln_debug;                                                
              }                                 
              
                              
              fn_setMetaRowzId(int_value){           
                this.obj_holder.obj_query.int_idMetaRowz=int_value;
              }              
              fn_setMetaRowzTitle(int_value){           
                this.obj_holder.obj_query.str_metaRowzTitle=int_value;
              }              
              fn_setMetaRowzName(int_value){           
                this.obj_holder.obj_query.str_metaRowzName=int_value;
              }              
              
              fn_setMetaViewId(int_value){           
                this.obj_holder.obj_query.int_idMetaView=int_value;
              }
              fn_getMetaViewId(int_value){           
                return this.obj_holder.obj_query.int_idMetaView;
              }            
              
              
              fn_getQueryExpression(){                                  
                return this.obj_holder.obj_query.str_queryExpression;
              }                                
              
              fn_setQueryExpression(str_value){                                      
                /*
                let str_expr;                  
                str_expr="(";        
                str_expr+=str_value;        
                str_expr+="TRUE ";                
                str_expr+=")";
                this.obj_holder.obj_query.str_queryExpression=str_expr;
                //*/

                this.obj_holder.obj_query.str_queryExpression=str_value;
              }                                 
            
              fn_setMetaKey(obj_columnKey){

                //this.fn_debugText("fn_setMetaKey");

                
                this.obj_holder.obj_query.str_metaKeySchemaName="";
                this.obj_holder.obj_query.str_metaKeyTableName="";
                this.obj_holder.obj_query.str_metaKeyColumnName="";
                this.obj_holder.obj_query.str_metaKeyColumnValue="";

                if(!obj_columnKey){
                  return;
                }
                
                let obj_metaColumn=obj_columnKey.obj_metaColumn;                                                                
                this.obj_holder.obj_query.str_metaKeySchemaName=obj_metaColumn.MetaSchemaName;
                this.obj_holder.obj_query.str_metaKeyTableName=obj_metaColumn.MetaTableName;
                this.obj_holder.obj_query.str_metaKeyColumnName=obj_metaColumn.MetaColumnName;
                this.obj_holder.obj_query.str_metaKeyColumnShortName=obj_metaColumn.MetaColumnAPIName;
                this.obj_holder.obj_query.str_metaKeyColumnValue=obj_columnKey.str_value;                
              }

              
              fn_setModeExecuteViewRecord(){                  
                this.int_modeExecute=obj_holder.int_modeReadOnly;                  
                return false;
              }
              fn_getModeExecuteViewRecord(){
                if(this.int_modeExecute===obj_holder.int_modeReadOnly){return true;}
                return false;
              }

              fn_setSubdomain(str_value){                                  
                this.obj_holder.obj_query.str_subdomain=str_value;                  
              }

              fn_setDataQuerySearch(str_querySearch, bln_resetDataView=true){ 
                if(bln_resetDataView){
                  this.fn_resetDataView();                                 
                }
                
                this.obj_holder.obj_query.str_querySearch=str_querySearch;
              }                                                
              fn_getDataQuerySearch(){                                                  
                return this.obj_holder.obj_query.str_querySearch;
              }                                                
              
              fn_setDataQueryList(str_queryList){                                  
                //this.fn_resetDataView();                
                this.obj_holder.obj_query.str_queryList=str_queryList;
              }                                                
              fn_getDataQueryList(){                                  
                return this.obj_holder.obj_query.str_queryList;
              } 
              fn_setDataQueryListParent(str_queryList){          
                this.obj_holder.obj_query.str_queryListParent=str_queryList;
              } 
              fn_getDataQueryListParent(){
                return this.obj_holder.obj_query.str_queryListParent;
              } 
              fn_setDataQueryListDisabled(str_queryList){                                  
                //this.fn_resetDataView();                
                this.obj_holder.obj_query.str_queryListDisabled=str_queryList;
              }                                                
              fn_getDataQueryListDisabled(){                                  
                return this.obj_holder.obj_query.str_queryListDisabled;                  
              } 
              fn_setDataQueryListParentDisabled(str_queryList){                           
                this.obj_holder.obj_query.str_queryListParentDisabled=str_queryList;
              } 
              fn_getDataQueryListParentDisabled(){
                return this.obj_holder.obj_query.str_queryListParentDisabled;
              }               

              fn_setPublishPin(bln_value){                                                    
                this.obj_holder.obj_query.bln_publishPin=bln_value;                  
              }                                                
              fn_getPublishPin(){                                  
                return this.obj_holder.obj_query.bln_publishPin;
              }                               
              fn_setMarkedParentSchemaName(str_value){
                this.obj_holder.obj_query.str_markedParentSchemaName=str_value;                                    
            }
              fn_setMarkedParentTableName(str_value){
                  this.obj_holder.obj_query.str_markedParentTableName=str_value;                                    
              }
              fn_setMarkedParentRowzId(int_value){
                this.obj_holder.obj_query.str_markedParentRowzId=int_value;                                    
              }              
              fn_setMarkedParentViewId(int_value){
                this.obj_holder.obj_query.str_markedParentViewId=int_value;                                    
              }                
              fn_setSelectMinimalFieldPin(bln_value){                                                    
                this.obj_holder.obj_query.bln_selectMinimalFieldPin=bln_value;                  
              }                                                
              fn_getSelectMinimalFieldPin(){                                  
                return this.obj_holder.obj_query.bln_selectMinimalFieldPin;
              }                 
              //----------------------------------------
              //SIGNPOST 8. obj_dataView fn_getDataQuery
              //----------------------------------------
              fn_getDataCountQuery(bln_runSearch=false){

                /*
                let str_queryList=this.fn_getDataQueryList();                                    
                let str_queryListDisabled=this.fn_getDataQueryListDisabled();
                let str_queryListParent=this.fn_getDataQueryListParent();                  
                let str_queryListParentDisabled=this.fn_getDataQueryListParentDisabled();
                this.fn_debugText("fn_runCountQuery str_queryList: " + str_queryList);
                this.fn_debugText("fn_runCountQuery str_queryListDisabled: " + str_queryListDisabled);
                this.fn_debugText("fn_runCountQuery str_queryListParent: " + str_queryListParent);
                this.fn_debugText("fn_runCountQuery str_queryListParentDisabled: " + str_queryListParentDisabled);
                //*/
                
                let obj_menuButton=this.obj_paramRS.obj_menuButton;

                let obj_ini=this.obj_holder.obj_query;                                          
                obj_ini.str_action="getDataCountQuery";                                                   
                obj_ini.bln_runSearch=bln_runSearch;
                obj_ini.bln_simpleSearch=obj_menuButton.bln_simpleSearch;
                obj_ini.bln_advancedSearch=obj_menuButton.bln_advancedSearch;
                this.fn_runServerAction(obj_ini);                                                      
              }                
              getDataCountQuery(obj_post){                    
                
                this.obj_post=obj_post;                            
                //console.log(this.obj_post);
                let obj_menuButton=this.obj_paramRS.obj_menuButton;                  
                obj_menuButton.fn_onCountStart(this.obj_post);
              }  
              
              fn_getChildRowz(bln_runSearch=false){

                let obj_menuButton=this.obj_paramRS.obj_menuButton;  
                this.fn_setDebugPin(obj_menuButton.fn_getDebugPin()); 
                this.fn_setPublishPin(obj_menuButton.fn_getPublishPin());                  
                this.fn_setMarkedParentSchemaName(obj_menuButton.fn_getMarkedParentSchemaName());                  
                this.fn_setMarkedParentTableName(obj_menuButton.fn_getMarkedParentTableName());                  
                this.fn_setMarkedParentRowzId(obj_menuButton.fn_getMarkedParentRowzId());                                  
                this.fn_setMarkedParentViewId(obj_menuButton.fn_getMarkedParentViewId());   
                
                

                /*
                let str_queryList, str_queryListDisabled, str_queryListParent, str_queryListParentDisabled;                  
                str_queryList=this.fn_getDataQueryList();                                    
                str_queryListDisabled=this.fn_getDataQueryListDisabled();
                str_queryListParent=this.fn_getDataQueryListParent();                  
                str_queryListParentDisabled=this.fn_getDataQueryListParentDisabled();
                this.fn_debugText("str_queryList: " + str_queryList);
                this.fn_debugText("str_queryListDisabled: " + str_queryListDisabled);
                this.fn_debugText("str_queryListParent: " + str_queryListParent);
                this.fn_debugText("str_queryListParentDisabled: " + str_queryListParentDisabled);
                //*/

                
                
                let obj_ini=this.obj_holder.obj_query;                                          
                obj_ini.str_action="getChildRowz";
                obj_ini.bln_runSearch=bln_runSearch;
                obj_ini.bln_simpleSearch=obj_menuButton.bln_simpleSearch;
                obj_ini.bln_advancedSearch=obj_menuButton.bln_advancedSearch;
                this.fn_runServerAction(obj_ini);
              }

              getChildRowz(obj_post){                    
                
                this.obj_post=obj_post;                            
                //console.log(this.obj_post);
                this.fn_onDataStart();                                                                  
                this.fn_computeRows();
                this.fn_onDataEnd(obj_post);                       
              }


              fn_getDataQuery(bln_runSearch=false){                                                       

                let obj_menuButton=this.obj_paramRS.obj_menuButton;  
                this.fn_setDebugPin(obj_menuButton.fn_getDebugPin());
                this.fn_setPublishPin(obj_menuButton.fn_getPublishPin());
                this.fn_setMarkedParentSchemaName(obj_menuButton.fn_getMarkedParentSchemaName());                  
                this.fn_setMarkedParentTableName(obj_menuButton.fn_getMarkedParentTableName());                  
                this.fn_setMarkedParentRowzId(obj_menuButton.fn_getMarkedParentRowzId());                                  
                this.fn_setMarkedParentViewId(obj_menuButton.fn_getMarkedParentViewId());   
                

                                                

                let obj_ini=this.obj_holder.obj_query;                                          
                obj_ini.str_action="getDataQuery";
                obj_ini.bln_runSearch=bln_runSearch;
                obj_ini.bln_simpleSearch=obj_menuButton.bln_simpleSearch;
                obj_ini.bln_advancedSearch=obj_menuButton.bln_advancedSearch;
                this.fn_runServerAction(obj_ini);                                                                        
              } 
              
              getDataQuery(obj_post){                    
                
                this.obj_post=obj_post;                            
                //console.log(this.obj_post);
                this.fn_onDataStart();                                                                  
                this.fn_computeRows();
                this.fn_onDataEnd(obj_post);                       
              }                  

              fn_onDataStart(){
                
                
                this.obj_paramRS.arr_metaColumn=this.obj_post.MetaColumn;                                                      
                
                this.fn_getMenuPinColumn();                  
                
                let obj_menuButton=this.obj_paramRS.obj_menuButton;                  
                
                
                obj_menuButton.fn_resetContent();                                                    
                
                obj_menuButton.fn_onDataStart(this.obj_post);
                
                
              }                          
              fn_onDataEnd(obj_post){ 
                
                //this.fn_iniTotalRow(true);//post process - not operaitonal

                let obj_menuButton=this.obj_paramRS.obj_menuButton;                  
                obj_menuButton.fn_onDataEnd(obj_post);
              }                                     

              fn_onRecordSetDataView(){                                  
                this.obj_paramRS.arr_rows=[];                      
                if(!this.obj_paramRS.arr_metaColumn){return;}
                if(!this.obj_paramRS.arr_metaColumn.length){return false;}
                
                //this.fn_describeMetaColumns();


                this.fn_iniDataView();

                this.fn_iniTotalRow();
              }
              
              fn_iniDataView(){}//overidden, but called                

        
              
              //*
              fn_iniTotalRow(){ //overidden, but called
                
                let int_totalRowCount=this.obj_post.RowCount;                  
                if(!int_totalRowCount){int_totalRowCount=0;}
                this.obj_paramRS.int_totalRowCount=int_totalRowCount;                  

                let int_totalRowReturned=this.obj_post.RowData.length;
                if(!int_totalRowReturned){int_totalRowReturned=0;}
                this.obj_paramRS.int_totalRowReturned=int_totalRowReturned;                                                
                
                let arr_metaColumn=this.obj_paramRS.arr_metaColumn;
                if(obj_shared.fn_isObjectEmpty(arr_metaColumn[0])){arr_metaColumn=[];}                                    
                this.obj_paramRS.arr_metaColumn=arr_metaColumn;                
                this.obj_paramRS.int_totalColumn=arr_metaColumn.length;

                switch(this.obj_paramRS.int_totalRowReturned){
                  case (0)://no row found
                    this.obj_paramRS.bln_NoRowFound=true;                                                          
                  break;
                  case (1)://single row found
                    this.obj_paramRS.bln_singleRowFound=true;                                                      
                  break;                    
                  default:
                    if(this.obj_paramRS.int_totalRowReturned>1){//many rows                  
                      this.obj_paramRS.bln_hasMultipleRow=true;                                        
                    }
                }                                    
              } 
              //*/               

              
              fn_computeRows(){ 

                if(!this.fn_getComputeRows()){return;}    
                
                this.fn_removeChildren();                                                                      
                this.fn_onRecordSetDataView();
                
                if(this.obj_paramRS.bln_NoRowFound){                                    
                  return;
                }

                //should align with this.obj_paramRS.int_totalRowReturned

                let arr_row=this.obj_post.RowData;
                //console.log(arr_row)
                const int_rowLength=arr_row.length;                  
                for(var i=0;i<arr_row.length;i++){                            
                  //cannot add any properties to obj_ROW as they will be considered part of the record set name/value pairs
                  this.obj_paramRS.obj_ROW=this.obj_post.RowData[i];
                  //console.log(this.obj_paramRS.obj_ROW);
                  
                  this.obj_paramRS.int_ordinalPosition=i;                  
                  if(i===int_rowLength-1){
                    this.obj_paramRS.bln_lastRow=true;
                  }                    

                  this.fn_onComputeRowStart();                    

                  
                  this.fn_computeRow();      
                  
                  this.fn_onComputeRowEnd();              
                  this.obj_paramRS.int_countRow++;
                }

                
              }                                
              
              fn_computeRow(){//overidden, not called
                
                //RowData Can contain a single empty object                                  
                if(obj_shared.fn_isObjectEmpty(this.obj_paramRS.obj_ROW)){ return;}                
                
                let bln_addRow=this.fn_addRow();
                
                if(bln_addRow){
                  this.fn_onComputeRow();                  
                }
                
                
              }

              fn_getRow(int_num){                  
                return this.obj_paramRS.arr_rows[int_num];
              }

              fn_getPermissionAddRow(obj_row){
                
                const obj_metaDataRow=obj_row.obj_paramRow.obj_metaData;

                if(obj_shared.fn_isEmptyObject(obj_metaDataRow)){
                  return true;
                }          
                
                const obj_permit=obj_permitManger.fn_compare(obj_metaDataRow, obj_userHome);
                if(!obj_permit){
                  return true;
                }
                let bln_hiddenPin=obj_permitManger.fn_getHidden(obj_permit);                                         
                if(bln_hiddenPin){                    
                  return false;
                }                  
                return true;                
              }

              fn_addRow(){                  
                let obj_row=this.obj_paramRS.obj_row=this.fn_addContextItem(this.str_defaultTypeRow);                  
                if(!obj_row){                    
                  return false;
                }                                 
                
                
                obj_row.fn_initializeRow(this.obj_paramRS);                       
                let bln_addRow=this.fn_getPermissionAddRow(obj_row);                                
                if(bln_addRow){
                  this.obj_paramRS.arr_rows.push(obj_row);                  
                  obj_row.fn_computeColumns();                                                                              
                  
                  if(this.obj_post.MetaKeySchemaName==="meta_column" && this.obj_post.MetaKeyTableName==="meta_column"){                  
                      obj_row.fn_settingsColumnInterfaceLockedPin("mycol_");                                                               
                  }
                  
                  if(this.obj_post.MetaKeySchemaName==="meta_rowz" && this.obj_post.MetaKeyTableName==="meta_rowz"){                  
                    //console.log(this.obj_post);
                    obj_row.fn_settingsColumnInterfaceLockedPin("mybox_");                                                               
                  }
                  
                  
                }
                return bln_addRow;                                  
              }
              
              fn_onComputeRow(){}                              
              fn_onComputeRowStart(){}                              
              fn_onComputeRowEnd(){} 

              fn_onComputeRow(){                                                   
              }                  
              
              fn_setModeExecuteView(){
                
                super.fn_setModeExecuteView();
                
                if(!this.obj_paramRS){return;}
                if(!this.obj_paramRS.arr_rows){return;}
                let arr_rows=this.obj_paramRS.arr_rows;
              
                const int_rowLength=arr_rows.length;                  
                for(var i=0;i<int_rowLength;i++){                                          
                  let obj_row=arr_rows[i];                                                     
                  obj_row.obj_selectedColumn=false;
                  obj_row.fn_setModeExecuteView();
                  
                }

              }


              
              
              //START Meta Column Function
              /////////////////////////
              /////////////////////////
              /////////////////////////  
              fn_getMetaView(){
                return this.obj_paramRS.obj_metaView;
              }
              fn_setMetaColumnValue(int_num, str_value){
                let obj_metaColumn=this.fn_getMetaColumnViaOrdinalPosition(int_num);//the column meta is used as a base for the ui column                                    
                if(!obj_metaColumn){return;}
                obj_metaColumn.str_value=str_value;
                this.obj_paramRS.obj_ROW[obj_metaColumn.str_name]=str_value;                                      
                return obj_metaColumn;
              }
              
              fn_getMetaColumn(int_num){
                
                let obj_metaColumn=this.fn_getMetaColumnViaOrdinalPosition(int_num);//the column meta is used as a base for the ui column                                                                             
                obj_metaColumn.str_name=this.fn_getPDOMetaValue(obj_metaColumn, "name");
                if(this.obj_paramRS.obj_ROW){
                  obj_metaColumn.str_value=this.obj_paramRS.obj_ROW[obj_metaColumn.str_name];                    
                }                  
                obj_metaColumn.int_ordinalPosition=int_num;                  
                obj_metaColumn.PrimaryPin=obj_shared.fn_parseBool(obj_metaColumn.PrimaryPin);
                return obj_metaColumn;
              }                

              xfn_describeMetaColumns(){                  
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn;i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                        
                  console.log("["+ i + "]: " + obj_metaColumn.str_name.toLowerCase());                    
                }
              }

              fn_describeMetaColumns(){                  
                if(!this.obj_paramRS){return;}
                let arr=this.obj_paramRS.arr_metaColumn;
                for (let i = 0; i < arr.length; i++) {                        
                  let obj_metaColumn=arr[i];
                  console.log("["+ i + "]: " + obj_metaColumn.str_name + " MenuPin: " + obj_metaColumn.MenuPin);                    
                }
              }

              fn_getMenuPinColumn(){                  
                let arr=this.obj_paramRS.arr_metaColumn;                  
                this.obj_paramRS.arr_menuPinColumn=[];
                this.obj_paramRS.arr_infoPinColumn=[];
                for (let i = 0; i < arr.length; i++) {                        
                  let obj_metaColumn=arr[i];
                  
                  if(obj_metaColumn.MenuPin){                      
                    this.obj_paramRS.arr_menuPinColumn.push(obj_metaColumn);
                  }
                  if(obj_metaColumn.InfoPin){
                    this.obj_paramRS.arr_infoPinColumn.push(obj_metaColumn);
                  }                    
                }                  
              }

              
              
              fn_getMetaColumnViaName(str_name){


                
                let str_lname=str_name.toLowerCase();
                let int_totalColumn=this.obj_paramRS.int_totalColumn;                  
                
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                        
                  if(obj_metaColumn.str_name.toLowerCase()===str_lname){
                    return obj_metaColumn;
                  }
                }
              }
              fn_getMetaColumnViaOrdinalPosition(int_num){
                if(!this.obj_paramRS.arr_metaColumn){return;}
                return this.obj_paramRS.arr_metaColumn[int_num];
              }                
              fn_getPDOMetaValue(obj_metaColumn, str_search){                  
                let arr=obj_metaColumn.arr_metaColumnPDO;
                if(!arr){//can be empty object meta column, need to trap before this
                  return;
                }
                return arr[str_search];        
              }
              fn_getMetaFlag(obj_metaColumn, str_search){                  
                //console.log(obj_metaColumn);                  
                let arr=obj_metaColumn.arr_metaColumnPDO;                  
                //console.log("obj_metaColumn.arr_metaColumnPDO follows");                  
                //console.log(arr);                  
                let arrFlag=arr["flags"];                                    
                return obj_shared.fn_inArray(str_search, arrFlag);
              }
              fn_getMetaColumnViaMetaName(MetaSchemaName, MetaTableName, MetaColumnName){
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  if(obj_metaColumn.MetaSchemaName!==MetaSchemaName){continue;}
                  if(obj_metaColumn.MetaTableName!==MetaTableName){continue;}
                  if(obj_metaColumn.MetaColumnName!==MetaColumnName){continue;}
                  return obj_metaColumn;
                }
                return false;
              }    
              fn_getMetaColumnViaMetaShortName(MetaSchemaName, MetaTableName, MetaColumnAPIName){
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  if(obj_metaColumn.MetaSchemaName!==MetaSchemaName){continue;}
                  if(obj_metaColumn.MetaTableName!==MetaTableName){continue;}
                  if(obj_metaColumn.MetaColumnAPIName!==MetaColumnAPIName){continue;}
                  return obj_metaColumn;
                }
                return false;
              }    
              
              fn_getMetaColumnViaFieldId(int_value){//should be deprecated in favour of fn_getMetaColumnViaMetaName, which includes schemaane                  
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                                            
                  if(String(obj_metaColumn.MetaColumnId)===String(int_value)){                    
                    return obj_metaColumn;
                  }                    
                }
              }                
              
              fn_getMetaColumnViaFieldName(str_name){//should be deprecated in favour of fn_getMetaColumnViaMetaName, which includes schemaane                  

                let str_lname=str_name.toLowerCase();
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  let str_lnameField=obj_metaColumn.MetaColumnName.toLowerCase();                                        
                  if(str_lnameField===str_lname){
                    return obj_metaColumn;
                  }
                }
              }    
              fn_getMetaColumnViaFieldShortName(str_shortname){//should be deprecated in favour of fn_getMetaColumnViaMetaName, which includes schemaane                  

                let str_lshortname=str_shortname.toLowerCase();
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {                        
                  let obj_metaColumn=this.fn_getMetaColumn(i);                    
                  let str_lshortnameField=obj_metaColumn.MetaColumnAPIName.toLowerCase();                                        
                  if(str_lshortnameField===str_lshortname){
                    return obj_metaColumn;
                  }
                }
              }    
              
              fn_onComputeColumn(){}

              fn_getMetaColumnPrimaryKey(obj_metaColumnTemplate){                  

                //console.log("obj_metaColumnTemplate follows");
                //console.log(obj_metaColumnTemplate);

                let obj_metaColumn=obj_metaColumnTemplate;

                if(obj_metaColumn.PrimaryPin){//MARKED IN DFATABASE, SET ON AUTOFORM                                                                               
                  return obj_metaColumn;
                }

                //if(this.fn_getMetaFlag(obj_metaColumn, "primary_key")){//AUTO GENERATED NOT IDEAL AFFECTED BY ORDER BY                                                                                  
                  //return obj_metaColumn;
                //}
                
                let int_totalColumn=this.obj_paramRS.int_totalColumn;
                for (let i = 0; i < int_totalColumn; i++) {
                  let obj_metaColumn=this.fn_getMetaColumn(i);                                                            
                  if(!obj_metaColumn){continue;}                                          

                  if(obj_metaColumn.MetaSchemaName!==obj_metaColumnTemplate.MetaSchemaName){continue;}                      
                  if(obj_metaColumn.MetaTableName!==obj_metaColumnTemplate.MetaTableName){continue;}                      

                  if(obj_metaColumn===obj_metaColumnTemplate){                      
                    continue;
                  }                      
                  if(obj_metaColumn.PrimaryPin){//MARKED IN DFATABASE, SET ON AUTOFORM
                    return obj_metaColumn;
                  }

                  //if(this.fn_getMetaFlag(obj_metaColumn, "primary_key")){//AUTO GENERATED NOT IKDEAL AFFECTED BY ORDER BY                  
                   // return obj_metaColumn;
                  //}
                }
                return false;
              }                
              
              


              /////////////////////////
              /////////////////////////
              /////////////////////////
              //END Meta Column Function
              
            }//END CLS
            //END TAG
            //END component/xapp_data