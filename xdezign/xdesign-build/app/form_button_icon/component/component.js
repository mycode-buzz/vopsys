      //XSTART component/form_button_icon
      class form_button_icon extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                          
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_setStyleProperty(str_name, str_value){          
          
          super.fn_setStyleProperty(str_name, str_value);

          const svgElement =this.dom_obj.querySelector('svg');
          //font awesome will nest a new svg tag into the icon i element
          //this is only seen in the HTML after program execution breaks , for eaxmampel after the first trip to the server.
          if(svgElement){
            svgElement.style.setProperty(str_name, str_value);
          }
          else{
            //this is generally the case, surprisingly
            //console.log("no font awsome svg");            
          }
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////          
      }//END CLS
      //END TAG
      //END component/form_button_icon        