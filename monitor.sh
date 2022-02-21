#!/bin/bash

num=`ps -ef|grep nginx|grep -v grep|wc -l`

echo "`date` the num of nginx is $num">> /usr/local/app/app.log
if [ $num -lt 1 ];then
    nginx
    exit 20
fi