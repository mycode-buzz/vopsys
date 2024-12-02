<?php
///////////////////////////SERVER SESSION
session_name("AuthorizeSessionKey");//this will cause a cookie to be store don the users computer with expirey date
session_start();
///////////////////////////SERVER SESSION

error_reporting(E_ALL);

///////////////////////////SERVER PATH
define("ROOT",$_SERVER["DOCUMENT_ROOT"]);
define("APPROOT",ROOT."/app");
define("SERVERROOT",ROOT."/server");
define("DB_STORE_ROOT",ROOT."/dbstore");
define("VOPSYSROOT",dirname(ROOT, 2));
define("UPGRADEROOT",VOPSYSROOT."/upgrade/xdesign-build");
define("APIROOT",VOPSYSROOT."/api/xdesign-build");
define("INTERFACEROOT",APIROOT."/interface");
define("MAINTAINROOT",APIROOT."/maintain");
///////////////////////////SERVER PATH




///////////////////////////
require_once INTERFACEROOT . "/include.php";
///////////////////////////
 
///////////////////////////
require_once APIROOT . "/api/include.php";
///////////////////////////




?>