# database의 데이터들을 백업하고 싶으면 이 쉘스크립트를 실행하면 됩니다.
# 사용자 이름이나 데이터베이스 이름 수정 필요 
pg_dump --clean -U postgres -h localhost -d postgres -p 5432 > mockUpData.sql