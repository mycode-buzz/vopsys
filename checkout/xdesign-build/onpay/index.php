<?php

require_once dirname(__FILE__ , 4). "/rowz.key";        

require_once dirname(__FILE__ , 6). "/composer/paymentproviders/stripe/vendor/autoload.php";        

require_once dirname(__FILE__ , 4). "/rowzData.php";        

require_once dirname(__FILE__, 1). "/object/metaTopup.php";        



class page{

    function __construct() {        

        $this->fn_setLokalDomain("office");        

        //IMPORTANT: SAFE TO USE FOR PRODUCTION RELEASE, CHECKS FOR LOCAL HOST
        $this->bln_usePaymentProviderSandbox=false;                                    
        $this->bln_debug=false;
        if($this->bln_localHost){
            $this->bln_usePaymentProviderSandbox=true;                                    
            $this->bln_debug=false;
        }          
        //IMPORTANT: SAFE TO USE FOR PRODUCTION RELEASE, CHECKS FOR LOCAL HOST
        
        $this->session_id="notset";
        $this->obj_rowzData=new rowzData;;
        $this->obj_rowzData->fn_connect();

        $this->str_runtime=date("Y-m-d H:i:s");
        $this->date_runtime=$this->fn_getDateFromString($this->str_runtime);
        $this->obj_metaTopup=new metaTopup($this);                                                

    }    
  
    function fn_execute() {
        
        //http://checkout.lokal-mycode.buzz/onpay/?paymentProvider=STRIPE&token=cs_test_a1KQvgz6VCSPluvuGDJbXWZEowjnATQ16zBmVfXISxaI96p0bd8KHpZEJi                   
        $str_paymentProvider=$this->getParameterFromUrl($_SERVER['REQUEST_URI'], "paymentProvider");    
      
        if (is_null($str_paymentProvider)) {
            $str_paymentProvider="";      
        }
        
        
        switch(strtolower($str_paymentProvider)){
            case "stripe":
            $obj_paramProvider=$this->fn_paymentProviderStripe();
            break;
            default;
            $this->fn_addEcho("NO PAYMENT PROVIDER RECOGNISED");
            return;
        }      
        
        $this->obj_metaTopup->fn_initialize($obj_paramProvider);        


        if($this->bln_debug){$this->fn_addEcho("GOPAY STATUS: ", $this->obj_metaTopup->fn_getGoPayStatus());}
        if($this->bln_debug){$this->fn_addEcho("PROCESS ENDS");}
        

        $this->obj_metaTopup->fn_setGoPayLabel("notset");
        
        
        if($this->obj_metaTopup->fn_getGoPayStatus()){            
            $this->bln_validPresentation=false;
            $this->obj_metaTopup->fn_setGoPayLabel("invalid");
            $this->fn_getValidPresentation();

            if($this->bln_validPresentation){            
                $this->obj_metaTopup->fn_setGoPayLabel("success");                
                $this->fn_fullfillOrder();
            }
        }

        $str_url="";
        $str_url.= $this->str_activeSubdomainURL;
        $str_url.= "?&goPayLabel=".$this->obj_metaTopup->fn_getGoPayLabel();

        if($this->bln_debug){$this->fn_addEcho("str_url: ".$str_url);}               

        if($this->bln_debug){}
        else{
            header("Location: $str_url");
        }
    }

    function fn_getValidPresentation(){
        // TODO: Make this function safe to run multiple times,
        // even concurrently, with the same session ID
        // TODO: Make sure fulfillment hasn't already been
        // peformed for this Checkout Session
        if($this->bln_debug){$this->fn_addEcho("fn_getValidPresentation");}

        
        $obj_metaTopup=$this->obj_metaTopup;        
        $obj_metaTopup->fn_createRecord();                       
        $bln_recordExisted=$obj_metaTopup->obj_param->bln_recordExisted;        
        if($this->bln_debug){$this->fn_addEcho("bln_recordExisted: ", $bln_recordExisted);}
        if(empty($bln_recordExisted)){//if no existing record was found
            $this->bln_validPresentation=true;
        }
        if($this->bln_debug){$this->fn_addEcho("this->bln_validPresentation: ", $this->bln_validPresentation);}

        

    }

    function fn_fullfillOrder(){      

        if($this->bln_debug){$this->fn_addEcho("fn_fullfillOrder");}        
        $this->fn_varDump($this->obj_metaTopup->obj_param);

        $obj_param=$this->obj_metaTopup->obj_param;
        
        $str_sql="UPDATE `meta_user`.`meta_system` SET
        `CreditName`=:CreditName,
        `Credit`=:Credit,
        `CreditExpiryDate`=:CreditExpiryDate
        WHERE TRUE
        AND `MetaSystemId`=:MetaSystemId;
        ";            
        if($this->bln_debug){$this->fn_addEcho("UPDATE SQL str_sql: ".$str_sql);}                
        $stmt=$this->obj_rowzData->fn_executeSQLStatement($str_sql, [
            'MetaSystemId' => $obj_param->MetaSystemId,            
            'CreditName' => $obj_param->ProductName,
            'Credit' => $obj_param->PostToken,
            'CreditExpiryDate' => $obj_param->PostExpiry
            
        ]);            

        $str_sql="UPDATE `meta_user`.`meta_mover` SET
          `meta_mover`.`SessionPin`=1
          WHERE TRUE 
          AND MetaMoverSystemId=:MetaMoverSystemId 
          AND MetaMoverType='User'
          ;";                    
          if($this->bln_debug){$this->fn_addEcho("UPDATE SQL str_sql: ".$str_sql);}                
          $stmt=$this->obj_rowzData->fn_executeSQLStatement($str_sql, [
            'MetaMoverSystemId'=>$obj_param->MetaSystemId          
          ]);        
        
          if($this->bln_debug){$this->fn_addEcho("UPDATE IS COMPLETE");}        
    }

    function fn_updateSessionPinAll($bln_value){

        $int_value=0;
        if($bln_value){
          $int_value=1;
        }
    
        $str_sql="UPDATE      
           `meta_user`.`meta_mover`
          SET
          `meta_mover`.`SessionPin`=$int_value
          WHERE TRUE AND                  
          MetaMoverSystemId=:MetaMoverSystemId AND 
          MetaMoverType='User'
          ;";                    
          $stmt = $this->fn_executeSQLStatement($str_sql, [          
            'MetaMoverSystemId'=>$this->obj_userLogin->MetaUserSystemId,      
          ]);        
      }

    function fn_paymentProviderStripe() {         

        global $stripe_secret_key, $stripe_secret_key_sandbox;  
        if($this->bln_usePaymentProviderSandbox){
            $stripe_secret_key=$stripe_secret_key_sandbox;
        }

    
        $session_id=$this->getParameterFromUrl($_SERVER['REQUEST_URI'], "token");    

        if (is_null($session_id)) {        
            if($this->bln_debug){$this->fn_addEcho("ERROR:TOKEN IS EMPTY: ".$session_id);}        
            exit;
        }  

        if($this->bln_debug){$this->fn_addEcho("TOKEN SUPPLIED: ".$session_id);}       
        if($this->bln_debug){$this->fn_addEcho("LOKAL URL: ".$this->str_activeSubdomainURL);}       

        //http://checkout.lokal-mycode.buzz/onpay/?paymentProvider=STRIPE&token=cs_test_a1KQvgz6VCSPluvuGDJbXWZEowjnATQ16zBmVfXISxaI96p0bd8KHpZEJi                           
        
        
        // See your keys here: https://dashboard.stripe.com/apikeys    
        //\Stripe\Stripe::setApiKey($stripe_secret_key);        
    
        //Fatal Error will result if wrong key, cannot catch
        //$stripe_secret_key = substr_replace($stripe_secret_key, "xxx", -3);
        $stripe = new \Stripe\StripeClient($stripe_secret_key);              
    
        //ATTENTION: Printing stripeClient object to client window can expose Stripe API Key
        //DONT LEAVE IT !!
        //if($this->bln_debug){$this->fn_varDump($stripe);}                    
        //DONT LEAVE IT !!
    
        // TODO: Log the string "Fulfilling Checkout Session $session_id"
        $this->session_id=$session_id;
        
        // Retrieve the Checkout Session from the API with line_items expanded  
        //Fatal Error will result if wrong token, cannot catch
        //$session_id = substr_replace($session_id, "xxx", -3);
        $checkout_session = $stripe->checkout->sessions->retrieve($session_id, [
            'expand' => ['line_items'],
        ]);   

        $obj_checkoutSession=$checkout_session;

        //PRINT OUT CHECKOUTSESSION
        if($this->bln_debug){$this->fn_varDump($obj_checkoutSession);}                                            
        //PRINT OUT CHECKOUTSESSION        
        

        $str_val=$obj_checkoutSession->client_reference_id;        
        $arr_parts = explode("ROWZ", $str_val);
        $client_reference_id=$arr_parts[0];   
        if($this->bln_debug){$this->fn_varDump($arr_parts);}                                                    
        $str_dateUnixTimeStamp=$arr_parts[1];
        $str_postExpiry=$this->fn_getDateFromTimeStamp($str_dateUnixTimeStamp)->format('Y-m-d H:i:s');
        $int_postToken=$arr_parts[2];
        
        
        ///GET LINE PRODUCT NAME
        $obj_lineItems=$obj_checkoutSession->line_items;
        $arr_data=$obj_lineItems->data;        
        $obj_lineItem=$arr_data[0];//one line item only integration                
        ///GET LINE PRODUCT NAME        
        
        $obj_param=new stdClass;        
        $obj_param->MetaSystemId=$client_reference_id;
        $obj_param->MetaSystemUserId=100;

        $obj_param->ProductDate=$this->fn_getDateFromTimeStamp($checkout_session["created"])->format('Y-m-d H:i:s');
        $obj_param->ProductName=$obj_lineItem->description;        
        $obj_param->ProductToken="";        

        $obj_param->PreExpiry="";        
        $obj_param->PreToken="";        
        $obj_param->PostExpiry=$str_postExpiry;
        $obj_param->PostToken=$int_postToken;                

        $obj_param->ProviderName="Stripe";
        $obj_param->ProviderCheckoutId=$obj_checkoutSession->id;
        $obj_param->ProviderCurrencyAmount=$obj_checkoutSession->amount_total;
        $obj_param->ProviderCurrencySymbol=$obj_checkoutSession->currency;                
        $obj_paramProvider=$obj_param;
        
        
        if($this->bln_debug){$this->fn_varDump($this->obj_metaTopup->obj_param);}                                            
        
        // Check the Checkout Session's payment_status property
        // to determine if fulfillment should be peformed
        if (isset($checkout_session->payment_status) && is_string($checkout_session->payment_status)) {
            //if($this->bln_debug){$this->fn_addEcho("STATUS IS A STRING AND NOT NULL");}            
        } else {
            //if($this->bln_debug){$this->fn_addEcho("STATUS IS EITHER NOT A STRING OR IS NULL");}                        
            exit;
        }        
        
        $obj_paramProvider->bln_goPayStatus=false;
        if (strtolower($checkout_session->payment_status) === 'paid') {
            $obj_paramProvider->bln_goPayStatus=true;          

            if($this->bln_debug){$this->fn_addEcho("HANDLED PAID STATUS");}                                                
        }        

        return $obj_paramProvider;
        
    }

    function fn_getDateFromTimeStamp($int_unixTimeStamp){        
        $date = new DateTime();
        $date->setTimestamp( $int_unixTimeStamp);
        return $date;
    }
    function fn_formatSystemDate(){        
    }

    function fn_addEcho($str_msg, $foo_var=false) {

        if(empty($foo_var)){
            $foo_var="";
        }
        else{
            $str_msg.=": ";
        }
        $str_msg.=$foo_var."<BR />";

        echo($str_msg);
        
    }

    
    function fn_varDump($object) {
        echo '<pre>';
        print_r($object);
        echo '</pre>';
    }
    

    function getParameterFromUrl($url, $parameterName) {
        $parsedUrl = parse_url($url);
        $query = $parsedUrl['query'] ?? '';    
        if(empty($query)){
            return null;
        }
        $params = explode('&', $query);
        foreach ($params as $param) {
            list($key, $value) = explode('=', $param);
            if ($key === $parameterName) {
                return $value;
            }
        }    
        return null;
    }    

    function fn_setLokalDomain($str_subDomain=false){       

        $this->bln_localHost=false;
        $this->str_lokalDomain="rowz.app";
        $this->str_lokalProtocol="https://";
        if (isset($_SERVER["REMOTE_ADDR"])) {if($_SERVER["REMOTE_ADDR"]==="127.0.0.1"){
          $this->bln_localHost=true;
          $this->str_lokalDomain="lokal-mycode.buzz";
          $this->str_lokalProtocol="http://";          
        }}
        $this->str_lokalURL=$this->str_lokalProtocol.$this->str_lokalDomain;        
        if(!empty($str_subDomain)){
            $this->str_activeSubdomainURL=$this->str_lokalProtocol.$str_subDomain.".".$this->str_lokalDomain;
        }
        else{
            $this->str_activeSubdomainURL=$this->str_lokalURL;
        }
      }
      function fn_getDateFromString($dateString){
        return  DateTime::createFromFormat("Y-m-d H:i:s", $dateString);
      }
}//END OF CLASS

//Instance Creation goes at bottom the page
$obj_page=new page();
try {  
$obj_page->fn_execute();    
} catch (Error $e) { // Error is the base class for all internal PHP error exceptions.  
$s="";    
$s.="MESSAGE: ".$e->getMessage().PHP_EOL;
$s.="FILENAME: ".$e->getFile().PHP_EOL;
$s.="LINE: ".$e->getLine().PHP_EOL;  
echo($s);
exit;
}


?>