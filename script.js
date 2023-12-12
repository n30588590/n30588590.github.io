/* shade - site list
 * Copyright (C) 2023 ArcNyxx
 * see LICENCE file for licensing information */

var search = '';
var tags = [];
var live = false;

function display() {
	var articles = $('.site');
	articles.hide();

	if (live) {
		articles = articles.filter(function() {
			if ($(this).find('.date').text() == 'Unknown') {
				return true;
			}
			return new Date($(this).find('.date').text()) >= Date.now();
		});
	}

	if (tags.length > 0) {
		articles = articles.filter(function() {
			var articleTags = [];
			$(this).find('.tag').each(function() {
				$(this).text().toLowerCase().split(", ").forEach(function(elem) {
					if (elem != '') {
						articleTags.push(elem);
					}
				});
			});

			const site = $(this);
			return tags.some(function(elem) {
				const val = site.data('val');
				if (elem == 'major' && val >= 5000) {
					return true;
				} else if (elem == 'moderate' && val < 5000 && val >= 1000) {
					return true;
				} else if (elem == 'minor' && val < 1000) {
					return true;
				}
				return articleTags.includes(elem);
			});
		});
	}

	if (search != '') {
		articles = articles.filter(function() {
			const title = $(this).find('.title').text().toLowerCase();
			return title.indexOf(search) >= 0;
		});
	}

	articles.show();
}

$(document).ready(function() {
	$('.date').each(function() {
		if ($(this).text() == 'Unknown') {
			$(this).css('color', 'blue');
			return;
		}

		const date = new Date($(this).text());
		const now = Date.now();
		const interval = new Date(1209600 * 1000);

		if ($(this).data('late') == 'y') {
			$(this).css('color', 'orange');
		} else if (date - interval >= now) {
			$(this).css('color', 'green');
		} else if (date >= now) {
			$(this).css('color', 'yellow');
		} else {
			$(this).css('color', 'red');
		}

		if ($(this).text().indexOf('Z') < 0) {
			$(this).text(new Date($(this).text()).toLocaleDateString());
		} else {
			$(this).text(new Date($(this).text()).toLocaleString());
		}
	});

	$('.site').click(function() {
		window.location = $(this).data('url');
	});

	$('.comp').click(function() {
		window.location = $(this).data('url');
	});

	$('#live').click(function() {
		live = !!$("input[id='live']:checked").length;
		display();
	});

	$('.tag').click(function() {
		tags = [];
		$("input[class='tag']:checked").each(function() {
			tags.push($(this).val().toLowerCase());
		});
		display();
	});

	$('#search').keyup(function() {
		search = $(this).val().toLowerCase();
		display();
	});
});
