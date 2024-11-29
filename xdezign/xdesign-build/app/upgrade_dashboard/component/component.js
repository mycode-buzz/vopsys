      //XSTART component/upgrade_dashboard
      class upgrade_dashboard extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_loadDashboard(){
          if(!super.fn_loadDashboard()){return;}          
          //this.fn_addContextItem("upgrade_button");                                    
        }

        fn_upgradeProject(){
          alert("Sending upgrade request...")
          let obj_ini=new Object;            
          obj_ini.str_action="upgradeXDesign";                                             
          this.fn_runServerAction(obj_ini);                                
        }
        upgradeXDesign(){
          alert("Follow steps in console...")

        }      
      }//END CLS
      //END TAG
      //END component/upgrade_dashboard        