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
    users: userStorage.fetch(),
    seen: false,
    ad: [],
    styleObject: {
      width: "600px",
      height: "400px"
    }
  },
  created: function () {
    this.$http.post('http://localhost:3000/getUser', {user: this.users}).then((response) => {
      this.$http.post('http://localhost:3000/deductUser', {user: this.users}).then((response2) => {
        if (response.body.bucks < 1 || response.body.show_by_default) {
          this.add();
        }
      }, (response) => {
      });
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
      if (!this.seen) {
        this.seen = true;
        this.$http.post('http://localhost:3000/getAllAds', {user: this.users}).then((response) => {
          this.$http.post('http://localhost:3000/addUser', {user: this.users}).then((response2) => {
            var index = Math.floor(Math.random() * (response.body.length));
            this.ad = response.body[index];
            this.$el.style.background = "url(" + this.ad.ad_url + ") no-repeat center center";
            this.$el.innerHTML = "";
          }, (response) => {
          });
        }, (response) => {
        });
      } else {
        window.open(this.ad.ad_src);
      }
    },
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
