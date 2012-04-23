/*!
 * Lightning fast full-featured template system inspired
 * by jQuery templates.
 * 
 * Adapted from jqtpl (http://github.com/jquery/jquery-tmpl)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * @author Pierre Matri
 */
 
/**
 * Extendable array of filters supported by the engine.
 * @type {Object}
 * @api public
 */
module.exports = {
  'escape': function(str) {
    if(str.safe) return str;
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  }
}