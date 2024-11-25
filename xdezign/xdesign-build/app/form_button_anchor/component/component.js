      //XSTART component/form_button_anchor
      class form_button_anchor extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_onClick(e){                  

          obj_project.fn_forgetEvent(e);    
          //foregetevent                

          this.fn_parentEventBubble("Click", e);//this causes things to happen                            
        }        
        ///////////////////////
        ///////////////////////
        ///////////////////////
        fn_onLoad(){
          super.fn_onLoad();
          this.obj_icon=this.fn_getComponent("form_button_icon");                              
          this.obj_span=this.fn_getComponent("form_button_span");          
        }                
        fn_setNavigationURL(str_value){                    
          this.fn_setDomProperty("href", str_value);
        }        
        fn_showIcon(str_value){
          
          if(str_value){                            
            this.obj_holder.str_iconClass=str_value;
            str_value+=" fa-lg";
            
            this.obj_icon.fn_setDesignProperty("str_class", str_value);                      
            this.obj_icon.fn_removeDomProperty("class");                      
            this.obj_icon.fn_setClassName(str_value);                                  
            this.obj_icon.fn_setDisplay(true);          
          }         
          else{
            this.obj_icon.fn_setDisplay(false);
          }
        }                
        fn_setText(str_value){ 
          
          if(str_value=="notset"){
            str_value="";
          }
          
          if(str_value){                                                    
            this.obj_span.fn_setText(str_value);
            this.obj_span.fn_setDisplay(true);          
          }         
          else{
            this.obj_span.fn_setDisplay(false);
          }
        }
        fn_getText(){
          let str_text;          
          str_text=this.obj_span.fn_getText();                    
          return str_text;
        }
        fn_setStyleProperty(str_name, str_value){          
          
          switch(str_name){
            case "fontWeightAnchor":                            
              this.obj_span.fn_setStyleProperty("font-weight", str_value);
              break;
            case "color":              
              return this.obj_span.fn_setStyleProperty(str_name, str_value);
              break;
            case "colorIcon":                       
              this.obj_icon.fn_setStyleProperty("color", str_value);                                             
              break;
            case "fontSizeIcon":               
              this.obj_icon.fn_setStyleProperty("fontSize", str_value);                                             
              break;
            default:
              super.fn_setStyleProperty(str_name, str_value);              
          }   
        }
        fn_getStyleProperty(str_name){
        
          switch(str_name){
            case "color":              
              return this.obj_span.fn_getStyleProperty(str_name);                          
              break;
            case "colorIcon":                        
              return this.obj_icon.fn_getStyleProperty("color");
              break;
            default:
              return super.fn_getStyleProperty(str_name);                  
          }
        }
        fn_getComputedStyleProperty(str_name){
          
          switch(str_name){
            case "color":              
              return this.obj_span.fn_getComputedStyleProperty(str_name);                          
              break;
            case "colorIcon":                        
              return this.obj_icon.fn_getComputedStyleProperty("color");                          
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
      //END component/form_button_anchor        