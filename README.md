# angular-template
Angular-Template is a ready-to-use system for creating a quick [Angular](https://angularjs.org) application using [Node](https://nodejs.org), [Express](http://expressjs.com), and [Postgres](https://www.postgresql.org) with an index page all configured to start building with Bootstrap right away.




## Quick Start
Simply download the files and, using terminal, navigate to the folder and use "[npm](https://www.npmjs.com) install" to add all of the necessary node modules, then add your postgres database to the pgDatabase.js and newdatabase.js files found in the routes folder, then run "node create.js" (this will create the tables for users, feedback, logs, and admins), and you're good to go. Once that has finished, enter "node server.js" and then using a web browser, navigate to "localhost:3000" and get started!

##Current Features
[Amazon S3](https://aws.amazon.com/s3/) should be fairly easy to set up and store images.

[Bluebird](http://bluebirdjs.com/docs/getting-started.html) promises can be used to create good flows through the routes.

[BCrypt](https://codahale.com/how-to-safely-store-a-password/) has been implemented to store user's passwords. It's an incredibly safe and strong password storage system to prevent anyone from accessing user's private passwords.

[JSHint](http://jshint.com) is used to ensure users can enforce coding standards. Two separate files have been used to enforce two types of standards in two sections. To configure these update the .jshintrc and jshintrc3 files. the latter regulates the routes/ folder and the first checks the public/app/ folder.



## Notes
**I do recommend you have some experience with Angular**, or you may be lost here without a bit of proper training. You should also have experience with javascript, but this is also a great way to learn.
_I hope this helps speed up the time it takes to create new projects and makes sense to those with experience. Let me know how I can improve it!_

### Hosting
I use [Heroku](https://heroku.com) as a host for the applications as well. When you use Heroku for hosting your postgres database as well, you'll need to include "?ssl=true" at the end of your database URL when you add it to the two files in the routes folder.

### Postgres Database Manager
I use [DBeaver](http://dbeaver.jkiss.org) to manage my databases. It's a great open-source program that's available on Mac and Windows.

### Nodemon
You should also try out [nodemon](https://www.npmjs.com/package/nodemon) in place of the node command in terminal. It auto-restarts the server after changes have been made to any files that would affect it (mostly js files). That way you don't have to restart the server after each change. 

You can install nodemon with "npm install -g nodemon".




## Usage
### Folders
In order to keep the code clean and organized, I've categorized the files into "Directives", "Services", "Modules", and "Views". This is great if you have a large application with a number of different sections. In the views, I keep the controllers and corresponding html templates. Keep Services, Modules, and Directives separate.

### Controllers
Controllers are used as connectors to **pass information** from the service to the html page. Most data manipulation and calls should be done in a service and therefore little should be done inside controllers. Controllers are used to control large pages.

### Services
Services **make calls and transform data** from the database. Most of your data manipulation should be done here and any information returned in a controller from a service should be exactly as you need it, without any further changes. 

### Directives
Directives are used as **small templates** that can be used again and again in many different locations. Use these to create portions of HTML that are repeated on different pages.

### app.js
Use this file to control any Controllers, Services, Directives and any other dependency injections you may need.

### Components
The components folder will contain your templates and corresponding controllers. These components don't need header tags or body tags, but simply just html that will be loaded inside of the ng-view div on the index.html page. 

### index.html
This is where your static page will load the new information for each new link. In here you can control any static information that will appear on every page like a navbar or a footer. Don't type anything inside the ng-view div because it will be removed once Angular has loaded. We've included a lot of extra features to make starting a new application fast and easy. Creating new controllers and services in their own files must be listed on the index page in order to load properly.

#### Utilities Service
Check the UtilitiesService.js file to find some functions that may help in reducing the number of re-useable functions found through the app.
