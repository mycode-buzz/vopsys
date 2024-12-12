      //XSTART component/topup_dashboard
      class topup_dashboard extends xapp_dashboard{
        constructor(obj_ini) {      
          super(obj_ini);        
        } 
        fn_initialize(obj_ini){
          super.fn_initialize(obj_ini);                      

          //IMPORTANT: SAFE TO USE FOR PRODUCTION RELEASE, CHECKS FOR LOCAL HOST
          this.bln_usePaymentProviderSandbox=false;                              
          this.bln_debug=false;                    
          if(obj_path.bln_isLocal){
            this.bln_usePaymentProviderSandbox=true;                              
            this.bln_debug=false;                    
          }          
          this.bln_emphasis=true;
          this.int_emphasis=4;
          this.int_boldWeight=500;          
          this.str_textPay="Payment";
          //this.str_iconPay="fa-solid fa-star";
          //IMPORTANT: SAFE TO USE FOR PRODUCTION RELEASE, CHECKS FOR LOCAL HOST
        }  

        fn_loadDashboard(){
          if(!super.fn_loadDashboard()){
          
            //let obj_control=this.fn_addContextItem("form_span");                                                          
            //obj_control.fn_setText("ADMIN AREA");                                                                              
            

            let obj_menuButton=this.fn_getMenuButton();                  
            this.obj_consoleContainer=obj_menuButton.obj_menuPanel.fn_addConsoleContainer("console_container_system", true);            
            let obj_button=this.obj_consoleContainer.fn_getConsoleComponent("xapp_button_system_home", true);
            this.obj_consoleContainer.fn_showItem(obj_button);            

            return;
          }              
          

          this.str_goPayLabel=obj_path.fn_getQueryStringValue("goPayLabel");            
          if(this.str_goPayLabel==="success"){
            this.bln_paymentSuccess=true;
          }
          else if(this.str_goPayLabel==="topup"){
            this.bln_forceTopup=true;
          }          
          

          this.str_debug=obj_path.fn_getQueryStringValue("mode");            
          if(this.str_debug==="debug"){
            this.bln_debug=true;
          }
          //this.bln_debug=true;

          this.date_now=new Date();                  
          this.int_customerTokenz=obj_userHome.MetaSystem.Credit;
          this.str_expireSubscription=obj_userHome.MetaSystem.CreditExpiryDate;                              
          this.date_expireSubscription=obj_shared.fn_getDateObjectFromSystemDate(this.str_expireSubscription);                              
          
          this.str_nameProduct=obj_shared.fn_removeSpace(obj_userHome.MetaSystem.CreditName);

          this.int_fiscalYearEnd=obj_userHome.MetaSystem.FiscalYearEnd;//ZeroIndexed Month                    
          if(this.int_fiscalYearEnd===undefined){
            this.int_fiscalYearEnd=11;
          }
          if(this.str_nameProduct===undefined){
            this.str_nameProduct="CALENDARMONTH";
          }

          this.fn_loadPriceList();
          this.obj_product=obj_shared.fn_searchObject(this.obj_priceList, this.str_nameProduct);          
          

          let obj_param;

          let str_text;
          let obj_control;
          let obj_container=this;          
          //obj_control=obj_container.fn_addContextItem("form_hardrule");                              
          
          //---------------------
          obj_param={
            bln_customerSummary:true,
            str_labelProduct:"Subscription",
            int_priceTokenz:undefined,
            int_packageTokenz:undefined,            
            str_nameProduct:"Subscription",                        
            obj_themeItem:obj_project.obj_theme.obj_blockMidground,
            str_textSubmit:"&nbsp;",
            str_color:obj_project.obj_theme.obj_blockMidground.fn_getStyleProperty("backgroundColor"),            
            bln_boldText:true,            
          };
          this.fn_setDefaultPackageOption(obj_param);
          obj_param.bln_expiredSubscription=false;          
          if(this.date_expireSubscription<this.date_now){
            obj_param.bln_expiredSubscription=true;                        
          }                

          this.fn_addSubscriptionSummary(obj_param);           
          this.fn_displayPriceList();   
          this.fn_checkForUpgradeOptions(false);    
          
          
          //obj_control=obj_container.fn_addContextItem("form_hardrule");                    
          

          obj_container=this.fn_addContextItem("form_form");                                                      
          obj_container.fn_setStyleProperty("flexFlow", "column wrap");

          str_text=`More Information`;          
          
          let obj_showHide=obj_container.fn_addContextItem("form_button_showhide");                    
          obj_showHide.fn_setText(str_text);                      
          obj_showHide.fn_showIcon("info");

          let str_paymentLink;
          //let str_paymentLink =window.location.href;
          //str_paymentLink+="?goPayLabel=topup";

          /*
          str_paymentLink=window.location.pathname;
          if(!this.bln_forceTopup){
            str_paymentLink=obj_path.fn_setQueryStringValue("goPayLabel", "topup");                      
          }
          //*/
          str_paymentLink=obj_path.fn_setQueryStringValue("goPayLabel", "topup");                      
          
          /*
          <li><div style="text-decoration:underline" class="question">Is there a maximum number of tokens ?</div>          
          <div class="answer">Double the package amount. 
          </div></li>          
          //*/

          /*
          str_text=`<ul class="faq-list">
          <li><div style="text-decoration:underline" class="question">When is a token deducted ? </div>          
          <div class="answer">A Customer Record is fetched from the database.
          </div></li>                    
          <li><div style="text-decoration:underline" class="question">Do existing tokens rollover ?</div>          
          <div class="answer">On purchase. 
          </div></li>
          <li><div style="text-decoration:underline" class="question">If I allow tokens to expire ?</div>          
          <div class="answer">Data remains securely online until next purchase.
          </div></li>          
          <li><div style="text-decoration:underline" class="question">More options for purchase ?</div>          
          <div class="answer">Click <a href="` + str_paymentLink + `">here.</a>
          </div></li>          
          </ul>`;
          //*/

          //*
          str_text=
          `<ul class="faq-list">
          <li>1 token is deducted when a Customer Record is fetched from the database.</li>                    
          <li>Existing tokens rollover on purchase.</li>                    
          <li>If tokens expire, data remains securely online until next purchase.</li>
          <li>For more options, <a href="` + str_paymentLink + `">click here</a>.</li>          
          </ul>`;
          //*/
          
          obj_control=obj_container.fn_addContextItem("form_span");          
          if(this.bln_emphasis){
            if(obj_param.bln_boldText){              
              obj_control.fn_setStyleProperty("fontWeight", "bold");                    
            }                                 
          }
          if(obj_param.str_color){
            obj_control.fn_setStyleProperty("color", obj_param.str_color);                                
          }         
          
          obj_control.fn_setText(str_text);
          obj_control.fn_setDisplay(false);

          obj_showHide.obj_controlTarget=obj_control;
        } 

        
        fn_loadPriceList(){

          this.obj_priceList={};

          let obj_param;
          let obj_themeItem, str_textPay, str_iconPay, str_color, bln_boldText; 
          
          obj_themeItem=obj_project.obj_theme.obj_blockMidground;
          str_textPay=this.str_textPay;
          str_iconPay=this.str_icon;
          str_color=obj_project.obj_theme.obj_blockMidground.fn_getStyleProperty("backgroundColor");          
          bln_boldText=true;
          
          //---------------------
          obj_param={            
            str_labelProduct:"CALENDAR DAY",
            int_priceTokenz:2.50,
            int_packageTokenz:500,            
            str_nameProduct:"CALENDARDAY",                                    
            obj_themeItem:obj_themeItem,
            str_textSubmit:str_textPay,
            str_icon:str_iconPay,
            str_color:str_color,            
            bln_boldText:bln_boldText,            
          };
          this.obj_priceList[obj_param.str_nameProduct]=obj_param;                    

          //---------------------
          obj_param={            
            str_labelProduct:"CALENDAR MONTH",
            int_priceTokenz:15,
            int_packageTokenz:5000,            
            str_nameProduct:"CALENDARMONTH",      
            obj_themeItem:obj_themeItem,
            str_textSubmit:str_textPay,
            str_icon:str_iconPay,
            str_color:str_color,            
            bln_boldText:bln_boldText,            
          };
          this.obj_priceList[obj_param.str_nameProduct]=obj_param;                    
          
          //---------------------
          obj_param={            
            str_labelProduct:"FISCAL QUARTER",
            int_priceTokenz:100,
            int_packageTokenz:60000,            
            str_nameProduct:"FISCALQUARTER",                  
            obj_themeItem:obj_themeItem,
            str_textSubmit:str_textPay,
            str_icon:str_iconPay,
            str_color:str_color,            
            bln_boldText:bln_boldText,            
          };
          this.obj_priceList[obj_param.str_nameProduct]=obj_param;                              
          
          if(this.bln_forceTopup){
            //---------------------
            obj_param={            
              str_labelProduct:"FISCAL YEAR",
              int_priceTokenz:1000,
              int_packageTokenz:1000000,            
              str_nameProduct:"FISCALYEAR",
              obj_themeItem:obj_themeItem,
              str_textSubmit:str_textPay,
              str_icon:str_iconPay,
              str_color:str_color,            
              bln_boldText:bln_boldText,            
            };
            this.obj_priceList[obj_param.str_nameProduct]=obj_param;          
          }
        }        
        
        fn_setDefaultPackageOption(obj_param){

          //Run time otions
          
          
          this.bln_disableOnLimitTokenz=false;
          this.bln_disableOnPay=true;          
          //Run time otions

          //initial setting
          obj_param.bln_limitToPackageTokenz=false;
          obj_param.bln_limitToMinTokenz=false;
          obj_param.bln_limitToMaxTokenz=false;
          obj_param.bln_limitToMinExpiry=false;
          obj_param.bln_limitToThisPeriod=false;
          //initial setting          

          obj_param.date_expireSubscription=this.date_expireSubscription;
          obj_param.int_customerTokenz=this.int_customerTokenz;

          //turn on for console debug
          obj_param.bln_debugPeriod=false;
          //turn on for console debug
          
        }

        fn_debugDashboard(obj_param){
          
          console.log("obj_param.str_labelProduct: " + obj_param.str_labelProduct);
          console.log("obj_param.int_packageTokenz: " + obj_param.int_packageTokenz);
          console.log("obj_param.int_limitMaxTokenz: " + obj_param.int_limitMaxTokenz);          
          console.log("obj_param.int_customerTokenz: " + obj_param.int_customerTokenz);          
          console.log("obj_param.int_purchaseTokenz: " + obj_param.int_purchaseTokenz);

        }

        fn_formatPeriod(obj_param){       
          
          
          
          let obj_period;                    
          let bln_debugPeriod=obj_param.bln_debugPeriod;                    

          //25% percent over the packageTokenz is added to maxTokenz to allow for "comforatable upgrade" without having to go to exactly 50% of the limit.
          
          // options where you would lose tokens are not displayed - to prevent the very same. If you have previously used a high value ticket you wont be able to keep those by adding a month. 
          // you need to subscribe to same package , or allow your subsscription to expire (lositng the tokens) , then you can start again on a lower package.
          //so the principal is once yous start on a bigger package e.g move form day to mont , or moth to quarter or quarter to annual, you wont be able to subscribe to a lower package and keep the tokens. you can only allow the existing tokens to expire and then start afresh.

          // options where you would lose subscription time are displayed.

          //options where you would receive zero tokens are not displayed.
          switch(obj_param.str_nameProduct){
            case("CALENDARDAY"):            
            if(bln_debugPeriod){console.log("CALENDARDAY")};              
              obj_period=obj_shared.fn_getDatePeriod();                  
              break;
            case("CALENDARMONTH"):            
              if(bln_debugPeriod){console.log("CALENDARMONTH")};                          
              obj_period=obj_shared.fn_getMonthPeriod();                                
              break;
            case("FISCALQUARTER"):            
              if(bln_debugPeriod){console.log("FISCALQUARTER")}; 
              obj_period=obj_shared.fn_getQuarterPeriod(this.int_fiscalYearEnd);                                
              break;
            case("FISCALYEAR"):              
              if(bln_debugPeriod){console.log("FISCALYEAR")};              
              obj_period=obj_shared.fn_getYearPeriod(this.int_fiscalYearEnd);                  
              break;
          }

          //PURCHASE  TOKENS = NUMBER OF TOKENZ THAT WILL BE ADDEDD
          //TOTAL TOKENS = TOTAL NUMBER OF TOKENZ IN CUSTOMER ACCOUNT         

          //Set Max Tokenz
          obj_param.int_limitMaxTokenz=obj_param.int_packageTokenz*2;          
          obj_param.int_purchaseTokenz=obj_param.int_packageTokenz;            

          if(obj_param.bln_expiredSubscription){                      
            this.int_customerTokenz=0;//set base for addition            
            obj_param.int_customerTokenz=0;//set base for addition            
          }          

          if(this.bln_debug){
            this.fn_debugDashboard(obj_param);            
          }
          
          obj_param.int_customerTokenz=obj_param.int_customerTokenz+obj_param.int_purchaseTokenz;
          if(obj_param.int_customerTokenz>obj_param.int_limitMaxTokenz){            
            obj_param.bln_limitToMaxTokenz=true;
            obj_param.int_customerTokenz=obj_param.int_limitMaxTokenz;                        
          }                             
          
          if(obj_param.bln_limitToMaxTokenz){
            obj_param.int_purchaseTokenz=obj_param.int_customerTokenz-this.int_customerTokenz;            
          }                    
          
          if(!obj_param.int_purchaseTokenz){//disable on zero package             
            obj_param.bln_limitToMinTokenz=true;
          }          
          
          if(!this.bln_forceTopup){
            if(obj_param.int_purchaseTokenz>obj_param.int_packageTokenz){//disable on package tokens  greater than
              obj_param.bln_limitToPackageTokenz=true;
            }            
          }                

          if(obj_param.int_customerTokenz<this.int_customerTokenz){
            //obj_param.bln_limitToMinTokenz=true;                        
          }                   
          if(obj_param.int_purchaseTokenz<0){
            obj_param.int_purchaseTokenz=0;
          }                   
          
          //Set Number of Tokens but check for Max
          
          //Set Date of Expiry but check for Lapsed
          obj_param.date_expireSubscription=obj_period.date_expireNextPeriod;
          //console.log("obj_param.date_expireSubscription: " + obj_param.date_expireSubscription);
          obj_param.bln_expiredSubscription=false;          
          if(obj_param.date_expireSubscription<this.date_now){
            obj_param.bln_expiredSubscription=true;                        
          }                          
          
          if(obj_param.date_expireSubscription<=this.date_expireSubscription){              
            obj_param.bln_limitToMinExpiry=true;
          }
          
          //Set Date of Expiry but check for Lapsed
          obj_param.obj_period=obj_period;
          obj_param.date_expireThisPeriod=obj_period.date_expireThisPeriod;
          obj_param.date_expireNextPeriod=obj_period.date_expireNextPeriod;                                                
        }

        
        fn_addSubscriptionSummary(obj_param){
            
          let str_labelProduct;
          let str_customerTokenz, str_expireSubscription;          
          let str_statusSubscription;

          if(obj_param.bln_expiredSubscription){            
            obj_param.int_customerTokenz=0;                      
          }
          else{            
          }                          
          str_labelProduct=obj_param.str_labelProduct;          
          
          str_customerTokenz=obj_shared.fn_formatDisplayNumber(obj_param.int_customerTokenz);          
          str_customerTokenz+=" Tokens";
         
          str_expireSubscription=this.fn_getDisplayExpireSubcription(obj_param);
          
          let arr_item=[];
          //arr_item.push(obj_param.str_labelProduct);
          arr_item.push(this.obj_product.str_labelProduct);
          if(obj_param.bln_expiredSubscription){
            str_statusSubscription="COMPLETE";                
          }
          else{
            str_statusSubscription="ACTIVE";                                        
            if(this.bln_paymentSuccess){
              str_statusSubscription="Thank you for subscribing!";    
            }          
          }                                   

          arr_item.push(str_statusSubscription);
          arr_item.push(str_customerTokenz);
          arr_item.push(str_expireSubscription);
          obj_param.arr_item=arr_item;
          
          this.fn_writeTopUpForm(obj_param);          
          
          this.fn_themePanelBackgroundColor(obj_param);          
        }

        fn_themePanelBackgroundColor(obj_param){
          let obj_control=obj_param.obj_topupPanel;                    
          this.fn_themeBackgroundColor(obj_control, obj_param);
        }

        fn_themeBackgroundColor(obj_control, obj_param){
          let obj_themeItem=obj_param.obj_themeItem;
          let str_backgroundColor="grey";          

          if(obj_themeItem){
            str_backgroundColor=obj_themeItem.fn_getStyleProperty("backgroundColor");            
          }
          
          if((this.bln_disableOnLimitTokenz)){          
            str_backgroundColor="grey";                                  
          }
          if(obj_param.bln_expiredSubscription){          
            str_backgroundColor="grey";                      
            if(this.bln_debug){
              console.log(obj_param.str_labelProduct + ": bln_expiredSubscription caused str_backgroundColor = grey ")    
            }
          }
          if(str_backgroundColor){
            obj_control.fn_setStyleProperty("backgroundColor", str_backgroundColor);          
            obj_control.fn_setStyleProperty("borderColor", str_backgroundColor);                      
          }
        }
        
        fn_getDisplayExpireSubcription(obj_param){
          
          let str_expireSubscription;
          let str_expireLabel="Expiry";
          if(obj_param.bln_expiredSubscription){
            str_expireLabel="Expired";
          }

          let bln_value=obj_shared.fn_isTomorrow(obj_param.date_expireSubscription);            
          str_expireSubscription=obj_shared.fn_getCalendarDateStringFromDateObject(obj_param.date_expireSubscription, false, false);
          obj_param.str_expireSubscriptionSystem=obj_shared.fn_getUnixTimeStampFromDateObject(obj_param.date_expireSubscription);

          str_expireSubscription=str_expireLabel + " " + str_expireSubscription;                        
          if(bln_value){
            str_expireSubscription=str_expireLabel + " Tomorrow";
          }   
          /*    
          if(obj_param.bln_limitToMaxTokenz){
            //str_expireSubscription="<span style=\"color:grey\">"+str_expireSubscription+"</span>";

          }
          //*/

          return str_expireSubscription;

        }

        fn_displayPriceList(){

          for (const [key, value] of Object.entries(this.obj_priceList)) {
            //console.log(`Key: ${key}, Value: ${value}`);

            let obj_param=value;
            this.fn_setDefaultPackageOption(obj_param);                    
            this.fn_formatPeriod(obj_param);                               
            if(obj_param.str_nameProduct==="FISCALQUARTER"){
              obj_param.str_labelProduct="FISCAL " + obj_param.obj_period.str_nextPeriod + " QUARTER";
            }              
            this.fn_addTicket(obj_param);            
          }                   
        }

        fn_addTicket(obj_param){          

          if(obj_param.bln_limitToPackageTokenz){            
            this.bln_disableOnLimitTokenz=true;            
            if(this.bln_debug){
              console.log(obj_param.str_labelProduct + ": bln_limitToPackageTokenz caused bln_disableOnLimitTokenz = true ")    
            }
          }

          if(obj_param.bln_limitToMinTokenz && !this.bln_forceTopup){            
            this.bln_disableOnLimitTokenz=true;            
            if(this.bln_debug){
              console.log(obj_param.str_labelProduct + ": bln_limitToMinTokenz caused bln_disableOnLimitTokenz = true ")    
            }
          }

          if(obj_param.bln_limitToMaxTokenz && !this.bln_forceTopup){            
            this.bln_disableOnLimitTokenz=true;            
            if(this.bln_debug){
              console.log(obj_param.str_labelProduct + ": bln_limitToMaxTokenz caused bln_disableOnLimitTokenz = true ")    
            }
          }         

          
          if(obj_param.bln_limitToMinExpiry){            
            this.bln_disableOnLimitTokenz=true;            
            if(this.bln_debug){
              console.log(obj_param.str_labelProduct + ": bln_limitToMinExpiry caused bln_disableOnLimitTokenz = true ")    
            }
          }
          
          let str_labelProduct, str_priceTokenz, str_purchaseTokenz, str_customerTokenz, str_expireSubscription, date_expireSubscription;                              
          
          /////////////
          str_labelProduct=obj_param.str_labelProduct;
          obj_param.str_labelProduct=str_labelProduct;
          /////////////
          
          /////////////
          str_priceTokenz="";
          if(obj_param.int_priceTokenz!==undefined){
            str_priceTokenz=obj_shared.fn_formatDisplayNumber(obj_param.int_priceTokenz, 2);
            str_priceTokenz="EUR " + str_priceTokenz;
          }                    
          obj_param.str_priceTokenz=str_priceTokenz;
          /////////////

          /////////////
          str_purchaseTokenz="";          
          if(obj_param.int_purchaseTokenz!==undefined){            
            str_purchaseTokenz=obj_shared.fn_formatDisplayNumber(obj_param.int_purchaseTokenz);
            str_purchaseTokenz="+ " + str_purchaseTokenz + obj_shared.fn_formatPlural(obj_param.int_purchaseTokenz, " Token");
          }          
          obj_param.str_purchaseTokenz=str_purchaseTokenz;
          /////////////

          /////////////          
          str_customerTokenz="";          
          if(obj_param.int_customerTokenz!==undefined){
            str_customerTokenz=obj_shared.fn_formatDisplayNumber(obj_param.int_customerTokenz);
            str_customerTokenz="= " + str_customerTokenz + obj_shared.fn_formatPlural(obj_param.int_customerTokenz, " Token");            
            if(obj_param.bln_limitToMaxTokenz){
              str_customerTokenz+=" (Max)";              
            }               
          }                    
          obj_param.str_customerTokenz=str_customerTokenz;
          /////////////

          /////////////
          str_expireSubscription="";
          str_expireSubscription=this.fn_getDisplayExpireSubcription(obj_param);          
          obj_param.str_expireSubscription=str_expireSubscription;          
          /////////////
          
          this.fn_formatDisplayParam(obj_param);

          let arr_item=[];                              
          arr_item.push(obj_param.str_labelProduct);
          arr_item.push(obj_param.str_priceTokenz);
          arr_item.push(obj_param.str_purchaseTokenz);                    
          //arr_item.push(obj_param.str_customerTokenz);
          arr_item.push(obj_param.str_expireSubscription);
          obj_param.arr_item=arr_item;          
          
          this.fn_writeTopUpForm(obj_param);
          
          if(this.bln_disableOnLimitTokenz){            
            obj_param.obj_controlSubmit.fn_setDisabled(true);                                  
          }
          else{
            obj_param.obj_controlSubmit            
          }          
          //obj_param.obj_controlSubmit.fn_debug();

          this.fn_themePanelBackgroundColor(obj_param);          

          
          
        }

        fn_formatDisplayParam(obj_param){
          
          if(this.bln_disableOnLimitTokenz){                                  
            obj_param.str_labelProduct=this.fn_setSpanTextDisabled(obj_param.str_labelProduct);
            obj_param.str_priceTokenz=this.fn_setSpanTextDisabled(obj_param.str_priceTokenz);
            obj_param.str_purchaseTokenz=this.fn_setSpanTextDisabled(obj_param.str_purchaseTokenz);
            obj_param.str_customerTokenz=this.fn_setSpanTextDisabled(obj_param.str_customerTokenz);
            obj_param.str_expireSubscription=this.fn_setSpanTextDisabled(obj_param.str_expireSubscription);            
          }
        }
        fn_setSpanTextDisabled(str_value){
          return "<span style=\"color:grey\">"+str_value+"</span>";          
        }
        
        fn_writeTopUpForm(obj_param){
          
          let obj_topupPanel, obj_form, obj_control;                    

          let arr_item=obj_param.arr_item;

          obj_param.bln_hasForm=true;

          obj_topupPanel=this.fn_addContextItem("topup_panel");                                                          
          obj_param.obj_topupPanel=obj_topupPanel;//refernce used by button

          obj_form=obj_topupPanel.fn_addContextItem("form_form");                                            
          obj_param.obj_form=obj_form;
          //obj_topupPanel.fn_setStyleProperty("boxShadow", "1px 1px 3px rgba(0, 0, 0, 0.5)");                              

          for (const str_item of arr_item) {
            obj_control=obj_form.fn_addContextItem("form_span");                              
            obj_control.fn_setText(str_item);            
            if(this.bln_emphasis){
              if(obj_param.bln_boldText){              
                obj_control.fn_setStyleProperty("fontWeight", "bold");                    
              }                     
            }   
            if(obj_param.str_color){
              obj_control.fn_setStyleProperty("color", obj_param.str_color);                                
            }         
          }

          obj_control=this.fn_addTopUpSubmit(obj_form, obj_param);                    
          obj_param.obj_controlSubmit=obj_control;          

          if(!obj_param.bln_customerSummary && !this.bln_forceTopup){
            obj_topupPanel.fn_setDisplay(false);            
          }
        }
        
        fn_addTopUpSubmit(obj_container, obj_param){

          let str_name=obj_param.str_nameProduct;
          if(!obj_param.str_textSubmit){
            //return;
          }          
          
          let obj_control=obj_container.fn_addContextItem("topup_form_button");                       
          obj_control.obj_holder.obj_dashboard=this;
          obj_control.obj_holder.obj_product=obj_param;
          obj_control.fn_setDomProperty("name", str_name);                    
          obj_control.fn_setText(obj_param.str_textSubmit);          
          obj_control.fn_showIcon(obj_param.str_icon);          
          obj_control.fn_setStyleProperty("cursor", "pointer");                     
          if(obj_param.bln_customerSummary){            
            this.obj_submitSummary=obj_control;
            this.obj_submitSummary.bln_open=false;
            if(this.bln_forceTopup){
              this.obj_submitSummary.bln_open=true;
            }
            this.fn_setTextSubscription();            
          }
          else{
            //obj_control.fn_setStyleProperty("backgroundColor", "green");                              
          }
          return obj_control;
        }        

        fn_setTextSubscription(){
          
          let str_text;
          if(this.obj_submitSummary.bln_open){            
            str_text="Close Options";                        
          }
          else{            
            str_text="Show Options";            
          }
          if(this.bln_paymentSuccess && this.bln_disableOnPay){
            str_text="Let's Go!";            
          }           
         
          this.obj_submitSummary.fn_setText(str_text);                                        
          this.obj_submitSummary.fn_showIcon("replace-summary");
        }        

        fn_checkForUpgradeOptions(bln_action=false){
          let bln_found=false;
          let  obj_submitSummary=this.obj_submitSummary;
          for (const [key, value] of Object.entries(this.obj_priceList)) {        

            
            let obj_param=value;                                    
            if(!obj_param.bln_customerSummary){              
              if(obj_param.bln_hasForm && obj_param.obj_topupPanel){//or subscription didnt get a form , was rejected prior
                if(bln_action){
                  obj_param.obj_topupPanel.fn_setDisplay(obj_submitSummary.bln_open);
                }                
                bln_found=true;
              }              
            }
          }
          if(!bln_found){
            this.obj_submitSummary.fn_setText("Checkback later!");
            this.obj_submitSummary.fn_setDisabled(true);
          }          
        }

        fn_toggleOptions(){

          //console.log("fn_toggleOptions");          
          
          let  obj_submitSummary=this.obj_submitSummary;
          if(obj_submitSummary.bln_open){
            obj_submitSummary.bln_open=false;            
          }
          else{
            obj_submitSummary.bln_open=true;                        
          }
          
          this.fn_checkForUpgradeOptions(true);          
          this.fn_setTextSubscription();          
        }

        fn_topUpSubmitOnClick(obj_submit){                    
          
          //console.log("HEY HEY 123");

          let obj_product=obj_submit.obj_holder.obj_product;

          if(this.bln_paymentSuccess){
            obj_path.fn_navigateSubdomain("desk");
            return;
          }

          if(obj_submit===this.obj_submitSummary){                        
            this.fn_toggleOptions();
          }          
          else{
            this.fn_proceedToPayment(obj_submit);
          } 
        }  

        fn_proceedToPayment(obj_submit){

          let str_href;

          //console.log("fn_proceedToPayment");
          //return ;
          
          ////CALENDAR DAY TEST sandbox1

          //console.log(obj_submit);

          let str_nameProduct=obj_submit.obj_holder.obj_product.str_nameProduct;
          let str_expireSubscription=obj_submit.obj_holder.obj_product.str_expireSubscriptionSystem;
          let int_purchaseTokenz=obj_submit.obj_holder.obj_product.int_purchaseTokenz;          
          

          let obj_paymentProvider=new paymentProviderStripe();          
          obj_paymentProvider.fn_getPaymentURL(str_nameProduct, str_expireSubscription, int_purchaseTokenz);

          
          
          let str_paymentURL=obj_paymentProvider.str_paymentURL;
          if(this.bln_usePaymentProviderSandbox){
            str_paymentURL=obj_paymentProvider.str_paymentURLSandbox;
          }
          

          if(this.bln_debug){
            console.log("str_paymentURL: " + str_paymentURL);
            //return;
          }
          
          window.location.href=str_paymentURL;
        }

        //////////////////////////
        //////////////////////////
        
        //////////////////////////        
        //////////////////////////        
        
      }//END CLS
      
      class paymentProviderStripe{

        constructor(){                    
          
          //this.str_paymentURLSandbox="https://buy.stripe.com/test_dR63dCe31ccyaQgfYZ" + str_queryString;//real

          this.str_paymentURL="";          
          this.str_paymentURLSandbox="";
          
        }
        
        fn_getPaymentURL(str_nameProduct, str_expireSubscription, int_purchaseTokenz){

          //USE these 2 redirect links for live and Sandbox respectively
          //http://checkout.rowz.app/onpay/?application=Rowz&paymentProvider=Stripe&token={CHECKOUT_SESSION_ID}
          //http://checkout.lokal-mycode.buzz/onpay/?application=Rowz&paymentProvider=STRIPE&token={CHECKOUT_SESSION_ID}
          //USE these 2 redirect links for live and Sandbox respectively

          

          let str_queryString="";        
          str_queryString+="?";
          str_queryString+="&prefilled_email=" + obj_userHome.MetaUserEmail;
          str_queryString+="&client_reference_id=" + obj_userHome.MetaUserSystemId + "ROWZ" + str_expireSubscription + "ROWZ" + int_purchaseTokenz;

          switch(str_nameProduct){
            case "CALENDARDAY":                
                this.str_paymentURL="https://buy.stripe.com/eVa17MfcP2li8zS289" + str_queryString;        
                this.str_paymentURLSandbox="https://buy.stripe.com/test_dR63dCe31ccyaQgfYZ" + str_queryString;//real                                                                
                break;
              case "CALENDARMONTH":   
                this.str_paymentURL="https://buy.stripe.com/14k9Ei2q35xubM4aEE" + str_queryString;                                                        
                this.str_paymentURLSandbox="https://buy.stripe.com/test_9AQdSg4sr4K60bC288" + str_queryString;//real                                                          
                break;
              case "FISCALQUARTER":                
                this.str_paymentURL="https://buy.stripe.com/eVa03IggTf84dUc6oq" + str_queryString;        
                this.str_paymentURLSandbox="https://buy.stripe.com/test_9AQ7tS3on6Se5vW3ce" + str_queryString;//real                                
                break;
              case "FISCALYEAR":                
                this.str_paymentURL="https://buy.stripe.com/28o6s6ggT3pm17q6or" + str_queryString;        
                this.str_paymentURLSandbox="https://buy.stripe.com/test_aEUbK87EDfoKf6w3cf" + str_queryString;//real                                
                break;
          }
        }

        

      }

      class tempControl{        
        

        fn_addSelectField(obj_container, str_label){
          let obj_field=obj_container.fn_addContextItem("form_field");                              
          let obj_label=obj_field.fn_getComponent("form_label");
          obj_label.fn_setText(str_label);         
          let obj_span=obj_field.fn_getComponent("form_span");   
          obj_span.fn_setDisplay("none");
          return obj_field;
        }

        fn_addSelect(obj_container){

          let obj_select=obj_container.fn_addContextItem("form_select");                    
          obj_select.fn_setStyleProperty("fontWeight", "bold");          
          return obj_select;
        }

        fn_addSelectOption(obj_select, str_text, str_value){
          let dom_option=obj_select.fn_addOption(str_text, str_value);
          dom_option.style.fontWeight="bold";
          return dom_option;
        }

        fn_addTopUpRadio(obj_container, str_name, str_value){

          let obj_control=obj_container.fn_addContextItem("form_input");                    
          obj_control.fn_setDomProperty("type", "radio");
          obj_control.fn_setDomProperty("name", str_name);          
          obj_control.fn_setValue(str_value);          
          return obj_control;

        }


        fn_addSpanField(obj_container, str_label="", str_span=""){
          let obj_field=obj_container.fn_addContextItem("form_field");                    
          //obj_field.fn_setStyleProperty("flex-flow", "row wrap");          
          let obj_label=obj_field.fn_getComponent("form_label");
          obj_label.fn_setText(str_label);            
          let obj_span=obj_field.fn_getComponent("form_span");
          obj_span.fn_setText(str_span);            
          obj_span.fn_setStyleProperty("fontWeight", "bold");                    
          return obj_field;
        }
      }
      //END TAG
      //END component/topup_dashboard        