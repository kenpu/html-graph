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
    desc: "Finall, run Lola run"
  },
]);

$(function() {

  var container_template = _.template($("#container-template").html());

  $("#concept-tree")
    .on("click", ".bullet", function(e) {
      $(this).T_Node().T_ToggleCollapse();
    })
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
