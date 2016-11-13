var app = new Vue({
  el: '#app',
  data: {
    message: 'hi'
  },
  created: function () {
    if (userStorage.fetch()[0]) {
      console.log("user logged");
      window.location = "http://admiralads.azurewebsites.net/userhome";
    }
  },
  methods: {
    login: function () {
      console.log('hi');
    }
  }
})
