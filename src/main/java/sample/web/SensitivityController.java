package sample.web;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import sample.model.Sensitivity;
import sample.repository.SensitivityRepository;

@Controller
@ComponentScan("sample.service")
public class SensitivityController {
	private static final Logger logger = LoggerFactory.getLogger(SensitivityController.class);

	@Autowired
	SensitivityRepository sensitivityRepository;

	/**
	 * Add a new Team.
	 * 
	 * @return to page team_configuration
	 */
	@RequestMapping(value = "/sensitivities", method = RequestMethod.POST)
	public String addSensitivity(@ModelAttribute Sensitivity sensitivityObj) {
		logger.debug("Add a new sensitivity!");
		Sensitivity st = new Sensitivity();
		st.setWordName(sensitivityObj.getWordName());
		st.setWordValue(sensitivityObj.getWordValue());
		return "redirect:/sensitivities";
	}

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

}
