$(document).ready(function(){
    var likeCount = 0;
	$('.comment_click a').click(function(){
		$('.comment-container').fadeIn(300);
		$('.comment-background').fadeIn(300);
	});
    $('.lightbox img').mouseenter(function(){
        console.log(likeCount);
        var srcimg = $(this).attr("src");
        console.log("srcimg ",srcimg);
    });
	$('.closeBtn_comment').unbind("click").bind("click", function(){
        $('.comment-container').fadeOut(300);
        $('.comment-background').fadeOut(300);
    });

    /**
    * Close the lightbox when escape key is pressed 
    */
   $(document).bind('keydown', function(e) { 
        if (e.which == 27) {
            $('.comment-container').fadeOut(300);
            $('.comment-background').fadeOut(300);
        }
    }); 
});