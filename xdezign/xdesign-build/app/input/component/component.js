class input extends component {
    constructor(obj_ini) {      
      super(obj_ini);
    }        
    fn_initialize(obj_ini){
      
      super.fn_initialize(obj_ini);
      //this.fn_setType("input");      
      this.fn_setTag("input", true);                                          
      this.fn_setIsContainer(false);
      
      this.obj_holder.bln_listenChange=true;
      this.obj_holder.bln_listenClick=true;      
  }       
  fn_setText(str_value){    
    this.fn_setValue(str_value);
  }
  fn_setPlaceholder(str_value){ 
    str_value+="";    
    this.fn_setDomProperty("placeholder", str_value);        
  }  
  fn_getPlaceholder(){       
    return this.fn_getDomProperty("placeholder");        
  }  
  
  fn_onChange(){                     

    //    
    this.fn_unsetEvent();             
  }
  
}//END CLS
//END INPUT
