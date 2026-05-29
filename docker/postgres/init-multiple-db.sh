#!/bin/bash
# Creates the per-microservice databases when the PostgreSQL container starts
# for the first time. The POSTGRES_DB variable stays as "postgres" (the
# default administrative database); application databases are created here.
set -e

psql -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname   "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE dispatch_db_catalog;
  CREATE DATABASE dispatch_db_identity;
  CREATE DATABASE dispatch_db_notifications;
  CREATE DATABASE dispatch_db_orders;
  CREATE DATABASE dispatch_db_payments;
EOSQL

echo "Databases created: dispatch_db_catalog, dispatch_db_identity, dispatch_db_notifications, dispatch_db_orders, dispatch_db_payments"
