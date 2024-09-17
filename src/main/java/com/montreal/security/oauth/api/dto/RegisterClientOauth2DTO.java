package com.montreal.security.oauth.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterClientOauth2DTO {

    @NotBlank
    private String withId;

    @NotBlank
    private String clientId;

    @NotBlank
    private String clientSecret;

    @NotNull
    private Set<String> scopes;

}
