Vue.component('adbox', {
  props: ['ad'],
  template: '<iframe src="http://admiralads.azurewebsites.net/ad?width=400px&height=400px&show=true" style="height:400px;width:400px;"></iframe>'
})

Vue.component('galleryad', {
  props: ['ad'],
  template: '<div class="galleryad">\
              <a :href="ad.ad_src" target="_blank"><div class="center img" :style="{ \'background-image\': \'url(\' + ad.ad_url + \')\', \'background-size\': contain}" /></a>\
              <p>{{ ad.ad_name }}</p>\
              <button class="deleteAd" @click="deleteAd(ad)">X</button>\
            </div>',
  methods: {
    deleteAd: function(ad) {
      this.$http.post('/deleteAd', { username: userStorage.fetch()[0], name: ad.ad_name, url: ad.ad_url, src: ad.ad_src }).then((response) => {
      }, (response) => {
        console.log(response);
      });
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    users: userStorage.fetch(),
    username: userStorage.fetch()[0].username,
    id: userStorage.fetch()[0].id,
    balance: 0,
    viewingAdStream: false,
    ads: [],
    myads: [],
    dollars: 0,
    adStreamInterval: 10,
    adStreamStatus: 0,
    adStreamTickLength: 500,
    adsPerPage: 6,
    showExpanded: false,
    showExpandedProfile: false,
    captcha1: 0,
    captcha2: 0,
    captchaOperation: "+",
    captchaAnswer: 0,
    uploading: false,
    embed_code: '<iframe src="http://admiralads.azurewebsites.net/ad?width=400px&height=400px&host=' + this.id + '" style="height:400px;width:400px;border:1px solid black;"></iframe>',
    view: 'gallery'
  },
  computed: {
    inAdStream: function () { return this.view == 'adstream'; },
    inAdAd: function () { return this.view == 'adad'; },
    inEmbed: function () { return this.view == 'embed'; },
    inGallery: function () { return this.view == 'gallery'; },
    computedTimerWidth: function () {
      var percent = (this.adStreamStatus / this.adStreamInterval) * 100;
      if (percent > 99) {
        var modal = this.$refs.myModal;
        if (modal.style.display != "block") {
          var span = this.$refs.close;
          modal.style.display = "block";
          // this.captcha1 = Math.floor((Math.random() * 100) + 1);
          // this.captcha2 = Math.floor((Math.random() * 100) + 1);
          // var operation = Math.floor((Math.random() * 3) + 1);
          // switch(operation) {
          //   case 1:
          //     this.captchaOperation = "+";
          //     this.captchaAnswer = this.captcha1 + this.captcha2;
          //     break;
          //   case 2:
          //     this.captchaOperation = "-";
          //     this.captchaAnswer = this.captcha1 - this.captcha2;
          //     break;
          //   case 3:
          //     this.captchaOperation = "*";
          //     this.captchaAnswer = this.captcha1 * this.captcha2;
          //     break;
          // }
        }
      }
      return percent;
    }
  },
  created: function () {
    // if (view != "") {
    //   this.view = view;
    // }
    if (user) {
      userStorage.save([user]);
    }
    this.users = userStorage.fetch();
    this.username = userStorage.fetch()[0].username;
    this.id = userStorage.fetch()[0]._id;
    this.updateBalance();
    this.getAds();
    this.updateDollars();
    this.embed_code = '<iframe src="http://admiralads.azurewebsites.net/ad?width=400px&height=400px&host=' + this.username + '" style="height:400px;width:400px;border:1px solid black;"></iframe>'
    window.setInterval(() => {
      if ((this.adStreamStatus / this.adStreamInterval) * 100 < 99) {
        this.adStreamStatus = this.adStreamStatus + (this.adStreamTickLength / 1000);
      }
    }, this.adStreamTickLength);
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
    transferMoney: function () {
      if (this.balance >= 10) {
        this.$http.post('/transferMoney', { user: userStorage.fetch() }).then((response) => {
          this.dollars = response.body.dollars.toFixed(3);
          console.log(this.dollars);
        }, (response) => {
        });
      }
    },
    updateBalance: function () {
      this.$http.post('/getUser', { user: userStorage.fetch() }).then((response) => {
        this.balance = response.body.bucks;
      }, (response) => {
        console.log(response);
      });
    },
    updateDollars: function () {
      this.$http.post('/dollars', { user: userStorage.fetch() }).then((response) => {
        this.dollars = response.body.dollars.toFixed(3);
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
    captchaCheck: function(response) {
      // var secretKey = "6LeRkxsUAAAAABNvCJkbh0JgWclD2mSyDpT2L41C";
      // var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + response;
      // this.$http.post(verificationUrl).then((response) => {
        var modal = this.$refs.myModal;
        modal.style.display = "none";
        this.viewAdStream();
        percent = 0;
        this.adStreamStatus = 0;
        grecaptcha.reset();
      // });
    },
    logOut: function () {
      userStorage.save([]);
    },
    autoselect: function (event) {
      event.target.focus();
      var range = document.createRange();
      range.selectNode(event.target);
      window.getSelection().addRange(range);
      document.execCommand('copy');
    },
    getActive: function (link) {
      return true;
    }
  },
  watch: {
    view: function () {
      this.updateBalance();
    },
    showExpanded: function () {
      this.updateBalance();
    }
  }
})
