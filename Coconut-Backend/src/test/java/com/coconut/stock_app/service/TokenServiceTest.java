package com.coconut.stock_app.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TokenServiceTest {

    @Autowired
    private TokenService tokenService;

    @Test
    public void testGetAccessToken() {
        String token = tokenService.getAccessToken();
        System.out.println("Access Token: " + token); // 토큰 출력
        assertNotNull(token, "Access token should not be null");
    }
}
