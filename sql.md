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
    ADD INDEX fk_books_category_id_idx (category_id ASC) VISIBLE;

    /*외래 키 추가*/
    ALTER TABLE books
    ADD CONSTRAINT fk_books_category_category_id
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
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

    /*외래 키 추가*/
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

8. cart_items 테이블 생성
    ```sql
    CREATE TABLE cart_items (
        id INTEGER NOT NULL PRIMARY KEY,
        book_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
    );
    ```

9. 장바구니 외래 키 설정
    ```sql
    /*인덱스 추가*/
    ALTER TABLE cart_items
    ADD INDEX cart_items_book_id_idx (book_id ASC) VISIBLE,
    ADD INDEX cart_items_user_id_idx (user_id ASC) VISIBLE;

    /*외래 키 추가*/
    ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_books_id
    FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_cart_items_users_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    ```

10. delivery 테이블 생성
    ```sql
    CREATE TABLE delivery (
        id INTEGER NOT NULL PRIMARY KEY,
        address VARCHAR(500) NOT NULL,
        receiver VARCHAR(45) NOT NULL,
        contact VARCHAR(45) NOT NULL,
    );
    ```

11. orders 테이블 생성
    ```sql
    CREATE TABLE orders (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        book_title VARCHAR(45) NOT NULL,
        total_quantity INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        user_id INTEGER NOT NULL,
        delivery_id INTEGER NOT NULL
    );
    ```

12. ordered_book 테이블 생성
    ```sql
    CREATE TABLE ordered_book (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        order_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL
    );
    ```

13. 주문하기 외래 키 설정
    ```sql
    /*인덱스 추가*/
    ALTER TABLE orders
    ADD INDEX fk_orders_users_id_idx (user_id ASC) VISIBLE,
    ADD INDEX fk_orders_delivery_id_idx (delivery_id ASC) VISIBLE;

    /*외래 키 추가*/
    ALTER TABLE orders
    ADD CONSTRAINT fk_orders_users_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_orders_delivery_id
    FOREIGN KEY (delivery_id)
    REFERENCES delivery(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    ```

14. 주문 책 외래 키 설정
    ```sql
    /*인덱스 추가*/
    ALTER TABLE ordered_book
    ADD INDEX fk_ordered_book_orders_id_idx (order_id ASC) VISIBLE,
    ADD INDEX fk_ordered_book_books_id_idx (book_id ASC) VISIBLE;

    /*외래 키 추가*/
    ALTER TABLE ordered_book
    ADD CONSTRAINT fk_ordered_book_orders_id
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_ordered_book_books_id
    FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    ```