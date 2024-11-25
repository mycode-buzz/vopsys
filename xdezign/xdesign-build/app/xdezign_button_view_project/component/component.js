
            //XSTART component/xdezign_button_view_project
              class xdezign_button_view_project extends form_button{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_onClick(e){                  
                  
                  
                  obj_project.fn_forgetEvent(e);                  
                  
                  let obj_dashboard=obj_project.fn_locateItem("xdezign_dashboard_project");
                  if(obj_dashboard){
                    let int_idRecord=this.obj_design.int_idTarget;                    
                    //console.log("button fn_saveProject");
                    obj_dashboard.fn_viewProject(int_idRecord);
                  }                  
                }                
              }//END CLS
              //END TAG
              //END component/xdezign_button_view_project