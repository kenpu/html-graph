/*
 * The structure
 *    .node
 *      .bullet
 *      .container
 *      .children
 *          .node+
 */

(function($) {
  /*
  * o.parent: DOM
  * o.container: DOM / HTML
  * o.bullet: DOM / HTML
  * o.id: string
  */
  $.T_MakeNode = function(o) {
    o = $.extend({}, o);
    var $n = $('<div>').addClass("node").attr('id', o.id);
    var bullet = (typeof(o.bullet) == 'function' ? o.bullet() : o.bullet);
    $n.append(
      $('<div>').addClass("bullet").html(bullet),
      $('<div>').addClass("container").html(o.container),
      $('<div>').addClass("children")
    );
    // Append to parent in two different ways:
    //  If not a children div, then simple append
    //  Else wrap in <child><bullet/>$n</child>
    if(o.parent) {
      var $p = $(o.parent);
      if($p.is(".node")) {
        $p.find(".children:first").append($n);
      } else {
        $p.append($n);
      }
    }

    // Create a model for the node
    $n.trigger("node-created", [$n]);
    $p.trigger("subtree-changed");
    return $n
  };

  /*
   * o.parent: DOM
   * o.json: { id: string
   *           title: string
   *           children: [ ... ]
   *         }
   */
  $.T_MakeTree = function(o) {
    var $n = $.T_MakeNode({
           parent: o.parent,
           container: o.json.title,
           bullet: o.json.bullet,
           id: o.json.id
    });
    $.each(o.json.children, function(i, x) {
      $.T_MakeTree({
        parent: $n,
        json: $.extend(_.clone(o.json), x)
      });
    });
    return $n;
  };


  $.fn.T_Node = function() {
    return $(this).closest(".node");
  };

  /*
   * Styling
   */
  $.fn.T_IndentedStyle = function() {
    $(this).addClass("indented");
    return $(this);
  };

  $.fn.T_Collapse = function() {
    var $n = $(this);
    $n.find(".children:first").slideUp(
      function(){ $n.addClass("collapsed"); }
    );
  }

  $.fn.T_Uncollapse = function() {
    var $n = $(this);
    $n.find(".children:first").slideDown(
      function(){ $n.removeClass("collapsed"); }
    );
  }

  $.fn.T_ToggleCollapse = function() {
    var $c = $(this).find(".children:first");
    if($c.is(":visible"))
      $(this).T_Collapse();
    else
      $(this).T_Uncollapse();
    return $(this);
  };

})(jQuery);
