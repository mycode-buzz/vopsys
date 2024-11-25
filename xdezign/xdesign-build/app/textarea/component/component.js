class textarea extends component {
    constructor(obj_ini) {      
      super(obj_ini);        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);        

      //this.fn_setType("textarea");      
      this.fn_setTag("textarea", true);                  

      
      this.obj_holder.bln_listenChange=true;
        
    }        
    fn_onChange(){                    
      obj_project.obj_itemEvent=this;             
      this.obj_design.str_content=this.dom_obj.value;                        

      
      obj_project.fn_unsetEvent();    
    }       
    
    
}//END CLS
//END TAG