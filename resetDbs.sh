#!/bin/bash

set -e

docker exec -i uni-calendar_db_1 psql -U postgres -d unicalendar_db < db/init.sql
docker exec -i uni-calendar_notification_telegram_db_1 psql -U postgres -d notification_telegram_db < notification-telegram-db/init.sql
docker exec -i uni-calendar_unibz_gateway_cache_db_1 psql -U postgres -d unibz_gateway_cache_db < unibz-gateway-cache-db/init.sql
