      //XSTART component/form_legend
      class form_legend extends form_button{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.bln_listenClick=true;                  
          this.obj_holder.bln_listenKeyUp=true;                  
          
        }

        fn_onLoad(){          
          super.fn_onLoad();
          this.fn_setDomProperty("tabIndex", "0");
          this.fn_setStyleProperty("userSelect", "none");
          this.fn_setStyleProperty("opacity", "1");          
        }

        fn_applyThemeStructure(){                              
          if(!obj_project.obj_theme){return;}
          this.obj_holder.obj_themeStructure=obj_project.obj_theme.obj_formLegend;                
          this.fn_applyStyle(this.obj_holder.obj_themeStructure);                      
        }

        

        fn_onClick(e){                            
          this.fn_fireLegend(e);  
        }
        fn_onKeyUp(e){      
          
          if(e.key==="Enter"){
            this.fn_fireLegend(e);  
          }

          
        }
        fn_fireLegend(e){
          //console.log("xxxxRebbit");                                    
          
          
          obj_project.fn_forgetEvent(e);    

          let obj_parent=this.fn_getParentComponent();          
          this.fn_notify(obj_parent, "fn_legendOnClick", this);                                  
        }
      }//END CLS
      //END TAG
      //END component/form_legend        