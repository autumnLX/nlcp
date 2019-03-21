solution.ui.checkbox = function(config) {
	var that = this;
	var _id = config.target.attr('id') || config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		event: {}
	};
	$.extend(true, _config, config);

	var _$containerView = $('<div class="ui-checkbox" id="' + _id + '"></div>');
	$.each(_config.dataList, function(index, data) {
		var $this = $(this);
		var $checkbox = $('<label for="' + _id + "_" + index + '">' +
			'	<span class="checkbox-icon"></span>' +
			'	<input type="checkbox" id="' + _id + "_" + index + '" value="' + data.value + '" />' + data.name +
			'</label>');

		var $input = $checkbox.find("input");

		$input.click(function(event) {
			event.stopPropagation();
		});

		if (data.disabled) {
			$checkbox.addClass("disabled");
			$input.attr("disabled", true);
		}

		if (data.checked) {
			$checkbox.addClass("checked");
			$input.attr("checked", true);
		}

		$checkbox.click(function(event) {
			if ($(this).hasClass('disabled')) {
				return;
			}

			if ($(this).hasClass('checked')) {
				$(this).removeClass('checked');
				$(this).find("input").attr("checked", false);
			} else {
				$(this).addClass('checked');
				$(this).find("input").attr("checked", true);
			}

			if (typeof _config.event.click === "function") {
				_config.event.click();
			}
			//return false;
		});

		if (typeof _config.event.click === "string") {
			$checkbox.find("input").attr("data-chivox-event", "click:" + _config.event.click);
		}

		_$containerView.append($checkbox);
	});
	this.type = "checkbox";
	this.render = function() {
		_config.target.replaceWith(_$containerView);
	};

	this.getValue = function() {
		var vals = [];
		_$containerView.find("label.checked").each(function() {
			vals.push($(this).find("input").val());
		})
		return vals.join(",") || "";
	};

	this.setValue = function(data) {
		var vals = data.split(",");
		$.each(vals, function(index, val) {
			_$containerView.find("input[value=" + val + "]").prev(".checkbox-icon").addClass('checked');
		});
	};

	this.getId = function() {
		return _id;
	};

	this.addCheckbox = function(addData) {
		var len = _$containerView.find("label").length;
		var $addCheckbox = $('<label for="' + (_id + (len + 1)) + '"><span class="checkbox-icon"></span><input type="checkbox" id="' + (_id + (len + 1)) + '" value="' + addData.value + '">' + addData.name + '</label>')
		var $addInput = $addCheckbox.find("input");
		$addInput.click(function(event) {
			event.stopPropagation();
		});
		if (addData.disabled) {
			$addCheckbox.addClass("disabled");
			$addInput.attr("disabled", true);
		}
		if (addData.checked) {
			$addCheckbox.addClass("checked");
			$addInput.attr("checked", true);
		}
		$addCheckbox.click(function(event) {
			if ($(this).hasClass('disabled')) return;
			if ($(this).hasClass('checked')) {
				$(this).removeClass('checked');
			} else {
				$(this).addClass('checked');
			}
			if (typeof _config.event.click === "function") {
				_config.event.click();
			}
			//return false;
		});
		if (typeof _config.event.click === "string") {
			$addCheckbox.find("input").attr("data-chivox-event", "click:" + _config.event.click);
		}

		_$containerView.append($addCheckbox);
	};

	this.css = function(css) {
		_$containerView.css(css);
	};

	if (_config.autoRender) {
		this.render();
	}
}