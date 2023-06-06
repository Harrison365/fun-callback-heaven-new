function returnHello() {
  setTimeout(() => {
    return 'hello';
  }, 3000);
}

const response = returnHello();

console.log(response, '<<<HERE');

// //wont work as asynchronous code will occur after console.log().
