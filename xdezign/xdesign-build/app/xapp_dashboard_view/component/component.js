      //XSTART component/xapp_dashboard_view
      class xapp_dashboard_view extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_loadDashboard(){                                                                                              
          
          this.obj_menuPanel=this.fn_getParentComponent();                  
          if(this.obj_menuPanel){
            //let obj_consoleContainer=this.obj_menuPanel.fn_addConsoleContainer("xapp_console_container_general", true);            
            let obj_consoleContainer=this.obj_consoleContainerRecord=this.obj_menuPanel.fn_addConsoleContainer("console_container_record", true);                        
            
            this.obj_button_file_select=obj_consoleContainer.fn_getConsoleComponent("xapp_button_file_select");                                                                                   
            this.obj_input_file_select=this.obj_button_file_select.fn_getComponent("xapp_input_file_select");                                                                                               
            this.obj_button_file_import=obj_consoleContainer.fn_getConsoleComponent("xapp_button_file_import");                                                                       

            let obj_menuButton=this.fn_getMenuButton();
            let obj_settingMenu=obj_menuButton.obj_parentMenu;
            let obj_standardMenu=obj_settingMenu.obj_parentMenu;
            let int_metaViewId=obj_standardMenu.fn_getMetaViewId();            
            let int_metaRowzId=obj_standardMenu.fn_getMetaRowzId();            
            if(int_metaViewId){
              this.int_metaViewId=int_metaViewId;
              this.int_metaRowzId=int_metaRowzId;
              obj_consoleContainer.fn_showItem(this.obj_button_file_select);                        
              //obj_consoleContainer.fn_showItem(this.obj_button_file_import);                        
            }            
          }                    
        } 

        fn_buttonFileSelectOnClick(){          
          const fileInput = this.obj_input_file_select.dom_obj;
          fileInput.click();        
        }
        fn_inputFileSelectOnChange(){                                        
          
          this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_file_select);                        
          this.obj_consoleContainerRecord.fn_showItem(this.obj_button_file_import);                        
          
        }
        fn_buttonFileImportOnClick(){          
          
          const fileInput = this.obj_input_file_select.dom_obj;
          const file = fileInput.files[0]; // Get the selected file
      
          if (file) {        
            
              
            //*
              const formData = new FormData();      
              formData.append('file', file); // Append the file to FormData                            
              formData.append('str_action', "import_file");               
              formData.int_idMetaView=this.int_metaViewId;
              formData.int_idMetaRowz=this.int_metaRowzId;              
              formData.str_action="import_file";            
              formData.str_nameFolderServer="xapp_dashboard_setting";                                                                                          
              formData.str_idAJAXNotifier=this.obj_design.str_idXDesign;              
              this.fn_runServerFileUpload(formData);                                                                                     
              //*/
      
              /*
              let obj_ini=new Object;                                
              obj_ini.str_action="import_file";            
              obj_ini.str_nameFolderServer="xapp_dashboard_setting";                                                                            
              obj_ini.data_formData=formData;
              this.fn_runServerAction(obj_ini);                                                                       
              //*/
              
          } else {              
              obj_shared.fn_messageWarn("Please select a file");
          }
        }
        import_file(){          
          this.obj_consoleContainerRecord.fn_showItem(this.obj_button_file_select);                        
          this.obj_consoleContainerRecord.fn_hideItem(this.obj_button_file_import);                        
        }
      }//END CLS
      //END TAG
      //END component/xapp_dashboard_view        