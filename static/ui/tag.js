solution.ui.tag = function(config) {
	var that = this;
	var _id = config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true
	};
	$.extend(true, _config, config);
	var _tagViewList = []

	var _$tagContainerView = $('<div class="ui-tag"><div name="tags" style="overflow-hidden"></div><input placeholder="逗号分隔，回车确认"/></div>');
	var _$input = _$tagContainerView.find("input");
	_$input.keydown(function(event) {
		if (event.keyCode === 13) {
			if (!$(this).val()) return false;
			var v = $(this).val().replace("，", ",");
			var tags = v.split(",");
			if (tags[tags.length - 1] === "") {
				tags.pop();
			}
			$.each(tags, function(index, tagName) {
				_createTagView(tagName);
			});
			$(this).val("");
		}
	});
	_$input.blur(function(event) {
		if (!$(this).val()) return false;
		var v = $(this).val().replace("，", ",");
		var tags = v.split(",");
		if (tags[tags.length - 1] === "") {
			tags.pop();
		}
		$.each(tags, function(index, tagName) {
			_createTagView(tagName);
		});
		$(this).val("");
		return false;
	});

	var _createTagView = function(tagName) {
		var _$tagView = $('<div class="tag"><span>' + tagName + '</span><div class="cancel"></div></div>');
		_$tagContainerView.find("[name=tags]").append(_$tagView);
		_$tagView.find(".cancel").click(function(event) {
			var index = $.inArray(_$tagView, _tagViewList);
			_tagViewList.splice(index, 1);
			_$tagView.remove();
		});
		_tagViewList.push(_$tagView);
		return _$tagView
	}

	this.render = function() {
		_config.target.replaceWith(_$tagContainerView);
	};

	this.tagViewList = _tagViewList;

	this.getValue = function() {
		var vals = [];
		$.each(_tagViewList, function(index, $tagView) {
			var val = $tagView.find("span").html();
			vals.push(val);
		});
		return vals.join(",");
	};

	this.setValue = function(data) {
		// var vals = data.split(",");
		// $.each(vals, function(index, val) {
		// 	_createTagView(val).insertBefore(_$input);
		// });
		var e = jQuery.Event("keydown");//模拟一个键盘事件 
			e.keyCode = 13;//keyCode=13是回车 
		_$input.val(data);
		_$input.trigger(e);
	};

	this.getId = function() {
		return _id;
	}
	this.reset = function() {
		_$tagContainerView.find('div[name=tags]').empty();
	}

	if (_config.autoRender) {
		this.render();
	}
}