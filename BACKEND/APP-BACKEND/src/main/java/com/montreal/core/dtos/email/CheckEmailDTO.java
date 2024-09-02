package com.montreal.core.dtos.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class CheckEmailDTO {

    //Fazer validações via @
    @NotBlank (message = "Email não informado")
    @NotNull (message = "Campo email não pode ser nulo")
    @Email (message = "O email informado não é válido")
    public String email;

    public String getEmail(){
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}
