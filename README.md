Chrome extension for creating a personal dictionary.

```
// Steps to restore local storage.

const dict = [{}, {}, ....];
const restore = {};
dict.forEach((item) => {
	restore[item.term] = item;
});
chrome.storage.local.set({ 'personal_dictionary': restore }, function (){
    return true;
});
```