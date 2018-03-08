var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();
var db = new sqlite3.Database('C:/MyProject/HelloExpress.db');



// show all linguists
exports.userList=function(request, response, next){
 
    let sql="SELECT * From linguists";
    console.log(sql);
  

    db.all(sql, (err, row) => {
        if (err) {
        response.send("That did not work.");     
        return console.error(err.message);
        }
        else
        var params=[];
        
        for (const [key, value] of Object.entries(row[0])) {
            console.log(`${key} ${value}`); 
            // this would be the place to so some sanity checks on
            // input, i.e. no scripts, no <>, or other monkey business
            params.push(key);// column value
          }
       
        response.render('users', { title: 'Users', error: err, items:  row, thead : params });
        console.log(row);
      });

   };


