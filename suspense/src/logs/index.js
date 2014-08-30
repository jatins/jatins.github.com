require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

module.exports = {
    template: require('./template.html'),
    data: {
       users: [
       		{name: 'abhishek'},
       		{name: 'akhil'},
       		{name: 'jatin'},
       		{name: 'ankita'}
       ], 
       selected_user: 'X',
       net : 'XXX'
    },
    
    methods: {
      goToHome: function() {
        this.$parent.currentView = 'payment'
      },

    	getDetails: function(second) {

        var vm = this;
        vm.selected_user = second;

    		var first = this.$parent.current_user;
    		console.log(first);
    		console.log(second);

    		var url = 'http://suspense.herokuapp.com/logs/' + first + '/' + second;
    		
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
              console.log(vm.$parent.current_user);
              totalC += el.paidTo[vm.$parent.current_user];
            })

            console.log(totalC);
            console.log(totalE);

            vm.net = totalC - totalE;
    			})
    	}
    }

};