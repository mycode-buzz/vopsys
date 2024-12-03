//START component/report_column
class report_column extends xapp_columnform{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                        
  }                                               
  
  fn_computeField(){                                    
    
    let obj_field, obj_label, obj_control, str_type;                  

    let obj_metaColumn=this.obj_metaColumn;
    
    let str_name=obj_metaColumn.str_name;     
    let str_nameQualified=obj_metaColumn.str_nameQualified;                       
    let str_value=obj_metaColumn.str_value;                                         
    if(this.obj_paramRS.bln_headingRow){
      str_value=str_name;                                         
    }

    this.fn_setText(str_value);   

    //str_type="form_span";                  
    //obj_control=this.fn_addContextItem(str_type);
    //obj_control.fn_setText(str_value);                      
    //this.obj_control=obj_control;                      
  }  


}//END CLS
//END TAG              
//END component/report_column