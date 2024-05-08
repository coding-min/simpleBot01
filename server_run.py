from flask import Flask, request, render_template
from flask_socketio import SocketIO, send
import pymysql.cursors
import messageUtil


# Flask
app = Flask(__name__)
socket_io = SocketIO(app)

# MySQL Database 정보
#db_host = 'intellyticsdb.c01jlvqfckgq.ap-northeast-2.rds.amazonaws.com'
db_host = '165.186.175.240'
db_user = 'jamong'
db_password = 'sdt'
db_name = 'tmp'

def chatbot_message():
    global answer_dict, html_dict

    connection = pymysql.connect(host=db_host,
                                 user=db_user,
                                 password=db_password,
                                 db=db_name,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)

    try:
        with connection.cursor() as cursor:
            # 데이터베이스에서 질문과 답변 데이터를 가져오기
            sql = "SELECT question, answer, gubun FROM chatbot_data "
            cursor.execute(sql)
            result = cursor.fetchall()

            # 가져온 데이터를 딕셔너리 형태로 업데이트
            answer_dict = {}
            html_dict = {}
            for row in result:
                question = row['question'].replace(' ', '').replace('-', '').upper()
                answer_dict[question] = row['answer']
                html_dict[row['answer']] = row['gubun']

    finally:
        connection.close()

# 초기 데이터 로드
chatbot_message()

@app.route('/')
def main():
    return render_template('chatmain.html')

@app.route('/guide')
def guide():
    return render_template('guide.html')

@app.route('/chatdata', methods=['POST', 'GET'])
def data_test():
    # 데이터 조회
    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        db=db_name,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    cursor = conn.cursor()
    sql = "SELECT data_no,question,answer,gubun FROM chatbot_data ORDER BY data_no DESC"

    cursor.execute(sql)
    result = cursor.fetchall()

    datano_sql = "SELECT data_no FROM chatbot_data ORDER BY data_no DESC"

    cursor.execute(datano_sql)
    data_no = cursor.fetchall()

    cursor.close()

    return render_template('chatdata.html', result=result, data_no=data_no)

@app.route('/data_insert', methods=['POST', 'GET'])
def data_insert():
    # 데이터 조회
    if request.method == 'POST':
        try:
            question = request.form.get('question', False)
            answer = request.form.get('answer', False)
            gubun = request.form.get('gubun', False)

            # 데이터베이스 연결 설정
            connection = pymysql.connect(
                host=db_host,
                user=db_user,
                password=db_password,
                db=db_name,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )

            with connection.cursor() as cursor1:
                sql_check = "SELECT COUNT(*) FROM chatbot_data WHERE question=%s"
                cursor1.execute(sql_check, (question,))
                count = cursor1.fetchone()["COUNT(*)"]

                if count == 0:
                    # 데이터베이스에 데이터 삽입
                    sql1 = "INSERT INTO chatbot_data (question, answer, gubun) VALUES (%s, %s, %s)"
                    cursor1.execute(sql1, (question, answer, gubun))
                    connection.commit()
                else:
                    return "duplicate"

            # 데이터 삽입 후에 데이터 업데이트
            chatbot_message()

            return "success"  # 데이터 입력 성공 시 "success"를 반환

        except Exception as e:
            print(str(e))
            return "error"  # 데이터 입력 실패 시 "error"를 반환

        finally:
            if connection:
                connection.close()

    return render_template('chatdata.html')


@app.route('/data_delete', methods=['POST'])
def data_delete():
    try:
        data_no = request.form.get('data_no')

        # 데이터베이스 연결 설정
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            db=db_name,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

        with connection.cursor() as cursor:
            # 데이터 삭제
            sql = "DELETE FROM chatbot_data WHERE data_no = %s"
            cursor.execute(sql, (data_no,))
            connection.commit()

        print(f"Deleted : {data_no}") #테스트

        chatbot_message()
        
        return "success"  # 데이터 삭제 성공 시 "success"를 반환

    except Exception as e:
        print(str(e))
        return "error"  # 데이터 삭제 실패 시 "error"를 반환

    finally:
        if connection:
            connection.close()


@app.route('/data_modify', methods=['POST'])
def data_modify():
    try:
        data_no = request.form.get('data_no')
        modified_question = request.form.get('modified_question')
        modified_answer = request.form.get('modified_answer')
        modified_gubun = request.form.get('modified_gubun')

        # 데이터베이스 연결 설정
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            db=db_name,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

        with connection.cursor() as cursor:
            sql_check = "SELECT COUNT(*) FROM chatbot_data WHERE question=%s AND data_no != %s"
            cursor.execute(sql_check, (modified_question, data_no))
            count = cursor.fetchone()["COUNT(*)"]

            if count == 0:
                # 데이터베이스에 데이터 수정
                sql = "UPDATE chatbot_data SET question = %s, answer = %s, gubun = %s WHERE data_no = %s"
                cursor.execute(sql, (modified_question, modified_answer, modified_gubun, data_no))
                connection.commit()
            else:
                return "duplicate"  # 중복 "question" 데이터인 경우 "duplicate"를 반환

        chatbot_message()

        return "success"

    except Exception as e:
        print(str(e))
        return "error"

    finally:
        if connection:
            connection.close()


@app.route('/search', methods=['POST'])
def search_data():
    search_input = request.form.get('searchInput')
    search_option = request.form.get('searchOption')

    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        db=db_name,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    cursor = conn.cursor()

    # 검색 쿼리 작성 (예: 검색 옵션이 'question'인 경우)
    if search_option == 'question':
        sql = "SELECT data_no, question, answer, gubun FROM chatbot_data WHERE question LIKE %s"
        search_input = f"%{search_input}%"
    cursor.execute(sql, (search_input,))
    # 다른 검색 옵션에 대한 쿼리도 추가할 수 있습니다.

    result = cursor.fetchall()
    cursor.close()
    conn.close()

    return result


@socket_io.on("message")
def handle_message(message):
    print("message : " + message)
    to_client = dict()

    # messageUtil.py의 get_answer 함수를 사용하여 답변 생성
    to_client['message'] = messageUtil.get_answer(message, answer_dict, html_dict)
    to_client['type'] = 'normal'

    send(to_client)
    #send(to_client, broadcast=True)

if __name__ == '__main__':
    socket_io.run(app, host='10.158.2.250', port=5001,allow_unsafe_werkzeug=True, debug=True)

