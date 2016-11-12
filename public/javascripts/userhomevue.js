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

Vue.component('adbox', {
  props: ['ad'],
  template: '<div class="ad" :style="ad.size">\
              <iframe src="http://localhost:3000/ad" ></iframe>\
            </div>'
})

var app = new Vue({
  el: '#app',
  data: {
    users: userStorage.fetch(),
    username: userStorage.fetch()[0],
    balance: 0,
    viewingAdStream: false,
    ads: [],
    adsPerPage: 5
  },
  created: function () {
    this.$http.post('http://localhost:3000/getUser', { user: userStorage.fetch() }).then((response) => {
      console.log(JSON.stringify(response));
      this.balance = response.body.bucks;
    }, (response) => {
      console.log(response);
    });
  },
  methods: {
    viewAdStream: function () {
      this.viewingAdStream = true;
      this.ads = [];
      for (var i=0; i<this.adsPerPage; i++) {
        this.$http.get('http://localhost:3000/getAd').then((response) => {
          console.log(JSON.stringify(response.body));
          this.ads.push({
            size: {
              width: response.body.width,
              height: response.body.height
            }
          });
        }, (response) => {
          console.log('error');
        });
      }
    },
    exitAdStream: function () {
      this.viewingAdStream = false;
    }
  }
})
