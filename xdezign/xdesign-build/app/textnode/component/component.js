class textnode extends tag {
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);        

    //this.fn_setType("textnode");      
    this.fn_setTag("txt", true);                  
    
  }        
  fn_execute(){
    super.fn_execute();

    this.dom_obj.nodeValue=this.obj_design.str_content;    
  }
}//END CLS
//END TAG