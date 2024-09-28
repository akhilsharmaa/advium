resource "aws_instance" "captain-instance" {
  instance_type          = "t2.small"
  ami                    = "ami-0a0e5d9c7acc336f1" 
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.nginx_sg.id]

  user_data = file("${path.module}/setup.sh")

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