solution.ui.tag2 = function(config) {
	var that = this;
	var _id = config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		height: 50,
		width: 220,
		limit: 999,
		event: {}
	};
	var _value = {};
	$.extend(true, _config, config);
	var _style = {
		"width": _config.width,
		"height": _config.height
	};
	var _createTagView = function (param) {
		param = param.type === "click" ? "" : param;
		var _replaceFn = function (thisInput) {
			var id = thisInput.attr('id'),
				v = thisInput.attr('value'); //没修改之前名称，当该tag为新添加时为空
			var vnew = $.trim(thisInput.val()); //当前输入新名称，并去掉前后空格
			var thisTag = thisInput.parent();

			if (vnew || id) { //输入新名称不为空或者该tag为旧数据时（防止旧数据中有名称为空的情况）
				if (v && !vnew) { //修改的新名称为空时返回输入框
					thisInput.focus();
					return;
				}
				if (v !== vnew) { //修改名称与修改之前名称不同时触发addEvent事件
					if (typeof _config.event.addEvent === 'function') {
						_config.event.addEvent(thisTag);
					}
				}
				if (id) _value[id] = vnew;
				if (id && !v) { //旧数据中有名称为空的情况
					v = "还没有命名!";
					if (!vnew) thisInput.parent().addClass('error');
				}
				var _$span = $('<span id="' + id + '">' + v + '</span>');
				thisInput.replaceWith(_$span);
				_$span.click(function() {
					if ($(this).parent().hasClass('error')) {
						$(this).parent().removeClass('error');
					}
					$(this).replaceWith(thisInput);
					thisInput.val("").focus().val(thisInput.attr('value')).parent('.tag').addClass('active');
					thisInput.keyup(function (event) {
						if (event.keyCode === 13) {
							$(this).parent('.tag').removeClass('active max');
							_replaceFn($(this));
						} else {
							if ($(this).val().length >= _config.limit) {
								$(this).parent('.tag').addClass("max");
							} else {
								$(this).parent('.tag').removeClass("max");
							}
						}
					});
				});
				thisInput.blur(function () {
					$(this).parent('.tag').removeClass('active max');
					_replaceFn($(this));
				});
				// _$newInput.find(".cancel").show();
			} else {
				thisInput.parent(".tag").remove();
			}
		};
		var newInputID = param && param.id ? param.id : "",
			newInputValue = param && param.value ? param.value : "";
		var _$newInput = $('<div class="tag">'+
						   '	<input id="' + newInputID + '" value="' + newInputValue + '" maxlength="' + _config.limit + '"/>'+
						   '	<div class="cancel"></div>'+
						   '</div>');
		
		_$newInput.css(_style);
		_$newInput.find("input").blur(function() {
			$(this).parent('.tag').removeClass("max");
			_replaceFn($(this));
		});
		_$newInput.find("input").keyup(function(event) {
			if (event.keyCode === 13) {
				_replaceFn($(this));
			} else {
				if ($(this).val().length >= _config.limit) {
					$(this).parent('.tag').addClass("max");
				} else {
					$(this).parent('.tag').removeClass("max");
				}
			}
		});
		_$newInput.find(".cancel").click(function(event) {
			var thisTag = $(this).parent();
			if (typeof _config.event.cancelEvent == 'function') {
				result = _config.event.cancelEvent(thisTag);
			}
		});
		if (param.id) _$newInput.find("input").blur();


		_$newIcon.replaceWith(_$newInput);
		_$newInput.find("input").focus();
		_$tagContainerView.append(_$newIcon);
		_$newIcon.click(_createTagView);
	}

	var _$newIcon = $('<div class="tagAdd"><span>﹢</span></div>');
	_$newIcon.css(_style);
	_$newIcon.click(_createTagView);

	var _$tagContainerView = $('<div class="ui-tag2"></div>');
	_$tagContainerView.append(_$newIcon);


	this.render = function() {
		_config.target.replaceWith(_$tagContainerView);
	};

	this.getValue = function() {
		return _value.join(",");
	};

	this.setValue = function(data) {
		$.each(data, function(index, tag) {
			_createTagView(tag);
		});
	};

	this.getId = function() {
		return _id;
	};
	this.reset = function() {

	};
	
	if (_config.autoRender) {
		this.render();
	}
}