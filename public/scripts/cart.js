$(document).ready(function(){
	deleteProductFromCart();
	calculateTotalPrice();
	calculateTotalWeight();
	cartSubmit();
	var cartTitle = document.getElementById("cartTitle");
	cartTitle.scrollIntoView(true);
	switchCartSection();
	clearCart();
	triggerSelectPunktLink();
});

function openPrevSection(button){
		button.parent().hide(400);
		button.parent().prev().removeClass('active');
		button.parent().prev().prev().show(400);
		button.parent().prev().prev().prev().addClass('active');
}

function openNextSection(button){
		button.parent().hide(400);
		button.parent().prev().removeClass('active');
		button.parent().next().addClass('active');
		button.parent().next().next().show(400);
}


function recalculatePrice(priceField) {
	var price = priceField.parent().prev().data('price');
	var weight = priceField.parent().prev().data('weight');
	
	var newPrice = Number(price) * priceField.val();
	newPrice = Math.floor(newPrice);
	priceField.parent().next().next().children('.sumPrice').html(newPrice);
	
	var newWeight = Number(weight) * priceField.val();
	newWeight = Math.floor(newWeight);
	priceField.parent().next().children('.sumWeight').html(newWeight);
	
	calculateTotalPrice();
	calculateTotalWeight();
}


function deleteProductFromCart(){
	$('.deleteProductFromCart').on('click', function(e){
		$(this).parent().parent().remove();
		calculateTotalPrice();
		e.preventDefault();
	});
}

function calculateTotalPrice(){
	var totalPrice = new Number;
	var price;
	$('.sumPrice').each(function(){
		price = $(this).html();
		price = parseInt(price);
		totalPrice += price;
	});
	$('#totalPrice').html(totalPrice + ' руб.');
};

function calculateTotalWeight(){
	var totalWeight = 0;
	var weight;
	$('.sumWeight').each(function(){
		weight = $(this).html();
		weight = parseInt(weight);
		totalWeight += weight;
	});
	$('#totalWeight').html(totalWeight);
}

function selectPunkt(punktInfo) { 
  var address = '';
  address += ("Город: " + punktInfo.city); 
  address += ("\r\nID пункта выдачи: " + punktInfo.id); 
  address += ("\r\nНазвание (метро или адрес): " + punktInfo.name); 
  address += ("\r\nАдрес: " + punktInfo.address); 
  $('#selectedPunkt').val(address);
  $('#selectedPunkt').show(400);
  $('#pickup').prop('checked', true);
  $('#fedex').prop('checked', false);
} 

function cartSubmit() {
	$('#cartForm').on('submit', function(e){
		e.preventDefault();
		document.getElementById('makeOrder').disabled = true; /*JQuery selector doesnt work somewhy*/
		var data = {
			product: [],
			info: {}
		};
		var productCount = 0;
		$('.productItem').each(function(){
			data.product.push({_id: $(this).data('id'), name:  $(this).find('a').html(), howMany: $(this).next().find('.productHowMany').val()});
			productCount++;
		});
		data.fedex = $('input[name="fedex"]:checked').val();
		console.log(data.fedex);
		if (data.fedex == "Самовывоз") data.outpost = $('#selectedPunkt').val();
		data.productCount = productCount;
		data.name = $('#customerName').val(); 
		data.email = $('#customerEmail').val();
		data.phone = $('#customerPhone').val();
		data.address = $('#customerAddress').val();
		data.comment = $('#customerComment').val();
		$.ajax({
        type: "POST",
        url: "/makeorder",
        data: data,
        contentType: "application/x-www-form-urlencoded",
        success: function(){
			alert("Заказ принят в работу!");
			deleteCookie('cart');
			location.assign('/');
		}
  });
	});
}

function switchCartSection(){
	$('.cart-section').on('click', function(){
		if(!$(this).hasClass('active')) {
			$('.active.cart-section').next().hide(400);
			$('.active.cart-section').removeClass('active');
			$(this).addClass('active');
			$(this).next().show(400);
		}
	});
}	

function showHideAddressField(id){
	if(id.attr('id') === 'pickup') {
		$('#customerAddress').addClass('hidden');
		$('#customerAddress').next().addClass('hidden');
		$('#customerAddress').next().next().addClass('hidden'); /*hiding br-tags*/
		$('#customerAddress').required = false;
	} else if (id.attr('id') !=='pickup')	{
		$('#customerAddress').removeClass('hidden');
		$('#customerAddress').next().removeClass('hidden');
		$('#customerAddress').next().next().removeClass('hidden'); /*showing br-tags*/
		$('#customerAddress').required = true;
	}
}

function triggerSelectPunktLink(){
	$('#pickup').on('click', function(){
		$('#selectPunkt').trigger('click');
	});
}

function clearCart(){
	$('#clearCart').on('click', function(e){
		e.preventDefault();
		var answer=confirm("Уверены? Ваш список покупок будет очищен и Вы будете перенаправлены на главную страницу!");
		if(answer) {
			deleteCookie('cart');
			location.assign('/');
		}
	});
}