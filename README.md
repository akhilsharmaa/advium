# My Project
## Detailed Explaination: 
-  `LangChain` : Verify **"How much content is GPT generated ?"**  using LLM model. (*every blog should at least 60% human written* )
- `RabbitMQ`  for  queue management system - 
	- one blog testing at a time (reduce system failure by heavy load). 
	- **scalable** (we can easily increase the number of machines for LLM processing if load increases)
- Check via NLP if this similar content already exist in our database.
    - queue system for the the blog will go to testing `queue system` (not just directly call API and get the result). 
    - Udpate queue number using `WebSocket`  (eg. 5 in queue.. 4 in queue )
- Every Blog Requires `Beta Approval` before going public.
    - Every member can request for *Became beta member*.
    - Request predefined number of  `Beta Member` approval for publishing blog.
- **Blog writing editor** (support `.md` files).
	- - Supports Embedding `Image, GIFs`
- `FORK` the blog. make you own version
- Each  **Public Blogs includes**: 
	-    `Title` ,  `Body` ,  `Thumbnail`, `DateOfPublish`,  
	-  `Upvotes`, `DownVotes`
	- `"LLM generated Summary"`  30-50 words ai generated summary. 
	-  `Tags` (eg. Java/DSA...) *Maximum 10 Tags* : 
		-  (5 `Tags`) will be **auto generated**, by LLM Model. 
		-  (5 `Tags`) can be added by the user.
	-  `Comment Section` ,  `views` (only logined user views are counted)
	-  Author detail  `uid`, `email`, `username` 
	-  **version control** of the blogs [after every edit]  
	<details>
			<summary> Public Blog Body </summary>

	```
	{
		"author": "username", 
		"upvotes": 10, 
		"downvotes": 4, 
		"blogID": "1231123123123"
		"blog": [	# list of every blog version
					{
						"version" : 1, 
						"title": "This is something blog title..."'
						"body": "The body text in form of the marddown text."
						"summary" : "This is ai generated summary...", 
						"userDefinedTags" : ["tag1", "tag2", "tag3", "tag4", "tag5"]
						"generatedTags" : ["tag1", "tag2", "tag3", "tag4", "tag5"], 
						"dataOfPublish": "29-SEP-2024"
					}, 
					{
						"version" : 2, 
						"title": "This is new something blog title..."
						. 
						"dataOfPublish": "31-SEP-2024"
					}, 
				.
				.
		]
		"comments" : [
				{
						"username": "username"
						"timeOfPublish":  "2-OCT-2024"
						"body": "This is comment by a user"  
						"upvote": 10, 
						"downvote": 2
				}, 
				. 
		]
	}
	```
	</details>




#### Some Good Fetures to implement:
- `Redis` for caching (fast access to databbase blogs)
    - Non redis commment section beacuse not needed at all
    - Try to mamage the Session management using redis.
- `Queue System` for testing the blogs  `RabbitMQ`  
- Use `FAISS` or `Pinecone` to index millions of blogs.
- `Text-To-Audio`  feature for the accessiblity 
- `CI/CD` with `jenkins` or `Git Workflow` pipeline for development.
- Make the architecture to `Terraform` or make an `Ansible` setup. 
- `Elastic Search` to search the blogs and contents etc.
- Make it `SEO` optimized 

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