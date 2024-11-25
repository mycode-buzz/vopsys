
            //XSTART component/xdezign_menu_tag_type
              class xdezign_menu_tag_type extends xdezign_menu{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                }
                fn_getRunDataViewQueryExpression(){//can be overidden
                  
                  //let str_expr="";
                  //str_expr+="`CategoryName`='" + this.fn_getText() + "' ";                  
                  //str_expr+="AND ";                     
                  //return str_expr;

                  return '{"$and":[{"125.CategoryName":"' + this.fn_getText() + '"}]}';
                }
                
                fn_onOpen(){
                  super.fn_onOpen();  
                  this.fn_onPaletteItemSelected();
                }

                fn_onPaletteItemSelected(){                                 
                  
                  //console.log("xdezign_menu_tag_type fn_onPaletteItemSelected");                  

                  this.fn_setEnabled();                                     
                  //this.fn_close();                                            
                  this.fn_notifyChildControl("fn_onPaletteItemSelected");
                }
              }//END CLS
              //END TAG
              //END component/xdezign_menu_tag_type