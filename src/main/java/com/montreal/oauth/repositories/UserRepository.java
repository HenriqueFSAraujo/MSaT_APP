package com.montreal.oauth.repositories;

import com.montreal.oauth.helpers.RefreshableCRUDRepository;
import com.montreal.oauth.models.UserInfo;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.Optional;


@Repository
public interface UserRepository extends RefreshableCRUDRepository<UserInfo, Long> {

   public UserInfo findByUsername(String username);
   final Timestamp timestamp = new Timestamp(System.currentTimeMillis());

   UserInfo findFirstById(Long id);
   /*
      @Modifying
      @Query("SELECT u FROM UserInfo u WHERE u.email = :email")
      Optional<UserInfo> findByEmail(@Param("email") String email);
      */
   @Query("SELECT u FROM UserInfo u WHERE u.email = :email")
   UserInfo findByEmail(@Param("email") String email);

   @Query("SELECT u FROM UserInfo u WHERE u.id = :id")
   Optional<UserInfo> findFirstByIdUpdatePassword(@Param("id") Long id);

   @Query("SELECT u FROM UserInfo u WHERE u.link = :link")
   UserInfo findLink(@Param("link") String link);


   //@Query("UPDATE UserInfo u SET u.link = :link WHERE u.email = :email")
   //void updateUserInfo(@Param("link") String link, @Param("email") String email);

}
