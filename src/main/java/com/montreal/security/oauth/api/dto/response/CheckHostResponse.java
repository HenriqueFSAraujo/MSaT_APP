package com.montreal.security.oauth.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckHostResponse {

    private String hostAddress;
    private LocalDateTime dateTime;
    private String hostName;
    private String version;
    private String profile;

}
