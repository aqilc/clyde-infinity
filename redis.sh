#! /bin/sh

# Gets the result of the command 'redis-cli ping'
#res=$(redis-cli ping)

# Checks if the command "redis-cli ping" returned PONG(which means it's running)
if [ "$(redis-cli ping)" == "PONG" ] ; then
  echo "Redis is already running :D"

# If it didn't, start redis
else
  sysctl vm.overcommit_memory=1
  # sudo echo never > /sys/kernel/mm/transparent_hugepage/enabled
  sudo echo 511 > /proc/sys/net/core/somaxconn
  cd /home/aqil/redis-stable
  redis-server --daemonize yes
fi
