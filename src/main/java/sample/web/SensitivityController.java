package sample.web;

import java.util.List;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import sample.model.FileModel;
import sample.model.Sensitivity;
import sample.model.Settings;
import sample.repository.FileRepository;
import sample.repository.SensitivityRepository;
import sample.repository.SettingsRepository;

@Controller
@ComponentScan("sample.service")
public class SensitivityController {
	private static final Logger logger = LoggerFactory.getLogger(SensitivityController.class);
	@Autowired
	SettingsRepository settingsRepository;

	@Autowired
	SensitivityRepository sensitivityRepository;

	@Autowired
	private FileRepository fileRepository;

	/**
	 * Add a new sensitivity.
	 * 
	 * @return to page sensitivity page
	 */
	@RequestMapping(value = "/sensitivities", method = RequestMethod.POST)
	public String addSensitivity(@ModelAttribute Sensitivity sensitivityObj) {
		logger.debug("Add a new sensitivity!");
		Sensitivity st = new Sensitivity();
		st.setWordName(sensitivityObj.getWordName());
		st.setWordValue(sensitivityObj.getWordValue());
		sensitivityRepository.save(st);
		return "redirect:/sensitivities";
	}

	/**
	 * Delete a new sensitivity.
	 * 
	 * @return to page sensitivity page
	 */
	@SuppressWarnings("unchecked")
	@DeleteMapping(value = "/sensitivities/{id}")
	@ResponseBody
	public String deleteSensitivity(@PathVariable("id") Long id) {
		sensitivityRepository.delete(id);
		JSONObject obj = new JSONObject();
		obj.put("result", "succeeded");
		obj.put("status", "200");
		String jsonText = obj.toString();
		return jsonText;
	}

	/**
	 * Clear sensitivity.
	 * 
	 * @return to page sensitivity page
	 */
	@SuppressWarnings("unchecked")
	@PutMapping(value = "/sensitiveValue/{id}")
	@ResponseBody
	public String clearSensitivityValue(@PathVariable("id") Long id) {
		FileModel fd = fileRepository.findOne(id);
		List<FileModel> fileLists = fileRepository.findFileByName(fd.getFileName());
		for (FileModel f : fileLists) {
			f.setSensitiveValue(0f);
			fileRepository.save(f);
		}
		JSONObject obj = new JSONObject();
		obj.put("result", "succeeded");
		obj.put("status", "200");
		String jsonText = obj.toString();
		return jsonText;
	}

	/**
	 * Set Threshold Value.
	 * 
	 * @return to page sensitivity page
	 */
	@SuppressWarnings("unchecked")
	@PutMapping(value = "/threshold/{value}")
	@ResponseBody
	public String setThresholdValue(@PathVariable("value") String value) {
		Settings s = settingsRepository.findByName("threshold");
		s.setVal(value);
		settingsRepository.save(s);
		JSONObject obj = new JSONObject();
		obj.put("result", "succeeded");
		obj.put("status", "200");
		String jsonText = obj.toString();
		return jsonText;
	}

	/**
	 * Get the edit sensitivity form.
	 * 
	 * @return to page editSensitivityForm
	 */
	@RequestMapping(value = "/sensitivityform", method = RequestMethod.GET)
	public String sensitivityForm(@RequestParam(value = "sensitivityId", required = true) Long sensitivityId,
			Model model, Sensitivity sensitivityObj) {
		logger.debug("Loading sensitivityForm...");
		if (sensitivityId != -1) {
			Sensitivity sensitivity = sensitivityRepository.findOne(sensitivityId);
			model.addAttribute("sensitivityObj", sensitivity);
		} else {
			model.addAttribute("sensitivityObj", new Sensitivity());
		}
		return "fragments/sensitivityConfigurationForm :: sensitivityForm";
	}

	/**
	 * Edit Sensitivity.
	 *
	 * @return return to page user_configuration
	 */
	@RequestMapping(value = "/sensitivities/{sensitivityId}", method = RequestMethod.POST)
	public String editSensitivity(@ModelAttribute Sensitivity sensitivityObj,
			@PathVariable("sensitivityId") Long sensitivityId) {
		logger.debug("Edit a new sensitivity!");
		if (sensitivityObj.getWordName() != null) {
			Sensitivity sensitivity = sensitivityRepository.findOne(sensitivityId);
			sensitivity.setWordName(sensitivityObj.getWordName());
			sensitivity.setWordValue(sensitivityObj.getWordValue());
			sensitivityRepository.save(sensitivity);
		}
		return "redirect:/sensitivities";
	}

}
