/*
 * (node (content children (child (connector node))))
 */
(function($) {
  var mk_node = function() {
    var node = $('<div>').addClass("boxtree-node");
    $('<div>').addClass("boxtree-content").appendTo(node);
    $('<div>').addClass("boxtree-children").appendTo(node);
    return node;
  };
  var mk_child = function() {
    var child = $('<div>').addClass("boxtree-child");
    $('<div>').addClass("boxtree-connector").appendTo(child);
    mk_node().appendTo(child);
    return child;
  };
  var node_content = function(node) {
    return $(".boxtree-content:first", node);
  };
  var node_children = function(node) {
    return $(".boxtree-children:first", node);
  };
  var node_connector = function(node) {
    if(node.hasClass("boxtree-node"))
      return node.parent().children(".boxtree-connector");
    if(node.hasClass("boxtree-child"))
      return node.children(".boxtree-connector");
  };
  var methods = {
    'init' : function(o) {
      var n = mk_node();
      this.empty().append(n);
      return n;
    },
    'add-child' : function(o) {
      var n = mk_child();
      node_children(this).append(n);
      return n;
    },
    'set-content': function(o) {
      node_content(this).empty().append(o);
    }
  };
  $.fn.boxtree = function(method, o) {
    console.debug("(", method, o, ")");
    var f = methods[method];
    if(f == null) {
      return methods['init'].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
      return f.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };
})(jQuery)
