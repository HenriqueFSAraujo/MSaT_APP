package com.montreal.oauth.dtos;

import com.montreal.oauth.models.Role;
import com.montreal.oauth.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class PassRecoveryResponse {
    private  String link;

    private Integer status;
    private String type;
    private String title;
    private String detail;
    private String userMessage;
    private OffsetDateTime timestamp;


    private List<Object> objects;

    @Getter
    @Builder
    public static class Object {

        private String link;
        

    }

    public void setMessageDefault(Integer status, String type, String detail, String title, String message, List<Object> objects){
        this.status = status;
        this.title = title;
        this.type = type;
        this.detail = detail;
        this.userMessage = message;
        this.timestamp = OffsetDateTime.now();
        this.objects = objects;
    }

}
