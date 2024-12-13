
//XSTART component/xapp_theme
class xapp_theme extends component{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                           
    
    if(this===obj_project){
      this.fn_setDisplay(true);
    }
    else{
      this.fn_setDisplay(false);
    }
  }  
  fn_onLoad(){
    super.fn_onLoad();                                        
  
    //some code requires themeobjects empty or not
    if(obj_project.fn_isTheme()){
      return;
    }
    
    this.bln_debug=true;  
    
    this.fn_setUserTheme();
    this.fn_setThemeItem();

    if(this.bln_debug){
      this.fn_logThemeSummary();    
    }
  }
  //START THEME HANDLER
  
  fn_setUserTheme(){    

    if(obj_project.fn_isTheme()){//dont run when editing theme
      return;
    }
    this.obj_base=new Object;
    const obj_base=this.obj_base;

    //https://convertingcolors.com/hex-color-A52A2A.html?search=brown
    //https://coolors.co/palettes/trending
    //https://imagecolorpicker.com/
    //coolors affiliate link https://coolors.co/?ref=6754517d5fa59e000b79f378   

    /////////////////////////////////////////
    /////////////////////////////////////////
    //THEME      
    //STRUCTURE             
    obj_base.display="flex";        
    obj_base.padding="1em";        
    obj_base.gap="1em";    
    //STRUCTURE    
    
    //OPTION                      
    obj_base.str_borderStyle="solid";//user session                        
    obj_base.str_borderSize="none";                 
    obj_base.str_borderRadiusSize="medium";//set to none for square
    obj_base.str_deviderSize="none";      
    obj_base.str_fontSize="medium";                            
    //OPTION                  
    //THEME
    /////////////////////////////////////////
    /////////////////////////////////////////        

    //Load Border and Radius Option
    obj_base.bln_borderDisplay=false;
    obj_base.bln_borderRadiusDisplay=false;      
    this.fn_setBorderDisplay();      
    this.fn_setBorderRadiusDisplay();
    obj_base.bln_borderRowz=false;  
    obj_base.bln_borderRadiusRowz=false;  
    obj_base.bln_borderButton=true;
    obj_base.bln_borderRadiusButton=true;
    obj_base.bln_borderSearch=true;  
    obj_base.bln_borderRadiusSearch=true;  
    obj_base.bln_borderFieldset=true;
    obj_base.bln_borderRadiusFieldset=true;
    obj_base.bln_borderLegend=true;
    obj_base.bln_borderRadiusLegend=true;
    obj_base.bln_borderLabel=true;
    obj_base.bln_borderRadiusLabel=true;
    obj_base.bln_borderInput=true;
    obj_base.bln_borderRadiusInput=true;
    //Load Border and Radius Option

    obj_base.str_highLightFill="orange";     

    //get darker
    //opaque
    //high contrast
    //2 base,border,form
    let str_gradientUser=`{
      "str_name":"steelblue",
      "bln_transparent":false,  
      "bln_lighten":false,
      "bln_contrast":true,
      "int_fillSpread":2,
      "bln_matchFillSearch":true,
      "bln_matchFillTextInput":false
    }`;  

    this.bln_saved=true;    
    if(!this.bln_saved){              
      /////////////////////MOVE TO EDIT SCREEN    
      const obj_gradientUser={
        str_name:"green",      
        bln_transparent:obj_shared.fn_getRandomBool(),             
        bln_lighten:obj_shared.fn_getRandomBool(),      
        bln_contrast:obj_shared.fn_getRandomBool(),      
        int_fillSpread:obj_shared.fn_getRandomInt(1, 6),
        bln_matchFillSearch:true,
        bln_matchFillTextInput:false
      };
      str_gradientUser=JSON.stringify(obj_gradientUser);    
      //SAVE TO DB
      /////////////////////MOVE TO EDIT SCREEN    
    }  

    //CREATE GRADIENT  
    const obj_gradientUser=JSON.parse(str_gradientUser);
    const obj_gradient=this.fn_getColorGradient(obj_gradientUser);//generate array of hsl colors            
    obj_base.obj_gradient=obj_gradient;
    //CREATE GRADIENT
    

    obj_gradient.str_fillTextUI="white";                                
    obj_gradient.str_fillTextInput="black";
    obj_gradient.str_fillInput="white";        
    obj_gradient.str_fillSearch="white";          
    
    this.fn_setFillPalette();//we can choose to lighten, or darken based on wether the main color is light or dark
    this.fn_setFillArea();//we can choose which areas are lighter or darker  
    this.fn_setFillOption();//we can choose which areas are lighter or darker   
    this.fn_calculateFontSize();                    
  }
  fn_getColorGradient(obj_gradientUser){  

    let obj_gradient;    
    obj_shared.fn_setColorList();    
    obj_shared.fn_groupColorList();
    let str_name=obj_gradientUser.str_name;
    //str_name=obj_shared.fn_getRandomColorName();
    let obj_color=obj_shared.fn_getColorNameValue(str_name);        
    if(!obj_color.str_value){
      obj_color=obj_shared.fn_getColorNameValue("gray");      
    }
    obj_gradient=obj_shared.fn_getGradientObjectFromArray(obj_color.str_value, obj_color.str_name);          
    obj_gradient.int_alpha=1;
    if(obj_gradientUser.bln_transparent){obj_gradient.int_alpha=0.2;}
    obj_gradient=obj_shared.fn_getGradientObjectFromGradient(obj_gradient, obj_color.str_name);                  
    obj_gradient.str_fill=obj_gradient.str_hsla;//v important, this is when it is defined
    obj_gradient.bln_transparent=obj_gradientUser.bln_transparent;
    obj_gradient.bln_lighten=obj_gradientUser.bln_lighten;  
    obj_gradient.bln_contrast=obj_gradientUser.bln_contrast;
    obj_gradient.int_fillSpread=obj_gradientUser.int_fillSpread;
    obj_gradient.bln_matchFillSearch=obj_gradientUser.bln_matchFillSearch;
    obj_gradient.bln_matchFillTextInput=obj_gradientUser.bln_matchFillTextInput;
    return obj_gradient;
  }

  
  fn_setFillPalette(){  

    const obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;

    this.fn_boundFillLighten();

    let obj_shade, obj_contrast;
    let int_percentLight, int_percentContrast;
    int_percentLight=10;
    int_percentContrast=5;  

    int_percentLight=10;
    int_percentContrast=5;  
    if(obj_gradient.bln_contrast){
      int_percentLight=15;
      int_percentContrast=10;      
    }  
    let int_totalLight=(int_percentLight+(int_percentLight+int_percentContrast));
    obj_base.int_percentLight=int_percentLight;
    obj_base.int_percentContrast=int_percentContrast;
    obj_base.int_totalLight=int_totalLight;

    obj_base.int_min=0;
    obj_base.int_max=100;
    if(obj_gradient.bln_lighten){//due to getting lighter    
      obj_base.int_min=0;
      obj_base.int_max=(100-int_totalLight);//due to getting darker
    }
    else{    
      obj_base.int_min=0+int_totalLight;
      obj_base.int_max=100;//due to getting darker
    }
    obj_base.bln_filterPass=this.fn_filterGradientLight();        
    if(!obj_base.bln_filterPass){
      obj_gradient.str_fillBase="hsla(0, 0%, 50%, 1)";
      obj_gradient.str_fillForm="hsla(0, 0%, 65%, 1)";
      obj_gradient.str_fillBorder="hsla(0, 0%, 85%, 1)";  
      return;
    }

    obj_contrast={    
      int_percentHue:0,
      int_percentSaturation:0,
      int_percentLight:int_percentLight,
    }  

    //FILL 1
    obj_shade=new Object;    
    obj_shade.str_hsla=obj_gradient.str_hsla;//use fill1 as starting point  
    obj_shade.bln_value=obj_gradient.bln_lighten;  
    obj_shared.fn_assignProperty(obj_shade, obj_contrast);    
    obj_gradient.str_fill_1=obj_shared.fn_getShade(obj_shade);      
    //FILL 1            

    //FILL 2
    obj_contrast.int_percentLight=(int_percentLight+int_percentContrast);//10 percent more than fill 1    
    obj_shade.str_hsla=obj_gradient.str_hsla;//use fill1 as starting point
    obj_shared.fn_assignProperty(obj_shade, obj_contrast);    
    
    obj_gradient.str_fill_2=obj_shared.fn_getShade(obj_shade);                
    //FILL 1

    obj_base.bln_filterPass=true;  
  }

  fn_filterGradientLight(){        

    let obj_base=this.obj_base;
    
    let int_value=obj_base.obj_gradient.int_light;  
    let bln_value=obj_shared.fn_filterValue(int_value, obj_base.int_min,obj_base.int_max);         
    if(!bln_value){
      console.log("failed int_value: " + int_value);
      console.log("failed obj_base.int_min: " + obj_base.int_min);
      console.log("failed obj_base.int_max: " + obj_base.int_max);
    }
    return bln_value;
  }
  fn_boundFillLighten(){
    let obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;
    
    if(obj_gradient.int_light>=60){  
      obj_gradient.bln_lighten=false;
    }
    else if(obj_gradient.int_light<=40){  
      obj_gradient.bln_lighten=true;
    }
  }


  fn_setFillArea(){

    let obj_base=this.obj_base;

    let str_fillBase, str_fillForm, str_fillBorder;  

    const obj_gradient=obj_base.obj_gradient;
    
    const str_fill=obj_gradient.str_fill;
    const str_fill_1=obj_gradient.str_fill_1;
    const str_fill_2=obj_gradient.str_fill_2;    
    
    
    switch (obj_gradient.int_fillSpread) {
      case 1:
          obj_gradient.str_fillSpread="base-form-border";
          str_fillBase = str_fill;
          str_fillForm = str_fill_1;
          str_fillBorder = str_fill_2;
          break;
      case 2:
          obj_gradient.str_fillSpread="base-border-form";
          str_fillBase = str_fill;
          str_fillForm = str_fill_2;
          str_fillBorder = str_fill_1;
          break;
      case 3:
          obj_gradient.str_fillSpread="form-base-border";
          str_fillBase = str_fill_1;
          str_fillForm = str_fill;
          str_fillBorder = str_fill_2;
          break;
      case 4:
          obj_gradient.str_fillSpread="border-base-form";
          str_fillBase = str_fill_1;
          str_fillForm = str_fill_2;
          str_fillBorder = str_fill;
          break;
      case 5:
          obj_gradient.str_fillSpread="form-border-base";
          str_fillBase = str_fill_2;
          str_fillForm = str_fill;
          str_fillBorder = str_fill_1;
          break;
      case 6:
          obj_gradient.str_fillSpread="border-form-base";
          str_fillBase = str_fill_2;
          str_fillForm = str_fill_1;
          str_fillBorder = str_fill;
          break;
      default:
        obj_gradient.str_fillSpread="invalid-int_fillSpread[" + obj_gradient.int_fillSpread + "]";
          // Handle invalid input or other cases
          str_fillBase = str_fill;
          str_fillForm = str_fill_1;
          str_fillBorder = str_fill_2;
          break;
  }  
    
    obj_gradient.str_fillBase=str_fillBase;
    obj_gradient.str_fillForm=str_fillForm;
    obj_gradient.str_fillBorder=str_fillBorder;  
  }

  fn_setFillOption(){

    const obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;

    if(obj_gradient.bln_matchFillSearch){
      obj_gradient.str_fillSearch=obj_gradient.str_fillForm;
    }

    obj_gradient.bln_matchFillInput=false;
    if(obj_gradient.bln_matchFillInput){
      obj_gradient.str_fillInput=obj_gradient.str_fillForm;  
    }

    /////SET TEXT COLOR  
    if(obj_gradient.bln_matchFillTextInput){
      obj_gradient.str_fillTextInput=obj_gradient.str_fillForm;  
    }
    if(obj_gradient.int_light>80){      
      let obj_hslaText;
      obj_hslaText=obj_shared.fn_getGradientObjectFromHSLA(obj_gradient.str_fillBorder, "New Text Color");
      obj_hslaText.int_alpha=1;
      obj_hslaText=obj_shared.fn_getGradientObjectFromGradient(obj_hslaText, "New Text Color");
      obj_gradient.str_fillTextUI=obj_hslaText.str_hsla;        
      obj_gradient.str_fillTextInput="Dark Gray";              
      //console.log("caught white text: " + obj_gradient.str_fillTextInput);
    }
    
    /////SET TEXT COLOR

    /////SET BODY BACKGROUND COLOR
    document.body.style.backgroundColor="rgb(43, 44, 52)";        
    document.body.style.backgroundColor=obj_gradient.str_fillBorder;        
    if(obj_gradient.bln_transparent){    
      document.body.style.backgroundColor=obj_gradient.str_fillBorder;              
    }
    /////SET BODY BACKGROUND COLOR

  }
  
  fn_setThemeItem(){
    const obj_base=this.obj_base;            
    const obj_gradient=obj_base.obj_gradient;    
    
    let obj_themeItem; 
    this.arr_theme=[];
    /////////////////////////////////////////
    /////////////////////////////////////////
    //XAPPACCORDION
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                             
    obj_themeItem.padding="0em";
    obj_themeItem.display="block";
    //STRUCTURE     
    //OPTION        
    obj_themeItem.bln_border=false;         
    obj_themeItem.backgroundColor=obj_gradient.str_fillBase;        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION            
    this.obj_xappAccordion=obj_themeItem;                      
    //XAPPACCORDION
    /////////////////////////////////////////
    /////////////////////////////////////////        
    
    
    /////////////////////////////////////////
    /////////////////////////////////////////
    //MENUBUTTON
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                           
    obj_themeItem.fontWeight="bold";                                
    obj_themeItem.width="100%";        
    obj_themeItem.cursor="pointer";                                       
    obj_themeItem.justifyContent="center";
    obj_themeItem.alignItems="center";        
    //STRUCTURE
    //OPTION       
    obj_themeItem.str_label="form_rowz";                    
    obj_themeItem.bln_border=obj_base.bln_borderRowz;              
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusRowz;                          
    obj_themeItem.borderColor=obj_gradient.str_fillBorder;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillForm;                
    
    obj_themeItem.color=obj_gradient.str_fillTextUI;
    obj_themeItem.str_deviderSize="small";      
    this.fn_applyThemeOption(obj_themeItem);  
    //OPTION                        
    this.obj_rowz=obj_themeItem;
    //MENUBUTTON
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //CHILDMENU        
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_rowz);                
    //STRUCTURE                                   
    //STRUCTURE
    //OPTION                
    obj_themeItem.str_label="form_rowzchild";                        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                                
    this.obj_rowzChild=obj_themeItem;
    //CHILDMENU             
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //DYNAMICMENU
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_rowzChild);                        
    //STRUCTURE                                   
    //STRUCTURE
    //OPTION                
    obj_themeItem.str_label="form_rowzdynamic";                        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                        
    this.obj_rowzDynamic=obj_themeItem;
    //DYNAMICMENU
    /////////////////////////////////////////
    /////////////////////////////////////////          
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMBUTTON        
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                           
    //STRUCTURE           
    //OPTION                                  
    obj_themeItem.str_label="form_button";                                
    obj_themeItem.bln_border=obj_base.bln_borderButton;    
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusButton;              
    obj_themeItem.borderColor=obj_gradient.str_fillBorder;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillForm;                
    obj_themeItem.color=obj_gradient.str_fillTextUI;        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                
    this.obj_formButton=obj_themeItem;        
    //FORMBUTTON
    /////////////////////////////////////////
    ///////////////////////////////////////// 
    
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMFIELDSET        
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                     
    obj_themeItem.str_label="form_fieldset";              
    obj_themeItem.bln_border=obj_base.bln_borderFieldset;      
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusFieldset;          
    obj_themeItem.bln_borderExpand=true;
    obj_themeItem.borderColor=obj_gradient.str_fillBorder;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillForm;                
    obj_themeItem.color=obj_gradient.str_fillTextUI;
    this.fn_applyThemeOption(obj_themeItem);
    obj_themeItem.bln_borderExpand=false;
    //OPTION    
    this.obj_formFieldset=obj_themeItem;        
    //FORMFIELDSET        
    /////////////////////////////////////////
    /////////////////////////////////////////

    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMLEGEND
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formFieldset);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                          
    obj_themeItem.str_label="form_container";                                
    //obj_themeItem.fontWeight="bold";
    obj_themeItem.bln_border=false;      
    obj_themeItem.bln_borderRadius=false;           
    obj_themeItem.bln_border=false;      
    obj_themeItem.backgroundColor="transparent";                
    obj_themeItem.padding="0em";                
    this.fn_applyThemeOption(obj_themeItem);
    
    //OPTION    
    this.obj_formContainer=obj_themeItem;        
    //FORMLEGEND
    /////////////////////////////////////////
    /////////////////////////////////////////
    
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMLEGEND
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formFieldset);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                          
    obj_themeItem.str_label="form_legend";                                
    //obj_themeItem.fontWeight="bold";
    obj_themeItem.bln_border=obj_base.bln_borderLegend;      
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusLegend;           
    this.fn_applyThemeOption(obj_themeItem);
    
    //OPTION    
    this.obj_formLegend=obj_themeItem;        
    //FORMLEGEND
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMLABEL
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formLegend);                
    //STRUCTURE                             
    //STRUCTURE   
    //OPTION                
    obj_themeItem.str_label="form_label";                                
    //obj_themeItem.fontWeight="normal";
    obj_themeItem.bln_border=obj_base.bln_borderLabel;      
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusLabel;              
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION      
    this.obj_formLabel=obj_themeItem;              
    //FORMLABEL
    /////////////////////////////////////////
    /////////////////////////////////////////
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMINPUT        
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formLabel);
    //STRUCTURE                                           
    obj_themeItem.fontWeight="normal";                        
    obj_themeItem.maxHeight="500px";                                          
    obj_themeItem.overflow="Auto";                                          
    obj_themeItem.wordBreak="normal";                      
    //STRUCTURE
    //OPTION                      
    obj_themeItem.str_label="form_input";                                
    obj_themeItem.bln_border=obj_base.bln_borderInput;
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusInput;          
    obj_themeItem.backgroundColor=obj_gradient.str_fillInput;                                                                         
    obj_themeItem.color=obj_gradient.str_fillTextInput;          
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                
    this.obj_formInput=obj_themeItem;        
    //FORMINPUT
    /////////////////////////////////////////
    /////////////////////////////////////////      
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMINPUT        
    obj_themeItem=obj_shared.fn_shallowCopy(this.obj_formInput);
    //STRUCTURE                                                             
    obj_themeItem.fontWeight="bold";
    //STRUCTURE
    //OPTION                      
    obj_themeItem.str_label="rowz_search";                                      
    obj_themeItem.bln_border=obj_base.bln_borderSearch;  
    obj_themeItem.bln_borderRadius=obj_base.bln_borderRadiusSearch;  
    obj_themeItem.borderColor=this.obj_formButton.borderColor;    
    obj_themeItem.backgroundColor=obj_gradient.str_fillSearch;
    obj_themeItem.color=obj_gradient.str_fillTextUI;        
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION                
    this.obj_uiInput=obj_themeItem;        
    //FORMINPUT
    /////////////////////////////////////////
    /////////////////////////////////////////  
    
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //FORMHARDRULE
    obj_themeItem=obj_shared.fn_shallowCopy(obj_base);                
    //STRUCTURE                             
    obj_themeItem.padding="0.5em";                  
    //STRUCTURE           
    //OPTION                
    obj_themeItem.str_label="form_hardrule";                                      
    obj_themeItem.bln_border=this.obj_rowz.bln_border;  
    obj_themeItem.bln_borderRadius=this.obj_rowz.bln_borderRadius;  
    obj_themeItem.borderColor=this.obj_rowz.borderColor;       
    obj_themeItem.backgroundColor=this.obj_rowz.backgroundColor;
    obj_themeItem.margin="0em";
    this.fn_applyThemeOption(obj_themeItem);
    //OPTION            
    this.obj_formHardRule=obj_themeItem;        
    //FORMHARDRULE
    /////////////////////////////////////////
    /////////////////////////////////////////  
  
    /////////////////////////////////////////
    /////////////////////////////////////////
    //*
    //THEMEBACKGROUND      
    obj_themeItem=this.fn_getComponent("form_blockbackground");                          
    obj_themeItem.fn_applyStyle(this.obj_xappAccordion);
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockBackground=obj_themeItem;      
    //THEMEBACKGROUND
    //THEMEMIDGROUND
    obj_themeItem=this.fn_getComponent("form_blockmidground");                      
    obj_themeItem.fn_applyStyle(this.obj_formFieldset);  
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockMidground=obj_themeItem;                
    //THEMEMIDGROUND
    //THEMEFORGROUND
    obj_themeItem=this.fn_getComponent("form_blockforground");                      
    obj_themeItem.fn_applyStyle(this.obj_formFieldset);
    obj_themeItem.backgroundColor=obj_themeItem.borderColor;  
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockForground=obj_themeItem;                
    //THEMEFORGROUND
    //THEMEFORGROUND
    obj_themeItem=this.fn_getComponent("form_blockhighlight");                      
    obj_themeItem.fn_applyStyle(this.obj_formFieldset);
    obj_themeItem.backgroundColor="orange";  
    obj_themeItem.fn_setDisplay(false);    
    this.obj_blockHighlight=obj_themeItem;    
    //*/
    //THEMEFORGROUND
    /////////////////////////////////////////
    /////////////////////////////////////////     
    
    this.fn_stripStyle();
  }
  
  fn_stripStyle() {    
    
    this.arr_theme.forEach(obj => {      
      for (const key in obj) {
        if (key.includes('_')) {      
          delete obj[key];
        } 
      }
    });
    
  }
  
  
  fn_applyThemeOption(obj_themeItem){
  this.arr_theme.push(obj_themeItem);
  this.fn_applyThemeFont(obj_themeItem);
  this.fn_applyThemeBorder(obj_themeItem);
  this.fn_applyThemeDevider(obj_themeItem);
  }
  
  fn_applyThemeFont(obj_themeItem){      
  
  //FONTSIZE
  let int_fontSize;  
  switch(obj_themeItem.str_label){                    
    case "form_rowz":
      int_fontSize=obj_themeItem.int_fontSize5;            
      break;          
    case "form_rowzchild":
      int_fontSize=obj_themeItem.int_fontSize4;            
      break;                                
    case "form_rowzdynamic":
      int_fontSize=obj_themeItem.int_fontSize3;
      break;                  
    case "form_button":
      int_fontSize=obj_themeItem.int_fontSize2;
      break;
    case "form_input":
      int_fontSize=obj_themeItem.int_fontSize1;
      break;
    case "standard":
      int_fontSize=obj_themeItem.int_fontSize1;
      break;
    default:
      int_fontSize=obj_themeItem.int_fontSize1;
  }         
  obj_themeItem.fontSize=int_fontSize + "rem";                     
  //FONTSIZE
  }
  
  fn_applyThemeBorder(obj_themeItem){  
  
  //BORDER            
  let str_borderSize="none";      
  if(obj_themeItem.bln_border)      {
    str_borderSize=obj_themeItem.str_borderSize;        
    if(str_borderSize==="none"){
      str_borderSize="medium";
    }        
  }
  let int_borderSize;                                 
  switch(str_borderSize){                    
    case "small":
      int_borderSize=0.3;                    
      break;
    case "medium":
      int_borderSize=0.5;                    
      break;
    case "large":    
      int_borderSize=1.0;                    
      break;  
    default:
      int_borderSize=0;                    
  }         
  
  if(obj_themeItem.bln_borderExpand){
    switch(str_borderSize){                    
      case "small":      
        int_borderSize=0.5;                    
        break;
      case "medium":
        int_borderSize=1.0;                    
        break;
      case "large":    
        int_borderSize=1.5;                    
        break;  
      default:
        int_borderSize=0;                    
    }         
  }
  
  obj_themeItem.borderWidth=int_borderSize + "em";
  //BORDER
  
  //BORDERRADIUS
  let str_borderRadiusSize="none"      
  if(obj_themeItem.bln_borderRadius){
    str_borderRadiusSize=obj_themeItem.str_borderRadiusSize;
    if(!int_borderSize){int_borderSize=0.5;}        
  }            
  let int_borderRadiusSize;
  switch(str_borderRadiusSize){                          
    case "small":
      int_borderRadiusSize=1;                    
      break;
    case "medium":
      int_borderRadiusSize=1.5;                    
      break;
    case "large":
      int_borderRadiusSize=2;                    
      break;
    default:
      int_borderRadiusSize=0;                    
  }                         
  obj_themeItem.borderRadius=(int_borderRadiusSize*int_borderSize) + "em";                                            
  //BORDERRADIUS       
  }
  
  fn_applyThemeDevider(obj_themeItem){ 
  
  //DEVIDER
  let int_deviderSize;                        
  switch(obj_themeItem.str_deviderSize){                                    
    case "small":
      int_deviderSize=0.1;                        
      break;
    case "medium":
      int_deviderSize=0.5;                        
      break;
    case "large":
      int_deviderSize=1;                        
      break;
    default:
      int_deviderSize=0;                        
  }        
  obj_themeItem.marginBottom=int_deviderSize + "rem";                  
  //DEVIDER  
  }
  fn_calculateFontSizeIncrement(obj_base, int_fontSize, int_increment=0){
    obj_base.int_fontSize1=int_fontSize;
    obj_base.int_fontSize2=obj_base.int_fontSize1+int_increment;
    obj_base.int_fontSize3=obj_base.int_fontSize2+int_increment;
    obj_base.int_fontSize4=obj_base.int_fontSize3+int_increment;
    obj_base.int_fontSize5=obj_base.int_fontSize4+int_increment;      
  }

  fn_calculateFontSize(){ 

    let obj_base=this.obj_base;
    
    switch(obj_base.str_fontSize){        
        case "small":        
            this.fn_calculateFontSizeIncrement(obj_base, 10, 0);                            
            obj_base.int_fontSize4=obj_base.int_fontSize3+1;
            obj_base.int_fontSize5=obj_base.int_fontSize4+2;      
            break;
        case "medium":                            
            this.fn_calculateFontSizeIncrement(obj_base, 10, 1);                            
            break;          
        case "large":        
            this.fn_calculateFontSizeIncrement(obj_base, 13, 1);                            
            break;                      
        default:
          this.fn_calculateFontSize("medium");
          return;
    }

    
    obj_base.int_fontSize1=obj_base.int_fontSize1/10;
    obj_base.int_fontSize2=obj_base.int_fontSize2/10;
    obj_base.int_fontSize3=obj_base.int_fontSize3/10;
    obj_base.int_fontSize4=obj_base.int_fontSize4/10;
    obj_base.int_fontSize5=obj_base.int_fontSize5/10;
  }

  fn_setBorderDisplay(){  
    
    let obj_base=this.obj_base;
    let bln_value=obj_base.bln_borderDisplay;
    obj_base.bln_borderRowz=bln_value;
    obj_base.bln_borderButton=bln_value;
    obj_base.bln_borderFieldset=bln_value;
    obj_base.bln_borderLegend=bln_value;    
    obj_base.bln_borderLabel=bln_value;      
    obj_base.bln_borderInput=bln_value;                
    obj_base.bln_borderSearch=bln_value;                    
  }
  fn_setBorderRadiusDisplay(){  
    let obj_base=this.obj_base;
    let bln_value=obj_base.bln_borderRadiusDisplay;
    obj_base.bln_borderRadiusRowz=bln_value;
    obj_base.bln_borderRadiusButton=bln_value;
    obj_base.bln_borderRadiusFieldset=bln_value;
    obj_base.bln_borderRadiusLegend=bln_value;    
    obj_base.bln_borderRadiusLabel=bln_value;      
    obj_base.bln_borderRadiusInput=bln_value;        
    obj_base.bln_borderRadiusSearch=bln_value;        
  }

  fn_addColorItemCustom(obj_current){  

    this.arr_color.push(obj_current);    
    
    let int_hue, int_saturation, int_light, int_alpha;
    let obj_hsla, str_label;  
    int_hue=obj_current.int_hue;
    int_saturation=obj_current.int_saturation;  
    int_alpha=obj_current.int_alpha;

    int_hue=obj_current.int_hue;
    int_saturation=obj_current.int_saturation;
    int_light=60;  
    str_label=obj_current.str_label + "-light"
    obj_hsla=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, "", str_label);    
    this.arr_color.push(obj_hsla);

    int_hue=obj_current.int_hue;
    int_saturation=obj_current.int_saturation;
    int_light=30;  
    str_label=obj_current.str_label + "-dark"
    obj_hsla=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, "", str_label);    
    this.arr_color.push(obj_hsla);
    
    if(obj_current.int_hue>=10){
      int_hue=obj_current.int_hue-10;
      int_saturation=obj_current.int_saturation;
      int_light=30;      
      str_label=obj_current.str_label + "-alt"
      obj_hsla=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, int_alpha, "", str_label);    
      this.arr_color.push(obj_hsla);  
    }
  }



  fn_getColorMapCustom(){

    let obj_base=this.obj_base;

    let obj_hsla;  
    let int_saturation, int_light, int_alpha
    //SET EFFECT  
    obj_base.arr_effect=["mono", "leisure", "bold", "electric"];
    obj_base.str_effect=obj_shared.fn_getRandomArrayElement(obj_base.arr_effect);    
    obj_gradient.str_effect=obj_base.str_effect;

    //SET EFFECT
      switch(obj_base.str_effect){    
        case "mono":
        int_saturation=25;
        break;
        case "leisure":
        int_saturation=50;
        break;
        case "bold":
        int_saturation=60;
        break;    
        case "electric":
          int_saturation=100;
          break;    
        default:
          int_saturation=50;
      }
      
      int_saturation=100;
      int_light=50;
      int_alpha=obj_base.int_alpha;    

      this.arr_color = [];      
      //MAIN COLORS PLUS VARIANT
      obj_hsla=obj_shared.fn_getGradientObject(0, int_saturation, int_light, int_alpha, "", "red");//red
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(30, int_saturation, int_light, int_alpha, "", "Orange");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(60, int_saturation, int_light, int_alpha, "", "Yellow");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(120, int_saturation, int_light, int_alpha, "", "Green");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(180, int_saturation, int_light, int_alpha, "", "Cyan");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(240, int_saturation, int_light, int_alpha, "", "Blue");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(270, int_saturation, int_light, int_alpha, "", "Purple");
      this.fn_addColorItemCustom(obj_hsla);
      obj_hsla=obj_shared.fn_getGradientObject(300, int_saturation, int_light, int_alpha, "", "Magenta");
      this.fn_addColorItemCustom(obj_hsla);
      
      let arr_item=this.arr_color;
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 100, int_alpha, "", "White");
      arr_item.push(obj_hsla);  
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 0, int_alpha, "", "Black");
      arr_item.push(obj_hsla);  
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 50, int_alpha, "", "Gray");
      arr_item.push(obj_hsla); 
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 60, int_alpha, "", "Gray-light");
      arr_item.push(obj_hsla);   
      obj_hsla=obj_shared.fn_getGradientObject(0, 0, 30, int_alpha, "", "Gray-dak");
      arr_item.push(obj_hsla);             
      let int_max=this.arr_color.length-1;
      let int_value=obj_shared.fn_getRandomInt(0, int_max); // Generates a random integer between 1 and 8    
      obj_hsla=this.arr_color[int_value];  
      //obj_hsla=obj_shared.fn_getGradientObject(270, 100, 50, int_alpha, "", "black");  
      return obj_hsla;
  }

  fn_logThemeSummary(){
    const obj_base=this.obj_base;
    const obj_gradient=obj_base.obj_gradient;
    
    let str_fillSpread=obj_gradient.str_fillSpread;  
  
    let str_lighten="darken";
    if(obj_gradient.bln_lighten){
      str_lighten="lighten";
    }
    let str_contrast="lowcontrast";
    if(obj_gradient.bln_lighten){
      str_contrast="highcontrast";
    }
    let str_transparent="opaque";
    if(obj_gradient.bln_transparent){
      str_transparent="transparent";
    }
  
    obj_gradient.str_label+="-"+str_fillSpread+"-"+str_lighten+"-"+str_contrast+"-"+str_transparent;  
  
    console.log("str_label: " + obj_gradient.str_label);
    console.log("obj_gradient.str_fill:" + obj_gradient.str_fill);
    console.log("obj_gradient.bln_transparent: " + obj_gradient.bln_transparent);    
    console.log("obj_gradient.bln_lighten: " + obj_gradient.bln_lighten);
    console.log("obj_gradient.bln_contrast: " + obj_gradient.bln_contrast);
  
    console.log("obj_gradient.int_hue: " + obj_gradient.int_hue);
    console.log("obj_gradient.int_saturation: " + obj_gradient.int_saturation);
    console.log("obj_gradient.int_light: " + obj_gradient.int_light);
    console.log("obj_base.bln_filterPass: " + obj_base.bln_filterPass);
  
    console.log("obj_gradient.int_fillSpread:" + obj_gradient.int_fillSpread);  
    console.log("obj_gradient.str_fill:" + obj_gradient.str_fill);
    console.log("str_fillBase:" + obj_gradient.str_fillBase);
    console.log("str_fillForm:" + obj_gradient.str_fillForm);    
    console.log("str_fillBorder:" + obj_gradient.str_fillBorder);

    //console.log(this);
  }


  
  //END THEME HANDLER
}//END CLS

//END component/xapp_theme