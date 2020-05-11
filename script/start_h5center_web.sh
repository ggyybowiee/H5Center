#!/bin/bash
/opt/wisecloud/h5center/h5center_web/nginx/sbin/nginx -c /opt/wisecloud/h5center/h5center_web/nginx/conf/nginx.conf -p /opt/wisecloud/h5center/h5center_web/nginx/
ps aux | grep /opt/wisecloud/h5center/h5center_web/nginx/sbin/nginx
exit 0
