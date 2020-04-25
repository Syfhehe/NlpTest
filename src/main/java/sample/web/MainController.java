package sample.web;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import sample.model.FileModel;
import sample.service.FileService;
import sample.util.FileUtil;

@Controller
@ComponentScan("sample.service")
public class MainController {
	
	@Autowired
	private FileService fileService; 
	
	private static final String uploadFolder = "uploads";

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Map<String, Object> model) {
		List<File> files = FileUtil.searchFile(new File(uploadFolder), ".txt");
		List<FileModel> fileModes = fileService.generateFileModels(files);
		model.put("fileModes", fileModes);
		return "home";
	}

	@RequestMapping("/foo")
	public String foo() {
		throw new RuntimeException("Expected exception in controller");
	}

	@RequestMapping(value = "/privateValueSetting", method = RequestMethod.GET)
	public String privateValueSetting(Map<String, Object> model) {
		model.put("message", "Hello World");
		model.put("title", "Hello Home");
		model.put("date", new Date());
		return "privateValueSetting";
	}

}
