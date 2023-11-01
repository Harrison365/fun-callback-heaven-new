const request = require('../utils/server');

function checkServerStatus(CBfunc) {
  request('/status', (err, status) => {
    // if (err) {
    //   CBfunc(err);
    // } else {
    CBfunc(null, status);
    // }
    //will work with or without if statement but I think its better practice (going forward) to have it.
  });
}

//because request is asynchronous, we can't return the output and use it. Instead we wrap request in a function which takes a function (a callback function - a function that we pass as an arguement and use within)

//this allows us to use our asynchronous output in a synchronous way (i.e. after the output has been reached)

//in this instance our callback function fed to the larger function will be the testCB in the test suite, which allows us to test that what is passed to it (i.e. the asynchronous request output) is correct.

//request itself takes an endpoint and a callback function so that it can go and grab data from a specific place then passes it into a callback function that we write (if we saw the require function it would take a string and its own CBfunc). We use either the error or the data that returns. How do we use it? Well, as mentioned above, by passing the output to a callback function. Now we can use the error or the data synchronously in the function.

//We cant return the error or the data because when we try and use it externally e.g. console.log(), the function might exicute after the console.log(). By using the callback, we can pass in a function which console.log()s.

function fetchBannerContent(CBfunc) {
  request('/banner', (err, banner) => {
    if (err) {
      CBfunc(err);
    } else {
      let copy = { ...banner };
      copy.copyrightYear = 2022;
      CBfunc(null, copy);
    }
  });
}

function fetchAllOwners(CBfunc) {
  request('/owners', (err, array) => {
    if (err) {
      CBfunc(err);
    } else {
      lowercaseArr = array.map(OWNER => {
        return OWNER.toLowerCase();
      });
      CBfunc(null, lowercaseArr);
    }
  });
}

function fetchCatsByOwner(owner, CBfunc) {
  request(`/owners/${owner}/cats`, (err, array) => {
    if (err) {
      CBfunc(err);
    } else {
      CBfunc(null, array);
    }
  });
}

function fetchCatPics(arr, CBfunc) {
  if (arr.length === 0) {
    CBfunc(null);
  }
  let newArr = [];
  arr.forEach(catString => {
    request(`/pics/${catString}`, (err, pic) => {
      if (err) {
        console.log(err);
        newArr.push('placeholder.jpg');
      } else {
        newArr.push(pic);
      }
      //cb must be invoked inside the call back to maintain syncriocity, but we only want it to happen on the last go so we put in an if statement. (RANDOM ORDER EXPLAINATION IS MORE FOR FETCH OWNERS WITH CATS (although still sort of works as a random request will finish first and invoke the CBfunc)))
      if (newArr.length === arr.length) {
        CBfunc(null, newArr);
      }
    });
  });
}

//Can't do the CBfunc on the outside of the forEach as it will invoke before the forEach has finished.
//So we put it inside the request callback function and put an if around it. So it only invokes on the final iteration of the forEach.

function fetchAllCats(CBfunc) {
  const arrayOfCats = [];
  fetchAllOwners((err, owners) => {
    if (err) {
      CBfunc(err);
    }
    owners.forEach(owner => {
      fetchCatsByOwner(owner, (err, ownersCat) => {
        if (err) {
          CBfunc(err);
        } else {
          arrayOfCats.push(ownersCat);
        }
        if (arrayOfCats.length === owners.length) {
          let sortedCats = arrayOfCats.flat().sort();
          CBfunc(null, sortedCats);
        }
      });
    });
  });
}

//^^^Here, we are making a new array then envoking fetchAllOwners, which takes a callback function.
//When we wrote this function (fetchAllOwners), once it had retreived the data, it passed it back to the callback function that it was called with (CBfunc).
//However, this time, we are specifying what that CBfunc does. We know what it takes (err, owners). Now we tell it what to do with those. In the case of owners, use forEach to fetchCatsByOwner, then repeat. (dont forget the length check like last time at the end of th forEach).
//Everything that we do with owners must occur within that callback function. Including the next callback function for fetchCatsByOwner.

//This is how we get callback hell and start to use promises and .then.

function fetchOwnersWithCats(CBfunc) {
  let objArray = [];
  let count = 0;
  fetchAllOwners((err, owners) => {
    if (err) {
      CBfunc(err);
    } else {
      owners.forEach((owner, index) => {
        //we are keeping track of the index we are on so that they remain in the same order when we push their objects to the new array (due to the randomness of async code)
        fetchCatsByOwner(owner, (err, array) => {
          if (err) {
            CBfunc(err);
          }
          objArray[index] = { owner: owner, cats: array };
          count++;
          if (count === owners.length) {
            //We use a count rather then testing length because async code finishes at random times. So one fetch will finish first and may be the one intended to be added to the array at index 5. This gives us an array of [undefined, undefined, undefined, undefined, undefined, {owner: gary, cats:[larry, jerry]} ]
            //We dont want to end it here so we have to wait for all async fetches to resolve. so we put a count incrementor at the end of each. We only end when the count reaches the needed number.
            //The reason we didnt need to do this above is because we wern't adding the async fetches at specified indexed last time, the array would fill from index 0 as each fetch finished. We were able to use the sort feature at the end to order them before putting the intended output array into our CBfunc. This time we werent allowed to use sort() so we had to add the fetch outcomes to the index of the forEach which left gaps. We needed to use the counter as explained above.

            CBfunc(null, objArray);
          }
        });
      });
    }
  });
}

function kickLegacyServerUntilItWorks(CBfunc) {
  request('/legacy-status', (err, output) => {
    if (err) {
      kickLegacyServerUntilItWorks(CBfunc);
    } else {
      CBfunc(null, output);
    }
  });
}

function buySingleOutfit(outfit, CBfunc) {
  let count = 1;
  request(`/outfits/${outfit}`, (err, buyOutfit) => {
    if (err) {
      CBfunc(err);
    } else {
      if (count === 1) {
        CBfunc(null, buyOutfit);
        count++;
      }
    }
  });
}

module.exports = {
  buySingleOutfit,
  checkServerStatus,
  kickLegacyServerUntilItWorks,
  fetchAllCats,
  fetchCatPics,
  fetchAllOwners,
  fetchBannerContent,
  fetchOwnersWithCats,
  fetchCatsByOwner
};
