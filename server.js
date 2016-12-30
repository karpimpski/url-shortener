var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var url = process.env.DB_URI;

app.get('/new/*', (req, res) => {
  mongo.connect(url, function (err, db) {
    if (err) throw err;
    var n = Math.floor((Math.random() * 10000) + 1);
    while(db.collection('data').find({'newUrl': n}).count > 0){
      n = Math.floor((Math.random() * 10000) + 1);
    }
    db.collection('data').insert({'old': req.params[0], 'newUrl': n}, (err, doc) => {
      if(err) throw err;
      var id = doc.insertedIds[0];
      var n = 'https://' + req.headers.host + '/' + doc.ops[0].newUrl;
      var o = doc.ops[0].old;
      var obj = {'original_url': o, 'new_url': n}
      res.end(JSON.stringify(obj));
    });
  
    db.close();
  });
});

app.get('/:id', (req, res) => {
  var u;
  var param = req.params.id;
  mongo.connect(url, function (err, db) {
    if(err) throw err;
    var data = db.collection('data');
    data.find({'newUrl' : Number(param)}, {
        old: 1
    }).toArray(function(err, docs){
        if(err) throw err;
        u = docs[0].old;
        console.log(u);
        if(u.substring(0, 4) !== 'http'){
          res.redirect('http://' + u);
        }
        else{
          res.redirect(u);
        }
        db.close();
    });
  });
});

app.listen(process.env.PORT);