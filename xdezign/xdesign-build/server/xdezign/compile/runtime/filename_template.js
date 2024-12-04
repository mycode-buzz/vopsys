
//START Project.js
class Project extends {str_nameTargetClass}{
    constructor(obj_ini) {
        super(obj_ini); // call the super class constructor
        
        /*
        THe use of this wrapper function allows items to be called form database , rather than hard-written into the code.        
        //e.g it allows the use of a simple Main procedure "new wrapper" which is name agnostic.
        //*/
    }  
    fn_onLoad(){
        super.fn_onLoad();        
        //console.log("Project Loaded: " + this.obj_design.str_name);
        //alert(obj_projectTarget)        
    }    

    fn_calculateFontSize(obj_themeOption){

        let int_fontSize;
          switch(obj_themeOption.str_fontSize){
              case "small":
                  if(this.bln_isMobile){this.fn_calculateFontSize("medium");} 
                  int_fontSize=8;
                  break;
              case "medium":
                  int_fontSize=10;
                  break;
              case "large":
                if(this.bln_isMobile){this.fn_calculateFontSize("medium");} 
                  int_fontSize=13;
                  break;
              default:
                  int_fontSize=10;
          }
          
          
        
        obj_themeOption.int_size1=int_fontSize;
        obj_themeOption.int_size2=obj_themeOption.int_size1+1;
        obj_themeOption.int_size3=obj_themeOption.int_size2+1;
        obj_themeOption.int_size4=obj_themeOption.int_size3+1;
        obj_themeOption.int_size5=obj_themeOption.int_size4+1;      
  
        obj_themeOption.int_size1/=10;
        obj_themeOption.int_size2/=10;
        obj_themeOption.int_size3/=10;
        obj_themeOption.int_size4/=10;
        obj_themeOption.int_size5/=10;              
      }
  
      fn_applyThemeStructure(){        
          
          //some code requires themeobjects empty or not
          let obj_theme=obj_project.obj_theme;          
          if(!obj_theme){return;}

          let obj_themeOption=new Object;
  
          let obj_themeItem;        
  
          this.obj_themeBackground=this.fn_getThemeObject("form_blockbackground");
          this.obj_themeMidground=this.fn_getThemeObject("form_blockmidground");
          this.obj_themeForground=this.fn_getThemeObject("form_blockforground");
          this.obj_themeHighlight=this.fn_getThemeObject("form_blockhighlight");          
  
  
          obj_theme.str_backGround=this.obj_themeBackground.fn_getStyleProperty("background");
          obj_theme.str_midGround=this.obj_themeMidground.fn_getStyleProperty("background");
          obj_theme.str_forGround=this.obj_themeForground.fn_getStyleProperty("background");
          obj_theme.str_highLight=this.obj_themeHighlight.fn_getStyleProperty("background");        
          obj_theme.str_color="slate gray";//change according to light or dark analysis
  
          obj_themeOption.bln_applyBorder=false;//user session
          obj_themeOption.str_borderStyle="solid";//user session                        
          obj_themeOption.str_borderSize="small";
          obj_themeOption.str_deviderSize="small";
          obj_themeOption.str_fontSize="medium";
          
          this.fn_calculateFontSize(obj_themeOption);        
          //console.log(obj_themeOption);          
          
          this.obj_themeProject={
              //*//STRUCTURE                
              display:"flex",                                    
              fontSize:"1.0rem",
              display:"flex",                                    
              padding:"1.0em",                                    
              gap:"1.0em",                                    
              fontWeight:"normal",                                    
              cusor:"pointer",                                                
              justifyContent:"center",
              alignItems:"center",                      
              //STRUCTURE                              
              //*/
          
              //*//OPTION
              borderColor:"orange",                    
              color:"yellow",            
              backgroundColor:"rgb(65,65,65)",
  
              borderWidth:"0em",
              borderRadius:"0em",            
              borderStyle:"solid",           
              marginBottom:"0em",            
              //OPTION
              //*/
          }                               
  
          /////////////////////////////////////////
          /////////////////////////////////////////
          obj_themeItem=obj_shared.fn_shallowCopy(obj_project.obj_themeProject);                
          //*//STRUCTURE           
          obj_themeItem.fontSize=obj_themeOption.int_size5+"rem";                
          obj_themeItem.fontWeight="bold";                        
          obj_themeItem.padding="1.0em";                                
          obj_themeItem.width="100%";        
          obj_themeItem.cursor="pointer";                               
          //STRUCTURE   
          //*/
  
          //*//OPTION                
          obj_themeItem.borderColor=obj_theme.str_forGround;
          obj_themeItem.color=obj_theme.str_forGround;
          obj_themeItem.backgroundColor=obj_theme.str_midGround;        
  
          obj_themeItem.bln_applyBorder=false;                
          obj_themeItem.bln_applyDevider=true;
          obj_project.fn_applyThemeOption(obj_themeItem);        
          //OPTION
          //*/                
          obj_project.obj_themeMenuButton=obj_themeItem;        
          //MENUBUTTON
          /////////////////////////////////////////
          /////////////////////////////////////////
  
          /////////////////////////////////////////
          /////////////////////////////////////////
          //CHILDMENU        
          obj_themeItem=obj_shared.fn_shallowCopy(obj_project.obj_themeMenuButton);                
          //*//STRUCTURE           
          obj_themeItem.fontSize=obj_themeOption.int_size4+"rem";                
          obj_themeItem.padding="1.0em";                 
          //STRUCTURE   
          //*/
  
          //*//OPTION                
          obj_themeItem.bln_applyBorder=false;
          obj_themeItem.bln_applyDevider=true;
          obj_project.fn_applyThemeOption(obj_themeItem);
          //OPTION
          //*/                
          obj_project.obj_themeChildMenu=obj_themeItem;        
          //CHILDMENU             
          /////////////////////////////////////////
          /////////////////////////////////////////
          
          /////////////////////////////////////////
          /////////////////////////////////////////
          //DYNAMICMENU
          //obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeChildMenu);                
          //obj_themeItem.fontSize=obj_themeOption.int_size3+"rem";                
          //*//STRUCTURE                   
          //STRUCTURE   
          //*/
  
          //*//OPTION        
          //this.fn_applyThemeOption(obj_themeItem);        
          //OPTION
          //*/                
          //this.obj_themeDynamicMenu=obj_themeItem;        
          //DYNAMICMENU
          /////////////////////////////////////////
          /////////////////////////////////////////
  
          /////////////////////////////////////////
          /////////////////////////////////////////
          //FORMBUTTON        
          obj_themeItem=obj_shared.fn_shallowCopy(obj_project.obj_themeProject);                
          //*//STRUCTURE           
          obj_themeItem.fontSize=obj_themeOption.int_size2+"rem";                
          obj_themeItem.fontWeight="bold";  
          obj_themeItem.cursor="pointer";                              
          //STRUCTURE   
          //*/
  
          //*//OPTION
          obj_themeItem.borderColor=obj_theme.str_midGround;
          obj_themeItem.color=obj_theme.str_midGround;        
          obj_themeItem.backgroundColor=obj_theme.str_forGround;        
  
          obj_themeItem.bln_applyBorder=this.bln_applyBorder;//user session                                
          obj_project.fn_applyThemeOption(obj_themeItem);
          //OPTION
          //*/                
          obj_project.obj_themeFormButton=obj_themeItem;        
          //FORMBUTTON
          /////////////////////////////////////////
          /////////////////////////////////////////
  
          /////////////////////////////////////////
          /////////////////////////////////////////
          //FORMINPUT        
          obj_themeItem=obj_shared.fn_shallowCopy(obj_project.obj_themeProject);                
          //*//STRUCTURE                             
          obj_themeItem.fontSize=obj_themeOption.int_size1+"rem";                
          obj_themeItem.padding="1.0em";                        
          obj_themeItem.fontWeight="normal";                        
          obj_themeItem.maxHeight="500px";                                          
          obj_themeItem.overflow="Auto";                                          
          obj_themeItem.wordBreak="normal";                                          
          //STRUCTURE   
          //*/
          
          //*//OPTION
          obj_themeItem.borderColor=obj_theme.str_backGround;
          obj_themeItem.color=obj_theme.str_color;
          obj_themeItem.backgroundColor=obj_theme.str_forGround;                          
          
          obj_themeItem.bln_applyBorder=this.bln_applyBorder;//user session                                
          obj_project.fn_applyThemeOption(obj_themeItem);
          //OPTION
  
          //*/                
          obj_project.obj_themeFormInput=obj_themeItem;        
          //FORMINPUT
          /////////////////////////////////////////
          /////////////////////////////////////////
      }
  
      fn_applyThemeOption(obj_themeItem){
        
        //BORDER      
        let int_borderSize=0.0;                        
        if(obj_themeItem.bln_applyBorder){
          switch(this.str_borderSize){                    
            case "small":
              int_borderSize=1.0;                    
              break;
            case "medium":
              int_borderSize=1.0;                    
              break;
            case "large":
              int_borderSize=1.5;                    
              break;
            default:
              int_borderSize=0.5;                    
          }        
        }
        const int_borderRadius=(2*int_borderSize);
        obj_themeItem.borderWidth=int_borderSize + "em";              
        obj_themeItem.borderRadius=int_borderRadius + "em";                          
        //BORDER
        
        //DEVIDER
        let int_deviderSize=0.0;                        
        if(obj_themeItem.bln_applyDevider){        
  
          switch(this.str_deviderSize){                  
            case "medium":
              int_deviderSize=0.5;                        
              break;
            case "large":
              int_deviderSize=1;                        
              break;
            default:
              int_deviderSize=0.1;                        
          }        
        }
        obj_themeItem.marginBottom=int_deviderSize + "em";              
        //DEVIDER
      }
    

    fn_setEvent(e, obj_itemEvent){                        
        if(!this.obj_itemEvent){                  
            this.obj_nativeEvent=e;
            this.obj_itemEvent=obj_itemEvent;          
        }  
    }        
    fn_unsetEvent(){              
        this.obj_nativeEvent=false;
        this.obj_itemEvent=false;  
    }       
    fn_calmEvent(e){        
        if(!e){return;}
        e.stopPropagation();                                                           
    }
    fn_forgetEvent(e){
        this.fn_unsetEvent();
        if(!e){return;}
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();                                                           
    }
    fn_debugEvent(){

        //console.log("this.obj_nativeEvent: " + this.obj_nativeEvent);
        //console.log("this.obj_itemEvent: " + this.obj_itemEvent);
        if(this.obj_itemEvent){
            this.obj_itemEvent.fn_debug("debug event");
        }
    }
    
    
    fn_initialize(obj_ini){        
        super.fn_initialize(obj_ini);
        
        //START INITIALIZE DESIGN        
        if(this.obj_design.int_idRecord==undefined){this.obj_design.int_idRecord=0;}        

        if(this.obj_design.str_name==undefined){this.obj_design.str_name="My Project";}       

        
        //if(this.obj_domStyle.display==undefined){this.obj_domStyle.display="block";}              

        
        
        if(this.obj_design.bln_isContainer==undefined){this.obj_design.bln_isContainer=true;}       
        
        
        
        this.fn_loadBootVariables();
        //END INITIALIZE DESIGN

        //START INITIALIZE DOM PROPERTY                
        //END INITIALIZE DOM PROPERTY

        //START INITIALIZE DOM ATTRIBUTE
        //END INITIALIZE DOM ATTRIBUTE
        
        //START INITIALIZE STYLE
        //END INITIALIZE STYLE

        //START INITIALIZE THEME           
        //END INITIALIZE THEME 
        
        this.user_agent=obj_shared.fn_detectBrowser()
        this.bln_isMobile=obj_shared.fn_isMobile()
        //console.log("this.user_agent: " + this.user_agent)
    }   
    

    fn_setParentComponent(obj_parent){    
        console.log("PROJECT dont set Parent Component");
    }       
    

    fn_loadBootVariables(){

        let str_mode=obj_shared.fn_getMode();

        switch(str_mode){            
            case "edit":
                this.obj_design.int_modeExecute=this.obj_holder.int_modeEdit;                                                                
                break;         
            case "boot":
                this.obj_design.int_modeExecute=this.obj_holder.int_modeBoot;                                                                
                break;         
            default:
                this.obj_design.int_modeExecute=this.obj_holder.int_modeRuntime;                                
        }                        
        
        let int_idRecord;        
        int_idRecord=this.obj_design.int_idRecord;
        this.obj_design.int_idRecord=parseInt(int_idRecord);        

    }
    
    fn_createSelf(){        
        this.fn_setTagOption();
        super.fn_createSelf();        
    }                
    
     fn_viewInBrowser(){
        let o=window.open("../../myProject/", "xDesignViewInBrowser");
        if(o){o.focus()}
    }          
    
     //END Project Instance Functions

     fn_setTagOption(){

        /*COMPONENT TAG    
        //Following options for Project Wrapper:            
        1. Use No Tag
        2. Creating A Tag                 
        2. Use Exisitng Tag and Allow/DisAllow manipulation of this e.g color, padding etc
        //*/
        
        //Create own publish tag 
        //If used, publish does create its own tag , which will prevent any ammendments being made to its  parent HTML        
        //POSITION SELF
        this.dom_obj = document.createElement(this.obj_design.str_tag);                          
        //APPLIES ONLY TO PUBLISH AS IT IS THE ONLY ITEM THAT IS NOT INSERTED VIA ADDITEM
        //now position element in parent Dom                
        let dom_element=document.getElementById(idXdesignTarget);
        if(!dom_element){dom_element=document.body;}        
        obj_shared.fn_removeAllChildNodes(dom_element);
        dom_element.append(this.dom_obj);             
        //POSITION SELF
    }            

  }//END OF CLS

  /*START DESIGN BOOT VARIABLE//*/
obj_boot.obj_design.int_idRecord={int_idRecord}; 
/*END DESIGN BOOT VARIABLE//*/
//END Project.js

