solution = {};
solution.server = (function() {
	var serverCollect = {};
	var _post = function(url, data, callback, async) {
		$("#sdzj-info button[name=ok]").show();
		$.ajax(url, {
			url: url,
			type: "post",
			async: async || true,
			data: data,
			dataType: "json",
			error: function() {},
			success: function(data) {
				if (data.result === 10006) {
					if (Config.zy_path) {
						window.location.href = Config.zy_path;
					} else {
						window.location.href = "/login";
					}
				}

				serverCollect[url] = data;
				callback(data);
			}
		});
	};
	var _get = function(url, data, callback, async) {
		$("#sdzj-info button[name=ok]").show();
		data._t = +new Date();
		$.ajax(url, {
			url: url,
			type: "get",
			async: async || true,
			data: data,
			dataType: "json",
			error: function() {},
			success: function(data) {
				if (data.result === 10006) {
					if (Config.zy_path) {
						window.location.href = Config.zy_path;
					} else {
						window.location.href = "/login";
					}
				}

				serverCollect[url] = data;
				callback(data);
			}
		});
	};

	var _constant = (function() {
		var _createTree = function(zNodes, $target, id, config) {
			return solution.ui.create("comboTree", {
				id: id,
				target: $target,
				emptyNode: [{
					id: 1,
					name: "请先选择课程",
					pId: 0,
					value: "",
					nocheck: true
				}],
				zNodes: [{
					id: 1,
					name: "请先选择课程",
					pId: 0,
					value: "",
					nocheck: true
				}],
				setting: {
					check: {
						chkStyle: "checkbox",
						enable: true
					}
				},
				width: config.width
			});
		};
		var _completeTree = 0;
		var $kc, $kcdy, $zsd;
		return {
			//callback1初始化课程后回调，callback2初始化教材和知识点后回调
			getCourseList: function($target, $target1, $target2, config, callback1, callback2) {
				_completeTree = 0;
				var that = this;
				var config = config ? config : {};
				_get(COURSE_GET_LIST, {}, function(data) {
					var dataList = [];
					// dataList.push({
					// 	value: "",
					// 	name: "全部"
					// });
					var len = data.info.list.length;
					for (var i = 0; i < len; i++) {
						var course = data.info.list[i];
						dataList.push({
							name: course.courseName,
							value: course.courseID
						});
					}

					$kc = solution.ui.create("select", {
						id: "course",
						target: $("#kc"),
						dataList: dataList,
						width: config.width,
						event: {
							change: function($input) {
								var courseID = $input.data("value");
								if ($target1) {
									that.getKnowledgeTree(courseID, callback2);
								}
								if ($target2) {
									that.getTeachingTree(courseID, callback2);
								}

							}
						}
					});

					if ($target1) {
						$kcdy = _createTree("", $("#kcdy"), "teaching", config);
					}

					if ($target2) {
						$zsd = _createTree("", $("#zsd"), "knowledge", config);
					}
					
					if (typeof callback1 === "function") return callback1($kc, $kcdy, $zsd);
				});
			},
			getTeachingTree: function(courseID, callback) {
				_get(TEACHING_GET_TREE, {
					courseID: courseID
				}, function(data) {
					var pId = {};
					var treeData = data.info.tree;
					for (var i=0; i<treeData.length; i++) {
						pId[treeData[i].pId + ""] = true;
					}
					for (var i=0; i<treeData.length; i++) {
						if (pId[treeData[i].id + ""]) {
							treeData[i].nocheck = true;
						}
					}
					solution.ui.getUiById("teaching").setTreeData(data.info.tree);
					_completeTree++;
					if (_completeTree == 2 && typeof callback === "function") {
						callback(false, $kc, $kcdy, $zsd);
					}
				});
			},
			getKnowledgeTree: function(courseID, callback) {
				_get(KNOWLEDGE_GET_TREE, {
					courseID: courseID
				}, function(data) {
					var pId = {};
					var treeData = data.info.tree;
					for (var i=0; i<treeData.length; i++) {
						pId[treeData[i].pId + ""] = true;
					}
					for (var i=0; i<treeData.length; i++) {
						if (pId[treeData[i].id + ""]) {
							treeData[i].nocheck = true;
						}
					}
					solution.ui.getUiById("knowledge").setTreeData(data.info.tree);
					_completeTree++;
					if (_completeTree == 2 && typeof callback === "function") {
						callback(false, $kc, $kcdy, $zsd);
					}
				});
			}
		}
	})();

	return {
		get: _get,
		post: _post,
		constant: _constant
	}
})();
