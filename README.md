##Orbweaver  
This the code for my website at ![Orbweaver Developments](http://www.orbweaverdev.com)  

The site uses nGinx to serve the main page and assets and node to serve ajax requests.  
* copy the contents of the `toNginx` folder in `/var/www/orbweaver` except for `orbweaver_nGinx`
* copy the `orbweaver_nGinx` file to your `sites_enabled` folder in the nGinx configuration.
* to start: node app 81