$(document).ready(function(){
	getAddSpecialPropFormForProduct();
	getAddSpecialPropFormForCategory();
	getSpecialPropsList();
});

function getAddSpecialPropFormForProduct() {
	$('#showAddSpecialPropForProduct').on('click', function(){
		$.ajax({
			url: '/admin/getspecialpropformforproduct',
			type: 'get',
			dataType: 'html',
			success: function(html) {
				$('#addSpecialPropFormPlace').empty();
				$('#addSpecialPropFormPlace').append(html);
				$('#addSpecialPropFormPlace').toggleClass('hidden');
				specialPropFormForProductSubmit();
			}
		});
	});
}

function getAddSpecialPropFormForCategory() {
	$('#showAddSpecialPropForCategory').on('click', function(){
		$.ajax({
			url: '/admin/getspecialpropformforcategory',
			type: 'get',
			dataType: 'html',
			success: function(html) {
				$('#addSpecialPropFormPlace').empty();
				$('#addSpecialPropFormPlace').append(html);
				$('#addSpecialPropFormPlace').toggleClass('hidden');
				specialPropFormForCategorySubmit();
			}
		});
	});
}

function getSpecialPropsList() {
	$.ajax({
		url: '/admin/getspecialpropslist',
		type: 'get',
		dataType: 'html',
		success: function(html) {
			$('#specialPropsList').empty();
			$('#specialPropsList').append(html);
			deleteSpecialProp();
		}
	});
}
function deleteSpecialProp(){
	$('.deleteSpecialProp').on('click', function(){
		var answer = confirm('Уверен?');
		if(answer) {
			var specialProp = $(this).data('id');
			var query='/admin/deletespecialprop?specialprop=' + specialProp;
			$.ajax({
				url: query,
				type: 'delete',
				success: function(){
					alert('Акция удалена');
					getSpecialPropsList();
				}
			});
		}
	});
}

function specialPropFormForProductSubmit() {
	$('#addSpecialPropForProduct').on('submit', function(e){
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
					$('#addSpecialPropFormPlace').toggleClass('hidden');
					getSpecialPropsList();
				}
		});
	});
}

function specialPropFormForCategorySubmit() {
	$('#addSpecialPropForCategory').on('submit', function(e){
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
					$('#addSpecialPropFormPlace').toggleClass('hidden');
					getSpecialPropsList();
				}
		});
	});
}