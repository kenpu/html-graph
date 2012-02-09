/*
 * (node (content children (child (connector node))))
 */
(function($) {
  var clear = function() { 
    return $('<div>').css('clear', 'both');
  };
  var mk_node = function(root) {
    var node = $('<div>').addClass("boxtree-node");
    if(root) node.addClass("boxtree-root");
    $('<div>').addClass("boxtree-content").appendTo(node);
    $('<div>').addClass("boxtree-children").appendTo(node);
    clear().appendTo(node);
    return node;
  };
  var mk_child = function() {
    var child = $('<div>').addClass("boxtree-child");
    child.append(
      $('<div>').addClass("boxtree-connector"),
      mk_node(),
      clear());
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
    else if(node.hasClass("boxtree-child"))
      return node.children(".boxtree-connector");
    else
      throw "node is not node or child: " + node.attr('class');
  };
  var connect_children = function(node) {
    var children = node_children(node).children();
    var n = children.size();
    var h0 = node_content(node).height()/2;
    children.each(function(i, child) {
          var conn = node_connector($(child));
          var h = $(child).outerHeight(1);
          var h1 = h-h0;
          var d1 = $('<div>').addClass("boxtree-c1").css('height', h0);
          var d2 = $('<div>').addClass("boxtree-c2").css('height', h0);
          var d3 = $('<div>').addClass("boxtree-c3").css('height', h1);
          if(i==0) {
            $.each([d1, d2, d3], function(i, e) {
                e.addClass("boxtree-first");
              });
          } else if (i == n-1) {
            $.each([d1, d2, d3], function(i, e) {
                e.addClass("boxtree-last");
              });
          }
          conn.append(d1, d2, clear(), d3, clear());
        });
  };

  var methods = {
    'init' : function(o) {
      var n = mk_node(true);
      this.empty().append(n);
      return n;
    },
    'add-child' : function(o) {
      var n = mk_child();
      var children = node_children(this);
      node_children(this).append(n);
      return n;
    },
    'set-content': function(o) {
      node_content(this).empty().append(o);
    },
    'connect': function(o) {
      connect_children(this);
    }
  };

  $.fn.boxtree = function(method, o) {
    console.debug("(", method, o, ")");
    var f = methods[method];
    if(f == null) {
      return methods['init'].apply(
               this, Array.prototype.slice.call(arguments, 1));
    } else {
      return f.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };
})(jQuery)
