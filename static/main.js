$('body').click(function (event) {
  if ($(event.target).hasClass('edui-default')) return;
  var uis = solution.ui.getUiByType('ueditor comboTree select textarea');
  for (var i = 0, len = uis.length; i < len; i++) {
      if (uis[i].type === 'ueditor' && !uis[i]._isHide) uis[i].hide();
      else uis[i].hide();
    }
  $('.quickSearch').empty().hide();
});
function setCookie(name, value, days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = '; expires=' + date.toGMTString();
    }else {
      var expires = '';
    }
  document.cookie = name + '=' + value + expires + '; path=/';
}
// 清空cookie
function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
      for (var i = keys.length; i--;)
          {setCookie(keys[i],"",-1);}
    }
}
function flashcheck() {
  var hasFlash = 0;　　　　 // 是否安装了flash
  var flashVersion = 0;　　 // flash版本
  if (document.all) {
      var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      if (swf) {
          hasFlash = 1;
          VSwf = swf.GetVariable('$version');
          flashVersion = parseInt(VSwf.split(' ')[1].split(',')[0]);
        }
    } else {
      if (navigator.plugins && navigator.plugins.length > 0) {
          var swf = navigator.plugins['Shockwave Flash'];
          if (swf) {
              hasFlash = 1;
              var words = swf.description.split(' ');
              for (var i = 0; i < words.length; ++i) {
                  if (isNaN(parseInt(words[i]))) continue;
                  flashVersion = parseInt(words[i]);
                }

              if (swf.filename.indexOf('.dll') < 0 && swf.filename.indexOf('.ocx') < 0) {
                  hasFlash = 0;
                }
            } else {
              hsaFlash = 0;
            }
        }
    }
  return {
      f: hasFlash,
      v: flashVersion
    };
}

// 弹窗
var tipDialog = function(cfg) {
  var configMap = {
      dialog_cover: '<div class="tip-cover"></div>',
      dialog_panel: '<div class="tip-dialog"><div class="td-header"><h1 class="td-title"></h1><span></span><a class="td-close"></a></div><div class="td-container"><h2 class="td-subtitle"></h2><div class="tip-text"><p class="td-content"></p></div><div class="tip-subtext"><p class="subcontent"></p></div></div><div class="td-btnbar"><button class="td-warn"></button><button class="td-cancel"></button><button class="td-confirm"></button></div></div>',
    };

  var $dialog_cover = $(configMap.dialog_cover);
  var $dialog_panel = $(configMap.dialog_panel);

  var $dialog_header = $dialog_panel.find('.td-header'),
      $dialog_content = $dialog_panel.find('.td-container'),
      $dialog_btnbar = $dialog_panel.find('.td-btnbar');

  var default_cfg = {
      isClose: true, // true有关闭 false没关闭
      type: '', // warn红色感叹号 tip蓝色感叹号 success绿色钩钩 title标题
      title: '', // 标题
      subtitle: '', // 中标题
      content: '', // 正文
      subcontent: '', // 副文 灰色
      warnBtn: '', // 红
      cancelBtn: '关闭', // 白
      confirmBtn: '', // 绿
      timeout: false,
      timeoutConfig: {
          time: 0, // 秒
          text: '', // 剩余{{time}}秒
          textPosiiton: '', // title subtitle content subcontent
          timeoutCallback: function() {}
        },
      warnCallback: function() {},
      confirmCallback: function() {}
    }

  var _cfg = $.extend({}, default_cfg, cfg);

  var tdTimeout;
  var fontSize;

  var closeDialog = function () {
      $dialog_cover.remove();
      $dialog_panel.remove();
    }

    // X
  if (_cfg.isClose) {
      $dialog_panel.find('.td-close').click(function() {
          clearTimeout(tdTimeout);
          $dialog_cover.remove();
          $dialog_panel.remove();
        });
    } else {
      $dialog_panel.find('.td-close').remove();
    }

    // 大号标题 或 图标
  if (_cfg.type === 'title') {
      fontSize = '16';
      $dialog_header.find('h1').html(_cfg.title);
      $dialog_header.find('span').remove();
    } else {
      fontSize = '14'
      $dialog_header.find('h1').remove();
      if (_cfg.type === 'warn') {
          $dialog_header.find('span').addClass('warn');
        } else if (_cfg.type === 'tip') {
          $dialog_header.find('span').addClass('tip');
        } else if (_cfg.type === 'success') {
          $dialog_header.find('span').addClass('success');
        }
    }

    // 中号标题
  if (_cfg.subtitle) {
      $dialog_content.find('h2').html(_cfg.subtitle);
    } else {
      $dialog_content.find('h2').remove();
    }

    // 内容
  if (_cfg.content) {
      $dialog_content.find('.tip-text').addClass('tip-text-' + fontSize);
      $dialog_content.find('.tip-text p').html(_cfg.content);
    } else {
      $dialog_content.find('.tip-text').remove();
    }

    // 副内容 灰色
  if (_cfg.subcontent) {
      $dialog_content.find('.tip-subtext p').html(_cfg.subcontent);
    } else {
      $dialog_content.find('.tip-subtext').remove();
    }

    // 按钮
  if (_cfg.warnBtn) {
      $dialog_panel.find('.td-warn').html(_cfg.warnBtn);
      if (typeof _cfg.warnCallback === 'function') {
          $dialog_panel.find('.td-warn').click(function() {
              clearTimeout(tdTimeout);
              _cfg.warnCallback(closeDialog);
            });
        }
    } else {
      $dialog_panel.find('.td-warn').remove();
    }

  if (_cfg.cancelBtn) {
      $dialog_panel.find('.td-cancel').html(_cfg.cancelBtn);
      if (typeof _cfg.cancelCallback === 'function') {
          $dialog_panel.find('.td-cancel').click(function() {
              clearTimeout(tdTimeout);
              _cfg.cancelCallback(closeDialog);
            });
        } else {
          $dialog_panel.find('.td-cancel').click(function() {
              clearTimeout(tdTimeout);
              closeDialog();
            });
        }
    } else {
      $dialog_panel.find('.td-cancel').remove();
    }

  if (_cfg.confirmBtn) {
      $dialog_panel.find('.td-confirm').html(_cfg.confirmBtn);
      if (typeof _cfg.confirmCallback === 'function') {
          $dialog_panel.find('.td-confirm').click(function() {
              clearTimeout(tdTimeout);
              _cfg.confirmCallback(closeDialog);
            });
        }
    } else {
      $dialog_panel.find('.td-confirm').remove();
    }

  if (_cfg.timeout) {
      var tconfig = _cfg.timeoutConfig;
      var timecount = tconfig.time;

      $dialog_panel.find('.td-' + tconfig.textPosiiton).html(tconfig.text.replace('{{time}}', timecount));
      function tdTimeoutFunction() {
          timecount--
          $dialog_panel.find('.td-' + tconfig.textPosiiton).html(tconfig.text.replace('{{time}}', timecount));
          if (timecount <= 0) {
              timecount = 0;
              clearTimeout(tdTimeout);
              tconfig.timeoutCallback(closeDialog);
            } else {
              tdTimeout = setTimeout(tdTimeoutFunction, 1000)
            }
        }

      tdTimeout = setTimeout(tdTimeoutFunction, 1000)
    }

    // 添加遮盖层
  $('body').append($dialog_cover);
    // 添加弹出框
  $('body').append($dialog_panel);

  setTimeout(function() {
      $dialog_cover.show();
      $dialog_panel.fadeIn();

        // 对话框居中
      $dialog_panel.css({
          marginTop: -$dialog_panel.height() / 2
        });
    }, 0);
};

// tipDialog({
//     type: 'title', // warn红色感叹号 tip蓝色感叹号 success绿色钩钩 title标题
//     title: '大号标题', //标题
//     subtitle: '中标题', // 中标题
//     content: '正文', // 正文
//     subcontent: '副文', //副文 灰色
//     warnBtn: '删除', // 红
//     cancelBtn: '关闭', // 白
//     confirmBtn: '确认', // 绿
//     isClose: true, //true有关闭 false没关闭
//     timeout: true,
//     timeoutConfig: {
//         time: 5, // 秒
//         text: '剩余{{time}}秒', // 剩余{{time}}秒
//         textPosiiton: 'content', // title subtitle content subcontent
//         timeoutCallback: function(closeDialog) {
//             closeDialog()
//             alert(1);
//         }
//     },
//     warnCallback: function() {
//         console.info('warn')
//     },
//     confirmCallback: function() {
//         console.info('confirm')
//     }
// });

// 上传
var uploadBanner = function(target, callback) {
  $(target).uploadify({
      'auto': true,
      'width': 80,
      'height': 27,
      'fileObjName': 'upfile',
      'buttonText': '选择图片',
      'swf': '/js/lib/uploadify/uploadify.swf',
      'uploader': '/englishCompetition/upload?action=upload',
      'multi': false,
      'removeCompleted': false,
      'cancelImg': 'js/uploadify/uploadify-cancel.png',
      'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png',
      'fileSizeLimit': '1MB',
      'overrideEvents': ['onSelectError', 'onDialogClose'],
      onUploadSuccess: function (file, data, response) {
          this.queueData.files = [];
          try {
              data = JSON.parse(data);
            } catch (error) {
              data = JSON.parse(data.substring(1));
            }
            // console.log(data.url);
          if (data.errorCode == 1) {
              $(target).uploadify('cancel', '*');
              if (typeof callback === 'function') callback(data);
            } else if (data.errorCode == -1) {
              alert(data.state);
            }
        },
      onSelectError: function (file, errorCode, errorMsg) {
          switch (errorCode) {
              case -110:
                alert('文件 [' + file.name + '] 大小超出系统限制的' + $(target).uploadify('settings', 'fileSizeLimit') + '大小！');
                break;
              case -120:
                alert('文件 [' + file.name + '] 大小异常！');
                break;
              case -130:
                alert('文件 [' + file.name + '] 类型不正确！');
                break;
              default:
                alert('上传失败: ' + errorCode + ': ' + errorMsg);
                break;
            }
        }
    });
}

var gradeList;
var promptTpl = '<div class="contain">' +
                    '<div class="wrap"><i></i></div>' +
                    '<p class="content" style="line-height:24px;font-size:16px;color:#333333;text-align:center;margin:0;margin-bottom:30px;">你的浏览器没有安装Flash<br>请点击下方链接下载</p>' +
                    '<div class="dialog-btnBar" style="padding-top:0;">' +
                        '<div class="error"></div>' +
                        '<a class="download-btn" href="http://17ks.chivoxapp.com/guide/QQBrowser_Setup_SEM1.exe" style="float:right;margin-left:10px;height:40px;width:auto;border:#dcdcdc 1px solid;"><i class="icon-qq"></i>下载QQ浏览器<i class="icon-new"></i></a>' +
                        '<a class="download-btn" href="http://17ks.chivoxapp.com/guide/360cse_8.7.0.306.exe" style="float:right;margin-left:10px;height:40px;width:auto;border:#dcdcdc 1px solid;"><i class="icon-360"></i>下载360极速浏览器<i class="icon-new"></i></a>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                '</div>';
function getGradeList (callback) {
  solution.server.get('/TeacherClasses/getGrade', {}, function (data) {
      if (data.result == 1) {
          gradeList = data.info;
          callback();
        } else {
          alert(data.message)
        }
    }, false);
}

$(function () {
  var resizeHeight = function () {
      var browserHeight = $(window).height();
      $('.container').css('min-height', browserHeight - 98);
    };
  resizeHeight();
  $(window).resize(function (event) {
      resizeHeight();
    });
  try {
      solution.txFactory = new txFactory();
    } catch (e) {
        // console.log("tx.js没有引入");
    }

  if (flashcheck().f === 0) {
        // alert("你的浏览器没有安装Flash");
      $.Prompt({
         content: promptTpl,
         event: function () {
            }
       })
    }

  solution.server.get(GET_MENU, {}, function (data) {
      if (data.result == 1) {
          var menus = data.info.auth;
          solution.constant = {};
          solution.constant.user = data.info.user;

          $('.nav > ul.nav-list').empty();
          $.each(menus, function (index, menu) {
              $('.nav > ul.nav-list').append('<li name="topic_build" data-for="' + menu.shortName + '"><a href="#" data-chivox-event="click:menuClick&' + menu.shortName + '" data-chivox-group="menu">' + menu.menuName + '</a></li>');
            });

          $('#userName').html(data.info.user.nickName);
          $('#userName').data('userName', data.info.user.nickName);
          $('#userName').data('ManageType', data.info.user.ManageType);
          $('#userName').data('RoleType', data.info.user.RoleType);
          $('#userName').data('userId', data.info.user.userID);

          if ($.cookie('rt') == data.info.user.RoleType && $.cookie('uid') == data.info.user.userID) {
            } else {
              $.cookie('cid', '');
            }

          $.cookie('rt', data.info.user.RoleType);
          $.cookie('uid', data.info.user.userID);

          if (data.info.user.RoleType == 'teacher' && $.cookie('hasCp') == 1 && $.cookie('hasZy') !== 1) {
              $('.nav-sub > li:last > a').attr('href', Config.reportUrl + '/web/models/Login/self.php').text('退出');
              clearAllCookie();
            }
          if (data.info.user.RoleType == 'teacher' && $.cookie('hasCp') == 1 && $.cookie('hasZy') == 1) {
              $('.nav-sub > li:last > a').attr('href', Config.reportUrl + '/web/models/TeaMain/self.php').text('返回作业系统');
            }
          if (data.info.user.RoleType == 'manager') {
              $('.nav-sub > li:last > a').click(function() {
                  clearAllCookie();
                })
            }
          getGradeList(function() {
              setTimeout('$(".nav > ul > li:first > a").click()', 0);
            });

          $('#sdzj-info input').click(function (evt) {
              $(this).select();
            });
        } else {
          window.location.href = Config.reportUrl + '/login/self.php'
        }
    });
});
// 设备检测
function checkmedia(cb) {
    // var GuideObj = new Guide(start, play);

  try {
      var aiPanel = new chivox.AiPanel($.extend(true, {}, Config.sdk, {
          onMicStatusChange: function (code, msg) {
              console.log('onMicStatusChange: ' + code);

              cb && Guide3.addCallback(cb);

              if (code == 50001 || code == 50008) {
                  if (Guide3.getStep() === 0) {
                      Guide3.show();
                      $('#recorder').addClass('min');
                    } else {
                      $('#guide').find('button').removeClass('disabled');
                    }
                } else {
                  if (code == 50003) {
                      Guide3.show(11);
                    } else {
                      Guide3.show(9);
                    }
                }

              hideGuide();
            }
        }));

      player = aiPanel.player;
      recorder = aiPanel.recorder;
    } catch (e) {
      cw.ui.alert('语音服务暂时不可用，请稍后再试');
    }
}

function hideGuide() {
  $('.guide_container').addClass('hide');
}

$('body').off('click').on('click', '.live-admin.check-device', function () {
  checkmedia();
});

if (!window.console) { // 兼容IE8
  window.console = {
      log: function () { },
      error: function () { },
      info: function () { },
      warn: function () { }
    }
}

/*
*使用canvas合成图片
*param:{object}
*return:base64图片
*/
var mergeImage = function(cfg, callback) {
    /**
    *文字换行根据canvas宽度来做折行
    * @param  {[type]} str        [字符串]
    * @param  {[type]} canvas     [canvas对象]
    * @param  {[type]} initX      [左间距]
    * @param  {[type]} initY      [上间距]
    * @param  {[type]} lineHeight [行高]
    */
  var canvasTextAutoLine = function (str, canvas, initX, initY, lineHeight) {
      var lineWidth = 0;
        // var canvasWidth = parseInt(canvas.width.replace("px",""));
      var lastSubStrIndex = 0;
      if (str.length > 24) {
          str = str.substr(0, 24) + '...'
        }
      for (var i = 0; i < str.length; i++) {
          lineWidth += canvas.measureText(str[i]).width;
          if (lineWidth > 720) {
              canvas.fillText(str.substring(lastSubStrIndex, i), initX, initY);
              initY += lineHeight;
              lineWidth = 0;
              lastSubStrIndex = i;
            }
          if (i == str.length - 1) {
              canvas.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
            }
        }
    }

  var getCanvasContext = function(width, height) {
      var html = '<canvas id="MergeImageId" width="' + width + '" height="' + height + '" style="display:none"></canvas>';
      $('body').append(html);
      ret = document.getElementById('MergeImageId').getContext('2d');
      return ret;
    };

  var defalut_cfg = {
      width: 1000, // canvas宽度
      height: 500, // canvas高度
      value: '', // 输入的文字
      imgsrc: '', // 图片地址
      font: '60px Microsoft Yahei', // 合成图片字体大小
      textAlign: 'center', // 合成图片中文字位置
      fillStyle: '#333', // 合成图片中文字颜色
    };
  var _cfg = $.extend({}, defalut_cfg, cfg);
  var mainCtx = getCanvasContext(_cfg.width, _cfg.height);// 获取canvas对象
  var maxWidth = mainCtx.width;
  var maxHeight = mainCtx.height;
  mainCtx.clearRect(0, 0, 1000, 1000);

  var starImg = new Image();// 获取图片的实际路径
  starImg.src = _cfg.imgsrc;
  starImg.onload = function () { // 合成
      mainCtx.drawImage(starImg, 0, 0, _cfg.width, _cfg.height);// 先把图片绘制在这里
      if (_cfg.value) { // 读取用户的文本
            // mainCtx.font = '60px "Microsoft Yahei"';
          mainCtx.font = _cfg.font;
          mainCtx.fillStyle = _cfg.fillStyle;
          mainCtx.textAlign = _cfg.textAlign;
          mainCtx.width = '250px';
          canvasTextAutoLine(_cfg.value, mainCtx, 500, 240, 72);
          var mycanvas = document.getElementById('MergeImageId');
          typeof callback === 'function' && callback(mycanvas.toDataURL('image/jpeg'));
        }
    };
}

function showDSBJ (competitionId, isEdit, isFile, competitionType, isCpxx) {
    // $('.nav ul li > a.active').removeClass("active");
  var $dsjd = $('#dsjd');
  $('#left-container, #bjds').show();

  var $a = $('#bjds').find('li:eq(0) > a');

  $a.data('id', competitionId).data('competitionType', competitionType || 1).data('isEdit', isEdit).data('isFile', isFile)

  if (competitionId) {
      solution.server.get('/competitionsRanges/getCompetitionRange', {
          competitionId: competitionId
        }, function(data) {
          $dsjd.empty();
          $('#fzsj_dsjd').empty();
          $('#dsjd_kcjk').empty();
          $('#xqfx').empty();
          $('#bjds').find('#bggl').parent().hide();// 报告管理
          data.info.forEach(function (jd, index) {
              var $jd = $('<li data-chivox-group="three-level-menu"><a href="#" data-chivox-event="click:subMenuClick&xsxx&' + jd.id + '&' + jd.stage + '">' + jd.stageName + '</a></li>');
              var $sj = $('<li data-chivox-group="three-level-menu"><a href="#" data-chivox-event="click:subMenuClick&fzsj&' + jd.id + '">' + jd.stageName + '<img src="/css/images/icon_warm_small.png" alt="" class="hide" style="margin-left:5px;"/><img src="/css/images/tip_unfinishedset.png" alt="" class="warning-tip hide"/></a></li>');
              var $jk = $('<li><a style="font-size:14px;background-color:#90deb9;" href="/monitor/index.html?competitionId=' + (document.cookie.match(/cid=(\d+);?/) ? document.cookie.match(/cid=(\d+);?/)[1] : competitionId) + '&stageId=' + jd.id + '&role=' + $('#userName').data('RoleType') + '" target="_blank">' + jd.stageName + '</a></li>');
              var $xf = $('<li data-chivox-group="three-level-menu"><a href="#" data-chivox-event="click:subMenuClick&xqfx&' + jd.id + '&' + jd.stage + '">' + jd.stageName + '</a></li>');
              $dsjd.append($jd);
              $('#fzsj_dsjd').append($sj);
              $('#dsjd_kcjk').append($jk);
              $('#xqfx').append($xf);
              if ($('#userName').data('RoleType') == 'teacher') {
                  $('#bjds').find('#dsjd').prev('a').text('学生信息');
                    // $("#dsjd_kcjk").parent("li").hide();//考场监控
                } else if ($('#userName').data('RoleType') == 'manager') {
                  $('#bjds').find('#dsjd').prev('a').text('选手信息');
                  $('#bjds').find('#xqfx').parent().hide();// 学情分析
                }
            });

          if (isCpxx) {
              $a.attr('data-chivox-event', 'click:subMenuClick&nlcp&Cpxx&' + competitionId);
              $('#fzsj_dsjd').parent().hide()
              $('#dsjd, #xqfx, #dsjd_kcjk').css({'height': '0px'})
              $('#dsjd, #xqfx, #dsjd_kcjk').parent().find('a > i').hide()

              if (competitionType == 2) {
                  $('#xqfx').parent().hide()
                  $('#dsjd_kcjk').parent().hide()
                }
            } else {
              $a.attr('data-chivox-event', 'click:subMenuClick&dsbj');
              $('#fzsj_dsjd').parent().show()
              $('#dsjd, #xqfx, #dsjd_kcjk').height('auto')
              $('#dsjd, #xqfx, #dsjd_kcjk').parent().find('a > i').show()

              $('#xqfx').parent().show()
              $('#dsjd_kcjk').parent().show()
            }

          $a.click();
        });
    } else {
      $a.attr('data-chivox-event', 'click:subMenuClick&dsbj');
      $('#fzsj_dsjd').parent().show()
      $('#dsjd').parent().show()
      $a.click();
    }
}
