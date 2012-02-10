/*
 * (node (content children (child (connector node))))
 */
(function($) {
  var clear = function() { 
    return $('<div>').css('clear', 'both');
  };
  var mk_node = function(root, html) {
    var node = $('<div>').addClass("boxtree-node");
    if(root) node.addClass("boxtree-root");
    var c = $('<div>').addClass("boxtree-content").appendTo(node);
    if(html != null) c.html(html);
    $('<div>').addClass("boxtree-children").appendTo(node);
    clear().appendTo(node);
    return node;
  };
  var mk_child = function(html) {
    var child = $('<div>').addClass("boxtree-child");
    child.append(
      $('<div>').addClass("boxtree-connector"),
      mk_node(false, html),
      clear());
    return child;
  };
  var get_content = function(node) {
    return $(".boxtree-content:first", node);
  };
  var get_children = function(node) {
    return $(".boxtree-children:first", node);
  };
  var get_connector = function(node) {
    if(node.hasClass("boxtree-node"))
      return node.parent().children(".boxtree-connector");
    else if(node.hasClass("boxtree-child"))
      return node.children(".boxtree-connector");
    else
      throw "node is not node or child: " + node.attr('class');
  };
  var connect_children = function(node) {
    var children = get_children(node).children();
    var n = children.size();
    var h0 = get_content(node).height()/2;
    children.each(function(i, child) {
          var conn = get_connector($(child));
          var h = $(child).outerHeight(1);
          var h1 = h-h0;
          var d1 = $('<div>').addClass("boxtree-c1").css('height', h0);
          var d2 = $('<div>').addClass("boxtree-c2").css('height', h0);
          var d3 = $('<div>').addClass("boxtree-c3").css('height', h1);
          if(i==0) {
            $.each([d1, d2, d3], function(i, e) {
                e.addClass("boxtree-first");
              });
          } 
          if (i == n-1) {
            $.each([d1, d2, d3], function(i, e) {
                e.addClass("boxtree-last");
              });
          }
          conn.empty().append(d1, d2, clear(), d3, clear());
        });
  };

  var get_parent = function(node) {
    return node.closest(".boxtree-node");
  };

  var traverse = function(node, f) {
    var content = get_content(node);
    var children = get_children(node).children();
    var parent = get_parent(node);
    var ret = f({node: node, 
                 content: content, parent: parent, children: children});
    if(ret == false)
      return;
    children.each(function(i, ch) { traverse($(ch), f); });
  };

  /*
   * We expect a structure from x0 as
   * <ul>
   *   <li><span> text here </span>
   *     <ul> ... </ul>
   *   </li>
   *   ...
   * </ul>
   */

  var mk_tree = function(x0, y0) {
    $(x0).children("li").each(function(i, li) {
      var span = $(li).children("span");
      var ul = $(li).children("ul");
      var y = y0.boxtree('add-child', span.html());
      if(ul.size() > 0) mk_tree(ul, y);
    });
  };

  var methods = {
    'init' : function(o) {
      o = $.extend({
            root: "Root"
          }, o);
      var root = mk_node(true, o.root);
      var ul = (this.is("ul")) ? this : $("ul:first", this);
      if(ul.size() > 0) {
        mk_tree(ul, root);
        ul.replaceWith(root);
      } else {
        this.append(root);
      }
      root.boxtree('connect', {recursive:1});
      return root;
    },
    'add-child' : function(html) {
      var n = mk_child(html);
      var children = get_children(this);
      get_children(this).append(n);
      return n;
    },
    'set-content': function(o) {
      get_content(this).empty().append(o);
    },
    'connect': function(o) {
      if(o.recursive) {
        this.boxtree('traverse', function(x) {connect_children(x.node);});
      } else
        connect_children(this);
    },
    'traverse': function(f) {
      traverse(this, f);
      return this;
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
