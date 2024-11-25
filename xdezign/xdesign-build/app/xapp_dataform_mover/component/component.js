      //XSTART component/xapp_dataform_mover
      class xapp_dataform_mover extends xapp_dataform_view{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_setQueryInvite(bln_value){
          let int_actionCode=0;
          if(bln_value){
            int_actionCode=10;
          }
          this.obj_holder.obj_query.int_actionCode=int_actionCode;          
        }  
        fn_setQueryDisable(bln_value){
          let int_actionCode=0;
          if(bln_value){
            int_actionCode=20;
          }
          this.obj_holder.obj_query.int_actionCode=int_actionCode;          
        }  
        fn_setQueryEnable(bln_value){
          let int_actionCode=0;
          if(bln_value){
            int_actionCode=50;
          }
          this.obj_holder.obj_query.int_actionCode=int_actionCode;          
        }          
        fn_setQueryOpen(bln_value){
          let int_actionCode=0;
          if(bln_value){
            int_actionCode=100;
          }
          this.obj_holder.obj_query.int_actionCode=int_actionCode;          
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
      //END component/xapp_dataform_mover        