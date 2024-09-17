package com.montreal.oauth.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Data
@ToString
@AllArgsConstructor
@Table( name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    //@NotBlank
    @JsonIgnore
    @Size(max = 120)
    private String password;

    //@NotBlank
    @Size(max = 120)
    private String fullname;

    @Size(max = 1000)
    private String link = "";

    private boolean isReset = false;

    private Timestamp resetAt;

    private boolean isEnabled = true;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<UserRole> roles = new HashSet<>();

    public UserInfo() {
    }

    public UserInfo(String username, String email, String password, String fullname, boolean isEnabled, String link, Timestamp resetAt, boolean isReset) {
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.isEnabled = isEnabled;
        this.link = link;
        this.resetAt = resetAt;
        this.isReset = isReset;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }

    public String getUsername() {
        return username;
    }

    public Timestamp getResetAt(){
        return  resetAt;
    }

    public  String getLink(){
        return link;
    }

    public void setLink(String link){
        this.link = link;
    }

    public boolean getIsReset() {
        return this.isReset;
    }

    public boolean getIsEnabled() {
        return this.isEnabled;
    }

    public void setIsEnabled(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<UserRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<UserRole> roles) {
        this.roles = roles;
    }

}
