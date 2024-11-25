
            //XSTART component/xapp_form_select
            class xapp_form_select extends component{
              constructor(obj_ini) {      
                super(obj_ini);        
              } 
              fn_initialize(obj_ini){
                super.fn_initialize(obj_ini);                                
                this.obj_holder.bln_listenClick=true;
                this.obj_holder.bln_listenChange=true;
                this.obj_holder.bln_listenBlur=true;        
              }
              fn_onClick(e){             
                obj_project.fn_forgetEvent(e);                      
              }
              fn_onChange(e){                                             
                this.fn_parentEvent("Change", e);                  
                obj_project.fn_calmEvent(e);                
              }
              fn_onBlur(e){                                         
                this.fn_parentEvent("Blur", e);
                obj_project.fn_forgetEvent(e);                      
              }

              fn_getListIdValue(str_valueList){

                let arr_valueList=str_valueList.split(", ");
                let arr_listIdValue=[];
                for (const option of this.dom_obj.options) {                  
                  if (arr_valueList.includes(option.text)) {
                    arr_listIdValue.push(option.value);
                  }
                }
                
                let str_listIdValue=arr_listIdValue.join(", ");
                //console.log("str_listIdValue: " + str_listIdValue);
                return str_listIdValue;
              }

              fn_getValue(obj_column){  
                
                const selectedValues = Array.from(this.dom_obj.selectedOptions).map(option => option.text);
                let str_value = selectedValues.join(', ');                                
                //console.log("fn_getValue str_value: " + str_value);

                if(str_value){
                  let arr_value=str_value.split(", ");                                                
                  arr_value = arr_value.filter(element => element !== "");                
                  str_value = arr_value.join(', ');
                }
                else{
                  //no problem, allow a single blank value
                }
                
                
                if(obj_column){
                  let obj_metaColumn=obj_column.obj_metaColumn;                                    
                  if(str_value.length>obj_metaColumn.MaxLength){
                    str_value=obj_shared.fn_removeAfterLastIndex(str_value, ", ");
                  } 
                }
                
                return str_value;
              }

              fn_setValue(str_value, obj_column){ 
                
                //console.log("fn_setValue str_value: " + str_value);                
                
                let arr_value=str_value.split(", ");                                                
                
                let str_selected;
                for (const option of this.dom_obj.options) {                  
                  str_selected = false;                                        
                  if (arr_value.includes(option.text)) {
                    str_selected = true;                      
                  }
                  option.selected = str_selected;                      
                }
                
              }

              fn_setText(str_value){                  
                this.str_value=str_value;
              }
              fn_loadList(arr_rows, obj_column){                   

                this.dom_obj.innerHTML = '';
                
                let obj_metaColumn=obj_column.obj_metaColumn;                                                  
                let obj_metaList=obj_metaColumn.obj_metaList;                
                
                /*
                  //{"MetaViewId":"200007","SelectField":"Name","WhereField":"MetaGroup","WhereCriteria":"","AllowMultiple":false}        
                  obj_metaList.MetaViewId                  
                  obj_metaList.SelectField
                  obj_metaList.WhereField
                  obj_metaList.WhereCriteria
                  obj_metaList.AllowMultiple
                  obj_metaList.AutoFetchPin                  
                  //*/                  

                let str_text, str_value;
                this.fn_addOption("", "");
                for(var i=0;i<arr_rows.length;i++){                            
                  
                  
                  if(obj_metaList.ListMember){
                    str_text=arr_rows[i];
                    str_value=arr_rows[i];
                  }
                  else{

                    const obj_row=arr_rows[i];
                    //console.log(obj_row);
                    str_text=obj_row[obj_metaList.SelectField];                  
                    str_value=obj_row["RecordId"];                  
                  }
                  
                  this.fn_addOption(str_text, str_value);
              
                }

                this.fn_removeStyleProperty("height");                                    
                this.fn_setStyleProperty("width", "auto");                

                //this.fn_debug();
            }
            fn_addOption(str_text, str_value){
              let option = document.createElement("option");
              option.text = str_text;
              option.value = str_value;                  
              this.dom_obj.add(option);                                                                     
              return option
            }
            
              
              

              
              
            }//END CLS
            //END TAG
            //END component/xapp_form_select