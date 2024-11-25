      //XSTART component/xapp_queryterm_interface
      class xapp_queryterm_interface extends form_fieldset{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                
          this.obj_holder.arr_button=[];
        }
        fn_onLoad(){
          super.fn_onLoad();
          if(this.fn_hasContextHolderParent()){return;}                                     
          //this.fn_setDisplayFlex(false);          
          this.fn_setText("Tag List");
          
        }        

        
        fn_getCountQueryTerm(){          
          return this.obj_holder.arr_button.length;
        }
        fn_getArrayQueryTerm(){          
          return this.obj_holder.arr_button;
        }
        
        fn_addQueryTerm(str_queryTerm, bln_startPosition=false){          

          //console.log("fn_addQueryTerm :" + str_queryTerm);

          let arr_button=this.fn_getArrayQueryTerm();
          for(let i=0;i<arr_button.length;i++){
            let obj_button=arr_button[i];
            if(str_queryTerm===obj_button.fn_getText()){
              //console.log("FOUND MATCH");
              return obj_button;
            }            
          }
          
          //console.log("NO FOUND MATCH");          
          

          if(this.obj_hideButton){
            this.obj_holder.obj_insertNextTo=this.obj_hideButton;
          }
          let obj_container, obj_button;
          obj_container=this;          
          obj_button=obj_container.fn_addContextItem("xapp_button_queryterm", bln_startPosition);                                                  
          obj_button.obj_parentInterface=this;          
          obj_button.fn_setText(str_queryTerm);          

          if(bln_startPosition){
            this.obj_holder.arr_button.unshift(obj_button);          
            obj_button.bln_wasEnabled=true;
          }          
          else{
            this.obj_holder.arr_button.push(obj_button);          
          }
          
          return obj_button;
          
        }        
        fn_queryTermButtonOnMouseDown(obj_button, e){          

          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnMouseDown(obj_button, e);
        }
        fn_queryTermButtonOnMouseUp(obj_button, e){
          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnMouseUp(obj_button, e);
        }
        fn_queryTermButtonOnDblClick(obj_button, e){                    
          
          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnDblClick(obj_button, e);
        }        
        fn_queryTermButtonOnClick(obj_button, e){                    
          let obj_parent=this.obj_parentInterface;                              
          obj_parent.fn_queryTermButtonOnClick(obj_button, e);
        }
        
        fn_disableQueryTerm(obj_button){          
        
          obj_button.bln_enabled=false;
          obj_button.fn_setOpacity("0.50");                    
        }
        fn_enableQueryTerm(obj_button){          
        
          obj_button.bln_enabled=true;
          obj_button.fn_setOpacity("1");                    

          let arr_button=this.fn_getArrayQueryTerm();
          obj_shared.fn_promoteArrayItem(arr_button, obj_button);          
          
          if(!obj_button.bln_wasEnabled){
            obj_button.bln_wasEnabled=true;
            //obj_shared.fn_domMoveElementToFront(obj_button.dom_obj);            
          }
          
          
        }
        
        fn_removeQueryTerm(obj_button){          
          //console.log("fn_removeQueryTerm");
          let obj_container=this;          
          obj_container.fn_removeItem(obj_button);              
          obj_shared.fn_removeObjectFromArray(this.obj_holder.arr_button, obj_button);                    
        }
      }//END CLS
      //END TAG
      //END component/xapp_queryterm_interface        