solution.ui.textarea = function(config) {
	var that = this;
	var _id = config.target.attr('id') || config.id || _chivox.util.createUUID();
	var _config = {
		autoRender: true,
		width: 655,
		height: 100
	};
	var _isHide = true; //标识，防止多次调用.hide()事件时重复执行
	$.extend(true, _config, config);
	var _$contain = $('<div class="ui-textarea"><div class="textarea-show" name="' + _id + '"></div><textarea class="textarea" id="' + _id + '"></textarea></div>');
	var _$div = _$contain.find("div");
	var _$textarea = _$contain.find("textarea");
	_$contain.css({
		width:  _config.width,
		height: _config.height
	});
	_$textarea.css({
		height: _config.height
	});
	_$div.click(function() {
		that.show();
	});
	// _$textarea.focusout(function(event) {

	// });
	// _$textarea.focusin(function(event) {

	// });
	this.type = "textarea";
	this.render = function(id) {
		config.target.replaceWith(_$contain);

		if (_config.placeholder) {
			_$textarea.attr("placeholder", _config.placeholder);
		}
	};
	this.getValue = function() {
		return _$textarea.val();
	};

	this.setValue = function(text) {
		_$textarea.val(text);
		return that;
	};
	this.reset = function() {
		_$div.css('color', '#aaa');
		_$div.html("请在此输入内容");
	};
	this.getId = function() {
		return _id;
	};
	this.show = function() {
		var content = _$textarea.val();
		_$div.css('color', '#000');
		if (content == "请在此输入内容") content = "";
		_isHide = false; //阻止重复hide
		_$div.hide();
		_$textarea.val(content);
		_$textarea.show();
		_$textarea.focus();
		return that;
	};
	this.hide = function() {
		// if (_isHide) return;
		// _isHide = true;
		// var content = $.trim(_$textarea.val());
		// _$textarea.hide();
		// _$div.html(content).show();

	};
	this.setFocus = function() {
		_$textarea.focus();
	};

	this.remove = function() {
		_$contain.remove();

	};
	if (_config.autoRender) {
		this.render();
	}
};
// function(content) {
			// var count = 0,
			// 	count_prev = $(".topic-basic .wxt .answer .row").length,
			// 	answer_data_prev = [];
			// if (topic_data.topicOption) topic_data.topicOption = JSON.parse(topic_data.topicOption);
			// if (count_prev) {
			// 	topic_data.topicOption = [];
			// 	$.each($(".topic-basic .wxt .answer .ui-radio"), function(index, ui) {
			// 		var option = [];
			// 		answer_data_prev.push($(this).find(".radio-icon.checked").next('input').attr('value'));
			// 		$.each($(ui).find('input.txt'), function(i, input) {
			// 			option.push({
			// 				isTrue: answer_data_prev[index] == option_caption[i] ? true : false,
			// 				option: option_caption[i],
			// 				optionDesc: input.value
			// 			});
			// 		});
			// 		topic_data.topicOption.push({
			// 			'ordering': index + 1,
			// 			'options': option
			// 		});
			// 	});
			// 	topic_data.answer = answer_data_prev.join(',');
			// }
// function(content) {
// 			var count = 0,
// 				count_prev = $(".topic-basic .wxt .answer .row").length,
// 				answer_data_prev = [];
// 			if (topic_data.topicOption) topic_data.topicOption = JSON.parse(topic_data.topicOption);
// 			if (count_prev) {
// 				topic_data.topicOption = [];
// 				$.each($(".topic-basic .wxt .answer .ui-radio"), function(index, ui) {
// 					var option = [];
// 					answer_data_prev.push($(this).find(".radio-icon.checked").next('input').attr('value'));
// 					$.each($(ui).find('input.txt'), function(i, input) {
// 						option.push({
// 							isTrue: answer_data_prev[index] == option_caption[i] ? true : false,
// 							option: option_caption[i],
// 							optionDesc: input.value
// 						});
// 					});
// 					topic_data.topicOption.push({
// 						'ordering': index + 1,
// 						'options': option
// 					});
// 				});
// 				topic_data.answer = answer_data_prev.join(',');
// 			}

// 			var $target = $(".topic-basic .wxt .answer").html('');
// 			var init_option_num = topic_data.topicOption.length && topic_data.topicOption[0].options.length ? topic_data.topicOption[0].options.length : 4;
// 			for (var i = 0; i < count; i++) {
// 				option_list[i] = $('<div class="row"><div class="col caption">' + (i + 1) + '.</div><div class="col"></div></div>');
// 				answer_list[i] = createAnswer(option_list[i].find('.col:last'), topic_data, 'radio', init_option_num, i + 1);
// 				var $add_option_btn = $('<button class="btn add" data-option="' + init_option_num + '" >+</button>');
// 				option_list[i].find(".ui-radio label").each(function(index, label) {
// 					var option_value = '';
// 					if (topic_data.topicOption.length && topic_data.topicOption.length > i)
// 						option_value = topic_data.topicOption[i].options[index].optionDesc;
// 					var option_id = $(label).attr('for').replace('answer', '');
// 					var option_input = '<input class="txt" type="text" id="option' + option_id + '" value="' + option_value + '" />';
// 					option_list[i].find(".ui-radio").append($('<div></div>').append(label).append(option_input));
// 				});
// 				$add_option_btn.click((function(i) {
// 					return function() {
// 						var curr_option_num = $(this).data("option");
// 						if (curr_option_num < option_caption.length) {
// 							$(this).data("option", curr_option_num + 1);
// 							answer_list[i].addRadio({
// 								name: option_caption[curr_option_num],
// 								value: option_caption[curr_option_num]
// 							});
// 							var $label = option_list[i].find("label:last");
// 							var option_id = $label.attr('for').replace('answer', '');
// 							var option_input = '<input class="txt" type="text" id="option' + option_id + '" />';
// 							$('<div></div>').append($label).append(option_input).insertBefore($(this));
// 						}
// 					};
// 				})(i));
// 				option_list[i].find(".ui-radio").append($add_option_btn);
// 				$target.append(option_list[i]);
// 			}

// function(content) {
// 			var count = 0,
// 				count_prev = 0,
// 				answer_data_prev = [];
// 			if (!topic_data)
// 				var topic_data = {
// 					'topicType': 6,
// 					'answer': ''
// 				};
// 			var answer_data_prev = [];
// 			count_prev = $(".topic-basic .lxt .answer .ui-radio").length;
// 			$.each($(".topic-basic .lxt .answer .ui-radio"), function(index, input) {
// 				answer_data_prev.push($(this).find(".radio-icon.checked").next('input').attr('value'));
// 			});
// 			if (count_prev) topic_data.answer = answer_data_prev.join(',');
// 			var $target = $(".topic-basic .lxt");
// 			var answer_list = [];
// 			$target.find('.answer').html('');
// 			for (var i = 0; i < count; i++) {
// 				answer_list[i] = createAnswer($target.find('.answer'), topic_data, 'radio', $target.find(".option input").length, i + 1);
// 			}
// 			$target.find(".option .add-option").click(function() {
// 				var curr = $target.find(".option .add-option").length ? $(this).data('option') : option_caption.length;
// 				if ($target.find(".option input").length != curr) return false;
// 				var newdata = {
// 					name: option_caption[curr - 1],
// 					value: option_caption[curr - 1]
// 				};
// 				$.each(answer_list, function(index, answer) {
// 					answer.addRadio(newdata);
// 				});
// 			});
