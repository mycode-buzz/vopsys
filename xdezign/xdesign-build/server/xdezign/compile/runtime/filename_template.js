
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

    fn_applyThemeStructure(){
        let obj_theme, obj_themeItem;
        obj_theme=this.obj_theme;
        //some code requires themeobjects empty or not

        if(!obj_theme){
            return;
        }

        this.obj_themeBackground=this.fn_getThemeObject("form_blockbackground");
        this.obj_themeMidground=this.fn_getThemeObject("form_blockmidground");
        this.obj_themeForground=this.fn_getThemeObject("form_blockforground");
        this.obj_themeHighlight=this.fn_getThemeObject("form_blockhighlight");          


        obj_theme.str_backGround=this.obj_themeBackground.fn_getStyleProperty("background");
        obj_theme.str_midGround=this.obj_themeMidground.fn_getStyleProperty("background");
        obj_theme.str_forGround=this.obj_themeForground.fn_getStyleProperty("background");
        obj_theme.str_highLight=this.obj_themeHighlight.fn_getStyleProperty("background");

        /*        
        //*/
        
        /*
        //options reuqired for             
        borderColor:relevant themecolor
        color:relevant themecolor
        backgroundColor:relevant themecolor        

        borderStyle:"solid",dotted,dashed etc
        borderWidth:on,off
        marginBottom:large/small or a em size, not zero        
        //*/
        
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
            color:"white",            
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
        //MENUBUTTON
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeProject);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.3rem";                
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
        obj_themeItem.borderStyle="solid";
        obj_themeItem.bln_border=false;
        obj_themeItem.int_borderWidth=0;
        obj_themeItem.bln_margin=false;
        obj_themeItem.int_marginEnd=0;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeMenuButton=obj_themeItem;        
        //MENUBUTTON
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //CHILDMENU
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeMenuButton);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.2rem";
        obj_themeItem.padding="1.0em";                 
        //STRUCTURE   
        //*/

        //*//OPTION        
        obj_themeItem.bln_margin=false;
        obj_themeItem.int_marginEnd=0.5;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeChildMenu=obj_themeItem;        
        //CHILDMENU             
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //DYNAMICMENU
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeChildMenu);                
        //*//STRUCTURE                   
        //STRUCTURE   
        //*/

        //*//OPTION        
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeDynamicMenu=obj_themeItem;        
        //DYNAMICMENU
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //FORMBUTTON
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeProject);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.1rem";                        
        obj_themeItem.fontWeight="bold";  
        obj_themeItem.cursor="pointer";                              
        //STRUCTURE   
        //*/

        //*//OPTION
        obj_themeItem.borderColor=obj_theme.str_midGround;
        obj_themeItem.color=obj_theme.str_midGround;        
        obj_themeItem.backgroundColor=obj_theme.str_forGround;        
        obj_themeItem.borderStyle="solid";        
        obj_themeItem.bln_border=false;
        obj_themeItem.int_borderWidth=0.5;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeFormButton=obj_themeItem;        
        //FORMBUTTON
        /////////////////////////////////////////
        /////////////////////////////////////////

        /////////////////////////////////////////
        /////////////////////////////////////////
        //FORMINPUT
        obj_themeItem=obj_shared.fn_shallowCopy(this.obj_themeProject);                
        //*//STRUCTURE           
        obj_themeItem.fontSize="1.1rem";                        
        obj_themeItem.fontWeight="normal";                        
        //STRUCTURE   
        //*/

        //*//OPTION
        obj_themeItem.borderColor=obj_theme.str_midGround;
        obj_themeItem.color="dark gray";        
        obj_themeItem.backgroundColor=obj_theme.str_forGround;        
        obj_themeItem.borderStyle="solid";
        obj_themeItem.bln_border=false;
        obj_themeItem.int_borderWidth=0.5;
        this.fn_applyThemeOption(obj_themeItem);        
        //OPTION
        //*/                
        this.obj_themeFormInput=obj_themeItem;        
        //FORMINPUT
        /////////////////////////////////////////
        /////////////////////////////////////////
        
        
    }

    fn_applyThemeOption(obj_themeItem){

        /*
        obj_themeItem.borderColor;
        obj_themeItem.color=;        
        obj_themeItem.backgroundColor;        
        obj_themeItem.borderStyle;
        obj_themeItem.bln_border;
        obj_themeItem.int_borderWidth;
        obj_themeItem.bln_margin;
        obj_themeItem.int_marginEnd;
        //*/
      
      let int_borderWidth=0;            
      if(obj_themeItem.bln_border){
        int_borderWidth=0.5;            
        if(obj_themeItem.int_borderWidth){          
          int_borderWidth=obj_themeItem.int_borderWidth;                
        }
      }
      const int_borderRadius=(2*int_borderWidth);
      obj_themeItem.borderWidth=int_borderWidth + "em";      
      obj_themeItem.borderRadius=int_borderRadius + "em";                    

      let int_marginEnd=0.1;              
      if(obj_themeItem.bln_margin){
        int_marginEnd=0.5;                
        if(obj_themeItem.int_marginEnd){
          int_marginEnd=obj_themeItem.int_marginEnd;          
        }
      }
      obj_themeItem.marginBottom=int_marginEnd + "em";            
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

