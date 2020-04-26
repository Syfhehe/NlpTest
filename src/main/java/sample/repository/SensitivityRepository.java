package sample.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sample.model.Sensitivity;
import sample.model.User;

@Repository
public interface SensitivityRepository extends JpaRepository<Sensitivity, Long> {

	User findByWordName(String wordName);

	@Query("from Sensitivity w where w.wordName=:wordName")
	User findSensitivity(@Param("wordName") String wordName);

}
