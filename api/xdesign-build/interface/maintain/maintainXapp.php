<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainXapp extends maintainOffice{
  
    function xfn_maintainXapp(){ 
      
      $this->fn_maintainXappColumnz();                        
      $this->fn_maintainXappRowz();                           
    } 
    
    function fn_maintainXAppView(){
    }

    

    function fn_maintainXappRowz(){      
      
      $this->fn_maintainAutoRowz($obj_metaView);       
      return;      
  
      $this->fn_maintainMetaRowz($obj_metaView);
    }
    
    function fn_maintainAutoRowz($obj_metaView){
      
      $obj_paramView=$obj_metaView->obj_param;
      
      //HouseKeeping Column
      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `MenuPin`=0
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_paramView->MetaViewSystemId
      AND `MetaViewId`=$obj_paramView->MetaViewId
      AND `MetaSchemaName`='$obj_paramView->MetaSchemaName'
      AND `MetaTableName`='$obj_paramView->MetaTableName'
      ;";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);
      
      //*
      
      
      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `MenuPin`=1      
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_paramView->MetaViewSystemId
      AND `MetaViewId`=$obj_paramView->MetaViewId
      AND `MetaSchemaName`='$obj_paramView->MetaSchemaName'
      AND `MetaTableName`='$obj_paramView->MetaTableName'
      AND `MetaColumnName` IN ('MetaRowzId','MetaRowzTitle')      
      ;";              
      
      $stmt=$this->fn_executeSQLStatement($str_sql);
      //*/

    }

    function fn_maintainMetaRowz($obj_metaView){

      $obj_param=$obj_metaView->obj_param;

      //Sets Publish and hidden status on column columns !      

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `PublishPin`=0
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaViewSystemId      
      AND `MetaSchemaName`='meta_rowz'            
      AND `MetaTableName`='meta_rowz'                  
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `PublishPin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaViewSystemId      
      AND `MetaSchemaName`='meta_rowz'            
      AND `MetaTableName`='meta_rowz'                  
      AND `MetaColumnName`IN ('MetaViewId','MetaRowzId','MetaRowzSystemId','MetaRowzUserId','ParentRowzId')      
      OR `MetaColumnName`IN ('DebugPin','MetaRowzName', 'MetaRowzTitle','MetaPermissionTag','RowzOrder','RowzIcon','HiddenPin','Subdomain','MetaColumnGroup','MetaRowzGroup','MetaViewGroup')
      ;";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `HiddenPin`=0
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaViewSystemId
      AND `MetaSchemaName`='meta_rowz'            
      AND `MetaTableName`='meta_rowz'                              
      ;";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);
      //AND `MetaColumnName`IN ('MetaViewId','MetaRowzId','MetaRowzSystemId','MetaRowzUserId','ParentRowzId')

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `HiddenPin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaViewSystemId
      AND `MetaSchemaName`='meta_rowz'            
      AND `MetaTableName`='meta_rowz'                        
      AND `MetaColumnName`IN ('MetaViewId','MetaRowzId','MetaRowzSystemId','MetaRowzUserId','ParentRowzId')
      ;";                    
      //$stmt=$this->fn_executeSQLStatement($str_sql);
      //AND `MetaColumnName`IN ('MetaViewId','MetaRowzId','MetaRowzSystemId','MetaRowzUserId','ParentRowzId')
    }
    

    
    function fn_maintain_debug_status(){
      
      $int_count=$this->fn_maintain_debug_status_query(true);
      $str_value="maintain_debug_status_off";
      if($int_count>0){
        $str_value="maintain_debug_status_on";
      }
      $this->obj_post->SingleQueryValue=$str_value;      
    }
    
    function fn_maintain_debug_status_query($bln_value){

      $DebugPin=0;
      if($bln_value){
        $DebugPin=1;
      }
      
      
      $str_sql="SELECT count(*) FROM `meta_rowz`.`meta_rowz` WHERE TRUE                 
        AND `DebugPin`=:DebugPin        
      ;";                    
      
      $int_count=$this->fn_fetchCount($str_sql, [              
        'DebugPin'=>$DebugPin        
      ]);
      return $int_count;
    }

    function fn_maintain_debug_on($int_idMetaRowz){
      $this->fn_maintain_debug($int_idMetaRowz, true);
      //$this->fn_setMessage("fn_maintain_debug_on is COMPLETE");        
    }
    function fn_maintain_debug_off($int_idMetaRowz){
      $this->fn_maintain_debug($int_idMetaRowz, false);
      //$this->fn_setMessage("fn_maintain_debug_off is COMPLETE");        
    }
    function fn_maintain_debug_release(){
      $this->fn_maintain_debug(0, false);
      //$this->fn_setMessage("fn_maintain_debug_release is COMPLETE");        
    }
    function fn_maintain_debug($int_idMetaRowz, $bln_value){

      $DebugPin=0;
      if($bln_value){
        $DebugPin=1;
      }

      if(empty($int_idMetaRowz)){

        $str_sql="UPDATE `meta_rowz`.`meta_rowz` SET `DebugPin`=0
        ;";     
                 
        $stmt=$this->fn_executeSQLStatement($str_sql);
      }
      else{
        $str_sql="UPDATE `meta_rowz`.`meta_rowz` SET `DebugPin`=:DebugPin  WHERE TRUE 
        AND `MetaRowzSystemId`=:MetaUserSystemId
        AND `MetaRowzId`=:MetaRowzId
        ;";              

        $stmt=$this->fn_executeSQLStatement($str_sql, [
          'MetaUserSystemId'=>$this->obj_userLogin->MetaUserSystemId,
          'MetaRowzId'=>$int_idMetaRowz,
          'DebugPin'=>$DebugPin        
        ]);
      }      
      
    }     

    function fn_maintainXappColumnz(){
      
                    

      $obj_param=new stdClass;              
      $obj_param->MetaColumnSystemId=$this->obj_userLogin->MetaUserSystemId;                      
      $obj_param->MetaSchemaName="meta_column";         
      $obj_param->MetaTableName="meta_column";        
      $this->fn_maintainAutoColumn($obj_param); 
      $this->fn_maintainMetaColumn($obj_param); 
    }

    function fn_maintainMetaColumn($obj_param){

      //Sets Publish and hidden status on column columns !      

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `PublishPin`=0
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
      AND `MetaSchemaName`='meta_column'            
      AND `MetaTableName`='meta_column'                  
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `PublishPin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
      AND `MetaSchemaName`='meta_column'            
      AND `MetaTableName`='meta_column'                  
      AND (`MetaColumnName`IN ('MetaColumnSystemId','MetaViewId','MetaColumnId','MetaSchemaName','MetaTableName','MetaColumnName','HiddenPin')
      OR `MetaColumnName`IN ('LivePin','MetaLabel','DebugPin','MetaColumnType','MetaList','MetaOption','FormOrder','DefaultValue','MenuPin','MetaPermissionTag'))
      ;";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);            

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `HiddenPin`=0
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId                  
      AND `MetaSchemaName`='meta_column'            
      AND `MetaTableName`='meta_column'                        
      ;";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);
      
      //*
      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `MetaPermissionTag`='OWN READ'
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId                  
      AND `MetaSchemaName`='meta_column'            
      AND `MetaTableName`='meta_column'                  
      AND `MetaColumnName`IN ('MetaColumnSystemId','MetaViewId','MetaColumnId','MetaSchemaName','MetaTableName','MetaColumnName')
      ;";                    
      $stmt=$this->fn_executeSQLStatement($str_sql);
      //*/
      
    }
    
function fn_maintainAutoColumn($obj_param){

  //Set publish pin
  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `PublishPin`=1
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId                      
  ;";              
  $stmt=$this->fn_executeSQLStatement($str_sql);

  //Maintain Column Group
  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `MenuPin`=0
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
  AND `MetaViewId`=9
  AND `MetaSchemaName`='$obj_param->MetaSchemaName'
  AND `MetaTableName`='$obj_param->MetaTableName'
  ;";              
  $stmt=$this->fn_executeSQLStatement($str_sql);

  //*
  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `MenuPin`=1
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
  AND `MetaViewId`=9
  AND `MetaSchemaName`='$obj_param->MetaSchemaName'
  AND `MetaTableName`='$obj_param->MetaTableName'
  AND `MetaColumnName` IN ('MetaTableName')      
  ;";              
  $stmt=$this->fn_executeSQLStatement($str_sql);
  //*/

  
  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `MenuPin`=0
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
  AND `MetaViewId`=10
  AND `MetaSchemaName`='$obj_param->MetaSchemaName'
  AND `MetaTableName`='$obj_param->MetaTableName'
  ;";        
  $stmt=$this->fn_executeSQLStatement($str_sql);

  //*
  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `MenuPin`=1
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
  AND `MetaViewId`=10
  AND `MetaSchemaName`='$obj_param->MetaSchemaName'
  AND `MetaTableName`='$obj_param->MetaTableName'
  AND `MetaColumnName` IN ('MetaColumnName')      
  ;";        
  $stmt=$this->fn_executeSQLStatement($str_sql);
  //*/
  

  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `InfoPin`=1
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
  AND `MetaViewId`=9
  AND `MetaSchemaName`='$obj_param->MetaSchemaName'
  AND `MetaTableName`='$obj_param->MetaTableName'
  AND `MetaColumnName` IN ('MetaColumnSystemId','MetaViewId','MetaSchemaName','MetaTableName')      
  ;";        
  $stmt=$this->fn_executeSQLStatement($str_sql);

  $str_sql="UPDATE `meta_column`.`meta_column` SET
  `InfoPin`=1
  WHERE TRUE 
  AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
  AND `MetaViewId`IN (10, 11)
  AND `MetaSchemaName`='$obj_param->MetaSchemaName'
  AND `MetaTableName`='$obj_param->MetaTableName'
  AND `MetaColumnName` IN ('MetaColumnSystemId','MetaViewId','MetaSchemaName','MetaTableName','MetaColumnName')      
  ;";        
  $stmt=$this->fn_executeSQLStatement($str_sql);
  //Maintain Column Group
}

}