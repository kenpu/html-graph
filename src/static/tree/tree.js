var ConceptModel = Backbone.Model.extend({
  defaults: function() {
    return {
      name: "",
      desc: "",
      children: []
    };
  },
  removeChild: function(id) {
    var c = this.get('children');
    var i = c.indexOf(id);
    if(i >= 0) {
      c.splice(i, 1);
      this.save();
    }
  },
  addChild: function(id) {
    var c = this.get('children');
    var i = c.indexOf(id);
    if(i < 0) {
      c.push(id);
      this.save();
    }
  }
});

var ConceptTree = Backbone.Collection.extend({
  model: ConceptModel,
  url: "/concepts"
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
    o = $.extend({
      container: "",
      silence: false
    }, o);
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
        $p.T_Append($n);
      } else {
        $p.append($n);
      }
    }

    // Create a model for the node
    if(! o.silence) {
      console.debug("trigger node-created");
      $n.trigger("node-created", [$n]);
    }
    return $n
  };
  
  $.fn.T_Destroy = function() {
    $(this).T_Descendents().each(function(i, x) {
      console.debug("destroy mode: " + $(x).T_Model().id);
      $(x).T_Model().destroy();
    });
    $(this).T_Detach().T_Model().destroy();
  };
  
  $.fn.T_Parent = function() {
    return $(this).parent().closest(".node");
  };
  
  $.fn.T_Descendents = function() {
    return $(this).find(".node");
  };
  
  $.fn.T_Path = function() {
    return $(this).parents(".node").andSelf()
           .map(function(i, x){ return $(x).T_Model().get('name'); })
           .toArray().join(" / ");
  };
  
  $.fn.T_Detach = function() {
    var $n = $(this);
    var pmodel = $n.T_Parent().T_Model();
    var nmodel = $n.T_Model();
    if(pmodel) {
      pmodel.removeChild(nmodel.id);
    }
    return $n.detach();
  };
  
  $.fn.T_Append = function($n) {
    var $p = $(this);
    var pmodel = $p.T_Model();
    var nmodel = $n.T_Model();
    $(this).find(".children:first").append($n.T_Detach());
    pmodel.addChild(nmodel.id);
    return $(this);
  };

  $.fn.T_Model = function() {
    return $(this).data('model');
  };

  $.T_LoadCollection = function(o) {
    var $n = $.T_MakeNode({
               parent: o.parent,
               container: o.root.get('name') + ":" + o.root.get('desc'),
               model: o.root
             });
    _.each(o.root.get('children'), function(name) {
      var m = o.nodes.get(name);
      if(m) $.T_LoadCollection({
              parent: $n,
              nodes: o.nodes,
              root: m
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
