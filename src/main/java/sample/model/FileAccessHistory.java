package sample.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "file_access_history")
public class FileAccessHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "sensitive_value")
  private Float sensitiveValue;

  @Column(name = "result")
  private String result;

  @Column(name = "flag")
  private Boolean flag;

  @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
  @JoinColumn(name = "file_model_id")
  private FileModel fileModel;


  @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
  @JoinColumn(name = "user_id")
  private User user;
  
  @Column(name = "access_date")
  private Date accessDate;


  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Float getSensitiveValue() {
    return sensitiveValue;
  }

  public void setSensitiveValue(Float sensitiveValue) {
    this.sensitiveValue = sensitiveValue;
  }

  public String getResult() {
    return result;
  }


  public void setResult(String result) {
    this.result = result;
  }


  public Boolean getFlag() {
    return flag;
  }


  public void setFlag(Boolean flag) {
    this.flag = flag;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public FileModel getFileModel() {
    return fileModel;
  }

  public void setFileModel(FileModel fileModel) {
    this.fileModel = fileModel;
  }

  public Date getAccessDate() {
    return accessDate;
  }

  public void setAccessDate(Date accessDate) {
    this.accessDate = accessDate;
  }

}
