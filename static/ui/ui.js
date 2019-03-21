if (!window.solution) window.solution = {}
if (!window.solution.js) window.solution.js = {}
solution.ui = (function() {
	var _uiCollect = {};
	var _create = function(type, config) {
		var ui = new solution.ui[type](config);
		_uiCollect[ui.getId()] = ui;
		return ui;
	};
	var _empty = function() {
		_uiCollect = {};
	};
	var _getUiById = function(id) {
		return _uiCollect[id];
	};
	var _getUiByType = function(type) {
		var uis = [];
		var types = $.trim(type).split(" ");
		for (var key in _uiCollect) {
			var arrayIndex = $.inArray(_uiCollect[key].type, types);
			if (arrayIndex > -1) {
				uis.push(_uiCollect[key]);
			}
		}
		return uis;
	}
	var _getUiCollect = function() {
		return _uiCollect;
	};
	var _reset = function(ids) {
		if (ids) {
			for (var i = 0; i < ids.length; i++) {
				if (typeof _uiCollect[ids[i]].reset === "function") {
					_uiCollect[ids[i]].reset();
				}
			}
		} else {
			for (var id in _uiCollect) {
				if (typeof _uiCollect[id].reset === "function") {
					_uiCollect[id].reset();
				}
			}
		}
	};
	var _remove = function(param) {
		if (param instanceof Array && param.length) {
			for (var i = 0; i < param.length; i++) {
				if (_uiCollect[param[i].getId()])
					delete _uiCollect[param[i].getId()];
				param[i].remove();
			}
		} else {
			return false;
		}
	}
	return {
		create: _create,
		empty: _empty,
		getUiById: _getUiById,
		getUiByType: _getUiByType,
		getUiCollect: _uiCollect,
		reset: _reset,
		remove: _remove
	}
})();