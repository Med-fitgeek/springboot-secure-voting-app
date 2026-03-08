package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.entity.VoterToken;
import com.evoting.evote_backend.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVotingLinks(List<VoterToken> tokens) {

        for (VoterToken token : tokens) {

            String link = "https://app.com/vote?token=" + token.getToken();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(token.getEmail());
            message.setSubject("Your voting link");
            message.setText(
                    "Hello " + token.getName() +
                            "\n\nVote here:\n" + link
            );

            mailSender.send(message);
        }
    }
}
