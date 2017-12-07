var fs = require('fs-extra');

var postRequestsHandlers=require('./postrequests.js');

var getRequestsHandlers=require('./getrequests.js');

var deleteRequestsHandlers=require('./deleterequests.js');


var checkAccess = require('./middlewarefunctions.js').checkAccess;
var noMiddleware = require('./middlewarefunctions.js').noMiddleware;

var getRequests = [
	{
		url: '/',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getFacePage
	},
	{
		url: '/catalog/:id',  //route of old site
		middleware: noMiddleware,
		callback: getRequestsHandlers.redirectToFace
	},
	{
		url: '/products',  //route of old site
		middleware: noMiddleware,
		callback: getRequestsHandlers.redirectToFace
	},
	{
		url: '/static/:id',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getStaticPage
	},
	{
		url: '/cart',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getCartPage
	},
	{
		url: '/products/:id',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getProductPage
	},
	{
		url: '/category/:id',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getCategoryPage
	},
	{
		url: '/subcategory/:id/:subid',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getSubcategoryPage
	},
	/*components routes*/
	{
		url: '/searchproduct',
		middleware: noMiddleware,
		callback: getRequestsHandlers.searchProduct
	},
	{
		url: '/getcallbackform',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getCallbackForm
	},
	{
		url: '/getproductreview',
		middleware: noMiddleware,
		callback: getRequestsHandlers.getProductReview
	},
	/*admin routes*/
	{
		url: '/login',
		middleware: noMiddleware,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/login.html');
		}
	},
	{
		url: '/admin',
		middleware: checkAccess,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/admin.html');
		}
	},
	{
		url: '/admin/logout',
		middleware: checkAccess,
		callback: getRequestsHandlers.logOut
	},
	{
		url: '/admin/getnewordersquantity',
		middleware: checkAccess,
		callback: getRequestsHandlers.getNewOrdersQuantity
	},
	{
		url: '/admin/getorders',
		middleware: checkAccess,
		callback: getRequestsHandlers.getOrders
	},
	{
		url: '/admin/getorderarchive',
		middleware: checkAccess,
		callback: getRequestsHandlers.getOrderArchive
	},
	{
		url: '/admin/getmoreorderarchive',
		middleware: checkAccess,
		callback: getRequestsHandlers.getMoreOrderArchive
	},
	{
		url: '/admin/getorderdeleted',
		middleware: checkAccess,
		callback: getRequestsHandlers.getOrderDeleted
	},
	{
		url: '/admin/searchclient',
		middleware: checkAccess,
		callback: getRequestsHandlers.searchClient
	},
	{
		url: '/admin/getcategories',
		middleware: checkAccess,
		callback: getRequestsHandlers.getCategories
	},
	{
		url: '/admin/getproductaddform',
		middleware: checkAccess,
		callback: getRequestsHandlers.getProductAddForm
	},
	{
		url: '/admin/getsubcategories',
		middleware: checkAccess,
		callback: getRequestsHandlers.getSubcategories
	},
	{
		url: '/admin/getcategoryfilter',
		middleware: checkAccess,
		callback: getRequestsHandlers.getCategoryFilter
	},
	{
		url: '/admin/getproductslist',
		middleware: checkAccess,
		callback: getRequestsHandlers.getProductsList
	},
	{
		url: '/admin/getmovetocategoryform',
		middleware: checkAccess,
		callback: getRequestsHandlers.getMoveToCategoryForm
	},
	{
		url: '/admin/getchangeproductform',
		middleware: checkAccess,
		callback: getRequestsHandlers.getChangeProductForm
	},
	{
		url: '/admin/getspecialpropformforproduct',
		middleware: checkAccess,
		callback: getRequestsHandlers.getSpecialPropFormForProduct
	},
	{
		url: '/admin/getspecialpropformforcategory',
		middleware: checkAccess,
		callback: getRequestsHandlers.getSpecialPropFormForCategory
	},
	{
		url: '/admin/getspecialpropslist',
		middleware: checkAccess,
		callback: getRequestsHandlers.getSpecialPropsList
	},
	{
		url: '/admin/getcallbacklist',
		middleware: checkAccess,
		callback: getRequestsHandlers.getCallbackList
	},
	{
		url: '/admin/getfeedback',
		middleware: checkAccess,
		callback: getRequestsHandlers.getFeedback
	},
	{
		url: '/admin/getallreviews',
		middleware: checkAccess,
		callback: getRequestsHandlers.getAllReviews
	}
];

var postRequests = [
	{
		url: '/ordercallback',
		middleware: noMiddleware,
		callback: postRequestsHandlers.orderCallback
	},
	{
		url: '/makeorder',
		middleware: noMiddleware,
		callback: postRequestsHandlers.makeOrder
	},
	{
		url: '/feedback',
		middleware: noMiddleware,
		callback: postRequestsHandlers.feedback
	},
	{
		url: '/postreview',
		middleware: noMiddleware,
		callback: postRequestsHandlers.postReview
	},
	/*admin routes*/
	{
		url: '/admin',
		middleware: checkAccess,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/admin.html');
		}
	},
	{
		url: '/login',
		middleware: noMiddleware,
		callback: postRequestsHandlers.loginHandler
	},
	{
		url: '/admin/changepassword',
		middleware: checkAccess,
		callback: postRequestsHandlers.changePassword
	},
	{
		url: '/admin/changeemail',
		middleware: checkAccess,
		callback: postRequestsHandlers.changeEmail
	},
	{
		url: '/admin/addmanagercomment',
		middleware: checkAccess,
		callback: postRequestsHandlers.addManagerComment
	},
	{
		url: '/admin/setfedexprice',
		middleware: checkAccess,
		callback: postRequestsHandlers.setFedexPrice
	},
	{
		url: '/admin/ordertowork',
		middleware: checkAccess,
		callback: postRequestsHandlers.orderToWork
	},
	{
		url: '/admin/markdoneorder',
		middleware: checkAccess,
		callback: postRequestsHandlers.markDoneOrder
	},
	{
		url: '/admin/searchorderbydate',
		middleware: checkAccess,
		callback: postRequestsHandlers.searchOrderByDate
	},
	{
		url: '/admin/addcategory',
		middleware: checkAccess,
		callback: postRequestsHandlers.addCategory
	},
	{
		url: '/admin/addsubcategory',
		middleware: checkAccess,
		callback: postRequestsHandlers.addSubCategory
	},
	{
		url: '/admin/changecategory',
		middleware: checkAccess,
		callback: postRequestsHandlers.changeCategory
	},
	{
		url: '/admin/changesubcategory',
		middleware: checkAccess,
		callback: postRequestsHandlers.changeSubCategory
	},
	{
		url: '/admin/addproduct',
		middleware: checkAccess,
		callback: postRequestsHandlers.addProduct
	},
	{
		url: '/admin/changeproduct',
		middleware: checkAccess,
		callback: postRequestsHandlers.changeProduct
	},
	{
		url: '/admin/moveproduct',
		middleware: checkAccess,
		callback: postRequestsHandlers.moveProduct
	},
	{
		url: '/admin/replenishproduct',
		middleware: checkAccess,
		callback: postRequestsHandlers.replenishProduct
	},
	{
		url: '/admin/addimagetogallery',
		middleware: checkAccess,
		callback: postRequestsHandlers.addImageToGallery
	},
	{
		url: '/admin/makehit',
		middleware: checkAccess,
		callback: postRequestsHandlers.makeHit
	},
	{
		url: '/admin/addspecialpropforproduct',
		middleware: checkAccess,
		callback: postRequestsHandlers.addSpecialPropForProduct
	},
	{
		url: '/admin/addspecialpropforcategory',
		middleware: checkAccess,
		callback: postRequestsHandlers.addSpecialPropForCategory
	},
	{
		url: '/admin/markseencallback',
		middleware: checkAccess,
		callback: postRequestsHandlers.markSeenCallback
	},
	{
		url: '/admin/choosepage',
		middleware: checkAccess,
		callback: postRequestsHandlers.choosePage	
	},
	{
		url: '/admin/changepage',
		middleware: checkAccess,
		callback: postRequestsHandlers.changePage
	}
];

var deleteRequests = [
	{
		url: '/admin/deletecategory',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteCategory
	},
	{
		url: '/admin/deletesubcategory',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteSubCategory
	},
	{
		url: '/admin/deleteproduct',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteProduct
	},
	{
		url: '/admin/deleteimage',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteImage
	},
	{
		url: '/admin/deletespecialprop',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteSpecialProp
	},
	{
		url: '/admin/deletecallback',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteCallback
	},
	{
		url: '/admin/deleteorder',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteOrder
	},
	{
		url: '/admin/deleteorderpermanently',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteOrderPermanently
	},
	{
		url: '/admin/deletefeedback',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteFeedback
	},
	{
		url: '/admin/deletereview',
		middleware: checkAccess,
		callback: deleteRequestsHandlers.deleteReview
	}
];

var router = function (app) {
	getRequests.forEach(function(request){
		app.get(request.url, request.middleware, request.callback);
	});
	postRequests.forEach(function(request){
		app.post(request.url, request.middleware, request.callback)
	});
	deleteRequests.forEach(function(request){
		app.delete(request.url, request.middleware, request.callback)
	});
};

module.exports.router = router;