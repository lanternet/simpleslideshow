/* SimpleSlideshow */
(function($) {

	var photos = {};
	var photosIndex = {};
	var indexPhoto = {};
	var currenPhoto = null;
	var currentIndex = null;
    var imageIndex = null;
	var totalPhotos = null;
	var imgWidth = null;
	var imgHeight = null;
	var windowWidth = null;
	var windowHeight = null;
	var ratio = null;


	var params = {

		init: function() {
			//Retrieve each photos of the html area
			imageIndex = 0;
            totalPhotos = 0;
            var tmpImages = {};
            if ($(this).find('a').length) {
                $(this).find('a').each(function(index, element) {
                    if ($(this).has('img').length) {
                        if (photos[$(this).attr('href')] == null)
                            photos[$(this).attr('href')] = null;
                        photosIndex[$(this).attr('href')] = imageIndex;
                        indexPhoto[imageIndex] = $(this).attr('href');
                        $(this).unbind('click').bind('click', function(event) {
                            event.preventDefault();
                            currenPhoto = $(this).attr('href');
                            currentIndex = photosIndex[$(this).attr('href')];
                            params.showSlideShow(currenPhoto);
                        });
                        totalPhotos++
                        imageIndex++;
                    }
                });
            }
			$(document).keyup(function(e) {
				if (e.keyCode == 27) { params.closeSlideShow(); } //Escape
				if (e.keyCode == 37 || e.keyCode == 71) { if (totalPhotos > 1) { params.previous();} } //Left arrow
				if (e.keyCode == 39 || e.keyCode == 68) { if (totalPhotos > 1) {params.next();} } //Right arrow
			});
            $(window).resize(function() {
                params.resize(photos[indexPhoto[currentIndex]]);
            });
		},
		showSlideShow: function(url) {
			var html = '';
			html += '<div id="simpleSlideshow">';
            html += '<span id="close" class="simpleSlideshow-navigation" title="You can also use the escape key for close the simpleSlideshow">&nbsp;</span>';
			html += '<span id="previous" class="simpleSlideshow-navigation" title="You can also use the arrows left and right for the navigation">&nbsp;</span>';
			html += '<span id="next" class="simpleSlideshow-navigation" title="You can also use the arrows left and right for the navigation">&nbsp;</span>';
			html += '<div class="slide"><div></div></div>';
			html += '</div>';
			$('body').append(html);
			$('#close').unbind('click').bind('click', function(event) {
				event.preventDefault();
				params.closeSlideShow();
				$('#close').unbind('click');
			});
			$('#previous').unbind('click').bind('click', function(event) {
				event.preventDefault();
				params.previous();
			});
			$('#next').unbind('click').bind('click', function(event) {
				event.preventDefault();
				params.next();
			});
            if (totalPhotos == 1) {
				$('#previous, #next').hide();
			}
			params.loadPhoto(url);
            params.preloadPhoto();

		},
		closeSlideShow: function() {
			$('#simpleSlideshow').remove();
		},
		loadPhoto: function(url, isPreload) {
            if (!isPreload) {
                $('#simpleSlideshow .slide div').animate({ opacity: 0 }, function() {
                    $('#simpleSlideshow .slide div img').remove();
                    params.showSpinner();
                    if (photos[url] == null) {
                        var img = new Image();
                        img.onload = function() {
                            photos[url] = img;
                            params.resize(img);
                            if (currenPhoto == url) {
                                $('#simpleSlideshow .slide div').append(img);
                                $('#simpleSlideshow .slide div').animate({ opacity: 1 });
                            }
                        };
                        img.src = url;
                    } else {
                        params.resize(photos[url]);
                        if (currenPhoto == url) {
                            $('#simpleSlideshow .slide div').append(photos[url]);
                            $('#simpleSlideshow .slide div').animate({ opacity: 1 });
                        }
                    }
                });
            } else {
                if (photos[url] == null) {
                    var img = new Image();
                    img.onload = function() {
                        photos[url] = img;
                    };
                    img.src = url;
                }
            }
		},
        preloadPhoto: function() {
            if (indexPhoto[currentIndex + 1] != null)
                params.loadPhoto(indexPhoto[currentIndex + 1], true);
            if (indexPhoto[currentIndex - 1] != null)
                params.loadPhoto(indexPhoto[currentIndex - 1], true);
        },
		resize: function(img) {
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			$('#simpleSlideshow').css({width: windowWidth + 'px', height: windowHeight + 'px'});
            if (img != null) {
                imgWidth = img.naturalWidth;
                imgHeight = img.naturalHeight;
                if (imgWidth > imgHeight)
                    ratio = imgHeight / imgWidth;
                else
                    ratio = imgWidth / imgHeight;

                if (imgHeight > windowHeight)
                    imgHeight = imgHeight * (windowHeight / imgHeight);
                if (imgWidth > windowWidth)
                    imgWidth = imgWidth * (windowWidth / imgWidth);

                $(img).css({'max-width': imgWidth + 'px', 'max-height': imgHeight + 'px'});
            }
			$('#simpleSlideshow .slide div').css({'line-height': windowHeight + 'px'});
		},
		next: function() {
			if (currentIndex < (totalPhotos - 1)) {
				currentIndex++;
				currenPhoto = indexPhoto[currentIndex];
				params.loadPhoto(currenPhoto);
                params.preloadPhoto();

				if (currentIndex == (totalPhotos - 1))
					$('#next').hide();
				else
					$('#next').show();
				if (totalPhotos > 1)
					$('#previous').show();
				
			}
		},
		previous: function() {
			if (currentIndex > 0) {
				currentIndex--;
				currenPhoto = indexPhoto[currentIndex];
				params.loadPhoto(currenPhoto);
                params.preloadPhoto();
				if (currentIndex == 0)
					$('#previous').hide();
				else
					$('#previous').show();
				if (totalPhotos > 1)
					$('#next').show();
			}
		},
        showSpinner: function() {
            $('#simpleSlideshow .slide div img').remove();
            $('#simpleSlideshow .slide div').addClass('slideshow-loading');
        }

	};

	$.fn.simpleSlideshow = function(options) {

		var settings = $.extend(params, options);

		if ( params[options] ) {
            return params[options].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof options === 'object' || ! options ) {
            return params.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery.tooltip' );
        } 

	}

}(jQuery))