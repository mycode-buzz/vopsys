
            //XSTART component/xapp_widgetboard
              class xapp_widgetboard extends xapp_component{
                constructor(obj_ini) {      
                  super(obj_ini);        
                } 
                fn_initialize(obj_ini){
                  super.fn_initialize(obj_ini);                                  
                }
                fn_onLoad(){    
                  super.fn_onLoad();                  
                  if(this.fn_getDebugPin()){this.fn_highlightBorder("orange");}                  
                }
                fn_loadWidget(obj_row){                

                  let obj_item=this.fn_addContextItem("form_button");
                  if(obj_item){obj_item.fn_configureFromMeta(obj_row);}
                  return obj_item;

                }
              }//END CLS
              //END TAG
              //END component/xapp_widgetboard