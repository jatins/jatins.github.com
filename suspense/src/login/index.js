require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

module.exports = {
    template: require('./template.html'),
    data: {
        
    },
    methods: {
    	submitForm: function() {
            var vm = this;

    		console.log('hellllo');
            var obj = {
                username: vm.username,
                pwd: vm.pwd
            };
            
    		request
                .post('http://suspense.herokuapp.com/auth')
                .send(obj)
                .set('Accept', 'application/json')
                .end(function(res){
                    console.log('res');
                    if(res.text == 'ok') {
                        console.log('Succesfull Validation');
                        localStorage.setItem('loggedIn', vm.username);
                        vm.$parent.currentView = 'payment';
                    }
                });
    	}
    }
};