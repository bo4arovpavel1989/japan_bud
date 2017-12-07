var searchAvailable = true;
var loggedIn = false;

$(document).ready(function(){
	checkAdmin();
	getCallbackForm();
	menuSticky();
	searchProductRealtime();
	searchProductSubmit();
	categoryChoose();
	addToCart();
	checkCart();
	forEachForIe();
	showCategories();
});

function checkCart() {
	var cartArray = getCookie('cart');
	if (cartArray !== undefined) {
		cartArray = cartArray.split(', ');
		var quantity = cartArray.length;
		switch(quantity) {
			case 1: 
				$('.productQuantity').html('В <a href="/cart" id="cartLink"  class="active" title="Оформить заказ">корзине - <b>1</b></a> товар');
				break;
			case 2:
			case 3:
			case 4:
				$('.productQuantity').html('В <a href="/cart" id="cartLink"  class="active" title="Оформить заказ">корзине - <b>' + quantity + '</b></a> товара');
				break;
			default:
				$('.productQuantity').html('В <a href="/cart" id="cartLink"  class="active" title="Оформить заказ">корзине - <b>' + quantity + '</b></a> товаров');
		}
	}
}

function getCallbackForm() {
	$('.orderCallback').on('click', function(){
		$.ajax({
			url: '/getcallbackform',
			dataType: 'html',
			success: function(html) {
				$('.orderCallbackBanner').hide();
				$('.callback').hide();
				$('.callback').append(html);
				$('.callback').show(400);
				hideCallbackForm();
			}
		});
	});
}

function hideCallbackForm() {
	$(document).on('click', function(e) {
		if (!$(e.target).closest("#callbackForm").length) {
			$('#callbackForm').remove();
			$('.orderCallbackBanner').show(400);
		}
		e.stopPropagation();
	});
}

function menuSticky() {
	var closeWindowPositionY = document.querySelector('.navbar').offsetTop;
	$(window).scroll(function(){										
		if(window.scrollY > closeWindowPositionY) {
			document.querySelector('.navbar').classList.add('stickyMenu', 'container');
			document.querySelector('.banners').classList.add('rowBannersSticky');
		}	else {
			document.querySelector('.navbar').classList.remove('stickyMenu', 'container');
			document.querySelector('.banners').classList.remove('rowBannersSticky');
		}																			
	});
}


function searchProductSubmit() {
	$('.searchSubmit').on('click', function(){
		searchSuggestion();
	});
}

function searchProductRealtime() {
	$('.searchProduct').on('keyup', function(err, rep){
		if (searchAvailable) {
			searchAvailable = false;
			searchSuggestion();
			setTimeout(function(){searchAvailable = true}, 1000);
		}
	});
}


function searchSuggestion() {
	var productToFind = $('.searchProduct').val();
	console.log(productToFind);
	if (productToFind !== '') {
		var query = '/searchproduct?product=' + encodeURIComponent(productToFind); /*otherwise IE send wrong text(encoded)*/
		console.log(query);
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#searchResult').empty();
				$('#searchResult').addClass('active');
				$('#searchResult').append(html);
				clickSearchResutItem();
				hideSuggestion();
			}
		});
	}
}

function clickSearchResutItem(){
	$('#searchResult').on('change', function(){ /*made vie 'onchange' coz IE doesnt recognize otherwise*/
		var address = $(this).val();
		location.assign(address);
	});
}

function hideSuggestion() {
	$(document).on('click', function(e) {
		if($('#searchResult').hasClass('active')) {
			if (!$(e.target).closest("#searchArea").length) {
				$('#searchResult').removeClass('active');
			}
			e.stopPropagation();
		}
	});
}

function categoryChoose() {
	$('.categoryChoose').on('click', function(e){
		$(this).next().toggle(400);
		$(this).parent().toggleClass('active');
		$(this).toggleClass('active');
		e.preventDefault();
	});
}

function addToCart(){
	$('.btn-toCartButton').on('click', function(){
		var productId = $(this).data('id');
		var target=$(this).data('target');
		setCookie('cart', productId, {expires: 3600 * 24, path: '/'});
		checkCart();
		var target='#' + target;
		$(this).removeClass('btn-toCartButton');
		$(this).unbind('click');
		$(this).addClass('goToCart');
		goToCart();
		$(this).html('Оформить заказ');
		$(target)  
              .clone()  
              .css({'position' : 'absolute', 'z-index' : '999', top: $(this).offset().top-300, left:$(this).offset().left-100})  
              .appendTo('body')  
              .animate({opacity: 0.5,   
                            left:  $("#cart").offset()['left'], 
							top: $("#cart").offset()['top'],
                            width: 50,   
                            height: 50}, 500, function() {  
                    $(this).remove();  
        });  
	});
}

function goToCart(){
	$('.goToCart').on('click', function(){
	var cartArray = getCookie('cart');
	if (cartArray !== undefined) location.assign('/cart');	
	});
}

function showCategories(){
	$('.showCategories').on('click', function(e){
		e.preventDefault();
		$('.categoriesList').toggle(400);
		$(this).toggleClass('active');
	});
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};
  //options.path = '/';
  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  if(getCookie(name)) value = getCookie(name) + ', ' + value;
  
  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}

function checkAdmin(){
	var login = getCookie('login');
	if(login === 'admin') {
		$('#adminBookmark').show();
		loggedIn = true;
		$('#adminBookmark').on('click', function(){
			location.assign('/admin');
		});
	}
}

function forEachForIe(){ /*adding Array method forEach for Internet Explorer*/
	if (typeof Array.prototype.forEach != 'function') {
		Array.prototype.forEach = function(callback){
		  for (var i = 0; i < this.length; i++){
			callback.apply(this, [this[i], i, this]);
		  }
		};
	}
}