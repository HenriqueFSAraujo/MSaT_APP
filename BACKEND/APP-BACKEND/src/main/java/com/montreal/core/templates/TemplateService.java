package com.montreal.core.templates;

import org.springframework.stereotype.Service;

@Service
public class TemplateService {

    public Template.TemplateBuilder createTemplateBuilder(TemplateType templateType){
        return Template.builder().templateType(templateType);
    }

    public String createForgotPasswordTemplate(TemplateType templateType, String name, String link){
        String template = Template.builder().templateType(templateType).toString();        
        template.replace("${NAME}", name);
        template.replace("${LINK}", link);
        return template;        
    }

    
}
