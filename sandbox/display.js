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
    return children;
  }

  var mk_child = function() {
    var child = $('<div>')
          .addClass("n-child");
    var child_connect = $('<div>')
          .addClass("n-connector");
    var child_container = $('<div>')
          .addClass("n-container");
    return child.append(child_connect, child_container);
  }

  var mk_connector = function(child) {
    var container = $(".n-container", child);
    var connector = $(".n-connector", child);
    var d00 = $('<div>').css({
      'border-right' : 'thin solid black',
      'border-bottom' : 'thin solid black',
      'float': 'left',
      width: 49,
      height: 49
    });
    var d01 = $('<div>').css({
      'border-bottom' : 'thin solid black',
      'float': 'left',
      width: d00.width(),
      height: d00.height()
    });
    var d1 = $('<div>').css({
      'border-right' : 'thin solid black',
      width: d00.width(),
      height: container.height() - d00.height()
    });
    connector.empty().append(d00, d01, mk_clear(), d1);
  };

  var mk_clear = function() {
    return $('<div>').css('clear', 'both');
  }

  $.fn.boxtree = function() {
    var content = mk_content("Hello, this is content.");
    var children = mk_children();
    this.append(content, children);

    // Add some sample content into the child
    var child = mk_child().appendTo(children);
    $(".n-container", child).append(mk_content("Hey ya."), mk_clear(), mk_content("I'm good.  You?"));
    mk_connector(child);

    // Add more children now.
    child = mk_child().appendTo(children);
    $(".n-container", child).append(mk_content("Lession #3"));
    mk_connector(child);

    // Subchild
    var n = $(".n-container", child);
    children = mk_children().appendTo(n);
    child = mk_child().appendTo(children);
    $(".n-container", child).append(mk_content("Compiler Technology"));
    mk_connector(child);
  };
})(jQuery);
