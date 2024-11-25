
//XSTART component/xdesign_ajax
  class xapp_ajax extends AJAX{
    constructor(obj_ini) {      
      super(obj_ini);        
    } 
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);                
    }    
  
    fn_formatPost(obj_ini){ //overides parent AJAX format post    
    
      if(!obj_ini){return;}            
      
      obj_ini.bln_debugServer=this.obj_holder.bln_debugServer;      
      if(!obj_ini.str_recordName){
        obj_ini.str_recordName=this.obj_design.str_recordName;
      }
      if(!obj_ini.str_nameShort){
        obj_ini.str_nameShort=this.obj_design.str_nameShort;
      }
      
      if(!obj_ini.str_idAJAXNotifier){
        obj_ini.str_idAJAXNotifier=this.obj_design.str_idXDesign;
      }
      if(this.obj_design.str_nameFolderServer){obj_ini.str_nameFolderServer=this.obj_design.str_nameFolderServer;}
      if(this.obj_design.str_nameFileServer){obj_ini.str_nameFolderServer=this.obj_design.str_nameFileServer;}
      if(!obj_ini.str_nameFolderServer){obj_ini.str_nameFolderServer=this.obj_design.str_type;}
      if(!obj_ini.str_nameFileServer){obj_ini.str_nameFileServer=this.obj_holder.str_nameFileServer;}    
      obj_ini.str_urlServer=obj_path.fn_getURLServerFile(obj_ini.str_nameFolderServer, obj_ini.str_nameFileServer);                 
      
      //console.log("xapp_Ajax obj_ini.str_idAJAXNotifier: " + obj_ini.str_idAJAXNotifier);
      //console.log("xapp_Ajax obj_ini.str_action: " + obj_ini.str_action)
      //console.log("xapp_Ajax obj_ini.str_urlServer: " + obj_ini.str_urlServer)
      return super.fn_formatPost(obj_ini); // returns an obj_post
    }   

    fn_createDynamicContent(){
      let obj_ini;
      obj_ini=new Holder;                                    
      obj_ini.obj_design.str_type="xapp_dynamic_content";    
      obj_ini.obj_design.str_name="xapp_dynamic_content";          
      this.obj_holder.obj_dynamicContent=this.fn_addItem(obj_ini);                    
    }
  
  }//END CLS
  //END TAG
  //END component/xdesign_ajax