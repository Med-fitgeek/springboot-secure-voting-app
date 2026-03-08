package com.evoting.evote_backend.service.interfaces;

import com.evoting.evote_backend.dto.VoterDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CsvImportService {
    List<VoterDTO> parseVotersCsv(MultipartFile file, String username);

}
