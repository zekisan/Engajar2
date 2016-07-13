'use strict';

import $ from 'jquery';
require('jquery.easing');
require('./stylesheets/application.less');

require('./framework');

require('lodash');

import React from 'react';
import ReactDOM from 'react-dom';

import * as OurComponents from './components';

import ScrollReveal from 'scrollreveal';

$.fn.initPlugins = function() {
   const scope = $(this);

   $('[data-react-class]', scope).each(function() {
      const $node     = $(this),
          className = $node.data('reactClass');

      // Assume className is simple and can be found at top-level (global) or in ./components/index.js.
      let constructor = global[className] || OurComponents[className];

      // Hack to support ES6
      if (constructor.__esModule && constructor.default)
         constructor = constructor.default;
      const props = $node.data('reactProps');

      ReactDOM.render(React.createElement(constructor, props), this);
   });

   return this;
};

$(function() {
   const $body = $('body');

   $body.initPlugins()
       .on('ajax-loaded', function(e) { $(e.target).initPlugins(); });

   // jQuery for page scrolling feature - requires jQuery Easing plugin
   $('a.page-scroll').bind('click', function (event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
         scrollTop: ($($anchor.attr('href')).offset().top - 50)
      }, 1250, 'easeInOutExpo');
      event.preventDefault();
   });

   // Highlight the top nav as scrolling occurs
   $('body').scrollspy({
      target: '.navbar-fixed-top',
      offset: 51
   });

   // Closes the Responsive Menu on Menu Item Click
   $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function () {
      $('.navbar-toggle:visible').click();
   });

   // Offset for Main Navigation
   $('#mainNav').affix({
      offset: {
         top: 100
      }
   })

   // Initialize and Configure Scroll Reveal Animation
   window.sr = ScrollReveal();
   sr.reveal('.sr-icons', {
      duration: 600,
      scale: 0.3,
      distance: '0px'
   }, 200);
   sr.reveal('.sr-button', {
      duration: 1000,
      delay: 200
   });
});