package com.marketkosova.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String username;
    private String email;
    private String role;
    private Long userId;
}
