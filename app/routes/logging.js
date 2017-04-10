var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
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
                    res.status(200);
                    res.send("user info correct");

                    db.close();
                }


            }).catch(function(status){
                res.status(status);
                res.send("Incorrect password!");
                db.close();
        })
    })

});

router.get('/logout',function(req, res, next){
    req.session = null;
    res.clearCookie('nsession');
    res.clearCookie('nsession.sig');
    res.status(200).end();
})

function getSession(){
    return Math.floor(Date.now() / (60e3));
}
module.exports = router;
