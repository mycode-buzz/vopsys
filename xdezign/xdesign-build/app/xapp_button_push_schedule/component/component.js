      //XSTART component/xapp_button_push_schedule
      class xapp_button_push_schedule extends xapp_console_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                                    
          
          obj_project.fn_forgetEvent(e);              
          let str_url;          
          let str_lokalDomain=obj_path.fn_getLokalDomain();
          str_url="api."+str_lokalDomain+"/interface/push/"; 
          str_url=obj_path.fn_getURLSiteProtocol(str_url);                    
          window.open(str_url, "_push");
        }                
      }//END CLS
      //END TAG
      //END component/xapp_button_push_schedule        