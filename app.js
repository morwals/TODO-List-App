require('dotenv').config();
const express =require("express");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const app =express();
const _ =require("lodash");


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var admin=process.env.USER;
var pass=process.env.PASS;

mongoose.connect("mongodb+srv://admin-"+admin+":"+pass+"@cluster0.quz7a.mongodb.net/todolistDB").then(data=>{
    console.log("db connected")
}).catch(err=>{
    console.log("error in db");
})

// mongoose.connect("mongodb://localhost:27017/todolistDB").then(()=>console.log("db connected"));


const itemSchema=new mongoose.Schema({
    name:String   
});

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"Welcome to todolist !! "
});

const item2=new Item({
    name:"Hit  +  to add a new item "
});


let items=[item1,item2];


app.get("/",function(req,res){
    
    Item.find({},function(err,founditems){
        
        if(founditems.length===0){
            Item.insertMany(items,function(err){
        if(err){
            console.log("error here");
        }else{
            console.log("success");
        }
            });

            res.redirect("/");
        }else{
        res.render("list",{heading: "MORWAL", newitem: founditems});
        }
    });
    
});



app.post("/",function(req,res){
    
      const itemname=req.body.additem;
      const listName=req.body.btn;

      const i=new Item({
          name: itemname
      });

     
        i.save();
        res.redirect("/");
      }
);

app.post("/delete",function(req,res){
    const id=req.body.delete;

        Item.findByIdAndRemove({_id:id},function(err){
            if(err){
                console.log("error");
            }else{
                console.log("remove success");
                res.redirect("/");
            }
        });
    
    
    
});

let port=process.env.PORT;

if(port==null || port==""){
    port=3000;
}

app.listen(port);