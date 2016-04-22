#!/usr/bin/env bash

sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/lile
sudo rm /etc/nginx/sites-enabled/lile
sudo cp conf/local/nginx.conf /etc/nginx/sites-available/lile
sudo ln -s /etc/nginx/sites-available/lile /etc/nginx/sites-enabled/lile
sudo /etc/init.d/nginx reload
