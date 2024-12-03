
            //XSTART component/xapp_rowform
              class xapp_rowform extends xapp_row{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_initializeRow(obj_paramRS){                  

                  super.fn_initializeRow(obj_paramRS);                  
                  
                  if(!this.obj_paramRS.bln_reportView){
                    //this.fn_debugText("fn_flipAxis");
                    //this.fn_flipAxis(this.obj_paramRS.bln_axis);
                  }                  
                }                  
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("yellow");}                                    
                }                
                fn_onNewRecordPushDefaultValueColumns(bln_isData=false){
                  let arr, i, obj_column;
                  arr=this.obj_paramRow.arr_column;
                  for (i=0;i<arr.length;i++){                    
                    obj_column=arr[i];
                    let obj_metaColumn=obj_column.obj_metaColumn;                  
                    if(obj_metaColumn.DefaultValue){
                      //console.log(obj_metaColumn);
                      if(!bln_isData){
                        if(obj_metaColumn.IsMetaData){
                          continue;
                        }
                      }
                      else{
                        if(!obj_metaColumn.IsMetaData){
                          continue;
                        }
                      }                    
                      obj_column.fn_pushColumn();
                    }
                    
                    
                    //console.log(obj_column);
                  }

                }

                
                fn_onDataSetModeLocked(){                  
                  //currently not used , but remains as template for column-wide event handle
                  let arr, i, obj_column;
                  arr=this.obj_paramRow.arr_column;
                  for (i=0;i<arr.length;i++){                    
                    obj_column=arr[i];
                    obj_column.fn_onDataSetModeLocked();                    
                  }
                }

                fn_onDataSetModeUnLocked(){
                  //currently not used , but remains as template for column-wide event handle                  
                  let arr, i, obj_column;
                  arr=this.obj_paramRow.arr_column;
                  for (i=0;i<arr.length;i++){                    
                    obj_column=arr[i];
                    obj_column.fn_onDataSetModeUnLocked();
                  }
                }
                
                fn_preComputeColumn(){
                  super.fn_preComputeColumn();
                }

                fn_postComputeColumn(){
                  if(this.obj_paramRS.bln_autoSection){
                    this.obj_paramRow.int_sectionColumnCount++;                  
                  }
                }
                
                fn_computeColumns(){                  
                  
                  this.fn_addFormPanel();

                  super.fn_computeColumns();
                }                

                fn_postComputeColumns(){

                  super.fn_postComputeColumns();
                  
                  const obj_fieldset=this.obj_holder.obj_fieldset;
                  if(obj_fieldset){//refers only to the last section on the form
                    if(!obj_fieldset.obj_design.lockOpen){                    
                      obj_fieldset.fn_close();
                    }
                  }
                }

                fn_addFormPanel(){                                                                    
                  if(this.obj_paramRS.bln_reportView){return;}
                  const obj_formPanel=this.fn_addContextItem("form_panel");                                    
                  obj_formPanel.fn_onRowMember(this);                                    
                  this.obj_holder.obj_formPanel=obj_formPanel;                  
                  
                }        

                fn_computeColumn(int_countColumn){ 

                  let str_type, obj_column;
                  
                  str_type=this.obj_paramRS.str_typeColumn;                    
                  if(this.obj_paramRow.obj_metaColumn.MetaClassType){//class type for column                                    
                    str_type=this.obj_paramRow.obj_metaColumn.MetaClassType;                  
                  }
                  //console.log("str_type:" + str_type);

                  this.fn_configureSection(int_countColumn);
                  
                  const obj_fieldset=this.obj_holder.obj_fieldset;                  

                  obj_column=obj_fieldset.fn_addContextItem(str_type);
                  
                  if(obj_column){
                    this.obj_paramRow.arr_column.push(obj_column);
                    obj_column.fn_initializeColumn(this);//paramrow has the current metacolumn                    
                    obj_column.fn_computeField();                  

                    this.fn_onComputecolumn(obj_column);                                      
                    
                  }
                  //obj_column.fn_debug();
                }                 

                fn_configureSection(int_countColumn){                  
                  
                  let str_sectionTitle=this.obj_paramRow.obj_metaColumn.SectionTitle;
                  

                  this.bln_shift=false;                    
                  if(!int_countColumn){                  
                    if(!str_sectionTitle){
                      //str_sectionTitle="Record";
                    }                    
                  }
                  
                  if(str_sectionTitle){                                                          
                    this.bln_shift=true;                    
                  }                  

                  if(this.bln_shift){
                    this.fn_addSection(this.obj_paramRow.obj_metaColumn);                                     
                  }
                }                    
                fn_getColumnViaPosition(int_ordinalPosition){
                  return this.obj_paramRow.arr_column[int_ordinalPosition];
                  
                }
                fn_getColumnKey(obj_column=false){
                  let obj_recordset, obj_metaColumn, obj_metaColumnKey, obj_columnKey
                  if(obj_column){
                    if(obj_column){
                      obj_metaColumn=obj_column.obj_metaColumn;                      
                      let MetaTableKeyField=obj_metaColumn.MetaTableKeyField;                      
                      if(MetaTableKeyField.toLowerCase()==="metadataid"){                                                
                        obj_columnKey=this.fn_getColumnDataId();
                        return obj_columnKey;
                      }
                    }
                  }
                  obj_recordset=this.obj_paramRS.obj_recordset;
                  obj_metaColumn=obj_recordset.fn_getMetaColumnViaOrdinalPosition(0);                       
                  obj_metaColumnKey=obj_recordset.fn_getMetaColumnPrimaryKey(obj_metaColumn);                              
                  obj_columnKey=this.fn_getColumnViaPosition(obj_metaColumnKey.int_ordinalPosition);                                                                                    
                  obj_columnKey.fn_setMetaColumnKey(obj_metaColumnKey);
                  return obj_columnKey;
                }
                fn_getColumnDataId(){
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  let obj_metaColumnDataId=obj_recordset.fn_getMetaColumnViaFieldShortName("metadataid");                                                                          
                  return this.fn_getColumnViaPosition(obj_metaColumnDataId.int_ordinalPosition);                                                                                
                }
                fn_getColumnArchiveDate(){
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  let obj_metaColumnArchiveDate=obj_recordset.fn_getMetaColumnViaFieldShortName("ArchiveDate");                                                                          
                  return this.fn_getColumnViaPosition(obj_metaColumnArchiveDate.int_ordinalPosition);                                                                                
                }
                

                fn_addSection(obj_metaColumn){                                                      
                  
                  
                  this.obj_paramRow.int_countSection++;                  
                  this.obj_paramRow.int_sectionColumnCount=0;                                     
                  
                  const obj_fieldset=this.obj_holder.obj_fieldset=this.obj_holder.obj_formPanel.fn_addContextItem("form_fieldset");
                  obj_fieldset.fn_onRowMember(this);

                  
                  let str_sectionTitle=obj_metaColumn.SectionTitle;
                  if(str_sectionTitle){                                                                                
                    obj_fieldset.fn_setText(str_sectionTitle);                                                       
                  }

                  let bln_lockOpen=true;                                      
                  let bln_sectionClose=obj_metaColumn.SectionClose;
                  if(bln_sectionClose){                         
                    bln_lockOpen=false;                                                                           
                  }
                  obj_fieldset.obj_design.lockOpen=bln_lockOpen;                    
                }               

                
                fn_getListSelectFromServer(obj_column){                  
                  this.obj_paramRS.obj_recordset.fn_getListSelectFromServer(obj_column);
                }
                fn_pushColumn(obj_column){
                  //console.log("row fn_pushColumn");
                  this.obj_paramRS.obj_recordset.fn_pushColumn(obj_column);
                }
                fn_onComputecolumn(obj_column){
                  this.obj_paramRS.obj_recordset.fn_onComputeColumn(obj_column);
                }

                fn_removeThemeError(){

                  let arr_column=this.obj_paramRow.arr_column;
                  for(let i=0;i<arr_column.length;i++){

                    let obj_column=arr_column[i];                                        
                    obj_column.fn_removeThemeError();
                  }                  

                }

                
                
                fn_setModeExecuteView(){
                  
                  super.fn_setModeExecuteView();

                  let arr_column=this.obj_paramRow.arr_column;                  
                  for(let i=0;i<arr_column.length;i++){

                    let obj_column=arr_column[i];                    
                    if(obj_column===this.obj_selectedColumn){
                      continue;
                    }                    
                    let obj_metaColumn=obj_column.obj_metaColumn;                    
                    if(obj_metaColumn.MetaList && obj_metaColumn.obj_metaList){                    
                      if(obj_metaColumn.obj_metaList.AllowMultiple){                        
                        //continue;
                      }
                    }                    
                   
                    if(obj_metaColumn.bln_debugColumn){
                      obj_column.fn_debugLabel("ROW obj_column.fn_getModeExecuteEdit: " + obj_column.fn_getModeExecuteEdit());
                    }
                    if(obj_column.fn_getModeExecuteEdit()){
                      obj_column.fn_transferEditToView();                                                               
                    }
                  }                  

                }

                fn_setModeExecuteEdit(){
                  alert("should not see row fn_setModeExecuteEdit");
                  super.fn_setModeExecuteEdit();

                  let arr_column=this.obj_paramRow.arr_column;
                  for(let i=0;i<arr_column.length;i++){

                    let obj_column=arr_column[i];
                    obj_column.fn_setModeExecuteEdit();
                  }                  

                }
              }//END CLS
              //END TAG
              //END component/xapp_rowform