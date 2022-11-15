(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var intersectObserver = /*#__PURE__*/_createClass(function intersectObserver(el, threshold, enterCallback, leaveCallback) {
  _classCallCheck(this, intersectObserver);
  var observer = new window.IntersectionObserver(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      entry = _ref2[0];
    if (entry.isIntersecting) {
      enterCallback(entry.target);
    } else {
      leaveCallback(entry.target);
    }
  }, {
    root: null,
    threshold: threshold
  });
  observer.observe(el);
});
var _default = intersectObserver;
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _intersectObserver = _interopRequireDefault(require("./lib/intersectObserver"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var imageSwiper, contentSwiper, tooltipped, brandsSwiper, brandsPageSwiper;
$(function () {
  $('.lazy').lazy();
  $('body').on('click', '.service-image-page', setSelectedSlide);
  setSelectedSlide();
  $('.about-point').each(function (index, el) {
    var observer = new _intersectObserver["default"](el, .85, function () {
      $(el).addClass('visible');
    }, function () {
      // $(el).removeClass('visible');
    });
  });
  $(window).enllax();
  $('.modal').modal();
  imageSwiper = new Swiper('#service-images', {
    navigation: {
      nextEl: '.service-image-next',
      prevEl: '.service-image-prev'
    },
    spaceBetween: 5,
    direction: "horizontal",
    speed: 800
  });
  tooltipped = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  imageSwiper.on('slideChange', function (slider) {
    $('.lazy').lazy();
  });
  imageSwiper.on('slideChangeTransitionStart', function (slider) {
    highlightSelectedSlide(slider);
  });
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
      init: function init() {
        $('.lazy').lazy();
      },
      slideChange: function slideChange() {
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
  if ($('#map').length) {
    loadScript("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.4.3/build/ol.js", function () {
      initMap();
    });
  }
  var headerObserver = new _intersectObserver["default"](document.querySelector('#hero'), 0, function () {
    $('header').removeClass('visible');
  }, function () {
    $('header').addClass('visible');
  });
  $('section').each(function (index, el) {
    var sectionObserver = new _intersectObserver["default"](el, .1, function (section) {
      $('.scroll-link').removeClass('active');
      $('[href="#' + section.id + '"]').addClass('active');
    }, function (section) {});
  });
  $('body').on('click', '.service-name, .service-trigger', toggleService);
});
function scrollToLink(e) {
  e.preventDefault();
  $('.scroll-link').removeClass('active');
  $(this).addClass('active');
  var link = $(this).attr('href');
  var offset = $(link).offset().top;
  $('html, body').animate({
    scrollTop: offset
  }, 300);
}
function toggleService(e) {
  e.preventDefault();
  var $this = $(this).parents('.service-block').find('.service-description');
  var $plus = $(this).parents('.service-block').find('.service-trigger');
  $plus.toggleClass('open');
  $this.slideToggle();
}
function sendForm(e) {
  e.preventDefault();
  M.toast({
    html: 'Спасибо за Ваше обращение, мы свяжемся с Вами в ближайшее время!'
  });
  var $form = $(this).parents('.modal')[0];
  var instance = M.Modal.getInstance($form);
  instance.close();
}
function sendRequestCall(e) {
  e.preventDefault();
  M.toast({
    html: 'Спасибо за Ваше обращение, мы свяжемся с Вами в ближайшее время!'
  });
}
function highlightSelectedSlide(slider) {
  var activeSlide = slider.el.querySelector('.swiper-slide-active');
  var activeSlideName = $(activeSlide).data('alias');
  $('.service-image-page').removeClass('active');
  $('.service-image-page[data-alias="' + activeSlideName + '"]').addClass('active');
}
function setSelectedSlide() {
  $('.service-image-page').removeClass('active');
  $(this).addClass('active');
  var slideIndex = parseInt($(this).data('slide')) - 1;
  if (isNaN(slideIndex)) {
    slideIndex = 0;
    $($('.service-image-page')[0]).addClass('active');
  } else {
    imageSwiper.slideTo(slideIndex, 800, true);
  }
}

//= Асинхронная загрузка скриптов =========================================
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) {
    //IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    //Others
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

//= Инициализация карты ===================================================
function initMap() {
  var coords = [38.965687, 45.060705];
  var zoom = 17;
  var style = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [.5, 1],
      src: '/img/logo_small.png'
    })
  });
  var marker = new ol.Feature({
    type: 'icon',
    geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
  });
  var vectorSource = new ol.source.Vector({
    features: [marker]
  });
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: style
  });

  // Shift map center to provide place for overlay
  var center = [coords[0], coords[1]];
  var map = new ol.Map({
    target: 'map',
    // The DOM element that will contains the map
    interactions: ol.interaction.defaults({
      mouseWheelZoom: false
    }),
    //Disable scroll event
    renderer: 'canvas',
    // Force the renderer to be used
    layers: [
    // Add a new Tile layer getting tiles from OpenStreetMap source
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
      })
    }), vectorLayer],
    // Create a view centered on the specified location and zoom level

    view: new ol.View({
      center: ol.proj.fromLonLat(center),
      zoom: zoom
    })
  });

  // Эвент по клику на маркере
  map.on('click', function (evt) {
    var f = map.forEachFeatureAtPixel(evt.pixel, function (ft, layer) {
      return ft;
    });
    if (f && f.get('type') == 'icon') {
      var linkEl = $('<a href="https://yandex.ru/maps/35/krasnodar/?ll=38.965502%2C45.060175&mode=routes&rtext=~45.060739%2C38.964012&rtt=auto&ruri=~ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjM2MDk4OBJ30KDQvtGB0YHQuNGPLCDQmtGA0LDRgdC90L7QtNCw0YAsINCk0LXRgdGC0LjQstCw0LvRjNC90YvQuSDQvNC40LrRgNC%2B0YDQsNC50L7QvSwg0YPQu9C40YbQsCDQnNC%2B0L3RgtCw0LbQvdC40LrQvtCyLCAzLzYiCg0m2xtCFTM%2BNEI%3D&z=16.12" target="_blank">Google</a>');
      $('#map').append(linkEl);
      linkEl[0].click();
      $(linkEl).remove();
    }
  });
  map.on("pointermove", function (evt) {
    var hit = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      return true;
    });
    if (hit) {
      this.getTargetElement().style.cursor = 'pointer';
    } else {
      this.getTargetElement().style.cursor = '';
    }
  });
}

},{"./lib/intersectObserver":1}]},{},[2]);
