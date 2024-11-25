  class navblock extends panel {
    constructor(obj_ini) {
      super(obj_ini); // call the super class constructor
    }    
    fn_initialize(obj_ini){
      super.fn_initialize(obj_ini);
      

      //START INITIALIZE DESIGN      
      //this.fn_setType("navblock");      
      this.fn_setTag("navblock");      

      this.obj_holder.bln_listenClick=true;         

      this.fn_extends("panel");                         

      //if(this.obj_domProperty.innerText===undefined){this.obj_domProperty.innerText="My Nav"}              
      if(this.obj_design.int_idNavContainer==undefined){this.obj_design.int_idNavContainer=0;}        
      if(this.obj_design.int_idNavRequest==undefined){this.obj_design.int_idNavRequest=0;}              
      if(this.obj_design.bln_isDisabled==undefined){this.obj_design.bln_isDisabled=true;}                                      
      
      //END INITIALIZE DESIGN      

      //START INITIALIZE STYLE       
      
      
      //this.fn_requires("ajax");                   
      //this.fn_requires("grid");                   
      //END INITIALIZE STYLE 
      
      this.obj_holder.bln_listenClick=true;
    }
   fn_onClick(e){//can be overidden                
      this.fn_getTargetItem();      

      
      obj_project.fn_unsetEvent();    
    }      

    fn_validatePost(obj_post){//runs on return from server fn_getBootalble;

      if(obj_post.RecordId===0){
          console.log("Record Not Found on Server.");        
          return false;
      }
      /*                
      obj_post.RecordId;
      obj_post.RecordType;        
      obj_post.RowData;
      obj_shared.fn_enumerateObject(obj_post.ObjectData, "aaaaaaaaaaaa");
      //*/
      return true;
      
  } 

    fn_register(){

      if(this.fn_getDesignProperty("bln_isDisabled")){    
        console.log("Note NavBlock: isDisabled is true: " + this.obj_design.bln_isDisabled);
        return false;
      }    
  
      if(!this.obj_design.int_idNavContainer){
        console.log("Error NavBlock: idNavContainer is false");
        return false;
      }
      
      if(!this.obj_design.int_idNavRequest){
        console.log("Error NavBlock: idNavRequest is false");
        return false;
      }
      return true;
  }
  fn_getTargetItem(){
    

    let obj_ini, obj_navContainer, obj_navRequest;    
    
    if(!this.fn_register()){return;}
    
    //*    
    obj_navContainer=obj_project.fn_findItemByIdRecord(this.obj_design.int_idNavContainer);        
    if(!obj_navContainer){
      console.log("Error NavBlock: navContainer is false");
      return;
    }
    obj_navContainer.fn_debug("Going to LOAD into NavContainer");
    obj_navContainer.fn_removeAllItems();   

    obj_ini=new Holder;
    obj_ini.obj_design.int_idRecord=this.obj_design.int_idNavRequest;           
    

    obj_navRequest=obj_navContainer.fn_addItem(obj_ini);//ServerSideItem
  }

  

  
  
    
  
}//END CLS

