var Callback = require('./models/mongoModel.js').Callback;
var Admin = require('./models/mongoModel.js').Admin;
var Session = require('./models/mongoModel.js').Session;
var Feedback = require('./models/mongoModel.js').Feedback;
var Category = require('./models/mongoModel.js').Category;
var Product=require('./models/mongoModel.js').Product;
var Order=require('./models/mongoModel.js').Order;
var Review=require('./models/mongoModel.js').Review;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;

var customFunctions = require('./customfunctions');
var writeLog=customFunctions.writeLog;
var verifyRecaptcha = customFunctions.verifyRecaptcha;
var saveThumbImage = customFunctions.saveThumbImage;
var saveMicroThumbImage=customFunctions.saveMicroThumbImage;
var generateSSID = customFunctions.generateSSID;
var sendEmail = customFunctions.sendEmail;
var formatDate = customFunctions.formatDate;
var getPayData = customFunctions.getPayData;
var getOrderData = customFunctions.getOrderData;
var getProductData = customFunctions.getProductData;
var getTotalWeightAndPrice = customFunctions.getTotalWeightAndPrice;

var formidable = require('formidable');
var easyimg = require('easyimage');
var fs=require('fs-extra');
var async= require('async');


module.exports.orderCallback = function(req, res){
	var name = req.body['name'];
	var phone = req.body['phone'];
	if(name && phone) {
		var callback = new Callback({name: name, phone: phone}).save()
		Admin.update({login: 'admin'}, {$inc: {newCalls: 1}}).exec();
		Admin.findOne({login: 'admin'}, 'email', function(err, rep){
			var textMessage = 'Вам поступила заявка на обратный звонок:\n' + name + ' - ' + phone;
			if(rep) sendEmail(rep.email, 'Новый звонок', textMessage, ''); 
		});
	}
	res.redirect('/');
};

module.exports.makeOrder = function(req, res) {
	console.log('new order');
	
	var orderNumber;
	var productId;
	var step = 0;
	var totalPrice = 0;
	var totalWeight = 0;
	var data = getOrderData(req);
	Admin.findOne({login: 'admin'}, 'orderNumber', function(err, rep){
		if(rep) orderNumber=rep.orderNumber;
		if(orderNumber<1078 || !orderNumber) orderNumber=1078;
		data.number = orderNumber++;
		Admin.update({login: 'admin'}, {$set: {orderNumber: orderNumber}}).exec();
		
		var productCount = Number(req.body.productCount);
		for (var i=0; i < productCount; i++){
			productId = req.body['product[' + i + '][_id]'];
			
			data.product.push({id: productId, name: req.body['product[' + i + '][name]'], howMany: req.body['product[' + i + '][howMany]']});
			
			if (productId) Product.findOne({_id: productId}, 'price isSpecialProp discount name address weight image_micro_thumb', function(err, rep){
				if(rep) getProductData(data, rep)
				if(++step == productCount) {
					
					getTotalWeightAndPrice(data,totalWeight,totalPrice);
					
					writeLog(JSON.stringify(data),function(){});
							
					var order = new Order(data).save(function(err, ord){
						/* no robokassa */
						
						//res.end();
						
						/* end no robokassa */
						
						/* robokassa attouched */
												
						var payData = getPayData(ord);
						
						res.render('pages/pay/pay',payData)
						
						/* end robokassa */
					});
					
					Admin.update({login: 'admin'}, {$inc: {newOrders:1}}).exec();
					Admin.findOne({login: 'admin'}, 'email', function(err, rep){
						if(rep) sendEmail(rep.email, 'Новый заказ', 'Вам поступил новый заказ!', ''); 
					});
					
				}
			});
		}
	});	
};

module.exports.feedback = function(req, res){
	verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
		if (success) {
			var feedback = new Feedback({
				name: req.body['name'],
				email: req.body['email'],
				message: req.body['message']
			}).save();
			
		}
	});
	res.redirect('/');
};

module.exports.postReview=function(req, res){
	var target = req.body.address;
	console.log(target);
	verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
		if (success) {
			var thisMoment = formatDate();
			var name = req.body.name;
			var email = req.body.email;
			var message = req.body.message;
			var type = req.body.type;
			var target = req.body.address;
			console.log(target);
			var review = new Review({name: name, email: email, message: message, type: type, target: target, date: thisMoment}).save();
			var dest = '/products/' + target;
			console.log(dest);
			res.redirect(dest);
		}
	});
};

/*admin post requests*/

module.exports.loginHandler = function (req, res) {
	verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
		if (success) {
				console.log(req.body['login']);
				console.log(req.body['password']);	
				var login = req.body['login'];
				var passwd = req.body['password'];
				var loginUpperCase = login.toUpperCase();
				Admin.findOne({loginUpperCase: loginUpperCase}, 'passwd', function(err, rep){
					try {
						if (rep != null && rep.passwd === passwd) {
							Session.find({login: 'admin'}).remove().exec(function(){/*deleting old session*/
								generateSSID(login, function(SSID){
									var session = new Session({login: 'admin', session: SSID}).save(function(err, rep){
										res.cookie('ssid', SSID, {maxAge: 3600000});
										res.cookie('login', login, {maxAge: 3600000});
										res.redirect('/admin');
									});
								});	
							});	
						} else {
							res.end('wrong password');
						}
					} catch(e) {
						
					}
				});
					
		} else { 
			res.end("Captcha failed, sorry.");	
		}
	});
};

module.exports.changePassword = function(req, res){
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			var oldPass = fields.oldPass;
			var newPass1 = fields.newPass1;
			var newPass2 = fields.newPass2;
			Admin.findOne({login: 'admin'}, 'passwd', function(err, rep){
				if(rep && rep.passwd === oldPass && newPass1 === newPass2) {Admin.update({login: 'admin'}, {$set: {passwd: newPass1}}).exec(); res.send('Пароль успешно изменен!');}
				else if(rep.passwd !== oldPass && newPass1 === newPass2) res.send('Неверно введен старый пароль');
				else if (rep.passwd === oldPass && newPass1 !== newPass2) res.send('Новый пароль не совпадает с подтверждением!');
				else res.send('Ошибка при изменении пароля!');
			});
		});
};

module.exports.changeEmail = function(req, res){
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			var email = fields.email;
			Admin.update({login: 'admin'}, {$set: {email: email}}).exec(function(err, rep){
				if(!err) res.send('Почтовый адрес успешно изменен!');
			});
		});
};

module.exports.addManagerComment = function(req, res){
	var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			var order = fields.order;
			var managerComment = fields.managerComment;
			Order.update({_id: order}, {$set: {managerComment: managerComment}}).exec();
			res.end();
		});
};

module.exports.setFedexPrice = function(req, res){
	var order;
	var fedexPrice;
	var totalPrice;
	var toPay;
	var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		
		async.series([
			function(cb){
				form.parse(req, function(err, fields, files) {
					order = fields.order;
					fedexPrice = Number(fields.fedexPrice);
					cb();
				});
			},
			function(cb){
				Order.findOne({_id: order},'totalPrice',function(err,rep){
					totalPrice = rep.totalPrice;
					cb();
				})
			},
			function(cb){
				toPay = Number(fedexPrice) + Number(totalPrice);
				Order.update({_id: order}, {$set: {fedexPrice:fedexPrice,toPay:toPay}}).exec((err,rep)=>{
					cb();
				});
			}
		],
		(err)=>{
				res.end();
		});
		
};


module.exports.orderToWork = function(req, res){
	var orderId = req.query.order;
	if (orderId) Order.update({_id: orderId}, {$set: {isItNew: false, isActive: true}}).exec();
	Admin.findOne({login: 'admin'}, 'newOrders', function(err, rep){
		if(rep.newOrders > 0) 	Admin.update({login: 'admin'}, {$inc: {newOrders: -1}}).exec();
	});
	Order.findOne({_id: orderId}, 'email number product howMany price totalPrice fedexPrice toPay', function(err, rep){
					if(rep) {
						var productsOrdered='';
						rep.product.forEach(function(productItem){
							productsOrdered += productItem.name + ' - ' + productItem.howMany + 'шт.' + ' по ' +  productItem.price + 'руб.\r\n';
 						});
						var textEmail = 'Здравствуйте!\r\nВаш заказ №' + rep.number + ' принят в работу! Вы заказали: \r\n' +
						productsOrdered + 'Суммарная стоимость: ' + rep.totalPrice + 'руб.\r\n' + 
						'Стоимость доставки: ' + rep.fedexPrice + 'руб.\r\n'+
						'Итого к оплате: ' + rep.toPay;
						sendEmail(rep.email, 'Заказ № ' + rep.number, textEmail, ''); 
					}
				});
	res.end();	
};

module.exports.markDoneOrder = function(req, res){
	var orderId = req.query.order;
	if(orderId) Order.update({_id: orderId}, {$set: {isItNew: false, isActive: false}}).exec();
	res.end();
};


module.exports.searchOrderByDate = function(req, res){
	var data={
		order: []
	};
	var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			var fromDate = fields.fromDate;
			var toDate = fields.toDate;
			console.log(fromDate);
			console.log(toDate);
			Order.find({date: {$gte: fromDate, $lte: toDate}}).sort({date: -1}).exec(function(err, rep){
				if(rep!== null && rep!== undefined && rep.length !== 0) {
					data.order = rep;
					res.render('components/orders', data);
				} else {
					res.send('Ничего не найдено');
				}
					});
		});
};


module.exports.addCategory = function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var categoryToAdd = fields.category;
			var category = new Category({name: categoryToAdd, subcategory: []}).save();
			res.end();
		});
		res.end();
	} catch(e) {}
};

module.exports.addSubCategory = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			console.log(fields);
			var category = fields.category;
			Category.findOne({name: category}, 'currentSubcategoryId', function(err, rep){
				if (rep) {
					var subCatId = rep.currentSubcategoryId + 1;
					var subcategoryName = fields.subcategory;
					var subcategory = {name: subcategoryName, id: subCatId};
					Category.update({name: category}, {$push: {subcategory: subcategory}, $inc: {currentSubcategoryId: 1}}).exec();
				}
			});
		});
		res.end();
	} catch(e) {}
};

module.exports.changeCategory = function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var categoryId = fields.categoryId;
			var newName = fields.category;
			if (files.upload.size !== 0 && files.upload.size !== undefined) {
				var microThumbFileName = __dirname + '/../public/images/categories/' + fields.categoryId + '_micro_thumb.png';
				var htmlMicroThumbFileName = '/images/categories/' + fields.categoryId + '_micro_thumb.png';
				saveMicroThumbImage(files.upload.path, microThumbFileName, files);
				Category.update({_id: categoryId}, {$set: {name: newName, rank:  Number(fields.rank), image_micro_thumb: htmlMicroThumbFileName}}).exec(function(err, rep){
					res.end();
				});
			}	else Category.update({_id: categoryId}, {$set: {name: newName, rank:  Number(fields.rank)}}).exec(function(err, rep){
						res.end();
					});
		});
	} catch(e) {}
};

module.exports.changeSubCategory = function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {	
			var categoryId = fields.categoryId;
			var subcategoryId = fields.subcategoryId;
			var newName = fields.subcategory;
			subcategoryId = Number(subcategoryId);
			Category.update({_id: categoryId, 'subcategory.id': subcategoryId}, {$set: {'subcategory.$.name': newName}}).exec(function(err, rep){
				res.end();
			});
		});
	} catch(e){}	
};

module.exports.addProduct = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.uploadDir =__dirname + '/../public/images/products';
		form.parse(req, function(err, fields, files) {
			if (files.upload.size !== 0 && files.upload.size !== undefined) { /*this is the case, where user uploads photo*/
				var thumbFileName = __dirname + '/../public/images/products/' + fields.address + '_thumb.jpg';
				var microThumbFileName = __dirname + '/../public/images/products/' + fields.address + '_micro_thumb.jpg';
				var fileName = __dirname + '/../public/images/products/' + fields.address + '.jpg';
				var htmlFileName = '/images/products/' + fields.address + '.jpg';
				var htmlThumbFileName = '/images/products/' + fields.address + '_thumb.jpg';
				var htmlMicroThumbFileName = '/images/products/' + fields.address + '_micro_thumb.jpg';
				fs.renameSync(files.upload.path, fileName);
				saveThumbImage(fileName, thumbFileName, htmlMicroThumbFileName);
				saveMicroThumbImage(fileName, microThumbFileName, files)
			} else { /*this is the case, where user does not upload photo*/
				var htmlFileName = '/images/products/noimage.jpg';
				var htmlThumbFileName = '/images/products/noimage_thumb.jpg';
			}
			Category.findOne({_id: fields.category}, function(err, rep){
				if(rep) {
					var category={name: rep.name, id: rep._id.toString()}; /*variable to save in product schema. Made toString coz otherwise you can not find Product by category id*/
					var subcategory;
					var subcategories = rep.subcategory;
					
					subcategories.forEach(function(subcat){ /*findig the name of subcategory by id*/
						if(Number(fields.subcategory) === Number(subcat.id))
								subcategory = {name: subcat.name, id: subcat.id};
					});
					
					var product = new Product({name: fields.name, nameUpperCase: fields.name.toUpperCase(), category: category, 
					subcategory: subcategory, address: fields.address, price: fields.price, fakeOldPrice: fields.fakeOldPrice, weight:fields.weight, quantity: Number(fields.quantity), rank: Number(fields.rank),
					description: fields.description, code: fields.code, videoURL: fields.videoURL, image: htmlFileName, image_thumb: htmlThumbFileName, image_micro_thumb: htmlMicroThumbFileName}).save();
				}
			});
		});
		res.end();
	} catch(e) {}
};

module.exports.changeProduct = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.uploadDir =__dirname + '/../public/images/products';
		form.parse(req, function(err, fields, files) {
			console.log(files.upload.size);
		    if (files.upload.size !== 0 && files.upload.size !== undefined) { /*this is the case, where user uploads photo*/
				var thumbFileName = __dirname + '/../public/images/products/' + fields.address + '_thumb.jpg';
				var microThumbFileName = __dirname + '/../public/images/products/' + fields.address + '_micro_thumb.jpg';
				var fileName = __dirname + '/../public/images/products/' + fields.address + '.jpg';
				var htmlFileName = '/images/products/' + fields.address + '.jpg';
				var htmlThumbFileName = '/images/products/' + fields.address + '_thumb.jpg';
				var htmlMicroThumbFileName = '/images/products/' + fields.address + '_micro_thumb.jpg';
				fs.renameSync(files.upload.path, fileName);
				saveThumbImage(fileName, thumbFileName, files);
				saveMicroThumbImage(fileName, microThumbFileName, files)
				Product.update({_id: fields.id}, {$set: {name: fields.name,  nameUpperCase: fields.name.toUpperCase(), 
								address: fields.address, weight:fields.weight,price: fields.price, fakeOldPrice: fields.fakeOldPrice, quantity: Number(fields.quantity), rank:  Number(fields.rank),
								description: fields.description, code: fields.code, videoURL: fields.videoURL,
								image: htmlFileName, image_thumb: htmlThumbFileName, image_micro_thumb: htmlMicroThumbFileName}}).exec();
				res.end();
			} else { /*this is the case, where user does not upload photo*/
				Product.update({_id: fields.id}, {$set: {name: fields.name,  nameUpperCase: fields.name.toUpperCase(), 
								address: fields.address, weight:fields.weight, price: fields.price, fakeOldPrice: fields.fakeOldPrice, quantity: Number(fields.quantity), rank:  Number(fields.rank),
								description: fields.description, code: fields.code, videoURL: fields.videoURL,}}).exec();
				res.end();
			}
		});
	}
	catch (e) {}
};

module.exports.moveProduct = function(req, res){
	var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var productId = fields.product;
			Category.findOne({_id: fields.category}, function(err, rep){
				if(rep) {
					var category={name: rep.name, id: rep._id.toString()}; /*variable to save in product schema. Made toString coz otherwise you can not find Product by category id*/
					var subcategory;
					var subcategories = rep.subcategory;
					subcategories.forEach(function(subcat){ /*findig the name of subcategory by id*/
						if(Number(fields.subcategory) === Number(subcat.id))
								subcategory = {name: subcat.name, id: subcat.id};
					});
					Product.update({_id: productId}, {$set: {category: category, subcategory: subcategory}}).exec();
				}
					res.end();
			});
		});
};


module.exports.replenishProduct = function(req, res) {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var productId = fields.id;
			var quantity = fields.quantity;
			try {
				Product.update({_id: productId}, {$set: {quantity: Number(quantity)}}).exec();
				res.end();
			} catch(e) {}
		});
};

module.exports.addImageToGallery = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.uploadDir =__dirname + '/../public/images/products';
		form.multiples = true;
		form.parse(req, function(err, fields, files) {
			console.log(files.upload.length);
			console.log(files.upload);
			var address = fields.address;
			var gallerySize = 0;
			async.series([
				function(callback){
					Product.findOne({address: address}, 'gallerySize', function(err, rep){ /*check gallery size to give names to new files*/
						if(rep) gallerySize = rep.gallerySize;
						callback();
					});
				},
				function(callback){
					if(files.upload.length !== undefined) { /*if there are multiple files*/
						var counter = 0;
						for (var i=0; i<files.upload.length; i++) {
							var thumbFileName = __dirname + '/../public/images/products/' + fields.address + gallerySize + '_gallery_thumb.jpg';
							var fileName = __dirname + '/../public/images/products/' + fields.address + gallerySize + '_gallery.jpg';
							var htmlFileName = '/images/products/' + fields.address + gallerySize + '_gallery.jpg';
							var htmlThumbFileName = '/images/products/' + fields.address + gallerySize + '_gallery_thumb.jpg';
							gallerySize++;
							fs.renameSync(files.upload[i].path, fileName);
							saveThumbImage(fileName, thumbFileName, files);
							Product.update({address: address}, {$push: {gallery: {image: htmlFileName, thumb_image: htmlThumbFileName}}}).exec(function(err, rep){
								counter++;
								if(counter == files.upload.length - 1) callback(); /*check if the last image was set to gallery in database*/
							});
						}
					} else { /*if theere is single file*/
							var thumbFileName = __dirname + '/../public/images/products/' + fields.address + gallerySize + '_gallery_thumb.jpg';
							var fileName = __dirname + '/../public/images/products/' + fields.address + gallerySize + '_gallery.jpg';
							var htmlFileName = '/images/products/' + fields.address + gallerySize + '_gallery.jpg';
							var htmlThumbFileName = '/images/products/' + fields.address + gallerySize + '_gallery_thumb.jpg';
							gallerySize++;
							fs.renameSync(files.upload.path, fileName);
							saveThumbImage(fileName, thumbFileName, files);
							Product.update({address: address}, {$push: {gallery: {image: htmlFileName, thumb_image: htmlThumbFileName}}}).exec(function(err, rep){
								callback();
							});
					}
				}
			], function(err){
				console.log('gallery done uploading');
				Product.update({address: address}, {$set: {gallerySize: gallerySize}}).exec();
				res.end();
			});	
		});	
	}
	catch (e) {}	
};

module.exports.makeHit = function(req, res){
	var productId = req.query.product;
	try {
		Product.findOne({_id: productId}, 'isHit', function(err, rep){
			if (rep) {
				var isHit = rep.isHit;
				Product.update({_id: productId}, {$set: {isHit: !isHit}}).exec();
				res.end();
			}
		})
	} catch(e) {}
};

module.exports.makeNew = function(req, res){
	var productId = req.query.product;
	try {
		Product.findOne({_id: productId}, 'isNewProduct', function(err, rep){
			if (rep) {
				var isNewProduct = rep.isNewProduct;
				Product.update({_id: productId}, {$set: {isNewProduct: !isNewProduct}}).exec();
				res.end();
			}
		})
	} catch(e) {}
};

module.exports.addSpecialPropForProduct = function(req, res){
	var form = new formidable.IncomingForm();
	form.type = 'multipart/form-data'
	form.parse(req, function(err, fields, files) {
		var target = {type: 'product', id: fields.product};
		try {
			Product.findOne({_id: fields.product}, 'price address', function(err, rep){
				if(rep) {
					if (fields.discount !== '') var newPrice = rep.price - (0.01 * rep.price * Number(fields.discount)); /*calculates new price by discount*/
					else var newPrice = fields.new_price;
					newPrice = Math.floor(newPrice);
					Product.update({_id: fields.product}, {$set: {isSpecialProp: true, discount: newPrice}}).exec();
					var specProp = new SpecialProp({describe: fields.describe, 
													target: target, 
													durancy: fields.toDate, 
													link: '/products/' + rep.address, 
													discount: fields.discount}).save();
						}
			});
		} catch(e){}
		res.redirect('/admin');
	});
};

module.exports.addSpecialPropForCategory = function(req, res){
	var form = new formidable.IncomingForm();
	form.type = 'multipart/form-data'
	form.parse(req, function(err, fields, files) {
		var target = {type: 'category', id: fields.category};
		console.log(target);
		try {
			Product.find({'category.id': target.id}, 'price address', function(err, reps){
				if(reps) {
					reps.forEach(function(rep){
						if (fields.discount !== '') var newPrice = rep.price - (0.01 * rep.price * Number(fields.discount)); /*calculates new price by discount*/
						else var newPrice = fields.new_price;
						newPrice = Math.floor(newPrice);
						Product.update({_id: rep._id}, {$set: {isSpecialProp: true, discount: newPrice}}).exec();
					});	
				var specProp = new SpecialProp({describe: fields.describe, 
												target: target,
												durancy:fields.toDate, 
												link: '/category/' + fields.category,
												discount: fields.discount}).save();
				}
			});
		} catch(e) {}
		res.redirect('/admin');
	});
};

module.exports.markSeenCallback = function(req, res){
	var callbackId = req.query.callback;
	if(callbackId) {
		Callback.update({_id: callbackId}, {$set: {isItNew: false}}).exec();
		Admin.findOne({login: 'admin'}, 'newCalls', function(err, rep){
			if(rep.newCalls > 0) Admin.update({login: 'admin'}, {$inc: {newCalls: -1}}).exec();
		});
		res.end();
	}
};


module.exports.choosePage=function(req, res){
	var data={
		page: '',
		content:''
	};
	var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			var page = fields.page;
			data.page = page;
			console.log(fields);
			try {
				fs.readFile(__dirname + '/../views/pages/' + page + '.handlebars', 'utf8', function(err, contents) {
					data.content = contents;
					res.render('forms/editpageform', data);
				});	
			} catch(e){res.end();}
		});
};

module.exports.changePage = function(req, res){
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			var page = fields.page;
			var content = fields.content;
			try {
				fs.writeFile(__dirname + '/../views/pages/' + page + '.handlebars', content, 'utf8', function(err, contents) {
					res.end();
				});	
			} catch(e){res.end();}
		});
};