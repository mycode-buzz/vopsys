
    //XSTART component/xdezign_dashboard_save
    class xdezign_dashboard_save extends xapp_dashboard{
        constructor(obj_ini) {      
            super(obj_ini);        
        }                 
        fn_initialize(obj_ini){

            super.fn_initialize(obj_ini);

            //START INITIALIZE DESIGN                              
            this.obj_holder.bln_debugServer=false;                              
            //END INITIALIZE DESIGN      
            
        } 
        fn_loadDashboard(){}                

        fn_saveAsProject(bln_protectChildren){//This relates to saving a component within the Project Isntance ie from the aciton button                                   
    
            let obj_item, str_name;
      
            //obj_item=obj_project.obj_palettSelected;
            obj_item=obj_projectTarget;
            let str_categoryName=obj_item.obj_design.str_categoryName;
            
            //if bln_protectChildren is true , an exact copy of the children ids will be created
            //if bln_protectChildren is false  , children maintainid  will be used to detemrine id
            if(bln_protectChildren){
              obj_item.obj_design.int_idRecord=0;                                             
              obj_item.obj_design.int_modeExecute=obj_holder.int_modeEdit;              
              obj_item.bln_removeId=true;
              obj_item.bln_removeIdXDesign=true;
              obj_project.fn_projectRemoveId(obj_item);              
            }            

            obj_item.obj_design.str_categoryName=str_categoryName;

            let str_addon=(" Copy");            
            str_name=this.fn_getAddOnString(obj_item.fn_getName(), str_addon);      
            obj_item.fn_setName(str_name);                 
            
            this.fn_saveProject(0);            
        } 
        fn_getAddOnString(str_orig, str_addon){
            let str_new;
            
            str_new=str_orig.replace(str_addon, "");
            str_new+=str_addon;
            return str_new;
        }                

        fn_saveComponent(obj_iniSave){                        

            //MARK INSTANCE
            let obj_ini;
            let bln_debug=false;
            let obj_instance=obj_iniSave.ObjectInstance;                
            
            obj_instance.obj_holder.bln_markSave=true;

            if(bln_debug){obj_instance.fn_debug("ENTER fn_saveComponent");}

            //dynamic objects, staticobjects should not be saved
            let arr, arr_old, arr_new, obj_item, bln_allSaved;
            arr_old=obj_instance.obj_design.arr_item;        
            arr_new=[];
            for(let i=0;i<arr_old.length;i++){
                obj_item=arr_old[i];
                if(!obj_item.fn_preventSave()){
                    arr_new.push(obj_item); 
                }
                else{
                    //to do: mark obj_project for statechange / reload                
                }
            }
            obj_instance.obj_design.arr_item=arr_new;        
            
            //ARE THE CHILDREN SAVED
            bln_allSaved=true;
            arr=obj_instance.obj_design.arr_item;
            for(let i=0;i<arr.length;i++){
                obj_item=arr[i];
                if(obj_item.fn_preventSave()){
                    console.log("ERROR obj_item.obj_design.fn_preventSave()is true");
                }
                
                if(obj_item.obj_design.int_modeExecute===obj_holder.int_modeEdit){                
                    if(bln_debug){obj_item.fn_debug("CHILD NOT SAVED");}
                    obj_ini=new Object;
                    obj_ini.ObjectInstance=obj_item;                
                    this.fn_saveComponent(obj_ini);
                    bln_allSaved=false;                
                    return;
                }
            }
            
            obj_instance.obj_holder.bln_markSave=false;

            //SAVE                
            if(parseInt(obj_instance.obj_design.int_modeExecute)===obj_holder.int_modeEdit){        
                if(bln_debug){obj_instance.fn_debug("ALL CHILD SAVED, I AM EDITABLE");}            
                obj_ini=new Object;
                obj_ini.obj_instance=obj_instance;
                obj_ini.str_idAJAXNotifier=this.obj_design.str_idXDesign;
                obj_ini.str_actionCallback="fn_saveComponent";
                this.fn_save(obj_ini);            
                obj_instance.obj_design.int_modeExecute=obj_holder.int_modeReadOnly;
                if(bln_debug){obj_instance.fn_debug("I AM NOW NOT EDITABLE");}                        
            }

            //*
            else{            
                if(bln_debug){obj_instance.fn_debug("ALL CHILD SAVED, I AM NON EDITABLE");}                
                
                //IF PARENT IS MARKED, TELL THEM                
                let obj_parent=obj_instance.fn_getParentComponent();                                                                    
                if(obj_parent && obj_parent.obj_holder.bln_markSave){                                                
                        if(bln_debug){obj_parent.fn_debug("PARENT MARKSAVE IS TRUE, CALL PARENT");}                                    
                        obj_ini=new Object;
                        obj_ini.ObjectInstance=obj_parent;                                
                        this.fn_saveComponent(obj_ini);                                        
                }
                else{
                    if(bln_debug){
                        if(!obj_parent){                        
                            if(bln_debug){obj_instance.fn_debug("CORRECT STATUS [PARENT IS FALSE]");}                                        
                        }
                        else{                        
                            obj_instance.fn_debug("fn_saveComponent ERROR STATUS [PARENT IS TRUE]");                                        
                            if(obj_parent.obj_holder.bln_markSave){
                                obj_parent.fn_debug("MARKSSAVE IS TRUE");
                            }
                            else{
                                obj_parent.fn_debug("MARKSSAVE IS FALSE");
                            }
                            
                        }                    
                    }             
                    if(bln_debug){obj_instance.fn_debug("COMPLETE XDESIGN on Save Component");}   
                    this.fn_onSaveProject(obj_iniSave);

                }           
            }
            //*/

            if(bln_debug){obj_instance.fn_debug("EXIT FUNC");}                
        }    

        
        fn_save(obj_ini){         

            let bln_debug=false;
            let int_idRecord;
            obj_ini.str_nameFileServer="save.php";                          
            
            let obj_instance=obj_ini.obj_instance;
            if(parseInt(obj_instance.obj_design.int_modeExecute)!==obj_instance.obj_holder.int_modeEdit){            
                //console.log(obj_instance.obj_design.str_tag + ": Mode Not Valid For Operation [" + obj_instance.obj_design.int_modeExecute + "][" + obj_instance.obj_holder.int_modeEdit + "]");
                //this will be the case for runtme components , running within editable components
                return;
            }        

            obj_instance=obj_ini.obj_instance;
            int_idRecord=parseInt(obj_instance.obj_design.int_idRecord);                
            //obj_instance.fn_onBeforeSave();        

            if(bln_debug){obj_instance.fn_debug("ENTER SAVE");}
            
            //str_action could be publish
            obj_ini.str_action="save";
            if(!obj_ini.str_actionCallback){obj_ini.str_actionCallback=obj_ini.str_action;}

            if(parseInt(obj_instance.obj_design.int_idRecord)===0){            
                obj_ini.str_action="saveAs";          
            }

            //Very Important - do not fuck about with this
            let int_modeExecuteCopy=obj_instance.obj_design.int_modeExecute;//make a copy of current mode
            obj_instance.obj_design.int_modeExecute=this.obj_holder.int_modeRuntime;//db should be saved in runtime mode
            //Very Important - do not fuck about with this        
            
            

            let obj_post=this.fn_formatPost(obj_ini);                       

            obj_post.ObjectData=this.fn_actionSerialize(obj_instance);//obj_post.ObjectData is now a JSON String        

            
            //obj_instance.obj_designDelegate.fn_updateMap(JSON.parse(obj_post.ObjectData));//update map        
            

            if(bln_debug){obj_instance.fn_debug("BEFORE PUT POST");}
            this.fn_putPost(obj_post);

            if(bln_debug){obj_instance.fn_debug("AFTER PUT POST");}
            
            //Very Important - do not fuck about with this
            obj_instance.obj_design.int_modeExecute=int_modeExecuteCopy;//put back in original mode
            //Very Important - do not fuck about with this       
            
        }
        save(obj_post){ //native callback generally overidden                
            //console.log("Design File Save Existing Record Id Native Call Back")        
            //*
            //console.log("save obj_post.Objectdata: " + obj_post.ObjectData);
            //console.log(obj_post.ObjectData);
            obj_post.ObjectInstance.obj_designDelegate.fn_updateMap(obj_post.ObjectData);//update map        
            if(obj_post.RELOADREQUIRED){
                alert("NEW CLASS : RELOADREQUIRED");
            }
            //*/
        }

        saveAs(obj_post){//native callback
            //console.log("Design File SaveAs New  Record Id Native Call Back")
            
            //*
            //START REQUIRED DO NOT REMOVE
            let int_idRecord=parseInt(obj_post.RecordId);        
            obj_post.ObjectInstance.obj_design.int_idRecord=int_idRecord;
            //END REQUIRED DO NOT REMOVE
            //*/
            //console.log("saveAs obj_post.Objectdata: " + obj_post.ObjectData);
            //console.log(obj_post.ObjectData);
            obj_post.ObjectInstance.obj_designDelegate.fn_updateMap(obj_post.ObjectData);//update map        
            
        }              

        fn_formatPost(obj_ini){

            let obj_projectLocal, str_nameFolderServer, str_nameFileServer;

            let obj_post=new Object;   
            
            str_nameFolderServer="xdezign"                  
            str_nameFileServer=obj_ini.str_nameFileServer;
            
            
            obj_post.URL=obj_path.fn_getURLServerFile(str_nameFolderServer, str_nameFileServer);      
            
            obj_post.NotifierId=obj_ini.str_idAJAXNotifier;                        
            obj_post.Action=obj_ini.str_action;                
            obj_post.ActionCallBack=obj_ini.str_actionCallback;                                        
            if(!obj_post.ActionCallBack){            
                obj_post.ActionCallBack=obj_ini.str_action;                
            }

            obj_post.RecordId=obj_ini.RecordId;//could get complicated if obj_instance supplied                                
            obj_post.EditPinRelease=obj_ini.bln_editPinRelease;        
            obj_post.EditPin=obj_ini.bln_editPin;
            obj_post.PalettePinRelease=obj_ini.bln_palettePinRelease;        
            obj_post.PalettePin=obj_ini.bln_palettePin;
            obj_post.DynamicPin=obj_ini.bln_dynamicPin;                
            
            let obj_instance=obj_ini.obj_instance;
            if(obj_instance){            
                obj_post.DesignId=obj_instance.obj_design.str_idXDesign;            
                obj_post.RecordName=obj_instance.obj_design.str_name;
                obj_post.RecordShortName=obj_instance.obj_design.str_nameShort;                                    
                obj_post.ServerIndex=obj_instance.obj_design.bln_serverIndex;                                
                obj_post.RecordType=obj_instance.obj_design.str_type;                                    
                obj_post.RecordId=obj_instance.obj_design.int_idRecord;                                    
                obj_post.ClassController=obj_instance.obj_design.bln_classController;                                    
                obj_post.EditPinRelease=obj_instance.obj_design.bln_editPinRelease;                 
                obj_post.EditPin=obj_instance.obj_design.bln_editPin;     
                obj_post.PalettePinRelease=obj_instance.obj_design.bln_palettePinRelease;                 
                obj_post.PalettePin=obj_instance.obj_design.bln_palettePin;     
                obj_post.DynamicPin=obj_instance.fn_getDynamic();                                            
                obj_post.CreatedDate=obj_instance.obj_design.str_createdDate;
                obj_post.ModifiedDate=obj_instance.obj_design.str_modifiedDate;            
                obj_post.LastVersionDate=obj_instance.obj_design.str_lastVersionDate;            
                obj_post.CategoryName=obj_instance.obj_design.str_categoryName;            
                obj_post.ReleaseLabel=obj_instance.obj_design.str_releaseLabel;                        
                obj_post.CreateRelease=obj_project.obj_holder.bln_createRelease;                        
                obj_post.DependentId=obj_instance.fn_compileDependentId();
                //get a list of your classlist
                let str_List1=obj_instance.obj_design.str_classList;                                    
                //get a list of every classlist in your child arr item            
                let str_List2=obj_instance.fn_compileDependentClassList();
                str_List2="";
                //get a comnbined list of the above
                let str_List3=str_List1 + "," + str_List2;            
                str_List3=obj_shared.fn_remove(","+str_List3+",", ",notset,");
                str_List3=obj_shared.fn_remove(","+str_List3+",", ","+obj_instance.obj_design.str_type+",");                        
                str_List3=obj_shared.fn_trimComma(str_List3);            
                str_List3=obj_shared.fn_formatUniqueList(str_List3);                        
                obj_post.ClassList=str_List3;                        
                obj_post.RecordExtend=obj_instance.obj_design.str_classExtend;                        
                obj_post.StageRelease=obj_instance.obj_design.bln_stageRelease;                                    
                
                if(obj_projectTarget===obj_instance){
                    obj_post.ComponentCode=obj_instance.obj_holder.str_componentCode;                
                }
            }
            return obj_post;
        }   

        fn_AJAXLocateObjectInstance(obj_post){//overide base class function 
            let int_index;

            obj_post.ObjectInstance=false;
            int_index=obj_post.DesignId.indexOf("DesignIdNotSet");        
            if(int_index==-1){                            
                //obj_post.ObjectInstance=obj_project.fn_findItemById(obj_post.DesignId);//try to find in own Project     
                //depracated léooing in own project - certainly no good for saving .
                obj_post.ObjectInstance=obj_projectTarget.fn_findItemById(obj_post.DesignId);//try to find in own Project            
                if(!obj_post.ObjectInstance){
                    if(obj_projectTarget){
                        obj_post.ObjectInstance=obj_projectTarget.fn_findItemById(obj_post.DesignId);//try to find in design Project
                    }
                }        
            }               
            return obj_post.ObjectInstance;
        }

        fn_mySerializeReplacer(){ //when Saving
            
            //DESIGNFILE overide serialize object
            const seen = new WeakSet();
            return (key, value) => {

                switch(key){                
                case "bln_removeId":
                    return;  
                case "bln_isComponent":
                    return;  
                case "obj_domAttribute":
                    //return;          
                    break;
                case "dom_obj":
                        return;
                case "dom_objContent":
                    return;
                case "__quill":
                    return;
                case "obj_ini":
                    return;        
                case "obj_holder":
                    return;        
                case "obj_designDelegate":
                    return;        
                case "xxstr_nameShort":
                    return;                
                case "bln_isContainer":
                    return;        
                case "str_prefix":
                    return;                        
                case "int_modeExecute":
                return;                    
                case "str_idXDesign":            
                    if(value.indexOf("myId")==0){                
                        //return;//Dont save automatically assigned ids
                    }        
                break;
                default:            
            }           

            if(value===false){
                return;
            }
            
            /*
            switch(value){                                                 
                case undefined:
                    return;                    
                case "notset":
                    return;                    
                case "":
                    return "";                    
                case false:
                    return;                                                                
            }
            //*/
            
            //console.log(key + ": " + value);

            if (typeof value === "object" && value !== null) {

                if(!value.constructor){return;}
                if(!value.constructor.name){
                    alert("error: value.constructor.name");
                    return;                
                }                      
                
                if(value.constructor.name==="Holder"){return;}//Dont serialize this object (or the objects attached to it)
                
                let int_length=Object.keys(value).length;
                if(int_length===0){                
                    return;
                }

                if(value.bln_isComponent){                

                    let obj_instance=value;  
                    let int_idRecord, str_type, str_name;

                    //console.log("obj_instance.obj_design.str_name: " + obj_instance.obj_design.str_name);                    
                    //if(value!==this.obj_myObject){//referes to the component that intiated the serializaiton ie the component
                    if(obj_instance!==this.obj_myObject){//referes to the component that intiated the serializaiton ie the component
                        
                        //This allows Controls not be saved - e.g boot controls
                        //also design control that is a special case, apparently.                        
                        if(obj_instance.fn_preventSave()){
                            //console.log(obj_instance.obj_design.str_name + ": ERROR fn_preventSave() is true but has not been removed from parent arr_item");
                            return;
                        }                    
                        
                        int_idRecord=value.obj_design.int_idRecord;
                        str_type=value.obj_design.str_type;
                        value={
                            obj_design:{
                                int_idRecord:int_idRecord,
                                str_type:str_type
                            }
                        }
                    }                
                }

                if (seen.has(value)) {
                    //return "circular";
                    return;
                }   
                seen.add(value);
            }
            //console.log("value: " + value)        
            return value;
            };
        }          

        fn_saveProject(){//BUTTON PRESS            

            //obj_project.fn_unLoad();   
            //console.log("Start Save: " + obj_projectTarget.obj_design.str_name);                        

            let obj_ini=new Object;
            obj_ini.ObjectInstance=obj_projectTarget;                   
            this.obj_holder.ObjectSaveInstance=obj_projectTarget;                          
            obj_ini.str_action="saveProject";                           
            obj_ini.str_nameFileServer="save.php";
            obj_ini.RecordId=obj_projectTarget.fn_getDesignProperty("int_idRecord");
            this.fn_saveComponent(obj_ini);
        }                         

        fn_onSaveProject(){
            
            //console.log("Saved Project: " + obj_projectTarget.obj_design.str_name);                        

            this.fn_publishProject();
        }

        fn_publishProject(){            

            //console.log("Start Publish: " + obj_projectTarget.obj_design.str_name);                        

            //this.obj_holder.obj_container.fn_setText(obj_projectTarget.obj_design.str_name);            
            obj_projectTarget.obj_design.str_lastVersionDate="notset";            
            
            let obj_ini=new Object;
            obj_ini.obj_instance=obj_projectTarget;                        
            obj_ini.str_idAJAXNotifier=this.obj_design.str_idXDesign;
            obj_ini.str_actionCallback="fn_onPublishProject";    
            
            if(obj_ini.obj_instance.obj_design.int_idRecord===0){return;}                    
            obj_ini.str_nameFileServer="save.php";                          
            obj_ini.str_action="versionProject";            
            let obj_post=this.fn_formatPost(obj_ini);               
            obj_post.ObjectData=this.fn_actionSerialize(obj_ini.obj_instance);//obj_post.ObjectData is now a JSON String
            //this seems wrong
            //serialize replacer contains a call to fn_save.
            //when revist, consider running a properer save action and picking up the serilaize dobject from there.
            this.fn_putPost(obj_post);            
        }              
        fn_onPublishProject(obj_post){                        
            
            obj_projectTarget.obj_design.str_lastVersionDate=obj_post.LastVersionDate;                         
            obj_project.obj_design.str_urlSubdomain=obj_post.URLSubdomain;                         

            //console.log("Published Project: " + obj_projectTarget.obj_design.str_name);                        
            let obj_menuButton=this.fn_getMenuButton();
            let obj_dashboard=obj_menuButton.fn_locateItem("xdezign_dashboard_project")
            this.fn_notify(obj_dashboard, "fn_onPublishProject");

            //console.log("URLProjectVersion: " + obj_post.URLProjectVersion);                                                
            //this.fn_viewInBrowser(obj_post.URLProjectVersion);
        }
        fn_releaseProject(){

            //console.log("fn_releaseProject");
    
            obj_projectTarget.obj_holder.bln_createRelease=true;                    

            let obj_ini=new Object;                              
            obj_ini.obj_instance=obj_projectTarget; 
            obj_ini.str_action="releaseProject";                           
            obj_ini.str_nameFileServer="save.php";                                      
            obj_ini.str_actionCallback="fn_onReleaseProject";
            obj_ini.str_idAJAXNotifier=this.obj_design.str_idXDesign;            
            this.fn_runAction(obj_ini);            
        }
        fn_onReleaseProject(obj_post){
            //console.log("Released Project: " + obj_projectTarget.obj_design.str_name);                                                  
            
            let obj_menuButton=this.fn_getMenuButton();
            let obj_dashboard=obj_menuButton.fn_locateItem("xdezign_dashboard_project")
            this.fn_notify(obj_dashboard, "fn_onReleaseProject");        
        }

        //MAINTAIN
        fn_maintain(){                                        

            let obj_ini=new Object;                              
            obj_ini.obj_instance=obj_projectTarget; 
            obj_ini.str_action="maintain";                           
            obj_ini.str_nameFileServer="maintain.php";                
            obj_ini.str_actionCallback="fn_onMaintainProject";
            obj_ini.str_idAJAXNotifier=this.obj_design.str_idXDesign;            
            this.fn_runAction(obj_ini);            
          }    
          fn_onMaintainProject(){                

            let obj_menuButton=this.fn_getMenuButton();
            let obj_dashboard=obj_menuButton.fn_locateItem("xdezign_dashboard_project")
            this.fn_notify(obj_dashboard, "fn_onMaintainProject");        
          }  
          //MAINTAIN

          


    }//END CLS
    //END TAG
    //END component/xdezign_dashboard_save