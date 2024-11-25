
            //XSTART component/xdezign_iframe
              class xdezign_iframe extends form_iframe{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_navigateToProject(str_url_folder){                                                
                  this.fn_navigateURL(str_url_folder + "/index.php?mode=edit");
                }          
                fn_onRegisterWithProject(){                
                  this.fn_resetIFrame();                       
                }
                fn_resetIFrame(){                      
                  let str_url=obj_path.fn_getURLAssetFile(obj_project.obj_design.str_type, "welcome.html");
                  this.fn_navigateURL(str_url);                       
                }
                
                
              }//END CLS
              //END TAG
              //END component/xdezign_iframe