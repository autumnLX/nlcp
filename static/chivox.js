;
(function(window, $) {
	/* keycode
	A~Z: 65~90
	0~9: 48~57
	0~9: 96~105
	F1~F12: 112~123
	*+ENTER-./: 106~111
	BackSpace: 8
	Tab: 9
	Clear: 12
	Enter: 13
	Shift Ctrl Alt: 16~18
	CapeLock: 20
	Esc: 27
	*/
	'use strict'
	var $$$ = {},
		_chivox = $$$,
		document = window.document,
		version = "0.0.1",
		debug = false,
		autoVerify = false;
	window._chivox = _chivox;
	var _cache = {}; //异步加载的HTML缓存
	var _transform = {}; //用于方法间缓存及传递参数
	var _event = (function() {
		var _eventCollect = {};
		return {
			fire: function(eventName, $this, event, transform, param) {
				if (_eventCollect[eventName]) {
					var ts = transform ? transform : _transform;
					_eventCollect[eventName]($this, event, ts, param);
				} else {
					console.log("方法：" + eventName + "不存在");
				}
			},
			set: function(eventName, fn) {
				_eventCollect[eventName] = fn;
			}
		}
	})();
	var topicTypeList = {"1": {
							topicName: "单选题",
							topicNameAb: "xzt"
						},
						"2": {
							topicName: "多选题",
							topicNameAb: "dxt"
						},
						"3": {
							topicName: "判断题",
							topicNameAb: "pdt"
						},
						"4": {
							topicName: "填空题",
							topicNameAb: "tkt"
						},
						"5": {
							topicName: "完形填空",
							topicNameAb: "wxt"
						},
						"6": {
							topicName: "选词填空",
							topicNameAb: "lxt"
						},
						"7": {
							topicName: "连词成句",
							topicNameAb: "lct"
						},
						"8": {
							topicName: "口语题",
							topicNameAb: "kyt"
						},
						"9": {
							topicName: "听力选择题",
							topicNameAb: "tlt"
						},
						"10": {
							topicName: "阅读理解",
							topicNameAb: "ydt"
						},
						"11": {
							topicName: "口头作文",
							topicNameAb: "ktzw"
						},
						"12": {
							topicName: "看图说话",
							topicNameAb: "ktsh"
						},
						"13": {
							topicName: "交际应用",
							topicNameAb: "jjyy"
						},
						"14": {
							topicName: "故事复述",
							topicNameAb: "gsfs"
						},
						"15": {
							topicName: "见词认读",
							topicNameAb: "jcrd"
						},
						"16": {
							topicName: "视听说（视频）",
							topicNameAb: "stssp"
						},
						"17": {
							topicName: "视听说（音频）",
							topicNameAb: "stsyp"
						},
						"18": {
							topicName: "口语问答",
							topicNameAb: "kybd"
						},
						"19": {
							topicName: "短对话理解",
							topicNameAb: "ddhlj"
						},
						"20": {
							topicName: "长对话理解",
							topicNameAb: "cdhlj"
						},
						"21": {
							topicName: "短文理解",
							topicNameAb: "dwlj"
						},
						"22": {
							topicName: "跟读与模仿",
							topicNameAb: "gdymf"
						},
						"23": {
							topicName: "朗读",
							topicNameAb: "ld"
						},
						"24": {
							topicName: "单词朗读",
							topicNameAb: "dccmld"
						},
						"25": {
							topicName: "短语/句子听读",
							topicNameAb: "dyjztd"
						},
						"26": {
							topicName: "篇章朗读",
							topicNameAb: "pzld"
						},
						"27": {
							topicName: "听句子，选择正确的答语",
							topicNameAb: "tydt"
						},
						"28": {
							topicName: "看图回答问题",
							topicNameAb: "kywd"
						},
						"29": {
							topicName: "听音写词",
							topicNameAb: "tyxc"
						},
						"30": {
							topicName: "阅读理解（读句子选图）",
							topicNameAb: "ydlj_djzxt"
						},
						"31": {
							topicName: "阅读理解（读图选句子）",
							topicNameAb: "ydlj_dtxjz"
						},
						"32": {
							topicName: "读写（小学A组）",
							topicNameAb: "dx_xxA"
						},
						"33": {
							topicName: "读写（小学BC组）",
							topicNameAb: "dx_xxBC"
						},
						"34": {
							topicName: "读写",
							topicNameAb: "dx_zx"
						},
						"35": {
							topicName: "前写作思维（小学组）",
							topicNameAb: "qxzsw_xx"
						},
						"36": {
							topicName: "配音",
							topicNameAb: "py"
						},
						"37": {
							topicName: "阅读理解（中学组）",
							topicNameAb: "ydlj_zx"
						},
						"38": {
							topicName: "前写作思维（中学组）",
							topicNameAb: "qxzsw_zx"
						},
						"39": {
							topicName: "听对话，选择正确的答案",
							topicNameAb: "tdhdt"
						},
						"40": {
							topicName: "模仿朗读",
							topicNameAb: "mfld"
						},
						"41": {
							topicName: "口头作文",
							topicNameAb: "ktzw_new"
						},
						"42": {
							topicName: "看图说单词",
							topicNameAb: "ktsdc"
						},
						"43": {
							topicName: "读单词",
							topicNameAb: "ddc"
						},
						"44": {
							topicName: "读句子",
							topicNameAb: "djz"
						},
						"45": {
							topicName: "对话",
							topicNameAb: "dh"
						},
						"46": {
							topicName: "朗读儿歌",
							topicNameAb: "ldeg"
						},
						"47": {
							topicName: "听后选择",
							topicNameAb: "thxz"
						},
						"48": {
							topicName: "听后回答",
							topicNameAb: "thhd"
						},
						"49": {
							topicName: "听后继续并转述信息",
							topicNameAb: "thjl"
						},
						"50": {
							topicName: "短文朗读",
							topicNameAb: "dwld"
						}
					};
	var _util = {
		getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = window.location.search.substr(1).match(reg); //匹配目标参数
			if (r != null)
				return decodeURI(decodeURI(r[2]));
			return null; //返回参数值
		},
		createUUID: function() {
			var guid = "";
			for (var i = 1; i <= 32; i++) {
				var n = Math.floor(Math.random() * 16.0).toString(16);
				guid += n;
				if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
					guid += "-";
			}
			return guid;
		},
		getLastInArray: function(array) {
			var len = array.length;
			return array[len - 1];
		},
		getLastString: function(str) {
			var len = str.length;
			return str.substring(len - 1);
		},
		isNumberKeyCode: function(keyCode) {
			if ((47 < keyCode && keyCode < 58) || (95 < keyCode && keyCode < 106) || keyCode == 8 || keyCode == 116 || keyCode == 9 || (keyCode > 36 && keyCode < 41))
				return true;
			else
				return false;
		},
		transformTopicType2string: function(typeID) {
			return topicTypeList[typeID].topicName;
		},
		transformTopicType2abb: function(typeID) {
			return topicTypeList[typeID].topicNameAb;
		},
		getTopicTypeList: function() {//顺序
			var dataList = [{
				name: "短对话理解",
				value: "19"
			}, {
				name: "长对话理解",
				value: "20"
			}, {
				name: "短文理解",
				value: "21"
			}, {
				name: "跟读与模仿",
				value: "22"
			}, {
				name: "听句子，选择正确的答语",
				value: "27"
			}, {
				name: "听对话，选择正确的答案",
				value: "39"
			}, {
				name: "单词朗读",
				value: "24"
			}, {
				name: "短语/句子听读",
				value: "25"
			}, {
				name: "朗读",
				value: "23"
			}, {
				name: "篇章朗读",
				value: "26"
			}, {
				name: "看图回答问题",
				value: "28"
			}, {
				name: "口语题",
				value: "8"
			}, {
				name: "听力题",
				value: "9"
			}, {
				name: "单选题",
				value: "1"
			}, {
				name: "多选题",
				value: "2"
			}, {
				name: "判断题",
				value: "3"
			}, {
				name: "填空题",
				value: "4"
			}, {
				name: "连词成句",
				value: "7"
			}, {
				name: "选词填空",
				value: "6"
			}, {
				name: "完形填空",
				value: "5"
			}, {
				name: "阅读理解",
				value: "10"
			}, {
				name: "口头作文",
				value: "11"
			}, {
				name: "看图说话",
				value: "12"
			}, {
				name: "交际应用",
				value: "13"
			}, {
				name: "故事复述",
				value: "14"
			}, {
				name: "见词认读",
				value: "15"
			}, {
				name: "听音写词",
				value: "29"
			}, {
				name: "视听说（视频）",
				value: "16"
			}, {
				name: "视听说（音频）",
				value: "17"
			}, {
				name: "口语问答",
				value: "18"
			}, {
				name: "配音",
				value: "36"
			}, {
				name: "阅读理解（读句子选图）",
				value: "30"
			}, {
				name: "阅读理解（读图选句子）",
				value: "31"
			}, {
				name: "阅读理解（中学组）",
				value: "37"
			}, {
				name: "读写（小学A组）",
				value: "32"
			}, {
				name: "读写（小学BC组）",
				value: "33"
			}, {
				name: "读写",
				value: "34"
			}, {
				name: "前写作思维（小学组）",
				value: "35"
			}, {
				name: "前写作思维（中学组）",
				value: "38"
			}];
			return dataList;
		},
		transformTopicGradeList:function(gradeID){
			var gradeName = "全部";
			// switch (parseInt(gradeID)) {
			// 	case 99:
			// 		gradeName = "全部";
			// 		break;
			// 	case 5:
			// 		gradeName = "学前";
			// 		break;
			// 	case 11:
			// 		gradeName = "一年级";
			// 		break;
			// 	case 12:
			// 		gradeName = "二年级";
			// 		break;
			// 	case 13:
			// 		gradeName = "三年级";
			// 		break;
			// 	case 14:
			// 		gradeName = "四年级";
			// 		break;
			// 	case 15:
			// 		gradeName = "五年级";
			// 		break;
			// 	case 16:
			// 		gradeName = "六年级";
			// 		break;
			// 	case 17:
			// 		gradeName = "七年级";
			// 		break;
			// 	case 18:
			// 		gradeName = "八年级";
			// 		break;
			// 	case 19:
			// 		gradeName = "九年级";
			// 		break;
			// 	case 20:
			// 		gradeName = "高一";
			// 		break;
			// 	case 21:
			// 		gradeName = "高二";
			// 		break;
			// 	case 22:
			// 		gradeName = "高三";
			// 		break;
			// 	default:
			// 		break;
			// }

			$.each(gradeList, function(i,g) {
				if (g.value == gradeID) {
					gradeName = g.name;
				}
			});

			return gradeName;
		},
		transformTopicString2id: function(typeName) {
		},
		getTopicGradeList: function() {
			var dataList = [{
				name: "全部",
				value: "99",
				checked: true
			}, {
				name: "学前",
				value: "5"
			}, {
				name: "一年级",
				value: "11"
			}, {
				name: "二年级",
				value: "12"
			}, {
				name: "三年级",
				value: "13"
			}, {
				name: "四年级",
				value: "14"
			}, {
				name: "五年级",
				value: "15"
			}, {
				name: "六年级",
				value: "16"
			}, {
				name: "七年级",
				value: "17"
			}, {
				name: "八年级",
				value: "18"
			}, {
				name: "九年级",
				value: "19"
			}, {
				name: "高一",
				value: "20"
			}, {
				name: "高二",
				value: "21"
			}, {
				name: "高三",
				value: "22"
			}];
			return dataList;
		},
		getDifficultyTypeList: function() {
			var dataList = [{
				name: "容易",
				value: "1"
			}, {
				name: "较易",
				value: "2"
			}, {
				name: "中等",
				value: "3"
			}, {
				name: "较难",
				value: "4"
			}, {
				name: "困难",
				value: "5"
			}];
			return dataList;
		},
		checkFileType: function (fileName, types) {
			var reg = new RegExp("." + types.join("|") + "$");
			return reg.test(fileName);
		},
		checkFileSize: function (fileSize, size) {
			return fileSize / 1024 / 1024 <= size;
		},
		uploadFile: function (file, callback, url, uploadName) {
			var _url = url || "/topics/ue_upload?action=upload";
			var _uploadName = uploadName || "upfile";

			var formData = new FormData();

			formData.append(_uploadName, file);

			var xhr = new XMLHttpRequest();

			xhr.open("POST", _url);

			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && typeof callback === "function") {
					callback(JSON.parse(xhr.responseText));
				}
			}

			xhr.send(formData);
		}
	};
	var _filter = (function() {
		var _filterCollect = {};
		return {
			set: function(filterName, fn) {
				_filterCollect[filterName] = fn;
			},
			fire: function(filterName, $this, event) {
				if (!_filterCollect[filterName]) {
					console.log(filterName + "过滤方法未设置");
					return true;
				}
				return _filterCollect[filterName]($this, event);
			}
		};
	})();
	var _currentPage = 1;
	var _paginationInfo = {};
	var _getValueByDOM = function($scope, DOM) {
		var value = "";
		var nodeName = DOM.nodeName;
		if (nodeName == "SELECT" || nodeName == "TEXTAREA") {
			value = DOM.value;
		} else if (nodeName == "INPUT") {
			var type = DOM.type;
			if (type == "text") {
				value = DOM.value;
			} else if (type == "radio") {
				var name = DOM.name;
				value = $scope.find("[name=" + name + "]:checked").val();
			} else if (type == "checkbox") {
				var name = DOM.name;
				$scope.find("[name=" + name + "]:checked").each(function() {
					value += "," + $(this).val();
				});
				value = value.substring(1);
			} else {
				value = DOM.value;
			}
		} else if (nodeName == "SPAN") {
			value = DOM.innerHTML;
		}
		return value;
	};
	$.extend(_chivox, {
		event: _event, //chivox事件管理器
		util: _util,
		filter: _filter,
		loadJS: function(sid, jsurl, callback) {
			var SID = sid ? sid : _chivox.createSID();
			var nodeHead = document.getElementsByTagName('head')[0];
			var nodeScript = null;
			if (document.getElementById(SID + "_js") == null) {
				nodeScript = document.createElement('script');
				nodeScript.setAttribute('type', 'text/javascript');
				nodeScript.setAttribute('src', jsurl);
				nodeScript.setAttribute('id', SID + "_js");
				if (callback != null) {
					nodeScript.onload = nodeScript.onreadystatechange = function() {
						if (nodeScript.ready) {
							return false;
						}
						if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
							nodeScript.ready = true;
							callback();
						}
					};
				}
				nodeHead.appendChild(nodeScript);
			} else {
				if (callback != null) {
					callback();
				}
			}
		},
		loadHTML: function(url, callback, async) {
			var id = url.replace(/\/|\./g, "");
			var asy = true;
			if (async !== undefined) {
				asy = async;
			}
			if (_cache[id]) {
				callback(_cache[id]);
			} else {
				$.ajax({
					url: url,
					async: async,
					dataType: 'html'
				}).done(function(context) {
					_cache[id] = context;
					callback(context);
				});
			}
		},
		verify: function($scope) {
			var verifyMsg = [];
			var _verify = {
				notEmpty: function(val) {
					if (!val) {
						verifyMsg.push("不能为空");
						return 1;
					}
				},
				numberOnly: function(val) {
					if (!val) {
						return;
					}
					var reg = /^[0-9]+$/;
					if (!reg.test(val)) {
						verifyMsg.push("只能输入数字");
						return 1;
					}
				},
				max: function(val, max) {
					if (!val) {
						return;
					}
					if (parseFloat(val) > parseFloat(max)) {
						verifyMsg.push("不能大于" + max);
						return 1;
					}
				},
				min: function(val, min) {
					if (!val) {
						return;
					}
					if (parseFloat(val) < parseFloat(min)) {
						verifyMsg.push("不能小于" + min);
						return 1;
					}
				},
				eq: function(val, eq) {
					if (!val) {
						return;
					}
					if (parseFloat(val) != parseFloat(eq)) {
						verifyMsg.push("必须等于" + eq);
						return 1;
					}
				},
				reg: function(val, reg) {
					if (!val) {
						return 1;
					}
					var regExp = new RegExp(reg);
					if (!regExp.test(val)) {
						verifyMsg.push("要符合正则表达式：" + reg);
						return 1;
					}
				},
				mail: function(val) {
					if (!val) {
						return;
					}
					var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
					if (!reg.test(val)) {
						verifyMsg.push("不符合邮箱格式");
						return 1;
					}
				},
				phone: function(val) {}
			};
			var checkCount = 0;
			if (!$scope) {
				$scope = $(document);
			}
			$scope.find(".chivox-error").removeClass("chivox-error");
			$scope.find("[data-chivox-vr]").each(function() {
				var $this = $(this);
				var type = $this.attr("type") || "text";
				var val = _getValueByDOM($scope, this);
				var vr = $this.data("chivox-vr");
				var vrArray = vr.split("|");
				var isPass = 0;
				verifyMsg = [];
				$.each(vrArray, function(index, vr) {
					var kn = vr.split(":");
					var ruleName = kn[0];
					isPass += _verify[ruleName](val, kn[1]) || 0;
					checkCount += _verify[ruleName](val, kn[1]) || 0;
				});
				verifyMsg = verifyMsg.join(",");
				if (isPass) {
					$this.addClass('chivox-error');
					$this.data('chivox-error-msg', verifyMsg);
				}
			});
			if (checkCount > 0) {
				return false;
			} else {
				return true;
			}
		},
		collect: function($scope) { //收集表单内容
			var scope = $scope ? $scope : $(document);
			var collectJSON = {};
			scope.find("[data-chivox-collect]").each(function(index, DOM) {
				var key = $(this).data("chivox-collect");
				var value = _getValueByDOM($scope, DOM);
				collectJSON[key] = value;
			});
			return collectJSON;
		},
		group: function($DOM, className) { //移除同组className, 自身加上className
			var cn = className ? className : "active";
			if ($DOM.hasClass(cn)) {
				return false;
			} else {
				var group = $DOM.data("chivox-group");
				$("[data-chivox-group=" + group + "]").removeClass(cn);
				$DOM.addClass(cn);
				return true;
			}
		},
		cycleOne: function($DOM, eventType, callback) { //事件执行后再绑定，防止耗时操作的频繁触发事件
			var fn = function() {
				callback($(this));
				$(this).one(eventType, fn);
			}
			$DOM.one(eventType, fn);
		},
		initPagination: function(paginationInfo) {
			_paginationInfo.total = paginationInfo.total || 1;
			_paginationInfo.callback = typeof paginationInfo.callback == "function" ? paginationInfo.callback : function() {
				alert("分页方法没有初始化");
			};
		}
	});

	//事件
	var _f = function($this, reg, chivox) {
		var chivoxEvent = $this.data("chivox-event");
		var e = chivoxEvent.match(reg);
		var eventName = e[1];
		var regParam = /&([&\w\\u4e00-\\u9fa5]+)$/;
		var p = e[0].match(regParam);
		var param = p ? p[1].split("&") : [];
		chivox.event.fire(eventName, $this, event, _transform, param);
	};
	$(document).on("click", "[data-chivox-event*=click]", function(event) {
		var reg = /click:(\w+)[\w&]*\|?/;
		//_f($(this), reg, chivox);
		var chivoxEvent = $(this).data("chivox-event");
		var e = chivoxEvent.match(reg);
		var eventName = e[1];
		var regParam = /&(.+)$/;
		var p = e.input.match(regParam);
		var param = p ? p[1].split("&") : [];
		_chivox.event.fire(eventName, $(this), event, _transform, param);
		if (event.isDefaultPrevented()) {
			event.preventDefault();
		}
		event.stopPropagation();
	}).on("blur", "[data-chivox-event*=blur]", function(event) {
		var reg = /blur:(\w+)[\w&]*\|?/;
		//_f($(this), reg);
		var chivoxEvent = $(this).data("chivox-event");
		var e = chivoxEvent.match(reg);
		var eventName = e[1];
		var regParam = /&([&\w]+)$/;
		var p = e[0].match(regParam);
		var param = p ? p[1].split("&") : [];
		_chivox.event.fire(eventName, $(this), event, _transform, param);
		event.stopPropagation();
	}).on("change", "[data-chivox-event*=change]", function(event) {
		var reg = /change:(\w+)[\w&]*\|?/;
		//_f($(this), reg);
		var chivoxEvent = $(this).data("chivox-event");
		var e = chivoxEvent.match(reg);
		var eventName = e[1];
		var regParam = /&([&\w]+)$/;
		var p = e[0].match(regParam);
		var param = p ? p[1].split("&") : [];
		_chivox.event.fire(eventName, $(this), event, _transform, param);
		event.stopPropagation();
	});

	//过滤器
	$(document).on('keydown', '[data-chivox-filter*=keydown]', function(event) {
		var reg = /keydown:(\w+)\|?/;
		var filter = $(this).data("chivox-filter");
		var e = filter.match(reg);
		var filterName = e[1];
		if (_filter.fire(filterName, $(this), event)) {
			event.stopPropagation();
		} else {
			return false;
		}
		//event.preventDefault();
	});

	//分页
	$(document).on("click", "[data-chivox-pagination]", function(event) {
		_currentPage = $(this).data("chivox-pageNo");
		_paginationInfo.callback(_currentPage);
	}).on("click", "[data-chivox-prev]", function(event) {
		if (_currentPage - 1 < 1) {
			_currentPage = 1;
			return;
		} else {
			_currentPage = _currentPage - 1;
			_paginationInfo.callback(_currentPage);
		}
	}).on("click", "[data-chivox-next]", function(event) {
		if (_currentPage + 1 > _paginationInfo.total) {
			return;
		} else {
			_currentPage = currentPage + 1;
			_paginationInfo.callback(_currentPage);
		}
	});

})(window, $);