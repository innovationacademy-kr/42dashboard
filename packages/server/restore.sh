#백업해둔 데이터들을 database에 넣고 싶다면 이 쉘스크립트를 실행하면 됩니다.
# 사용자 이름이나 데이터베이스 이름 수정 필요 
pg_dump -U huchoi -h localhost -d postgres < backUp.sql