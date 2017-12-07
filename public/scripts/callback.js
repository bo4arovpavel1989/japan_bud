$(document).ready(function(){
	getCallbackList();
});

function getCallbackList(){
	$.ajax({
		url: '/admin/getcallbacklist',
		dataType: 'html',
		success: function(html){
			$('#callbackList').empty();
			$('#callbackList').append(html);
			deleteCallback();
			markSeen();
		}
	});
}

function deleteCallback(){
	$('.deleteCallback').on('click', function(e){
		e.preventDefault();
		var callbackId = $(this).data('id');
		var answer = confirm('Уверен?');
		if(answer) {
			var query = '/admin/deletecallback?callback=' + callbackId;
			$.ajax({
				url:query,
				type: 'delete',
				success: function(){
					alert('Звонок удален');
					getCallbackList();
				}
			});
		}
	});
}

function markSeen(){
	$('.markSeen').on('click', function(e){
		e.preventDefault();
		var callbackId = $(this).data('id');
		var query = '/admin/markseencallback?callback=' + callbackId;
		$.ajax({
			url: query,
			type: 'post',
			success: function(){
				getCallbackList();
			}
		});
	});
}