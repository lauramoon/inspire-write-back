CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password VARCHAR(25) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  about VARCHAR(200),
  is_admin BOOLEAN DEFAULT FALSE
);
