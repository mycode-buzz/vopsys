class User {    
  constructor() {          
  } 
  fn_initialize(obj_user){//obj_post.UserHome
    this.obj_user=obj_user;  
    let MetaPermissionTag=this.fn_cleanTag(obj_user.MetaPermissionTag);
    let Admin=false;    
    let Interface=false;
    if(this.MetaSystemOwner){
      MetaPermissionTag="#ADMIN";          
    }
    if(MetaPermissionTag.toLowerCase()==="#admin"){
      Admin=true;
    }
    if(this.MetaUserSystemId===100){
      Interface=true;
    }
      
    this.MetaPermissionTag=MetaPermissionTag;
    this.Admin=Admin;
    this.Interface=Interface;
    
    
  }
  fn_cleanTag(str_tag=""){    
    return str_tag.toUpperCase().trim();
}
  fn_debug(){    
    let obj_user=this.obj_user;    
    console.log(obj_user);
  }
  get MetaSystem(){      
    return this.obj_user.MetaSystem;
  }  
  get MetaUserId(){      
    return this.obj_user.MetaUserId;
  }  
  get MetaUserEmail(){      
    return this.obj_user.MetaUserEmail;
  }    
  get MetaUserSystemId(){      
    return this.obj_user.MetaUserSystemId;
  }    
  get Admin(){      
    return this.obj_user.Admin;
  }
  set Admin(bln_value){      
    this.obj_user.Admin=bln_value;
  }
  get Interface(){      
    return this.obj_user.Interface;
  }
  set Interface(bln_value){      
    this.obj_user.Interface=bln_value;
  }
  get MetaPermissionTag(){      
    return this.obj_user.MetaPermissionTag;
  }
  set MetaPermissionTag(str_value){      
    this.obj_user.MetaPermissionTag=str_value;
  }  
  get MetaSystemOwner(){      
    return this.obj_user.MetaSystemOwner;
  }
  get MetaUserGroupId(){      
    return this.obj_user.MetaUserGroupId;
  }
}