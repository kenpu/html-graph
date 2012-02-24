/* Who cares about elegance and namespace? */

/**
 * This library 
 * - dynamically constructs trees
 * - performs rendering and styling
 */

/**
 *  .node
 *    .content
 *    .children
 *      .child +
 *        .bullet
 *        .node
 */

var DIVTREE_SELECTOR = ".node,.content,.children,.child,.bullet,.br";

function make_node(parent) {
  var $node = _div_(".node");
  $node.append(
    _div_(".content"),
    _div_(".children"),
    _div_(".br")
  );
  if(parent != null) {
    var $p = $(parent);
    $children_div = $(".children:first", $p);
    if($children_div.size() > 0) {
      $child = _div_(".child")
        .append( _div_(".bullet"), $node, _div_(".br")
        );
      $children_div.append($child);
    }
    else
      $p.append($node);
  }
  return $node;
}

function get_child_nodes($node) {
  return $(".children:first > .child > .node", $node);
}
function get_child($node) {
  return $(".children:first > .child", $node);
}

function get_bullet($node) {
  return $node.parent().children(".bullet");
}

function get_content($node) {
  return $node.children(".content");
}

function get_parent_node($n) {
  return $n.parents(".node");
}

function get_root_node($n) {
  var $p = get_parent_node($n);
  if($p.size() > 0)
    return get_root_node($p);
  else
    return $n;
}

function set_indented_style(root) {
  $(root).addClass("indented-tree");
}

function traverse_nodes($n, f) {
  f($n);
  get_child_nodes($n).each(function(i, m) {
    traverse_nodes($(m), f);
  });
}
function boxtree($n) {
    var $chlist = get_child($n);
    var n = $chlist.size();
    var $content = get_content($n);
    // var h0 = $content.outerHeight() - $content.height();
    var h0 = $content.outerHeight() / 2;
    $chlist.each(function(i, ch) {
      var $ch = $(ch);
      var $bullet = $(".bullet", $ch);
      var h = $ch.outerHeight();
      var h1 = h - h0;
      var $d1 = _div_(".boxtree1").css("height", h0);
      var $d2 = _div_(".boxtree2").css("height", h0);
      var $d3 = _div_(".boxtree3").css("height", h1);
      if(i==0)
        $.each([$d1,$d2,$d3], function(i, e) {
          e.addClass("boxtree-first");
        });
      if(i==n-1)
        $.each([$d1,$d2,$d3], function(i, e) {
          e.addClass("boxtree-last");
        });
      $bullet.empty().append($d1, $d2, _div_(".br"), $d3, _div_(".br"));
    });
  };

function set_boxtree_style($root) {
  $root.removeClass("indented-tree").addClass("box-tree");
  traverse_nodes($root, boxtree);
}

function refresh_style($n) {
  var $root = get_root_node($n);
  if($root.hasClass("box-tree")) {
    set_boxtree_style($root);
  }
}
