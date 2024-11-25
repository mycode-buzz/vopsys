
        //XSTART component/xdezign_propertysheet_style
          class xdezign_propertysheet_style extends xdezign_propertysheet{
            constructor(obj_ini) {      
              super(obj_ini);        
            } 
            fn_initialize(obj_ini){
              super.fn_initialize(obj_ini);                           
            }
          fn_onPaletteItemDeSelected(){//overiding for safety. can reivew overide.      
          }    
          fn_onPaletteItemSelected(){         
              
              let obj_selected=obj_project.obj_palettSelected;             
              if(!obj_selected.fn_isElement()){
                return;
              }                           
              
              //START PROPERTY SHEET
              let obj_arg=new Holder;              
              obj_arg.obj_container=this;
              obj_arg.str_text=this.obj_design.str_text;
              obj_arg.obj_item=obj_selected;              
              obj_arg.obj_propertySource=obj_selected.obj_domStyle;                                              
              obj_arg.obj_design.str_linkId=obj_selected.obj_design.str_idXDesign;              
              obj_arg.str_propertySourceChange="fn_propertyDOMStyleChange";//this runs when a new entry is made in the property sheet                            
              obj_arg.obj_design.str_inputAction="fn_linkDomStyleChange";//this runs when a value in the property sheet is changed                                            
              super.fn_onPaletteItemSelected(obj_arg);
              //END PROPERTY SHEET                          
            }   
      
            fn_displayPropertySheet(obj_arg){      
      
              let str_key, foo_val;
              let str_style, arr_parts, str_part, arr_subParts;
              
              str_style=obj_arg.obj_item.dom_obj.getAttribute("style"); 
              if(!str_style){
                str_style="";            
              }
              
              if(!str_style.length){return;}

              let bln_debugx=false;
              if(obj_arg.obj_item.obj_design.str_type==="menu_button"){
                bln_debugx=true;
                //console.log("1 str_style: [" + str_style + "]");                                      
              }             
          
              let arr_split, str_split, arr_trim;
              arr_split = str_style.split(";");              
              str_split;
              arr_trim=[];              
              for (let i=0;i<arr_split.length;i++) {
                str_split=arr_split[i].trim();            
                if(!str_split.length){continue;}
                arr_trim[i]=str_split;                
              }              
              arr_parts=arr_trim.sort();              
              for (let i=0;i<arr_parts.length;i++) {
                  str_part=arr_parts[i];            
                  if(!str_part.length){continue;}                  
                  arr_subParts = str_part.split(':');                            
                  obj_arg.str_key=arr_subParts[0].trim();                    
                  obj_arg.foo_val=obj_arg.obj_item.dom_obj.style[obj_arg.str_key];
                  //console.log("STYLE: " + obj_arg.str_key + ": " + obj_arg.foo_val);          
                  this.fn_displayPropertySheetRow(obj_arg);                    
              }  
            }
            
          //this runs when a value in the property sheet is changed              
          fn_linkDomStyleChange(obj_input){
            
            let obj_target, str_propertyName, str_propertyValue;                                                      
            obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
            str_propertyName=obj_input.obj_design.str_propertyName;            
            str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());
            if(str_propertyName===undefined){return;}
            if(str_propertyValue===undefined){return;}              
      
            obj_input.fn_setValue(str_propertyValue);
            obj_target.fn_setStyleProperty(str_propertyName, str_propertyValue);                                                  

            this.fn_setPaletteSelected();                  
          }
      
          //this runs when a new entry is made in the property sheet 
          fn_propertyDOMStyleChangeName(obj_input){            

            let obj_target, str_propertyName, str_propertyValue;                                                      
            obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
            str_propertyName=obj_input.obj_design.str_propertyName;
            str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());                        
            if(str_propertyValue===undefined){return;}                    

            this.foo_propertyDOMStyleChangeName=str_propertyValue;      
            this.fn_propertyDOMStyleChangeCheck(obj_target);            
          }
          //this runs when a new entry is made in the property sheet 
          fn_propertyDOMStyleChangeValue(obj_input){                                   

            let obj_target, str_propertyName, str_propertyValue;                                                      
            obj_target=obj_projectTarget.fn_findItemById(obj_input.obj_design.str_linkId);                                    
            str_propertyName=obj_input.obj_design.str_propertyName;            
            str_propertyValue=this.fn_validateItem(obj_target, str_propertyName, obj_input.fn_getValue());                        
            if(str_propertyValue===undefined){return;}                    
            
            str_propertyValue=obj_shared.fn_parseBool(str_propertyValue);       
            this.foo_propertyDOMStyleChangeValue=str_propertyValue;      
            this.fn_propertyDOMStyleChangeCheck(obj_target);             
          }
          fn_propertyDOMStyleChangeCheck(obj_item){
            
            let str_name, str_value;
            str_name=this.foo_propertyDOMStyleChangeName;
            str_value=this.foo_propertyDOMStyleChangeValue;                  
            if(str_name===undefined){return;}                  
            if(str_value===undefined){return;}                              
            this.foo_propertyDOMStyleChangeName=undefined;                                
            this.foo_propertyDOMStyleChangeValue=undefined;                                
            obj_item.fn_setStyleProperty(str_name, str_value);                
            obj_item.obj_designDelegate.fn_setPaletteSelected();
            return true;
          }
          
          fn_validateItem(obj_item, str_name, str_value){                                    
              return str_value;
          }
              }//END CLS
              //END TAG
              //END component/xdezign_propertysheet_style