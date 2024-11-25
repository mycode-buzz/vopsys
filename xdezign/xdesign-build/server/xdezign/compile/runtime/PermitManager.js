class PermitManager {  
    constructor(obj_user) {        

        this.bln_debug=false;
        
        let obj_permit;
        obj_permit=new Permit;                    
        this.obj_permit100=obj_permit;

        obj_permit=new Permit;            
        obj_permit.bln_read=false;
        obj_permit.bln_write=false;                  
        this.obj_permit0=obj_permit;

        this.obj_user=obj_user;                    
    }       

    fn_compare(obj_metaSource, obj_metaCompare,  str_message="", bln_debugPermit=false){        

        this.bln_debugPermit=bln_debugPermit;

        if(this.bln_debugPermit){
            console.log(str_message);                    
            console.log(obj_metaSource);                  
            console.log(obj_metaCompare);                  
        }


        if(obj_shared.fn_isEmptyObject(obj_metaSource)){        
            //console.log("source is blank");
            return this.obj_permit100;            
        }

        if(obj_shared.fn_isEmptyObject(obj_metaCompare)){                
            //console.log("compare is blank");
            return this.obj_permit100;            
        }        
        
        obj_metaSource.MetaPermissionTag=this.fn_cleanTag(obj_metaSource.MetaPermissionTag);       
        obj_metaCompare.MetaPermissionTag=this.fn_cleanTag(obj_metaCompare.MetaPermissionTag);               

        let obj_permit;
        obj_permit=this.fn_generalPermission(obj_metaSource.MetaPermissionTag, obj_metaCompare.MetaPermissionTag);             
        if(obj_permit){            
            return obj_permit;
        }

        obj_permit=this.fn_specificPermission(obj_metaSource.MetaPermissionTag, obj_metaCompare.MetaPermissionTag);             
        if(obj_permit){            
            return obj_permit;
        }
        return false;
    }    

    
    fn_generalPermission(MetaPermissionTag, MetaPermissionCompare){
        
        if(this.bln_debugPermit){
            console.log("fn_generalPermission");
        }

        if(this.bln_debugPermit){
            console.log("GEN MetaPermissionTag: [" + MetaPermissionTag + "]");            
            console.log("GEN MetaPermissionCompare: [" + MetaPermissionCompare + "]");                    
        }

        let obj_permit;        

        obj_permit=this.fn_checkInterface(MetaPermissionTag);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return source is INTERFACE");
            }
            return obj_permit;
        }
        obj_permit=this.fn_checkInterface(MetaPermissionCompare);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return source is INTERFACE");
            }
            return obj_permit;
        }
        
        obj_permit=this.fn_checkAdmin(MetaPermissionTag);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return source is ADMIN");
            }
            return obj_permit;
        }
        obj_permit=this.fn_checkAdmin(MetaPermissionCompare);
        if(obj_permit){
            if(this.bln_debugPermit){
                console.log("return compare is ADMIN");
            }
            return obj_permit;
        }        

        if(this.obj_user.MetaUserSystemId===100){   
            return this.obj_permit100;            
        }
        
        //End General Permission
        return false;
    }       
    
    
    fn_checkAdmin(MetaPermissionTag){
        
        let bln_contains=obj_shared.fn_inStr("#ADMIN", MetaPermissionTag);//check against compare for match        
        if(bln_contains){                
            if(this.bln_debugPermit){
                console.log("MetaPermissionTag is ADMIN");
            }

            if(this.obj_user.MetaPermissionTag==="#ADMIN"){                
                if(this.bln_debugPermit){
                    console.log("return this.obj_permit100: MetaPermissionTag and user is ADMIN or SystemOwner");
                }
                return this.obj_permit100;
            }
            else{                
                if(this.bln_debugPermit){
                    console.log("return this.obj_permit0: MetaPermissionTag is ADMIN but user is not");
                }
                return this.obj_permit0;
            }
        }        
        return false;
    }    
    fn_checkInterface(MetaPermissionTag){

        let bln_contains=obj_shared.fn_inStr("#INTERFACE", MetaPermissionTag);//check against compare for match        
        if(bln_contains){                
            if(this.obj_user.MetaUserSystemId===100){                   
                return this.obj_permit100;
            }
            else{                            
                return this.obj_permit0;        
            }   
        }        
        return false;
    }    

    fn_specificPermission(MetaPermissionTag, MetaPermissionCompare){

        if(this.bln_debugPermit){
            console.log("fn_specificPermission");
        }        

        if(this.bln_debugPermit){
            console.log("A MetaPermissionTag: [" + MetaPermissionTag + "]");            
            console.log("B MetaPermissionCompare: [" + MetaPermissionCompare + "]");                    
        }

        let arr_metaPermissionTag=MetaPermissionTag.split("#");        
        
        let bln_foundTag=false;
        let str_tagPermission="";
        var obj_permit;
        for(let i=0;i<arr_metaPermissionTag.length;i++){
            let str_tagFull=arr_metaPermissionTag[i];
            if(!str_tagFull){continue;}            
            
            let arr_tagFull=str_tagFull.split(" ");
            let str_tagName="#"+arr_tagFull[0].trim();
            
            let bln_match;
            
            bln_match = obj_shared.fn_inStr(str_tagName, MetaPermissionCompare);//check against compare for match                        

            if(!MetaPermissionCompare){
                bln_match=true;
            }
            
            if(!bln_match){                
                continue;
            }
            bln_foundTag=true;
            
            let arr_tagPermission=arr_tagFull.slice(1);            
            str_tagPermission=arr_tagPermission.join(" ").trim();            

            if(this.bln_debugPermit){
                console.log("C str_tagName: [" + str_tagName + "]");            
                console.log("D str_tagPermission: [" + str_tagPermission + "]");                    
            }

            obj_permit=new Permit;

            switch(str_tagPermission){
                case "HIDE":
                    obj_permit.bln_read=false;  
                    obj_permit.bln_write=false;  
                break;
                case "LOCK":
                    obj_permit.bln_write=false; 
                break;
                case "LOCKAFTER":
                    obj_permit.bln_writeOnce=true;  
                case "WRITEONCE":
                    obj_permit.bln_writeOnce=true;  
                break;                
            }            
            
        }//END OF LOOP
        if(!bln_foundTag){        
            if(this.bln_debugPermit){
                console.log("no tag found - no change");
            }
            return false;
            //return this.obj_permit0;//NO TAGS WERE MATCHED
            
        }    
        
        if(this.bln_debugPermit){
            console.log("tags found - apply permission");
        }

        //TAGS WERE MATCHED AND STANDARD PERMISSIONS APPLIED        
        return obj_permit;        
    }    

    fn_cleanTag(str_tag){
        if(!str_tag){
            return "";
        }
        str_tag+="";
        return str_tag.toUpperCase().trim();
    }

    fn_applyPermit(obj_target, obj_permit, bln_newRecord=false){       
        
        obj_target.HiddenPin=this.fn_getHidden(obj_permit);        
        obj_target.LockedPin=this.fn_getLocked(obj_permit, bln_newRecord);        

        if(this.bln_debugPermit){
            console.log("obj_target.HiddenPin: " + obj_target.HiddenPin);
            console.log("obj_target.LockedPin: " + obj_target.LockedPin);
        }        
      }    

    fn_getHidden(obj_permit){
        return obj_permit.bln_read ? false : true;
    }
    fn_getLocked(obj_permit, bln_newRecord=false){
        //*
        if(!bln_newRecord && obj_permit.bln_writeOnce){
            return true;
        }
            //*/
        return  obj_permit.bln_write ? false : true;                    
    }    

    fn_runTagAdmin(){
        
        let obj_user=this.obj_user;                        
        if(obj_user.MetaPermissionTag!=="#ADMIN"){
            return this.obj_permit0;
        }
        return this.obj_permit100;
    }
    fn_isAdmin(){
        let obj_permit=this.fn_runTagAdmin();
        if(obj_permit.bln_read)return true;
        return false;
    }

    fn_getPassPermission(){
        return this.obj_permit100;
    }


}//END OF CLASS


class Permit {  
    constructor() {                
        this.bln_read=true;
        this.bln_write=true;
        this.bln_writeOnce=false;
    }   
    fn_debug(){

        //console.log(this);
    }
    
}//END OF CLASS