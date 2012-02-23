function add_control($node) {
  var $content = $node.find(".content:first");
  var $control = _div_(".control").append(
        _span_(".add", 'Add'),
        _span_(".remove", 'Remove'),
        _span_(".open", 'Close'),
        _span_(".edit", 'Edit'),
        _span_(".author", 'Author')
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

function set_content($n, name, desc) {
  var $content = get_content($n);
  var $name = _div_(".name").append(name);
  var $desc = _div_(".description").empty().append(desc);
  var $name_ed = _div_(".name-edit").hide()
                 .append($("<input>"));
  var $desc_ed = _div_(".description-edit").hide()
                 .append($("<textarea>"));
  $content.empty().append(
    _div_('.block').append($name, $desc, $name_ed, $desc_ed)
  );
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
  $root.on('click', '.control .edit', function(ev) {
    var $n = $(this).closest('.node');
    edit_node($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.name-edit,.description-edit', function(ev) {
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
    save_node($n);
    $n.removeClass("activate");
    get_control($n).fadeOut();
  }
}

function edit_node($n) {
  $n.addClass("edited");
  var $content = get_content($n);
  var $n = $content.find(".name").hide();
  var $d = $content.find(".description").hide();
  var $ne = $content.find(".name-edit").show();
  var $de = $content.find(".description-edit").show();
  $ne.find("input").val($n.text());
  $de.find("textarea").val($d.html());
}

function save_node($n) {
  if($n.hasClass("edited")) {
    $n.removeClass("edited");
    var $content = get_content($n);
    var $ne = $content.find(".name-edit").hide();
    var $de = $content.find(".description-edit").hide();
    var $n = $content.find(".name").show();
    var $d = $content.find(".description").show();
    $n.text($ne.find("input").val());
    $d.html($de.find("textarea").val());
    if(MathJax != null) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, $d[0]]);
    }
  }
}
