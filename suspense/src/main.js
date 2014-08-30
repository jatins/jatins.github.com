require('insert-css')(require('./app.css'))
var Vue = require('vue');
var _ = require('underscore');


var app = new Vue({
    el: '#app',
    components: {
    	login: require('./login'),
        payment: require('./payment-form'),
        logs: require('./logs')
    },
    // require html enabled by the partialify transform
    // template: require('./app.html'),
    data: {
    	currentView: 'login',
        title: 'Suspense',
        current_user: '',
        isLoading: 0,
    },

    created: function() {
        if(localStorage.getItem('loggedIn'))
            this.currentView = 'payment';
    },


});