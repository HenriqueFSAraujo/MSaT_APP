package com.montreal.security.oauth.api;

import com.montreal.security.oauth.api.dto.RegisterClientOauth2DTO;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "register-client-oauth2", produces = MediaType.APPLICATION_JSON_VALUE)
public interface IRegisteredClientApi {

    @PostMapping
    RegisterClientOauth2DTO createClientOauth2(@RequestBody @Valid RegisterClientOauth2DTO request);

}
