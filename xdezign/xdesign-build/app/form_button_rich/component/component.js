      //XSTART component/form_button_rich
      class form_button_rich extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onLoad(){          
          super.fn_onLoad();
          //if(this.fn_hasContextHolderParent()){return;}              

          this.fn_showIcon(this.obj_design.str_icon);          
        }        
        fn_setSubDomain(str_value){
          this.obj_design.str_subdomain=str_value;
        }
        fn_getMenuButton(){
                  
          let obj_menuPanel=this.fn_getMenuPanel();
          if(!obj_menuPanel){return;}
          let obj_menuButton=obj_menuPanel.obj_parentMenu;                  
          if(!obj_menuButton){
            console.log("obj_menuButton is not an object");
            return;
          }
          return obj_menuButton;
        }
        fn_getMenuPanel(){
          
          let obj_menuPanel=this.fn_getItemGoNorth("xapp_menu_panel");                  
          if(!obj_menuPanel){
            console.log("obj_menuPanel is not an object");
            return;
          }
          return obj_menuPanel;                  
        }

        fn_setNavigationURL(str_value){
          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setNavigationURL(str_value);          
          }
        }
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_showIcon(str_value){

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){                
            obj_anchor.bln_debugButtonDisable=this.bln_debugButtonDisable;
            obj_anchor.fn_showIcon(str_value);                          
          }  
        } 
        fn_setText(str_value){          
          
          super.fn_setText(str_value);                    

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            obj_anchor.fn_setText(str_value);          
          }          
        }
        fn_getText(){

          let str_text;

          str_text=super.fn_getText();          

          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          if(obj_anchor){          
            str_text=obj_anchor.fn_getText();          
          }         
          return str_text; 

        }
        
        
        fn_setStyleProperty(str_name, str_value){                          

          let obj_anchor=this.fn_getComponent("form_button_anchor");                   

          switch(str_name){
            case "color":
              if(obj_anchor){          
                obj_anchor.fn_setStyleProperty(str_name, str_value);                                        
              }
              break;
            case "colorIcon":
              if(obj_anchor){                    
                obj_anchor.fn_setStyleProperty(str_name, str_value);                                        
              }
              break;
            case "fontSizeIcon":
              if(obj_anchor){                          
                obj_anchor.fn_setStyleProperty(str_name, str_value);                                        
              }              
              break;
            default:
              super.fn_setStyleProperty(str_name, str_value);                  
          }

        }
        
        fn_getComputedStyleProperty(str_name){
          
          let obj_anchor=this.fn_getComponent("form_button_anchor");          
          
          switch(str_name){
            case "color":                          
              if(obj_anchor){          
                return obj_anchor.fn_getComputedStyleProperty(str_name);                          
              }   
              break;                     
            case "colorIcon":          
              if(obj_anchor){          
                return obj_anchor.fn_getComputedStyleProperty(str_name);                          
              }                        
              break;                     
            default:
              return super.fn_getComputedStyleProperty(str_name);                  
          }
        }  
        ///////////////////////
        ///////////////////////
        ///////////////////////             

      }//END CLS
      //END TAG
      //END component/form_button_rich        