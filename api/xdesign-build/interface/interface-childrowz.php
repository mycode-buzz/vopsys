<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

///////////////////////////DATAMANAGER
class childrowz extends interface_datafunction{  
  function __construct() {            
    parent::__construct();   

    }  

    function fn_initialize() {              
      
      parent::fn_initialize();          

      $this->str_nameTableRowz="meta_rowz";
      
      $this->bln_debugRowz=$this->bln_debugExecute;                            
      //$this->bln_debugRowz=true;                       
    }

    function fn_getChildRowz($bln_getCountOnly=false){                                                                   
      
      $this->fn_formatSQLStatementRowz();
      $this->fn_legacyRunSQLStatement($bln_getCountOnly);          
    }

    function fn_formatSQLStatementRowz(){   
      
      if($this->str_sqlStatement){return;}       
      
      $this->bln_debugGroup=false;
      
      if($this->bln_debugRowz){
        $this->fn_addConsole("START fn_formatSQLStatementRowz");        
        //exit;
      }      



      if($this->bln_debugRowz){
        //$this->fn_varDump($this->obj_userLogin);      
        //$this->fn_varDump($this->obj_post, "POST");      
        //$this->fn_varDumpPost($this->obj_post, "POST");      
      }
      

      
      
      $obj_paramView=$this->obj_metaView->obj_param;
      $obj_paramRowz=$this->obj_metaRowz->obj_param;      

      if($obj_paramRowz->AdminPin){
        //$this->fn_varDump($this->obj_userLogin);
        if($this->obj_userLogin->MetaPermissionTag!=="#ADMIN"){
          return;
        }
      }
      

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
        if($this->bln_debugRowz){
          $this->fn_addConsole("str_sqlStatementRowzOwn", $str_sqlStatementRowzOwn);        
        }      
        return;
      }

      //*/      
      
      
        $str_sqlStatementRowz="";
        
        if($this->bln_debugRowz){$this->fn_addConsole("Step One: Get All Child Rowz");}      
        $str_select=$str_selectAll;
        $int_constraint=1;//All
        $str_sql=$this->fn_getSQLStatementRowz($str_select, $int_constraint);                                  
        if($this->bln_debugRowz){
          //$this->fn_addConsole("str_sql: ", $str_sql);     
        }
        /*
        $this->fn_varDump($str_sql, "str_sql", true);                              
        //*/      
        $stmt=$this->fn_executeSQLStatement($str_sql);            
        $arr_rows=$stmt->fetchAll();

        $int_rowCount=count($arr_rows);
        if($this->bln_debugRowz){
          $this->fn_addConsole("int_rowCount: ".$int_rowCount);     
          //$this->fn_addConsole("arr_rows", $arr_rows);     
        }
        
        

        if($int_rowCount>0){
            $bln_foundRowz=true;
        }
        else{//no rowz found for any user
          
            $this->str_sqlStatement="SELECT TRUE";
            if($this->bln_debugRowz){
              $this->fn_addConsole("Step One: Zero Rowz found for Any User: ".$int_rowCount);
              $this->fn_addConsole("END fn_formatSQLStatementRowz");
            }
            //now rowzfound for any user, including base user
            exit;
        }  
      
        if($this->bln_debugAction){
          $this->fn_addConsole($int_rowCount." Rowz Found", true); 
        }

        
        if($this->bln_debugRowz){$this->fn_addConsole("[".$obj_paramView->MetaViewId."] Step Two: //we know there are one or more rowz owned by at least one user ");}      
        //we know there are one or more rowz owned by at least one user 
        $MetaBaseUserId=$this->obj_userBase->MetaUserId;            
        $MetaUserId=$this->obj_userLogin->MetaUserId;               

        
        if($this->bln_debugRowz){$this->fn_addConsole("[".$obj_paramView->MetaViewId."] Loop thur previous recordset and split rowz into base or user array");}      

        if($this->bln_debugRowz){
          $this->fn_addConsole("MetaBaseUserId", $MetaBaseUserId, true);        
          $this->fn_addConsole("MetaUserId", $MetaUserId, true);        
        }
    
        
        
        $arr_userBase=[];
        $arr_userOwn=[];
        for($i_row=0;$i_row<$int_rowCount;$i_row++) {                  
            
          $arr_row=$arr_rows[$i_row];                             
          $MetaRowzUserId=$arr_row["MetaRowzUserId"];
          /*
          $this->fn_varDump($arr_row, "arr_row", true);                              
          //*/
          
          //$this->fn_varDump($this->obj_metaView->obj_param->MetaViewType, "MetaViewType", true);
          //$this->obj_metaView->fn_debug();
          
          
          if($MetaRowzUserId===$MetaBaseUserId){
            array_push($arr_userBase, $arr_row);
          }
          if($MetaRowzUserId===$MetaUserId){
            array_push($arr_userOwn, $arr_row);
          }               
      }
      
      
      
      
      if($this->bln_debugRowz){
        //*
        //$this->fn_varDump($arr_userBase, "arr_userBase", true);                          
        //$this->fn_varDump($arr_userOwn, "arr_userOwn", true);                                  
        //*/
      }
      
      
      
      $int_countBase=count($arr_userBase);
      for($i_row=0;$i_row<$int_countBase;$i_row++) {                  
        $arr_rowTemplate=$arr_userBase[$i_row];                                     
        $MetaViewIdBase=$arr_rowTemplate["MetaViewId"];
        $MetaRowzIdBase=$arr_rowTemplate["MetaRowzId"];     
        $MetaRowzSettingBase=$arr_rowTemplate["SettingOperationPin"];     
        $MetaUpdatePin=$arr_rowTemplate["MetaUpdatePin"];     

          
          

        //$this->fn_addConsole("MetaRowzIdBase", $MetaRowzIdBase, true);                                

        //define bln_foundMenu flag initial value as false
        $bln_foundMenu=false;
        //loop own rowz to override to true
        foreach ($arr_userOwn as $arr_data) {        
          //$this->fn_addConsole("Checking Own Rowz for Base Record", $MetaRowzIdBase, true);                                        
          $MetaRowzId=$arr_data['MetaRowzId'];        
          $TemplateRowzId=$arr_data['TemplateRowzId'];        
          $TemplateViewId=$arr_data['TemplateViewId'];        
          if($arr_rowTemplate["MetaViewInterfacePin"]){//ignore interface menu        
            $TemplateViewId=$MetaViewIdBase;
          }      
          $MetaViewId=$arr_data['MetaViewId'];        
          $RowzOrder=$arr_data['RowzOrder'];        
          $SettingOperationPin=$arr_data['SettingOperationPin'];
          $ProtectedPin=$arr_data['ProtectedPin'];    
          $MetaRowzTitle=$arr_data['MetaRowzTitle'];            
          //$this->fn_addConsole("MetaRowzId", $MetaRowzId, true);                                        
          
          if($this->bln_debugRowz){
          //*
          $this->fn_addConsole("TemplateRowzId", $TemplateRowzId);                                        
          $this->fn_addConsole("TemplateViewId", $TemplateViewId);                                        
          $this->fn_addConsole("MetaViewId", $MetaViewId);                                        
          $this->fn_addConsole("MetaViewIdBase", $MetaViewIdBase);                                        
          $this->fn_addConsole("MetaRowzIdBase", $MetaRowzIdBase);                                        
          $this->fn_addConsole("RowzOrder", $RowzOrder);
          $this->fn_addConsole("SettingOperationPin", $SettingOperationPin);
          //*/
          }
          
          
          
          //if ($MetaViewId === $MetaViewIdBase && $TemplateRowzId===$MetaRowzIdBase) {
          if ($TemplateViewId === $MetaViewIdBase && $TemplateRowzId===$MetaRowzIdBase) {
            if($this->bln_debugRowz){
              //*
              $this->fn_addConsole("[".$obj_paramView->MetaViewId."] FOUND MENU", $SettingOperationPin);
              $this->fn_addConsole("TemplateViewId", $TemplateViewId);                                        
              $this->fn_addConsole("MetaViewIdBase", $MetaViewIdBase);                                        
              $this->fn_addConsole("TemplateRowzId", $TemplateRowzId);                                        
              $this->fn_addConsole("MetaRowzIdBase", $MetaRowzIdBase);                                        
              //** */
            }      
          
            $bln_foundMenu=true;   
            
            if($MetaUpdatePin){            
              //$this->fn_addConsole("Deleting Menu", $MetaRowzId);                                        
              //$this->fn_addConsole("MetaRowzTitle", $MetaRowzTitle);                                                    

              $this->fn_deleteMetaRowz($MetaRowzIdBase);
              $bln_foundMenu=false;   
              //$this->fn_resetMetaUpdatePin($MetaRowzIdBase); makes no sense as this needs to be a scheduled update
            }
          }

          

          if($bln_foundMenu){//break out of user loop as we found a matching row, no need to insert
            if($this->bln_debugRowz){
              $this->fn_addConsole($MetaRowzIdBase.": Found Own Rowz for Menu", $MetaRowzIdBase);    
            }
            break;
          }
        }//user own loop

        /*
        if($obj_paramRowz->SettingOperationPin && $obj_paramRowz->MetaRowzName!=="Settings"){//ignore setting menu
          $bln_foundMenu=true;                          
        }
        //*/
        //*
        if($obj_paramRowz->SettingOperationPin){//ignore setting menu
          $bln_foundMenu=true;                          
        }
        //*/        
        
        
        if(!$bln_foundMenu){//no user row was found, matching current base row , so we will insert          
        
          if($this->bln_debugRowz){        
            $this->fn_addConsole($MetaRowzIdBase." Menu Not Found: Create Own Rowz for Menu", $MetaRowzIdBase);                        
        
          }        
          //$this->fn_addConsole($MetaRowzIdBase.": Create Own Rowz for Menu", $MetaRowzIdBase);                        
          //insert current user base loop row
          
          //insert current user base loop row        
          $obj_return=$this->fn_childRowzCopyMetaView($arr_rowTemplate);                                                
          $obj_metaViewNew=$obj_return->obj_metaViewNew;
          $obj_metaViewTemplate=$obj_return->obj_metaViewTemplate;          
          $this->fn_childRowzCopyMetaRowz($arr_rowTemplate, $obj_metaViewNew, $obj_metaViewTemplate);                  
          
          
        }
        //got to enxt user row
      }//end user base loop

      if($this->bln_debugRowz){
        $this->fn_addConsole("[".$obj_paramView->MetaViewId."] Step 3: Get Own Rowz (previously created)");                        
      }
      //*      
      $str_select=$str_selectAll;
      $int_constraint=4;//Own
      $str_sqlStatementRowzOwn=$this->fn_getSQLStatementRowz($str_select, $int_constraint);                                                        
      //*/     

      $this->str_sqlStatement=$str_sqlStatementRowzOwn;
      
      if($this->bln_debugRowz){
        //$this->fn_addConsole("this->str_sqlStatement", $this->str_sqlStatement);      
      }

      if($this->bln_debugRowz){
        $this->fn_addConsole("[".$obj_paramView->MetaViewId."]END fn_formatSQLStatementRowz");
      }             
    }    

    function fn_childRowzCopyMetaView($arr_rowTemplate){//USED BY UI TO CLONE A TEMPLATE           

      $TemplateViewId=$arr_rowTemplate["MetaViewId"];
      
      if(is_null($TemplateViewId)){//this may be resolved if rowz.metaviewid renamed to rowz.metarowzviewid
        $TemplateViewId=0;
      }      
      if(empty($TemplateViewId)){
        if($this->bln_debugRowz){
          $this->fn_addConsole("end early - TemplateViewId is empty");            
          $this->fn_addConsole("arr_rowTemplate", $arr_rowTemplate);            
          
        }      
        $obj_return = new stdClass;
        $obj_return->obj_metaViewNew=new stdClass;
        $obj_return->obj_metaViewTemplate=new stdClass;
        return $obj_return;        
      }  

      $obj_metaViewTemplate=new metaView($this);
      $obj_metaViewTemplate->fn_initialize($TemplateViewId, true);//also get metadata      
      
      
      $MetaViewInterfacePin=$arr_rowTemplate["MetaViewInterfacePin"];      
      $MetaTableName=$arr_rowTemplate["MetaTableName"];      
      $MetaViewName=$arr_rowTemplate["MetaViewName"];            
      $obj_return=$this->fn_copyMetaView($obj_metaViewTemplate, $MetaTableName, $MetaViewName, $MetaViewInterfacePin);      
      return $obj_return;
    }      
    
  
  function fn_childRowzCopyMetaRowz($arr_rowTemplate, $obj_metaViewNew, $obj_metaViewTemplate){  

    if($this->bln_debugRowz){
      $this->fn_addConsole("START fn_childRowzCopyMetaRowz");        
    }          
    
    $TemplateRowzId=$arr_rowTemplate["MetaRowzId"];        
    //$this->fn_addConsole("TemplateRowzId", $TemplateRowzId);        
    
    $obj_metaRowzTemplate=new metaRowz($this);
    $obj_metaRowzTemplate->fn_initialize($TemplateRowzId, true);//also get metadata                  
    $obj_metaRowz=$this->fn_copyMetaRowz($obj_metaRowzTemplate, $obj_metaViewNew, $obj_metaViewTemplate);
    //return $obj_metaRowz;

    if($this->bln_debugRowz){
      $this->fn_addConsole("END fn_childRowzCopyMetaRowz");        
    }      
  }
    
  function fn_checkMetaData($obj_param){      
    
    
    $MetaUserSystemId=$obj_param->MetaUserSystemId;
    $MetaUserId=$this->obj_userLogin->MetaUserId;
    $DataSchemaName=$obj_param->DataSchemaName;
    $DataTableName=$obj_param->DataTableName;
    $DataKeyName=$obj_param->DataKeyName;              
    $MetaDataSystemConstraint=$obj_param->MetaDataSystemConstraint;                    
    $MetaDataUserConstraint=$obj_param->MetaDataUserConstraint;        
    $MetaPermissionTag=$obj_param->MetaPermissionTag;                
    //CREATE DATA ENTRIES WHICH ARE MISSING FROM SYSTEM      
    $str_sql="
    SELECT * FROM  `$DataSchemaName`.`$DataTableName` WHERE TRUE 
    ";

    if(!empty($MetaDataSystemConstraint)){
        $str_sql.="AND `$MetaDataSystemConstraint`=$MetaUserSystemId ";
    }        
    if(!empty($MetaDataUserConstraint)){
        $str_sql.="AND `$MetaDataUserConstraint`=$MetaUserId";
    }        
    
    $str_sql.=";";                    
    $stmt=$this->fn_executeSQLStatement($str_sql);
    $arr_rows=$stmt->fetchAll();
    
    foreach ($arr_rows as $arr_row) {  
        $DataKeyValue=$arr_row[$DataKeyName];                                                          
        $obj_paramData=new stdClass;                  
        $obj_paramData->MetaDataSystemId=$MetaUserSystemId;      
        $obj_paramData->MetaDataOwnerId=$MetaUserId;      
        $obj_paramData->DataSchemaName=$DataSchemaName;
        $obj_paramData->DataTableName=$DataTableName;
        $obj_paramData->DataKeyName=$DataKeyName;      
        $obj_paramData->DataKeyValue=$DataKeyValue;               
        $obj_paramData->MetaPermissionTag=$MetaPermissionTag;                           
        
        $obj_metaData=new metaData($this);
        $obj_metaData->fn_createRecord($obj_paramData);                        
    } 
  }

    

    
    function fn_getSQLStatementRowz($str_select, $int_constraint=0){

      if($this->str_sqlStatement){return;}                  
      
      if($this->bln_debugRowz){
        $this->fn_addConsole("START fn_getSQLStatementRowz");        
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

      if($this->bln_debugRowz){
        $this->fn_addConsole("str_sql", $str_sql);        
        $this->fn_addConsole("END fn_getSQLStatementRowz");        
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
      AND `meta_rowz`.`Subdomain`='$str_subDomain'
      AND CASE WHEN (`meta_view`.`MetaViewType` IS NULL OR `meta_view`.`SystemPin`) THEN TRUE
         ELSE 
         `meta_view`.`MetaViewType`<>'$obj_paramView->MetaViewType'
      END
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
      //$this->fn_addConsole("xxx fn_selectMinimalFieldListColumnz");                             

      // this minimal field list is in use
      $str_fieldlist="                    
        
      `meta_rowz`.`MetaRowzId`,          
      `meta_rowz`.`MetaRowzSystemId`,      
      `meta_rowz`.`MetaRowzUserId`,              
      `meta_rowz`.`MetaRowzInterfacePin`,
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
      `meta_rowz`.`SettingPin`,          
      `meta_rowz`.`DisabledPin`,        
      `meta_rowz`.`HiddenPin`,
      `meta_rowz`.`ArchivePin`,
      `meta_rowz`.`AdminPin`,
      `meta_rowz`.`LockOpenPin`,
      `meta_rowz`.`AutoFetchPin`,        
      `meta_rowz`.`AutoOpenPin`,        
      `meta_rowz`.`Subdomain`,        
      `meta_rowz`.`MetaTypeRowzWidget`,
      `meta_rowz`.`MetaTypeRowzDashboard`,        
      `meta_rowz`.`MetaRowzGroup`,        
      `meta_rowz`.`SettingOperationPin`,
      `meta_rowz`.`MetaUpdatePin`,
      
      `meta_view`.`MetaViewId`,
      `meta_view`.`TemplateViewId`,
      `meta_view`.`MetaViewInterfacePin`,
      `meta_view`.`ViewPin`,
      `meta_view`.`ChargePin`,
      `meta_view`.`MetaViewSystemId`,
      `meta_view`.`MetaSchemaName`,
      `meta_view`.`MetaTableName`,
      `meta_view`.`MetaTableKeyField`,    
      
      `meta_view`.`JoinType`,    
      `meta_view`.`MetaViewName`,    
      `meta_view`.`MetaViewType`,
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
      
      //$this->fn_addConsole("fn_deleteMetaRowz MetaRowzId", $MetaRowzId);                                                    

      $obj_metaRowz=new metaRowz($this);
      $obj_metaRowz->fn_initialize($MetaRowzId);
      //$obj_metaRowz->fn_debug(true);
      $obj_metaRowz->fn_delete();      
  }
    
  function fn_getURLNavigateDynamicMenu($CompareMetaRowzName){    
    //$this->fn_addConsole("fn_getURLNavigateDynamicMenu CompareMetaRowzName: ".$CompareMetaRowzName);    
    //Not possible to set dynamic menus to auto open on client, dependent on navigation path
    return "";
}
function fn_getURLNavigateStandardMenu($CompareMetaRowzName){    
    
    $obj_post=$this->obj_post;
    //$this->fn_addConsole("fn_getURLNavigateStandardMenu CompareMetaRowzName: ".$CompareMetaRowzName);            
    
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
    //$this->fn_addConsole("TestMetaViewName: ".$TestMetaViewName);    
    //$this->fn_addConsole("CompareMetaRowzName: ".$CompareMetaRowzName);    
    //$this->fn_addConsole("CompareMetaRowzName: ".$CompareMetaRowzName);    
    //$this->fn_addConsole("CurrentMetaRowzId: ".$CurrentMetaRowzId);
    //$this->fn_addConsole("TestMetaParentRowzId: ".$TestMetaParentRowzId);
    //$this->fn_addConsole("TestMetaRowzId: ".$TestMetaRowzId);            
    //*/

    //$this->fn_addConsole("URLNavigateMenu: ".$URLNavigateMenu);    
    
    if(empty($URLNavigateMenu)){

      //$this->fn_addConsole("LEVEL FAILED");                      
      
      $str_sql="SELECT `meta_rowz`.`meta_rowz`.`MetaRowzName` FROM `meta_rowz`.`meta_rowz`                     
      WHERE `meta_rowz`.`meta_rowz`.`MetaRowzId`=$TestMetaParentRowzId";
      //$this->fn_addConsole("bbbbbbbbbbbb str_sql: ".$str_sql);    
      $stmt=$this->fn_executeSQLStatement($str_sql);                    
      $arr_row=$stmt->fetch();        
      if($arr_row){
        $CompareMetaRowzName=$arr_row["MetaRowzName"];        
        //$this->fn_addConsole("Attempt next level up : ".$CompareMetaRowzName);        
        $this->fn_getURLNavigateStandardMenu($CompareMetaRowzName);
        return;
      }
    }

    //$this->fn_addConsole("SUCCESSS");    

    return $URLNavigateMenu;
  }


  
  


    

}//END CLASS  
  ///////////////////////////DATAMANAGER