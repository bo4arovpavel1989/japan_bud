var fedexType='post';

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
		calculateTotalWeight();
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
	var leftPackage; //for weigth more than 2000
	var fullPackage; //for weigth more than 2000
	var sal1, sal2; //for weigth more than 2000
	var weight;
	$('.sumWeight').each(function(){
		weight = $(this).html();
		weight = parseInt(weight);
		totalWeight += weight;
	});
	$('#totalWeight').html(totalWeight);
	if (totalWeight > 2000) {
		fullPackage = Math.floor(totalWeight/2000);
		leftPackage = totalWeight % 2000;
		sal1 = 1250 * fullPackage + calculateFedexPrice(leftPackage)[0];
		sal2 = 1500* fullPackage + calculateFedexPrice(leftPackage)[1];
		$('#postprice').html(sal1);
		$('#posttrackprice').html(sal2);
		$('#emsprice').html(calculateFedexPrice(totalWeight)[2])
		if(fedexType==='post')
			$('#fedexPrice').val(sal1);
		else if(fedexType==='track')
			$('#fedexPrice').val(sal2);
		else if(fedexType==='ems')
			$('#fedexPrice').val(calculateFedexPrice(totalWeight)[2]);
	} else {
		var fedexPrice = calculateFedexPrice(totalWeight);
		$('#postprice').html(fedexPrice[0]);
		$('#posttrackprice').html(fedexPrice[1]);
		$('#emsprice').html(fedexPrice[2])
		if(fedexType==='post')
			$('#fedexPrice').val(fedexPrice[0]);
		else if(fedexType==='track')
			$('#fedexPrice').val(fedexPrice[1]);
		else if(fedexType==='ems')
			$('#fedexPrice').val(fedexPrice[2]);
	}
}

function calculateFedexPrice(totalWeight){
	if (totalWeight <= 100) return [130,400,1200]
	else if(totalWeight > 100 && totalWeight <= 200) return [185,455,1200]
	else if(totalWeight > 200 && totalWeight <= 300) return [250,520,1200]
	else if(totalWeight > 300 && totalWeight <= 400) return [320,590,1200]
	else if(totalWeight > 400 && totalWeight <= 500) return [380,650,1200]
	else if(totalWeight > 500 && totalWeight <= 600) return [450,720,1400]
	else if(totalWeight > 600 && totalWeight <= 700) return [510,780,1500]
	else if(totalWeight > 700 && totalWeight <= 800) return [580,850,1600]
	else if(totalWeight > 800 && totalWeight <= 900) return [640,910,1700]
	else if(totalWeight > 900 && totalWeight <= 1000) return [710,980,1800]
	else if(totalWeight > 1000 && totalWeight <= 1100) return [770,1040,2100]
	else if(totalWeight > 1100 && totalWeight <= 1200) return [840,1110,2100]
	else if(totalWeight > 1200 && totalWeight <= 1250) return [900,1170,2100]
	else if(totalWeight > 1250 && totalWeight <= 1300) return [900,1170,2300]
	else if(totalWeight > 1300 && totalWeight <= 1400) return [970,1240,2300]
	else if(totalWeight > 1400 && totalWeight <= 1500) return [1030,1300,2300]
	else if(totalWeight > 1500 && totalWeight <= 1600) return [1100,1370,2600]
	else if(totalWeight > 1600 && totalWeight <= 1700) return [1160,1430,2600]
	else if(totalWeight > 1700 && totalWeight <= 1750) return [1230,1500,2600]
	else if(totalWeight > 1750 && totalWeight <= 1800) return [1230,1500,2900]
	else if(totalWeight > 1800 && totalWeight <= 1900) return [1290,1560,2900]
	else if(totalWeight > 1900 && totalWeight <= 2000) return [1360,1630,2900]
	else if(totalWeight > 2000 && totalWeight <= 2500) return [1360,1630,3300]
	else if(totalWeight > 2500 && totalWeight <= 3000) return [1360,1630,3800]
	else if(totalWeight > 3000 && totalWeight <= 3500) return [1360,1630,4200]
	else if(totalWeight > 3500 && totalWeight <= 4000) return [1360,1630,4700]
	else if(totalWeight > 4000 && totalWeight <= 4500) return [1360,1630,5200]
	else if(totalWeight > 4500 && totalWeight <= 5000) return [1360,1630,5600]
	else if(totalWeight > 5000 && totalWeight <= 5500) return [1360,1630,6100]
	else if(totalWeight > 5500 && totalWeight <= 6000) return [1360,1630,6600]
	else if(totalWeight > 6000 && totalWeight <= 7000) return [1360,1630,7300]
	else if(totalWeight > 7000 && totalWeight <= 8000) return [1360,1630,8100]
	else if(totalWeight > 8000 && totalWeight <= 9000) return [1360,1630,8800]
	else if(totalWeight > 9000 && totalWeight <= 10000) return [1360,1630,9600]
	else if(totalWeight > 10000 && totalWeight <= 11000) return [1360,1630,10300]
	else if(totalWeight > 11000 && totalWeight <= 12000) return [1360,1630,11100]
	else if(totalWeight > 12000 && totalWeight <= 13000) return [1360,1630,11900]
	else if(totalWeight > 13000 && totalWeight <= 14000) return [1360,1630,12600]
	else if(totalWeight > 14000 && totalWeight <= 15000) return [1360,1630,13300]
	else if(totalWeight > 15000 && totalWeight <= 16000) return [1360,1630,14100]
	else if(totalWeight > 16000 && totalWeight <= 17000) return [1360,1630,14900]
	else if(totalWeight > 17000 && totalWeight <= 18000) return [1360,1630,15600]
	else if(totalWeight > 18000 && totalWeight <= 19000) return [1360,1630,16400]
	else if(totalWeight > 19000 && totalWeight <= 20000) return [1360,1630,17100]
	else if(totalWeight > 20000 && totalWeight <= 21000) return [1360,1630,17900]
	else if(totalWeight > 21000 && totalWeight <= 22000) return [1360,1630,18600]
	else if(totalWeight > 22000 && totalWeight <= 23000) return [1360,1630,19400]
	else if(totalWeight > 23000 && totalWeight <= 24000) return [1360,1630,20100]
	else if(totalWeight > 24000 && totalWeight <= 25000) return [1360,1630,20900]
	else if(totalWeight > 25000 && totalWeight <= 26000) return [1360,1630,21600]
	else if(totalWeight > 26000 && totalWeight <= 27000) return [1360,1630,22400]
	else if(totalWeight > 27000 && totalWeight <= 28000) return [1360,1630,23200]
	else if(totalWeight > 28000 && totalWeight <= 29000) return [1360,1630,23900]
	else if(totalWeight > 29000 && totalWeight <= 30000) return [1360,1630,24700]
	else if(totalWeight > 30000) return [1360,1630,24700]
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
			success: function(num){
				/* no robokassa */
				
					//alert("Заказ принят в работу!");
					//deleteCookie('cart');
					//location.assign('/');
				
				/* end no robokassa */
				
				/* robokassa attouched */
					if(num)
						location.assign('/pay/order/'+num);
					else {
						alert('Ошибка оформления заказа. Попробуйте снова.')
						location.reload();
					}	
				
				/* end robokassa */
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
	
	if(id.attr('id') === 'post') {
		fedexType='post';
		price = Number($('#postprice').html());
	}	
	else if (id.attr('id') ==='track')	{
		fedexType='track';
		price = Number($('#posttrackprice').html());
	}	
	else if (id.attr('id') ==='ems')	{
		fedexType='ems';
		price = Number($('#emsprice').html());
	}	
	
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