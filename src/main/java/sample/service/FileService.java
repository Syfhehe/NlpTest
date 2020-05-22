package sample.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import exception.FileException;
import sample.model.FileModel;
import sample.model.FileProperties;
import sample.model.Sensitivity;
import sample.model.User;
import sample.repository.FileRepository;
import sample.repository.UserRepository;
import sample.util.FileUtil;
import sample.util.SensitiveUtil;
import sample.util.SensitiveUtil.MatchType;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

@Service
public class FileService {

  @Autowired
  FileRepository fileRepository;

  @Autowired
  UserRepository userRepository;

  private Path fileStorageLocation;

  @Autowired
  public FileService(FileProperties fileProperties) {
    this.fileStorageLocation =
        Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize();
    try {
      Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
      throw new FileException(
          "Could not create the directory where the uploaded files will be stored.", ex);
    }
  }

  public String storeFile(MultipartFile file) {
    // Normalize file name
    String fileName = StringUtils.cleanPath(file.getOriginalFilename());

    try {
      // Check if the file's name contains invalid characters
      if (fileName.contains("..")) {
        throw new FileException("Sorry! Filename contains invalid path sequence " + fileName);
      }

      // Copy file to the target location (Replacing existing file with the same name)
      Path targetLocation = this.fileStorageLocation.resolve(fileName);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      FileModel fm = new FileModel();
      fm.setFileName(fileName);
      fm.setWordCount(FileUtil.count(targetLocation.toFile()));
      fm.setContent(file.getBytes());
      fileRepository.saveAndFlush(fm);


      return fileName;
    } catch (IOException ex) {
      throw new FileException("Could not store file " + fileName + ". Please try again!", ex);
    }
  }

  public Resource loadFileAsResource(String fileName) {
    try {
      Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());
      if (resource.exists()) {
        return resource;
      } else {
        throw new FileException("File not found " + fileName);
      }
    } catch (MalformedURLException ex) {
      throw new FileException("File not found " + fileName, ex);
    }
  }

  public Float getSensiviteValue(FileModel fd, List<Sensitivity> stList) {
    SensitiveUtil textFilter = new SensitiveUtil();
    Set<String> sensitiveStrings = new HashSet<String>();
    for (Sensitivity s : stList) {
      sensitiveStrings.add(s.getWordName());
    }
    Map<String, Float> nameValueMap = new HashMap<String, Float>();
    for (Sensitivity s : stList) {
      nameValueMap.put(s.getWordName(), s.getWordValue());
    }
    textFilter.initSensitiveWordsMap(sensitiveStrings);
    String fileContent = fd.getContentString();
    Map<String, Integer> resultMap = textFilter.getSensitiveWords(fileContent, MatchType.MAX_MATCH);
    Float total = 0f;
    for (Entry<String, Integer> entry : resultMap.entrySet()) {
      System.out.println(entry.getKey() + " : " + entry.getValue());
      total += entry.getValue() * nameValueMap.get(entry.getKey());
    }
    return total;
  }

}
