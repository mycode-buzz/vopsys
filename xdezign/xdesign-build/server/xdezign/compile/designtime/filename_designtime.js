
//START DesignDelegate.js
//Design Delgate Class
class DesignDelegate{
    constructor(obj_delegator) {                          
        this.fn_initialize(obj_delegator);                        
        if(window.parent){
            obj_projectParent=window.parent.obj_project;//set reference to parent publish object from this iframe            
        }
    }    
    fn_initialize(obj_delegator){
        this.obj_delegator=obj_delegator;
        let obj_design=this.obj_delegator.obj_design;

        
        
        if(obj_design.bln_classController===undefined){obj_design.bln_classController=false;}//Release Edit should be false by default        
        if(obj_design.bln_editPinRelease===undefined){obj_design.bln_editPinRelease=false;}//Release Edit should be false by default        
        if(obj_design.bln_editPin===undefined){obj_design.bln_editPin=true;}                                
        if(obj_design.bln_palettePinRelease===undefined){obj_design.bln_palettePinRelease=false;}                                        
        if(obj_design.bln_palettePin===undefined){obj_design.bln_palettePin=false;}                                                
        
        
        if(obj_design.bln_lockComponent===undefined){obj_design.bln_lockComponent=false;}        
        if(obj_project.obj_design.str_type==="xapp_theme"){obj_design.bln_lockComponent=false;}
        if(obj_design.bln_serverIndex===undefined){obj_design.bln_serverIndex=false;}                                
        if(obj_design.bln_registerAtProject===undefined){obj_design.bln_registerAtProject=false;}
        if(obj_design.bln_registerAtContainer===undefined){obj_design.bln_registerAtContainer=true;}                        
        if(obj_design.str_themeType===undefined){
            obj_design.str_themeType=obj_design.str_type;
            //console.log("obj_design.str_themeType: " + obj_design.str_themeType);
        }        

        //if(obj_design.str_themeType===undefined){obj_design.str_themeType="notset";}        
        if(obj_delegator.fn_getTypeable()===undefined){            
            let str_listIn="div,p,span,td,th";
            let bln_value=false;
            if(obj_shared.fn_inStr(","+obj_design.str_tag+",", ","+str_listIn+",")){
                bln_value=true;                
            }
            this.obj_delegator.fn_setTypeable(bln_value);            
        }                
        if(obj_design.str_releaseLabel===undefined){obj_design.str_releaseLabel="notset";}                                
        
        
        if(obj_design.str_text===undefined){obj_design.str_text="notset";}//Menu Button Only                              
        if(obj_design.str_lastVersionDate==undefined){obj_design.str_lastVersionDate="notset";}       
        
        
        //this.fn_setClipBoardContent(false);

        //obj_delegator will be the button etc , ie the control which has been added   
        
        if(this.obj_delegator===obj_project){
            if(!this.fn_isProtectedInstance()){
                this.obj_delegator.obj_design.str_categoryName="Other";
            }        
        }
    }      
    
    fn_isProtectedInstance(){//designed for Project Level protection
        let blnIsProtected=false;                
        let str_categoryName=this.obj_delegator.obj_design.str_categoryName;        
        if(str_categoryName!==undefined && str_categoryName!=="Xtra"){
            blnIsProtected=true;
        }
        return blnIsProtected;    
    }    
    fn_addPaletteItem(obj_ini){//required  as is overidden by eazygrid etc                        
        let obj_delegator=this.obj_delegator;

        let obj_item;                         
        
        
        
        obj_delegator.bln_removeId=true;  
        obj_ini.bln_removeId=true;                  
        obj_ini.bln_addPaletterItemEvent=true;
        obj_item=obj_delegator.fn_addItem(obj_ini);

        
        
        if(!obj_item){            
            console.log("obj_item is false, check dynamic content")
            return;
        }        

        //MAY NOT HAVE COMPLETE OBJECT INITIALIZATION , IF SERVER GRAB
        //DO NOT CALL SET PALETTE SELECTED HERE
        return obj_item;
    }
    
    fn_setup(){//is overriden by project instance         
        //lastStep                        
        //AFTER OBJECT INITIALIZATION
        this.fn_addEventListenerDesign();                          
        //PaletteSelected is first set in Palette fn_listPinnedComponent       
        
        this.fn_removeId();

        if(this.obj_delegator===obj_project){
            if(window.parent){            
                window.parent.obj_project.fn_projectTarget_onLoad();//notify parent design component                 
            }
        }
        
    }     
    
    
    fn_onLoadItem(obj_item){                        
    }
    fn_removeId(){      

        let obj_delegator=this.obj_delegator;
        this.fn_removeIdFromItem(obj_delegator);
    }
    fn_removeIdFromItem(obj_item){      

        //calld from a number of funcitons including setup        

        let bln_locked=obj_item.obj_design.bln_lockComponent;              
        bln_locked=obj_shared.fn_parseBool(bln_locked);
        if(bln_locked){        
          //console.log("bln_locked");          
          if(obj_item.bln_removeIdXDesign){
            obj_item.bln_removeIdXDesign=false;
            obj_item.fn_setIDXDesign();
          }
          return;
        }         

        let bln_removeId=obj_item.bln_removeId;
        bln_removeId=obj_shared.fn_parseBool(bln_removeId);
        if(!bln_removeId){
            //console.log("bln_removeId is false");        
            return;
        }
        obj_item.bln_removeId=false;  
        
        obj_item.obj_design.int_idRecord=0;                 
        obj_item.obj_design.bln_classController=false;                            
        obj_item.obj_design.bln_editPinRelease=false;                        
        obj_item.obj_design.bln_editPin=true;                
        obj_item.obj_design.bln_palettePinRelease=true;                        
        obj_item.obj_design.bln_palettePin=true;                
        obj_item.obj_design.str_categoryName="";              
        obj_item.obj_design.str_releaseLabel="";                              
        obj_item.obj_design.int_modeExecute=obj_holder.int_modeEdit;        
        
        obj_item.obj_design.str_idXDesign="";
        let str_method="fn_setIDXDesign";
        if(obj_item && obj_item[str_method]){
            obj_item[str_method]();
        }        
        
        let arr=obj_item.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            obj_item=arr[i];          
            obj_item.bln_removeId=true;                            
            this.fn_removeIdFromItem(obj_item);            
        }
    }
    
    fn_debugMap(){
        obj_shared.fn_debugMap(obj_InstanceJSONMap);
    }
    fn_updateMap(ObjectData){

        //console.log("fn_updateMap");

        
        let obj_delegator=this.obj_delegator;        
        let int_idRecord=parseInt(obj_delegator.obj_design.int_idRecord);                
        let obj_test;

        obj_test=obj_shared.fn_getMapItem(obj_InstanceJSONMap, int_idRecord);        
        //console.log("1 obj_test: " + obj_test);
        //console.log(obj_test);

        obj_shared.fn_setMapItem(obj_InstanceJSONMap, int_idRecord, ObjectData);                        
        
        obj_test=obj_shared.fn_getMapItem(obj_InstanceJSONMap, int_idRecord);        
        //console.log("2 obj_test: " + obj_test);
        //console.log(obj_test);
        
        //obj_shared.fn_debugMap(obj_InstanceJSONMap);

    }    
    fn_onPaletteItemClickCapture(){//eventcapture             

        

        if(obj_projectParent.obj_palettSelected){            
            obj_project.obj_designDelegate.fn_setPaletteDeSelected();
        }

        //if(this.obj_delegator===obj_project){
            //obj_project.obj_designDelegate.fn_setPaletteDeSelected();
            //this.fn_deSelectPaletteItems();//deselect all children starting from base
        //}
    }    
    fn_addEventListenerDesign(){

        let obj_delegator=this.obj_delegator;
        //obj_delegator will be the button etc , ie the control which has been added

        
        //this refers to obj_delegator.obj_designDelegate
        let that=this;        

        obj_delegator.dom_obj.addEventListener('mouseenter', function(e){                        
            that.fn_designEventMouseenter();
        });
        obj_delegator.dom_obj.addEventListener('mouseleave', function(e){                        
            that.fn_designEventMouseleave();
        });                
        obj_delegator.dom_obj.addEventListener('click', function(e){                        
            that.fn_designEventClickCapture();
        }, true);
        obj_delegator.dom_obj.addEventListener('click', function(e){                        
            that.fn_designEventClickBubble();
        }, false);
        
        let obj_item;
        let arr=obj_delegator.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            obj_item=obj_delegator.obj_design.arr_item[i];  
            if(obj_item.obj_designDelegate){
                obj_item.obj_designDelegate.fn_addEventListenerDesign();
            }
        }        
    }   
    fn_designEventClickBubble(){        
        //this refers to obj_delegator.obj_designDelegate
        let obj_delegator=this.obj_delegator;        
        //console.log("fn_designEventClickBubble: " + obj_delegator.obj_design.str_name);
        this.fn_onPaletteItemClickBubble();
    }    
        
    fn_onPaletteItemClickBubble(){//eventcapture        
        
        let obj_delegator=this.obj_delegator;

        //console.log("obj_palettSelected: " + obj_projectParent.obj_palettSelected);

        
        
        if(obj_projectParent.obj_palettSelected){                        
            if(this.obj_delegator.obj_design.str_type==="form_button"){
                //console.log("xxx form_button");
                //console.log("obj_projectParent.obj_palettSelected: " + obj_projectParent.obj_palettSelected);
            }
            
            return;            
        }                           
        
        // set item that was clicked to selected
        this.fn_setPaletteSelected();               
    }    

    fn_setPaletteSelected(bln_maintainMap){          

        let obj_delegator=this.obj_delegator;                  

        let  bln_debug_setSelected=false;
        if(obj_delegator.obj_design.str_name=="field"){
            bln_debug_setSelected=true;
        }
        bln_debug_setSelected=false;

        if(bln_debug_setSelected){
            console.log(obj_delegator.obj_design.str_name + ": DESIGN DELEGATE fn_setPaletteSelected");            
        }       
        
        
        

        //this refers to obj_delegator.obj_designDelegate
        obj_delegator.fn_setLevelLimit();                              
        
        if(!obj_projectParent){alert("obj_projectParent is false");return;}

        obj_delegator.obj_holder.bln_maintainMap=bln_maintainMap;        

        
        if(!obj_project.obj_designDelegate){alert("obj_project.obj_designDelegate is false");return;}
        //console.log("obj_project.obj_designDelegate: " + obj_project.obj_designDelegate)       
        
        
        //is this impllicate din lack of save on copy and paste
        if(!obj_project.obj_palettSelected){
            obj_project.obj_designDelegate.fn_setPaletteDeSelected();         
        }
        
        if(obj_delegator.obj_holder.obj_container){                        
            obj_delegator.obj_holder.obj_container.obj_holder.obj_lastItem=obj_delegator;            
        }            
        
        let bln_success=obj_delegator.fn_setModeExecute(obj_holder.int_modeEdit);                                        
        
        if(bln_success && !obj_delegator.fn_getDynamic()){                                                
            //this.fn_setChildrenModeExecute(obj_holder.int_modeEdit, bln_debug_setSelected);//new change to also set children to editable
            this.fn_setParentModeExecute(obj_holder.int_modeEdit, bln_debug_setSelected);//new change to also set aéé parent to editable
        }        
        
        obj_projectParent.fn_markPaletteSelected(obj_delegator);        
        obj_projectParent.fn_onPaletteItemSelected();//update environment, property sheets etc                        
    } 

    fn_setPaletteDeSelected(){          

        //console.log("fn_setPaletteDeSelected");
        let obj_delegator=this.obj_delegator;                  

        if(!obj_projectParent){alert("obj_projectParent is false: fn_setPaletteDeSelected");return;}

        if(obj_projectParent.obj_palettSelected){
            //console.log("fn_setPaletteDeSelected: " + obj_projectParent.obj_palettSelected.obj_design.str_type);                         
        }
        
        obj_projectParent.fn_unmarkPaletteSelected(false);
        obj_projectParent.fn_onPaletteItemDeSelected();//update environment        
        
        
        
        
        
    }        

    
    fn_deSelectPaletteItems(){        
        
        let obj_delegator=this.obj_delegator;

        if(!obj_projectParent.obj_palettSelected){                        
            return;//added 2021-09--12
        }
        //this refers to obj_delegator.obj_designDelegate
        this.fn_setPaletteDeSelected();        
        let arr=obj_delegator.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=obj_delegator.obj_design.arr_item[i];            
            if(obj_item.obj_designDelegate){
                obj_item.obj_designDelegate.fn_deSelectPaletteItems();
            }
        }
    } 
    
    fn_setPaletteSelectedLocalHome(){
        
        let obj_localHome;

        obj_localHome=this.obj_delegator.fn_getLocalHome();        

        let obj_delegator=this.obj_delegator;
        
        let obj_item=obj_projectParent.obj_palettSelectedLast;//we need to do this as the item clicked will run theevent each time
        if(obj_item){                        
            if(obj_item.fn_isLocalHome()){
                obj_delegator=obj_item;
            }
        }
        
        obj_localHome=obj_delegator.fn_getNextLocalHome();        
        
        obj_localHome.obj_designDelegate.fn_setPaletteSelected();
    }
    
    
    fn_setChildrenModeExecute(int_modeExecute, bln_debug_setSelected){    

        let obj_delegator=this.obj_delegator;                          
        
        if(this.obj_delegator.obj_design.str_type==="xapp_dynamic_content"){            
            return;
        }

        if(bln_debug_setSelected){
            console.log(obj_delegator.obj_design.str_name + " fn_setChildrenModeExecute: " + obj_delegator.obj_design.int_modeExecute);
        }

        let obj_item, arr;
        arr=this.obj_delegator.obj_design.arr_item;        
        for(var i=0;i<arr.length;i++){
            obj_item=arr[i];           
            if(obj_item.fn_isLocalHome()){//dont affect other projects
                //continue;
            }
            obj_item.obj_design.int_modeExecute=int_modeExecute;            
            if(obj_item.obj_designDelegate){
                obj_item.obj_designDelegate.fn_setChildrenModeExecute(int_modeExecute, bln_debug_setSelected);
            }
        }
    }    
    fn_setParentModeExecute(int_modeExecute, bln_debug_setSelected){ 

        let obj_delegator=this.obj_delegator;                          
        
        if(this.obj_delegator.obj_design.str_type==="xapp_dynamic_content"){            
            return;
        }
        
        
        obj_delegator.obj_design.int_modeExecute=int_modeExecute;                    

        if(bln_debug_setSelected){
            console.log(obj_delegator.obj_design.str_name + " fn_setParentModeExecute: " + obj_delegator.obj_design.int_modeExecute);
        }

        let obj_container=obj_delegator.fn_getParentComponent();        
        if(!obj_container){return;}        
        if(obj_container.obj_designDelegate){
            obj_container.obj_designDelegate.fn_setParentModeExecute(int_modeExecute, bln_debug_setSelected);
        }
    }    
    
    
    fn_destructDesignComponent(){//cannot go to base object , as used by design process
        let obj_delegator=this.obj_delegator;
        obj_delegator.fn_removeAllContent();        
    }       
    
    fn_designEventScroll(){        
    }    
    fn_designEventMouseenter(){
    }
    fn_designEventMouseleave(){            
    }
    
    fn_designEventClickCapture(){        
        //this refers to obj_delegator.obj_designDelegate        
        this.fn_onPaletteItemClickCapture();
    }    
    fn_preparePublish(){

        let obj_delegator=this.obj_delegator;
        
        let arr, obj_item;

        if(!obj_delegator.fn_isElement()){
            return;
        }
        
        //let str_designMarker=obj_projectParent.obj_holder.str_prefix;
        //obj_delegator.dom_obj.removeAttribute(str_designMarker + "id");
        //obj_delegator.dom_obj.removeAttribute("idXDesign");
        
        arr=obj_delegator.obj_design.arr_item;
        
        for(let i=0;i<arr.length;i++){
            obj_item=obj_delegator.obj_design.arr_item[i];                                      
            if(obj_item.obj_designDelegate){
                obj_item.obj_designDelegate.fn_preparePublish();            
            }
        }
    }

    fn_viewHTML(){

        let obj_delegator=this.obj_delegator;

        //this refers to obj_delegator.obj_designDelegate
        this.fn_preparePublish();        
        obj_delegator.obj_holder.str_html=obj_delegator.dom_obj.outerHTML;
        alert(obj_delegator.obj_holder.str_html);

    } 

    

    
    fn_parseHTMLContent(str_content=""){                

        //this refers to the "real" target object
        let obj_delegator=this.obj_delegator;

        if(!obj_delegator.fn_isElement()){            
            obj_delegator.dom_obj.data=str_content;
            return;
        }

        obj_delegator.fn_removeAllContent();
        let dom_obj=document.createElement("div");
        
        dom_obj.innerHTML=str_content;   
        
        //console.log("str_content:" + str_content);
        
        var oCol = dom_obj.childNodes;
        for (var i = 0; i < oCol.length; i++) {

            let dom_child, attrib, str_name, str_value, str_type, str_tag, str_text, str_length;
            let obj_ini, obj_item;
            
            dom_child = oCol[i];    
            
            obj_ini=new Holder;                       

            str_text="";            

            switch(dom_child.nodeType){
                case 1://element node                    
                    str_type=dom_child.tagName.toLowerCase();                    
                    str_tag=str_type;                                                    
                    console.log("ELEMENTNODE");                    
                    
                break;
                case 3://3 for text node,                    
                    str_type="textnode";
                    str_tag="text";         
                    str_text=dom_child.data;                       
                    str_length=str_text.length;
                    console.log("textnode"); 
                    /*
            console.log("str_type:" + str_type);
            console.log("str_tag:" + str_tag);
            console.log("str_text:[" + str_text + "]");
            console.log("str_length:[" + str_length + "]");
            //obj_shared.fn_enumerateObject(obj_ini);            
            //*/                               
            
                if (str_text.match(/^\s*$/)){
                console.log("Blank Text Node");
                //continue;
                }
                break;                
                case 8://8 for comment node,
                    str_type="comment";
                    str_tag="<!--"
                    str_text=dom_child.data;                                        
                    console.log("comment node");                                                         
                break;                
                default:
                    //console.log("node Type: " + dom_child.nodeType);
                    str_type="tag";
                    str_tag="tag";
                    console.log("tag node");
                    //continue;
            }            

            obj_ini.obj_design.str_type=str_type;
            obj_ini.obj_design.str_tag=str_tag;
            obj_ini.obj_design.str_content=str_text;            
            
            obj_delegator.obj_designDelegate.fn_parseHTMLContentCreateStyle(dom_child, obj_ini.obj_domStyle);
                
            //*
            if(dom_child.attributes){
            for (var j = 0; j < dom_child.attributes.length; j++) {
                attrib = dom_child.attributes[j];                 
                str_name=attrib.name;                                
                if(str_name){
                    str_value=attrib.value;                
                    if(str_name=="style"){}
                    else{
                        
                        obj_ini.obj_domProperty[str_name]=str_value;            
                        //obj_ini.obj_domAttribute[str_name]=str_value;            
                        //console.log("attrib: " + str_name + ":" + str_value);
                    }
                }
            }
            }   
            //*/            

            /*
            console.log("str_type:" + str_type);
            console.log("str_tag:" + str_tag);
            console.log("str_text:" + str_text);
            //obj_shared.fn_enumerateObject(obj_ini);            
            //*/
            
            
            obj_item=obj_delegator.fn_addItem(obj_ini);//ServerSideItem  

            if(obj_item.obj_designDelegate){
                obj_item.obj_designDelegate.fn_addEventListenerDesign(); 
            }
            
            if(obj_item.fn_isElement()){
                obj_item.obj_designDelegate.fn_parseHTMLContent(dom_child.innerHTML);
            }
        }
        dom_obj.remove();
        
    }             
    
    fn_parseHTMLContentCreateStyle(dom_obj, obj_domStyle){

        let obj_delegator=this.obj_delegator;

        if(!dom_obj){return;}
        if(!dom_obj.getAttribute){return;}

        let style=dom_obj.style;
        let str_style, str_name, str_value;
        let i, arr_parts, arr_subParts, str_part;        
        str_style=dom_obj.getAttribute("style");        
        
        if(!str_style){
            str_style="";            
        }
        if(!str_style.length){return;}

        let arr_split, str_split, arr_trim;
        arr_split = str_style.split(";");              
        str_split;
        arr_trim=[];
        for (let i=0;i<arr_split.length;i++) {
            str_split=arr_split[i].trim();            
            if(!str_split.length){continue;}
            arr_trim[i]=str_split;                
        }                        
        arr_parts=arr_trim.sort();                      
        for (i=0;i<arr_parts.length;i++) {
            str_part=arr_parts[i];            
            if(!str_part.length){continue;}                  
            arr_subParts = str_part.split(':');                            
            str_name=arr_subParts[0].trim();
            str_value=arr_subParts[1].trim();
            //console.log("style: " + str_name + ":" + str_value);
            obj_domStyle[str_name]=str_value;                            
        }
    }     

    fn_defaultXtra(str_value){
        if(str_value===""){str_value="Xtra";}
        return str_value;
    }    

    fn_defaultNotSet(str_value){
        if(str_value===""){str_value="notset";}
        return str_value;
    }    
    fn_defaultNotSetDate(str_value){
        if(str_value===""){
            str_value=obj_shared.fn_getDate(obj_const.int_dateNow);
        }
        return str_value;
    }       

    fn_setList(str_value, bln_disallowSpace=true){                
        
        str_value=this.fn_defaultNotSet(str_value);                                
        if(bln_disallowSpace){            
            str_value=str_value.toLowerCase();        
            str_value=obj_shared.fn_replace(str_value, " ", ",");                               
        }        
        str_value=obj_shared.fn_formatString(str_value, obj_const.int_alphaNumericComma);
        str_value=obj_shared.fn_formatUniqueList(str_value);                        
        
        return str_value;        
    }    
    
    fn_setClassList(str_value){                
        this.obj_delegator.obj_design.str_classList=this.fn_setList(str_value);
    }            
    fn_setClassExtend(str_value){
        str_value=this.fn_defaultNotSet(str_value);                
        str_value=obj_shared.fn_formatShortName(str_value);                    
        this.obj_delegator.obj_design.str_classExtend=str_value;
    }    
    fn_setCreatedDate(str_value){
        str_value=this.fn_defaultNotSetDate(str_value);                
        str_value=obj_shared.fn_formatShortDate(str_value);                    
        this.obj_delegator.obj_design.str_createdDate=str_value;
    }
    fn_setModifiedDate(str_value){
        str_value=this.fn_defaultNotSetDate(str_value);                
        str_value=obj_shared.fn_formatShortDate(str_value);                    
        this.obj_delegator.obj_design.str_modifiedDate=str_value;
    }    

    fn_setText(str_value){
        str_value=this.fn_defaultNotSet(str_value);                        
        this.obj_delegator.obj_design.str_text=str_value;
        this.obj_delegator.fn_setText(foo_value);
    }    
    
    fn_setDesignProperty(str_name, foo_value){          

        let obj_delegator=this.obj_delegator;

        switch(str_name){                                                    
            case "str_classExtend":            
                this.fn_setClassExtend(foo_value);                                                
                return; 
            case "str_classList":            
                this.fn_setClassList(foo_value);                                                                
                return;                            
            case "str_categoryName":            
                foo_value=this.fn_defaultXtra(foo_value);                                    
                break;
            case "str_createdDate":            
                this.fn_setCreatedDate(foo_value);                                                
                return; 
            case "str_modifiedDate":            
                this.fn_setModifiedDate(foo_value);                                                
                return; 
            case "str_name":                
                foo_value=this.obj_delegator.fn_setName(foo_value);                                
                if(!foo_value){return;}
                //return;
            case "str_nameRegistrator":                
                foo_value=this.fn_defaultNotSet(foo_value);                        
                break;            
            case "str_tag":
                this.obj_delegator.fn_setTag(foo_value, true);                                                
                return;  
            case "str_text":                
                foo_value=this.fn_defaultNotSet(foo_value);                        
                this.obj_delegator.fn_setText(foo_value);
                return;
            case "str_type":                                 
                this.obj_delegator.fn_setType(foo_value);                                                
                return;              
        }

        foo_value=obj_shared.fn_parseBool(foo_value);                               
        console
        obj_delegator.fn_setDesignProperty(str_name, foo_value);//call the component function


        if(obj_delegator.obj_design.obj_type==="eazygriditem"){
            if(obj_delegator.obj_holder.obj_container){
                obj_delegator.obj_holder.obj_container.fn_applyFeatures();
              }
        }
        
    }


      
    //END DESIGN FUNCTIONS AND EVENTS
    
    
}//END CLS
//END DesignDelegate.js


//START GlobalVariable.js
//write component specific globals here
var obj_projectTarget;
var obj_projectParent;
//write component specific globals here
//END GlobalVariable.js

