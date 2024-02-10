CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_groups (
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (group_id) REFERENCES groups (id)
);

-- items テーブルの作成
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url1 VARCHAR(255) NOT NULL,
    image_url2 VARCHAR(255),
    image_url3 VARCHAR(255),
    image_url4 VARCHAR(255),
    image_url5 VARCHAR(255),
    owner_id INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    price INTEGER DEFAULT 0 NOT NULL,
    precaution TEXT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- group_items テーブルの作成
CREATE TABLE IF NOT EXISTS group_items (
    group_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, item_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- サンプルデータの挿入
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
INSERT INTO groups (name) VALUES ('Group1'), ('Group2');
INSERT INTO user_groups (user_id, group_id, is_admin) VALUES (1, 1, TRUE), (2, 2, FALSE);

-- items テーブルにサンプルデータの挿入
INSERT INTO items (name, description, image_url1, owner_id, status, price, precaution) VALUES
('Item 1', 'Description for Item 1', 'https://placehold.jp/300x200.png', 1, '貸し出し可', 100, '特になし'),
('Item 2', 'Description for Item 2', 'https://placehold.jp/300x200.png', 2, '貸し出し中', 200, '取扱注意');

-- group_items テーブルにサンプルデータの挿入
INSERT INTO group_items (group_id, item_id) VALUES
(1, 1),
(2, 2);