      //XSTART component/lock
      class lock extends xapp{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();
          this.fn_onAuthorizeUserStatus();
        }
      }//END CLS
      //END TAG
      //END component/lock        