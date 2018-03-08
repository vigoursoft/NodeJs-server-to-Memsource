var express = require('express');
var router = express.Router();
var fetch=require('node-fetch');
var FormData = require('form-data');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Vigoursoft' });
});

//multer object creation
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      // cb(null, file.originalname)
        cb(null, file.originalname) 
  }
})
 
var upload = multer({ storage: storage })

/* GET upload page. */
router.get('/upload', function(req, res, next) {
  var langs = req.query.targetLangs;
  langs=langs.replace(/,/g , " ");
  
  res.render('upload', 
    { title: 'File upload', project : req.query.project, token : req.query.token, langs : langs });
});
 
var cpUpload = upload.fields([{ name: 'fileupload', maxCount: 20 } ])

router.post('/upload', cpUpload, function (req, res, next) {
  console.log('returned up');
  //var targetFile='file://C:/asite/team/public/uploads/uploaded.zip';
  var targetFile= './public/uploads/' + req.files.fileupload[0].originalname;
  console.log(targetFile);

  console.log('upl0]'+Object.keys(req.files.fileupload[0]));

  for(var prop in req.files.fileupload) {
    console.log(prop, req.files.fileupload[prop]);  
  }
  var fs = require('fs');
  
/* Create a FormData instance */
var proj=req.body.project;
var token=req.body.token;
var arr=req.body.targetLang.split(' ');

var url="https://cloud.memsource.com/web/api/v8/job/create";

var form = new FormData();
form.append('token', token);
form.append('project', proj);

for ( x=0; x < arr.length; x ++){
  if (arr[x].length>0)
  form.append('targetLang', arr[x]);
}

form.append('file', fs.createReadStream(targetFile));

up(url, form).then((value) => {
   
  console.log('returned up' + value);

  res.send(value);
}).catch((err) => {
  res.render('error', {message : 'Upload error', error : err})
});    


});

async function up(url, form){
var val=await  fetchpost(url,form);
return val;
}
// this is our POST fetch
fetchpost=function(url, form){
  console.log("fetch post");
  
  return new Promise(function (resolve, reject) {
   fetch(url, {
      method: 'post', 
      body: form
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


/* GET download page. */
router.get('/download', function(req, res, next) {
 var  url="https://cloud.memsource.com/web/api/v8/job/get"+req.query.xliff+"File?jobPart="+req.query.jobPart+"&token="
 +req.query.token;
 
  down(url).then((value) => {
    var path = require('path');
  
    var file = value;

    console.log("returned filepath is: "+file);
    var str="<a href='http://localhost:3000/";
   // trying to do resp.download was nuts, so this is the least stressful solution
   res.render('download', {title : 'Download link', str : str+ encodeURIComponent(file)+"'>"+file+"</a>"   }  );

  }).catch((err) => {
    res.render('error', {message : 'error', error : err})
  });    
 
});

async function down(url){
  var val=await  fetchdownload(url);
  return val;
  }
// this is our GET fetch blob
fetchdownload=function(url){
  console.log("fetch download: "+url);
  
  return new Promise(function (resolve, reject) {
   fetch(url, {
      method: 'get', 
      headers: { "Content-Type": "application/octet-stream" }
    })
    .then(function(resp) {

      const contentType = resp.headers.get("content-type");
      const contentDisposition=resp.headers.get("content-disposition");
      console.log("CONTENT TYPE: "+contentType);
      console.log("CONTENT disposition: "+contentDisposition); 
      var fname=contentDisposition.substr(contentDisposition.lastIndexOf("'")+1, contentDisposition.length-1);
      
      const dest = fs.createWriteStream('./public/'+fname);
      resp.body.pipe(dest);
     
      resolve (fname);
      })
      .catch(function (error) {
        console.error(error.message);
        reject(error.message);
    });
  });
};


module.exports = router;
