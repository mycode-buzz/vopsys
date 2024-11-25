
            //XSTART component/desktopnavigationbutton
              class desktopnavigationbutton extends svgblock{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                  
                  this.obj_holder.bln_listenClick=true;
                  //this.fn_setType("desktopnavigationbutton");      
                  this.fn_setTag("desktopnavigationbutton", true);                              
                  this.fn_extends("svgblock");            
                  
                  if(this.obj_design.dataSVG===undefined){                    
                    this.obj_design.dataSVG=obj_path.fn_getURLAssetFile(this.obj_design.str_type, "exit-button.svg");                    
                  }         
                  this.obj_holder.str_filter_electricgreen="invert(77%) sepia(47%) saturate(2073%) hue-rotate(40deg) brightness(105%) contrast(106%)";
                  this.obj_holder.str_filter_electricblue="invert(69%) sepia(62%) saturate(5763%) hue-rotate(191deg) brightness(105%) contrast(101%)";
                  
                  /*
                   #2596be electic blue
                   #389eff electic blue
                   check generator here: 
                   https://codepen.io/sosuke/pen/Pjoqqp
                   //*/

                  if(this.obj_design.str_urlNavigate===undefined){
                    this.obj_design.str_urlNavigate="https://www.mycode.buzz";
                  }                 
                  
                }
                fn_validateDesignInput(obj_item){
                  let str_name=obj_item.obj_design.str_name;
                  let bln_disabled=true;
                  if(str_name==="str_urlNavigate"){
                    bln_disabled=false;
                  }
                  return  bln_disabled;
              
                }                       
                fn_onClick(e){                    

                  obj_path.fn_navigateSubdomain("desk");                  

                  
                  obj_project.fn_forgetEvent(e);    
                }  
              }//END CLS
              //END TAG
              //END component/desktopnavigationbutton