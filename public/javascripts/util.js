var STORAGE_KEY = 'myweb-dev'

var userStorage = {
  fetch: function () {
    var users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    users.forEach(function (user, index) {
      user.id = index;
    });
    userStorage.uid = users.length;
    return users;
  },
  save: function (users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    userStorage.uid = users.length;
  }
}

var filters = {
  all: function(notes) {
    return notes;
  }
}
