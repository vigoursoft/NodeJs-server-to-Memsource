var express = require('express');
var router = express.Router();

var projects_controller = require('../controllers/projectsController'); 

// GET for /projects.
router.get('/', projects_controller.login);  

// GET request memsourcelogin form
router.get('/login', projects_controller.login);

router.post('/login', projects_controller.do_login);

router.get('/disconnect', projects_controller.disconnect);

router.get('/listProjects', projects_controller.listProjects);

router.get('/listJobs', projects_controller.listJobs);

router.get('/listTemplates', projects_controller.listTemplates);

router.get('/analyzeJobs', projects_controller.analyzeJobs);

router.get('/createProject', projects_controller.createProject);

router.post('/createProject', projects_controller.do_createProject);

//router.get('/downloadJob', projects_controller.downloadJob);

module.exports = router;
