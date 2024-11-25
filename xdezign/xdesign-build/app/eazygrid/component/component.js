class eazygrid extends component {
    constructor(obj_ini) {            
      super(obj_ini); // call the super class constructor       
    } 
    fn_initialize(obj_ini){      
      super.fn_initialize(obj_ini);

      //START INITIALIZE DESIGN
      //this.fn_setType("eazygrid");      
      this.fn_setTag("eazygrid");      
      this.fn_requires("eazygriditem");      

      if(this.obj_design.int_axis===undefined){              
        this.obj_design.int_axis=obj_const.int_axisHorizontal;              
      }
      
      if(this.obj_ini.bln_addPaletterItemEvent){
        this.obj_holder.bln_addPaletterItemEvent=obj_ini.bln_addPaletterItemEvent;
      }      
      
            
      if(this.obj_design.bln_eazyGrid===undefined){this.obj_design.bln_eazyGrid=true;}      
      //if(this.obj_design.bln_isLocalHome===undefined){this.obj_design.bln_isLocalHome=true;}      
      
      if(this.obj_design.str_minDim==undefined){this.obj_design.str_minDim="100px";}      
      if(this.obj_design.str_gridTemplateDefault==undefined){this.obj_design.str_gridTemplateDefault="minmax(" + this.obj_design.str_minDim + ", 1fr)";}
      
      //END  INITIALIZE DESIGN
      
      
    }
    
    fn_onLoad(){
      super.fn_onLoad();
      //START INITIALIZE STYLE                          
      this.obj_domStyle.display="grid";
      if(this.obj_domStyle.height===undefined){this.obj_domStyle.height="100%";}
      if(this.obj_domStyle.width===undefined){this.obj_domStyle.width="100%";}
      if(this.obj_domStyle.padding===undefined){this.obj_domStyle.padding="0px";}      
      if(this.obj_domStyle.overflow==undefined){this.obj_domStyle.overflow="hidden";} 
      if(this.fn_getStyleProperty("backgroundColor")===undefined){this.obj_domStyle.backgroundColor="#2b2c34";}     
      if(this.fn_getStyleProperty("grid-gap")===undefined){this.fn_setStyleProperty("grid-gap", "10px");}
      if(this.fn_getStyleProperty("grid-auto-rows")===undefined){this.fn_setStyleProperty("grid-auto-rows", this.obj_design.str_gridTemplateDefault);}
      if(this.fn_getStyleProperty("grid-auto-columns")===undefined){this.fn_setStyleProperty("grid-auto-columns", this.obj_design.str_gridTemplateDefault);}
      if(this.fn_getStyleProperty("grid-template-rows")===undefined){this.fn_setStyleProperty("grid-template-rows", this.obj_design.str_gridTemplateDefault);}
      if(this.fn_getStyleProperty("grid-template-columns")===undefined){this.fn_setStyleProperty("grid-template-columns", this.obj_design.str_gridTemplateDefault);}                 
      //END INITIALIZE STYLE
    }
    fn_beforeAddChildren(){      

      //if this doesnt work, its likely because the palette easygrid object was saved with inti_axis=1. It should be undefined.
      //to do this nk of betting way f indicating this is a palette add, as opposed to a saved object add.                  
      
      
      if(this.obj_holder.bln_addPaletterItemEvent){              
        
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
          let obj_container=obj_parent.fn_getParentComponent();
          if(obj_container && obj_container.obj_design.str_type==="eazygrid"){
              let int_value=obj_container.obj_design.int_axis;
              this.obj_design.int_axis=obj_shared.fn_flipOrientation(int_value);
          }
        }
      }            
    }    
    
    fn_addItem(obj_ini){
      //console.log("fn_addItem");
      let obj_item;        
      if(obj_ini.obj_design.str_type===undefined){
        obj_ini.obj_design.str_type="eazygriditem";
      }       
      
      obj_item=super.fn_addItem(obj_ini)//CallSuper

      this.fn_applyFeatures();
      return obj_item;
    }
    
    fn_getIsEmpty(){
      let arr, obj_item;
      arr=this.obj_design.arr_item;
      if(arr.length>1){
        console.log("arr.length>1")
        return false;
      }
      if(!arr.length){        
        return true;
      }
      obj_item=arr[0];
      if(obj_item.fn_getType()!=="eazygriditem"){
        console.log("obj_item !==eazygriditem")
        return false;
      }
      if(obj_item.obj_design.arr_item.length){
        console.log("(obj_item.obj_design.arr_item.length is true")
        return false;
      }
      return true;
    }
      
      
    
    fn_bootChildren(){//only in boot/pallteItem phase
      
      console.log("fn_bootChildren");
      
      let obj_ini;
      
      
      if(this.obj_design.bln_eazyGrid){        
        
        obj_ini=new Holder;                             
        //obj_ini.obj_domStyle.backgroundColor=obj_shared.fn_getRandomColor();                                
        this.fn_addItem(obj_ini);//BootItem     
      
        obj_ini=new Holder;                             
        //obj_ini.obj_domStyle.backgroundColor=obj_shared.fn_getRandomColor();                        
        this.fn_addItem(obj_ini);//BootItem                
      }    
    }        
    
    fn_compileTemplate(){      

      this.obj_domStyle.gridTemplateRows=this.obj_design.str_gridTemplateDefault;
      this.obj_domStyle.gridTemplateColumns=this.obj_design.str_gridTemplateDefault;     

      if(this.obj_design.int_axis===undefined){        
        return;
      }
      
      let obj_item;
      let s="";            
      this.obj_design.arr_item.forEach(obj_item => {                
        if(obj_item.obj_design.gridTemplate){
          s+=obj_item.obj_design.gridTemplate;        
          s+=" ";
        }
      });      


      if(s){
        s=s.trim();
      }

      //console.log(" eazygrid s: " + s);      

      switch(this.obj_design.int_axis){
            case(obj_const.int_axisVertical):            
              this.obj_domStyle.gridTemplateColumns=s;              
            break;
            case(obj_const.int_axisHorizontal):            
              this.obj_domStyle.gridTemplateRows=s;
            break;
            default:              
      }      
      if(this.bln_debug){
        let s_debug;
        s_debug="fn_compileTemplate"  +"\n";        
        s_debug+="str_gridTemplateRows: " + this.obj_domStyle.gridTemplateRows  +"\n";
        s_debug+="str_gridTemplateColumns: " + this.obj_domStyle.gridTemplateColumns +"\n";
        //console.log(s_debug);        
      }      
    }
    
    fn_applyFeatures(){
      this.fn_compileTemplate();           
      super.fn_applyFeatures();      
    }    
    
}//END CLS
//END eazygrid