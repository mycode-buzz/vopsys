      //XSTART component/form_inputandbutton_input
      class form_inputandbutton_input extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_applyThemeStructure(){                                                          
          if(!obj_project.obj_theme){return;}
          this.obj_holder.obj_themeStructure=obj_project.obj_holder.obj_themeRowzSearch;                
          this.fn_applyStyle(this.obj_holder.obj_themeStructure);//should be called here . not on base object - due to class hierachy                                              
        }
      }//END CLS
      //END TAG
      //END component/form_inputandbutton_input        