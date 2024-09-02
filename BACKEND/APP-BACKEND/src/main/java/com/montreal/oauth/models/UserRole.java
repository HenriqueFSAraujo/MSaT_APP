package com.montreal.oauth.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ROLES")
public class UserRole {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    //@Enumerated(EnumType.STRING)
    //@Column(length = 20)
    //private ERole role;

    //public UserRole(ERole role) {
    //    this.role = role;
    //}

}
