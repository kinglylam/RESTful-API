const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app =express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/kodecampDB");

const KodecampSchema ={
     name: String,
     age: Number,
     message: String,
     date: {
         type: Date,
         default: Date.now
     }
};

const Kodecamp = mongoose.model("Kodecamp",KodecampSchema);


app.route("/kodecamps")

.get(function(req, res){
    Kodecamp.find(function(err, foundPosts){
        if(!err){
            res.send(foundPosts)
        } else{
            res.send(err);
        }
    })
})

.post(function(req, res){
     const newKodecamp = new Kodecamp({
         name:req.body.name,
        age:req.body.age,
    message:req.body.message
});
newKodecamp.save(function(err){
    if(!err){
        res.send("successfully posted")
    } else{
        res.send(err);
    }
});
});
 

app.route("/Kodecamps/:kodecampName")

.get(function(req, res){

    Kodecamp.findOne({name:req.params.kodecampName}, function(err, foundPost){
        if(foundPost) {
            res.send(foundPost)
        } else {
            res.send("No post matching that name was found")
        }
    });
})


.patch(function(req, res){
    Kodecamp.updateOne(
        {name: req.params.kodecampName},
        {$set: {message:req.body.message},
    $currentDate: {lastModified: true}
},
        function(err) {
            if(!err){
                res.send("successfully updated post")
            } else {
                res.send(err)
            }
        }
    );
});




app.listen(3000, function(){
    console.log("server is running on port 3000");
});