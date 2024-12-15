1. db 생성
    ```sql
    create database book_shop;
    ```
2. users 테이블 생성
    ```sql
    CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(45) NOT NULL
    );
    ```
3. books 테이블 생성
    ```sql
    CREATE TABLE books (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(45) NOT NULL,
        img INT,
        category_id INT NOT NULL,
        form VARCHAR(45) NOT NULL,
        isbn VARCHAR(45) NOT NULL UNIQUE,
        summary VARCHAR(500),
        detail LONGTEXT,
        author VARCHAR(45),
        pages INT NOT NULL,
        contents LONGTEXT,
        price INT NOT NULL,
        pub_date DATE
    );
    ```

4. categories 테이블 생성
    ```sql
    CREATE TABLE categories (
        id INT NOT NULL PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL
    );
    ```

5. 카테고리 아이디 외래 키 설정
    ```sql
    /*인덱스 추가*/
    ALTER TABLE 'Bookshop'.'books'
    ADD INDEX 'category_id_idx' {'category_id' ASC } VISIBLE;

    /*외래 키 추가*/
    ALTER TABLE 'Bookshop'.'books'
    ADD CONSTRAINT 'category_id'
    FOREIGN KEY {'category_id'}
    REFERENCES 'Bookshop'.'category' {'id'}
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    ```