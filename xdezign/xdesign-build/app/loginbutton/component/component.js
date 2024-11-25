
            //XSTART component/loginbutton
              class loginbutton extends svgblock{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
                  
                  //this.fn_setType("loginbutton");      
                  this.fn_setTag("loginbutton", true);            
                  
                   this.fn_extends("svgblock");  
                   
                   
                   
                  if(this.obj_design.dataSVG===undefined){this.obj_design.dataSVG=obj_path.fn_getURLAssetFile(this.obj_design.str_type, "lock-button.svg");};          
                  
                  this.obj_holder.str_filter_gray="invert(50%)";
                  this.obj_holder.str_filter_orange="invert(64%) sepia(16%) saturate(4363%) hue-rotate(360deg) brightness(106%) contrast(105%)";
                  //this.obj_holder.str_filter_electricblue="invert(47%) sepia(65%) saturate(535%) hue-rotate(150deg) brightness(94%) contrast(90%)";
                  this.obj_holder.str_filter_electricblue="invert(69%) sepia(62%) saturate(5763%) hue-rotate(191deg) brightness(105%) contrast(101%)";
                  this.obj_holder.str_filter_electricgreen="invert(77%) sepia(47%) saturate(2073%) hue-rotate(40deg) brightness(105%) contrast(106%)";
                  
                  

                  this.obj_holder.str_filter_endAuthorize=this.obj_holder.str_filter_gray;                  
                  this.obj_holder.str_filter_startAuthorize=this.obj_holder.str_filter_electricblue;
                  this.obj_holder.str_filter_startAuthorize=this.obj_holder.str_filter_electricgreen;
                  

                  //this.fn_setFilter(this.obj_holder.str_filter_startAuthorize);
                   
                   
                   /*
                   #2596be electic blue
                   #389eff electic blue
                   check generator here: 
                   https://codepen.io/sosuke/pen/Pjoqqp
                   //*/

                   this.obj_holder.bln_listenClick=true;
                }

                fn_onClick(e){                                                      
                  this.fn_notify(this.obj_holder.obj_projectLocal, "fn_endAuthorize", e);

                  
                  obj_project.fn_unsetEvent();    
                }                
              }//END CLS
              //END TAG
              //END component/loginbutton