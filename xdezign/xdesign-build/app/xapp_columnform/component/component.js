
            //XSTART component/xapp_columnform
              class xapp_columnform extends xapp_column{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
  
                  //this.obj_holder.bln_listenDblClick=true;                                    
                }                   
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("blue");}                  
                }
  
                fn_initializeColumn(obj_row){                                    

                  super.fn_initializeColumn(obj_row);
                  //NEW RECORD
                  if(this.bln_modeNewRecord){
                      
                    //2. SET VALUE                                          
                    this.fn_setValue(this.fn_formatColumnDefaultValue());
                  }                    
                  
                }     
                
                fn_computeField(){                         
                  
                  let obj_metaColumn=this.obj_metaColumn;
                  
                  //We no longer use getComponent, as this can be subclassed e.g. reportcolumn                  
                  this.obj_field=this.fn_addContextItem("form_field");                  
                  if(!this.obj_field){return;}                                               

                  this.obj_field.fn_setStyleProperty("display", "flex");
                  this.fn_setStyleProperty("flex-wrap", "wrap");
                  this.obj_field.fn_setAxis(this.obj_paramRS.bln_axisColumn);                  

                  
                  
                  if(!this.obj_paramRS.bln_reportView){
                    //this.obj_field.fn_flipAxis(this.obj_paramRS.bln_axis);                  
                  }                    
                  
                  if(obj_metaColumn.HiddenPin){                    
                    this.fn_setHiddenPin();                                        
                  }
  
                  this.fn_formattMetaColumnLabel();                       
                  this.fn_getControlLabel();

                  

                  let str_label=obj_metaColumn.MetaLabel;                  
                  let str_currencySymbol=obj_userHome.MetaSystem.CurrencySymbol;
                  if(!str_currencySymbol){
                    str_currencySymbol="#";
                  }
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){
                    case "currency":                      
                      if(obj_metaColumn.MetaColumnName.toLowerCase()!=="regionalvalue"){
                        str_label+=" ("+str_currencySymbol+") ";
                      }
                      
                      break;                  
                    case "percent":
                      str_label+=" (%) ";
                      break;                  
                  }                  
                  this.obj_label.fn_setText(str_label);                  
          
                  this.fn_getControlText(); 

                  this.obj_label.fn_setDomProperty("for", this.obj_text.fn_getDomProperty("Id"));                                                                      
                  
                  this.fn_setControl(this.obj_text);                  
                  this.fn_setModeExecuteView();                                    
                  
                  if(this.obj_paramRS.obj_recordset.fn_getModeExecuteEdit()){
                    this.fn_setModeExecuteEdit();
                  } 
                }                  
                fn_onChildChange(e){                                                                        
                  
                  //111111111111111111111111111
                  if(this.bln_debugColumn){
                    this.fn_debugLabel("1 fn_onChildChange");
                  }

                  this.fn_setUpdatePermission(true);                  
                  
                }                
                fn_setUpdatePermission(bln_value=false){
                  this.bln_allowUpdate=bln_value;
                }                
                fn_getUpdatePermission(){
                  return this.bln_allowUpdate;
                }               
                
                fn_onFormLabelClick(e){                    

                  
                  
                  this.obj_row.obj_selectedColumn=this;                  
                  
                  const bln_value=this.fn_getModeExecuteEdit();                                                                        
                
                  if(bln_value){             
                    this.fn_transferEditToView();                
                    //this.fn_hideLabelBorder();                                        
                  }
                  else{                      
                      this.fn_transferViewToEdit();                      
                      //this.fn_showLabelBorder();                                        
                  }    

                  //LABEL ACTION
                  //this.fn_hideLabelBorder();                                        
                  //LABEL ACTION
                }  

                fn_transferEditToView(){                  
                  
                  

                  if(this.fn_getUpdatePermission()){
                    this.fn_setUpdatePermission(false);                    
                    this.fn_updateFieldValue();                                         
                  }
                  
                  this.fn_setModeExecuteView();                     
                }
                fn_transferViewToEdit(){                                    
                  this.fn_setModeExecuteEdit();                     
                }

                
                
                fn_setModeExecuteView(){                                                                          

                  //this.fn_debugLabel("fn_setModeExecuteView");

                  super.fn_setModeExecuteView();                  

                  this.fn_removeThemeEdit();
                  this.fn_hideLabelBorder();                                        

                  
                  let obj_control=this.obj_text;
                  this.fn_setControl(obj_control);                                    
                  this.fn_applyValueDisplay(); 
                  
                  
                }   
                
                fn_setModeExecuteEdit(){                   

                  this.obj_row.fn_setModeExecuteView();

                  if(!this.fn_checkModeEditRecord()){                                      
                    return;
                  }   
                  
                  super.fn_setModeExecuteEdit();                                    
                  
                  let obj_control=this.fn_setControlInput();
                  this.fn_setControl(obj_control);                                    
                  this.obj_controlEdit=obj_control;
                  
                  this.fn_applyValueEdit();                                    

                  this.obj_control.fn_setFocus(true);

                  this.fn_showLabelBorder();
                  this.fn_applyThemeEdit();
                  
                  

                  if(this.bln_debugColumn){                    
                    this.fn_debug("Column DebugPin");
                  }
                  
                  return true;
                }                
                

                fn_checkModeEditRecord(){  
  
                  let bln_debug=false;                                    
                  if(this.bln_debugColumn){
                    bln_debug=true;                  
                  }                  
                  
  
                  ////CHECK LOCKED
                  if(this.fn_getLocked()){
                    if(bln_debug){console.log("column column is locked, return false");}
                    return false;
                  } 
                  ////CHECK LOCKED

                  if(this.fn_getMetaColumnKey()){//do we already have the edit key
                    if(bln_debug){console.log("column column already has previous key, return true");}                    
                    return true;
                  }
                  
                  let obj_recordset=this.obj_paramRS.obj_recordset;
                  obj_recordset.fn_setMetaColumnKey(this);                  
                  if(this.fn_getMetaColumnKey()){
                    if(bln_debug){console.log("column column now has new key, return true");}                    
                    return true;
                  }
                  if(bln_debug){
                    console.log("End of Function: no key found for column - return false");                    
                  }                                      
                  
                  return false;
                }

                fn_validateFieldValue(str_value){
                  //this.fn_debugLabel("fn_validateFieldValue: " + str_value);

                  let obj_metaColumn=this.obj_metaColumn;                                    
                  if(str_value==="ROWZ_INVALID"){                    
                    if(this.bln_debugColumn){
                      this.fn_debugLabel("ROWZ_INVALID");
                    }
                    this.fn_debugLabel("ROWZ_INVALID return false");                    
                    obj_metaColumn.ValidationError=true;                  
                    this.fn_applyThemeError();
                    return false;                    
                  }        

                  obj_metaColumn.ValidationError=false;                                                        
                  this.fn_removeThemeError();
                  return true;                    
                }
                
                fn_updateFieldValue(){
                  
                  let str_value=this.fn_getEditControlValue();   
                  str_value=String(str_value).trim();
                  //console.log("fn_updateFieldValue: str_value: [" + str_value + "]");
                  str_value=this.fn_formatColumnValueFromEdit(str_value);
                  
                  let bln_value=this.fn_validateFieldValue(str_value);
                  //console.log("fn_updateFieldValue: bln_value: [" + bln_value + "]");
                  if(!bln_value){
                    return;
                  }
                  //console.log("PASSED fn_updateFieldValue: bln_value: [" + bln_value + "]");

                  //3. SET VALUE                          
                  this.fn_setValue(str_value);                                    
                  
                  this.fn_pushColumn();              

                  obj_project.fn_unsetEvent();
                }                       

                fn_pushColumn(){                    
                  
                  ////LOCK COLUMN
                  this.fn_setLocked();
                  ////LOCK COLUMN

                  if(this.bln_debugColumn){
                    this.fn_debugLabel("fn_receiveColumn");
                  }

                  this.obj_row.fn_pushColumn(this);                                    
                }               
                fn_receiveColumn(){  

                  if(this.bln_debugColumn){
                    this.fn_debugLabel("fn_receiveColumn");
                  }

                  ////UNLOCK COLUMN
                  this.fn_setUnLocked();
                  ////UNLOCK COLUMN
                } 
                
                fn_showLabelBorder(){    
                    this.obj_label.fn_setStyleProperty("borderColor", obj_project.obj_themeForground.fn_getStyleProperty("backgroundColor"));                                    
                }        
                fn_highlightLabelBorder(){    
                  //this.obj_label.fn_setStyleProperty("borderColor", obj_project.obj_themeForground.fn_getStyleProperty("backgroundColor"));                                    
                }        
              
                fn_hideLabelBorder(){                                      
                  //this.obj_label.fn_setStyleProperty("borderColor", "transparent");                                                                      
                  this.obj_label.fn_setStyleProperty("borderColor", obj_project.obj_themeBackground.fn_getStyleProperty("backgroundColor"));                                  
                }

                fn_onChildMouseUp(e){                         
                  if(obj_project.obj_itemEvent===this.obj_label){                    
                    //do nothing                    
                    //this.fn_hideLabelBorder();                  
                  }
                }
                fn_onChildMouseDown(e){                                             
                  if(obj_project.obj_itemEvent===this.obj_label){
                    //LABEL ACTION
                    this.fn_showLabelBorder();                  
                    //LABEL ACTION
                  }
                } 
                fn_onChildMouseEnter(e){                                             
                  if(obj_project.obj_itemEvent===this.obj_label){
                    //LABEL ACTION
                    this.fn_highlightLabelBorder();                  
                    //LABEL ACTION
                  }
                } 
                fn_onChildMouseLeave(e){                
                  if(obj_project.obj_itemEvent===this.obj_label){
                    if(this!==this.obj_row.obj_selectedColumn){
                      this.fn_hideLabelBorder();                  
                    }
                  }
                } 
                fn_onChildClick(e){                                                                                                            
                  if(obj_project.obj_itemEvent===this.obj_label){                    
                    this.fn_onFormLabelClick();
                  }
                } 
                fn_onChildKeyDown(e){ 
                  let obj_metaColumn=this.obj_metaColumn;                                                                                                                                               
                  //console.log("e.key: " + e.key);
                  if(obj_metaColumn.MetaColumnAPIName.toLowerCase()==="metacolumnapiname"){                    
                    if (/\s/.test(event.key)) {
                      e.preventDefault();
                    }
  
                  }
                } 
                
                fn_onChildBlur(e){                                                                        
                  
                  //occurs when control lose focus
                  if(this.bln_debugColumn){
                    this.fn_debugLabel("2 fn_onChildBlur");
                  }                  
                  
                  //ROW BLUR, Exclude THIS
                  this.obj_row.fn_setModeExecuteView();                 
                  //ROW BLUR, Exclude THIS

                  //this.fn_debugLabel("this.obj_metaColumn.ValidationError: " + this.obj_metaColumn.ValidationError)
                  
                  if(this.obj_metaColumn.ValidationError){                    
                    this.fn_applyThemeError();
                  }                  
                }                
                
                fn_onChildInput(){                  
                  
                  /*
                  let str_value=this.fn_getValue();                                                      
                  str_value=this.fn_formatColumnValueFromEdit(str_value);                                                  
                  let bln_value=this.fn_validateFieldValue(str_value);
                  if(!bln_value){
                    return;
                  }
                  //*/
                  
                }                                   
                
                fn_applyThemeError(){
                  
                  this.obj_metaColumn.ValidationError=true;                  
                  this.obj_control.fn_applyThemeError(this.str_colorHighlight);                  
                }

                fn_removeThemeError(){                  
                  
                  if(this.obj_metaColumn.ValidationError){
                    return;
                  }                                            
                  
                  let str_value=this.fn_getValue();
                  if(str_value){
                    this.obj_control.fn_removeStyleOutline();                                                            
                  }
                }                            

                fn_applyThemeEdit(){

                  
                  this.obj_control.fn_applyThemeEdit(this.str_colorHighlight);                  
                  //this.obj_control.fn_setStyleProperty("color", "#333333");                  
                  //this.obj_control.fn_setStyleProperty("color", "#444444");                  
                }

                fn_removeThemeEdit(){
                  //this should not call remove style outline, as it will be reset from remove error                                            
                  //this.obj_control.fn_removeStyleOutline();
                }                            

                fn_receiveDropdownList(obj_post){                  
                  
                  this.arr_rowsSelect=obj_post.RowData;
                  this.obj_select.fn_loadList(this.arr_rowsSelect, this);                                    
                  this.obj_select.fn_setValue(this.fn_getValue(), this);
                }  
                fn_receiveListMember(){                                    
                  
                  this.obj_select.fn_loadList(this.arr_listMember, this);                                    
                  this.obj_select.fn_setValue(this.fn_getValue(), this);
                }  
                
                
                /////////////////////////
                /////////////////////////
                /////////////////////////
                /////////////////////////
                /////////////////////////  

                fn_resize(){                  
                }
                
                fn_getControlText(){                  
                  
                  if(this.obj_text){return;}

                  super.fn_getControlText();                                    

                  /*
                  let obj_control=this;
                  already set in design process
                  display flex
                  flexflow column wrap
                  obj_control.fn_setStyleProperty("border", "10px solid red");
                  //*/
                  
                  switch(this.obj_metaColumn.MetaColumnType.toLowerCase()){
                    case "xcheckbox":                                         
                      this.obj_text.fn_setDisplay("none");
                      this.obj_text=this.fn_getControlInput();
                      break;                                                                        
                    case "date":         
                    case "datetime":                      
                      if(obj_project.bln_isMobile){
                        this.fn_setDateTimeSpanDimension();
                      }                      
                      break;                                            
                  } 
                  
                }
                fn_getContainerWidthAvailable() {
                  const obj_parent=this.fn_getParentComponent();
                  const parent = obj_parent.dom_obj;                     
                  const computedStyle = window.getComputedStyle(parent);               

                  const int_clientWidth=parseInt(parent.clientWidth);
                  const int_paddingLeft=parseInt(computedStyle.paddingLeft);
                  const int_paddingRight=parseInt(computedStyle.paddingRight);
                  const int_widthAvailable=parseInt(int_clientWidth-int_paddingLeft-int_paddingRight, 10);                                         
                  return int_widthAvailable;
              }

                fn_setDateTimeSpanDimension(){

                  let int_width, str_width;
                  let int_widthBase, int_widthDateTime, int_widthDateTimeSecond;
                  if(this.bln_debugColumn){                      
                    //this.fn_debugLabel("obj_project.user_agent: " + obj_project.user_agent) ;
                    //Chrome: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36
                    //Firefox: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0                                                                        
                  }
                  
                  int_widthBase=9//chrome, default
                  int_widthDateTime=3;
                  int_widthDateTimeSecond=2;                                                                
                  if(obj_project.user_agent==="Firefox"){                                                
                    int_widthBase=10;                        
                  }
                  
                  
                  int_width=int_widthBase;                      
                  if(this.obj_metaColumn.DateTime){
                    int_width+=int_widthDateTime;                                          
                    if(this.obj_metaColumn.DateTimeSecond){                          
                      int_width+=int_widthDateTimeSecond;                                          
                    }                      
                  }                              
                  str_width=int_width+"em";                                                                                       
                  if(this.bln_debugColumn){                      
                    //this.fn_debugLabel("str_width: " + str_width);
                  }                      
                  this.obj_text.fn_setStyleProperty("width", str_width);                      
                }

                fn_getDisplayDimension(bln_display=true){
                  
                  let obj_control=this.obj_text;
                  if(bln_display){obj_control.fn_setDisplay(true);}                  
                  this.int_widthSpan=parseInt(obj_control.dom_obj.offsetWidth, 10);
                  this.str_widthSpan=(this.int_widthSpan)+"px";
                  this.int_heightSpan=parseInt(obj_control.dom_obj.offsetHeight, 10);
                  this.str_heightSpan=(this.int_heightSpan)+"px";                                 
                  //console.log("this.int_widthSpan: " + this.int_widthSpan);
                  //console.log("this.str_widthSpan: " + this.str_widthSpan);                                      
                }
                fn_setEditDimension(){
                  let obj_control=this.obj_input;
                  obj_control.fn_setStyleProperty("width", this.str_widthSpan);                                              
                  obj_control.fn_setStyleProperty("height", this.str_heightSpan);                                              
                }
                fn_setControlInput(){
                  
                  let obj_control;
                  let obj_metaColumn=this.obj_metaColumn;                  
                  if(obj_metaColumn.MetaList){                                    
                    obj_control=this.obj_select;                         
                    let bln_fetchList=false;
                    if(!obj_control){
                      obj_control=this.fn_getControlSelect();                                                                                                                  
                      bln_fetchList=true;                      
                    }                                        
                    if(this.obj_select){this.obj_select.fn_setDisplay(true);}
                    if(this.obj_text){this.obj_text.fn_setDisplay(false);}
                    if(this.obj_input){this.obj_input.fn_setDisplay(false);}
                    
                    if(obj_metaColumn.obj_metaList.AutoFetchPin){bln_fetchList=true;}
                    if(bln_fetchList){
                      if(obj_metaColumn.obj_metaList.ListMember){
                        this.arr_listMember=obj_metaColumn.obj_metaList.ListMember.split(",");
                        this.fn_receiveListMember();
                      }
                      else{
                        this.fn_getListSelectFromServer();
                      }
                      
                    }
                  }
                  else{                    
                    this.fn_getDisplayDimension(true);                    
                   obj_control=this.obj_input;
                    if(!obj_control){
                      obj_control=this.fn_getControlInput();                                          
                    }                                                                
                    if(this.obj_select){this.obj_select.fn_setDisplay(false);}
                    if(this.obj_text){this.obj_text.fn_setDisplay(false);}
                    if(this.obj_input){this.obj_input.fn_setDisplay(true);}                    
                    this.fn_setEditDimension();                                      
                  }                                     
                  
                  let obj_template, obj_target;
                  obj_template=this.obj_text;
                  obj_target=obj_control;

                  const cssObj = window.getComputedStyle(obj_template.dom_obj, null);          
                  let str_property, str_value;

                  str_property="font-size";
                  str_value = cssObj.getPropertyValue(str_property);                                        
                  obj_target.fn_setStyleProperty(str_property, str_value);

                  str_property="font-family";
                  str_value = cssObj.getPropertyValue(str_property);                      
                  obj_target.fn_setStyleProperty(str_property, str_value);
                  
                  str_property="color";
                  str_value = cssObj.getPropertyValue(str_property);                                        
                  obj_target.fn_setStyleProperty(str_property, str_value);

                  obj_target.fn_setStyleProperty("outline", "none");                      

                  /*
                  str_property="background-color";
                  str_value = cssObj.getPropertyValue(str_property);                      
                  obj_target.fn_setStyleProperty(str_property, str_value);
                  
                  str_property="padding";
                  str_value = cssObj.getPropertyValue(str_property);                      
                  obj_target.fn_setStyleProperty(str_property, str_value);

                  str_property="border";
                  str_value = cssObj.getPropertyValue(str_property);                      
                  obj_target.fn_setStyleProperty(str_property, str_value);
                  //*/

                  return obj_control;
                }                  
                
                fn_getControlSelect(){                                                                                   
                  
                  let obj_control;
                  let obj_metaColumn=this.obj_metaColumn;                  
                  
                  if(this.obj_input){
                    this.obj_input.fn_setDisplay("none");
                  }
                  obj_control=this.obj_select;
                  if(!obj_control){                       
                    obj_control=this.obj_field.fn_addContextItem("xapp_form_select");                    
                    if(obj_metaColumn.obj_metaList.AllowMultiple){
                      obj_control.fn_setDomProperty("multiple", "multiple");
                    }                    
                    this.obj_select=obj_control;
                  }   
                  return obj_control;
                }  
                fn_getListSelectFromServer(){                                  
                  
                  this.obj_row.fn_getListSelectFromServer(this);                                      
                }                                        
                
                fn_getControlInput(){
                
                  //Default will be text area 
                  //Can specify in form definition if other
                  
                  let obj_metaColumn=this.obj_metaColumn;                      
                  let str_type;      
                  let obj_control;                       
                
                switch(obj_metaColumn.MetaColumnType.toLowerCase()){
                  case "checkbox":
                    str_type="form_checkbox";
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                      
                    break;
                  case "color":
                    str_type="form_input";                                          
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                                            
                    obj_control.fn_setDomProperty("type", "color");                    
                    obj_control.fn_removeStyleProperty("padding");
                    obj_control.fn_setStyleProperty("width", "auto");
                    obj_control.fn_setStyleProperty("height", "50px");                                        

                    /*/
                    <option colorname="standard_white">#FFFFFF</option>                    
                    <option colorname="colorwheel_1_main_red">#FF0000</option>                   
                    <option colorname="colorwheel_4_main_brightgreen">#66FF00</option>                    
                    <option colorname="colorwheel_7_main_aqua">#00FFFF</option>                                                            
                    <option colorname="colorwheel_8_lightblue">#0080FF</option>                                        
                    <option colorname="standard_black">#000000</option>
                    <option colorname="colorwheel_11_fuchsia">#FF00FF</option>                                        
                    <option colorname="colorwheel_2_orange">#FF7F00</option>
                    <option colorname="standard_silver">#C0C0C0</option>  
                    <option colorname="colorwheel_3_yellow">#FFFF00</option>                                                            
                    //*/

                    const str_listId=obj_shared.fn_getUniquePrefix ("presetColor_")
                    const newElement = document.createElement('div');                    

                    newElement.innerHTML = `
                    <datalist id="` + str_listId + `">                 
                    <option colorname="standard_black">#000000</option>                          
                    <option colorname="colorwheel_2_orange">#FF7F00</option>
                    <option colorname="standard_silver">#C0C0C0</option>  
                    <option colorname="colorwheel_3_yellow">#FFFF00</option>                                                            
                    
                    </datalist>
                    `;  
                    this.obj_field.dom_obj.appendChild(newElement);                    
                    obj_control.dom_obj.setAttribute("list", str_listId);                                                                               
                    break;
                  case "date":                      
                  case "datetime":                                          
                    str_type="form_input";                      
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                        
                    obj_control.fn_setDomProperty("type", "date");                                                                                                          
                    if(obj_metaColumn.DateTime){                      
                      obj_control.fn_setDomProperty("type", "datetime-local");                      
                      if(obj_metaColumn.DateTimeSecond){                                                  
                        obj_control.fn_setDomProperty("step", "1");
                      }                      
                    }                                         
                    break;
                  case "email":                         
                    str_type="form_input";  
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                        
                    obj_control.fn_setDomProperty("type", "email");                                            
                    break;
                  case "phone":                         
                    str_type="form_input";  
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                        
                    obj_control.fn_setDomProperty("type", "tel");                      
                    break;
                  case "url":                         
                    str_type="form_input";  
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                        
                    obj_control.fn_setDomProperty("type", "url");                      
                    break;
                  case "currency":
                  case "percent":
                  case "number":                         
                    str_type="form_input";  
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                        
                    obj_control.fn_setDomProperty("type", "number");                      
                    obj_control.fn_setDomProperty("inputmode", "numeric");                                            
                    obj_control.fn_setDomProperty("placeholder", "Enter a number");
                    
                    let int_decimal=obj_metaColumn.Decimal;                      
                    let str_decimal="1".padStart(String(int_decimal), "0");
                    let str_step="1";                      
                    if(int_decimal){                              
                      str_step="0."+str_decimal;
                    }
                    obj_control.fn_setDomProperty("step", str_step);
                    
                    let max_decimal="9".padStart(String(int_decimal), "9");
                    
                    
                    let str_min="-9,999,999,999" + "." + max_decimal;
                    let str_max="9,999,999,999" + "." + max_decimal;                                                                  
                    if(obj_metaColumn.UnSigned){str_min="0."+str_decimal;}                                            
                    //obj_control.fn_setDomProperty("min", str_min);                                                                  
                    //obj_control.fn_setDomProperty("max", str_max);                                                                  
                    
                    break;                      
                  case "note":                  
                  case "json":
                    str_type="form_textarea";                      
                    obj_control=this.obj_field.fn_addContextItem(str_type);                                                            
                    //console.log("obj_control form_textarea ");
                    break;                  
                  default:
                    str_type="form_input";
                    obj_control=this.obj_field.fn_addContextItem(str_type);                  
                    obj_control.fn_setDomProperty("type", "text");                                                                                      
                    break;
                }
                
                  this.obj_input=obj_control;
                  
                  let str_placeholder=obj_metaColumn.PlaceHolder;
                  if(str_placeholder){
                    obj_control.fn_setPlaceholder(str_placeholder);                                        
                  }

                  let int_maxlength=obj_metaColumn.MaxLength;                       
                  if(!int_maxlength){
                    int_maxlength=10000;
                  }                  
                  obj_control.fn_setDomProperty("maxlength", int_maxlength);                                        
                  
                  return obj_control;
                }                   
                
                fn_formatColumnDefaultValue(){

                  let obj_metaColumn=this.obj_metaColumn;                  

                  if(!obj_metaColumn.MetaColumnType){
                    return "";
                  }

                  
                  let str_value, str_valueLower;

                  str_value=obj_shared.fn_formatString(obj_metaColumn.DefaultValue);                  
                  if(!str_value){
                    return "";
                  }

                  str_value=obj_shared.fn_interfaceReplaceSessionCodes(str_value);                 
                  str_valueLower=str_value.toLowerCase();                  
                  
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){
                    case "checkbox":
                      if(!str_value){
                        str_value=0;
                      }                      
                      break;
                    case "currency":
                    case "percent":
                    case "number":                  
                        if(!str_value){
                          str_value=0;
                        }
                      break;
                    case "date":
                    case "datetime":
                      switch(str_valueLower) {
                        case "now":                                                  
                        str_value=obj_shared.fn_formatSystemDateString(new Date(), obj_metaColumn.DateTime, obj_metaColumn.DateTimeSecond);                                                                          
                          break;                                  
                      }
                    break;                    
                  }                                    

                  return str_value;
                }
                fn_formatDisplayValueFromColumn(str_value){                                                                                       

                  let obj_metaColumn=this.obj_metaColumn;                  
                  str_value=obj_shared.fn_formatDisplayValueFromColumn(obj_metaColumn, str_value);
                  
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){                    
                    case "date":                                            
                    case "datetime":
                      str_value+=this.fn_getNBSpace(5);
                      break;
                  }
                  return str_value;
                }

                fn_getNBSpace(int_value){
                  let str_value="";
                  for(let i=0;i<=int_value;i++){
                    str_value+="&nbsp;";                    
                  }
                  return str_value;
                }
                
                fn_formatColumnValueFromEdit(str_value){                                   
                  //this.fn_debugLabel("fn_formatColumnValueFromEdit: " + str_value); 

                  str_value=String(str_value);              
                  let bln_value;
                  
                  let obj_metaColumn=this.obj_metaColumn;                           
                  //this.fn_debugLabel("obj_metaColumn.MetaColumnType.toLowerCase(): " + obj_metaColumn.MetaColumnType.toLowerCase());          
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){
                    case "checkbox":                      
                      str_value=obj_shared.fn_parseBool(str_value);                               
                      if(str_value){str_value="on";}
                      else{str_value="off";}                                            
                      break;                                          
                    case "email":
                      this.fn_debugLabel("case email handle"); 
                      if(!str_value){str_value="";return str_value;}
                      bln_value=obj_shared.fn_validEmail(str_value);                      
                      if(!bln_value){
                        return "ROWZ_INVALID";  
                      }                      
                      break;                 
                    case "phone":
                      if(!str_value){str_value="";return str_value;}
                      bln_value=obj_shared.fn_validPhone(str_value);                      
                      if(!bln_value){
                        return "ROWZ_INVALID";  
                      }                      
                      break;                 
                    case "url":
                      if(!str_value){str_value="";return str_value;}
                      str_value=str_value.replace(/^https:\/\//, '');  
                      let str_url="https://"+str_value;
                      bln_value=obj_shared.fn_validURL(str_url);                      
                      if(!bln_value){
                        return "ROWZ_INVALID";  
                      }                      
                      break; 
                    case "currency":              
                    case "percent":              
                    case "number":    
                      str_value=obj_shared.fn_formatNumber(str_value, obj_metaColumn.Decimal);                                            
                      bln_value=obj_shared.fn_validNumber(str_value, obj_metaColumn.UnSigned);                      
                      if(!bln_value){
                        return "ROWZ_INVALID";  
                      }                      
                      break;                
                    case "date":                      
                    case "datetime":                  
                      if(!str_value){str_value="";return str_value;}                      
                      let obj_date=new Date(str_value);                                            
                      str_value=obj_shared.fn_formatSystemDateString(obj_date, obj_metaColumn.DateTime, obj_metaColumn.DateTimeSecond);                                                                
                      break;  
                    case "note":
                    case "text":                  
                    break;
                    case "json":                  
                    break;
                    case "color":                  
                    break;
                    case "recordid":
                      bln_value=obj_shared.fn_validNumber(str_value, false);                      
                      if(!bln_value){
                        return "ROWZ_INVALID";  
                      }                      
                    break;
                    default:
                      this.fn_debugLabel("ERROR Type not found: " + obj_metaColumn.MetaColumnType.toLowerCase());                                             
                  }
                  if(obj_metaColumn.MetaList){
                    this.str_metaListIdValue=this.obj_select.fn_getListIdValue(str_value);
                  }
                  return str_value;
                }                

                fn_formatEditValueFromColumn(str_value){
                  
                  str_value+="";                                                      
                  
                  let obj_metaColumn=this.obj_metaColumn;                  
                  switch(obj_metaColumn.MetaColumnType.toLowerCase()){                    
                    case "checkbox":                                            
                      str_value=obj_shared.fn_parseBool(str_value);                               
                      if(str_value){str_value="on";}
                      else{str_value="off";}                                            
                      break;                              
                    case "currency":              
                    case "percent":              
                    case "number":
                      str_value=obj_shared.fn_formatNumber(str_value, obj_metaColumn.Decimal);                      
                      break;
                    case "date":
                    case "datetime":       
                    if(!str_value){str_value="";return str_value;}
                      let obj_date=obj_shared.fn_getDateObjectFromSystemDate(str_value, obj_metaColumn.DateTime);                                              
                      str_value=obj_shared.fn_formatISODateString(obj_date, obj_metaColumn.DateTime, obj_metaColumn.DateTimeSecond);                                                                                          
                      break;                                        
                  }
                  return str_value;
                }               

                                  
              }//END CLS
              //END TAG
              //END component/xapp_columnform