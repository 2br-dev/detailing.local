let imageSwiper, contentSwiper, tooltipped, brandsSwiper, brandsPageSwiper;

import intersectObserver from './lib/intersectObserver';

$(() => {

	$('.lazy').lazy();

	$('body').on('click', '.service-image-page', setSelectedSlide);
	setSelectedSlide();

	$('.about-point').each((index, el) => {
		let observer = new intersectObserver(el, .85, () => {
			$(el).addClass('visible');
		}, () => {
			// $(el).removeClass('visible');
		})
	});

	$(window).enllax();

	$('.modal').modal();

	imageSwiper = new Swiper('#service-images', {
		navigation: {
			nextEl: '.service-image-next',
			prevEl: '.service-image-prev'
		},
		spaceBetween:5,
		direction: "horizontal",
		speed: 800
	});

	tooltipped = M.Tooltip.init(document.querySelectorAll('.tooltipped'));

	imageSwiper.on('slideChange', slider => {
		$('.lazy').lazy();
	});

	imageSwiper.on('slideChangeTransitionStart', slider => {
		highlightSelectedSlide(slider);
	})

	contentSwiper = new Swiper('#service-text', {
		allowTouchMove: false,
		direction: "horizontal",
		speed: 800
	});

	brandsSwiper = new Swiper('#brands-slider', {
		slidesPerView: "auto",
		centeredSlides: true,
		slideToClickedSlide: true,
		loop: true,
		speed: 800,
		spaceBetween: 40,
		on: {
			init: () => {
				$('.lazy').lazy();
			},
			slideChange: () => {
				$('.lazy').lazy();
			}
		},
		pagination: {
			type: 'bullets',
			el: '.swiper-pagination',
			dynamicBullets: true,
			dynamicMainBullets: 4,
			clickable: true
		},
		autoplay: {
			delay: 1000
		}
	});

	imageSwiper.controller.control = contentSwiper;

	$('body').on('click', '#send', sendForm);
	$('body').on('click', '#request-call', sendRequestCall);
	$('body').on('click', '.scroll-link', scrollToLink);

	if($('#map').length){
		loadScript("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.4.3/build/ol.js", () => {
			initMap();
		})
	}

	let headerObserver = new intersectObserver(document.querySelector('#hero'), 0, () => {
		$('header').removeClass('visible');
	}, () => {
		$('header').addClass('visible');
	});

	$('section').each((index, el) => {
		let sectionObserver = new intersectObserver(el, .1, (section) => {
			$('.scroll-link').removeClass('active');
			$('[href="#'+section.id+'"]').addClass('active');
		}, (section) => {
		})
	})

	$('body').on('click', '.service-name, .service-trigger', toggleService);

});

function scrollToLink(e){
	e.preventDefault();
	$('.scroll-link').removeClass('active');
	$(this).addClass('active');

	let link = $(this).attr('href');
	let offset = $(link).offset().top;

	$('html, body').animate({
		scrollTop: offset
	}, 300);
}

function toggleService(e){

	e.preventDefault();

	let $this = $(this).parents('.service-block').find('.service-description');
	let $plus = $(this).parents('.service-block').find('.service-trigger');

	$plus.toggleClass('open');
	$this.slideToggle();
}

function sendForm(e){
	e.preventDefault();

	M.toast({html: 'Спасибо за Ваше обращение, мы свяжемся с Вами в ближайшее время!'});

	let $form = $(this).parents('.modal')[0];
	let instance = M.Modal.getInstance($form);

	instance.close();
}

function sendRequestCall(e){
	e.preventDefault();
	M.toast({html: 'Спасибо за Ваше обращение, мы свяжемся с Вами в ближайшее время!'});
}

function highlightSelectedSlide(slider){
	let activeSlide = slider.el.querySelector('.swiper-slide-active');
	let activeSlideName = $(activeSlide).data('alias');
	
	$('.service-image-page').removeClass('active');
	$('.service-image-page[data-alias="' +activeSlideName+ '"]').addClass('active');
}

function setSelectedSlide(){
	$('.service-image-page').removeClass('active');
	$(this).addClass('active');
	let slideIndex = parseInt($(this).data('slide')) - 1;

	if(isNaN(slideIndex)){
		slideIndex = 0;
		$($('.service-image-page')[0]).addClass('active');
	}else{
		imageSwiper.slideTo(slideIndex, 800, true);
	}

}

//= Асинхронная загрузка скриптов =========================================
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";
    
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//= Инициализация карты ===================================================
function initMap(){

	let coords = [38.965687, 45.060705];
	let zoom = 17
    
    
    var style = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [.5, 1],
            src: '/img/logo_small.png'
        })
    });
    
    var marker = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
    })
    
    var vectorSource = new ol.source.Vector({
        features: [marker]
    })
    
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: style
    });
    
    // Shift map center to provide place for overlay
    var center = [
        coords[0], 
        coords[1]
    ]
    
    let map = new ol.Map({
        target: 'map',  // The DOM element that will contains the map
        interactions: ol.interaction.defaults({mouseWheelZoom:false}), //Disable scroll event
        renderer: 'canvas', // Force the renderer to be used
        layers: [
            // Add a new Tile layer getting tiles from OpenStreetMap source
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
                })
            }),
            vectorLayer
        ],
        // Create a view centered on the specified location and zoom level
    
        view: new ol.View({
            center: ol.proj.fromLonLat(center),
            zoom: zoom
        })
    });  
    
    // Эвент по клику на маркере
    map.on('click', function(evt) {
        var f = map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){return ft;}
        );
        if (f && f.get('type') == 'icon') {
            var linkEl = $('<a href="https://yandex.ru/maps/35/krasnodar/?ll=38.965502%2C45.060175&mode=routes&rtext=~45.060739%2C38.964012&rtt=auto&ruri=~ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjM2MDk4OBJ30KDQvtGB0YHQuNGPLCDQmtGA0LDRgdC90L7QtNCw0YAsINCk0LXRgdGC0LjQstCw0LvRjNC90YvQuSDQvNC40LrRgNC%2B0YDQsNC50L7QvSwg0YPQu9C40YbQsCDQnNC%2B0L3RgtCw0LbQvdC40LrQvtCyLCAzLzYiCg0m2xtCFTM%2BNEI%3D&z=16.12" target="_blank">Google</a>');
            $('#map').append(linkEl);
            linkEl[0].click();
            $(linkEl).remove();
        }        
    });
    
    map.on("pointermove", function (evt) {
        var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return true;
        }); 
        if (hit) {
            this.getTargetElement().style.cursor = 'pointer';
        } else {
            this.getTargetElement().style.cursor = '';
        }
    });
}