#python package install
pip install flask
pip install flask_socketio
pip install pymysql


#mysql setup
1. create db
CREATE DATABASE mydb;

2. create user
CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'%';
FLUSH PRIVILEGES;

3. create table
CREATE TABLE `mydb`.`simple_bot` (
  `data_no` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `gubun` varchar(10) NOT NULL,
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`data_no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

4. insert sample data
INSERT INTO tmp.simple_bot
(data_no, question, answer, gubun, insert_time)
VALUES(1, '파티션 생성', 'https://codingmin.tistory.com/21', 'web', '2024-03-29 07:56:40.0');
INSERT INTO tmp.simple_bot
(data_no, question, answer, gubun, insert_time)
VALUES(2, 'GPG', 'https://codingmin.tistory.com/17', 'web', '2024-03-29 07:59:45.0');
INSERT INTO tmp.simple_bot
(data_no, question, answer, gubun, insert_time)
VALUES(3, 'scp ', 'https://codingmin.tistory.com/9', 'web', '2024-04-03 04:55:07.0');
INSERT INTO tmp.simple_bot
(data_no, question, answer, gubun, insert_time)
VALUES(4, 'mysql 용량확인', 'https://codingmin.tistory.com/7', 'web', '2024-04-03 04:56:07.0');
INSERT INTO tmp.simple_bot
(data_no, question, answer, gubun, insert_time)
VALUES(5, '제작자', '김동현', 'txt', '2024-04-03 04:57:18.0');


#edit config.ini
1.write db info at conifg.ini 