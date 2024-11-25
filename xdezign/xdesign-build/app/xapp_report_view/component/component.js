
            //XSTART component/xapp_report_view
              class xapp_report_view extends xapp_dataform_view{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);   
                  this.obj_holder.bln_reportView=true;
                  this.obj_holder.str_typeColumn="report_column";
                  
                }                
                fn_initializeRS(obj_menuButton){                
                  super.fn_initializeRS(obj_menuButton);
                  this.obj_paramRS.bln_reportView=this.obj_holder.bln_reportView;                                    
                }
              }//END CLS
              //END TAG
              //END component/xapp_report_view