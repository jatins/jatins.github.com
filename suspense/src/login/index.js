require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

var Config = require('../Config');
var env = require('../env');

module.exports = {
    template: require('./template.html'),
    data: {
        
    },

    methods: {
    	submitForm: function() {
            console.log('pressed');
            var vm = this;

            vm.$parent.isLoading = 1;

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
                        localStorage.setItem('loggedIn', vm.username);
                        vm.$parent.currentView = 'payment';
                        vm.$parent.isLoading = 0;
                    }
                });
                
        }
    }
};








