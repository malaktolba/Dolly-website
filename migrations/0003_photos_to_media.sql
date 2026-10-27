-- Product photos moved from the EasyOrders CDN into Dolly's own storage (KV "MEDIA", served at /media).
-- The files themselves were uploaded with `wrangler kv bulk put`; this records the new links.
UPDATE products SET images = '["/media/products/1785103536298189901.jpg","/media/products/1785103856246837105.jpg"]' WHERE id = 1;
UPDATE products SET images = '["/media/products/1784065096672894997.jpeg","/media/products/1784065095486726476.jpeg","/media/products/1784065094934580044.jpeg","/media/products/1784065096179197980.jpeg"]' WHERE id = 2;
UPDATE products SET images = '["/media/products/1784161093391813443.jpg"]' WHERE id = 3;
UPDATE products SET images = '["/media/products/1785066299906637391.jpeg"]' WHERE id = 4;
UPDATE products SET images = '["/media/products/1764390252783303731.jpeg","/media/products/1764412653204733064.jpeg","/media/products/1764412653225703396.jpeg","/media/products/1764412653240027722.jpeg","/media/products/1764412653243861132.jpeg"]' WHERE id = 5;
UPDATE products SET images = '["/media/products/1764390672474292804.jpeg","/media/products/1764598986864688549.jpeg","/media/products/1764598986884161783.jpeg","/media/products/1764598986930492283.jpeg"]' WHERE id = 6;
UPDATE products SET images = '["/media/products/1764598597164260579.jpeg","/media/products/1764598653918379881.jpeg","/media/products/1764598653946120233.jpeg"]' WHERE id = 7;
UPDATE products SET images = '["/media/products/1764521855660105949.jpeg","/media/products/1764521865808217759.jpeg"]' WHERE id = 8;
UPDATE products SET images = '["/media/products/1764521659792579362.jpeg","/media/products/1764521732590163386.jpeg"]' WHERE id = 9;
UPDATE products SET images = '["/media/products/1771986850687782724.jpeg","/media/products/1771988622464544279.jpeg","/media/products/1771988432380216712.jpeg","/media/products/1771986853780041630.jpeg"]' WHERE id = 10;
UPDATE products SET images = '["/media/products/1771982699387695926.jpeg","/media/products/1771982699231893648.jpeg","/media/products/1771982699212640005.jpeg","/media/products/1771982699233571042.jpeg"]' WHERE id = 11;
