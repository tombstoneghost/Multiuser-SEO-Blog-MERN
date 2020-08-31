# Multi-User Blog Platform 
A Multi-User Blogging Platform which supports a number of features and is also SEO optimized, supports social logins, separate admin/user dashboards with their own authorized tasks like CRUD operations on Blogs, Categories and Tags.

**Stack:** MERN
**Reference:** [Udemy Course](https://www.udemy.com/course/react-node-nextjs-fullstack-multi-user-blogging-platform-with-seo/)
<br>
### The website has the following features: 

 - User Signup/Sign-in
 - Account Activation
 - Blog Search
 - Blog Categories and Tags
 - Search Engine Optimization
 - Server Side Rendering using NextJs
 - Blog Author Contact Form
 - Multiple User Authorization
 - Standard Contact Form
 - Related Blogs
 - Sending E-Mails using SendGrid
 - Google Login
 - User/Admin Dashboards
 - Forgot/Reset Passwords
 - CRUD operations on Blogs
 - Image Uploads
 - Rich Text Editor
 - DISQUS Commenting System
 - Node JS API
 
Upcoming Features:
 - Social Media Links
 - Improved UI

 ## Demo
 The Application will be hosted soon. 

## Installation

    git clone https://github.com/tombstoneghost/Multiuser-SEO-Blog-MERN
    cd Multiuser-SEO-Blog-MERN
    cd backend
    npm install
    cd ..
    cd frontend
    npm install

 
## Configuration
**Server:**
Create a file with name `.env` in the `backend folder` and add the following code. 

    NODE_ENV=development
    APP_NAME=SEOBLOG
    PORT=8000
    CLIENT_URL='http://localhost:3000'
    DATABASE='mongodb://localhost:27017/blog'
    DATABASE_ONLINE='LINK HERE'
    JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXX
    JWT_ACCOUNT_ACTIVATION=XXXXXXXXXXXXX
    SENDGRID_API_KEY=XXXXXXXXXXXXX
    EMAIL_TO=test@test.com
    EMAIL_FROM=no-reply@test.com
    JWT_RESET_PASSWORD=XXXXXXXXXXXXXXX
    GOOGLE_CLIENT_ID=XXXXXXXXXXXXXXx
    
**Front-End:**
Create a file with name `next.config.js` in the `frontend` folder and add the following. 

    module.exports = {
	    publicRuntimeConfig: {
		    APP_NAME:  'SEOBLOG',
		    API_DEVELOPMENT:'http://localhost:8000/api',
		    API_PRODUCTION:  '',
		    PRODUCTION:  false,
		    DOMAIN_DEVELOPMENT:  'http://localhost:3000',
		    DOMAIN_PRODUCTION:  '',
		    FB_APP_ID:  '',
		    DISQUS_SHORTNAME:  'XXXXXXXXXX',
		    DISQUS_URL:  'https://XXX.disqus.com/embed.js',
		    GOOGLE_CLIENT_ID='XXXXXXXXXXXXXXXXXXX'
	    }
	};

Now Create a file with name `config.js` in the same folder and add the following. 

    import  getConfig  from  'next/config';
    const {publicRuntimeConfig} = getConfig();
    export  const  API = publicRuntimeConfig.PRODUCTION ? '' : publicRuntimeConfig.API_DEVELOPMENT;
    export  const  APP_NAME = publicRuntimeConfig.APP_NAME;
    export  const  DOMAIN = publicRuntimeConfig.PRODUCTION ? publicRuntimeConfig.DOMAIN_PRODUCTION : publicRuntimeConfig.DOMAIN_DEVELOPMENT;
    export  const  FB_APP_ID = publicRuntimeConfig.FB_APP_ID;
    export  const  DISQUS_SHORTNAME = publicRuntimeConfig.DISQUS_SHORTNAME;
    export  const  GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;

## Note
If you find any bug in the code, kindly open an issue for the same.

