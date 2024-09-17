package com.montreal.security.oauth.api.impl;

import com.montreal.security.oauth.api.IRegisteredClientApi;
import com.montreal.security.oauth.api.dto.RegisterClientOauth2DTO;
import com.montreal.security.oauth.domain.service.RegisteredService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RegisteredClientApi implements IRegisteredClientApi {

    private final RegisteredService service;

    @Override
    public RegisterClientOauth2DTO createClientOauth2(RegisterClientOauth2DTO request) {
        return service.createRegistered(request);
    }

}
