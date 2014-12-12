require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

var Config = require('../Config');
var env = require('../env');

function generateBg() {
    document.addEventListener('touchmove', function (e) {
        e.preventDefault()
    })
    var c = document.getElementsByTagName('canvas')[0],
        x = c.getContext('2d'),
        pr = window.devicePixelRatio || 1,
        w = window.innerWidth,
        h = window.innerHeight,
        f = 90,
        q,
        m = Math,
        r = 0,
        u = m.PI*2,
        v = m.cos,
        z = m.random
    c.width = w*pr
    c.height = h*pr
    x.scale(pr, pr)
    x.globalAlpha = 0.6
    function i(){
        x.clearRect(0,0,w,h)
        q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}]
        while(q[1].x<w+f) d(q[0], q[1])
    }
    function d(i,j){   
        x.beginPath()
        x.moveTo(i.x, i.y)
        x.lineTo(j.x, j.y)
        var k = j.x + (z()*2-0.99)*f,
            n = y(j.y)
        x.lineTo(k, n)
        x.closePath()
        r-=u/-50
        x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
        x.fill()
        q[0] = q[1]
        q[1] = {x:k,y:n}
    }
    function y(p){
        var t = p + (z()*2-1.1)*f
        return (t>h||t<0) ? y(p) : t
    }
    document.onclick = i
    document.ontouchstart = i
    i()
}
            
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
        generateBg();

        this.$parent.current_user =  localStorage.getItem('loggedIn');
        if(this.$parent.current_user == 'abhishek' ||
            this.$parent.current_user == 'akhil' ||
            this.$parent.current_user == 'jatin'
            )
            this.trio = 1;
    }
};