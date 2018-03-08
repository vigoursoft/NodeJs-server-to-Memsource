
// UPLOAD
function upload()
   {

      var file = document.getElementById("frmfile");
      var project=document.getElementById("frmproject");
      var langs = document.getElementById("frmlanglist");
      var token = document.getElementById("token");

      /* Create a FormData instance */
      var formData = new FormData();
      /* Add the file */

    if (file.value != "")
      formData.append("file", file.files[0]);
 

      formData.append("token", token.value);
      formData.append("project", project.value);
      formData.append("targetLang", 'de');

   /*  for(var x=0; x < langs.length; x++){
     // <input type="text" name="targetLang" />
      formData.append("targetLang", langs[x].value);

        }
*/
var url="https://cloud.memsource.com/web/api/v8/job/create";
fetch(url, {
    method: 'post',
    body: formData 
  })
  .then(function(resp) {
     return resp.text();
    })
    .then(function(text) {
     console.log('2 memsource says: '+ text);
      var auth=JSON.parse(text);
     return auth;
    })
    .catch(function (error) {
      console.error(error.message);
      
  });

   }


function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable2");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// we have the data, now execute a fetch
function download(){
  alert("soo");
fetch("https://cloud.memsource.com/web/api/v8/job/getCompletedFile?token="+readCookie('memsource')+"&jobPart="+x, {
  method: 'get'

})
.then(function(response) {
    return response.blob();
  })
  .then(function(imageBlob) {

   var a = document.createElement('a');
             a.href = window.URL.createObjectURL(imageBlob);
                   document.body.appendChild(a);
                  a.download = filename;
                       a.click();
  })
          .catch(function (error) {
              console.error(error.message);
});

}