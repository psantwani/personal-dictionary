setup();

chrome.extension.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.cmd == "newDictCmd") {
      addTermToDictionary(request.data, function (result) {
        if (result == "exists") {
          sendResponse({ result, error: "Term already exists." });
        }
        sendResponse({ result, error: null });
      });
    } else if (request.cmd == "clearLocalCmd") {
      clearDict(function (result) {
        sendResponse({ result, error: null });
      });
    } else if (request.cmd == "viewDictCmd") {
      getDictionary(function (result) {
        sendResponse({ result, error: null });
      });
    } else {
      sendResponse({ result: null, error: "Something went wrong." });
    }
    return true;
  });

function setup() {
  chrome.storage.local.get(['personal_dictionary_extension'], function (result) {
    if (!result.personal_dictionary_extension) {
      chrome.storage.local.set({ 'personal_dictionary_extension': {} }, function () {
        console.log('personal_dictionary_extension storage object set');
      });
    }
  });
}

function addTermToDictionary(input, cb) {
  const key = input.term;
  getTermFromDictionary(input.term, function (data) {
    /** Disabling exists check
    if (data.exists) {
      return cb("exists");
    }
     */
    let dict = data.dict;
    let storage = {};
    let newStorageItem = {};
    newStorageItem[key] = input;
    console.log(data);
    storage['personal_dictionary'] = Object.assign(dict, newStorageItem);
    sync(input, function () {
      chrome.storage.local.set(storage, function () {
        return cb(Object.keys(dict).length);
      });
    })
  });
}

function getTermFromDictionary(term, cb) {
  getDictionary(function (dict) {
    return cb({
      dict,
      exists: dict[term]
    });
  });
}

function getDictionary(cb) {
  chrome.storage.local.get('personal_dictionary', function (result) {
    return cb(result.personal_dictionary || {});
  });
}

function clearDict(cb) {
  chrome.storage.local.set({ 'personal_dictionary': {} }, function () {
    return cb("ok");
  });
}

function sync(input, cb) {
  fetch(`http://localhost:5555/personal_dictionary?term=${input.term}`)
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.length) {
        return updateServer(data[0].id, input, cb);
      } else {
        return addToServer(input, cb);
      }
    });
}

function addToServer(input, cb) {
  fetch('http://localhost:5555/personal_dictionary', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    return cb("ok");
  });
}

function updateServer(id, input, cb) {
  fetch(`http://localhost:5555/personal_dictionary/${id}`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    return cb("ok");
  });
}