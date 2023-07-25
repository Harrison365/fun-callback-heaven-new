const request = require('../utils/server');

//Today, we are using multiple levels
//The request funciton takes the arguement, and a callback function, to tell it what to do with the response.
//We tell it that the CBfunction takes an err and status arguement and what to do with them.
//Since the outer function is also asynchronous (as it contains an asynchronous request function) , it also needs to pass its return values to a callback function to be specified later.

function checkServerStatus(CBfunc) {
  request('/status', (err, status) => {
    if (err) {
      CBfunc(err);
    } else {
      CBfunc(null, status);
    }
  });
}

//specifying the callback function we are going to use

const loggingFunc = (error, data) => {
  if (error) {
    console.log(err);
  } else {
    console.log(data);
  }
};

//running the function with our callback function (loggingFunc)

checkServerStatus(loggingFunc);
