//Instead of returning a value then doing something with it, we can pass in a callback function to the async function. This CB function will tell the value what to do when it is ready.

function returnHello(cbFunc) {
  setTimeout(() => {
    cbFunc('hello');
  }, 3000);
}
+(
  //So when we actually call the function, we pass in the callback function we want, based on what we want to be done with the value.

  //here is the function we will pass in vvvvv

  function loggingFunc(data) {
    console.log(data);
  }
);

//Here we are passing it in.

returnHello(loggingFunc);
