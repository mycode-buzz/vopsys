class Shared{
  constructor(){    
    this.str_listSeparatorOr="XORX";
    this.str_listSeparatorAnd="XANDX";
  }

  fn_messageWarn(str_message){
    alert(str_message);
  }  
  fn_messageAlert(str_message){
    alert(str_message);
  }
  
  fn_messageConfirm(str_message){  
    let bln_value=confirm(str_message);
    return bln_value;
  }  

  fn_formatDisplayValueFromColumn(obj_metaColumn, str_value){                                                                                                         

    str_value+="";                  
    if(!str_value){return str_value;}              
    
    switch(obj_metaColumn.MetaColumnType.toLowerCase()){                          
      case "checkbox":               
        if(!str_value){str_value=""};       
        str_value=obj_shared.fn_parseBool(str_value);                       
        if(str_value){str_value="Yes";}
        else{str_value="No";}                                            
        break;   
      case "color":                      
        if(!str_value){str_value=""};                      
        str_value="<div style='border:1px solid grey;background-color:"+str_value+"'>&nbsp;</div>"                      
        break;   
      case "email":
        if(!str_value){str_value="";return str_value;}
        if(str_value){
          str_value="<a href='mailto:"+str_value+"'>"+str_value+"</a>"
        }
        break;
      case "phone":
        if(!str_value){str_value="";return str_value;}
        if(str_value){
          str_value="<a href='tel:"+str_value+"'>"+str_value+"</a>"
        }                      
        break;
      case "url":
        if(!str_value){str_value="";return str_value;}
        if(str_value){
          str_value=str_value.replace(/^https:\/\//, '');                        
          str_value="<a target=\"_blank\" rel=\"noopener noreferrer\" href='https://"+str_value+"'>"+str_value+"</a>"
        }
        break;
      case "currency":              
      case "percent": 
      case "number":                   
        str_value=this.fn_formatNumber(str_value, obj_metaColumn.Decimal);
        str_value = Number(str_value).toLocaleString('en-GB', { minimumFractionDigits: obj_metaColumn.Decimal, maximumFractionDigits: obj_metaColumn.Decimal });
        break;
      case "date":                                            
      case "datetime":
        //if(!str_value){str_value="";return str_value;}                      
        let int_minLen=40;                      
        if(!str_value){str_value="";return str_value;}                      
        let obj_date=obj_shared.fn_getDateObjectFromSystemDate(str_value, obj_metaColumn.DateTime);                                                                                          
        str_value= obj_shared.fn_getCalendarDateStringFromDateObject(obj_date, obj_metaColumn.DateTime, obj_metaColumn.DateTimeSecond);                            
        break;
      case "recordid":                                            
        str_value=this.fn_formatNumber(str_value, 0);
        
    }
    return str_value;
  }
  
  fn_formatNumber(str_value, int_decimal){
    if(!str_value){str_value=0;}   
    str_value=this.fn_formatDecimalPlace(str_value, int_decimal);                     
    str_value=parseFloat(str_value).toFixed(int_decimal);                  
    return str_value;
  }
  
  fn_validNumber(str_value, bln_unsigned){                      
    str_value=this.fn_formatNumber(str_value);                      
    if(str_value<0 && !bln_unsigned){                    
      return false;
    }
    return true;
  }
   

  fn_getMode(){
    return this.fn_getURLParam("mode");        
}       

  fn_getURLParam(str_name, str_url=""){
    let params;
    str_name=str_name.toLowerCase();
    if(!str_url){
      str_url=location.search;
    }    
    params = new URLSearchParams(str_url.toLowerCase());                
    return params.get(str_name);        
}   

fn_getURLNoParam(str_name){  
  return window.location.href.split('?')[0].slice(0, -1);  
}    

fn_removeObjectFromArray(arr_item, obj_my){
  let index = arr_item.indexOf(obj_my);
  if(index !== -1) {
    arr_item.splice(index, 1);
  }
}

fn_removeAfterLastIndex(str, char){
  
  const lastIndex = str.lastIndexOf(char);
  // Trim the string after the last occurrence of the character
  return str.slice(0, lastIndex);
}

fn_validateDecimalPart(str_value, decimalDigits){   

  // Split the value into whole and decimal parts
  const my_obj=this.fn_getNumberByPart(str_value);

  // Check if the decimal part exceeds the allowed number of digits
  if (my_obj.decimalPart.length > decimalDigits) {
      return  my_obj.wholePart + '.' + my_obj.decimalPart.slice(0, decimalDigits);
  }
  return str_value;
}

fn_validateWholeNumberPart(str_value){  
  
  const my_obj=this.fn_getNumberByPart(str_value);

  // Check if the whole part exceeds 10 digits
  if (my_obj.wholePart.length > 10) {
    return my_obj.wholePart.slice(0, 10) + (my_obj.decimalPart ? '.' + my_obj.decimalPart : '');      
  }
  return str_value;
}

fn_getNumberByPart(str_value){
  const parts = str_value.split('.');
  const wholePart = parts[0].replace(/[^\d]/g, ''); // Remove non-digit characters
  const decimalPart = parts[1] || '';

  let my_obj={};
  my_obj.wholePart=wholePart;
  my_obj.decimalPart=decimalPart;
  return my_obj;
}

fn_validateNumberFormat(value, decimalDigits) {
  // Ensure decimalDigits is between 1 and 5
  if (decimalDigits < 1 || decimalDigits > 5) {
      throw new Error("Decimal digits must be between 1 and 5.");
  }

  // Define the regular expression for the format
  const pattern = new RegExp(`^[+-]?\\d{1,10}(\\.\\d{1,${decimalDigits}})?$`);

  // Check if the value matches the pattern
  return pattern.test(value);
}

fn_isNumeric(value){    
  return /^[0-9]+$/.test(value);
}
fn_rangeNumber(int_value, int_min, int_max){    
  if(int_value<int_min){
    int_value=int_min;
  }
  if(int_value>int_max){
    int_value=int_max;
  }
  return int_value;
}


fn_addToList(obj_list){                  

  //this will set list to blank if a blank value is added
  //this will add the item if not blank, and not already in the list  
  //the list is returned

  let str_list=obj_list.str_list;
  let str_item=obj_list.str_item;
  let str_separator=obj_list.str_separator;  

  obj_list.bln_added=false;
  obj_list.bln_reset=false;
  
  if(!str_item){str_item="";}
  if(str_item){                                      
    //check to see if the given vvalue is already uin the query term.
    //if it is, just return querLi.
    //if it is not add the term, along with a separatorOR.
    let str_needle=str_separator + str_item + str_separator;
    let str_haystack=str_separator + str_list + str_separator;
    if(this.fn_inString(str_needle, str_haystack)){    
      return;
    }
    if(str_list){str_list+=str_separator;}                  
    str_list+=str_item;
    obj_list.bln_added=true;
  } 
  else{
    obj_list.bln_reset=true;
    str_list="";
  }  
  obj_list.str_list=str_list;  
  this.fn_maintainList(obj_list);  
}                                             
fn_maintainList(obj_list){

  let str_list=obj_list.str_list;  
  let str_separator=obj_list.str_separator;  
  if(!str_list){return;}  
  str_list=this.fn_replace(str_list, str_separator+str_separator, str_separator);
  str_list=this.fn_trimCharacter(str_list, str_separator);  
  obj_list.str_list=str_list;
}


  fn_inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

 fn_sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


  fn_validNumberVanillla(x) {      
    if (isNaN(x)) {
      return false;
    }    
    if (x===false) {
      return false;
    }    
    if (x==="") {
      return false;
    }    
    return true;
  }

  fn_validDate(x) {
    const int_num=Date.parse(x);
    if (isNaN(int_num)) {
      return false;
    }    
    return true;
  }  
  
  fn_validEmail(str_email){      
    const str_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return str_pattern.test(str_email); 
  }
  fn_validPhone(str_tel){
    var str_pattern =  /^[0-9()\[\]\{\} N,;/*#+-.\bext\b]+?$/i;    
    //*
    if(str_pattern.test(str_tel)){
      str_pattern =  /n/;    
      if(str_pattern.test(str_tel)){
        return false;
      }
      return true;      
    }
      //*/
    
    return false;
 }
  fn_validURL(str_url){    
    const str_pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return str_pattern.test(str_url);
  }



  fn_expireCookie(cname) {
    this.fn_setCookie(cname, "", 0);            
  }
  fn_setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Lax";
  }

  fn_getCookie(cname) {            
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  fn_leadingZero(int_num){
    let str_num=int_num;
    if(int_num<10){str_num="0"+int_num};
    return str_num;
  }
  
  fn_getDate(int_flag){
    switch(int_flag){
      case obj_const.int_dateNow:      
      let date=new Date();
      //Y-m-d H:i:s
      let Y=date.getFullYear();      
      let m=this.fn_leadingZero(date.getMonth()+1);            
      let d=this.fn_leadingZero(date.getDate());            
      let H=this.fn_leadingZero(date.getHours());            
      let i=this.fn_leadingZero(date.getMinutes());            
      let s=this.fn_leadingZero(date.getSeconds());                  
      return Y+"-"+m+"-"+d+" "+H+":"+i+":"+s; 
    }  
  }
  fn_onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  

  fn_formatUniqueList(str_list){    

    let arr_list=str_list.split(",");        
    arr_list=arr_list.map(s => s.replace(/\s+/g, ' ').trim());     
    
    let arr_unique = arr_list.filter(this.fn_onlyUnique);            
    str_list=arr_unique.toString();
    return str_list;
  }  

  fn_formatString(str_value, int_flag){
    
    switch(int_flag){
      case obj_const.int_alpha:      
      return str_value.replace(/[^A-Z a-z_]+/g, "");        
      case obj_const.int_alphaComma:      
      return str_value.replace(/[^A-Z a-z,_]+/g, "");            
      case obj_const.int_alphaNumeric:      
      return str_value.replace(/[^A-Za-z0-9_]+/g, "");        
      case obj_const.int_alphaNumericComma:      
      return str_value.replace(/[^A-Za-z0-9,_]+/g, "");            
      case obj_const.int_trimCommas:          
      return str_value.replace(/^,|,$/gi,"");            
    }
  }
  
  /////PERIOD/////////////////    
  fn_getDatePeriod(){
    let obj_period={};                
    let date_period;

    date_period = new Date();          
    date_period.setDate(date_period.getDate() + 1);
    date_period.setHours(0, 0, 0, 0);
    obj_period.date_expireThisPeriod=date_period;                              
    
    date_period = new Date();          
    date_period.setDate(date_period.getDate() + 2);
    date_period.setHours(0, 0, 0, 0);
    obj_period.date_expireNextPeriod=date_period;                    

    return obj_period;
  }
  fn_getMonthPeriod(){
    let obj_period={};                
    obj_period.date_expireThisPeriod=obj_shared.fn_getDateFirstDayOfMonth(1);
    obj_period.date_expireNextPeriod=obj_shared.fn_getDateFirstDayOfMonth(2);
    return obj_period;
  }
  fn_getDateFirstDayOfMonth(int_addMonth=0) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + int_addMonth; // Next month

    // Handle the case where the next month is January of the next year
    const nextMonth = month % 12;
    const nextYear = year + Math.floor(month / 12);

    const date_result=new Date(nextYear, nextMonth, 1);
    date_result.setHours(0, 0, 0, 0);

    return date_result;
}
  fn_isTomorrow(date) {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure the time is set to midnight    
    
    const tomorrow = new Date();          
    tomorrow.setDate(today.getDate() + 1);          
    tomorrow.setHours(0, 0, 0, 0); // Ensure the time is set to midnight

    return date.getFullYear() === tomorrow.getFullYear() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getDate() === tomorrow.getDate();
  }

  fn_debugQuarterDate(str_title, obj_date, bln_writeTitle=false){
    
    str_title+=": ";
    if(bln_writeTitle){
      console.log(str_title + obj_date);
    }
    else{
        console.log(obj_date);
    }
  }
  
  fn_debugQuarterDates(obj_period, bln_writeTitle=false){

    this.fn_debugQuarterDate("date_q04", obj_period.date_q04, bln_writeTitle);
    this.fn_debugQuarterDate("date_q03", obj_period.date_q03, bln_writeTitle);    
    this.fn_debugQuarterDate("date_q02", obj_period.date_q02, bln_writeTitle);
    this.fn_debugQuarterDate("date_q01", obj_period.date_q01, bln_writeTitle);
    console.log("---");

    this.fn_debugQuarterDate("date_q1", obj_period.date_q1, bln_writeTitle);
    this.fn_debugQuarterDate("date_q2", obj_period.date_q2, bln_writeTitle);
    this.fn_debugQuarterDate("date_q3", obj_period.date_q3, bln_writeTitle);
    this.fn_debugQuarterDate("date_q4", obj_period.date_q4, bln_writeTitle);
    console.log("---");

    this.fn_debugQuarterDate("date_q5", obj_period.date_q5, bln_writeTitle);
    this.fn_debugQuarterDate("date_q6", obj_period.date_q6, bln_writeTitle);
    this.fn_debugQuarterDate("date_q7", obj_period.date_q7, bln_writeTitle);
    this.fn_debugQuarterDate("date_q8", obj_period.date_q8, bln_writeTitle);
    console.log("---");  
  }  

  fn_formatNumberPeriod(obj_period, int_numberPeriod){

    switch(int_numberPeriod){
      case(1):
        //console.log("int_numberPeriod: 1")
        obj_period.int_thisQuarter=1;
        obj_period.int_nextQuarter=2;
        obj_period.int_next1Quarter=3;
        obj_period.int_next2Quarter=4;

        obj_period.str_thisQuarter="1st";
        obj_period.str_nextQuarter="2nd";
        obj_period.str_next1Quarter="3rd";
        obj_period.str_next2Quarter="4th";
        
        break;
      case(2):
        //console.log("int_numberPeriod: 2")
        obj_period.int_thisQuarter=2;
        obj_period.int_nextQuarter=3;
        obj_period.int_next1Quarter=4;
        obj_period.int_next2Quarter=1;

        obj_period.str_thisQuarter="2nd";
        obj_period.str_nextQuarter="3rd";
        obj_period.str_next1Quarter="4th";
        obj_period.str_next2Quarter="1st";

        break;
      case(3):
        //console.log("int_numberPeriod: 3")
        obj_period.int_thisQuarter=3;
        obj_period.int_nextQuarter=4;
        obj_period.int_next1Quarter=1;
        obj_period.int_next2Quarter=2;

        obj_period.str_thisQuarter="3rd";
        obj_period.str_nextQuarter="4th";
        obj_period.str_next1Quarter="1st";
        obj_period.str_next2Quarter="2nd";      
        
        break;
      case(4):
        //console.log("int_numberPeriod: 4")
        obj_period.int_thisQuarter=4;
        obj_period.int_nextQuarter=1;
        obj_period.int_next1Quarter=2;
        obj_period.int_next2Quarter=3;

        obj_period.str_thisQuarter="4th";
        obj_period.str_nextQuarter="1st";
        obj_period.str_next1Quarter="2nd";
        obj_period.str_next2Quarter="3rd";      
        break;
    }
  }
  
  fn_getQuarterPeriod(int_fiscalYearEndMonth, date_today=false){
    //int_fiscalYearEndMonth(ZeorIndexed Month January =0, February=1...)

    let obj_period={};                
    let bln_debugPeriod=false;                
    
    let today=date_today;
    if(!date_today){
      today=new Date();
    }
    if(bln_debugPeriod){
      console.log("today: " + today);
    }    

    let str_thisYear=today.getFullYear();    
    let date_yearEndMonth=new Date(str_thisYear, int_fiscalYearEndMonth, 1);       
    
    if(bln_debugPeriod){
      const arr_monthNames = ["January", "February", "March","April","May","June","July","August","September","October","November","December"];    
      let str_yearEndMonthName=arr_monthNames[int_fiscalYearEndMonth];
      console.log(str_yearEndMonthName + ", " +  str_thisYear);
    }    

    let date_q01, date_q02, date_q03, date_q04;
    let date_q1, date_q2, date_q3, date_q4;
    let date_q5, date_q6, date_q7, date_q8;

    
    date_q01=new Date(date_yearEndMonth.getFullYear(), 0, 1);            
    date_q01.setMonth(date_yearEndMonth.getMonth()-2); //note minus 2       
    //console.log(date_q01);

    date_q02=new Date(date_q01.getFullYear(), 0, 1);            
    date_q02.setMonth(date_q01.getMonth()-3);        
    //console.log(date_q02);
    
    date_q03=new Date(date_q02.getFullYear(), 0, 1);            
    date_q03.setMonth(date_q02.getMonth()-3);    
    //console.log(date_q03);
    
    date_q04=new Date(date_q03.getFullYear(), 0, 1);            
    date_q04.setMonth(date_q03.getMonth()-3);    
    //console.log(date_q04);

    //-----------------
    
    date_q1=new Date(date_yearEndMonth.getFullYear(), 0, 1);            
    date_q1.setMonth(date_yearEndMonth.getMonth()+1); //note plus 1        
    //console.log(date_q1);

    date_q2=new Date(date_q1.getFullYear(), 0, 1);            
    date_q2.setMonth(date_q1.getMonth()+3);        
    //console.log(date_q2);
    
    date_q3=new Date(date_q2.getFullYear(), 0, 1);            
    date_q3.setMonth(date_q2.getMonth()+3);    
    //console.log(date_q3);
    
    date_q4=new Date(date_q3.getFullYear(), 0, 1);            
    date_q4.setMonth(date_q3.getMonth()+3);    
    //console.log(date_q4);

    date_q5=new Date(date_q4.getFullYear(), 0, 1);            
    date_q5.setMonth(date_q4.getMonth()+3);        
    //console.log(date_q5);

    date_q6=new Date(date_q5.getFullYear(), 0, 1);            
    date_q6.setMonth(date_q5.getMonth()+3);        
    //console.log(date_q6);
    
    date_q7=new Date(date_q6.getFullYear(), 0, 1);            
    date_q7.setMonth(date_q6.getMonth()+3);    
    //console.log(date_q7);
    
    date_q8=new Date(date_q7.getFullYear(), 0, 1);            
    date_q8.setMonth(date_q7.getMonth()+3);    
    //console.log(date_q8);

    
    if(bln_debugPeriod){      
      obj_period.date_q01=date_q01;obj_period.date_q02=date_q02;obj_period.date_q03=date_q03;obj_period.date_q04=date_q04;
      obj_period.date_q1=date_q1;obj_period.date_q2=date_q2;obj_period.date_q3=date_q3;obj_period.date_q4=date_q4;
      obj_period.date_q5=date_q5;obj_period.date_q6=date_q6;obj_period.date_q7=date_q7;obj_period.date_q8=date_q8;    

      this.fn_debugQuarterDates(obj_period);
    }    

    if(today>=date_q04 && today<date_q03){ //note q04
      if(bln_debugPeriod){console.log("PAST current quarter is q1")}  
      
      this.fn_formatNumberPeriod(obj_period, 1);      

      obj_period.date_quarter1=date_q04;
      obj_period.date_quarter2=date_q03;
      obj_period.date_quarter3=date_q02;
      obj_period.date_quarter4=date_q01;      
      
      obj_period.date_thisQuarter=date_q04;
      obj_period.date_nextQuarter=date_q03;            
      obj_period.date_next1Quarter=date_q02;            
      obj_period.date_next2Quarter=date_q01;            
      
    }

    if(today>=date_q03 && today<date_q02){ //note q03
      if(bln_debugPeriod){console.log("PAST current quarter is q2")}              
      
      this.fn_formatNumberPeriod(obj_period, 2);     

      obj_period.date_quarter2=date_q03;
      obj_period.date_quarter3=date_q02;
      obj_period.date_quarter4=date_q01;
      obj_period.date_quarter1=date_q1;

      obj_period.date_thisQuarter=date_q03;
      obj_period.date_nextQuarter=date_q02;            
      obj_period.date_next1Quarter=date_q01;            
      obj_period.date_next2Quarter=date_q1;            
    }

    if(today>=date_q02 && today<date_q01){ //note q02
      if(bln_debugPeriod){console.log("PAST current quarter is q3")}                    

      this.fn_formatNumberPeriod(obj_period, 3);

      obj_period.date_quarter3=date_q02;
      obj_period.date_quarter4=date_q01;
      obj_period.date_quarter1=date_q1;
      obj_period.date_quarter2=date_q2;      

      obj_period.date_thisQuarter=date_q02;
      obj_period.date_nextQuarter=date_q01;           
      obj_period.date_next1Quarter=date_q1;            
      obj_period.date_next2Quarter=date_q2;             
    }
    if(today>=date_q01 && today<date_q1){ //note q01
      if(bln_debugPeriod){console.log("PAST current quarter is q4")}                    

      this.fn_formatNumberPeriod(obj_period, 4);

      obj_period.date_quarter4=date_q01;
      obj_period.date_quarter1=date_q1;
      obj_period.date_quarter2=date_q2;
      obj_period.date_quarter3=date_q3;
      
      obj_period.date_thisQuarter=date_q01;
      obj_period.date_nextQuarter=date_q1;            
      obj_period.date_next1Quarter=date_q2;            
      obj_period.date_next2Quarter=date_q3;             
    }
    //---

    if(today>=date_q1 && today<date_q2){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q1")}                                

      this.fn_formatNumberPeriod(obj_period, 1);

      obj_period.date_quarter1=date_q1;
      obj_period.date_quarter2=date_q2;
      obj_period.date_quarter3=date_q3;
      obj_period.date_quarter4=date_q4;      

      obj_period.date_thisQuarter=date_q1;
      obj_period.date_nextQuarter=date_q2;            
      obj_period.date_next1Quarter=date_q3;            
      obj_period.date_next2Quarter=date_q4;             
    }
    if(today>=date_q2 && today<date_q3){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q2")}                                
      
      this.fn_formatNumberPeriod(obj_period, 2);      
      
      obj_period.date_quarter2=date_q2;
      obj_period.date_quarter3=date_q3;
      obj_period.date_quarter4=date_q4;      
      obj_period.date_quarter1=date_q5;

      obj_period.date_thisQuarter=date_q2;
      obj_period.date_nextQuarter=date_q3;            
      obj_period.date_next1Quarter=date_q4;            
      obj_period.date_next2Quarter=date_q5;             
    }
    if(today>=date_q3 && today<date_q4){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q3")}                                      
      
      this.fn_formatNumberPeriod(obj_period, 3);   
      
      obj_period.date_quarter3=date_q3;
      obj_period.date_quarter4=date_q4;      
      obj_period.date_quarter1=date_q5;
      obj_period.date_quarter2=date_q6;

      obj_period.date_thisQuarter=date_q3;
      obj_period.date_nextQuarter=date_q4;            
      obj_period.date_next1Quarter=date_q5;            
      obj_period.date_next2Quarter=date_q6;             
    }
    if(today>=date_q4 && today<date_q5){
      if(bln_debugPeriod){console.log("PRESENT current quarter is q4")}                                            
      
      this.fn_formatNumberPeriod(obj_period, 4);      
      
      obj_period.date_quarter4=date_q4;      
      obj_period.date_quarter1=date_q5;
      obj_period.date_quarter2=date_q6;
      obj_period.date_quarter3=date_q7;

      obj_period.date_thisQuarter=date_q4;
      obj_period.date_nextQuarter=date_q5;            
      obj_period.date_next1Quarter=date_q6;            
      obj_period.date_next2Quarter=date_q7;             
    }
    //---

    if(today>=date_q5 && today<date_q6){
      if(bln_debugPeriod){console.log("FUTURE current quarter is q1")}                                            
      
      this.fn_formatNumberPeriod(obj_period, 1);      
      
      obj_period.date_quarter1=date_q5;
      obj_period.date_quarter2=date_q6;
      obj_period.date_quarter3=date_q7;
      obj_period.date_quarter4=date_q8;      

      obj_period.date_thisQuarter=date_q5;
      obj_period.date_nextQuarter=date_q6;            
      obj_period.date_next1Quarter=date_q7;            
      obj_period.date_next2Quarter=date_q8;             
    }
    //*
    if(today>=date_q6 && today<date_q7){
      if(bln_debugPeriod){console.log("WONT SEE FUTURE current quarter is q2")}                                                        
      
      this.fn_formatNumberPeriod(obj_period, 2);      
      
      obj_period.date_quarter2=date_q6;
      obj_period.date_quarter3=date_q7;
      obj_period.date_quarter4=date_q8;            
      
      obj_period.date_thisQuarter=date_q6;
      obj_period.date_nextQuarter=date_q7;            
      obj_period.date_next1Quarter=date_q8;                  
    }
    if(today>=date_q7 && today<date_q8){
      if(bln_debugPeriod){console.log("WONT SEE FUTURE current quarter is q3")}                                                  
      
      this.fn_formatNumberPeriod(obj_period, 3);         
      
      obj_period.date_quarter3=date_q7;
      obj_period.date_quarter4=date_q8;                  

      obj_period.date_thisQuarter=date_q7;
      obj_period.date_nextQuarter=date_q8;            
    }
    if(today>=date_q8){
      if(bln_debugPeriod){console.log("WONT SEE FUTURE current quarter is q4")}                                                  
      
      this.fn_formatNumberPeriod(obj_period, 4);         
      
      obj_period.date_quarter4=date_q8;            

      obj_period.date_thisQuarter=date_q8;      
    }   
    
    obj_period.date_expireThisPeriod=obj_period.date_nextQuarter;    
    obj_period.int_thisPeriod=obj_period.int_thisQuarter;    
    obj_period.str_thisPeriod=obj_period.str_thisQuarter;    

    obj_period.date_expireNextPeriod=obj_period.date_next1Quarter;
    obj_period.int_nextPeriod=obj_period.int_nextQuarter;    
    obj_period.str_nextPeriod=obj_period.str_nextQuarter;    

    
    

    obj_period.date_quarterYearEnd=obj_period.date_quarter4;
    obj_period.date_quarterYearStart=obj_period.date_quarter1;
    //console.log("obj_period.date_quarterYearEnd: " + obj_period.date_quarterYearEnd);
    //console.log("obj_period.date_quarterYearStart: " + obj_period.date_quarterYearStart);

    let str_year, str_month;
    str_year=obj_period.date_quarterYearStart.getFullYear();
    
    if(today>obj_period.date_quarterYearStart){
      str_year=obj_period.date_quarterYearStart.getFullYear()+1;
    }
    str_month=obj_period.date_quarterYearStart.getMonth();
    obj_period.date_expireThisYearPeriod=new Date(str_year, str_month, 1)
    str_year=obj_period.date_expireThisYearPeriod.getFullYear()+1;
    obj_period.date_expireNextYearPeriod=new Date(str_year, str_month, 1)    
    

    return obj_period;
  }

  fn_getYearPeriod(int_fiscalYearEndMonth, date_today=false){
    //int_fiscalYearEndMonth(ZeorIndexed Month January =0, February=1...)

    let obj_period=obj_shared.fn_getQuarterPeriod(int_fiscalYearEndMonth, date_today=false);    
    obj_period.date_expireThisPeriod=obj_period.date_expireThisYearPeriod;
    obj_period.date_expireNextPeriod=obj_period.date_expireNextYearPeriod;
    return obj_period;
  }
  fn_getFirstDayOfYearFromNow(yearsToAdd) {
    
    let today = new Date();
    let targetYear = today.getFullYear() + yearsToAdd;
    let firstDayOfYear = new Date(targetYear, 0, 1);
    return firstDayOfYear;
  }  

  /////PERIOD/////////////////

  fn_formatDisplayNumber(int_num, int_digits=0){

    return Number(int_num).toLocaleString('en-GB', { minimumFractionDigits: int_digits, maximumFractionDigits: int_digits });
  }


  fn_parseDateTimeString(dateTimeString, bln_addTime=false) {
    if(!dateTimeString){      
      return "";
    }
    if(dateTimeString===undefined){      
      return "";
    }
    if(dateTimeString==="undefined"){      
      return "";
    }

    dateTimeString=dateTimeString.replace("T", " ");    
    //Remove the T
    
    // Split the date and time parts    
    let [datePart, timePart] = dateTimeString.split(' ');

    // Split the date part into year, month, and day
    let [year, month, day] = datePart.split('-');

    
    // Create a new Date object
    if(bln_addTime){
      // Split the time part into hours, minutes, and seconds      

      let [hours, minutes, seconds] = timePart.split(':');

      return new Date(year, month - 1, day, hours, minutes, seconds); // Months are zero-based
    }    

    return new Date(year, month - 1, day); // Months are zero-based
}

  fn_isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  fn_getDateStringFromDateObject(dateString) {
    
    // Split the date string into components
    let [day, month, year] = dateString.split('-');

    // Convert the month abbreviation to a month number
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let monthIndex = monthNames.indexOf(month.toUpperCase());

    // Create a new Date object
    return new Date(year, monthIndex, day);
  }
  fn_getUnixTimeStampFromDateObject(date_obj){
    const unixTimestamp = Math.floor(date_obj.getTime() / 1000);
    return unixTimestamp;

  }
  fn_formatSystemDateString(obj_date, bln_addTime=false, bln_addSeconds=false){        

    let year = obj_date.getFullYear();
    let month = (obj_date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = obj_date.getDate().toString().padStart(2, '0');
    
    if(bln_addTime){        
      let hours = obj_date.getHours().toString().padStart(2, '0');
      let minutes = obj_date.getMinutes().toString().padStart(2, '0');
      let seconds = obj_date.getSeconds().toString().padStart(2, '0');            
      if(bln_addSeconds){
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;            
      }
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;      
    }
    
    return `${year}-${month}-${day}`;
  }

  fn_formatISODateString(date, bln_addTime=false, bln_addSeconds=false){

    if(date==="Invalid Date"){
      return "";
    }
    
    if(!date){
      return "";
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();      
    
    if(bln_addTime){
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      if(bln_addSeconds){
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;  
      }
      return `${year}-${month}-${day}T${hours}:${minutes}`;
      
    }    
    return  `${year}-${month}-${day}`;
  }

  fn_getCalendarDateStringFromDateObject(date, bln_addTime=false, bln_addSeconds=false){

    if(date==="Invalid Date"){
      return "";
    }
   
    if(!date){
      return "";
    }
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];            
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      if(bln_addTime){
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        if(bln_addSeconds){
          return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }
        return `${day}-${month}-${year} ${hours}:${minutes}`;
      }
      
      return `${day}-${month}-${year}`;
      
  }

  fn_getDateObjectFromCalendarDate(dateTimeString, bln_addTime=false) {    
    
    // Split the date and time parts
    let [datePart, timePart] = dateTimeString.split(' ');

    // Split the date part into day, month, and year
    let [day, month, year] = datePart.split('-');

    // Convert the month abbreviation to a month number
    //const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let monthIndex = monthNames.indexOf(month.toUpperCase());
    //let monthIndex = monthNames.indexOf(month);
     // Create a new Date object
     if(bln_addTime){     
        // Split the time part into hours, minutes, and seconds
      let [hours, minutes, seconds] = timePart.split(':')
    
      return new Date(year, monthIndex, day, hours, minutes, seconds);
     }
     
     return new Date(year, monthIndex, day);
     
     
  }
  fn_getDateObjectFromSystemDate(dateTimeString, bln_addTime){        
    return this.fn_parseDateTimeString(dateTimeString, bln_addTime);
  } 

  fn_formatDate(str_value){
    
    return str_value.replace(/[^A-Za-z0-9 :\-_]+/g, "");            
    //return str_value;
  }
  fn_searchObject(obj_value, key) {
        
    if (key in obj_value) {
      return obj_value[key];
    } else {
      return null; // Or throw an error if you prefer
    }
  }


  fn_formatShortName(str_value){                    
    if(!str_value){str_value="";}
    str_value=str_value.toLowerCase().replace(/-/gi, "_");;                    
    str_value=this.fn_removeSpace(str_value);            
    str_value=this.fn_formatString(str_value, obj_const.int_alphaNumeric);                                      
    return str_value;
  }
  fn_formatShortDate(str_value){                    
    str_value=this.fn_formatDate(str_value);                                      
    return str_value;
  }  

  fn_formatPlural(int_value, str_value, bln_flip=false){

    let bln_value=false;    
    if(int_value>1){
      bln_value=true;            
    }

    if(bln_flip){
      bln_value=this.fn_flipBool(bln_value);      
    }

    if(bln_value){
      str_value+="s";
    }
    return str_value;
  }
  fn_stringToArray(str_value=""){     
    if(!str_value){return [];}
    let arr_item = str_value.split(",").map(item => item.trim());    
    return this.fn_cleanArray(arr_item);        
  }

  fn_cleanArray(arr_item){                                
    return [...new Set(arr_item)].filter((str) => str !== '');    
  }

  fn_cleanId(foo_idRecord){                                               
    if(!foo_idRecord){return 0;} 
    foo_idRecord+='';
    if(foo_idRecord.length>100){return 0;}                
    foo_idRecord=this.fn_alphanumericOnly(foo_idRecord);                
    if(this.fn_inStr("SELECT", foo_idRecord)){return 0;}
    if(this.fn_inStr("UPDATE", foo_idRecord,)){return 0;}
    if(this.fn_inStr("INSERT", foo_idRecord)){return 0;}
    if(this.fn_inStr("DELETE", foo_idRecord)){return 0;}                    
    return foo_idRecord;
  }
  fn_validId(foo_val){
    if(!foo_val || foo_val==="0")return false;    
    return true;
  }
  fn_compareId(str_id, str_compare){    
    str_id+="";    
    str_compare+="";    
    if(str_id===str_compare){return true;}
    return false;
  }  
  

  fn_formatDecimalPlace(str_value, decimal){
    const num = Number(str_value);
    return num.toFixed(decimal);        
  }  
  fn_cleanValue(str_value){                                               
    return this.fn_cleanId(str_value);                
  }

  fn_alphanumericOnly(foo_value, str=""){
    return foo_value.replace(/[\W_]+/g, str);
  }

  
  fn_getHTMLTable(arr_name, arr_value){
    let str_table, str_row, str_cell, str_name, str_value;
    str_table=`<TABLE style="font-size: 0.8em;">`;    
    for (let i = 0; i < arr_name.length; i++) {
      str_name=arr_name[i];      
      str_value=arr_value[i];      
      str_value=this.fn_replace(str_value, "&nbsp;", "");
      if(str_value==102){
        //str_value="John Collins";
      }
      str_row="";
      if(str_value){
        str_row=`
        <TR>
        <TD style="text-align: right;">${str_name}:</TD>
        <TD>${str_value}</TD>
        </TR>`;
      }
      
      if(str_row){str_table+=str_row;}
    }
    str_table+="</TABLE>";
    return str_table;

  }


  fn_replace(str_source, str_find, str_replace, str_brackets=""){  
    str_source=str_brackets+str_source+str_brackets;
    str_find=str_brackets+str_find+str_brackets;    
    let re=new RegExp(str_find, "gi");
    
    return str_source.replace(re, str_replace);
  }
  fn_remove(str_source, str_remove){
    let re=new RegExp(str_remove, "g");
    return str_source.replace(re, "");
  }

  fn_trimCharacter(inputString, characterToTrim) {
    // Create a regular expression that matches the specified character at the beginning and end of the string
    const regex = new RegExp(`^${characterToTrim}+|${characterToTrim}+$`, 'g');
    
    // Use the replace method to remove the character from the string
    const trimmedString = inputString.replace(regex, '');
  
    return trimmedString;
  } 

  fn_getBaseURL(obj_url){
    return `${obj_url.protocol}//${obj_url.host}`;
  }

  fn_promoteArrayItem(arr_item, foo_item){

    if(!Array.isArray(arr_item))return;

    const index = arr_item.indexOf(foo_item);
    if (index !== -1) {
      arr_item.splice(index, 1); // Remove the item from its current position
      arr_item.unshift(foo_item); // Add it to the front
    }           
  }
  

  fn_getFoldersFromPath(folderPath) {
    // Split the folderPath using forward slash (/) as the delimiter
    const folders = folderPath.split('/');
  
    // Filter out any empty folder names (resulting from multiple consecutive slashes)
    const filteredFolders = folders.filter(folder => folder.length > 0);
  
    return filteredFolders;
  }  
  
  fn_trimComma(str){        
    str = str.replace(/(^,)|(,$)/g, "")    
    return str;
  }
  fn_removeSpace(str){        
    str = str.replace(/\s+/g, '');    
    return str;
  }

  fn_isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  fn_isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  fn_hasMembersObject(obj) {
    return Object.keys(obj).length !== 0;
  }

  fn_capitalize(words="") {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
    }
    return separateWord.join(' ');
  } 

  fn_inString(str_needle="", str_haystack="", str_brackets=""){
    return this.fn_inStr(str_needle, str_haystack, str_brackets);
  }

  fn_inStr(str_needle="", str_haystack="", str_brackets=""){  

    str_needle=str_brackets+str_needle+str_brackets;
    str_haystack=str_brackets+str_haystack+str_brackets;

    let int_pos=str_haystack.toLowerCase().indexOf(str_needle.toLowerCase());
    if(int_pos===-1){return false;}
    return true;
  }

  fn_isEmptyObject(my_obj) { 

    if(!my_obj){return true;}

    if(my_obj.constructor === Object && Object.keys(my_obj).length === 0){
      return true;
    } 
    return false;
  }

  fn_removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }

  fn_camelCaseToHyphen(str) { 

      return str.replace(/([A-Z])/g, "-$1").toLowerCase();  
  }

  fn_debug(obj_myObj, str_message=""){
    this.fn_enumerateObject(obj_myObj, str_message="");
  }

  fn_debugArrayItem(item, index) {
    console.log("array item: " + index + ": " + item); 
  }

  fn_listObject(obj_my, str_msg=""){
    if(str_msg){
      console.log("fn_listObject: " + str_msg);
    }
    const keys = Object.keys(obj_my);
    keys.forEach(key => {
        console.log(`${key}: ${obj_my[key]}`);
    });
  }

  fn_enumerateObject(obj_myObj, str_message=""){

      console.groupCollapsed("ENUMERATE OBJECT :" + str_message);

      for (let [key, foo_value] of Object.entries(obj_myObj)) {
          console.log(`${key}: ${foo_value}`);
          console.log("typeof : " + typeof foo_value);
          //if (typeof foo_value === "object" && foo_value !== null && (key=="obj_design" || key=="obj_domProperty") )  {
          //if (typeof foo_value === "object" && foo_value !== null && (key=="obj_design"))  {
          //if (typeof foo_value === "object" && foo_value !== null && (key.indexOf("obj_")===0))  {          
          switch(typeof foo_value){
            case "object":
              this.fn_enumerateObject(foo_value, "");
              break;
            case "array":
              foo_value.forEach(this.fn_debugArrayItem);
              break;
            default:
              //console.log(`${key}: ${foo_value}`);
              
          }        
      }
      console.groupEnd();
    }
    fn_iteratePropertyNames(obj){
      do Object.getOwnPropertyNames(obj).forEach(function(name) {
          console.log(name);
      });
      while(obj = Object.getPrototypeOf(obj));
    }

    fn_findInObject(obj_myObj, str_search){
      for (let [key, foo_value] of Object.entries(obj_myObj)) {
          console.log(`${key}: ${foo_value}`);
      }
    }

    fn_getUniquePrefix(str_name="my_"){
      let str_value=str_name+this.fn_getUnique(5);   
      return str_value.toLowerCase();
    }   

    fn_getUnique(length) {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);   
    
        result += characters.charAt(randomIndex);
      }
    
      return result;
    }

    fn_getUniqueId(str_value){
      let generator = new IDGenerator();
      return str_value +"_" + generator.generate();
    }
    fn_getRandom(number) {
      return Math.floor(Math.random() * (number+1));
    }

    fn_getRandomColor() {
      return 'rgb(' + this.fn_getRandom(255) + ',' + this.fn_getRandom(255) + ',' + this.fn_getRandom(255) + ')';
    }

    fn_flipOrientation(int_axis){
      if(int_axis==obj_const.int_axisHorizontal){return obj_const.int_axisVertical;}
      if(int_axis==obj_const.int_axisVertical){return obj_const.int_axisHorizontal;}
      return int_axis;

    }
    fn_toogleBool(bln_val){
      if(bln_val){return false;}
      else{return true;}
    }
    fn_flipBool(bln_val){
      return this.fn_toogleBool(bln_val);      
    }
    fn_timeDifference(startTime, endTime) {
      // Convert start and end times to Date objects
      var start = new Date(startTime);
      var end = new Date(endTime);
    
      // Calculate the difference in milliseconds
      var difference = end - start;
    
      // Return the difference in milliseconds
      return difference;
    }
    fn_millisecondsToSeconds(milliseconds) {
      // Divide the number of milliseconds by 1000 to convert it to seconds
      var seconds = milliseconds / 1000;
    
      // Round the result to 2 decimal places
      seconds = Math.round(seconds * 100) / 100;
    
      // Return the result
      return seconds;
    }

    fn_parseInt(int_value){
      if(!int_value){int_value=0;}                        
      return parseInt(int_value);              
    }
    fn_parseString(foo_val){      
      if(!foo_val){
        foo_val="";
      }
      return String(foo_val);
    }

    fn_parseBoolString(foo_val){  
      let bln_value=this.fn_parseBool(foo_val);
      if(bln_value){
        return "true";
      }
      return "false";
    }

    fn_isBool(foo_value) {
      return typeof foo_value === 'boolean';
    }
    
    fn_parseBool(foo_val){  

      switch(typeof(foo_val)){              
        case "number":
          switch(foo_val){      
            case 0:
              return false;                
            default:
              return true;
          }
        case undefined:
            return false;                         
        case "undefined":
            return false;                         
        case "boolean":
            return foo_val;                         
        case "string":
          switch(foo_val.toLowerCase()){      
            case "false":
              return false;                
            case "0":
              return false;        
            case "no":
              return false;        
            case "off":
              return false;
            case "true":
              return true;        
            case "1":
              return true;        
            case "yes":
              return true;        
            case "on":
              return true;                                   
            default:
              // other string e.g. "green"              
          }            
        default:                  
      }
      //return foo_val ? true : false;           
      return foo_val;           
    }
    fn_toggleBool(foo_val){  
      foo_val=this.fn_parseBool(foo_val);
      if(foo_val){return false;}
      return true;
    }

    getAllFuncs(toCheck) {
      var props = [];
      var obj = toCheck;
      do {
          props = props.concat(Object.getOwnPropertyNames(obj));
      } while (obj = Object.getPrototypeOf(obj));

      return props.sort().filter(function(e, i, arr) {
        if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
      });
    }

    fn_removeArrOfArrays(arr_first, arrOfArrays) {
      let str_value1, str_value2;
      let i, j;
      for (i=0; i<arr_first.length; i++) {
          str_value1=arr_first[i];

          for (j=0; j<arrOfArrays.length; j++) {
            str_value2=arrOfArrays[j][0];
            if(str_value1===str_value2){
              arrOfArrays.splice(j, 1);
            }
          }

      }
      return arrOfArrays;
  }

  fn_getNextMapItem(myMap, key) {
    const iterator = myMap.entries();
    let found = false;
    let nextValue;

    for (const [currentKey, currentValue] of iterator) {
        if (found) {
            nextValue = currentValue;
            break;
        }
        if (currentKey === key) {
            found = true;
        }
    }

    return nextValue;
  }

  

    fn_setMapItem(obj_map, foo_key, foo_value){
      //console.log("fn_setMapItem foo_key: " + foo_key);
      //*
      //console.log(foo_key);
      //console.log(foo_value);      
      obj_map.set(foo_key, foo_value);
      //*/
    }
    fn_getMapItem(obj_map, foo_key){
      return obj_map.get(foo_key);
    }   
    fn_deletetMapItem(obj_map, foo_key){
      //console.log("fn_deletetMapItem foo_key: " + foo_key);
      return obj_map.delete(foo_key);
    }   
    
    fn_debugMap(myMap){   
      console.log("START fn_debugMap");
      for (const [key, value] of myMap.entries()) {
          console.log(key, value);
        }
        console.log("END fn_debugMap");

    }   

    // Parameters:
    // code 								- (string) code you wish to format
    // stripWhiteSpaces			- (boolean) do you wish to remove multiple whitespaces coming after each other?
    // stripEmptyLines 			- (boolean) do you wish to remove empty lines?
    fn_formatCode(code, stripWhiteSpaces=true, stripEmptyLines=true) {
      //"use strict";
      var whitespace          = ' '.repeat(4);             // Default indenting 4 whitespaces
      var currentIndent       = 0;
      var char                = null;
      var nextChar            = null;


      var result = '';
      for(var pos=0; pos <= code.length; pos++) {
          char            = code.substr(pos, 1);
          nextChar        = code.substr(pos+1, 1);

          // If opening tag, add newline character and indention
          if(char === '<' && nextChar !== '/') {
              result += '\n' + whitespace.repeat(currentIndent);
              currentIndent++;
          }
          // if Closing tag, add newline and indention
          else if(char === '<' && nextChar === '/') {
              // If there're more closing tags than opening
              if(--currentIndent < 0) currentIndent = 0;
              result += '\n' + whitespace.repeat(currentIndent);
          }

          // remove multiple whitespaces
          else if(stripWhiteSpaces === true && char === ' ' && nextChar === ' ') char = '';
          // remove empty lines
          else if(stripEmptyLines === true && char === '\n' ) {
              //debugger;
              if(code.substr(pos, code.substr(pos).indexOf("<")).trim() === '' ) char = '';
          }

          result += char;
      }
      return result;
    }

    fn_quantifyRGB(rgb) {

      let [r, g, b] = rgb.match(/\d+/g).map(x => parseInt(x));
      return r+g+b;
    }    

    fn_domMoveElementToFront(elementToMove) {
    
      const container = elementToMove.parentNode;
  
      // Move the element to the front
      container.insertBefore(elementToMove, container.firstChild);
    }

    fn_getObjectProperty(obj_my, str_label){            

      if(obj_my[str_label]===undefined){
          str_label=str_label.toLowerCase();     
      }
      return obj_my[str_label];             
    }

    fn_formatString(str_my){
      if(!str_my){str_my="";}                  
      return str_my+="";
    }
    
    fn_interfaceReplaceSessionCodes(str_text){

      //check default is set correctly in the client system (not just 100!)

      let arr_needle=[                        
          "{MetaUserId}",
          "{MetaUserEmail}",
          "{MetaUserSystemId}",     
          "{MetaMoverSystemId}", 
          "{MetaMoverSystemName}", 
      ];
      let arr_replace=[            
        obj_userHome.MetaUserId,            
        obj_userHome.MetaUserEmail,            
        obj_userHome.MetaUserSystemId,      
        obj_userHome.MetaUserSystemId,      
        "["+obj_userHome.MetaUserEmail+"]",            
      ];
      
      for(var x = 0 ; x < arr_needle.length; x++){  
        str_text = str_text.replace(new RegExp(arr_needle[x], "g"), arr_replace[x])      
      }    
      str_text+="";
      return str_text;    
  }   

  fn_detectBrowser() {
    const userAgent = navigator.userAgent;
    //console.log("userAgent: " + userAgent);
    let browserName;

    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("rv:") > -1) {
        browserName = "Internet Explorer";
    } else if (userAgent.indexOf("OP") > -1) {
        browserName = "Opera";
    } else {
        browserName = "Unknown";
    }

    return browserName;
}

fn_isMobile() {
  return window.matchMedia("(max-width: 767px)").matches ? true : false;
}       
fn_parseList(str_json){                  
  if(!str_json){
    return {};
  }
  return JSON.parse(str_json);
}

        

    
}//END CLS

  //START SHARED GLOBAL SCOPE
  function IDGenerator() {

    this.length = 8;
    this.timestamp = +new Date;

    var _getRandomInt = function( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }

    this.generate = function() {
      var ts = this.timestamp.toString();
      var parts = ts.split( "" ).reverse();
      var id = "";

      for( var i = 0; i < this.length; i++ ) {
      var index = _getRandomInt( 0, parts.length - 1 );
      id += parts[index];
      }

      return id;
    }  
  }

  String.prototype.trimLeft = function(str_char) {
    if (str_char === undefined)
    str_char = "\s";  
  return this.replace(new RegExp("^" + str_char + "+"), "");
  };

  String.prototype.trimRight = function(str_char) {
    if (str_char === undefined)
    str_char = "\s";  
  return this.replace(new RegExp("" + str_char + "+$"), "");
  };
//END SHARED GLOBAL SCOPE


