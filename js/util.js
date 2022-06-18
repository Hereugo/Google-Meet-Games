function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// COMPONENTS FOR WORKING WITH CHROME STORAGE
const getStorageData = keys =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(keys, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )
// const { data } = await getStorageData(['data'])

const setStorageData = data =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )
// await setStorageData({ data: [someData] })

function onReady(parent, element, callback) {
  if ($(element)[0]) {
    callback();
    return;
  }

  const readyObserver = new MutationObserver(function (_mutations, me) {
    if ($(element)[0]) {
      try {
        callback();
        me.disconnect();
      }
      catch(e) {
        me.disconnect();
      }
    }
  });
  readyObserver.observe($(parent)[0], {
    childList: true,
    subtree: true,
  });
}

String.prototype.format = function () {
  // store arguments in an array
  var args = arguments;
  // use replace to iterate over the string
  // select the match and check if related argument is present
  // if yes, replace the match with the argument
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};

function randomElement(arr) {
  let i = Math.floor(Math.random() * arr.length);
  return [arr[i], i];
}