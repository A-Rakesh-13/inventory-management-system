package com.stockcheck.service;

import com.stockcheck.dto.CategoryDTO;
import com.stockcheck.dto.CategoryRequest;
import com.stockcheck.entity.Category;
import com.stockcheck.exception.BadRequestException;
import com.stockcheck.exception.ResourceNotFoundException;
import com.stockcheck.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Category already exists with name: " + request.getName());
        }

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());

        Category saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        categoryRepository.findByNameIgnoreCase(request.getName().trim())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException("Category already exists with name: " + request.getName());
                    }
                });

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());

        Category updated = categoryRepository.save(category);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new BadRequestException("Cannot delete category because it has " + category.getProducts().size() + " associated products.");
        }

        categoryRepository.delete(category);
    }

    public CategoryDTO mapToDTO(Category category) {
        int count = category.getProducts() != null ? category.getProducts().size() : 0;
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription(), count);
    }
}
