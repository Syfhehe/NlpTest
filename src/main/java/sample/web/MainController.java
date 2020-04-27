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
import sample.repository.FileRepository;
import sample.repository.SensitivityRepository;

@Controller
@ComponentScan("sample.service")
public class MainController {
	@Autowired
	FileRepository fileRepository;

	@Autowired
	SensitivityRepository sensitivityRepository;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Map<String, Object> model) {
		List<FileModel> fileModes = fileRepository.findAll();
		model.put("fileModes", fileModes);
		return "home";
	}

	@RequestMapping("/foo")
	public String foo() {
		throw new RuntimeException("Expected exception in controller");
	}

	@RequestMapping(value = "/sensitivities", method = RequestMethod.GET)
	public String getSensitivities(Map<String, Object> model) {
		List<Sensitivity> sensitivities = sensitivityRepository.findAll();
		model.put("sensitivities", sensitivities);
		model.put("sensitivityObj", new Sensitivity());
		return "sensitivity";
	}

	@RequestMapping("/uploadPage")
	public String uploadPage() {
		return "uploadPage";
	}

}
