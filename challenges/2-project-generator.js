const fs = require('fs');
const exec = require('child_process').exec;

function projectGenerator(projectName, cb) {
  fs.mkdir(`./${projectName}`, err => {
    if (err) {
      return cb(err);
    }
    //if you want to do one test at a time. you will need an else{cb(null)} on the final section as you need to return something to the callback to end the function.
    fs.writeFile(`./${projectName}/index.js`, '', err => {
      if (err) {
        return cb(err);
      }
      //no need for a second arguement in the mkdir or writeFile callbacks as they wont spit anything out that we can use

      fs.writeFile(`./${projectName}/.gitignore`, 'node_modules', err => {
        if (err) {
          return cb(err);
        }

        fs.mkdir(`./${projectName}/spec`, err => {
          if (err) {
            return cb(err);
          }

          fs.writeFile(`./${projectName}/spec/index.test.js`, '', err => {
            if (err) {
              return cb(err);
            }

            fs.writeFile(`./${projectName}/README.md`, `# ${projectName}`, err => {
              if (err) {
                return cb(err);
              }

              exec(`cd ./${projectName} && git init`, err => {
                if (err) {
                  return cb(err);
                }

                fs.writeFile(`./${projectName}/.eslintrc.json`, '{}', err => {
                  if (err) {
                    return cb(err);
                  }

                  fs.writeFile(
                    `./${projectName}/package.json`,
                    JSON.stringify(
                      {
                        scripts: {
                          test: 'not the default'
                        },
                        devDependencies: {}
                      },
                      null,
                      2
                    ),
                    err => {
                      if (err) {
                        return cb(err);
                      }
                      cb(null);
                    }
                  );
                });
              });
            });
          });
        });
      });
    });
  });
}

module.exports = projectGenerator;
