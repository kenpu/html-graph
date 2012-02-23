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
    _div_(".children")
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

function set_style(node, style) {
  if(style == 'indented') {
    $(node).addClass("indented-tree");
  } else if(style == 'debug') {
    $(DIVTREE_SELECTOR, node).addClass("debug");
  }
}
