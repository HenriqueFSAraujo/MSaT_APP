package com.montreal.security.oauth.security;

import java.util.Base64;

public class GenerationPassword {

    public static void main(String[] args) {
        String password = "123456";
        String encodedString = Base64.getEncoder().encodeToString(password.getBytes());
        System.out.println(encodedString);
    }

}
