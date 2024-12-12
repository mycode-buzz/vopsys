
            //XSTART component/form_tablerow
              class form_tablerow extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);
                }       
                fn_addItem(obj_ini){
                  let obj_item;  
            
                  if(obj_ini.obj_design.str_type===undefined){
                    obj_ini.obj_design.str_type="tablecell";                         
                  }
                  obj_item=super.fn_addItem(obj_ini);//CallSuper          
                  return obj_item;
                }                
                fn_locateItem(str_idXDesign, str_type){
                  let arr, obj_item, obj_locate;
                  arr=this.obj_design.arr_item;
                  for(let i=0;i<arr.length;i++){
                      obj_item=arr[i];              
                      obj_locate=obj_item.fn_locateItem(str_idXDesign, str_type);            
                      if(obj_locate){
                        return obj_locate;
                      }
                  }
                  return false;
                }
              }//END CLS
              //END TAG
              //END component/form_tablerow