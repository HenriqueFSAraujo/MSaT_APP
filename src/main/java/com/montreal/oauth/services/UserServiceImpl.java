package com.montreal.oauth.services;

import com.montreal.core.controllers.exceptionhandler.ProblemType;
import com.montreal.core.models.exceptions.NegocioException;
import com.montreal.core.models.messages.Message;
import com.montreal.core.models.messages.MessageType;
import com.montreal.core.services.email.EmailService;
import com.montreal.core.services.messages.MessageService;
import com.montreal.oauth.dtos.JwtResponseDTO;
import com.montreal.oauth.dtos.UserRequest;
import com.montreal.oauth.dtos.UserResponse;
import com.montreal.oauth.models.RefreshToken;
import com.montreal.oauth.models.UserInfo;
import com.montreal.oauth.repositories.UserRepository;
import com.montreal.oauth.utils.AesUtils;
import jakarta.validation.ConstraintViolation;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.lang.reflect.Type;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Value("${montreal.oauth.encryptSecretKey}")
    String encryptSecretKey;

    @Autowired
    private AesUtils aes = new AesUtils();

    @Autowired
    private EmailService emailService = new EmailService();

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    JwtService jwtService;



    Map<String, List<String>> listObj = new HashMap<String, List<String>>();
    MessageService messageService = new MessageService();
    MessageType msgOk = MessageType.MSG_OK;
    Message msgResponse;
    @Autowired
    UserRepository userRepository;

    ModelMapper modelMapper = new ModelMapper();

    @Override
    public UserResponse saveUser(UserRequest userRequest) {
        if(userRequest.getUsername() == null){
            throw new RuntimeException("Parameter username is not found in request..!!");
        } else if(userRequest.getPassword() == null){
            throw new RuntimeException("Parameter password is not found in request..!!");
        }


//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        UserDetails userDetail = (UserDetails) authentication.getPrincipal();
//        String usernameFromAccessToken = userDetail.getUsername();
//
//        UserInfo currentUser = userRepository.findByUsername(usernameFromAccessToken);

        UserInfo savedUser = null;

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = userRequest.getPassword();
        String encodedPassword = encoder.encode(rawPassword);

        UserInfo user = modelMapper.map(userRequest, UserInfo.class);
        user.setPassword(encodedPassword);
        if(userRequest.getId() != null){
            UserInfo oldUser = userRepository.findFirstById(userRequest.getId());
            if(oldUser != null){
                oldUser.setId(user.getId());
                oldUser.setPassword(user.getPassword());
                oldUser.setUsername(user.getUsername());
                oldUser.setFullname(user.getFullname());
                oldUser.setRoles(user.getRoles());
                oldUser.setIsEnabled(user.getIsEnabled());

                savedUser = userRepository.save(oldUser);
                userRepository.refresh(savedUser);
            } else {
                throw new RuntimeException("Can't find record with identifier: " + userRequest.getId());
            }
        } else {
//            user.setCreatedBy(currentUser);
            savedUser = userRepository.save(user);
        }
        userRepository.refresh(savedUser);
        UserResponse userResponse = modelMapper.map(savedUser, UserResponse.class);
        return userResponse;
    }

    @Override
    public UserResponse updateUserInfo(UserRequest userRequest) {
        userRepository.updateUserInfo(userRequest);

        return null;
    }

    @Override
    public UserResponse getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetail = (UserDetails) authentication.getPrincipal();
        String usernameFromAccessToken = userDetail.getUsername();
        UserInfo user = userRepository.findByUsername(usernameFromAccessToken);
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        return userResponse;
    }

    @Override
    public UserResponse findByEmail(String email) {
        return modelMapper.map(userRepository.findByEmail(email), UserResponse.class);
    }

    @Override
    public List<UserResponse> getAllUser() {
        List<UserInfo> users = (List<UserInfo>) userRepository.findAll();
        Type setOfDTOsType = new TypeToken<List<UserResponse>>(){}.getType();
        List<UserResponse> userResponses = modelMapper.map(users, setOfDTOsType);
        return userResponses;
    }


    public HashMap<String, List<String>> addListObj(String key, List<String> objects) {
        Map<String, List<String>> list = new HashMap<String, List<String>>();
        list.put(key, Collections.singletonList((objects).toString()));
        return (HashMap<String, List<String>>) list;
    }

    public HashMap<String, List<String>> addSingleObj(String key, String value) {
        Map<String, List<String>> list = new HashMap<String, List<String>>();
        list.put(key, Collections.singletonList(value));
        return (HashMap<String, List<String>>) list;
    }

    @Override
    public Message passwordRecoveryValidation(String key, List<String> objects) {
        return messageService.createMessageBuilder(MessageType.MSG_BAD_REQUEST, "O email está mal formatado ou não foi informado!", this.addListObj(key, objects)).build();
    }

    @Override
    public Message messageList(String key, List<String> objects, MessageType msgType, String details) {
        return messageService.createMessageBuilder(msgType, details, this.addListObj(key, objects)).build();
    }


    @Override
    public Message login(String username, String password) {


        UserInfo user = userRepository.findByUsername(username);

        if ((Optional.ofNullable(user)).isEmpty()) {
            return messageService.createMessageBuilder(MessageType.MSG_UNAUTHORIZED, "Acesso Negado!", messageService.addSingleObj("erros", "Não foi possível acessar com os dados informados!")).build();
        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        if(authentication.isAuthenticated()){

            String token = refreshTokenService.getTokenByUserId(user.getId());
            String accessToken = null;
            try {
                accessToken = aes.encryptFromString(jwtService.GenerateToken(username), encryptSecretKey);
            } catch (Exception e) {
                throw new NegocioException(ProblemType.ERRO_NEGOCIO, "Erro ao gerar o token de acesso", e);
            }

            if(token.isEmpty()) {
                RefreshToken refreshToken =  refreshTokenService.createRefreshToken(username);
                token = refreshToken.getToken();
            }

            JwtResponseDTO jwtResponseDTO = JwtResponseDTO.builder()
                    .accessToken(accessToken)
                    .token(token).build();


            Map<String, String> list = new HashMap<String, String>();

            list.put("token", jwtResponseDTO.getToken());
            list.put("accessToken", jwtResponseDTO.getAccessToken());

            return  messageService.createMessageObjBuilder( MessageType.MSG_OK, "Acesso realizado com sucesso!", list ).build();
        } else {
            return messageService.createMessageBuilder(MessageType.MSG_UNAUTHORIZED, "Acesso Negado!", messageService.addSingleObj("erros", "Não foi possível acessar com os dados informados!")).build();
        }

    }

    @Override
    public Message passwordRecovery(String email) {
        UserInfo user = userRepository.findByEmail(email);

        if ((Optional.ofNullable(user)).isEmpty()) {
            return messageService.createMessageBuilder(MessageType.MSG_NOT_FOUND, "O email não foi encontrado!", this.addSingleObj("erros", "Não foi possível identificar o usuário com o email informado!")).build();
        }

        String linkPlain =  OffsetDateTime.now()
                .toEpochSecond() + "," +
                user.getId().toString() + "," +
                user.getFullname().replace(" ", "-") + "," +
                user.getEmail() + "," +
                OffsetDateTime.now().toEpochSecond();

        String link = null;
        try {
            link = aes.encryptFromString(linkPlain, encryptSecretKey);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        String linkParse = link.replace("/", "-W-");
        String linkEmail = "http://localhost:4202/#/home?link="+linkParse;
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        user.setLink(link);
        user.setReset(true);
        user.setResetAt(timestamp);
        userRepository.save(user);

        try {
            emailService.sendEmailFromTemplate(user.getFullname(), linkEmail, user.getEmail());
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return  messageService.createMessageBuilder( MessageType.MSG_OK, "Link de recuperação gerado com sucesso!", this.addSingleObj("link", linkParse)).build();
    }

    @Override
    public Message passwordReset(String password, String email, String link) {
        UserInfo user = userRepository.findByEmail(email);

        if ((Optional.ofNullable(user)).isEmpty()) {
            return messageService.createMessageBuilder(MessageType.MSG_NOT_FOUND, "O email não foi encontrado!", this.addSingleObj("erros", "Não foi possível identificar o usuário com o email informado!")).build();
        }

        // String linkPlain =  OffsetDateTime.now()
        //         .toEpochSecond() + "," +
        //         user.getId().toString() + "," +
        //         user.getFullname().replace(" ", "-") + "," +
        //         user.getEmail() + "," +
        //         OffsetDateTime.now().toEpochSecond();

        // String link = null;
        // try {
        //     link = aes.encryptFromString(linkPlain, encryptSecretKey);
        // } catch (Exception e) {
        //     throw new RuntimeException(e);
        // }
        // String linkParse = link.replace("/", "-W-");
        // String linkEmail = "http://localhost:4202/#/home?link="+linkParse;
        // Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        // user.setLink(link);

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = password;
        String encodedPassword = encoder.encode(rawPassword);
        user.setPassword(encodedPassword);

        user.setReset(false);
        // user.setResetAt(timestamp);
        userRepository.save(user);

        // try {
        //     emailService.sendEmailFromTemplate(user.getFullname(), linkEmail, user.getEmail());
        // } catch (MessagingException e) {
        //     throw new RuntimeException(e);
        // }
        return  messageService.createMessageBuilder( MessageType.MSG_OK, "Link de recuperação gerado com sucesso!", this.addSingleObj("ok", "")).build();
    }

    @Autowired
    public void UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void update(UserInfo userInfo) {
        assert(userInfo.getId() != null);

        userRepository.save(userInfo);
    }

}
