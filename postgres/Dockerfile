# Use the official PostgreSQL image as a base
FROM postgres:13

# Install envsubst from gettext-base package (required for environment variable substitution)
RUN apt-get update && apt-get install -y gettext && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*
# Copy custom configuration files
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Copy the init.sql template to the initialization directory
COPY init.sql.template /docker-entrypoint-initdb.d/


# # Command to substitute environment variables, print init.sql, and run the Postgres entrypoint script
CMD sh -c "envsubst < /docker-entrypoint-initdb.d/init.sql.template > /docker-entrypoint-initdb.d/init.sql && \
             docker-entrypoint.sh postgres"