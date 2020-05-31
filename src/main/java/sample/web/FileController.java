package sample.web;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import sample.model.FileModel;
import sample.model.UploadFileResponse;
import sample.repository.FileRepository;
import sample.repository.UserRepository;
import sample.service.FileService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class FileController {

  private static final Logger logger = LoggerFactory.getLogger(FileController.class);

  @Autowired
  UserRepository userRepository;

  @Autowired
  FileRepository fileRepository;

  @Autowired
  private FileService fileService;

  @PostMapping("/uploadFile")
  public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
    String fileName = fileService.storeFile(file);

    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
        .path("/downloadFile/").path(fileName).toUriString();

    return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
  }

  @PostMapping("/uploadMultipleFiles")
  public List<UploadFileResponse> uploadMultipleFiles(
      @RequestParam("files") MultipartFile[] files) {
    return Arrays.stream(files).map(this::uploadFile).collect(Collectors.toList());
  }

  @GetMapping("/downloadFile/{fileName:.+}")
  public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
      HttpServletRequest request) {
    // Load file as Resource
    Resource resource = fileService.loadFileAsResource(fileName);

    // Try to determine file's content type
    String contentType = null;
    try {
      contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
    } catch (IOException ex) {
      logger.info("Could not determine file type.");
    }

    // Fallback to the default content type if type could not be determined
    if (contentType == null) {
      contentType = "application/octet-stream";
    }

    return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }

  @SuppressWarnings("unchecked")
  @DeleteMapping(value = "/file/{id}")
  @ResponseBody
  public String fileDelete(@PathVariable("id") Long id) {
    fileRepository.delete(id);
    JSONObject obj = new JSONObject();
    obj.put("result", "succeeded");
    obj.put("status", "200");
    String jsonText = obj.toString();
    return jsonText;
  }

  @SuppressWarnings("unchecked")
  @RequestMapping(value = "/file/{fileName}")
  @ResponseBody
  public String home(@PathVariable("fileName") String fileName) {
    List<FileModel> fileModes = fileRepository.findFileByNameLike(fileName);
    String a = "Begin";
    for (FileModel f : fileModes) {
      a += ",";
      a += f.getFileName();
    }
    JSONObject obj = new JSONObject();
    obj.put("result", a);
    obj.put("status", "200");
    String jsonText = obj.toString();
    return jsonText;
  }

}
