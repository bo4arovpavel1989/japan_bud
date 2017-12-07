$(document).ready(function(){
	getCategories();
	addCategorySubmit();
});
	
function getCategories () {	
			$.ajax({
					url: '/admin/getcategories',
					dataType: 'html',
					success: function(html){
						$("#categories").empty();
						$("#categories").append(html);
						addSubCategorySubmit();
						deleteCategory();
						changeCategory();
						deleteSubCategory();
						changeSubCategory()
					}
				});
}

function addCategorySubmit(){
	$('#addCategory').on('submit', function(e){
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
				success: function(){
						alert('Rатегория добавлена');
						$('#inputCategory').val('');
						getCategories();
				}
		});
	});
}

function addSubCategorySubmit () {
	$('#addSubCategory').on('submit', function(e){
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
						alert('Подкатегория добавлена');
						$('#inputSubCategory').val('');
						getCategories();
				}
		});
		
	});
}

function deleteCategory() {
	$('.deleteCategory').on('click', function(){
		var answer = confirm('Уверен?');
		var category = $(this).data('id');
		if (answer) {
			var deleteQuery = '/admin/deletecategory?category=' + category;
			console.log(deleteQuery);
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						getCategories();
				}
			});
		}
	});	
}

function changeCategory() {
	$('.changeCategory').on('click', function(e){
		e.preventDefault();
		var category = $(this).data('id');
		var oldName = $(this).data('name');
		var rank = $(this).data('rank');
		$.ajax({
			url: "../view/forms/changecategoryform.html",
			success: function(html) {
				$('#changeCategoryFormPlace').empty();
				$('#changeCategoryFormPlace').append(html);
				$('#inpuCategoryId').val(category);
				$('#inputRate').val(rank);
				$('#inputNewCategory').val(oldName).focus();
				changeCategorySubmit();
				return false;
			}
		});
	});
}

function changeCategorySubmit(){
	$('#changeCategory').on('submit', function(e){
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
				success: function(){
						$('#changeCategoryFormPlace').empty();
						getCategories();
				}
		});
	});
}

function deleteSubCategory() {
	$('.deleteSubCategory').on('click', function(){
		var answer = confirm('Уверен?');
		var subcategory = $(this).data('id');
		var parentCategory = $(this).data('parentid');
		if (answer) {
			var deleteQuery = '/admin/deletesubcategory?subcategory=' + subcategory + '&parentcategory=' + parentCategory;
			console.log(deleteQuery);
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						getCategories();
				}
			});
		}
	});	
}

function changeSubCategory() {
	$('.changeSubCategory').on('click', function(e){
		e.preventDefault();
		var subcategory = $(this).data('id');
		var oldName = $(this).data('name');
		var parentCategory = $(this).data('parentid');
			$.ajax({
				url: "../view/forms/changesubcategoryform.html",
				success: function(html) {
					$('#changeCategoryFormPlace').empty();
					$('#changeCategoryFormPlace').append(html);
					$('#inputCategoryId').val(parentCategory);
					$('#inputSubCategoryId').val(subcategory);
					$('#inputNewSubCategory').val(oldName).focus();
					changeSubCategorySubmit();
					return false;
				}
			});
	});
}

function changeSubCategorySubmit(){
	$('#changeSubCategory').on('submit', function(e){
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
				success: function(){
						$('#changeCategoryFormPlace').empty();
						getCategories();
				}
		});
	});
}