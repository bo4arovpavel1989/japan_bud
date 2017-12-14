var secret=require('./../../credentials.js')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teddy-bear', {user:secret.db.login, pass:secret.db.pass});
mongoose.Promise = global.Promise;
var textSearch = require('mongoose-text-search');

var Product = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	nameUpperCase: {type: String, required: true, index: true},
	category: {type: Object, required: true},
	rank: {type: Number, default: 9999},
	subcategory: {type: Object},
	address: {type: String, required: true, unique: true},
	price: {type: Number, default: 999999},
	discountPrice: {type: Number, default: 999999},
	quantity: {type: Number, default: 0},
	description: {type: String},
	code: {type: String},
	videoURL: {type: String},
	isHit: {type: Boolean, default: false},
	isSpecialProp: {type: Boolean, default: false},
	discount: {type: Number, default: 0},
	fakeOldPrice: {type: Number},
	image: {type: String, default: 'images/products/no-image.jpg'},
	image_thumb: {type: String, default: 'images/products/no-image_thumb.jpg'},
	image_micro_thumb: {type: String, default: 'images/products/no-image_micro_thumb.jpg'},
	gallery: {type: Array},
	gallerySize: {type: Number, default: 0}
});

Product.plugin(textSearch);
Product.index({nameUpperCase: 'text'});

var Category = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	rank: {type: Number, default: 9999},
	subcategory: {type: Array},
	currentSubcategoryId: {type: Number, default: 0},
	image_micro_thumb: {type: String}
});

var Order = new mongoose.Schema({
	product: {type: Array, required: true},
	totalPrice: {type: Number, required: true},
	name: {type: String, required: true},
	number: {type: Number},
	email: {type: String},
	date: {type: Date},
	address: {type: String},
	fedex: {type: String},
	fedexPrice: {type: Number},
	outpost: {type: String},
	comment: {type: String},
	phone: {type: String},
	managerComment: {type: String},
	isItNew: {type: Boolean, default: true},
	isActive: {type: Boolean, default: false},
	deletedOne: {type: Boolean, default: false}
});

var SpecialProp = new mongoose.Schema({
	durancy: {type: Date},
	target: {type: Object},
	discount: {type: Number, default: 0},
	describe: {type: String},
	link: {type: String}
});

var Callback = new mongoose.Schema({
	name: {type: String},
	phone: {type: String},
	isItNew: {type: Boolean, default: true}
});

var Admin = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, unique: true, required: true},
	passwd: {type: String, required: true},
	session: {type: String, default: '0'},
	newOrders: {type: Number, default: 0},
	newCalls: {type: Number, default: 0},
	activeOrders: {type: Number, default: 0},
	email: {type: String},
	orderNumber: {type: Number, default: 1078}
});

var Session = new mongoose.Schema({
	login: {type: String, required: true},
	session: {type: String, require: true},
	date: {type: Date, expires: 3600, default: Date.now}
});

var Feedback = new mongoose.Schema({
	name: {type: String},
	email: {type: String},
	message: {type: String}
});

var Review = new mongoose.Schema({
	name: {type: String},
	email: {type: String},
	message: {type: String},
	type: {type: String},
	answer: {type: String},
	date: {type: String},
	target: {type: String}
});

module.exports.Review = mongoose.model('review', Review);
module.exports.Callback = mongoose.model('callback', Callback);
module.exports.Feedback = mongoose.model('feedback', Feedback);
module.exports.Product = mongoose.model('productdata', Product);
module.exports.Category = mongoose.model('categorydata', Category);
module.exports.Order = mongoose.model('orderdata', Order);
module.exports.Admin = mongoose.model('admindata', Admin);
module.exports.Session = mongoose.model('sessiondata', Session);
module.exports.SpecialProp = mongoose.model('specialprop', SpecialProp);
