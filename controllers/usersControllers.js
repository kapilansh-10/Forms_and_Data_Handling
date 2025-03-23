const usersStorage = require("../storages/usersStorage");

exports.usersListGet = (req, res) => {
    res.render("index", {
        title: "User list",
        users: usersStorage.getUsers(),
    });
}

exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create user",
    });
};

// exports.usersCreatePost = (req,res) => {
//     const { firstName, lastName } = req.body;
//     usersStorage.addUser({firstName, lastName})
//     res.redirect('/');
// }

// Validation Part

const { body, validationResult } = require("express-validator")

const alphaErr = "must only contain letters"
const lengthErr =  "must be between 1 and 10 letters"

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First Name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First Name ${lengthErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last Name ${alphaErr}`)
        .isLength({ min: 1, max: 10}).withMessage(`Last Name ${lengthErr}`)    
];

// We can pass an entire array of middleware validations to our controller
exports.usersCreatePost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render("createUser", {
            title: "Create user",
            errors: errors.array()
        })
    }
    const { firstName, lastName } = req.body;
    usersStorage.addUser({ firstName, lastName });
    res.redirect('/');
    }
]

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id)
    // if (!user) return res.status(400).send("User not found")
    res.render("updateUser", {
        title: "Update user",
        user: user,
    })
}

exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id)
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).render("updateUser", {
                title: "Update user",
                user: user,
                errors: errors.array()
            })
        }
        const { firstName, lastName } = req.body
        usersStorage.updateUser(req.params.id, { firstName, lastName })
        res.redirect("/")
    }
]

// Tell the server to delete a matching user, if any. Otherwise respond with an error
exports.usersDeletePost = (req,res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
}