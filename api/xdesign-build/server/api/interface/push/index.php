<!DOCTYPE html>
<html lang="en">
<title>Push</title>
<meta http-equiv="cache-control" content="max-age=0">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="-1">
<meta http-equiv="expires" content="Tue, 01 Jan 1980 11:00:00 GMT">
<meta http-equiv="pragma" content="no-cache">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
  * {/*NOTE. Box Sizing must be set//*/
    -webkit-box-sizing: border-box;
    box-sizing: border-box;    
  }                
  html{
    background-color: rgb(43, 44, 52);
    overflow: -moz-scrollbars-vertical; 
    overflow-y: scroll;
  }  
</style>
<body>

<div style="background:white;border:1.0em solid gray;border-radius:1.0em;margin:100px;padding:100px">
<div style="background:white;margin:1.0em;text-align: right;">
<button onclick="location.reload()">Refresh</button>
</div>
<?php
require_once dirname(__FILE__)."/push.php";
?>
</div>

</body>
</html>