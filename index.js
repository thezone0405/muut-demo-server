var express = require('express'),
    app = express(),
    crypto = require('crypto'),
    axios = require('axios'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    users = {
        "test1":{
            id: 1,
            displayname: "test1",
            password: "test123",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQboMWUsplgKffTTlYGpgaybacFzJvVLdEeA5KUO573t3vw6zAt"
        },
        "test2":{
            id: 2,
            displayname: "test2",
            password: "test123",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQboMWUsplgKffTTlYGpgaybacFzJvVLdEeA5KUO573t3vw6zAt"
        },
        "test3":{
            id: 3,
            displayname: "test3",
            password: "test123",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQboMWUsplgKffTTlYGpgaybacFzJvVLdEeA5KUO573t3vw6zAt"
        }
    },
    //Your API keys here
    key = "IpiYhMG4R2xPGeLrDbKZjAL7k",
    secretkey = "zzZXr_yVgH4iie1grCPbh0Vf5S_CKBDSua90wpUMHkA-9wYJ",

    // current timestamp
    timestamp = new Date()/1000; //epoch time in seconds

    //string to generate the signature with
    var text = key + ":" + timestamp;
    var signature = crypto.createHmac('sha256', secretkey).update(text).digest('hex');

    app.use(cors())
    app.use(bodyParser.json())

    app.post('/authenticate', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;

        var currentUser = users[username]
        if(currentUser && password == currentUser.password){
            //delete currentUser.password
            axios.post('https://api.muut.io/v1/edztest/projects/edztesting/users/tokens',{
                    fi_user: currentUser,
                    sync: "true"
                },
                {
                    headers: {
                        "x-muut-timestamp": timestamp,
                        "x-muut-key": key,
                        "x-muut-signature": signature
                    }
                }
            ).then(function (response) {
                var token = response.data.jwt
                res.status(200).send({token: token})
            })
            .catch(function (error) {
                res.status(403).send({message: 'Request Failed',error});
            })
        }else{
            res.status(403).send({error:"Authentication error"});
        }
    })

    app.listen(process.env.PORT || 3000);
