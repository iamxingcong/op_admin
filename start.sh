#!/bin/bash

# 加载123平台环境文件
source /etc/profile

# 将nginx监听端口写入
cat > /usr/local/openresty/nginx/conf/vhosts.d/big.conf << EOF
server {
    listen `echo $main_port`;
    root /usr/local/application/bin/build;
    charset utf-8;
    access_log /usr/local/application/log/big_access.log;
    error_log  /usr/local/application/log/big_error.log warn;

    set \$rip "0.0.0.0";
    set \$proto "http";
	
    location / {
        index index.html;
    }
}
EOF

# 创建几个目录
[ ! -d /data/log/nginx/ ] && mkdir /data/log/nginx/

# 启动服务 
sudo nginx

# 打个日志
echo `date`' [start]' >> /usr/local/app/app.log
