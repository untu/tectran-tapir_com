// Feedback form.
$(document).ready(function() {
  'use strict';

  var $ = jQuery;

  var FormFields = {};

  var ValidateFields = {
    name: {
      check: function(val) {
        return val === '';
      }
    },
    contacts: {
      check: function(val) {
        return val.length < 4;
      }
    },
    site: {
      check: function(val) {
        return val.length && val.indexOf('.') === -1;
      }
    },
    count: {
      check: function(val){
        var num = parseInt(val);
        return num? num <= 0 : !num;
      }
    }
  };

  function sendForm() {
    if (validateForm()) {
      return false;
    }

    var fields = {};
    for (var key in FormFields) {
      fields[key] = FormFields[key].val;
    }

    $.post('./feedback.php', fields, function() {
      $('.js-feedback-head').fadeOut();
      $('.js-feedback-form').addClass('flipOutX').fadeOut(400, function() {
        $('.feedback-thx').show().addClass('flipInX');
      });
    });

    $('.fixed-btn-link').hide();

    return false;
  }

  var noop = function() {
  };

  function validateField(name) {
    var field = FormFields[name];
    var check = field.check || noop;
    field.val = field.$el.val();
    var hasError = check(field.val);
    toggleError(field.$el, hasError);
    field.hasError = hasError;

    return hasError;
  }

  function validateForm() {
    var hasError = false;
    for (var key in FormFields) {
      validateField(key) && (hasError = true);
    }
    toggleSubmit();

    return hasError;
  }

  function toggleError($el, hasError) {
    var errName = '';

    if (typeof hasError === 'string') {
      errName = '[data-error-name="' + hasError + '"]';
    }

    hasError = !!hasError;
    $el.parent().toggleClass('has-error', hasError);
    var blocks = $el.closest('.form-group').find('.help-block').hide();
    hasError && (errName ? blocks.filter(errName) : blocks.eq(0)).show();
  }

  function toggleSubmit() {
    var hasError = false;
    for (var key in FormFields) {
      if (FormFields[key].hasError) {
        hasError = true;
        break;
      }
    }

    $('.js-send-form-btn').attr('disabled', hasError);
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  $('.js-send-form-btn').click(sendForm);
  $('.js-feedback-form input')
    .each(function() {
      var name = this.name;
      var field = ValidateFields[name] || {};
      field.$el = $(this);
      FormFields[name] = field;
    })
    .keyup(debounce(function() {
      validateField(this.name);
      toggleSubmit();
    }, 200));


  // Floating label headings for the contact form
  $('body').on('input propertychange', '.floating-label-form-group', function(e) {
    $(this).toggleClass('floating-label-form-group-with-value', true);
  }).on('focus', '.floating-label-form-group', function() {
    $(this).addClass('floating-label-form-group-with-focus');
  }).on('blur', '.floating-label-form-group', function() {
    $(this).removeClass('floating-label-form-group-with-focus');
  });


  $('.feedback-form [name="count"]').on('keyup change', function(){
    var val = $(this).val();

    if (val === '')
      return;

    var count = parseInt(val);

    if(val.match(/\D/)){
      $(this).val(1);
      count = 1;
    }

    var cost = 2800;

    $('.js-price-before').text(count*cost);
    $('.js-price-after').text(count*cost/2);
  });
});