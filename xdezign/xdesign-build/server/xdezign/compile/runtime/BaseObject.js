class BaseObject extends LevelObject{
    constructor(obj_ini) {
        super(obj_ini); 
        
        this.fn_initialize(obj_ini);
        //1234
        
    }    
    fn_initialize(obj_ini){                           
        
        this.obj_ini=obj_ini;//required   
        if(!this.obj_holder){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_holder=new Holder;//required
        }     
        if(!this.obj_ini.obj_holder){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_ini.obj_holder=new Holder;//required
        }     
        //this.obj_holder.bln_loaded=false;
        
        //START INITIALIZE DESIGN        
        this.obj_design=obj_ini.obj_design;                
        if(!this.obj_design){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_design={};//required        
        }     
        if(this.obj_design.arr_item===undefined){
            this.obj_design.arr_item=[];
        }      
        if(this.obj_design.arr_item.length===0){
            //this.obj_design.arr_item=[];
        }           

        this.obj_themeStructure=new Object;
        
        //this.fn_setIsContainer(false);               

        if(this.obj_design.str_idXDesign===undefined){this.fn_setIDXDesign();}
        if(this.obj_design.str_idXDesign===""){this.fn_setIDXDesign();}
        if(this.obj_design.str_name==undefined){this.obj_design.str_name=undefined;}//ensure visible place holder at front of object defintion
        if(this.obj_design.str_nameRegistrator==undefined){this.obj_design.str_nameRegistrator="notset";}//ensure visible place holder at front of object defintion
        if(this.obj_design.str_nameShort==undefined){this.obj_design.str_nameShort="notset";}//ensure visible place holder at front of object defintion
        

        //*        
        if(this.obj_design.str_idProject==undefined){this.obj_design.str_idProject="notset";}        
        if(obj_project){
            if(obj_project.obj_design.bln_isContextHolder){this.obj_design.str_idProject="notset";}
            else if(this.obj_design.str_idProject==="notset" && this!==obj_project && !this.obj_design.bln_isContextHolder){
                this.obj_design.str_idProject=obj_project.obj_design.str_idXDesign;
            } 
            
            if(obj_project.obj_design.str_type==="xapp_theme"){this.obj_design.bln_isThemeItem=true;}
        }
        //*/
        
        if(this.obj_design.str_type===undefined){this.obj_design.str_type=undefined;}//ensure visible place holder at front of object defintion
        if(this.obj_design.str_themeType===undefined){
            if(this.obj_design.str_type==="tag"){
                this.obj_design.str_themeType=this.obj_design.str_tag;
            }
            else{
                this.obj_design.str_themeType=this.obj_design.str_type;
            }
        }        
        
        if(this.obj_design.str_tag===undefined){this.obj_design.str_tag=undefined;}//ensure visible place holder at front of object defintion                               
        
        
        if(this.obj_design.str_content===undefined){this.obj_design.str_content="";}                
        
        
        //if(this.obj_design.str_content==="<p><br></p>"){this.obj_design.str_content="";}
        
        this.obj_design.int_modeExecute=obj_ini.obj_design.int_modeExecute;         
        if(this.obj_design.int_modeExecute===undefined){this.obj_design.int_modeExecute=undefined;}  
             

        //Start Click E-vent
        this.obj_holder.bln_listenClick=obj_ini.obj_holder.bln_listenClick;
        if(this.obj_holder.bln_listenClick===undefined){this.obj_holder.bln_listenClick=undefined;}
        //End Click E-vent

        //Start Change E-vent
        this.obj_holder.bln_listenChange=obj_ini.obj_holder.bln_listenChange;
        if(this.obj_holder.bln_listenChange===undefined){this.obj_holder.bln_listenChange=undefined;}                       
        //End Change E-vent

        
        //Start E-vent Management
        //Optional: LinkId refers to the target component for theevent
        //often used for to link a component to a  xapp_dynamic_content control.
        this.obj_design.str_linkId=obj_ini.obj_design.str_linkId;
        if(this.obj_design.str_linkId===undefined){this.obj_design.str_linkId=undefined;}       
        //End E-vent Management        
        
        //this.obj_holder.str_nameFileServer="abc.php"; define here or in class definition to overide default path file name
        //END INITIALIZE DESIGN        
        
        //START INITIALIZE DOM PROPERTY
        this.obj_domProperty=obj_ini.obj_domProperty;                              
        if(!this.obj_domProperty){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_domProperty={};//required
        }     
        //END INITIALIZE DOM PROPERTY

        //START INITIALIZE DOM ATTRIBUTE
        this.obj_domAttribute=obj_ini.obj_domAttribute;   
        if(!this.obj_domAttribute){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_domAttribute={};//required
        }                                     
        //END INITIALIZE DOM ATTRIBUTE
        
        //START INITIALIZE STYLE        
        /*
        DONT set str_height, str_width, str_padding on base object         
        AVOID specified values here. Leave them undefined. Allow sub class to overidde undefined.
        //*/
        this.obj_domStyle=obj_ini.obj_domStyle;
        if(!this.obj_domStyle){//ensure continuity of obj_holder variables e.g obj_holder.obj_container
            this.obj_domStyle={};//required            
        }     
        //END INITIALIZE STYLE        
        
        //No need to show if negative                 
        this.obj_design.bln_dynamicPin=obj_ini.obj_design.bln_dynamicPin;        
        if(this.fn_getDynamic()){
            this.fn_initializeDynamic();
        }   
        
        this.fn_holdEvent();                  
    }        

    fn_initializeDynamic(){}//overidden        

    fn_getIDXDesign(){
        
        return this.obj_design.str_idXDesign;
    }
    

    fn_setIDXDesign(str_idXDesign=false){
        
        if(!str_idXDesign){
            this.obj_design.str_idXDesign=obj_shared.fn_getUniqueId("myId");
        }
        
        this.fn_setDomProperty("Id", this.obj_design.str_idXDesign);
        
    }
    fn_debugProp(foo_val="", str_property){        
        console.log(this.fn_getDebugText(foo_val, str_property));
    }    
    fn_debugName(foo_val){        
        console.log(this.fn_getDebugText(foo_val, "str_name"));
    }    
    fn_debugType(foo_val){        
        console.log(this.fn_getDebugText(foo_val, "str_type"));
    }    
    fn_debugText(foo_val){        
        console.log(this.fn_getDebugText(foo_val, "str_text"));
    }    

    fn_getDebugText(foo_val="", str_property){        
        
        let str_label=this.obj_design[str_property];
        
        if(!str_label){            
            str_label=this.obj_design.str_name;
        }
        
        return (str_label + ": " + foo_val);
    }

    

    //START CONTAINER FUNCTION
    fn_addItem(obj_ini){        
        
        
        if(obj_ini==undefined){
            return;
        }        
        
        let obj_item=this.fn_createChildObject(obj_ini);

        if(this.fn_getDynamic()){         
            obj_item.obj_design.bln_dynamicPin=true;
        }

        
        this.fn_createChildDom(obj_item);
        //creae dom object into HTML
        
        //END CREATE DOM ELEMENT        
        obj_item.fn_execute();

        if(this.bln_debugContextItem){        
            //obj_item.fn_debug("xxxx");
        }
                    
        return obj_item;
    }

    fn_checkIni(obj_ini){

        let str_type, int_idRecord, bln_removeId, bln_addPaletterItemEvent, bln_startPosition;        

        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF

        int_idRecord=obj_ini.obj_design.int_idRecord;           
        str_type=obj_ini.obj_design.str_type;                                   
        bln_removeId=obj_ini.bln_removeId;
        bln_addPaletterItemEvent=obj_ini.bln_addPaletterItemEvent;
        bln_startPosition=obj_ini.obj_design.bln_startPosition;                                
        
        if(!obj_ini.obj_design.arr_item){ 
            //console.log("obj_ini.obj_design.arr_item is false");           
            obj_ini=new Holder;            
            obj_ini.obj_design.int_idRecord=int_idRecord;           
            obj_ini.obj_design.str_type=str_type;                                   
            obj_ini.bln_removeId=bln_removeId;            
            obj_ini.bln_addPaletterItemEvent=bln_addPaletterItemEvent;            
            obj_ini.obj_design.bln_startPosition=bln_startPosition;                        
        }        

        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF
        
        return obj_ini;
    }

    fn_createChildObject(obj_ini){

        let str_type, int_idRecord, obj_item, bln_removeId, bln_addPaletterItemEvent, bln_startPosition;         

        

        //*
        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF
        obj_ini=this.fn_checkIni(obj_ini);        
        //PLACE NUMBER 1 WHEN OBJ INI CAN GET KNOCKED OFF
        
        int_idRecord=obj_ini.obj_design.int_idRecord;           
        str_type=obj_ini.obj_design.str_type;                        
        bln_removeId=obj_ini.bln_removeId;
        bln_addPaletterItemEvent=obj_ini.bln_addPaletterItemEvent;
        bln_startPosition=obj_ini.obj_design.bln_startPosition;                        

        //PLACE NUMBER 2 WHEN OBJ INI CAN GET KNOCKED OFF
        if(obj_ini){//see if we can get the correct ini object, partucuarly to ensure the type is correct.
            if(obj_ini.obj_design){
                int_idRecord=parseInt(obj_ini.obj_design.int_idRecord);        
                if(int_idRecord){
                    let ObjectData=obj_shared.fn_getMapItem(obj_InstanceJSONMap,  int_idRecord);//get a reference to the the object that has been published from the db                                            
                    if(ObjectData){
                        //console.log(ObjectData);
                        //console.log("get new ini from map object");                                   
                        var NewObjectData=JSON.parse(JSON.stringify(ObjectData));        
                        if(NewObjectData.obj_design){
                            obj_ini=NewObjectData;
                        }
                    }
                }
            }
        } 
        //*/

        //PLACE NUMBER 2 WHEN OBJ INI CAN GET KNOCKED OFF
        
        obj_ini.bln_removeId=bln_removeId;      
        obj_ini.bln_addPaletterItemEvent=bln_addPaletterItemEvent;  
        //obj_ini.obj_design.str_type=str_type;
        obj_ini.obj_design.bln_startPosition=bln_startPosition;          

        //console.log("str_type: " + str_type);
        if(str_type==="xapp_theme"){//hide any theme                                 
            if(obj_ini.obj_domStyle){                     
                obj_ini.obj_domStyle.display="none";            
            }
        }        
        
        try {                        
            obj_item = new (obj_ComponentMap.get(str_type))(obj_ini);            
            //obj_item = new (obj_ComponentMap.get(str_type))();            
        }        
        catch(err) {                           
            if(str_type!=="tag"){                
                console.log("SUBSTITUTING Tag: " + obj_ini.obj_design.str_type);                            
                console.log("str_type: " + str_type);            
                console.log({ name: err.name, message: err.message });
                console.log("Attempt to correct by resaving parent object.");                            
            }
            obj_item = new tag(obj_ini);  //consider implementing special tag and get from server with id                      
        }   
        
        //create the dom with the informaiton saved into parent component
        if(!obj_item){
            console.log("Error: Object Creation");
            return;
        }
        
        obj_item.fn_setParentComponent(this);                

        if(this.fn_getDynamic() || this.fn_hasDynamicParent()){                    
            if(obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){            
                obj_item.obj_design.int_modeExecute=obj_holder.int_modeReadOnly;                     
            } 
        } 
        
        if(obj_item.obj_design.int_modeExecute===undefined){      //baseobjects will get parents modeExecute            
            obj_item.obj_design.int_modeExecute=this.obj_design.int_modeExecute;                     
        }   
        
        

        return obj_item;
    }

    fn_createChildDom(obj_item){//not overiddn

        let str_type=obj_item.fn_getType();              
        //let str_tag=obj_item.fn_getTag();

        //Following options:            
        //START CREATE DOM ELEMENTyy
        //To Do
        //1. Creating Own Tag                 
        //2. Use Exisitng Tag and Allow/DisAllow manipulation of this e.g color, padding etc
        //*/
        let int_index, int_remove=0;        
        switch(str_type){  
            case "tablerow"://assumes table is adding                                
                //POSITION DOM ELEMENT                
                int_index=this.obj_design.arr_item.length;
                this.obj_design.arr_item.splice(int_index, int_remove, obj_item);                
                obj_item.dom_obj = this.dom_obj.insertRow();                                
            break;            
            case "tablecell"://assumes row is adding
                //POSITION DOM ELEMENT                
                int_index=this.obj_design.arr_item.length;
                this.obj_design.arr_item.splice(int_index, int_remove, obj_item);
                obj_item.dom_obj = this.dom_obj.insertCell();                
            break;                                    
            default:
                switch(str_type){//.nodeType
                    case "textnode":
                        obj_item.dom_obj = document.createTextNode(obj_item.obj_design.str_content);                        
                        break;
                    case "comment":
                    obj_item.dom_obj = document.createComment(obj_item.obj_design.str_content);                                                      
                        break;
                    default:
                        obj_item.dom_obj = document.createElement(obj_item.obj_design.str_tag);                                                      
                        break;
                }                                            
                //POSITION DOM ELEMENT                                
                this.fn_positionDomElement(obj_item);
                //We need to get the item dom into the page, as fn_create_self may be overriden        
        }
        
        obj_item.dom_objContent=obj_item.dom_obj;//potentially not necessary as this should be set in createSelf
        obj_item.bln_removeId=this.bln_removeId;                
        obj_item.bln_debug_removeId=this.bln_debug_removeId;        

        this.fn_setIDXDesign(this.fn_getIDXDesign());
    }

    fn_positionDomElement(obj_item){  
        //Part of  the Add Item Process
        //allows child item to be inserted at a position in the item array and the parent container
        
        let int_index, int_remove=0;        
        
        if(this.obj_holder.obj_insertNextTo){
            let obj_insertNextTo=this.obj_holder.obj_insertNextTo;
            int_index = this.fn_findItemIndex(obj_insertNextTo);
            obj_insertNextTo.dom_objContent.before(obj_item.dom_obj);
            this.obj_design.arr_item.splice(int_index, int_remove, obj_item);
            this.obj_holder.obj_insertNextTo=false;
            return;
        }

        let bln_endPosition=true;        
        let bln_startPosition=obj_item.obj_design.bln_startPosition;        

        if(obj_item.blnDebugPosition){
            console.log("obj_item.obj_design.bln_startPosition: " + obj_item.obj_design.bln_startPosition);
        }
        
        if(bln_startPosition){
            bln_endPosition=false;
        }        

        if(obj_item.obj_design.str_type==="xapp_theme"){
            bln_endPosition=false;
        }                
        
        if(bln_endPosition){//End
            int_index=this.obj_design.arr_item.length;
            this.dom_objContent.append(obj_item.dom_obj);                
        }
        else{//Start            
            int_index=0;
            this.dom_objContent.prepend(obj_item.dom_obj);
        }                

        this.obj_design.arr_item.splice(int_index, int_remove, obj_item);

        /* 
        //useful for future insert funciton ?
        if(obj_ini.obj_ItemTemplate){//to do with the mask maybe
        int_index_object = this.fn_findItemIndex(obj_ini.obj_ItemTemplate);
        if(bln_startPosition){//After
        int_index=int_index_object+1;
        obj_ini.obj_ItemTemplate.fn_positionAfter(obj_item);
        }
        else{//Before
        int_index=int_index_object;
        obj_ini.obj_ItemTemplate.dom_objContent.before(obj_item.dom_obj);
        }
        this.obj_design.arr_item.splice(int_index, int_remove, obj_item);
        }
        //*/
    }
    //END CONTAINER FUNCTION
    
    
    //START CHILD FUNCTION
    fn_isElement(){return this.dom_obj.nodeType===1;}
    
    fn_execute(){//overidden by component object - but not called by component object
     // should always be overidden so not necxessay to have any funciton here
    }  

    fn_createSelf(){//can be overidden, but should be called 
        

        //dom object must be in place by now        

        if(!this.fn_isElement()){return;}        

        this.dom_objContent=this.dom_obj;//can be overidden to be another than own dom obj
        this.dom_objContentContainer=this.dom_objContent;

        //let str_designMarker=obj_project.obj_holder.str_prefix;//needs to go into design object        
        //this.dom_obj.setAttribute("str_designMarker + "id"", this.obj_design.str_idXDesign);                            
        //this.dom_obj.setAttribute("idXDesign", this.obj_design.str_idXDesign);                    
        
        this.fn_setEventAttributes();        
        
        if(this.obj_design.str_linkId!==undefined){
            this.dom_obj.setAttribute("linkId", this.obj_design.str_linkId);                      
        }
        
        
        this.fn_setHTMLContent();
        

        //BY THIS POINT THE ITEM WILL HAVE AN ELEMENT, INSERTED IN THE DOM                
        this.fn_onLocateInDom();
        
    }
    fn_onLocateInDom(){//overidden to do nothing in project instance          
        //this is essential to fire on any published object.
        //called at end of create self
        //console.log(this.obj_design.str_type);        
        
        
        this.fn_addEventListener();
    }  
    
    fn_beforeAddChildren(){        
    }

    fn_onOpenInstance(){//not overidden by component
        
        //quesiton: should we validate with project before or after loading children
        //currently it is before

        this.fn_beforeAddChildren();
        
        if(this.obj_design.arr_item.length===0 ){            
            //for component, if no server trip, (due to recordid=0), length will be zero. Otherwise , the server trip will have completed, arr_item will be full
            //other objects can have default add children methods
            //therefoere we avoid the need to overide this for component using intiIdRecord=0            
            this.fn_bootChildren();                        
        }
        else{
          this.fn_loadChildren();//if obj_design.arr_item is in place, eg from JSON seriolization
        } 
        
        
        //OCCURS AFTER LOAD CHILDREN
        this.fn_onLoad();//validate //pulgins //etc after loading children

        
    }

    fn_loadChildren(){

        let obj_ini, obj_item;
        let arr_ini;
        arr_ini=this.obj_design.arr_item.slice();//creat ea temporary copy of obj_design.arr_item which will contain "ini objects"
        this.obj_design.arr_item=[];//reset this arr item to empty array .

        arr_ini.forEach(obj_ini => {            
            if(obj_ini){
                //obj_shared.fn_enumerateObject(obj_ini.obj_design, "BaseObject fn_loadChildren");                                                                
                obj_item=this.fn_addItem(obj_ini);//ServerSideItem or BootItem
            }
            else{                                
                if (obj_ini === null){
                    console.log("BaseObject fn_loadChildren OBJ INI IS NULL");                                                
                    
                }                
            }
         });

         
        /*
        let arr_item=this.obj_design.arr_item;
        if(arr_item.length){
            this.obj_holder.obj_lastItem=this.obj_design.arr_item[0];
        }
        //*/
    } 

    fn_expandMultiple(int_number){
        if(this.obj_design.bln_expand){                                
            let str_fontSize;            
            str_fontSize="1.2rem";                   
            let int_padding=10;
            let int_paddingExpand=(int_padding*int_number);                                          
            this.fn_setStyleProperty("padding", +int_paddingExpand+"px");        
            this.fn_setStyleProperty("font-weight", "bold");        
            this.fn_setStyleProperty("font-size", str_fontSize);        
            
          }
      }
    
    
      fn_expand(){        
      }
    
    fn_onLoad(){//can be overriden , but should be called                      

        
        this.fn_applyFeatures();//apply style, them, domproperties etc // this appears to not ref to children        
        this.fn_initializePlugins();//attach design helpers etc                
        this.fn_actionRegister();//attach design helpers etc                                
        
        /*//
        //disabling this function for the moment - as not in use
        //this is the end of the object creation process
        //this.obj_holder.bln_loaded=true; 
        let arr, obj_item
        arr=this.obj_design.arr_item;                        
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];                        
            obj_item.fn_onLoadParent();            
        } 
        //*/    
        
        /*
        //add this.obj_domProperty.type==="submit" if start using input submit        
        if(this.obj_design.str_tag==="input" && this.obj_domProperty.type==="submit"){//applies to submt buttons            
            this.fn_setText(this.obj_design.str_value);            
        }                
        //*/
        

        
        if(this.obj_design.str_tag==="button"){//applies to submt buttons            
            this.fn_setText(this.obj_design.str_text);            
        }                
    }   
    fn_initializePlugins(){//can be overidden                
        
        
        let dom_frameElement=window.frameElement;        
        if(!dom_frameElement){
            return;
        }
        let str_name=dom_frameElement.getAttribute("name");        
        
        if(str_name==="xdesign-frame"){//ie a project that is being designed}        
            if(this.obj_design.int_modeExecute<10){
                this.fn_initializePluginDesign();//can be overidden                
                this.obj_designDelegate.fn_setup();//must be 2 separatre functions                                
                //console.log("this.obj_designDelegate: " + this.obj_designDelegate);
            }
        }
    }    
    fn_initializePluginDesign(){//overidden by ProjectInstance and GridItem                        
        this.obj_designDelegate=new DesignDelegate(this);                
    }
    fn_onLoadParent(){}//should be overidden        
    
    fn_actionRegister(){
        
        let obj_item, obj_container, obj_projectLocal;
        
        if(this.obj_design.bln_registerAtContainer===true){
            obj_container=this.obj_holder.obj_container;        
            if(obj_container){                        
                obj_container.fn_registerContainedObject(this);                        
            }
        }        
        if(this.obj_design.str_nameRegistrator!=="notset"){                  
            obj_item=obj_project.fn_findItemByVariableName(this.obj_design.str_nameRegistrator);             
            if(obj_item){                                                
                obj_item.fn_registerObject(this);                        
            }
        }           
        if(this.obj_design.bln_registerAtProject===true &&(this!==obj_project)){              
            /*
            obj_projectLocal=false;  
            let str_idProject=this.obj_design.str_idProject;
            let str_idXDesign=this.obj_design.str_idXDesign;
            if(str_idProject && (str_idProject!==str_idXDesign)){
                obj_projectLocal=obj_project.fn_findItemById(str_idProject);
            }           
            //*/
            obj_projectLocal=obj_project;
            if(obj_projectLocal){                                     
                obj_projectLocal.fn_registerProjectObject(this);                                                    
            }
            
        }
    }
    
    fn_debugDesign(obj_design, str_title=""){                
        
        console.groupCollapsed(str_title);        
        console.log("int_idRecord: " + obj_design.int_idRecord);                
        console.log("str_idXDesign: " + obj_design.str_idXDesign);
        console.log("int_modeExecute: " + obj_design.int_modeExecute);                              
        console.log("bln_isLocalHome: " + obj_design.bln_isLocalHome);                              
        console.log("str_name: " + obj_design.str_name);        
        console.log("str_type: " + obj_design.str_type);        
        console.log("str_tag: " + obj_design.str_tag);        
        console.log("int_axis: " + obj_design.int_axis);        
        console.log("str_classList: " + obj_design.str_classList);        
        console.log("str_themeType: " + obj_design.str_themeType);        
        console.groupEnd();
    }

    fn_debugDom(dom_obj, str_title=""){                
        
        if(!dom_obj){
            console.log("dom_obj is not yet in place");                    
            return;
        }
        console.groupCollapsed(str_title);                
        console.log("outerHTML: " + dom_obj.outerHTML);                
        console.log("innerHTML: " + dom_obj.innerHTML);                
        console.groupEnd();
    }    

    fn_debugTypeItems(){
        let arr, obj_item
        arr=this.obj_design.arr_item;        
        this.fn_debug("DEBUG: " + this.obj_design.str_type);
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];
            obj_item.fn_debugItems();            
        }        
    }    

    fn_debug(str_title=""){                
        
        if(str_title===undefined){str_title=this.obj_design.str_name;}
        let str_name=this.obj_design.str_name;
        if(str_name===undefined){str_name="";}        
        if(str_name){str_title+=": " + str_name;}
        console.groupCollapsed(str_title);        
        console.log("typeof: " + typeof this);
        console.log("constructor: " + this.constructor.name);
        console.log("obj_designDelegate: " + this.obj_designDelegate);                
        this.fn_debugDesign(this.obj_design, "Design");              
        this.fn_debugDom(this.dom_obj, "Dom");   


        let arr, obj_item
        arr=this.obj_design.arr_item;        
        //this.fn_debug("DEBUG: " + this.obj_design.str_type);
        console.log("begin debug arr_item");                
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];
            if(obj_item.fn_debug){
                obj_item.fn_debug("base debug");            
            }
        }        
        console.groupEnd();
    }
    
    fn_debugAlert(){
        let s="";
        s+="typeof: " + typeof this + "\r";
        s+="str_idXDesign: " + this.obj_design.str_idXDesign + "\r";
        s+="str_type: " + this.obj_design.str_type + "\r";
        alert(s);
    }   
    
    fn_setDebugOperation(bln_value){
        this.obj_holder.bln_debugOperation=bln_value;        
    }           
    fn_getDebugOperation(bln_value){
        return this.obj_holder.bln_debugOperation;
    }           
    

    fn_compileDependentClassList(){
        let str_val="";        
        str_val+=this.fn_listDependentClass();//Get List of Compone Ids
        str_val=str_val.slice(0,-1);                 
        return str_val;
    }
    fn_listDependentClass(){        
        let str_val="";
        let arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];
            if(obj_item.bln_isComponent){
                str_val+=obj_item.fn_listClass();                
            }
            str_val+=obj_item.fn_listDependentClass();
        }                
        return str_val;
    }

    fn_listClass(){

        let str_val, str_classList, str_delim;
        str_val="";
        str_delim=",";                
        str_classList=this.obj_design.str_classList;        
        if(str_classList && str_classList!=="notset"){                
            str_val=str_classList.trim() + str_delim;        
        }
        return str_val;
    }
    
    fn_compileDependentId(){
        let str_val="";        
        str_val+=this.fn_listDependentId();//Get List of Compone Ids
        str_val=str_val.slice(0,-1);         
        return str_val;
    }

    fn_listDependentId(){        
        let str_val="";
        let arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];
            if(obj_item.bln_isComponent){
                str_val+=obj_item.fn_listId();                
            }
            //str_val+=obj_item.fn_listDependentId();
            //dont list child dependents as this may change by external edit of child components
            //we need to rely on a server side aclomergeration
        }                
        return str_val;
    }

    fn_listId(){

        let str_val, int_idRecord, str_delim;
        str_val="";
        str_delim=",";                
        int_idRecord=this.obj_design.int_idRecord;
        if(int_idRecord){                
            str_val=int_idRecord + str_delim;
            //this.fn_debug("Dependentid");
        }
        return str_val;
    }


    fn_validIdHistory(){

        let int_id_record=this.obj_design.int_idRecord;
        if(!int_id_record){return true;}
        let obj_container=this.fn_getParentComponent();
        if(!obj_container){return true;}
        let bln_exist=this.fn_searchIdHistory(obj_container, int_id_record);
        if(bln_exist){return false;}
        return true;
    }

    fn_searchIdHistory(obj_item, str_listIdRecordSearch){

        let bln_debug=false;      
        
        
        let int_idRecord=obj_item.obj_design.int_idRecord;
        
            
        str_listIdRecordSearch+="";
        int_idRecord+="";

        let str_testA="," + int_idRecord + ",";
        let str_testB="," + str_listIdRecordSearch + ",";        
        let bln_val=obj_shared.fn_inStr(str_testA, str_testB);        

        if(bln_debug){            
            console.log("str_listIdRecordSearch: " + str_listIdRecordSearch);
            console.log("int_idRecord: " + int_idRecord);
        }
        
        if(bln_val){            
            return true;
        }
        let obj_parent=obj_item.fn_getParentComponent();
        if(!obj_parent){return false;}

        return this.fn_searchIdHistory(obj_parent, str_listIdRecordSearch);        
    }

    
    fn_getContainer(){

        //duplicate of getParentComponent
        let obj_container=this.obj_holder.obj_container;
        if(obj_container && obj_container.bln_isComponent){
            return obj_container;
        }
        return false;
    }

    fn_setParentComponent(obj_parent){        
        this.obj_holder.obj_container=obj_parent;         
        this.fn_setDebugPin(obj_parent.fn_getDebugPin());        
    }   

    fn_getParentComponent(){

        let obj_parent=this.obj_holder.obj_container;
        if(obj_parent && obj_parent.bln_isComponent){
            return obj_parent;
        }
        return false;

    }
    
    fn_getDeepCopy(obj_template){
        return JSON.parse(JSON.stringify(obj_template));//deep copy            
      }
    
    
    fn_popItem(){
        if(!this.dom_objContent.lastChild){
            return;
        }
        this.dom_objContent.removeChild(this.dom_obj.lastChild);
    }
    fn_positionAfter(obj_item){
        this.dom_objContent.after(obj_item.dom_obj);
    }    
    
    fn_removeChildren(){
        this.fn_removeAllItems();        
    }

    fn_bootChildren(){//in boot phase , and often overidden        
    }    

    fn_removeAllContent(){        
        this.obj_design.str_content="";
        this.dom_objContent.innerHTML="";
        this.dom_objContent.data="";        
        this.dom_objContentContainer.innerHTML="";
        this.obj_design.arr_item=[];        
    }  
    
    fn_removeAllItems(){//use this fuinction to completely clear the children of a container

        let arr, obj_item                
        arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            if(!obj_item){
                //alert("!obj_item");
            }
            else{
                this.fn_removeItem(obj_item);
            }
        }
        this.fn_removeAllContent();//issue here ? as this will set arr to new array
    }     
    fn_removeId(){        
        this.obj_design.int_idRecord=0;                         
        this.fn_setIDXDesign();
        this.fn_removeIdChildren();
    }
    fn_removeIdChildren(){        

        let obj_item, arr;
        
        arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            obj_item.fn_removeId();
        }
    }

    
    
    fn_removeItem(obj_item){

        if(!obj_item){return;}

        obj_item.fn_removeAllItems();
        
        let arr, int_index;
        arr=this.obj_design.arr_item;
        int_index=0;
        if(arr.length){
            int_index=this.obj_design.arr_item.indexOf(obj_item);            
            if (int_index!==(-1)) {                
                arr.splice(int_index, 1);                        
            }
            else{
                alert("error: remove item");//should never see
            }
        }
        obj_item.fn_onRemove();        
        return int_index;
    }   

    fn_onRemove(){
        this.dom_obj.remove();        
    }    

    
    
    fn_getIsContainer(bln_val){
        //equivalent of can have chlidren        
        return this.obj_design.bln_isContainer;
    }    
    
    fn_setIsContainer(bln_val){
        //equivalent of can have chlidren        
        this.obj_design.bln_isContainer=bln_val;                
    }    
    fn_copyArray(arr_source){
        return arr_source.slice();
    }   
    
    fn_getLastItem(){        

        let obj_target=this.obj_holder.obj_lastItem;
        let arr_item=this.obj_design.arr_item;        
        if(!arr_item.length){return false;}        
        if(!obj_target){
            obj_target=arr_item[0];
        }
        return obj_target;
    }     
    fn_getEndItem(){
        
        let arr, obj_item;
        arr=this.obj_design.arr_item;        
        obj_item=this;
        if(arr.length){
            obj_item=arr[arr.length-1];                        
            //obj_item=obj_item.fn_getEndItem();
        }
        return obj_item;
    }

    fn_getStartItem(){
        
        let arr, obj_item;
        arr=this.obj_design.arr_item;        
        obj_item=this;
        if(arr.length){
            obj_item=arr[0];                                    
        }
        return obj_item;
    }

    fn_getLimitLeft(){            
        
        let obj_container, int_index;
        obj_container=this.obj_holder.obj_container;
        if(!obj_container){return true;};
        int_index=obj_container.fn_findItemIndex(this);
        if(int_index<=0){return true;}            
        return false;
      }
      fn_getLimitRight(){                                
        let obj_container, int_index;
        obj_container=this.obj_holder.obj_container;
        if(!obj_container){return true;};
        int_index=obj_container.fn_findItemIndex(this);
        if(int_index===obj_container.obj_design.arr_item.length-1){return true;}
        return false;
      }      
      fn_getLimitTop(){                        
        let obj_container=this.obj_holder.obj_container;        
        if(!this.obj_holder.obj_container){return true;}      
        if(this===obj_project){return true;}                        
        return false;
      }
      fn_getLimitBottom(){                
        let arr=this.obj_design.arr_item;       
        let bln_has_grandChildren;
        if(!arr.length){return true;}        
        return false;
      }
      fn_getLimitGrandChild(){
        let bln_has_grandChild=this.fn_hasGrandChild();
        if(!bln_has_grandChild){return true;}        
        return false;
      }
      fn_hasGrandChild(){        
        let arr, int_val, obj_item;        
        arr=this.obj_design.arr_item;        
        for(let i=0;i<arr.length;i++){
            obj_item=arr[i];
            int_val=obj_item.obj_design.arr_item.length;
            if(int_val>0){return true;}
        }
        return false;
    }
    fn_setLevelLimit(){        
        
        let obj_levelLimit=new Object;              
        obj_levelLimit.obj_item=this;        
        obj_levelLimit.bln_limitTop=this.fn_getLimitTop();      
        obj_levelLimit.bln_limitLeft=this.fn_getLimitLeft();      
        obj_levelLimit.bln_limitRight=this.fn_getLimitRight();      
        obj_levelLimit.bln_limitBottom=this.fn_getLimitBottom();     
        obj_levelLimit.bln_limitGrandChild=this.fn_getLimitGrandChild();     
        obj_levelLimit.bln_hasAllLimit=false;
        if(obj_levelLimit.bln_limitTop && obj_levelLimit.bln_limitLeft && obj_levelLimit.bln_limitRight && obj_levelLimit.bln_limitBottom){
            obj_levelLimit.bln_hasAllLimit=true;            
        }
        this.obj_holder.obj_levelLimit=obj_levelLimit;        
    }

    fn_findItemByIdRecord(int_idRecord){        
        var obj_match, obj_item;
        if(this.obj_design.int_idRecord===int_idRecord){
            return this;
        }
        for(var i=0;i<this.obj_design.arr_item.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            obj_match=obj_item.fn_findItemByIdRecord(int_idRecord);
            if(obj_match){
                break;
            }
        }
        if(obj_match){return obj_match;}
        return false;
    }

    fn_isDuplicateObject(obj_a, obj_b){
        let bln_value=true;
        if(obj_a==obj_b){bln_value=false;}
        return bln_value;
    }
    
    fn_findItemById(str_idXDesign){        
        var obj_match, obj_item;
        if(this.obj_design.str_idXDesign===str_idXDesign){
            return this;
        }
        for(var i=0;i<this.obj_design.arr_item.length;i++){
            obj_item=this.obj_design.arr_item[i];            
            obj_match=obj_item.fn_findItemById(str_idXDesign);
            if(obj_match){
                break;
            }
        }
        if(obj_match){return obj_match;}
        return false;
    }

    
    
    fn_getChildItem(str_nameShort){return this.fn_findItemByVariableName(str_nameShort);}
    
    fn_findItemByVariableName(str_nameShort, obj_exclude=false){        
        var obj_match, obj_item;
        
        if(this.obj_design.str_nameShort===str_nameShort){   
            if(obj_exclude && obj_exclude===this){

            }
            else return this;            
        }
        for(var i=0;i<this.obj_design.arr_item.length;i++){
            obj_item=this.obj_design.arr_item[i];                         
            obj_match=obj_item.fn_findItemByVariableName(str_nameShort, obj_exclude);
            if(obj_match){break;}
        }
        if(obj_match){return obj_match;}
        return false;
    }
    fn_findItemIndex(obj_item){
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            if(arr[i]===obj_item){
                return i;
            }
        }
        return -1;
    }    
    
    fn_applyFeatures(){

        //if(this.obj_design.bln_debugDesign){        
            //this.fn_debugText("fn_applyFeatures");
        //}

        //N.B Theme MUST be set to register with Project to run here        
        let obj_contextHolderParent=this.fn_hasContextHolderParent();                
        /*
        if(this.obj_design.bln_debug){                        
            if(obj_contextHolderParent){
                obj_contextHolderParent.fn_debug();
            }
        }
        //*/

        

        if(!obj_project.fn_isContextHolder() && obj_contextHolderParent){        
            //console.log("fn_hasContextHolderParent");            
            return;
        }
        
        
        this.fn_applyTheme();        
        this.fn_applyThemeStructure();                    
        this.fn_applyDesign();                                                                         
        this.fn_applyDomProperty();                                                                         
        //this.fn_applyDomAttribute();
        this.fn_applyStyle();               
        this.fn_expand();
        this.fn_onApplyFeatures();
    }

    fn_holdEvent(){}
    fn_dropEvent(){}

    fn_applyThemeStructure(){                        
    }

    fn_onApplyFeatures(){//overidden        
    }

    fn_applyDesign(){//overidden        
    }

    fn_applyThemeError(str_colorBackground, str_colorBorder="white"){                       

        if(!this.obj_holder.bln_logStyleOnce){
            this.fn_logStyleOutline();                                
        }        
        
        this.fn_setStyleOutline(str_colorBackground, str_colorBorder);                            
    }    
    fn_applyThemeEdit(str_colorBackground, str_colorBorder="white"){                        
        
        this.fn_setStyleOutline(str_colorBackground, str_colorBorder);                    
    }
    fn_removeStyleOutline(){           
                
        this.fn_setStyleProperty("backgroundColor", this.obj_holder.str_backgroundColor);                      
        this.fn_setStyleProperty("borderColor", this.obj_holder.str_borderColor);                      
        this.fn_setStyleProperty("borderWidth", this.obj_holder.str_borderWidth);                      
    }
    fn_logStyleOutline(){   
        this.obj_holder.bln_logStyleOnce=true;                 
        this.obj_holder.str_backgroundColor=this.fn_getComputedStyleProperty("backgroundColor");                          
        this.obj_holder.str_borderColor=this.fn_getComputedStyleProperty("borderColor");                          
        this.obj_holder.str_borderWidth=this.fn_getComputedStyleProperty("borderWidth");                          
    }    
    fn_setStyleOutline(str_colorBackground, str_colorBorder){        
        
        this.fn_setStyleProperty("backgroundColor", str_colorBackground);        
    }    

    

    fn_getThemeObject(str_themeType){   

        return this.fn_applyTheme(str_themeType, true);

    }

    
    
    fn_applyTheme(str_themeType=false, bln_returnThemeItem=false){   
        
        //N.B Theme MUST be set to register with Project to run here
        const bln_debug=this.bln_debugButtonSettings;        
        const obj_theme=obj_project.obj_theme;                
        if(!obj_theme){
            if (bln_debug){console.log("PROJECT THEME IS FALSE" + this.obj_design.str_name);}
            return;
        }
        if(obj_project.obj_design.str_type.toLowerCase()==="xapp_theme"){return;}//dont theme a theme project        

        if(this.obj_design.bln_isThemeItem){return;}//dont theme a theme item            

        const str_type=this.obj_design.str_type.toLowerCase();                
        if(str_type==="xapp_theme"){return;}//dont theme a theme               

        let str_name, obj_themeItem;
        
        
        //*//turn on to debug    
        /*
        if(this.obj_design.str_themeType==="menu_button"){    
            bln_debug=true;        
        }       
        if(this.obj_design.str_name==="form_input_lxogin_emxail"){    
            bln_debug=true;        
        } 
        //*/

        /*
        if(this===obj_project){    
            bln_debug=true;        
        } 
        //*/

        /*
        if(this.obj_design.str_themeType==="menu_button"){    
            bln_debug=true;        
        }       
        //*/
    

        if(this.obj_design.bln_debugDesign){    
            bln_debug=true;        
            console.log("fn_applyTheme");
        }    
        //*/

        /*//turn on to debug
        if(this.obj_design.str_name="xdebug"){
            bln_debug=true;
        }
        //*/
    
        
    
    
    
        str_name=this.obj_design.str_name;    
        if(!str_themeType){
            str_themeType=this.obj_design.str_themeType;        
            if(!str_themeType){str_themeType="notset"};  
        }
  
        if (bln_debug){console.log("START APPLY THEME: [" + str_name + "][" + str_themeType + "]");}    
    
    
        //Match App Item str_themeType to Theme Object str_type                                 
        if(!obj_themeItem && str_themeType!=="notset"){ 
            obj_themeItem=obj_theme.fn_getThemeViaThemeType(str_themeType, bln_debug);                              
            if(obj_themeItem){                
                if (bln_debug){console.log("FOUND THEME ITEM VIA THEMETYPE: [" + str_name + "][" + str_themeType + "]");}

                if(bln_returnThemeItem){                
                    return obj_themeItem;                
                }
            }
        }        

        if(bln_returnThemeItem){
            return false;
        }
    
        //If there is now a Theme Object Item, then clone style to App Item
        let str_success="NO THEME APPLIED";
        if(obj_themeItem){                        
            let str_display=this.obj_domStyle.display;
            this.obj_domStyle=obj_shared.fn_shallowCopy(obj_themeItem.obj_domStyle);        
            this.obj_domStyle.display=str_display;    
            //note: this display needs to be block flex etc for background to be applied                
            str_success="THEME APPLIED";        
            if(bln_debug){
                obj_themeItem.fn_debug("theme item");
                this.fn_debug("apply theme item");
            }
        }
        if (bln_debug){console.log("END APPLY THEME: [" + str_name + "][" + str_success + "]");}

        
  }
  
  fn_getThemeViaThemeType(str_themeType, bln_debug){          
    
    var obj_match, obj_item;    

    if(bln_debug){
        if (this.obj_design.str_themeType){
            //console.log("THEME: [" + this.obj_design.str_name + "][" + this.obj_design.str_themeType + "]");
            console.log("THEME: [" + this.obj_design.str_themeType + "]");
            //console.log("ITEM: [" + str_themeType + "]");                        
        }
    }
    
    if(this.obj_design.str_themeType.toLowerCase()===str_themeType.toLowerCase()){               
        if(bln_debug){
            console.log("SUCCESSFUL MATCH: [" + str_themeType + "]");            
        }
        obj_match=this;    
    }
    else{
        if(bln_debug){
            //console.log("NO MATCH THEMETYPE: [" + this.obj_design.str_themeType + "]");            
        }
    }

    if(obj_match){return obj_match;}
    
    for(var i=0;i<this.obj_design.arr_item.length;i++){
        obj_item=this.obj_design.arr_item[i];                         
        obj_match=obj_item.fn_getThemeViaThemeType(str_themeType, bln_debug);
        if(obj_match){break;}
    }
    if(obj_match){return obj_match;}
    return false;
  } 

  fn_scrollIntoView(){
    this.dom_obj.scrollIntoView();
  }

  fn_scrollTop(int_scrollTop=0){    
    this.dom_obj.scrollTop=int_scrollTop;
  }

  fn_setFocus(){

    this.dom_obj.focus();

  }  

    fn_applyStyle(obj_style){        
        if(!obj_style){
            obj_style=this.obj_domStyle;
        }        
        let arr_Property=Object.entries(obj_style);      
        for (let [str_key, foo_val] of arr_Property) {    
            //make sure camelCase is converted to hyphen prior to this function            
            //console.log(this.obj_design.str_name + ": " + str_key + ": " + foo_val);            
          this.fn_setStyleProperty(str_key, foo_val);          
        }
    }       

    fn_getNumericComputedStyleProperty(str_property){
        let str_value=this.fn_getComputedStyleProperty(str_property);
        return Number(this.fn_getNumericStyle(str_value));
      }
      
      fn_getNumericStyle(str){
        return str.replace("px", "");
      }

    fn_setClassName(str_className){                   
    this.dom_obj.className=str_className;
    }

    fn_setControlStyleProperty(obj_control, str_name, str_value){
        if(obj_control){obj_control.fn_setStyleProperty(str_name, str_value);}            
      }
      fn_getControlStyleProperty(obj_control, str_name, str_value){
        if(obj_control){ return obj_control.fn_getStyleProperty(str_name, str_value);}            
      }
      fn_getControlComputedStyleProperty(obj_control, str_name, str_value){
        if(obj_control){ return obj_control.fn_getComputedStyleProperty(str_name, str_value);}            
      }
      

    fn_getComputedStyleProperty(str_name){                

        const cssObj = window.getComputedStyle(this.dom_obj, null);          
        str_name=obj_shared.fn_camelCaseToHyphen(str_name);// check camel case to hyphen
        return cssObj[str_name];
    }

    fn_getStyleProperty(str_name){                
        str_name=obj_shared.fn_camelCaseToHyphen(str_name);// check camel case to hyphen
        //return this.obj_domStyle[str_name];
        return this.dom_obj.style[str_name];
    }

    fn_removeStyleAttribute(str_name){        
        if(this.dom_obj){
            this.dom_obj.style.removeProperty(str_name);
        }
        delete this.obj_domStyle[str_name];
    }

    fn_removeStyleProperty(str_name){

        if(this.dom_obj){this.dom_obj.style.removeProperty(str_name);}        
    }

    fn_setStyleProperty(str_name, str_value, str_priority){

        delete this.obj_domStyle[str_name];//remove the item from virtualdom (e.g. camelCased property name)
        
        /*
        if(!str_value){//allow undefined for most style attributes                                      
            this.fn_removeStyleAttribute(str_name);            
            return;
        } 
        //*/     
        
        str_name=obj_shared.fn_camelCaseToHyphen(str_name);// check camel case to hyphen
        
        switch(this.fn_getType()){
            case "eazygrid":
                if(str_name==="background-color"){
                    this.fn_setItemStyleProperty("eazygrid", "background-color", str_value);        
                }
            break;            
        }        

        this.obj_domStyle[str_name]=str_value;                
        if(this.dom_obj){this.dom_obj.style.setProperty(str_name, str_value, str_priority);}
    }        
    
    fn_applyDomProperty(){                     
        let arr_Property=Object.entries(this.obj_domProperty);      
        for (let [str_key, foo_val] of arr_Property) {              
            switch(str_key){                
                case "innerText":
                case "innerHTML":                                    
                    if(this.obj_design.arr_item.length){
                        continue;
                    }                    
                    break;
                default:
                    break;
            }
            this.fn_setDomProperty(str_key, foo_val);            
        }        
    }
    
    fn_getDomProperty(str_name){           
        return this.obj_domProperty[str_name];        
    }

    fn_removeDomProperty(str_name){        
        if(this.dom_obj){            
            this.dom_obj.removeAttribute(str_name);               
            this.dom_obj[str_name]=undefined;                                      
        }
        delete this.obj_domProperty[str_name];
        //delete this.obj_domAttribute[str_name];
    }

    fn_setDomProperty(str_name, foo_value){                          

        let bln_value;

        if(!this.obj_domProperty){
            return;
         }  
         

        //VIRTUAL DOM
        delete this.obj_domProperty[str_name];//remove the item from virtualdom         
        this.obj_domProperty[str_name]=foo_value;                
        //VIRTUAL DOM               
        
        
        switch(str_name.toLowerCase()){
          case "disabled":
            bln_value=obj_shared.fn_parseBool(foo_value);                        
            this.fn_beforeDomPropertyDisabled(bln_value);
            //DOM
            if(this.dom_obj){                                   
                if(bln_value){
                    this.dom_obj.setAttribute(str_name, bln_value);
                    this.dom_obj[str_name]=bln_value;                                        
                }
                else{                    
                    this.dom_obj.removeAttribute("disabled");
                }                
                this.dom_obj.disabled=bln_value;                
            }                  
            //DOM                        
            this.fn_afterDomPropertyDisabled(bln_value);
            break;
          default:            

            /*
            if(!foo_value){//allow undefined for most style attributes                                                  
                this.fn_removeDomProperty(str_name);            
                return;
            } 
            //*/     

            //DOM
            if(this.dom_obj){
                this.dom_obj.setAttribute(str_name, foo_value);
                this.dom_obj[str_name]=foo_value;//this is required for html button innerText to work                              
            }                  
            //DOM            
        }
    }    
    
    
    fn_enableAllFlex(){            
        this.fn_setDisplayFlex(true);        
        if(this.obj_holder.bln_debugNavigate){
            this.fn_debugText("xxx fn_enableAllFlex");
        }
        this.fn_setDisabled(false);
    }      

    fn_enableAll(){               
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_enableAll");
        }
        this.fn_setDisplay(true);        
        this.fn_setDisabled(false);        
    }      
    fn_disableAll(){                  
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_disableAll");
        }
        this.fn_setDisplay(false);        
        this.fn_setDisabled(true);        
    }      

    fn_setEnabled(bln_value=true, bln_enableChildren=false){          
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_setEnabled: " + bln_value);
        }
        if(!bln_value){            
            this.fn_setDisabled(true);
            return;
        }        

        if(bln_enableChildren){
            let arr_item=this.obj_design.arr_item;        
            for(let i=0;i<arr_item.length;i++){                    
                let obj_item=arr_item[i];                    
                obj_item.fn_setEnabled(bln_value, bln_enableChildren);
            }
        }
        
        bln_value=obj_shared.fn_flipBool(bln_value);
        this.fn_setDomProperty("disabled", bln_value);                       
    }  

    fn_setDisabled(bln_value=true, bln_disableChildren=false){ 
        if(this.obj_holder.bln_debugNavigate){        
            this.fn_debugType("fn_setDisabled: " + bln_value);
        }
        
        if(!bln_value){
            this.fn_setEnabled(true);
            return;
        }         
        if(bln_disableChildren){
            let arr_item=this.obj_design.arr_item;        
            for(let i=0;i<arr_item.length;i++){                    
                let obj_item=arr_item[i];                    
                obj_item.fn_setDisabled(bln_value, bln_disableChildren);
            }
        }

        this.fn_setDomProperty("disabled", true);                                  
    }        

    fn_beforeDomPropertyDisabled(bln_value=false){                                     
          
        if(!this.obj_holder.obj_enabled){            
          this.fn_recordDomProperty();
        }
    }                       


    fn_recordDomProperty(){                                                       
        
        let obj_enabled=new Object;        
        this.obj_holder.obj_enabled=obj_enabled;
        
        const computedStyle = window.getComputedStyle(this.dom_obj);                                     
        obj_enabled.pointerEvents = computedStyle.getPropertyValue("pointer-events");
        if(obj_enabled.pointerEvents==="none"){obj_enabled.pointerEvents="auto";}
        obj_enabled.cursor = computedStyle.getPropertyValue("cursor");                                          
        obj_enabled.color = this.fn_getComputedStyleProperty("color");        
      }

    fn_afterDomPropertyDisabled(bln_value){
        
        if(this.obj_holder.bln_debugNavigate){
          this.fn_debugText("fn_afterDomProperty_disabled: " + bln_value);
        }
        switch(bln_value){
          case true:              
              this.fn_setStyleProperty("pointer-events", "none");                  
              this.fn_setStyleProperty("cursor", "default");                                                    
              this.fn_setStyleProperty("color", "gray");                                                               
              break;
          case false:              
              this.fn_setStyleProperty("pointer-events", this.obj_holder.obj_enabled.pointerEvents);          
              this.fn_setStyleProperty("cursor", this.obj_holder.obj_enabled.cursor);                                      
              this.fn_setStyleProperty("color", this.obj_holder.obj_enabled.color);                                    
              break;            
          }              
    }       
    
    
    fn_setDesignProperty(str_name, str_value){                
        //console.log("fn_setDesignProperty: " + str_name + "[" + str_value + "]");
        this.obj_design[str_name]=str_value;
    }

    fn_getDesignProperty(str_name){                
        let foo_value=this.obj_design[str_name];
        foo_value=obj_shared.fn_parseBool(foo_value);
        return foo_value;
    }
    fn_getType(){                
        return this.obj_design.str_type.toLowerCase();
    }
    fn_getTag(){                
        return this.obj_design.str_tag.toLowerCase();
    }    

    fn_camoText(){
        
        this.fn_setColor(this.fn_getBackground());
    }

    fn_setHiddenPin(){
        this.bln_hiddenPin=true;                  
        this.fn_setDisplay(false);                                        
      }
    fn_getHiddenPin(){
        return this.bln_hiddenPin;                                    
    }                

    
    
    fn_setText(str_value){//can be overidden, but should be called       

        /*
        str_value+="";        
        if(str_value==="xdesignblank"){
            str_value="";              
        }                             

        if(str_value===undefined){
            str_value="";              
        }                                     
        if(str_value==="undefined"){
            str_value="";              
        }

        //this.obj_design.str_text=str_value;            
        this.fn_setValue(str_value);                

        if(str_value==="notset"){
            str_value="";       
        }
        const searchRegExp = /\n/g;
        const replaceWith = '<br>';
        str_value=str_value.replace(searchRegExp, replaceWith);        
        //*/

        if(str_value===undefined){
            str_value="";              
        }                                     

        if(str_value==="notset"){
            str_value="";       
        }

        this.obj_design.str_text=str_value;        
        
        if(this.obj_design.arr_item.length){                                                    
            return;
        }
        this.fn_setDomProperty("innerHTML", str_value);                                      
    }
    fn_getText(){//should be overidden, but called
        return this.obj_design.str_text;
    }        
    fn_getValue(){               
        
        //let str_value=this.dom_obj.getAttribute('value');//can be blank dont use
        let str_value=this.dom_obj.value;
        if(str_value==="undefined"){str_value="";}                
        this.obj_design.str_value=str_value;        

        return str_value;    
        
    }    
    fn_setValue(str_value){         

        str_value+="";                       
        this.obj_design.str_text=str_value;        
        this.obj_design.str_value=str_value;
        //DOM Update Follows            
        
        this.dom_obj.setAttribute('value', str_value); //required to show in HTML, eg perhaps for color control
        this.dom_obj.value=str_value;//required for text areas.
    }         

    
    fn_setItemStyleProperty(str_type, str_name, str_value){          

        let obj_item, arr;
        arr=this.obj_design.arr_item;        
        for(var i=0;i<arr.length;i++){
            obj_item=arr[i];              
            if(obj_item.fn_getType()===str_type){                                
                obj_item.fn_setStyleProperty(str_name, str_value);      
            }
            obj_item.fn_setItemStyleProperty(str_type, str_name, str_value);
            
        }
    }

    

    
    
    fn_getHTMLContent(){        
        let str_content=this.obj_design.str_content;        
        return str_content;
    } 

    
    
    fn_setHTMLContent(){

        

        let str_content=this.fn_getHTMLContent();

        if(str_content==="nocontent"){
                return;
        }

        if(this.obj_design.arr_item.length){
            return;
        }
        this.fn_removeAllContent();        
        this.fn_setContent(str_content); 
        
        this.dom_objContent.innerHTML=str_content;        
        
    }                
    fn_getHTMLContent(str_value){              

        
        
        str_value=this.obj_design.str_content;
        
        
        if(str_value==="xdesignblank"){
            return "";
        }
        else if(!str_value || str_value===undefined){
            return "nocontent";
        }        
        return str_value;

    }   
    fn_setContent(str_value){  
        
        if(str_value==="xdesignblank"){
            str_value="";
        }
        this.obj_design.str_content=str_value;
    } 
    
    fn_setPosition(str_value){
        this.fn_setStyleProperty("position", str_value);                                
    }

    fn_setDisplayFlex(bln_value=true){
        this.fn_setDisplay(bln_value, "flex");
    }
    fn_setFlexDirection(str_value){
        this.fn_setStyleProperty("flexDirection", str_value);
    }
    fn_setFlex(str_value){
        this.fn_setStyleProperty("flex", str_value);
    }
    fn_setLeft(str_value){
        this.fn_setStyleProperty("left", str_value);
    }
    fn_setTop(str_value){
        this.fn_setStyleProperty("top", str_value);
    }    

    fn_toggleDisplayFlex(){
        if(this.bln_open){            
          this.fn_closeFlex();
          return false;
        }          
        this.fn_openFlex();
        return true;        
    }
    fn_closeFlex(){                    
        this.bln_open=false;
        this.fn_setDisplayFlex(false);
      }
      fn_openFlex(){
        this.bln_open=true;
        this.fn_setDisplayFlex(true);
      }

    fn_toggleDisplay(){
        if(this.bln_open){            
          this.fn_close();
          return false;
        }          
        this.fn_open();
        return true;        
    }
    fn_close(){                    
        this.bln_open=false;
        this.fn_setDisplay(false);
      }
      fn_open(){
        this.bln_open=true;
        this.fn_setDisplay(true);
      }
    
    fn_setDisplay(foo_val=true, str_displayType="block"){  

        let str_value, str_valueContent;
        str_value="none";                      
        if(foo_val===true){                          
            str_value=str_displayType;                
        }        
        
        this.fn_setStyleProperty("display", str_value);                                
    }          
    
    fn_getDisplay(){                  
        return this.fn_getStyleProperty("display");        
    }         
    fn_getBooleanDisplay(){                  
        let str_display=this.fn_getDisplay();
        if(str_display && str_display!=="none"){return true;}            
        return false;
    }     
    fn_displayOn(){
        this.fn_setDisplay(true);
    }     
    fn_displayOff(){
        this.fn_setDisplay(false);
    }     
    
    fn_getVisible(){ 
        return this.fn_getStyleProperty("visibility");                                            

    }    
    fn_disable(){//overridden        
    }
    fn_hide(){
        this.fn_setVisible(false);      
    }
    fn_show(){
        this.fn_setVisible(true);      
    }
    fn_setPadding(str_value){  
        this.fn_setStyleProperty("padding", str_value);
    }
    fn_setMargin(str_value){  
        this.fn_setStyleProperty("margin", str_value);
    }
    fn_setVisible(foo_val=true){  

        let str_value;
        if(foo_val===true){                          
            str_value="visible";
        }
        else if(foo_val===false){                          
            str_value="hidden";
        }    
        else{
            str_value=foo_val;
        }            
        this.fn_setStyleProperty("visibility", str_value);
    }      
    fn_setHeight(str_value){
        this.fn_setStyleProperty("height", str_value);
    }
    fn_setWidth(str_value){
        this.fn_setStyleProperty("width", str_value);
    }
    fn_setZIndex(str_value){
        this.fn_setStyleProperty("zIndex", str_value);
    }
    fn_setColor(str_value){
        this.fn_setStyleProperty("color", str_value);
    }    
    fn_getColor(){
        return this.fn_getStyleProperty("color");        
    }        
    
    fn_setBorder(str_value){
        this.fn_setStyleProperty("border", str_value);        
    }    
    fn_setBackground(str_value){
        this.fn_setStyleProperty("background", str_value);        
    }    
    fn_getBackground(){        
        return this.fn_getStyleProperty("background");        
    }          
    fn_setBackgroundColor(str_value){
        this.fn_setStyleProperty("backgroundColor", str_value);        
    }    
    fn_getBackgroundColor(str_value){
        return this.fn_getStyleProperty("backgroundColor");        
    }    
    fn_getOpacity(){
        return this.fn_getStyleProperty("opacity");        
    }    
    fn_setOpacity(str_value){
        this.fn_setStyleProperty("opacity", str_value);        
    }    
    fn_setOpacityNormal(){
        if(this.bln_enabled){
          this.fn_setOpacity("1");                  
        }                                                                  
      }
      fn_setOpacityGraded(){
        if(this.bln_enabled){
          this.fn_setOpacity("0.75");                  
        }                                                                  
      }
    fn_setFontFamily(str_value){
        this.fn_setStyleProperty("fontFamily", str_value);        
    }    
    fn_getFontFamily(str_value){
        return this.fn_getStyleProperty("fontFamily");        
    }    
    fn_setFontSize(str_value){
        this.fn_setStyleProperty("fontSize", str_value);        
    }    
    fn_getFontSize(str_value){
        return this.fn_getStyleProperty("fontSize");        
    }        
    
    
    
    
    
    fn_getObjectMatching(str_method){        

        if(this[str_method]){
            return this;
        }   
        let obj_container=this.fn_getParentComponent();                                
        if(obj_container){                    
            return obj_container.fn_getObjectMatching(str_method);
        }
        return false;        
        
    }
    

    fn_getNextLocalHome(){                        
        
        let bln_isLocalHome=this.fn_isLocalHome();
        let obj_parent=this.fn_getParentComponent();//parent or false        

        let obj_item=this;
        if(bln_isLocalHome && obj_parent){        
            obj_item=obj_parent;            
        }
        return obj_item.fn_getLocalHome();
    }    
    fn_getLocalHome(){        

        let bln_isLocalHome=this.fn_isLocalHome();
        let obj_parent=this.fn_getParentComponent();//parent or false
        if(bln_isLocalHome || !obj_parent){
            return this;
        }
        return obj_parent.fn_getLocalHome();        
    }  
    xfn_getNextLocalHome(){                
        return this.fn_getLocalHome(true);
    }    
    xfn_getLocalHome(bln_nextLocalHome=false){        

        let bln_isLocalHome=this.fn_isLocalHome();
        if(bln_isLocalHome){if(!bln_nextLocalHome){return this;}}

        let obj_parent=this.fn_getParentComponent();//parent or false
        if(!obj_parent){            
            return this;
        }
        return obj_parent.fn_getLocalHome();        
    }      
    fn_isLocalHome(){        
        return this.obj_design.bln_isLocalHome;
    }
    fn_setDesignLocked(bln_status){//should be run on local home only 
        this.obj_design.bln_lockComponent=bln_status;
    }       
    fn_getDesignLocked(){//should be run on local home only 
        if(this===obj_project){return false;}
        if(obj_project.fn_isContextHolder()){return false;}
        return obj_shared.fn_parseBool(this.obj_design.bln_lockComponent);//dont switch to getDesginAttrib as this may be called by a "ini object witout funcitons"        
    }  
    

}//END CLS