package com.montreal.oauth.services;

import com.montreal.core.models.messages.Message;
import com.montreal.core.models.messages.MessageType;
import com.montreal.oauth.dtos.UserRequest;
import com.montreal.oauth.dtos.UserResponse;
import com.montreal.oauth.models.UserInfo;

import java.util.List;

public interface UserService {

    UserResponse saveUser(UserRequest userRequest);
    UserResponse updateUserInfo(UserRequest userRequest);
    UserResponse findByEmail(String email);
    UserResponse getUser();
    Message passwordRecoveryValidation(String key, List<String> objects);
    Message messageList(String key, List<String> objects, MessageType msgType, String details);
    List<UserResponse> getAllUser();
    Message passwordRecovery(String email);
    Message login(String username, String password);
    Message passwordReset(String password, String email, String link);
    void update(UserInfo userInfo);
}
