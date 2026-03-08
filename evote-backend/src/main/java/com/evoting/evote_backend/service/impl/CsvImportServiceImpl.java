package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.dto.VoterDTO;
import com.evoting.evote_backend.entity.User;
import com.evoting.evote_backend.exception.BusinessException;
import com.evoting.evote_backend.repository.UserRepository;
import com.evoting.evote_backend.service.interfaces.CsvImportService;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CsvImportServiceImpl implements CsvImportService {

    private final UserRepository userRepository;
    @Override
    public List<VoterDTO> parseVotersCsv(MultipartFile file, String username) {

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));
        List<VoterDTO> voters = new ArrayList<>();

        try (Reader reader = new InputStreamReader(file.getInputStream())) {

            CSVReader csvReader = new CSVReader(reader);

            List<String[]> rows = csvReader.readAll();

            if (rows.size() <= 1) {
                throw new IllegalArgumentException("CSV must contain voters");
            }


            Set<String> emails = new HashSet<>();

            for (int i = 1; i < rows.size(); i++) {

                String[] row = rows.get(i);

                if(row.length < 2)
                    throw new IllegalArgumentException("Invalid CSV format");

                String name = row[0].trim();
                String email = row[1].trim();

                if (!isValidEmail(email)) {
                    throw new IllegalArgumentException("Invalid email: " + email);
                }

                if (!emails.add(email)) {
                    throw new IllegalArgumentException("Duplicate email: " + email);
                }

                voters.add(new VoterDTO(name, email));
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }

        return voters;
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}