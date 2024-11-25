
            //XSTART component/form_tablecell
              class form_tablecell extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);            
                }         
              fn_locateItem(str_idXDesign, str_type){
                let arr, obj_item;
                arr=this.obj_design.arr_item;
                for(let i=0;i<arr.length;i++){
                    obj_item=arr[i];     
                    
                    if(obj_item.fn_getType()===str_type){
                      if(obj_item.obj_design.str_idXDesign==str_idXDesign){
                        return obj_item;
                      }
                      if(obj_item.obj_design.str_linkId==str_idXDesign){
                        return obj_item;
                      }
                    }
                }
                return false;
              } 
              }//END CLS
              //END TAG
              //END component/form_tablecell