package com.montreal.security.oauth.api.impl;

import com.montreal.security.oauth.api.IHostCheckApi;
import com.montreal.security.oauth.api.dto.response.CheckHostResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;

@Slf4j
@Component
@RestController
@RequiredArgsConstructor
public class HostCheckApi implements IHostCheckApi {

    private final Environment environment;

    @Value("${security.version}")
    public String version;

    @Override
    public CheckHostResponse checkHost() throws UnknownHostException {
        String activeProfiles = String.join(",", environment.getActiveProfiles());

        var result = CheckHostResponse.builder()
                .hostAddress( InetAddress.getLocalHost().getHostAddress())
                .dateTime(LocalDateTime.now())
                .hostName(InetAddress.getLocalHost().getHostName())
                .version(version)
                .profile(activeProfiles)
                .build();

        log.info("checkHost -> {}", result);

        return result;
    }

}