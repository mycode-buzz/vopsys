<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_search extends interface_advancedsearch{
    function __construct() {                        
        
        parent::__construct();                                        
    }

    function fn_interfaceFormatSQLQuery(){
        
        $this->arr_whereQuery=[];

        

        $this->str_queryWhere="";               
        $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
        
        
        $this->fn_interfaceGetMetaDataOwnerScopeConstraint();
        if(!$this->fn_isObjectEmpty($this->obj_queryScopeMetaData)){
        
            array_push($this->arr_whereQuery, $this->obj_queryScopeMetaData);
        }
       
               

                      
        if($this->obj_post->SimpleSearch){
            $this->fn_interfaceFormatSimpleSearch();
            if(!$this->fn_isObjectEmpty($this->obj_querySimpleSearch)){
                $this->obj_paramAPI->offset=0;
                array_push($this->arr_whereQuery, $this->obj_querySimpleSearch);
            }    
        }
        else if($this->obj_post->AdvancedSearch){
            $this->fn_interfaceFormatAdvancedSearch();
            if(!$this->fn_isObjectEmpty($this->obj_queryAdvancedSearch)){            
                array_push($this->arr_whereQuery, $this->obj_queryAdvancedSearch);
            }
        }
               
            
        if(!$this->fn_isObjectEmpty($this->obj_queryMetaWhere)){
            array_push($this->arr_whereQuery, $this->obj_queryMetaWhere);
        }

           
        //$this->fn_varDump($this->arr_whereQuery, "this->arr_whereQuery", true);
            
        $this->fn_interfaceFormatSQLQueryExpression();    
        if(!$this->fn_isObjectEmpty($this->obj_queryExpression)){            
            
            array_push($this->arr_whereQuery, $this->obj_queryExpression);
        }   

        //$this->fn_varDump($this->arr_whereQuery, "this->arr_whereQuery", true);
           

        if($this->obj_paramQuery->bln_hasSearchPin){
           
            
            array_push($this->arr_whereQuery, $this->obj_paramQuery->obj_sql);
        }   
        
        //$this->fn_varDump($this->arr_whereQuery, "this->arr_whereQuery", true);

        $this->fn_interfaceFormatSQLQueryAutoJoin();        
        if(!$this->fn_isObjectEmpty($this->obj_queryAutoJoin)){
           ;
            
            array_push($this->arr_whereQuery, $this->obj_queryAutoJoin);       
        }
                   

        //$this->fn_varDump($this->arr_whereQuery, "this->arr_whereQuery", true);
        
        if(count($this->arr_whereQuery)){
            $this->obj_whereQuery=new stdClass;
            $this->obj_whereQuery->{"\$and"}=$this->arr_whereQuery;
            $str_jsonRowMatch=json_encode($this->obj_whereQuery);
            $str_jsonRowMatch=urlencode($str_jsonRowMatch);
            $this->obj_paramAPI->row_match=$str_jsonRowMatch;
            //$this->fn_varDump($this->obj_paramAPI, "this->obj_paramAPI", true);                
        }
        

        $this->arr_param=[];

        
    }  
      
    
    
    function fn_interfaceFormatSimpleSearch(){

        $this->obj_querySimpleSearch=new stdClass;       

        $MetaViewId=$this->obj_metaView->obj_param->MetaViewId;

        $str_querySearch=$this->obj_post->QuerySearch;                
        if(empty($str_querySearch)){
            return;
        }
        
        //$this->fn_var_dump($str_querySearch, "1 str_querySearch", true);
        
        $str_querySearch=$this->fn_disarmSQLString($str_querySearch);        
        if($str_querySearch===""){return;}                        
        
        $str_comparisonOperator="LIKE";
        $str_wildcardCharacter="%";
        
        /*
        if(!empty($this->str_querySearchExactMatch)){        
            $str_comparisonOperator="=";
            $str_wildcardCharacter="";
        }      
        //*/
        
        $arr_where=[];            
            
        $str_sql="";      
        $arr_metaColumn=$this->arr_metaColumn;                
        $bln_foundSearchable=false;        
        for($i=0;$i<count($arr_metaColumn);$i++) { 
            
            $obj_metaColumn=$arr_metaColumn[$i];            
            if(!$obj_metaColumn->SearchPin){
                continue;
            }
            $bln_foundSearchable=true;
            //$str_sql.=$obj_metaColumn->str_nameQualified. " ".$str_comparisonOperator." :QUERYSEARCH OR ";                                                      
            
            $MetaColumnAPIName=$obj_metaColumn->MetaColumnAPIName;
            //$this->fn_varDump($obj_metaColumn, "obj_metaColumn", true);            
            $obj_where=new stdClass;	
            $obj_querySearchLike=new stdClass;
            $obj_querySearchLike->{"\$con"}=$str_querySearch;
        ;  
            $obj_where->{$MetaViewId.".".$MetaColumnAPIName}=$obj_querySearchLike;
            array_push($arr_where, $obj_where);
        }        
        
        if($bln_foundSearchable){
          
            $obj_where=new stdClass;
            $obj_where->{"\$or"}=$arr_where;        

            $this->obj_querySimpleSearch=$obj_where;  
                    
        }
    }

    function fn_interfaceFormatSQLQueryExpression(){

        $this->obj_queryExpression=new stdClass;


        $MetaViewId=$this->obj_metaView->obj_param->MetaViewId;

        $arr_where=[]; 

        if(!empty($this->str_queryExpression)){          
            $obj_where=json_decode($this->str_queryExpression);	
            array_push($arr_where, $obj_where);            
        }
        
        $bln_runAutoKey=true;
        if($this->obj_post->AutoJoinPin){
            $bln_runAutoKey=false;
        }
        if($bln_runAutoKey){
            
            $MetaKeyColumnValue=$this->obj_post->MetaKeyColumnValue;
            $MetaColumnAPIName=$this->obj_post->MetaKeyColumnShortName;

            if(!empty($MetaKeyColumnValue)){          
                        
                $obj_where=new stdClass;		
                $obj_where->{$MetaViewId.".".$MetaColumnAPIName}=$MetaKeyColumnValue;
                array_push($arr_where, $obj_where);            
            }
        }

        if(count($arr_where)){
            $this->obj_queryExpression->{"\$and"}=$arr_where;            
        }      
        
    }

    function fn_interfaceFormatSQLQueryAutoJoin(){
        $this->obj_queryAutoJoin=new stdClass;

        $MetaViewId=$this->obj_metaViewLink->obj_param->MetaViewId;
       
        $arr_where=[]; 

        if($this->obj_post->AutoJoinPin && $this->obj_post->AutoJoinFilterPin){

            $this->obj_paramAPI->get_autojoin=true;
            $this->obj_paramAPI->JoinView=$this->obj_post->AutoJoinToSource;    
            $this->obj_paramAPI->JoinKeyName=$this->obj_post->MetaKeyColumnName;                    
            $this->obj_paramAPI->JoinKeyValue=$this->obj_post->AutoJoinToKeyValue;

            /*
            $obj_where=new stdClass;		
            $obj_where->{$MetaViewId.".DeleteDate"}="IS NULL";
            array_push($arr_where, $obj_where); 
            //*/
            
            
        }  

        if(count($arr_where)){
            $this->obj_queryAutoJoin->{"\$and"}=$arr_where;
            //$this->bln_debug=true;
        }

    }

        
}//END OF CLASS


?>