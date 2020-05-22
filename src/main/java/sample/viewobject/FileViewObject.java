package sample.viewobject;

public class FileViewObject {
  private Long id;

  private String fileName;

  private int wordCount;

  private String contentString;

  private Float totalSensitiveValue;

  private Float currentSensitiveValue;
  
  private String resultString;

  private Boolean flag;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public int getWordCount() {
    return wordCount;
  }

  public void setWordCount(int wordCount) {
    this.wordCount = wordCount;
  }

  public String getContentString() {
    return contentString;
  }

  public void setContentString(String contentString) {
    this.contentString = contentString;
  }

  public Float getTotalSensitiveValue() {
    return totalSensitiveValue;
  }

  public void setTotalSensitiveValue(Float totalSensitiveValue) {
    this.totalSensitiveValue = totalSensitiveValue;
  }

  public String getResultString() {
    return resultString;
  }

  public void setResultString(String resultString) {
    this.resultString = resultString;
  }

  public Boolean getFlag() {
    return flag;
  }

  public void setFlag(Boolean flag) {
    this.flag = flag;
  }

  public Float getCurrentSensitiveValue() {
    return currentSensitiveValue;
  }

  public void setCurrentSensitiveValue(Float currentSensitiveValue) {
    this.currentSensitiveValue = currentSensitiveValue;
  }
}
