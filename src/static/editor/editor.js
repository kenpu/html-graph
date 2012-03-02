var conceptTree = new ConceptTree([
  { name: "Compiler",
    desc: "Taught by Ken Pu, Ph.D.",
    children: ["Lexical analysis", "Context free grammar", "Code generation"]
  },
  { name: "Lexical analysis",
    desc: "Breaking strings into little pieces"
  },
  { name: "Context free grammar",
    desc: "Complex structures and putting things back in order"
  },
  { name: "Code generation",
    desc: "Finally, run Lola run"
  },
]);

(function($) {
  $.fn.Edit = function() {
    var $d = $("#node-edit-dialog");
    var m = $(this).T_Model();
    $d.data('node', $(this));
    $d.find("input").val(m.get('name'));
    $d.find("textarea").val(m.get('desc'));
    $d.dialog('open');
  };
  $.fn.Save = function() {
    var $d = $("#node-edit-dialog");
    var m = $(this).T_Model();
    m.set({
      name: $d.find("input").val(),
      desc: $d.find("textarea").val()
    });
    $(this).find(".name .display").text(m.get('name'));
    $(this).find(".desc .display").html(m.get('desc'));
    alert('new name = ' + m.get('name'));
  };
})(jQuery);

$(function() {

  var container_template = _.template($("#container-template").html());

  /* Events */
  $("#concept-tree")
    .on("click", ".container", function(e) {
      var $n = $(this).T_Node();
      if($n.is(".focused"))
        $n.removeClass("focused");
      else {
        $("#concept-tree .node").removeClass("focused");
        $n.addClass("focused");
      }
      return false;
    })
    .on("dblclick", ".container .main", function(e) {
      $(this).T_Node().Edit();
      return false;
    })
    .on("click", ".expand-collapse", function(e) {
      var $n = $(this).T_Node();
      $n.toggleClass("collapsed");
      if($n.is(".collapsed")) {
        $(this).text("Expand");
        $n.find(".children:first").hide();
      } else {
        $(this).text("Collapse");
        $n.find(".children:first").show();
      }
      return false;
    })
    ;

  $("#concept-tree")
    .on("node-loaded", ".node", function(e, $n) {
      $n.find(".container:first")
        .html(container_template($n.T_Model().toJSON()));
      return false;
    });

  var $root = $.T_LoadCollection({
    parent: "#concept-tree",
    nodes: conceptTree,
    root: conceptTree.at(0)
  }).T_IndentedStyle();
});
