
            //XSTART component/xdezign_button_map_item
class xdezign_button_map_item extends form_button{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                
  }                
  fn_onClick(e){                
  
    obj_project.fn_forgetEvent(e);    
    let obj_objectmap=this.fn_getItemGoNorth("xdezign_map");
    obj_objectmap.fn_linkCompassItem(this);                  
  }
}//END CLS
//END TAG
//END component/xdezign_button_map_item
