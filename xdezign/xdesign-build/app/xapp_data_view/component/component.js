
            //XSTART component/xapp_data_view
              class xapp_data_view extends xapp_data{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                 
                }
                fn_onDataStart(){                
                  super.fn_onDataStart();
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                                  
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onDataStartView();                                    
                }
                fn_onDataEnd(obj_post){
                  super.fn_onDataEnd(obj_post);
                  let obj_menuButton=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_menuButton){return;}                                    
                  obj_menuButton.fn_onDataEndView(obj_post);                                    
                }                
                //----------------------------------------
                //SIGNPOST 10. obj_dataView fn_runComputeRow
                //----------------------------------------
                fn_onComputeRow(){                

                  let obj_row=this.obj_paramRS.obj_row;                                  
                  if(!obj_row){return;}
                  let obj_parentMenu=this.obj_paramRS.obj_menuButton;                                                                  
                  if(!obj_parentMenu){return;}                  
                  obj_parentMenu.fn_onComputeRowView(obj_row);                   
                }     
                fn_getWidgetView(){
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(obj_parent){return obj_parent.fn_getWidgetView();}                
                }
              }//END CLS
              //END TAG
              //END component/xapp_data_view