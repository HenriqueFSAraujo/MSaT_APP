package com.montreal.oauth.helpers;


import com.montreal.oauth.models.UserInfo;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.montreal.oauth.models.UserRole;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails extends UserInfo implements UserDetails {

    private final String username;
    private final String password;
    private final String fullname;
    private final boolean isEnabled;
    private final String link;
    private final Timestamp resetAt;
    private final boolean isReset;
    Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(UserInfo byUsername) {
        this.username = byUsername.getUsername();
        this.password= byUsername.getPassword();
        this.fullname= byUsername.getFullname();
        this.isEnabled= byUsername.getIsEnabled();
        this.isReset= byUsername.getIsReset();
        this.link= byUsername.getLink();
        this.resetAt= byUsername.getResetAt();
        List<GrantedAuthority> auths = new ArrayList<>();
        for(UserRole role : byUsername.getRoles()){
          auths.add(new SimpleGrantedAuthority(role.getName().toUpperCase()));
        }
        this.authorities = auths;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getFullname() {
        return fullname;
    }


    @Override
    public boolean getIsEnabled() {
        return isEnabled;
    }



    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }


}
