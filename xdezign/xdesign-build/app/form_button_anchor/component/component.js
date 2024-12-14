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

          let bln_debug=false;                    
          
          switch(str_value){                        
              case "":                                       
              case "rowz_icon_blank":                                       
              str_value='<svg width="0px" height="24px"></svg>';
              break;                    
              case "xapp_xdezign":
              //brush
              str_value="brush";
              break;
              case "xdezign_project":              
              str_value="project";
              break;              
              case "xdezign_tag":
              str_value="sell";
              break;         
              case "xdezign_map":
              str_value="map";
              break;                                     
              case "xapp_lock":
              str_value="lock";
              break;                     
              case "xapp_rowz":
              str_value="tag";
              break;              
              case "thumb_up":              
              break;              
              case "xapp_desk":                 
              case "xapp_chair":              
              str_value='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M7,11v2h10v-2c0-1.86,1.28-3.41,3-3.86V6c0-1.65-1.35-3-3-3H7C5.35,3,4,4.35,4,6v1.14C5.72,7.59,7,9.14,7,11z"/><path d="M21,9c-1.1,0-2,0.9-2,2v4H5v-4c0-1.1-0.9-2-2-2s-2,0.9-2,2v5c0,1.65,1.35,3,3,3v1c0,0.55,0.45,1,1,1c0.55,0,1-0.45,1-1v-1 h12v1c0,0.55,0.45,1,1,1c0.55,0,1-0.45,1-1v-1c1.65,0,3-1.35,3-3v-5C23,9.9,22.1,9,21,9z"/></g></g></svg>';              
              break;
              case "xapp_office":              
              str_value="phone_iphone";
              break;
              case "rowz_activity":
              str_value="alternate_email";
              break;
              case "rowz_contact":              
              str_value="spa";
              break;
              case "rowz_touch_app":      
              str_value="touch_app";                      
              break; 
              case "rowz_credit_card":                    
              str_value="credit_card";                              
              break;               
              case "rowz_hashtag":
              str_value="tag";
              break;
              case "rowz_tag":
              str_value="sell";
              break;              
              case "rowz_upload_file":
              str_value="upload_file";
              break;              
              case "rowz_template":
              str_value="star";
              break;
              case "rowz_account":
              str_value="attach_money";
              break;
              case "rowz_opportunity":
              str_value="trending_up";              
              break;
              case "rowz_task":              
              str_value="attach_file";              
              break;
              case "xapp_linkon":  
              str_value="link";   
              break;            
              case "xapp_linkoff":  
              str_value="link_off";   
              break;            
              case "xapp_top":  
              str_value="arrow_upward";   
              break;   
              case "xapp_chevron_left":  
              str_value="chevron_left";   
              break;                 
              case "xapp_chevron_right":  
              str_value="chevron_right";   
              break;                 
              case "xapp_refresh":  
              str_value="refresh";   
              break;              
              case "xapp_settings":  
              str_value="settings";   
              break;     
              case "xapp_star":  
              str_value="star";   
              break;
              case "xapp_wrench":  
              str_value="build";   
              break;              
              case "xapp_visibility_off":  
              str_value="visibility_off";   
              break;              
              case "xapp_visibility_on":  
              str_value="visibility";   
              break;  
              case "xapp_calendar_month":  
              str_value="calendar_month";   
              break;  
              case "xapp_search":  
              str_value="search";   
              break;
              case "xapp_circle_plus":  
              str_value="circle_plus";   
              break;              
              case "xapp_send":  
              str_value="send";   
              break;              
              case "xapp_key":  
              str_value="key";   
              break;            
              case "xapp_add":  
              str_value="add";   
              break;            
              case "xapp_dangerous":  
              str_value="dangerous";   
              break;            
            default:
              str_value=str_value;
          }
          
          if(str_value){                                                    
            
            this.obj_icon.dom_obj.innerHTML="";
            this.obj_icon.fn_setText(str_value);                                                
            this.obj_icon.fn_setClassName("material-icons");            
            this.obj_icon.fn_setDisplay(true); 
            if(bln_debug){
              this.obj_icon.fn_debug();
            }                                 
            
            /*
            this.obj_icon.fn_setDisplay(true);          
            this.obj_icon.fn_setFontSize("100px");          
            this.obj_icon.fn_setStylePropertxy("height", "200px");                                  
            //*/
            
          }         
          else{
            this.fn_showIcon("rowz_icon_blank");                                    
          }
        
          if(bln_debug){
            this.fn_debug();
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

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);          
          
          switch(str_name){
            case "fontSize":                                        
              this.fn_setControlStyleProperty(this.obj_span, str_name, str_value);
              this.fn_setControlStyleProperty(this.obj_icon, str_name, "1.5em");//note: 1.5em relative to parent container
              break;
            case "color":                            
            case "fontWeight":                                                    
              this.fn_setControlStyleProperty(this.obj_span, str_name, str_value);
              this.fn_setControlStyleProperty(this.obj_icon, str_name, str_value);            
              break;
            default:              
          }   
          super.fn_setStyleProperty(str_name, str_value);              
        }
        fn_getStyleProperty(str_name){

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);
        
          switch(str_name){
            case "fontWeight":                                          
            case "color":                            
            case "fontSize":                            
              return this.fn_getControlStyleProperty(this.obj_span, str_name);
            default:
              return super.fn_getStyleProperty(str_name);                  
          }
        }
        fn_getComputedStyleProperty(str_name){

          str_name=obj_shared.fn_hyphenToCamelCase(str_name);
          
          switch(str_name){
            case "fontWeight":                                          
            case "color":                            
            case "fontSize":                                     
              return this.fn_getControlComputedStyleProperty(this.obj_span, str_name);              
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