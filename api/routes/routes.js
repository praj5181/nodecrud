const path = require('path');
const express = require('express');
const fs = require('fs');
const userObj = require('../database/users');

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Default Message"
    })
})

router.get('/users', (req,res) => {
    try {
        if (!userObj || !userObj.length) {
            return res.status(404).json({success:false, data:"Users not found!"})
        }
        return res.status(200).json({
            message: "Users retrived",
            success: true,
            users: userObj
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
});

router.get('/user/:id', (req,res) => {
    let user = userObj.find(user => user.id === req.params.id);

    if (!user) {
        res.status(404).json({ message: "User not found", success: false });
    } else {
        res.status(200).json({
            message: "User successfully retrived",
            success: true,
            user: user
        });
    }
});

router.post('/add', (req,res) => {
    const { email, firstName, lastName } = req.body;
    const id = generateUserID();
    const newUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        id: id
    };

    userObj.push(newUser);
    const usersFilePath = path.join(__dirname, '..', 'database', 'users.js');

    fs.writeFile(usersFilePath, 'module.exports = ' + JSON.stringify(userObj, null, 2), err => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error adding user", success: false });
        } else {
            res.json({
                message: "User added",
                success: true,
                id: newUser.id
            });
        }
    });
});

router.put('/update/:id', (req,res) => {
    const id = req.params.id;
    const { email, firstName, lastName } = req.body;
    const user = userObj.find(user => user.id === id);
    let userIndex = userObj.findIndex(user => user.id === req.params.id);

    if (!user) {
        res.status(404).json({ message: "User not found", success: false });
    } else if (!email || !firstName) {
        res.status(400).json({ message: "Missing required User data fields", success: false });
    } else {
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        const userIndex = userObj.findIndex(user => user.id === req.params.id);
        userObj[userIndex].email = email || userObj[userIndex].email;
        userObj[userIndex].firstName = firstName || userObj[userIndex].firstName;
        userObj[userIndex].lastName = lastName || userObj[userIndex].lastName;

        const usersFilePath = path.join(__dirname, '..', 'database', 'users.js');

        fs.writeFile(usersFilePath, 'module.exports = ' + JSON.stringify(userObj, null, 2), err => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error updating user", success: false });
            } else {
                res.json({
                    message: "User updated",
                    success: true
                });
            }
        });
    }
});

router.all("*", (req, res) => {
    const url = req.originalUrl;
    res.status(404).json({
        message: "Route not found for url : " + url
    })
})
function generateUserID() {
    return Math.random().toString(36).substr(2, 10);
}

module.exports = router;