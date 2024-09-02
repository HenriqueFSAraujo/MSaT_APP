package com.montreal.oauth.dtos;

import com.montreal.oauth.models.UserInfo;
import com.montreal.oauth.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserRequest {
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String password;
    private boolean isEnabled = true;
    private String link = "";
    private boolean isReset = false;
    private Timestamp resetAt = new Timestamp(System.currentTimeMillis());
    private Set<UserRole> roles;




}



