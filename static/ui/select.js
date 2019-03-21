solution.ui.select = function(config) {
	var that = this;
	var _id = config.id || _chivox.util.createUUID();
	var _config = {
		width: 200,
		autoRender: true,
		event: {
			change: function () {}
		}
	};
	$.extend(true, _config, config);

	var _$containerView = $('<div class="ui-select" id="' + _id + '" style="width:' + _config.width + 'px"><input readonly/><ul></ul></div>');
	var _$ul = _$containerView.find("ul");
	var _$input = _$containerView.find("input");

	_$input.click(function (event) {
		if (_$ul.is(":hidden")) {
			var uis = solution.ui.getUiByType("ueditor comboTree select");
			for (var i = 0, len = uis.length; i < len; i++) {
				uis[i].hide();
			}
			_$ul.show();
			_$input.addClass('active');
		} else {
			_$ul.hide();
			_$input.removeClass('active');
		}
		return false;
	});

	if (_config.width) {
		_$containerView.width(_config.width);
	}
	if (config.height) {
		_$containerView.find("ul").css({
			"height": config.height,
			"overflow-y": "auto"
		});
	}

	$.each(_config.dataList, function(index, data) {
		var $li = $("<li data-value='" + data.value + "' data-index='"+index+"' title='"+ data.name +"' class='ellipsis'>" + data.name + "</li>");
		$li.data("value", data.value);
		$li.click(function(event) {
			_$input.val($(this).html());
			_$input.data("value", $(this).data("value"));
			_$input.data("index", $(this).data("index"))
			_$ul.hide();
			
			_config.event.change(_$input);
			
			return false;
		});
		_$ul.append($li);
	});
	this.type = "select";
	this.hide = function() {
		_$ul.hide();
		_$input.removeClass('active');
	};
	this.render = function() {
		_config.target.replaceWith(_$containerView);
		if (typeof _config.event.render === "function") {
			config.event.render(_$ul);
		}
	};

	this.getValue = function() {
		return _$input.data("value") || "";
	};

	this.getText = function () {
		return $.trim(_$input.val());
	};

	this.setValue = function(data) {
		//_$input.data("value", data);
		if (!data) return;
		_$ul.find("li[data-value=" + data + "]").click();
	};

	this.setOriginValue = function(data) {
		if (!data) return;
		_$input.data("value", data);
		_$input.val(_$ul.find("li[data-value=" + data + "]").html());
	};
	this.reset = function() {
		_$input.data("value", "").val("");
	};
	this.getId = function() {
		return _id;
	}

	if (_config.autoRender) {
		this.render();
	}
}