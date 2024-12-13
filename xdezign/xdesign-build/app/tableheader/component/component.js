class tableheader extends tablecell {
    constructor(obj_ini) {      
      super(obj_ini); // call the super class constructor        
    }  
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);      

      //this.fn_setType("tableheader");      
      this.fn_setTag("th", true);                       
    }
    fn_applyThemeStructure(){                                                        
      if(!obj_project.obj_theme){return;}
      this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formButton;                
      this.fn_applyStyle(this.obj_holder.obj_themeStructure);            
    }
      
    
}//END CLS