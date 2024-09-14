# Project
This project will focus on creating as complex architecture i can build i will build. (it will not be another clone).

What's complex ? 
- Verify `How much content is GPT generated ?`
- Check via NLP if this content already exist in our dataabase. 
    - the blog will go to testing/checking `queue system` (not just directly call API and get the result) 
- Every Blog Requires `Beta Approval` before going public.
    - Every member can request for *Became beta member*.
    - Request atleast  `5-10 Beta Member` approval for publishing blog.
- **BLOG WRITING EDITOR** (support `.md` files).
- `FORK` the blog. make you own version
- Supports Embedding `Image, GIFs`

Good Fetures to implement: 
-  Create session for `JWT` every request to server for security. 
- `Redis` for caching (fast access to databbase blogs)
    - Non redis commment section beacuse not needed at all
- CI/CD pipeline for development.
- Make the architecture to `Terraform`
- `Elastic Search` to search the blogs 
- Make it `SEO` optimized
