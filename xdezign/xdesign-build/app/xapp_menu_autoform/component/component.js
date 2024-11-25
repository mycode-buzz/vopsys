      //XSTART component/xapp_menu_autoform
      class xapp_menu_autoform extends xapp_menuform{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_getRunDataViewQueryExpression(){//can be overidden

          let obj_column;
          obj_column=this.obj_rowMenu.fn_getColumnViaName("`meta_form`.`meta_form`.`MetaFormSystemId`");          
          let str_metaFormSystemId=obj_column.str_value;
          obj_column=this.obj_rowMenu.fn_getColumnViaName("`meta_form`.`meta_form`.`MetaViewId`");          
          let str_metaViewId=obj_column.str_value;          
          obj_column=this.obj_rowMenu.fn_getColumnViaName("`meta_form`.`meta_form`.`MetaSchemaName`");          
          let str_metaSchemaName=obj_column.str_value;
          //obj_column=this.obj_rowMenu.fn_getColumnViaName("`meta_column`.`meta_column`.`MetaTableName`");          
          //let str_metaTableName=obj_column.str_value;

          /*
          let str_expr="";
          str_expr+="`MetaFormSystemId`='" + str_metaFormSystemId + "' ";                            
          str_expr+="AND ";    
          str_expr+="`MetaViewId`='" + str_metaViewId + "' ";                            
          str_expr+="AND ";              
          str_expr+="`MetaSchemaName`='" + str_metaSchemaName + "' ";                            
          //str_expr+="AND ";    
          //str_expr+="`MetaTableName`='" + str_metaTableName + "' ";                            
          str_expr+="AND ";   
          //return str_expr; 
          //*/

          /*
          let str_expr="";
          str_expr+='{"\$and":[{"110.CategoryName":"' + this.fn_getText() + '"}]}';
          return str_expr;
          //*/
        }
      }//END CLS
      //END TAG
      //END component/xapp_menu_autoform        