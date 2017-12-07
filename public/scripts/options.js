	$(document).ready(function(){
		changePasswordSubmit();
		changeEmailSubmit();
	});
	
	function changePasswordSubmit() {
		$('.changePassword').on('submit', function(e){
			e.preventDefault();
			var $that = $(this);
			var formData = new FormData($that.get(0));
			$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				dataType: 'html',
				success: function(data){
						alert(data);
						$('.changePassword')[0].reset();
				}
			});	
		});
	}
	
	function changeEmailSubmit() {
		$('.changeEmail').on('submit', function(e){
			e.preventDefault();
			var $that = $(this);
			var formData = new FormData($that.get(0));
			$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				dataType: 'html',
				success: function(data){
						alert(data);
						$('.changeEmail')[0].reset();
				}
			});	
		});
	}