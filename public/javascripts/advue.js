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
    this.$http.post('/getAllAds', {user: this.users[0], height: height, width: width}).then((response) => {
      var index = Math.floor(Math.random() * (response.body.length));
      this.ad = response.body[index];
      if (host) {
        this.$http.post('/addUser1', {id: host}).then((response3) => {
        }, (response) => {
        });
      }
      if (this.users != null && this.users.length > 0) {
        this.$http.post('/getUser', {user: this.users[0]}).then((response) => {
          this.$http.post('/deductUser', {user: this.users[0]}).then((response2) => {
            if (response.body.bucks < 1 || response.body.show_by_default || show) {
              this.add();
            }
          }, (response) => {
          });
        }, (response) => {
        });
      } else {
        console.log("user not here");
        this.add();
      }
    }, (response) => {
    });
  },
  methods: {
    get: function () {
      // GET /someUrl
      this.$http.post('/getUser', {user: this.users[0]}).then((response) => {
        console.log(response.body.bucks);
      }, (response) => {
      });
    },
    add: function () {
     if (!this.seen) {
        this.seen = true;
        if (this.users != null && this.users.length > 0) {
          this.$http.post('/addUser', {user: this.users[0]}).then((response2) => {
            this.$el.style.backgroundImage = "url(" + this.ad.ad_url + ")";
            this.$el.innerHTML = "";
            this.$http.post('/deductUser2', {id: this.ad.ownerId}).then((response4) => {
            }, (response) => {
            });
          }, (response) => {
          });
        } else {
          this.$el.style.backgroundImage = "url(" + this.ad.ad_url + ")";
          this.$el.innerHTML = "";
        }
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
