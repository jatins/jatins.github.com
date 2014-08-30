require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

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
        reason: ''
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

            if(amount != abhishek + akhil + ankita + jatin)
                alert("Sum not equal to parts");
            else {
                request
                .post('http://localhost:5000/payment')
                .send(obj)
                .set('Accept', 'application/json')
                .end(function(res){
                    console.log('res');
                    if(res.text == 'ok') {
                        alert("DONE.");
                    }
                });
            }

        }
    },

    attached: function() {
        this.$parent.current_user =  localStorage.getItem('loggedIn')
    }
};