-- Products, per-size stock and shipping zones, managed from /admin
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  sale_price INTEGER,
  category TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '',
  style TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  model_wears TEXT NOT NULL DEFAULT '',
  collections TEXT NOT NULL DEFAULT '',   -- comma-separated collection slugs
  images TEXT NOT NULL DEFAULT '[]',      -- JSON array of image URLs
  position INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- stock can never go below zero: an order that would oversell fails as a whole
CREATE TABLE product_sizes (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, size)
);

CREATE TABLE shipping_zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  fee INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE order_items ADD COLUMN product_id INTEGER;

-- Seed: Dolly catalogue as of the migration from EasyOrders
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('terra-dress', 'SS26-04', 'Terra Dress', 2500, NULL, 'Dresses', 'Brown', 'Beach coverup dress', 'A timeless dress that combines comfort with sophistication. Designed to take you from golden-hour moments to elegant evening occasions.', 'S-M', 'summer-26', '["https://files.easy-orders.net/1785103536298189901.jpg","https://files.easy-orders.net/1785103856246837105.jpg"]', 0, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S-M', 2, 0 FROM products WHERE slug = 'terra-dress';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('disco-peach-skirt', 'SS26-03', 'Disco Peach Skirt', 1600, NULL, 'Skirts', 'Peach', 'Sparkle chic', 'Your go-to statement piece for parties, concerts, special events, or any occasion where you want to stand out. Pair it with your favourite top and let the sparkle do the talking.', 'S', 'summer-26', '["https://files.easy-orders.net/1784065096672894997.jpeg","https://files.easy-orders.net/1784065095486726476.jpeg","https://files.easy-orders.net/1784065094934580044.jpeg","https://files.easy-orders.net/1784065096179197980.jpeg"]', 1, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S', 2, 0 FROM products WHERE slug = 'disco-peach-skirt';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'M', 0, 1 FROM products WHERE slug = 'disco-peach-skirt';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L', 0, 2 FROM products WHERE slug = 'disco-peach-skirt';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('disco-yellow-skirt', 'SS26-01', 'Disco Yellow Skirt', 1600, NULL, 'Skirts', 'Yellow', 'Sparkle chic', 'Your go-to statement piece for parties, concerts, special events, or any occasion where you want to stand out. Pair it with your favourite top and let the sparkle do the talking.', 'S', 'summer-26', '["https://files.easy-orders.net/1784161093391813443.jpg"]', 2, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S', 2, 0 FROM products WHERE slug = 'disco-yellow-skirt';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'M', 2, 1 FROM products WHERE slug = 'disco-yellow-skirt';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L', 1, 2 FROM products WHERE slug = 'disco-yellow-skirt';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('golden-hour-skirt', 'SS26-02', 'Golden Hour Skirt', 1350, NULL, 'Skirts', 'White', 'Beach coverup skirt', 'An elegant crochet skirt designed to move with ease. Perfect for beach vacations, seaside dinners and warm summer days.', 'S', 'summer-26', '["https://files.easy-orders.net/1785066299906637391.jpeg"]', 3, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S', 1, 0 FROM products WHERE slug = 'golden-hour-skirt';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'M', 2, 1 FROM products WHERE slug = 'golden-hour-skirt';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L', 1, 2 FROM products WHERE slug = 'golden-hour-skirt';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('brown-coat', 'AW25-01', 'The Brown Coat', 2500, 2300, 'Outerwear', 'Rich cocoa', 'Long, oversized maxi coat', 'A timeless staple designed for strength and comfort. This maxi-length coat wraps you in softness, making it an essential piece that symbolises resilience.', 'S-M', 'winter-25', '["https://files.easy-orders.net/1764390252783303731.jpeg","https://files.easy-orders.net/1764412653204733064.jpeg","https://files.easy-orders.net/1764412653225703396.jpeg","https://files.easy-orders.net/1764412653240027722.jpeg","https://files.easy-orders.net/1764412653243861132.jpeg"]', 4, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S-M', 10, 0 FROM products WHERE slug = 'brown-coat';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L-XL', 14, 1 FROM products WHERE slug = 'brown-coat';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('funnel-suede-jacket', 'AW25-02', 'The Funnel Suede Jacket', 2000, NULL, 'Outerwear', 'Jet black', 'Sculpted jacket with a high zip-up funnel neck', 'Structure meets sophistication. The strong lines and distinctive high funnel neck embody confidence and power. Every piece tells a story of modern individuality.', 'S-M', 'winter-25', '["https://files.easy-orders.net/1764390672474292804.jpeg","https://files.easy-orders.net/1764598986864688549.jpeg","https://files.easy-orders.net/1764598986884161783.jpeg","https://files.easy-orders.net/1764598986930492283.jpeg"]', 5, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S-M', 5, 0 FROM products WHERE slug = 'funnel-suede-jacket';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L-XL', 1, 1 FROM products WHERE slug = 'funnel-suede-jacket';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('beige-set', 'AW25-03', 'The Beige Set', 2200, NULL, 'Sets', 'Chalk beige', 'Collarless button-front jacket and wide-leg trousers', 'Elegance in simplicity. This tailored set, featuring the signature button-up blazer, gives a clean silhouette that reflects both grace and confidence. Your starting piece for a new story.', 'S', 'winter-25', '["https://files.easy-orders.net/1764598597164260579.jpeg","https://files.easy-orders.net/1764598653918379881.jpeg","https://files.easy-orders.net/1764598653946120233.jpeg"]', 6, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S', 2, 0 FROM products WHERE slug = 'beige-set';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'M', 4, 1 FROM products WHERE slug = 'beige-set';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L', 3, 2 FROM products WHERE slug = 'beige-set';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('signature-blazer', 'AW25-04', 'The Signature Button-Up Blazer', 1300, NULL, 'Tops', 'Chalk beige', 'Clean, tailored silhouette', 'A tailored top with a signature collarless, button-front design. It reflects grace and confidence.', 'S', 'winter-25', '["https://files.easy-orders.net/1764521855660105949.jpeg","https://files.easy-orders.net/1764521865808217759.jpeg"]', 7, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S', 3, 0 FROM products WHERE slug = 'signature-blazer';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'M', 5, 1 FROM products WHERE slug = 'signature-blazer';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L', 3, 2 FROM products WHERE slug = 'signature-blazer';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('the-trousers', 'AW25-05', 'The Trousers', 1000, NULL, 'Bottoms', 'Chalk beige', 'Straight fit, an even classic width from hip to hem', 'Elegant bottoms designed to keep things simple and balance the tailored top.', 'S', 'winter-25', '["https://files.easy-orders.net/1764521659792579362.jpeg","https://files.easy-orders.net/1764521732590163386.jpeg"]', 8, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S', 3, 0 FROM products WHERE slug = 'the-trousers';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'M', 5, 1 FROM products WHERE slug = 'the-trousers';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L', 3, 2 FROM products WHERE slug = 'the-trousers';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('cape-set-burgundy', 'RS26-01', 'Cape Set Burgundy', 1500, NULL, 'Sets', 'Burgundy', 'Clean, elegant silhouette', 'A two-piece set featuring a flowing cape-style top with a high neckline and matching straight-leg trousers, for an elegant, modest look.', 'S-M', 'ramadan-set,winter-25', '["https://files.easy-orders.net/1771986850687782724.jpeg","https://files.easy-orders.net/1771988622464544279.jpeg","https://files.easy-orders.net/1771988432380216712.jpeg","https://files.easy-orders.net/1771986853780041630.jpeg"]', 9, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S-M', 4, 0 FROM products WHERE slug = 'cape-set-burgundy';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L-XL', 5, 1 FROM products WHERE slug = 'cape-set-burgundy';
INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, position, visible) VALUES ('cape-set-black', 'RS26-02', 'Cape Set Black', 1500, NULL, 'Sets', 'Black', 'Clean, elegant silhouette', 'A two-piece set featuring a flowing cape-style top with a high neckline and matching straight-leg trousers, for an elegant, modest look.', 'S-M', 'ramadan-set,winter-25', '["https://files.easy-orders.net/1771982699387695926.jpeg","https://files.easy-orders.net/1771982699231893648.jpeg","https://files.easy-orders.net/1771982699212640005.jpeg","https://files.easy-orders.net/1771982699233571042.jpeg"]', 10, 1);
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'S-M', 3, 0 FROM products WHERE slug = 'cape-set-black';
INSERT INTO product_sizes (product_id, size, stock, position) SELECT id, 'L-XL', 1, 1 FROM products WHERE slug = 'cape-set-black';
INSERT INTO shipping_zones (name, fee, position) VALUES ('Cairo & Giza', 70, 0);
INSERT INTO shipping_zones (name, fee, position) VALUES ('Alexandria', 80, 1);
INSERT INTO shipping_zones (name, fee, position) VALUES ('Delta & Canal', 90, 2);
INSERT INTO shipping_zones (name, fee, position) VALUES ('Upper Egypt', 110, 3);
INSERT INTO shipping_zones (name, fee, position) VALUES ('Red Sea & Sinai', 130, 4);
