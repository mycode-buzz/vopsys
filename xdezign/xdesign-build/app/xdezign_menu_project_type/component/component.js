
            //XSTART component/xdezign_menu_project_type
              class xdezign_menu_project_type extends xdezign_menu{
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
                  
                  return '{"$and":[{"120.CategoryName":"' + this.fn_getText() + '"}]}';                  
                }
                
                fn_navigateToWelcomeScreen(){                                    
                  
                  this.fn_setEnabled();                                                      
                  this.fn_setDisplay();                                                      

                  this.fn_notifyChildControl("fn_navigateToWelcomeScreen");
                }
              }//END CLS
              //END TAG
              //END component/xdezign_menu_project_type