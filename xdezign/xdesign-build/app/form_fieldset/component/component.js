//XSTART component/form_fieldset
class form_fieldset extends component{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                
    
  }
  fn_onLoad(){
    super.fn_onLoad();
    if(this.fn_hasContextHolderParent()){return;}    
    this.obj_formLegend=this.fn_addContextItem("form_legend");
    this.bln_toggleState=false;
    
    this.obj_themeItemSection=this.fn_applyTheme("form_section", true);    
  }
  
  fn_setText(str_value){         
    if(this.fn_hasContextHolderParent()){return;}    
    if(!this.obj_formLegend){return;}    
    this.obj_formLegend.fn_setText(str_value);                           
  }  
  fn_legendOnClick(){    
    
    if(this.obj_design.lockOpen){
      return;
    }               
    this.fn_toggleLegend();        
  }

  fn_toggleLegend(){       
    
    let bln_value=this.bln_toggleState;
    if(!bln_value){
         this.fn_open();       
    }
    else{
      this.fn_close();        
    }
  }

  fn_open(){    

    let obj_themeItem=this.obj_themeItemSection;
    if(obj_themeItem){      
      this.fn_setStyleProperty("border", obj_themeItem.fn_getStyleProperty("border"));    
      this.fn_setStyleProperty("boxShadow", obj_themeItem.fn_getStyleProperty("boxShadow"));    
      this.fn_setStyleProperty("padding", obj_themeItem.fn_getStyleProperty("padding"));
    }        
    
    

    this.bln_toggleState=true;    
    this.fn_setDisplayChildren(true);
  }  
  
  fn_close(e){        
    
    this.fn_setStyleProperty("border", "none");          
    this.fn_setStyleProperty("boxShadow", "none");    
    this.fn_setStyleProperty("paddingTop", "0px");            
    this.fn_setStyleProperty("paddingBottom", "0px");               

    this.bln_toggleState=false;            
    this.fn_setDisplayChildren(false);    
    
  }  

  fn_setDisplayChildren(bln_value){   

    let arr_item, obj_item;
    arr_item=this.obj_design.arr_item;
    
    for(let i=1;i<arr_item.length;i++){                    
      obj_item=arr_item[i];      
      if(bln_value && obj_item.fn_getHidden()){
        continue;
      }
      obj_item.fn_setDisplayFlex(bln_value);      
    }
  }

  fn_getMenuPanel(){
                      
    let obj_menuPanel=this.fn_getItemGoNorth("xapp_menu_panel");                  
    if(!obj_menuPanel){
      console.log("obj_menuPanel is not an object");
      return;
    }
    return obj_menuPanel;                  
  }  
  
}//END CLS
//END TAG
//END component/form_fieldset        