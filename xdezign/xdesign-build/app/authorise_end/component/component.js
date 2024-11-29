      //XSTART component/authorise_end
      class authorise_end extends xapp_ajax{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                      
          this.obj_holder.bln_debugServer=false;
        }
        fn_onLoad(){ //base object should be called
          super.fn_onLoad();     
          
          if(obj_project.fn_hasContextHolderParent()){return;}                          
      
          this.fn_endAuthorize();        
        }  
        fn_endAuthorize(){  
      
          let obj_ini=new Object;            
          obj_ini.str_action="endAuthorize";                    
          this.fn_runServerAction(obj_ini);                                          
      }       
      }//END CLS
      //END TAG
      //END component/authorise_end        