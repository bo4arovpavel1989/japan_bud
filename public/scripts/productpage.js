var page = 0;
var product;
$(document).ready(function(){
	if(loggedIn) {
		$('.deleteImage').each(function(){
			$(this).removeClass('hidden');
		});
		deleteImage();
	}
	goBack();
	showReviewSection();
	moreReviews();
});
function goBack(){
	$('.goBack').on('click', function(e){
		e.preventDefault();
		history.back();
	});
}

function deleteImage(){
	$('.deleteImage').on('click', function(e){
		e.preventDefault();
		var answer=confirm('Уверен?');
		var image = $(this).data('image');
		var image_thumb = $(this).data('image_thumb');
		var product = $(this).data('id');
		var query='/admin/deleteimage?image=' + image + '&product=' + product + '&image_thumb=' + image_thumb;
		if (answer)
		$.ajax({
			url: query,
			type: 'delete',
			success: function(){
				location.reload();
			}
		});
	});
}

function showReviewSection(){
	$('.showReviewSection').on('click', function(e){
		e.preventDefault();
		var that = $(this);
		$('.reviewSection').toggle(400, function(){
			if ($('.reviewSection').is(':visible')) {
				page = 0;
				product = that.data('product');
				console.log(product);
				getReviews();
				$('.showReviewSection').addClass('active');
			}	else {
					$('.reviewList').empty();
					$('.showReviewSection').removeClass('active');
				}	
		}); 
			
	});
}

function getReviews(){
	$.ajax({
		url: '/getproductreview?product=' + product + '&page=' + page,
		success: function(data){
			$('.reviewList').append(data);
			page += 10;
		}
	});
}

function moreReviews(){
	$('.moreReviews').on('click', function(e){
		e.preventDefault();
		getReviews();
	});
}