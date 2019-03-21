UE.registerUI('sanchor', function(editor, uiName) {
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName, {
        execCommand: function() {
            editor.execCommand('insertHtml', '<img src="/img/ic_insert.png"/>');
        }
    });
    //创建一个button
    var counter = 0;
    var sanchor_count = 0;
    var btn = new UE.ui.Button({
        //按钮的名字
        name: uiName,
        //提示
        title: "插入填空占位符",
        //添加额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -60px 0;',
        //点击时执行的命令
        onclick: function() {
            sanchor_count = 0;
            // if (counter <= 0) {
                var content = editor.getContent();
                content.replace(/<img src="\/img\/ic_insert.png".*?\/>/g, function() {
                    sanchor_count++;
                });
            // }
            // counter++;
            // sanchor_count++;
            if (sanchor_count > 19) {
                alert("最多可插入20个填空占位符！");
                return;
            }
            //这里可以不用执行命令,做你自己的操作也可
            editor.execCommand(uiName);
        }
    });
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function() {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
    //因为你是添加button,所以需要返回这个button
    return btn;
});
