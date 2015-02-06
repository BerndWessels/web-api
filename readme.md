## Web Solution Boilerplate Repositories

### Features

- Solution split in 3 independent Projects/Repositiories to give you the flexibility to host and connect them depending on you specific use cases and environments.
- Your own NodeJS OAuth2 Authorization Server.
- NodeJS API Resource Server with OAuth2 Authentication Integration.
- In-memory storage for development and Redis storage for production.
- Easy to integrate your own storage solution.
- AngularJS Single Page that can be hosted on a CDN.
- OAuth2 Authorization and API Access fully integrated in Client SPA.
- SPA derived from Angular-Fullstack with optimized Grunt Tasks for very convenient development.
- Optimized Application Structure with opinionated AngularJS implementation for better separation of concerns and better testability.
- Folder structure follows Page Hierarchy for better code discoverability.
- Automatic build of different Whitelabels.
- Automatic versioning, optimization and minification of distribution output.

### Overview

This is one of three repositories that make up a Web Solution Boilerplate.

Based on this boilerplate it is easy to start a AngularJS Single Page Website that can be hosted on a CDN. It gives you your own OAuth2 Authorization Server and an API Resource Server. Everything is already wired up and ready to go. That means that the SPA and the API are setup to use the Authentication Server. All you need to do is add your own User and Client management to it. Even though the SPA is supposed to be distributed via CDN, for a much more convenient development workflow it has its own local server and grunt tasks. This is all based on Yeoman's Angular Fullstack.

### Getting Started

#### Repositories

Simply fork and then clone the following repositories.

    web-auth
    web-api
    web-site

#### Prerequisites

Obviously you need to install NodeJS.

Next you want to install bower and grunt.

    npm install -g bower
    npm install -g grunt-cli

The Authorization and API Server both use Redis to store Access and Refresh Tokens. Fortunately Redis runs on Windows as well as on Linux and OSX. Just install it on your development machine and run it. Make sure to setup the connection to it properly in the config files.

    web-auth/server/config/index.js
    web-api/server/config/index.js

#### web-auth

Install all npm dependencies in the web-auth folder.

    cd web-auth
    npm install

Now you can start the Authorization Server.

    cd web-auth/server
    node app

#### web-api

Install all npm dependencies in the web-api folder.

    cd web-api
    npm install

Now you can start the API Server.

    cd web-api/server
    node app

#### web-site

Install all bower and npm dependencies in the web-site folder.

    cd web-site
    npm install
    bower install

On windows, especially in corporate environments you sometimes run into problems. Often it helps to clean the cache `npm cache clear`. Sometimes you just have to repeat the `npm install` command several times until there are no more dependencies missing. If you have trouble getting through your corporate proxy/firewall you can also try the following command:

    git config --global url."https://".insteadOf git://

The web-site project contains a folder for bower-components that are still under development and not yet checked into their own git repositories. To be able to use these components while you are developing them you need to link them into the bower components. To do this you have to go into each of the components folders, create a bower link and then register these components like this:

    cd web-site
    cd .\client\bower_components_under_development\web-assets
    bower link
    cd ..\..\..
    cd .\client\bower_components_under_development\web-styles
    bower link
    cd ..\..\..
    bower link web-assets
    bower link web-styles

Now there should be something like symlinks to these components within you `bower_components` folder.

#### Development Version

To work on the development version of the website you just run the serve grunt task for the whitelabel that you are working on.

    grunt serve-whitelabel1

This will build your website project, start a browser and will even refresh the browser whenever you make changes to the code.

#### Production Version

To work on the production version of the website you just run the serve grunt task for the distribution version.

    grunt serve:dist

This will build your website project, start a browser and will even refresh the browser whenever you make changes to the code. But since the distribution version is minified it will be very hard to debug it.

#### Distribution

Once you are ready to distribute your website you run the build grunt task for the whitelabel which you want to distribute.

    grunt build-whitelabel1

This will create the dist folder within the web-site folder. You can then take it and copy it to your CDN.

Obvioulsy you still have to distribute and run the Authentication and API Servers as well as Redis and your own dependencies.

### Yeoman Angular Fullstack

I derived the web-site from the fantastic Yeoman Angular Fullstack code. I then gave it my own structure and style. Especially the way I organize the Angular code and the addition of whitelabels is very important to me. The boilerplate that adds the authentication code is pretty small and can be extended or replaced by other ways of authentication if you want.

## Contribution

You are more then welome to report issues and help me improve this boilerplate solution. Just contact me and we will figure something out.