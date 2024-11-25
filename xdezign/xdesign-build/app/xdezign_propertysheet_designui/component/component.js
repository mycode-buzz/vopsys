
            //XSTART component/xdezign_propertysheet_designui
              class xdezign_propertysheet_designui extends xdezign_propertysheet_design{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                }
      
                fn_displayPropertySheet(obj_arg){//to be overriden      
      
                  let bln_isProject, bln_isThemeProject=false;
                  let obj_selected=obj_project.obj_palettSelected;
                  if(obj_selected===obj_projectTarget){//probably ok to leave disabled global if selected component is not the project        
                    bln_isProject=true;
                  }                                   
                  if(obj_projectTarget.obj_design.str_type==="xapp_theme"){
                    bln_isThemeProject=true;
                  }                  
                    
                    let str_listInDesignUI=this.obj_holder.str_listInDesignUI;
                    //let str_listInProjectOnly="bln_palettePin,";        
                    if(obj_selected.fn_getTypeable()){                    
                      //str_listInDesignUI+="str_text,";          
                    }
                    let str_listInProjectOnly="";
                    str_listInDesignUI+=str_listInProjectOnly;             
                    
            
                    let bln_display;
            
                    let arr_Property=Object.entries(obj_arg.obj_propertySource).sort((a, b) => a[0].localeCompare(b[0]));
                    for (let [str_key, foo_val] of arr_Property) {          
                        bln_display=false;
                        if(obj_shared.fn_inStr(","+str_key+",", ","+str_listInDesignUI+",")){                
                          bln_display=true;
                        }            
            
                        if(!bln_isProject){
                          if(obj_shared.fn_inStr(","+str_key+",", ","+str_listInProjectOnly+",")){                
                            bln_display=false;
                          }            
                        }
            
                        if(bln_display){
                          obj_arg.str_key=str_key;
                          obj_arg.foo_val=foo_val;
                          this.fn_displayPropertySheetRow(obj_arg);
                        }
                      } 
                  }
            
                  
              }//END CLS
              //END TAG
              //END component/xdezign_propertysheet_designui