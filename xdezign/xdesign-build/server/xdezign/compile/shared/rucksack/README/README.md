--------------------
Configure Apache Webserver: Linux
--------------------
A.See VirtualHost File  example.com-le-ssl.conf
B.Configure Apache SSL certificate for wildcard domains
https://www.digitalocean.com/community/tutorials/how-to-create-let-s-encrypt-wildcard-certificates-with-certbot

--------------------
Configure Apache Webserver: Windows
--------------------
A. Create vhosts.conf entry for each App
e.g.
<VirtualHost *:80>
	ServerName upgrade.lokal-example.com
	DocumentRoot "D:\var\www\html\vm-xdesign\upgrade\xdesign-build"
</VirtualHost>
<VirtualHost *:80>
	ServerName login.lokal-example.com
	DocumentRoot "D:\var\www\html\vm-xdesign\login\xdesign-build"
</VirtualHost>
<VirtualHost *:80>
	ServerName desk.lokal-example.com
	DocumentRoot "D:\var\www\html\vm-xdesign\desk\xdesign-build"
</VirtualHost>
<VirtualHost *:80>
	ServerName xdesign.lokal-example.com
	DocumentRoot "D:\var\www\html\vm-xdesign\xdesign\xdesign-build"
</VirtualHost>

B. Add an entry to hosts, in system32/drivers/etc
127.0.0.1     upgrade.lokal-example.com
127.0.0.1     login.lokal-example.com
127.0.0.1     desk.lokal-example.com
127.0.0.1     xdesign.lokal-example.com

--------------------
Create a Folder vm-xdesign
--------------------
Navigate to your webroot 
Create a folder vm-xdesign

--------------------
Pull the "upgrade" repo 
--------------------
Naviage to vm-xdesign
Pull the "upgrade" repo 
e.g vm-xdesign/upgrade

--------------------
Create a file server-key.php
--------------------
Naviage to vm-xdesign/xdesign-build
Create a file server-key.php
Add your mysql username, password and sendgrid api key.
<?php
$AuthorizeSuperUser="mysqluser";
$AuthorizeSuperPass="mysqlpassword";
$SENDGRID_API_KEY="mysendgridapikey";

--------------------
Install the Login, Desk and Xdesign Apps, and any other Apps, as follows
--------------------

--------------------
Pull the App repo
--------------------
e.g.
Navigate to vm-xdesign
Pull the "lock" repo 
e.g. vm-xdesign/login

--------------------
Install the default Composer install 
--------------------
Locate any Composer Files and install
e.g.
sudo find . -maxdepth 5 -name composer.json -printf '%h\n' -execdir composer install \;

--------------------
Check for any upgrade actions
--------------------
A. CHECK for README_APPNAME.md 
B. NAVIGATE to http://upgrade.lokal-example.com subdomain and check for any upgrade options for your app