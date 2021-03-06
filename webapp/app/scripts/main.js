var Model = require('./model.js').Model;
var Config = require("./config.js").config;

Model.init(Config.version);
window.Actions = Model.Actions;
//Need it for passing the model to purescript actions
window.Model = {};
window.Model.state = Model.getState();
window.Model.getState = Model.getState;

window.Model.saveState = Model.saveState;
window.Model.persistToLocalStorage = Model.persistToLocalStorage;

module.export = () => {
  return Model;
}
