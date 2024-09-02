package com.montreal.oauth.controllers;

import com.montreal.core.controllers.exceptionhandler.Problem;
import com.montreal.core.controllers.exceptionhandler.ProblemType;
import com.montreal.core.dtos.email.CheckEmailDTO;
import com.montreal.core.models.exceptions.NegocioException;

import com.montreal.core.models.messages.Message;
import com.montreal.core.models.messages.MessageType;
import com.montreal.core.responses.email.CheckEmailResponse;
import com.montreal.core.services.email.EmailService;
import com.montreal.core.services.messages.MessageService;
import com.montreal.core.services.validation.ValidationService;
import com.montreal.oauth.dtos.*;
import com.montreal.oauth.models.UserInfo;
import com.montreal.oauth.repositories.RefreshTokenRepository;
import com.montreal.oauth.repositories.UserRepository;
import com.montreal.oauth.services.JwtService;
import com.montreal.oauth.services.RefreshTokenService;
import com.montreal.oauth.services.UserService;
import com.montreal.oauth.dtos.*;
import com.montreal.oauth.models.RefreshToken;
import com.montreal.oauth.utils.AesUtils;

import jakarta.validation.ConstraintViolation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/auth")
public class UserController {

    @Value("${montreal.oauth.encryptSecretKey}")
    String encryptSecretKey;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtService jwtService;

    @Autowired
    AesUtils aes = new AesUtils();

    Message msgResponse;
    CheckEmailResponse checkEmailResponse = new CheckEmailResponse();
    ValidationService validation = new ValidationService();

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    private  AuthenticationManager authenticationManager;

    @PostMapping("/user")
    public ResponseEntity<?> saveUser(@RequestBody UserRequest userRequest) {
        try {
            UserResponse userResponse = userService.saveUser(userRequest);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> userResponses = userService.getAllUser();
            return ResponseEntity.ok(userResponses);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile() {
        try {
            UserResponse userResponse = userService.getUser();
            return ResponseEntity.ok().body(userResponse);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/test")
    public String test() {
        try {
            return "Welcome";
        } catch (Exception e) {
            throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao executar o teste", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> AuthenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO) throws Exception {
        String username = aes.decryptString(authRequestDTO.getUsername(), encryptSecretKey);
        String password = aes.decryptString(authRequestDTO.getPassword(), encryptSecretKey);
        String[] usernameArr = username.split("-W-");
        String[] passwordArr = password.split("-W-");
        System.out.println("username: " + usernameArr[1]);
        System.out.println("password: " + passwordArr[1]);

        String usernameEnc = aes.encryptFromString2(usernameArr[1], encryptSecretKey);
        // String passwordEnc = aes.encryptFromString(authRequestDTO.getPassword(), encryptSecretKey);
        // System.out.println("passwordEnc: " + passwordEnc);
        System.out.println("usernameEnc: " + usernameEnc);


        msgResponse = userService.login(usernameArr[1], passwordArr[1]);
        return new ResponseEntity<>(msgResponse, HttpStatusCode.valueOf(msgResponse.getStatus()));

    }

    @PostMapping("/refreshToken")
    public JwtResponseDTO refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO){
        return refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserInfo)
                .map(userInfo -> {
                    String accessToken = null;
                    try {
                        AesUtils aes = new AesUtils();
                        accessToken = aes.encryptFromString(jwtService.GenerateToken(userInfo.getUsername()), encryptSecretKey);
                    } catch (NoSuchPaddingException e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    } catch (NoSuchAlgorithmException e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    } catch (InvalidAlgorithmParameterException e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    } catch (InvalidKeyException e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    } catch (BadPaddingException e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    } catch (IllegalBlockSizeException e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    } catch (Exception e) {
                        throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
                    }
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenRequestDTO.getToken()).build();
                }).orElseThrow(() -> new NegocioException(ProblemType.RECURSO_NAO_ENCONTRADO, "Refresh Token não está no banco de dados"));
    }

    @PostMapping("/check-user-email")
    public ResponseEntity<CheckEmailResponse> checkUserEmail(@RequestBody CheckEmailDTO checkEmail) {

        Set<ConstraintViolation<CheckEmailDTO>> violations = validation.getValidator().validate(checkEmail);

        if (!violations.isEmpty()) {
            List<String> errorMessages = violations.stream().map(ConstraintViolation::getMessage).toList();
            checkEmailResponse.setMessageDefault(400, "BAD_REQUEST", " Requisição realizada com falha ", "verificação de email cadastrado", errorMessages.toString());
            return new ResponseEntity<>(checkEmailResponse, HttpStatus.BAD_REQUEST);
        }

        String email = checkEmail.getEmail();
        UserResponse userInfo = userService.findByEmail(email);

        if (Optional.ofNullable(userInfo).isEmpty()) {
            return new ResponseEntity<>(checkEmailResponse, HttpStatus.BAD_REQUEST);
        }

        checkEmailResponse.setMessageDefault(200 ,"ACCEPTED", "Requisição Realizada com Sucesso", "verificação de email cadastrado", "Email encontra-se cadastrado");
        return new ResponseEntity<>(checkEmailResponse, HttpStatus.ACCEPTED);
    }

    @PostMapping("/password-recovery")
    public ResponseEntity<?> passwordRecovery(@RequestBody CheckEmailDTO checkEmail ) throws Exception {
        checkEmail.setEmail(aes.decryptString(checkEmail.getEmail(), encryptSecretKey));

        Set<ConstraintViolation<CheckEmailDTO>> violations = validation.getValidator().validate(checkEmail);

        if (!violations.isEmpty()) {
            List<String> objects = violations.stream().map(ConstraintViolation::getMessage).toList();
            msgResponse = userService.messageList("erros", objects, MessageType.MSG_BAD_REQUEST, "O email está mal formatado ou não foi informado!");
        } else {
            msgResponse = userService.passwordRecovery(checkEmail.getEmail());
        }

        return new ResponseEntity<>(msgResponse, HttpStatusCode.valueOf(msgResponse.getStatus()));
    }
    @PostMapping("/password-reset")
    public ResponseEntity<?> passwordReset(@RequestBody CheckPasswordResetDTO checkPassword ) throws Exception {

        checkPassword.setEmail(aes.decryptString(checkPassword.getEmail(), encryptSecretKey));
        checkPassword.setPassword(aes.decryptString(checkPassword.getPassword(), encryptSecretKey));
        
        Set<ConstraintViolation<CheckPasswordResetDTO>> violations = validation.getValidator().validate(checkPassword);

        if (!violations.isEmpty()) {
            List<String> objects = violations.stream().map(ConstraintViolation::getMessage).toList();
            msgResponse = userService.messageList("erros", objects, MessageType.MSG_BAD_REQUEST, "A senha está mal formatada ou não foi informada!");
        } else {
            msgResponse = userService.passwordReset(checkPassword.getPassword(), checkPassword.getEmail(), checkPassword.getLink());
        }

        return new ResponseEntity<>(msgResponse, HttpStatusCode.valueOf(msgResponse.getStatus()));
    }

}
