var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/scheduler_util';

router.post('/checkUser',function(req, res, next){
    var uname = req.body.uname;
    // req.session.nowInMinutes = getSession();
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);

        db.collection('uaccount')
            .findOne({uname: uname})
            .then(function(doc){
                if(doc == null){
                    return Promise.reject(401);
                }else{
                    res.status(200);
                    res.send("hello");

                    db.close();
                }
            }).catch(function(err){
                res.status(err);
                res.send("User does not exist.");
                db.close();
        })
    })


});

router.post('/login',function(req, res, next){

    var uname = req.body.uname,
        upw = req.body.upw;

    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);

        db.collection('uaccount')
            .findOne({uname: uname})
            .then(function(doc){
                //assert.equal(null, doc);

                if(doc.upw != upw){
                    return Promise.resolve(Promise.reject(401));
                }else{
                    req.session.nowInMinutes = getSession();
                    req.session.uname = uname;
                    storeSession(db, uname, req.session.nowInMinutes)
                        .then(function(){
                            res.status(200);
                            res.send("user info correct");

                            db.close();
                        })

                }


            }).catch(function(status){
                res.status(status);
                res.send("Incorrect password!");
                db.close();
        })
    })

});

router.post('/register', function(req, res, next){
    var uname = req.body.uname,
        upw = req.body.upw;

    console.log(uname, upw);
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);

        db.collection('uaccount')
            .insertOne({
                uname: uname,
                upw: upw
            })
            .then(function(doc){
                req.session.nowInMinutes = getSession();
                req.session.uname = uname;
                storeSession(db, uname, req.session.nowInMinutes)
                    .then(function(){
                        res.status(200);
                        res.send("successfully registered!");

                        db.close();
                    })

            })
            .catch(function(err){
                res.status(401);
                res.send('unseccessfully registered!');
                db.close();
            })
    })
})

router.get('/logout',function(req, res, next){
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);

        clearSession(db, req.session.uname)
            .then(function(){
                req.session = null;
                res.clearCookie('nsession');
                res.clearCookie('nsession.sig');
                res.status(200).end();
            })
            .catch(function(err){
                res.status(401);
                res.send('unseccessful to log out!');
                db.close();45
            })
    })

})

function storeSession(db, uname, session){
    return db.collection('usession')
        .updateOne({uname: uname}, {$set: {session: session}}, {upsert: true})
}
function clearSession(db, uname){
    return db.collection('usession')
        .updateOne({uname: uname}, {$set: {session: ''}}, {upsert: true});
}
function getSession(){
    return Math.floor(Date.now() / (3e5)); //5 min
}
module.exports = router;
