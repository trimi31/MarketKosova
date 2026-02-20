package com.marketkosova.repository;

import com.marketkosova.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Listing> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);

    List<Listing> findAllByOrderByCreatedAtDesc();

    @Query("SELECT l FROM Listing l WHERE " +
            "LOWER(l.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(l.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Listing> searchListings(@Param("query") String query);
}
