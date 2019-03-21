solution.ui.image = function(config) {
	var that = this;
	var _id = config.target.attr('id') || config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		width: 664
	};
	$.extend(true, _config, config);
	var _$contain = $('<div class="ui-image"><input type="text" id="imageFileName'+_config.qid+'" class="imageFileName" value="" data-url="" readOnly placeholder="请上传图片，支持jpg\\jpeg\\png，大小建议：720px*480px。" /><input type="file" for="imageFileName'+_config.qid+'" id="image_upload'+_config.qid+'" data-ui="imageUploadify" data-upload-type="*.jpg;*.jpeg;*.png"/><button class="btn delete-image" data-chivox-event="click:deleteImage">删除</button></div>');
	var _$image = _$contain.find("input#imageFileName"+_config.qid);
	_$contain.css({
		width: _config.width
	});
	this.type = "image";
	this.render = function(id) {
		config.target.replaceWith(_$contain);
	};
	this.getValue = function() {
		var data = {};
		data.imageName = _$image.val();
		data.imageUrl = _$image.data("url");
		return data;
	};

	this.setValue = function(name, url) {
		_$contain.find("input.imageFileName").val(name).data("url", url);
		return that;
	};
	this.reset = function() {
		_$contain.find("input.imageFileName").val("").data("url", "");
	};
	this.getId = function() {
		return _id;
	};
	if (_config.autoRender) {
		this.render();
	}
};