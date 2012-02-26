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
  var $control2 = _div_(".control").append(
        _span_(".save", "Save"),
        _span_(".cancel", "Cancel"));
  $content.append($control, $control2);
  return $control.add($control2);
}

function get_control($node, which) {
  if(! which) which = "";
  return $(".control" + which, get_content($node));
}

/* Save or update a node with the new content
 *
 * o = { name: <string>
 *       description: <string>
 *       markdown: <string>
 *       style: <object>
 *     }
 *
 */
function save_node($n, o) {
  var $c = get_content($n);
  var $blk = $c.find(".block");
  //
  // If block has not been created, we initialize
  // the node here.
  //
  if(! $blk.size()) {
    $blk = _div_(".block").append(
      _div_(".name"),
      _div_(".description"),
      _div_(".name-edit").append($("<input>")).hide(),
      _div_(".description-edit").append($("<textarea>")).hide()
    ).appendTo($c);
    add_control($n).hide();
  }
  //
  // Modify the node data and its HTML content
  //
  if(o.name) {
    $n.data('name', o.name);
    $n.attr('id', __id__(o.name));
    $c.find(".name").html(o.name);
  }
  if(o.description !== undefined) {
    $n.data('description', o.description);
    var $d = $c.find(".description").html(o.description);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, $d[0]]);
  }
  if(o.markdown !== undefined) {
    $n.data('markdown', o.markdown);
  }
  if(o.style !== undefined) {
    $n.data('style', o.style);
  }
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
    apprise("Enter the (unique) name:", {
      input: true,
      textOk: "Create"
    }, function(name) {
      if($("#" + __id__(name)).size()) {
        alert('"' + name + '" is already used.');
      } else {
        var $m = make_node($n);
        save_node($m, {name: name});
        $m.trigger('refresh'); // TODO: to be implemented
      }
    });
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .remove', function(ev) {
    exit_focus();
    apprise('"' + $n.data('name') + '" is about to be removed.',
      {confirm: true},
      function(reply) {
        if(reply) {
          var $p = get_parent_node($n);
          $n.closest('.child').remove();
          $p.trigger('refresh');
        }
      });
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
    $n.trigger('refresh');
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .edit', function(ev) {
    var $n = $(this).closest('.node');
    enter_edit($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .author', function(ev) {
    var $n = $(this).closest('.node');
    launch_author($n);
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.name-edit,.description-edit', function(ev) {
    ev.stopPropagation();
  });
  $root.on('click', '.control .save,.cancel', function(ev) {
    var $n = $(this).closest('.node');
    exit_focus($n, $(this).hasClass("cancel")); // Will call save too.
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.node', function(ev) {
    ev.stopPropagation();
  });
  $('body').click(function(ev) {
    exit_focus();
  });
}

function enter_focus($n) {
  get_content($n).css({'-webkit-transition': 'all 300ms ease 0s'});
  $n.addClass("focus-mode");
  get_control($n, ":first").show();
}

function exit_focus($n, dont_save) {
  if($n == null) {
    $(".node.focus-mode").each(function(i, e) {
      exit_focus($(e));
    });
  } else {
    exit_edit($n, dont_save);
    $n.removeClass("focus-mode");
    get_control($n).hide();
  }
}

function enter_edit($n) {
  $n.addClass("edit-mode");
  var $content = get_content($n);
  $content.find(".name").hide();
  $content.find(".description").hide();
  $content.find(".control").hide();
  var $ne = $content.find(".name-edit").show();
  var $de = $content.find(".description-edit").show();
  $ne.find("input").val($n.data('name'));
  $de.find("textarea").val($n.data('description'));
  get_control($n, ":first").hide();
  get_control($n, ":last").show();
}

function exit_edit($n, dont_save) {
  if($n.hasClass("edit-mode")) {
    $n.removeClass("edit-mode");
    var $content = get_content($n);
    var $ne = $content.find(".name-edit").hide();
    var $de = $content.find(".description-edit").hide();
    $content.find(".name").show();
    $content.find(".description").show();
    $content.find(".control").show();
    if(! dont_save)
      save_node($n, 
          { name: $ne.find("input").val(),
            description: $de.find("textarea").val()
          });
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
