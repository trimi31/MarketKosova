package com.marketkosova.service;

import com.marketkosova.dto.ListingRequest;
import com.marketkosova.dto.ListingResponse;
import com.marketkosova.entity.Category;
import com.marketkosova.entity.Listing;
import com.marketkosova.entity.User;
import com.marketkosova.repository.CategoryRepository;
import com.marketkosova.repository.ListingRepository;
import com.marketkosova.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    public List<ListingResponse> getAllListings() {
        return listingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ListingResponse getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        return mapToResponse(listing);
    }

    public List<ListingResponse> getListingsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return listingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ListingResponse> getListingsByCategory(Long categoryId) {
        return listingRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ListingResponse> searchListings(String query) {
        return listingRepository.searchListings(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ListingResponse createListing(ListingRequest request, MultipartFile image, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String imageFilename = fileStorageService.storeFile(image);

        Listing listing = Listing.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .location(request.getLocation())
                .image(imageFilename)
                .user(user)
                .category(category)
                .build();

        listing = listingRepository.save(listing);
        return mapToResponse(listing);
    }

    public ListingResponse updateListing(Long id, ListingRequest request, MultipartFile image, String username) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this listing");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setLocation(request.getLocation());
        listing.setCategory(category);

        if (image != null && !image.isEmpty()) {
            // Delete old image
            fileStorageService.deleteFile(listing.getImage());
            // Store new image
            String imageFilename = fileStorageService.storeFile(image);
            listing.setImage(imageFilename);
        }

        listing = listingRepository.save(listing);
        return mapToResponse(listing);
    }

    public void deleteListing(Long id, String username, boolean isAdmin) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!isAdmin && !listing.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this listing");
        }

        fileStorageService.deleteFile(listing.getImage());
        listingRepository.delete(listing);
    }

    private ListingResponse mapToResponse(Listing listing) {
        return ListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .location(listing.getLocation())
                .image(listing.getImage())
                .createdAt(listing.getCreatedAt())
                .userId(listing.getUser().getId())
                .username(listing.getUser().getUsername())
                .categoryId(listing.getCategory().getId())
                .categoryName(listing.getCategory().getName())
                .build();
    }
}
