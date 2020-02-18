let autocompleteOptions = {
  data: [],
  getValue: "term",
  list: {
    onClickEvent: function () {
      var data = $("#term").getSelectedItemData();
      $("#term").val(data.term);
      $("#def").val(data.def);
      $("#tags").val(data.tags.join(","));
      $("#notes").val(data.notes);
    }
  }
};

chrome.runtime.sendMessage({ cmd: "viewDictCmd" }, function ({ result, error }) {
  if (error) {
    alert(error);
    return;
  }
  autocompleteOptions.data = Object.values(result);
  $("#term").easyAutocomplete(autocompleteOptions);
});

$("#submit-button").click(function (event) {

  event.preventDefault();

  const term = $("#term").val();
  const def = $("#def").val();
  if (term == "" || def == "") {
    alert("Fields are empty.");
    return;
  }
  const tags = $("#tags").val().split(",");
  const notes = $("#notes").val();
  const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const newDictItem = {
    cmd: "newDictCmd",
    data: {
      term,
      def,
      tags,
      notes,
      time
    }
  };

  chrome.runtime.sendMessage(newDictItem, function ({ result, error }) {
    if (error) {
      alert(error);
      return;
    }
    $("#word_count").text(result);
    $('form').fadeOut(0);
    $('.wrapper').addClass('form-success');
  });

});

$("#sync").click(function (event) {
  alert('ok');
});

$("#view").click(function (event) {
  chrome.runtime.sendMessage({ cmd: "viewDictCmd" }, function ({ result, error }) {
    if (error) {
      alert(error);
      return;
    }
    alert(JSON.stringify(result));
  });
});

$("#clear_local").click(function (event) {
  chrome.runtime.sendMessage({ cmd: "clearLocalCmd" }, function ({ result, error }) {
    if (error) {
      alert(error);
      return;
    }
    alert("Cleared");
  });
});

$("#back").click(function (event) {
  location.reload();
});