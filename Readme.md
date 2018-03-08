
This node.js project creates a node.js + Express web server that interfaces with Memsource (tm) (https://www.memsource.com/) via Memsource APIs.

All API calls are funneled through the web server.

**Prequisites**
You need sqlite 3 installed and added to your path. Then add the location of the included HelloExpress.db in the projectsController.js of the web server.

Install he dependencies with *npm install*

2. Start the server in debug mode (the command can be found as a comment at the end of appp.js).

3. Goto localhost:3000


**Features**

1. List projects

2. Create a new project

3. List jobs

4. Upload new jobs

5. Download a Completed job or an xliff

6. Edit an xliff locally

7. Run a workflow step 1 analysis on all jobs in a a project.


**Login to memsource**

You will receive a token which is stored in the sqlite3 db. There is no notification of token expiration. If no projects or jobs are listed, use Reset connection to clear the database table, and log in again.

