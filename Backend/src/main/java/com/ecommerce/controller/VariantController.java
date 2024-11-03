package com.ecommerce.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.dto.variant.VariantCreateRequest;
import com.ecommerce.dto.variant.VariantResponse;
import com.ecommerce.dto.variant.VariantUpdateRequest;
import com.ecommerce.entity.product.Variant;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.service.convert.VariantConvert;
import com.ecommerce.service.variant.VariantService;

@RestController
@RequestMapping("/api/v1/variants")
public class VariantController {

    @Autowired
    private VariantConvert variantConvert;

    @Autowired
    private VariantService variantService;

    @PostMapping("/{productId}")
    public ResponseEntity<VariantResponse> createVariant(@PathVariable UUID productId, @RequestBody VariantCreateRequest request) {
        Variant variant = variantConvert.variantCreateRequestConvert(request);
        Variant savedVariant = variantService.createVariant(productId, variant);
        VariantResponse response = variantConvert.variantConvertToVariantResponse(savedVariant);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<VariantResponse> findVariantById(@PathVariable UUID variantId) {
        Variant variant = variantService.findVariantById(variantId);
        if (variant == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        VariantResponse response = variantConvert.variantConvertToVariantResponse(variant);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<VariantResponse>> findVariantsByProductId(@PathVariable UUID productId) {
        List<Variant> variants = variantService.findVariantsByProductId(productId);
        List<VariantResponse> responses = variants.stream()
                .map(variantConvert::variantConvertToVariantResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{variantId}")
    public ResponseEntity<VariantResponse> updateVariant(@PathVariable UUID variantId, @RequestBody VariantUpdateRequest request, Variant variant) {
        Variant variantToUpdate = variantConvert.vairantUpdateConvert(request, variant);
        Variant updatedVariant = variantService.updateVariant(variantId, variantToUpdate);
        VariantResponse response = variantConvert.variantConvertToVariantResponse(updatedVariant);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{variantId}")
    public ResponseEntity<String> deleteVariant(@PathVariable UUID variantId) {
        try {
            variantService.deleteVariant(variantId);
            return ResponseEntity.ok("Variant deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Variant not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the variant.");
        }
    }
}
