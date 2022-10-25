const { catsByOwner } = require('../utils/database');
const request = require('../utils/server');

function checkServerStatus(CBfunc) {
  request('/status', (err, status) => {
    if (err) {
      CBfunc(err);
    } else {
      CBfunc(null, status);
    }
  });
}

//because request is asynchronous, we can't return the output and use it. Instead we wrap request in a function which takes a function (a callback function - a function that we pass as an arguement and use within)

//this allows us to use our asynchronous output in a synchronous way (i.e. after the output has been reached)

//in this instance our callback function fed to the larger function will be the testCB in the test suite, which allows us to test that what is passed to it (i.e. the asynchronous request output) is correct.

//request itself takes an endpoint and a callback function so that it can go and grab data from a specific place then passes it into a callback function that we write. We use either the error or the data that returns. How do we use it? Well, as mentioned above, by passing to the output to a callback function. Now we can use the error or the data synchronously.

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
    CBfunc(null, null);
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
      if (newArr.length === arr.length) {
        CBfunc(null, newArr);
      }
    });
  });
}

//^^^ We check that the latest push has made the array long enough. Then we can move on. This is because we can't finish the forEach as this would mean exiting the request callback (err,pic). This would mean that we couldnt use anything from within as it is asynchronous (and so will finish last and be unusable by synchronous code outside of the request callback)

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
  fetchAllOwners((err, owners) => {
    if (err) {
      CBfunc(err);
    }
    owners.forEach(owner => {
      fetchCatsByOwner(owner, (err, array) => {
        if (err) {
          CBfunc(err);
        }
        let obj = {};
        obj[owner] = array;
        objArray.push(obj);
        if (objArray.length === owners.length) {
          CBfunc(null, objArray);
        }
      });
    });
  });
}

function kickLegacyServerUntilItWorks() {}

function buySingleOutfit() {}

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
