$(function() {
    // set some custom options for slick, by unslicking the options from styleguide..
    // need to clean up SG and do this a better way
    $('#imagine-slider').slick('unslick');
    $('#imagine-slider').slick({
        arrows: true,
        dots: true,
        draggable: false,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 8000,
        responsive: [
        {
            breakpoint: 800,
            settings: {
                draggable: true,
            }
        }
        ]
    });
});