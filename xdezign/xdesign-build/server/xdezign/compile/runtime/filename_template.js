
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
fn_calculateFontSizeIncrement(obj_theme, int_fontSize, int_increment=0){
  obj_theme.int_fontSize1=int_fontSize;
  obj_theme.int_fontSize2=obj_theme.int_fontSize1+int_increment;
  obj_theme.int_fontSize3=obj_theme.int_fontSize2+int_increment;
  obj_theme.int_fontSize4=obj_theme.int_fontSize3+int_increment;
  obj_theme.int_fontSize5=obj_theme.int_fontSize4+int_increment;      
}

fn_calculateFontSize(obj_theme){ 
  

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

fn_getTestThemeName(){

  return obj_shared.fn_getRandomValueFromObject(this.obj_color);  

}



fn_setFillArea(obj_theme, obj_fill){

  let str_fillBase, str_fillForm, str_fillBorder;
  const str_fill=obj_theme.str_fill;
  
  const str_fill_1=obj_fill.str_fill_1;
  const str_fill_2=obj_fill.str_fill_2;

  const obj_gradient=obj_theme.obj_gradient;
  
  str_fillBase=str_fill;
  str_fillForm=str_fill_1;
  str_fillBorder=str_fill_2;    
  
  
  if(obj_gradient.bln_face){    
    str_fillForm=str_fill;
    str_fillBase=str_fill_1;
    str_fillBorder=str_fill_2;
  }
  
  
  obj_fill.str_fill=str_fill;
  obj_fill.str_fillBase=str_fillBase;
  obj_fill.str_fillForm=str_fillForm;
  obj_fill.str_fillBorder=str_fillBorder;  
}

fn_filterGradientLight(obj_theme){        
  
  let int_value=obj_theme.obj_gradient.int_light;  
  let bln_value=obj_shared.fn_filterValue(int_value, obj_theme.int_min,obj_theme.int_max);         
  if(!bln_value){
    console.log("failed int_value: " + int_value);
    console.log("failed obj_theme.int_min: " + obj_theme.int_min);
    console.log("failed obj_theme.int_max: " + obj_theme.int_max);
  }
  return bln_value;
} 



fn_setFillPalette(obj_theme, obj_fill){  
  
  let obj_shade, obj_contrast;

  const obj_gradient=obj_theme.obj_gradient;

  obj_shade=new Object;    
  obj_shade.str_fill=obj_theme.str_fill;  
  obj_shade.bln_value=obj_gradient.bln_lighten;  

  let int_percentLight, int_percentContrast;
  int_percentLight=10;
  int_percentContrast=5;  
  if(obj_gradient.bln_contrast){
    int_percentLight=15;
    int_percentContrast=10;  
  }  
  let int_totalLight=(int_percentLight+(int_percentLight+int_percentContrast));
  obj_theme.int_percentLight=int_percentLight;
  obj_theme.int_percentContrast=int_percentContrast;
  obj_theme.int_totalLight=int_totalLight;

  obj_theme.int_min=0;
  obj_theme.int_max=100;
  if(obj_gradient.bln_lighten){//due to getting lighter    
    obj_theme.int_min=0;
    obj_theme.int_max=(100-int_totalLight);//due to getting darker
  }
  else{    
    obj_theme.int_min=0+int_totalLight;
    obj_theme.int_max=100;//due to getting darker
  }
  obj_theme.bln_filterPass=this.fn_filterGradientLight(obj_theme);        
  if(!obj_theme.bln_filterPass){
    return;
  }

  obj_contrast={    
    int_percentHue:0,
    int_percentSaturation:0,
    int_percentLight:int_percentLight,
  }
  obj_shared.fn_assignProperty(obj_shade, obj_contrast);  


  obj_fill.str_fill_1=obj_shared.fn_getShade(obj_shade);              
  //console.log(obj_fill.str_fill_1);


  obj_contrast.int_percentLight=(int_percentLight+int_percentContrast);//10 percent more than fill 1    
  obj_shade.str_fill=obj_theme.str_fill;//use fill1 as starting point
  obj_shared.fn_assignProperty(obj_shade, obj_contrast);    
  obj_fill.str_fill_2=obj_shared.fn_getShade(obj_shade);              
  obj_fill.obj_shade=obj_shade;

  obj_theme.bln_filterPass=true;  
}

fn_addColorItem(obj_current){  

  this.arr_color.push(obj_current);    
  
  let int_hue, int_saturation, int_light;
  let obj_hsl, str_label;  
  int_hue=obj_current.int_hue;
  int_saturation=obj_current.int_saturation;

  int_hue=obj_current.int_hue;
  int_saturation=obj_current.int_saturation;
  int_light=60;  
  str_label=obj_current.str_label + "-light"
  obj_hsl=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, "", str_label);    
  this.arr_color.push(obj_hsl);

  int_hue=obj_current.int_hue;
  int_saturation=obj_current.int_saturation;
  int_light=30;  
  str_label=obj_current.str_label + "-dark"
  obj_hsl=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, "", str_label);    
  this.arr_color.push(obj_hsl);
  
  if(obj_current.int_hue>=10){
    int_hue=obj_current.int_hue-10;
    int_saturation=obj_current.int_saturation;
    int_light=30;      
    str_label=obj_current.str_label + "-alt"
    obj_hsl=obj_shared.fn_getGradientObject(int_hue, int_saturation, int_light, "", str_label);    
    this.arr_color.push(obj_hsl);  
  }
  
  
  
}

fn_getColorMap(obj_theme){  

  let obj_hsl;
  let int_value;

  let int_hue, int_saturation, int_light
  int_saturation=100;
  int_light=50;

  this.arr_color = [];  
  let arr_item = [];  
  let arr_mod;    
  
  obj_hsl=obj_shared.fn_getGradientObject(0, 100, 50, "", "red");//red
  this.fn_addColorItem(obj_hsl);
  obj_hsl=obj_shared.fn_getGradientObject(30, 100, 50, "", "Orange");
  this.fn_addColorItem(obj_hsl);
  //obj_hsl=obj_shared.fn_getGradientObject(60, 100, 50, "", "Yellow");
  //this.fn_addColorItem(obj_hsl);
  //obj_hsl=obj_shared.fn_getGradientObject(120, 100, 50, "", "Green");
  //this.fn_addColorItem(obj_hsl);
  //obj_hsl=obj_shared.fn_getGradientObject(180, 100, 50, "", "Cyan");
  //this.fn_addColorItem(obj_hsl);
  obj_hsl=obj_shared.fn_getGradientObject(240, 100, 50, "", "Blue");
  this.fn_addColorItem(obj_hsl);
  obj_hsl=obj_shared.fn_getGradientObject(270, 100, 50, "", "Purple");
  this.fn_addColorItem(obj_hsl);
  obj_hsl=obj_shared.fn_getGradientObject(300, 100, 50, "", "Magenta");
  this.fn_addColorItem(obj_hsl);
  
  arr_item=this.arr_color;
  obj_hsl=obj_shared.fn_getGradientObject(0, 0, 100, "", "White");
  arr_item.push(obj_hsl);  
  obj_hsl=obj_shared.fn_getGradientObject(0, 0, 0, "", "Black");
  arr_item.push(obj_hsl);  
  obj_hsl=obj_shared.fn_getGradientObject(0, 0, 50, "", "Gray");
  arr_item.push(obj_hsl); 
  obj_hsl=obj_shared.fn_getGradientObject(0, 0, 60, "", "Gray-light");
  arr_item.push(obj_hsl);   
  obj_hsl=obj_shared.fn_getGradientObject(0, 0, 30, "", "Gray-dak");
  arr_item.push(obj_hsl);     
  
  console.log(this.arr_color);

  let int_max=this.arr_color.length-1;
  int_value=obj_shared.fn_getRandomInt(0, int_max); // Generates a random integer between 1 and 8    
  obj_hsl=this.arr_color[int_value];
  
  
  //obj_hsl=obj_shared.fn_getGradientObject(230, 100, 30, "", "blue-mod");  
  //obj_hsl=obj_shared.fn_getGradientObject(300, 100, 50, "", "magenta");    
  //obj_hsl=obj_shared.fn_getGradientObject(0, 100, 50, "", "Red");  
  //obj_hsl=obj_shared.fn_getGradientObject(230, 100, 30, "", "Blue-Alt-Test");    
  //obj_hsl=obj_shared.fn_getGradientObject(300, 100, 60, "", "magenta-lighter-test");  
  //obj_hsl=obj_shared.fn_getGradientObject(300, 100, 30, "", "magenta-darker-test");  
  //obj_hsl=obj_shared.fn_getGradientObject(0, 0, 30, "", "dark-gray-test");  
  //obj_hsl=obj_shared.fn_getGradientObject(0, 0, 60, "", "light-gray-test");  
  //obj_hsl=obj_shared.fn_getGradientObject(0, 0, 100, "", "White");  
  
  obj_theme.str_fill=obj_hsl.str_hsl;  
  obj_theme.obj_gradient=obj_hsl;
}

  


fn_setUserTheme(obj_theme){    

//https://convertingcolors.com/hex-color-A52A2A.html?search=brown
//https://coolors.co/palettes/trending
//https://imagecolorpicker.com/
//coolors affiliate link https://coolors.co/?ref=6754517d5fa59e000b79f378   

//Load Border and Radius Option
obj_theme.bln_borderDisplay=false;
obj_theme.bln_borderRadiusDisplay=false;      
this.fn_setBorderDisplay(obj_theme);      
this.fn_setBorderRadiusDisplay(obj_theme);
obj_theme.bln_borderRowz=false;  
obj_theme.bln_borderRadiusRowz=false;  
obj_theme.bln_borderButton=true;
obj_theme.bln_borderRadiusButton=true;
obj_theme.bln_borderSearch=true;  
obj_theme.bln_borderRadiusSearch=true;  
obj_theme.bln_borderFieldset=true;
obj_theme.bln_borderRadiusFieldset=true;
obj_theme.bln_borderLegend=true;
obj_theme.bln_borderRadiusLegend=true;
obj_theme.bln_borderLabel=true;
obj_theme.bln_borderRadiusLabel=true;
obj_theme.bln_borderInput=true;
obj_theme.bln_borderRadiusInput=true;
//Load Border and Radius Option

this.fn_getColorMap(obj_theme);//generate array of hsl colors    

const obj_gradient=obj_theme.obj_gradient;
if(obj_theme.obj_gradient.int_light>=60){
  obj_gradient.bln_lighten = false;//true by default
}
obj_gradient.bln_contrast=true;
obj_gradient.bln_face=obj_shared.fn_getRandomInt(0, 1);


if(obj_gradient.int_light>80){
  //let obj_hslText=obj_shared.fn_getGradientObject(183, 100, 75, "", "Textcolor");
  let obj_hslText=obj_shared.fn_getGradientObject(0, 33, 36, "", "Dark Red Brown");
  obj_theme.str_textColorUI=obj_hslText.str_hsl;        
}


obj_theme.bln_flipBorder=false;
obj_theme.bln_flipForm=false;

let obj_fill=new Object;
this.fn_setFillPalette(obj_theme, obj_fill);//we can choose to lighten, or darken based on wether the main color is light or dark
this.fn_setFillArea(obj_theme, obj_fill);//we can choose which areas are lighter or darker
obj_theme.str_fillBase=obj_fill.str_fillBase;
obj_theme.str_fillForm=obj_fill.str_fillForm;       
obj_theme.str_fillBorder=obj_fill.str_fillBorder;  

if(!obj_theme.bln_filterPass){
  //obj_theme.str_name=this.fn_getTestThemeName();  
  //obj_theme.str_name="yellow";
  //return this.fn_setUserTheme(obj_theme);  
  console.log("obj_theme.bln_filterPassxxxxx: " + obj_theme.bln_filterPass);
  obj_theme.str_fillBase="hsl(180, 100%, 50%)";
  obj_theme.str_fillForm="hsl(180, 100%, 65%)";
  obj_theme.str_fillBorder="hsl(180, 100%, 85%)";
  
}






//*
//console.log("obj_theme.str_name: " + obj_theme.str_name);
console.log("str_label: " + obj_theme.obj_gradient.str_label);
console.log("obj_theme.str_fill:" + obj_theme.str_fill);
console.log("obj_theme.bln_filterPass: " + obj_theme.bln_filterPass);
console.log("obj_gradient.int_hue: " + obj_theme.obj_gradient.int_hue);
console.log("obj_gradient.int_saturation: " + obj_theme.obj_gradient.int_saturation);
console.log("obj_gradient.int_light: " + obj_theme.obj_gradient.int_light);


console.log("obj_theme.int_min: " + obj_theme.int_min);
console.log("obj_theme.int_max: " + obj_theme.int_max);
console.log("obj_theme.int_totalLight: " + obj_theme.int_totalLight);    


console.log("obj_gradient.bln_face: " + obj_gradient.bln_face);
console.log("obj_gradient.bln_lighten: " + obj_gradient.bln_lighten);
console.log("obj_gradient.bln_contrast: " + obj_gradient.bln_contrast);
console.log("obj_theme.int_percentLight: " + obj_theme.int_percentLight);
console.log("obj_theme.int_percentContrast: " + obj_theme.int_percentContrast);

console.log("str_fill:" + obj_theme.str_fill);
if(obj_gradient.bln_face){    
  console.log("str_fillForm:" + obj_theme.str_fillForm);  
  console.log("str_fillBase:" + obj_theme.str_fillBase);
  console.log("str_fillBorder:" + obj_theme.str_fillBorder);
}
else{
  console.log("str_fillBase:" + obj_theme.str_fillBase);
  console.log("str_fillForm:" + obj_theme.str_fillForm);    
  console.log("str_fillBorder:" + obj_theme.str_fillBorder);
}
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
  obj_themeItem.borderColor=obj_holder.obj_themeButton.borderColor;  
  obj_themeItem.backgroundColor=obj_theme.str_fillInput;                                                                       
  
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

