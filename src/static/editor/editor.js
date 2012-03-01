var treeData = {
  id: 1,
  title: 'Compiler',
  bullet: function() {
            return $('<span>').addClass(
                    "ui-icon ui-icon-circle-plus")
          },
  children: [
    {id: 2, 
     title: "Regular languages",
     children: [
        {id: 3,
         title : 'Automaton', children : []
        },
        {id: 4,
         title : 'Regular expressions', children : []
        }
     ]
    },
    {id: 5,
     title: "Context free languages",
     children : []
    }
  ]
};

var ConceptModel = Backbone.Model.extend({
  defaults: function() {
    return {
      name: "",
      desc: "",
      content: "",
      meta: {},
      style: {}
      order: 0,
      parent: null
    };
  }
});

var ConceptMapModel = Backbone.Collection.extend({
  model: ConceptModel
});

(function($) {
  /* Initializes the editor nodes */
  $.fn.E_Initialize = function() {
    var model = new ConceptModel();
    $(this).data('model', model);
    var $container = $(this).find(".container:first");
    $container.append(
      $('<div>').addClass("name display"),
      $('<div>').addClass("name display"),
    );
  };
})(jQuery);

$(function() {
  $("#concept-tree")
    .on("click", ".bullet", function(e) {
      $(this).T_Node().T_ToggleCollapse();
    })
    .on("node-created", ".node", function(e) {
      $(this).E_Initialize();
      return false;
    });
  var $root = $.T_MakeTree({
    parent: "#concept-tree",
    json: treeData
  }).T_IndentedStyle();

  var $r2 = $.T_MakeTree({
    parent: "#concept-content",
    json: treeData
  }).T_IndentedStyle();
});
