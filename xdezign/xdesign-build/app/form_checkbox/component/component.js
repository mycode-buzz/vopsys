      //XSTART component/form_checkbox
      class form_checkbox extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);   
        }

        fn_getValue(){                    
          
            let bln_value =this.fn_getDomProperty("checked");
            bln_value=obj_shared.fn_parseBool(bln_value);                      
            //console.log("checkbox fn_getValue: " + bln_value);
            return bln_value;
        }

        fn_setValue(str_value="off"){                    
          let bln_value=obj_shared.fn_parseBool(str_value);          
          this.fn_setDomProperty("checked", bln_value);
          //console.log("checkbox fn_setValue: " + bln_value);
        }

        fn_setText(){}

        fn_onChange(e){                                        
          let bln_value=obj_shared.fn_parseBool(this.fn_getDomProperty("checked"));                                        
          //it seems we need to flip the bool , as we are getting the current value , not the new value
          bln_value=obj_shared.fn_flipBool(bln_value);                              

          if(bln_value){
            this.dom_obj.value="on"
            this.fn_setDomProperty("checked", true);
          }
          else{
            this.dom_obj.value="off"
            this.fn_setDomProperty("checked", false);          
          }          
          super.fn_onChange(e);
        }        
      }//END CLS
      //END TAG
      //END component/form_checkbox        