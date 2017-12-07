var page=0;
$(document).ready(function(){
	getReviews();
	moreReviews();
});
	
function getReviews(){
	$.ajax({
		url: '/admin/getallreviews?page=' + page,
		success: function(data){
			$('.reviewList').append(data);
			page += 10;
			$('.showForAdmin').show();
			deleteReview();
		}
	});
}

function moreReviews(){
	$('.moreReviews').on('click', function(e){
		e.preventDefault();
		getReviews();
	});
}
function deleteReview(){
	$('.deleteReview').on('click', function(e){
		e.preventDefault();
		var that = $(this);
		var answer = confirm('Уверен?');
		var review = $(this).data('id');
		if (answer) {
			var deleteQuery = '/admin/deletereview?review=' + review;
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						that.parent().parent().remove();
				}
			});
		}
	});
}
