package sample.model;

import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
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
	
	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = " content", columnDefinition = "longblob", nullable = true)
	private byte[] content;

	@Lob
	@Column
	private String contentString;
	
    @OneToMany(mappedBy = "fileModel",cascade=CascadeType.ALL,fetch=FetchType.LAZY)
    private List<FileAccessHistory> fileAccessHistoryList;

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

    public List<FileAccessHistory> getFileAccessHistoryList() {
      return fileAccessHistoryList;
    }

    public void setFileAccessHistoryList(List<FileAccessHistory> fileAccessHistoryList) {
      this.fileAccessHistoryList = fileAccessHistoryList;
    }

    public byte[] getContent() {
      return content;
    }

    public void setContent(byte[] content) {
      this.content = content;
    }

}
