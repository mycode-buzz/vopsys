class table extends component {
    constructor(obj_ini) {      
      super(obj_ini); // call the super class constructor        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);

      //this.fn_setType("table");      
      this.fn_setTag("table", true); 
      
      this.fn_requires("tablerow");          
      this.fn_requires("tablecell");          
      this.fn_requires("tableheader");          

      //START INITIALIZE DESIGN      
      //END INITIALIZE DESIGN

      //START INITIALIZE DOM          
      //END INITIALIZE DOM              
    }       
    fn_addItem(obj_ini=false){
      let obj_item;        
      if(!obj_ini){
        obj_ini=new Holder;
        obj_ini.obj_design.str_type="tablerow";                   
      }      
      obj_item=super.fn_addItem(obj_ini);//CallSuper          
      return obj_item;
    }
    fn_setCellStyle(str_name, str_value){
      let arr, obj_item;
      arr=this.obj_design.arr_item;
      for(let i=0;i<arr.length;i++){
          obj_item=arr[i];              
          obj_item.fn_setCellStyle(str_name, str_value);            
      }
    }
    fn_locateItem(str_idXDesign, str_type){
      if(str_idXDesign===undefined){return;}
      if(str_idXDesign===""){return;}
      let arr, obj_item, obj_locate;
      arr=this.obj_design.arr_item;
      for(let i=0;i<arr.length;i++){
          obj_item=arr[i];              
          obj_locate=obj_item.fn_locateItem(str_idXDesign, str_type);            
          if(obj_locate){
            return obj_locate;
          }
      }
      return false;

    }
}//END CLS
//END IMG
