package com.marketkosova.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private String image;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;
    private Long categoryId;
    private String categoryName;
}
