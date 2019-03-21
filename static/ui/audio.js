solution.ui.audio = function(config) {
	var that = this;
	var _id = config.target.attr('id') || config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		width: 664
	};
	$.extend(true, _config, config);
	var _$contain = $('<div class="ui-audio"><input type="text" id="audioFileName'+_config.qid+'" class="audioFileName" value="" data-url="" readOnly placeholder="支持mp3格式上传" /><input type="file" for="audioFileName'+_config.qid+'" id="audio_upload'+_config.qid+'" data-ui="uploadify" data-upload-type="*.mp3"/><button class="btn delete-audio" data-chivox-event="click:deleteAudio">删除</button></div>');
	var _$audio = _$contain.find("input#audioFileName"+_config.qid);
	_$contain.css({
		width: _config.width
	});
	this.type = "audio";
	this.render = function(id) {
		config.target.replaceWith(_$contain);
		if (_config.placeholder) {
			_$contain.find("#audioFileName"+_config.qid).attr("placeholder", _config.placeholder);
		}
	};
	this.getValue = function() {
		var data = {};
		data.audioName = _$audio.val();
		data.audioUrl = _$audio.data("url");
		return data;
	};

	this.setValue = function(name, url) {
		_$contain.find("input.audioFileName").val(name).data("url", url);
		return that;
	};
	this.reset = function() {
		_$contain.find("input.audioFileName").val("").data("url", "");
	};
	this.getId = function() {
		return _id;
	};
	if (_config.autoRender) {
		this.render();
	}
};