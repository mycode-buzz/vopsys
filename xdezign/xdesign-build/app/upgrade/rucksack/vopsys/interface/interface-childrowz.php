<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

///////////////////////////DATAMANAGER
class childrowz extends datafunction{  
  function __construct() {            
    parent::__construct();   

    }  

    function fn_initialize() {              
      
      parent::fn_initialize();    

      $this->str_nameTableRowz="meta_rowz";
      
      $this->bln_debugRowz=false;                            
    }

    function fn_getChildRowz($bln_getCountOnly=false){                                                 

      
      
      $this->fn_formatSQLStatementRowz();                    
      $this->fn_legacyRunSQLStatement($bln_getCountOnly);              
    }   

    function fn_formatSQLStatementRowz(){   
           

      if($this->str_sqlStatement){return;}       
      
      $this->bln_debugGroup=false;
      
      if($this->bln_debugExecute){
        $this->fn_addEcho("START fn_formatSQLStatementRowz");        
      }      

      //$this->fn_varDump($this->obj_userLogin);      
      //$this->fn_varDump($this->obj_post, "POST");      
      

      
      
      $obj_paramView=$this->obj_metaView->obj_param;
      $obj_paramRowz=$this->obj_metaRowz->obj_param;      
      

      $bln_foundRowz=false;
      $str_selectCount="count(*)";
      $str_selectAll="*";  
      $str_selectAll=$this->fn_selectMinimalFieldListRowz();        
      
      
      $MetaUserId=$this->obj_userLogin->MetaUserId;            
      $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
      $MetaBaseUserId=$this->obj_userBase->MetaUserId;            

      //$this->fn_varDump($this->str_sqlStatement, "TEST SQL STATEMENT", true);

      if($obj_paramRowz->SettingOperationPin && $obj_paramRowz->RowzOrder>0){
        //change to allow dynamic menu template child pin in settings 

        //$this->str_sqlStatement="SELECT TRUE";
        //$this->fn_varDump($this->str_sqlStatement, "100 TEST SQL STATEMENT", true); 
        //return; 
      }

      //$this->fn_varDump($this->str_sqlStatement, "200 TEST SQL STATEMENT", true);
      

      //*
      if($MetaUserId===$MetaBaseUserId){        
        $str_select=$str_selectAll;
        $int_constraint=4;//Own
        $str_sqlStatementRowzOwn=$this->fn_getSQLStatementRowz($str_select, $int_constraint);
        $this->str_sqlStatement=$str_sqlStatementRowzOwn;
        //$this->fn_varDump("USER IS MetaBaseUserId", "STATUS", true);                
        return;
      }

      //*/      
      
      
      $str_sqlStatementRowz="";
      
      if($this->bln_debugExecute){$this->fn_addEcho("Step One: Get All Child Rowz");}      
      $str_select=$str_selectAll;
      $int_constraint=1;//All
      $str_sql=$this->fn_getSQLStatementRowz($str_select, $int_constraint);                                  
      /*
      $this->fn_varDump($str_sql, "str_sql", true);                              
      //*/      
      $stmt=$this->fn_executeSQLStatement($str_sql);            
      $arr_rows=$stmt->fetchAll();

      $int_rowCount=count($arr_rows);
      //$this->fn_addConsole("int_rowCount: ".$int_rowCount);     
      

      if($int_rowCount>0){
          $bln_foundRowz=true;
      }
      else{//no rowz found for any user
        
          $this->str_sqlStatement="SELECT TRUE";
          if($this->bln_debugExecute){
            $this->fn_addEcho("Step One: Zero Rowz found for Any User: ".$int_rowCount);
            $this->fn_addEcho("END fn_formatSQLStatementRowz");
          }
          //now rowzfound for any user, including base user
          exit;
      }  
    
      if($this->bln_debugAction){
        $this->fn_addEcho($int_rowCount." Rowz Found", true); 
      }

      
    
      //we know there are one or more rowz owned by at least one user 
      $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
      $MetaUserId=$this->obj_userLogin->MetaUserId;               

      if($this->bln_debugAction){
        $this->fn_addEcho("MetaBaseUserId", $MetaBaseUserId, true);        
        $this->fn_addEcho("MetaUserId", $MetaUserId, true);        
      }
      
      
      $arr_userBase=[];
      $arr_userOwn=[];

      
      
      for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
          
        $arr_row=$arr_rows[$i_row];                             
        $MetaRowzUserId=$arr_row["MetaRowzUserId"];
        /*
        $this->fn_varDump($arr_row, "arr_row", true);                              
        //*/
        
        
        if($MetaRowzUserId===$MetaBaseUserId){
          array_push($arr_userBase, $arr_row);
        }
        if($MetaRowzUserId===$MetaUserId){
          array_push($arr_userOwn, $arr_row);
        }               
    }
    
    
    /*
    $this->fn_varDump($arr_userBase, "arr_userBase", true);                          
    $this->fn_varDump($arr_userOwn, "arr_userOwn", true);                          
    $this->fn_varDump(count($arr_userBase), "count(arr_userBase)", true);                          
    //*/
    
    
    $int_countBase=count($arr_userBase);
    for($i_row=0;$i_row<$int_countBase;$i_row++) {                  
      $arr_rowBase=$arr_userBase[$i_row];                                     
      $MetaViewIdBase=$arr_rowBase["MetaViewId"];
      $MetaRowzIdBase=$arr_rowBase["MetaRowzId"];     
      $MetaRowzSettingBase=$arr_rowBase["SettingOperationPin"];     
      $MetaUpdatePin=$arr_rowBase["MetaUpdatePin"];     

      //$this->fn_addEcho("MetaRowzIdBase", $MetaRowzIdBase, true);                                

      $bln_foundMenu=false;
      foreach ($arr_userOwn as $arr_data) {        
        //$this->fn_addEcho("Checking Own Rowz for Base Record", $MetaRowzIdBase, true);                                        
        $MetaRowzId=$arr_data['MetaRowzId'];        
        $TemplateRowzId=$arr_data['TemplateRowzId'];        
        $MetaViewId=$arr_data['MetaViewId'];        
        $RowzOrder=$arr_data['RowzOrder'];        
        $SettingOperationPin=$arr_data['SettingOperationPin'];
        $ProtectedPin=$arr_data['ProtectedPin'];    
        $MetaRowzTitle=$arr_data['MetaRowzTitle'];            
        //$this->fn_addEcho("MetaRowzId", $MetaRowzId, true);                                        
        /*
        $this->fn_addEcho("TemplateRowzId", $TemplateRowzId);                                        
        $this->fn_addEcho("MetaViewId", $MetaViewId);                                        
        $this->fn_addEcho("MetaViewIdBase", $MetaViewIdBase);                                        
        $this->fn_addEcho("MetaRowzIdBase", $MetaRowzIdBase);                                        
        $this->fn_addEcho("RowzOrder", $RowzOrder);
        $this->fn_addEcho("SettingOperationPin", $SettingOperationPin);
        //*/
        
        
        if ($MetaViewId === $MetaViewIdBase && $TemplateRowzId===$MetaRowzIdBase) {
          $bln_foundMenu=true;   
          if($MetaUpdatePin){            
            //$this->fn_addEcho("Deleting Menu", $MetaRowzId);                                        
            //$this->fn_addEcho("MetaRowzTitle", $MetaRowzTitle);                                                    

            $this->fn_deleteMetaRowz($MetaRowzIdBase);
            $bln_foundMenu=false;   
            //$this->fn_resetMetaUpdatePin($MetaRowzIdBase); makes no sense as this needs to be a scheduled update
          }
        }

        if($bln_foundMenu){//break out of user loop as we found a matching row, no need to insert
          if($this->bln_debugAction){
            $this->fn_addEcho($MetaRowzIdBase.": Found Own Rowz for Menu", $MetaRowzIdBase);    
          }
          break;
        }
      }//user own loop

      if($obj_paramRowz->SettingOperationPin){//ignore setting menu
        $bln_foundMenu=true;                          
      }
      
      if(!$bln_foundMenu){//no user row was found, matching current base row , so we will insert
        if($this->bln_debugAction){
          $this->fn_addEcho($MetaRowzIdBase.": Create Own Rowz for Menu", $MetaRowzIdBase);                        
        }        
        //insert current user base loop row
        $this->fn_insertMetaRowz($arr_rowBase);
      }
      //got to enxt user row
    }//end user base loop

      //*      
      $str_select=$str_selectAll;
      $int_constraint=4;//Own
      $str_sqlStatementRowzOwn=$this->fn_getSQLStatementRowz($str_select, $int_constraint);                                                        
      //*/     

      $this->str_sqlStatement=$str_sqlStatementRowzOwn;
      
      if($this->bln_debugExecute){
        //$this->fn_addConsole($this->str_sqlStatement);      
      }

      if($this->bln_debugExecute){
        $this->fn_addEcho("END fn_formatSQLStatementRowz");
      }

      
    }

    
    function fn_getSQLStatementRowz($str_select, $int_constraint=0){

      if($this->str_sqlStatement){return;}                  
      
      if($this->bln_debugExecute){
        $this->fn_addEcho("START fn_getSQLStatementRowz");        
      }      

      $str_sql="";
      $str_sql.="SELECT $str_select FROM ";
      
      $str_sql.=$this->fn_getSQLStatementSourceRowz();        
      $str_sql.="WHERE ";              
      $str_sql.=$this->fn_getRowzUserIdConstraint($int_constraint);                                          
      $str_sql.=" AND ";                        
      $str_sql.=$this->fn_getSQLStatementWhereRowz($int_constraint);                                         
      $str_sql.=$this->fn_getSQLStatementOrderRowz();                                
      $str_sql.=";";          

      if($this->bln_debugExecute){
        $this->fn_addEcho("END fn_getSQLStatementRowz");        
      }      
      
      return $str_sql;      

      
    }     
          
    function fn_getSQLStatementSourceRowz(){//childmenu
      return " `meta_rowz`.`meta_rowz`
      JOIN `meta_user`.`meta_user` ON `meta_rowz`.`MetaRowzUserId`=`meta_user`.`MetaUserId`             
      LEFT JOIN `meta_view`.`meta_view` ON `meta_rowz`.`MetaViewId`=`meta_view`.`MetaViewId` 
      ";         
    }

    //START USER ID CONSTRAINT
    function fn_getRowzUserIdConstraint($int_constraint){                  

      switch($int_constraint){          
        case "1"://All            
          $str_sql=$this->fn_getRowzUserIdConstraintAll();                          
            break;                                   
        case "4"://Own
          $str_sql=$this->fn_getRowzUserIdConstraintOwn();
            break;                           
        default:          
            $this->fn_setError("ROWZ CONSTRAINT NOT Handled: [".$int_constraint."]");          
            exit;                
    }              

      return $str_sql;
    }

    function fn_getRowzUserIdConstraintAll(){                  
      
      $str_nameTableRowz=$this->str_nameTableRowz;

      $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
      $MetaUserId=$this->obj_userLogin->MetaUserId;               
      $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;           
      
      
      $str_sql="
        (/*ROWZUSERCONSTRAINTALL*/
          (
            (
              
              /*OWN*/`MetaUserId` IN($MetaUserId) AND `meta_rowz`.`MetaRowzSystemId` IN($MetaUserSystemId)
            )
            OR 
            (
              /*BASE*/`meta_user`.`MetaUserId` IN($MetaBaseUserId) AND `$str_nameTableRowz`.`MetaRowzPrivatePin`=0
            )
          )
        ) 
        ";        
      
      return $str_sql;
    }        
    
    function fn_getRowzUserIdConstraintBase(){                  
      
      $str_nameTableRowz=$this->str_nameTableRowz;

      $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
      $MetaUserId=$this->obj_userLogin->MetaUserId;               
      $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;           
      
      
      $str_sql="
        (/*ROWZUSERCONSTRAINTBASE*/
          
            (
              /*BASE*/`meta_user`.`MetaUserId` IN($MetaBaseUserId) AND `$str_nameTableRowz`.`MetaRowzPrivatePin`=0
            )            
          
        ) 
        ";
      
      return $str_sql;
    }         

    function fn_getRowzUserIdConstraintOwn(){                  
      
      $str_nameTableRowz=$this->str_nameTableRowz;

      $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
      $MetaUserId=$this->obj_userLogin->MetaUserId;               
      $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;           
      $MetaBaseUserSystemId=$this->obj_userBase->MetaUserSystemId;

      $obj_paramView=$this->obj_metaView->obj_param;
      $obj_paramRowz=$this->obj_metaRowz->obj_param;      

      //*
      if($obj_paramRowz->SettingOperationPin){
        $str_sql="(";
        $str_sql.="`MetaUserId` IN($MetaBaseUserId) AND `meta_rowz`.`MetaRowzSystemId` IN(100) ";
        if($MetaBaseUserSystemId!==$MetaUserSystemId){                
          $str_sql.="AND `$str_nameTableRowz`.`MetaRowzPrivatePin`=0";                  
        }
        $str_sql.=")";
        return $str_sql;                
      }
      //*/
      
      
      $str_sql="
        (/*ROWZUSERCONSTRAINTLOWN*/
          
            (
              /*OWN*/`MetaUserId` IN($MetaUserId) AND `meta_rowz`.`MetaRowzSystemId` IN($MetaUserSystemId)
            )
          
        ) 
        ";

      return $str_sql;
    }        
    
    
    function fn_getSQLStatementWhereRowz($int_constraint){//childmenu                  

      
      
      $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
      $MetaBaseUserSystemId=$this->obj_userBase->MetaUserSystemId;
      $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
      $MetaRowzId=$this->obj_post->MetaRowzId;                      
      $ParentRowzId=$this->obj_metaRowz->obj_param->ParentRowzId;
      $str_subDomain=$this->str_subDomain;            
      $TemplateRowzId=$this->obj_metaRowz->obj_param->TemplateRowzId;      

      $obj_paramView=$this->obj_metaView->obj_param;
      $obj_paramRowz=$this->obj_metaRowz->obj_param;      

      
      
      if($obj_paramRowz->SettingOperationPin){
        if($obj_paramRowz->RowzOrder===0){
          return "(/*SETTINGWHERE*/ `ParentRowzId`=100)";
        }
        else{
          return "(/*SETTINGWHERE*/ `ParentRowzId`= $MetaRowzId)";
        }
        
          
        
      }

      $str_sql="";

      $str_sql.="(/*DEFAULTWHERE*/
      TRUE
      AND `MetaRowzId`<>$MetaRowzId 
      AND `meta_rowz`.`LivePin`
      AND `meta_rowz`.`Subdomain`='$str_subDomain'
      AND (
        /*OWNSYSTEM*/`meta_rowz`.`MetaRowzSystemId`=$MetaUserSystemId
        OR /*BASESYSTEM*/`meta_rowz`.`MetaRowzSystemId`=$MetaBaseUserSystemId 
        ) 
      )";

      $str_sql.=" AND (";

      $str_sql.="(/*WHEREOWN*/
        `ParentRowzId`IN($MetaRowzId) ";
      
      if($this->bln_hasValidKey){            
        if(empty($this->obj_metaRowz->obj_param->SettingOperationPin)){
          $str_sql.=" OR (`ParentRowzId`IN($ParentRowzId) AND `meta_view`.`JoinType`=2)";
        }
      }
      
      $str_sql.="        
        )";
      
      
      switch($int_constraint){          
        case "1" OR $this->obj_metaRowz->SettingOperationPin://All                      
          if($TemplateRowzId){      
            $str_sql.=" OR ";
            $str_sql.="(/*WHEREALL*/                          
              /*TEMPLATE*/`ParentRowzId`=$TemplateRowzId
            )";
          }
            break;                                           
      }              

      $str_sql.=") ";

      
      return $str_sql;
    }    

    function fn_getSQLStatementOrderRowz(){//childmenu      
      
      return "ORDER BY `meta_rowz`.`meta_rowz`.`ParentRowzId`, `meta_rowz`.`meta_rowz`.`RowzOrder` ";            
    }    
    
    function fn_selectMinimalFieldListRowz(){
      //$this->fn_addEcho("xxx fn_selectMinimalFieldListColumnz");                             

      // this minimal field list is in use
      $str_fieldlist="                    
        
      `meta_rowz`.`MetaRowzId`,          
      `meta_rowz`.`MetaRowzSystemId`,      
      `meta_rowz`.`MetaRowzUserId`,              
      `meta_rowz`.`MetaRowzPrivatePin`,
      `meta_rowz`.`MetaViewId`,
      `meta_rowz`.`TemplateRowzId`,
      `meta_rowz`.`ParentRowzId`,      
      `meta_rowz`.`MetaRowzName`,
      `meta_rowz`.`MetaRowzTitle`,
      `meta_rowz`.`LivePin`,                                
      `meta_rowz`.`DebugPin`,       
      `meta_rowz`.`RowzOrder`,
      `meta_rowz`.`RowzIcon`,
      `meta_rowz`.`ButtonConsole`,          
      `meta_rowz`.`DisabledPin`,        
      `meta_rowz`.`HiddenPin`,
      `meta_rowz`.`ArchivePin`,
      `meta_rowz`.`LockOpenPin`,
      `meta_rowz`.`AutoFetchPin`,        
      `meta_rowz`.`AutoOpenPin`,        
      `meta_rowz`.`Subdomain`,        
      `meta_rowz`.`MetaTypeRowzWidget`,
      `meta_rowz`.`MetaTypeRowzDashboard`,        
      `meta_rowz`.`SettingOperationPin`,
      `meta_rowz`.`MetaUpdatePin`,
      
      `meta_view`.`MetaViewId`,
      `meta_view`.`ViewPin`,
      `meta_view`.`ChargePin`,
      `meta_view`.`MetaViewSystemId`,
      `meta_view`.`MetaSchemaName`,
      `meta_view`.`MetaTableName`,
      `meta_view`.`MetaTableKeyField`,    
      
      `meta_view`.`JoinType`,    
      `meta_view`.`MetaViewName`,    
      `meta_view`.`DynamicMenuPin`,    
      `meta_view`.`MetaTypeMenu`,
      `meta_view`.`MetaTypeViewMenu`,
      `meta_view`.`MetaTypeViewData`,
      `meta_view`.`MetaTypeViewReport`,
      `meta_view`.`MetaTypeViewWidget`,
      `meta_view`.`MetaTypeViewDashboard`,        
      `meta_view`.`PublishPin`,    
      `meta_view`.`ProtectedPin`,
      `meta_view`.`MetaViewGroup`                
      ";        
      return $str_fieldlist;
    }

    
    

    function fn_getJoinOnRowz(){

      //referenced only in fn_getURLNavigateStandardMenu
      //This used to work from the user login onw rowz , but need to check how this will work now we are using the base users rows
      
      $obj_userRowz=$this->obj_userBase;      
      $MetaUserId=$obj_userRowz->MetaUserId;      
      $MetaUserSystemId=$obj_userRowz->MetaUserSystemId;        
      
      $Subdomain=$this->str_subDomain;
      
      $str_sql="(    
          `meta_rowz`.`MetaRowzSystemId`=$MetaUserSystemId 
        AND `meta_rowz`.`MetaRowzUserId`=$MetaUserId
        AND `meta_rowz`.`Subdomain`='$Subdomain'
        )";  
        
      return $str_sql;
    }
    

    function fn_deleteMetaRowz($MetaRowzId){      
      
      //$this->fn_addEcho("fn_deleteMetaRowz MetaRowzId", $MetaRowzId);                                                    

      $obj_metaRowz=new metaRowz($this);
      $obj_metaRowz->fn_initialize($MetaRowzId);
      //$obj_metaRowz->fn_debug(true);
      $obj_metaRowz->fn_delete();      
  }

    function fn_insertMetaRowz($arr_rowTemplate){

                
      $str_runtime=$this->str_runtime;      
      $MetaUserId=$this->obj_userLogin->MetaUserId;
      $MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;        
      $MetaRowzId=$this->obj_post->MetaRowzId;          
    
      //*
      $obj_paramRowz=new stdClass;
      $obj_paramRowz->MetaRowzSystemId=$MetaUserSystemId;
      $obj_paramRowz->MetaRowzUserId=$MetaUserId;
      $obj_paramRowz->MetaRowzPrivatePin=0;
      $obj_paramRowz->MetaViewId=$arr_rowTemplate["MetaViewId"];
      $obj_paramRowz->TemplateRowzId=$arr_rowTemplate["MetaRowzId"];
      $obj_paramRowz->ParentRowzId=$MetaRowzId;
      $obj_paramRowz->MetaRowzName=$arr_rowTemplate["MetaRowzName"];
      $obj_paramRowz->MetaRowzTitle=$arr_rowTemplate["MetaRowzTitle"];
      $obj_paramRowz->LivePin=$arr_rowTemplate["LivePin"];      
      $obj_paramRowz->DebugPin=$arr_rowTemplate["DebugPin"];            
      $obj_paramRowz->RowzOrder=$arr_rowTemplate["RowzOrder"];      
      $obj_paramRowz->RowzIcon=$arr_rowTemplate["RowzIcon"];      
      $obj_paramRowz->ButtonConsole=$arr_rowTemplate["ButtonConsole"];
      $obj_paramRowz->DisabledPin=$arr_rowTemplate["DisabledPin"];
      $obj_paramRowz->HiddenPin=$arr_rowTemplate["HiddenPin"];      
      $obj_paramRowz->ArchivePin=$arr_rowTemplate["ArchivePin"];
      $obj_paramRowz->LockOpenPin=$arr_rowTemplate["LockOpenPin"];
      $obj_paramRowz->AutoFetchPin=$arr_rowTemplate["AutoFetchPin"];
      $obj_paramRowz->AutoOpenPin=$arr_rowTemplate["AutoOpenPin"];      
      $obj_paramRowz->MetaRowzGroup=$arr_rowTemplate["MetaRowzGroup"];                  
      $obj_paramRowz->MetaTypeRowzWidget=$arr_rowTemplate["MetaTypeRowzWidget"];
      $obj_paramRowz->MetaTypeRowzDashboard=$arr_rowTemplate["MetaTypeRowzDashboard"];
      $obj_paramRowz->QueryList="";                        
      $obj_paramRowz->QueryListDisabled="";                                    
      $obj_paramRowz->Subdomain=$arr_rowTemplate["Subdomain"];
      $obj_paramRowz->SettingOperationPin=$arr_rowTemplate["SettingOperationPin"];      

      $this->fn_addEcho("arr_rowTemplate", $arr_rowTemplate);
      $this->fn_addEcho("obj_paramRowz", $obj_paramRowz);

      $obj_metaRowz=new metaRowz($this);
      $int_idRecordRowz=$obj_metaRowz->fn_createRecord($obj_paramRowz);
      

      if($this->bln_debugView){
          //$this->fn_addMessage("int_idRecordRowz: ".$int_idRecordRowz);
      }
  
  }

  function fn_getURLNavigateDynamicMenu($CompareMetaRowzName){    
    //$this->fn_addEcho("fn_getURLNavigateDynamicMenu CompareMetaRowzName: ".$CompareMetaRowzName);    
    //Not possible to set dynamic menus to auto open on client, dependent on navigation path
    return "";
}
function fn_getURLNavigateStandardMenu($CompareMetaRowzName){    
    
    $obj_post=$this->obj_post;
    //$this->fn_addEcho("fn_getURLNavigateStandardMenu CompareMetaRowzName: ".$CompareMetaRowzName);            
    
    if(empty($CompareMetaRowzName)){return;}
    $CurrentMetaRowzId=$obj_post->MetaRowzId;//current id
    $CurrentMetaRowzName=$obj_post->MetaRowzName;//current name    
    $URLNavigateMenu="";
    
    $str_joinOnRowz=$this->fn_getJoinOnRowz();        
    
    $str_sql="SELECT `meta_rowz`.`meta_rowz`.`MetaRowzId`, 
    `meta_rowz`.`meta_rowz`.`ParentRowzId` FROM `meta_rowz`.`meta_rowz`         
    WHERE `meta_rowz`.`meta_rowz`.`MetaRowzName`='$CompareMetaRowzName'
    ;";        
    $stmt=$this->fn_executeSQLStatement($str_sql);                            
    
    $arr_row=$stmt->fetch();        
    if(empty($arr_row)){
        return;
    }
    
    $TestMetaRowzId=$arr_row["MetaRowzId"]."";
    $TestMetaParentRowzId=$arr_row["ParentRowzId"]."";
    $TestMetaRowzName=$CompareMetaRowzName;      
    
    $TestMetaRowzName.="";
    $CurrentMetaRowzId.="";    
    $TestMetaRowzId.="";
    $TestMetaParentRowzId.="";
    if($CurrentMetaRowzId===$TestMetaRowzId){
      $URLNavigateMenu=$TestMetaRowzName;
    }
    if($CurrentMetaRowzId===$TestMetaParentRowzId){
      $URLNavigateMenu=$TestMetaRowzName;
    }

    /*
    //$this->fn_addEcho("TestMetaViewName: ".$TestMetaViewName);    
    //$this->fn_addEcho("CompareMetaRowzName: ".$CompareMetaRowzName);    
    //$this->fn_addEcho("CompareMetaRowzName: ".$CompareMetaRowzName);    
    //$this->fn_addEcho("CurrentMetaRowzId: ".$CurrentMetaRowzId);
    //$this->fn_addEcho("TestMetaParentRowzId: ".$TestMetaParentRowzId);
    //$this->fn_addEcho("TestMetaRowzId: ".$TestMetaRowzId);            
    //*/

    //$this->fn_addEcho("URLNavigateMenu: ".$URLNavigateMenu);    
    
    if(empty($URLNavigateMenu)){

      //$this->fn_addEcho("LEVEL FAILED");                      
      
      $str_sql="SELECT `meta_rowz`.`meta_rowz`.`MetaRowzName` FROM `meta_rowz`.`meta_rowz`                     
      WHERE `meta_rowz`.`meta_rowz`.`MetaRowzId`=$TestMetaParentRowzId";
      //$this->fn_addEcho("bbbbbbbbbbbb str_sql: ".$str_sql);    
      $stmt=$this->fn_executeSQLStatement($str_sql);                    
      $arr_row=$stmt->fetch();        
      if($arr_row){
        $CompareMetaRowzName=$arr_row["MetaRowzName"];        
        //$this->fn_addEcho("Attempt next level up : ".$CompareMetaRowzName);        
        $this->fn_getURLNavigateStandardMenu($CompareMetaRowzName);
        return;
      }
    }

    //$this->fn_addEcho("SUCCESSS");    

    return $URLNavigateMenu;
  }


  
  


    

}//END CLASS  
  ///////////////////////////DATAMANAGER