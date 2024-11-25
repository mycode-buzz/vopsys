      //XSTART component/upgrade_button
      class upgrade_button extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                  
                  
          
          obj_project.fn_forgetEvent(e);
          
          let obj_dashboard=obj_project.fn_locateItem("upgrade_dashboard");
          if(obj_dashboard){
            obj_dashboard.fn_upgradeProject();
          }                  
        }                
      }//END CLS
      //END TAG
      //END component/upgrade_button        