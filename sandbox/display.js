(function($) {
  var mk_content = function(html) {
   var content = $('<div>')
         .addClass("n-content")
         .html(html);
   return content
  };

  var mk_children = function() {
    var children = $('<div>')
          .addClass("n-children");
  }

  var mk_children = function(

  $.fn.mk_content = function() {
    var content = mk_content(this, "Hello, this is content.");
    var children = mk_children();
    this.append(content);
  };
})(jQuery);
