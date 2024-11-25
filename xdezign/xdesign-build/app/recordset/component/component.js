
//XSTART component/recordset
class recordset extends xapp_ajax{
  constructor(obj_ini) {      
    super(obj_ini);        
  } 
  fn_initialize(obj_ini){
    super.fn_initialize(obj_ini);                
    
    
    //this.fn_setType("recordset");      
    this.fn_setTag("recordset");            
    
    this.fn_extends("xapp_ajax");                    

    this.obj_holder.bln_debugServer=false;

    this.int_offset=0;
    this.int_limit=0;
    
  }
  
  fn_onStateChange(){                       
    this.fn_close();
    return true;
  }   
  
  fn_formatPost(obj_ini){      
    
    let obj_post=super.fn_formatPost(obj_ini);
    obj_post.OFFSET=this.int_offset;
    obj_post.LIMIT=this.int_limit;
    return obj_post;
}   

  
}//END CLS
//END TAG
//END component/recordset