#! /bin/sh

sysctl vm.overcommit_memory=1
sudo echo never > /sys/kernel/mm/transparent_hugepage/enabled
sudo echo 511 > /proc/sys/net/core/somaxconn
cd ../../../../../../usr/src/redis-stable
redis-server