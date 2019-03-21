solution.ui.txteditor = function(config) {
	var that = this;
	var _id = config.target.attr('id') || chivox.util.createUUID();
	var _config = {
		setWidth: 655
	};
	var _isHide = true; //标识，防止多次调用.hide()事件时重复执行
	$.extend(true, _config, config);
	var _$contain = $('<div class="ui-txteditor" style="width:' + _config.setWidth + 'px;"><div class="txteditor-show" name="' + _id + '"></div><textarea id="' + _id + '"></textarea></div>');
	var _$div = _$contain.find("div");
	var _$txt = _$contain.find("textarea").css({
		width: _config.setWidth
	});
	_$div.click(function(event) {
		that.show();
		return false;
	});

	this.type = "txteditor";
	this.render = function(id) {
		config.target.replaceWith(_$contain);
	};
	this.getValue = function() {
		return _$div.html();
	};

	this.setValue = function(data) {
		_$div.html(data);
		return that;
	};
	this.reset = function() {
		_$div.html("请在此输入内容");
	};
	this.getId = function() {
		return _id;
	};
	this.show = function() {
		var val = _$div.html();
		_$div.css('color', '#000');
		if (val == "请在此输入内容") val = "";
		if (typeof _config.event.replaceOption === "function") {
			val = _config.event.replaceOption(val);
		}
		if (_ue) {} else {
			var width = _config.target.parent("div").width();
		}
		_isHide = false; //阻止重复hide
		_$div.hide();
		return that;
	};
	this.hide = function() {
		if (_isHide) return; //
		else _isHide = true;
		var content = _ue.getContent();
		if (content === "<p><br/></p>") {
			_$div.html("");
		} else {
			if (_config.anchor) {
				if (typeof _config.event.replaceAnchor === "function") {
					content = _config.event.replaceAnchor(content);
				}
			}
			_$div.html(content);
		}
		_ue.hide();
		_$div.show();
	};
	this.setFocus = function() {
		_ue.focus();
	};

	this.remove = function() {
		if (_ue)
			_ue.destroy();
		_$contain.remove();

	};

	if (_config.autoRender) {
		this.render();
	}
}