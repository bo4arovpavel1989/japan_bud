$(document).ready(function(){
	choosePage();
});

function choosePage(){
	$('#choosePage').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		console.log(1);
		console.log(formData);
		$.ajax({
			url: $that.attr('action'),
			type: $that.attr('method'),
			contentType: false,
			processData: false,
			data: formData,
			success: function(html){
					$('.changePageFormPlace').empty();
					$('.changePageFormPlace').append(html);
					changePage();
			}
		});
	});
}

function changePage(){
	$('#changePage').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
			url: $that.attr('action'),
			type: $that.attr('method'),
			contentType: false,
			processData: false,
			data: formData,
			success: function(html){
					$('.changePageFormPlace').empty();
					alert('Готово, начальник!');
			}
		});
	});
}