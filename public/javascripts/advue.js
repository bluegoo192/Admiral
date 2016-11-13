var ad = new Vue({
  el: '#ad',
  data: {
    message: 'Show Ad',
    users: userStorage.fetch(),
    seen: false,
    ad: [],
    styleObject: {
      width: width,
      height: height
    }
  },
  created: function () {
    this.$http.post('/getAllAds', {user: this.users}).then((response) => {
      var index = Math.floor(Math.random() * (response.body.length));
      this.ad = response.body[index];
    }, (response) => {
    });
    if (host) {
      this.$http.post('/addUser1', {user: host}).then((response3) => {
      }, (response) => {
      });
    }
    this.$http.post('/getUser', {user: this.users}).then((response) => {
      this.$http.post('/deductUser', {user: this.users}).then((response2) => {
        if (response.body.bucks < 1 || response.body.show_by_default || show) {
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
      this.$http.post('/getUser', {user: this.users}).then((response) => {
        console.log(response.body.bucks);
      }, (response) => {
      });
    },
    add: function () {
      if (!this.seen) {
        this.seen = true;
          this.$http.post('/addUser', {user: this.users}).then((response2) => {
            this.$el.style.background = "url(" + this.ad.ad_url + ") no-repeat center center";
            this.$el.innerHTML = "";
            this.$http.post('/deductUser2', {user: this.ad.user}).then((response4) => {
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
