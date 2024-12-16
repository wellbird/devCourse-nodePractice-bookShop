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
        category_id INT NOT NULL PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL
    );
    ```

5. 카테고리 아이디 외래 키 설정
    ```sql
    /*인덱스 추가*/
    ALTER TABLE books
    ADD INDEX category_id_idx (category_id ASC) VISIBLE;

    /*외래 키 추가*/
    ALTER TABLE books
    ADD CONSTRAINT category_id
    FOREIGN KEY (category_id)
    REFERENCES category(category_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    ```

6. likes 테이블 생성
    ```sql
    CREATE TABLE likes (
        user_id INTEGER
        liked_book_id INTEGER
    );
    ```

7. 좋아요 외래 키 설정
    ```sql
    /*인덱스 추가*/
    ALTER TABLE likes
    ADD INDEX user_id_idx (user_id ASC) VISIBLE,
    ADD INDEX liked_book_id_idx (liked_book_id ASC) VISIBLE;

    /*외래 키 추가가*/
    ALTER TABLE likes
    ADD CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    ADD CONSTRAINT liked_book_id
    FOREIGN KEY (liked_book_id)
    REFERENCES books(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    ```