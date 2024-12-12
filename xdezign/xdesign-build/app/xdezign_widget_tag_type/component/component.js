
            //XSTART component/xdezign_widget_tag_type
              class xdezign_widget_tag_type extends xapp_widgetboard{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onPaletteItemSelected(){
                  //console.log("xdezign_widget_tag_type fn_onPaletteItemSelected");
                }                
                fn_loadWidget(obj_row){                
                  //let obj_item=super.fn_loadWidget();
                  
                  let obj_item=this.fn_addContextItem("xdezign_button_tag_item");                  
                  if(obj_item){obj_item.fn_configureFromMeta(obj_row);}                                    

                  if(!obj_item){return;}                      

                  let obj_column;

                  obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`id`");                                  
                  obj_item.obj_design.int_idTarget=obj_column.fn_getColumnValue();                                                                       

                  obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`lastversiondate`");                                                  
                  obj_item.obj_design.str_lastVersionDate=obj_column.fn_getColumnValue();                                                                                         

                  obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`name`");                                                                  
                  obj_item.obj_design.str_controlName=obj_column.fn_getColumnValue();                                    
                  obj_item.fn_setText(obj_item.obj_design.str_controlName);                  

                  obj_column=obj_row.fn_getColumnViaName("`vm-xdesign`.`xdesign_instance`.`type`");                                                                                  
                  obj_item.obj_design.str_instanceType=obj_column.fn_getColumnValue();                                                                                       

                  /*
                  console.log("str_controlName: " + obj_item.obj_design.str_controlName);                                                      
                  console.log("str_instanceType: " + obj_item.obj_design.str_instanceType);                                                  
                  console.log("str_lastVersionDate: " + obj_item.obj_design.str_lastVersionDate);                                
                  console.log("int_idTarget: " + obj_item.obj_design.int_idTarget);              
                  //*/
                  
                }

                fn_addComponentItem(){//component Item 

                  let obj_itemEvent, obj_item, str_tag, obj_ini, int_idRecord;
                  obj_itemEvent=obj_project.obj_itemEvent;//obj_itemEvent is the button      
                  str_tag=obj_itemEvent.dom_obj.innerText;    
                  obj_ini=new Holder;
                  obj_ini.obj_design.str_type=obj_itemEvent.obj_design.str_typeRecordTarget;              
                  obj_ini.obj_design.str_name=obj_itemEvent.obj_design.str_nameRecordTarget;      
                  obj_ini.obj_design.int_modeExecute=obj_ini.int_modeReadOnly;                        
                  int_idRecord=obj_itemEvent.obj_design.int_idTarget;
                  obj_ini.obj_design.int_idRecord=int_idRecord;           
                  obj_item=this.fn_addPaletteItem(obj_ini);//ids are removed (if not locked) and new object set to selected, in designDelegate.fn_addPaletteItem
                  return obj_item;     
                }        

                fn_addPaletteItem(obj_ini){


                  /*
                  console.log("fn_addPaletteItem");    
                  console.log("obj_ini.obj_design.str_type: " + obj_ini.obj_design.str_type);
                  console.log("obj_ini.obj_design.str_name: " + obj_ini.obj_design.str_name);
                  console.log("obj_ini.obj_design.int_modeExecute: " + obj_ini.obj_design.int_modeExecute);
                  console.log("obj_ini.obj_design.int_idRecord: " + obj_ini.obj_design.int_idRecord);
                  //return ;
                  //*/
                  
                  let obj_container, obj_item;
                  let str_type, str_type_container, bln_canInsert;      
                  
                  obj_container=obj_project.obj_palettSelected;    
                  
                  if(!obj_container){return;}//e.g if no project thas been started    
              
                  obj_container=obj_project.fn_validateContainer(obj_container, obj_ini.obj_design.int_idRecord);
                  if(!obj_container){return;}
              
                  str_type=obj_ini.obj_design.str_type.toLowerCase();
                  str_type_container=obj_container.obj_design.str_type.toLowerCase();
                  bln_canInsert=this.fn_validateInsertContainer(str_type, obj_container);
                  if(!bln_canInsert){
                    console.log("fn_addPaletteItem CANNOT INSERT ITEM: " + str_type + ": " + str_type_container);
                    return;
                  }    
                  
                  switch(obj_ini.obj_design.str_type.toLowerCase()){              
                    case "img":
                      if(obj_ini.obj_domProperty.src===undefined){obj_ini.obj_domProperty.src=obj_path.fn_getURLAssetFile("eazylogo.png");}
                      break;
                    default:
                  }
                  //ADD ITEM
                  //This will need to have obj_ini.obj_design.int_idRecord, if adding an saved instance component        
                  obj_item=obj_container.obj_designDelegate.fn_addPaletteItem(obj_ini);        
              
                  if(!obj_item){
                    console.log("obj_item is false, check dynamic content")
                    return;
                  }
                  
                  obj_item.obj_designDelegate.fn_setPaletteSelected();              
                  //ADD ITEM                           
              
                  return obj_item;
                }
              
                
              
              fn_validateInsertContainer(str_type, obj_container){
                    
                let str_typeToInsert, str_type_container, bln_value, str_listIn;
              
                str_typeToInsert=str_type.toLowerCase();  
                if(!obj_container.obj_design) {return;}//required 
                str_type_container=obj_container.obj_design.str_type.toLowerCase();          
              
                bln_value=true;        
                switch(str_type_container){                            
                  case "eazygrid":                          
                    str_listIn="eazygriditem";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;              
                  case "accordion":                          
                    str_listIn="menu_button";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;                  
                  case "table":                          
                    str_listIn="tablerow,tablebody,tablehead,tablefoot";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;        
                  case "tablerow":                          
                    str_listIn="tablecell,tableheader";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;                
                  case "tablefoot":                          
                    str_listIn="tablerow";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;                
                  case "tablebody":                          
                    str_listIn="tablerow";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;                
                  case "tablehead":                          
                    str_listIn="tablerow";
                    bln_value=obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",");              
                  break;                
                  default:
                    //set to false if the container not in above list and inert candidate is in the below list
                    str_listIn="tablerow,tablecell,tableheader,tablehead,tablefoot,eazygriditem,xloginpanel";
                    if(obj_shared.fn_inStr(","+str_typeToInsert+",", ","+str_listIn+",")){                                
                      bln_value=false;
                    }                                
                }          
                return bln_value;
              }  
              
              
              }//END CLS
              //END TAG
              //END component/xdezign_widget_tag_type