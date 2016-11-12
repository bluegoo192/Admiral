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

var ad = new Vue({
  el: '#ad',
  data: {
    message: 'Show Ad',
    users: userStorage.fetch()
  },
  methods: {
    test: function () {
      // GET /someUrl
      this.$http.get('http://localhost:3000/test').then((response) => {
        console.log(response);
      }, (response) => {
        // error callback
      });
    }
  },
  watch: {
    users: {
      handler: function (users) {
        userStorage.save(users);
        console.log('saved!');
      },
      deep: true
    }
  }
})
