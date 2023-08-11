# FROM node:18.16.1
FROM node:latest

# Change the default shell to Bash
SHELL [ "/bin/bash" , "-c" ]

# Install Pip, Python Tools & Packages
RUN DEBIAN_FRONTEND=noninteractive apt update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y gosu software-properties-common

# Create directories to bind mount files from host
RUN mkdir -p /app

# Set up the Dockerfile entrypoint
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
