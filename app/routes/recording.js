/**
 * Created by jacelynfish on 2017/4/15.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/scheduler_util';


router.get('', function(req, res, next){

    var uname = req.session.uname;

    var option = req.query;

    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);

        db.collection('urecord')
            .findOne({uname: uname})
            .then(function(doc){
                if(doc == null){
                    return db.collection('urecord')
                        .insertOne({uname: uname, records: [option]});
                }else{
                    var record = doc.records;
                    record.push(option);
                    return db.collection('urecord')
                        .updateOne({uname: uname}, {$set: { records: record}});
1
                }
            })
            .then(function(mes){
                res.status(200);
                res.end();
                db.close();
            })
            .catch(function(err){
                console.log(err);
                res.status(401);
                res.send('unseccessful to set records');
                db.close();
            })

    })

})
module.exports = router;