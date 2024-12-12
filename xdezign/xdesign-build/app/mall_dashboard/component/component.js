
            //XSTART component/mall_dashboard
              class mall_dashboard extends xapp_dashboard{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                

                  this.obj_holder.bln_debugServer=false;                  
                }
                fn_loadDashboard(){
                  if(!super.fn_loadDashboard()){return;}                      
      
                  let obj_ini=new Object;            
                  obj_ini.str_action="getMallList";                           
                  this.fn_runServerAction(obj_ini);                                      
                }                
                getMallList(obj_post){
                  
                  this.fn_removeChildren();                         
            
                  let arr_row=obj_post.RowData;    
              
                  let obj_row, obj_item;

                  if(arr_row.length){

                    for(var i=0;i<arr_row.length;i++){                      
                      obj_row=arr_row[i];
                      if(obj_shared.fn_isObjectEmpty(obj_row)){continue;}//RowData Can contain a single empty object              
                      /*
                      let str_color="";
                      let bln_livePin=obj_shared.fn_parseBool(obj_row.MetaDeskLivePin);                      
                      console.log("bln_livePin: " + bln_livePin);
                      if(bln_livePin){
                        str_color="green";
                      }
                      //*/
                      
                      obj_item=this.fn_addContextItem("mall_form_button");
                      if(!obj_item){continue;}
                      obj_item.fn_setSubDomain(obj_row.Subdomain);
                      obj_item.fn_setText(obj_row.MetaMallTitle);
                      //obj_item.fn_setColor(str_color);
                      obj_item.obj_design.int_idRecord=obj_row.MetaMallId;
                    }

                  }
                  else{

                    obj_item=this.fn_addContextItem("form_fieldset");                      
                    obj_item.fn_setText("No More Apps Available");                  

                  }
                  
                  
                }

                fn_subscribeToApp(int_idRecord){                      
      
                  console.log("fn_subscribeToApp");
                  let obj_ini=new Object;            
                  obj_ini.RecordId=int_idRecord;                  
                  obj_ini.str_action="subscribeToApp";                           
                  this.fn_runServerAction(obj_ini);                                      
                }
                subscribeToApp(){   
                  alert("Subscription Updated");                  
                  obj_path.fn_navigateSubdomain("desk");                  
                }
              }//END CLS
              //END TAG
              //END component/mall_dashboard