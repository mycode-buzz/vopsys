class img extends component {
    constructor(obj_ini) {      
      super(obj_ini);        
    }    
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);    
      
      //START INITIALIZE DESIGN
      //this.fn_setType("img");      
      this.fn_setTag("img", true);            
      //END INITIALIZE DESIGN
      
      //START INITIALIZE DOM
      //if(this.obj_domProperty.src===undefined){this.obj_domProperty.src="/firefoxlogo.png";}      
      //END INITIALIZE DOM
      
      //START INITIALIZE STYLE      
      //if(this.obj_domStyle.overflow===undefined){this.obj_domStyle.overflow="hidden";}
      if(this.obj_domStyle.verticalAlign===undefined){this.obj_domStyle.verticalAlign="bottom";}//eazyStyle
      //END  INITIALIZE STYLE  

      this.fn_setIsContainer(false);
  }    
  fn_setDomProperty(str_name, str_value){        
    switch(str_name){
      case "src":                    
        let arr_path=str_value.split(obj_path.str_path_folder_application);        
        if(arr_path.length>1){
          str_value = str_value.replace(arr_path[0],'');
          //console.log(str_name + ": " + str_value);
        }
        break;
      default:        
    }
    
    super.fn_setDomProperty(str_name, str_value);
    
  }
}//END CLS
//END IMG
