package com.montreal.security.oauth.domain.service;

import com.montreal.security.oauth.api.dto.RegisterClientOauth2DTO;
import com.montreal.security.oauth.domain.exceptions.InternalErrorException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RegisteredService {

    private final PasswordEncoder passwordEncoder;
    private final RegisteredClientRepository registeredClientRepository;

    public RegisterClientOauth2DTO createRegistered(RegisterClientOauth2DTO request) {

        try {


            RegisteredClient client = RegisteredClient
                    .withId(request.getWithId())
                    .clientId(request.getClientId())
                    .clientSecret(passwordEncoder.encode(request.getClientSecret()))
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                    .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
                    .scopes(scope -> scope.addAll(request.getScopes()))
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofMinutes(25))
                            .build())
                    .clientSettings(ClientSettings.builder()
                            .requireAuthorizationConsent(false)
                            .build())
                    .build();

            registeredClientRepository.save(client);

            return RegisterClientOauth2DTO.builder()
                    .withId(request.getWithId())
                    .clientId(request.getClientId())
                    .clientSecret("***********")
                    .scopes(request.getScopes())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new InternalErrorException(String.format("Falha ao criar clientID - Erro: %s", e.getMessage()));
        }

    }

}
