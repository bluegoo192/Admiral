var app = new Vue({
  el: '#app',
  data: {
    message: 'hi'
  },
  created: function () {
    if (userStorage.fetch()[0]) {
      console.log("user logged");
      window.location = "localhost:3000/userhome";
    }
  },
  methods: {
    login: function () {
      console.log('hi');
    }
  }
})
