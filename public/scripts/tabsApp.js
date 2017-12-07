$(document).ready(function(){
	forEachForIe();
	logOut();
	getNewOrdersQuantity();
	$(".tab").click(function(){ /*переключение вкладок*/
		getNewOrdersQuantity();
		var clickedTab = $(this);
		if (!$(this).parent().hasClass('active')) {
			$('.active').removeClass("active");
			$(this).parent().addClass("active");
			var targetFile = '../view/tabs/' + $(this).data('name') + ".html";
			$("#tabsData").empty();
			$(document).off();
			$.ajax({
				url: targetFile,
				success: function(html){
							$("#tabsData").append(html);
							$(".navbar-collapse").removeClass("in");
						}
			});
		}			
	});

});			

function forEachForIe(){ /*adding Array method forEach for Internet Explorer*/
	if (typeof Array.prototype.forEach != 'function') {
		Array.prototype.forEach = function(callback){
		  for (var i = 0; i < this.length; i++){
			callback.apply(this, [this[i], i, this]);
		  }
		};
	}
}	

function getNewOrdersQuantity(){
	$.ajax({
		url: '/admin/getnewordersquantity',
		success: function(data){
			$('#ordersQuantity').empty();
			$('#callsQuantity').empty();
			if(data.newOrders > 0) $('#ordersQuantity').append(' (' + data.newOrders + ')');
			if(data.newCalls > 0) $('#callsQuantity').append(' (' + data.newCalls + ')');
		}
	});
}

function logOut(){
	$('.logOut').on('click', function(e){
		e.preventDefault();
		$.ajax({
			url: '/admin/logout',
			success: function(){
				location.assign('/login');
			}
		});
	});
}		

