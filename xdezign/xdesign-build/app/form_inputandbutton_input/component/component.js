      //XSTART component/form_inputandbutton_input
      class form_inputandbutton_input extends form_input{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
        }
        fn_applyThemeStructure(){                              
          
          let obj_theme=obj_project.obj_theme;
          if(!obj_theme){return;}
          super.fn_applyThemeStructure();          

          let obj_themeItem=this.obj_themeStructure;
          //obj_themeItem.backgroundColor="green";                          
          this.fn_applyStyle(this.obj_themeStructure);//should be called here . not on base object - due to class hierachy            
          
          
        }
      }//END CLS
      //END TAG
      //END component/form_inputandbutton_input        