# StockCheck

> **"Find products before you visit the store."**

StockCheck is a modern product availability platform designed to bridge the gap between physical retail store inventory and customers. Rather than an e-commerce or delivery platform, StockCheck empowers shoppers to check real-time product availability, stock quantities, aisle/shelf locations, and update timestamps before visiting a store.

---

## Architecture Overview

```
StockCheck/
├── frontend/          # React.js + Vite + Tailwind CSS / Vanilla CSS modern retail UI
├── backend/           # Java 21 + Spring Boot 3 + Spring Data JPA + Spring Security REST API
├── database/          # MySQL schema (DDL) and realistic seed datasets
├── docs/              # Architecture diagrams, API specs, and technical documentation
└── README.md          # Project documentation and setup guide
```

## Core Features

- **Product Discovery & Search**: Fast multi-attribute search across names, categories, brands, and SKUs.
- **Dynamic Stock Availability**:
  - `IN_STOCK`: Quantity > 5 (Green)
  - `LOW_STOCK`: Quantity 1 - 5 (Yellow/Orange)
  - `OUT_OF_STOCK`: Quantity = 0 (Red)
- **Precise In-Store Location**: Find the exact aisle, shelf, or department counter.
- **Stock Audit History**: Atomic logging of every quantity change with reason codes and staff attribution.
- **Notify Me**: Queue customer interest notifications when out-of-stock items are replenished.
- **Role-Based Admin Portal**: Secure management for `ADMIN`, `MANAGER`, and `STAFF`.
