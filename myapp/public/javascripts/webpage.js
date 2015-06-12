/**
 * AnkTech's Single Page WebPlugin
 * Description:
 *
 * @params kwargs object
 * @author Anshul Agarwal 
 */
var webpage = function(kwargs) {
	//Override with user defined selector
	this.header = (typeof kwargs.header !== "undefined") ? kwargs.header : ".anktech-header";
	this.body = (typeof kwargs.body !== "undefined") ? kwargs.body : ".anktech-body";
	this.selector = (typeof kwargs.selector !== "undefined") ? kwargs.selector : ".anktech-data-source";
	this.path = (typeof kwargs.path !== "undefined") ? kwargs.path : ".anktech-views";
	this.init();
    this.bindEvents();
};

webpage.prototype = {
	init: function() {
		var self = this;
		if(!window.location.hash.substr(1)) {
			self.loadPage($(self.header).eq(0).attr(self.selector)+'.html', $(self.header).eq(0).attr(self.selector));
		} else {
			self.loadPage(window.location.hash.substr(1)+'.html', window.location.hash.substr(1));
		}
	},
	loadPage: function(url, hash) {
		var self = this;
		$(self.body).html('');
		$.ajax({
            url: self.path+url,
            dataType: 'html',
            success: function(response) {
				window.location.hash = hash;
    			$(self.body).append(response)
            },error: function(err, ERR) {
                console.log(err,ERR)
            }
    	});
	},
	bindEvents:function() {
		var self=this;
		$(self.header).click(function() {
			var redirectHash = $(this).attr(self.selector);
			self.loadPage(redirectHash+'.html', redirectHash);
		});
	}
};
$(document).ready(function(){
	new webpage({
        "header": ".header_inner a",
        "body": "#webpage_body",
        "selector": "data-source",
        "path": "../views/"
    });
});
