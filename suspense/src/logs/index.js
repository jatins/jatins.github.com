require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

var Config = require('../Config');
var env = require('../env');

module.exports = {
    template: require('./template.html'),
    data: function() {
      return {
        users: [
       		{name: 'abhishek'},
       		{name: 'akhil'},
       		{name: 'jatin'},
       		{name: 'ankita'}
        ], 
        selected_user: ' - ',
        net : ' --- '
      };
    },

    inherit: true,
    
    methods: {
      goToHome: function() {
        this.currentView = 'payment'
      },

    	getDetails: function(second) {

        var vm = this;
        vm.selected_user = second;

    		var first = this.current_user;
    		console.log(first);
    		console.log(second);

    		var url = Config[env.Current_Environment]['server_url'] + 'logs/' + first + '/' + second;
    		
    		request.get(url)
    			.end(function(res){
    				console.log(res);
            vm.consumption = res.body.consumption;
            vm.expenditure = res.body.expenditure;

            var totalC = 0, totalE = 0;
            vm.expenditure.forEach(function(el, index){
              totalE += el.paidTo[second];
            })

            vm.consumption.forEach(function(el, index){
              console.log(vm.current_user);
              totalC += el.paidTo[vm.current_user];
            })

            console.log(totalC);
            console.log(totalE);

            vm.net = totalC - totalE;
    			})
    	}
    }

};