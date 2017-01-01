var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var url = process.env.DB_URI;
var path = require('path');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', {root: __dirname });
});

app.get('/new/*', (req, res) => {
  var oldUrl = req.params[0];
  mongo.connect(url, function (err, db) {
    if (err) throw err;
    var num = Math.floor((Math.random() * 10000) + 1);
    while(db.collection('data').find({'newUrl': num}).count > 0){
      num = Math.floor((Math.random() * 10000) + 1);
    }
    var n;
    var o;
    db.collection('data').findOne({'old' : oldUrl}, (err, doc) => {
      if(err) throw err;
      if(doc !== null){
        n = 'https://' + req.headers.host + '/' + doc.newUrl;
        o = doc.old;
        var obj = {'original_url': o, 'new_url': n};
        res.end(JSON.stringify(obj));
        db.close();
      }
      else{
        db.collection('data').insert({'old': oldUrl, 'newUrl': num}, (err, newDoc) => {
          if(err) throw err;
          n = 'https://' + req.headers.host + '/' + newDoc.ops[0].newUrl;
          o = newDoc.ops[0].old;
          var obj = {'original_url': o, 'new_url': n};
          res.end(JSON.stringify(obj));
          db.close();
        });
      }
    });
  });
});

app.get('/:id', (req, res) => {
  var u;
  var param = Number(req.params.id);
  if(param.toString() == req.params.id){
    mongo.connect(url, function (err, db) {
      if(err) throw err;
      var data = db.collection('data');
      data.find({'newUrl': param}, {
        old: 1
      }).toArray((err, docs) => {
        if(err) throw err;
        if(docs.length >= 1){
          console.log(docs);
          u = docs[0].old;
          console.log(u);
          if(u.substring(0, 4) !== 'http'){
            res.redirect('http://' + u);
          }
          else{
            res.redirect(u);
          }
          db.close();
        }
        else{
          res.end('That URL is not valid!');
          db.close();
        }
      });
    });
  }
  
  else{
    res.end('Please enter a valid ID.');
  }
});

app.listen(process.env.PORT);