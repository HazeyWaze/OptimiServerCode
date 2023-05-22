const express = require('express');
const app = express();

const data = require('./data.js');
const PORT =  4001;




app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

  app.get('/projects/:pattern', (req, res, next) => {
    const pattern = req.params.pattern;
    console.log('Request received');
    if (pattern)
    {
//filter
      res.send(getMatching(pattern));
    }
    else{
      res.send(data.data);
    }
    console.log('data sent');
  });

  app.get('/projects', (req, res, next) => {
    console.log('Request received');
    res.send(data.data);
    console.log('data sent');
  });


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });


  function getMatching(str)
  {
  
    let newData = [];
    let pattern = new RegExp( str, "gi");
      let dataCopy = JSON.parse(JSON.stringify(data.data)); //Needed a deep copy of an array
      dataCopy.forEach(project => {
      let mustAdd = false;
      if (project.name.match(pattern))
      {
        let match = project.name.match(pattern)[0];
        mustAdd = true;
        project.name =project.name.replace(pattern,getHighlighted(match));
      }
      project.groups.forEach(group => {
      if (group.name.match(pattern))
      {
        mustAdd = true;      
        let match = group.name.match(pattern)[0]; 
        group.name =group.name.replace(pattern,getHighlighted(str));
      }
      else if(!mustAdd){
        project.groups = project.groups.filter(function(value) { return value != group });
      }
      });
      
      if (mustAdd)
      {
        newData.push(project)
      }
    });
    return newData;
  }

  function getHighlighted(pattern)
  {
    opening = '<mark>';
    closing = '</mark>'
    return opening+pattern+closing;
  }