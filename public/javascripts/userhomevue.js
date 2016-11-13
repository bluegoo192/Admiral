Vue.component('adbox', {
  props: ['ad'],
  template: '<div class="ad" :style="ad.size">\
              <iframe src="http://localhost:3000/ad" ></iframe>\
            </div>'
})

Vue.component('galleryad', {
  props: ['ad'],
  template: '<div class="galleryad">\
              <a :href="ad.ad_url" target="_blank"><img :src="ad.ad_url" /></a>\
              <p>{{ ad.ad_name }}</p>\
              <button @click="deleteAd(ad)">Delete Ad </button>\
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
    myads: [],
    adsPerPage: 5,
    showExpanded: false,
    showExpandedProfile: false,
    uploading: false,
    embed_code: "<iframe src='http://localhost:3000/ad' style='height:400px;width:600px;border:0 none;'></iframe>",
    view: 'home'
  },
  created: function () {
    if (user) {
      userStorage.save([user]);
    }
    this.users = userStorage.fetch();
    this.username = userStorage.fetch()[0];
    this.updateBalance();
    this.getAds();
  },
  methods: {
    viewAdStream: function () {
      this.updateBalance();
      this.view = 'adstream';
      this.ads = [];
      for (var i=0; i<this.adsPerPage; i++) {
        this.$http.get('/getAd').then((response) => {
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
      this.$http.post('/getUser', { user: userStorage.fetch() }).then((response) => {
        this.balance = response.body.bucks;
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
      this.$http.post('/getUserAds', { user: userStorage.fetch() }).then((response) => {
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
    },
    deleteAd: function(ad) {
      this.$http.post('/deleteAd', { username: this.username, name: ad.ad_name, url: ad.ad_url, src: ad.ad_src }).then((response) => {
      }, (response) => {
        console.log(response);
      });
    }
  }
})
