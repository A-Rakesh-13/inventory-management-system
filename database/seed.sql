-- ========================================================
-- StockCheck Seed Data
-- ========================================================

USE stockcheck_db;

-- 1. Initial Users (Passwords: 'admin123', 'manager123', 'staff123' hashed with BCrypt)
-- Hash for 'password123': $2a$10$VvVshwR0P07p1mZ/r4l8gOSKx6iP5g.B3L2ZlZ8FhU2bJ4sR9p1C2
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Store Admin', 'admin@stockcheck.com', '$2a$10$w3vPfqkF2eWqNfU0yE2RkeD5l2zX9GZt7W1i5p1y4r3x7e8t9y0u.', 'ADMIN', NOW()),
(2, 'Inventory Manager', 'manager@stockcheck.com', '$2a$10$w3vPfqkF2eWqNfU0yE2RkeD5l2zX9GZt7W1i5p1y4r3x7e8t9y0u.', 'MANAGER', NOW()),
(3, 'Floor Staff', 'staff@stockcheck.com', '$2a$10$w3vPfqkF2eWqNfU0yE2RkeD5l2zX9GZt7W1i5p1y4r3x7e8t9y0u.', 'STAFF', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Initial Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Pharmacy & Health', 'Prescription medicines, over-the-counter pain relief, vitamins, and first aid supplies.'),
(2, 'Dairy & Eggs', 'Fresh farm milk, artisanal cheeses, organic eggs, butter, and cultured yogurts.'),
(3, 'Groceries & Grains', 'Daily staples including long-grain basmati rice, lentils, flours, pulses, and cooking oils.'),
(4, 'Beverages & Drinks', 'Refreshing juices, mineral water, roasted coffee beans, premium teas, and sodas.'),
(5, 'Personal Care & Hygiene', 'Soaps, organic shampoos, oral care, antibacterial hand sanitizers, and skincare.'),
(6, 'Snacks & Bakery', 'Freshly baked artisanal bread, gourmet cookies, savory crackers, and premium dark chocolates.'),
(7, 'Fruits & Vegetables', 'Farm-fresh seasonal fruits, crisp organic greens, and daily culinary vegetables.'),
(8, 'Household Essentials', 'Surface cleaners, laundry detergents, trash bags, paper towels, and kitchen essentials.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Realistic Products with In-Store Locations and Stock Quantities
INSERT INTO products (id, name, description, brand, price, quantity, sku, image_url, location, category_id, created_at, updated_at) VALUES
-- Pharmacy & Health
(1, 'Paracetamol 500mg Tablets', 'Fast and effective relief for headaches, fevers, muscle aches, and mild-to-moderate pain.', 'Calpol Health', 45.00, 24, 'PHARM-PARA-500', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', 'Aisle 1 - Pharmacy Counter Bay A', 1, NOW(), NOW()),
(2, 'Ibuprofen 200mg Capsules', 'Anti-inflammatory non-steroidal relief for body pains, dental aches, and joint stiffness.', 'Advil Care', 85.00, 4, 'PHARM-IBU-200', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', 'Aisle 1 - Shelf 2B', 1, NOW(), NOW()),
(3, 'Vitamin C 1000mg Effervescent', 'Immune support orange-flavored effervescent tablets with added Zinc.', 'VitaBoost', 299.00, 0, 'PHARM-VITC-1000', 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80', 'Aisle 1 - Supplement Rack 3', 1, NOW(), NOW()),

-- Dairy & Eggs
(4, 'Organic Whole Milk 1L', 'Pasteurized homogenized full-cream organic cow milk sourced from local dairy farms.', 'FarmFresh Dairy', 68.00, 32, 'DAIRY-MILK-1L', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80', 'Aisle 4 - Chilled Refrigerator Bay 1', 2, NOW(), NOW()),
(5, 'Authentic Greek Yogurt 400g', 'Thick, high-protein traditional unsweetened strained yogurt.', 'Olympus Kitchen', 180.00, 3, 'DAIRY-YOG-400', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80', 'Aisle 4 - Dairy Rack 2', 2, NOW(), NOW()),
(6, 'Free Range Brown Eggs (Pack of 12)', 'Grade-A pasture-raised hormone-free brown eggs.', 'GoldenMeadow', 140.00, 18, 'DAIRY-EGG-12', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', 'Aisle 4 - Shelf 1A', 2, NOW(), NOW()),

-- Groceries & Grains
(7, 'Royal Basmati Rice 5kg', 'Aged extra-long grain fragrant basmati rice perfect for biryanis and daily dining.', 'Royal Heritage', 540.00, 14, 'GROC-RICE-5KG', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'Aisle 6 - Grains Pallet 3', 3, NOW(), NOW()),
(8, 'Cold Pressed Extra Virgin Olive Oil 1L', 'First cold-pressed Mediterranean extra virgin olive oil for salads and cooking.', 'Terra Bella', 890.00, 2, 'GROC-OIL-1L', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', 'Aisle 6 - Oils Shelf 4C', 3, NOW(), NOW()),

-- Beverages & Drinks
(9, 'Arabica Espresso Whole Coffee Beans 500g', 'Medium-dark roast single origin specialty coffee beans with chocolate notes.', 'Artisan Roast', 650.00, 11, 'BEV-COFF-500G', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80', 'Aisle 3 - Hot Beverages Shelf 1', 4, NOW(), NOW()),
(10, 'Sparkling Natural Spring Water 750ml', 'Naturally carbonated mineral water bottled at the source.', 'Alpine Pure', 95.00, 0, 'BEV-WATR-750ML', 'https://images.unsplash.com/photo-1559839914-ba2ac6790e55?w=600&auto=format&fit=crop&q=80', 'Aisle 3 - Chilled Drinks Bay 2', 4, NOW(), NOW()),

-- Personal Care & Hygiene
(11, 'Botanical Moisturizing Hand Wash 300ml', 'Antibacterial gentle liquid soap infused with aloe vera and tea tree extract.', 'PureBotanics', 175.00, 20, 'CARE-SOAP-300', 'https://images.unsplash.com/photo-1608248597359-5633b497a7a2?w=600&auto=format&fit=crop&q=80', 'Aisle 2 - Personal Care Bay 3', 5, NOW(), NOW()),

-- Snacks & Bakery
(12, 'Sourdough Artisan Country Loaf', 'Naturally fermented rustic sourdough loaf with a blistered crust and open crumb.', 'The Oven House', 120.00, 5, 'BAKE-SOUR-01', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'Bakery Counter - Basket 2', 6, NOW(), NOW()),
(13, '70% Dark Single-Origin Chocolate 100g', 'Bean-to-bar dark chocolate with notes of wild berries and vanilla.', 'Cacao Noir', 210.00, 15, 'SNAK-CHOC-70', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80', 'Aisle 5 - Confectionery Stand A', 6, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Initial Stock History Audit Logs
INSERT INTO stock_history (id, product_id, previous_quantity, new_quantity, change_amount, reason, changed_by, created_at) VALUES
(1, 1, 0, 24, 24, 'STOCK_REPLENISHMENT', 'Store Admin', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 2, 10, 4, -6, 'SALE', 'Floor Staff', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(3, 3, 5, 0, -5, 'SALE', 'Floor Staff', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(4, 4, 12, 32, 20, 'STOCK_REPLENISHMENT', 'Inventory Manager', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(5, 5, 8, 3, -5, 'SALE', 'Floor Staff', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(6, 12, 10, 5, -5, 'SALE', 'Floor Staff', DATE_SUB(NOW(), INTERVAL 10 MINUTE))
ON DUPLICATE KEY UPDATE reason=VALUES(reason);
