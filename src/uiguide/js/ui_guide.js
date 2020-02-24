$(document).ready(function() {
	$('.ui-btn-codecopy').on('click', function(){
		var el = $(this);
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			el.data("text-original", el.text());
			el.text($(this).data("text-swap"));
			el.addClass('active');

		  	$(this).parent().next().css({
			  'position': 'absolute',
			  'opacity': 0,
			  'display': 'block'
		  	})
			el.parent().next().focus();
			el.parent().next().select();
			document.execCommand('copy');

			setTimeout(function(){
				if (el.text() == "Copy!") {
					el.text("Copy to clipboard");
					el.removeClass('active');
				}
			}, 1000);
		} catch(err) {
		  	console.log('Oops, unable to copy');
		}

		window.getSelection().removeAllRanges();
	})

	$('.ui-code-content').each(function(index, elem){
		var $this = $(this);
		if($(this).hasClass('ui-css') === true){
			var editor = CodeMirror.fromTextArea(elem, {
				mode: 'text/css',
				tabMode: 'indent'
			});
		} else if($(this).hasClass('ui-html') === true){
			var editor = CodeMirror.fromTextArea(elem, {
				mode: 'text/html',
				tabMode: 'indent'
			});
		} else if($(this).hasClass('ui-html-preview') === true) {
			var delay;
			var editor = CodeMirror.fromTextArea(elem, {
				mode: 'text/html',
				tabMode: 'indent'
				// onChange: function() {
				// 	clearTimeout(delay);
				// 	delay = setTimeout(updatePreview, 300);
				// }
			});
			editor.on("change", function() {
				clearTimeout(delay);
				delay = setTimeout(updatePreview, 300);
			});
			function updatePreview() {
				var preview = $this.prev().prev();
				preview.html(editor.getValue());
			}
			setTimeout(updatePreview, 300);
		}
	});


	//Table of contents
	//$(tocList).empty();
	var prevH2Item = null;
	var prevH2List = null;

	var index = 0;
	$("section > h3, section > h4").each(function() {
		$heading = $(this).contents().get(0).nodeValue;
		//insert an anchor to jump to, from the TOC link.
		var anchor = "<a href=#" + $heading + " id='" + $heading + "' class='doc_anchor'>#</a>";
		//var anchor = $(this).parent().attr('id', 'target' + index);
		$(this).append(anchor);

		var li = "<li><a href='#" + $heading + "'>" + $heading + "</a></li>";

		if($(this).is("section > h3")){
			prevH2List = $("<ul></ul>");
			prevH2Item = $(li);
			prevH2Item.append(prevH2List);
			$(".ui-toc-list").append(prevH2Item);
		} else {
			prevH2List.append(li);
		}
	});

	var $chepter = $(".lsds-table-contents");
	var lsdsTableContents = document.querySelector('.lsds-table-contents');
	var lsdsTableCurrentTop = lsdsTableContents.getBoundingClientRect().top;
	console.log(lsdsTableCurrentTop)

	window.addEventListener("scroll", function(){
		var lsdsTablePosTop = lsdsTableContents.getBoundingClientRect().top;
		if(lsdsTablePosTop < lsdsTableCurrentTop){
			lsdsTableContents.classList.add('is-fixed')
		}

	})

	  var pos = $chepter;
	//   $(window).scroll(function() {
	// 	  var windowpos = $(window).scrollTop();
	// 	  if (windowpos >= pos.top & windowpos <=1000) {
	// 		  $chepter.addClass("fixed");
	// 	  } else {
	// 		  $chepter.removeClass("fixed");
	// 	  }
	//   });

var getMenu = new XMLHttpRequest();
getMenu.open("GET", "/demo/uiguide/menu.json");
getMenu.onload = function(){
	var data = JSON.parse(getMenu.responseText);
	var getMenuItem = function (itemData) {

		var item = $("<li>").append(
			$("<a>", {
				href: itemData.link,
				html: itemData.title
		}));
		if (itemData.sub) {
			var subList = $("<ul>");
			$.each(itemData.sub, function () {
				subList.append(getMenuItem(this));
			});
			item.append(subList);
		}
		return item;
	};

	var $menu = $(".ui-lnb");

	$.each(data.menu, function () {
		$menu.append(
			getMenuItem(this)
		);

		var current = location.pathname;
		//console.log(current)
		$('.ui-lnb a').each(function(){
			var $this = $(this);
			// if the current path is like this link, make it active
			if($this.attr('href').indexOf(current) !== -1){
				$this.addClass('on').parent().parent().parent().addClass('current');
			}
		})
	});

	$('.ui-lnb li li a').each(function(){
		var $this = $(this);
		if($this.hasClass("on")){
			$("h2.lsds-tit02").text(this.text);
		}
	});
}
getMenu.send()

/*
$.get("/hanatour/uiguide/menu.json", {
	//name: value
	}).done(function(data){
		console.log(data)
		var getMenuItem = function (itemData) {

			var item = $("<li>").append(
				$("<a>", {
					href: itemData.link,
					html: itemData.title
			}));
			if (itemData.sub) {
				var subList = $("<ul>");
				$.each(itemData.sub, function () {
					subList.append(getMenuItem(this));
				});
				item.append(subList);
			}
			return item;
		};

		var $menu = $(".ui-lnb");

		$.each(data.menu, function () {
			$menu.append(
				getMenuItem(this)
			);

			var current = location.pathname;
			//console.log(current)
			$('.ui-lnb a').each(function(){
				var $this = $(this);
				// if the current path is like this link, make it active
				if($this.attr('href').indexOf(current) !== -1){
					$this.addClass('on').parent().parent().parent().addClass('current');
				}
			})
		});

		$('.ui-lnb li li a').each(function(){
			var $this = $(this);
			if($this.hasClass("on")){
				$("h2.lsds-tit02").text(this.text);
			}
		});

	}).fail(function(data){
		console.log("Fail to load\nError code: "+ data);
});
*/

});
