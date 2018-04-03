var https = require('https');
var crypto = require('crypto');
var secret = require('./../credentials.js');
var easyimg = require('easyimage');
var fs=require('fs-extra');

var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;
var async= require('async');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
	secure: true, // use SSL
    auth: {
        user: secret.mail.email,
        pass: secret.mail.pass
    }
};
var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));



var getRandomInt = function (min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


setInterval(function(){checkCurrentSpecialProp()}, 1000*60*5);

function checkCurrentSpecialProp() {
	var now = Date.now();
	SpecialProp.find({}, 'durancy target', function(err ,reps){
		if(reps){
			reps.forEach(function(rep){
				if(rep.durancy < now) {
					console.log('deleting now...');
					if (rep.target.type === 'product') Product.update({_id: rep.target.id}, {$set: {isSpecialProp: 'false'}}).exec();
					else Product.update({'category.id': rep.target.id}, {$set: {isSpecialProp: 'false'}}, {multi: true}).exec();
					SpecialProp.findOne({_id: rep._id}).remove().exec();
				}
			});
		}
	});
}


var  formatDate = function(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day=date.getDate();
	var hour = date.getHours();
	var minute=date.getMinutes();
	var second=date.getSeconds();
	var thisMoment=year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second; 
	return thisMoment;
};

module.exports.formatDate = formatDate;

module.exports.writeLog = function (message, callback){
	var serverLog = __dirname + '/../serverlog.txt';
	var thisMoment = formatDate();
	var logData =" \r\n" + thisMoment + ' ' + message;
	fs.appendFile(serverLog, logData, function(err){
		callback();
	});
}

module.exports.sendEmail = function(address, subject, text, html){
	var mailOptions = {
		from: 'zakaz-teddy', // sender address
		to: address, // list of receivers
		subject: subject, // Subject line
		text: text, // plaintext body
		html: html // html body
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};


module.exports.generateSSID = function (login, callback) {
	var sessionItem;
	sessionItem = getRandomInt(1, 100000);
	sessionItem = login + sessionItem;
	var hashSession = crypto.createHmac('sha256', secret.secret)
						.update(sessionItem)
						.digest('hex');
	callback(hashSession);					
};


module.exports.getCommonData = function(data, fnCallback) {
	async.parallel([
		function(callback) { 
			Category.find({}).sort({rank: 1}).exec(function(err, rep){
				if(rep) data.category = rep;
				callback();
			});
		},
		function(callback){
			SpecialProp.findOne({}, function(err, rep){
				if(rep) data.specialProp = rep;
				callback();
			});
		},
		function(callback){
			fs.readdir(__dirname +'/../public/carousel/images',function(err, names){
				if(names) data.carousel = names;
				callback();
			})
		}
		], function(err) { 
			if(err) fnCallback(true, null);
			else fnCallback(null, true);
	});	
};

module.exports.fillTheCart = function(data, cart, callback){ /*this function fills the cart from the cookies to the view, which shows quantity of each product*/
	var index;
	var controlCartArray = []; /*added this array to control if products dublicate*/
	var counter = cart.length; /*added this to keep the moment when tle last product adds to data array*/
	cart.forEach(function(cartItem){
		Product.findOne({_id: cartItem}, function(err, rep){
			if (rep) {
				index = controlCartArray.indexOf(rep.name); /*check if current product doesnt dublicate in control array*/
					if (index === -1) { /*current product doesnt dublicate, so i add it to the cart and to the control array*/
						controlCartArray.push(rep.name);
						rep.howMany = 1;
						if(rep.isSpecialProp) 	rep.sumPrice = rep.discount;
						else rep.sumPrice = rep.price;
						rep.sumWeight = rep.weight;
						data.product.push(rep);						
					} else { /*current product dublicates so i search it in the cart and increment its quantity by 1*/
						for(var i=0; i < data.product.length; i++) {
							if (rep.name === data.product[i].name) {
								if (rep.isSpecialProp) data.product[i].sumPrice += rep.discount;
								else data.product[i].sumPrice += rep.price;
								data.product[i].sumWeight += rep.weight;
								data.product[i].howMany++;
							}	
						}
					}	
			}
			counter--;
			if(counter === 0) callback(); /*make callback when the last product adds to data array*/
		});	
	});
};

/*функция прверки капчи*/
var SECRET = "6LcfcUgUAAAAALRJmeb9ATTP0b50MrVakn5oFDnn";/*for remote-server*/
//var SECRET = "6Lc38CcTAAAAAAH9bGyt70CTNbSar1dTRnzQv3D3";/*for localhost*/

var verifyRecaptcha = function (key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
        var data = "";
        res.on('data', function (chunk) {
                        data += chunk.toString();
        });
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
};

module.exports.verifyRecaptcha = verifyRecaptcha;

module.exports.saveThumbImage = function(src, dst, files) {
	easyimg.resize({src: src, dst: dst, width:200, height:200}, function(err, stdout, stderr) {
				console.log('wait for resize result');
				if (err) {
					console.log("Error loading avatar");
					fs.unlink(files.upload.path, function(err){
						console.log("Error loading avatar");
					});
				} 
			}).then(
					function(img) {
						console.log('Resized: ' + img.width + ' x ' + img.height);
					},
					function (err) {
						console.log(err);
						fs.unlink(files.upload.path, function(err){
							console.log("Error resizing, source delete");
						});
					}
			);	
};

module.exports.saveMicroThumbImage = function(src, dst, files) {
	easyimg.resize({src: src, dst: dst, width:30, height:30}, function(err, stdout, stderr) {
				console.log('wait for resize result');
				if (err) {
					console.log("Error loading avatar");
					fs.unlink(files.upload.path, function(err){
						console.log("Error loading avatar");
					});
				} 
			}).then(
					function(img) {
						console.log('Resized: ' + img.width + ' x ' + img.height);
					},
					function (err) {
						console.log(err);
						fs.unlink(files.upload.path, function(err){
							console.log("Error resizing, source delete");
						});
					}
			);		
};

