const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

const staticpath = path.join(__dirname, "/public");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(staticpath));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://nishidh_parmar:7w0llnFAq7KNpTwP@nishidh.v7afn.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemschema = {
    name: String
}

const Item = mongoose.model("item", itemschema);

const item1 = new Item({
    name: "Welcome to todolist "
})

    // const item2 = new Item({
    //     name: "Created by Nishidh Parmar"
    // })






app.get('/', (req, res) => {
    let date = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = date.toLocaleDateString("en-US", options);

    Item.find({}, (error, founditems) => {

        if (founditems.length === 0) {
            Item.insertMany([item1], function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("success");
                }
            });
            res.redirect("/");
        } else {
            res.render('index', {
                today: day,
                newitems: founditems
            })
        }

    })


})

app.post("/", (req, res) => {
    const newitem = req.body.newitem;
    const item = new Item({
        name: newitem
    });
    item.save();
    res.redirect("/");
})

app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    Item.findByIdAndRemove(itemId, (error) => {
        // console.log(error);
    })
    res.redirect("/");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => console.log('server has started successfully'));