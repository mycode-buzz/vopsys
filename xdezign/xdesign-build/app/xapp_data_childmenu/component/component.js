
            //XSTART component/xapp_data_childmenu
              class xapp_data_childmenu extends xapp_data{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  this.obj_holder.bln_computeRows=false;                  

                  this.obj_holder.bln_debugServer=false;                  
                }                
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("aqua");}                  
                }
                fn_onDataStart(){                
                  super.fn_onDataStart();
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onDataStartChildMenu();                                    
                }
                fn_onDataEnd(obj_post){                  
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onDataEndChildMenu(obj_post);                                    
                }
                fn_onComputeRow(){                                   
                
                  let obj_row=this.obj_paramRS.obj_row;                  
                  if(!obj_row){return;}
                  let obj_parent=this.obj_paramRS.obj_menuButton;                                                
                  if(!obj_parent){return;}                                    
                  obj_parent.fn_onComputeRowChildMenu(obj_row);                                    
                }                  
              }//END CLS
              //END TAG
              //END component/xapp_data_childmenu