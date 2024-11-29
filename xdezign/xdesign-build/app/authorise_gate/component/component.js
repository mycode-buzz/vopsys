
            //XSTART component/authorise_gate
              class authorise_gate extends xapp_ajax{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                                
                }
                fn_onLoad(){ //base object should be called
                  super.fn_onLoad();     
                  
                  if(obj_project.fn_hasContextHolderParent()){return;}                          
              
                  this.fn_checkAuthorize();        
                }  
                fn_checkAuthorize(){  
              
                  let obj_ini=new Object;            
                  obj_ini.str_action="checkAuthorize";                    
                  this.fn_runServerAction(obj_ini);                                
                  this.fn_createCurtain();
              } 
              
              fn_removeCurtain(){//overidden    
                const o=this.obj_holder.dom_objCurtain;
                  if(o && o.parentNode){
                    o.parentNode.removeChild(o);      
                  }
              }
              
              fn_createCurtain(){//overidden  
                
                this.fn_removeCurtain();
                
                const o= document.createElement("curtain");
                const os=o.style;
                this.obj_holder.dom_objCurtain=o;    
                os.display="block";
                os.width="100%";
                os.height="100vh";
                os.position="absolute";
                os.left="0px";
                os.top="0px";
                os.backgroundColor="rgb(43, 44, 52)";  
                os.zindex=1000;
                document.body.appendChild(o);    
              }
              
                fn_onAuthorizeUserStatus(obj_post){//overidden       
                  this.fn_removeCurtain();
                  super.fn_onAuthorizeUserStatus(obj_post);                
                  
                  this.fn_notify(obj_project, "fn_onAuthorizeUserStatus");    
                }
              
                fn_onUnAuthorizeUserStatus(obj_post){                                                          
                  obj_path.fn_navigateSubdomain("lock", true);        
                }
              }//END CLS
              //END TAG
              //END component/authorise_gate