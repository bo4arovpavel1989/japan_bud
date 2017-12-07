var page=0;
$(document).ready(function(){
	getFeedback();
	moreFeedback();
});
	
function getFeedback(){
	$.ajax({
		url: '/admin/getfeedback?page=' + page,
		success: function(data){
			$('#feedBackList').append(data);
			deleteFeedback();
		}
	});
}	

function deleteFeedback(){
	$('.deleteFeedback').on('click', function(e){
		e.preventDefault();
		var answer = confirm('Уверен?');
		var feedback = $(this).data('id');
		if (answer) {
			var deleteQuery = '/admin/deletefeedback?feedback=' + feedback;
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						$('#feedBackList').empty();
						getFeedback();
				}
			});
		}
	});
}

function moreFeedback(){
	$('.moreFeedback').on('click', function (e){
		e.preventDefault();
		page+=10;
		getFeedback();
	});
}