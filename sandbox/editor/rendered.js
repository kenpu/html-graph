function open_editor(width, height) {
  var left = (window.screen.width - width) / 2;
  var top = (window.screen.height - height) / 2;
  return window.open("edit.html", "_blank", 
    "width=" + width + "," +
    "height=" + height + "," +
    "left=" + left + "," +
    "top=" + top);
}

var rpc = {

};

function handler(msg) {
  var data = msg.data;
  var fn = data.fn;
  var o  = data.o;
  var rc = null;
  if(rpc.fn)
    rc = rpc[fn].apply(msg, o);
}

function handshake(client) {
  ;
}
