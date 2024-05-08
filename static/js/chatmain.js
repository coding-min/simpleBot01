//입력 메세지 함수
function newMessage() {
      //입력값 변수
      message = $(".message-input input").val();

      //빈 값이면 내용 출력 안되도록 함
      if($.trim(message) == '') {
            return false;
      }

      //질문 입력후 화면에 나오도록 함
      $('<li class="sent"><img src="static/image/human.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));

      //질문 입력후 내용 삭제
      $('.message-input input').val(null);

      //스크롤 자동으로 내려가게함
      //$(".messages").animate({ scrollTop: $(document).height() }, "fast");
      $(".messages").stop().animate({scrollTop: $('.messages')[0].scrollHeight}, 1000);
};


$(document).ready(function(){
        //개발자 도구 콘솔에 찍히게 함
        console.log('http://' + document.domain + ':' + location.port)


        var socket = io.connect('http://' + document.domain + ':' + location.port);

        //Pycharm에 연결 결과 확인
        socket.on('connect', function(){
                var connect_string = 'new_connect';
//                socket.send(connect_string);
        });

        //보내기 버튼
        $('.submit').click(function() {
                //질문 내용
                socket.send($(".message-input input").val());
                /*$(".message-input").val('');*/
                newMessage();

                //버튼 클릭후 질문 바로 입력 할수있게 함
                document.getElementById("textInput").focus();
                /*document.getElementById($(".message-input")).focus();*/
        });


        $('.setting').click(function() {
            window.open('/chatdata')
        });

        $('#guide').click(function() {
            window.open('/guide')
        });

        $('#robot').click(function() {
            location.href=('/')
        });



        //엔터키 버튼
        $(window).on('keydown', function(e) {
                if (e.keyCode == 13) {
                  socket.send($(".message-input input").val());

                  /*$(".message-input").val('');*/

                  newMessage();
                }
        });

//        답변
         socket.on('message', function(msg){
                // console.log(type(msg));
                if(msg.type == 'normal'){
                        $('#messages').append('<li class="replies"><img src="static/image/robot.png" alt="" /><p>'+ msg.message + '</p></li>');
                        //챗봇 대답시에도 스크롤 자동으로 내리기
                        //$(".messages").animate({ scrollTop: $(document).height() }, "fast");
                        $(".messages").stop().animate({scrollTop: $('.messages')[0].scrollHeight}, 1000);
                }
                else{
                        $('#messages').append('<li>' + msg.message + '</li>');
                }
                console.log('Received Message : '+msg.type);
        });

});

//페이지 접속시 채팅 입력 바로 가능 하게 만들기( 입력 에 포커스 )
window.onload = function () {
    document.getElementById("textInput").focus();
}