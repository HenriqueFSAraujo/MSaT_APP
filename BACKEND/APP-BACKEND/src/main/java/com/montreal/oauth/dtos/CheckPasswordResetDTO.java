package com.montreal.oauth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class CheckPasswordResetDTO {


    @NotBlank (message = "Email não informado")
    @NotNull (message = "Campo email não pode ser nulo")
    @Email (message = "O email informado não é válido")
    public String email;


    //Fazer validações via @

    @NotBlank (message = "Senha não informada")
    @NotNull (message = "Campo senha não pode ser nulo")    
    public String password;

    @NotBlank (message = "Senha não informada")
    @NotNull (message = "Campo link não pode ser nulo")
    public String link;

    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }

    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }

    public String getLink(){
        return link;
    }
    public void settLink(String link){
        this.link = link;
    }


}
