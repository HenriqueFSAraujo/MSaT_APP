package com.montreal.security.oauth.api;

import com.montreal.security.oauth.api.dto.response.CheckHostResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.UnknownHostException;

@RequestMapping(value = "host-check", produces = MediaType.APPLICATION_JSON_VALUE)
public interface IHostCheckApi {

    @GetMapping()
    CheckHostResponse checkHost() throws UnknownHostException;

}
