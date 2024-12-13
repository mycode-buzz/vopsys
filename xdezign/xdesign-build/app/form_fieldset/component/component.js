//XSTART component/form_fieldset
class form_fieldset extends component{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                
    this.obj_design.lockOpen=true;
  }
  fn_onLoad(){
    super.fn_onLoad();
    if(this.fn_hasContextHolderParent()){return;}    
    this.obj_formLegend=this.fn_addContextItem("form_legend");
    this.bln_toggleState=true;
    
    
    this.fn_setStyleProperty("overflow", "hidden");                      
    this.fn_setStyleProperty("margin", "0px");                      
  }
  fn_applyThemeStructure(){                        
    
    if(!obj_project.obj_theme){return;}
    this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formFieldset;                    
    this.fn_applyStyle(this.obj_holder.obj_themeStructure);                                 
  }
  fn_onRowMember(obj_row){

    this.obj_row=obj_row;                  
    this.obj_paramRow=this.obj_row.obj_paramRow;                                    
    this.obj_paramRS=this.obj_paramRow.obj_paramRS;                                                       
    
    
    this.fn_setStyleProperty("display", "flex");
    this.fn_setStyleProperty("flex-wrap", "wrap");
    this.fn_setStyleProperty("alignSelf", "flex-start");    
    this.fn_setAxis(this.obj_paramRS.bln_axisFieldset);
    

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

    this.fn_applyThemeStructure();            

    this.bln_toggleState=true;    
    this.fn_setDisplayChildren(true);
  }  
  
  fn_close(e){ 

    this.fn_setStyleProperty("border", "none");              
    this.fn_setStyleProperty("paddingTop", "0px");            
    this.fn_setStyleProperty("paddingBottom", "0px");               
    this.fn_setStyleProperty("backgroundColor", "transparent");

    this.bln_toggleState=false;            
    this.fn_setDisplayChildren(false);    
    
  }  

  fn_setDisplayChildren(bln_value){   

    let arr_item, obj_item;
    arr_item=this.obj_design.arr_item;
    
    for(let i=1;i<arr_item.length;i++){                    
      obj_item=arr_item[i];      
      if(bln_value && obj_item.fn_getHiddenPin()){
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