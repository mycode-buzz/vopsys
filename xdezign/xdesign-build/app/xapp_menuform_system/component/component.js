      //XSTART component/xapp_menuform_system
      class xapp_menuform_system extends xapp_menuform{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);          
          
          this.str_defaultTypeData="xapp_dataform_system";                  
          
        }
        fn_setMenuPanel(){     
          super.fn_setMenuPanel();                  

          if(this.obj_menuPanel){                    
            this.obj_consoleContainer=this.obj_menuPanel.fn_addConsoleContainer("console_container_system", true);            
            this.obj_button_system_home=this.obj_consoleContainer.fn_getConsoleComponent("xapp_button_system_home", true);
          }
          
        }              
        
        fn_formHome(){                       
          this.bln_modeHome=true;              
          this.obj_dataView.fn_setQueryHome(true);                                
          this.fn_formViewRecord();
        }        

        fn_onDataStart(obj_post){        
          
          //console.log("fn_onDataStart");
          super.fn_onDataStart(obj_post);    

          if(this.bln_modeHome){
            this.bln_modeHome=false;                        
            obj_path.fn_navigateSubdomain("desk");                    
            return;
          }                       

          if(!this.obj_consoleContainer){//on count, not opened
            return;
          }

          
          this.obj_consoleContainer.fn_hide();
          
          
          if(!this.bln_hasChildForm){
            let obj_button=this.obj_button_system_home;                                                  
            this.obj_consoleContainer.fn_showItem(obj_button);
            
            let bln_value=obj_userHome.MetaSystemOwner;
            if(bln_value){
              this.obj_consoleContainer.fn_setDisabledItem(obj_button);
            }
          }          

          
        }                  

      }//END CLS
      //END TAG
      //END component/xapp_menuform_system        