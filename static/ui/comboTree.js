solution.ui.comboTree = function(config) {
	var that = this;
	var _id = config.id || chivox.util.createUUID();
	var _value = "";
	var _text = "";
	var _config = {
		autoRender: true,
		event: {},
		zNodes: [],
		setting: {
			check: {
				chkboxType: {"Y": "", "N": ""}
			},
			callback: {
				onClick: function(event, treeId, treeNode) {
					console.log(treeNode);
				},
				onCheck: function(event, treeId, treeNode) {
					var names = [],
						values = [];
					var checkedNodeArray = that.zTree.getCheckedNodes(true);
					$.each(checkedNodeArray, function(index, node) {
						if (!node.isParent) {
							var name = [node.name];
							values.push(node.value);
							var pNode = node.getParentNode();
							while (!!pNode) {
								name.push(pNode.name);
								pNode = pNode.getParentNode();
							}
							names.push(name.reverse().join("/"));
						}
					});

					_value = values.join(",");
					_text = names.join(",");
					_$view.find("input").val(_text).data("value", _value).attr("title", _text);
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		}
	};
	$.extend(true, _config, config);
	var _$view = $("<div class='ui-comboTree' id='" + _id + "'><input readonly/><ul id='" + _id + "_tree' class='ztree' style='display:none;'></ul></div>");
	if (_config.width) {
		_$view.width(_config.width);
	}
	var _$tree = _$view.find(".ztree");
	_$tree.click(function(event) {
		return false;
	});
	_$view.find("input").click(function(event) {
		if (_$tree.is(":hidden")) {
			var uis = solution.ui.getUiByType("ueditor comboTree select");
			for (var i = 0, len = uis.length; i < len; i++) {
				uis[i].hide();
			}
			_$tree.show();
			_$view.find("input").addClass('active');
		} else {
			_$tree.hide();
			_$view.find("input").removeClass('active');
		}
		return false;
	});

	this.zTree = $.fn.zTree.init(_$tree, _config.setting, _config.zNodes);
	this.type = "comboTree";
	this.hide = function() {
		_$tree.hide();
		_$view.find("input").removeClass('active');
	};
	this.setTreeData = function(zNodes) {
		_$view.find("input").val("").data("value", "").attr("title", "");
		$.fn.zTree.init(_$tree, _config.setting, zNodes);
		_value = "";
		return that;
	}
	this.render = function() {
		config.target.replaceWith(_$view);
		if (typeof _config.event.render === "function") {
			_config.event.render(that);
		}
	};
	this.getValue = function() {
		return _value || "";
	};
	this.setValue = function(data) {
		// _$view.find("input").val(data);
		if (arguments.length === 1) {
			var vals = data.split(",");
			$.each(vals, function(index, val) {
				var node = that.zTree.getNodeByParam("value", val - 0);
				if (!node) return;
				var pNode = node.getParentNode();
				while (pNode) {
					that.zTree.expandNode(pNode, true);
					pNode = pNode.getParentNode();
				}
				that.zTree.checkNode(node, true, true, true);
			});
		} else if (arguments.length === 2) {
			_value = arguments[0];
			_text  = arguments[1];
			_$view.find("input").val(_text).data("value", _value).attr("title", _text);
		} else {
			return null;
		}
	}
	this.getText = function() {
		return _text;
	};
	this.getId = function() {
		return _id;
	};
	this.reset = function() {
		_$view.find("input").val("").data("value", "").attr("title", "");

		this.zTree.destroy();
		this.zTree = $.fn.zTree.init(_$tree, _config.setting, _config.emptyNode);
		// this.zTree.checkAllNodes(false);
		_value = "";
	}

	if (_config.autoRender) {
		this.render();
	}
};