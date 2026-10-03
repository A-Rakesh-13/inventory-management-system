package com.stockcheck.service;

import com.stockcheck.dto.ProductCreateUpdateRequest;
import com.stockcheck.dto.ProductDTO;
import com.stockcheck.dto.StockUpdateRequest;
import com.stockcheck.entity.Category;
import com.stockcheck.entity.Product;
import com.stockcheck.exception.BadRequestException;
import com.stockcheck.exception.ResourceNotFoundException;
import com.stockcheck.repository.CategoryRepository;
import com.stockcheck.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockHistoryService stockHistoryService;
    private final NotificationService notificationService;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          StockHistoryService stockHistoryService,
                          NotificationService notificationService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.stockHistoryService = stockHistoryService;
        this.notificationService = notificationService;
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapToDTO(product);
    }

    public List<ProductDTO> searchProducts(String query, Long categoryId) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return productRepository.searchProducts(cleanQuery, categoryId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getLowStockProducts() {
        return productRepository.findByQuantityLessThanEqualOrderByQuantityAsc(5).stream()
                .filter(p -> p.getQuantity() > 0)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getOutOfStockProducts() {
        return productRepository.findByQuantityEquals(0).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateUpdateRequest request, String user) {
        if (productRepository.existsBySku(request.getSku().trim())) {
            throw new BadRequestException("A product with SKU '" + request.getSku() + "' already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand() != null ? request.getBrand().trim() : null);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setSku(request.getSku().trim().toUpperCase());
        product.setImageUrl(request.getImageUrl());
        product.setLocation(request.getLocation().trim());
        product.setCategory(category);

        Product saved = productRepository.save(product);

        // Record initial stock creation in history
        if (saved.getQuantity() > 0) {
            stockHistoryService.recordChange(
                    saved,
                    0,
                    saved.getQuantity(),
                    com.stockcheck.entity.StockChangeReason.STOCK_REPLENISHMENT,
                    user != null ? user : "System"
            );
        }

        return mapToDTO(saved);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateUpdateRequest request, String user) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        if (productRepository.existsBySkuAndIdNot(request.getSku().trim(), id)) {
            throw new BadRequestException("Another product already exists with SKU: " + request.getSku());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        int oldQuantity = product.getQuantity();

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand() != null ? request.getBrand().trim() : null);
        product.setPrice(request.getPrice());
        product.setSku(request.getSku().trim().toUpperCase());
        product.setImageUrl(request.getImageUrl());
        product.setLocation(request.getLocation().trim());
        product.setCategory(category);

        // If quantity is modified via edit form
        if (request.getQuantity() != null && !request.getQuantity().equals(oldQuantity)) {
            product.setQuantity(request.getQuantity());
            stockHistoryService.recordChange(
                    product,
                    oldQuantity,
                    request.getQuantity(),
                    com.stockcheck.entity.StockChangeReason.MANUAL_CORRECTION,
                    user != null ? user : "System"
            );

            if (oldQuantity == 0 && request.getQuantity() > 0) {
                notificationService.checkAndTriggerNotifications(product);
            }
        }

        Product updated = productRepository.save(product);
        return mapToDTO(updated);
    }

    @Transactional
    public ProductDTO updateStock(Long id, StockUpdateRequest request, String user) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        int prevQty = product.getQuantity();
        int newQty;

        if (request.getNewQuantity() != null) {
            newQty = request.getNewQuantity();
        } else if (request.getChangeAmount() != null) {
            newQty = prevQty + request.getChangeAmount();
        } else {
            throw new BadRequestException("Either 'newQuantity' or 'changeAmount' must be provided.");
        }

        if (newQty < 0) {
            throw new BadRequestException("Stock quantity cannot be reduced below zero. Current stock: " + prevQty);
        }

        if (newQty == prevQty) {
            return mapToDTO(product);
        }

        product.setQuantity(newQty);
        Product saved = productRepository.save(product);

        stockHistoryService.recordChange(
                saved,
                prevQty,
                newQty,
                request.getReason(),
                user != null ? user : "System"
        );

        if (prevQty == 0 && newQty > 0) {
            notificationService.checkAndTriggerNotifications(saved);
        }

        return mapToDTO(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        productRepository.delete(product);
    }

    public ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setAvailabilityStatus(product.getAvailabilityStatus());
        dto.setSku(product.getSku());
        dto.setImageUrl(product.getImageUrl());
        dto.setLocation(product.getLocation());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}
