//XSTART component/svgblock
class svgblock extends component{
    constructor(obj_ini) {      
      super(obj_ini);        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);        
  
      //START INITIALIZE DESIGN
      //this.obj_design.str_type="svgblock";    
      //this.obj_design.str_tag="svgblock";    
      this.fn_setTag("svgblock", true);            
      //maybe need in the future as type is now set to be whatever is requested, rather than tag                      
      this.fn_setIsContainer(false);      
      //if(this.obj_design.filterSVG===undefined){this.obj_design.filterSVG="invert(50%)";}
      if(this.obj_design.filterSVG===undefined){this.obj_design.filterSVG="notset";}
      if(this.obj_design.pointerEventSVG===undefined){this.obj_design.pointerEventSVG="none";}            
      
      if(this.obj_design.typeSVG===undefined){this.obj_design.typeSVG="image/svg+xml"};          
      //START INITIALIZE DESIGN

      //START INITIALIZE STYLE            
      this.obj_domStyle.padding="0px";
      this.obj_domStyle.alignSelf="center";                                  
      if(this.obj_domStyle.width===undefined){this.obj_domStyle.width="100px";}
      if(this.obj_domStyle.height===undefined){this.obj_domStyle.height="100px";}            
      if(this.obj_domStyle.display===undefined){this.obj_domStyle.display="block";}              
      //START INITIALIZE STYLE                    
    }       
    
    fn_setDesignProperty(str_name, str_value){
      super.fn_setDesignProperty(str_name, str_value);     
      this.fn_applyStyle();      
    }    
    fn_applyStyle(){
      super.fn_applyStyle();
      
      let dom_obj=this.dom_obj_svg;
      dom_obj.style.pointerEvents=this.obj_design.pointerEventSVG;          
      if(this.obj_design.filterSVG!=="notset"){
        dom_obj.style.filter=this.obj_design.filterSVG;
      }      

      /*
      //check generator here: https://codepen.io/sosuke/pen/Pjoqqp
      orange
      invert(64%) sepia(16%) saturate(4363%) hue-rotate(360deg) brightness(106%) contrast(105%)
      white
      invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
      //*/
    }

    fn_setFilter(str_value){
      this.fn_setDesignProperty("filterSVG", str_value);
    }

    fn_applyDataSVG(){
      let dom_obj=this.dom_obj_svg;
      dom_obj.data=this.obj_design.dataSVG;          
    }
    
    fn_createSelf(){

      super.fn_createSelf();
      
      let dom_obj;            
      dom_obj=document.createElement("object");                  
      dom_obj.type=this.obj_design.typeSVG;                
      dom_obj.style.padding="0px";                        
      dom_obj.style.marginBottom="0px";                        
      dom_obj.style.marginRight="0px";                              
      dom_obj.style.width="100%";
      dom_obj.style.height="100%";      
      dom_obj.innerHTML=this.obj_design.str_content;          
      this.dom_obj_svg=dom_obj;

      this.fn_applyDataSVG();//will cause display issues if changed
      this.dom_obj.append(dom_obj);              
  }
  }//END CLS