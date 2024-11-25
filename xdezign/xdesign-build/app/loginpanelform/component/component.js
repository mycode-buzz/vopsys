
            //XSTART component/loginpanelform
              class loginpanelform extends form_form{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
                  
                  //this.fn_setType("loginpanelform");      
                  this.fn_setTag("loginpanelform");            
                  
                   this.fn_extends("form_form");            
                }
                fn_onLoad(){
                  super.fn_onLoad();

                  let obj_item;

                  //console.log("fn_onLoad");

                  let int_maxPadding=30;
                  let int_padding=int_maxPadding/2;
                  
                  obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserEmail");                                                
                  if(obj_item){                  
                    obj_item.obj_design.bln_debugDesign=true;
                    let int_maxPadding=30;
                    let int_padding=int_maxPadding/2;                                                           
                    
                    //obj_item.fn_setStyleProperty("padding", int_maxPadding+"px");        
                    //obj_item.fn_setStyleProperty("font-weight", "bold");        
                  }

                  obj_item=obj_project.fn_getComponent("xdesign1_AuthorizeUserPass");                                                
                  if(obj_item){                  
                    obj_item.obj_design.bln_debugDesign=true;
                    //obj_item.fn_setStyleProperty("padding", int_maxPadding+"px");        
                    //obj_item.fn_setStyleProperty("font-weight", "bold");        
                  }

                  obj_item=obj_project.fn_getComponent("login_button_send");                                                
                  if(obj_item){                    
                    obj_item.obj_design.bln_debugDesign=true;
                    //obj_item.fn_setStyleProperty("padding", int_padding+"px");        
                    //obj_item.fn_setStyleProperty("font-weight", "bold");        
                  }


                  
                  /*
                  let that=this;                  
                  this.dom_obj.addEventListener('submit', function(e){                                                             
                      e.preventDefault();                       
                      let obj_notify=that.obj_holder.obj_projectLocal;                      
                      if(obj_notify){
                        obj_notify.fn_startAuthorize();      
                      }                                            
                  });
                  //*/
                }                  

                
                fn_onSubmit(e){   
                  
                  
                  obj_project.fn_forgetEvent(e);                                    
                  let obj_dashboard=obj_project.fn_locateItem("login_dashboard");
                  if(obj_dashboard){                    
                    obj_dashboard.fn_startAuthorize();
                  }                  
                  
                }
              }//END CLS
              //END TAG
              //END component/loginpanelform