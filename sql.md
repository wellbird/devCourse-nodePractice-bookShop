1. db 생성
    ```sql
    create database book_shop;
    ```
2. users 테이블 생성
    ```sql
    CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(45) NOT NULL,
        password VARCHAR(45) NOT NULL
    );
    ```