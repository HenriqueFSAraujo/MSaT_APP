package com.montreal.core.models.messages;

import lombok.Getter;

@Getter
public enum MessageType {
  MSG_OK(200, "Requisição executada com sucesso", "OK"),
  MSG_CREATED(201, "Criado com sucesso", "CREATED"),
  MSG_NOT_FOUND(404, "Recurso não existe", "NOT_FOUND"),
  MSG_BAD_REQUEST(400, "Parâmetro inválido", "BAD_REQUEST"),
  MSG_FORBIDDEN(403, "Recurso não encontrado", "FORBIDDEN"),
  MSG_UNAUTHORIZED(401, "Acesso negado", "UNAUTHORIZED");


  private String title;
  private String type;
  private Integer status;
  MessageType(Integer status, String title, String type) {
    this.status = status;
    this.title = title;
    this.type = type;
  }
}
