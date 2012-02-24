function get_name($n) {
  var $c = get_content($n);
  return $(".name", $c).text();
}

function add_control($node) {
  var $content = get_content($node);
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

function get_control($node) {
  return $(".control", get_content($node));
}

function set_content($n, name, desc) {
  var $content = get_content($n);
  var $name    = _div_(".name").append(name);
  var $desc    = _div_(".description").empty().append(desc);
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
    var focused = $n.hasClass("focus-mode");
    exit_focus();
    if(focused)
      exit_focus($n);
    else
      enter_focus($n);
    ev.preventDefault();
    ev.stopPropagation();
  });

  /*
   * Control callbacks
   */
  $root.on('click', '.control .add', function(ev) {
    exit_focus();
    var $n = $(this).closest('.node');
    var $m = make_node($n);
    set_content($m, "Node name", "Node description goes here.");
    refresh_style($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .remove', function(ev) {
    exit_focus();
    $(this).closest('.child').remove();
    refresh_style($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .open', function(ev) {
    exit_focus();
    var $n = $(this).closest('.node');
    $n.toggleClass("closed");
    $chlist = get_child($n);
    if($n.hasClass("closed")) {
      $chlist.hide(); // slow
      $(this).html('Open');
    } else {
      $chlist.show(); // slow
      $(this).html('Close');
    }
    refresh_style($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .edit', function(ev) {
    var $n = $(this).closest('.node');
    enter_edit($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.name-edit,.description-edit', function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .author', function(ev) {
    var $n = $(this).closest('.node');
    launch_author($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
}

function enter_focus($n) {
  get_content($n).css({'-webkit-transition': 'all 300ms ease 0s'});
  $n.addClass("focus-mode");
  get_control($n).fadeIn();
}

function exit_focus($n) {
  if($n == null) {
    $(".node.focus-mode").each(function(i, e) {
      exit_focus($(e));
    });
  } else {
    exit_edit($n);
    $n.removeClass("focus-mode");
    get_control($n).hide();
  }
}

function enter_edit($n) {
  $n.addClass("edit-mode");
  var $content = get_content($n);
  var $n = $content.find(".name").hide();
  var $d = $content.find(".description").hide();
  var $ne = $content.find(".name-edit").show();
  var $de = $content.find(".description-edit").show();
  $ne.find("input").val($n.text());
  $de.find("textarea").val($d.html());
}

function exit_edit($n) {
  if($n.hasClass("edit-mode")) {
    $n.removeClass("edit-mode");
    var $content = get_content($n);
    var $ne = $content.find(".name-edit").hide();
    var $de = $content.find(".description-edit").hide();
    var $n = $content.find(".name").show();
    var $d = $content.find(".description").show();
    $n.text($ne.find("input").val());
    $d.html($de.find("textarea").val());
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, $d[0]]);
  }
}

function launch_author($n) {
  if($n.hasClass("author-mode")) {
    return;
  }

  $textareas = _div_().append(
    $("<h3>").html('<a href="#">Markdown</a>'),
    _div_().append($('<textarea>').addClass("markdown")),
    $("<h3>").html('<a href="#">Styling</a>'),
    _div_().append($('<textarea>').addClass("styling"))
  );
  $author = _div_(".authoring").attr('title', get_name($n)).append(
    $textareas
  );
  $('body').append($author);
  $textareas.accordion();
  $author.dialog({
    minWidth: 450,
    position: 'center',
    buttons: { "Save": function() {
                         $(this).dialog('close');
                         exit_focus();
                       } 
             }
  });
  $(".ui-dialog")
    .css("opacity", 0.8)
    .click(function(e) {e.stopPropagation();});
}
