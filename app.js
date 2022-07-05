const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));  

// it provides to run ejs
app.set("view engine", "ejs");    




// Database Part

mongoose.connect("mongodb://localhost:27017/todolistDB")

// Item Schema

const itemSchema = new mongoose.Schema({
    name: String
})
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Item1"
})

const item2 = new Item({
    name: "Item2"
})
const item3 = new Item({
    name: "Item3"
})

const defaultItems = [item1, item2, item3];

// List Schema

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]

})

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res){
    
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){

            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully items added to the DB");
                }
            })
            
        } 
        res.render("list", {listTitle: "Today", newListItems: foundItems} );
        
        if(err){
            console.log(err);
        }
           
      
    })
  
});

app.post("/delete", function(req, res){
    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today'){
        Item.findByIdAndRemove(checkItemId, function(err){
            if(!err){
                console.log("Removed the item");
                res.redirect("/");
            }
        })

    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemId}} }, function(err, foundList){
            res.redirect("/" + listName);
        })
        
    }

})
app.post("/", function(req, res){
    let itemName = req.body.firstText;
    const listName = req.body.list;

    const newItem = new Item({
        name: itemName
    })

    if(listName === "Today"){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundList){
            if(!err){
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            
            }
        })
    }

              
})

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName},function(err, foundList){
    
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);
            }else{
               res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
    
            
        }

    })
    
})



app.listen(3000, function(){
    console.log("Server is started on port 3000");
});
