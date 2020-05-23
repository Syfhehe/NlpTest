package sample.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.xml.bind.DatatypeConverter;


public class EncodeUtil {

  public static String passwordEncode(String password, String hashParameter) {
    String encodedPassword = null;
    try {
      MessageDigest md = MessageDigest.getInstance("MD5");
      md.update(mergePasswordAndSalt(password, hashParameter, true).getBytes());
      byte[] digest = md.digest();
      encodedPassword = DatatypeConverter.printHexBinary(digest).toLowerCase();
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    }
    return encodedPassword;

  }


  protected static String mergePasswordAndSalt(String password, Object salt, boolean strict) {
    if (password == null) {
      password = "";
    }

    if ((strict) && (salt != null) && (
        (salt.toString().lastIndexOf("{") != -1) || (salt.toString().lastIndexOf("}") != -1))) {
      throw new IllegalArgumentException("Cannot use { or } in salt.toString()");
    }

    if ((salt == null) || ("".equals(salt))) {
      return password;
    }
    return password + "{" + salt.toString() + "}";
  }

}
