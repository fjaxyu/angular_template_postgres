# angular-template
Angular-Template is a ready-to-use system for creating a quick [Angular](https://angularjs.org) application using [Node](https://nodejs.org), [Express](http://expressjs.com), and [MongoDB](https://www.mongodb.org) with an index page all configured to start building with Bootstrap right away.




## Quick Start
Simply download the files and, using terminal, navigate to the folder and use "[npm](https://www.npmjs.com) install" to add all of the necessary node modules and you're good to go. Once that has finished, enter "node server.js" and then using a web browser, navigate to "localhost:3000" and get started!




## Notes
**I do recommend you have some experience with Angular with tutorials**, or you may be lost here without a bit of proper training. You should also have experience with javascript, but this is also a great way to learn.
_I hope this helps speed up the time it takes to create new projects and makes sense to those with experience. Let me know how I can improve it!_

### Host
I use [Heroku](https://heroku.com) as a host for the applications as well as [MongoLab](https://mongolab.com) as controls for MongoDB. to connect to the database, get the link and input your name and password for the database and add it in the /routes/database.js file as the url. Both are free and you can host applications on heroku for free as well. Once you've created an application on heroku, add MongoLab as a service inside each app you want to use it with.

### Nodemon
You should also try out [nodemon](https://www.npmjs.com/package/nodemon) in place of the node command in terminal. It auto-restarts the server after changes have been made to any files that would affect it (mostly js files). That way you don't have to restart the server after each change. 

You can install nodemon with "npm install -g nodemon".




## Usage
### Folders
In order to keep clean code, make use of folders that categorize your content into logical sections inside /public/app/ folder. (e.g. Users, Blogposts, Products, etc.)

Use these folders to contain your Controllers, Services, and Directives that are related to each section. Each controller, service, and directive javascript page Must be added in section 1 of app.js and linked on the index.html as shown in the template.

### Controllers
Controllers are used as connectors to **pass information** from the service to the html page. Most data manipulation and calls should be done in a service and therefore little should be done inside controllers. Controllers are used to control large pages.

### Services
Services **make calls and transform data** from the database. Most of your data manipulation should be done here and any information returned in a controller from a service should be exactly as you need it, without any further changes. 

### Directives
Directives are used as **small templates** that can be used again and again in many different locations. Use these to create portions of HTML that are repeated on different pages.

### app.js
Use this file to control any Controllers, Services, Directives and any other dependency injections you may need.

#### Section 1
Any controllers, services, directives, and other dependencies you want to use in your application **must be included in this list**. All of these items in this list are _case-sensitive_, must be included in _quotes_ (single or double, it doesn't matter), _each line must end with a comma except for the very last_.
#### Section 2
This section controls some aspect of the login and I'm not sure if it's being used. Updates to come will probably remove this bit.
#### Section 3
This is the Route Provider. This controls what controllers and templates are used with which URL's. These items are _case sensitive_ as well. Do your best to follow the template. If you stay organized and put your routes into sections, then reading through will be much easier in the end.  
The last line in section 3, "$locationProvider.html5Mode(true)", turns the ugly URL used by Angular into a nice, normal-looking one. (from .com/#/home to .com/home)

### Components
The components folder will contain your templates to be used by the controllers. These components don't need header tags or body tags, but simply just html that will be loaded inside of the ng-view div on the index.html page. 

### index.html
This is where your static page will load the new information for each new link. In here you can control any static information that will appear on every page like a navbar or a footer. Don't type anything inside the ng-view div because it will be removed once Angular has loaded. It comes pre-loaded with Bootstrap.css and .js as well as Jquery and is also ready to go as a mobile friendly site as well.

#### Dynamic Headers
In each controller, simply set the $rootScope.pageTitle equal to whatever parameter it is that you want it to be and it will change automatically.