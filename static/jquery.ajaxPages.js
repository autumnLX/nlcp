(function(a) {
	var ajaxPage = function(config) {
		var defaults = {
			page: 1, //当前页
			rows: 10, //每页多少个
			run: false, //是否开始加载
			beforeSend: false, //请求前调用
			complete: false, //请求后调用
			pageId: null, //分页容器
			noData: "没有符合条件数据！", //没有数据时提示
			recordCount: null, //总条数
			isLoad: false, //是否加载过
			mark: true, //请求开关, true可请求, false不可
			ajax: "",
			event: {}
		};
		var config = a.extend(true, {}, defaults, config || {}); //加{}为防止内存泄漏
		var self = this;
		if (!self.length) {
			return self;
		}
		var b = {};
		var serverTopicCollect = {};
		/**
		 * 请求数据
		 */
		b.ajaxEvent = function() {
			if (!config.isLoad) {
				return self;
			}
			config.mark = false;
			if (typeof config.beforeSend === "function") config.beforeSend();
			if (typeof config.ajax === 'function') config.ajax(config.page, config.rows, b.show);
		};
		b.run = function() {
			if (config.isLoad) {
				return self;
			}
			config.isLoad = true;
			b.ajaxEvent();
			return self;
		};
		/**
		 * 设置数据到内容区域
		 */
		b.show = function(cont) {
			if (typeof config.complete === "function") config.complete();
			// if ($(window).scrollTop() > 100) {
			// 	$('body,html').animate({
			// 		scrollTop: self.offset().top - 70
			// 	}, 250);
			// }
			$(window).scrollTop(0);
			if (cont.content.length) {
				config.recordCount = cont.recordCount;
				// config.page = cont.page;
				self.html(cont.content);
				if (!cont.recordCount) return;
			} else {
				config.recordCount = 0;
				config.page = 0;
				self.html(config.noData);
			}
			if (config.pageId) {
				b.toPage();
				b.toPageBind();
			}
			config.mark = true;
		};
		/**
		 * 点击页码时触发事件，取回数据
		 */
		b.get = function(i) {
			if (!config.isLoad || !config.mark || config.pageCount < 1) {
				return b;
			}
			switch (i) {
				case "previous":
					config.page--;
					break;
				case "next":
					config.page++;
					break;
				case "first":
					config.page = 1;
					break;
				case "last":
					config.page = config.pageCount;
					break;
				default:
					if (isNaN(i)) {
						break;
					}
					i = parseInt(i);
					if (i > config.pageCount) {
						i = config.pageCount;
					}
					if (i == config.page) {
						return false
					};
					config.page = i;
					break;
			}
			b.ajaxEvent();
			return self;
		};
		b.toPageBind = function() {
			var pId = config.pageId;
			pId.find("a.jp-previous").click(function() {
				if ($(this).hasClass('jp-disabled')) return;
				b.get("previous");
			});
			pId.find("a.jp-next").click(function() {
				if ($(this).hasClass('jp-disabled')) return;
				b.get("next");
			});
			pId.find("a.jp-first").click(function() {
				b.get("first");
			});
			pId.find("a.jp-last").click(function() {
				b.get("last");
			});
			pId.find("a.jp-href").click(function() {
				b.get($(this).html() - 0);
			});
			pId.find('input.jp-text').keydown(function(e) {
				if (e.keyCode === 13) {
					var goToPage = $.trim($(this).val()) - 0;
					if (isNaN(goToPage)) {
						return alert("输入的页码格式不正确");
					} else if (goToPage === 0) {
						return alert("请输入要跳转的页码数");
					} else if (goToPage > config.pageCount ) {
						return alert("输入的页码超过最大页数");
					} else {
						b.get(goToPage);
					}
				};
			});
			pId.find('button.jp-button').click(function() {
				var goToPage = $.trim(pId.find('input.jp-text').val()) - 0;

				if (isNaN(goToPage)) {
					return alert("输入的页码格式不正确");
				} else if (goToPage === 0) {
					return alert("请输入要跳转的页码数");
				} else if (goToPage > config.pageCount ) {
					return alert("输入的页码超过最大页数");
				} else {
					b.get(goToPage);
				}
			});
		};

		/**
		 * 生成页码
		 */
		b.toPage = function() {
			var str = "";
			if (config.recordCount > config.rows) {
				var page = config.page,
					rows = config.rows,
					pageCount = config.recordCount === 0 || config.recordCount % rows !== 0 ? Math.floor(config.recordCount / rows) + 1 : Math.floor(config.recordCount / rows),
					i = 1;

				config.pageCount = pageCount;

				if (page > 1) {
					str += '<a href="javascript:;" class="jp-previous"><上一页</a>';
				} else {
					str += '<a href="javascript:;" class="jp-previous jp-disabled"><上一页</span>';
				};
				if (pageCount < 7) {
					for (i; i <= pageCount; i++) {
						if (page === i) {
							str += '<a href="javascript:;" class="jp-current">' + i + '</a>';
						} else {
							str += '<a href="javascript:;" class="jp-href">' + i + "</a>";
						}
					}
				} else {
					var start, end;
					if (page === 1) {
						str += '<a href="javascript:;" class="jp-current">1</a>';
					} else {
						str += '<a href="javascript:;" class="jp-first">1</a>';
					};
					if (page > 5) {
						str += '<span class="dot">...</span>';
					};
					if (page < 6) {
						start = 1;
					} else {
						start = page - 3;
					};

					if (page > (pageCount - 5)) {
						end = pageCount;
					} else {
						end = page + 4;
					};
					for (var i2 = start; i2 < end; i2++) {
						if (i2 !== 1 && i2 !== pageCount) { //避免重复输出1和最后一页
							if (i2 === page) {
								str += '<a href="javascript:;" class="jp-current">' + i2 + '</a>';
							} else {
								str += '<a href="javascript:;" class="jp-href">' + i2 + '</a>';
							}
						}
					};
					if (page < (pageCount - 5)) {
						str += '<span class="dot">...</span>';
					};
					if (page === pageCount) {
						str += '<a href="javascript:;" class="jp-current">' + pageCount + '</a>';
					} else {
						str += '<a href="javascript:;" class="jp-last">' + pageCount + '</a>';
					};
				};

				if (page >= pageCount) {
					str += '<a href="javascript:;" class="jp-next jp-disabled">下一页></a>';
				} else {
					str += '<a href="javascript:;" class="jp-next">下一页></a>';
				};
				str += '<div class="page-to"><input autocomplete="off" type="text" class="jp-text" value="' + page + '"><label>页</label><button class="jp-button">转到</button></div>';
			} else {
				str += '<a href="javascript:;" class="jp-previous jp-disabled"><上一页</a><a href="javascript:;" class="jp-current">1</a><a href="javascript:;" class="jp-next jp-disabled">下一页></a>';
			};
			config.pageId.html(str);
			return b;
		};

		//对外暴露接口
		self.run = b.run;
		self.get = b.get;
		if (config.run) {
			self.run();
		}
		return self;
	}
	a.fn.extend({
		ajaxPage: ajaxPage
	});
})(jQuery);