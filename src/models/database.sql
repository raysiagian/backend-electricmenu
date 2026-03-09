create table roles(
	id int generated always as identity primary key,
	role_name varchar(25) not null unique
	
);

insert into roles(role_name)
values
('admin'),
('user');

create table users(
	id int generated always as identity primary key,
	role_id int not null,
	name varchar(255) not null,
	email varchar(255) not null unique,
	password text not null,
	otp_code VARCHAR(10),
	otp_expired TIMESTAMP,
	email_verified BOOLEAN DEFAULT FALSE,
	last_otp_request TIMESTAMP,
	CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


create table shops(
	id int generated always as identity primary key,
	user_id int not null,
	shop_name varchar(255) not null,
	shop_slug varchar(255) not null unique,
	qr_url varchar(255) not null,
	is_deleted BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fk_shops_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
	
)

CREATE INDEX idx_shops_user_id ON shops(user_id);
CREATE INDEX idx_shops_slug ON shops(shop_slug);

create table types(
	id int generated always as identity primary key,
	type_name varchar(255) not null unique
);

create table products(
	id int generated always as identity primary key,
	shop_id int not null,
	type_id int not null,
	product_name varchar(255) not null,
	product_image_url text not null,
	price NUMERIC(12,2) NOT NULL,
	stock int not null check (stock >= 0),
	is_deleted BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fk_product_shop
        FOREIGN KEY (shop_id)
        REFERENCES shops(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

	CONSTRAINT fk_product_type
        FOREIGN KEY (type_id)
        REFERENCES types(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_type_id ON products(type_id);

CREATE TABLE orders(
	id int generated always as identity primary key,
	shop_id INT NOT NULL,
	product_id int not null,
	buyer_name varchar(255) not null,
	total_price NUMERIC(12,2) NOT NULL,,

	CONSTRAINT fk_order_shop
        FOREIGN KEY (shop_id)
        REFERENCES shops(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

	CONSTRAINT fk_order_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_order_products_id ON orders(product_id);

