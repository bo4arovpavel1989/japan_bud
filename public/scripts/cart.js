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
	$('#emsprice').html(fedexPrice[2])
	$('#fedexPrice').val(fedexPrice[0])
}

function calculateFedexPrice(totalWeight){
	if (totalWeight <= 100) return [130,360]
	else if(totalWeight > 100 && totalWeight <= 200) return [180,420,1200]
	else if(totalWeight > 200 && totalWeight <= 300) return [230,480,1200]
	else if(totalWeight > 300 && totalWeight <= 400) return [290,540,1200]
	else if(totalWeight > 400 && totalWeight <= 500) return [350,600,1200]
	else if(totalWeight > 500 && totalWeight <= 600) return [410,660,1400]
	else if(totalWeight > 600 && totalWeight <= 700) return [470,720,1500]
	else if(totalWeight > 700 && totalWeight <= 800) return [530,780,1600]
	else if(totalWeight > 800 && totalWeight <= 900) return [590,840,1700]
	else if(totalWeight > 900 && totalWeight <= 1000) return [650,900,1800]
	else if(totalWeight > 1000 && totalWeight <= 1100) return [710,960,2100]
	else if(totalWeight > 1100 && totalWeight <= 1200) return [770,1020,2100]
	else if(totalWeight > 1200 && totalWeight <= 1250) return [830,1080,2100]
	else if(totalWeight > 1250 && totalWeight <= 1300) return [830,1080,2300]
	else if(totalWeight > 1300 && totalWeight <= 1400) return [890,1140,2300]
	else if(totalWeight > 1400 && totalWeight <= 1500) return [950,1200,2300]
	else if(totalWeight > 1500 && totalWeight <= 1600) return [1010,1260,2600]
	else if(totalWeight > 1600 && totalWeight <= 1700) return [1070,1320,2600]
	else if(totalWeight > 1700 && totalWeight <= 1750) return [1130,1380,2600]
	else if(totalWeight > 1750 && totalWeight <= 1800) return [1130,1380,2900]
	else if(totalWeight > 1800 && totalWeight <= 1900) return [1190,1440,2900]
	else if(totalWeight > 1900 && totalWeight <= 2000) return [1250,1500,2900]
	else if(totalWeight > 2000 && totalWeight <= 2500) return [1250,1500,3300]
	else if(totalWeight > 2500 && totalWeight <= 3000) return [1250,1500,3800]
	else if(totalWeight > 3000 && totalWeight <= 3500) return [1250,1500,4200]
	else if(totalWeight > 3500 && totalWeight <= 4000) return [1250,1500,4700]
	else if(totalWeight > 4000 && totalWeight <= 4500) return [1250,1500,5200]
	else if(totalWeight > 4500 && totalWeight <= 5000) return [1250,1500,5600]
	else if(totalWeight > 5000 && totalWeight <= 5500) return [1250,1500,6100]
	else if(totalWeight > 5500 && totalWeight <= 6000) return [1250,1500,6600]
	else if(totalWeight > 6000 && totalWeight <= 7000) return [1250,1500,7300]
	else if(totalWeight > 7000 && totalWeight <= 8000) return [1250,1500,8100]
	else if(totalWeight > 8000 && totalWeight <= 9000) return [1250,1500,8800]
	else if(totalWeight > 9000 && totalWeight <= 10000) return [1250,1500,9600]
	else if(totalWeight > 10000 && totalWeight <= 11000) return [1250,1500,10300]
	else if(totalWeight > 11000 && totalWeight <= 12000) return [1250,1500,11100]
	else if(totalWeight > 12000 && totalWeight <= 13000) return [1250,1500,11900]
	else if(totalWeight > 13000 && totalWeight <= 14000) return [1250,1500,12600]
	else if(totalWeight > 14000 && totalWeight <= 15000) return [1250,1500,13300]
	else if(totalWeight > 15000 && totalWeight <= 16000) return [1250,1500,14100]
	else if(totalWeight > 16000 && totalWeight <= 17000) return [1250,1500,14900]
	else if(totalWeight > 17000 && totalWeight <= 18000) return [1250,1500,15600]
	else if(totalWeight > 18000 && totalWeight <= 19000) return [1250,1500,16400]
	else if(totalWeight > 19000 && totalWeight <= 20000) return [1250,1500,17100]
	else if(totalWeight > 20000 && totalWeight <= 21000) return [1250,1500,17900]
	else if(totalWeight > 21000 && totalWeight <= 22000) return [1250,1500,18600]
	else if(totalWeight > 22000 && totalWeight <= 23000) return [1250,1500,19400]
	else if(totalWeight > 23000 && totalWeight <= 24000) return [1250,1500,20100]
	else if(totalWeight > 24000 && totalWeight <= 25000) return [1250,1500,20900]
	else if(totalWeight > 25000 && totalWeight <= 26000) return [1250,1500,21600]
	else if(totalWeight > 26000 && totalWeight <= 27000) return [1250,1500,22400]
	else if(totalWeight > 27000 && totalWeight <= 28000) return [1250,1500,23200]
	else if(totalWeight > 28000 && totalWeight <= 29000) return [1250,1500,23900]
	else if(totalWeight > 29000 && totalWeight <= 30000) return [1250,1500,24700]
	else if(totalWeight > 30000) return [1250,1500,24700]
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
	else if (id.attr('id') ==='ems')	
		price = Number($('#emsprice').html());
	
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