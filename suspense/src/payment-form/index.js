require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

var Config = require('../Config');
var env = require('../env');

module.exports = {
    template: require('./template.html'),
    data: {
        paidTo: {
            abhishek: 0,
            akhil: 0,
            jatin: 0,
            ankita: 0
        },
        validation: {
            reason : false
        }, 
        reason: '',
        trio: 0,
        recipeMsg: "Recipes are quick way to split money. Just click one below to auto-split."
    },

    filters: {
        reasonValidator: function (val) {
            this.validation.reason = !!val
            return val;
        }
    },

    methods: {
    	logout: function() {
            current_user: localStorage.removeItem('loggedIn');
            this.$parent.currentView = 'login';
        },

        details: function() {
            this.$parent.currentView = 'logs';
        },
        
        submit: function() {
            var vm = this;
            vm.$parent.isLoading = 1;

            vm.$parent.showMsg = 1;


            var amount = parseInt(this.amount),
                abhishek = parseInt(this.paidTo.abhishek),
                akhil = parseInt(this.paidTo.akhil),
                jatin = parseInt(this.paidTo.jatin),
                ankita = parseInt(this.paidTo.ankita);

            console.log(abhishek);

            var obj = {
                "amount": amount,
                "paidBy": this.$parent.current_user,
                "paidTo": {
                    "akhil" : akhil,
                    "abhishek" : abhishek,
                    "ankita" : ankita,
                    "jatin" : jatin
                },
                "paidOnDate": moment(),
                "reason": this.reason
            };

            if(vm.reason == '') {
                vm.$parent.showMsg = 1;
                vm.$parent.msg = 'REASON kaun dega?!';
                vm.$parent.isLoading = 0;

                setInterval(function(){
                    vm.$parent.showMsg = 0;
                    vm.$parent.msg = ''; 
                }, 2000);
            }
            else if(amount != abhishek + akhil + ankita + jatin) {
                alert("Sum not equal to parts");
                vm.$parent.isLoading = 0;
            }
            else {
                request
                .post(Config[env.Current_Environment]['server_url'] + 'payment')
                .send(obj)
                .set('Accept', 'application/json')
                .end(function(res){
                    console.log('res');
                    if(res.text == 'ok') {
                        vm.clearFields();
                        vm.$parent.showMsg = 1;
                        vm.$parent.msg = 'Done!';

                        setInterval(function(){
                            vm.$parent.showMsg = 0;
                            vm.$parent.msg = ''; 
                        }, 2000);
                    } else {
                        vm.$parent.showMsg = 1;
                        vm.$parent.msg = 'Error. Please try again after some time.';

                        setInterval(function(){
                            vm.$parent.showMsg = 0;
                            vm.$parent.msg = ''; 
                        }, 2000);
                    }
                    
                    vm.$parent.isLoading = 0;

                });
            }

        },

        clearFields: function() {
            var vm = this;
            vm.amount = '';
            vm.paidTo.abhishek = 0;
            vm.paidTo.akhil = 0;
            vm.paidTo.jatin = 0;
            vm.paidTo.ankita = 0;
            
            vm.validation.reason = false;
            
            vm.reason =  '';
        }, 

        threeWaySplit: function() {
            console.log('threeWay');
            var vm = this;
            vm.paidTo.abhishek = vm.paidTo.jatin = Math.round(vm.amount/3);
            vm.paidTo.akhil = vm.amount - (vm.paidTo.abhishek + vm.paidTo.jatin);
        }
    },

    attached: function() {
        this.$parent.current_user =  localStorage.getItem('loggedIn');
        if(this.$parent.current_user == 'abhishek' ||
            this.$parent.current_user == 'akhil' ||
            this.$parent.current_user == 'jatin'
            )
            this.trio = 1;
    }
};