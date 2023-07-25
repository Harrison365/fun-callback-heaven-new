//This CBfunction can be anything we want. What we have been doing today is using functions which take errors or data

const loggingFunc = (error, data) => {
  if (error) {
    console.log(err);
  } else {
    console.log(data);
  }
};

//In this instance, you will need to use (null, data) when passing our output to the CBfunc in the async func.

function returnHello(cbFunc) {
  setTimeout(() => {
    cbFunc(null, 'hello');
  }, 3000);
}

returnHello(loggingFunc);
