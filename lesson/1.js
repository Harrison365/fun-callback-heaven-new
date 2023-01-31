function returnHello() {
  setTimeout(() => {
    return 'hello';
  }, 3000);
}

console.log(returnHello(), '<<<HERE');

//wont work as asynchronous code will occur after console.log().
