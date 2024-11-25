      //XSTART component/xapp_menuform_mover
      class xapp_menuform_mover extends xapp_menuform{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);          
          
          this.str_defaultTypeData="xapp_dataform_mover";
          
        }
        fn_setMenuPanel(){     
          super.fn_setMenuPanel();                  

          
          if(this.obj_menuPanel){                    
            
            this.obj_consoleContainerMover=this.obj_menuPanel.fn_addConsoleContainer("console_container_mover", true);
            this.obj_button_mover_invite=this.obj_consoleContainerMover.fn_getConsoleComponent("xapp_button_mover_invite");            
            this.obj_button_mover_open=this.obj_consoleContainerMover.fn_getConsoleComponent("xapp_button_mover_open");
            this.obj_button_mover_home=this.obj_consoleContainerMover.fn_getConsoleComponent("xapp_button_mover_home");
            this.obj_button_mover_enable=this.obj_consoleContainerMover.fn_getConsoleComponent("xapp_button_mover_enable");
            this.obj_button_mover_disable=this.obj_consoleContainerMover.fn_getConsoleComponent("xapp_button_mover_disable");            
          }
        }                

        
        fn_formInvite(){                       
          this.bln_modeInvite=true;              
          this.obj_dataView.fn_setQueryInvite(true);                                
          this.fn_formViewRecord();
        }    
        fn_formDisable(){                       
          this.bln_modeDisable=true;              
          this.obj_dataView.fn_setQueryDisable(true);                                
          this.fn_formViewRecord();
        }    
        fn_formEnable(){                       
          this.bln_modeEnable=true;              
          this.obj_dataView.fn_setQueryEnable(true);                                
          this.fn_formViewRecord();
        }    
        fn_formOpen(){                       
          this.bln_modeOpen=true;              
          this.obj_dataView.fn_setQueryOpen(true);                                
          this.fn_formViewRecord();
        }    
        fn_formHome(){                       
          this.bln_modeHome=true;              
          this.obj_dataView.fn_setQueryHome(true);                                
          this.fn_formViewRecord();
        }    
        

        fn_onDataStart(obj_post){        
          //alert("fn_onDataStart");
          //console.log("fn_onDataStart");

          super.fn_onDataStart(obj_post);    

          this.obj_post=obj_post;



          
          //*
          if(!this.bln_hasChildForm){
            if(this.obj_meta.str_metaRowzName==="meta_system"){
              
              let obj_button=this.obj_button_mover_home;                                      
              this.obj_consoleContainerMover.fn_showItem(obj_button);    
            }
            //alert("this.obj_meta.str_metaRowzName: " + this.obj_meta.str_metaRowzName);
            return;
          }
          //*/

          

          let arr_rows=this.obj_post.RowData;                        
          //console.log(arr_rows);
          
          let arr_row=arr_rows[0];                              
          if(arr_row){                        
              
              let MetaMoverUserId=obj_shared.fn_getObjectProperty(arr_row, "`meta_user`.`meta_mover`.`MetaMoverUserId`");
              let MetaMoverType=obj_shared.fn_getObjectProperty(arr_row, "`meta_user`.`meta_mover`.`MetaMoverType`");
              let MetaMoverStatus=obj_shared.fn_getObjectProperty(arr_row, "`meta_user`.`meta_mover`.`MetaMoverStatus`");                            
              let MetaUserId=this.obj_post.MetaUserId;
              //this.MetaMoverUserId refers to the id on mover record row
              //this.obj_post.MetaUserId refers to the logged in session user record              
              //console.log("MetaMoverType: " + MetaMoverType);
              //console.log("MetaMoverStatus: " + MetaMoverStatus);

              this.obj_consoleContainerMover.fn_hide();

              let obj_button;              
              
              switch(MetaMoverType){
                case "User":
                  switch(MetaMoverStatus){
                    case "":
                      obj_button=this.obj_button_mover_invite;
                      
                    break;                  
                    case "Enabled":                    
                      obj_button=this.obj_button_mover_disable;                  
                    break;
                    case "Disabled":                    
                      obj_button=this.obj_button_mover_enable;                                    
                    break;
                  }   
                  
                  this.obj_consoleContainerMover.fn_showItem(obj_button);          
                  if(MetaUserId===MetaMoverUserId){
                    obj_button.fn_setDisabled();
                  }
                  
                  break;
                case "Login":
                    obj_button=this.obj_button_mover_open;                                      
                    this.obj_consoleContainerMover.fn_showItem(obj_button);          
                    obj_button.fn_setDisabled();
                    if(MetaMoverStatus==='Enabled'){
                      obj_button.fn_setEnabled();
                      
                    }
                  break;
              }
          }
          
          
          if(this.bln_modeInvite){                      
            this.bln_modeInvite=false;              
            this.obj_dataView.fn_setQueryInvite(false);                                
            this.fn_formViewRecord();
          }             
          if(this.bln_modeDisable){
            this.bln_modeDisable=false;            
            this.obj_dataView.fn_setQueryDisable(false);                                
            this.fn_formViewRecord();
          }             
          if(this.bln_modeEnable){
            this.bln_modeEnable=false;            
            this.obj_dataView.fn_setQueryEnable(false);                                
            this.fn_formViewRecord();
          }             
          if(this.bln_modeOpen){
            this.bln_modeOpen=false;                                    
            obj_path.fn_navigateSubdomain("desk");                    
          }                       
        }                  
      }//END CLS
      //END TAG
      //END component/xapp_menuform_mover        