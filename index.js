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

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    config: {
        type: String,
        default: ''
    },
    createUser:{
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    modifyAt:{
        type: Date
    }

})

const OperationRecordSchema = new Schema({
    status: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User',UserSchema)
const Project = mongoose.model('Project',ProjectSchema)
const OperationRecord = mongoose.model('OperationRecord',OperationRecordSchema)

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

app.post('/addProject',(req,res) => {
    const d = new Project(req.body)
    d.save((err) => {
        if(err) return res.status(400).send('格式错误')
        const record = new OperationRecord({status: 0,message:`新建项目${req.body.name}`})
        record.save()

        res.send('添加成功!')
    })
})


app.get('/getProjects',(req,res) => {
    const {uid} = req.query

    Project.find({createUser: uid},{config:0},(err,rest) => {
        if(err) return res.status(400).end()

        res.json(rest)
    })
    
})

app.get('/getProject',(req,res) => {
    const {id} = req.query

    Project.findOne({_id: id},(err,rest) => {
        if(err) return res.status(400).end()
        res.json(rest)
    })
    
})

app.post('/deleteProject',(req,res) => {
    const {id} = req.body
    Project.findOneAndDelete({_id: id},(err,rest) => {
        if(err) return res.status(400).end()

        const record = new OperationRecord({status: 2,message:`删除项目${rest.name}`})
        record.save()
        res.send('删除成功！')
    })
})


app.post('/updateProject',(req,res) => {
    Project.findOneAndUpdate( {_id:req.body._id},req.body,(err,rest) => {
        if(err) return res.status(400).end()

        const record = new OperationRecord({status: 1,message:`编辑项目${req.body.name}`})
        record.save()

        res.send('更新成功！')
    })
})

app.get('/getOperationRecord',(req,res) => {
    OperationRecord.find((err,rest) => {
        if(err) return res.status(400).end()
        res.json(rest)
    })
})


app.listen(3000,() => {
    console.log('serve is running!!!');
})