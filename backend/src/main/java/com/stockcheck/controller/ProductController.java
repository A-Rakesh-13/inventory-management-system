package com.stockcheck.controller;

import com.stockcheck.dto.ProductCreateUpdateRequest;
import com.stockcheck.dto.ProductDTO;
import com.stockcheck.dto.StockHistoryDTO;
import com.stockcheck.dto.StockUpdateRequest;
import com.stockcheck.service.ProductService;
import com.stockcheck.service.StockHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final StockHistoryService stockHistoryService;

    public ProductController(ProductService productService, StockHistoryService stockHistoryService) {
        this.productService = productService;
        this.stockHistoryService = stockHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(productService.searchProducts(query, categoryId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<ProductDTO>> getOutOfStockProducts() {
        return ResponseEntity.ok(productService.getOutOfStockProducts());
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateUpdateRequest request,
                                                    Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "Admin";
        ProductDTO created = productService.createProduct(request, username);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                    @Valid @RequestBody ProductCreateUpdateRequest request,
                                                    Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "Admin";
        ProductDTO updated = productService.updateProduct(id, request, username);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductDTO> updateStock(@PathVariable Long id,
                                                  @Valid @RequestBody StockUpdateRequest request,
                                                  Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "Staff";
        ProductDTO updated = productService.updateStock(id, request, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stock-history")
    public ResponseEntity<List<StockHistoryDTO>> getProductStockHistory(@PathVariable Long id) {
        return ResponseEntity.ok(stockHistoryService.getHistoryForProduct(id));
    }
}
