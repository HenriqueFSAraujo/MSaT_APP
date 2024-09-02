package com.montreal.core.services.validation;

import jakarta.validation.*;

public  class ValidationService {

    public static Validator validator;

    public ValidationService() {
    }

    public Validator validationService() {
        validator = (Validation.buildDefaultValidatorFactory()).getValidator();
        return validator;
    }

    public Validator getValidator(){
        return (Validation.buildDefaultValidatorFactory()).getValidator();
    }
}
