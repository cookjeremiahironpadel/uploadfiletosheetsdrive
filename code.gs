//MAKE SURE TO UPDATE THE EMAIL AND ALSO YOUR SHEET ID AND ALSO MAKE A FOLDER ON DRIVE CALLED Demo
//MAKE SURE YOU PUBLISH THIS AS A WEB APP AND GIVE ANYONONE ANONYMOUS CAN ACCESS APP
//TAKE YOUR UNIQUE WEBAPP URL AND MAKE SURE YOU PUT IT IN 2 PLACES WHERE I LEFT A SPACE FOR IT IN THE upload.html 

var emailTo= "somethinghere@gmail.com"

function doPost(e) {

  try {
    var data = e.parameter.fileContent;
    var filename = e.parameter.filename;
    var email = e.parameter.email;
    var name = e.parameter.name;
    var result=uploadFileToGoogleDrive(data,filename,name,email,e);
    /*return ContentService    // return json success results
          .createTextOutput(
            JSON.stringify({"result":"success",
                            "data": JSON.stringify(result) }))
          .setMimeType(ContentService.MimeType.JSON);*/
  } catch(error) { // if error return this
    Logger.log(error);
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": error}))
          .setMimeType(ContentService.MimeType.JSON);
  }
}

// new property service GLOBAL
var SCRIPT_PROP = PropertiesService.getScriptProperties();
// see: https://developers.google.com/apps-script/reference/properties/

/**
 * select the sheet
 */
function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
 
}




/**
 * record_data inserts the data received from the html form submission
 * e is the data received from the POST
 */
 
function record_data(e,fileUrl) {
  try {
    /*var doc     = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));*/
    var doc     = SpreadsheetApp.openById("PUT YOUR GOOGLE SHEETS SHEET ID HERE FOR RECORDING");
    var sheet = doc.getSheets()[0];
    
    /*var sheet   = doc.getSheetByName("responses"); // select the responses sheet, MAKE SURE YOU HAVE A SHEET NAMED responses*/
    Logger.log("hello");
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    var nextRow = sheet.getLastRow()+1; // get next row
    var row     = [ new Date() ]; // first element in the row should always be a timestamp
    // loop through the header columns
    Logger.log("are we getting here row" + row);
    for (var i = 1; i < headers.length; i++) { // start at 1 to avoid Timestamp column
      
      if(headers[i].length > 0 && headers[i] == "resume") {
        row.push(fileUrl); // add data to row
      }
      else if(headers[i].length > 0) {
        row.push(e.parameter[headers[i]]); // add data to row
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    Logger.log(row);
  }
  catch(error) {
    Logger.log(e);
  }
  finally {
    return;
  }

}

function uploadFileToGoogleDrive(data, file, name, email,e) {
  try {
    var dropbox = "Demo"; //Make a folder called Demo if you don't have one already
    var folder, folders = DriveApp.getFoldersByName(dropbox);
 
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
   
    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, file);
        var file = folder.createFolder([name, email].join("-")).createFile(blob);
    
        var fileUrl=file.getUrl();
        
		//Generating Email Body
		var html =  
    '<body>' + 
      '<h2> New Job Application </h2>' +
        '<p>Name : '+e.parameters.name+'</p>' +
        '<p>Email : '+e.parameters.email+'</p>' +
        '<p>Contact : '+e.parameters.contact+'</p>' +
        '<p>Skill Sets : '+e.parameters.skillsets+'</p>' +
        '<p>LinkedIn Url : '+e.parameters.linkedinUrl+'</p>' +
        '<p>File Name  : '+e.parameters.filename+'</p>' +
        '<p><a href='+file.getUrl()+'>Resume Link</a></p><br />' +
    '</body>';
	
    record_data(e,fileUrl);
	
    MailApp.sendEmail(emailTo, "New Job Application Recieved","New Job Application Request Recieved",{htmlBody:html});
        return file.getUrl();
  } catch (f) {
    return ContentService    // return json success results
          .createTextOutput(
            JSON.stringify({"result":"file upload failed",
                            "data": JSON.stringify(f) }))
          .setMimeType(ContentService.MimeType.JSON);
  }
}

function onOpen(e){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var menuEntries = [];
  menuEntries.push({name: "File", functionName: "doGet"});
  ss.addMenu("Attach", menuEntries);
}

function doGet(e) {
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var selection = activeSheet.getSelection();
  var cell = selection.getCurrentCell();
  var html = HtmlService.createHtmlOutputFromFile('upload');
  SpreadsheetApp.getUi().showModalDialog(html, 'Upload File');
 
  
}
