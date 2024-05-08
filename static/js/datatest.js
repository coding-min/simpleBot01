function openPopup() {
    var popup = document.getElementById("popup");
    popup.style.visibility = "visible";
    popup.style.opacity = "1";
}

function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.visibility = "hidden";
    popup.style.opacity = "0";
}

var currentDataNo;

function delete_openPopup(data_no) {
    currentDataNo = data_no;
    var popup = document.getElementById("delete_popup");
    popup.style.visibility = "visible";
    popup.style.opacity = "1"

     document.querySelector("#delete_popup h2").innerHTML = data_no + "번 데이터를<br>삭제하시겠습니까?"
}

function delete_closePopup() {
    var popup = document.getElementById("delete_popup");
    popup.style.visibility = "hidden";
    popup.style.opacity = "0";
}



function chatSave() {
    var question = $('#question').val();
    var answer = $('#answer').val();

    /*스마트에디터
    oEditors.getById["answer"].exec("UPDATE_CONTENTS_FIELD", [])
    let answer = document.getElementById("answer").value
    answer = answer.replace(/<(\/)?[Pp](\/)?>/g,"");*/

    /*if(answer == '') {
        alert("내용을 입력해주세요.")
        oEditors.getById["answer"].exec("FOCUS")
        return
        } else {
        console.log(answer)
    }*/


    var gubun = $('#gubun').val();

    // AJAX를 사용하여 서버에 데이터 전송
    if (question && answer && gubun) {
        $.ajax({
            type: "POST",
            url: "/data_insert",
            data: {
                question: question,
                answer: answer,
                gubun: gubun
            },
            cache: false,
            success: function (data) {
                if (data == "success") {
                    // 성공 메시지를 표시
                    alert("데이터가 성공적으로 입력되었습니다.");
                    window.location.reload();
                } else if (data === "duplicate") {
                    alert("이미 같은 데이터가 존재합니다.");
                } else {
                    alert("데이터 입력 중 오류가 발생했습니다.");
                }
            },
            error: function (xhr, status, error) {
                // 실패한 경우 처리
                alert("데이터 입력 중 오류가 발생했습니다.");
            }
        });
    }
}

function deleteData() {
    // 데이터 삭제
    $.ajax({
        type: "POST",
        url: "/data_delete",
        data: { data_no: currentDataNo },
        cache: false,
        success: function (data) {
            if (data == "success") {
                // 성공 메시지를 표시
                alert(currentDataNo + " 데이터가 성공적으로 삭제되었습니다.");
                // 삭제 후에 화면 새로고침 또는 필요한 작업 수행
                window.location.reload(); // 화면 새로고침
            } else {
                alert("데이터 삭제 중 오류가 발생했습니다.");
            }
        },
        error: function (xhr, status, error) {
            // 실패한 경우 처리
            alert("데이터 삭제 중 오류가 발생했습니다.");
        }
    });
}


function modify_openPopup(data_no) {
    var popup = document.getElementById("modify_popup");
    popup.style.visibility = "visible";
    popup.style.opacity = "1";
    currentDataNo = data_no;


    var row = document.querySelector(".data[data-no='" + data_no + "']");
    if (row) {
        var question = row.querySelector("td:nth-child(2)").textContent;
        var answer = row.querySelector("td:nth-child(3)").textContent;
        var gubun = row.querySelector("td:nth-child(4)").textContent;

        // 팝업 내에서 데이터 표시
        document.getElementById("modified_question").value = question;
        document.getElementById("modified_answer").value = answer;
        document.getElementById("modified_gubun").value = gubun;
    } else {
        // 데이터 행을 찾지 못한 경우 오류 처리
        console.error("해당 데이터 행을 찾을 수 없습니다.");
    }
}


function modify_closePopup() {
    var popup = document.getElementById("modify_popup");
    popup.style.visibility = "hidden";
    popup.style.opacity = "0";
}


function modifyData() {
    var modified_question = $('#modified_question').val();
    var modified_answer = $('#modified_answer').val();
    var modified_gubun = $('#modified_gubun').val();
    var data_no = currentDataNo;

    // Send an AJAX request to the server to update the record
    $.ajax({
        type: "POST",
        url: "/data_modify",
        data: {
            data_no: data_no,
            modified_question: modified_question,
            modified_answer: modified_answer,
            modified_gubun: modified_gubun
        },
        cache: false,
        success: function (data) {
            if (data === "success") {
                alert("데이터가 성공적으로 수정되었습니다.");
                modify_closePopup();
                window.location.reload(true); // 수정 내용을 반영하기 위해 페이지 새로고침
		console.log(location.reload )
            } else if (data === "duplicate") {
                alert("이미 같은 데이터가 존재합니다.");
            } else {
                alert("데이터 수정 중 오류가 발생했습니다.");
            }
        },
        error: function (xhr, status, error) {
            alert("데이터 수정 중 오류가 발생했습니다.");
        }
    });
}

function searchData() {
    var searchKeyword = document.getElementById("searchInput").value.toLowerCase(); // 입력된 검색어를 소문자로 변환

    var value_str = document.getElementById('searchoption');
    searchValue = value_str.options[value_str.selectedIndex].value

    /*alert(searchValue);*/
     if (searchKeyword==""){
            document.getElementById("searchInput").focus();
            alert("검색어를 입력해주세요.")
     }

    var dataRows = document.querySelectorAll(".data"); // 모든 데이터 행 가져오기

    dataRows.forEach(function(row) {
        var question = row.querySelector("td:nth-child(2)").textContent.toLowerCase(); // 질문 텍스트 가져와 소문자로 변환
        var answer = row.querySelector("td:nth-child(3)").textContent.toLowerCase(); // 답변 텍스트 가져와 소문자로 변환


        if (searchValue == 'default'){
            if (question.includes(searchKeyword) || answer.includes(searchKeyword)) {
            // 검색어가 질문 또는 답변에 포함되어 있는 경우 해당 데이터를 보이도록 설정
            row.style.display = "table-row";
            } else {
            // 검색어가 질문 또는 답변에 없는 경우 해당 데이터를 숨기도록 설정
            row.style.display = "none";
            }
        } else if (searchValue == 'question'){
            if (question.includes(searchKeyword)){
            // 검색어가 질문 또는 답변에 포함되어 있는 경우 해당 데이터를 보이도록 설정
            row.style.display = "table-row";
            } else {
            // 검색어가 질문 또는 답변에 없는 경우 해당 데이터를 숨기도록 설정
            row.style.display = "none";
            }
        } else if (searchValue == 'answer'){
            if (answer.includes(searchKeyword)){
            // 검색어가 질문 또는 답변에 포함되어 있는 경우 해당 데이터를 보이도록 설정
            row.style.display = "table-row";
            } else {
            // 검색어가 질문 또는 답변에 없는 경우 해당 데이터를 숨기도록 설정
            row.style.display = "none";
            }
        }

        /*if (question.includes(searchKeyword) || answer.includes(searchKeyword)) {
            // 검색어가 질문 또는 답변에 포함되어 있는 경우 해당 데이터를 보이도록 설정
            row.style.display = "table-row";
        } else {
            // 검색어가 질문 또는 답변에 없는 경우 해당 데이터를 숨기도록 설정
            row.style.display = "none";
        }*/
    });
}

function sortTable(n) {
  const table = document.getElementById("myTable");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll("td")[n].textContent;
    const cellB = rowB.querySelectorAll("td")[n].textContent;
    return cellA.localeCompare(cellB, undefined, {numeric: true, sensitivity: 'base'});
  });

  if (table.getAttribute("data-sort-dir") === "asc") {
    rows.reverse();
    table.setAttribute("data-sort-dir", "desc");
  } else {
    table.setAttribute("data-sort-dir", "asc");
  }

  table.removeChild(tbody);
  rows.forEach(row => tbody.appendChild(row));
  table.appendChild(tbody);
}


$(document).ready(function(){
    $('.data_insert').click(function() {
        openPopup();
    });

    $('.no').click(function() {
        closePopup();
    });

    $('#texttitle').click(function() {
            window.location.href = '/'
    });

    $('.ok').click(function() {
        if ($('#question').val() == "") {
            $('#question').focus();
        } else if ($('#answer').val() == "") {
            $('#answer').focus();
        } else if ($('#gubun').val() == "") {
            $('#gubun').focus();
        } else {
            // "ok" 버튼을 클릭하면 팝업 창을 닫음
            closePopup();
        }
    });

    $(window).on('keydown', function(e) {
        if (e.keyCode == 13) {
            $(".search").click();
        }
    });


    /*스마트에디터
    smartEditor();*/
});



/*스마트에디터
let oEditors = [];

smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "answer",
        sSkinURI: "static/smarteditor/SmartEditor2Skin.html",
        fCreator: "createSEditor2"
    })
}*/
