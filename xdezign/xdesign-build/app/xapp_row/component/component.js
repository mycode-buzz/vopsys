
            //XSTART component/xapp_row
              class xapp_row extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_initializeRow(obj_paramRS){                  
                  
                  this.obj_paramRS=obj_paramRS;                                                                                          
                  

                  this.obj_paramRow={};                  
                  this.obj_paramRow.int_countColumn=0;                  
                  this.obj_paramRow.int_countSection=0;                                    
                  this.obj_paramRow.int_sectionColumnCount=0;   
                  
                  this.obj_paramRow.int_ordinalPosition=this.obj_paramRS.int_ordinalPosition;                                    
                  this.obj_paramRow.obj_paramRS=this.obj_paramRS;  
                  
                  this.obj_holder.obj_fieldset=this;//"menu" columns will be added to this row
                  

                  this.fn_computeMetaColumn();                                  
                  
                  this.fn_removeChildren();                                       
                }    
                  
                fn_preComputeColumn(){
                }

                fn_postComputeColumn(){}

                fn_computeMetaColumn(){ 
                  
                  let arr_item=this.obj_paramRow.arr_metaColumn=[];
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  let int_totalColumn=this.obj_paramRS.int_totalColumn;                  
                  let obj_metaData=this.obj_paramRow.obj_metaData={};                                   
                  
                  for (let i = 0; i < int_totalColumn;i++) {                                                                
                    let obj_metaColumn=obj_recordset.fn_getMetaColumn(i);                                                                                                    
                    arr_item.push(obj_metaColumn);                    
                    if(obj_metaColumn.IsMetaData){                                            
                      obj_metaData.bln_hasData=true;                                                                                        
                      obj_metaData[obj_metaColumn.MetaColumnName]=obj_metaColumn.str_value;                                            
                    }                    
                  }
                }

                fn_settingsColumnInterfaceLockedPin(str_exempt){
                
                  this.obj_paramRow.CustomPin=false;
                  let arr_column=this.obj_paramRow.arr_column;                                    
                  this.obj_paramRow.bln_interfaceLockedPin=true;
                  for(let i=0;i<arr_column.length;i++){

                    let obj_column=arr_column[i];                                        
                    let obj_metaColumn=obj_column.obj_metaColumn;                                        
                    if(obj_metaColumn.MetaColumnName.toLowerCase()!=='metacolumnname' && obj_metaColumn.MetaColumnName.toLowerCase()!=='metarowzname'){
                      continue;
                    }
                    
                    let bln_value=obj_shared.fn_inString(str_exempt, obj_metaColumn.str_value);                    
                    if(bln_value){                    
                      this.obj_paramRow.bln_interfaceLockedPin=false;
                      break;
                    }
                    
                  }                                     

                  
                  if(this.obj_paramRow.bln_interfaceLockedPin){

                    for(let i=0;i<arr_column.length;i++){

                      let obj_column=arr_column[i];                                        
                      obj_column.fn_settingsColumnInterfaceLockedPin();                      
                    }                                      

                  }
                }


                
                fn_computeColumns(){                  

                  this.obj_paramRow.arr_column=[];

                  let int_totalColumn=this.obj_paramRS.int_totalColumn;
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  
                  for (let i = 0; i < int_totalColumn; i++) {                                            
                    
                    this.fn_preComputeColumn();                    

                    let obj_metaColumn=obj_recordset.fn_getMetaColumn(i);                                                            
                    //console.log(obj_metaColumn);
                    this.obj_paramRow.obj_metaColumn=obj_metaColumn;                                        
                    //to do : check the column type
                    
                    this.fn_computeColumn(i);                    
                    
                    
                    this.obj_paramRow.int_countColumn++;                    
                    
                    this.fn_postComputeColumn();                                        
                  }

                  this.fn_postComputeColumns();                                       
                  
                } 
                
                fn_postComputeColumns(){                  
                  this.fn_parseColumns();
                }                

                fn_parseColumns(){

                  const arr_nameSummary=[];
                  const arr_valueSummary=[];
                  
                  let arr, i, obj_column;
                  arr=this.obj_paramRow.arr_column;                  
                  let obj_columnMarked;
                  for (i=0;i<arr.length;i++){                    
                    obj_column=arr[i];
                    if(obj_column.bln_isMarked){
                      obj_column.fn_onMarkColumn();
                    }
                    //console.log(obj_column);
                    //if(obj_column.obj_metaColumn.SectionTitle==="Meta"){
                    if(obj_column.obj_metaColumn.MetaColumnAPIName==="metadataid"){                      
                      obj_columnMarked=obj_column;
                    }
                    
                    let bln_addRecordSummary=obj_column.obj_metaColumn.RecordSummaryPin;
                    if(obj_column.obj_metaColumn.MetaPermissionTag.toLowerCase()==="#interface"){
                      if(!obj_userHome.Interface){
                        bln_addRecordSummary=false;                        
                      }
                      
                    }
                    
                    if(bln_addRecordSummary){
                      //console.log(obj_column);
                      //console.log(obj_column.obj_metaColumn);
                      //obj_column.fn_setHiddenPin(true);
                      let str_name=obj_column.obj_metaColumn.MetaLabel;
                      let str_value=obj_shared.fn_replace(obj_column.str_valueDisplay, "&nbsp;", "");                      
                      if(str_value){
                        //console.log("[" + str_value + "]");                        
                        arr_nameSummary.push(str_name);
                        arr_valueSummary.push(str_value);
                      }
                    }
                  }
                  
                  if(obj_columnMarked){//position Meta at End
                    let obj_parent=obj_columnMarked.fn_getParentComponent();                    
                    const childElement = obj_parent.dom_obj;
                    const parentElement = childElement.parentNode;                  
                    parentElement.removeChild(childElement);                        
                    parentElement.appendChild(childElement);
                    
                    let str_html=obj_shared.fn_getHTMLTable(arr_nameSummary, arr_valueSummary );                    
                    if(str_html){
                      let obj_control=obj_parent.fn_addContextItem("form_span");   
                      obj_control.fn_setText(str_html);
                      //obj_control.fn_setDisabled(true);
                    }
                  } 
                }



                
                fn_describeRow(){

                  let arr_item=this.obj_paramRow.arr_metaColumn;                  
                  console.log("arr_metaColumn.length: " + arr_item.length);                    
                  for (let i = 0; i < arr_item.length; i++) {                        
                    let obj_metaColumn=arr_item[i];
                    console.log("obj_metaColumn.str_name: " + obj_metaColumn.str_name);                    
                    console.log("obj_metaColumn.str_value: " + obj_metaColumn.str_value);
                    console.log(obj_metaColumn);                    
                    console.log("-----------------");                    
                  }
                  return false;
                }

                fn_getColumnViaName(str_name){
                  let str_lname=str_name.toLowerCase();                 
                  let arr_item=this.obj_paramRow.arr_column;                                    
                  for (let i = 0; i < arr_item.length; i++) {                        
                    let obj_column=arr_item[i];
                    let obj_metaColumn=obj_column.obj_metaColumn;                    
                 
                    if(obj_metaColumn.str_name.toLowerCase()===str_lname){                 
                      return obj_column;
                    }
                  }
                  
                  return false;
                }

                
                fn_getColumnViaNameSpecial(str_name){
                  let str_lname=str_name.toLowerCase();
                  //console.log("fn_getColumnViaName: " + str_lname);
                  //console.log("str_lname: " + str_lname);
                  let arr_item=this.obj_paramRow.arr_column;                  
                  
                  for (let i = 0; i < arr_item.length; i++) {                        
                    let obj_column=arr_item[i];
                    let obj_metaColumn=obj_column.obj_metaColumn;                    
                    //console.log("obj_metaColumn: " + obj_metaColumn.str_name.toLowerCase());
                    if(obj_metaColumn.str_name.toLowerCase()===str_lname){
                      //console.log("FOUND SEARCH FOR: " + str_lname);
                      return obj_column;
                    }
                  }
                  //console.log("NOT FOUND SEARCH FOR: " + str_lname);
                  return false;
                }
                
                fn_getColumnViaPosition(int_ordinalPosition){
                  return this.obj_paramRow.arr_column[int_ordinalPosition];                  
                }
                
                fn_computeColumn(int_countColumn){ 

                  let str_type, obj_column;
                  
                  str_type=this.obj_paramRS.str_typeColumn;                    
                  if(this.obj_paramRow.obj_metaColumn.MetaClassType){                                        
                    str_type=this.obj_paramRow.obj_metaColumn.MetaClassType;                    
                  }

                  obj_column=this.obj_holder.obj_fieldset.fn_addContextItem(str_type);   
                  
                  //console.log("str_type:" + str_type);
                  
                  if(obj_column){
                    this.obj_paramRow.arr_column.push(obj_column);                    
                    obj_column.fn_initializeColumn(this);//after value will now in place.                                        
                    obj_column.fn_computeField();                  
                  
                    this.fn_onComputecolumn(obj_column);                  
                  
                  }

                //obj_column.fn_debug();

                  
                }                                
                
                fn_onComputecolumn(obj_column){
                  this.obj_paramRS.obj_recordset.fn_onComputeColumn(obj_column);
                }

                fn_getColumnKey(obj_column=false){                                  
                }
                fn_getColumnDataId(){                  
                }
                fn_getColumnArchiveDate(){                
                }
                

                
                
              }//END CLS
              //END TAG
              //END component/xapp_row