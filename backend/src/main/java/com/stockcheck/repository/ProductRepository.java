package com.stockcheck.repository;

import com.stockcheck.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByQuantityLessThanEqualOrderByQuantityAsc(Integer threshold);

    List<Product> findByQuantityEquals(Integer quantity);

    List<Product> findTop10ByOrderByUpdatedAtDesc();

    @Query("SELECT p FROM Product p WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId)")
    List<Product> searchProducts(@Param("query") String query, @Param("categoryId") Long categoryId);

    long countByQuantityGreaterThan(Integer threshold);

    long countByQuantityBetween(Integer min, Integer max);

    long countByQuantityEquals(Integer quantity);
}
