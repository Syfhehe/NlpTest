package sample.web;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import sample.model.FileAccessHistory;
import sample.model.FileModel;
import sample.model.Sensitivity;
import sample.model.User;
import sample.repository.FileRepository;
import sample.repository.HistoryRepository;
import sample.repository.SensitivityRepository;
import sample.repository.SettingsRepository;
import sample.repository.UserRepository;
import sample.service.UserService;
import sample.viewobject.FileViewObject;
import sample.viewobject.HistoryViewObject;

@Controller
@ComponentScan("sample.service")
public class MainController {

  @Autowired
  private HistoryRepository historyRepository;

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
    FileViewObject fd = new FileViewObject();
    model.put("fileModel", fd);
    model.put("role", user.getRole().toString());
    model.put("userName", user.getUserName() + ", 欢迎您!");
    return "home";
  }

  @RequestMapping(value = "/history", method = RequestMethod.GET)
  public String history(Map<String, Object> model) {
    List<HistoryViewObject> historyViewObjects = new ArrayList<HistoryViewObject>();
    String userName = userService.getCurrentUsername();
    List<User> users = userRepository.findAll();
    User currnetUser = userRepository.findByUserName(userName);

    List<FileModel> fileModes = fileRepository.findAll();
    Calendar calendar = Calendar.getInstance();
    calendar.set(Calendar.HOUR_OF_DAY, calendar.get(Calendar.HOUR_OF_DAY) - 1);

    for (FileModel file : fileModes) {
      for (User user : users) {
        List<FileAccessHistory> histories =
            historyRepository.findFileAccessHistory(user.getId(), file.getId());
        Float totalSensitiveValue = 0f;
        for (FileAccessHistory h : histories) {
          totalSensitiveValue += h.getSensitiveValue();
        }
        HistoryViewObject hisObj = new HistoryViewObject();
        hisObj.setFileId(file.getId());
        hisObj.setFileName(file.getFileName());
        hisObj.setUserId(user.getId());
        Date lastAcessDate = historyRepository.findLastestDateById(user.getId(), file.getId());
        hisObj.setLastAcessDate(lastAcessDate);
        hisObj.setTotalSensitiveValue(totalSensitiveValue);
        hisObj.setUserName(user.getUserName());
        List<FileAccessHistory> historiesInLastHour = historyRepository
            .findAllByAccessDateBetween(user.getId(), file.getId(), calendar.getTime(), new Date());
        hisObj.setVisitTimes(historiesInLastHour.size());
        historyViewObjects.add(hisObj);
      }
    }
    model.put("historyViewObjects", historyViewObjects);
    FileViewObject fd = new FileViewObject();
    model.put("fileModel", fd);
    model.put("role", currnetUser.getRole().toString());
    model.put("userName", currnetUser.getUserName() + ", 欢迎您!");
    return "history";

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
    model.put("visitTimes", settingsRepository.findByName("visitTimes").getVal());
    model.put("userName", user.getUserName() + ", 欢迎您!");
    return "sensitivity";
  }


}
