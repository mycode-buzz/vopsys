class menubutton extends component {
    constructor(obj_ini) {
        super(obj_ini); // call the super class constructor        
    }        
    fn_initialize(obj_ini){                
        
        super.fn_initialize(obj_ini);

        //alert("menu_button");
        
        this.fn_setType("menu_button");      
        this.fn_setTag("button", true);                      
        this.fn_setThemeType("menu_button"); 

        //START INITIALIZE DESIGN        
        if(this.fn_getIsOpen()===undefined){this.fn_setIsOpen(false);}//ensure visible place holder at front of object defintion                
        if(this.obj_design.str_text===undefined){this.obj_design.str_text=this.obj_design.str_name;}            
        
        //END INITIALIZE DESIGN     
        
        //START INITIALIZE DOM
        //END INITIALIZE DOM          
        this.obj_holder.bln_listenClick=true;                      
    }      
    fn_onLoad(){
        super.fn_onLoad();        
        if(this.fn_getIsOpen()){
            this.fn_openContent();        
        }                
    }      
    
    fn_createSelf(){

        super.fn_createSelf();
        
        let dom_obj;
        dom_obj=document.createElement("div");        
        this.dom_obj.parentNode.insertBefore(dom_obj, this.dom_obj.nextSibling);                
        dom_obj.style.display="none";
        this.dom_objContentContainer=dom_obj;            

        

        dom_obj=document.createElement("div");        
        dom_obj.style.display="block";        
        dom_obj.style.flexWrap=this.obj_domStyle.flexWrap;        
        dom_obj.style.padding="0px";                        
        dom_obj.style.marginBottom="0px";                        
        dom_obj.style.marginRight="0px";                        
        dom_obj.style.width="100%";
        dom_obj.innerHTML=this.obj_design.str_content;
        this.dom_objContent=dom_obj;        
        this.dom_objContentContainer.appendChild(dom_obj);     
        
    }         
    
    
    
    fn_setHTMLContent(){
        super.fn_setHTMLContent();    
        this.fn_setText(this.obj_design.str_text);                
    } 
    
    fn_addItem(obj_ini){
        let obj_item;        
        if(obj_ini.obj_design.str_type===undefined){
            obj_ini.obj_design.str_type="button";                   
        }                
        obj_item=super.fn_addItem(obj_ini);//CallSuper
        
        return obj_item;
    }        

    
    fn_setDisplay(bln_display=true){          
        
        if(!bln_display){
            this.obj_design.bln_pin=undefined;
        }
        super.fn_setDisplay(bln_display);
    }
    fn_open(){        
        this.fn_openContent();
    }
    fn_close(){        
        if(!this.obj_design.bln_pin){
            this.fn_closeContent();
        }                
    }
    fn_openContent(){          

        if(this.obj_domProperty.disabled){            
            return;
        }
    
        let obj_container=this.fn_getParentComponent();        
        let str_method="fn_open";        
        if(obj_container && obj_container[str_method]){
            obj_container[str_method]();
        }      
        
        this.dom_objContentContainer.style.display="block";
        this.fn_setIsOpen(true);                

        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];                                    
            let str_method="fn_openContent";        
            if(obj_item && obj_item[str_method]){                
                obj_item[str_method]();
            }                  
        }
    }
    fn_closeContent(){
        //this.fn_debugText("fn_closeContent");
        this.dom_objContentContainer.style.display="none";
        this.fn_setIsOpen(false);        
        //this.fn_closeChildren();
    }        
    fn_closeChildren(){
        //this.fn_debugText("menubutton fn_closeChildren");
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];                                    
            let str_method="fn_closeContent";        
            if(obj_item && obj_item[str_method]){
                obj_item[str_method]();
            }                  
        }
    }
    fn_toggle(){                

        let bln_isOpen=this.fn_getIsOpen()
        if(bln_isOpen){                        
            this.fn_closeContent();
        }
        else{            
            this.fn_openContent();
        }
    }        
    
    fn_onClick(e){                  

        //this.fn_debugText("menubutton fn_onClick");
        
        let obj_container=this.fn_getParentComponent();        
        let str_method="fn_close";        
        if(obj_container && obj_container[str_method]){
            obj_container[str_method](e);
        }      

        
        this.fn_toggle()        
        
        
        this.fn_unsetEvent();
    }
}//END CLS
//END MENUBUTTON
