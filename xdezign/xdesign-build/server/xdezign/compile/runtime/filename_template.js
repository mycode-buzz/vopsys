
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

//START THEME HAMDLER  
fn_elementExistsAtIndex(array, index) {
  if (index >= 0 && index < array.length) {
    return array[index] !== undefined;
  } else {
    return false;
  }
  }
fn_calculateFontSizeIncrement(obj_theme, int_fontSize, int_increment=0){
  obj_theme.int_fontSize1=int_fontSize;
  obj_theme.int_fontSize2=obj_theme.int_fontSize1+int_increment;
  obj_theme.int_fontSize3=obj_theme.int_fontSize2+int_increment;
  obj_theme.int_fontSize4=obj_theme.int_fontSize3+int_increment;
  obj_theme.int_fontSize5=obj_theme.int_fontSize4+int_increment;      
}

fn_calculateFontSize(obj_theme){
  
  let int_fontSize, int_fontSize1, int_fontSize2, int_fontSize3, int_fontSize4, int_fontSize5;

  switch(obj_theme.str_fontSize){        
      case "small":
        //if(this.bln_isMobile){this.fn_calculateFontSize("medium");return;}               
          this.fn_calculateFontSizeIncrement(obj_theme, 10, 0);                            
          obj_theme.int_fontSize4=obj_theme.int_fontSize3+1;
          obj_theme.int_fontSize5=obj_theme.int_fontSize4+2;      
          break;
      case "medium":                            
          this.fn_calculateFontSizeIncrement(obj_theme, 10, 1);                            
          break;          
      case "large":
        //if(this.bln_isMobile){this.fn_calculateFontSize("medium");return;}               
          this.fn_calculateFontSizeIncrement(obj_theme, 13, 1);                            
          break;                      
      default:
        this.fn_calculateFontSize("medium");
        return;
  }

  
  obj_theme.int_fontSize1=obj_theme.int_fontSize1/10;
  obj_theme.int_fontSize2=obj_theme.int_fontSize2/10;
  obj_theme.int_fontSize3=obj_theme.int_fontSize3/10;
  obj_theme.int_fontSize4=obj_theme.int_fontSize4/10;
  obj_theme.int_fontSize5=obj_theme.int_fontSize5/10;
}

fn_setBorderDisplay(obj_theme){  
let bln_value=obj_theme.bln_borderDisplay;
obj_theme.bln_borderRowz=bln_value;
obj_theme.bln_borderButton=bln_value;
obj_theme.bln_borderFieldset=bln_value;
obj_theme.bln_borderLegend=bln_value;    
obj_theme.bln_borderLabel=bln_value;      
obj_theme.bln_borderInput=bln_value;                
obj_theme.bln_borderSearch=bln_value;                    
}
fn_setBorderRadiusDisplay(obj_theme){  
let bln_value=obj_theme.bln_borderRadiusDisplay;
obj_theme.bln_borderRadiusRowz=bln_value;
obj_theme.bln_borderRadiusButton=bln_value;
obj_theme.bln_borderRadiusFieldset=bln_value;
obj_theme.bln_borderRadiusLegend=bln_value;    
obj_theme.bln_borderRadiusLabel=bln_value;      
obj_theme.bln_borderRadiusInput=bln_value;        
obj_theme.bln_borderRadiusSearch=bln_value;        
}

fn_splitUserTheme(obj_theme){
  let arr_name=obj_theme.str_name.split("-");    

  let bln_value;
  bln_value=this.fn_elementExistsAtIndex(arr_name, 0);
  if(bln_value){
    obj_theme.str_title=arr_name[0];
  }

  bln_value=this.fn_elementExistsAtIndex(arr_name, 1);
  if(bln_value){
    obj_theme.algorithm=arr_name[1];
  }

  
  bln_value=this.fn_elementExistsAtIndex(arr_name, 2);
  if(bln_value){
    obj_theme.str_location=arr_name[2];    
  }    

  if(!obj_theme.algorithm){//will fail if not defined
    obj_theme.algorithm="lighten";
  }    
  //if a dark color use base, floor , up
  //if a light color use base, mid , up
}

fn_setColorHSL(obj_theme){

let str_title=obj_theme.str_title;
if(!str_title){
  str_title="gray";
}
//console.log("str_title: " + str_title);
let str_fillHSL=this.obj_color[str_title];  
//console.log("str_fillHSL: " + str_fillHSL);
obj_theme.str_fill=str_fillHSL;                

}


fn_setFillPalette(obj_theme, obj_fill){
let str_fill=obj_theme.str_fill;    
let int_ratio1, int_ratio2, str_fill_1, str_fill_2;
switch(obj_theme.algorithm){
  case "lighten":
    //1 target, 1 lighter, 1 lighter              
    int_ratio1=20;
    int_ratio2=10;      
    str_fill_1=obj_shared.fn_getLightShade(str_fill, int_ratio1, true);              
    str_fill_2=obj_shared.fn_getLightShade(str_fill_1, int_ratio2, true);                    
    
    break;    
  break;      
  case "darken":
    //1 target, 1 lighter, 1 lighter              
    int_ratio1=10;
    int_ratio2=20;
    str_fill_1=obj_shared.fn_getDarkShade(str_fill, int_ratio1, true);              
    str_fill_2=obj_shared.fn_getDarkShade(str_fill_1, int_ratio2, true);                    

    
    break;
  default://default is mid
      //1 target, 1 darker, 1 lighter      
      int_ratio1=10;
      int_ratio2=20;              
      str_fill_1=obj_shared.fn_getDarkShade(str_fill, int_ratio1);      
      str_fill_2=obj_shared.fn_getLightShade(str_fill, int_ratio2);                                

      
    break;   
}   
obj_fill.str_fill_1=str_fill_1;
obj_fill.str_fill_2=str_fill_2;
}

fn_setStartLocation(obj_theme, obj_fill){

let str_fillBase, str_fillForm, str_fillBorder;
const str_fill=obj_theme.str_fill;

const str_fill_1=obj_fill.str_fill_1;
const str_fill_2=obj_fill.str_fill_2;

str_fillBase=str_fill;
str_fillForm=str_fill_1;
str_fillBorder=str_fill_2;    

if(obj_theme.bln_backlit){
  str_fillBase=str_fill_2;
  str_fillForm=str_fill;
  str_fillBorder=str_fill_1;
}

obj_fill.str_fill=str_fill;
obj_fill.str_fillBase=str_fillBase;
obj_fill.str_fillForm=str_fillForm;
obj_fill.str_fillBorder=str_fillBorder;  
}


  


fn_setUserTheme(obj_theme){    

//https://convertingcolors.com/hex-color-A52A2A.html?search=brown
//https://coolors.co/palettes/trending
//https://imagecolorpicker.com/
//coolors affiliate link https://coolors.co/?ref=6754517d5fa59e000b79f378   

this.fn_getColorMap();    
obj_theme.str_name=obj_shared.fn_getRandomValueFromObject(this.obj_color);  
//obj_theme.str_name="olive";
//obj_theme.str_name="orange";
this.fn_splitUserTheme(obj_theme);//split name into variables if any
this.fn_setColorHSL(obj_theme);    

//Load Border and Radius Option
obj_theme.bln_borderDisplay=false;
obj_theme.bln_borderRadiusDisplay=false;      
this.fn_setBorderDisplay(obj_theme);      
this.fn_setBorderRadiusDisplay(obj_theme);
obj_theme.bln_borderRowz=false;  
obj_theme.bln_borderRadiusRowz=false;  
obj_theme.bln_borderButton=true;
obj_theme.bln_borderRadiusButton=true;
obj_theme.bln_borderFieldset=true;
obj_theme.bln_borderRadiusFieldset=true;
obj_theme.bln_borderLegend=true;
obj_theme.bln_borderRadiusLegend=true;
obj_theme.bln_borderLabel=true;
obj_theme.bln_borderRadiusLabel=true;
obj_theme.bln_borderInput=true;
obj_theme.bln_borderRadiusInput=true;
//Load Border and Radius Option

obj_theme.bln_backlit=false;
obj_theme.bln_backlit=true;
obj_theme.bln_brightFill=false;//false for dark, true for light
switch(obj_theme.bln_brightFill){
  case true:    
    obj_theme.algorithm="lighten";
    obj_theme.str_textColorUI="#E26158";      
  break;
  case false:
    obj_theme.algorithm="lighten";
    
    
  break;
}

obj_theme.bln_flipBorder=false;
obj_theme.bln_flipForm=false;

let obj_fill=new Object;
this.fn_setFillPalette(obj_theme, obj_fill);//we can choose to lighten, split or darken based on the main color and location
this.fn_setStartLocation(obj_theme, obj_fill);//we know know where we are starting from


obj_theme.str_fillBase=obj_fill.str_fillBase;
obj_theme.str_fillForm=obj_fill.str_fillForm;       
obj_theme.str_fillBorder=obj_fill.str_fillBorder;  

/*
console.log("obj_theme.str_title: " + obj_theme.str_title);
console.log("obj_theme.algorithm: " + obj_theme.algorithm);
console.log("obj_theme.str_location: " + obj_theme.str_location);  
console.log("obj_theme:" + obj_theme.str_fill);
console.log("obj_theme:" + obj_theme.str_fillBase);
console.log("obj_theme:" + obj_theme.str_fillForm);
console.log("obj_theme:" + obj_theme.str_fillBorder);
//*/
}
fn_applyThemeStructure(){        
  

  //some code requires themeobjects empty or not
  //const obj_theme=this.obj_theme;          
  //if(!obj_theme){return;}

  const obj_theme=new Object;          
  if(!obj_theme){return;}  

  /////////////////////////////////////////
  /////////////////////////////////////////
  //THEME      
  //STRUCTURE             
  obj_theme.display="flex";        
  obj_theme.padding="1em";        
  obj_theme.gap="1em";    
  //STRUCTURE    
  
  //OPTION                      
  obj_theme.str_borderStyle="solid";//user session                        
  obj_theme.str_borderSize="none";                 
  obj_theme.str_borderRadiusSize="medium";//set to none for square
  obj_theme.str_deviderSize="small";      
  obj_theme.str_fontSize="medium";                            
  //OPTION                  
  //THEME
  /////////////////////////////////////////
  /////////////////////////////////////////     
  
  //default to be adjusted accoridng to light or dark theme                  
  obj_theme.str_textColorUI="white";                              
  obj_theme.str_fillInput="white";      
  obj_theme.str_borderColorInput="gainsboro";            
  obj_theme.str_textColorInput="black";                  
  //defaults to be adjusted accoridng to light or dark theme          
  
  this.fn_setUserTheme(obj_theme);                                   
  
  this.fn_calculateFontSize(obj_theme);                    
  obj_theme.str_highLightFill="orange"; 
  
  //document.body.style.backgroundColor=obj_theme.str_fillBase;        

  let obj_holder=this.obj_holder;
  let str_fillBorder, str_fillForm, str_fillBase;
  

  let obj_themeItem;        
  /////////////////////////////////////////
  /////////////////////////////////////////
  //XAPPACCORDION
  obj_themeItem=obj_shared.fn_shallowCopy(obj_theme);                
  //STRUCTURE                             
  obj_themeItem.padding="0em";
  obj_themeItem.display="block";
  //STRUCTURE     
  //OPTION        
  obj_themeItem.bln_border=false;         
  obj_themeItem.backgroundColor=obj_theme.str_fillBase;        
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION            
  obj_holder.obj_themeXappAccordion=obj_themeItem;                
  //XAPPACCORDION
  /////////////////////////////////////////
  /////////////////////////////////////////        
  
  
  /////////////////////////////////////////
  /////////////////////////////////////////
  //MENUBUTTON
  obj_themeItem=obj_shared.fn_shallowCopy(obj_theme);                
  //STRUCTURE                           
  obj_themeItem.fontWeight="bold";                                
  obj_themeItem.width="100%";        
  obj_themeItem.cursor="pointer";                                       
  obj_themeItem.justifyContent="center";
  obj_themeItem.alignItems="center";        
  //STRUCTURE
  //OPTION       
  obj_themeItem.str_fontLabel="form_rowz";                    
  obj_themeItem.bln_border=obj_theme.bln_borderRowz;              
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusRowz;                          

  str_fillBorder=obj_theme.str_fillBorder;
  str_fillForm=obj_theme.str_fillForm;    
  if(obj_theme.bln_flipBorder){[str_fillBorder, str_fillForm]=obj_shared.fn_flipVariable(str_fillBorder, str_fillForm);}    
  obj_themeItem.borderColor=str_fillBorder;          
  obj_themeItem.backgroundColor=str_fillForm;                
  
  obj_themeItem.color=obj_theme.str_textColorUI;
  obj_project.fn_applyThemeOption(obj_themeItem);  
  //OPTION                    
  obj_holder.obj_themeRowz=obj_themeItem;        
  //MENUBUTTON
  /////////////////////////////////////////
  /////////////////////////////////////////

  /////////////////////////////////////////
  /////////////////////////////////////////
  //CHILDMENU        
  obj_themeItem=obj_shared.fn_shallowCopy(obj_holder.obj_themeRowz);                
  //STRUCTURE                                   
  //STRUCTURE
  //OPTION                
  obj_themeItem.str_fontLabel="form_rowzchild";                        
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION                            
  obj_holder.obj_themeRowzChild=obj_themeItem;        
  //CHILDMENU             
  /////////////////////////////////////////
  /////////////////////////////////////////

  /////////////////////////////////////////
  /////////////////////////////////////////
  //DYNAMICMENU
  obj_themeItem=obj_shared.fn_shallowCopy(obj_holder.obj_themeRowzChild);                        
  //STRUCTURE                                   
  //STRUCTURE
  //OPTION                
  obj_themeItem.str_fontLabel="form_rowzdynamic";                        
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION                    
  obj_holder.obj_themeRowzDynamic=obj_themeItem;        
  //DYNAMICMENU
  /////////////////////////////////////////
  /////////////////////////////////////////          

  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMBUTTON        
  obj_themeItem=obj_shared.fn_shallowCopy(obj_theme);                
  //STRUCTURE                           
  //STRUCTURE           
  //OPTION                                  
  obj_themeItem.str_fontLabel="form_button";                                
  obj_themeItem.bln_border=obj_theme.bln_borderButton;    
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusButton;              
  
  str_fillBorder=obj_theme.str_fillBorder;
  str_fillForm=obj_theme.str_fillForm;    
  if(obj_theme.bln_flipBorder){[str_fillBorder, str_fillForm]=obj_shared.fn_flipVariable(str_fillBorder, str_fillForm);}    
  obj_themeItem.borderColor=str_fillBorder;          
  obj_themeItem.backgroundColor=str_fillForm;                
  obj_themeItem.color=obj_theme.str_textColorUI;        
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION            
  obj_holder.obj_themeButton=obj_themeItem;        
  //FORMBUTTON
  /////////////////////////////////////////
  /////////////////////////////////////////

  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMFIELDSET        
  obj_themeItem=obj_shared.fn_shallowCopy(obj_theme);                
  //STRUCTURE                             
  //STRUCTURE   
  //OPTION                     
  obj_themeItem.str_fontLabel="form_fieldset";              
  obj_themeItem.bln_border=obj_theme.bln_borderFieldset;      
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusFieldset;        
  
  str_fillBorder=obj_theme.str_fillBorder;
  str_fillForm=obj_theme.str_fillForm;    
  if(obj_theme.bln_flipBorder){[str_fillBorder, str_fillForm]=obj_shared.fn_flipVariable(str_fillBorder, str_fillForm);}    
  if(obj_theme.bln_flipForm){[str_fillBorder, str_fillForm]=obj_shared.fn_flipVariable(str_fillBorder, str_fillForm);}      
  obj_themeItem.borderColor=str_fillBorder;          
  obj_themeItem.backgroundColor=str_fillForm;                


  
obj_themeItem.color=obj_theme.str_textColorUI;
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION
  obj_holder.obj_themeFormFieldset=obj_themeItem;                
  //FORMFIELDSET        
  /////////////////////////////////////////
  /////////////////////////////////////////
  
  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMLEGEND
  obj_themeItem=obj_shared.fn_shallowCopy(obj_holder.obj_themeFormFieldset);                
  //STRUCTURE                             
  //STRUCTURE   
  //OPTION                          
  obj_themeItem.str_fontLabel="form_legend";                                
  obj_themeItem.bln_border=obj_theme.bln_borderLegend;      
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusLegend;        
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION
  obj_holder.obj_themeFormLegend=obj_themeItem;        
  //FORMLEGEND
  /////////////////////////////////////////
  /////////////////////////////////////////

  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMLABEL
  obj_themeItem=obj_shared.fn_shallowCopy(obj_holder.obj_themeFormLegend);                
  //STRUCTURE                             
  //STRUCTURE   
  //OPTION                
  obj_themeItem.str_fontLabel="form_label";                                
  obj_themeItem.bln_border=obj_theme.bln_borderLabel;      
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusLabel;              
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION      
  obj_holder.obj_themeFormLabel=obj_themeItem;              
  //FORMLABEL
  /////////////////////////////////////////
  /////////////////////////////////////////

  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMINPUT        
  obj_themeItem=obj_shared.fn_shallowCopy(obj_holder.obj_themeFormLabel);
  //STRUCTURE                                           
  obj_themeItem.fontWeight="normal";                        
  obj_themeItem.maxHeight="500px";                                          
  obj_themeItem.overflow="Auto";                                          
  obj_themeItem.wordBreak="normal";                      
  //STRUCTURE
  //OPTION                      
  obj_themeItem.str_fontLabel="form_input";                                
  obj_themeItem.bln_border=obj_theme.bln_borderInput;
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusInput;        
  obj_themeItem.borderColor=obj_theme.str_borderColorInput;
  obj_themeItem.backgroundColor=obj_theme.str_fillInput;                                                                       
  obj_themeItem.color=obj_theme.str_textColorInput;      
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION            
  obj_holder.obj_themeFormInput=obj_themeItem;        
  //FORMINPUT
  /////////////////////////////////////////
  /////////////////////////////////////////      

  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMINPUT        
  obj_themeItem=obj_shared.fn_shallowCopy(obj_holder.obj_themeFormInput);
  //STRUCTURE                                                             
  obj_themeItem.fontWeight="bold";
  //STRUCTURE
  //OPTION                      
  obj_themeItem.str_fontLabel="rowz_search";                                      
  obj_themeItem.bln_border=obj_theme.bln_borderSearch;  
  obj_themeItem.bln_borderRadius=obj_theme.bln_borderRadiusSearch;  
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION            
  obj_holder.obj_themeRowzSearch=obj_themeItem;              
  //FORMINPUT
  /////////////////////////////////////////
  /////////////////////////////////////////

  

  /////////////////////////////////////////
  /////////////////////////////////////////
  //FORMHARDRULE
  obj_themeItem=obj_shared.fn_shallowCopy(obj_theme);                
  //STRUCTURE                             
  obj_themeItem.padding="0.5em";                  
  //STRUCTURE           
  //OPTION                
  obj_themeItem.str_fontLabel="form_hardrule";                                      
  obj_themeItem.bln_border=obj_holder.obj_themeRowz.bln_border;  
  obj_themeItem.bln_borderRadius=obj_holder.obj_themeRowz.bln_borderRadius;  
  obj_themeItem.borderColor=obj_holder.obj_themeRowz.borderColor;       
  obj_themeItem.backgroundColor=obj_holder.obj_themeRowz.backgroundColor;
  obj_project.fn_applyThemeOption(obj_themeItem);
  //OPTION        
  obj_holder.obj_themeFormHardRule=obj_themeItem;        
  //FORMHARDRULE
  /////////////////////////////////////////
  /////////////////////////////////////////        
  
}

fn_applyThemeOption(obj_themeItem){
this.fn_applyThemeFont(obj_themeItem);
this.fn_applyThemeBorder(obj_themeItem);
this.fn_applyThemeDevider(obj_themeItem);
}

fn_applyThemeFont(obj_themeItem){      

//FONTSIZE
let int_fontSize;  
switch(obj_themeItem.str_fontLabel){                    
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
obj_themeItem.marginBottom=int_deviderSize + "em";                  
//DEVIDER  
}


fn_getColorMap(){
  
  this.obj_color = {
  "alice_blue": "hsl(208, 100%, 97%)",
  "antique_white": "hsl(34, 78%, 91%)",
  "aqua": "hsl(180, 100%, 50%)",
  "aquamarine": "hsl(160, 100%, 75%)",
  "azure": "hsl(180, 100%, 97%)",
  "beige": "hsl(60, 56%, 91%)",
  "bisque": "hsl(33, 100%, 88%)",
  "black": "hsl(0, 0%, 0%)",
  "blanched_almond": "hsl(36, 100%, 90%)",
  "blue": "hsl(240, 100%, 50%)",
  "blue_violet": "hsl(271, 76%, 53%)",
  "brown": "hsl(0, 59%, 41%)",
  "burly_wood": "hsl(34, 57%, 70%)",
  "cadet_blue": "hsl(182, 25%, 50%)",
  "chartreuse": "hsl(90, 100%, 50%)",
  "chocolate": "hsl(25, 75%, 47%)",
  "coral": "hsl(16, 100%, 66%)",
  "cornflower_blue": "hsl(219, 79%, 66%)",
  "cornsilk": "hsl(48, 100%, 93%)",
  "crimson": "hsl(348, 83%, 47%)",
  "cyan": "hsl(180, 100%, 50%)",
  "dark_blue": "hsl(240, 100%, 27%)",
  "dark_cyan": "hsl(180, 100%, 27%)",
  "dark_goldenrod": "hsl(43, 89%, 38%)",
  "dark_gray": "hsl(0, 0%, 66%)",
  "dark_green": "hsl(120, 100%, 20%)",
  "dark_khaki": "hsl(56, 38%, 58%)",
  "dark_magenta": "hsl(300, 100%, 27%)",
  "dark_olive_green": "hsl(82, 39%, 30%)",
  "dark_orange": "hsl(33, 100%, 50%)",
  "dark_orchid": "hsl(280, 61%, 50%)",
  "dark_red": "hsl(0, 100%, 27%)",
  "dark_salmon": "hsl(15, 72%, 70%)",
  "dark_sea_green": "hsl(120, 25%, 65%)",
  "dark_slate_blue": "hsl(248, 39%, 39%)",
  "dark_slate_gray": "hsl(180, 25%, 25%)",
  "dark_turquoise": "hsl(181, 100%, 41%)",
  "dark_violet": "hsl(282, 100%, 41%)",
  "deep_pink": "hsl(328, 100%, 54%)",
  "deep_sky_blue": "hsl(195, 100%, 50%)",
  "dim_gray": "hsl(0, 0%, 41%)",
  "dodger_blue": "hsl(210, 100%, 56%)",
  "firebrick": "hsl(0, 68%, 42%)",
  "floral_white": "hsl(40, 100%, 97%)",
  "forest_green": "hsl(120, 61%, 34%)",
  "fuchsia": "hsl(300, 100%, 50%)",
  "gainsboro": "hsl(0, 0%, 86%)",
  "ghost_white": "hsl(240, 100%, 99%)",
  "gold": "hsl(51, 100%, 50%)",
  "goldenrod": "hsl(43, 74%, 49%)",
  "gray": "hsl(0, 0%, 50%)",
  "green": "hsl(120, 100%, 25%)",
  "green_yellow": "hsl(84, 100%, 59%)",
  "honeydew": "hsl(120, 100%, 97%)",
  "hot_pink": "hsl(330, 100%, 71%)",
  "indian_red": "hsl(0, 53%, 58%)",
  "indigo": "hsl(275, 100%, 25%)",
  "ivory": "hsl(60, 100%, 97%)",
  "khaki": "hsl(54, 77%, 75%)",
  "lavender": "hsl(240, 67%, 94%)",
  "lavender_blush": "hsl(340, 100%, 97%)",
  "lawn_green": "hsl(90, 100%, 50%)",
  "lemon_chiffon": "hsl(54, 100%, 90%)",
  "light_blue": "hsl(195, 53%, 79%)",
  "light_coral": "hsl(0, 79%, 72%)",
  "light_cyan": "hsl(180, 100%, 94%)",
  "light_goldenrod_yellow": "hsl(60, 80%, 90%)",
  "light_gray": "hsl(0, 0%, 83%)",
  "light_green": "hsl(120, 73%, 75%)",
  "light_pink": "hsl(351, 100%, 86%)",
  "light_salmon": "hsl(17, 100%, 74%)",
  "light_sea_green": "hsl(177, 70%, 41%)",
  "light_sky_blue": "hsl(203, 92%, 75%)",
  "light_slate_gray": "hsl(210, 14%, 53%)",
  "light_steel_blue": "hsl(214, 41%, 78%)",
  "light_yellow": "hsl(60, 100%, 94%)",
  "lime": "hsl(120, 100%, 50%)",
  "lime_green": "hsl(120, 61%, 50%)",
  "linen": "hsl(30, 67%, 94%)",
  "magenta": "hsl(300, 100%, 50%)",
  "maroon": "hsl(0, 100%, 25%)",
  "medium_aquamarine": "hsl(160, 51%, 60%)",
  "medium_blue": "hsl(240, 100%, 40%)",
  "medium_orchid": "hsl(288, 59%, 58%)",
  "medium_purple": "hsl(260, 60%, 65%)",
  "medium_sea_green": "hsl(147, 50%, 47%)",
  "medium_slate_blue": "hsl(249, 80%, 67%)",
  "medium_spring_green": "hsl(157, 100%, 49%)",
  "medium_turquoise": "hsl(178, 60%, 55%)",
  "medium_violet_red": "hsl(322, 81%, 43%)",
  "midnight_blue": "hsl(240, 64%, 27%)",
  "mint_cream": "hsl(150, 100%, 98%)",
  "misty_rose": "hsl(6, 100%, 94%)",
  "moccasin": "hsl(38, 100%, 85%)",
  "navajo_white": "hsl(36, 100%, 84%)",
  "navy": "hsl(240, 100%, 25%)",
  "old_lace": "hsl(39, 85%, 95%)",
  "olive": "hsl(60, 100%, 25%)",
  "olive_drab": "hsl(80, 60%, 35%)",
  "orange": "hsl(39, 100%, 50%)",
  "orange_red": "hsl(16, 100%, 50%)",
  "orchid": "hsl(302, 59%, 65%)",
  "pale_goldenrod": "hsl(55, 67%, 80%)",
  "pale_green": "hsl(120, 93%, 79%)",
  "pale_turquoise": "hsl(180, 65%, 81%)",
  "pale_violet_red": "hsl(340, 60%, 65%)",
  "papaya_whip": "hsl(37, 100%, 92%)",       
  "peach_puff": "hsl(28, 100%, 86%)",
  "peru": "hsl(30, 59%, 53%)",
  "pink": "hsl(350, 100%, 88%)",
  "plum": "hsl(300, 47%, 75%)",
  "powder_blue": "hsl(187, 52%, 80%)",
  "purple": "hsl(300, 100%, 25%)",
  "rebecca_purple": "hsl(270, 50%, 40%)",
  "red": "hsl(0, 100%, 50%)",
  "rosy_brown": "hsl(0, 25%, 65%)",
  "royal_blue": "hsl(225, 73%, 57%)",
  "saddle_brown": "hsl(25, 76%, 31%)",
  "salmon": "hsl(6, 93%, 71%)",
  "sandy_brown": "hsl(28, 87%, 67%)",
  "sea_green": "hsl(146, 50%, 36%)",
  "seashell": "hsl(25, 100%, 97%)",
  "sienna": "hsl(19, 56%, 40%)",
  "silver": "hsl(0, 0%, 75%)",
  "sky_blue": "hsl(197, 71%, 73%)",
  "slate_blue": "hsl(248, 53%, 58%)",
  "slate_gray": "hsl(210, 13%, 50%)",
  "snow": "hsl(0, 100%, 99%)",
  "spring_green": "hsl(150, 100%, 50%)",
  "steel_blue": "hsl(207, 44%, 49%)",
  "tan": "hsl(34, 44%, 69%)",
  "teal": "hsl(180, 100%, 25%)",
  "thistle": "hsl(300, 24%, 80%)",
  "tomato": "hsl(9, 100%, 64%)",
  "turquoise": "hsl(174, 72%, 56%)",
  "violet": "hsl(300, 76%, 72%)",
  "wheat": "hsl(39, 77%, 83%)",
  "white": "hsl(0, 0%, 100%)",
  "white_smoke": "hsl(0, 0%, 96%)",
  "yellow": "hsl(60, 100%, 50%)",
  "yellow_green": "hsl(80, 61%, 50%)"
  };
}
//END THEME HAMDLER
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

