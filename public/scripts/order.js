var archivePage = 0;

$(document).ready(function(){
	getOrders();
	orderArchive();
	orderDeleted();
	backToOrders();
	searchClient();
	searchOrderByDate();

});

function getOrders(){
	$.ajax({
		url: '/admin/getorders',
		dataType: 'html',
		success: function(data) {
			$('#orderList').empty();
			$('#orderList').append(data);
			showInfo();
			orderToWork();
			showCommentForm();
			managerCommentSubmit();
			showFedexPriceForm();
			fedexPriceSubmit();
			doneOrder();
			deleteOrder();
			$('#moreOrders').addClass('hidden');
		}
	});
}

function showInfo(){
	$('.showInfo').on('click', function(){
		$(this).parent().next().toggleClass('hidden');
		return false;
	});
}

function orderToWork() {
	$('.markSeenOrder').on('click', function(){
		var orderId = $(this).data('id');
		var query = '/admin/ordertowork?order=' + orderId;
		$.ajax({
				url: query,
				type: 'post',
				dataType: 'html', 
				success: function(){
					getOrders();
				}
			});
		return false;	
	});
}

function doneOrder(){
	$('.markDoneOrder').on('click', function(){
		var answer = confirm('Заказ отработан?');
		if (answer) {
			var orderId = $(this).data('id');
			var query='/admin/markdoneorder?order=' + orderId;
			$.ajax({
					url: query,
					type: 'post',
					dataType: 'html',
					success: function(){
						getOrders();
					}
			});
		}
		return false;
	});
}

function deleteOrder(){
	$('.deleteOrder').on('click', function(){
		var answer = confirm('Уверен?');
		if (answer) {
			var answer2 = confirm(' Точно уверен?');
			if (answer2) {
			var orderId = $(this).data('id');
			var query='/admin/deleteorder?order=' + orderId;
			$.ajax({
					url: query,
					type: 'delete',
					dataType: 'html',
					success: function(){
						if($('#orderArchive').hasClass('hidden')) /*made this to return to the exact page user was (actual orders or archive)*/
							$.ajax({
								url: '/admin/getorderarchive',
								dataType: 'html',
								success: function(data) {
										$('#orderList').empty();
										$('#orderList').append(data);
										showInfo();
										deleteOrder();
										deleteOrderPermanently();
								}
							});
						else getOrders();
					}
			});
			}
		}
		return false;
	});
}

function deleteOrderPermanently(){
	$('.deleteOrderPermanently').on('click', function(e){
		e.preventDefault();
		var answer = confirm('Уверен?');
		if (answer) {
			var answer2 = confirm(' Точно уверен?');
			if (answer2) {
				var orderId = $(this).data('id');
				var query='/admin/deleteorderpermanently?order=' + orderId;
				$.ajax({
						url: query,
						type: 'delete',
						dataType: 'html',
						success: function(){
									$.ajax({
										url: '/admin/getorderdeleted',
										dataType: 'html',
										success: function(data) {
											$('#orderList').empty();
											$('#orderList').append(data);
											showInfo();
											deleteOrderPermanently();
										}
									});	
								}
				});
			}	
		}
	});
}

function orderArchive(){
	$('#orderArchive').on('click', function(){
		$(this).toggleClass('hidden');
		$('#orderDeleted').addClass('hidden');
		$('#backToOrders').toggleClass('hidden');
		$.ajax({
			url: '/admin/getorderarchive',
			dataType: 'html',
			success: function(data) {
				$('#orderList').empty();
				$('#orderList').append(data);
				showInfo();
				deleteOrder();
				$('#moreOrders').removeClass('hidden');
				moreOrderArchive();
			}
		});
		return false;
	});
}

function moreOrderArchive(){
	$('#moreOrders').on('click', function(e){
		e.preventDefault();
		archivePage++;
		var query='/admin/getmoreorderarchive?page=' + archivePage;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(data) {
				$('#orderList').append(data);
				showInfo();
				deleteOrder();
			}
		});
	});
}

function orderDeleted(){
	$('#orderDeleted').on('click', function(){
		$(this).addClass('hidden');
		$('#orderArchive').addClass('hidden');
		$('#backToOrders').removeClass('hidden');
		$.ajax({
			url: '/admin/getorderdeleted',
			dataType: 'html',
			success: function(data) {
				$('#orderList').empty();
				$('#orderList').append(data);
				showInfo();
				deleteOrderPermanently();
			}
		});
		return false;
	});
}

function backToOrders(){
	$('#backToOrders').on('click', function(){
		$(this).addClass('hidden');
		$('#orderArchive').removeClass('hidden');
		$('#orderDeleted').removeClass('hidden');
		getOrders();
		return false;
	});
}

function searchClient(){
	$('.searchClient').on('change', function(){
		var client = $('.searchClient').val();
		if (client !==''){
			var query = '/admin/searchclient?client=' + client;
			$.ajax({
				url: query,
				dataType: 'html',
				success: function(data) {
					$('#orderList').empty();
					$('#orderList').append(data);
					$('#orderDeleted').addClass('hidden');
					$('#orderArchive').addClass('hidden');
					$('#backToOrders').removeClass('hidden');
					$('#moreOrders').addClass('hidden');
					showInfo();
				}
			});
		}
	});
}

function searchOrderByDate() {
	$('#searchOrderByDate').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		console.log(formData);
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(data){
						$('#orderList').empty();
						$('#orderList').append(data);
						$('#orderDeleted').addClass('hidden');
						$('#orderArchive').addClass('hidden');
						$('#backToOrders').removeClass('hidden');
						$('#moreOrders').addClass('hidden');
						showInfo();
				}
		});
	});
}

function showCommentForm(){
	$('.makeComment').on('click', function(e){
		e.preventDefault();
		$(this).parent().next().next().toggleClass('hidden');
	});
	
}

function managerCommentSubmit(){
	$('.managerCommentForm').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(){
						getOrders();
				}
		});
		
		
	});
}

function showFedexPriceForm(){
	$('.setFedexPrice').on('click', function(e){
		e.preventDefault();
		$(this).parent().next().next().next().toggleClass('hidden');
	});
	
}

function fedexPriceSubmit(){
	$('.fedexPriceForm').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(){
						getOrders();
				}
		});
		
		
	});
}