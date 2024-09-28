Create new Access Token of AWS : 
`Login > Security credentials > Create Access keys` 


1. Add **terraform.tfvars** 
```aws_access_key="AK12OPRTPL7Msd4FE6"
aws_secret_key="xvzzxcvsfE/fsR1WBYwM2+vhQev2m+mO" # Replace with actual value 
key_name="captain-server-key" # Replace with actual value 
region="us-east-1" 
``` 

1. Run the command to initialize 
`terraform init -backend-config="access_key=<Access key ID>" -backend-config="secret_key=<Secret Key>" `

3. Run Apply
```
terraform apply
```