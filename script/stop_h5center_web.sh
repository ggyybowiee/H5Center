#!/bin/bash
NGINX_PID=`ps aux | grep /opt/wisecloud/h5center/h5center_web/nginx/conf/nginx.conf | grep -v "grep" |  awk '{print $2}'`
#echo "$NGINX_PID"
kill -9 -$NGINX_PID
ps aux | grep /opt/wisecloud/h5center/h5center_web/nginx/sbin/nginx
exit 0
