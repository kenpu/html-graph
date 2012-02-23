function add_control($node) {
  var $content = $node.find(".content:first");
  var $control = _div_(".control").append(
        _span_(".add", '+'),
        _span_(".remove", '-'),
        _span_(".open", 'Close'),
        _span_(".edit", 'edit'),
        _span_(".author", 'author')
      );
  $content.append($control);
  return $control;
}
function add_collapse($n) {
  var $bullet = get_bullet($n);
  if($bullet.size() > 0) {
    $bullet.append(_div_(".collapse").append(_span_(".open", "-")));
  }
  return $bullet.children(".collapse");
}

function get_control($node) {
  return $(".control", get_content($node));
}

function set_content($n, name, block_content) {
  var $cont = get_content($n);
  var $block = $cont.children(".block");
  var $name, $desc;
  if($block.size() > 0) {
    $name = $(".name", $block);
    $desc = $(".description", $block);
  } else {
    $name = _div_(".name");
    $desc = _div_(".description");
    $cont.prepend(_div_(".block").append($name, $desc));
  }
  $name.html(name);
  $desc.empty().append(block_content);
  add_control($n).hide();
  return $n;
}

function set_callbacks($root) {
  /*
   * Activation callback
   */
  $root.on('click', '.node > .content', function(ev) {
    $n = $(this).closest(".node");
    var activate = $n.hasClass("activate");
    deactivate_node();
    if(activate)
      deactivate_node($n);
    else
      activate_node($n);
    ev.preventDefault();
    ev.stopPropagation();
  });

  /*
   * Control callbacks
   */
  $root.on('click', '.control .add', function(ev) {
    deactivate_node();
    var $n = $(this).closest('.node');
    var $m = make_node($n);
    set_content($m, "Node name", "Node description goes here.");
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .remove', function(ev) {
    deactivate_node();
    $(this).closest('.child').remove();
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .open', function(ev) {
    deactivate_node();
    var $n = $(this).closest('.node');
    $n.toggleClass("closed");
    $chlist = get_child($n);
    if($n.hasClass("closed")) {
      $chlist.hide('slow');
      $(this).html('Open');
    } else {
      $chlist.show('slow');
      $(this).html('Close');
    }
    ev.stopPropagation();
    ev.preventDefault();
  });

}

function activate_node($n) {
  $n.addClass("activate");
  get_control($n).fadeIn();
}
function deactivate_node($n) {
  if($n == null) {
    $(".node.activate").each(function(i, e) {
      deactivate_node($(e));
    });
  } else {
    $n.removeClass("activate");
    get_control($n).fadeOut();
  }
}
