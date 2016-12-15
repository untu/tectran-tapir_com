$(function(){
    $('.js-feedback-form input')
        .focus(function(){
            this.placeholder_hide = this.placeholder;
            this.placeholder='';
        })
        .blur(function(){
            this.placeholder = this.placeholder_hide;
        });


    var btnOnTop;
    var initPosition = $('.fixed-btn').position().top;
    var hide=false;

    $(window).scroll(function(){
        if(!btnOnTop && $('body').scrollTop() > initPosition ) {
            $('.fixed-btn').css({top: 0, position: 'fixed'});
            btnOnTop = true;
        }

        if(btnOnTop && $('body').scrollTop() < initPosition ) {
            $('.fixed-btn').css({top: 'auto', position: 'relative'});
            btnOnTop = false;
        }

        if(!hide && $(window).scrollTop() > 4000) {
            $('.fixed-btn').hide();
            hide = true;
        }

        if(hide && $(window).scrollTop() < 4000) {
            $('.fixed-btn').show();
            hide = false;
        }
    });
});