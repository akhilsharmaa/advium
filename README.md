## DETAILS :    
- **Blog writing editor** (support `.md` files).
	- Supports Embedding `Image, GIFs`
	- ` Drag & Drop Thumbnail`  image (reducing image size).
- `FORK` the blog. make you own version
- Each  **Public Blogs includes**: 
	-    `Title` ,  `Body` ,  `Thumbnail`, `DateOfPublish`,  
	-  `Upvotes`, `DownVotes`
	-  `Tags` (eg. Java/DSA...) *Maximum 10 Tags* : 
		-  (5 `Tags`) will be **auto generated**, by LLM Model. 
		-  (5 `Tags`) can be added by the user.
	-  `Comment Section` ,  `views` (only logined user views are counted)
	-  Author detail  `uid`, `email`, `username` 
	-  **version control** of the blogs [after every edit]  

#### Some Good Fetures to implement:
- `Redis` for caching (fast access to databbase blogs)
    - Non redis commment section beacuse not needed at all
    - Try to mamage the Session management using redis.
-  `DROP IMAGE & get public link`  of that image (it will be stored quickly to `S3 bucket` ) and will be publicaly available.
- `Queue System` for testing the blogs  `RabbitMQ`  
- `CI/CD` with `jenkins` or `Git Workflow` pipeline for development.
- Make the architecture to `Terraform` or make an `Ansible` setup. 
- `Elastic Search` to search the blogs and contents etc.
- Make it `SEO` optimized 
- `Text-To-Audio`  feature for the accessiblity 
 - Use `FAISS` or `Pinecone` to index millions of blogs.

### Security Considerations
- Create session management using `Redis` instead  of `JWT`.  provide every request to server for security. 

## Details 
- Frontend (Login/SignUp) completed.
- `Swagger UI` for all backend APIs. (better for getting all the api)
- Markdown editor completed (we can see the rended along with writing markown code)	
- **Terraform Architecture** setuped (automated below steps): 
    - Creating `EC2 Instance` - *captain-server*
    - Creating Security Group for EC2 Instance (confiured inbound traffic & outbound trafic)
    - setups `NGNIX` mapped to port:80 (nginx hello world accesable via http)
    - Installed  `Docker` 
	- Setups `MongoDB` in EC2 via *Docker*. 
- Setup `MongoDB` Atlas 

- Backend: 
	- **SingUp/SignIn** completed password hasing and salting done using  `bcrypt`. 
