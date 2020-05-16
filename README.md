# uploadfiletosheetsdrive
Upload a file from an outside web form or from a form that you can access from a google sheets menu.  
The file then goes to google drive and a link to the drive file is posted in your sheet on next available row.  
Also an email is sent with the form and file info attached.

I have edited 2 pieces of code together from other people that allow you to do this. I mention them below.  
I then edited it to get rid of some errors.  I really learned a lot by watching the video from paragyte.com below.  
I used a ton of his code.  Just had to tidy up the upload.html to work from within a google sheets drop down menu iframe. 
That was the hardest part for me since I am not a developer.  Just hacked this best I could.

My code is on github here:
https://github.com/cookjeremiahironpadel/uploadfiletosheetsdrive/tree/master

The main part is from here. This has a great youtube video you can watch.

https://www.paragyte.com/blog/upload-file-to-google-drive-and-insert-data-into-spreadsheet-using-google-apps-script

And then took some snippets from here as well, this gave me some additional code in the script that allows me to launch the form from within a drop down menu in sheets.

https://blackstormdesign.com/article/how-to-upload-a-file-to-google-drive-through-google-sheets/

Then I had to figure out how to launch the form action in a hidden iframe and write a progress bar.

This is a total hackjob but it does everything I want.  I don't really need the email part but that is easy to comment out.

I will posted files on the github link above.  This will give you the gist but you should still watch the paragyte video.  I still have lots of work to do but after 2 days of struggling, glad to have something going that works.  It shouldn't have been so hard.

I can start in google sheets, click the new attach menu and choose file and then fill out the form and attach my file and my results go into drive and the link from drive gets copied into my excel along with the other fields from the form that I may also want to put on that spredsheet row.  Works great.  It also sends me an email. 

This was originally made as a form accepting resumes on the public web but that's not what I will be using it for.  For me its to keep track of my receipts and vendor invoices.

You will need to make sure you deploy as web app and update all the code with your specific webapp link and also you will need to put in your own google sheets id for your sheet .  It will connect to your default google drive account and create a folder called Demo for the uploads.  It makes lots of subfolders too, you can edit this out so it doesn't make the individual subfolders.  I'm just lazy right now, I'll edit that part later.

When you publish make sure you give access to "anyone, even anonymous".  It will be pretty hard for people to find your specific link unless you give it to them.

Your unique code will look something like this when you publish the app.
https://script.google.com/macros/s/AKfycbyY518NvXWEtWORF79revLkLN2Ev2yxVayYD8gw8J-7jcK4P-c/exec

its important that you use your unique id.

The video from paragyte.com explains all this.
https://www.youtube.com/watch?v=_H6jRmcSrJo&feature=emb_logo

https://www.paragyte.com/blog/upload-file-to-google-drive-and-insert-data-into-spreadsheet-using-google-apps-script

My code is on github here:
https://github.com/cookjeremiahironpadel/uploadfiletosheetsdrive/tree/master

Here is a picture of the form and a picture of the attach drop down menu.

Oh yeah,

You need to put in the ID of your google sheet that you want it to write to in the code.gs.  You don't have to hard code it but I hardcoded the sheet ID anyway just for debug.

It just uses the google drive associated with your account that you choose when you give it access.

It is best to run the app once from within the script editor even though it will fail.  But at least it will give you the prompts you need to give permission to your google account.

Reply here if you need help.

Hope this is useful to someone.  It will save me some steps when I upload receipts and invoices to my quarterly accounting spreadsheet for my small business.

