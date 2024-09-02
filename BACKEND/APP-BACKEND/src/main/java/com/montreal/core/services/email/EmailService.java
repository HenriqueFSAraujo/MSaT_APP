package com.montreal.core.services.email;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.awt.BorderLayout;
import java.awt.Button;
import java.awt.Desktop;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;

import javax.swing.JFrame;
import javax.swing.JPanel;

import javax.mail.MessagingException;

import java.util.HashMap;
import java.util.Map;

import static org.antlr.v4.runtime.misc.Utils.readFile;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

public void sendPasswordResetEmail(String to, String token) {
    String resetUrl = "http://localhost:8082/api/v1/auth/reset-password?token=" + token;

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject("Redefinição de Senha");
    message.setText("Para redefinir sua senha, clique no link abaixo:\n" + resetUrl);

    mailSender.send(message);
}


    public String getTamplate(String templateName, String name, String link){
        StringBuilder headBuilder = new StringBuilder();
        StringBuilder footerBuilder = new StringBuilder();
        StringBuilder contentBuilder = new StringBuilder();
        try {
            BufferedReader inHead = new BufferedReader(new FileReader("C:\\PROJETO\\RELEASE\\MONTREAL-GESTAO-GARANTIAS-BACKEND\\src\\main\\java\\com\\montreal\\core\\templates\\shared\\head.html"));
            BufferedReader inContent = new BufferedReader(new FileReader("C:\\PROJETO\\RELEASE\\MONTREAL-GESTAO-GARANTIAS-BACKEND\\src\\main\\java\\com\\montreal\\core\\templates\\"+templateName+".html"));
            BufferedReader inFooter = new BufferedReader(new FileReader("C:\\PROJETO\\RELEASE\\MONTREAL-GESTAO-GARANTIAS-BACKEND\\src\\main\\java\\com\\montreal\\core\\templates\\shared\\footer.html"));
            String strHead;
            String strFooter;
            String strContent;
            while ((strHead = inHead.readLine()) != null) {
                headBuilder.append(strHead);
            }
            while ((strContent = inContent.readLine()) != null) {
                contentBuilder.append(strContent);
            }
            while ((strFooter = inFooter.readLine()) != null) {
                footerBuilder.append(strFooter);
            }
            inHead.close();
            inContent.close();
            inFooter.close();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String head = headBuilder.toString();
        String footer = footerBuilder.toString();

        String content = contentBuilder.toString();
        content = content.replace("${HEAD}", head);
        content = content.replace("${FOOTER}", footer);
        content = content.replace("${NAME}", name);
        content = content.replace("${LINK}", link);
        return content;
    }

    public void sendEmailFromTemplate(String name, String link, String recipient) throws MessagingException {
        MimeMessage message = this.mailSender.createMimeMessage();
        String template = getTamplate("forgot-password", name, link);
        String subject = "Recuperação de senha";
        String from = "suporte@montreal.com.br";
        Map<String, Object> variables = new HashMap<>();
        variables.put("NAME", "WELL");
        variables.put("LINK", link);
        try {
            message.setSubject(subject);
            message.setContent(template, "text/html; charset=utf-8");
            message.setRecipients(MimeMessage.RecipientType.TO, recipient);
            message.setFrom(from);
            mailSender.send(message);
        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
