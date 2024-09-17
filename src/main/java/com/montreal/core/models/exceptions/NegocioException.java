package com.montreal.core.models.exceptions;

import com.montreal.core.controllers.exceptionhandler.ProblemType;

public class NegocioException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private ProblemType problemType;

    public NegocioException(ProblemType problemType, String message) {
        super(message);
        this.problemType = problemType;
    }

    public NegocioException(ProblemType problemType, String message, Throwable cause) {
        super(message, cause);
        this.problemType = problemType;
    }

    public ProblemType getProblemType() {
        return problemType;
    }
}
