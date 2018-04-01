var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;
var Callback=require('./models/mongoModel.js').Callback;
var Order=require('./models/mongoModel.js').Order;
var Admin=require('./models/mongoModel.js').Admin;
var Session=require('./models/mongoModel.js').Session;
var Feedback=require('./models/mongoModel.js').Feedback;
var Review=require('./models/mongoModel.js').Review;
var formidable = require('formidable');
var async= require('async');
var textSearch = require('mongoose-text-search');
var getCommonData=require('./customfunctions.js').getCommonData;
var fillTheCart=require('./customfunctions.js').fillTheCart;

/*get different pages of the site*/

module.exports.getFacePage = function(req, res){
	var data = {
		layout: 'main',
		product: []
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Product.find({isHit: true}).sort({rank: 1}).exec(function(err, rep){
				if(rep) data.product = rep;
				callback();
			})
		},
		], function(err) { 
			res.render('pages/index', data);
	});
};

module.exports.getNewProductPage = function(req, res){
	var data = {
		layout: 'main',
		product: []
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Product.find({iNewProduct: true}).sort({rank: 1}).exec(function(err, rep){
				if(rep) data.product = rep;
				callback();
			});
		}
		], function(err) { 
			res.render('pages/newproductpage', data);
	});	
};

module.exports.redirectToFace=function(req, res){
	res.redirect('/');
};

module.exports.getProductPage = function(req, res){
	var data = {
		layout: 'main',
		product: {},
		notFound: false
	};
	var productAddress = req.params.id;
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Product.findOne({address: productAddress}, function(err, rep){
				if(rep) data.product = rep;
				else {data.notFound=true; res.status(404);}
				callback();
			});
		}
		], function(err) { 
			res.render('pages/productpage', data);
	});	
};

module.exports.getCategoryPage = function(req, res){
	var categoryId = req.params.id;
	var data = {
		layout: 'main',
		product: [],
		title: {}
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Category.findOne({_id: categoryId}, function(err, rep){
				if(rep) {
					data.title.name = rep.name;
					data.title.id=rep._id;
				}
				callback();
			});
		},
		function(callback) {
			Product.find({'category.id': categoryId}).sort({rank: 1}).exec(function(err, rep){
				if(rep) data.product = rep;
				callback();
			});
		}
		], function(err) { 
			res.render('pages/categorypage', data);
	});	
};

module.exports.getSubcategoryPage = function(req, res){
	var categoryId = req.params.id;
	var subcategoryId = req.params.subid;
	var data = {
		layout: 'main',
		product: [],
		title: {}
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Category.findOne({_id: categoryId}, function(err, rep){
				if(rep) {
					data.title.name = rep.name;
					data.title.id=rep._id;
					var subcategories = rep.subcategory;
					subcategories.forEach(function(subcat){ /*findig the name of subcategory by id*/
						if(Number(subcategoryId) === Number(subcat.id))
								data.title.subcatname = subcat.name;
					});
				}
				callback();
			});
		},
		function(callback) {
			Product.find({'category.id': categoryId, 'subcategory.id': Number(subcategoryId)}).sort({rank: 1}).exec(function(err, rep){
				if(rep) data.product = rep;
				callback();
			});
		}
		], function(err) { 
			res.render('pages/categorypage', data);
	});
};

module.exports.getStaticPage = function(req, res){
	var data = {
		layout: 'main'
	};
	var page = 'pages/' + req.params.id;
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render(page, data);
	});
};

module.exports.getCartPage = function(req, res){
	var data = {
		layout: 'main',
		product: []
	};
	if(req.cookies.cart) {
		var cart = req.cookies.cart;
		cart = cart.split(', ');
		async.parallel([
		function(callback) {
			fillTheCart(data, cart, function(){
				callback();
			});
		},
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/cart', data);
		});
	} else {
		res.redirect('/');
	}
};

/*page components render functions*/

module.exports.searchProduct = function(req, res){
	var data={
		product: []
	};
	var productToFind = req.query.product;
	var reg = new RegExp(productToFind, "i")
	Product.find({name: {$regex: reg}}, 'name address', function(err, rep){
		if(rep!== null && rep!== undefined && rep.length !== 0) {
			data.product=rep;
			res.render('components/searchresult', data);
		} else {
			res.render('components/searchresult', data);
		}
	});
};

module.exports.getCallbackForm = function(req, res){
	res.render('forms/callbackform');
};

module.exports.getProductReview=function(req, res){
	var product = req.query.product;
	var page = req.query.page;
	page = Number(page);
	var data={
		review: []
	};
	Review.find({target: product}).sort({_id: -1}).skip(page).limit(10).exec(function(err, rep){
		if(rep) data.review = rep;
			console.log(data.review);
			res.render('components/reviewlist', data);
	});
	
};

module.exports.getAllReviews = function(req, res){
	var page = req.query.page;
	page = Number(page);
	var data={
		review: []
	};
	Review.find({}).sort({_id: -1}).skip(page).limit(10).exec(function(err, rep){
		if(rep) data.review = rep;
			console.log(data.review);
			res.render('components/reviewlist', data);
	});
};

/*functions  of get requests's callbacks for admin*/

module.exports.logOut = function(req, res){
	res.cookie('ssid', '', { expires: new Date() });
	res.cookie('login', '', { expires: new Date() });
	Session.find({login: 'admin'}).remove().exec();
	res.end();
};

module.exports.getNewOrdersQuantity = function(req, res){
	Admin.findOne({login: 'admin'}, 'newOrders newCalls', function(err, rep){
		if(rep) res.send(rep);
	});
};

module.exports.getOrders = function(req, res){
	var data={
		order: []
	}
	Order.find({$or: [{isItNew: true}, {isActive: true}]}).sort({date: -1}).exec(function(err, rep){
		if(rep) data.order = rep;
		res.render('components/orders', data);
	});
};

module.exports.getOrderArchive = function(req, res){
	var data={
		order: []
	}
	Order.find({isItNew: false, isActive: false, deletedOne: false}).sort({date: -1}).limit(10).exec(function(err, rep){
		if(rep) data.order = rep;
		res.render('components/orders', data);
	});
};

module.exports.getMoreOrderArchive = function(req, res){
	var data={
		order: []
	}
	var page = req.query.page;
	var skip = page * 10;
	Order.find({isItNew: false, isActive: false, deletedOne: false}).sort({date: -1}).skip(skip).limit(10).exec(function(err, rep){
		if(rep) data.order = rep;
		res.render('components/orders', data);
	});
};

module.exports.getOrderDeleted = function(req, res){
	var data={
		order: []
	}
	Order.find({isItNew: false, isActive: false, deletedOne: true}).sort({date: -1}).exec(function(err, rep){
		if(rep) data.order = rep;
		res.render('components/orders', data);
	});
};

module.exports.searchClient = function(req, res){
	var data={
		order: []
	}
	var client = req.query.client;
	var reg = new RegExp(client, "i")
	Order.find({name: {$regex: reg}}).sort({date: -1}).exec(function(err, rep){
		if(rep!== null && rep!== undefined && rep.length !== 0) {
			data.order = rep;
			res.render('components/orders', data);
		} else {
			res.send('Ничего не найдено');
		}
	});
};


module.exports.getCategories = function(req, res){
	var data = {
		category: []
	};
	Category.find({}, function(err, rep){
		if(rep) data.category = rep;
			res.render('components/categories', data);
	});
};

module.exports.getProductAddForm = function(req, res) {
	var data = {
		category: []
	};
	Category.find({}, function(err, rep){
		if(rep) data.category = rep;
			res.render('forms/productaddform', data);
	});
};

module.exports.getSubcategories = function(req, res){
	var data={
		subcategory: []
	};
	var categoryId = req.query.category;
	Category.findOne({_id: categoryId}, 'subcategory', function(err, rep){
		if(rep) data.subcategory = rep.subcategory;
			res.render('components/productaddsubcategories', data);
	});
	
};

module.exports.getCategoryFilter=function(req, res){
	var data={
		category: []
	};
	
	Category.find({}, function(err, rep){
		if(rep) data.category = rep;
			res.render('forms/categoryfilter', data);
	});
};

module.exports.getProductsList = function(req, res){
	var data = {
		products: []
	};
	var counter = req.query.counter;
	console.log(req.query);
	if (counter!==undefined) { /*check if filter for categories was used*/
		var categories = [];
		counter = Number(counter);
		for (var i=0; i<counter; i++) {
			if (req.query['category' + i] !== undefined);
			categories.push(req.query['category' + i]);
		}
		var checkStep = 0;
		console.log(categories);
		categories.forEach(function(category){
			Product.find({'category.id': category}, 'name address quantity isHit isNewProduct image_micro_thumb category', function(err, rep){
				if(rep) data.products = data.products.concat(rep);
				checkStep++;
				if(checkStep === categories.length) res.render('components/productslist', data);
			});
		});	
	} else { /*filter wasnt used - you see only hits*/
		Product.find({isHit: true}, 'name address quantity isHit isNewProduct image_micro_thumb category', function(err, rep){
			if(rep) data.products = rep;
			data.title = 'Хиты продаж';
			res.render('components/productslist', data);
		});
	}
};

module.exports.getMoveToCategoryForm=function(req, res){
	var product = req.query.product;
	var data={
		product: product,
		cetegory: []
	};
	Category.find({}, function(err, rep){
		if(rep) data.category = rep;
		res.render('forms/movetocategoryform', data);
	});
};

module.exports.getChangeProductForm = function(req, res){
	var productId = req.query.product;
	Product.findOne({_id: productId}, function(err, rep){
		if (rep) res.render('forms/changeproductform', rep);
	});
};

module.exports.getSpecialPropFormForProduct = function(req, res){
	var data={
		product: []
	};
	Product.find({}, 'name', function(err, rep){
		if(rep) data.product = rep;
			res.render('forms/addspecialpropformforproduct', data);
	});
};

module.exports.getSpecialPropFormForCategory = function(req, res){
	var data = {
		category: []
	};
	Category.find({}, 'name', function(err, rep){
		if(rep) data.category = rep;
			res.render('forms/addspecialpropformforcategory', data);
	});
};

module.exports.getSpecialPropsList = function(req, res){
	var data = {
		specialProp: []
	};
	SpecialProp.find({}, function(err, rep){
		if (rep) data.specialProp = rep;
			res.render('components/specialpropslist', data);
	});
};

module.exports.getCallbackList = function(req, res){
	var data={
		callback: []
	};
	Callback.find({}, function(err, rep){
		if(rep) data.callback = rep.reverse();
			res.render('components/callbacklist', data);
	});
};

module.exports.getFeedback = function(req, res){
	var data={
		feedback:[]
	};
	var page = req.query.page;
	page=Number(page);
	Feedback.find({}).sort({_id: -1}).skip(page).limit(10).exec(function(err, rep){
		if(rep) data.feedback = rep;
		res.render('components/feedbacklist', data);
	});
};