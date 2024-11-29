            //XSTART component/xapp_column
              class xapp_column extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }                   
                fn_onLoad(){
                  super.fn_onLoad();
                  //this.fn_setStyleProperty("border", "10px solid orange");                                    

                  
                  
                  this.obj_themeItemHighlight=this.fn_applyTheme("form_blockHighlight", true);                  
                  this.str_colorHighlight="orange";
                  if(this.obj_themeItemHighlight){
                    this.str_colorHighlight=this.obj_themeItemHighlight.fn_getStyleProperty("background");                  
                  }
                  

                  this.obj_themeItemLegend=this.fn_applyTheme("form_legend", true);                  
                  if(this.obj_themeItemLegend){
                  this.str_borderLegend=this.obj_themeItemLegend.fn_getStyleProperty("border");                  
                  }
                }
                
                fn_filterArray(item, thisArg) {
                  return item.startsWith(thisArg.str_tag);
                }

                fn_initializeColumn(obj_row){                                                      

                  this.debugTypeColumn="xapp_column";                  

                  this.obj_row=obj_row;
                  
                  this.obj_paramRow=this.obj_row.obj_paramRow;                                    
                  this.obj_paramRS=this.obj_paramRow.obj_paramRS;                                                       

                  
                  if(this.obj_paramRS.obj_recordset.fn_getModeExecuteNew){
                    this.bln_modeNewRecord=this.obj_paramRS.obj_recordset.fn_getModeExecuteNew();                    
                  }
                  
                  this.bln_locked=false;
                  let obj_metaColumn=this.obj_metaColumn=this.obj_paramRow.obj_metaColumn;                  

                  this.str_valueInitial=obj_metaColumn.str_value;                  
                  
                  //console.log(obj_metaColumn);

                  if(obj_metaColumn.MetaList){                
                    obj_metaColumn.obj_metaList=obj_shared.fn_parseList(obj_metaColumn.MetaList);
                  }
                  let obj_metaOption=obj_shared.fn_parseList(obj_metaColumn.MetaOption);                  
                  if(obj_metaColumn.MetaOption){                      
                    
                    //META OPTION
                    for (let str_property in obj_metaOption) {//add metaoption if not existing as independent feature
                      let bln_writeOption=false;
                      
                      let str_value=obj_metaOption[str_property];
                      
                      delete obj_metaOption[str_property];//remove any miscase.
                      
                      str_property=str_property.toLowerCase();

                      obj_metaOption[str_property]=str_value;

                      switch(str_property){                                                
                        case "placeholder":
                        case "formexpand":
                        case "formposition":                        
                        case "unsigned":
                        case "decimal": 
                        case "datetimesecond":                        
                            bln_writeOption=true;
                        break;
                      }
                      
                      if(bln_writeOption){
                        obj_metaColumn[str_property]=obj_metaOption[str_property];
                        
                        if(this.obj_metaColumn.DebugPin){
                          this.fn_debugLabel(str_property + ": " + obj_metaColumn[str_property]);                    
                        }
                      }
                    }
                    //META OPTION
                  }  
                  
                  
                  
                  obj_metaColumn.DebugPin=obj_shared.fn_parseBool(obj_metaColumn.DebugPin);                                    
                  obj_metaColumn.ValidationError=false;                  
                  obj_metaColumn.LivePin=obj_shared.fn_parseBool(obj_metaColumn.LivePin);                                    
                  obj_metaColumn.HiddenPin=obj_shared.fn_parseBool(obj_metaColumn.HiddenPin);                                                                        
                  obj_metaColumn.MaxLength=obj_shared.fn_parseInt(obj_metaColumn.MaxLength);                                       
                  obj_metaColumn.RequiredPin=obj_shared.fn_parseBool(obj_metaColumn.RequiredPin);                                    
                  obj_metaColumn.PrimaryPin=obj_shared.fn_parseBool(obj_metaColumn.PrimaryPin);                                                      
                  obj_metaColumn.LockedPin=obj_shared.fn_parseBool(obj_metaColumn.LockedPin);                                    
                  obj_metaColumn.FormOrder=obj_shared.fn_parseInt(obj_metaColumn.FormOrder);
                  
                  obj_metaColumn.FormExpand=obj_shared.fn_parseBool(obj_metaColumn.formexpand);//MetaOption LCase
                  obj_metaColumn.FormPosition=obj_shared.fn_parseString(obj_metaColumn.formposition);//MetaOption LCase                                                            
                  obj_metaColumn.PlaceHolder=obj_shared.fn_parseString(obj_metaColumn.placeholder);//MetaOption LCase                                                            
                  obj_metaColumn.UnSigned=obj_shared.fn_parseInt(obj_metaColumn.unsigned);//MetaOption LCase                                          
                  obj_metaColumn.Decimal=obj_shared.fn_parseInt(obj_metaColumn.decimal);//MetaOption LCase                                                            
                  obj_metaColumn.DateTimeSecond=obj_shared.fn_parseBool(obj_metaColumn.datetimesecond);//MetaOption LCase                                                            
                                    

                  delete obj_metaColumn["formexpand"];//remove lcase
                  delete obj_metaColumn["formposition"];//remove lcase
                  delete obj_metaColumn["placeholder"];//remove lcase
                  delete obj_metaColumn["unsigned"];//remove lcase
                  delete obj_metaColumn["decimal"];//remove lcase
                  delete obj_metaColumn["datetimesecond"];//remove lcase                  

                  obj_metaColumn.DateTime=false;                  
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){
                    case "date":
                      obj_metaColumn.DateTimeSecond=false;
                      break;
                    case "datetime":
                      obj_metaColumn.DateTime=true;                      
                      obj_metaColumn.DateTimeSecond=obj_shared.fn_parseBool(obj_metaColumn.DateTimeSecond);                          
                      break;
                    case "currency":
                    case "percent":
                    case "number":                      
                      obj_metaColumn.Decimal=obj_shared.fn_parseInt(obj_metaColumn.Decimal);                                                                        
                      obj_metaColumn.UnSigned=obj_shared.fn_parseBool(obj_metaColumn.UnSigned);                                                   
                      break;   
                    case "note":
                    case "text":
                      obj_metaColumn.MaxLength=obj_shared.fn_parseInt(obj_metaColumn.MaxLength);                                            
                  }   

                  if(obj_metaColumn.DebugPin){                          
                    //this.fn_debugText("obj_metaColumn.MaxLength", obj_metaColumn.MaxLength)
                    console.log(obj_metaOption);
                    console.log(obj_metaColumn);                        
                }
                  
                  
                  
                  

                  
                  //this.bln_debugColumn=this.obj_metaColumn.DebugPin;
                  this.bln_debugColumn=false;
                  //IMPORTANT DONT SET VALUE BEFORE THIS POINT

                  
                  if(this.obj_metaColumn.DebugPin){
                    //console.log(obj_metaColumn);                    
                  }
                  if(obj_metaColumn.FormPosition){
                    this.bln_isMarked=true;                                                            
                  }
                  if(obj_metaColumn.FormExpand){
                    this.bln_isMarked=true;                                                            
                  }

                  if(obj_project.bln_isMobile){
                    obj_metaColumn.FormExpand=true;
                  }                      
                  
                  /*
                  if(obj_metaColumn.FormExpand){
                    let bln_value=true;
                    if(obj_project.bln_isMobile){
                      bln_value=true;
                    }                      
                    if(bln_value){
                      this.fn_setStyleProperty("width", "100%");                                                                  
                    } 
                  }
                  //*/

                  

                  
                  
                  
                  
                  if(obj_metaColumn.LockedPin){
                    this.fn_setLocked();                                            
                  }                           

                  if(obj_metaColumn.HiddenPin){
                    this.fn_setHiddenPin();                        
                  }                   

                  const obj_metaDataRow=JSON.parse(JSON.stringify(this.obj_paramRow.obj_metaData));                  
                  
                  let bln_debugPermit=false;
                  
                  if(this.bln_debugColumn){                    
                    //console.log("DEBUG SET FOR [" + obj_metaColumn.str_property + "]");
                    //console.log(obj_metaColumn);                    
                    //bln_debugPermit=true;
                  }
                  

                  //allows for more or less strict permissions to be applied to this object
                  
                  let obj_permit;                  
                  obj_permit=obj_permitManger.fn_compare(obj_userHome, obj_metaDataRow, "COMPARE USER TO ROW",  bln_debugPermit);                                      
                  if(obj_permit){
                    obj_permitManger.fn_applyPermit(this.obj_metaColumn, obj_permit, this.bln_modeNewRecord);                                                      
                  }                    
                  
                  //IF INDIVIDUAL ROW LEVEL PERMISSON TICKED , APPLY - TODO!)
                  /*                  
                  obj_permit=obj_permitManger.fn_compare(obj_metaDataRow, obj_userHome, "COMPARE ROW TO USER", bln_debugPermit);
                  if(obj_permit){
                    obj_permitManger.fn_applyPermit(this.obj_metaColumn, obj_permit, this.bln_modeNewRecord);                    
                  }                                      
                  //*/                  
                  
                  obj_permit=obj_permitManger.fn_compare(obj_metaColumn, obj_userHome, "COMPARE COLUMN TO USER",  bln_debugPermit);
                  if(obj_permit){
                    obj_permitManger.fn_applyPermit(this.obj_metaColumn, obj_permit, this.bln_modeNewRecord);                    
                  }   
                  
                  if(obj_metaColumn.PrimaryPin){
                    this.obj_metaColumn.LockedPin=true;
                  }                       

                  if(this.obj_metaColumn.LockedPin){
                    this.fn_setLocked();                        
                  }                                                                                                       

                  if(this.obj_metaColumn.HiddenPin){
                    this.fn_setHiddenPin();                        
                  }                                    

                  if(bln_debugPermit){                    
                    //this.fn_debugText("this.obj_metaColumn.HiddenPin: " + this.obj_metaColumn.HiddenPin);
                    //this.fn_debugText("this.obj_metaColumn.LockedPin: " + this.obj_metaColumn.LockedPin);
                    //this.fn_debug();
                  }                  

                  //END. SET VALUE
                  this.fn_setValue(obj_metaColumn.str_value);
                  
                }

                fn_settingsColumnInterfaceLockedPin(){                  
                  //only on settings meta column
                  //console.log(this.obj_metaColumn.MetaColumnName);
                  switch(this.obj_metaColumn.MetaColumnName.toLowerCase()){
                    //case("metaoption"):
                    case("metacolumntype"):
                    case("metacolumnname"):
                    
                    case("buttonconsole"):
                    case("metatyperowzdashboard"):
                    case("metatyperowzwidget"):
                    case("rowzicon"):                    
                      this.fn_setLocked();                                              
                      break;
                    default:                        
                      
                  }
                  
                }

                fn_onMarkColumn(){

                  this.bln_isMarked=false;
                  
                  if(this.obj_metaColumn.FormPosition){
                    this.fn_moveFormPosition(this.obj_metaColumn.FormPosition);
                  }
                  if(this.obj_metaColumn.FormExpand){
                    this.fn_formExpand(this.obj_metaColumn.FormExpand);
                  }
                  
                }                

                fn_formExpand(bln_value){
                  
                  if(!obj_shared.fn_isBool(bln_value)){
                    return;
                  }
                  
                  if(!bln_value){
                    return;
                  }
                  
                  let bln_formExpand=false;
                  switch(this.obj_metaColumn.MetaColumnType.toLowerCase()){                    
                    case "note":
                      bln_formExpand=true;
                      break;
                    default:
                      break;
                  }

                  if(this.obj_metaColumn.MetaList && obj_project.bln_isMobile){                  
                    bln_formExpand=true;
                  }

                  if(bln_formExpand){
                    this.fn_setStyleProperty("width", "100%");                                                                  
                  }
                  
                }
                
                fn_moveFormPosition(str_formPosition){

                  const childElement = this.dom_obj;
                  const parentElement = childElement.parentNode;
                  
                  switch(str_formPosition.toLowerCase()){
                    case "end":                      
                        parentElement.removeChild(childElement);                        
                        parentElement.appendChild(childElement);                        
                      break;
                    case "start":                      
                      parentElement.removeChild(childElement);                        
                      parentElement.insertBefore(childElement, parentElement.firstChild);
                      break;
                  }
                }
                fn_getColumnValue(){
                  return this.fn_getValue();
                }             
                fn_setColumnValue(str_value){
                  this.fn_setValue(str_value);
                }
                fn_getEditControlValue(){                                                                                           
                  return this.obj_controlEdit.fn_getValue(this);                                                      
                }
                fn_getValue(){                                                       
                  return this.str_value;//column value not control value                  
                }
                fn_setValue(str_value){//column value not control value, tho control values are set here                  

                  str_value=String(str_value);

                  if(str_value.toLowerCase()==="null"){
                    str_value="";
                  }                                    
                  if(str_value.toLowerCase()===undefined){
                    str_value="";
                  }                                                     
                  
                  this.str_value=str_value;                                    

                  this.str_valueDisplay=this.fn_formatDisplayValueFromColumn(str_value);                  
                  this.str_valueEdit=this.fn_formatEditValueFromColumn(str_value);     
                  if(this.bln_debugColumn){
                    //this.fn_debugLabel("fn_setValue this.str_valueEdit: " + this.str_valueEdit);
                    //this.fn_debug();
                  }                
                }                                
                fn_applyValueDisplay(){                  

                  let str_valueDisplay;
                  if(str_valueDisplay===undefined){
                    str_valueDisplay=this.str_valueDisplay;
                  }
                  
                  if(this.obj_control){
                    this.obj_control.fn_setValue(str_valueDisplay, this);
                    this.obj_control.fn_setText(str_valueDisplay, this);
                  }                    
                  
                  if(this.bln_debugColumn){                                        
                    /*
                    console.log("str_valueDisplay: " + str_valueDisplay);
                    this.obj_control.fn_debug();                    
                    this.fn_debug();
                    //*/
                  }
                  this.fn_updateRequiredError();
                }  
                fn_applyValueEdit(str_valueEdit){                  

                  if(str_valueEdit===undefined){
                    str_valueEdit=this.str_valueEdit;
                  }

                  
                  if(this.obj_controlEdit){
                    this.obj_controlEdit.fn_setValue(str_valueEdit, this);                  
                    this.obj_controlEdit.fn_setText(str_valueEdit, this);                                      
                  }                    
                  
                  if(this.bln_debugColumn){                    
                    /*
                    console.log("str_valueEdit: " + str_valueEdit);
                    this.obj_control.fn_debug();                    
                    this.fn_debug();
                    //*/
                  }
                  this.fn_updateRequiredError();
                }                                

                fn_updateRequiredError(){
                  let obj_metaColumn=this.obj_metaColumn;  

                  if(obj_metaColumn.RequiredPin){                    
                    if(!this.fn_getValue()){
                      this.fn_applyThemeError();                        
                    }
                    else{
                      obj_metaColumn.ValidationError=false;                                                        
                      this.fn_removeThemeError();                                          
                    }
                  }     
                }

                
                fn_setUnLocked(){                
                  if(this.bln_debugColumn){
                    this.fn_debugLabel("fn_setUnLocked");                                        
                  }
                  this.bln_locked=false;
                  if(this.obj_controlEdit){this.obj_controlEdit.fn_setDomProperty("readOnly", false);}
                }                
                fn_setLocked(){                  
                  if(this.bln_debugColumn){
                    this.fn_debugLabel("fn_setLocked");
                  }
                  
                  this.bln_locked=true;
                  if(this.obj_controlEdit){this.obj_controlEdit.fn_setDomProperty("readOnly", true);}                                    
                }
                fn_getLocked(){
                  return this.bln_locked;                  
                }
                fn_onDataSetModeLocked(){                  
                  //currently not used , but remains as template for row-wide event handle
                  this.fn_setLocked();
                }
  
                fn_onDataSetModeUnLocked(){                  
                  //currently not used , but remains as template for row-wide event handle
                  this.fn_setUnLocked();
                }                
                //////////////////////////
                //////////////////////////
                //////////////////////////
                //////////////////////////
                
                
                fn_formattMetaColumnLabel(){
                  let obj_metaColumn=this.obj_metaColumn;
                  
                  let str_label=obj_metaColumn.MetaLabel;                       
                  if(!str_label){                                        
                    str_label=obj_metaColumn.str_name;                                        
                    obj_metaColumn.MetaLabel=str_label;
                  } 
                  if(obj_metaColumn.MetaLabel==="Date" && obj_metaColumn.DateTime){
                    obj_metaColumn.MetaLabel="Date & Time";
                  }
                }                
                fn_getControlLabel(){
                  if(!this.obj_label){this.obj_label=this.obj_field.fn_getComponent("form_label");}
                }
                fn_getControlText(){                  
                  
                  if(this.obj_text){return;}
                  
                  this.obj_text=this.obj_field.fn_getComponent("form_text");                  
                
                }
                fn_setText(str_text){
                  
                  if(this.bln_debugColumn){
                    //console.log("str_text: " + str_text);
                  }
                  
                  if(this.obj_control){
                    this.obj_control.fn_setText(str_text);                  
                  }

                }
                fn_formatDisplayValueFromColumn(str_value){                                                  
                  return str_value;
                }                                  
                fn_formatEditValueFromColumn(str_value){
                  return str_value;
                }
                fn_formatColumnValueFromEdit(str_value){
                  return str_value;
                }              

                
                fn_computeField(){                                    
                  
                }                

                fn_getMenuButton(){
                  return this.obj_paramRS.obj_recordset.obj_paramRS.obj_menuButton;
                }                                                
                
                fn_setMetaColumnKey(obj_metaColumnKey){                  
                  this.obj_metaColumnKey=obj_metaColumnKey;
                }
                fn_getMetaColumnKey(){                  
                  return this.obj_metaColumnKey;
                }
                fn_getMetaColumnName(){
                  return this.obj_metaColumn.MetaColumnName;                  
                }                
                fn_getMetaColumnAPIName(){
                  return this.obj_metaColumn.MetaColumnAPIName;                  
                }                                                   
                
                fn_setControl(obj_control){    
                  
                  if(this.obj_control){                    
                    this.obj_control.fn_setDisplay(false);
                  }
                  
                  this.obj_control=obj_control; 

                  if(this.obj_control){                    
                    this.obj_control.fn_setDisplay(true);                                        
                  }
                  else{
                    console.log("error: obj_control is false");
                  }
                }                                                
                fn_hideControl(){

                  if(this.obj_control){                                      
                    this.obj_control.fn_setDisplay(false);
                    this.obj_label.fn_setDisplay(false);                    
                  }
                }

                fn_explain(){
                  console.log("Column Explain");
                  console.log("MetaColumnName: " + this.fn_getMetaColumnName());
                  console.log("MetaColumnAPIName: " + this.fn_getMetaColumnAPIName());
                  console.log("int_ordinalPosition: " + this.obj_metaColumn.int_ordinalPosition);
                  console.log("str_value: " + this.fn_getColumnValue());                                    
                  console.log("obj_metaColumnKey.MetaColumnName: " + this.fn_getMetaColumnKeyName());                                    
                  
                }                        
                fn_debugLabel(str_text, bln_debugPin=false){
                  if(bln_debugPin && !this.obj_metaColumn.DebugPin){
                    return;
                  }
                  let obj_author=this.obj_label;
                  if(!obj_author){
                    obj_author=this;
                  }                  
                  obj_author.fn_debugText(str_text);
                }      
                fn_debug(str_title){
                  super.fn_debug(str_title);
                  this.fn_debugLabel("fn_debug");
                  console.log(this.obj_metaColumn);                  
                }
              }//END CLS
              //END TAG
              //END component/xapp_column