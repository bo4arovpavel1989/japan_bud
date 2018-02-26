var filter='';

$(document).ready(function(){
	getCategoryFilter();
	getProductAddForm();
	getProductsList();
});


function getCategoryFilter(){
	$.ajax({
		url: '/admin/getcategoryfilter',
		dataType: 'html',
		success: function(html){
			$('#categoryFilterPlace').append(html);
			useCategoryFilter();
			uncheckAll();
			checkAll();
			showHits();
		}
	});
}

function useCategoryFilter() {
	$('#categoryFilterForm').on('submit', function(e){
		e.preventDefault();
		filter='';
		var checkBoxes = document.getElementsByName('categoryFilter');
		var counter = 0;
		checkBoxes.forEach(function(checkBox){
			if(checkBox.checked == true) {
				filter += '&category' + counter + '=' + checkBox.value;
				counter++;
			}
		});
		filter += '&counter=' + counter;
		getProductsList();
	});
}

function uncheckAll(){
	$('.uncheckAll').on('click', function(e){
		e.preventDefault();
		var checkBoxes = document.getElementsByName('categoryFilter');
		checkBoxes.forEach(function(checkBox){
			checkBox.checked = false;
		});
	});
}

function checkAll(){
	$('.checkAll').on('click', function(e){
		e.preventDefault();
		var checkBoxes = document.getElementsByName('categoryFilter');
		checkBoxes.forEach(function(checkBox){
			checkBox.checked = true;
		});
	});
}

function showHits(){
	$('.showHits').on('click', function(e){
		e.preventDefault();
		filter='';
		getProductsList();
	});
}

function getProductAddForm(){
	$.ajax({
		url: '/admin/getproductaddform',
		dataType: 'html',
		success: function(html){
			$('#addProductFormPlace').append(html);
			getSubCategories();
			addProductSubmit();
			showAddProductForm();
			closeForm();
			translitName();
		}
	});
}

function getSubCategories() {
	$('#productAddCategory').on('change', function(){
		var category=$('#productAddCategory option:selected').val();
		var query = '/admin/getsubcategories?category=' + category;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#productAddSubcategory').empty();
				$('#productAddSubcategory').append(html);
			}
		});
	});
}


function translitName(){
	$('#inputName').on('blur',function(){
		var russianName = $('#inputName').val();
		var dictionary={' ':'-', 'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ж':'g', 'з':'z', 'и':'i', 'й':'y', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'ы':'i', 'э':'e', 'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ж':'G', 'З':'Z', 'И':'I', 'Й':'Y', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O', 'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Ы':'I', 'Э':'E', 'ё':'yo', 'х':'h', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch', 'ъ':'', 'ь':'', 'ю':'yu', 'я':'ya', 'Ё':'YO', 'Х':'H', 'Ц':'TS', 'Ч':'CH', 'Ш':'SH', 'Щ':'SHCH', 'Ъ':'', 'Ь':'','Ю':'YU', 'Я':'YA'};
		var translitName = russianName.replace(/[^0-9]/g, function(x){
	    if( dictionary.hasOwnProperty( x ) )
	      return dictionary[ x ];
			return x;
		});
		$('#inputAddress').val(translitName);
	});
}

function addProductSubmit() {
	$('#addProduct').on('submit', function(e){
		e.preventDefault();
		document.getElementById('addProductButton').disabled = true;
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
						alert('Товар добавлен');
						$('#addProductFormPlace').toggleClass('hidden');
						$('#productsList').toggleClass('hidden');
						getProductsList();
				}
		});
		
	});
}

function showAddProductForm(){
	$('#showAddProductForm').on('click', function(){
		document.getElementById('addProductButton').disabled = false;
		$('#addProductFormPlace').toggleClass('hidden');
		$('#productsList').toggleClass('hidden');
	});
}

function closeForm() {
	$('.cancelButton').on('click', function(){
		$(this).closest('.formPlace').empty();
		$('#productsList').removeClass('hidden');
	});
};


function getProductsList() {
	var query = '/admin/getproductslist';
	if (filter !== '') query += '?';
	query += filter;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#productsList').empty();
				$('#productsList').append(html);
				deleteProduct();
				changeProduct();
				showReplenishmentForm();
				makeHit();
				replenishmentFormSubmit();
				showGalleryForm();
				galleryFormSubmit();
				moveProductToCategory();
			}
		});
}


function deleteProduct() {
	$('.deleteProduct').on('click', function(e){
		e.preventDefault();
		var answer = confirm('Уверен?');
		var product = $(this).data('id');
		if (answer) {
			var deleteQuery = '/admin/deleteproduct?product=' + product;
			console.log(deleteQuery);
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						getProductsList();
				}
			});
		}
	});	
}

function changeProduct() {
	$('.changeProduct').on('click', function(e){
		e.preventDefault();
		var product = $(this).data('id');
		var query = '/admin/getchangeproductform?product=' + product;
		$.ajax({
			url: query,
			type: 'get',
			success: function(html){
					$('#changeProductFormPlace').empty();
					$('#changeProductFormPlace').append(html);
					closeForm();
					$('#productsList').addClass('hidden');
					changeProductSubmit();
			}
		});
	});
}

function changeProductSubmit(){
	$('#changeProduct').on('submit', function(e){
		e.preventDefault();
		document.getElementById('changeProductButton').disabled = true;
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
						$('#changeProductFormPlace').empty();
						$('#productsList').toggleClass('hidden');
						getProductsList();
				}
		});
	});
}

function showReplenishmentForm() {
	$('.replenishment').on('click', function(e){
		e.preventDefault();
		$(this).parent().parent().next().toggleClass('hidden');
	});
}

function makeHit() {
	$('.makeHit').on('click', function(e){
		e.preventDefault();
		var that = $(this);
		var product = $(this).data('id');
		var query = '/admin/makehit?product=' + product;
		$.ajax({
				url: query,
				type: 'post',
				success: function(){
						that.toggleClass('greenLink');
				}
			});
	});
}

function replenishmentFormSubmit(){
	$('.replenishmentForm').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		console.log(1);
		$.ajax({
			url: $that.attr('action'),
			type: $that.attr('method'),
			contentType: false,
			processData: false,
			data: formData,
			success: function(){
					getProductsList();
			}
		});
	});
}

function showGalleryForm(){
	$('.gallery').on('click', function(e){
		e.preventDefault();
		$(this).parent().parent().next().next().toggleClass('hidden');
	});
}

function galleryFormSubmit(){
	$('.galleryForm').on('submit', function(e){
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
					getProductsList();
			}
		});
	});
	return false;
}

function moveProductToCategory(){
	$('.moveToCategory').on('click', function(e){
		e.preventDefault();
		var that = $(this);
		var product = $(this).data('id');
		var query = '/admin/getmovetocategoryform?product=' + product;
		$.ajax({
			url: query,
			success: function(data){
				that.parent().parent().next().next().next().toggleClass('hidden');
				that.parent().parent().next().next().next().find('.changeCategoryForm').empty();
				that.parent().parent().next().next().next().find('.changeCategoryForm').append(data);
				getSubCategoriesToMove();
			}
		});
	});
}

function getSubCategoriesToMove() {
	$('.productMoveToCategory').on('change', function(){
		var that=$(this);
		var category=that.val();
		var query = '/admin/getsubcategories?category=' + category;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				that.next().empty();
				that.next().append(html);
				moveProductSubmit();
			}
		});
	});
}

function moveProductSubmit(){
	$('.moveProduct').on('submit', function(e){
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
						getProductsList();
				}
			});
		
	});	
};
