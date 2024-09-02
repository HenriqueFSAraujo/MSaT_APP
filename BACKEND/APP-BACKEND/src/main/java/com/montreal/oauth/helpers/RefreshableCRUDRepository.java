package com.montreal.oauth.helpers;

import com.montreal.oauth.dtos.UserRequest;
import com.montreal.oauth.dtos.UserResponse;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Collection;

@NoRepositoryBean
public interface RefreshableCRUDRepository<T, ID> extends CrudRepository<T, ID> {

    void refresh(T t);

    void refresh(Collection<T> s);

    void flush();

    UserResponse updateUserInfo(UserRequest userRequest);


    String getTokenByUserId(long user_id);
}
