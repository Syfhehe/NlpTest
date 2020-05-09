package sample.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "file_model")
public class FileModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "word_count")
	private int wordCount;

	@Column(name = "sensitive_value")
	private Float sensitiveValue;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = " content", columnDefinition = "longblob", nullable = true)
	private byte[] content;

	@Column(name = "result")
	private String result;

	@Column(name = "flag")
	private Boolean flag;

	private Float current;

	private String contentString;

	@ManyToMany(mappedBy = "fileModels")
	private List<User> users = new ArrayList<User>();

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

	public Float getSensitiveValue() {
		return sensitiveValue;
	}

	public void setSensitiveValue(Float sensitiveValue) {
		this.sensitiveValue = sensitiveValue;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public byte[] getContent() {
		return content;
	}

	public void setContent(byte[] content) {
		this.content = content;
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

	public String getContentString() {
		return contentString;
	}

	public void setContentString(String contentString) {
		this.contentString = contentString;
	}

	public Float getCurrent() {
		return current;
	}

	public void setCurrent(Float current) {
		this.current = current;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

}
