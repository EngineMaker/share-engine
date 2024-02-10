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

-- サンプルデータの挿入
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
INSERT INTO groups (name) VALUES ('Group1'), ('Group2');
INSERT INTO user_groups (user_id, group_id, is_admin) VALUES (1, 1, TRUE), (2, 2, FALSE);
