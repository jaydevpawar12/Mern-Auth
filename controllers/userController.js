const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
exports.register = async (req, res) => {
    try {
        const { password, email } = req.body
        const found = await User.findOne({ email })
        if (found) {
            return res.json({
                message: "Email already exist"
            })
        }
        const hashPass = await bcrypt.hash(password, 10)
        const result = await User.create({
            ...req.body,
            password: hashPass
        })

        res.json({
            message: "user register successs",
            result
        })
    } catch (error) {
        res.json({ message: "something went wrong", error })
    }

}
exports.fetchUsers = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token) {

            res.json({ message: "Provide Token" })
        }
        jwt.verify(token, process.env.JWT_KEY)

        const result = await User.find()
        res.json({
            message: "user fetch successs",
            result
        })
    } catch (error) {
        res.json({ message: "something went wrong", error })
    }

}
exports.login = async (req, res) => {
    try {
        //email exist
        const { email, password } = req.body
        const result = await User.findOne({ email })

        if (!result) {
            return res.json({ message: "email is not registered with us" })
        }
        const match = await bcrypt.compare(password, result.password)
        if (!match) {
            return res.json({ message: "password do not match" })
        }
        const token = jwt.sign({ name: "john" }, process.env.JWT_KEY)
        res.json({ message: "login success", token })
    } catch (error) {
        res.json({ message: "something went wrong" + error })
    }

}
exports.destroy = async (req, res) => {
    try {


        await User.deleteMany()
        res.json({
            message: "user destroy successs",
        })
    } catch (error) {
        res.json({ message: "something went wrong" + error })
    }

}