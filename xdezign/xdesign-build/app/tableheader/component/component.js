class tableheader extends tablecell {
    constructor(obj_ini) {      
      super(obj_ini); // call the super class constructor        
    }  
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);      

      //this.fn_setType("tableheader");      
      this.fn_setTag("th", true);                       
    }
      
    
}//END CLS