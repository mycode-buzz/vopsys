      //XSTART component/block_structure
      class block_structure extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){
          super.fn_onLoad();                

          this.fn_setStyleProperty("display", "flex");
          this.fn_setStyleProperty("flex-wrap", "wrap");
          this.fn_setStyleProperty("flex", "1 1 auto");         
          
          let str_position=this.obj_design.str_position;          
          switch(str_position){
            case "start":                        
            case "end":              
              this.fn_setStyleProperty("justifyContent", str_position);              
              break;
          }          
        }
      }//END CLS
      //END TAG
      //END component/block_structure        