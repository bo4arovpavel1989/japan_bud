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
	var fedexPrice = calculateFedexPrice(totalWeight);
	$('#postprice').html(fedexPrice[0]);
	$('#posttrackprice').html(fedexPrice[1]);
	$('#fedexPrice').val(fedexPrice[0])
}

function calculateFedexPrice(totalWeight){
	if (totalWeight <= 100) return [130,360]
	else if(totalWeight > 100 && totalWeight <= 200) return [180,420]
	else if(totalWeight > 200 && totalWeight <= 300) return [230,480]
	else if(totalWeight > 300 && totalWeight <= 400) return [290,540]
	else if(totalWeight > 400 && totalWeight <= 500) return [350,600]
	else if(totalWeight > 500 && totalWeight <= 600) return [410,660]
	else if(totalWeight > 600 && totalWeight <= 700) return [470,720]
	else if(totalWeight > 700 && totalWeight <= 800) return [530,780]
	else if(totalWeight > 800 && totalWeight <= 900) return [590,840]
	else if(totalWeight > 900 && totalWeight <= 1000) return [650,900]
	else if(totalWeight > 1000 && totalWeight <= 1100) return [710,960]
	else if(totalWeight > 1100 && totalWeight <= 1200) return [770,1020]
	else if(totalWeight > 1200 && totalWeight <= 1300) return [830,1080]
	else if(totalWeight > 1300 && totalWeight <= 1400) return [890,1140]
	else if(totalWeight > 1400 && totalWeight <= 1500) return [950,1200]
	else if(totalWeight > 1500 && totalWeight <= 1600) return [1010,1260]
	else if(totalWeight > 1600 && totalWeight <= 1700) return [1070,1320]
	else if(totalWeight > 1700 && totalWeight <= 1800) return [1130,1380]
	else if(totalWeight > 1800 && totalWeight <= 1900) return [1190,1440]
	else if(totalWeight > 1900) return [1250,1500];
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
		data.fedexPrice = $('#fedexPrice').val();
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

function setFedexPrice(id){
	var price;
	
	if(id.attr('id') === 'post') 
		price = Number($('#postprice').html());
	else if (id.attr('id') ==='track')	
		price = Number($('#posttrackprice').html());
	
	$('#fedexPrice').val(price)
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