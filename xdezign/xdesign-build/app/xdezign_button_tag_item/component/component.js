
            //XSTART component/xdezign_button_tag_item
              class xdezign_button_tag_item extends form_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onClick(e){                  
                  
                  console.log("xdezign_button_tag_item");
                  obj_project.fn_forgetEvent(e);                  
                  //should it be necessary to search only in context item, the button will need to supply that request
                  //e.g bln_searchContextItem=this.obj_design.bln_isContextHolderButton
                  let bln_searchContextItem=false;
                  let bln_debug=false;
                  
                  let obj_dashboard=obj_project.fn_locateItemForPalette("xdezign_widget_tag_type", bln_searchContextItem, bln_debug);
                  //obj_dashboard.fn_debugText("obj_dashboard");
                  //let obj_parent=obj_dashboard.fn_getParentComponent();
                  //obj_parent.fn_debugText("obj_parent");
                  console.log("obj_dashboard: " + obj_dashboard);
                  if(obj_dashboard){                    
                    let obj_ini=new Holder;                    
                    obj_ini.obj_design.str_type=this.obj_design.str_instanceType;              
                    obj_ini.obj_design.str_name=this.obj_design.str_controlName;      
                    obj_ini.obj_design.int_modeExecute=obj_ini.int_modeReadOnly;                            
                    obj_ini.obj_design.int_idRecord=this.obj_design.int_idTarget;                               
                    obj_dashboard=obj_dashboard.fn_addPaletteItem(obj_ini);//ids are removed (if not locked) and new object set to selected, in designDelegate.fn_addPaletteItem
    
                  }                  
                }                
              }//END CLS
              //END TAG
              //END component/xdezign_button_tag_item