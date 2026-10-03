package com.stockcheck.config;

import com.stockcheck.entity.*;
import com.stockcheck.repository.CategoryRepository;
import com.stockcheck.repository.ProductRepository;
import com.stockcheck.repository.StockHistoryRepository;
import com.stockcheck.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final StockHistoryRepository stockHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           StockHistoryRepository stockHistoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.stockHistoryRepository = stockHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndProducts();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            logger.info("Seeding default administrative and staff users...");
            userRepository.save(new User("Store Admin", "admin@stockcheck.com", passwordEncoder.encode("admin123"), "ADMIN"));
            userRepository.save(new User("Inventory Manager", "manager@stockcheck.com", passwordEncoder.encode("manager123"), "MANAGER"));
            userRepository.save(new User("Floor Staff", "staff@stockcheck.com", passwordEncoder.encode("staff123"), "STAFF"));
            logger.info("Users seeded successfully.");
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            logger.info("Seeding categories and realistic retail inventory...");

            Category pharmacy = categoryRepository.save(new Category("Pharmacy & Health", "Prescription medicines, over-the-counter pain relief, vitamins, and first aid supplies."));
            Category dairy = categoryRepository.save(new Category("Dairy & Eggs", "Fresh farm milk, artisanal cheeses, organic eggs, butter, and cultured yogurts."));
            Category groceries = categoryRepository.save(new Category("Groceries & Grains", "Daily staples including long-grain basmati rice, lentils, flours, pulses, and cooking oils."));
            Category beverages = categoryRepository.save(new Category("Beverages & Drinks", "Refreshing juices, mineral water, roasted coffee beans, premium teas, and sodas."));
            Category personalCare = categoryRepository.save(new Category("Personal Care & Hygiene", "Soaps, organic shampoos, oral care, antibacterial hand sanitizers, and skincare."));
            Category snacks = categoryRepository.save(new Category("Snacks & Bakery", "Freshly baked artisanal bread, gourmet cookies, savory crackers, and premium dark chocolates."));
            Category produce = categoryRepository.save(new Category("Fruits & Vegetables", "Farm-fresh seasonal fruits, crisp organic greens, and daily culinary vegetables."));
            Category household = categoryRepository.save(new Category("Household Essentials", "Surface cleaners, laundry detergents, trash bags, paper towels, and kitchen essentials."));

            List<Product> products = new ArrayList<>();

            // Pharmacy & Health
            products.add(createProd("Paracetamol 500mg Tablets", "Fast and effective relief for headaches, fevers, muscle aches, and mild-to-moderate pain.", "Calpol Health", new BigDecimal("45.00"), 24, "PHARM-PARA-500", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80", "Aisle 1 - Pharmacy Counter Bay A", pharmacy));
            products.add(createProd("Ibuprofen 200mg Capsules", "Anti-inflammatory non-steroidal relief for body pains, dental aches, and joint stiffness.", "Advil Care", new BigDecimal("85.00"), 4, "PHARM-IBU-200", "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80", "Aisle 1 - Shelf 2B", pharmacy));
            products.add(createProd("Vitamin C 1000mg Effervescent", "Immune support orange-flavored effervescent tablets with added Zinc.", "VitaBoost", new BigDecimal("299.00"), 0, "PHARM-VITC-1000", "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80", "Aisle 1 - Supplement Rack 3", pharmacy));

            // Dairy & Eggs
            products.add(createProd("Organic Whole Milk 1L", "Pasteurized homogenized full-cream organic cow milk sourced from local dairy farms.", "FarmFresh Dairy", new BigDecimal("68.00"), 32, "DAIRY-MILK-1L", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80", "Aisle 4 - Chilled Refrigerator Bay 1", dairy));
            products.add(createProd("Authentic Greek Yogurt 400g", "Thick, high-protein traditional unsweetened strained yogurt.", "Olympus Kitchen", new BigDecimal("180.00"), 3, "DAIRY-YOG-400", "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80", "Aisle 4 - Dairy Rack 2", dairy));
            products.add(createProd("Free Range Brown Eggs (Pack of 12)", "Grade-A pasture-raised hormone-free brown eggs.", "GoldenMeadow", new BigDecimal("140.00"), 18, "DAIRY-EGG-12", "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80", "Aisle 4 - Shelf 1A", dairy));

            // Groceries & Grains
            products.add(createProd("Royal Basmati Rice 5kg", "Aged extra-long grain fragrant basmati rice perfect for biryanis and daily dining.", "Royal Heritage", new BigDecimal("540.00"), 14, "GROC-RICE-5KG", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80", "Aisle 6 - Grains Pallet 3", groceries));
            products.add(createProd("Cold Pressed Extra Virgin Olive Oil 1L", "First cold-pressed Mediterranean extra virgin olive oil for salads and cooking.", "Terra Bella", new BigDecimal("890.00"), 2, "GROC-OIL-1L", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80", "Aisle 6 - Oils Shelf 4C", groceries));

            // Beverages & Drinks
            products.add(createProd("Arabica Espresso Whole Coffee Beans 500g", "Medium-dark roast single origin specialty coffee beans with rich aroma.", "Artisan Roast", new BigDecimal("650.00"), 11, "BEV-COFF-500G", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80", "Aisle 3 - Hot Beverages Shelf 1", beverages));
            products.add(createProd("Sparkling Natural Spring Water 750ml", "Naturally carbonated mineral water bottled at the source.", "Alpine Pure", new BigDecimal("95.00"), 0, "BEV-WATR-750ML", "https://images.unsplash.com/photo-1559839914-ba2ac6790e55?w=600&auto=format&fit=crop&q=80", "Aisle 3 - Chilled Drinks Bay 2", beverages));

            // Personal Care & Hygiene
            products.add(createProd("Botanical Moisturizing Hand Wash 300ml", "Antibacterial gentle liquid soap infused with aloe vera and tea tree extract.", "PureBotanics", new BigDecimal("175.00"), 20, "CARE-SOAP-300", "https://images.unsplash.com/photo-1608248597359-5633b497a7a2?w=600&auto=format&fit=crop&q=80", "Aisle 2 - Personal Care Bay 3", personalCare));

            // Snacks & Bakery
            products.add(createProd("Sourdough Artisan Country Loaf", "Naturally fermented rustic sourdough loaf with a blistered crust and open crumb.", "The Oven House", new BigDecimal("120.00"), 5, "BAKE-SOUR-01", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", "Bakery Counter - Basket 2", snacks));
            products.add(createProd("70% Dark Single-Origin Chocolate 100g", "Bean-to-bar dark chocolate with notes of wild berries and vanilla.", "Cacao Noir", new BigDecimal("210.00"), 15, "SNAK-CHOC-70", "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80", "Aisle 5 - Confectionery Stand A", snacks));

            for (Product p : products) {
                Product saved = productRepository.save(p);
                if (saved.getQuantity() > 0) {
                    stockHistoryRepository.save(new StockHistory(
                            saved,
                            0,
                            saved.getQuantity(),
                            saved.getQuantity(),
                            StockChangeReason.STOCK_REPLENISHMENT,
                            "Initial Stocking"
                    ));
                }
            }

            logger.info("Successfully seeded {} products and initial stock history records.", products.size());
        }
    }

    private Product createProd(String name, String desc, String brand, BigDecimal price, int qty, String sku, String img, String loc, Category cat) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setBrand(brand);
        p.setPrice(price);
        p.setQuantity(qty);
        p.setSku(sku);
        p.setImageUrl(img);
        p.setLocation(loc);
        p.setCategory(cat);
        return p;
    }
}
