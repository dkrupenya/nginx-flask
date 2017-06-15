## Create docker image

docker build . -t nginx-flask

## Run docker image

docker run --rm -p 7777:80 nginx-flask

## Description
/app contains two independent parts:

/app/static - web app to login using facebook, this app use REST API calls to inform backend about user info and to retrive login history from database.
Don't forget to replace facebook key with your own.

/app/api - flask application which provide API for db calls
rename env.sample.ini to env.ini and fill it with own credentials for mongodb instance.

