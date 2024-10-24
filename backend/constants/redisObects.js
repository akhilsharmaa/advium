function listOfBlogsByDateObject(skip){
    return `blog:SortedByDate:skipfirst:${skip}`;
}

function blogCardObject(id){
    return `blog:card:${id}`;
}

module.exports = {listOfBlogsByDateObject, blogCardObject};
