# My Project

What's complex ?
- Verify **"How much content is GPT generated ?"**  using LLM model. `LongChain`
- Check via NLP if this similar content already exist in our dataabase.
    - the blog will go to testing `queue system` (not just directly call API and get the result). 
    - Udpate queue number using `WebSocket`  (eg. 5 in queue.. 4 in queue )
- Every Blog Requires `Beta Approval` before going public.
    - Every member can request for *Became beta member*.
    - Request predefined number of  `Beta Member` approval for publishing blog.
- **BLOG WRITING EDITOR** (support `.md` files).
- `FORK` the blog. make you own version
- Supports Embedding `Image, GIFs`
- Blogs includes : `Upvotes`, `DownVotes`, `Comment Section` , `Tags` (eg. Java/DSA/) `Views` (only logined user)

#### Some Good Fetures to implement:
- `Redis` for caching (fast access to databbase blogs)
    - Non redis commment section beacuse not needed at all
    - Try to mamage the Session management using redis.
- `Queue System` for testing the blogs. 
- `Text-To-Audio`  feature for the accessiblity 
- `CI/CD` with `jenkins` or `Git Workflow` pipeline for development.
- Make the architecture to `Terraform` or make an `Ansible` setup. 
- `Elastic Search` to search the blogs and contents etc.
- Make it `SEO` optimized 

### Security Considerations

- Create session management using `Redis` instead  of `JWT`.  provide every request to server for security. 

* * *
## Details
- Frontend (Login/SignUp) completed.
- Markdown editor completed (we can see the rended along with writing markown code)	
	