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
      fileViewObject.setResultString(floatString + "，文件内容如下");
      fileViewObject.setFlag(true);
    }
    fileViewObject.setTotalSensitiveValue(total);

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
