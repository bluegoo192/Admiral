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
  created: function () {
    this.$http.post('http://localhost:3000/deductUser', {user: this.users}).then((response) => {
      console.log(response.body.bucks);
    }, (response) => {
    });
  },
  methods: {
    get: function () {
      // GET /someUrl
      this.$http.post('http://localhost:3000/getUser', {user: this.users}).then((response) => {
        console.log(response.body.bucks);
      }, (response) => {
      });
    },
    add: function () {
      this.$http.post('http://localhost:3000/addUser', {user: this.users}).then((response) => {
        console.log(response.body.bucks);
      }, (response) => {
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
});
