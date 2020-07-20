$(function () {
    // type == 1 单选题
    // type == 2 多选题
    // type == 3 评分题
    // type == 4 填空题
    var html = '';
    var _index = 0;
    var _data = [];
    var questionType = ['单选题', '多选题', '评分题', '填空题'];
    getList()
    // 获取接口数据，赋值给_data
    function getList() {
        _data = [
            {
                title: '我是一个单选题',
                type: '1',
                id: '1111',
                childen: ['选项1', '选项2', '选项3']
            }, {
                title: '我是一个多选题',
                type: '2',
                id: '2222',
                childen: ['选项1', '选项2', '选项3']
            }, {
                title: '我是一个打分题',
                type: '3',
                id: '333',
                childen: [{ name: '我是第一个打分项', val: '5',id:'33333333333' },{ name: '我是第二个打分项', val: '5',id:'333444444444' }]
            }, {
                title: '我是一个填空题',
                id: '444',
                type: '4'
            }
        ]
        // 拼接所有题型 统一添加dom
        _data.map((ite, ind) => {
            html += getQuestionStr(ite);
        })
        $('#papersFrom').html(html)
        setTimeout(() => {
            $('.type-box .total').text(_data.length)
            $('.next-btn').click()
        }, 100);
    }

    // 监听 点击下一题或者提交的方法
    $('.next-btn').on('click', function () {
        if (_index == _data.length) { // 当前是提交
            submit()
            return
        }
        $('.type-box .type').text(questionType[_data[_index].type - 1])
        $('.type-box .page-now').text(_index + 1)
        if (_index < _data.length) { //题未答完之前进入
            $('#papersFrom .subject-box').addClass('hide')
            $('#papersFrom .subject-box').eq(_index).removeClass('hide')
            _index++
        }
        if (_index == _data.length) {// 最后一题 进入
            $('.next-btn').addClass('last').text('提交')
        }
    })
    // 点击确定跳转
    $('.sure-btn').on('click', function () {
        location.href = './index.html'
    })
    // 提交调用
    function submit() {
        console.log($("#papersFrom").serialize())
        $('.pop-box').removeClass('hide')
    }
    // 根据题型返回dom字符串 单个题型
    function getQuestionStr(obj) {
        var _str = '';
        if (obj.type == 1) {
            _str += '<div class="subject-box hide" data-type="单选题">' +
                '    <div class="title">'+obj.title+'</div>' +
                    getOptin(obj) +
                '</div>';
                function getOptin(obj){
                    var _optinstr = '';
                    obj.childen.map(ite=>{
                        _optinstr += '<label class="dis-f"><input type="radio" name="'+obj.id+'"  value="'+ite+'" /><i class="flex-1">'+ite+'</i></label>' 
                    })
                    return _optinstr
                }
        } else if (obj.type == 2) {
            _str += '<div class="subject-box hide" data-type="多选题">' +
                '    <div class="title">'+obj.title+'</div>' +
                    getOptin(obj) +
                '</div> '
                function getOptin(obj){
                    var _optinstr = '';
                    obj.childen.map(ite=>{
                        _optinstr +='<label class="dis-f"><input type="checkbox" name="'+obj.id+'"  value="'+ite+'" /><i class="flex-1">'+ite+'</i></label>' 
                    })
                    return _optinstr
                }
        } else if (obj.type == 3) {
            _str += '<div class="subject-box hide" data-type="打分题">' +
                '    <div class="title">'+obj.title+'</div>' +
                '    <ul class="chiled-label">' +
                    getOptin(obj)+
                '    </ul>' +
                '</div> ';
                function getOptin(obj){
                    var _optinstr = '';
                    obj.childen.map(ite=>{
                        _optinstr+= '<li>' +
                                    '    <div class="name">'+ite.name+'</div>' +
                                    '    <div class="label-box dis-f">' +
                                        getChildOption(ite)+
                                    '    </div>' +
                                    '</li>'
                    })
                    return _optinstr
                }
                function getChildOption(obj){
                    var _optinChildstr = '';
                    for(var i=0;i<obj.val;i++){
                        _optinChildstr +='<label class="dis-f flex-1"><input type="radio" name="'+obj.id+'"  value="'+(i+1)+'" /><i class="flex-1">'+(i+1)+'</i></label>'
                    }
                    return _optinChildstr
                }
        } else {
            _str += '<div class="subject-box hide" data-type="填空题">' +
                '    <div class="title">'+obj.title+'</div>' +
                '    <textarea name="'+obj.id+'" ></textarea>' +
                '</div> '
        }
        return _str
    }

})