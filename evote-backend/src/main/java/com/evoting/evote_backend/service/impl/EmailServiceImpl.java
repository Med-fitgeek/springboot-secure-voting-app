package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.dto.VoterTokenResponseDTO;
import com.evoting.evote_backend.entity.VoterToken;
import com.evoting.evote_backend.exception.BusinessException;
import com.evoting.evote_backend.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Async
    @Override
    public void sendVotingLinks(List<VoterTokenResponseDTO> tokensDto) {

        for (VoterTokenResponseDTO token : tokensDto) {

            String link = "http://localhost:3000/vote/" + token.token();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(token.voterEmail());
            message.setSubject("Your voting link");
            message.setText(
                    "Hello " + token.voterEmail() +
                            "\n\nVote here:\n" + link
            );

            try {
                mailSender.send(message);
            } catch (Exception e) {

            }
        }
    }
}
