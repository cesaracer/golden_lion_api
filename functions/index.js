const functions = require('firebase-functions');
const express = require('express')
const app = express();
const cors = require('cors')
const nodemailer = require('nodemailer')

app.use(express.json())
app.use(cors({origin: true}))

//settings for email being used to send confirmation message
let transporter = nodemailer.createTransport({
    service: 'email service',
    auth: {
        user: 'email',
        pass: '*******'
    }
});

//process order
app.post('/confirm', (req, res) => {
    try{
        //crafting email to send
        let fields = {
            to: req.body.email,
            from: 'email',
            subject: 'Order Received',
            text: 'Thank you for ordering! Your food will be ready in 15-20 minutes.'
        }

        transporter.sendMail(fields, function(err){
            if(err){
                console.log(err)
            }
            else{
                console.log('receipt sent')
            }
        })
        //creating order id
        let id = Math.floor(Math.random() * 89999) + 10000
        
        //returning order id
        res.status(201).json({orderId: id})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

//get menu items
app.get('/getMenu', (req, res) => {
    try{
        res.status(201).json(menu)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

const port = 5000 || process.env.port

app.listen(port, () => console.log("server started on port " + port))

exports.app = functions.https.onRequest(app)