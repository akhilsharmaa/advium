resource "aws_instance" "captain-instance" {
  instance_type          = "t3.nano"
  ami                    = "ami-0e86e20dae9224db8" 
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.nginx_sg.id]

  user_data = <<-EOF
                  #!/bin/bash
                  sudo apt-get update -y
                  sudo apt-get install nginx -y 
                  sudo systemctl start nginx
                  sudo systemctl enable nginx
                  echo "Hello World" > /var/www/html/index.html
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