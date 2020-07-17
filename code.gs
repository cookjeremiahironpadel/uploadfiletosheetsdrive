
// new property service GLOBAL
var SCRIPT_PROP = PropertiesService.getScriptProperties();
// see: https://developers.google.com/apps-script/reference/properties/

var todaysdate = new Date();

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId()); //SCRIPT_PROP.getProperty("key")
    SCRIPT_PROP.setProperty("nameofsheet","Upload Files"); //SCRIPT_PROP.getProperty("nameofsheet")
    SCRIPT_PROP.setProperty("quartername","2020q4"); //SCRIPT_PROP.getProperty("quartername")
    SCRIPT_PROP.setProperty("expenses_folderid","1PLC5Voy2SBlg89WvDubtCG41A8n4iyM"); //SCRIPT_PROP.getProperty("expenses_folderid") 
    SCRIPT_PROP.setProperty("webappurl","https://script.google.com/macros/s/Abzdo7i5675wAAOPIm8R6XVvmwhUYJOapWKZzLA8YTvayJ_Plf5F32/exec"); //SCRIPT_PROP.getProperty("webappurl") 
    SCRIPT_PROP.setProperty("emailTo", "test@gmail.com"); //SCRIPT_PROP.getProperty("emailTo")
}




function doPost(e) {

  try {
    
       var data = e.parameter.fileContent;
       var filename = e.parameter.filename;
       var Invoice_Description = e.parameter.Invoice_Description;
       var Invoice_from_Company = e.parameter.Invoice_from_Company;
       var Invoice_Date = e.parameter.Invoice_Date;
       var fileextension = e.parameter.fileextensionfield;
       var newfilename = Invoice_Date+" "+filename;
       var result=uploadFileToGoogleDrive(data,newfilename,e); 
     
  } 
  catch(error) { // if error return this
    Logger.log(error);
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": error}))
          .setMimeType(ContentService.MimeType.JSON);
  }
}





/**
 * record_data inserts the data received from the html form submission
 * e is the data received from the POST
 */

function record_data(e,fileUrl) {
  try {
    
    //function to copy formats and formulas
    function copyFormatAndFormulas(rangeSource, rangeDestination) {
      rangeSource.copyTo(rangeDestination, {formatOnly: true});

      var formulas = rangeSource.getFormulasR1C1();
      for(var x in formulas) {
        for(var y in formulas[x]) {
          if(formulas[x][y] == "") continue;
          rangeDestination.getCell(parseInt(x) + 1, parseInt(y) + 1).setFormulaR1C1(formulas[x][y]);
        }
      }
    }
    
    var doc     = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    Logger.log(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheets()[0];
    /*var sheet   = doc.getSheetByName("responses"); // select the responses sheet*/
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    var lastRow = sheet.getLastRow(); // get last row
    var nextRow = sheet.getLastRow()+1; // get next row
    //var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'"); 
    var todaysdateformatrecorddata = Utilities.formatDate(todaysdate,"GMT+2","MM-dd-YYYY' 'HH:mm:ss")
    var row     = [ todaysdateformatrecorddata ]; // first element in the row should always be a timestamp
    // loop through the header columns
    Logger.log("are we getting here row" + row);
    for (var i = 1; i < headers.length; i++) { // start at 1 to avoid Timestamp column
      
      if(headers[i].length > 0 && headers[i] == "googledriveurl") {
        row.push(fileUrl); // add data to row
      }
      else if(headers[i].length > 0) {
        row.push(e.parameter[headers[i]]); // add data to row
      }
    }
     
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // copy down format and formulas
    var range_lastRow = sheet.getRange(lastRow, 1, 1, row.length);
    var range_nextRow = sheet.getRange(nextRow, 1, 1, row.length);
    copyFormatAndFormulas(range_lastRow, range_nextRow);
     
    
    
    Logger.log(row);
  }
  catch(error) {
    Logger.log(e);
  }
  finally {
    return;
  }

}

function uploadFileToGoogleDrive(data, newfilename,e) {
  try {
    
    
    folder = DriveApp.getFolderById(SCRIPT_PROP.getProperty("expenses_folderid"));
    
    
    var Invoice_Date = e.parameter.Invoice_Date;
    var dateStr = Invoice_Date;

    var year = +dateStr.substring(7, 11);
    var day = +dateStr.substring(3, 5);
    var monthnormal = +dateStr.substring(0, 2);
    

    var pubdate = new Date("20"+year, monthnormal - 1, day);
    var monthnumber = pubdate.getMonth();
    var monthnumber2digit = Utilities.formatDate(pubdate,"GMT+2","MM");
    var yearnumber = pubdate.getYear()+1900;
    var daynumber = pubdate.getDay();
    var formatteddayyear = Utilities.formatDate(pubdate,"GMT+2","dd-YYYY");
    
   var montharray = new Array();
        montharray[0] = "January-";
        montharray[1] = "February-";
        montharray[2] = "March-";
        montharray[3] = "April-";
        montharray[4] = "May-";
        montharray[5] = "June-";
        montharray[6] = "July-";
        montharray[7] = "August-";
        montharray[8] = "September-";
        montharray[9] = "October-";
        montharray[10] = "Novmbee-";
        montharray[11] = "December-";
    var monthname = montharray[pubdate.getMonth()];  
    
    var todaysdateformatupload = Utilities.formatDate(todaysdate,"GMT+2","HHmmss");
    var newupdatedfilename = monthnumber2digit+"-"+monthname+formatteddayyear+"-"+e.parameters.Invoice_from_Company+"-"+e.parameters.Invoice_Description+"-"+todaysdateformatupload+"."+e.parameter.fileextensionfield;
   
    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, newupdatedfilename);
        //var file = folder.createFolder([Invoice_from_Company, Invoice_Description].join("-")).createFile(blob);
        var file = folder.createFile(blob);
    
        var fileUrl=file.getUrl();
    
        
		//Generating Email Body
		var html =  
    '<body>' + 
      '<h2> New Invoice Uploaded '+SCRIPT_PROP.getProperty("nameofsheet")+" "+SCRIPT_PROP.getProperty("quartername")+'</h2>' +
        '<p>Company name : '+e.parameters.Invoice_from_Company+'</p>' +
        '<p>Invoice Description : '+e.parameters.Invoice_Description+'</p>' +
        '<p>Invoice Date : '+e.parameters.Invoice_Date+'</p>' +
        '<p>Old File Name  : '+e.parameters.filename+'</p>' +
        '<p>New Updated File Name  : '+newupdatedfilename+'</p>' +
        '<p><a href='+file.getUrl()+'>Invoice Link</a></p><br />' +
    '</body>';
	
    record_data(e,fileUrl);
	
    MailApp.sendEmail(SCRIPT_PROP.getProperty("emailTo"), "New Invoice Uploaded "+SCRIPT_PROP.getProperty("nameofsheet")+" "+SCRIPT_PROP.getProperty("quartername"),"New Invoice Uploaded "+SCRIPT_PROP.getProperty("nameofsheet")+" "+SCRIPT_PROP.getProperty("quartername"),{htmlBody:html});
        return file.getUrl();
  } catch (f) {
    return ContentService    // return json success results
          .createTextOutput(
            JSON.stringify({"result":"file upload failed",
                            "data": JSON.stringify(f) }))
          .setMimeType(ContentService.MimeType.JSON);
  }
}


function doGet(e){}


function onOpen(e){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var menuEntries = [];
  menuEntries.push({name: "Upload File "+SCRIPT_PROP.getProperty("quartername"), functionName: "doMenu1"});
  ss.addMenu("Functions "+SCRIPT_PROP.getProperty("quartername"), menuEntries);
}

function doMenu1(e) {
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var selection = activeSheet.getSelection();
  var cell = selection.getCurrentCell();
  //var html = HtmlService.createHtmlOutputFromFile('upload');
  //SpreadsheetApp.getUi().showModalDialog(html, 'Upload File '+SCRIPT_PROP.getProperty("quartername"));
  var tmp = HtmlService.createTemplateFromFile('upload');
  tmp.webappurl = SCRIPT_PROP.getProperty("webappurl");
  SpreadsheetApp.getUi().showModalDialog(tmp.evaluate(), 'Upload File '+SCRIPT_PROP.getProperty("quartername"));
  
}



