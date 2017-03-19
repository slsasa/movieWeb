$(function() {
	$('.del').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id
		})
		.done(function(results){
			if (results === 'OK' ) {
				window.location.reload();
				// if (tr.length > 0) {
				// 	tr.remove();
				// }
			}
		})
	})



	$('.close').click(function () {
		window.location.reload();
	})

	$('#douban').blur(function() {
		var douban = $(this)
		var id = douban.val()

		if (id) {
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data) {
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					$('#inputCategory').val(data.genres[0])
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputSummary').val(data.summary)
				}
			})
		}
	})

	var $radio = $("input[type='radio']:checked");//获取选中的选项
	var val = $radio.val();//获取选中的选项的值value\
	if (!val || val.length > 0) {
		$('#inputCategory').attr({
			type: 'hidden'
		})
	}


})


