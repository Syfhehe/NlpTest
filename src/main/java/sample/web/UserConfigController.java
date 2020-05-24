package sample.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.JsonObject;

import sample.model.Role;
import sample.model.User;
import sample.repository.UserRepository;
import sample.service.UserService;
import sample.util.EncodeUtil;
import sample.viewobject.UserViewObject;


@Controller
@ComponentScan("smaple.service")
@PropertySource("classpath:messages.properties")
public class UserConfigController {

  private static final Logger logger = LoggerFactory.getLogger(MainController.class);

  @Autowired
  private UserService userService;

  @Autowired
  UserRepository userRepository;

  /**
   * Get the User management table.
   *
   * @return to page user_configuration
   */
  @RequestMapping(value = "/configuration/users", method = RequestMethod.GET)
  public String getUsersInformation(Model model) {
    logger.debug("Loading Users Managenment Table!");
    String userName = userService.getCurrentUsername();
    User user = userRepository.findByUserName(userName);
    List<User> users = userRepository.findAll();
    model.addAttribute("users", users);
    model.addAttribute("userViewObject", new UserViewObject());
    model.addAttribute("role", user.getRole().toString());
    model.addAttribute("userName", user.getUserName() + ", 欢迎您!");
    return "user_configuration";
  }


  /**
   * Add a new User.
   *
   * @return to page user_configuration
   */
  @RequestMapping(value = "/configuration/users", method = RequestMethod.POST)
  public String addUser(@ModelAttribute UserViewObject userViewObject) {
    logger.debug("Add a new User!");
    User user = new User(userViewObject.getUserName(), null, Role.USER, true);
    userService.addNewUser(user);
    return "redirect:/configuration/users";
  }
  
  /**
   * Delete a new User.
   *
   * @return to page user_configuration
   */
  @RequestMapping(value = "/configuration/users/{userId}", method = RequestMethod.DELETE)
  @ResponseBody
  public String deleteUser(@PathVariable(value = "userId", required = true) Long userId) {
    logger.debug("Add a new User!");
    JsonObject jsonObj = new JsonObject();
    userRepository.delete(userId);
    jsonObj.addProperty("status", "200");
    return jsonObj.toString();
  }
  
  /**
   * Get the edit user form.
   *
   * @return to page editUserForm
   */
  @RequestMapping(value = "/configuration/userform", method = RequestMethod.GET)
  public String userForm(@RequestParam(value = "userId", required = true) Long userId, Model model,
      UserViewObject userViewObject) {
    logger.debug("Loading userform...");
    if (userId != -1) {
      User user = userService.findUserById(userId);
      userViewObject.setUserId(userId);
      userViewObject.setRole(user.getRole());
      userViewObject.setActive(user.isActive());
      userViewObject.setUserId(user.getId());
      userViewObject.setPassword(user.getPassword());
      userViewObject.setUserName(user.getUserName());
      model.addAttribute("userViewObject", userViewObject);
      model.addAttribute("isAdminRole", true);
    } else {
      model.addAttribute("userViewObject", new UserViewObject());
    }
    List<String> roleNames = new ArrayList<String>();
    roleNames.add("USER");
    roleNames.add("ADMIN");
    roleNames.add("DEVELOPER");
    model.addAttribute("roleNames", roleNames);

    return "fragments/configurationForm :: userForm";
  }

  /**
   * Reset a User's Password.
   *
   * @param userId is User's id
   * @return status code
   */
  @RequestMapping(value = "/configuration/password", method = RequestMethod.PUT)
  @ResponseBody
  public String resetUsersPassword(@RequestParam(value = "userId", required = true) Long userId) {
    logger.debug("Reset User's password!");
    JsonObject jsonObj = new JsonObject();
    try {
      userService.resetPassword(userId);
      jsonObj.addProperty("status", "200");
    } catch (Exception e) {
      logger.error("Reset password error!", e);
    }
    return jsonObj.toString();
  }

  /**
   * Edit User.
   *
   * @return return to page user_configuration
   */
  @RequestMapping(value = "/configuration/users/{userId}", method = RequestMethod.POST)
  public String editUser(@PathVariable("userId") Long userId,
      @ModelAttribute UserViewObject userViewObject) {
    logger.debug("Edit a new User!");
    User user = new User(userViewObject.getUserName(), null, userViewObject.getRole(), userViewObject.isActive());
    if (user.getUserName() != null) {
      userService.editUser(user, userViewObject.getUserId());
    }
    return "redirect:/configuration/users";
  }

  /**
   * Update user's password.
   *
   * @return "update success" json
   */
  @RequestMapping(value = "/password", method = RequestMethod.PUT, produces = "application/json")
  public @ResponseBody String resetPassword(@RequestParam Map<String, Object> data) {
    logger.debug("Update user's password!");
    JsonObject jsonObj = new JsonObject();
    User currentUser = userService.getCurrentUser();
    String encodeOldPassword =
        EncodeUtil.passwordEncode((String) data.get("oldPassword"), currentUser.getUserName());
    if (encodeOldPassword.equals(currentUser.getPassword())) {
      userService.updatePassword((String) data.get("newPassword"), currentUser);
      jsonObj.addProperty("result", "Update Succuss!");
    } else {
      jsonObj.addProperty("result", "Update Failed! \nOld password is wrong!");
    }
    return jsonObj.toString();
  }

}
