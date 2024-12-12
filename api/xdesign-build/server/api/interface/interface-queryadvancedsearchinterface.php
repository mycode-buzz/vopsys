<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class interface_advancedsearchinterface extends interface_order{
    function __construct() {                        
        
        parent::__construct();                                        
    }
    
    function fn_formatQueryInterface(){

        

        //$this->bln_debugRunSelect=true;
        $RunSearch=$this->obj_post->RunSearch;
        //$RunSearch=true;
        if($this->bln_debugRunSelect){
            $this->fn_addEcho("START fn_formatQueryInterface");
        }

        
        
        
        if($this->bln_debugAction){
            //$this->fn_addEcho("RunSearch", $RunSearch);
            //$RunSearch=t;
        }

        if(!$this->bln_debugAction){
            //$this->fn_addEcho("RunSearch", $RunSearch);
            //$RunSearch=false;
        }
        
        
        if($RunSearch){                        
            $bln_value=$this->fn_updateQueryInterface();            
            if($bln_value){                
                if($this->bln_debugRunSelect){
                    $this->fn_addEcho("UPDATE WAS MADE TO DATABASE QUERY VALUE");
                }
            }
            
            
        
            
            if($this->bln_debugExecute){
                //$this->fn_addConsole("UPDATE WAS MADE TO DATABASE QUERY VALUE");                         
            }              
            
            $LoadReportInterface=true;
            global $LOGIN;      
            if(empty($LOGIN)){      
            
                if($LoadReportInterface){
                    if($this->bln_debugRunSelect){
                        $this->fn_addEcho("WRITE INTERFACE", $this->obj_post->LoadReportInterface);                         
                    }                                        
                    $this->fn_writeQueryInterface();                            
                }
                else{
                    //$this->fn_addConsole("NO REQUEST TO WRITE INTERFACE", $this->obj_post->LoadReportInterface);                         
                }
            }  
    
        }
        else{
            if($this->bln_debugRunSelect){
                $this->fn_addEcho("RunSearch IS FALSE, NO UPDATE, NO CLIENT WRITE ON DATABASE QUERY VALUE");                         
            }                    
        }      
    
        if($this->bln_debugRunSelect){
            $this->fn_addEcho("END fn_formatQueryInterface");
        }
    
    }
    
    
    
    function fn_writeQueryInterface(){        
    
        //$this->bln_debugRunSelect=true;
        if($this->bln_debugRunSelect){
            $this->fn_addEcho("START WRITE QUERY TO CLIENT");                             
        }

        
    
        $this->fn_loadQueryListFromDB();        
    
        $QueryList=$this->obj_userLogin->QueryList;
        $QueryListDisabled=$this->obj_userLogin->QueryListDisabled;        
    
        if(empty($QueryList)){
            $QueryList="";
        }
        if(empty($QueryListDisabled)){
            $QueryListDisabled="";
        }
        
        $this->obj_post->QueryList="";
        $this->obj_post->QueryListDisabled="";       
        
        
        if($this->bln_debugRunSelect){         
            $this->fn_addEcho("MetaViewId", $this->obj_post->MetaViewId);                             
            $this->fn_addEcho("QueryList", $QueryList);                             
            $this->fn_addEcho(">QueryListDisabled", $QueryListDisabled);                                     
        }
    
        $QueryList=$this->fn_trimBoth($QueryList, $this->str_listSeparatorOr);
        $QueryListDisabled=$this->fn_trimBoth($QueryListDisabled, $this->str_listSeparatorOr);        
        
        if($this->bln_debugRunSelect){        
            $this->fn_addEcho("WRITE QueryList", $QueryList);                     
            $this->fn_addEcho("WRITE QueryListDisabled", $QueryListDisabled);                     
        }
    
        
        
        /*
        if($this->bln_debugExecute){
            $this->fn_varDump($this->obj_userLogin);                     
            
            $this->fn_addEcho("MetaMoveTag", $this->obj_userLogin->MetaPermissionTag);
        }
        //*/
    
    
    
        $str_metaPermissionTagList="";
        $arr_metaPermissionTagList=[];
        $bln_runDistinct=true;
        $MetaPermissionTag=$this->obj_userLogin->MetaPermissionTag;                    
        
        switch($MetaPermissionTag){
            case "#ADMIN":
            case "":
                $bln_runDistinct=true;
            break;
            default:                    
                //to do : explode MetaPermissionTag ande recombine sepearated by QOR
        }
        
        //*                        
        if($bln_runDistinct){
    
            $str_listSeparatorOr=$this->str_listSeparatorOr;
            
            //*
            $str_sql="SELECT GROUP_CONCAT(DISTINCT Replace(`MetaPermissionTag`, ' #', '$str_listSeparatorOr#') SEPARATOR '$str_listSeparatorOr') AS 'MetaPermissionTagList'  FROM `meta_data`.`meta_data`        
            WHERE TRUE 
            AND MetaDataSystemId=:MetaDataSystemId                
            AND MetaPermissionTag<>''
            ORDER BY MetaPermissionTag
            ;";  
            //*/
            //$this->fn_addConsole("this->obj_userLogin->MetaDataSystemId", $this->obj_userLogin->MetaUserSystemId);                     
            //*            
            $stmt = $this->fn_executeSQLStatement($str_sql, [      
                'MetaDataSystemId'=>$this->obj_userLogin->MetaUserSystemId,                    
            ]);                
            
            $arr_row=$stmt->fetch();                     
            $str_metaPermissionTagList=$arr_row["MetaPermissionTagList"];
            if($this->bln_debugRunSelect){        
                $this->fn_addEcho("str_metaPermissionTagList", "[".$str_metaPermissionTagList."]");                     
            }            
    
            $str_listSeparatorOr=$this->str_listSeparatorOr;
            
            $str_sql="SELECT GROUP_CONCAT(DISTINCT CONCAT('',MetaUserAtTag)  SEPARATOR '$str_listSeparatorOr') AS 'MetaUserAtTag' FROM `meta_data`.`meta_data` JOIN `meta_user`.`meta_user` ON `meta_user`.MetaUserId=meta_data.MetaDataOwnerId
            WHERE TRUE
            AND MetaDataSystemId=:MetaDataSystemId                
            ORDER BY MetaUserAtTag
            ;";
            
            $stmt = $this->fn_executeSQLStatement($str_sql, [      
                'MetaDataSystemId'=>$this->obj_userLogin->MetaUserSystemId,                    
            ]);
            
            $arr_row=$stmt->fetch();                                 
            $str_metaUserAtTagList=$arr_row["MetaUserAtTag"];                                                                    

            

            $str_queryTagList="";
            if(!empty($str_queryTagList)){
                $str_queryTagList.=$this->str_listSeparatorOr;
            }
            $str_queryTagList.=$str_metaPermissionTagList;            
            
            if(!empty($str_queryTagList)){
                $str_queryTagList.=$this->str_listSeparatorOr;
            }
            $str_queryTagList.=$str_metaUserAtTagList;
    
            $arr_queryTagList=explode($this->str_listSeparatorOr, trim($str_queryTagList));                                
            $arr_queryTagList=array_unique($arr_queryTagList, SORT_REGULAR);
            $arr_queryTagList=$this->fn_removeArrayMatch($arr_queryTagList, ["#ADMIN", "#OWN READ"]);
            $arr_queryTagList=$this->fn_removeArrayContaining($arr_queryTagList, "READ");
            $arr_queryTagList=$this->fn_removeArrayContaining($arr_queryTagList, "WRITE");
            $arr_queryTagList=$this->fn_removeArrayContaining($arr_queryTagList, "100");

            
            
            $arr_queryList=explode($this->str_listSeparatorOr, trim($QueryList));
            
            if($this->bln_debugRunSelect){                                
                $this->fn_varDump($arr_queryList, "arr_queryList");                                                     
            }
            $arr_queryTagList=$this->fn_removeArrayMatch($arr_queryTagList, $arr_queryList);
            //$this->fn_varDump($arr_queryTagList, "$arr_queryTagList");                                                     
            //TagList should now not contain enabled items 
            
            if(!empty($QueryListDisabled)){
                
                if($this->bln_debugRunSelect){                                
                    $this->fn_addEcho("QueryListDisabled", $QueryListDisabled);                     
                }
                
                $arr_queryListDisabled=explode($this->str_listSeparatorOr, trim($QueryListDisabled));
                if($this->bln_debugRunSelect){                                
                    $this->fn_varDump($arr_queryListDisabled, "arr_queryListDisabled");                                     
                }
                $arr_queryTagList=array_unique(array_merge($arr_queryTagList, $arr_queryListDisabled), SORT_REGULAR);
            }

            //sort($arr_queryTagList);
            if($this->bln_debugRunSelect){                                
                $this->fn_varDump($arr_queryTagList, "arr_queryTagList Sorted");                                     
            }
            $QueryListDisabled=implode($this->str_listSeparatorOr, $arr_queryTagList);
            if($this->bln_debugRunSelect){                                
                $this->fn_addEcho("QueryListDisabled", "[".$QueryListDisabled."]");                     
            }
        }
    
        //final sort to ensure all is correct.
        $arr_queryList=explode($this->str_listSeparatorOr, trim($QueryList));                
        sort($arr_queryList);            
        $QueryList=implode($this->str_listSeparatorOr, $arr_queryList);
    
        $arr_queryListDisabled=explode($this->str_listSeparatorOr, trim($QueryListDisabled));                
        sort($arr_queryListDisabled);            
        $QueryListDisabled=implode($this->str_listSeparatorOr, $arr_queryTagList);   
        
        $this->obj_post->QueryList=$QueryList;       
        $this->obj_post->QueryListDisabled=$QueryListDisabled;               
        
        if($this->bln_debugRunSelect){                                            
            $this->fn_addEcho("POST QueryList", $QueryList);                     
            $this->fn_addEcho("POST QueryListDisabled", $QueryListDisabled);                             
        }
        
    
        if($this->bln_debugRunSelect){                                
            $this->fn_addEcho("END WRITE QUERY TO CLIENT");                     
        }

        
    }
    
    
      
    function fn_updateQueryInterface(){
    
        //$this->bln_debugRunSelect=true;
        if($this->bln_debugRunSelect){                                
            $this->fn_addEcho("START CHANGE fn_updateQueryInterface");                     
        }   
        
        
    
        /*
        $this->fn_loadQueryListFromDB();        
        
        $str_1=$this->obj_userLogin->QueryList;
        $str_2=$this->obj_post->QueryList;
        $QueryList=$this->fn_mergeList($str_1, $str_2, $this->str_listSeparatorOr);
        
        if($this->bln_debugRunSelect){                                
            $this->fn_varDump($QueryList, "QueryList");
        }
        //*/
        
        $QueryList=$this->obj_post->QueryList;
        $QueryListDisabled=$this->obj_post->QueryListDisabled;  

        
    
        $QueryList=$this->fn_trimBoth($QueryList, $this->str_listSeparatorOr);        
        $QueryListDisabled=$this->fn_trimBoth($QueryListDisabled, $this->str_listSeparatorOr);        

        

        
    
        if($this->bln_debugRunSelect){                                
            $this->fn_addEcho("QueryList: ".$QueryList);                     
            $this->fn_addEcho("QueryListDisabled: ".$QueryListDisabled);                     
        }

        
    
        if(empty($QueryList) && empty($QueryListDisabled)){
            //For exmaple, when search button first pressed, the report is loaded, querylist from client is empty
            //$this->fn_addEcho("EMPTY RETURN");                     
            return false;
        }

        
    
        $str_sql="UPDATE `meta_rowz`.`meta_rowz` 
        SET
        QueryList =:QueryList,
        QueryListDisabled =:QueryListDisabled        
        WHERE TRUE AND
        MetaRowzId=:MetaRowzId
        ;";              
      
        $stmt = $this->fn_executeSQLStatement($str_sql, [      
            'MetaRowzId'=>$this->obj_post->MetaRowzId,
            'QueryList'=>$QueryList,
            'QueryListDisabled'=>$QueryListDisabled,
        ]); 
    
        
        
        $this->obj_userLogin->QueryList=$QueryList;
        $this->obj_userLogin->QueryListDisabled=$QueryListDisabled;
        
        $this->fn_setSession("UserLoginSession", serialize($this->obj_userLogin));                        
    
        if($this->bln_debugRunSelect){                                
            $this->fn_addEcho("END CHANGE fn_updateQueryInterface");                     
        }
        return true;
    }  
        
      
}//END OF CLASS


?>

