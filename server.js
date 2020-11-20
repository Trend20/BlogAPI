const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// initialize express
const app = express();


// use the middewares
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());


// connect to the database
mongoose.connect('mongodb://localhost:27017/blog',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true, 
});

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

    // GET /api/post
    find: async(req, res, next) =>{
        try{
            const posts = await postService.find({...req.query});
            res.json(posts);
        }catch(error){
            error.msg = 'failed to retrieve post';
            next(error);
        }
    },

    // POST /api/posts
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

// create express routes
const router = express.Router();

// get route
router.get('/posts', postController.find);

// post route
router.post('/posts', postController.save);

app.use('/api', router);


// handle  request when a url path is not found
const notFound = (req, res, next) =>{
    res.status(404);
    res.json({
        status: 404,
        error: 'not found'
    });
};

// handle an error if occured in the controller
const handleError = (error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
      message: error.message || "failed: not known error",
      msg: error.msg,
      stack: error.stack,
    });
  };

  app.use(notFound);
  app.use(handleError);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, (err) =>{
      if(err) console.log(err);
      else console.log(`Server running on port ${PORT}`);
  });