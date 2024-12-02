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
              //str_value="blank";
              str_value='<svg width="0px" height="24px"></svg>';
              break;
              brush
              case "xapp_xdezign":
              str_value="brush";
              break;
              case "xdezign_project":
              //str_value="flowchart";
              str_value='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M600-160v-80H440v-200h-80v80H80v-240h280v80h80v-200h160v-80h280v240H600v-80h-80v320h80v-80h280v240H600Z"/></svg>';                            
              break;              
              case "xdezign_tag":
              str_value="sell";
              break;         
              case "xdezign_map":
              str_value="map";
              break;         
              case "xapp_desk":            
              str_value="chair";
              break;
              case "xapp_lock":
              str_value="lock";
              break;                     
              case "xapp_rowz":
              str_value="tag";
              break;        
              case "xapp_office":
              //str_value="trophy";
              str_value='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z"/></svg>';
              break;
              case "rowz_activity":
              str_value="alternate_email";
              break;
              case "rowz_contact":
              //str_value="contacts_product" //not correctly hosted
              str_value='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M185-80q-17 0-29.5-12.5T143-122v-105q0-90 56-159t144-88q-40 28-62 70.5T259-312v190q0 11 3 22t10 20h-87Zm147 0q-17 0-29.5-12.5T290-122v-190q0-70 49.5-119T459-480h189q70 0 119 49t49 119v64q0 70-49 119T648-80H332Zm148-484q-66 0-112-46t-46-112q0-66 46-112t112-46q66 0 112 46t46 112q0 66-46 112t-112 46Z"/></svg>';
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
              
            default:
              str_value=str_value;
          }
          
          if(str_value){                                                    
            
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