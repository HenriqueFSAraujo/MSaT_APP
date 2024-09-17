package com.montreal.core.responses.email;


import lombok.*;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CheckEmailResponse {

    private String email;

    private Integer status;
    private String type;
    private String title;
    private String detail;
    private String userMessage;
    private OffsetDateTime timestamp;

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }

    public void setMessageDefault(Integer status, String type, String detail, String title, String message){
        this.status = status;
        this.title = title;
        this.type = type;
        this.detail = detail;
        this.userMessage = message;
        this.timestamp = OffsetDateTime.now();
    }

}
