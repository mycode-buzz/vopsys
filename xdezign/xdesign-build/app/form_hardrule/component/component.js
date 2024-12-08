      //XSTART component/form_hardrule
      class form_hardrule extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_applyThemeStructure(){                              
          if(!obj_project.obj_theme){return;}
          this.obj_holder.obj_themeStructure=obj_project.obj_holder.obj_themeFormHardRule;                
          this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy                                
        }
      }//END CLS
      //END TAG
      //END component/form_hardrule        