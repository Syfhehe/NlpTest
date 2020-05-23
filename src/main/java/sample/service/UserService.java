package sample.service;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sample.model.User;
import sample.repository.UserRepository;
import sample.util.EncodeUtil;


@Service
public class UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserService.class);

  private static final String DEFAULT_PASSWORD = "123456";

  @Autowired
  private UserRepository userRepository;

  /**
   * Get current userName.
   */
  public String getCurrentUserName() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof UserDetails) {
      return ((UserDetails) principal).getUsername();
    }
    if (principal instanceof Principal) {
      return ((Principal) principal).getName();
    }
    return String.valueOf(principal);
  }

  public User getCurrentUser() {
    return userRepository.findByUserName(getCurrentUserName());
  }

  public User findUserByName(String userName) {
    return userRepository.findByUserName(userName);
  }

  /**
   * Get current userName.
   */
  public String getCurrentUsername() {
    logger.debug("Start getting current username.");
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof UserDetails) {
      return ((UserDetails) principal).getUsername();
    }
    if (principal instanceof Principal) {
      return ((Principal) principal).getName();
    }
    return String.valueOf(principal);
  }

  @Transactional
  public void resetPassword(Long id) {
    logger.debug("Start reseting a user's password.");
    try {
      User exitedUser = userRepository.getOne(id);
      String hashedPass = EncodeUtil.passwordEncode(DEFAULT_PASSWORD, exitedUser.getUserName());
      exitedUser.setPassword(hashedPass);
      userRepository.save(exitedUser);
    } catch (Exception e) {
      logger.error("reset password failed!", e);
    }
  }

  @Transactional
  public void addNewUser(User user) {
    logger.debug("Start adding a new user.");
    String hashedPass = EncodeUtil.passwordEncode(DEFAULT_PASSWORD, user.getUserName());
    user.setPassword(hashedPass);
    userRepository.save(user);
  }

  public User findUserById(Long id) {
    return userRepository.findOne(id);
  }

  @Transactional
  public void editUser(User user, Long id) {
    logger.debug("Start editting a user.");
    User exitedUser = userRepository.getOne(id);
    exitedUser.setActive(user.isActive());
    if (!exitedUser.getUserName().equals(user.getUserName())) {
      exitedUser.setUserName(user.getUserName());
      String hashedPass = EncodeUtil.passwordEncode(DEFAULT_PASSWORD, user.getUserName());
      exitedUser.setPassword(hashedPass);
    }
    exitedUser.setRole(user.getRole());
    userRepository.save(exitedUser);
  }
  
  @Transactional
  public void updatePassword(String newPassword, User currentUser) {
    logger.debug("Start reseting a user's password.");
    try {
      String encodeNewPassword = EncodeUtil.passwordEncode(newPassword, currentUser.getUserName());
      currentUser.setPassword(encodeNewPassword);
      userRepository.save(currentUser);
    } catch (Exception e) {
      logger.error("Update password failed!", e);
    }
  }
}
