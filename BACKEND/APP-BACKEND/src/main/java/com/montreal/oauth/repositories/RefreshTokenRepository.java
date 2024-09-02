package com.montreal.oauth.repositories;

import com.montreal.oauth.helpers.RefreshableCRUDRepository;
import com.montreal.oauth.models.RefreshToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends RefreshableCRUDRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    String getTokenByUserId(long user_id);
}
