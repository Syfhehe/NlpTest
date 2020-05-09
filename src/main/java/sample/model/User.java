package sample.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "user")
public class User implements Serializable {

	private static final long serialVersionUID = 8831737280677584496L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "user_name", unique = true, nullable = false)
	private String userName;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "role", nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;

	@Column(name = "active", nullable = false)
	private boolean active;

	@ManyToMany
	@JoinTable(name = "u_f", joinColumns = {@JoinColumn(name = "user_id")}, inverseJoinColumns = {@JoinColumn(name = "file_model_id")})
	private List<FileModel> fileModels = new ArrayList<FileModel>();

	protected User() {
	}

	/**
	 * Constructor.
	 * 
	 * @param userName String
	 * @param password String
	 * @param role     Role
	 * @param active   Boolean
	 */
	public User(String userName, String password, Role role, boolean active) {
		super();
		this.userName = userName;
		this.password = password;
		this.role = role;
		this.active = active;
	}

	@Override
	public String toString() {
		return String.format("User[id=%d, name='%s', password='%s', role='%s', active='%b']", id, userName, password,
				role, active);
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<FileModel> getFileModels() {
		return fileModels;
	}

	public void setFileModels(List<FileModel> fileModels) {
		this.fileModels = fileModels;
	}

}
