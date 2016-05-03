#!/usr/bin/env bash

# app requirements
# sudo apt-get install -y python python-pip python-virtualenv python-dev

# sudo apt-get install -y postgresql-9.3 postgresql-9.3-postgis-2.1 postgresql-client-9.3

# sudo apt-get -y nginx

# required by psycopg2
# sudo apt-get -y install libpq-dev

# required by cGPolyEncode
# sudo apt-get -y install g++

# required by shapely
# sudo apt-get -y install libgeos-dev

# wkhtml libraries for converting pdf
# sudo apt-get install -y openssl build-essential xorg libssl-dev
# wget http://wkhtmltopdf.googlecode.com/files/wkhtmltopdf-0.10.0_rc2-static-amd64.tar.bz2
# tar xvjf wkhtmltopdf-0.10.0_rc2-static-amd64.tar.bz2
# sudo chown root:root wkhtmltopdf-amd64
# sudo mv wkhtmltopdf-amd64 /usr/bin/wkhtmltopdf
# sudo apt-get install libmagickwand-dev

# MS Fonts for wkhtml2pdf used fonts
# sudo apt-get install ttf-mscorefonts-installer

# create a virtual env to install libraries
virtualenv --no-site-packages venv

# enable virtual env
source venv/bin/activate

# install all requirements to virtual env
pip install -r requirements.txt
