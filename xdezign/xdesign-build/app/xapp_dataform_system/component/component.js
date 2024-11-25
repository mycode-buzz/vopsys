      //XSTART component/xapp_dataform_system
      class xapp_dataform_system extends xapp_dataform_view{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }        
        fn_setQueryHome(bln_value){
          let int_actionCode=0;
          if(bln_value){
            int_actionCode=200;
          }
          this.obj_holder.obj_query.int_actionCode=int_actionCode;          
        }  
        
      }//END CLS
      //END TAG
      //END component/xapp_dataform_system        