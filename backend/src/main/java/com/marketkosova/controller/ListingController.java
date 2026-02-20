package com.marketkosova.controller;

import com.marketkosova.dto.ListingRequest;
import com.marketkosova.dto.ListingResponse;
import com.marketkosova.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public ResponseEntity<List<ListingResponse>> getAllListings(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(listingService.searchListings(search));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(listingService.getListingsByCategory(categoryId));
        }
        return ResponseEntity.ok(listingService.getAllListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListingById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyListings(Authentication authentication) {
        return ResponseEntity.ok(listingService.getListingsByUser(authentication.getName()));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingResponse> createListing(
            @Valid @ModelAttribute ListingRequest request,
            @RequestParam(value = "imageFile", required = false) MultipartFile image,
            Authentication authentication) {
        return ResponseEntity.ok(listingService.createListing(request, image, authentication.getName()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingResponse> updateListing(
            @PathVariable Long id,
            @Valid @ModelAttribute ListingRequest request,
            @RequestParam(value = "imageFile", required = false) MultipartFile image,
            Authentication authentication) {
        return ResponseEntity.ok(listingService.updateListing(id, request, image, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        listingService.deleteListing(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok().build();
    }
}
