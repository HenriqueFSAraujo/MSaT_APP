package com.montreal.core.services.messages;

import com.montreal.oauth.dtos.PassRecoveryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.montreal.core.models.messages.Message;
import com.montreal.core.models.messages.MessageType;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {


    public Message.MessageBuilder createMessageObjBuilder(MessageType messageType, String detail, Map<String, String> list) {
        HashMap<String, String> object = (HashMap<String, String>) list;


        return Message.builder()
                .timestamp(OffsetDateTime.now())
                .status(messageType.getStatus())
                .title(messageType.getTitle())
                .type(messageType.getType())
                .object(object)
                .detail(detail);
    }

     public Message.MessageBuilder createMessageBuilder(MessageType messageType, String detail, Map<String, List<String>> list) {
        HashMap<String, List<String>> objects = (HashMap<String, List<String>>) list;


        return Message.builder()
                .timestamp(OffsetDateTime.now())
                .status(messageType.getStatus())
                .title(messageType.getTitle())
                .type(messageType.getType())
                .objects(objects)
                .detail(detail);
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

    public Message messageList(String key, List<String> objects, MessageType msgType, String details) {
        return this.createMessageBuilder(msgType, details, this.addListObj(key, objects)).build();
    }



}
