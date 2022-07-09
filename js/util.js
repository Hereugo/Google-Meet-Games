/**
 * Sleep function, takes a number of milliseconds. Useful for delaying
 * execution of a function.
 * 
 * @param {number} ms Number of milliseconds to sleep.
 * @returns {Promise} Promise that resolves after the sleep period.
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Retreives values of keys from chrome sync storage.
 * 
 * Example: const { data } = await getStorageData(['data'])
 * 
 * @param {array} keys Array of keys to be retreived from the chrome sync storage. 
 * @returns {Promise} Promise that resolves with an object containing the values of the keys.
 */
function getStorageData(keys) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get(keys, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  );
}


/**
 * Saves values to chrome sync storage. If the key exists, it will be overwritten.
 * 
 * Example: await setStorageData({ 'data': 'value' })
 * 
 * @param {object} data Object containing the data to be stored in chrome sync storage. 
 * @returns {Promise} Promise that resolves when the data is stored.
 */
function setStorageData(data) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  );
}

/**
 * Wait until the element is ready, then execute the callback.
 * 
 * @param {string} parent Parent of the element to be searched. 
 * @param {string} element Element to be searched.
 * @param {function} callback Function to call when the element is found.
 * @returns 
 */
function onReady(parent, element, callback) {
  if ($(element)[0]) {
    callback();
    return;
  }

  const readyObserver = new MutationObserver(function (_mutations, me) {
    if ($(element)[0]) {
      try {
        callback();
      } finally {
        me.disconnect();
      }
    }
  });
  readyObserver.observe($(parent)[0], {
    childList: true,
    subtree: true,
  });
}

/**
 * Chooses a random element from an array.
 * 
 * @param {array} arr Array from which to retreive the element.
 * @returns {array} Returns the element and position in the array.
 */
function randomElement(arr) {
  let i = Math.floor(Math.random() * arr.length);
  return [arr[i], i];
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
