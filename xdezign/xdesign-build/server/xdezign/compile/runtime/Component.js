class component extends BaseObject {
    constructor(obj_ini) {
        super(obj_ini); // call the super class constructor
    }
    fn_initialize(obj_ini){//COMPONENT: fn_initialize is called again upon component.openInstance from db
        super.fn_initialize(obj_ini);

        
        //START INITIALIZE DESIGN
        this.obj_design.int_idRecord=obj_ini.obj_design.int_idRecord;
        if(this.obj_design.int_idRecord==undefined){this.obj_design.int_idRecord=0;}
        
        if(this.obj_design.int_modeExecute===undefined){                                    
            this.obj_design.int_modeExecute=this.obj_holder.int_modeRuntime;        
            let dom_frameElement=window.frameElement;                
            if(dom_frameElement){
            let str_name=dom_frameElement.getAttribute("name");        
                if(str_name==="xdesign-frame"){//ie a project that is being designed}        
                    this.obj_design.int_modeExecute=this.obj_holder.int_modeReadOnly;                                
                    if(this.obj_design.int_idRecord===0){
                        this.obj_design.int_modeExecute=this.obj_holder.int_modeEdit;
                    }
                }
            }
        }  
        
        if(this.obj_design.str_type===undefined){this.obj_design.str_type="component";}                

        let str_name=this.obj_design.str_name;
        if(str_name==undefined){
            str_name="My " + this.obj_design.str_type;
            //str_name=obj_shared.fn_getUniqueId(str_name);
        }         
        this.fn_setName(str_name);
        this.fn_setRegisterAtProject(this.obj_design.bln_registerAtProject);
        this.fn_setRegisterAtContainer(this.obj_design.bln_registerAtContainer);
        

        if(this.obj_design.str_tag===undefined){this.obj_design.str_tag="component";}                                                
        if(this.fn_getIsContainer()==undefined){this.fn_setIsContainer(true);}        
        this.bln_isComponent=true;                
        if(!this.obj_design.bln_classController){this.obj_design.bln_classController="false";}//undefined or empty string or false                        
        if(!this.obj_design.str_classList){this.obj_design.str_classList="notset";}//undefined or empty string or false
        if(!this.obj_design.str_classExtend){this.obj_design.str_classExtend="notset";}//undefined or empty string or false                                        
        
        if(!this.obj_design.str_createdDate){this.obj_design.str_createdDate=obj_shared.fn_getDate(obj_const.int_dateNow);}//undefined or empty string or false                
        if(!this.obj_design.str_modifiedDate){this.obj_design.str_modifiedDate=obj_shared.fn_getDate(obj_const.int_dateNow);}//undefined or empty string or false                

        //this.obj_holder.bln_listenClick=true;                        
        
        this.obj_holder.str_prefix="xDesign_";                
        
        //END INITIALIZE DESIGN

        //START INITIALIZE STYLE
        //if(this.fn_getStyleProperty("fontFamily")===undefined){this.obj_domStyle.fontFamily="Helvetica";}
        //if(this.obj_domStyle.flexWrap===undefined){this.obj_domStyle.flexWrap="wrap";}              
        //END INITIALIZE STYLE
    }   

    fn_getComponentViaFlagVertical(str_flag){
        if(!str_flag)return false;
        let bln_value=this.obj_holder[str_flag];
        if(bln_value)return this;
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
            return obj_parent.fn_getComponentViaFlagVertical(str_flag);
        }

    }

    fn_configureFromMeta(){}
    fn_configureFromView(){}
    
    
    xfn_cascadeFlipHeading(bln_showFieldHeading){                
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];                                                
            obj_item.xfn_cascadeFlipHeading(bln_showFieldHeading);            
        }        
      }  

    xfn_cascadeFlipAxis(bln_axis){//overdidden        

        //bln_axis=this.fn_flipAxis(bln_axis);
        
        let arr=this.obj_design.arr_item;
        for(let i=0;i<arr.length;i++){
            let obj_item=arr[i];                                                
            //obj_item.xfn_cascadeFlipAxis(bln_axis);
        }        
    }

    fn_maintainAxis(bln_axis){        
        this.fn_setAxis(bln_axis);        
    }    

    fn_flipAxis(bln_axis){                
        if(bln_axis===undefined){bln_axis=this.fn_getAxis();}        
        this.fn_setAxis(obj_shared.fn_flipBool(bln_axis));                
    }

    fn_setAxis(bln_axis){
        this.obj_holder.bln_axis=bln_axis;        
        //this.fn_setStyleProperty("display", "flex");
        if(!bln_axis){//true=row
            this.fn_setStyleProperty("flex-direction", "row");
            
        }
        else{//true=column
            this.fn_setStyleProperty("flex-direction", "column");
        }
    }

    fn_getAxis(){
        return this.obj_holder.bln_axis;
    }

    fn_flipDisplay(bln_value){
        if(bln_value===undefined){            
            bln_value=this.fn_getBooleanDisplay();            
        }        
        this.fn_setDisplay(obj_shared.fn_flipBool(bln_value));
    }         
    fn_flipDisplayFlex(bln_value){
        if(bln_value===undefined){            
            bln_value=this.fn_getBooleanDisplay();            
        }        
        this.fn_setDisplayFlex(obj_shared.fn_flipBool(bln_value));
    }         
    
    
    fn_isEmpty(){                
        return this.obj_design.arr_item.length ? false:true;        
    }

    fn_getDynamicContent(bln_refuseSave=false){

        let obj_item=this.fn_getComponent("xapp_dynamic_content")
        if(obj_item){return obj_item;}
        let obj_ini=new Holder;                                    
        obj_ini.obj_design.str_type="xapp_dynamic_content";    
        obj_ini.obj_design.str_name="xapp_dynamic_content";            
        obj_ini.obj_design.bln_refuseSave=bln_refuseSave;                    
        this.fn_addItem(obj_ini);        
        return this.fn_getComponent("xapp_dynamic_content");
    }
    
    fn_addContextItemOnce(str_nameShort, bln_debug=false){
        
        this.bln_debugContextItem=bln_debug;                

        if(str_nameShort==="xapp_dynamic_content"){
            console.log("cannot add dynamic context due to recursion issue. use getComponent instead.");
            return;
        }
        
        let obj_item=this.fn_getComponent(str_nameShort);
        if(!obj_item){
            //obj_item=this.fn_useContextItem(str_nameShort);
            let obj_contextItem=this.fn_useContextItem(str_nameShort);
            obj_item=this.fn_addItem(obj_contextItem);        
            obj_item=this.fn_formatContextItem(obj_item);            
        }
        return obj_item;
    }
    fn_addContextItem(str_nameShort, bln_startPosition=false, bln_debug=false){
        this.bln_debugContextItem=bln_debug;        

        if(str_nameShort==="xapp_dynamic_content"){
            console.log("cannot add dynamic context due to recursion issue. use getComponent instead.");
            return;
        }
        
        let obj_contextItem=this.fn_useContextItem(str_nameShort);
        if(obj_contextItem){
            obj_contextItem.obj_design.bln_startPosition=bln_startPosition;
        }        
        let obj_item=this.fn_addItem(obj_contextItem);        
        obj_item=this.fn_formatContextItem(obj_item);        
        return obj_item;
    }

    fn_useContextItem(str_nameShort){               

        let obj_item,   obj_contextItem;                
        let obj_contextHolder, obj_dynamicContent;        

        if(str_nameShort==="xapp_dynamic_content"){return;}

        if(this.bln_debugContextItem){
            console.log("SEARCH ["+ str_nameShort +"] FOR [" + this.obj_design.str_name + "]");    
        }
        
        //Get context item from project
        obj_contextHolder=obj_project.fn_getComponent("xapp_context_holder");
        if(!obj_contextHolder){
            if(this.bln_debugContextItem){console.log("ERROR fn_useContextItem Cannot locate xapp_context_holder");}
            return;
        }        
        
        obj_dynamicContent=obj_contextHolder.fn_getDynamicContent(true);        
        if(!obj_dynamicContent){
            if(this.bln_debugContextItem){console.log("ERROR fn_useContextItem Cannot locate xapp_dynamic_content");}
            return;
        }

        obj_contextItem=obj_dynamicContent.fn_getComponent(str_nameShort);
        //check in top level to see if we have retrieved this before
        if(obj_contextItem){            
            if(this.bln_debugContextItem){console.log("REUSE [" + str_nameShort + "] FOR [" + this.obj_design.str_name + "]");}
        }
        else{
            if(this.bln_debugContextItem){console.log("GET [" + str_nameShort + "] FOR [" + this.obj_design.str_name + "]");}
            obj_contextItem=obj_contextHolder.fn_getContextItem(str_nameShort, this.bln_debugContextItem);                
            if(this.bln_debugContextItem){console.log("obj_contextItem: " + str_nameShort + ": " + obj_contextItem);}
            if(!obj_contextItem){
                if(this.bln_debugContextItem){
                    console.log("GETCONTEXT ITEM NOT FOUND: " + str_nameShort + ": " + obj_contextItem);
                    console.log("1. CHECK REGISTER AT CONTAINER IS TRUE");
                    console.log("2. CHECK NAME OF COMPONENT");
                }                
                return;
            }
            obj_contextItem.obj_design.bln_registerAtContainer=true;            
            obj_contextItem.obj_design.bln_registerAtContainer=true;
            obj_dynamicContent.fn_addItem(obj_contextItem);//add to context holder dynamic top level for reuse
        }

        return obj_contextItem;
    }   
    
    fn_formatContextItem(obj_item){

        if(!obj_item){return;}
        obj_item.fn_setParentComponent(this);        
        obj_item.fn_removeId();              
        obj_item.fn_setDynamic(true);
        return obj_item;

    }
    fn_getContextItem(str_nameShort, bln_debug){        

        let i, arr_item, obj_item, obj_target;        


        this.bln_debugContextItem=bln_debug;        

        if(this.bln_debugContextItem){console.log("PARENT [" + this.obj_design.str_name + "]");}        
        
        obj_target=false;
        if(this.obj_design.bln_isContextHolder){                         
            obj_target=this.fn_getComponent(str_nameShort);                                                                
            if(obj_target){
                if(this.bln_debugContextItem){console.log("FOUND [" + str_nameShort + "] PARENT [" + this.obj_design.str_name + "]");}                                
                return obj_target;
            }
        }
        
        arr_item=this.obj_design.arr_item;        
        for(i=0;i<arr_item.length;i++){
            obj_item=arr_item[i];                         
            if(this.bln_debugContextItem){console.log("CHILD [" + obj_item.obj_design.str_name + "]");}                            
            if(obj_item.obj_design.bln_isContextHolder){                                
                if(this.bln_debugContextItem){console.log("IS CONTEXT HOLDER [" + obj_item.obj_design.bln_isContextHolder + "]");}                            
                obj_target=obj_item.fn_getContextItem(str_nameShort, bln_debug);
                if(obj_target){return obj_target;}
            }            
        }
        return false;
    } 

    fn_highlightBorder(str_color){
        this.fn_setStyleProperty("border", "10px solid " + str_color);
    }
    
    fn_getDebugPin(){
        return this.obj_holder.bln_debugPin;
    }
    fn_setDebugPin(bln_value){                                    
        this.obj_holder.bln_debugPin=bln_value;
    }               
    fn_getIsOpen(){
        return this.obj_design.bln_isOpen;
    }
    fn_setIsOpen(bln_value){
        this.obj_design.bln_isOpen=bln_value;
    }

    fn_locateItemForPalette(str_nameShort, bln_searchContextItem, bln_debug){
        return this.fn_getItemGoSouth(str_nameShort, bln_searchContextItem, bln_debug);
    }

    fn_locateItemIgnoreContextItem(str_nameShort, bln_debug){
        return this.fn_getItemGoSouth(str_nameShort, false, bln_debug);
    }

    fn_locateItem(str_nameShort, bln_debug){
        return this.fn_getItemGoSouth(str_nameShort, false, bln_debug);
    }
    
    fn_getItemGoSouth(str_nameShort, bln_searchContextItem, bln_debug){        

        let i, arr_item, obj_item, obj_target;

        if(bln_debug){
            console.log("str_nameShort: " + str_nameShort);
        }

        if(!bln_searchContextItem){
            if(this.fn_isContextHolder()){
                return false;
            }
        }
        

        obj_target=this.fn_getComponent(str_nameShort);                                
        if(obj_target){
            if(bln_debug){
                this.fn_debugText("FOUND");
            }    
            return obj_target;
        }
    

        arr_item=this.obj_design.arr_item;        
        for(i=0;i<arr_item.length;i++){
            obj_item=arr_item[i];                        
            
            obj_target=obj_item.fn_getItemGoSouth(str_nameShort, bln_searchContextItem, bln_debug);            
            if(obj_target){
                return obj_target;                          
            }
            
        }
        return false;
    }   

    fn_getBaseClassParent(str_baseClass){

        let obj_item=this.fn_getParentComponent();
        
        
        if(obj_item && obj_item.fn_getDesignProperty("str_baseClass", str_baseClass)){
            return obj_item;
        }
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
            return obj_parent.fn_getBaseClassParent(str_baseClass);
        }            
        return false;

    }


    fn_getItemGoNorth(str_nameShort){        

        
        let obj_item=this.fn_getComponent(str_nameShort);
        
        if(obj_item){
            return obj_item;
        }
        let obj_parent=this.fn_getParentComponent();
        if(obj_parent){
            return obj_parent.fn_getItemGoNorth(str_nameShort);
        }            
        return false;
    }

    

    fn_setStandardStyle(){                    
        
        //*
        if(this.obj_domStyle.height===undefined){this.obj_domStyle.height="40px";}              
        if(this.obj_domStyle.padding===undefined){this.obj_domStyle.padding="3px 12px";}
        if(this.obj_domStyle.border===undefined){this.obj_domStyle.border="0px solid black";}                                  
        if(this.obj_domStyle.cursor===undefined){this.obj_domStyle.cursor="pointer";}
        if(this.obj_domStyle.marginRight===undefined){this.obj_domStyle.marginRight="1px";}      
        if(this.obj_domStyle.marginBottom===undefined){this.obj_domStyle.marginBottom="1px";}              
        //*/
    }

    fn_call(str_method, foo_arg){    
        if(this[str_method]){
            return this[str_method](foo_arg);
        }                            
    }

    fn_notifyItem(str_notify, str_method, foo_arg){        
        return this.fn_notify(this.fn_getComponent(str_notify), str_method, foo_arg);
    }

    fn_notifyObject(obj_notify, str_method, foo_arg){
        return this.fn_notify(obj_notify, str_method, foo_arg);
    }
    fn_notify(obj_notify, str_method, foo_arg){            
        if(obj_notify && obj_notify[str_method]){
            return obj_notify[str_method](foo_arg);
        }                        
    }
    fn_notifyParent(str_method, foo_arg){
        let obj_container=this.fn_getParentComponent();                  
        return this.fn_notify(obj_container, str_method, foo_arg);        
    }
    
    fn_execute(){        

        if(!this.obj_design.int_idRecord){            
            this.fn_stepEnd();
            return;
        }       
        
        if(!this.fn_validIdHistory()){
            this.fn_stepEnd();
            return;
        }   

        //check on client        
        
        if(this.fn_loadJSONInstanceFromClient()){                        
            //console.log("fn_loadJSONInstanceFromClient: " + this.obj_design.int_idRecord);
            this.fn_stepEnd();
            return;
        } 

        //goto to server
        this.fn_loadJSONInstanceFromServer();
    }

    
    
    //*
    fn_setModeExecute(int_mode){        

        //dont allow dynamic objects to set mode execute / add from palette
        if(this.fn_getDynamic()){            
            //return false;    
        }       
        
        //dont allow children of dynamic parents to set mode execute / add from palette
        if(this.fn_hasDynamicParent()){            
            return false;    
        }      

        //dont allow children of static object to set mode execute / add from palette        
        let obj_staticParent=this.fn_hasStaticParent();
        if(obj_staticParent && obj_staticParent!==obj_project){            
            return false;    
        }       

        //set mode execute
        this.obj_design.int_modeExecute=int_mode;         
        return true;
    }

    
    
    fn_preventSave(){
        

        //allow dynamic objects to be saved, its only the children that should not be saved
        if(this.fn_getDynamic()){
            //return true;
        }
        if(this.fn_getRefuseSave()){
            return true;
        }
        

        //dont save the children !
        if(this.fn_hasDynamicParent()){
            return true;
        }
        
        //dont enable this otherwise children of static parents are rmeoved on parent save        
        //if(this.fn_hasStaticParent()){
          //return true;
        //}        
        
        return false;
        
    }
    //*/

    fn_hasContextHolderParent(bln_debug){ 
        
        let obj_container=this.fn_getParentComponent();        
        if(!obj_container){
            if(bln_debug){
                this.fn_debugText("debug parent not found return false");
            }
            return false;
        }        

        if(bln_debug){
            this.fn_debugText("debug fn_hasContextHolderParent");
        }
        

        if(obj_container.fn_isContextHolder()){            
            if(bln_debug){
                this.fn_debugText("debug i am a context holder return true");
            }
            return obj_container;
        }                
        
        return obj_container.fn_hasContextHolderParent(bln_debug);
    }    
    fn_isContextHolder(){                 
        return this.obj_design.bln_isContextHolder;
    }    

    fn_hasStaticParent(){  
        
        //if(obj_project.fn_isContextHolder()){return false}//will cause issues with save on locked components
        
        let obj_container=this.fn_getParentComponent();        
        if(!obj_container){return false;}        

        if(obj_container.fn_getStatic()){            
            return obj_container;
        }                
        
        return obj_container.fn_hasStaticParent();
    }        
    
    fn_getStatic(){                
        return this.fn_getDesignLocked();
        //return this.obj_design.bln_lockComponent;        
    }        

    fn_getRefuseSave(){                
        return this.obj_design.bln_refuseSave;
    }

    fn_getDynamic(){                

        
        let bln_value=false;        
        if(this.obj_design.bln_dynamicPin){
            bln_value=true;
        }

        return bln_value;
    }        
    fn_hasDynamicParent(){ 
        
        let bln_value;
        let obj_container=this.fn_getParentComponent();        
        if(!obj_container){return false;}        

        if(obj_container.obj_design.str_type==="xapp_dynamic_content"){//covers dynamic tag, in parent lookup
            bln_value=true;
        }


        if(obj_container.fn_getDynamic()){            
            return true;
        }                
        return obj_container.fn_hasDynamicParent();
    }    
    fn_setDynamic(bln_value=true){
        this.obj_design.bln_dynamicPin=bln_value;
    }
    

    fn_loadJSONInstanceFromServer(){      
        //we need to wait for trip back from server before loading any children
        this.obj_design.arr_item=[];            

        //console.log("fn_loadJSONInstanceFromServer: " + this.obj_design.int_idRecord);
        let obj_ini=new Holder;            
        let obj_AJAX=new AJAX(obj_ini);
        let obj_post=new Object;                         
        obj_post.URL=obj_path.fn_getURLServerFile(this.obj_design.str_type, this.obj_holder.str_nameFileServer);
        obj_post.NotifierId=this.obj_design.str_idXDesign;                        
        obj_post.Action="getInstance";                
        obj_post.ActionCallBack="fn_loadJSONInstanceFromServerCallBack";                
        obj_post.RecordId=this.obj_design.int_idRecord;//could get complicated if obj_instance supplied                            
        obj_AJAX.fn_putPost(obj_post);        
    }
    fn_loadJSONInstanceFromServerCallBack(obj_post){        
        let int_id_record=obj_post.RecordId;                
        let ObjectData=obj_post.ObjectData; 
        if(obj_post.HasError && obj_post.ErrorMessage==="RecordIdNotExist"){                        
            this.fn_stepEnd();
            return;
        }        
        this.fn_loadJSONInstance(ObjectData);        
        this.fn_addToClientMap(int_id_record, ObjectData);                                     
        this.fn_stepEnd();
    }    
    fn_addToClientMap(int_id_record, ObjectData){                        
        obj_shared.fn_setMapItem(obj_InstanceJSONMap, int_id_record, ObjectData);                        
    }    
    fn_loadJSONInstanceFromClient(){
        let int_id_record=parseInt(this.obj_design.int_idRecord);                                        
        let ObjectData=obj_shared.fn_getMapItem(obj_InstanceJSONMap,  int_id_record);//get a reference to the the object that has been published from the db                
        return this.fn_loadJSONInstance(ObjectData);
    }
    fn_loadJSONInstance(ObjectData){ 

        if(!ObjectData){return false;}
        if(!ObjectData.obj_design){return true;}
        //indicate success, but dont initialize with a blank object                
        //may be a blank object if instance id has been renamed/deleted/corrupted etc on the server
        
        var NewObjectData=JSON.parse(JSON.stringify(ObjectData));        
        NewObjectData.obj_holder=new Holder;                 
        NewObjectData.obj_design.int_modeExecute=this.obj_design.int_modeExecute;//Continuity of Mode                                                                                        
        this.fn_initialize(NewObjectData);//initialize with self from db                                
        return true;
    }    
    fn_stepEnd(){                
        this.fn_createSelf();//create self                        
        this.fn_onOpenInstance();//run  baseobvject onopeninstance
    }     
    //START COMPONENT OPERATION FUNCTIONS  
    
    
    fn_getComponent(str_nameShort){        
        
        let str_name="obj_" + obj_shared.fn_formatShortName(str_nameShort);                                        
        let obj_my=this.obj_holder[str_name];        
        return obj_my;
    } 
    fn_setComponent(obj_item, str_nameShort){
        this.fn_register(obj_item, str_nameShort);        
    }

    fn_getProjectLocal(){                   
        
        if(this===obj_project){return this;}//logically ok but not tested
    
        return this.obj_holder.obj_projectLocal;                        
    }    
    
    fn_getRecordStatus(){//deprecated, not used ?
        alert("check defunct")

        let arr, obj_item, bln_recordStatus;
        arr=this.obj_design.arr_item;
        
        if(this.bln_isComponent){
            if(!this.obj_design.int_idRecord){
                return false;
            }
        }      
        //*          
        for(let i=0;i<arr.length;i++){
            obj_item=arr[i];

            bln_recordStatus=obj_item.fn_getRecordStatus();
            if(!bln_recordStatus){
                obj_item.fn_debug("CHILD NOT SAVED");
                return false;
            }            
        } 
        //*/       
        return true;
    }    

    fn_onBeforeSave(){}//to be overidden

    fn_extends(str_nameClass){        

        this.obj_design.str_classExtend=str_nameClass;

        //this.fn_addClass(str_nameClass);        
        //this.fn_addClass(this.obj_design.str_type);        
    }

    fn_requires(str_nameClass){        
        this.fn_addClass(str_nameClass);        
    }

    fn_addClass(str_nameClass){ 
        let str_classList=this.obj_design.str_classList;
        let int_index;
        let s1, s2;
        s1=","+str_classList+",";
        s2=","+str_nameClass+",";
        int_index=s1.indexOf(s2);                
        if(int_index!==-1){
            return;
        }
        if(str_classList==="notset"){
            str_classList="";
        }
        if(str_classList!==""){
            str_classList+=",";            
        }
        str_classList+=str_nameClass;
        this.obj_design.str_classList=str_classList;        
    }

    
    fn_getClassExtend(){
        return this.obj_design.str_classExtend;
    }          
    
    
    fn_getType(){
        return this.obj_design.str_type;
    }          
    fn_setType(str_value){    

        if(str_value===""){str_value="tag";}                            
        str_value=obj_shared.fn_formatShortName(str_value);                    
        this.obj_design.str_type=str_value;
    }          
    fn_setThemeType(str_value){    

        if(str_value===""){str_value="notset";}                            
        str_value=obj_shared.fn_formatShortName(str_value);                    
        this.obj_design.str_themeType=str_value;
    }                  
    fn_getTag(){
        return this.obj_design.str_tag;
    }
    fn_setTag(str_value, bln_mandatory){
        if(str_value===""){str_value="component";}
        str_value=obj_shared.fn_formatShortName(str_value);        
        if(this.obj_design.str_tag===undefined || this.obj_design.str_tag==="component"){        
            this.obj_design.str_tag=str_value;      
        }              
        if(bln_mandatory){
            this.obj_design.str_tag=str_value;      
        }
        
    }    
    fn_getName(){
        return this.obj_design.str_name;
    }
    fn_setName(str_name){        
        if(!str_name){
            return false;
        }        
        this.obj_design.str_name=str_name;                
        let str_value=obj_shared.fn_formatShortName(this.obj_design.str_name);        
        let str_nameShort=this.fn_setVariableName(str_value);
        if(this.fn_getRegisterAtProject()){
            if(!obj_project.fn_getComponent(str_nameShort)){
                obj_project.fn_setComponent(this, str_nameShort);
            }
        }
        return str_value;
    }
    fn_setVariableName(str_value){           
        return this.obj_design.str_nameShort=str_value;                    
    }
    fn_getVariableName(){        
        return this.obj_design.str_nameShort;
    }    
    
    
    /////////////////////START REGISTRATIONEVENT
    fn_register(obj_item){                 
        this.fn_registerName(obj_item, obj_item.obj_design.str_nameShort);        
    }    
    fn_registerName(obj_item, str_nameShort){ 
        let str_name;    
        str_name="obj_" + obj_shared.fn_formatShortName(str_nameShort);                                        
        this.obj_holder[str_name]=obj_item;                                
    }    
    /////////////////////END REGISTRATIONEVENT
    ///////////////////// START REGISTRATOR EVENTS 
    fn_registerObject(obj_item){ //object is registering a child                  
        this.fn_register(obj_item);                
        this.fn_onRegisterItem(obj_item);
    }    
    fn_registerContainedObject(obj_item){ //Container is registering a child          
        this.fn_register(obj_item);        
        //this.fn_onRegisterContainedObject(obj_item);
    }
    fn_registerProjectObject(obj_item){  //Project is registering a child      
        if(obj_item===obj_project){//never see
            alert("PROJECT/CHILD ARE EQUAL");                                
            return;
        }
        if(obj_item===this){//never see
            alert("ATTEMPT TO SELF REGISTER PROJECT WITH PROJECTOBJECT");                                
            return;
        }
        
        this.fn_register(obj_item);        
        this.fn_onRegisterProjectItem(obj_item);
    }
    ///////////////////// END REGISTRATOR EVENTS 
    
    ///////////////////// START PARENT POST REGISTER EVENTS
    fn_onRegisterItem(obj_item){ //post register        
        //console.log("POST OBJECT REGISTRATION OF: " + obj_item.obj_design.str_name);
        obj_item.fn_onRegisterWithObject(this);
    }
    fn_onRegisterContainedObject(obj_item){        
        //console.log("POST CONTAINER REGISTRATION OF: " + obj_item.obj_design.str_name);
        obj_item.fn_onRegisterWithContainer(this);
    }
    fn_onRegisterProjectItem(obj_item){                                
        //console.log("POST PROJECT REGISTRATION OF: " + obj_item.obj_design.str_name);
        obj_item.fn_onRegisterWithProject(this);
        if(!this.obj_theme && obj_item.obj_design.str_type==="xapp_theme"){                                            
            this.obj_theme=obj_item;
            if(this!==obj_project){alert("check project theme")};
        }
    }

    fn_setModeExecuteNew(){
        this.int_modeExecute=obj_holder.int_modeNew;                          
      }
      fn_getModeExecuteNew(){
        if(this.int_modeExecute===obj_holder.int_modeNew){return true;}
        return false;
      }
      fn_setModeExecuteEdit(){                                    
        this.int_modeExecute=obj_holder.int_modeEdit;                     
      }
      fn_getModeExecuteEdit(){        
        if(this.int_modeExecute===obj_holder.int_modeEdit){return true;}
        //if(this.fn_getModeExecuteNew()){return true;}
        return false;
      }
      fn_setModeExecuteView(){                  
        this.int_modeExecute=obj_holder.int_modeReadOnly;                                
      }
      fn_getModeExecuteView(){        
        if(this.int_modeExecute===obj_holder.int_modeReadOnly){return true;}
        return false;
      }
      
    
    ///////////////////// END PARENT POST REGISTER EVENTS
    ///////////////////// START CHILD POST REGISTER EVENTS
    fn_onRegisterWithObject(obj_registrator){//post register
        this.obj_holder.obj_registrator=obj_registrator;        
    }
    fn_onRegisterWithContainer(obj_container){//post register
        //
    }
    fn_onRegisterWithProject(obj_projectLocal){//post register        
        this.obj_holder.obj_projectLocal=obj_projectLocal;                
        //
    }        
    ///////////////////// END CHILD POST REGISTER EVENTS
    
    /////////////////////START REGISTRATION GETTER SETTER
    fn_setRegisterAtProject(bln_value){           
        if(bln_value==undefined){bln_value=false;}        
        this.obj_design.bln_registerAtProject=bln_value;                    
    }
    fn_getRegisterAtProject(){
        return this.obj_design.bln_registerAtProject;
    }
    fn_setRegisterAtContainer(bln_value){           
        if(bln_value==undefined){bln_value=false;}        
        this.obj_design.bln_registerAtContainer=bln_value;                    
    }
    fn_getRegisterAtContainer(){
        return this.obj_design.bln_registerAtContainer;
    }
    /////////////////////END REGISTRATION GETTER SETTER
    
    fn_setTypeable(bln_value){           
        if(bln_value==undefined){bln_value=false;}        
        this.obj_design.bln_typeable=bln_value;                    
    }
    fn_getTypeable(){                   
        return this.obj_design.bln_typeable;                    
    }
    fn_setClassController(bln_value){                   
    }
    fn_getClassController(){                   
        let bln_value=obj_shared.fn_parseBool(this.obj_design.bln_classController);        
        if(!this.fn_proposeClassController()){
            bln_value=false;
        }
        return bln_value;
    }    
    fn_proposeClassController(){                           
        let bln_value=true;
        if(this.obj_design.str_type==="component"){
            bln_value=false;
        }                
        return bln_value;
    }   
    fn_proposeEditLock(){                           
        let bln_value=true;
        if(this.obj_design.bln_registerAtProject){
            //bln_value=false;
        }                        
        return bln_value;
    }   
    fn_proposeRegisterAtProject(){                           
        
        let bln_value=true;
        if(this.obj_design.bln_lockComponent){
            //bln_value=false;
        }                   
        return bln_value;
    }   
    fn_proposeClassExtend(str_value){                           
        let bln_value=true;
        if(this.obj_design.str_type===str_value){
            bln_value=false;
        }                        
        return bln_value;
    }   
    fn_proposeType(str_value){                           
        let bln_value=true;
        if(this.obj_design.str_classExtend===str_value){
            bln_value=false;
        }                        
        return bln_value;
    }       
    
    fn_parentEvent(str_event, e){        
        let str_method="fn_onChild" + str_event;        
        let obj_parent=this.fn_getParentComponent();        
        if(obj_parent && obj_parent[str_method]){obj_parent[str_method](e);}    
        else{this.fn_unsetEvent();}
        
    }    
    fn_parentEventBubble(str_event, e){                
        
        
        if(!obj_project.obj_nativeEvent){
            return;
        }       
        
        

        let obj_parent=this.fn_getParentComponent();                                  
        console.log("obj_parent: " + obj_parent);
        if(obj_parent)
        {   
            

            if(obj_parent[str_method]){                
                obj_parent[str_method](e);
                this.fn_unsetEvent();
            }    
            else{                
                obj_parent.fn_parentEventBubble(str_event, e);                
                return;
            }
        }
        else{
            this.fn_unsetEvent();
        }
    }    
    fn_unsetEvent(){
        //console.log("fn_unsetEvent");
        obj_project.fn_unsetEvent();
    }

    
    fn_handleEvent(str_event, e){    
        obj_project.fn_setEvent(e, this);                        
        let str_method="fn_on" + str_event;
        //console.log("str_method: " + str_method);
        if(str_event==="Submit"){            
            //obj_project.fn_forgetEvent(e);
            //return;
        }
        if(this[str_method]){
            this[str_method](e);
        }        
        if(this===obj_project){this.fn_unsetEvent();}
    }
    
    //START COMPONENTEVENT HANDLING- CONSIDER MOVING to BASEOBJECT IF NECESSARY    
    fn_addEventListener(){
        let arr_event=[];        
        //arr_event.push("SelectStart");                
        if(this.obj_holder.bln_listenInput){arr_event.push("Input");}
        if(this.obj_holder.bln_listenSelectStart){arr_event.push("SelectStart");}                
        if(this.obj_holder.bln_listenClick){arr_event.push("Click");}
        if(this.obj_holder.bln_listenDblClick){arr_event.push("DblClick");}
        if(this.obj_holder.bln_listenBlur){arr_event.push("Blur");}
        if(this.obj_holder.bln_listenFocus){arr_event.push("Focus");}
        if(this.obj_holder.bln_listenChange){arr_event.push("Change");}
        if(this.obj_holder.bln_listenSubmit){arr_event.push("Submit");}
        if(this.obj_holder.bln_listenMouseEnter){arr_event.push("MouseEnter");}
        if(this.obj_holder.bln_listenMouseLeave){arr_event.push("MouseLeave");}
        if(this.obj_holder.bln_listenMouseDown){arr_event.push("MouseDown");}
        if(this.obj_holder.bln_listenMouseUp){arr_event.push("MouseUp");}
        if(this.obj_holder.bln_listenKeyDown){arr_event.push("KeyDown");}
        if(this.obj_holder.bln_listenKeyUp){arr_event.push("KeyUp");}        
        if(this.dom_obj){
            arr_event.forEach(function(str_event) {                            
                this.dom_obj.addEventListener(
                    str_event.toLowerCase(), 
                    this.fn_handleEvent.bind(this, str_event));
            }.bind(this));
        }        
    }        
    
    fn_onSelectStart(e){
        console.log("hit generic");
        obj_project.fn_forgetEvent(e);}                    
    fn_notifyChildControl(){}
    fn_onBlur(e){}
    fn_onClick(e){}
    fn_onDblClick(e){}
    fn_onChange(e){}
    fn_onKeyDown(e){}
    fn_onKeyUp(e){}    
    fn_blankEvent(){}        
    fn_setEventAttributes(){}    
    
    //*/       
    //END COMPONENTEVENT HANDLING
    //END COMPONENT OPERATION FUNCTIONS
}//END CLS


