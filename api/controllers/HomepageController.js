/**
 * HomepageController.js
 *
 * @description :: This file serve homepage view
 */

module.exports = {
  show: function(req, res) {
    res.view("index.html");
  }
}
