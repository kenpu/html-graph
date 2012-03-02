var ConceptModel = Backbone.Model.extend({
  defaults: function() {
    return {
      name: "",
      desc: "",
      content: "",
      meta: {},
      style: {},
      order: 0,
      children: []
    };
  },
  idAttribute: "name"
});

var ConceptTree = Backbone.Collection.extend({
  model: ConceptModel
});


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
  * o.model: { attr: val }
  * o.silence: boolean - raise event or not
  */
  $.T_MakeNode = function(o) {
    o = $.extend({}, o);
    var model = o.model;
    var $n = $('<div>').addClass("node")
                       .attr('id', model.id)
                       .data('model', model);
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
    if(! o.silence) {
      $n.trigger("node-created", [$n]);
    }
    return $n
  };

  $.fn.T_Model = function() {
    return $(this).data('model');
  };

  $.T_LoadCollection = function(o) {
    var $n = $.T_MakeNode({
               parent: o.parent,
               container: o.root.get('name') + ":" + o.root.get('desc'),
               model: o.root,
               silence: true
             });
    _.each(o.root.get('children'), function(name) {
      var m = o.nodes.get(name);
      if(m) $.T_LoadCollection({
              parent: $n,
              nodes: o.nodes,
              root: m
            });
    });
    $n.trigger('node-loaded', [$n]);
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
