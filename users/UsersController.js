const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');


router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/user/index', {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/user/create");
});

router.post("/users/create", (req, res) =>{
let email = req.body.email;
let password = req.body.password;

User.findOne({where: {email: email}}).then((user) => {
    if(user == undefined){ 
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        User.create({email: email, password: hash}).then(() =>{res.redirect("/")}).catch((err) => {res.redirect("/")});
    }else{
        res.redirect("/admin/users/create");
    }
    });
});

router.post("/users/delete", (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({where: {id: id}}).then(() => {
                res.redirect("/admin/users");
            })
        }else{
            res.redirect("/admin/users");
        }
    }else{
        res.redirect("/admin/users");
    }
});

router.get("/login", (req, res) => {
    res.render("admin/user/login");
});

router.post("/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where: {email: email}}).then((user) => {
        if(user != undefined){
            let correctPassword = bcrypt.compareSync(password, user.password);
            if(correctPassword){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
            }else{
                res.redirect("/admin/articles");
            }

    }else{
        res.redirect("/login");
    }

    });
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});







module.exports = router;