package sample.viewobject;

import java.util.Date;

public class HistoryViewObject {
  private Long userId;

  private String fileName;
  
  private Long fileId;

  private String userName;
  
  private Date lastAcessDate;

  private Float totalSensitiveValue;
  
  private int visitTimes;
   
  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public Long getFileId() {
    return fileId;
  }

  public void setFileId(Long fileId) {
    this.fileId = fileId;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public Date getLastAcessDate() {
    return lastAcessDate;
  }

  public void setLastAcessDate(Date lastAcessDate) {
    this.lastAcessDate = lastAcessDate;
  }

  public Float getTotalSensitiveValue() {
    return totalSensitiveValue;
  }

  public void setTotalSensitiveValue(Float totalSensitiveValue) {
    this.totalSensitiveValue = totalSensitiveValue;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public int getVisitTimes() {
    return visitTimes;
  }

  public void setVisitTimes(int visitTimes) {
    this.visitTimes = visitTimes;
  }

  
}
