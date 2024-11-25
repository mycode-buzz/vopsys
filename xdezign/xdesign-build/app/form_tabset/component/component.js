      //XSTART component/form_tabset
      class form_tabset extends component{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_mapPanel=new Map();          
          this.obj_mapTab=new Map();                   

        }       
        fn_onLoad(obj_ini){
          super.fn_onLoad(obj_ini);                
          this.obj_panellist=this.fn_getComponent("form_panellist");          
          this.obj_tablist=this.fn_getComponent("form_tablist");          
          this.fn_setDisplayFlex(false);         
        }

        fn_hideInterface(){
          
          this.fn_closeFlex();
        } 
        fn_showInterface(){          

          if(!this.bln_opened){
            this.bln_opened=true;                        
            this.obj_tablist.fn_fireFocus();  
          }
          this.fn_openFlex();
        } 
        fn_toggleInterface(){

          if(!this.bln_opened){
            this.bln_opened=true;            
            this.obj_panellist.fn_displayPanel();  
          }

          this.fn_toggleDisplayFlex();
        }        

        
        fn_getTabPanel(obj_param){          
          let obj_panel;
          obj_panel=this.obj_mapPanel.get(obj_param.str_name);
          if(!obj_panel){                                                                             
            obj_panel=this.obj_panellist.fn_addPanel(obj_param);
            this.obj_mapPanel.set(obj_param.str_name, obj_panel);                       
            if(!this.bln_tabLegend){
              let obj_tab=this.obj_tablist.fn_addTab(obj_param);
              this.obj_mapTab.set(obj_param.str_name, obj_tab);                                   
            }
            
          }                    
          return obj_panel;
        }    
        fn_tagOnClick(obj_tab, e){                                
          this.fn_showTab(obj_tab);            
        }
        fn_tagOnFocus(obj_tab, e){                                
          this.fn_showTab(obj_tab);            
        }
        fn_showTab(obj_tab){
          let obj_panel=this.fn_getTabPanel(obj_tab.obj_param);          
          this.obj_panellist.fn_displayPanel(obj_panel);
          return obj_panel;
        }
        fn_legendOnClick(obj_panel){                                         
         
         let obj_panelNext=obj_shared.fn_getNextMapItem(this.obj_mapPanel, obj_panel.obj_param.str_name)
         this.obj_panellist.fn_displayPanel(obj_panelNext);
         
        }

      }//END CLS
      //END TAG
      //END component/form_tabset        