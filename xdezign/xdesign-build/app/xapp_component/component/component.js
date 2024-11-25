
            //XSTART component/xapp_component
              class xapp_component extends xapp_ajax{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_getMenuButton(){
                  
                  let obj_menuPanel=this.fn_getMenuPanel();
                  if(!obj_menuPanel){return;}
                  let obj_menuButton=obj_menuPanel.obj_parentMenu;                  
                  if(!obj_menuButton){
                    console.log("obj_menuButton is not an object");
                    return;
                  }
                  return obj_menuButton;
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
              //END component/xapp_component