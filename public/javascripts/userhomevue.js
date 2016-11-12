Vue.component('adbox', {
  template: '<div class="ad">\
              <p>Loading...</p>\
            </div>'
})

var app = new Vue({
  el: '#app',
  data: {
    username: 'test name',
    balance: 5,
    viewingAdStream: false,
    ads: []
  },
  methods: {
    viewAdStream: function () {
      this.viewingAdStream = true;
    },
    exitAdStream: function () {
      this.viewingAdStream = false;
    }
  }
})
