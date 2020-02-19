let dictionary = [];

fetch('http://localhost:5555/personal_dictionary', {
  method: 'get',
}).then(function (response) {
  return response.json();
}).then(function (data) {
  dictionary = data;
  setCard();
});

function setCard() {
  const word = getRandomWord();
  $("#term > p").text(word.term);
  $("#definition > p").html("Definiton: " + word.def + "<br />" + "Description: " + (word.notes || "NA") + "<br />" + "Tags: " + (word.tags.join(",") || "NA"));
}

function getRandomWord() {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}

$(document).keydown(function (eventObject) {
  switch (eventObject.keyCode) {
    case 37:
      setCard();
      $("#definition > p").attr('class', 'hide-definition');
      break;
    case 39:
      setCard();
      $("#definition > p").attr('class', 'hide-definition');
      break;
    case 38:
      $("#definition > p").attr('class', 'hide-definition');
      break;
    case 40:
      $("#definition > p").attr('class', 'show-definition');
      break;
  }
});