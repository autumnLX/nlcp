solution.ui.radio = function(config) {
	function createRadio () {
		_$containerView.empty();
		$.each(_config.dataList, function(index, data) {
			var $radio = $('<label for="' + _id + '_' + (index + 1) + '">' +
						   '	<span class="radio-icon" data-value="' + data.value + '"></span>' +
						   '	<input type="radio" name="' + _config.name + '" id="' + _id + '_' + (index + 1) + '" value="' + data.value + '" />' + data.name +
						   '</label>');
			var $input = $radio.children("input");

			$input.click(function(event) {
				event.stopPropagation();
			});

			if (data.disabled) {
				$radio.addClass("disabled");
				$input.attr("disabled", true);
			}

			if (data.checked) {
				_defCheckIndex = index;
				$radio.find(".radio-icon").addClass("checked");
				$radio.addClass("checked");
				$input.attr("checked", true);
			}

			$radio.click(function (event) {
				if ($(this).hasClass("disabled")) {

				} else {
					_$containerView.find(".radio-icon.checked").removeClass('checked');
					_$containerView.find("label").removeClass("checked");
					$(this).find(".radio-icon").addClass('checked');
					$(this).addClass('checked');
					if (typeof _config.event.click === "function") {
						_config.event.click(event, this);
					}
				}
			});

			if (typeof _config.event.click === "string") {
				$radio.attr("data-chivox-event", "click:" + _config.event.click);
			}

			_$containerView.append($radio);
		});
	}
	var that = this;
	var _id = config.target.attr('id') || config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		name: _chivox.util.createUUID(),
		beforeChecked: null,
		event: {}
	};
	var _defCheckIndex = -1;
	var _$containerView = $('<div class="ui-radio" id="' + _id + '"></div>');
	
	$.extend(true, _config, config);

	this.type = 'radio';

	this.render = function() {
		createRadio();
		_config.target.replaceWith(_$containerView);
	};

	this.rerender = function (config) {
		$.extend(true, _config, config);
		createRadio();
	};

	this.getValue = function() {
		var val = _$containerView.find(".radio-icon.checked").data("value");
		return val || (val == 0 ? 0 : "");
	};

	this.setValue = function (data, silence) {
		if (data) {
			if (silence) {
				_$containerView.find(".radio-icon.checked").removeClass("checked");
				_$containerView.find("span[data-value=" + data + "]").addClass("checked");
				_$containerView.find("span[data-value=" + data + "]").parent("label").addClass("checked");
			} else {
				_$containerView.find("span[data-value=" + data + "]").parent("label").click();
			}
		}
	};

	this.getCheckedValue = function() {
		return _$containerView.find(".radio-icon.checked").data("value");
	};

	this.getCheckedTxt = function() {
		return _$containerView.find("input:checked").parent("label").text();
	};

	this.reset = function() {
		_$containerView.find(".radio-icon").removeClass('checked');
		if (_defCheckIndex > -1) {
			var r = _$containerView.find(".radio-icon:eq(" + _defCheckIndex + ")");
			r.addClass('checked');
			r.parent('label').addClass('checked');
			r.next("input").click();
		}
	};

	this.getId = function() {
		return _id;
	};

	this.addRadio = function(addData) {
		var len = _$containerView.find("label").length;
		var $addRadio = $('<label for="' + _id + '_' + (len + 1) + '"><span class="radio-icon"></span><input type="radio" name="' + _config.name + '" id="' + _id + '_' + (len + 1) + '" value="' + addData.value + '" />' + addData.name + '</label>');
		var $addInput = $addRadio.find("input");
		$addRadio.find(".radio-icon").data("value", addData.value);
		$addInput.click(function(event) {
			event.stopPropagation();
		});
		if (addData.disabled) {
			$addRadio.find(".radio-icon").addClass("disabled");
			$addRadio.find(".radio-icon").parent('label').addClass("disabled");
			$addInput.attr("disabled", true);
		}
		if (addData.checked) {
			_defCheckIndex = len + 1;
			$addRadio.find(".radio-icon").addClass("checked");
			$addRadio.find(".radio-icon").parent('label').addClass("checked");
			$addInput.attr("checked", true);
		}
		$addRadio.click(function(event) {
			_$containerView.find(".radio-icon").removeClass('checked');
			$(this).find(".radio-icon").addClass('checked');
			$(this).find(".radio-icon").parent('label').addClass('checked');
			if (typeof _config.event.click === "function") {
				_config.event.click();
			}
		});
		if (typeof _config.event.click === "string") {
			$addRadio.attr("data-chivox-event", "click:" + _config.event.click);
		}
		_$containerView.append($addRadio);
	};

	if (_config.autoRender) {
		this.render();
	}
};