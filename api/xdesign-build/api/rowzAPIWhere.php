<?php

class rowzAPIWhere extends rowzAPIData{    

    function fn_getWhereCriteria(){
                
        $obj_call=$this->obj_call;
        
        $obj_metaView=$obj_call->obj_metaView;                
        $obj_paramView=$obj_metaView->obj_param;
        
        $MetaUserId=$this->obj_userLogin->MetaUserId;
        $MetaViewId=$obj_paramView->MetaViewId;        
        if(empty($MetaViewId)){
            //$this->fn_addConsoleAPI("END EARLY fn_doGetData ---------------------------------");            
            return;
        }

        //SEARCH IS DONE VIA ROWQUERY
        $str_whereCriteria=$obj_call->str_rowMatchSQL; //DEFINED IN row_match // fn_setRowMatchSQL
        //$this->fn_addConsoleAPI("xx obj_call->str_rowMatchSQL", $obj_call->str_rowMatchSQL);            
        //SEARCH IS DONE VIA ROWQUERY        

        if($obj_paramView->MetaViewId==$this->MetaLinkViewId){
            return $str_whereCriteria;
        }
        
        $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
        
        $str_sql="(/*API LOCK TO SYSTEM*/`meta_data`.`MetaDataSystemId`=".$MetaUserSystemId.")";        
        if(!empty($str_sql)){
            if(!empty($str_whereCriteria)){$str_whereCriteria.=" AND ";}                
            $str_whereCriteria.=$str_sql;        
        }           

        if($obj_call->get_autojoin){
            $str_sql="(/*API RECYCLE*/`meta_link`.`DeleteDate` IS NULL)";
            if(!empty($str_sql)){
                if(!empty($str_whereCriteria)){$str_whereCriteria.=" AND ";}                
                $str_whereCriteria.=$str_sql;        
            }
        }        
        
        $str_sql=$this->fn_collateAPIMetaPermissionTagWhereSQL();
        if(!empty($str_sql)){
            if(!empty($str_whereCriteria)){$str_whereCriteria.=" AND ";}                
            $str_whereCriteria.=$str_sql;        
        }

        //only add Archive to Get, Dont add to General where statement        
        
        
        return $str_whereCriteria;
    }

    function fn_collateAPIMetaPermissionTagWhereSQL(){                
                
        $obj_call=$this->obj_call;        

        $MetaSystemOwner=$this->obj_userLogin->MetaSystemOwner;                        
        $MetaPermissionTag=$this->obj_userLogin->MetaPermissionTag;                                        

        if($MetaSystemOwner){
            if($obj_call->api_debug){            
                $this->fn_varDump($MetaSystemOwner, "user is MetaSystemOwner, no restrict");                
            }     
            return;
        }

        if($this->obj_userLogin->MetaPermissionTag==="#ADMIN"){
            if($obj_call->api_debug){            
                $this->fn_varDump($MetaSystemOwner, "user permission is ADMIN, no restrict");                
            }     
            return;
        }        

        return $this->fn_getAPIMetaPermissionTagSQL();                                
    }     
    
    function fn_getAPIMetaPermissionTagSQL(){               
                
        $obj_call=$this->obj_call;
        
        $arr_metaPermissionTag = explode("#", $this->obj_userLogin->MetaPermissionTag);        
        $int_count=count($arr_metaPermissionTag);                
        $str_wildcardCharacter="%";                               

        $str_sql="";
        $int_label_count=0;
        for($i=0;$i<$int_count;$i++) {                                                                               
            
            $str_metaPermissionTag=$this->fn_cleanAPITag($arr_metaPermissionTag[$i]);

            if(empty($str_metaPermissionTag)){                
                continue;
            }
            
            /*
            if($str_metaPermissionTag==="#ALL"){//handled by MetaPermissionTag =all
                continue;
            }  
            //*/          
            $str_tagName="MetaPermissionTag".$int_label_count;
            $str_sql.="`meta_data`.`MetaPermissionTag` LIKE :$str_tagName OR ";                                                                            
            $obj_call->arr_metaWhere[$str_tagName] = $str_wildcardCharacter.$str_metaPermissionTag.$str_wildcardCharacter;
            $int_label_count++;                                
        } 
        $str_sql=trim($str_sql, " OR ");                

        if(!empty($str_sql)){
            $str_sql="(/*API TAG ACCESS*/".$str_sql.")";
        }
        return $str_sql;
    }

    
    
    


    

}//end of class