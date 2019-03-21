var _hmt = _hmt || [];
var Config = {
    appName: "英语听说自适应学习平台", //项目名称, install new时自动替换或手动配置
    // appKey: "144602295000000c", //录音AppKey, install new后手动配置, 参考:Courseworkapp/web/scaffold/config.php
    // secretKey: "d55a7ed3b4cfef097f2db1610c8b1b02",
    resUrl: "http://17ks.chivoxapp.com/",
    serverList: ["rtmp://s-edu.api.chivox.com:443/v2.0/aistream"], //遗留配置
    qid: "PAPER-130601-QT-000101", //试卷ID
    zy_path: "https://zy.kami.com", //作业系统地址
    reportUrl: "https://zy.kami.com", //作业系统地址
    // baidu: "6b265f53468ab4bc67882d44888953fb",
    baidu: function () {
        if (true) {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?6b265f53468ab4bc67882d44888953fb";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    },
    sdk: {
        appKey: "144602295000000c",
        secretKey: "d55a7ed3b4cfef097f2db1610c8b1b02",
        language: "zh-CN",
        coreTimeout: 200000,
        onFlashLoad: function (code, message) {
            console.log("onFlashLoad: " + code);
        },
        onConnectorStatusChange: function (code, msg) {
            console.log("onConnectorStatusChange: " + code);
        },
        onMicStatusChange: function (code, msg) {
            console.log("onMicStatusChange: " + code);
        },
        onError: function (code, msg) {
            console.log("onError: " + code);
        }
    },
    nlcpViews: [{
      abbr: 'Cpzy',
      name: '测评作业'
    }, {
      abbr: 'Tsks',
      name: '听说考试'
    }, {
      abbr: 'Dzcp',
      name: '定制测评'
    }, {
      abbr: 'Zxsj',
      name: '自学试卷'
    }]
};

Config.middleware_path = Config.zy_path + "/web/middleware/"; //作业系统中间件地址
if (!window.console) {
    window.console = {
        log: function () { },
        error: function () { },
        info: function () { }
    };
}

//define api url
var GET_MENU = "/gets/menu";

var COURSE_ADD = "/courses/add";
var COURSE_DEL = "/courses/del";
var COURSE_UPDATE = "/courses/update";
var COURSE_GET_LIST = "/courses/get_list";

var KNOWLEDGE_GET_TREE = "/courseSystems/get_knowledge_tree";
var KNOWLEDGE_ADD = "/courseSystems/knowledge_add";
var KNOWLEDGE_UPDATE = "/courseSystems/knowledge_update";
var KNOWLEDGE_DELETE = "/courseSystems/knowledge_delete";
var TEACHING_GET_TREE = "/courseSystems/get_teaching_tree";
var TEACHING_ADD = "/courseSystems/teaching_add";
var TEACHING_UPDATE = "/courseSystems/teaching_update";
var TEACHING_DELETE = "/courseSystems/teaching_delete";

var GET_CLASSES = "/teacherClasses/get_classes";
var AUTH_GET_CAMPUS_LIST = "/teacherClasses/get_schools";

var CEPING_STUDENT_ADD = "/exams/add_student_exam";
var CEPING_ADD = "/exams/add_open_exam";
var CEPING_GET_LIST = "/exams/get_list";
var CEPING_GET_STASTIC = "/exams/get_statistic"; // /ceping/get/stastic
var EXAMING_INFO = "/exams/exam_info";

var PAPER_GET_DROPDOWN = "/papers/get_dropdown";
var PAPER_GET_LIST = "/papers/get_list";
var PAPER_GENERATE = "/papers/auto_generate";
var PAPER_SAVE = "/papers/save";
var PAPER_DELETE = "/papers/delete";

var TOPIC_UPDATE = "/topics/update";
var TOPIC_UPLOAD = "/topics/upload";
var TOPIC_GET_LIST = "/topics/get_list";
var TOPIC_GET = "/topics/get";
var TOPIC_SEARCH = "/topics/search";
var TOPIC_DELETE = "/topics/delete";

var PAPER_MANUAL_VIEW = "/papers/manual_view";
var GRT_TOPIC_STATISTICS = "/topics/get_topic_statistics";
//var EXAMINE_GET = "/exams/get";
//var EXAMINE_AUTH_GET = "/exams/auth_get";
