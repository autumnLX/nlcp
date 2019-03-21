solution.ui.ueditor = function(config) {
	var that = this;
	var _id = config.target.attr('id') || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		afterShow: null,
		afterHide: null
	};
	var _isHide = true; //标识，防止多次调用.hide()事件时重复执行
	$.extend(true, _config, config);

	var _ue;
	var _$contain = $('<div class="ui-ueditor"><div class="ueditor-show" name="' + _id + '"></div><script id="' + _id + '" name="content" type="text/plain"></script></div>');
	var _$div = _$contain.find("div");
	_$div.click(function(event) {
		var uis = solution.ui.getUiByType("ueditor");
		for (var i = 0, len = uis.length; i < len; i++) {
			if (uis[i] !== _ue) uis[i].hide();
		}
		that.show();
		return false;
	});

	this.type = "ueditor";
	this.render = function(id) {
		config.target.replaceWith(_$contain);
	};
	this.getValue = function() {
		that.hide();
		return _$div.html();
	};
	this.getValueNotHide = function() {
		return _ue.getContent();
	};
	this.setValue = function(data) {
		_$div.html(data);
		if (data == "请在此输入解析内容") _$div.css('color', '#a3a3a3');
		return that;
	};
	this.reset = function() {
		_$div.html("");
		if (_ue)
			_ue.setContent("");
	};
	this.getId = function() {
		return _id;
	};
	this.show = function() {
		var content = _$div.html();
		if (typeof _config.afterShow === "function")
			content = _config.afterShow(content);
		if (_ue) {
			_ue.setContent(content);
			_ue.setShow();
			_ue.focus(true);
			_isHide = false; //阻止重复hide
		} else {
			_ue = new UE.getEditor(_id, {
				initialFrameWidth: 655,
				initialFrameHeight: 188
			});
			_ue.ready(function(editor) {
				_ue.setContent(content);
				_ue.setShow();
				_ue.focus(true);
				_$div.hide();
				_isHide = false; //阻止重复hide
			});
			//侦听输入字符超过限制事件
			_ue.addListener("wordcountoverflow", function() {
				var contentText = this.getContentTxt();
				contentText = contentText.substring(0, this.options.maximumWords);
				this.execCommand('cleardoc');
				this.execCommand('inserthtml', contentText);
			});
		}
		_$div.hide();
		return that;
	};
	this.hide = function() {
		if (_isHide) return;
		var content;
		if (_ue.body) {
			content = _ue.getContent();
			_ue.setHide();
			if (typeof _config.afterHide === 'function')
				content = _config.afterHide(content);
			if (content === "<p><br/></p>") _$div.html("");
			else _$div.html(content);
			_isHide = true;

		} else {
			_ue.ready(function(editor) {
				content = _ue.getContent();
				_ue.setHide();
				if (typeof _config.afterHide === 'function')
					content = _config.afterHide(content);
				if (content === "<p><br/></p>") _$div.html("");
				else _$div.html(content);
				_isHide = true;
			});
		}
		_$div.show();
	};
	this.isFocus = function() {
		return _ue.isFocus();
	};
	this.setFocus = function() {
		_ue.focus(true);
	};
	this.getUe = function() {
		return _ue;
	};

	this.remove = function() {
		if (_ue && _ue.body)
			_ue.destroy();
		if (_$contain) _$contain.remove();
	};
	if (_config.autoRender) {
		this.render();
	}
};