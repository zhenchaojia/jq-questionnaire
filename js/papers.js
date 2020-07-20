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
        _data = [{
            title: '我是一个单选题',
            type: '1',
            id: 'z12',
            childen: ['选项1', '选项2', '选项3']
        }, {
            title: '我是一个多选题',
            type: '2',
            id: 'z13',
            childen: ['选项1', '选项2', '选项3']
        }, {
            title: '我是一个打分题',
            type: '3',
            id: 'z14',
            childen: [{
                name: '我是第一个打分项',
                val: '10',
                id: 'z333'
            }, {
                name: '我是第二个打分项',
                val: '5',
                id: 'z3399'
            }]
        }, {
            title: '我是一个填空题',
            id: 'z15',
            type: '4'
        }]
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
        // 校验当前是否已答题，未答题不能进入下一题
        if (_index != 0 && checkFn()) {
            alert('请先答完题目再进行操作！')
            return
        }
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
        if (_index == _data.length) { // 最后一题 进入
            $('.next-btn').addClass('last').text('提交')
        }
    })
    // 点击确定跳转
    $('.sure-btn').on('click', function () {
        if($('.pop-box .info-box').hasClass('fail')){
            $('.pop-box').addClass('hide')
        }else{
            location.href = './index.html'
        }
    })
    // 判断当前题目是否完成，未完成弹出提示，不进入下一题
    function checkFn() {
        var from = $("#papersFrom").serialize();
        return from.split('&').map(ite => {
            var _obj = {};
            _obj[ite.split('=')[0]] = ite.split('=')[1] ? ite.split('=')[1] : '';
            return _obj
        }).filter(it => {
            return _data[_index - 1].type != 3 ? it[_data[_index - 1].id] : _data[_index - 1].childen.filter(te => {
                return from.indexOf(te.id) > -1
            }).length == _data[_index - 1].childen.length;
        }).length == 0;
    }
    // 提交调用
    function submit() {
        // 接口返回成功 以下不执行，提交失败执行
        console.log('提交的数据',$("#papersFrom").serialize())
        var flag = true; //接口返回的状态，成功 or 失败
        if(flag){
            $('.pop-box .info-box').removeClass('fail')
            $('.pop-box h5').text('提交成功')
            $('.pop-box p').text('感谢您宝贵的时间，祝您生活愉快！')
        }else{
            $('.pop-box .info-box').addClass('fail')
            $('.pop-box h5').text('提交失败')
            $('.pop-box p').text('请重新提交！')
        }
        $('.pop-box').removeClass('hide')
        
    }
    // 根据题型返回dom字符串 单个题型
    function getQuestionStr(obj) {
        var _str = '';
        if (obj.type == 1) {
            _str += '<div class="subject-box hide" data-type="单选题">' +
                '    <div class="title">' + obj.title + '</div>' +
                getOptin(obj) +
                '</div>';

            function getOptin(obj) {
                var _optinstr = '';
                obj.childen.map(ite => {
                    _optinstr += '<label class="dis-f"><input type="radio" name="' + obj.id + '"  value="' + ite + '" /><i class="flex-1">' + ite + '</i></label>'
                })
                return _optinstr
            }
        } else if (obj.type == 2) {
            _str += '<div class="subject-box hide" data-type="多选题">' +
                '    <div class="title">' + obj.title + '</div>' +
                getOptin(obj) +
                '</div> '

            function getOptin(obj) {
                var _optinstr = '';
                obj.childen.map(ite => {
                    _optinstr += '<label class="dis-f"><input type="checkbox" name="' + obj.id + '"  value="' + ite + '" /><i class="flex-1">' + ite + '</i></label>'
                })
                return _optinstr
            }
        } else if (obj.type == 3) {
            _str += '<div class="subject-box hide" data-type="打分题">' +
                '    <div class="title">' + obj.title + '</div>' +
                '    <ul class="chiled-label">' +
                getOptin(obj) +
                '    </ul>' +
                '</div> ';

            function getOptin(obj) {
                var _optinstr = '';
                obj.childen.map(ite => {
                    _optinstr += '<li>' +
                        '    <div class="name">' + ite.name + '</div>' +
                        '    <div class="label-box dis-f">' +
                        getChildOption(ite) +
                        '    </div>' +
                        '</li>'
                })
                return _optinstr
            }

            function getChildOption(obj) {
                var _optinChildstr = '';
                for (var i = 0; i < obj.val; i++) {
                    _optinChildstr += '<label class="dis-f grade"><input type="radio" name="' + obj.id + '"  value="' + (i + 1) + '" /><i class="flex-1">' + (i + 1) + '</i></label>'
                }
                return _optinChildstr
            }
        } else {
            _str += '<div class="subject-box hide" data-type="填空题">' +
                '    <div class="title">' + obj.title + '</div>' +
                '    <textarea name="' + obj.id + '" ></textarea>' +
                '</div> '
        }
        return _str
    }

})