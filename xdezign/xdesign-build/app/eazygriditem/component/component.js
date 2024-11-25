  class eazygriditem extends component {
    constructor(obj_ini) {
      super(obj_ini); // call the super class constructor
    }  
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);
      
      //START INITIALIZE DESIGN
      //this.fn_setType("eazygriditem");      
      this.fn_setTag("eazygriditem");                  
      
      if(this.obj_design.str_name==undefined){this.obj_design.str_name="My Grid Item";}           

      
      //END  INITIALIZE DESIGN

      //START INITIALIZE STYLE                    
      //END INITIALIZE STYLE        
    }      
    fn_onLoad(){
      super.fn_onLoad();
      //START INITIALIZE STYLE                          
      if(this.fn_getStyleProperty("backgroundColor")===undefined){this.obj_domStyle.backgroundColor="#414141";}      
      if(this.obj_design.str_minDim==undefined){this.obj_design.str_minDim="100px";}      
      if(this.obj_design.gridTemplate==undefined){this.fn_setGridTemplate(1);}                 
      //END INITIALIZE STYLE
    }
    fn_setGridTemplate(int_val){
      this.obj_design.gridTemplate="minmax(" + this.obj_design.str_minDim + ", "+int_val+"fr)";
    }            
    
}//END CLS
//END eazygriditem