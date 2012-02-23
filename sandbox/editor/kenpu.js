function _haml_(tag, label, html) {
  $e = $('<' + tag + '>');
  if(label != null) {
    if(label[0] == '#')
      $e.attr('id', label.substr(1));
    else if(label[0] == '.')
      $e.addClass(label.substr(1));
  }
  if(html != null) $e.html(html)
  return $e;
}
function _span_(label, html) {
  return _haml_('span', label, html);
}
function _div_(label, html) {
  return _haml_('div', label, html);
}
