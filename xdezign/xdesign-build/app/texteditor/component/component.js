class texteditor extends component {
    constructor(obj_ini) {      
      super(obj_ini);        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);        

      //this.fn_setType("texteditor");      
      this.fn_setTag("texteditor");                       
      
      
      if(this.obj_design.str_nameEditorTheme===undefined){
        this.obj_design.str_nameEditorTheme="snow";
      };
      if(this.obj_design.bln_showToolbar===undefined){
        this.obj_design.bln_showToolbar=false;
      };      
      if(this.obj_design.bln_useHTML===undefined){
        this.obj_design.bln_useHTML=true;
      };                  

      this.obj_holder.bln_listenChange=true;
    }

    fn_bootChildren(){//only in boot/pallteItem phase 

      let bln_showToolbar=this.obj_design.bln_showToolbar;
      let bln_useHTML=this.obj_design.bln_useHTML;
      if(bln_showToolbar=="notset"){
        bln_showToolbar=false;
      }
      if(!bln_useHTML){
        bln_showToolbar=false;
      }    
      //if(bln_showToolbar){bln_showToolbar='#toolbar-container';}  


      /*
      var xFont = Quill.import('formats/font');
      xFont.whitelist = ['mirza', 'roboto'];
      Quill.register(xFont, true);
      //*/
      
      /*
      var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      
        [{ 'indent': '-1'}, { 'indent': '+1' }],          
        [{ 'direction': 'rtl' }],                       
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          
        [{ 'font': ['Verdana'] }],                             // Here, how do I specify custom font families??
        [{ 'align': [] }],
      
      ];
      //*/

      

      //if(bln_showToolbar){bln_showToolbar=toolbarOptions;}  
      
        let quill = new Quill(this.dom_obj, {
          theme: this.obj_design.str_nameEditorTheme,          
          modules: {
            toolbar:bln_showToolbar,
            keyboard: {
              bindings: {
                'tab': {
                  key: 9,
                  handler: function(range, context) {
                    return true;
                  }
                },
                
                13: {//disallow enter key if non HTML
                  key: 13,
                  handler: function(range, context) {
                    return bln_useHTML;
                  }
                }

              }
            }            
          }
        });

      quill.root.setAttribute('spellcheck', false);      
      this.obj_holder.obj_quill=quill;

      let that =this;
      quill.on('text-change', function(delta, oldDelta, source) {                        
        that.fn_onEditorChange();        
      });
    }
    fn_setDisabledEditor(){      
      this.obj_holder.obj_quill.disable();
    }      
    fn_setEnabledEditor(){      
      this.obj_holder.obj_quill.enable();
    }      
    fn_addText(str_text){        
      this.fn_putText(str_text, true);                
    }
    fn_setText(str_text){        
      this.fn_putText(str_text);                
    }    
    fn_putText(str_text, bln_add=false){      
      //console.log("fn_putText");
      if(str_text==="xdesignblank"){
        str_text="";              
      }                
      if(str_text==="notset"){
        str_text="";
      }
      
      let obj_quill=this.obj_holder.obj_quill;
      obj_quill.bln_cancelEvent=true;
      if(!bln_add){
        obj_quill.root.innerHTML=str_text;          
      }
      else{
        obj_quill.root.innerHTML=obj_quill.root.innerHTML + this.fn_getNewLine()+str_text;          

      }
      
      obj_quill.blur();        
    }
    fn_getNewLine(){      
      return "";
      /*
      if(this.obj_design.bln_useHTML){
        return "<br>";
      }
      return "\n";
      //*/
    }
    
    fn_clearText(){      
      //console.log("fn_clearText");
      let obj_quill=this.obj_holder.obj_quill;
      obj_quill.bln_cancelEvent=true;
      obj_quill.deleteText(0,obj_quill.getLength());
      this.obj_holder.obj_quill.blur();    
    }
    fn_getText(){  
      //console.log("fn_getText");    
      let str_text;
      if(this.obj_design.bln_useHTML){
        str_text=this.obj_holder.obj_quill.root.innerHTML;
        if(str_text==="<p><br></p>"){
          str_text="";
        }
        
      } 
      else{
        str_text=this.obj_holder.obj_quill.getText();                
        //str_text=str_text.trimRight("\n");        
        str_text=str_text.trim();
      }            
      //console.log("str_text: [" + str_text + "]");

      if(str_text===""){
        str_text="xdesignblank";      
      }      
      return str_text;
    }
    fn_onEditorChange(){ 
      let obj_quill=this.obj_holder.obj_quill; 
      if(obj_quill.bln_cancelEvent){
        obj_quill.bln_cancelEvent=false;
        return;
      }
      //console.log("fn_onEditorChange");
      let changeEvent = new Event('change', { bubbles: true, cancelable: false});
      this.dom_obj.dispatchEvent(changeEvent);            
    }
    
    fn_onChange(){ //required to be in place, as the originalevent was fired on a 3rd party control (the wysiwyg texteditor)
      obj_project.obj_itemEvent=this;      
      
                        
      this.fn_unsetEvent("Change");
    }           
    fn_setDisabled(bln_value){          
      super.fn_setDisabled(bln_value);      
      this.fn_setDisabledEditor();      
    }   
    fn_setEnabled(bln_value){                  
      super.fn_setEnabled(bln_value);
      this.fn_setEnabledEditor();      
    }   
    
}//END CLS
//END TAG