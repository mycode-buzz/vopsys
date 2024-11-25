//XSTART component/desk_dashboard
  class desk_dashboard extends xapp_dashboard{
    constructor(obj_ini) {      
      super(obj_ini);        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);                

      this.obj_holder.bln_debugServer=false;      
    }
    fn_loadDashboard(){                      
      
      let obj_ini=new Object;            
      obj_ini.str_action="getSubscribedList";                           
      this.fn_runServerAction(obj_ini);                                      

      
    }
    getSubscribedList(obj_post){
      
      this.fn_removeChildren();                         

      let arr_row=obj_post.RowData;    
  
      let obj_row, obj_item;            
      if(arr_row.length){

        for(var i=0;i<arr_row.length;i++){                      
          obj_row=arr_row[i];
          if(obj_shared.fn_isObjectEmpty(obj_row)){continue;}//RowData Can contain a single empty object              
          obj_item=this.fn_addContextItem("desk_form_button");                    
          if(!obj_item){continue;}
          obj_item.fn_setSubDomain(obj_row.Subdomain);
          obj_item.fn_setText(obj_row.MetaMallTitle);
          obj_item.fn_showIcon(obj_row.MetaMallIcon);                    
          obj_item.obj_design.int_idRecord=obj_row.MetaMallId;      
        }

      }
      else{        
        obj_item=this.fn_addContextItem("form_section");                      
        obj_item.fn_setText("No Apps Enabled");                  

      }

      

    }
  }//END CLS
  //END TAG
  //END component/desk_dashboard