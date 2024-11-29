
            //XSTART component/xapp_dataform
              class xapp_dataform extends xapp_data{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                          

                  this.str_defaultTypeRow="xapp_rowform";
                  this.str_defaultTypeColumn="xapp_columnform";                  
                  this.fn_initialize_var();
                }

                fn_initializeRS(obj_menuButton){                                  

                  super.fn_initializeRS(obj_menuButton);
                  
                  this.fn_setAutoJoin(false);                      
                }

                fn_onDataStart(){                  
                  super.fn_onDataStart();
                  let obj_menuButton=this.obj_paramRS.obj_menuButton;  
                }

                fn_iniDataView(){
                  super.fn_iniDataView();

                  let bln_value=this.fn_getQueryModeNewRecord();
                  if(bln_value){                                    
                    //1 row full of qualifiedname emptyvalue pairs                  

                    this.obj_post.RowData=[];
                    this.obj_post.RowData[0]={};
                    let obj_ROW=this.obj_post.RowData[0];                                          
                    let obj_meta;
                    let arr_metaColumn=this.obj_paramRS.arr_metaColumn;
                    for(var i=0;i<arr_metaColumn.length;i++){                            
                      obj_meta=arr_metaColumn[i];                      
                      obj_ROW[obj_meta.str_nameQualified]="";                      
                    }
                  }  
                }

                fn_iniTotalRow(bln_postProcess){ 
                  super.fn_iniTotalRow(bln_postProcess);

                  switch(this.obj_paramRS.int_totalRowReturned){
                    case (0)://no row found
                      this.fn_setDisplay(false);                  
                    break;
                    case (1)://single row found                 
                    break;                    
                    default:
                      if(this.obj_paramRS.int_totalRowReturned>1){//many rows                                    
                        this.obj_paramRS.bln_showFieldHeading=false;                               
                        this.obj_paramRS.bln_autoSection=false;//one section                                    
                        this.obj_paramRS.bln_axis=false;//flex row
                        //this.fn_setAxis(this.obj_paramRS.bln_axis);
                      }
                  }                                    
                }

                fn_getPermissionAddRow(obj_row){

                  if(this.fn_getQueryModeNewRecord()){                    
                    let obj_permitParam=obj_row.obj_paramRow.obj_metaData;                                                 
                    obj_permitParam.MetaPermissionTag="100";                    
                  }
                  
                  return super.fn_getPermissionAddRow(obj_row);
                }
                
                fn_runPushColumn(obj_column){                     
                  //console.log("fn_runPushColumn");                  

                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="runPushColumn";                  
                  
                  //console.log("send MetaKeyColumnValue: " + obj_ini.str_metaKeyColumnValue);

                  obj_ini.str_nameFolderServer=this.obj_holder.obj_query.str_nameFolderServer;                     
                  
                  
                  this.fn_runServerAction(obj_ini);
                } 
                fn_resetAutoJoin(){
                  this.fn_debugText("fn_resetAutoJoin");
                  this.fn_setAutoJoin(false);
                  this.fn_setAutoJoinToSource("");                  
                  this.fn_setAutoJoinToKeyValue("");                  
                  this.fn_setAutoJoinToKeyName("");                  
                  this.fn_setAutoJoinFromKeyValue("");                  
                  this.fn_setAutoJoinFromKeyName("");                  
                  this.fn_setLinkOffPin(false);
                  this.fn_setLinkOnPin(false);                  
                }
                fn_setAutoJoin(bln_value){
                  this.fn_setAutoJoinPin(bln_value);
                  this.fn_setAutoJoinFilterPin(bln_value);                                    
                }
                fn_setAutoJoinPin(bln_value){                                  
                  this.obj_holder.obj_query.bln_autoJoinPin=bln_value;                  
                }     
                fn_setAutoJoinFilterPin(bln_value){                              
                  this.obj_holder.obj_query.bln_autoJoinFilterPin=bln_value;                  
                }     
                fn_setAutoJoinToSource(str_value){                                                    
                  this.obj_holder.obj_query.str_autoJoinToSource=str_value;
                }     
                fn_setAutoJoinToKeyValue(str_value){                                                    
                  this.obj_holder.obj_query.str_autoJoinToKeyValue=str_value;                  
                }                                     
                fn_setAutoJoinToKeyName(str_value){                  
                  this.obj_holder.obj_query.str_autoJoinToKeyName=str_value;                  
                }     
                
                fn_setAutoJoinFromKeyValue(str_value){
                  this.obj_holder.obj_query.str_autoJoinFromKeyValue=str_value;
                }
                fn_setAutoJoinFromKeyName(str_value){                  
                  this.obj_holder.obj_query.str_autoJoinFromKeyName=str_value;                  
                }
                fn_setLinkOffPin(bln_value){                                                    
                  this.obj_holder.obj_query.bln_linkOffPin=bln_value;
                }
                fn_setLinkOnPin(bln_value){                                                    
                  this.obj_holder.obj_query.bln_linkOnPin=bln_value;
                }               
                
                
                runPushColumn(obj_post){  
                  this.obj_post=obj_post;
                  this.fn_receiveColumn(obj_post);
                }
                
                fn_receiveColumn(obj_post){      
                  
                  //reset to original id                
                  this.obj_holder.obj_query.int_idMetaView=this.obj_paramRS.obj_menuButton.fn_getMetaViewId();                
                  //reset to original id

                  //to do check wether the form has not been altered by another user action in the meantime                  
                  if(!this.obj_paramRS.arr_rows){return;}                  

                  //currently not used , but remains as template for row-wide event handle
                  //this.fn_setModeUnLocked();                    
                  
                  let obj_metaColumn=this.fn_setMetaColumnValue(this.obj_post.MetaColumnPosition, this.obj_post.MetaColumnValue);
                  if(!obj_metaColumn){
                    console.log("Error: DataForm- Column Not found. fn_receiveColumn.");
                    return;
                  } 

                  //console.log("obj_metaColumn.str_name: " + obj_metaColumn.str_name);                 

                  if(obj_post.ModeNewRecord){
                    this.fn_setQueryModeNewRecord(false);//turn off new record mode
                    this.fn_onNewRecordUpdateMetaKey(obj_post);
                    this.fn_onNewRecordUpdateDataKey(obj_post);                    
                  }                

                  this.obj_paramRS.obj_row.fn_removeThemeError();                                    
                  
                  if(obj_post.Response && obj_post.Response.column_required){                                               
                    let obj_columnRequired=this.obj_paramRS.obj_row.fn_getColumnViaName(obj_post.Response.column_required);                    
                    obj_columnRequired.fn_applyThemeError();
                  }                  

                  let obj_column=this.obj_paramRS.obj_row.fn_getColumnViaName(obj_metaColumn.str_name);                                      
                  obj_column.fn_receiveColumn();
                  
                  this.obj_paramRS.obj_menuButton.fn_receiveColumn(this, obj_column, obj_post);
                  /*
                  if(this.obj_paramRS.obj_menuButton.bln_dynamicMenu){//menuButton is generated from dataset
                    if(obj_metaColumn.MenuPin){
                      this.obj_paramRS.obj_menuButton.fn_updateButtonText(this);                    
                    }
                  } 
                    //*/            
                }

                fn_onNewRecordUpdateMetaKey(obj_post){

                  let obj_metaColumnKey
                  obj_metaColumnKey=this.fn_getMetaColumnViaMetaName(obj_post.MetaKeySchemaName, obj_post.MetaKeyTableName, obj_post.MetaKeyColumnName);
                  if(!obj_metaColumnKey){
                    alert("1 fn_onNewRecordUpdateMetaKey obj_metaColumnKey is false");
                    return;};
                  obj_metaColumnKey.str_value=obj_post.MetaKeyColumnValue;  

                  let obj_columnKey=this.obj_paramRS.obj_row.fn_getColumnViaPosition(obj_metaColumnKey.int_ordinalPosition);                                                                                                            
                  obj_columnKey.fn_setValue(obj_metaColumnKey.str_value);                                    
                  obj_columnKey.fn_setText(obj_metaColumnKey.str_value);                                    
                  

                  //console.log(obj_columnKey);                  
                  //obj_columnKey.fn_debug();
                  
                  

                  this.fn_onNewRecordPushDefaultValueColumns();

                  let obj_menuButton=this.obj_paramRS.obj_menuButton;
                  obj_menuButton.fn_onNewRecordUpdateMetaKey(obj_columnKey);

                }
                fn_onNewRecordUpdateDataKey(obj_post){

                  let obj_metaColumnKey;
                  obj_metaColumnKey=this.fn_getMetaColumnViaMetaName("meta_data", "meta_data", "MetaDataId");
                  if(!obj_metaColumnKey){
                    alert("2 fn_onNewRecordUpdateDataKey obj_metaColumnKey is false");
                    return;};
                  obj_metaColumnKey.str_value=obj_post.DataKeyColumnValue;                                      

                  let obj_columnKey=this.obj_paramRS.obj_row.fn_getColumnViaPosition(obj_metaColumnKey.int_ordinalPosition);
                  obj_columnKey.fn_setValue(obj_metaColumnKey.str_value);                                    
                  obj_columnKey.fn_setText(obj_metaColumnKey.str_value);                                    
                  
                  this.fn_onNewRecordPushDefaultValueColumns(true);
                }

                
                fn_onNewRecordPushDefaultValueColumns(bln_isData=false){

                  let obj_row, obj_column;
                  obj_row=this.obj_paramRS.arr_rows[0];
                  if(obj_row){
                    obj_row.fn_onNewRecordPushDefaultValueColumns(bln_isData);                                    
                  }
                  return false;
                }

                fn_setMetaColumnKey(obj_column){                  
                  
                  if(!obj_column.fn_getMetaColumnKey() || this.fn_getQueryModeNewRecord()){
                    let obj_metaColumnTemplate=obj_column.obj_metaColumn;
                    let obj_metaColumnKey=this.fn_getMetaColumnPrimaryKey(obj_metaColumnTemplate);                                                                          
                    obj_column.fn_setMetaColumnKey(obj_metaColumnKey);
                  }
                }

                
                fn_getColumnViaRowColumnPosition(int_rowPosition, int_columnPosition){

                  let obj_row, obj_column;
                  obj_row=this.obj_paramRS.arr_rows[int_rowPosition];
                  if(obj_row){
                    obj_column=obj_row.fn_getColumnViaPosition(int_columnPosition);                  
                    if(obj_column){
                      return obj_column;
                    }
                  }
                  return false;
                }                

                fn_archiveRecord(obj_columnKey){   

                  let int_columnKey=obj_columnKey.fn_getColumnValue();
                  this.obj_holder.obj_query.str_metaKeyColumnValue=int_columnKey;
                  this.fn_runArchiveRecord();
                }

                fn_runArchiveRecord(){                                       
                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="runArchiveRecord";                                                              
                  this.fn_runServerAction(obj_ini);
                }
                runDeleteRow(){                                      
                  this.obj_paramRS.obj_menuButton.fn_onDeleteDynamicRow();//should be a dynamic menu                                    
                } 
                runArchiveRecord(){
                  //console.log("runArchiveRecord");
                  this.obj_paramRS.obj_menuButton.fn_onArchiveRecord();//should be a dynamic menu                                    
                } 
                

                
                fn_pushColumn(obj_column){                             
                  //console.log("data fn_pushColumn");

                  //currently not used , but remains as template for row-wide event handle
                  //this.fn_setModeLocked();                  
                  
                  //used to update or insert or delete record                                    
                  let bln_value=this.fn_formatColumnQuery(obj_column);                  
                  if(!bln_value){return;}
                  
                  this.fn_runPushColumn(obj_column);
                } 

                fn_formatColumnQuery(obj_column){

                  let obj_row, obj_columnKey, obj_metaColumn, obj_metaColumnKey;

                  let bln_formNewRecord=this.obj_holder.obj_query.bln_modeNewRecord;                                    

                  obj_metaColumn=obj_column.obj_metaColumn;

                  this.fn_setMetaColumnKey(obj_column);                  
                  obj_metaColumnKey=obj_column.fn_getMetaColumnKey();//we dont have akey for this field, so no update , (but can insert ?)                                    
                  if(!obj_metaColumnKey && !bln_formNewRecord){                    
                    //alert("!obj_metaColumnKey && !bln_formNewRecord");
                    return false;//no update
                  }             

                  obj_row=obj_column.obj_row;
                  obj_columnKey=obj_row.fn_getColumnKey(obj_column);//either the record id or  metadata id                                                            
                  if(!obj_columnKey){
                    //alert("fn_formatColumnQuery: column key is false");
                    return false;
                  }
                  
                  //console.log("obj_columnKey.str_value: " + obj_columnKey.str_value);
                  //We have potentially just changed the view from the main menu view                                    
                  this.obj_holder.obj_query.int_idMetaView=obj_metaColumn.MetaViewId;
                  //We have potentially just changed the view from the main menu view
                  //we will reset on return

                  this.obj_holder.obj_query.str_metaSchemaName=obj_metaColumn.MetaSchemaName;
                  this.obj_holder.obj_query.str_metaTableName=obj_metaColumn.MetaTableName;
                  this.obj_holder.obj_query.str_metaColumnName=obj_metaColumn.MetaColumnName;
                  this.obj_holder.obj_query.str_metaColumnAPIName=obj_metaColumn.MetaColumnAPIName;
                  this.obj_holder.obj_query.str_metaColumnValue=obj_column.fn_getColumnValue();
                  this.obj_holder.obj_query.str_metaList=obj_metaColumn.MetaList;
                  this.obj_holder.obj_query.str_metaListIdValue=obj_column.str_metaListIdValue;
                  this.obj_holder.obj_query.str_metaOption=obj_metaColumn.MetaOption;
                  
                  
                  this.obj_holder.obj_query.str_metaColumnPosition=obj_column.obj_metaColumn.int_ordinalPosition;
                  this.obj_holder.obj_query.str_metaRowPosition=obj_row.obj_paramRow.int_ordinalPosition;                  
                  this.obj_holder.obj_query.str_metaColumnId=obj_column.obj_metaColumn.MetaColumnId;

                  this.obj_holder.obj_query.str_metaKeySchemaName=obj_metaColumnKey.MetaSchemaName;
                  this.obj_holder.obj_query.str_metaKeyTableName=obj_metaColumnKey.MetaTableName;
                  this.obj_holder.obj_query.str_metaKeyColumnName=obj_metaColumnKey.MetaColumnName;
                  this.obj_holder.obj_query.str_metaKeyColumnValue=obj_columnKey.str_value;

                  //USED TO CHANGE BETWEEN SYSTEMS IN OFFICE
                  let obj_metaColumnMetaSystemId=this.fn_getMetaColumnViaMetaName("meta_data", "meta_data", "MetaDataSystemId");                                    
                  if(obj_metaColumnMetaSystemId){
                    let obj_columnDataSystemId=obj_row.fn_getColumnViaPosition(obj_metaColumnMetaSystemId.int_ordinalPosition);                                                        
                    if(obj_columnDataSystemId){
                      this.obj_holder.obj_query.str_metaDataSystemId=obj_columnDataSystemId.fn_getValue();                    
                    }
                  };                                     
                  //USED TO CHANGE BETWEEN SYSTEMS IN OFFICE

                  return true;
                }                               

                //UPDATE LIST
                fn_updateListSelect(obj_column){                     

                  let bln_value=this.fn_formatColumnQuery(obj_column);                  
                  if(!bln_value){return;}

                  this.fn_runUpdateListSelect(obj_column);
                }                

                fn_runUpdateListSelect(obj_column){                                       

                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="updateDropdownList";
                  obj_ini.str_nameFolderServer=this.obj_holder.obj_query.str_nameFolderServer;                  
                  this.fn_runServerAction(obj_ini);
                }

                updateDropdownList(obj_post){  
                  this.obj_post=obj_post;                                   
                  
                } 
                //UPDATE LIST

                //GET LIST
                fn_getListSelectFromServer(obj_column){                                       

                  let bln_value=this.fn_formatColumnQuery(obj_column);                  
                  if(!bln_value){return;}
                  
                  let obj_ini=this.obj_holder.obj_query;                        
                  obj_ini.str_action="getDropdownList";
                  obj_ini.str_nameFolderServer=this.obj_holder.obj_query.str_nameFolderServer;                  
                  this.fn_runServerAction(obj_ini);
                }
                getDropdownList(obj_post){  
                  this.obj_post=obj_post;                                   
                  this.fn_receiveDropdownList(obj_post);
                }                 
                fn_receiveDropdownList(obj_post){   
                  //locate column and update list
                  let obj_column=this.fn_getColumnViaRowColumnPosition(obj_post.MetaRowPosition, obj_post.MetaColumnPosition);                                                                        
                  if(!obj_column){return;}                                    
                  obj_column.fn_receiveDropdownList(obj_post);
                }
                //GET LIST

                fn_setModeExecuteNew(){
                  this.int_modeExecute=obj_holder.int_modeNew;                  
                  return false;
                }
                fn_getModeExecuteNew(){
                  if(this.int_modeExecute===obj_holder.int_modeNew){return true;}
                  return false;
                }
                fn_setModeExecuteEdit(){                                                      
                  super.fn_setModeExecuteEdit();                                 

                  let i, arr_rows, obj_row;
                  arr_rows=this.obj_paramRS.arr_rows;
                  if(!arr_rows){return;}
                  for(i=0;i<arr_rows.length;i++){
                    obj_row=arr_rows[i];
                    obj_row.fn_setModeExecuteEdit();
                  }
                }                
                
                fn_setQueryModeNewRecord(bln_value){
                  this.obj_holder.obj_query.bln_modeNewRecord=bln_value;                                                     
                  
                }                
                fn_getQueryModeNewRecord(){
                  return this.obj_holder.obj_query.bln_modeNewRecord;                  
                }                
                                 
                                               
                fn_setModeLocked(){                                    
                  //currently not used , but remains as template for row-wide event handle
                  let i, arr_rows, obj_row;
                  arr_rows=this.obj_paramRS.arr_rows;
                  for(i=0;i<arr_rows.length;i++){
                    obj_row=arr_rows[i];
                    obj_row.fn_onDataSetModeLocked();                                      
                  }                  
                }
                fn_setModeUnLocked(){  
                  //currently not used , but remains as template for row-wide event handle
                  let i, arr_rows, obj_row;
                  arr_rows=this.obj_paramRS.arr_rows;
                  if(!arr_rows){                    
                    return;
                  }
                  for(i=0;i<arr_rows.length;i++){
                    obj_row=arr_rows[i];
                    obj_row.fn_onDataSetModeUnLocked();                                      
                  }
                }
                fn_getModeLocked(){                  
                  if(this.int_modeExecute===obj_holder.int_modeLocked){
                    return true;
                  }             
                  return false;                       
                }

                xfn_cascadeFlipHeading(){        
                  this.obj_paramRS.bln_showFieldHeading=obj_shared.fn_flipBool(this.obj_paramRS.bln_showFieldHeading);
                  super.xfn_cascadeFlipHeading(this.obj_paramRS.bln_showFieldHeading);                
                }                 
                
                fn_onComputeColumn(obj_column){}
              }//END CLS
              //END TAG
              //END component/xapp_dataform