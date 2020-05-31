package sample.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sample.model.FileModel;

@Repository
public interface FileRepository extends JpaRepository<FileModel, Long> {

	FileModel findByFileName(String fileName);

	@Query("from FileModel f where f.fileName=:fileName")
	List<FileModel> findFileByName(@Param("fileName") String fileName);
	
	@Query(value = "from FileModel t where t.fileName like %?1%")
    List<FileModel> findFileByNameLike(String fileName);

}
