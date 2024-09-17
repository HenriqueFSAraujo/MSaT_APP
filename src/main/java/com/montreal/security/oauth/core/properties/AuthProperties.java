package com.montreal.security.oauth.core.properties;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Component
@Validated
@ConfigurationProperties("edp.auth")
public class AuthProperties {

    @NotBlank
    private String providerUri;

    @NotBlank
    private String keyPass;

    @NotBlank
    private String storePass;

    @NotBlank
    private String alias;

    @NotBlank
    private String path;

}
