const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/blog');

// create a schema to handle post
const postSchema = new mongoose.Schema({
    title:{type: String, required: true},
    body:{ type: String, required: true},
},
{timestamps: true}
);


// create a post model from the postSchema
const Post = mongoose.model('post', postSchema);


// SERVICES
// create post services to handle finding and saving post data
const postService = {
    find:() => postSchema.find({}),
    save: async (postData) =>{
         const post = new Post ({...postData});
         await post.save();
         return post;
    }
}


// CONTROLLERS
// create postController to handle the finding and saving posts

const postController = {
    find: async(req, res, next) =>{
        try{
            const posts = await postService.find({...req.query});
            res.json(posts);
        }catch(error){
            error.msg = 'failed to retrieve post';
            next(error);
        }
    },

    save: async(req, res, next) =>{
        try{
            const post = await postService.save(req. body);
            res.json(post);
        }catch(error){
            error.msg = 'failed to create post';
            next(error);
        }
    },
};