require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

var Config = require('../Config');
var env = require('../env');

function loginUser(name) {
  console.log('name '+name);
  localStorage.setItem('loggedIn', name);
  this.current_user = name;
  this.currentView = 'payment';
}

function showMsg(msg) {
  this.showMsg = 1;  //this == ViewModel instance
  this.msg = 'Woops. Invalid username/pwd.';

  setInterval(function(){
    this.showMsg = 0;
    this.msg = ''; 
  }, 2500);
}

module.exports = {
  template: require('./template.html'),
  data: function () {
    return {};
  },

  inherit: true,

  methods: {
    submitForm: function() {
      console.log('pressed');
      var vm = this;

      vm.isLoading = 1;

      var obj = {
        username: vm.username,
        pwd: vm.pwd
      };

      console.log(Config[env.Current_Environment]['server_url'] + 'auth');
      request
      .post(Config[env.Current_Environment]['server_url'] + 'auth')
      .send(obj)
      .set('Accept', 'application/json')
      .end(function(res){
        console.log('res');
        if(res.text == 'ok') {
          console.log('Succesfull Validation');
          loginUser.call(vm, vm.username);
        }
        else {
          showMsg.call(vm, 'Woops. Invalid username/pwd.');
        }

        vm.isLoading = 0;

      });
    },

  /*loginWithFb: function() {
    FB.login(function(response) {
     if (response.authResponse) {
       console.log('Welcome!  Fetching your information.... ');
       FB.api('/me', function(response) {
         console.log('Good to see you, ' + response.name + '.');
       });
     } else {
       console.log('User cancelled login or did not fully authorize.');
     }
   }, {scope: 'public_profile,email'});
  },

  checkLoginState: function () {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }*/

  },

  beforeCompile: function () {
    /*var appId = '339539406246085';

    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
      console.log('statusChangeCallback');
      console.log(response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('Please log into this app.');
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Please log into FB.');
        
      }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    window.checkLoginState = function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }

    window.fbAsyncInit = function() {
      FB.init({
        appId      : appId,
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });

      // Now that we've initialized the JavaScript SDK, we call 
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.

      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });

    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log(response);
        console.log('Thanks for logging in, ' + response.name + '!');
        localStorage.setItem('loggedIn', response.first_name.toLowerCase());
        this.$parent.currentView = 'payment';
      });
    }*/
  }
};
