/*
 * The structure
 *    .node
 *      .container
 *      .children
 *        .child +
 *          .bullet
 *          .node
 */
(function($) {
  /*
  * o.parent: DOM
  * o.container: DOM / HTML
  * o.id: string
  */
  $.T_MakeNode = function(o) {
    o = $.extend({}, o);
    var $n = $('<div>').addClass("node").attr('id', o.id);
    $n.append(
      $('<div>').addClass("container").html(o.container),
      $('<div>').addClass("children")
    );
    // Append to parent in two different ways:
    //  If not a children div, then simple append
    //  Else wrap in <child><bullet/>$n</child>
    if(o.parent) {
      var $p = $(o.parent);
      if($p.is(".node")) {
        $p.T_childrenDiv().append(
          $('<div>').append(
            $('<div>').addClass("bullet"), $n
          )
        );
      } else {
        $p.append($n);
      }
    }
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
           id: o.json.id
    });
    $.each(o.json.children, function(i, x) {
      $.T_MakeTree({
        parent: $n,
        json: x
      });
    });
  };

  $.fn.T_childrenDiv = function() {
    return $(".children:first", this);
  };

})(jQuery);
