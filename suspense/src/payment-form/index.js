require('insert-css')(require('./style.css'))
var request = require('superagent');
var moment = require('moment');

var Config = require('../Config');
var env = require('../env');

function showMsg(message) {
    var self = this;
    this.showMsg = 1;
    this.msg = message;

    setInterval(function(){
        self.showMsg = 0;
        self.msg = ''; 
    }, 2000);   
}

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
        var k = j.x + (z()*2-0.50)*f,
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
    data: function() {
        return {
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
        };
    },

    inherit: true,

    filters: {
        reasonValidator: {
            write: function (val) {
                this.validation.reason = !!val
                return val;
            }
        },
    },

    methods: {
    	logout: function() {
            current_user: localStorage.removeItem('loggedIn');
            this.currentView = 'login';
        },

        details: function() {
            this.currentView = 'logs';
        },
        
        submit: function() {
            var vm = this;
            vm.isLoading = 1;

            vm.showMsg = 1;


            var amount = parseInt(this.amount),
                abhishek = parseInt(this.paidTo.abhishek),
                akhil = parseInt(this.paidTo.akhil),
                jatin = parseInt(this.paidTo.jatin),
                ankita = parseInt(this.paidTo.ankita);


            var obj = {
                "amount": amount,
                "paidBy": this.current_user,
                "paidTo": {
                    "akhil" : akhil,
                    "abhishek" : abhishek,
                    "ankita" : ankita,
                    "jatin" : jatin
                },
                "paidOnDate": moment(),
                "reason": this.reason
            };

            console.log(obj);

            if(vm.reason == '') {
                vm.isLoading = 0;
                console.log("NO REASON")
                showMsg.call(vm, 'REASON kaun dega?!');

            }
            else if(amount != abhishek + akhil + ankita + jatin) {
                vm.isLoading = 0;
                alert("Sum not equal to parts");
            }
            else {
                request
                .post(Config[env.Current_Environment]['server_url'] + 'payment')
                .send(obj)
                .set('Accept', 'application/json')
                .end(function(res){
                    vm.isLoading = 0;
                    console.log('res');
                    if(res.text == 'ok') {
                        vm.clearFields();
                        showMsg.call(vm, 'Done!');
                    } else {
                        showMsg.call(vm, 'Error. Please try again after some time.');
                    }
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
        console.log(this);
        console.log("Current_User: "+ localStorage.getItem('loggedIn'));
        this.current_user =  localStorage.getItem('loggedIn');

        if(this.current_user == 'abhishek' ||
            this.current_user == 'akhil' ||
            this.current_user == 'jatin'
            )
            this.trio = 1;
    }
};