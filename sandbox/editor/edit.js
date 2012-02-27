/* Storage */
var MyStorage;

function NodeID($n) {
  if(typeof($n) == 'string')
    return $n
  else
    return $n.attr('id');
}

function Del($n, $p) {
  var nid = NodeID($n);
  Set($p, "children", function(c) {
    var found = -1;
    for(var i=0; i < c.length; i++)
      if(c[i] == nid) {
        found = i;
        break;
      }
    if(found >= 0)
      c.splice(found, 1);
  });
}

function Get($n, prop) {
  var info = MyStorage[NodeID($n)];
  if(! info)
    return undefined;
  else
    return info[prop];
}

function Set($n, prop, val) {
  var id = NodeID($n);
  var info = MyStorage[id];
  if(! info)
    MyStorage[id] = info = {
      name: null, 
      description: null, 
      markdown: null,
      style: null,
      children: []
    };

  if(typeof(val) == 'function') {
    val(info[prop]);
  } else {
    info[prop] = val;
  }
}

function Data($n, prop, val) {
  if(val === undefined)
    return Get($n, prop);
  else
    return Set($n, prop, val);
}

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

  // If $node is a root, then remove the Remove button
  if(! $node.closest(".child"))
    $(".remove", $control).remove();
  
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
    $n.attr('id', __id__(o.name));
    $c.find(".name").html(o.name);
    Data($n, "name", o.name);
  }
  if(o.description !== undefined) {
    var $d = $c.find(".description").html(o.description);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, $d[0]]);
    Data($n, "description", o.description);
  }
  if(o.markdown !== undefined) {
    Data($n, "markdown", o.markdown);
  }
  if(o.style !== undefined) {
    Data($n, "style", o.style);
  }

  // Link to a parent
  if(o.parent !== undefined) {
    Set(o.parent, "children", function(c) {
      c.push(NodeID($n));
    });
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
        save_node($m, {name: name, parent: $n});
        $m.trigger('refresh'); // TODO: to be implemented
      }
    });
    ev.stopPropagation();
    ev.preventDefault();
  });
  $root.on('click', '.control .remove', function(ev) {
    exit_focus();
    apprise('"' + Data($n, 'name') + '" is about to be removed.',
      {confirm: true},
      function(reply) {
        if(reply) {
          var $p = get_parent_node($n);
          $n.closest('.child').remove();
          Del($n, $p);
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
  $ne.find("input").val(Data($n, 'name'));
  $de.find("textarea").val(Data($n, 'description'));
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

function make_tree($div, root_id) {
  var mk_n = function(n_id, $p) {
    var info = MyStorage[n_id];
    var $n = make_node($p);
    save_node($n, info);
    if(info.children && info.children.length)
      $.each(info.children, function(i, c_id) {
        mk_n(c_id, $n);
      });
    return $n;
  };

  var $root = mk_n(root_id, $div);
  set_callbacks($root);
  set_indented_style($root);
  $(".children", $root).sortable({
    handle: ".block"
  });

  return $root;
}

