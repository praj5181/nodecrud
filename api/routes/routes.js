const express = require('express');

const userObj = require('../database/users');

//var uuid = require('uuid');

const router = express.Router();

router.get("/", (req,res) => {
    res.send("Hello World")
});

router.get("/users", (req,res) => {
    try{
        if(!userObj || !userObj.length) {
            return res.status(400).json({success:false, data:"Users not found!"})
        }
    }
    catch(err) {
        return res.status(500).json({message: "Internal Server Error"})
    }
    return res.status(200).json({message: "Users retrieved", success: true, users: userObj});
});

router.get("/users/:id", (req,res) => {
    const user = userObj.find(user => user.id === req.params.id);
    return res.status(200).json({message: "User retrieved", success: true, user: user})
});

router.post("/users/add", (req,res) => {
    const { email, firstName } = req.body;
    const id = generateId();

    const newUser = {
        email: email,
        firstName: firstName,
        id: id,
    };
    userObj.push(newUser);
  
    res.json({
      message: 'User added',
      success: true,
    });
});

router.put('/users/update/:id', (req,res) => {
    const id = req.params.id;
    const { email, firstName } = req.body;

    const user = userObj.find(user => user.id === id);

    if (user) {
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;

        res.json({
        message: 'User updated',
        success: true,
        });
    } else {
        res.status(404).json({
        success: false,
        message: 'User not found',
        });
    }
});

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = router;