const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cors = require('cors')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()
const app = express()

mongoose.connect('mongodb://localhost:27017/zzWeb',{useNewUrlParser: true, useUnifiedTopology: true})

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
         type: Date, 
         default: Date.now 
    }
})

const User = mongoose.model('User',UserSchema)

app.use(urlencodedParser)
app.use(jsonParser)
app.use(cors())

app.get('/getUser',(req,res) => {
    res.send('hah')
})

app.post('/register',(req,res) => {
    const {userName} = req.body
    User.findOne({userName},(err,rest) => {
        if(rest) return res.status(300).send('用户民已存在，请重新输入！')

        const d = new User(req.body)
        d.save((err,rest) => {
            setTimeout(() => {
                res.send('注册成功！')
            }, 500);
        })
    })  
})

app.post('/login',(req,res) => {
    User.findOne(req.body,(err,rest) => {
        if(!rest) return res.status(300).send('账号或密码错误，请重试！')
        const {password,...respData} = rest._doc 
        res.send(respData)
    })
})


app.listen(3000,() => {
    console.log('serve is running!!!');
})