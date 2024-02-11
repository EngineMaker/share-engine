CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
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
    available BOOLEAN DEFAULT '0' NOT NULL,
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

-- rent_logs テーブルの作成
CREATE TABLE IF NOT EXISTS rent_logs (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    renter_id INTEGER NOT NULL,
    returned BOOLEAN DEFAULT '0',
    returned_at DATE,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (renter_id) REFERENCES users(id)
);

-- 全体のクリア
TRUNCATE TABLE users, groups, user_groups, items, group_items, rent_logs;
-- サンプルデータの挿入
INSERT INTO users (name, hashed_password) VALUES ('tokisaba', '$2b$12$bJuaocGKtxgwCoeTtxAEiOLQY/fpZMr61V/wqGbs1W41uzyz0wNk2'), ('Alice', 'Passw0rd'), ('Bob', 'P4ssword'), ('Mike', 'P4ssw0rd');
INSERT INTO groups (name) VALUES ('EngineMaker新宿'), ('EngineMake成田');
INSERT INTO user_groups (user_id, group_id, is_admin) VALUES (1, 1, TRUE), (2, 2, FALSE), (3, 1, FALSE);

-- items テーブルにサンプルデータの挿入
INSERT INTO items (name, description, image_url1, owner_id, available, price, precaution) VALUES
('Item 1', 'Description for Item 1', 'https://placehold.jp/300x200.png', 1, '0', 100, '特になし'),
('Item 2', 'Description for Item 2', 'https://placehold.jp/300x200.png', 2, '0', 200, '取扱注意'),
('Item 3', 'Description for Item 2', 'https://placehold.jp/300x200.png', 3, '1', 200, '取扱注意'),
('Item 4', 'Description for Item 2', 'https://placehold.jp/300x200.png', 3, '1', 200, '取扱注意');

-- group_items テーブルにサンプルデータの挿入
INSERT INTO group_items (group_id, item_id) VALUES
(1, 1),
(2, 2),
(1, 3),
(1, 4);

-- rent_logs テーブルにサンプルデータの挿入
INSERT INTO rent_logs (item_id, renter_id, returned, returned_at) VALUES
(1, 3, '0', NULL),
(2, 2, '0', NULL);