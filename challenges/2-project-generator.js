const fs = require('fs');

function projectGenerator(projectName, cb) {
  fs.mkdir(`./${projectName}`, err => {
    if (err) {
      cb(err);
    } else {
      fs.writeFile(`./${projectName}/index.js`, 'obligatory string', err => {
        if (err) {
          cb(err);
        } else {
          //do next thing
        }
      });
    }
  });
}

//no need for a second arguement in the mkdir or writeFile callbacks as they wont spit anything out that we can use

module.exports = projectGenerator;
