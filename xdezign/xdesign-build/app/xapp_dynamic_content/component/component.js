
            //XSTART component/xapp_dynamic_content
              class xapp_dynamic_content extends component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                
                  
      
                  //START INITIALIZE DESIGN                       
                  this.obj_design.bln_registerAtContainer=true;
                  this.fn_setDynamic(true);                              
                  this.fn_setTag("xapp_dynamic_content", true);                                  
                  //END  INITIALIZE DESIGN
      
                  //START INITIALIZE STYLE            
                  //*
                  //if(this.fn_getStyleProperty("background-color")===undefined){this.fn_setStyleProperty("background-color", "red");}
                  //if(this.fn_getStyleProperty("padding")===undefined){this.fn_setStyleProperty("padding", "10px");}            
                  //*/

                  
      
                  //*            
                  //*/
                  //END  INITIALIZE STYLE  
                }
                fn_prepare(){
                  this.fn_removeChildren();                         
                }          
                fn_onBeforeSave(){            
                  //console.log("fn_onBeforeSave");
                  this.fn_prepare();            
      
                }
              }//END CLS
              //END TAG
              //END component/xapp_dynamic_content