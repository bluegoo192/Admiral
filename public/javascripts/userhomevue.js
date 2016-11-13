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

Vue.component('galleryad', {
  props: ['ad'],
  template: '<a :href="ad.ad_url" target="_blank"><div class="galleryad">\
              <img :src="ad.ad_url" />\
              <p>{{ ad.ad_name }}</p>\
            </div></a>'
})

var app = new Vue({
  el: '#app',
  data: {
    users: userStorage.fetch(),
    username: userStorage.fetch()[0],
    balance: 0,
    viewingAdStream: false,
    ads: [],
    myads: [],
    adsPerPage: 5,
    showExpanded: false,
    showExpandedProfile: false,
    uploading: false,
    view: 'home'
  },
  created: function () {
    this.updateBalance();
    this.getAds();
  },
  methods: {
    viewAdStream: function () {
      this.updateBalance();
      this.view = 'adstream';
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
      this.updateBalance();
      this.view = 'home';
    },
    updateBalance: function () {
      this.showExpanded = false;
      this.showExpandedProfile = false;
      this.$http.post('http://localhost:3000/getUser', { user: userStorage.fetch() }).then((response) => {
        this.balance = response.body.bucks;
        console.log(this.balance);
      }, (response) => {
        console.log(response);
      });
    },
    toggleExpandedBalance: function() {
      this.updateBalance();
      this.showExpanded = !this.showExpanded;
    },
    showMyAds: function () {
      this.updateBalance();
      this.view = 'gallery';
    },
    getAds: function() {
      this.$http.post('http://localhost:3000/getUserAds', { user: userStorage.fetch() }).then((response) => {
        this.myads = response.body;
      }, (response) => {
        console.log(response);
      });
    },
    autoselect: function (event) {
      event.target.focus();
      var range = document.createRange();
      range.selectNode(event.target);
      window.getSelection().addRange(range);
      document.execCommand('copy');
    }
  }
})
