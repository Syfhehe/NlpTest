package sample.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import sample.model.FileAccessHistory;
import sample.model.FileModel;
import sample.model.Sensitivity;
import sample.model.User;
import sample.repository.FileRepository;
import sample.repository.HistoryRepository;
import sample.repository.SensitivityRepository;
import sample.repository.SettingsRepository;
import sample.repository.UserRepository;
import sample.service.FileService;
import sample.service.UserService;
import sample.viewobject.FileViewObject;

import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Controller
@ComponentScan("sample.service")
public class FileAccessController {

  @Autowired
  private SensitivityRepository sensitivityRepository;

  @Autowired
  SettingsRepository settingsRepository;

  @Autowired
  UserService userService;

  @Autowired
  UserRepository userRepository;

  @Autowired
  private FileRepository fileRepository;

  @Autowired
  private FileService fileService;

  @Autowired
  private HistoryRepository historyRepository;


  @RequestMapping(value = "/file", method = RequestMethod.GET)
  public String visitFile(@RequestParam(value = "fileId", required = true) Long fileId, Model model)
      throws UnsupportedEncodingException {
    User user = userRepository.findByUserName(userService.getCurrentUsername());
    Float total = 0f;
    FileModel fd = fileRepository.findOne(fileId);
    fd.setContentString(new String(fd.getContent(), "UTF-8"));
    Calendar calendar = Calendar.getInstance();
    calendar.set(Calendar.HOUR_OF_DAY, calendar.get(Calendar.HOUR_OF_DAY) - 1);
    List<FileAccessHistory> historiesInLastHour = historyRepository
        .findAllByAccessDateBetween(user.getId(), fd.getId(), calendar.getTime(), new Date());

    // Grand total
    List<FileAccessHistory> histories =
        historyRepository.findFileAccessHistory(user.getId(), fd.getId());

    for (FileAccessHistory h : histories) {
      total += h.getSensitiveValue();
    }
    List<Sensitivity> stList = sensitivityRepository.findAll();
    Float current = fileService.getSensiviteValue(fd, stList);
    total = total + current;

    DecimalFormat df = new DecimalFormat("#########.#");
    String floatString = df.format(total);
    FileViewObject fileViewObject = new FileViewObject();
    fileViewObject.setId(fd.getId());
    fileViewObject.setFileName(fd.getFileName());
    fileViewObject.setWordCount(fd.getWordCount());
    fileViewObject.setCurrentSensitiveValue(current);
    if (total > Integer.parseInt(settingsRepository.findByName("threshold").getVal())) {
      fileViewObject.setResultString(floatString + "，累计敏感值超过设定，无法打开该文件");
      fileViewObject.setFlag(false);
    } else {
      if (Integer.parseInt(
          settingsRepository.findByName("visitTimes").getVal()) > historiesInLastHour.size()) {
        fileViewObject.setResultString("最近一小时访问了" + (historiesInLastHour.size() + 1) + "次，文件内容如下");
        fileViewObject.setFlag(true);
      } else {
        fileViewObject.setResultString("访问过于频繁，最近一小时访问次数超过"
            + settingsRepository.findByName("visitTimes").getVal() + "次，无法继续访问");
        fileViewObject.setFlag(false);
      }

    }
    fileViewObject.setTotalSensitiveValue(total);
    fileViewObject.setContentString(fd.getContentString());

    FileAccessHistory fileAccessHistory = new FileAccessHistory();
    fileAccessHistory.setAccessDate(new Date());
    fileAccessHistory.setFileModel(fd);
    fileAccessHistory.setFlag(fileViewObject.getFlag());
    fileAccessHistory.setResult(fileViewObject.getResultString());
    fileAccessHistory.setSensitiveValue(current);
    fileAccessHistory.setUser(user);
    historyRepository.save(fileAccessHistory);
    model.addAttribute("fileModel", fileViewObject);
    return "fragments/fileDetailForm :: fileDetailForm";
  }

}
