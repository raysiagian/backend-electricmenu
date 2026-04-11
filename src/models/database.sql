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
	refresh_token TEXT,
	refresh_token_expired TIMESTAMPZ,
	is_deleted BOOLEAN DEFAULT FALSE,
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

CREATE TYPE service_type_enum AS ENUM ('product', 'service');

create table products(
	id int generated always as identity primary key,
	shop_id int not null,
	type_id int,
	product_name varchar(255) not null,
    product_name_normalized VARCHAR(255);
	product_slug varchar(255) not null unique,
	product_image_url text not null,
	price NUMERIC(12,2) NOT NULL,
	service_type service_type_enum,
	stock INT,
	is_deleted BOOLEAN DEFAULT FALSE,
	is_available BOOLEAN DEFAULT TRUE,
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
        ON DELETE SET NULL
);

-- check 


CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_type_id ON products(type_id);



CREATE TYPE order_status_enum AS ENUM ('pending', 'cancelled', 'done');

CREATE TABLE orders(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shop_id INT NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    status order_status_enum DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_order_shop
        FOREIGN KEY (shop_id)
        REFERENCES shops(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE order_items(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_order_products_id ON orders(product_id);

