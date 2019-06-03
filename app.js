var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizier = require("express-sanitizer");
 
 // app config   
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true }); 
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizier());
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);

// mongoose model config

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date , default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// restful routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log("Error !!");
        }else{
              res.render("index",{blogs: blogs}) ; 
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});
// CREATE ROUTE
app.post("/blogs",function(req,res){
    // create blog
      Blog.create(req.body.blog,function(err,newBlog){
          if(err){
              res.render("new");
          }else{
    //redirect to the index
             res.redirect("/blogs"); 
          }
      });
  
});

// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          res.redirect("/blogs");
      }else{
          res.render("show",{blog: foundBlog});
      }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
           res.render("edit",{blog: foundBlog}); 
        }
    });
});

// PUT ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
   // destroy blog
     Blog.findByIdAndRemove(req.params.id,function(err){
         if(err){
             res.redirect("/blogs");
         }else{
             res.redirect("/blogs");
         }
     });
   // redirect
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Your App Server Has Suceessfully started !!");
});