# uploadfiletosheetsdrive
From within google sheets, open a drop down menu so you can upload an invoice for example.  The invoice will then be stored in google drive and the google drive link will be put into your spreadsheet, along with the invoice date and a description.  Your file will be renamed to include the date of the invoice and the company of the invoice.
Also an email is sent with the form and file info attached.

Uses google apps script and requires that you go into scripts editor on google sheets and deploy as webapp.

This is a bit hackjob but it does everything I want. 

I started with the base code that was found on tihs blog.  It also has a good video that explains the basics of publishing your code as a web app.  This is required for this to work.

It is important that you use your unique url when you publish as webapp and also your unique google folder id and your unique email .

The video from paragyte.com explains all this.
https://www.youtube.com/watch?v=_H6jRmcSrJo&feature=emb_logo

https://www.paragyte.com/blog/upload-file-to-google-drive-and-insert-data-into-spreadsheet-using-google-apps-script

Reply here if you need help.

Hope this is useful to someone.  It will save me some steps when I upload receipts and invoices to my quarterly accounting spreadsheet for my small business.


Steps to Install:
1) name your project
2) update your main code.gs file to be the same as mine
3) create and make your upload.html the same as mine
4) save and then after then choose publish, deploy as web app (this will give you a custom url that you need to copy and paste into the right place in the setup subroutine)
5) edit your code.gs (the setup subroutine) to put in your webapp url.  Also put in your google drive desitination folder folderid.  Also put in your email address, this only works if it is the gmail email address that you are logged in as.  Optionally you can change some other variables..  I have a name setup for the quarter and the year because I make a new spreadsheet for each quarter of the year.
6) save the code.gs
7) IMPORTANT.You must now run the setup subroutine 1 time.  This will hardcode all your global variables. There is a little dropdown menu next to the debug icon, you must choose the dropdown to pick what function you want to run.  Choose setup and then press the play button (the triangle).  This will run the setup routine and set the global variables.  you will need to do this each time you change any global variables.  Go to file, project properties, and choose script properties.  here you can see that all your script properties have been set and are correct.  without these script properties set, nothing will work.

8) Also I think you have to go through and give permission to the app if you havent already.  Watch this video to learn how. https://www.youtube.com/watch?v=_5k10maGtek
9) deploy as web app one more time and make sure for the version you press "New", this is very important anytime you make a change.
10) go to your spreadsheet and refresh the entire page in your browser.  Now you should get a dropdown menu called Functions 2020 q4 or something like that.
11) IMPORTANT you need to setup your spreadsheet with the first row that has column names exactly like the code is looking for. It doesn't matter what order you put things in except the A1 must be a column for your timestamp.  Everything else you can put the column names wherever you want but the name of the columns must be exactly as the code.
Mine are like this, and yes it is case sensitive: 
Upload Time Stamp	
Invoice_Date	
Invoice_from_Company	
Invoice_Description	
googledriveurl
12) set the column format for the time stamp column and the Invoice_Date column to date format in google sheets.
13)Now you can go to the new drop down menu and put in your data: company name, invoice name, invoice date, choose your file and SUBMIT.

This should put your file in google drive and create a new row in your spreadsheet.

The row formatting is copied from the previous row, so if the first row looks bad, format it how you like and then the next time you upload a file your next row will be formatted exactly the same as your previous row.

Have fun, let me know if you have problems.

Jeremiah
