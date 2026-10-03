# StockCheck System Architecture

## 1. System Overview

StockCheck is a dedicated **Product Availability Platform** enabling retail shoppers to verify inventory levels, unit quantities, in-store aisle locations, and last update timestamps before visiting the physical store.

```
                    +--------------------------------+
                    |        Customer Browser        |
                    |   (Search / Availability /     |
                    |      In-Store Location)        |
                    +---------------+----------------+
                                    |
                                    | HTTPS / REST (Port 5173 -> 8080)
                                    v
+------------------+   +------------------------------------+   +-------------------+
|   Admin Portal   |-->|      Spring Boot REST API          |<--| Spring Security   |
| (Stock, Reports, |   |  - ProductController               |   | - BCrypt Hashing  |
|   Audit Trail)   |   |  - CategoryController              |   | - Role RBAC       |
+------------------+   |  - StockHistoryController          |   | - Token Auth      |
                       |  - DashboardController             |   +-------------------+
                       +-----------------+------------------+
                                         |
                                         | JPA / Hibernate
                                         v
                       +------------------------------------+
                       |          MySQL Database            |
                       | (Users, Categories, Products,      |
                       |  StockHistory, Notifications)      |
                       +------------------------------------+
```

## 2. Dynamic Availability Engine

Availability status is computed dynamically from stock quantity:
* `quantity > 5` : `IN_STOCK` (Green indicator)
* `1 <= quantity <= 5` : `LOW_STOCK` (Yellow / Warning indicator)
* `quantity == 0` : `OUT_OF_STOCK` (Red indicator + "Notify Me" trigger)

Negative quantities are strictly forbidden at the entity and service validation levels.

## 3. Stock Modification Transaction

Every quantity change (sale, replenishment, return, damage write-off) is wrapped in a `@Transactional` boundary that simultaneously updates the product quantity and writes an immutable audit record to `StockHistory`.
