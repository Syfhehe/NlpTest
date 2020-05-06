package sample.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import sample.model.FileModel;
import sample.model.Sensitivity;
import sample.repository.FileRepository;
import sample.repository.SensitivityRepository;
import sample.service.FileService;
import java.io.UnsupportedEncodingException;
import java.util.List;

@Controller
@ComponentScan("sample.service")
public class FileAccessController {

	@Autowired
	private SensitivityRepository sensitivityRepository;

	@Autowired
	private FileRepository fileRepository;

	@Autowired
	private FileService fileService;

	@RequestMapping(value = "/file", method = RequestMethod.GET)
	public String visitFile(@RequestParam(value = "fileId", required = true) Long fileId, Model model) throws UnsupportedEncodingException {
		FileModel fd = fileRepository.findOne(fileId);
		fd.setContentString(new String(fd.getContent(), "UTF-8"));
		// Grand total
		Float total = fd.getSensitiveValue();
		List<Sensitivity> stList = sensitivityRepository.findAll();
		Float current = fileService.getSensiviteValue(fd, stList);
		total = total + current;
		fd.setCurrent(current);
		if (total > 1) {
			fd.setResult(total + "，累计敏感值超过设定，无法打开该文件");
			fd.setFlag(false);
		} else {
			fd.setResult(total + "，文件内容如下");
			fd.setFlag(true);
		}
		fd.setSensitiveValue(total);
		fileRepository.save(fd);
		model.addAttribute("fileModel", fd);
		return "fragments/fileDetailForm :: fileDetailForm";
	}

}
