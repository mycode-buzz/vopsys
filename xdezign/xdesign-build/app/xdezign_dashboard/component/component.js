
            //XSTART component/xdezign_dashboard
              class xdezign_dashboard extends xapp_dashboard{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.obj_holder.bln_debugServer=false;                  
                }

                fn_loadDashboard(){                                        
                  
                  let obj_iframe=this.fn_addContextItem("xdezign_iframe");                                    
                  obj_iframe.fn_resetIFrame();                             
                  this.fn_onStateChange();        
                }                

                

                

              
              fn_onStateChange(){    
      
                //console.log("XDESIGN fn_onStateChange");     
                let obj_item;
                obj_item=this.obj_holder.obj_xdezign_managersettings;
                if(obj_item){obj_item.fn_onStateChange();}
                obj_item=this.obj_holder.obj_xdezign_managerproject;
                if(obj_item){obj_item.fn_onStateChange();}
                obj_item=this.obj_holder.obj_xdezign_managermessenger;
                if(obj_item){obj_item.fn_onStateChange();}
                obj_item=this.obj_holder.obj_xdezign_managerpalette;
                if(obj_item){obj_item.fn_onStateChange();}
                obj_item=this.obj_holder.obj_xdezign_managertag;
                if(obj_item){obj_item.fn_onStateChange();}
                obj_item=this.obj_holder.obj_xdezign_managercomponent;
                if(obj_item){obj_item.fn_onStateChange();}                
              }          
                
              }//END CLS
              //END TAG
              //END component/xdezign_dashboard