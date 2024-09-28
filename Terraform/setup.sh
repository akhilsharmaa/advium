#!/bin/bash
sudo apt-get update -y
sudo apt-get install nginx -y 
sudo apt install neofetch -y 
sudo systemctl start nginx
sudo systemctl enable nginx
echo "Hello World" > /var/www/html/index.html

# INTALLING PostgreSQL 
# sudo apt-get install -y gnupg curl  # Install prerequisites

# curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
#     sudo gpg -o /usr/share/keyrings/postgresql.gpg --dearmor
# echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt/ jammy-pgdg main" | \
#     sudo tee /etc/apt/sources.list.d/pgdg.list

# sudo apt-get update -y
# sudo apt-get install -y postgresql postgresql-contrib
# sudo systemctl start postgresql
# sudo systemctl enable postgresql

# # Adding the connection ports
# echo "listen_addresses = '*'"     | sudo tee -a /etc/postgresql/16/main/postgresql.conf 
#  echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf
# sudo systemctl restart postgresql  

# # Creating new user  
# sudo -u postgres  psql -c "CREATE USER akhilsharma  WITH PASSWORD 'akhilsharma';"


# Step 1: Update package manager
echo "Updating package manager..."
sudo apt update -y

# Step 2: Install Docker
echo "Installing Docker..."
sudo apt install docker.io -y

# Step 3: Start Docker service
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Step 4: Add user to Docker group to avoid needing sudo (this will take effect after logging out and back in)
echo "Adding 'ubuntu' user to Docker group..."
sudo usermod -aG docker ubuntu

# Step 5: Pull MongoDB Docker image (using sudo)
sudo docker run -d --name mongo-demo -e MONGO_INITDB_ROOT_USERNAME="mongoadmin" -e MONGO_INITDB_ROOT_PASSWORD="mongoadmin" -p 27017:27017 mongo:7.0