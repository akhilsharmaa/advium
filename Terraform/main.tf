resource "aws_instance" "captain-instance" {
  instance_type          = "t2.nano"
  ami                    = "ami-0a0e5d9c7acc336f1" 
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.nginx_sg.id]

  user_data = <<-EOF
                  #!/bin/bash
                  sudo apt-get update -y
                  sudo apt-get install nginx -y 
                  sudo apt install neofetch -y 
                  sudo systemctl start nginx
                  sudo systemctl enable nginx
                  echo "Hello World" > /var/www/html/index.html
                  
                  # INTALLING PostgreSQL 
                  sudo apt-get install -y gnupg curl  # Install prerequisites
                 
                  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
                      sudo gpg -o /usr/share/keyrings/postgresql.gpg --dearmor
                  echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt/ jammy-pgdg main" | \
                      sudo tee /etc/apt/sources.list.d/pgdg.list

                  sudo apt-get update -y
                  sudo apt-get install -y postgresql postgresql-contrib
                  sudo systemctl start postgresql
                  sudo systemctl enable postgresql

                  # Adding the connection ports
                  echo "listen_addresses = '*'"     | sudo tee -a /etc/postgresql/16/main/postgresql.conf 
                  echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf
                  sudo systemctl restart postgresql  

                  # Creating new user  
                  sudo -u postgres  psql -c "CREATE USER akhilsharma  WITH PASSWORD 'akhilsharma';"

              EOF
  tags = {
    Name = "captain-server"
  }
}

output "nginx_security_group_id" {
  value = aws_security_group.nginx_sg.id
}

output "ec2_public_ip" {
  value = aws_instance.captain-instance.public_ip
}