package com.montreal.oauth.helpers;

import com.montreal.oauth.dtos.UserRequest;
import com.montreal.oauth.dtos.UserResponse;
import com.montreal.oauth.models.RefreshToken;
import com.montreal.oauth.models.UserInfo;
import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@NoRepositoryBean
public class RefreshableCRUDRepositoryImpl<T, ID> extends SimpleJpaRepository<T, ID> implements RefreshableCRUDRepository<T, ID> {

    private final EntityManager entityManager;

    public RefreshableCRUDRepositoryImpl(JpaEntityInformation entityInformation, EntityManager entityManager){
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void flush(){
        entityManager.flush();
    }

    @Override
    @Transactional
    public String getTokenByUserId(long user_id) {
        RefreshToken refreshToken =  entityManager.createQuery("SELECT rt FROM RefreshToken rt JOIN FETCH rt.userInfo ui WHERE ui.id = :user_id", RefreshToken.class)
                .setParameter("user_id", user_id)
                .getResultStream().findFirst().orElse(null);
        if(refreshToken==null) {
            return "";
        } else {
            return refreshToken.getToken();
        }
    }

    @Override
    @Transactional
    public void refresh(T t) {
        entityManager.refresh(t);
    }

    @Override
    @Transactional
    public void refresh(Collection<T> s) {
        for (T t: s){
            entityManager.refresh(t);
        }
    }

    @Override
    @Transactional
    public UserResponse updateUserInfo(UserRequest userRequest) {
        UserInfo userInfo= (UserInfo)entityManager.find(UserInfo.class ,4);
        if (userInfo != null) {
            entityManager
                    .createQuery("update UserInfo set link = \'xxxx\' where id=4")
                    .executeUpdate();

        }
        UserResponse userResponse = new UserResponse();
        return userResponse;
    }
}