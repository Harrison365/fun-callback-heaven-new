const request = require('../utils/server');

// let statusValue = request('/status', (err, status) => {
//   if (err) {
//     return err;
//   } else {
//     return status;
//   }
// });

// console.log(statusValue);
//wont work as asynchronous code will occur after console.log().

const loggingFunc = (error, data) => {
  if (error) {
    console.log(err);
  } else {
    console.log(data);
  }
};

function checkServerStatus(CBfunc) {
  request('/status', (err, status) => {
    if (err) {
      CBfunc(err);
    } else {
      CBfunc(null, status);
    }
  });
}

checkServerStatus(loggingFunc);

//alternatives to the logging function could be a testing function (but the function cant return as anything that uses that return would exicute before the async code inside)
