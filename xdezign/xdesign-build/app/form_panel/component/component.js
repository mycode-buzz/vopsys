
            //XSTART component/form_panel
              class form_panel extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("purple");}                  
                }                       

                fn_onRowMember(obj_row){                         

                  this.obj_row=obj_row;                  
                  this.obj_paramRow=this.obj_row.obj_paramRow;                                    
                  this.obj_paramRS=this.obj_paramRow.obj_paramRS;                                                       
                  
                  this.fn_setStyleProperty("display", "flex");
                  this.fn_setStyleProperty("flex-wrap", "wrap");
                  this.fn_setAxis(this.obj_paramRS.bln_axisPanel);                                                                                          
                }
              }//END CLS
              //END TAG
              //END component/form_panel