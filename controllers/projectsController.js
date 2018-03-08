var express = require('express');
var router = express.Router();
var fs=require('fs');
var sqlite3 = require('sqlite3');
//var formidable = require('formidable'); 


var fetch=require('node-fetch');
var db = new sqlite3.Database('PATH TO HelloExpress.db GOES HERE');

var url, row;

exports.createProject=function(request, response, next){
  console.log("exports.createProject");
       response.render('createProjectForm', { title: 'Create Project', token : request.query.token});
}

exports.do_createProject=function(request, response, next){
  console.log("exports.createProject");
  url="https://cloud.memsource.com/web/api/v4/project/create?token="+request.body.token;

  var arr=request.body.targetLang.split(' ');
  for ( x=0; x < arr.length; x ++){
    if (arr[x].length>0)
    url=url+'&targetLang='+arr[x];
  }
  url=url+"&sourceLang="+request.body.sourceLang;
  url=url+"&name="+encodeURIComponent(request.body.project);
  projList(url).then((value) => {
    console.log('-list templates' + value.val);
    console.log('-list templates' + value.val.length);
    console.log('-token' + Object.values(value.token));

    response.send(Object.values(value))
  }).catch((err) => {
    response.send(err.message);
  });    
}



exports.listTemplates=function(request, response, next) {
var url="https://cloud.memsource.com/web/api/v2/projectTemplate/list?token=";

projList(url).then((value) => {
  console.log('-list templates' + value.val);
  console.log('-list templates' + value.val.length);
  console.log('-token' + Object.values(value.token));
  var dict=[], row=[];
  var arr=value.val;
  var header=['ID', 'NAME', 'SOURCELANG', 'TARGETLANGS'];
  dict.push(header);

  for (var i = 0; i <arr.length; i++){
    obj=arr[i];
    console.log(Object.values(arr[i]));
    row=[obj.id, obj.templateName, obj.sourceLang, obj.targetLangs];
    console.log(row);
    dict.push(row);
   }
   response.render('projects', { title: 'Project templates', values :[dict], len : arr.length }); 
}).catch((err) => {
  response.send(err.message);
});    
}   

exports.listJobs=function(request, response, next) {
 
  var projectID=request.query.id;
  var projectName=decodeURIComponent(request.query.projName);
  var url="https://cloud.memsource.com/web/api/v8/job/listByProject?project="+projectID+"&token=";

  projList(url).then((value) => {
    console.log('-list jobs' + value.val);
    console.log('-list jobs' + value.val.jobParts.length);
    console.log('-token' + Object.values(value.token));
    var obj; 

    var dict=[];
    var header=[];
    var analyzeParams="&jobPart=";
    var includeCols=["id", "fileName" , "dateCreated", "status", "targetLang"];
   
    var arr=value.val.jobParts;
   
    var colCount=0;
   // content=obj[0];
   var row=[];
    for (var x=0; x < arr.length;x++){
      obj=arr[x]; 
      row=[];
      var id;
      var str;
      if (obj.workflowLevel == "1") 
      for (var prop in obj) {
       if( obj.hasOwnProperty( prop ) ) {
         console.log("x: "+ x+" obj." + prop + " = " + obj[prop]);
         if (x==0 && includeCols.includes(prop)){
          header.push(prop);     
         }
         if (prop=='id') id=obj[prop];

         if( includeCols.includes(prop)){
          // if (prop=="fileName") {str="<a href='/projects/downloadJob?jobPart="+id+"&filename="+obj[prop]+"'>" +obj[prop]+"</a>"; 
           if (prop=="fileName") {
            str="<a href='/download?jobPart="+id+"&filename="+obj[prop]+
            "&token="+Object.values(value.token)+"&targetLangs="+request.query.targetLangs+
            "&xliff=Completed'>" +obj[prop]+"</a>" 
            +" or as "+"<a href='/download?jobPart="+id+"&filename="+obj[prop]+
            "&token="+Object.values(value.token)+"&targetLangs="+request.query.targetLangs+"&xliff=Bilingual'>XLIFF</a>";
           
             // str="<a href='https://cloud.memsource.com/web/api/v8/job/getCompletedFile?jobPart="+id+"&token="+Object.values(value.token)+"'>" +obj[prop]+"</a>"; 
              row.push(str);
           
          }
               else
               row.push(obj[prop]);
         }
        
        }
      }
      if (x==0) dict.push(header);
      dict.push(row);
      analyzeParams=analyzeParams+id+',';
      console.log("ROW"+row);
    }
   
    console.log(Object.values(dict)+"ROW len "+row.length);
    
    if (dict.length  >0)
    str="<a href='/projects/analyzeJobs?token="+Object.values(value.token)+analyzeParams+"'> Analyze these jobs</a>"; 

    const addFiles= "<a href='/upload?token="+Object.values(value.token)
    +"&project="+request.query.id+"&targetLangs="+request.query.targetLangs+"'> Upload files</a>";

 if(arr.length==null)
    response.redirect('/projects/disconnect');

    response.render('projects', { title: 'Jobs', values : [dict] , len : arr.length, rowlen : row.length, 
    str : str, addFiles : addFiles, projectname : projectName });
  }).catch((err) => {
    response.send(err.message);
});    

}

// analyze all jobs for workflow==1
exports.analyzeJobs=function(request, response, next){
  var url="https://cloud.memsource.com/web/api/v2/analyse/create?token="+request.query.token;
  console.log("our jobpart object: "+request.query.jobPart +" length:"+request.query.jobPart.length );
  var arr=request.query.jobPart.split(',');

  var value="";
  var dict=[];
  var header=['ID', 'FILENAME', 'TARGETLANG', 'DATA'];
  dict.push(header);
  var row=[];
  
 
  for ( x=0; x < arr.length; x ++){
    if (arr[x].length>0)
    value=value+"&jobPart="+arr[x];
    console.log(value);
  }
 

  url=url+value;
  projList(url).then((value) => {
    console.log('-list analyze' + value.val);
    console.log('-list analyze' + value.val.parts.length);
    console.log('-token' + Object.values(value.token));
    var obj; 
    var top=value.val;
    // top object contains 1 prop 'parts'
      var arr=top.parts;
      var jobParts;
     
      for (var x=0; x < arr.length; x ++){
        obj=arr[x];
        console.log("where are we "+Object.values(obj));
        // that obj has a prop jobParts, which is another array of objects
        // targetlang is at the same level as jobParts
        jobParts=obj.jobParts;
        var targetLang=obj.targetLang;
        
        
        for (var jp=0; jp< jobParts.length; jp++){

          obj=jobParts[jp];
          row=[obj.id, obj.fileName, targetLang, data(obj.data)];
          console.log("where are we "+Object.values(row));
          dict.push(row);
        }

       
      }//  x < arr.length
      console.log('we done');
      response.render('projects', { title: 'Analyze', values :[dict], len : value.val.parts.length  }); 
    

    }).catch((err) => {
    response.send(err.msg);
});    
  
  }

  // the data object
function data(obj){
  var value="";
  value="\nTotal words: "+obj.all.words;
  value=value+"<br>Repetitions: "+obj.repetitions.words;
  value=value+"<br>TM match 101%: "+obj.transMemoryMatches.match101.words;
  value=value+"<br>TM match 100%: "+obj.transMemoryMatches.match100.words;
  value=value+"<br>TM match 95-99%: "+obj.transMemoryMatches.match95.words;
  value=value+"<br>TM match 85-94%: "+obj.transMemoryMatches.match85.words;
  value=value+"<br>TM match 75-84%: "+obj.transMemoryMatches.match75.words;
  value=value+"<br>TM match 50-74%: "+obj.transMemoryMatches.match50.words;
  value=value+"<br>TM match 0-49%: "+obj.transMemoryMatches.match0.words;
  
   return value;
  }

// put check for and cleanup of expires token here
exports.login=function(request, response, next){
  response.render('memlogin', { title: 'Connect'});
  }
  
  exports.disconnect=function(request, response, next){
    sql="Delete from EM";
    db.run(sql, [], function(err) {
      if (err) {
        return console.error(err.message);
      }
      response.redirect('/wiki');
      console.log('Changes '+ `${this.changes}`);
    });
     
  }

exports.do_login=function(request, response, next){
var user=request.body.user;
var pw=request.body.password;
var url="https://cloud.memsource.com/web/api/v3/auth/login?userName="+encodeURIComponent(user)+"&password="+encodeURIComponent(pw);
//alert(url);


login(url).then((value) => {
   
    console.log('login' + value);

    response.render('memlogin', { title: 'Login expires: ' + value});
}).catch((err) => {
    // handle error
});    


}

/// LIST =====================================
exports.listProjects=function(request, response, next){
  let url="https://cloud.memsource.com/web/api/v2/project/list?token=";
  projList(url).then((value) => {
    console.log('-list projects' +value.val);
    console.log('-list projects' +value.val.length);
  var obj; 
  var values=value.val;
  var dict=[];
  var header=[];
  var includeCols=["id", "name" , "dateCreated", "status", "sourceLang", "targetLangs"];
 
 // content=JSON.stringify(values);
  var colCount=0;
 // content=obj[0];
 var row=[];
  for (var x=0; x < values.length;x++){
    obj=values[x]; 
    row=[];
    var str;
    for (var prop in obj) {
     if( obj.hasOwnProperty( prop ) ) {
       console.log("x: "+ x+" obj." + prop + " = " + obj[prop]);
       if (x==0 && includeCols.includes(prop)){
        header.push(prop);     
       }
  
       if( includeCols.includes(prop)){
         if (prop=="name") {str="<a href='/projects/listJobs?id="+obj['id']+"&targetLangs="
         +obj['targetLangs']+"&projName="+encodeURIComponent(obj[prop])+"'>" +obj[prop]+"</a>";  row.push(str);
         
        }
             else
              row.push(obj[prop]);
       }
      
      }
    }
    if (x==0) dict.push(header);
    dict.push(row);
    console.log("ROW"+row);
  }
  const addFiles= "<a href='/projects/createProject?token="+Object.values(value.token)
  +"'> Create a new project</a>";
 
  console.log(Object.values(dict)+"ROW len "+row.length + values.length);

  if(values.length==null)
    response.redirect('/projects/disconnect');
  else  
    response.render('projects', { title: 'Projects', values : [dict] , len : values.length, rowlen : row.length, addFiles: addFiles });
}).catch((err) => {
    // handle error
});    


  
}  

// call this to perform login
async function login(url){
  var val, retvalue;
  let sql="SELECT token, expires From EM";
  val= await db.getAsync(sql);
  let params=[];
  
  //WE need to save the expiration date to the table too and then compare old and new
  if (val !== null){
    var date = new Date();
    var TimeStamp = date.toISOString();
    console.log('timestamp'+TimeStamp);
    let l=TimeStamp.length; 
   
    Object.keys(val).forEach(function (key) {
      var v = val[key];
      params.push(v);
      console.log('OUTPUT: '+ v);
     });
    
    var d1=TimeStamp.substr(0, l-5);
    var d2=params[1].substr(0, l-5);
    retvalue=params[1];
    //let olddate=Date.parse(str);
    console.log('DATES: '+'  '+d1+ '  '+ d2);
 }


  if (val===null) {
    console.log( 'token select val is null');
  val=await fetchAsync(url, val);
  
  params.push(val.token); params.push(val.expires);
  retvalue=params[1];
  console.log('parameter for deb'+params);

  sql = "INSERT INTO EM (TOKEN, EXPIRES) VALUES ( ?, ? )";
  val =await db.dbopsAsync (sql, params, "message");
}
else console.log('we have a token already');


return retvalue; 
}

// call this to get the projects
async function projList(url){
dict={};  
var val, token;
let sql="SELECT token From EM";
val= await db.getAsync(sql);
dict.token=val;
console.log(val);
val=await fetchAsync(url, val);
dict.val=val;
return dict;
}


// Insert & update db function
db.dbopsAsync = function (sql, params, msg) {
  var that = this;
  console.log('trying insert or update '+sql+params);
  return new Promise(function (resolve, reject) {
      that.run(sql, params, function(err){
          if (err)
              reject(err);
          else
              resolve(this.changes);
              // console.log(msg+ `${this.changes}`);
      });
  });
};


// custom async get db
db.getAsync = function (sql) {
  var that = this;
  return new Promise(function (resolve, reject) {
      that.get(sql, function (err, row) {
          if (err){
            console.log('rejected getasynch');
              reject(err);
          }
          else{
            console.log('resolved getasynch'+row);
            if (typeof row === 'undefined')
            resolve(null);
            else
            resolve(row);
          }
      });
  });
};

// this is our GET fetch
fetchAsync=function(url, token){
  
  return new Promise(function (resolve, reject) {

   if (token !== null){
     var tok=Object.values(token);
     if (!url.includes(tok))
      url=url+tok;;

   }

  console.log(url);
    fetch(url, {
      method: 'get' 
    })
    .then(function(resp) {
       return resp.text();
      })
      .then(function(text) {
       console.log('2 memsource says: '+ text);
        var auth=JSON.parse(text);
    
       resolve(auth);        
      })
      .catch(function (error) {
        console.error(error.message);
        reject(error.message);
    });
 

  });
};