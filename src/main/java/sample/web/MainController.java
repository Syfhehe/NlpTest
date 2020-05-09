package sample.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import sample.model.FileModel;
import sample.model.Sensitivity;
import sample.model.User;
import sample.repository.FileRepository;
import sample.repository.SensitivityRepository;
import sample.repository.SettingsRepository;
import sample.repository.UserRepository;
import sample.service.UserService;

@Controller
@ComponentScan("sample.service")
public class MainController {
  @Autowired
  FileRepository fileRepository;

  @Autowired
  UserService userService;

  @Autowired
  UserRepository userRepository;
  
  @Autowired
  SettingsRepository settingsRepository;  
  
  @Autowired
  SensitivityRepository sensitivityRepository;

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public String home(Map<String, Object> model) {
    String userName = userService.getCurrentUsername();
    User user = userRepository.findByUserName(userName);
    List<FileModel> fileModes = fileRepository.findAll();
    model.put("fileModes", fileModes);
    FileModel fd = new FileModel();
    model.put("fileModel", fd);
    model.put("role", user.getRole().toString());
    return "home";
  }

  @RequestMapping("/foo")
  public String foo() {
    throw new RuntimeException("Expected exception in controller");
  }

  @RequestMapping(value = "/sensitivities", method = RequestMethod.GET)
  public String getSensitivities(Map<String, Object> model) {
    List<Sensitivity> sensitivities = sensitivityRepository.findAll();
    String userName = userService.getCurrentUsername();
    User user = userRepository.findByUserName(userName);
    model.put("sensitivities", sensitivities);
    model.put("sensitivityObj", new Sensitivity());
    model.put("role", user.getRole().toString());
    model.put("threshold", settingsRepository.findByName("threshold").getVal());
    return "sensitivity";
  }

  @RequestMapping("/uploadPage")
  public String uploadPage() {
    return "uploadPage";
  }

}
