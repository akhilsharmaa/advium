# My Project
## Detailed Explaination?
-  `LongChain` : Verify **"How much content is GPT generated ?"**  using LLM model. (*every blog should at least 60% human written* )
- `RabbitMQ`  for  queue management system - 
	- one blog testing at a time (reduce system failure by heavy load). 
	- **scalable** (we can easily increase the number of machines for testing if load increases)
- Check via NLP if this similar content already exist in our database.
    - queue system for the the blog will go to testing `queue system` (not just directly call API and get the result). 
    - Udpate queue number using `WebSocket`  (eg. 5 in queue.. 4 in queue )
- Every Blog Requires `Beta Approval` before going public.
    - Every member can request for *Became beta member*.
    - Request predefined number of  `Beta Member` approval for publishing blog.
- **Blog writing editor** (support `.md` files).
	- - Supports Embedding `Image, GIFs`
- `FORK` the blog. make you own version
- Blogs includes : `Upvotes`, `DownVotes`, `Comment Section` , `Tags` (eg. Java/DSA/) `Views` (only logined user)

#### Some Good Fetures to implement:
- `Redis` for caching (fast access to databbase blogs)
    - Non redis commment section beacuse not needed at all
    - Try to mamage the Session management using redis.
- `Queue System` for testing the blogs  `RabbitMQ`  
- `Text-To-Audio`  feature for the accessiblity 
- `CI/CD` with `jenkins` or `Git Workflow` pipeline for development.
- Make the architecture to `Terraform` or make an `Ansible` setup. 
- `Elastic Search` to search the blogs and contents etc.
- Make it `SEO` optimized 

### Security Considerations
- Create session management using `Redis` instead  of `JWT`.  provide every request to server for security. 

## Details 
- Frontend (Login/SignUp) completed.
- Markdown editor completed (we can see the rended along with writing markown code)	
- **Terraform Architecture** setuped (automated below steps): 
    - Creating `EC2 Instance` - *captain-server*
    - Creating Security Group for EC2 Instance (confiured inbound traffic & outbound trafic)
    - setups `NGNIX` mapped to port:80 (nginx hello world accesable via http)
    - Setups `Postgres` in EC2. 
    - Creating NEW USER for accessing postgres databases. 