var conceptTree = new ConceptTree;

(function($) {
  $.fn.Edit = function() {
    var $d = $("#node-edit-dialog");
    var m = $(this).T_Model();
    $d.data('node', $(this));
    $d.find("input").val(m.get('name'));
    $d.find("textarea").val(m.get('desc'));
    $d.dialog('option', 'title', $(this).T_Path());
    $d.dialog('open');
  };
  $.fn.Save = function() {
    var $d = $("#node-edit-dialog");
    var m = $(this).T_Model();
    m.save({
      name: $d.find("input").val(),
      desc: $d.find("textarea").val()
    });
    $(this).find(".container:first .name .display").text(m.get('name'));
    $(this).find(".container:first .desc .display").html(m.get('desc'));
  };
})(jQuery);

/***************************************************
 * Initialization
 ***************************************************/
 
$(function() {
  var container_template = _.template($("#container-template").html());
  /*----------------------------------
   * Events 
   *----------------------------------*/
   
  //
  // click sets focus to the node
  //
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
    });
  //
  // double click opens the edit dialog
  //
  $("#concept-tree")
    .on("dblclick", ".container .main", function(e) {
      $(this).T_Node().Edit();
      return false;
    });
  //
  // click on individual controls invokes actions
  // The event is bubbled to .controls which
  // losses the focus and stops the event propagation.
  //
  $("#concept-tree")
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
    })
    .on("click", ".add-concept", function(e) {
      var $n = $(this).T_Node();
      var m = new ConceptModel({name: 'New concept'});
      conceptTree.add(m);
      m.save({}, {
        success: function() {
          $n.T_Append($.T_MakeNode({model: m, parent: '#concept-tree'}));
        },
        error: function() {
          alert("Server cannot create node.");
        }
      });
    })
    .on("click", ".del-node", function(e) {
      $(this).T_Node().T_Destroy();
    })
    .on("click", ".controls", function(e) {
      $("#concept-tree .node").removeClass("focused");
      e.stopPropagation();
    });
    ;

  // when nodes are created, we initialize its content with
  // a template instance.
  $("#concept-tree")
    .on("node-created", ".node", function(e, $n) {
      $n.find(".container:first")
        .html(container_template($n.T_Model().toJSON()));
      return false;
    });

  /* Load ConceptTree */
  var load = function() {
    $.T_LoadCollection({
        parent: "#concept-tree",
        nodes: conceptTree,
        root: conceptTree.at(0)})
     .T_IndentedStyle();    
  };
  conceptTree.fetch({
    success: function() {
      if(! conceptTree.length)
        conceptTree.create({name: 'Root'}, {
          wait: true,
          success: load
        });
      else
        load();
    }
  });
});
